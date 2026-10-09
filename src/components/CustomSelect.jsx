import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value) || options[0];
  const ref = useRef(null);

  useEffect(() => {
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return <div className={`custom-select ${open ? "open" : ""}`} ref={ref}>
    <button type="button" className="custom-select-trigger" onClick={() => setOpen(v => !v)}>
      <span>{current.label}</span><ChevronDown size={18}/>
    </button>
    {open && <div className="custom-select-menu">
      {options.map(option => <button type="button" key={option.value}
        className={`custom-select-option ${option.value === value ? "selected" : ""}`}
        onClick={() => { onChange(option.value); setOpen(false); }}>
        <span>{option.label}</span>
        {option.value === value && <Check size={17}/>}
      </button>)}
    </div>}
  </div>;
}
