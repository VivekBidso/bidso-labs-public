import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Banner, Field } from "../lib/ui";
import { getStage2UnlockStatus, submitDesignerStage2 } from "../lib/api";

export default function DesignerStage2() {
  const { referenceNumber } = useParams();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [unlockInfo, setUnlockInfo] = useState(null);
  const [gateError, setGateError] = useState("");

  const [spec, setSpec] = useState("");
  const [targetRetailPrice, setTargetRetailPrice] = useState("");
  const [unitCostEstimate, setUnitCostEstimate] = useState("");
  const [costAssumptions, setCostAssumptions] = useState("");
  const [ipDetail, setIpDetail] = useState("");
  const [priorDisclosure, setPriorDisclosure] = useState("");
  const [cadFiles, setCadFiles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    getStage2UnlockStatus(referenceNumber)
      .then(setUnlockInfo)
      .catch(() => setGateError("We couldn't check this submission — check your reference number."))
      .finally(() => setChecking(false));
  }, [referenceNumber]);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitDesignerStage2(referenceNumber, {
        full_spec: spec,
        target_retail_price: targetRetailPrice || null,
        unit_cost_estimate: unitCostEstimate || null,
        cost_assumptions: costAssumptions,
        ip_detail: ipDetail || null,
        prior_disclosure: priorDisclosure,
        cad_file_count: cadFiles.length,
      });
      navigate(`/status/${referenceNumber}`);
    } catch (e) {
      setSubmitError(e.message || "Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div className="wrap">
        <div className="form"><p className="body-text">Checking your submission…</p></div>
      </div>
    );
  }

  if (gateError || !unlockInfo?.unlocked) {
    return (
      <div className="wrap">
        <div className="form">
          <Banner kind="warn" title="Stage two isn't open for this submission yet">
            {gateError || "This unlocks once your submission has passed screening and the NDA is executed. Check your status page for where things stand."}
          </Banner>
          <div className="btnrow">
            <button className="btn btn-ghost" onClick={() => navigate(`/status/${referenceNumber}`)}>Check status</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="form">
        <div className="fhead">
          <div className="eyebrow"><span className="mark" /> Designer · stage two · {referenceNumber}</div>
          <h1>Send us the detail</h1>
          <p className="lede" style={{ marginTop: 14 }}>
            Your submission got through the screen. This is what the committee needs to evaluate it
            properly.
          </p>
        </div>

        <Banner kind="warn" title={unlockInfo.due_date ? `Due ${unlockInfo.due_date}` : "30-day window"}>
          Requested {unlockInfo.requested_date || "recently"}. We'll send one reminder mid-cycle. If
          we've heard nothing by the due date the submission closes as <b>withdrawn</b> — that's not
          a decline, nothing gets evaluated, and you're free to submit again whenever you like.
        </Banner>

        <Banner kind="info" title="The 30-day clock starts when this arrives complete">
          Not when you start filling it in, and not on a partial upload. It's the one part of the
          timeline that's in your hands rather than ours.
        </Banner>

        <fieldset className="fset">
          <legend>Drawings and CAD</legend>
          <Field>
            <div className="drop">
              <div className="dt">STEP files and native CAD</div>
              <p className="small">100 MB. This is the stage where we do want the source files — we're deciding whether to spend money on tooling.</p>
              <input type="file" multiple onChange={(e) => setCadFiles(Array.from(e.target.files || []))} />
            </div>
          </Field>
          <Field label="Full specification">
            <textarea
              className="inp"
              placeholder="Dimensions, materials, finishes, assemblies, tolerances, anything electrical."
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
            />
          </Field>
        </fieldset>

        <fieldset className="fset">
          <legend>Costs and pricing</legend>
          <div className="two">
            <Field label="Target retail price (INR)">
              <input className="inp" placeholder="1,499" value={targetRetailPrice} onChange={(e) => setTargetRetailPrice(e.target.value)} />
            </Field>
            <Field label="Your estimated unit cost (INR)">
              <input className="inp" placeholder="Best guess is fine" value={unitCostEstimate} onChange={(e) => setUnitCostEstimate(e.target.value)} />
            </Field>
          </div>
          <Field label="Cost assumptions" help="We'll re-cost it ourselves. This tells us what you were designing towards, which is more useful than the number itself.">
            <textarea
              className="inp"
              placeholder="What you've assumed about materials, process, volumes and where it would be made."
              value={costAssumptions}
              onChange={(e) => setCostAssumptions(e.target.value)}
            />
          </Field>
        </fieldset>

        <fieldset className="fset">
          <legend>Protection and history</legend>
          <Field label="Patent, application or registered design detail">
            <input className="inp" placeholder="Number, jurisdiction, status, filing date" value={ipDetail} onChange={(e) => setIpDetail(e.target.value)} />
          </Field>
          <Field label="Has this been out in the world before?" help="Prior disclosure affects what can still be protected. Telling us now costs you nothing; us finding out at tooling stage costs both of us.">
            <textarea
              className="inp"
              placeholder="Sold, shown at a trade fair, crowdfunded, pitched to another manufacturer, posted publicly — anything."
              value={priorDisclosure}
              onChange={(e) => setPriorDisclosure(e.target.value)}
            />
          </Field>
        </fieldset>

        {submitError && <p className="err">{submitError}</p>}

        <div className="btnrow">
          <button className="btn btn-primary" disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Sending…" : "Send detail"} <span className="arw">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
