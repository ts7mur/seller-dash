"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export const dynamic = "force-dynamic";

export default function Inventory() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", condition: "", cost_price: "", current_selling_price: "", package_tracking: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push("/"); }
      else { setSession(data.session); loadItems(); }
      setLoading(false);
    });
  }, [router]);

  async function loadItems() {
    const { data, error } = await supabase.from("inventory_items").select("*").order("created_at", { ascending: false });
    if (!error) setItems(data);
  }
  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    const { error } = await supabase.from("inventory_items").insert([{
      name: form.name, category: form.category, condition: form.condition,
      cost_price: parseFloat(form.cost_price), current_selling_price: parseFloat(form.current_selling_price),
      package_tracking: form.package_tracking,
    }]);
    if (!error) { setForm({ name: "", category: "", condition: "", cost_price: "", current_selling_price: "", package_tracking: "" }); loadItems(); }
    setAdding(false);
  }
  async function updatePrice(id, price) {
    await supabase.from("inventory_items").update({ current_selling_price: price }).eq("id", id);
    loadItems();
  }
  async function deleteItem(id) {
    await supabase.from("inventory_items").delete().eq("id", id);
    loadItems();
  }

  if (loading) return <main className="page"><p className="muted">Loading...</p></main>;
  if (!session) return null;

  // live dashboard stats
  const count = items.length;
  const value = items.reduce((s, i) => s + (i.current_selling_price || 0), 0);
  const margins = items.filter(i => i.cost_price).map(i => (i.current_selling_price - i.cost_price) / i.cost_price * 100);
  const avgMargin = margins.length ? (margins.reduce((a, b) => a + b, 0) / margins.length) : 0;

  return (
    <main className="page">
      <div className="topbar rise">
        <h1 className="page-title gradient-text">Inventory</h1>
        <div className="row-gap">
          <a className="btn-ghost" href="/" style={{ textDecoration: "none" }}>Home</a>
          <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="card stat hoverable rise d1"><div className="stat-n gradient-text">{count}</div><div className="stat-l">Items</div></div>
        <div className="card stat hoverable rise d2"><div className="stat-n gradient-text">${value.toFixed(0)}</div><div className="stat-l">Inventory Value</div></div>
        <div className="card stat hoverable rise d3"><div className="stat-n gradient-text">{avgMargin.toFixed(0)}%</div><div className="stat-l">Avg Margin</div></div>
      </div>

      <div className="card pad mb rise d2">
        <h2 className="section-h gradient-text">Add Item</h2>
        <form className="form-grid" onSubmit={handleAdd}>
          <input className="input" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="input" placeholder="Condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
          <input className="input" placeholder="Cost price" type="number" step="0.01" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} required />
          <input className="input" placeholder="Selling price" type="number" step="0.01" value={form.current_selling_price} onChange={(e) => setForm({ ...form, current_selling_price: e.target.value })} required />
          <input className="input" placeholder="Tracking #" value={form.package_tracking} onChange={(e) => setForm({ ...form, package_tracking: e.target.value })} />
          <button className="btn" type="submit" disabled={adding}>{adding ? "Adding..." : "Add Item"}</button>
        </form>
      </div>

      <div className="card table-wrap rise d3">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Condition</th><th>Cost</th><th>Selling</th><th>Margin</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const margin = item.cost_price ? ((item.current_selling_price - item.cost_price) / item.cost_price * 100).toFixed(1) : 0;
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.condition}</td>
                  <td>${item.cost_price?.toFixed(2)}</td>
                  <td><input className="cell-input" type="number" step="0.01" defaultValue={item.current_selling_price} onBlur={(e) => updatePrice(item.id, parseFloat(e.target.value))} /></td>
                  <td className={margin > 0 ? "pos" : "neg"}>{margin}%</td>
                  <td><button className="btn btn-sm" onClick={() => deleteItem(item.id)}>Delete</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && <p className="empty">No items yet. Add one above.</p>}
      </div>
    </main>
  );
}
