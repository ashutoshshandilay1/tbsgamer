"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { createApp, deleteApp, toggleApp } from "@/lib/actions";

type App = {
  id: number; name: string; description: string;
  icon_url: string; play_store_url: string;
  reward_amount: number; active: boolean;
};

export default function ManageAppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [playStoreUrl, setPlayStoreUrl] = useState("");
  const [rewardAmount, setRewardAmount] = useState(100);
  const [active, setActive] = useState(true);

  const supabase = createClient();

  const fetchApps = async () => {
    const { data } = await supabase.from("apps").select("*").order("created_at", { ascending: false });
    setApps(data || []);
  };

  useEffect(() => { fetchApps(); }, []);

  const showMsg = (text: string, type: string) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const handleAdd = async () => {
    if (!name.trim() || !playStoreUrl.trim()) { showMsg("App name and Play Store URL are required", "err"); return; }
    setLoading(true);
    const result = await createApp({ name: name.trim(), description: description.trim(), icon_url: iconUrl.trim(), play_store_url: playStoreUrl.trim(), reward_amount: rewardAmount, active });
    if (result?.error) { showMsg(result.error, "err"); }
    else { showMsg(`"${name}" added!`, "ok"); setName(""); setDescription(""); setIconUrl(""); setPlayStoreUrl(""); setRewardAmount(100); setActive(true); await fetchApps(); }
    setLoading(false);
  };

  const handleDelete = async (id: number, n: string) => {
    if (!confirm(`Delete "${n}"?`)) return;
    const r = await deleteApp(id);
    r?.error ? showMsg(r.error, "err") : (showMsg(`"${n}" deleted`, "ok"), await fetchApps());
  };

  const handleToggle = async (id: number, cur: boolean) => {
    const r = await toggleApp(id, !cur);
    r?.error ? showMsg(r.error, "err") : (showMsg(`App ${!cur ? "activated" : "deactivated"}`, "ok"), await fetchApps());
  };

  return (
    <>
      <div className="admin-hd"><h1>📱 Manage Apps</h1></div>

      {msg.text && (
        <div className={`alert ${msg.type === "ok" ? "alert-green" : "alert-red"}`}>
          {msg.type === "ok" ? "✅" : "❌"} {msg.text}
        </div>
      )}

      {/* Add App Form */}
      <div className="card">
        <div className="card-title">Add New App</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">App Name *</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cool Game App" />
          </div>
          <div className="form-group">
            <label className="form-label">Reward (₹) *</label>
            <input type="number" className="form-input" value={rewardAmount} onChange={e => setRewardAmount(Number(e.target.value))} min={1} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">App Icon URL</label>
            <input className="form-input" value={iconUrl} onChange={e => setIconUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Play Store URL *</label>
            <input className="form-input" value={playStoreUrl} onChange={e => setPlayStoreUrl(e.target.value)} placeholder="https://play.google.com/..." />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label className="form-check">
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
            Make active immediately
          </label>
          <button className="btn btn-green" onClick={handleAdd} disabled={loading}>
            {loading ? "Adding..." : "+ Add App"}
          </button>
        </div>
      </div>

      {/* Apps List */}
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>All Apps ({apps.length})</div>
      {apps.length === 0 ? (
        <div className="empty-state"><p>No apps yet. Add one above!</p></div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>App</th><th>Play Store</th><th>Reward</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} style={{ width: 36, height: 36, borderRadius: 9, objectFit: "cover" }} />
                      ) : <span style={{ fontSize: 24 }}>📱</span>}
                      <div>
                        <div style={{ fontWeight: 600 }}>{app.name}</div>
                        {app.description && <div style={{ fontSize: 12, color: "#888", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={app.play_store_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                      Open ↗
                    </a>
                  </td>
                  <td style={{ fontWeight: 700, color: "#d97706" }}>₹{app.reward_amount}</td>
                  <td>
                    <span className={`badge ${app.active ? "badge-on" : "badge-off"}`}>
                      {app.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className={`btn btn-sm ${app.active ? "btn-outline" : "btn-green"}`} onClick={() => handleToggle(app.id, app.active)}>
                        {app.active ? "Deactivate" : "Activate"}
                      </button>
                      <button className="btn btn-red btn-sm" onClick={() => handleDelete(app.id, app.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
