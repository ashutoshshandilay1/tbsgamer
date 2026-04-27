import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAuthenticated, createWithdrawalCategory, createWithdrawalOption } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Plus, Settings, Gift } from "lucide-react";

export const revalidate = 0;

export default async function WithdrawalsSetupPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: categories } = await supabase.from("withdrawal_categories").select("*").order("id");
  const { data: options } = await supabase.from("withdrawal_options").select("*").order("amount", { ascending: true });

  return (
    <div>
      <div className="admin-hd">
        <h1>Withdrawal Setup</h1>
        <p style={{ color: "#64748b", margin: 0 }}>Configure reward categories and amounts.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        
        {/* Category Creation Form */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Settings size={20} color="#3b82f6" /> Add Category
          </h2>
          <form action={async (fd) => {
            "use server";
            const res = await createWithdrawalCategory({
              name: fd.get("name") as string,
              input_label: fd.get("input_label") as string,
              input_placeholder: fd.get("input_placeholder") as string,
              image_url: fd.get("image_url") as string
            });
            if (res.error) console.error(res.error);
          }}>
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input name="name" className="form-input" placeholder="e.g. Google Play Redeem Code" required />
            </div>
            <div className="form-group">
              <label className="form-label">User Input Label</label>
              <input name="input_label" className="form-input" placeholder="e.g. Email Address to receive code" required />
            </div>
            <div className="form-group">
              <label className="form-label">Input Placeholder</label>
              <input name="input_placeholder" className="form-input" placeholder="e.g. user@gmail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Logo / Image URL (Optional)</label>
              <input name="image_url" className="form-input" placeholder="https://example.com/logo.png" />
            </div>
            <button type="submit" className="btn-big" style={{ background: "#0f172a", color: "#fff", width: "100%" }}>
              Create Category
            </button>
          </form>
        </div>

        {/* Add Option Form */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={20} color="#10b981" /> Add Amount Option
          </h2>
          {(!categories || categories.length === 0) ? (
            <p style={{ color: "#64748b" }}>Please create a category first.</p>
          ) : (
            <form action={async (fd) => {
              "use server";
              const res = await createWithdrawalOption({
                category_id: parseInt(fd.get("category_id") as string),
                amount: parseFloat(fd.get("amount") as string)
              });
              if (res.error) console.error(res.error);
            }}>
              <div className="form-group">
                <label className="form-label">Select Category</label>
                <select name="category_id" className="form-input" required>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input name="amount" type="number" className="form-input" placeholder="e.g. 50" required />
              </div>
              <button type="submit" className="btn-big" style={{ background: "#10b981", color: "#fff", width: "100%" }}>
                Add Amount
              </button>
            </form>
          )}
        </div>

      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 16 }}>Current Categories & Options</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {categories?.map(c => (
          <div key={c.id} className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              {c.image_url ? (
                <img src={c.image_url} alt={c.name} style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} />
              ) : (
                <Gift size={20} color="#3b82f6" />
              )}
              {c.name}
            </h3>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
              Requests Input: <strong>{c.input_label}</strong>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {options?.filter(o => o.category_id === c.id).map(o => (
                <div key={o.id} style={{ background: "#f1f5f9", padding: "6px 12px", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
                  ₹{o.amount}
                </div>
              ))}
              {(!options || options.filter(o => o.category_id === c.id).length === 0) && (
                <span style={{ color: "#94a3b8", fontSize: 13 }}>No amounts added yet.</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
