import { Trash2 } from "lucide-react";

export default function ImagesHeader({ subtitle, onClear, children }) {
  return <section className="section-head">
    <div><h2>Your images</h2><p>{subtitle}</p></div>
    <button className="clear-btn clear-top" onClick={onClear}>
      <Trash2 size={17}/> Clear All
    </button>
    {children}
  </section>;
}
