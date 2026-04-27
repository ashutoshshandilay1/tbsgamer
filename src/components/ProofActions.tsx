"use client";

import { useState } from "react";
import { approveProof, rejectProof } from "@/lib/actions";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function ProofActions({ proof }: { proof: any }) {
  const [amount, setAmount] = useState(proof.apps?.reward_amount || 0);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [errorText, setErrorText] = useState("");

  if (proof.status !== "pending") {
    return (
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9", fontSize: 13 }}>
        {proof.status === "approved" ? (
          <div style={{ color: "#10b981", fontWeight: "bold" }}>✅ Approved (Awarded: ₹{proof.awarded_amount})</div>
        ) : (
          <div style={{ color: "#ef4444", fontWeight: "bold" }}>
            ❌ Rejected
            <div style={{ color: "#64748b", fontWeight: "normal", marginTop: 4 }}>Reason: {proof.remark}</div>
          </div>
        )}
      </div>
    );
  }

  const confirmApprove = async () => {
    setLoading(true);
    setErrorText("");
    const res = await approveProof(proof.id, proof.user_id, Number(amount));
    setLoading(false);
    if (res.error) {
      setErrorText(res.error);
    } else {
      setModalType(null);
    }
  };

  const confirmReject = async () => {
    if (!remark.trim()) {
      setErrorText("Please provide a remark for rejection.");
      return;
    }
    setLoading(true);
    setErrorText("");
    const res = await rejectProof(proof.id, remark);
    setLoading(false);
    if (res.error) {
      setErrorText(res.error);
    } else {
      setModalType(null);
    }
  };

  return (
    <>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(Number(e.target.value))} 
            style={{ width: 80, padding: "8px", borderRadius: 8, border: "1px solid #e2e8f0" }}
            placeholder="₹"
          />
          <button 
            onClick={() => { setErrorText(""); setModalType('approve'); }}
            disabled={loading}
            style={{ flex: 1, background: "#10b981", color: "#fff", border: "none", padding: "8px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
          >
            Approve & Pay
          </button>
        </div>
        
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input 
            type="text" 
            value={remark} 
            onChange={e => setRemark(e.target.value)} 
            style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #e2e8f0" }}
            placeholder="Rejection remark..."
          />
          <button 
            onClick={() => { setErrorText(""); setModalType('reject'); }}
            disabled={loading}
            style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
          >
            Reject
          </button>
        </div>
      </div>

      {/* Custom Action Modal */}
      {modalType && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: modalType === 'approve' ? "#dcfce7" : "#fee2e2", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: modalType === 'approve' ? "#10b981" : "#ef4444" }}>
                {modalType === 'approve' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  {modalType === 'approve' ? 'Approve Proof' : 'Reject Proof'}
                </h2>
                <div style={{ fontSize: 13, color: "#64748b" }}>User: {proof.profiles?.full_name || proof.profiles?.email}</div>
              </div>
            </div>

            <p style={{ color: "#475569", fontSize: 14, marginBottom: 20 }}>
              {modalType === 'approve' 
                ? `Are you sure you want to approve this proof and instantly credit ₹${amount} to the user's wallet?` 
                : `Are you sure you want to reject this proof? The user will see your remark: "${remark || "No remark provided"}".`}
            </p>

            {errorText && (
              <div style={{ padding: "10px", background: "#fee2e2", color: "#ef4444", borderRadius: "8px", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={14} /> {errorText}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button 
                onClick={() => setModalType(null)} 
                className="btn" 
                style={{ background: "#f1f5f9", color: "#475569", border: "none" }}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={modalType === 'approve' ? confirmApprove : confirmReject} 
                className={`btn ${modalType === 'approve' ? 'btn-green' : 'btn-red'}`}
                disabled={loading}
              >
                {loading ? "Processing..." : (modalType === 'approve' ? "Confirm Approval" : "Confirm Rejection")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
