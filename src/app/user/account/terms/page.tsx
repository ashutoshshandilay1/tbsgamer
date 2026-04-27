import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 100 }}>
      <Header />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        <Link href="/user/account" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#64748b", textDecoration: "none", fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={20} /> Back to Account
        </Link>
        
        <div style={{ background: "#fff", padding: "32px 24px", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={24} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>Terms & Conditions</h1>
          </div>
          
          <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
            <p style={{ marginBottom: 16 }}>Welcome to TBS GAMER. By using our application, you agree to comply with and be bound by the following terms and conditions.</p>
            
            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>1. User Accounts and Verification</h3>
            <p style={{ marginBottom: 16 }}>You must provide accurate and complete information when creating an account. Duplicate accounts, bots, or exploiting the system will result in immediate suspension and forfeiture of all accumulated balance.</p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>2. Rewards Are Not Guaranteed</h3>
            <p style={{ marginBottom: 16, padding: "12px 16px", background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontWeight: 600 }}>
              IMPORTANT: Participating in tasks, rating apps, or accumulating a virtual balance does NOT guarantee a payout. All payouts and rewards are entirely at the discretion of the TBS GAMER administration. Rewards can be rejected, altered, or canceled at any time without prior notice.
            </p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>3. Task Verification</h3>
            <p style={{ marginBottom: 16 }}>All submitted proofs (screenshots) are manually verified. Submitting fake, altered, or previously used screenshots will lead to rejection of the task and potential account ban.</p>

            <h3 style={{ fontSize: 16, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>4. Modifications to the Service</h3>
            <p style={{ marginBottom: 16 }}>We reserve the right to modify or discontinue any part of our service, including the reward amounts and payout methods, at any time without liability to users.</p>
            
            <p style={{ marginTop: 32, fontSize: 13, color: "#94a3b8" }}>Last Updated: April 2026</p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
