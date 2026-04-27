"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, User, Clock } from "lucide-react";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/user/dashboard", icon: Wallet, label: "Wallet" },
  { href: "/user/history", icon: Clock, label: "History" },
  { href: "/user/account", icon: User, label: "Account" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = path === t.href || (t.href !== "/" && path.startsWith(t.href));
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
  );
}
