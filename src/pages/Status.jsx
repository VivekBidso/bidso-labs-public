import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStatus } from "../lib/api";

// Coarse stages per tech-architecture.md §"Public status page" — matches the
// state machine's public-facing projection, not the internal review states.
const STAGE_ORDER = ["Received", "Acknowledged", "Screening", "NDA & detail submission", "In evaluation", "Decision"];

export default function Status() {
  const { referenceNumber: refFromUrl } = useParams();
  const navigate = useNavigate();
  const [lookupInput, setLookupInput] = useState(refFromUrl || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!refFromUrl) return;
    setLoading(true);
    setError("");
    getStatus(refFromUrl)
      .then(setData)
      .catch(() => setError("We couldn't find a submission with that reference number."))
      .finally(() => setLoading(false));
  }, [refFromUrl]);

  function handleLookup() {
    if (!lookupInput.trim()) return;
    navigate(`/status/${lookupInput.trim()}`);
  }

  if (!refFromUrl) {
    return (
      <div className="wrap">
        <div className="form">
          <div className="fhead">
            <div className="eyebrow"><span className="mark" /> Status</div>
            <h1>Check where your submission stands</h1>
          </div>
          <div className="field">
            <label>Reference number</label>
            <input
              className="inp"
              placeholder="LABS-2026-0142"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
          </div>
          <div className="btnrow">
            <button className="btn btn-primary" onClick={handleLookup}>Check status <span className="arw">→</span></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="form">
        <div className="fhead">
          <div className="eyebrow"><span className="mark" /> Status</div>
          <h1>{refFromUrl}</h1>
        </div>

        {loading && <p className="body-text">Looking that up…</p>}
        {error && <p className="err">{error}</p>}

        {data && (
          <>
            <div className="refbox">
              <div><div className="rk">Submitted</div><div className="rv">{data.submitted_date}</div></div>
              <div><div className="rk">Stage</div><div className="rv" style={{ color: "var(--amber)" }}>{data.current_stage}</div></div>
              <div><div className="rk">Decision due by</div><div className="rv">{data.decision_due_by || "—"}</div></div>
            </div>

            {data.rejection_message && (
              <div className="banner warn" style={{ marginTop: 24 }}>
                <div className="bd" />
                <div>
                  <div className="bt">Not moving forward</div>
                  <div className="bb">{data.rejection_message}</div>
                </div>
              </div>
            )}

            <div className="track">
              {STAGE_ORDER.map((stage) => {
                const idx = STAGE_ORDER.indexOf(stage);
                const currentIdx = STAGE_ORDER.indexOf(data.current_stage);
                const cls = idx < currentIdx ? "done" : idx === currentIdx ? "now" : "todo";
                const stageDate = data.stage_dates?.[stage];
                return (
                  <div className={`tstep ${cls}`} key={stage}>
                    <div className="bul" />
                    <div><div className="tl">{stage}</div></div>
                    <div className="td">{stageDate || "—"}</div>
                  </div>
                );
              })}
            </div>

            <p className="small" style={{ marginTop: 30, maxWidth: "58ch" }}>
              This page shows where your submission has got to and nothing else — no scores, no
              notes, and no names. If a date is going to slip, we'll email you before it does rather
              than leaving you to notice.
            </p>
          </>
        )}

        <div className="btnrow">
          <button className="btn btn-ghost" onClick={() => navigate("/")}>Back to Labs</button>
        </div>
      </div>
    </div>
  );
}
