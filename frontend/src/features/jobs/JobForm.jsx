// frontend/src/features/jobs/JobForm.jsx
import React, { useState } from "react";
import { createJob } from "./jobsService";

export default function JobForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salaryFrom: "",
    salaryTo: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);

    // simple client-side validation
    if (!form.title.trim() || !form.company.trim()) {
      setErr("Title and Company are required.");
      return;
    }

    // build payload matching backend fields (salary as numbers)
    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      description: form.description,
      salaryFrom: form.salaryFrom ? Number(form.salaryFrom) : null,
      salaryTo: form.salaryTo ? Number(form.salaryTo) : null,
      isActive: form.isActive,
    };

    try {
      setLoading(true);
      const res = await createJob(payload);
      console.log("createJob response:", res);
      alert("Job created!");
      if (onSuccess) onSuccess(res);
      // optionally reset form
      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        salaryFrom: "",
        salaryTo: "",
        isActive: true,
      });
    } catch (e) {
      console.error("createJob error:", e);
      setErr(e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 20, maxWidth: 760 }}>
      <h3>Create Job</h3>

      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

      <div style={{ marginBottom: 8 }}>
        <label>Title*</label><br />
        <input name="title" value={form.title} onChange={onChange} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Company*</label><br />
        <input name="company" value={form.company} onChange={onChange} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Location</label><br />
        <input name="location" value={form.location} onChange={onChange} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Description</label><br />
        <textarea name="description" value={form.description} onChange={onChange} rows={6} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Salary From</label><br />
          <input type="number" name="salaryFrom" value={form.salaryFrom} onChange={onChange} style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Salary To</label><br />
          <input type="number" name="salaryTo" value={form.salaryTo} onChange={onChange} style={{ width: "100%", padding: 8 }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
          {" "} Active
        </label>
      </div>

      <div>
        <button type="submit" disabled={loading} style={{ padding: "8px 14px" }}>
          {loading ? "Saving..." : "Create Job"}
        </button>
      </div>
    </form>
  );
}
