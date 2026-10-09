/** A labelled input. When `invalid`, it gets the red border and a "Required field" note. */
export default function Field({ label, invalid = false, className = "", children }) {
  return <label className={`field ${invalid ? "has-error" : ""} ${className}`}>
    {label}
    {children}
    {invalid && <span className="field-error">Required field</span>}
  </label>;
}
