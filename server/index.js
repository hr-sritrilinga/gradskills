require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const XLSX = require("xlsx");
const { requireAuth } = require("@clerk/express");
const { createClient } = require("@supabase/supabase-js");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Razorpay = require("razorpay");
// ─── CONFIG ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Razorpay
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}
// Cloudflare R2 (Optional for now, will implement when keys provided)
let s3;
if (process.env.R2_ACCOUNT_ID) {
  s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

// Multer setup for handling file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ─── APP ───────────────────────────────────────────────────────────────────────
const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "5mb" }));

// Rate limit: 30 submissions per IP per 15 minutes
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── MIDDLEWARE: Admin auth ────────────────────────────────────────────────────
const WHITELISTED_ADMINS = [
  "kakkirenivishwas@gmail.com",
  "support@procreationstudio.com"
];

const adminAuth = (req, res, next) => {
  requireAuth()(req, res, () => {
    const userEmail = req.auth?.sessionClaims?.email || req.auth?.claims?.email;
    
    // Fallback: Check all possible email locations in Clerk auth object
    const email = userEmail || (req.auth?.user?.emailAddresses && req.auth.user.emailAddresses[0]?.emailAddress);

    if (!email || !WHITELISTED_ADMINS.includes(email.toLowerCase())) {
      console.warn(`🚫 Unauthorized access attempt from: ${email || 'Unknown'}`);
      return res.status(403).json({ error: "Access denied. You are not an authorized admin." });
    }
    next();
  });
};

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Create Razorpay Order
app.post("/api/create-razorpay-order", async (req, res) => {
  if (!razorpay) {
    return res.status(500).json({ error: "Razorpay not configured on server" });
  }
  
  try {
    const { amount = 9900 } = req.body; // Default ₹99 (in paise)

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// Helper to upload to R2
async function uploadToR2(file) {
  if (!s3 || !process.env.R2_BUCKET_NAME) return null;
  const ext = file.originalname.split('.').pop();
  const fileName = `resumes/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  
  // Assuming public access or dev domain. Need user input for actual domain.
  const publicDomain = "https://pub-202d1b88911741fe8bd8ae13bbbd6d3a.r2.dev";
  return `${publicDomain}/${fileName}`;
}

// Submit application
// Using upload.single('resume') to handle file upload if we switch to file uploads
app.post("/api/applications", submitLimiter, upload.single('resume_file'), async (req, res) => {
  try {
    const {
      full_name, email, phone, college, year_of_study, branch,
      team_name, team_size, experience_level, skills,
      github_url, linkedin_url, why_join, project_idea, resume_url
    } = req.body;

    if (!full_name || !email || !phone || !college || !year_of_study || !why_join) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    let finalResumeUrl = resume_url?.trim();

    // If file was uploaded, send to R2
    if (req.file) {
      try {
        finalResumeUrl = await uploadToR2(req.file);
      } catch (err) {
        console.error("R2 Upload Error:", err);
        return res.status(500).json({ error: "Failed to upload resume file" });
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('buildathon_registrations')
      .insert([
        {
          full_name: full_name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          college: college.trim(),
          year_of_study: year_of_study,
          branch: branch?.trim() || 'N/A',
          team_name: team_name?.trim() || null,
          team_size: team_size || null,
          experience_level: experience_level || 'N/A',
          skills: skills?.trim() || 'N/A',
          github_url: github_url?.trim() || null,
          linkedin_url: linkedin_url?.trim() || null,
          why_join: why_join.trim(),
          project_idea: project_idea?.trim() || null,
          resume_url: finalResumeUrl || null,
          status: 'pending'
        }
      ])
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres unique violation
        return res.status(409).json({ error: "An application with this email already exists" });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      id: data.id,
    });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// ─── ADMIN ROUTES ──────────────────────────────────────────────────────────────

app.get("/api/admin/applications", adminAuth, async (req, res) => {
  try {
    const {
      status, search, page = 1, limit = 50,
      sort_by = "created_at", sort_order = "DESC",
      experience_level, college
    } = req.query;

    let query = supabase.from('buildathon_registrations').select('*', { count: 'exact' });

    if (status && status !== "all") query = query.eq('status', status);
    if (experience_level) query = query.eq('experience_level', experience_level);
    if (college) query = query.ilike('college', `%${college}%`);
    
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,college.ilike.%${search}%,team_name.ilike.%${search}%`);
    }



    const safeSort = ["created_at", "full_name", "email", "college", "status", "experience_level"].includes(sort_by) ? sort_by : "created_at";
    query = query.order(safeSort, { ascending: sort_order === "ASC" });

    const safeLimit = Math.min(200, Math.max(1, parseInt(limit)));
    const offset = (Math.max(1, parseInt(page)) - 1) * safeLimit;
    
    query = query.range(offset, offset + safeLimit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    // Get stats
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_buildathon_stats'); // We will provide a fallback if RPC doesn't exist

    let stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    
    if (!statsError && statsData) {
      stats = statsData;
    } else {
      // Fallback: slow count if RPC not created
      const [pending, approved, rejected] = await Promise.all([
        supabase.from('buildathon_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('buildathon_registrations').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('buildathon_registrations').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      ]);
      stats = {
        total: (pending.count || 0) + (approved.count || 0) + (rejected.count || 0),
        pending: pending.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0
      };
    }

    res.json({
      applications: data,
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: safeLimit,
        totalPages: Math.ceil((count || 0) / safeLimit),
      },
      stats,
    });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

app.patch("/api/admin/applications/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { error } = await supabase
      .from('buildathon_registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: `Application ${status}` });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update application" });
  }
});

app.patch("/api/admin/applications-bulk", adminAuth, async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Provide an array of IDs" });
    }
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data, error } = await supabase
      .from('buildathon_registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', ids)
      .select('id');

    if (error) throw error;

    res.json({ success: true, updated: data.length });
  } catch (err) {
    console.error("Bulk update error:", err);
    res.status(500).json({ error: "Failed to bulk update" });
  }
});

