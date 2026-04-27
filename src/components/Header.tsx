"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserProfile } from "@/lib/actions";
import { Sparkles, Wallet, User } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUserProfile().then((data) => setUser(data));
  }, []);

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.05)", padding: "12px 20px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Logo Section */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px -4px rgba(16, 185, 129, 0.4)" }}>
            <Sparkles size={20} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#0f172a", letterSpacing: "-0.5px" }}>
            TBS <span style={{ color: "#10b981" }}>GAMER</span>
          </div>
        </Link>

        {/* Action Section */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <div style={{ background: "#ecfdf5", color: "#059669", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, border: "1px solid #d1fae5" }}>
                <Wallet size={16} /> ₹{user.wallet_balance || 0}
              </div>
              <Link href="/user/account" style={{ width: 36, height: 36, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", border: "1px solid #e2e8f0", textDecoration: "none" }}>
                <User size={20} />
              </Link>
            </>
          ) : (
            <Link href="/user/login" style={{ background: "#0f172a", color: "#fff", padding: "8px 20px", borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)" }}>
              Login
            </Link>
          )}
        </div>
        
      </div>
    </nav>
  );
}
