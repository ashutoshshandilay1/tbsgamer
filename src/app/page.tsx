import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AppCard from "@/components/AppCard";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions";
import { Star, Camera, MessageCircle, Wallet, Layers, Sparkles, User } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: apps } = await supabase
    .from("apps")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const user = await getUserProfile();
  if (!user) {
    redirect("/user/login");
  }

  let submittedAppIds = new Set<number>();
  const { data: proofs } = await supabase.from("proofs").select("app_id").eq("user_id", user.id);
  if (proofs) submittedAppIds = new Set(proofs.map(p => p.app_id));

  const count = apps?.length || 0;
  const maxEarn = count * 100;

  const availableApps = apps?.filter(app => !submittedAppIds.has(app.id)) || [];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 24px" }}>
        {/* Hero */}
        <div className="hero-banner">
          <div className="hero-badge">
            <Sparkles size={14} fill="#fff" /> Limited Time Offer
          </div>
          
          <h1>Earn Upto <span className="text-highlight">₹5-100</span><br/>Per Rating</h1>
          <p>Rate apps on Google Play & get paid instantly via UPI</p>
          
          <div className="hero-banner-stats">
            <div className="hero-stat-pill">
              <div className="hero-stat-pill-icon"><Layers size={18} /></div>
              <div>
                <div className="hero-stat-pill-val">{count}</div>
                <div className="hero-stat-pill-lbl">Apps</div>
              </div>
            </div>
            <div className="hero-stat-pill">
              <div className="hero-stat-pill-icon"><Wallet size={18} /></div>
              <div>
                <div className="hero-stat-pill-val">₹{maxEarn}</div>
                <div className="hero-stat-pill-lbl">Max Earn</div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>How It Works</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#fff", padding: 16, borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", border: "1px solid #f1f5f9" }}>
              <div style={{ position: "absolute", top: -8, right: -8, fontSize: 48, fontWeight: 900, color: "#f8fafc", zIndex: 0 }}>1</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Star size={18} /></div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Rate App</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Give 5 stars</div>
              </div>
            </div>
            
            <div style={{ background: "#fff", padding: 16, borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", border: "1px solid #f1f5f9" }}>
              <div style={{ position: "absolute", top: -8, right: -8, fontSize: 48, fontWeight: 900, color: "#f8fafc", zIndex: 0 }}>2</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Camera size={18} /></div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Screenshot</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Snap proof</div>
              </div>
            </div>
            
            <div style={{ background: "#fff", padding: 16, borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", border: "1px solid #f1f5f9" }}>
              <div style={{ position: "absolute", top: -8, right: -8, fontSize: 48, fontWeight: 900, color: "#f8fafc", zIndex: 0 }}>3</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><MessageCircle size={18} /></div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Submit</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Send on app</div>
              </div>
            </div>
            
            <div style={{ background: "#fff", padding: 16, borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", border: "1px solid #f1f5f9" }}>
              <div style={{ position: "absolute", top: -8, right: -8, fontSize: 48, fontWeight: 900, color: "#f8fafc", zIndex: 0 }}>4</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Wallet size={18} /></div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Get Paid</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Instant UPI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Apps */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Available Apps ({availableApps.length})</div>
          {availableApps.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 24, border: "2px dashed #e2e8f0" }}>
              <div style={{ width: 64, height: 64, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#94a3b8" }}>
                <Layers size={32} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>No apps available right now.</p>
              <p style={{ fontSize: 14, color: "#64748b" }}>More apps and tasks coming soon!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {availableApps.map((app) => <AppCard key={app.id} app={app} />)}
            </div>
          )}
        </div>

        <div style={{ padding: "16px 14px", textAlign: "center", fontSize: 12, color: "#64748b" }}>
          © 2026 TBS GAMER
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
