import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: apps }, { data: users }, { count: userCount }] = await Promise.all([
    supabase.from("apps").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("wallet_balance, total_earned"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const totalApps   = apps?.length || 0;
  const activeApps  = apps?.filter((a) => a.active).length || 0;
  const totalUsers  = userCount || 0;
  const totalWallet = users?.reduce((s, u) => s + (u.wallet_balance || 0), 0) || 0;
  const totalEarned = users?.reduce((s, u) => s + (u.total_earned  || 0), 0) || 0;

  return (
    <>
      <div className="admin-hd">
        <h1>Dashboard</h1>
        <Link href="/admin/apps" className="btn btn-green btn-sm">+ Add App</Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-box-label">Total Users</div>
          <div className="stat-box-val">{totalUsers}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Active Apps</div>
          <div className="stat-box-val green">{activeApps} / {totalApps}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Total Paid Out</div>
          <div className="stat-box-val amber">₹{totalEarned}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Pending Wallets</div>
          <div className="stat-box-val">{totalWallet > 0 ? `₹${totalWallet}` : "₹0"}</div>
        </div>
      </div>

      {/* Recent Apps */}
      <div style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="sec-title" style={{ margin: 0, border: "none", paddingBottom: 0 }}>Recent Apps</div>
        <Link href="/admin/apps" style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>View all →</Link>
      </div>

      {totalApps === 0 ? (
        <div className="empty-state">
          <p>No apps yet.</p>
          <Link href="/admin/apps" className="btn btn-green btn-sm">+ Add First App</Link>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>App</th>
                <th>Reward</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {apps?.slice(0, 5).map((app) => (
                <tr key={app.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {app.icon_url ? (
                      <img src={app.icon_url} alt={app.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 22 }}>📱</span>
                    )}
                    <strong>{app.name}</strong>
                  </td>
                  <td style={{ fontWeight: 700, color: "#d97706" }}>₹{app.reward_amount}</td>
                  <td>
                    <span className={`badge ${app.active ? "badge-on" : "badge-off"}`}>
                      {app.active ? "Active" : "Inactive"}
                    </span>
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
