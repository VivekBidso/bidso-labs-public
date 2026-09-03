import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field } from "../lib/ui";
import { submitBrand } from "../lib/api";

export default function Brand() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = company.trim() && contactName.trim() && emailLooksValid && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitBrand({ company, contact_name: contactName, email, phone, looking_for: lookingFor });
      navigate("/");
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
          <div className="eyebrow"><span className="mark" /> Brand enquiry</div>
          <h1>Tell us what you're looking for</h1>
          <p className="lede" style={{ marginTop: 14 }}>
            Bidso Labs is a platform for designers and manufacturers to submit products. For brands,
            we have a dedicated team to work with you. Please share your details and someone will
            reach out to you.
          </p>
        </div>

        <fieldset className="fset">
          <legend>Your details</legend>
          <div className="two">
            <Field label="Company">
              <input className="inp" value={company} onChange={(e) => setCompany(e.target.value)} />
            </Field>
            <Field label="Contact name">
              <input className="inp" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </Field>
          </div>
          <div className="two">
            <Field label="Email">
              <input className="inp" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Phone">
              <input className="inp" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="fset">
          <legend>What you're looking for</legend>
          <Field>
            <textarea
              className="inp"
              placeholder="An existing product from the catalogue, or something developed for you. Rough volumes and timing help."
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
            />
          </Field>
        </fieldset>

        {submitError && <p className="err">{submitError}</p>}

        <div className="btnrow">
          <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
            {submitting ? "Sending…" : "Send enquiry"} <span className="arw">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
