// frontend/src/features/jobs/jobsService.js
const BASE = "/api/jobs"; // dev proxy -> localhost:8080

function handleResponse(res) {
  if (!res.ok) {
    return res.text().then(t => { throw new Error(t || res.statusText); });
  }
  // try parse json, fallback to text
  return res.headers.get("content-type")?.includes("application/json")
    ? res.json()
    : res.text();
}

export async function listJobs({ page = 0, size = 10, q = "" } = {}) {
  const url = `${BASE}?page=${page}&size=${size}&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { method: "GET" });
  return handleResponse(res);
}

export async function getJob(id) {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse(res);
}

export async function createJob(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateJob(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteJob(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
