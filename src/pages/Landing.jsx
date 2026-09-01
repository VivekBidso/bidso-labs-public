import { Link } from "react-router-dom";
import { Nav, Footer } from "../lib/ui";

const COMMITMENTS = [
  {
    eyebrow: "Confidentiality",
    title: "An NDA once you're past the first screen",
    hi: false,
    body: "Your first submission isn't confidential — stage one asks only for basic details and a few images. If it gets through the first screen, we put a mutual NDA in place before we ask you for drawings, CAD or costs. Your detailed material is protected before you send it.",
  },
  {
    eyebrow: "Non-use",
    title: "24 months, no exceptions",
    hi: true,
    body: "If we decline your product after detailed evaluation, we're barred from commercialising the specific design you sent us for 24 months from the date of that decision. That's a term in the agreement you accept, not a policy we can revise later.",
  },
  {
    eyebrow: "Development",
    title: "Design and prototyping at our cost",
    hi: false,
    body: "Where a prototype or a test part is what it takes to answer a question about your product, we build it and we pay for it.",
  },
  {
    eyebrow: "Response",
    title: "Timebound responses and feedback",
    hi: false,
    body: "48 hours to acknowledge, 10 business days to a first decision, 30 business days once you've sent full detail. And if we decline, we'll tell you why.",
  },
];

const STEPS = [
  ["01", "Submit", "A paragraph and up to three images. Five minutes, no account to create."],
  ["02", "Acknowledged", "Within 48 hours, with a reference number and a link you can use to check where it's got to."],
  ["03", "Screen", "One of our team reads it against eligibility, our categories, and a quick check for anything obviously already on the market."],
  ["04", "Detail", "If it gets through, we put the NDA in place and ask for drawings, CAD and cost assumptions. You get 30 days and one reminder."],
  ["05", "Evaluation", "A committee of industrial designers, engineers and account managers scores it and writes down the reasoning."],
  ["06", "Decision", "Advance, decline, or hold. A hold lasts 30 days and then closes itself — we don't sit on your work indefinitely."],
  ["07", "Offer", "If we advance, we propose a deal shape and put terms to you."],
];

const DEAL_SHAPES = [
  { eyebrow: "Co-development", hi: false, title: "Design it together", body: "If your product is unfinished, and significant design and development effort is required to bring it to market, Bidso will co-develop the product with you — for an agreed period, on terms we settle before the work starts." },
  { eyebrow: "Most common", hi: true, title: "Sell the IP, keep a royalty", body: "If you already have a design that's complete, you assign the design to us and we pay you a royalty on what we invoice for the product, for as long as the term runs. We fund the tooling and carry the risk." },
  { eyebrow: "Licence", hi: false, title: "Licence it, keep ownership", body: "You own the product and the design. We take exclusive white-label rights, with performance obligations on us and the rights returning to you if we don't deliver on them. Good for market-ready products you need help selling." },
  { eyebrow: "Buyout", hi: false, title: "Outright purchase", body: "If the product is already finished and tooled, we're also open to paying upfront for the tooling and purchasing the product outright from you." },
];

