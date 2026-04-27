"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { Sparkles, Clock } from "lucide-react";

type Proof = {
  id: number;
  status: string;
  created_at: string;
  awarded_amount: number;
  remark: string;
  apps: { name: string; icon_url: string; reward_amount: number };
};

export default function HistoryPage() {
  const router = useRouter();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [filter, setFilter] = useState<'processing'|'completed'|'rejected'>('processing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then(async (user) => {
      if (!user) { router.push("/user/login"); return; }
      
      const supabase = createClient();
      const { data: proofsData } = await supabase
        .from("proofs")
        .select(`id, status, created_at, awarded_amount, remark, apps:app_id(name, icon_url, reward_amount)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      setProofs((proofsData as any) || []);
      setLoading(false);
    });
  }, [router]);

  const filteredProofs = proofs.filter(p => 
    filter === 'processing' ? p.status === 'pending' : (filter === 'completed' ? p.status === 'approved' : p.status === 'rejected')
  );

  if (loading) return (
    <div className="app-frame" style={{ alignItems: "center", justifyContent: "center" }}>
      <Sparkles size={32} color="#10b981" style={{ animation: "pulse 2s infinite" }} />
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />
      {/* Mobile-App Style Sticky Header */}
      <div style={{ background: "#fff", padding: "20px 20px 16px", position: "sticky", top: 60, zIndex: 40, borderBottom: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={24} color="#10b981" /> Task History
        </h1>
        
        {/* iOS Style Segmented Control */}
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4 }}>
          <button 
            onClick={() => setFilter('processing')} 
            style={{ flex: 1, padding: "8px 4px", borderRadius: 8, background: filter === 'processing' ? '#fff' : 'transparent', color: filter === 'processing' ? '#0f172a' : '#64748b', border: "none", fontSize: 13, fontWeight: filter === 'processing' ? 700 : 500, boxShadow: filter === 'processing' ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}
          >
            Processing
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            style={{ flex: 1, padding: "8px 4px", borderRadius: 8, background: filter === 'completed' ? '#fff' : 'transparent', color: filter === 'completed' ? '#0f172a' : '#64748b', border: "none", fontSize: 13, fontWeight: filter === 'completed' ? 700 : 500, boxShadow: filter === 'completed' ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('rejected')} 
            style={{ flex: 1, padding: "8px 4px", borderRadius: 8, background: filter === 'rejected' ? '#fff' : 'transparent', color: filter === 'rejected' ? '#0f172a' : '#64748b', border: "none", fontSize: 13, fontWeight: filter === 'rejected' ? 700 : 500, boxShadow: filter === 'rejected' ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}
          >
            Rejected
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredProofs.map(p => (
            <div key={p.id} style={{ background: "#fff", borderRadius: 20, padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f8fafc", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                  {p.apps?.icon_url ? <img src={p.apps.icon_url} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Sparkles size={24} color="#94a3b8" />}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.apps?.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} />
                    {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {new Date(p.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
                
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: p.status === 'approved' ? "#10b981" : (p.status === 'rejected' ? "#ef4444" : "#f59e0b") }}>
                    {p.status === 'approved' ? `+₹${p.awarded_amount}` : (p.status === 'rejected' ? '₹0' : `₹${p.apps?.reward_amount}`)}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginTop: 4, color: p.status === 'approved' ? "#059669" : (p.status === 'rejected' ? "#dc2626" : "#d97706"), background: p.status === 'approved' ? "#dcfce7" : (p.status === 'rejected' ? "#fee2e2" : "#fef3c7"), padding: "2px 8px", borderRadius: 10, display: "inline-block" }}>
                    {p.status === 'pending' ? 'Processing' : p.status}
                  </div>
                </div>
              </div>
              
              {p.status === 'rejected' && p.remark && (
                <div style={{ marginTop: 16, padding: "12px", background: "#fef2f2", borderRadius: 12, border: "1px solid #fee2e2", fontSize: 13, color: "#ef4444" }}>
                  <strong style={{ display: "block", marginBottom: 2 }}>Rejection Reason:</strong>
                  {p.remark}
                </div>
              )}
            </div>
          ))}
          
          {filteredProofs.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 24, border: "2px dashed #e2e8f0", marginTop: 10 }}>
              <div style={{ width: 64, height: 64, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#94a3b8" }}>
                <Clock size={32} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>No {filter} tasks</div>
              <div style={{ fontSize: 14, color: "#64748b" }}>When you submit proofs, they will appear here.</div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
