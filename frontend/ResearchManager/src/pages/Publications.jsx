import { useState } from "react";
import { publications as initialData } from "../mockData";

const EMPTY = { title: "", year: "", journal: "" };

export default function Publications() {
  const [data, setData]     = useState(initialData);
  const [tab, setTab]       = useState("list");
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  function startEdit(pub) {
    setForm({ title: pub.title, year: pub.year, journal: pub.journal });
    setEditId(pub.id);
    setTab("edit");
    setMessage(null);
  }

  function startAdd() {
    setForm(EMPTY);
    setEditId(null);
    setTab("add");
    setMessage(null);
  }

  function handleSubmit() {
    if (!form.title) { setMessage({ type: "error", text: "Title is required." }); return; }
    if (editId) {
      setData(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p));
      setMessage({ type: "success", text: "Publication updated." });
    } else {
      const newId = Math.max(...data.map(p => p.id)) + 1;
      setData(prev => [...prev, { id: newId, ...form }]);
      setMessage({ type: "success", text: "Publication added." });
      setForm(EMPTY);
    }
  }

  const filtered = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><span>Publications</span></h1>
        <p className="page-subtitle">Research articles linked to projects · {data.length} registered</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn${tab === "list" ? " active" : ""}`} onClick={() => setTab("list")}>All Publications</button>
        <button className={`tab-btn${tab === "add"  ? " active" : ""}`} onClick={startAdd}>+ Add New</button>
        {tab === "edit" && <button className="tab-btn active">Edit</button>}
      </div>

      {tab === "list" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Articles ({filtered.length})</div>
            <div className="search-bar" style={{ width: 260 }}>
              <span className="search-icon" style={{ fontSize: 13 }}>⌕</span>
              <input className="form-input" placeholder="Search by title…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">◎</div><h3>No results</h3></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Title</th><th>Journal</th><th>Year</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(pub => (
                    <tr key={pub.id}>
                      <td className="td-primary">{pub.title}</td>
                      <td><span className="badge badge-teal">{pub.journal}</span></td>
                      <td className="td-mono">{pub.year}</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => startEdit(pub)}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {(tab === "add" || tab === "edit") && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header">
            <div className="card-title"><span className="dot" />{tab === "edit" ? "Edit Publication" : "New Publication"}</div>
          </div>

          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Article Title *</label>
              <input className="form-input" placeholder="Enter article title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Journal / Magazine</label>
                <input className="form-input" placeholder="Nature, IEEE, Revista…" value={form.journal} onChange={e => setForm({ ...form, journal: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Publication Year</label>
                <input className="form-input" type="number" min="1990" max="2100" placeholder="2023" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="divider" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={() => setTab("list")}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {tab === "edit" ? "Save Changes" : "Add Publication"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}