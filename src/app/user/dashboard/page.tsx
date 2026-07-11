"use client";

import { useEffect, useState } from "react";
import { getUserProfile, userLogout } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { Wallet, Gift, Clock, Sparkles, Activity, ArrowRight, ArrowUpRight, MessageSquare } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  wallet_balance: number;
  total_earned: number;
  created_at: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then(async (data) => {
      if (!data) { router.push("/user/login"); return; }
      setProfile(data);
      
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        
        // Fetch manual transactions
        const { data: txs } = await supabase.from("transactions").select("*").eq("user_id", data.id);
        
        // Fetch approved proofs (task earnings)
        const { data: approvedProofs } = await supabase.from("proofs")
          .select("*, apps(name)")
          .eq("user_id", data.id)
          .eq("status", "approved");

        // Merge and Format
        const combined: Record<string, unknown>[] = [
          ...(txs || []).map((t: Record<string, unknown>) => ({ ...t, source: 'transaction' })),
          ...(approvedProofs || []).map((p: Record<string, unknown> & { apps?: { name?: string } }) => ({
            id: `p-${p.id}`,
            amount: p.awarded_amount,
            type: 'credit',
            description: `Task Reward: ${p.apps?.name || 'App Task'}`,
            created_at: p.created_at,
            source: 'proof'
          }))
        ];

        // Sort by date (descending)
        combined.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());
        
        setTransactions(combined.slice(0, 20));
      } catch (err) {
        console.error("History fetch error:", err);
      }
      
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await userLogout();
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f8fafc" }}>
      <Sparkles size={32} color="#10b981" style={{ animation: "pulse 2s infinite" }} />
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>Welcome back,</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "4px 0 0 0", letterSpacing: "-0.5px" }}>
            {profile?.full_name || "User"} 👋
          </h1>
        </div>
        
        {/* Modern Wallet Card */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: 24, padding: "28px 24px", color: "#fff", marginBottom: 20, boxShadow: "0 20px 40px -12px rgba(15, 23, 42, 0.5)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
          <div style={{ position: "absolute", right: -20, bottom: -40, fontSize: 160, fontWeight: 900, opacity: 0.03, lineHeight: 1 }}>₹</div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
              <Wallet size={24} />
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff", border: "1px solid rgba(255,255,255,0.2)", letterSpacing: "0.5px" }}>
              ACTIVE
            </div>
          </div>
          
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Current Balance</div>
              <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: "-1px" }}>₹{profile?.wallet_balance ?? 0}</div>
            </div>
            
            <Link href="/user/withdraw" style={{ display: "flex", alignItems: "center", gap: 6, background: "#10b981", color: "#fff", padding: "10px 16px", borderRadius: 100, fontSize: 14, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
              Withdraw <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", border: "1px solid #f1f5f9" }}>
            <div style={{ position: "absolute", top: -10, right: -10, color: "#10b981", opacity: 0.05 }}><Gift size={80} /></div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981", marginBottom: 4, position: "relative", zIndex: 1, letterSpacing: "-0.5px" }}>₹{profile?.total_earned ?? 0}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", position: "relative", zIndex: 1 }}>Total Earned</div>
          </div>
          
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", border: "1px solid #f1f5f9" }}>
            <div style={{ position: "absolute", top: -10, right: -10, color: "#3b82f6", opacity: 0.05 }}><Activity size={80} /></div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6", marginBottom: 4, position: "relative", zIndex: 1, letterSpacing: "-0.5px" }}>₹{profile?.wallet_balance ?? 0}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", position: "relative", zIndex: 1 }}>Pending</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 12px" }}>Quick Actions</h3>
        <div style={{ background: "#fff", borderRadius: 20, padding: "8px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: 24 }}>
          
          <Link href="/" style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", marginRight: 16 }}>
              <Gift size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Browse Tasks</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#10b981", fontWeight: 700 }}>
              Earn Now <ArrowRight size={14} />
            </div>
          </Link>

          <Link href="/user/history" style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", marginRight: 16 }}>
              <Clock size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>View Task History</div>
            <ArrowRight size={20} color="#cbd5e1" />
          </Link>

          <Link href="/user/withdraw/history" style={{ display: "flex", alignItems: "center", padding: "16px 0", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", marginRight: 16 }}>
              <ArrowUpRight size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Withdrawal History</div>
            <ArrowRight size={20} color="#cbd5e1" />
          </Link>
          
        </div>
        {/* Transaction History */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "32px 0 12px 12px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Transaction History</h3>
        </div>
        
        <div style={{ background: "#fff", borderRadius: 24, padding: "8px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: 24, border: "1px solid #f1f5f9" }}>
          {transactions.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              No transactions yet.
            </div>
          ) : (
            transactions.map((tx, idx) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: idx === transactions.length - 1 ? "none" : "1px solid #f8fafc" }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: tx.type === 'credit' ? "#ecfdf5" : "#fef2f2", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  color: tx.type === 'credit' ? "#10b981" : "#ef4444", 
                  marginRight: 16 
                }}>
                  {tx.type === 'credit' ? <Sparkles size={20} /> : <ArrowRight size={20} style={{ transform: "rotate(90deg)" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{tx.description}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{new Date(tx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {new Date(tx.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tx.type === 'credit' ? "#10b981" : "#0f172a" }}>
                  {tx.type === 'credit' ? "+" : "-"}₹{tx.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
