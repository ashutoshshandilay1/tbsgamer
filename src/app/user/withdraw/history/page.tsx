"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getUserProfile } from "@/lib/actions";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Gift, Copy } from "lucide-react";

export default function WithdrawalHistoryPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then(async (data) => {
      if (!data) { router.push("/user/login"); return; }
      
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        
        const { data: reqs } = await supabase
          .from("withdrawal_requests")
          .select(`
            *,
            withdrawal_options (
              amount,
              withdrawal_categories (name, image_url)
            )
          `)
          .eq("user_id", data.id)
          .order("created_at", { ascending: false });

        if (reqs) setRequests(reqs);
      } catch (err) {
        console.error(err);
      }
      
      setLoading(false);
    });
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <Link href="/user/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", textDecoration: "none", fontWeight: 600 }}>
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginLeft: "auto", margin: 0 }}>Withdrawal History</h1>
        </div>

        {requests.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8", background: "#fff", borderRadius: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <Clock size={48} style={{ opacity: 0.2, margin: "0 auto 16px" }} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>No withdrawals yet</div>
            <p style={{ marginTop: 8, fontSize: 14 }}>Your payout requests will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {requests.map(req => {
              const opt = req.withdrawal_options;
              const cat = opt?.withdrawal_categories;
              
              return (
                <div key={req.id} style={{ background: "#fff", padding: 20, borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: cat?.image_url ? "transparent" : "#f1f5f9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", overflow: "hidden" }}>
                        {cat?.image_url ? <img src={cat.image_url} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Gift size={20} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>{cat?.name || "Withdrawal"}</div>
                        <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {new Date(req.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>₹{opt?.amount}</div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 12, fontSize: 13, color: "#475569", fontWeight: 500, marginBottom: 16, border: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#94a3b8", textTransform: "uppercase", fontSize: 11, fontWeight: 700, display: "block", marginBottom: 4 }}>Given Input</span>
                    {req.user_input}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Status</div>
                    {req.status === 'pending' && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#f59e0b", background: "#fef3c7", padding: "6px 12px", borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                        <Clock size={16} /> Pending
                      </div>
                    )}
                    {req.status === 'approved' && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", background: "#dcfce7", padding: "6px 12px", borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                        <CheckCircle2 size={16} /> Completed
                      </div>
                    )}
                    {req.status === 'rejected' && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444", background: "#fee2e2", padding: "6px 12px", borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                        <XCircle size={16} /> Rejected (Refunded)
                      </div>
                    )}
                  </div>

                  {req.admin_remark && (
                    <div style={{ marginTop: 16, background: "#ecfdf5", padding: "16px", borderRadius: 12, border: "1px dashed #34d399" }}>
                      <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Admin Remark / Code</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#065f46", wordBreak: "break-all" }}>
                          {req.admin_remark}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(req.admin_remark);
                            alert("Code copied!");
                          }}
                          style={{ background: "#10b981", color: "#fff", border: "none", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
