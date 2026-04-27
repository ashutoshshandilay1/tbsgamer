"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getUserProfile, requestWithdrawal } from "@/lib/actions";
import { ArrowLeft, Wallet, AlertCircle, CheckCircle2, ChevronRight, Gift } from "lucide-react";

export default function WithdrawPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getUserProfile().then(async (data) => {
      if (!data) { router.push("/user/login"); return; }
      setProfile(data);
      
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        
        const { data: cats } = await supabase.from("withdrawal_categories").select("*").eq("active", true).order("id");
        if (cats) setCategories(cats);
        
        const { data: opts } = await supabase.from("withdrawal_options").select("*").order("amount", { ascending: true });
        if (opts) setOptions(opts);
      } catch (err) {
        console.error("Setup incomplete", err);
      }
      setLoading(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption || !userInput) return;
    setSubmitting(true);
    setError("");
    
    const res = await requestWithdrawal(selectedOption.id, userInput);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      // update local balance
      setProfile(prev => ({ ...prev, wallet_balance: prev.wallet_balance - selectedOption.amount }));
    }
    setSubmitting(false);
  };

  if (loading) return null;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 24px" }}>
        <Link href="/user/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", textDecoration: "none", fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <div style={{ background: "#0f172a", borderRadius: 24, padding: "24px", color: "#fff", marginBottom: 32, boxShadow: "0 20px 40px -12px rgba(15, 23, 42, 0.3)" }}>
          <div style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Available Balance</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#10b981" }}>₹{profile.wallet_balance}</div>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <div style={{ width: 80, height: 80, background: "#dcfce7", color: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Request Sent!</h2>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 32 }}>Your withdrawal request has been submitted to the admin for processing. It will be reviewed shortly.</p>
            <Link href="/user/dashboard" className="btn-big btn-green-big" style={{ display: "inline-block", textDecoration: "none" }}>
              Return to Dashboard
            </Link>
          </div>
        ) : !selectedCategory ? (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Select Reward Type</h2>
            {categories.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", background: "#fff", borderRadius: 20 }}>
                Withdrawal methods are currently unavailable.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {categories.map(c => (
                  <div key={c.id} onClick={() => setSelectedCategory(c)} style={{ background: "#fff", padding: "20px", borderRadius: 20, display: "flex", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: 48, height: 48, background: c.image_url ? "transparent" : "#f1f5f9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", marginRight: 16, overflow: "hidden" }}>
                      {c.image_url ? <img src={c.image_url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Gift size={24} />}
                    </div>
                    <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{c.name}</div>
                    <ChevronRight size={20} color="#cbd5e1" />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
               <button onClick={() => {setSelectedCategory(null); setSelectedOption(null)}} style={{ background: "none", border: "none", color: "#3b82f6", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center" }}>
                 <ArrowLeft size={16} style={{marginRight: 4}}/> Change Type
               </button>
            </div>
            
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{selectedCategory.name}</h2>
            <p style={{ color: "#64748b", marginBottom: 24 }}>Select the amount you want to withdraw.</p>
            
            {error && <div style={{ background: "#fee2e2", color: "#ef4444", padding: "12px 16px", borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={18}/> {error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {options.filter(o => o.category_id === selectedCategory.id).map(o => (
                <div 
                  key={o.id} 
                  onClick={() => setSelectedOption(o)}
                  style={{ 
                    background: selectedOption?.id === o.id ? "#10b981" : "#fff", 
                    color: selectedOption?.id === o.id ? "#fff" : "#0f172a",
                    padding: "20px", borderRadius: 16, textAlign: "center", cursor: "pointer", 
                    border: selectedOption?.id === o.id ? "2px solid #10b981" : "2px solid #e2e8f0",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 900 }}>₹{o.amount}</div>
                </div>
              ))}
            </div>

            {selectedOption && (
              <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 24, borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                    {selectedCategory.input_label}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder={selectedCategory.input_placeholder || "Enter details here"}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    style={{ width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", outline: "none" }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting || profile.wallet_balance < selectedOption.amount}
                  className="btn-big btn-green-big" 
                  style={{ width: "100%", opacity: profile.wallet_balance < selectedOption.amount ? 0.5 : 1 }}
                >
                  {submitting ? "Processing..." : profile.wallet_balance < selectedOption.amount ? "Insufficient Balance" : `Withdraw ₹${selectedOption.amount}`}
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}
