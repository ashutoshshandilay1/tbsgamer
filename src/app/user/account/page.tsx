"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserProfile, userLogout } from "@/lib/actions";
import { User, Mail, Phone, Calendar, LogOut, ShieldCheck, ChevronRight, Settings, HelpCircle, FileText, Users, Shield, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then((data) => {
      if (!data) {
        router.push("/user/login");
        return;
      }
      setProfile(data as Profile);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await userLogout();
    router.push("/user/login");
  };

  if (loading) {
    return (
      <div className="dash-wrap">
        <div style={{ textAlign: "center", padding: "40px" }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />
      {/* Mobile-App Style Header */}
      <div style={{ background: "#fff", padding: "24px 20px 32px", borderRadius: "0 0 24px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", textAlign: "center", position: "relative" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 24px 0", color: "#0f172a" }}>Profile</h1>
        
        <div style={{ width: 88, height: 88, margin: "0 auto 16px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)", border: "4px solid #fff" }}>
          {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase()}
        </div>
        
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>{profile?.full_name || "TBS User"}</h2>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 12 }}>{profile?.email}</div>
        
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ecfdf5", color: "#059669", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
          <ShieldCheck size={16} /> Verified Member
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 12px" }}>Account Details</h3>
        <div style={{ background: "#fff", borderRadius: 20, padding: "8px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: 24 }}>
          
          <div style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", marginRight: 16 }}>
              <Phone size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{profile?.phone || "Not provided"}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Phone Number</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", padding: "16px 0" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", marginRight: 16 }}>
              <Calendar size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Joined Date</div>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 12px" }}>More Options</h3>
        <div style={{ background: "#fff", borderRadius: 20, padding: "8px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: 32 }}>
          
          <Link href="/user/contact" style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", marginRight: 16 }}>
              <HelpCircle size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Help & Support</div>
            <ChevronRight size={20} color="#cbd5e1" />
          </Link>

          <Link href="/user/account/about-us" style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", marginRight: 16 }}>
              <Users size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>About Us</div>
            <ChevronRight size={20} color="#cbd5e1" />
          </Link>

          <Link href="/user/account/privacy-policy" style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", marginRight: 16 }}>
              <Shield size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Privacy Policy</div>
            <ChevronRight size={20} color="#cbd5e1" />
          </Link>

          <Link href="/user/account/disclaimer" style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", marginRight: 16 }}>
              <AlertTriangle size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Disclaimer</div>
            <ChevronRight size={20} color="#cbd5e1" />
          </Link>

          <Link href="/user/account/terms" style={{ display: "flex", alignItems: "center", padding: "16px 0", cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706", marginRight: 16 }}>
              <FileText size={18} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Terms & Conditions</div>
            <ChevronRight size={20} color="#cbd5e1" />
          </Link>
        </div>

        <button 
          onClick={handleLogout}
          style={{ width: "100%", background: "#fff", color: "#ef4444", border: "1px solid #fee2e2", padding: "16px", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 16, fontWeight: 700, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)", cursor: "pointer" }}
        >
          <LogOut size={20} /> Logout
        </button>

      </div>
      <BottomNav />
    </div>
  );
}