app.get("/api/admin/export", adminAuth, async (req, res) => {
  try {
    const { status, experience_level, college, search } = req.query;

    let query = supabase.from('buildathon_registrations').select('*').order('created_at', { ascending: false });

    if (status && status !== "all") query = query.eq('status', status);
    if (experience_level) query = query.eq('experience_level', experience_level);
    if (college) query = query.ilike('college', `%${college}%`);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,college.ilike.%${search}%`);

    const { data: rows, error } = await query;
    if (error) throw error;

    // Map data for Excel with only the requested columns
    const excelData = rows.map((app, index) => ({
      "S.No": index + 1,
      "Name": app.full_name,
      "Email": app.email,
      "Phone Number": app.phone,
      "Qualification": app.year_of_study,
      "College": app.college
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData.length > 0 ? excelData : [{ "Info": "No applications found" }]);

    if (excelData.length > 0) {
      const colWidths = Object.keys(excelData[0]).map((key) => {
        let maxLen = key.length;
        excelData.forEach(row => {
          const val = row[key];
          if (val) maxLen = Math.max(maxLen, String(val).length);
        });
        return { wch: Math.min(maxLen + 2, 50) }; // Max width 50
      });
      ws["!cols"] = colWidths;
    }

    XLSX.utils.book_append_sheet(wb, ws, "Applications");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const filterLabel = status && status !== "all" ? `_${status}` : "_all";
    const filename = `Buildathon_Data${filterLabel}_${new Date().toISOString().split("T")[0]}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Failed to export" });
  }
});

app.delete("/api/admin/applications/:id", adminAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ─── FRONTEND SERVING ────────────────────────────────────────────────────────
// Serve static frontend files from the Vite build output folder (../dist)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for React Router (must be placed after all API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`✅ Supabase Database Connected`);
});
