import { Link, useLocation } from "react-router-dom";

export default function Submitted() {
  const { state } = useLocation();
  // Falls back to placeholder values if someone lands here directly (e.g. a
  // page refresh) rather than via a real submit — real reference data only
  // exists once the backend actually returns it.
  const referenceNumber = state?.reference_number || "—";
  const submittedDate = state?.submitted_date || "—";
  const screenDecisionBy = state?.screen_decision_by || "—";
  const email = state?.email || "the email you gave us";

  return (
    <div className="wrap">
      <div className="centre">
        <div className="eyebrow" style={{ justifyContent: "center" }}><span className="mark" /> Submitted</div>
        <h1>That's in.</h1>
        <p className="lede" style={{ marginTop: 22 }}>
          We'll acknowledge it within 48 hours at <strong style={{ color: "var(--white)" }}>{email}</strong>,
          and you'll have a first decision within 10 business days. There's nothing else for you to do
          right now.
        </p>

        <div className="refbox" style={{ marginTop: 38, textAlign: "left", justifyContent: "center" }}>
          <div><div className="rk">Reference</div><div className="rv">{referenceNumber}</div></div>
          <div><div className="rk">Submitted</div><div className="rv">{submittedDate}</div></div>
          <div><div className="rk">Screen decision by</div><div className="rv">{screenDecisionBy}</div></div>
        </div>

        <div className="btnrow" style={{ justifyContent: "center" }}>
          {referenceNumber !== "—" && (
            <Link className="btn btn-primary" to={`/status/${referenceNumber}`}>Check status <span className="arw">→</span></Link>
          )}
          <Link className="btn btn-ghost" to="/">Back to Labs</Link>
        </div>
        <p className="small" style={{ marginTop: 26 }}>
          Keep the reference. The status link also arrives in the acknowledgement email, so you don't
          have to bookmark this page.
        </p>
      </div>
    </div>
  );
}
