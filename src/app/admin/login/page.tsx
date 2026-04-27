"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    return await loginAction(email, password);
  }, null);

  return (
    <div className="auth-screen" style={{ justifyContent: "center" }}>
      <div className="auth-top" style={{ padding: "0 0 40px" }}>
        <div className="auth-logo" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", boxShadow: "0 12px 24px rgba(15, 23, 42, 0.3)" }}>
          <Lock size={32} />
        </div>
        <h1 className="auth-title">Admin Access</h1>
        <p className="auth-sub">Enter the admin email and password to continue</p>
      </div>

      <form action={formAction} className="auth-form" style={{ flex: "none" }}>
        {state?.error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            {state.error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Admin Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="admin@email.com"
            className="form-input"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Admin Password</label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          className="btn-big" 
          disabled={isPending}
          style={{ background: "#0f172a", color: "#fff", width: "100%", padding: "16px", border: "none", marginTop: "16px" }}
        >
          {isPending ? "Verifying..." : "Login to Admin"}
        </button>
      </form>
    </div>
  );
}
