import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        <Link href="/user/account" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#64748b", textDecoration: "none", fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={20} /> Back to Account
        </Link>
        
        <div style={{ background: "#fff", padding: "32px 24px", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
              <Users size={24} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>About Us</h1>
          </div>
          
          <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
            <p style={{ marginBottom: 16, fontSize: 16, fontWeight: 600, color: "#3b82f6" }}>
              Welcome to TBS GAMER!
            </p>
            <p style={{ marginBottom: 16 }}>
              TBS GAMER is an innovative platform designed for gaming enthusiasts and everyday users who want to discover new applications while earning rewards for their time and feedback.
            </p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>Our Mission</h3>
            <p style={{ marginBottom: 16 }}>
              Our mission is to bridge the gap between app developers and real users. We help developers get honest ratings and feedback on their applications, while rewarding our dedicated user base with exciting perks, game codes, and wallet balances.
            </p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>How It Works</h3>
            <p style={{ marginBottom: 16 }}>
              The process is simple: explore the latest apps featured on our platform, download and rate them on the Play Store, and submit a screenshot as proof. Once our team verifies your genuine contribution, your virtual wallet is credited! 
            </p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>Honesty and Transparency</h3>
            <p style={{ marginBottom: 16 }}>
              While we strive to reward all genuine users, we maintain a strict policy against fraud. Please remember that all rewards are subject to manual verification and are not guaranteed. We prioritize users who provide authentic, high-quality engagement with our partner apps.
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
