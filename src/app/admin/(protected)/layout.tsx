import { isAuthenticated, logoutAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div className="admin-brand">TBS <span>GAMER</span></div>
        <nav className="admin-nav">
          <Link href="/admin">📊 Dashboard</Link>
          <Link href="/admin/users">👥 Users</Link>
          <Link href="/admin/apps">📱 Manage Apps</Link>
          <Link href="/admin/proofs">📸 User Proofs</Link>
          <Link href="/admin/history">📜 Task History</Link>
          <Link href="/admin/withdrawals">⚙️ Withdraw Setup</Link>
          <Link href="/admin/withdrawals/requests">💸 Payout Requests</Link>
          <Link href="/admin/support">📩 Support Tickets</Link>
          <Link href="/admin/navigation">🧭 Navigation</Link>
          <Link href="/" target="_blank">🌐 View Site</Link>
        </nav>
        <div className="admin-footer">
          <form action={logoutAction}>
            <button type="submit" className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
              Logout
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
