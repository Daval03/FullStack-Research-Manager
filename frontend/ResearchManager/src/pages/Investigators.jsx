import { useState } from "react";
import { investigators as initialData } from "../mockData";

const EMPTY = { fullName: "", academicTitle: "", institution: "", email: "" };

export default function Investigators() {
  const [data, setData]     = useState(initialData);
  const [tab, setTab]       = useState("list");
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  function startEdit(inv) {
    setForm({ fullName: inv.fullName, academicTitle: inv.academicTitle, institution: inv.institution, email: inv.email });
    setEditId(inv.id);
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
    if (!form.fullName || !form.email) {
      setMessage({ type: "error", text: "Name and email are required." });
      return;
    }
    if (editId) {
      setData(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i));
      setMessage({ type: "success", text: "Investigator updated." });
    } else {
      const newId = Math.max(...data.map(i => i.id)) + 1;
      setData(prev => [...prev, { id: newId, ...form }]);
      setMessage({ type: "success", text: "Investigator added." });
      setForm(EMPTY);
    }
  }

  const filtered = data.filter(i => i.fullName.toLowerCase().includes(search.toLowerCase()));
  const initials  = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><span>Investigators</span></h1>
        <p className="page-subtitle">Manage researcher profiles · {data.length} registered</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn${tab === "list" ? " active" : ""}`} onClick={() => setTab("list")}>All Investigators</button>
        <button className={`tab-btn${tab === "add"  ? " active" : ""}`} onClick={startAdd}>+ Add New</button>
        {tab === "edit" && <button className="tab-btn active">Edit</button>}
      </div>

      {tab === "list" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Researchers ({filtered.length})</div>
            <div className="search-bar" style={{ width: 240 }}>
              <span className="search-icon" style={{ fontSize: 13 }}>⌕</span>
              <input className="form-input" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">◈</div><h3>No results</h3></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Researcher</th><th>Title</th><th>Institution</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(inv => (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar" style={{ width: 34, height: 34, fontSize: 13, borderRadius: 8 }}>{initials(inv.fullName)}</div>
                          <span className="td-primary">{inv.fullName}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-teal">{inv.academicTitle}</span></td>
                      <td className="td-muted">{inv.institution}</td>
                      <td className="td-mono">{inv.email}</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => startEdit(inv)}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {(tab === "add" || tab === "edit") && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="card-header">
            <div className="card-title"><span className="dot" />{tab === "edit" ? "Edit Investigator" : "New Investigator"}</div>
          </div>

          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

          <div className="form-grid">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Dr. Jane Doe" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Academic Title</label>
                <input className="form-input" placeholder="PhD, MSc, Licenciado…" value={form.academicTitle} onChange={e => setForm({ ...form, academicTitle: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <input className="form-input" placeholder="University / Research center" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" placeholder="researcher@institution.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="divider" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={() => setTab("list")}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {tab === "edit" ? "Save Changes" : "Add Investigator"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}