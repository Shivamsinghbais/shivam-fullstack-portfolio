// frontend/src/features/jobs/JobsList.jsx
import React, { useEffect, useState } from "react";
import { listJobs, deleteJob } from "./jobsService";

export default function JobsList() {
  const [pageData, setPageData] = useState(null); // holds Spring Page JSON
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [q, setQ] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // controlled input
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // load data whenever page, size or q changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await listJobs({ page, size, q });
        console.log("listJobs response:", res);
        if (!mounted) return;
        setPageData(res);
      } catch (e) {
        console.error("listJobs error:", e);
        if (!mounted) return;
        setErr(e.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [page, size, q]);

  // handlers
  function onSearchSubmit(e) {
    e.preventDefault();
    setPage(0);        // go back to first page on new search
    setQ(searchTerm);  // triggers effect
  }

  function onPrev() {
    if (!pageData || page <= 0) return;
    setPage(page - 1);
  }
  function onNext() {
    if (!pageData || page >= pageData.totalPages - 1) return;
    setPage(page + 1);
  }

  // optional: delete a job (demo)
  async function handleDelete(id) {
    if (!window.confirm("Delete this job?")) return;
    try {
      await deleteJob(id);
      // refresh current page
      setPage(page); // triggers reload (page state unchanged but effect still runs when q/page changed earlier)
      // easiest: re-call by toggling q: quick trick
      setQ((prev) => prev + ""); // no-op but ensures effect sees same q; alternatively call listJobs directly
      alert("Deleted");
    } catch (e) {
      alert("Delete failed: " + (e.message || e));
    }
  }

  // rendering
  if (loading) return <div style={{ padding: 20 }}>Loading jobs...</div>;
  if (err) return <div style={{ padding: 20, color: "crimson" }}>Error: {err}</div>;
  if (!pageData) return <div style={{ padding: 20 }}>No data yet.</div>;

  const items = pageData.content || [];

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Jobs</h2>

      {/* Search */}
      <form onSubmit={onSearchSubmit} style={{ marginBottom: 12 }}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title..."
          style={{ padding: 8, width: 280, marginRight: 8 }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>Search</button>
      </form>

      {/* summary */}
      <div style={{ marginBottom: 12 }}>
        <strong>Total:</strong> {pageData.totalElements} — Page {pageData.number + 1} of {Math.max(1, pageData.totalPages)}
      </div>

      {/* list */}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {items.length === 0 && <li style={{ padding: 8 }}>No jobs found</li>}
        {items.map((j) => (
          <li key={j.id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{j.title || "Untitled"}</div>
                <div style={{ color: "#666" }}>{j.company} • {j.location || "Remote/—"}</div>
                <div style={{ marginTop: 6, color: "#444" }}>{j.description ? (j.description.substring(0,180) + (j.description.length>180?'...':'')) : ""}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ marginBottom: 6 }}>
                  <button onClick={() => alert("Open detail later")} style={{ marginRight: 8 }}>View</button>
                  <button onClick={() => alert("Open edit later")} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(j.id)} style={{ color: "crimson" }}>Delete</button>
                </div>
                <div style={{ fontSize: 12, color: "#999" }}>{j.postedAt ? new Date(j.postedAt).toLocaleString() : ""}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* pagination */}
      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={onPrev} disabled={pageData.first}>Prev</button>
        <button onClick={onNext} disabled={pageData.last}>Next</button>
        <div style={{ marginLeft: 12, color: "#666" }}>
          Showing {items.length} of {pageData.totalElements}
        </div>
      </div>
    </div>
  );
}