export default function Landing() {
  return (
    <div>
      <Nav />
      <div className="wrap">
        <div className="hero">
          <div className="eyebrow"><span className="mark" /> Bidso Labs</div>
          <h1>You design it. We do everything else.</h1>
          <p className="lede">
            Do you have a market-winning product, but aren't sure how to go about manufacturing and
            selling it? Share it with us. It could be a ready product with tooling, engineering
            drawings with prototypes, or just an idea and some sketches.
          </p>
          <p className="lede" style={{ marginTop: 18 }}>
            If we back it, we'll develop it fully, invest in the tooling, and sell it to leading
            brands. In return, you earn from every product we sell.
          </p>
          <div className="btnrow">
            <Link className="btn btn-primary" to="/submit">Submit a product <span className="arw">→</span></Link>
            <a className="btn btn-ghost" href="#how">How it works</a>
            <a className="btn btn-text" href="https://bidso.com">Back to bidso.com <span className="arw">→</span></a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="section">
          <div className="eyebrow"><span className="mark" /> Why Labs exists</div>
          <h2>Good products shouldn't die between the sketch and the shelf.</h2>
          <p className="lede" style={{ marginTop: 24 }}>
            You've designed something good. Making and selling it is the part nobody manages alone —
            tooling runs into lakhs, and brands don't take meetings with individuals.
          </p>
          <p className="lede" style={{ marginTop: 18 }}>
            Labs exists to close that gap: a factory that will engineer and tool your product, and
            retail brands we already supply. You bring the design. We do everything after it — and
            you keep earning from it for as long as it sells.
          </p>
          <p
            style={{
              marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.08)",
              fontSize: "clamp(20px,2.4vw,27px)", lineHeight: 1.35, letterSpacing: "-.018em",
              maxWidth: "34ch", fontWeight: 500,
            }}
          >
            India builds for the world, and designs almost none of what it builds. Not for want of
            designers — for want of a route.
          </p>
          <p className="lede" style={{ marginTop: 16 }}>We'd like to be one.</p>
        </div>

        <div className="section">
          <div className="eyebrow"><span className="mark" /> What we commit to</div>
          <h2>Four commitments, in writing.</h2>
          <p className="lede" style={{ marginTop: 22 }}>
            Timely responses and feedback, protection for your work, investment in your product, and
            a share in what it earns — written into the agreements.
          </p>
          <div className="grid g2" style={{ marginTop: 44 }}>
            {COMMITMENTS.map((c) => (
              <div className={`card${c.hi ? " hi" : ""}`} key={c.title}>
                <div className="ceyebrow"><span className="mark" /> {c.eyebrow}</div>
                <h3>{c.title}</h3>
                <p className="body-text">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section" id="how">
          <div className="eyebrow"><span className="mark" /> How it works</div>
          <h2>Seven stages, and you'll know where you are in all of them.</h2>
          <p className="lede" style={{ marginTop: 20, marginBottom: 40 }}>
            Tooling is expensive and your time isn't ours to waste. The stages exist so that when we
            say yes, it's a yes we can fund.
          </p>
          {STEPS.map(([idx, title, body]) => (
            <div className="step" key={idx}>
              <div className="idx">{idx}</div>
              <div>
                <div className="st">{title}</div>
                <p className="body-text">{body}</p>
              </div>
            </div>
          ))}
          <table className="tbl" style={{ marginTop: 52 }}>
            <tbody>
              <tr><th>Response times</th><th>Clock starts</th></tr>
              <tr><td className="v">48 hours</td><td className="k">Acknowledgement — from the moment you submit</td></tr>
              <tr><td className="v">10 business days</td><td className="k">Screen decision — from the moment you submit</td></tr>
              <tr><td className="v">30 business days</td><td className="k">Evaluation decision — from the day your full detail arrives complete</td></tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <div className="eyebrow"><span className="mark" /> Working together</div>
          <h2>The ways we can work together</h2>
          <p className="lede" style={{ marginTop: 20, marginBottom: 40 }}>
            Which one fits depends on how finished your work is and what you want out of it. We'll
            propose a shape at offer stage, which you're free to argue with, and we'll do our best to
            arrive at a structure that works for everyone.
          </p>
          <div className="grid g2">
            {DEAL_SHAPES.map((d) => (
              <div className={`card${d.hi ? " hi" : ""}`} key={d.title}>
                <div className="ceyebrow"><span className="mark" /> {d.eyebrow}</div>
                <h3>{d.title}</h3>
                <p className="body-text">{d.body}</p>
              </div>
            ))}
          </div>
          <p className="body-text" style={{ marginTop: 26, maxWidth: "64ch" }}>
            The commercials of the deal we propose will depend on how finished the work is and how
            different it is from what's already out there. You'll get a real number at offer stage
            rather than a wide and approximate range now.
          </p>
        </div>

        <div className="section">
          <h2 style={{ maxWidth: "22ch" }}>If your product belongs here, we'd like to see it.</h2>
          <div className="btnrow">
            <Link className="btn btn-primary" to="/submit">Submit a product <span className="arw">→</span></Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
