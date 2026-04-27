import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/actions";
import { redirect } from "next/navigation";
import ProofActions from "@/components/ProofActions";

export const revalidate = 0;

export default async function AdminProofsPage({ searchParams }: { searchParams: any }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/user/login");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Parse params
  const sp = await searchParams;
  const status = sp?.status || "pending";
  const page = parseInt(sp?.page || "1", 10);
  const search = sp?.search || "";
  const perPage = 10;

  let query = supabase
    .from("proofs")
    .select(`
      *,
      profiles!inner(full_name, email),
      apps!inner(name, reward_amount)
    `, { count: 'exact' });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`, { foreignTable: 'profiles' });
  }

  query = query
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data: proofs, count, error } = await query;
  
  const totalPages = count ? Math.ceil(count / perPage) : 1;

  return (
    <div>
      <div className="admin-hd" style={{ marginBottom: 24 }}>
        <div>
          <h1>User Proofs</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Review screenshots submitted by users.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "16px 24px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        {/* TABS */}
        <div style={{ display: "flex", gap: 8, background: "#f1f5f9", padding: 6, borderRadius: 12 }}>
          {[
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
            { id: "all", label: "All Proofs" }
          ].map(tab => (
            <a 
              key={tab.id}
              href={`/admin/proofs?status=${tab.id}&page=1&search=${search}`}
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
            placeholder="Search by User Name or Email..." 
            className="form-input"
            style={{ padding: "10px 16px", borderRadius: 10, width: 280, margin: 0, fontSize: 14 }}
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
              <th>App & Reward</th>
              <th>Screenshot Proof</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proofs?.map(p => {
              const sizeKb = Math.round((p.image_base64.length * 3 / 4) / 1024);
              return (
                <tr key={p.id}>
                  <td style={{ color: "#64748b", fontSize: 13 }}>
                    {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<br/>
                    <span style={{ fontSize: 11 }}>{new Date(p.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    <div style={{ fontSize: 10, marginTop: 4, color: "#94a3b8" }}>{sizeKb} KB</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{p.profiles?.full_name || "Unknown"}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{p.profiles?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{p.apps?.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#10b981", marginTop: 2 }}>₹{p.apps?.reward_amount} Reward</div>
                  </td>
                  <td>
                    <a href={p.image_base64} target="_blank" rel="noreferrer" style={{ display: "block", width: 120, height: 160, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <img src={p.image_base64} alt="Proof" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </a>
                  </td>
                  <td>
                    <span style={{ 
                      padding: "6px 12px", 
                      borderRadius: 100, 
                      fontSize: 12, 
                      fontWeight: 800,
                      background: p.status === 'approved' ? "#dcfce7" : (p.status === 'rejected' ? "#fee2e2" : "#fef3c7"),
                      color: p.status === 'approved' ? "#16a34a" : (p.status === 'rejected' ? "#ef4444" : "#d97706")
                    }}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <ProofActions proof={p} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!proofs || proofs.length === 0) && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#64748b", padding: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>📸</div>
                  No proofs found for this filter.
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
                <a href={`/admin/proofs?status=${status}&search=${search}&page=${page - 1}`} className="btn btn-outline">
                  Previous
                </a>
              ) : (
                <button disabled className="btn btn-outline" style={{ opacity: 0.5 }}>Previous</button>
              )}
              
              {page < totalPages ? (
                <a href={`/admin/proofs?status=${status}&search=${search}&page=${page + 1}`} className="btn btn-outline">
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
