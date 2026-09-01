import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, OptionGroup } from "../lib/ui";

const PERSONAS = [
  { id: "designer", eyebrow: "Designer", title: "I've designed something", body: "An idea, some sketches, or a tooling-ready CAD model. You've designed it, and you want it made and sold." },
  { id: "mfr", eyebrow: "Manufacturer", title: "I manufacture a product", body: "Tooling is production-ready, but you want help to sell the product." },
  { id: "brand", eyebrow: "Brand", title: "I'm a brand", body: "You want to source or develop a product for your own label." },
];

export default function Entry() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState("designer");
  const [residentInIndia, setResidentInIndia] = useState(true);
  const [over18, setOver18] = useState(true);

  const showEligibility = persona !== "brand";
  const canContinue = persona === "brand" || (residentInIndia && over18);

  function handleContinue() {
    if (persona === "brand") {
      navigate("/brand");
      return;
    }
    if (!residentInIndia) {
      navigate("/ineligible");
      return;
    }
    if (!over18) return; // no route for under-18 in the wireframe — block continuing silently, same behaviour class as the residency gate
    navigate(persona === "designer" ? "/designer" : "/manufacturer");
  }

  return (
    <div className="wrap">
      <div className="form">
        <div className="fhead">
          <div className="eyebrow"><span className="mark" /> Step 1 of 2</div>
          <h1>Which of these is you?</h1>
        </div>

        <div className="grid" style={{ gap: 14 }}>
          {PERSONAS.map((p) => (
            <div
              key={p.id}
              className={`card pick${persona === p.id ? " sel" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => setPersona(p.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPersona(p.id)}
            >
              <div className="ceyebrow"><span className="mark" /> {p.eyebrow}</div>
              <h3>{p.title}</h3>
              <p className="body-text">{p.body}</p>
            </div>
          ))}
        </div>

        {showEligibility && (
          <fieldset className="fset" style={{ marginTop: 36 }}>
            <legend>Step 2 of 2 — eligibility</legend>
            <p className="fnote">
              Labs is open to residents of India only. We ask before the form rather than after it,
              so nobody fills in twenty fields for nothing.
            </p>
            <div className="field">
              <label>Do you live in India?</label>
              <OptionGroup
                options={["Yes", "No"]}
                value={residentInIndia ? "Yes" : "No"}
                onChange={(v) => setResidentInIndia(v === "Yes")}
              />
              <p className="help">
                Residence, not nationality — it's what governs tax and data protection, and it's the
                thing we can actually act on.
              </p>
            </div>
            <Check checked={over18} onChange={setOver18}>I'm 18 or over.</Check>
          </fieldset>
        )}

        <div className="btnrow">
          <button
            className="btn btn-primary"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue <span className="arw">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
