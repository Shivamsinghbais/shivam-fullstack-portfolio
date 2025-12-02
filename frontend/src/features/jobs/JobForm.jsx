// frontend/src/features/jobs/JobForm.jsx
import React, { useEffect, useState } from "react";
import { createJob, updateJob } from "./jobsService";

export default function JobForm({ job, onSuccess, onCancel }) {
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
  const [fieldErrors, setFieldErrors] = useState({}); // <- field-level errors

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        description: job.description || "",
        salaryFrom: job.salaryFrom ?? "",
        salaryTo: job.salaryTo ?? "",
        isActive: job.active ?? true,
      });
      setFieldErrors({});
      setErr(null);
    } else {
      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        salaryFrom: "",
        salaryTo: "",
        isActive: true,
      });
      setFieldErrors({});
      setErr(null);
    }
  }, [job]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
    // clear individual field error when user types
    setFieldErrors((fe) => ({ ...fe, [name]: undefined }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setFieldErrors({});

    if (!form.title.trim() || !form.company.trim()) {
      const fe = {};
      if (!form.title.trim()) fe.title = "Title is required";
      if (!form.company.trim()) fe.company = "Company is required";
      setFieldErrors(fe);
      setErr("Please fix the errors below.");
      return;
    }

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
      let res;
      if (job && job.id) {
        res = await updateJob(job.id, payload);
        console.log("updateJob response:", res);
      } else {
        res = await createJob(payload);
        console.log("createJob response:", res);
      }

      // success: clear errors and notify parent
      setFieldErrors({});
      setErr(null);
      if (onSuccess) onSuccess(res);
      if (!job) {
        setForm({
          title: "",
          company: "",
          location: "",
          description: "",
          salaryFrom: "",
          salaryTo: "",
          isActive: true,
        });
      }
    } catch (e) {
      console.error("save job error:", e);
      // If backend returned validation map (object), show field errors
      if (e && typeof e === "object" && !Array.isArray(e)) {
        setFieldErrors(e);
        const firstMsg = Object.values(e)[0];
        setErr(firstMsg || "Validation failed");
      } else {
        setErr(e.message || "Save failed");
      }
    } finally {
      setLoading(false);
    }
  }

  function renderFieldError(name) {
    return fieldErrors && fieldErrors[name] ? (
      <div style={{ color: "crimson", fontSize: 13, marginTop: 6 }}>{fieldErrors[name]}</div>
    ) : null;
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 20, maxWidth: 420 }}>
      <h3>{job ? "Edit Job" : "Create Job"}</h3>

      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

      <div style={{ marginBottom: 8 }}>
        <label>Title*</label><br />
        <input name="title" value={form.title} onChange={onChange} style={{ width: "100%", padding: 8 }} />
        {renderFieldError("title")}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Company*</label><br />
        <input name="company" value={form.company} onChange={onChange} style={{ width: "100%", padding: 8 }} />
        {renderFieldError("company")}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Location</label><br />
        <input name="location" value={form.location} onChange={onChange} style={{ width: "100%", padding: 8 }} />
        {renderFieldError("location")}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Description</label><br />
        <textarea name="description" value={form.description} onChange={onChange} rows={4} style={{ width: "100%", padding: 8 }} />
        {renderFieldError("description")}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Salary From</label><br />
          <input type="number" name="salaryFrom" value={form.salaryFrom} onChange={onChange} style={{ width: "100%", padding: 8 }} />
          {renderFieldError("salaryFrom")}
        </div>
        <div style={{ flex: 1 }}>
          <label>Salary To</label><br />
          <input type="number" name="salaryTo" value={form.salaryTo} onChange={onChange} style={{ width: "100%", padding: 8 }} />
          {renderFieldError("salaryTo")}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
          {" "} Active
        </label>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={loading} style={{ padding: "8px 14px" }}>
          {loading ? "Saving..." : (job ? "Update Job" : "Create Job")}
        </button>
        {job && <button type="button" onClick={onCancel} style={{ padding: "8px 14px" }}>Cancel</button>}
      </div>
    </form>
  );
}
