// Talks to bidso-labs-internal's public-only API surface (see tech-architecture.md
// "How data flows between them"). Base URL comes from an env var so this works
// unchanged once the backend is deployed — nothing here should need to change
// when Render is back up, only VITE_API_BASE needs setting.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function submitDesignerStage1(payload) {
  return postJSON("/public/submissions/designer-stage1", payload);
}

export async function submitManufacturer(payload) {
  return postJSON("/public/submissions/manufacturer", payload);
}

export async function submitBrand(payload) {
  return postJSON("/public/submissions/brand", payload);
}

export async function getStatus(referenceNumber) {
  const res = await fetch(`${API_BASE}/public/submissions/${referenceNumber}/status`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

// Gate for Designer Stage 2 — per tech-architecture.md, the public site must
// call this before rendering Stage 2 fields; gated on nda_status = EXECUTED
// and having passed screen. Returns { unlocked: bool, due_date, ... } once
// the backend exists.
export async function getStage2UnlockStatus(referenceNumber) {
  const res = await fetch(`${API_BASE}/public/submissions/${referenceNumber}/stage2-unlocked`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export async function submitDesignerStage2(referenceNumber, payload) {
  return postJSON(`/public/submissions/${referenceNumber}/stage2`, payload);
}
