import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Field, OptionGroup } from "../lib/ui";
import { submitManufacturer } from "../lib/api";

const CERTS = ["BIS", "ASTM", "EN", "GCC Mark"];
const INTENT_OPTIONS = [
  { id: "supply", title: "Manufacture and supply", body: "You keep making the product. We buy from you against confirmed orders and sell it on to our brand customers." },
  { id: "handover", title: "Hand over the tooling", body: "You sell the product and its tooling to Bidso outright, and we take it from there." },
  { id: "either", title: "Open to either", body: "Tell us what you'd prefer once you've seen the shape of a deal." },
];

export default function Manufacturer() {
  const navigate = useNavigate();

  const [legalName, setLegalName] = useState("");
  const [gst, setGst] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [factoryLocation, setFactoryLocation] = useState("");
  const [registeredInIndia, setRegisteredInIndia] = useState(true);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [certs, setCerts] = useState(["BIS", "ASTM"]);

  const [intent, setIntent] = useState("supply");

  const [exWorksPrice, setExWorksPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("");
  const [monthlyCapacity, setMonthlyCapacity] = useState("");

  const [ownsRights, setOwnsRights] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function toggleCert(c) {
    setCerts((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = legalName.trim() && contactName.trim() && emailLooksValid && ownsRights && termsAccepted && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await submitManufacturer({
        legal_entity_name: legalName,
        gst_number: gst,
        contact_name: contactName,
        email,
        phone,
        factory_location: factoryLocation,
        registered_in_india: registeredInIndia,
        product_name: productName,
        description,
        photo_count: photos.length,
        certifications: certs,
        intent,
        ex_works_price: exWorksPrice || null,
        moq: moq || null,
        lead_time_days: leadTimeDays || null,
        monthly_capacity: monthlyCapacity || null,
        terms_version: "1.0",
      });
      navigate("/submitted", { state: result });
    } catch (e) {
      setSubmitError(e.message || "Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap">
      <div className="form">
        <div className="fhead">
          <div className="eyebrow"><span className="mark" /> Manufacturer</div>
          <h1>Register a product</h1>
          <p className="lede" style={{ marginTop: 14 }}>
            If you have a product ready for manufacture, with all the tooling in place, we can help
            you grow your sales.
          </p>
        </div>

        <fieldset className="fset">
          <legend>Company</legend>
          <div className="two">
            <Field label="Legal entity name">
              <input className="inp" placeholder="As registered" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
            </Field>
            <Field label="GST number">
              <input className="inp" placeholder="15 characters" value={gst} onChange={(e) => setGst(e.target.value)} maxLength={15} />
            </Field>
          </div>
          <div className="two">
            <Field label="Contact name">
              <input className="inp" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </Field>
            <Field label="Email">
              <input className="inp" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          </div>
          <div className="two">
            <Field label="Phone">
              <input className="inp" placeholder="+91" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Factory location">
              <input className="inp" placeholder="City, state" value={factoryLocation} onChange={(e) => setFactoryLocation(e.target.value)} />
            </Field>
          </div>
          <Check checked={registeredInIndia} onChange={setRegisteredInIndia}>The company is registered in India.</Check>
        </fieldset>

        <fieldset className="fset">
          <legend>The product</legend>
          <Field label="Product name">
            <input className="inp" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea
              className="inp"
              placeholder="What it is, who buys it today, and how long you've been making it."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Photos">
            <div className="drop">
              <div className="dt">Up to five photos of the actual product</div>
              <p className="small">Production units rather than renders, if you have them.</p>
              <input type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files || []))} />
            </div>
          </Field>
          <Field label="Certifications held" help="We'll ask for the certificates themselves at qualification, not now.">
            <div className="opts">
              {CERTS.map((c) => (
                <div
                  key={c}
                  className={`opt mini${certs.includes(c) ? " sel" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleCert(c)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleCert(c)}
                >
                  {c}
                </div>
              ))}
            </div>
          </Field>
        </fieldset>

        <fieldset className="fset">
          <legend>What you have in mind</legend>
          <div className="grid" style={{ gap: 12 }}>
            {INTENT_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className={`card pick${intent === opt.id ? " sel" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setIntent(opt.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIntent(opt.id)}
              >
                <h4 style={{ marginBottom: 6 }}>{opt.title}</h4>
                <p className="small">{opt.body}</p>
              </div>
            ))}
          </div>
          <p className="help">This routes the conversation — it doesn't commit you or us to anything.</p>
        </fieldset>

        <fieldset className="fset">
          <legend>Commercials</legend>
          <div className="two">
            <Field label="Ex-works price (INR)">
              <input className="inp" placeholder="Per unit" value={exWorksPrice} onChange={(e) => setExWorksPrice(e.target.value)} />
            </Field>
            <Field label="Minimum order quantity">
              <input className="inp" placeholder="Units" value={moq} onChange={(e) => setMoq(e.target.value)} />
            </Field>
          </div>
          <div className="two">
            <Field label="Lead time (days)">
              <input className="inp" placeholder="From order to shipment" value={leadTimeDays} onChange={(e) => setLeadTimeDays(e.target.value)} />
            </Field>
            <Field label="Current monthly capacity">
              <input className="inp" placeholder="Units" value={monthlyCapacity} onChange={(e) => setMonthlyCapacity(e.target.value)} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="fset">
          <legend>Ownership</legend>
          <Check checked={ownsRights} onChange={setOwnsRights}>I own, or have full rights to supply, this product and its tooling.</Check>
        </fieldset>

        <fieldset className="fset">
          <legend>Supply Enquiry Terms</legend>
          <div className="termsbox">
            <div className="tv">Version 1.0 · 24 August 2026</div>
            <p><strong style={{ color: "var(--white)" }}>Not confidential.</strong> Information supplied at enquiry stage is not treated as confidential in either direction.</p>
            <p style={{ marginTop: 14 }}><strong style={{ color: "var(--white)" }}>Purpose.</strong> What you send is used to qualify you as a supplier and for nothing else.</p>
            <p style={{ marginTop: 14 }}><strong style={{ color: "var(--white)" }}>No non-use.</strong> The 24-month non-use commitment offered on design submissions does not apply to the manufacturer track.</p>
            <p style={{ marginTop: 14 }}><strong style={{ color: "var(--white)" }}>No obligation.</strong> Bidso is under no obligation to proceed, to place an order, or to give reasons…</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <Check checked={termsAccepted} onChange={setTermsAccepted}>
              I accept the Supply Enquiry Terms (v1.0, 24 August 2026).
            </Check>
          </div>
          <p className="help">This is a gate, not a deal. If we qualify you, there's a full supply agreement to sign before anything is ordered.</p>
        </fieldset>

        {submitError && <p className="err">{submitError}</p>}

        <div className="btnrow">
          <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
            {submitting ? "Registering…" : "Register product"} <span className="arw">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
