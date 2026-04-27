import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/actions";
import { redirect } from "next/navigation";
import WithdrawalActions from "@/components/WithdrawalActions";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const revalidate = 0;

export default async function WithdrawalRequestsPage({ searchParams }: { searchParams: any }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Parse params
  const sp = await searchParams;
  const status = sp?.status || "pending";
  const page = parseInt(sp?.page || "1", 10);
  const search = sp?.search || "";
  const perPage = 10;

  // Build Query
  let query = supabase.from("withdrawal_requests")
    .select(`
      *,
      profiles!inner(full_name, email, wallet_balance),
      withdrawal_options(amount, withdrawal_categories(name, input_label))
    `, { count: 'exact' });

  if (status !== "all") {
    query = query.eq("status", status);
  }
  
  if (search) {
    // We search the user_input field (which usually contains email/phone)
    query = query.ilike("user_input", `%${search}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data: requests, count } = await query;
  
  const totalPages = count ? Math.ceil(count / perPage) : 1;

  return (
    <div>
      <div className="admin-hd" style={{ marginBottom: 24 }}>
        <div>
          <h1>Payout Requests</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Manage and process user withdrawal requests.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "16px 24px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        {/* TABS */}
        <div style={{ display: "flex", gap: 8, background: "#f1f5f9", padding: 6, borderRadius: 12 }}>
          {[
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Completed" },
            { id: "rejected", label: "Rejected" },
            { id: "all", label: "All Requests" }
          ].map(tab => (
            <a 
              key={tab.id}
              href={`/admin/withdrawals/requests?status=${tab.id}&page=1&search=${search}`}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none",
                background: status === tab.id ? "#fff" : "transparent",
                color: status === tab.id ? "#0f172a" : "#64748b",
                boxShadow: status === tab.id ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* SEARCH FORM */}
        <form style={{ display: "flex", gap: 8 }}>
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="page" value="1" />
          <input 
            type="text" 
            name="search"
            defaultValue={search}
            placeholder="Search details..." 
            className="form-input"
            style={{ padding: "10px 16px", borderRadius: 10, width: 260, margin: 0, fontSize: 14 }}
          />
          <button type="submit" className="btn btn-green">Search</button>
        </form>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>User Details</th>
              <th>Withdrawal Method</th>
              <th>Input Provided</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map(req => {
              const opt = (req as any).withdrawal_options;
              const cat = opt?.withdrawal_categories;
              const prof = (req as any).profiles;
              
              return (
                <tr key={req.id}>
                  <td style={{ color: "#64748b", fontSize: 13 }}>
                    {new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<br/>
                    <span style={{ fontSize: 11 }}>{new Date(req.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{prof?.full_name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{prof?.email}</div>
                    <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginTop: 4 }}>Balance: ₹{prof?.wallet_balance}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{cat?.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#10b981", marginTop: 2 }}>₹{opt?.amount}</div>
                  </td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                      {cat?.input_label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", wordBreak: "break-all" }}>
                      {req.user_input}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: "6px 12px", 
                      borderRadius: 100, 
                      fontSize: 12, 
                      fontWeight: 800,
                      background: req.status === 'approved' ? "#dcfce7" : (req.status === 'rejected' ? "#fee2e2" : "#fef3c7"),
                      color: req.status === 'approved' ? "#16a34a" : (req.status === 'rejected' ? "#ef4444" : "#d97706")
                    }}>
                      {req.status.toUpperCase()}
                    </span>
                    {req.admin_remark && (
                      <div style={{ fontSize: 11, color: "#059669", marginTop: 8, fontWeight: 600, background: "#ecfdf5", padding: "4px 8px", borderRadius: 4 }}>
                        Code: {req.admin_remark}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                    <WithdrawalActions request={req} />
                  </td>
                </tr>
              );
            })}
            
            {(!requests || requests.length === 0) && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#64748b", padding: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>💸</div>
                  No requests found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>
              Showing Page {page} of {totalPages}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {page > 1 ? (
                <a href={`/admin/withdrawals/requests?status=${status}&search=${search}&page=${page - 1}`} className="btn btn-outline">
                  Previous
                </a>
              ) : (
                <button disabled className="btn btn-outline" style={{ opacity: 0.5 }}>Previous</button>
              )}
              
              {page < totalPages ? (
                <a href={`/admin/withdrawals/requests?status=${status}&search=${search}&page=${page + 1}`} className="btn btn-outline">
                  Next
                </a>
              ) : (
                <button disabled className="btn btn-outline" style={{ opacity: 0.5 }}>Next</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
