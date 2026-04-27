import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        <Link href="/user/account" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#64748b", textDecoration: "none", fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={20} /> Back to Account
        </Link>
        
        <div style={{ background: "#fff", padding: "32px 24px", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
              <Shield size={24} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>Privacy Policy</h1>
          </div>
          
          <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
            <p style={{ marginBottom: 16 }}>At TBS GAMER, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
            
            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>1. Information We Collect</h3>
            <p style={{ marginBottom: 16 }}>We collect information you provide directly to us, including your name, email address, phone number, and payment information (such as UPI IDs or email addresses for rewards) when you request withdrawals.</p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>2. How We Use Your Information</h3>
            <div style={{ marginBottom: 16 }}>We use the collected information to:
              <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                <li>Process your tasks and verify your proofs.</li>
                <li>Fulfill your payout requests and distribute rewards.</li>
                <li>Communicate with you regarding your account and our services.</li>
                <li>Prevent fraud and ensure platform integrity.</li>
              </ul>
            </div>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>3. Data Security</h3>
            <p style={{ marginBottom: 16 }}>We implement appropriate security measures to protect your personal information. However, no electronic transmission or storage system is 100% secure, and we cannot guarantee absolute security.</p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>4. Sharing of Information</h3>
            <p style={{ marginBottom: 16 }}>We do not sell or rent your personal data to third parties. We may only share information when required by law or to protect our legal rights.</p>
            
            <p style={{ marginTop: 32, fontSize: 13, color: "#94a3b8" }}>Last Updated: April 2026</p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
