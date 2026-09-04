import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banner, Check, Field, OptionGroup } from "../lib/ui";
import { submitDesignerStage1, uploadFiles } from "../lib/api";

const FINISH_OPTIONS = ["Raw idea", "Concept", "Engineering drawing", "Finished tooling"];

export default function DesignerStage1() {
  const navigate = useNavigate();

  // About you
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // The product
  const [workingTitle, setWorkingTitle] = useState("");
  const [finishStage, setFinishStage] = useState("Concept");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  // Employment
  const [relatesToEmployer, setRelatesToEmployer] = useState("Yes");
  const [madeOnEmployerTime, setMadeOnEmployerTime] = useState("No");
  const [canGetReleaseLetter, setCanGetReleaseLetter] = useState("Yes");

  // Other contributors
  const [hasCoContributors, setHasCoContributors] = useState("No");
  const [coContributorNames, setCoContributorNames] = useState("");

  // Existing protection
  const [hasIp, setHasIp] = useState("No");
  const [ipNumber, setIpNumber] = useState("");
  const [ipTouched, setIpTouched] = useState(false);

  // Confirmations
  const [warrantiesConfirmed, setWarrantiesConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // The one hard stop on this form (per the wireframe's own copy: "A flat no
  // is the one answer that stops the submission here"). Employment questions
  // sit inside the normal form flow, after "About you" — earlier fields
  // aren't hidden or gated on this; only submission itself is blocked.
  const hardStopped = canGetReleaseLetter === "No";

  // IP application-number format is flagged as an open question in
  // tech-architecture.md — the wireframe shows "IN 20244" as invalid but the
  // exact regex isn't derivable from the HTML alone. Placeholder check only:
  // require at least one letter and enough digits to look non-trivial.
  const ipNumberLooksValid = !hasIp || hasIp === "No" || /[A-Za-z].*\d{3,}/.test(ipNumber);

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const canSubmit =
    !hardStopped &&
    fullName.trim() &&
    emailLooksValid &&
    finishStage.trim() &&
    description.trim() &&
    warrantiesConfirmed &&
    termsAccepted &&
    (hasIp === "No" || ipNumberLooksValid) &&
    !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await submitDesignerStage1({
        full_name: fullName,
        email,
        phone,
        city,
        working_title: workingTitle || null,
        finish_stage: finishStage,
        description,
        file_count: files.length,
        employer_relates: relatesToEmployer,
        made_on_employer_time: madeOnEmployerTime,
        can_get_release_letter: canGetReleaseLetter,
        has_co_contributors: hasCoContributors === "Yes",
        co_contributor_names: hasCoContributors === "Yes" ? coContributorNames : null,
        has_existing_ip: hasIp === "Yes",
        ip_number: hasIp === "Yes" ? ipNumber : null,
        terms_version: "1.0",
      });

      let uploadWarning = null;
      if (files.length) {
        const { failedNames } = await uploadFiles(result.submission_id, files);
        if (failedNames.length) {
          uploadWarning = `Your submission is in, but ${failedNames.length} file${failedNames.length > 1 ? "s" : ""} didn't upload (${failedNames.join(", ")}). Reply to your acknowledgement email and attach ${failedNames.length > 1 ? "them" : "it"} directly.`;
        }
      }

      navigate("/submitted", { state: { ...result, uploadWarning } });
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
          <div className="eyebrow"><span className="mark" /> Designer · stage one</div>
          <h1>Submit a product</h1>
          <p className="lede" style={{ marginTop: 14 }}>
            Deliberately short. If it gets past the screen we'll come back for drawings and detail.
          </p>
        </div>

        <Banner kind="info" title="Before you start">
          This submission is <b>not confidential</b> at stage one, which is why we ask for minimal
          details. NDAs and other agreements come in after the first screen. If we decline your
          product after detailed evaluation, we promise that we won't commercialise your design for
          24 months — no exceptions. Both of those are in the Terms at the bottom of this form.
        </Banner>

        <fieldset className="fset">
          <legend>About you</legend>
          <div className="two">
            <Field label="Full name">
              <input className="inp" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Email">
              <input className="inp" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          </div>
          <div className="two">
            <Field label="Phone">
              <input className="inp" placeholder="+91" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="City">
              <input className="inp" placeholder="Bengaluru" value={city} onChange={(e) => setCity(e.target.value)} />
            </Field>
          </div>
          <Check checked onChange={() => {}}>I'm 18 or over and resident in India.</Check>
        </fieldset>

        <fieldset className="fset">
          <legend>The product</legend>
          <Field label="Working title" help="Only so we both have something to call it.">
            <input className="inp" placeholder="Optional" value={workingTitle} onChange={(e) => setWorkingTitle(e.target.value)} />
          </Field>
          <Field label="How finished is it?" help="Be honest here — it sets what we ask for next and what kind of deal fits. Nothing is disqualified for being early.">
            <OptionGroup options={FINISH_OPTIONS} value={finishStage} onChange={setFinishStage} />
          </Field>
          <Field label="Describe it in a paragraph">
            <textarea
              className="inp"
              placeholder="What it is, who it's for, and what makes it different from what's already on the shelf."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Images">
            <div className="drop">
              <div className="dt">Drop up to three images, or one PDF</div>
              <p className="small">25 MB total. No CAD at this stage — we don't want to be holding your source files for something we might decline.</p>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </div>
          </Field>
        </fieldset>

        <fieldset className="fset">
          <legend>Your employment</legend>
          <p className="fnote">
            Two questions we have to ask. A yes to either doesn't stop anything — it just means we'd
            need a short letter from your employer before we could sign a deal.
          </p>
          <Field label="Does this relate to your employer's field of business?">
            <OptionGroup options={["Yes", "No", "Not employed"]} value={relatesToEmployer} onChange={setRelatesToEmployer} />
          </Field>
          <Field label="Did you make it using your employer's time, tools, materials or facilities?">
            <OptionGroup options={["Yes", "No"]} value={madeOnEmployerTime} onChange={setMadeOnEmployerTime} />
          </Field>
          <Field
            label="Could you get a letter from them confirming they've no claim to it?"
            help={!hardStopped && '"Not sure" is fine and we\'ll work through it with you. A flat no is the one answer that stops the submission here.'}
          >
            <OptionGroup options={["Yes", "Not sure", "No"]} value={canGetReleaseLetter} onChange={setCanGetReleaseLetter} />
          </Field>
          {hardStopped && (
            <Banner kind="warn" title="We can't take this submission as-is">
              Without being able to get that letter, we can't accept this product — a clean release
              from your employer is not optional. If your situation changes, come back and submit
              again.
            </Banner>
          )}
        </fieldset>

        {!hardStopped && (
          <>
            <fieldset className="fset">
              <legend>Other contributors</legend>
              <Field
                label="Did anyone else work on this?"
                help="Everyone who contributed has to sign any deal we do, so it's much easier to name them now than to find them later."
              >
                <OptionGroup options={["No", "Yes"]} value={hasCoContributors} onChange={setHasCoContributors} />
              </Field>
              {hasCoContributors === "Yes" && (
                <Field label="Names of everyone else who contributed" help="Full names — we'll follow up with each of them before any deal is signed.">
                  <textarea
                    className="inp"
                    placeholder="One name per line"
                    value={coContributorNames}
                    onChange={(e) => setCoContributorNames(e.target.value)}
                  />
                </Field>
              )}
            </fieldset>

            <fieldset className="fset">
              <legend>Existing protection</legend>
              <Field label="Is there a patent, application, or registered design?">
                <OptionGroup options={["No", "Yes"]} value={hasIp} onChange={setHasIp} />
              </Field>
              {hasIp === "Yes" && (
                <Field
                  label="Number and jurisdiction"
                  error={ipTouched && !ipNumberLooksValid ? "That doesn't look like a complete application number." : null}
                >
                  <input
                    className={`inp${ipTouched && !ipNumberLooksValid ? " bad" : ""}`}
                    placeholder="e.g. IN 202411012345"
                    value={ipNumber}
                    onChange={(e) => setIpNumber(e.target.value)}
                    onBlur={() => setIpTouched(true)}
                  />
                </Field>
              )}
            </fieldset>

            <fieldset className="fset">
              <legend>What you're confirming</legend>
              <div className="warrant">
                <ol>
                  <li>You own the design, or have full rights to submit and deal with it.</li>
                  <li>It's original and doesn't infringe anyone else's rights.</li>
                  <li>It isn't licensed, optioned, assigned or pledged to anyone else.</li>
                  <li>You're 18 or over, resident in India, and able to enter a contract.</li>
                  <li>Everyone who contributed has been named above.</li>
                  <li>Submitting it doesn't breach a confidentiality obligation you owe to someone else.</li>
                </ol>
              </div>
              <div style={{ marginTop: 6 }}>
                <Check checked={warrantiesConfirmed} onChange={setWarrantiesConfirmed}>All six are true.</Check>
              </div>
            </fieldset>

            <fieldset className="fset">
              <legend>Terms of Submission</legend>
              <div className="termsbox">
                <div className="tv">Version 1.0 · 24 August 2026</div>
                <p><strong style={{ color: "var(--white)" }}>Not confidential at stage one.</strong> Bidso does not treat stage-one submissions as confidential. Bidso operates its own internal design function. A mutual NDA is put in place before stage-two detail is requested.</p>
                <p style={{ marginTop: 14 }}><strong style={{ color: "var(--white)" }}>Twenty-four-month non-use.</strong> Where Bidso declines a submission after detailed evaluation, it will not commercialise the specific protectable IP disclosed in it for twenty-four months from the decision date. There is no exception to this.</p>
                <p style={{ marginTop: 14 }}><strong style={{ color: "var(--white)" }}>Retention.</strong> Bidso holds submission records for a stated period depending on outcome, and deletes both files and personal data at the end of it…</p>
              </div>
              <div style={{ marginTop: 14 }}>
                <Check checked={termsAccepted} onChange={setTermsAccepted}>
                  I've read and accept the Terms of Submission (v1.0, 24 August 2026).
                </Check>
              </div>
              <p className="help">The version you accept is recorded with your submission, so we can both tell later which terms applied.</p>
            </fieldset>

            {submitError && <p className="err">{submitError}</p>}

            <div className="btnrow">
              <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
                {submitting ? "Submitting…" : "Submit product"} <span className="arw">→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
