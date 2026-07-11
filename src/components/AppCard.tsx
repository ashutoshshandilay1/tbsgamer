"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronRight, Smartphone, Copy, Check, Lock } from "lucide-react";
import Link from "next/link";
import { submitProof } from "@/lib/actions";

type App = {
  id: number; name: string; description: string;
  icon_url: string; play_store_url: string;
  reward_amount: number; active: boolean;
};

const S1 = [
  "This is absolutely the best earning app I have ever used.", 
  "I have tried so many fake applications before, but this one is completely real.", 
  "What a fantastic and wonderful experience using this application!", 
  "This app is a game changer for making some extra pocket money.", 
  "I was quite skeptical at first, but this application proved me completely wrong.",
  "Honestly, I never thought I would find a legitimate earning app until now.",
  "This is the most incredible and genuine reward platform on the internet.",
  "I am totally blown away by how amazing and real this application is.",
  "Out of all the apps I've downloaded, this is the only one that actually pays.",
  "This is undoubtedly a top-tier application that everyone needs to try today."
];
const S2 = [
  "It is a very good app and extremely easy to understand.", 
  "I actually got my redeem code within minutes of completing the simple tasks.", 
  "The payment is instant, reliable, and directly sent to my account.", 
  "I completed the basic tasks and instantly received my Google Play redeem code.", 
  "It is highly trustworthy and gives real rewards surprisingly fast.",
  "The tasks are incredibly simple, and the payouts are 100% guaranteed.",
  "I received my earnings almost instantly without any unnecessary delays.",
  "It takes barely any effort to use, and the rewards are totally worth it.",
  "Everything is clearly explained, making it super easy to earn free codes.",
  "The reward system is transparent, fair, and extremely fast."
];
const S3 = [
  "The interface is incredibly smooth, and the customer support is highly responsive.", 
  "There are no annoying bugs or crashes, just a completely seamless user experience.", 
  "I got my free redeem code today without any hidden charges or complex steps.", 
  "Everything works perfectly and I faced absolutely no issues while withdrawing my money.", 
  "The design is very user friendly and the payout system is totally flawless.",
  "Navigating through the app is a breeze, and it works perfectly on my phone.",
  "I've experienced zero lag or glitches, which makes the experience so much better.",
  "The withdrawal process is smooth as butter, with no confusing menus.",
  "Customer service is quick to help if you ever run into any minor issues.",
  "It's a beautifully designed application that focuses on speed and efficiency."
];
const S4 = [
  "I highly recommend everyone to download this and start earning daily rewards.", 
  "If you are looking for a legitimate way to earn online, look no further.", 
  "I have already told all my friends to download it and try it out immediately.", 
  "You should definitely install this application right now if you want real cash.", 
  "Don't waste time on other fake apps, this is exactly the one you need.",
  "I promise you will not regret downloading this fantastic earning tool.",
  "Share this with your family because everyone deserves to earn free rewards.",
  "Stop hesitating and hit the download button, you will thank me later.",
  "This is a must-have application for anyone who wants to earn money easily.",
  "I am going to keep using this every single day for my daily rewards."
];
const S5 = [
  "It is genuine, 100% trusted, and truly the most amazing application on the Play Store!", 
  "Huge thanks to the developers for making such an outstanding platform for all of us!", 
  "Keep up the excellent work, this is an absolute 5-star masterpiece for sure!", 
  "Thanks to the amazing team for creating such a wonderful app for everyday users.", 
  "I will use this app daily, thanks so much for the free redeem codes!",
  "A big thumbs up to the creators, this is exactly what the community needed!",
  "I am giving it 5 stars because it truly deserves every bit of praise!",
  "Thank you for finally making an app that respects our time and pays out!",
  "This has become my absolute favorite app, thank you for being so genuine!",
  "Best app of the year without a doubt, highly recommended to everyone!"
];

