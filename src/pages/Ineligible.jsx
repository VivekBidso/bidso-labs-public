import { Link } from "react-router-dom";

export default function Ineligible() {
  return (
    <div className="wrap">
      <div className="centre">
        <div className="eyebrow" style={{ justifyContent: "center" }}><span className="mark" /> Not yet</div>
        <h1>Labs is open to residents of India only</h1>
        <p className="lede" style={{ marginTop: 22 }}>
          We're not taking submissions from outside India at the moment. We're also not collecting
          your email to tell you when that changes — holding personal details from people we've no
          way to work with isn't something we want to be doing.
        </p>
        <p className="lede" style={{ marginTop: 18 }}>If it opens up, this page will say so.</p>
        <div className="btnrow" style={{ justifyContent: "center" }}>
          <Link className="btn btn-ghost" to="/">Back to Bidso Labs</Link>
        </div>
      </div>
    </div>
  );
}
