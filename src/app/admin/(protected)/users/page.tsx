"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toggleUserBan, adjustUserBalance } from "@/lib/actions";
import { ShieldBan, ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  wallet_balance: number;
  total_earned: number;
  created_at: string;
  is_banned?: boolean;
  ban_reason?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Custom Modal States
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banUserTarget, setBanUserTarget] = useState<Profile | null>(null);
  const [banReasonInput, setBanReasonInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Balance Modal States
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [balanceUserTarget, setBalanceUserTarget] = useState<Profile | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceType, setBalanceType] = useState<'add' | 'deduct'>('add');
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    // Initial fast fetch
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setUsers(data || []);
        setLoading(false);
      });

    // Real-time subscription — updates instantly on any change
    const channel = supabase
      .channel("profiles-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setUsers((prev) => [payload.new as Profile, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setUsers((prev) => prev.map((u) => u.id === (payload.new as Profile).id ? payload.new as Profile : u));
        } else if (payload.eventType === "DELETE") {
          setUsers((prev) => prev.filter((u) => u.id !== (payload.old as Profile).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  const totalBalance = users.reduce((s, u) => s + (u.wallet_balance || 0), 0);
  const totalEarned  = users.reduce((s, u) => s + (u.total_earned  || 0), 0);

  return (
    <>
      <div className="admin-hd">
        <h1>👥 Users</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#888", background: "#f0f0f0", padding: "4px 10px", borderRadius: 50, fontWeight: 600 }}>
            🟢 Live
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-box-label">Total Users</div>
          <div className="stat-box-val">{users.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Total Wallets</div>
          <div className="stat-box-val amber">₹{totalBalance}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Total Earned</div>
          <div className="stat-box-val green">₹{totalEarned}</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <input
          className="form-input"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="empty-state"><p>Loading users...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>{search ? "No users match your search." : "No users registered yet."}</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Wallet</th>
                <th>Earned</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: "#aaa", fontSize: 13 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{u.full_name || "—"}</td>
                  <td style={{ color: "#555" }}>{u.email}</td>
                  <td style={{ color: "#555" }}>{u.phone || "—"}</td>
                  <td style={{ fontWeight: 700, color: "#d97706" }}>₹{u.wallet_balance ?? 0}</td>
                  <td style={{ fontWeight: 700, color: "#16a34a" }}>₹{u.total_earned ?? 0}</td>
                  <td style={{ color: "#aaa", fontSize: 13 }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td>
                    {u.is_banned ? (
                      <span style={{ background: "#fee2e2", color: "#ef4444", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: "bold" }}>Banned</span>
                    ) : (
                      <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: "bold" }}>Active</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link 
                        href={`/admin/users/${u.id}`}
                        className="btn-sm"
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", fontSize: 12, background: "#e0f2fe", color: "#0284c7", border: "1px solid #bae6fd", textDecoration: "none" }}
                      >
                        <ExternalLink size={14} /> Profile
                      </Link>
                      <button
                        onClick={() => {
                          setBalanceUserTarget(u);
                          setBalanceAmount("");
                          setBalanceType('add');
                          setBalanceError("");
                          setBalanceModalOpen(true);
                        }}
                        className="btn-sm"
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", fontSize: 12, background: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0" }}
                      >
                        <Wallet size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setBanUserTarget(u);
                          setBanReasonInput(u.is_banned ? "" : "Violation of terms");
                          setBanModalOpen(true);
                        }}
                        className={`btn-sm ${u.is_banned ? "btn-green" : "btn-red"}`}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", fontSize: 12 }}
                      >
                        {u.is_banned ? <><ShieldCheck size={14} /> Unban</> : <><ShieldBan size={14} /> Ban</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ban/Unban Modal */}
      {banModalOpen && banUserTarget && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>
              {banUserTarget.is_banned ? "Unban User" : "Ban User"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              {banUserTarget.is_banned 
                ? `Are you sure you want to unban ${banUserTarget.full_name || banUserTarget.email}?` 
                : `Are you sure you want to ban ${banUserTarget.full_name || banUserTarget.email}? They will be immediately logged out.`}
            </p>

            {!banUserTarget.is_banned && (
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Ban Reason (Shown to user)</label>
                <input 
                  className="form-input" 
                  autoFocus
                  value={banReasonInput} 
                  onChange={(e) => setBanReasonInput(e.target.value)} 
                  placeholder="e.g. Submitting fake screenshots"
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button 
                onClick={() => setBanModalOpen(false)} 
                className="btn" 
                style={{ background: "#f1f5f9", color: "#475569", border: "none" }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setIsSubmitting(true);
                  await toggleUserBan(banUserTarget.id, !banUserTarget.is_banned, banReasonInput);
                  setBanModalOpen(false);
                  setIsSubmitting(false);
                }} 
                className={`btn ${banUserTarget.is_banned ? "btn-green" : "btn-red"}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : (banUserTarget.is_banned ? "Yes, Unban" : "Confirm Ban")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {balanceModalOpen && balanceUserTarget && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: "#f1f5f9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a" }}>
                <Wallet size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Adjust Balance</h2>
                <div style={{ fontSize: 13, color: "#64748b" }}>{balanceUserTarget.full_name || balanceUserTarget.email}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, background: "#f8fafc", padding: "12px", borderRadius: "12px", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Current Wallet</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#d97706" }}>₹{balanceUserTarget.wallet_balance}</div>
              </div>
            </div>

            {balanceError && (
              <div style={{ padding: "8px 12px", background: "#fee2e2", color: "#ef4444", borderRadius: "8px", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={14} /> {balanceError}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button 
                onClick={() => setBalanceType('add')}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid", borderColor: balanceType === 'add' ? "#10b981" : "#e2e8f0", background: balanceType === 'add' ? "#ecfdf5" : "#fff", color: balanceType === 'add' ? "#059669" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600, fontSize: 14 }}
              >
                <ArrowUpRight size={16} /> Add Funds
              </button>
              <button 
                onClick={() => setBalanceType('deduct')}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid", borderColor: balanceType === 'deduct' ? "#ef4444" : "#e2e8f0", background: balanceType === 'deduct' ? "#fef2f2" : "#fff", color: balanceType === 'deduct' ? "#dc2626" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600, fontSize: 14 }}
              >
                <ArrowDownRight size={16} /> Deduct
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Amount (₹)</label>
              <input 
                className="form-input" 
                type="number"
                min="1"
                autoFocus
                value={balanceAmount} 
                onChange={(e) => setBalanceAmount(e.target.value)} 
                placeholder="Enter amount to adjust"
              />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button 
                onClick={() => setBalanceModalOpen(false)} 
                className="btn" 
                style={{ background: "#f1f5f9", color: "#475569", border: "none" }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const amt = parseInt(balanceAmount);
                  if (isNaN(amt) || amt <= 0) {
                    setBalanceError("Please enter a valid positive amount.");
                    return;
                  }
                  
                  setIsSubmitting(true);
                  setBalanceError("");
                  
                  const res = await adjustUserBalance(balanceUserTarget.id, amt, balanceType);
                  if (res.error) {
                    setBalanceError(res.error);
                  } else {
                    setBalanceModalOpen(false);
                  }
                  setIsSubmitting(false);
                }} 
                className="btn"
                style={{ background: "#0f172a", color: "#fff" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
