import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Trophy, Users, CheckCircle,
  Loader2, ArrowRight, Briefcase, FileText,
  Lightbulb, Target, ChevronRight, Terminal, Crosshair
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DotGrid from "@/components/DotGrid/DotGrid";

const API_URL = import.meta.env.VITE_BUILDATHON_API || "http://localhost:4000";

const YEARS = [
  { value: "1st Year", label: "1st Year" },
  { value: "2nd Year", label: "2nd Year" },
  { value: "3rd Year", label: "3rd Year" },
  { value: "Final Year", label: "Final Year" },
  { value: "Graduated", label: "Graduated" }
];

export default function Buildathon() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isDark = theme === "dark";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", college: "", year_of_study: "",
    resume_url: "", why_join: ""
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let body: FormData | string;
      const headers: HeadersInit = {};

      if (resumeFile) {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("resume_file", resumeFile);
        body = formData;
        // Browser automatically sets Content-Type to multipart/form-data with boundary
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(form);
      }

      const res = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const timeline = [
    {
      date: "11th May – 23rd May",
      title: "Registrations Open",
      tag: "Live",
      desc: "(Final Year Students & Graduates Only)",
    },
    {
      date: "24th May – 26th May",
      title: "Round 1 – Online Build Phase",
      tag: "Build",
      desc: "Build your solution & submit",
    },
    {
      date: "27th May – 28th May",
      title: "Evaluation of Round 1 Submissions",
      desc: "Shortlisting the best builds",
    },
    {
      date: "29th May",
      title: "Announcement of Top 50 – 60 Builders",
      desc: "Qualifiers for the Final Offline Round",
    },
    {
      date: "30th May",
      title: "Online Orientation Meet",
      desc: "Briefing & guidance for the final round",
    },
    {
      date: "31st May",
      title: "Grand Finale – Offline Final Round",
      tag: "D-Day",
      desc: "Pitch, Present & Compete Live!",
    },
  ];

  const inputClass = `w-full px-6 py-2.5 rounded-2xl border text-[14px] font-medium transition-all duration-300 outline-none backdrop-blur-md ${isDark
    ? "bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 focus:border-[#8c52ff] focus:ring-4 focus:ring-[#8c52ff]/10 focus:bg-white/[0.05]"
    : "bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#8c52ff] focus:ring-4 focus:ring-[#8c52ff]/10"
    }`;

  const selectClass = `${inputClass} flex items-center justify-between cursor-pointer group`;

  return (
    <div className={`min-h-screen font-sans selection:bg-[#8c52ff]/30 selection:text-white ${isDark ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"}`}>
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        simple
        customBanner={
          <span className="text-white text-[11px] sm:text-[13px] font-bold tracking-[0.05em] uppercase flex items-center gap-2">
            Applicable for final year students & recent graduates only
          </span>
        }
      />

      {/* ─── HERO ─── */}
      <section className={`relative w-full pt-48 pb-20 px-6 lg:px-12 border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <DotGrid baseColor={isDark ? "#1e293b" : "#cbd5e1"} activeColor="#8c52ff" dotSize={3} gap={30} />
        </div>

        {/* Tasteful Color Accents - Not overwhelming, just enough for brand identity */}
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none ${isDark ? "bg-[#8c52ff]/10" : "bg-[#8c52ff]/5"}`} />
        <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`} />

        <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-16 items-center justify-between">
          <div className="flex-1 max-w-[640px]">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border mb-8 text-[12px] font-bold tracking-wide uppercase ${isDark ? "bg-white/5 border-white/10 text-[#8c52ff]" : "bg-[#8c52ff]/10 border-[#8c52ff]/20 text-[#8c52ff]"}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#8c52ff] animate-pulse" />
              GradSkills Buildathon 2026
            </div>

            <h1 className={`text-[44px] sm:text-[60px] font-bold leading-[1.05] tracking-tight mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Win Your Own <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c52ff] to-blue-400">Opportunity.</span>
            </h1>

            <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] font-medium mb-8 ${isDark ? "text-white/60" : "text-slate-500"}`}>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#8c52ff]" />
                AI Product Builder
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                CodeQuesters Collab
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff5757]" />
                Hyderabad
              </div>
            </div>

            <p className={`text-[18px] leading-relaxed mb-10 ${isDark ? "text-white/80" : "text-slate-700"}`}>
              Not just another hackathon. This is your interview, internship and opportunity - earned through building.
            </p>

            <a href="#register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-[16px] transition-all bg-[#8c52ff] hover:bg-[#7a42e5] text-white shadow-[0_0_20px_rgba(140,82,255,0.3)] hover:shadow-[0_0_30px_rgba(140,82,255,0.5)]">
              Apply to Build <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Clean, Sharp Stats Card */}
          <div className={`w-full lg:w-[360px] p-8 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white/80 border-slate-200 shadow-xl"}`}>
            <h3 className={`text-[16px] font-bold mb-6 uppercase tracking-widest ${isDark ? "text-white/50" : "text-slate-400"}`}>
              The Stakes
            </h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isDark ? "bg-[#8c52ff]/10" : "bg-[#8c52ff]/5"}`}>
                  <Briefcase className="w-5 h-5 text-[#8c52ff]" />
                </div>
                <div>
                  <div className={`text-[16px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>10 Internships</div>
                  <div className={`text-[14px] mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>Direct offers to top builders</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`}>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className={`text-[16px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>60 Offline Seats</div>
                  <div className={`text-[14px] mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>Invited to final pitch day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row gap-16 relative">
        {/* ─── LEFT COLUMN: CONTENT & TIMELINE ─── */}
        <div className="flex-1 w-full space-y-20 order-2 lg:order-1 lg:pr-6 pb-20">
          
          <section>
            <h2 className={`text-[24px] font-bold mb-6 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Crosshair className="w-6 h-6 text-[#8c52ff]" /> About The Buildathon
            </h2>
            <div className={`text-[16px] leading-relaxed space-y-5 ${isDark ? "text-white/70" : "text-slate-600"}`}>
              <p>
                GradSkills Buildathon is a high-intensity technical competition designed to discover skilled final-year engineers through real-world problem solving, product thinking, execution speed and teamwork.
              </p>
              <p>
                Instead of traditional hiring rounds and outdated resume filtering, we want to identify builders. Participants will compete by designing, building, presenting and solving practical industry-focused challenges.
              </p>

              <div className={`mt-8 p-6 rounded-xl border-l-4 border-l-[#8c52ff] ${isDark ? "bg-white/[0.02] border-white/5" : "bg-white shadow-sm border-slate-200"}`}>
                <h4 className={`text-[15px] font-bold uppercase tracking-wider mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>The best performers will unlock:</h4>
                <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-4">
                  {["Summer Internship Opportunities", "Hiring Opportunities", "Startup Collaboration Chances", "Mentorship Access", "Industry Network Exposure", "Recognition Across the GradSkills Community"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[14px] font-medium">
                      <CheckCircle className="w-4 h-4 text-[#8c52ff]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className={`text-[24px] font-bold mb-6 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Target className="w-6 h-6 text-blue-400" /> Core Theme
            </h2>
            <div className={`p-6 rounded-xl border mb-8 ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
              <h3 className={`text-[22px] font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>“Win Your Own Opportunity”</h3>
              <p className={`text-[16px] italic ${isDark ? "text-white/60" : "text-slate-500"}`}>
                "Talent should be discovered through execution, not just resumes."
              </p>
            </div>
            <p className={`text-[16px] mb-6 ${isDark ? "text-white/70" : "text-slate-600"}`}>
              This Buildathon is created for students who:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["Can build products", "Think independently", "Solve real problems", "Work in teams", "Learn fast", "Execute under pressure"].map((trait, i) => (
                <div key={i} className={`p-4 rounded-lg border text-[14px] font-bold ${isDark ? "bg-white/[0.02] border-white/10 text-white/90" : "bg-white border-slate-200 text-slate-800 shadow-sm"}`}>
                  {trait}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className={`text-[24px] font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Who Can Participate?</h3>
            <p className={`text-[14px] font-bold mb-6 ${isDark ? "text-[#ff5757]" : "text-red-500"}`}>
              * Strictly for final year students and recent graduates
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { text: "Final Year Engineering Students", highlight: true },
                { text: "Recent Graduates", highlight: true },
                { text: "Students interested in Software Development", highlight: false },
                { text: "AI/ML Enthusiasts", highlight: false },
                { text: "Full Stack Developers", highlight: false },
                { text: "Product Builders", highlight: false },
                { text: "SaaS Enthusiasts", highlight: false },
                { text: "Startup Minded Students", highlight: false }
              ].map((badge, i) => (
                <span key={i} className={`px-4 py-2 rounded-lg border text-[14px] font-bold ${badge.highlight
                  ? (isDark ? "border-[#8c52ff]/50 bg-[#8c52ff]/10 text-[#8c52ff]" : "border-[#8c52ff]/30 bg-[#8c52ff]/5 text-[#8c52ff]")
                  : (isDark ? "border-white/10 bg-white/5 text-white/70" : "border-slate-200 bg-white text-slate-600")
                  }`}>
                  {badge.text}
                </span>
              ))}
            </div>

            <h4 className={`text-[18px] font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Preferred Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {["MERN / Full Stack", "AI & ML", "Backend Development", "UI/UX", "Cloud & Deployment", "Product Thinking"].map((skill, i) => (
                <span key={i} className={`px-4 py-2 rounded-lg border text-[14px] font-medium ${isDark ? "border-white/10 bg-white/5 text-white/70" : "border-slate-200 bg-white text-slate-600"}`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className={`text-[24px] font-bold mb-8 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Calendar className="w-6 h-6 text-[#8c52ff]" /> The Schedule
            </h3>
            
            <div className={`relative border-l-2 ml-3 space-y-10 pb-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 ${
                    isDark ? "bg-[#030712] border-[#8c52ff]" : "bg-white border-[#8c52ff]"
                  }`} />
                  
                  <div className={`text-[13px] font-bold tracking-wide uppercase mb-2 flex items-center gap-3 ${isDark ? "text-[#8c52ff]" : "text-[#8c52ff]"}`}>
                    {item.date}
                    {item.tag && (
                      <span className={`px-2.5 py-1 rounded-md text-[11px] ${isDark ? "bg-[#8c52ff]/10 text-[#8c52ff]" : "bg-[#8c52ff]/10 text-[#8c52ff]"}`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <h4 className={`text-[18px] font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{item.title}</h4>
                  <p className={`text-[15px] leading-relaxed mb-4 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    {item.desc}
                  </p>
                  
                  {item.points && (
                    <ul className="space-y-2">
                      {item.points.map((pt, pIdx) => (
                        <li key={pIdx} className={`text-[14px] flex items-center gap-2 font-medium ${isDark ? "text-white/40" : "text-slate-500"}`}>
                          <ChevronRight className="w-4 h-4 text-[#ff5757]" /> {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ─── RIGHT COLUMN: FORM ─── */}
        <div className="w-full lg:w-[400px] order-1 lg:order-2 relative">
          <div className="lg:sticky lg:top-32 space-y-12">

          {/* Registration Form */}
          <div id="register" className={`p-6 sm:p-8 rounded-2xl border scroll-mt-32 backdrop-blur-xl ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
            <h3 className={`text-[20px] font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Secure Your Spot</h3>
            <p className={`text-[14px] mb-6 ${isDark ? "text-white/50" : "text-slate-500"}`}>Zero registration fee. 100% skill-based.</p>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto mb-4 border-green-500/30 bg-green-500/10">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h4 className={`text-[18px] font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Application Sent</h4>
                <p className={`text-[14px] ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  We've received your profile. We'll be in touch via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className={`p-4 rounded-lg border text-[13px] font-bold ${isDark ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
                    {error}
                  </div>
                )}

                <input name="full_name" placeholder="Full Name" required value={form.full_name} onChange={handleChange} className={inputClass} />
                <input name="email" type="email" placeholder="Email Address" required value={form.email} onChange={handleChange} className={inputClass} />
                <input name="phone" placeholder="WhatsApp Number" required value={form.phone} onChange={handleChange} className={inputClass} />
                <input name="college" placeholder="Qualification" required value={form.college} onChange={handleChange} className={inputClass} />

                {/* Custom Modern Select */}
                <div className="relative">
                  <div 
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={selectClass}
                  >
                    <span className={form.year_of_study ? "text-white" : "text-white/30"}>
                      {form.year_of_study || "Year of Study"}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSelectOpen ? "rotate-90" : ""} ${isDark ? "text-white/40" : "text-slate-400"}`} />
                  </div>
                  
                  {isSelectOpen && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={() => setIsSelectOpen(false)} />
                      <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl border backdrop-blur-xl z-[70] shadow-2xl animate-in fade-in zoom-in duration-200 ${isDark ? "bg-[#0c111d]/95 border-white/10" : "bg-white border-slate-200"}`}>
                        {YEARS.map((y) => (
                          <div
                            key={y.value}
                            onClick={() => {
                              setForm({ ...form, year_of_study: y.value });
                              setIsSelectOpen(false);
                            }}
                            className={`px-4 py-3 rounded-xl text-[14px] font-medium cursor-pointer transition-colors ${
                              form.year_of_study === y.value 
                                ? "bg-[#8c52ff] text-white" 
                                : isDark ? "hover:bg-white/5 text-white/70" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            {y.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FileText className={`w-4 h-4 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileChange} 
                    required 
                    className={`${inputClass} pl-11 !py-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-[#8c52ff]/10 file:text-[#8c52ff] hover:file:bg-[#8c52ff]/20 cursor-pointer`} 
                  />
                </div>

                <textarea name="why_join" placeholder="Why are you the right fit for this?" required rows={3} value={form.why_join} onChange={handleChange} className={`${inputClass} resize-none`} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all flex items-center justify-center gap-2 mt-2 bg-[#8c52ff] hover:bg-[#7a42e5] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(140,82,255,0.2)] hover:shadow-[0_0_25px_rgba(140,82,255,0.4)]"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>

      <Footer theme={theme} />
    </div>
  );
}
