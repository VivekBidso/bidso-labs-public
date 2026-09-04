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

// --- File uploads (direct to R2 via presigned POST) -------------------------
// The file never passes through this API server: we ask it for a presigned
// POST target, upload straight to object storage with that, then tell the API
// which keys landed so it can record them against the submission.

async function presignOne(submissionId, file) {
  const res = await fetch(`${API_BASE}/public/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submission_id: submissionId, filename: file.name, content_type: file.type || null }),
  });
  if (!res.ok) throw new Error(`Could not prepare upload for "${file.name}"`);
  return res.json();
}

async function uploadToR2(presigned, file) {
  const form = new FormData();
  Object.entries(presigned.upload.fields).forEach(([k, v]) => form.append(k, v));
  form.append("file", file);
  const res = await fetch(presigned.upload.url, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Upload failed for "${file.name}"`);
}

// Uploads every file, tolerating individual failures (a flaky connection on
// one file shouldn't lose the others) — returns which keys actually made it
// so the caller can tell the person if anything needs to be re-sent by hand.
export async function uploadFiles(submissionId, files) {
  const uploaded = []; // { key, name }
  const failedNames = [];

  for (const file of files) {
    try {
      const presigned = await presignOne(submissionId, file);
      await uploadToR2(presigned, file);
      uploaded.push({ key: presigned.key, name: file.name });
    } catch {
      failedNames.push(file.name);
    }
  }

  if (uploaded.length) {
    try {
      await postJSON(`/public/submissions/${submissionId}/attachments/confirm`, {
        submission_id: submissionId,
        keys: uploaded.map((u) => u.key),
      });
    } catch {
      // The files are already sitting in R2 even if this confirm call fails —
      // count them as failed rather than silently dropping the problem, since
      // nothing in our own records will show them as attached.
      failedNames.push(...uploaded.map((u) => u.name));
      return { uploadedCount: 0, failedNames };
    }
  }

  return { uploadedCount: uploaded.length, failedNames };
}
