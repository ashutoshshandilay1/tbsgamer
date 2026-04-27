"use client";

import { useState } from "react";
import { ShieldBan, ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";
import { toggleUserBan, adjustUserBalance } from "@/lib/actions";

type ProfileActionsProps = {
  profile: {
    id: string;
    full_name: string;
    email: string;
    is_banned: boolean;
    wallet_balance: number;
  };
};

export default function UserProfileActions({ profile }: ProfileActionsProps) {
  // Ban Modal States
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReasonInput, setBanReasonInput] = useState("");
  const [isBanSubmitting, setIsBanSubmitting] = useState(false);

  // Balance Modal States
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceType, setBalanceType] = useState<'add' | 'deduct'>('add');
  const [balanceError, setBalanceError] = useState("");
  const [isBalanceSubmitting, setIsBalanceSubmitting] = useState(false);

  return (
    <>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => {
            setBalanceAmount("");
            setBalanceType('add');
            setBalanceError("");
            setBalanceModalOpen(true);
          }}
          className="btn"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0" }}
        >
          <Wallet size={16} /> Edit Balance
        </button>
        <button
          onClick={() => {
            setBanReasonInput(profile.is_banned ? "" : "Violation of terms");
            setBanModalOpen(true);
          }}
          className={`btn ${profile.is_banned ? "btn-green" : "btn-red"}`}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          {profile.is_banned ? <><ShieldCheck size={16} /> Unban User</> : <><ShieldBan size={16} /> Ban User</>}
        </button>
      </div>

      {/* Ban/Unban Modal */}
      {banModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>
              {profile.is_banned ? "Unban User" : "Ban User"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              {profile.is_banned 
                ? `Are you sure you want to unban ${profile.full_name || profile.email}?` 
                : `Are you sure you want to ban ${profile.full_name || profile.email}? They will be immediately logged out.`}
            </p>

            {!profile.is_banned && (
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
                disabled={isBanSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setIsBanSubmitting(true);
                  await toggleUserBan(profile.id, !profile.is_banned, banReasonInput);
                  setBanModalOpen(false);
                  setIsBanSubmitting(false);
                }} 
                className={`btn ${profile.is_banned ? "btn-green" : "btn-red"}`}
                disabled={isBanSubmitting}
              >
                {isBanSubmitting ? "Processing..." : (profile.is_banned ? "Yes, Unban" : "Confirm Ban")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {balanceModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: "#f1f5f9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a" }}>
                <Wallet size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Adjust Balance</h2>
                <div style={{ fontSize: 13, color: "#64748b" }}>{profile.full_name || profile.email}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, background: "#f8fafc", padding: "12px", borderRadius: "12px", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Current Wallet</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#d97706" }}>₹{profile.wallet_balance}</div>
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
                disabled={isBalanceSubmitting}
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
                  
                  setIsBalanceSubmitting(true);
                  setBalanceError("");
                  
                  const res = await adjustUserBalance(profile.id, amt, balanceType);
                  if (res.error) {
                    setBalanceError(res.error);
                  } else {
                    setBalanceModalOpen(false);
                  }
                  setIsBalanceSubmitting(false);
                }} 
                className="btn"
                style={{ background: "#0f172a", color: "#fff" }}
                disabled={isBalanceSubmitting}
              >
                {isBalanceSubmitting ? "Processing..." : "Confirm Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
