import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Wallet, Clock, Activity, ShieldAlert, CheckCircle2, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import UserProfileActions from "@/components/UserProfileActions";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Await params object for next.js 15+ compatibility, though we just access .id directly, it's safer to await it if it was a promise. 
  // In Next.js App Router, params is officially a promise in the latest versions, so we should await it if needed, but standard destructuring works for now.
  // Actually, Next.js 15 requires `const { id } = await params;` Let's do that to be safe.
  const { id } = await Promise.resolve(params);

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileErr || !profile) {
    return notFound();
  }

  const { data: proofs } = await supabase
    .from("proofs")
    .select("*, apps:app_id(name, reward_amount)")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const totalTasks = proofs?.length || 0;
  const approvedTasks = proofs?.filter(p => p.status === 'approved').length || 0;
  const rejectedTasks = proofs?.filter(p => p.status === 'rejected').length || 0;
  const pendingTasks = proofs?.filter(p => p.status === 'pending').length || 0;

  return (
    <>
      <div className="admin-hd" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/admin/users" style={{ color: "#64748b", display: "flex", alignItems: "center", padding: "8px", borderRadius: "50%", background: "#f1f5f9", height: "fit-content" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
              👤 User Profile 
              {profile.is_banned && <span style={{ background: "#fee2e2", color: "#ef4444", fontSize: 12, padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}><ShieldAlert size={14} /> BANNED</span>}
            </h1>
            <p style={{ color: "#64748b", margin: 0, marginTop: 4 }}>Detailed overview of user activity and transactions.</p>
          </div>
        </div>
        
        {/* Render interactive actions */}
        <UserProfileActions profile={profile} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 32 }}>
        {/* User Info Card */}
        <div className="card" style={{ padding: 24, marginBottom: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={18} /> Account Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><span style={{ color: "#64748b", fontSize: 13 }}>Full Name:</span> <div style={{ fontWeight: 600, color: "#0f172a" }}>{profile.full_name || "—"}</div></div>
            <div><span style={{ color: "#64748b", fontSize: 13 }}>Email Address:</span> <div style={{ fontWeight: 600, color: "#0f172a" }}>{profile.email}</div></div>
            <div><span style={{ color: "#64748b", fontSize: 13 }}>Phone Number:</span> <div style={{ fontWeight: 600, color: "#0f172a" }}>{profile.phone || "—"}</div></div>
            <div><span style={{ color: "#64748b", fontSize: 13 }}>Joined Date:</span> <div style={{ fontWeight: 600, color: "#0f172a" }}>{new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div></div>
            {profile.is_banned && (
              <div style={{ background: "#fef2f2", padding: 12, borderRadius: 8, border: "1px solid #fee2e2", marginTop: 8 }}>
                <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Ban Reason:</span>
                <div style={{ color: "#7f1d1d", fontSize: 14, fontWeight: 500, marginTop: 4 }}>"{profile.ban_reason || "Violation of terms"}"</div>
              </div>
            )}
          </div>
        </div>

        {/* Financial & Task Stats Card */}
        <div className="card" style={{ padding: 24, marginBottom: 0, background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Wallet size={18} /> Financials & Stats
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>Wallet Balance</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24" }}>₹{profile.wallet_balance}</div>
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>Total Earned</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#34d399" }}>₹{profile.total_earned}</div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.1)", padding: 16, borderRadius: 12, display: "flex", justifyContent: "space-between", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{totalTasks}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Total Tasks</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#34d399" }}>{approvedTasks}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Approved</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f87171" }}>{rejectedTasks}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Rejected</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fbbf24" }}>{pendingTasks}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Pending</div>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <Clock size={20} /> Transaction & Task History
      </h2>

      {(!proofs || proofs.length === 0) ? (
        <div className="empty-state">
          <p>No tasks completed by this user yet.</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>App Task</th>
                <th>Status</th>
                <th>Reward / Transaction</th>
                <th>Admin Remark</th>
                <th>Proof Image</th>
              </tr>
            </thead>
            <tbody>
              {proofs.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "#64748b", fontSize: 13 }}>
                    {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<br/>
                    <span style={{ fontSize: 11 }}>{new Date(p.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{p.apps?.name || "Unknown App"}</td>
                  <td>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: 4, 
                      fontSize: 12, 
                      fontWeight: "bold",
                      background: p.status === 'approved' ? "#dcfce7" : (p.status === 'rejected' ? "#fee2e2" : "#f1f5f9"),
                      color: p.status === 'approved' ? "#16a34a" : (p.status === 'rejected' ? "#ef4444" : "#475569")
                    }}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {p.status === 'approved' ? (
                      <span style={{ fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={14}/> +₹{p.awarded_amount} Credited</span>
                    ) : p.status === 'rejected' ? (
                      <span style={{ fontWeight: 600, color: "#ef4444" }}>₹0</span>
                    ) : (
                      <span style={{ fontWeight: 600, color: "#94a3b8" }}>Pending (₹{p.apps?.reward_amount})</span>
                    )}
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13, maxWidth: 200 }}>
                    {p.remark || "—"}
                  </td>
                  <td>
                    <a href={p.image_base64} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      View Image
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