function generateReview() {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(S1)} ${pick(S2)} ${pick(S3)} ${pick(S4)} ${pick(S5)}`;
}

function Sheet({ app, onClose }: { app: App; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [review, setReview] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setReview(generateReview());
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res) => (img.onload = res));

      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > 600) {
        height = Math.round((height * 600) / width);
        width = 600;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      const base64 = canvas.toDataURL("image/jpeg", 0.3); // heavily compressed

      const res = await submitProof(app.id, base64);
      if (res.error) {
        setUploadError(res.error);
      } else {
        setUploadSuccess(true);
        setTimeout(() => {
          window.location.href = "/user/history";
        }, 4000); // Auto redirect after 4 seconds
      }
    } catch (err) {
      setUploadError("Failed to process image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => setReview(generateReview());

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-drag" />
        
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div className="modal-sheet-icon" style={{ margin: 0, width: 64, height: 64 }}>
            {app.icon_url ? <img src={app.icon_url} alt={app.name} /> : <Star size={32} />}
          </div>
          <div>
            <h2 style={{ textAlign: "left", fontSize: 18, marginBottom: 2 }}>{app.name}</h2>
            <div className="modal-amount" style={{ textAlign: "left", fontSize: 24, margin: 0 }}>Upto ₹5-100</div>
          </div>
        </div>
        
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, lineHeight: 1.4 }}>
          Rate 5 stars on Play Store & earn upto ₹5-100 instantly!
        </p>

        {/* Copy Paste Review Section */}
        <div className="copy-box" style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 12, padding: "12px", marginBottom: 16, position: "relative" }}>
          <h4 style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            1. Copy review
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={handleRefresh} style={{ background: "none", color: "#64748b", border: "none", cursor: "pointer", fontSize: 10, textDecoration: "underline" }}>Change</button>
              <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 4, background: copied ? "#ecfdf5" : "#0f172a", color: copied ? "#10b981" : "#fff", border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </h4>
          <div style={{ maxHeight: "60px", overflowY: "auto", fontSize: 12, color: "#334155", lineHeight: 1.4, userSelect: "all", paddingRight: 8 }}>
            "{review}"
          </div>
        </div>

        <div className="steps-box" style={{ padding: "16px", marginBottom: 16 }}>
          <h4 style={{ fontSize: 11, marginBottom: 10 }}>2. Claim Steps</h4>
          <div className="step-row" style={{ fontSize: 12, marginBottom: 8 }}><div className="step-num" style={{ width: 20, height: 20, fontSize: 10 }}>1</div><span>Tap "Rate on Play Store" below</span></div>
          <div className="step-row" style={{ fontSize: 12, marginBottom: 8 }}><div className="step-num" style={{ width: 20, height: 20, fontSize: 10 }}>2</div><span>Give 5 <Star size={12} style={{ display: "inline", verticalAlign: "middle", fill: "#f59e0b", color: "#f59e0b" }}/> & Paste review</span></div>
          <div className="step-row" style={{ fontSize: 12, marginBottom: 8 }}><div className="step-num" style={{ width: 20, height: 20, fontSize: 10 }}>3</div><span>Screenshot rating</span></div>
          <div className="step-row" style={{ fontSize: 12, marginBottom: 0 }}><div className="step-num" style={{ width: 20, height: 20, fontSize: 10 }}>4</div><span>Tap "Submit proof" → get upto ₹5-100</span></div>
        </div>

        {/* Replaced inline success with a full screen modal below */}
        {uploadError && (
          <div style={{ padding: "12px", background: "#fee2e2", color: "#ef4444", borderRadius: 12, fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
            {uploadError}
          </div>
        )}
        
        {!uploadSuccess && (
          <div className="modal-btns" style={{ flexDirection: "column", gap: 12 }}>
            <a
              className="btn-big btn-amber-big"
              href={app.play_store_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", textDecoration: "none", padding: "14px", fontSize: 14 }}
            >
              <Star size={16} style={{ fill: "#fff" }} /> Rate on Play Store
            </a>
            
            <button 
              className="btn-big"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ width: "100%", background: "#0f172a", color: "#fff", padding: "14px", fontSize: 14, border: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            >
              {uploading ? (
                "Uploading..."
              ) : (
                <>Task completed submit proof</>
              )}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleFileChange} 
            />
          </div>
        )}
      </div>

      {/* Professional Success Modal */}
      {uploadSuccess && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 }}>
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", width: "90%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", textAlign: "center", animation: "popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div style={{ width: 80, height: 80, background: "#ecfdf5", color: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: "#0f172a" }}>Submission Successful!</h2>
            <div style={{ height: 1, background: "#e2e8f0", width: "100%", margin: "16px 0" }} />
            <p style={{ color: "#475569", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
              Our dedicated review team has received your task proof. We are currently verifying your submission to ensure all steps were followed accurately.
              <br/><br/>
              <strong style={{ color: "#10b981", fontSize: 16 }}>Your reward will be credited to your wallet shortly!</strong>
            </p>
            
            <button 
              onClick={() => window.location.href = "/user/history"}
              className="btn-big btn-green-big"
              style={{ width: "100%", padding: "16px", marginBottom: 16 }}
            >
              Go to History Now
            </button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #cbd5e1", borderTopColor: "#94a3b8", animation: "spin 1s linear infinite" }} />
              Redirecting automatically...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoginPrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ textAlign: "center" }}>
        <div className="modal-drag" />
        <div style={{ width: 72, height: 72, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 24, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)" }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Login Required</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Login or create a free account to claim this task and start earning!
        </p>
        <Link
          href="/user/login"
          className="btn-big btn-green-big"
          style={{ width: "100%", textDecoration: "none", display: "flex", justifyContent: "center", marginBottom: 12 }}
        >
          Login to Claim
        </Link>
        <Link
          href="/user/signup"
          className="btn-big"
          style={{ width: "100%", textDecoration: "none", display: "flex", justifyContent: "center", background: "#f1f5f9", color: "#0f172a" }}
        >
          Create Free Account
        </Link>
      </div>
    </div>
  );
}

export default function AppCard({ app, submitted = false, isLoggedIn = true }: { app: App; submitted?: boolean; isLoggedIn?: boolean }) {
  const [show, setShow] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleClick = () => {
    if (submitted) return;
    if (!isLoggedIn) { setShowLogin(true); return; }
    setShow(true);
  };

  return (
    <>
      <div
        className="app-featured-card"
        onClick={handleClick}
        style={{ opacity: submitted ? 0.7 : 1, filter: submitted ? "grayscale(50%)" : "none" }}
      >
        <div className="app-card-header">
          <div className="app-card-icon-wrap">
            {app.icon_url ? <img src={app.icon_url} alt={app.name} /> : <Smartphone size={32} strokeWidth={1.5} />}
          </div>
          <div className="app-card-meta">
            <h3>{app.name}</h3>
            <p>{app.description || "Rate & review to earn"}</p>
          </div>
        </div>
        <div className="app-card-footer">
          <div className="app-card-reward">
            <span className="reward-lbl">Reward</span>
            <span className="reward-val">₹{app.reward_amount}</span>
          </div>
          <button
            className="app-card-action"
            style={{
              background: submitted ? "#f1f5f9" : !isLoggedIn ? "#f1f5f9" : undefined,
              color: submitted ? "#64748b" : !isLoggedIn ? "#64748b" : undefined,
              boxShadow: submitted ? "none" : !isLoggedIn ? "none" : undefined,
              display: "flex", alignItems: "center", gap: 6
            }}
          >
            {submitted ? "In Review" : !isLoggedIn ? <><Lock size={14} /> Login</> : "Claim Now"}
          </button>
        </div>
      </div>
      {show && <Sheet app={app} onClose={() => setShow(false)} />}
      {showLogin && <LoginPrompt onClose={() => setShowLogin(false)} />}
    </>
  );
}
