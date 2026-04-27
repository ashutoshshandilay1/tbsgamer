"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { createNavItem, deleteNavItem } from "@/lib/actions";

type NavItem = { id: number; name: string; link: string; position: number };

export default function NavigationPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const supabase = createClient();

  const fetchItems = async () => {
    const { data } = await supabase.from("nav_items").select("*").order("position", { ascending: true });
    setItems(data || []);
  };

  useEffect(() => { fetchItems(); }, []);

  const showMsg = (text: string, type: string) => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "" }), 3000); };

  const handleAdd = async () => {
    if (!name.trim() || !link.trim()) { showMsg("Name and link are required", "err"); return; }
    setLoading(true);
    const result = await createNavItem({ name: name.trim(), link: link.trim(), position: items.length });
    result?.error ? showMsg(result.error, "err") : (showMsg(`"${name}" added!`, "ok"), setName(""), setLink(""), await fetchItems());
    setLoading(false);
  };

  const handleDelete = async (id: number, n: string) => {
    const r = await deleteNavItem(id);
    r?.error ? showMsg(r.error, "err") : (showMsg(`"${n}" removed`, "ok"), await fetchItems());
  };

  return (
    <>
      <div className="admin-hd"><h1>🧭 Navigation</h1></div>

      {msg.text && (
        <div className={`alert ${msg.type === "ok" ? "alert-green" : "alert-red"}`}>
          {msg.type === "ok" ? "✅" : "❌"} {msg.text}
        </div>
      )}

      <div className="card">
        <div className="card-title">Add Nav Item</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. About Us" />
          </div>
          <div className="form-group">
            <label className="form-label">Link</label>
            <input className="form-input" value={link} onChange={e => setLink(e.target.value)} placeholder="e.g. /about or https://..." />
          </div>
        </div>
        <button className="btn btn-green" onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "+ Add Item"}
        </button>
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
        Current Items ({items.length})
      </div>

      {items.length === 0 ? (
        <div className="empty-state"><p>No nav items yet. "Home" is shown by default.</p></div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Link</th><th>Action</th></tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id}>
                  <td style={{ color: "#aaa", fontSize: 13, width: 40 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td style={{ color: "#555", fontSize: 13 }}>{item.link}</td>
                  <td>
                    <button className="btn btn-red btn-sm" onClick={() => handleDelete(item.id, item.name)}>Remove</button>
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
