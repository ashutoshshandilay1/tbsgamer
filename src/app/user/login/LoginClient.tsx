"use client";
import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { userLoginAction } from "@/lib/actions";
import { Wallet, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";

export default function LoginClient() {
  const [state, formAction, isPending] = useActionState(async (prevState: unknown, formData: FormData) => {
    return await userLoginAction(formData);
  }, null);

  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    if ((state as { error?: string } | null)?.error?.startsWith("Banned:")) {
      setBanReason((state as { error: string }).error.replace("Banned: ", ""));
      setBanModalOpen(true);
    }
  }, [(state as { error?: string } | null)?.error]);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#fff", padding: "60px 24px 40px", borderRadius: "0 0 40px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", textAlign: "center", marginBottom: 32, position: "relative" }}>
        <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 24, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)", transform: "rotate(-5deg)" }}>
          <Wallet size={40} style={{ transform: "rotate(5deg)" }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-1px" }}>Welcome Back</h1>
        <p style={{ color: "#64748b", fontSize: 16, margin: 0 }}>Login to your TBS GAMER account</p>
      </div>

      <div style={{ padding: "0 24px 40px", maxWidth: 480, margin: "0 auto" }}>
        {(state as { error?: string } | null)?.error && !(state as { error?: string }).error!.startsWith("Banned:") && (
          <div className="auth-error"><AlertCircle size={18} /> {(state as { error: string }).error}</div>
        )}
        <form action={formAction}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" className="form-input" type="email" placeholder="you@email.com" autoFocus required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" className="form-input" type="password" placeholder="Your password" required />
          </div>
          <div style={{ height: 8 }} />
          <button type="submit" className="btn-big btn-green-big" disabled={isPending}>
            {isPending ? "Logging in..." : <>Login <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", padding: "24px 0", fontSize: 15, color: "#64748b" }}>
        No account? <Link href="/user/signup" style={{ color: "#10b981", fontWeight: 700, textDecoration: "none", marginLeft: 4 }}>Sign up free</Link>
      </div>

      {/* Banned Modal */}
      {banModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", width: "90%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: "#fee2e2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <ShieldAlert size={32} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>Account Banned</h2>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>
              Your account has been suspended by the administrator for the following reason:
            </p>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "12px", color: "#0f172a", fontWeight: 600, fontSize: 15, marginBottom: 24 }}>
              &quot;{banReason}&quot;
            </div>
            <button
              onClick={() => setBanModalOpen(false)}
              className="btn-big"
              style={{ background: "#0f172a", color: "#fff", width: "100%" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
