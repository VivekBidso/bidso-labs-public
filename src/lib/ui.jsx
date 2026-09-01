import { Link } from "react-router-dom";

export function Nav() {
  return (
    <div className="navbar">
      <div className="nav">
        <div className="logo">
          <div className="sq">
            <div className="s s1" /><div className="s s2" /><div className="s s3" /><div className="s s4" />
          </div>
          <div className="wm">BIDSO</div>
          <div className="labs">LABS</div>
        </div>
        <div className="links">
          <a href="/#how">How it works</a>
        </div>
        <div className="navcta">
          <Link className="btn btn-primary" to="/submit">
            Submit a product <span className="arw">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** A single-select group of pill-style options. `value` is the selected option's value. */
export function OptionGroup({ options, value, onChange, mini = false }) {
  return (
    <div className="opts">
      {options.map((opt) => (
        <div
          key={opt}
          className={`opt${mini ? " mini" : ""}${value === opt ? " sel" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => onChange(opt)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(opt)}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

/** A single checkbox styled to match the wireframe's `.check` element. */
export function Check({ checked, onChange, children }) {
  return (
    <div
      className={`check${checked ? " on" : ""}`}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(!checked)}
    >
      <div className="box" />
      <div>{children}</div>
    </div>
  );
}

export function Banner({ kind = "info", title, children }) {
  return (
    <div className={`banner ${kind}`}>
      <div className="bd" />
      <div>
        <div className="bt">{title}</div>
        <div className="bb">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, help, error, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {help && <p className="help">{help}</p>}
      {error && <p className="err">{error}</p>}
    </div>
  );
}

export function Footer() {
  return (
    <div className="foot">
      <span>Terms of Submission (v1.0)</span>
      <span>Privacy notice</span>
      <span>Retention schedule</span>
      <span>labs@bidso.com</span>
      <span style={{ marginLeft: "auto", color: "var(--steel)" }}>A division of Bidso</span>
    </div>
  );
}
