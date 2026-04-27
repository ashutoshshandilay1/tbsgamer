"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { processWithdrawal } from "@/lib/actions";
import { Check, X } from "lucide-react";

export default function WithdrawalActions({ request }: { request: any }) {
  const [loading, setLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarkInput, setRemarkInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const executeAction = async (action: 'approve' | 'reject') => {
    setLoading(true);
    const res = await processWithdrawal(request.id, action, remarkInput);
    if (res.error) {
      alert("Error: " + res.error); // We can still use a simple alert for deep errors, or just show it in the UI. 
      // Actually better to just log or show a tiny toast, but alert is fine for server errors.
    }
    setLoading(false);
    setShowApproveModal(false);
    setShowRejectModal(false);
    setRemarkInput("");
  };

  if (request.status !== 'pending') return null;

  return (
    <>
      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <button 
          onClick={() => setShowApproveModal(true)}
          disabled={loading}
          className="btn" 
          style={{ background: "#10b981", color: "#fff", flex: 1, justifyContent: "center" }}
        >
          {loading ? "..." : <><Check size={16} /> Approve</>}
        </button>
        <button 
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          className="btn btn-outline" 
          style={{ color: "#ef4444", borderColor: "#ef4444", flex: 1, justifyContent: "center" }}
        >
          {loading ? "..." : <><X size={16} /> Reject & Refund</>}
        </button>
      </div>

      {/* APPROVE MODAL */}
      {mounted && showApproveModal && createPortal(
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ padding: 24, width: "100%", maxWidth: 400, margin: 0 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Approve Payout</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>Enter the Redeem Code or any admin remark. This will be visible to the user.</p>
            
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. ABCD-1234-EFGH-5678" 
              value={remarkInput}
              onChange={(e) => setRemarkInput(e.target.value)}
              style={{ marginBottom: 20 }}
            />
            
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowApproveModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
              <button onClick={() => executeAction('approve')} disabled={loading} className="btn" style={{ background: "#10b981", color: "#fff", flex: 1, justifyContent: "center" }}>
                {loading ? "Saving..." : "Approve Payout"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* REJECT MODAL */}
      {mounted && showRejectModal && createPortal(
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ padding: 24, width: "100%", maxWidth: 400, margin: 0 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#ef4444", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><X size={20}/> Reject & Refund</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Are you sure you want to reject this request? The user's balance will be automatically refunded.</p>
            
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowRejectModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
              <button onClick={() => executeAction('reject')} disabled={loading} className="btn" style={{ background: "#ef4444", color: "#fff", flex: 1, justifyContent: "center", border: "none" }}>
                {loading ? "Rejecting..." : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
