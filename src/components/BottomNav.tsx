"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Wallet, User, Clock, Lock } from "lucide-react";
import { getUserProfile } from "@/lib/actions";

const tabs = [
  { href: "/", icon: Home, label: "Home", requiresAuth: false },
  { href: "/user/dashboard", icon: Wallet, label: "Wallet", requiresAuth: true },
  { href: "/user/history", icon: Clock, label: "History", requiresAuth: true },
  { href: "/user/account", icon: User, label: "Account", requiresAuth: true },
];

export default function BottomNav() {
  const path = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    getUserProfile().then(data => setIsLoggedIn(!!data));
  }, []);

  return (
    <>
      <nav className="bottom-nav">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = path === t.href || (t.href !== "/" && path.startsWith(t.href));
          const locked = t.requiresAuth && isLoggedIn === false;

          if (locked) {
            return (
              <button
                key={t.href}
                className={`bottom-nav-item`}
                style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5 }}
                onClick={() => setShowPrompt(true)}
              >
                <div className="nav-icon-wrap" style={{ position: "relative" }}>
                  <Icon size={24} strokeWidth={2} />
                  <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, background: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lock size={8} color="#fff" strokeWidth={3} />
                  </div>
                </div>
                {t.label}
              </button>
            );
          }

          return (
            <Link
              key={t.href}
              href={t.href}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
            >
              <div className="nav-icon-wrap">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {t.label}
            </Link>
          );
        })}
      </nav>

      {/* Login Prompt Modal */}
      {showPrompt && (
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9999 }}
          onClick={() => setShowPrompt(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 600, textAlign: "center" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 9999, margin: "0 auto 24px" }} />
            <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 20, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)" }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Login Required</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Login to access your wallet, history, and account features.
            </p>
            <Link
              href="/user/login"
              style={{ display: "block", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", padding: "14px", borderRadius: 16, fontWeight: 800, fontSize: 15, textDecoration: "none", marginBottom: 10 }}
            >
              Login
            </Link>
            <Link
              href="/user/signup"
              style={{ display: "block", background: "#f1f5f9", color: "#0f172a", padding: "14px", borderRadius: 16, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
