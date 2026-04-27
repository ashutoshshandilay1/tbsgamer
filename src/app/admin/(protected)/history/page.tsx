"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Clock, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

type ProofHistory = {
  id: number;
  status: string;
  created_at: string;
  awarded_amount: number;
  remark: string;
  image_base64: string;
  profiles: { id: string; full_name: string; email: string };
  apps: { name: string; reward_amount: number };
};

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<ProofHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');

  useEffect(() => {
    const supabase = createClient();
    
    // Initial fetch
    supabase
      .from("proofs")
      .select(`
        id, status, created_at, awarded_amount, remark, image_base64,
        profiles:user_id(id, full_name, email),
        apps:app_id(name, reward_amount)
      `)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setHistory((data as unknown as ProofHistory[]) || []);
        setLoading(false);
      });

  }, []);

  const filteredHistory = history.filter((h) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      h.profiles?.full_name?.toLowerCase().includes(q) || 
      h.profiles?.email?.toLowerCase().includes(q) || 
      h.apps?.name?.toLowerCase().includes(q);
    
    const matchesFilter = filter === 'all' || h.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="admin-hd">
        <h1>📜 Task History</h1>
        <p style={{ color: "#64748b", margin: 0 }}>View all user app task completions and submissions.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }} />
          <input
            className="form-input"
            placeholder="Search by user or app..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, margin: 0 }}
          />
        </div>
        
        <select 
          className="form-input" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as any)}
          style={{ width: "auto", margin: 0 }}
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading history...</p></div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
          <p>No task history found.</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>App Task</th>
                <th>Reward</th>
                <th>Status</th>
                <th>Remark</th>
                <th>Proof</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((h) => (
                <tr key={h.id}>
                  <td style={{ color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>
                    {new Date(h.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    <br/>
                    <span style={{ fontSize: 11 }}>{new Date(h.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </td>
                  <td>
                    {h.profiles?.id ? (
                      <Link href={`/admin/users/${h.profiles.id}`} style={{ fontWeight: 600, color: "#3b82f6", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {h.profiles?.full_name || "Unknown"} <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{h.profiles?.full_name || "Unknown"}</div>
                    )}
                    <div style={{ fontSize: 12, color: "#64748b" }}>{h.profiles?.email}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{h.apps?.name || "Unknown App"}</td>
                  <td>
                    {h.status === 'approved' ? (
                      <span style={{ fontWeight: 700, color: "#10b981" }}>+₹{h.awarded_amount}</span>
                    ) : (
                      <span style={{ fontWeight: 600, color: "#94a3b8" }}>₹{h.apps?.reward_amount}</span>
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: 4, 
                      fontSize: 12, 
                      fontWeight: "bold",
                      background: h.status === 'approved' ? "#dcfce7" : (h.status === 'rejected' ? "#fee2e2" : "#f1f5f9"),
                      color: h.status === 'approved' ? "#16a34a" : (h.status === 'rejected' ? "#ef4444" : "#475569")
                    }}>
                      {h.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {h.remark || "—"}
                  </td>
                  <td>
                    <a href={h.image_base64} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      View Image
                    </a>
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
