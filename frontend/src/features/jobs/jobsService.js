// frontend/src/features/jobs/jobsService.js
const BASE = "/api/jobs"; // use relative path so CRA proxy forwards to backend

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    // if server returned JSON errors (e.g., validation map), throw that object
    const err = isJson ? body : { message: body || res.statusText };
    throw err;
  }
  return body;
}

/** LIST with optional params: {page, size, q} */
export function listJobs({ page = 0, size = 20, q } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);
  if (q) params.set("q", q);
  const url = `${BASE}?${params.toString()}`;
  return fetch(url, { method: "GET" }).then(handleResponse);
}

/** CREATE */
export function createJob(payload) {
  return fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(handleResponse);
}

/** UPDATE */
export function updateJob(id, payload) {
  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(handleResponse);
}

/** DELETE */
export function deleteJob(id) {
  return fetch(`${BASE}/${id}`, { method: "DELETE" }).then(res => {
    // for 204 No Content return true; for others use handleResponse
    if (res.status === 204) return true;
    return handleResponse(res);
  });
}
