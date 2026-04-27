"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { submitSupportTicket } from "@/lib/actions";
import { ArrowLeft, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    setError("");
    
    const res = await submitSupportTicket(message);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 24px" }}>
        <Link href="/user/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", textDecoration: "none", fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <div style={{ background: "#fff", padding: 32, borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ width: 64, height: 64, background: "#fef2f2", color: "#ef4444", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <MessageSquare size={32} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Contact Support</h1>
          <p style={{ color: "#64748b", marginBottom: 32, lineHeight: 1.6 }}>Describe your problem or issue in detail below. Our team will review your message and reply to your registered email address.</p>

          {success ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 20 }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Message Sent!</h2>
              <p style={{ color: "#64748b", fontSize: 14 }}>We have received your issue and will get back to you via email shortly.</p>
              <button onClick={() => setSuccess(false)} className="btn btn-outline" style={{ marginTop: 24 }}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div style={{ background: "#fee2e2", color: "#ef4444", padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>{error}</div>}
              
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea 
                  className="form-input" 
                  rows={6} 
                  placeholder="Tell us what's going wrong..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{ resize: "vertical" }}
                ></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="btn-big btn-green-big" style={{ width: "100%" }}>
                {loading ? "Sending..." : "Submit Issue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
