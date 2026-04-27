import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Clock, Mail } from "lucide-react";

export const revalidate = 0;

export default async function AdminSupportPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select(`
      *,
      profiles:user_id(full_name, email, phone)
    `)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="admin-hd" style={{ marginBottom: 24 }}>
        <div>
          <h1>Support Tickets</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Read messages and issues submitted by users.</p>
        </div>
      </div>
      
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>User Details</th>
              <th>Message / Issue</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets?.map(t => {
              const prof = (t as any).profiles;
              return (
                <tr key={t.id}>
                  <td style={{ color: "#64748b", fontSize: 13, width: "120px" }}>
                    {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<br/>
                    <span style={{ fontSize: 11 }}>{new Date(t.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </td>
                  <td style={{ width: "250px" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{prof?.full_name || "Unknown User"}</div>
                    <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <Mail size={12} /> {prof?.email}
                    </div>
                    {prof?.phone && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Phone: {prof?.phone}</div>}
                  </td>
                  <td>
                    <div style={{ 
                      fontSize: 14, color: "#334155", background: "#f8fafc", padding: "12px 16px", 
                      borderRadius: 12, border: "1px solid #e2e8f0", whiteSpace: "pre-wrap", lineHeight: 1.6 
                    }}>
                      {t.message}
                    </div>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                    <a href={`mailto:${prof?.email}`} className="btn btn-green" style={{ textDecoration: "none" }}>
                      Reply via Email
                    </a>
                  </td>
                </tr>
              );
            })}
            
            {(!tickets || tickets.length === 0) && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>📩</div>
                  No support tickets found. All caught up!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
