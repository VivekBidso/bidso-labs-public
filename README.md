# Bidso Labs — public intake site

The public-facing form site for Bidso Labs (Designer / Manufacturer / Brand submission
tracks). Deployed at `labs.bidso.com`. Companion repo: `bidso-labs-internal` (the review
platform this talks to).

See `../bidso-labs-prd.md`, `../tech-architecture.md`, and `../implementation-plan.md` in
the `Bidso-Labs` project folder for the full spec — this repo implements Stage 2 of the
implementation plan.

## Stack

Vite + React + React Router. No backend framework here — this app only calls
`bidso-labs-internal`'s public API surface (`POST /public/submissions/*`), it never touches
a database directly.

## Local development

```
npm install
cp .env.example .env.local   # point VITE_API_BASE at your local backend once it exists
npm run dev
```

## What's built

- Landing, persona picker + eligibility gate, ineligible page
- Designer Stage 1 form (full field set, employer-conflict hard stop, warranty + terms
  gating) and Stage 2 (NDA-gated, checks `stage2-unlocked` before rendering)
- Manufacturer and Brand forms
- Public status lookup by reference number (no login — see tech-architecture.md's
  tracking-mechanism decision)

## What's not built yet

- Real file upload to object storage (currently just counts files client-side; needs the
  presigned-upload flow once Stage 1's backend exists)
- The backend itself (`bidso-labs-internal`) — every submit/status call in `src/lib/api.js`
  is written against the planned API contract but has nothing live to call yet
- Co-contributor capture UI was an open question in the architecture doc — resolved here as
  a simple name-per-line textarea; revisit if that's not sufficient
