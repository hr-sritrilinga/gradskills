import { useState, useEffect, useCallback, Fragment } from "react";
import { CheckCircle, XCircle, Clock, Download, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Trash2, Loader2, Shield } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { SignIn2 } from "../components/ui/clean-minimal-sign-in";

const API_URL = import.meta.env.VITE_BUILDATHON_API || "http://localhost:4000";

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  year_of_study: string;
  branch: string;
  team_name: string | null;
  team_size: string | null;
  experience_level: string;
  skills: string;
  github_url: string | null;
  linkedin_url: string | null;
  why_join: string;
  project_idea: string | null;
  status: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function BuildathonAdmin() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }, [getToken]);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "30",
        sort_by: "created_at",
        sort_order: "DESC",
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      if (experienceFilter) params.set("experience_level", experienceFilter);

      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/api/admin/applications?${params}`, { headers });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setApplications(data.applications);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, experienceFilter, getHeaders]);

  useEffect(() => {
    // Only fetch if they have a token (signed in)
    getToken().then(token => {
      if (token) fetchApplications();
    });
  }, [fetchApplications, getToken]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const headers = await getHeaders();
      await fetch(`${API_URL}/api/admin/applications/${id}`, {
        method: "PATCH", headers, body: JSON.stringify({ status }),
      });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const bulkUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    try {
      const headers = await getHeaders();
      await fetch(`${API_URL}/api/admin/applications-bulk`, {
        method: "PATCH", headers, body: JSON.stringify({ ids: selectedIds, status }),
      });
      setSelectedIds([]);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteApp = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const headers = await getHeaders();
      await fetch(`${API_URL}/api/admin/applications/${id}`, {
        method: "DELETE", headers,
      });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const exportExcel = async (exportStatus: string) => {
    const params = new URLSearchParams({
      status: exportStatus,
    });

    const headers = await getHeaders();
    const authHeader = { "Authorization": headers["Authorization"] };

    fetch(`${API_URL}/api/admin/export?${params}`, { headers: authHeader })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `buildathon_${exportStatus}_${new Date().toISOString().split("T")[0]}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch(err => console.error("Export failed:", err));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map(a => a.id));
    }
  };

  const statusBadge = (s: string) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return `px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${colors[s as keyof typeof colors] || colors.pending}`;
  };

  return (
    <>
      {/* ─── CUSTOM BRANDED LOGIN SCREEN ───── */}
      <SignedOut>
        <div className="min-h-screen bg-home-gradient flex items-center justify-center px-6">
          <SignIn2 />
        </div>
      </SignedOut>

      {/* ─── ADMIN DASHBOARD ───── */}
      <SignedIn>
        {!["kakkirenivishwas@gmail.com", "support@procreationstudio.com"].includes(user?.primaryEmailAddress?.emailAddress || "") ? (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
              <p className="text-slate-500 mb-8">
                The account <strong>{user?.primaryEmailAddress?.emailAddress}</strong> is not authorized to access this portal.
              </p>
              <div className="flex justify-center">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-12 h-12" } }} />
              </div>
              <p className="text-[13px] text-slate-400 mt-4">Click your profile above to sign out.</p>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-[#030712] text-white font-sans">
          <div className="max-w-[1500px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-[32px] font-bold">Buildathon Dashboard</h1>
                <p className="text-white/40 text-[14px]">Manage all applications</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={fetchApplications} className="p-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors" title="Refresh">
                  <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? "animate-spin" : ""}`} />
                </button>
                
                {/* Export Dropdown */}
                <div className="relative group/export">
                  <button className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-500 font-semibold text-[14px] flex items-center gap-2 transition-colors">
                    <Download className="w-4 h-4" /> Export Excel
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1f2937] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50 overflow-hidden">
                    <button onClick={() => exportExcel("all")} className="w-full px-4 py-3 text-left text-[13px] hover:bg-white/5 transition-colors border-b border-white/5">Export All</button>
                    <button onClick={() => exportExcel("approved")} className="w-full px-4 py-3 text-left text-[13px] hover:bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors border-b border-white/5">Export Approved</button>
                    <button onClick={() => exportExcel("rejected")} className="w-full px-4 py-3 text-left text-[13px] hover:bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Export Rejected</button>
                  </div>
                </div>

                <div className="pl-4 ml-2 border-l border-white/10 flex items-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10 border-2 border-[#8c52ff]/50 shadow-[0_0_15px_rgba(140,82,255,0.3)]",
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {error && <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px]">{error}</div>}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total", value: stats.total, color: "from-blue-500/20 to-blue-600/5 border-blue-500/20" },
                { label: "Pending", value: stats.pending, color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/20" },
                { label: "Approved", value: stats.approved, color: "from-green-500/20 to-green-600/5 border-green-500/20" },
                { label: "Rejected", value: stats.rejected, color: "from-red-500/20 to-red-600/5 border-red-500/20" },
              ].map((s, i) => (
                <div key={i} className={`p-5 rounded-2xl border bg-gradient-to-br ${s.color} backdrop-blur-xl`}>
                  <p className="text-white/40 text-[12px] uppercase tracking-widest font-semibold mb-1">{s.label}</p>
                  <p className="text-[32px] font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  placeholder="Search name, email, college..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border bg-white/[0.03] border-white/10 text-white text-[14px] outline-none focus:border-[#8c52ff]/50"
                />
              </div>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl border border-white/10 bg-[#1f2937] text-white text-[13px] outline-none focus:ring-2 focus:ring-[#8c52ff]/50 transition-all cursor-pointer appearance-none min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select 
                  value={experienceFilter} 
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl border border-white/10 bg-[#1f2937] text-white text-[13px] outline-none focus:ring-2 focus:ring-[#8c52ff]/50 transition-all cursor-pointer appearance-none min-w-[140px]"
                >
                  <option value="">All Experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3 mb-4 p-4 rounded-xl border border-[#8c52ff]/20 bg-[#8c52ff]/5">
                <span className="text-[14px] font-semibold text-white/70">{selectedIds.length} selected</span>
                <button onClick={() => bulkUpdate("approved")} className="px-4 py-2 rounded-2xl bg-green-600 hover:bg-green-500 text-[13px] font-semibold transition-colors flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve All
                </button>
                <button onClick={() => bulkUpdate("rejected")} className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-[13px] font-semibold transition-colors flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Reject All
                </button>
                <button onClick={() => bulkUpdate("pending")} className="px-4 py-2 rounded-2xl bg-yellow-600 hover:bg-yellow-500 text-[13px] font-semibold transition-colors flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Reset to Pending
                </button>
              </div>
            )}

            {/* Table */}
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/5">
                      <th className="p-4 text-left">
                        <input type="checkbox" checked={selectedIds.length === applications.length && applications.length > 0} onChange={toggleSelectAll} className="rounded accent-[#8c52ff]" />
                      </th>
                      <th className="p-4 text-left text-white/40 font-semibold uppercase tracking-wider text-[11px]">Name</th>
                      <th className="p-4 text-left text-white/40 font-semibold uppercase tracking-wider text-[11px]">Contact (Phone/Email)</th>
                      <th className="p-4 text-left text-white/40 font-semibold uppercase tracking-wider text-[11px]">College</th>
                      <th className="p-4 text-left text-white/40 font-semibold uppercase tracking-wider text-[11px]">Qualification</th>
                      <th className="p-4 text-center text-white/40 font-semibold uppercase tracking-wider text-[11px]">Resume</th>
                      <th className="p-4 text-center text-white/40 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                      <th className="p-4 text-right text-white/40 font-semibold uppercase tracking-wider text-[11px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr><td colSpan={8} className="p-16 text-center text-white/30">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...
                      </td></tr>
                    )}
                    {!loading && applications.length === 0 && (
                      <tr><td colSpan={8} className="p-16 text-center text-white/30">No applications found</td></tr>
                    )}
                    {!loading && applications.map(app => (
                      <Fragment key={app.id}>
                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <input type="checkbox" checked={selectedIds.includes(app.id)} onChange={() => toggleSelect(app.id)} className="rounded accent-[#8c52ff]" />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{app.full_name}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-white/80 font-medium">{app.phone}</div>
                            <div className="text-white/40 text-[11px]">{app.email}</div>
                          </td>
                          <td className="p-4 text-white/60 max-w-[200px] truncate">{app.college}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 rounded bg-white/5 text-white/40 text-[11px] font-bold">
                              {app.year_of_study}
                            </span>
                          </td>
                          <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                            {app.resume_url ? (
                              <a 
                                href={app.resume_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8c52ff]/10 text-[#8c52ff] hover:bg-[#8c52ff]/20 transition-all font-bold text-[11px]"
                              >
                                <Download className="w-3.5 h-3.5" /> Resume
                              </a>
                            ) : (
                              <span className="text-white/10 italic text-[11px]">No PDF</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className={statusBadge(app.status)}>{app.status}</span>
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => updateStatus(app.id, "approved")} title="Approve" className="p-2 rounded-lg hover:bg-green-500/20 transition-colors group">
                                <CheckCircle className="w-5 h-5 text-green-400/40 group-hover:text-green-400" />
                              </button>
                              <button onClick={() => updateStatus(app.id, "rejected")} title="Reject" className="p-2 rounded-lg hover:bg-red-500/20 transition-colors group">
                                <XCircle className="w-5 h-5 text-red-400/40 group-hover:text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded Row Detail (Immediately follows main row) */}
                        {expandedId === app.id && (
                          <tr className="bg-white/[0.01]">
                            <td colSpan={8} className="p-6 border-b border-white/5">
                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[13px]">
                                <div><span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">Branch</span><span className="text-white/80">{app.branch || "N/A"}</span></div>
                                <div><span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">Experience</span><span className="text-white/80">{app.experience_level}</span></div>
                                <div><span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">GitHub</span>{app.github_url ? <a href={app.github_url} target="_blank" className="text-[#8c52ff] hover:underline">{app.github_url}</a> : <span className="text-white/30">-</span>}</div>
                                <div><span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">LinkedIn</span>{app.linkedin_url ? <a href={app.linkedin_url} target="_blank" className="text-[#8c52ff] hover:underline">{app.linkedin_url}</a> : <span className="text-white/30">-</span>}</div>
                                <div className="col-span-full"><span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">Why Join</span><span className="text-white/80 leading-relaxed">{app.why_join}</span></div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-white/30 text-[13px]">Showing {applications.length} of {total} applications</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[14px] text-white/60 px-3">Page {page} of {totalPages || 1}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </SignedIn>
    </>
  );
}
