"use client";
import { useActionState } from "react";
import Link from "next/link";
import { userSignupAction } from "@/lib/actions";
import { Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export default function UserSignup() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await userSignupAction(formData);
  }, null);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#fff", padding: "60px 24px 40px", borderRadius: "0 0 40px 40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", textAlign: "center", marginBottom: 32, position: "relative" }}>
        <Link href="/" style={{ position: "absolute", top: 20, left: 20, width: 40, height: 40, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", textDecoration: "none" }}>
          <ArrowRight size={20} style={{ transform: "rotate(180deg)" }} />
        </Link>
        <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 24, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)", transform: "rotate(-5deg)" }}>
          <Sparkles size={40} style={{ transform: "rotate(5deg)" }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-1px" }}>Join TBS GAMER</h1>
        <p style={{ color: "#64748b", fontSize: 16, margin: 0 }}>Create your account to start earning today</p>
      </div>

      <div style={{ padding: "0 24px 40px", maxWidth: 480, margin: "0 auto" }}>
        {state?.error && <div className="auth-error"><AlertCircle size={18} /> {state.error}</div>}
        
        <form action={formAction}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-input" placeholder="Your name" autoFocus required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" className="form-input" type="email" placeholder="you@email.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ padding: "12px 16px", background: "#f1f5f9", borderRadius: 12, border: "1px solid #e2e8f0", color: "#64748b", fontWeight: 600 }}>+91</div>
              <input name="phone" className="form-input" style={{ flex: 1 }} type="tel" placeholder="00000 00000" minLength={10} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" className="form-input" type="password" placeholder="Min 6 characters" minLength={6} required />
          </div>
          
          <div style={{ height: 8 }} />
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24, padding: "0 4px" }}>
            <input type="checkbox" id="terms" required style={{ marginTop: 4, width: 16, height: 16, accentColor: "#10b981", cursor: "pointer" }} />
            <label htmlFor="terms" style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, cursor: "pointer" }}>
              By creating an account, you agree to our <Link href="/user/account/terms" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}>Terms & Conditions</Link> and <Link href="/user/account/privacy-policy" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>.
            </label>
          </div>
          
          <button type="submit" className="btn-big btn-green-big" disabled={isPending}>
            {isPending ? "Creating account..." : <>Create Account <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", padding: "24px 0 40px", fontSize: 15, color: "#64748b" }}>
        Already have an account? <Link href="/user/login" style={{ color: "#10b981", fontWeight: 700, textDecoration: "none", marginLeft: 4 }}>Login</Link>
      </div>
    </div>
  );
}
