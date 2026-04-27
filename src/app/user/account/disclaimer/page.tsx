import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        <Link href="/user/account" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#64748b", textDecoration: "none", fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={20} /> Back to Account
        </Link>
        
        <div style={{ background: "#fff", padding: "32px 24px", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "#fee2e2", color: "#ef4444", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={24} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>Disclaimer</h1>
          </div>
          
          <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
            <p style={{ marginBottom: 16, fontWeight: 700, color: "#0f172a" }}>Please read this disclaimer carefully before using the TBS GAMER platform.</p>
            
            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>No Guarantee of Earnings</h3>
            <p style={{ marginBottom: 16 }}>
              TBS GAMER is an entertainment and task-based platform. The virtual balances shown in your wallet are indicative of task completion but hold no real-world monetary value until explicitly approved for a payout by the administration. 
            </p>
            <p style={{ marginBottom: 16, padding: "12px 16px", background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", borderRadius: 8, fontWeight: 600 }}>
              We explicitly state that rewards are NOT guaranteed. Payouts are entirely subject to the availability of funds, successful manual verification of your tasks, and the absolute discretion of the TBS GAMER management team.
            </p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>Third-Party Applications</h3>
            <p style={{ marginBottom: 16 }}>
              Our platform may require you to download, rate, or interact with third-party applications. We do not own, endorse, or take responsibility for the content, safety, or practices of these third-party applications. You interact with them at your own risk.
            </p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>Account Termination</h3>
            <p style={{ marginBottom: 16 }}>
              The administration reserves the absolute right to suspend, terminate, or zero out the balance of any user account without prior notice or explanation, especially in cases of suspected fraud, use of multiple accounts, or violation of our Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
