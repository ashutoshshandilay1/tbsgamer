"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions";
import Link from "next/link";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const result = await loginAction(password);
    if (result?.error) { setError(result.error); setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>🔐 Admin Login</h1>
        <p>TBS GAMER — Admin Panel</p>
        {error && <div className="login-err">❌ {error}</div>}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
          </div>
          <button type="submit" className="btn btn-green" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: 13, color: "#888", textAlign: "center" }}>
          Are you a user?{" "}
          <Link href="/user/login" style={{ color: "#16a34a", fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
