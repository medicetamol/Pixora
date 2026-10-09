import { Lock, Unlock } from "lucide-react";
import CustomSelect from "./CustomSelect";
import Field from "./Field";

export const RESIZE_FIRST_OPTIONS = [
  { value: "percent", label: "Resize by Percentage" },
  { value: "pixel", label: "Resize by Pixel" },
  { value: "none", label: "No Resize" }
];

export const RESIZE_LAST_OPTIONS = [
  { value: "none", label: "No Resize" },
  { value: "percent", label: "Resize by Percentage" },
  { value: "pixel", label: "Resize by Pixel" }
];

/** Resize mode dropdown + percent field or width/lock/height fields. Driven by useResizeSettings. */
export default function ResizeFields({
  mode, percent, width, height, lock,
  setMode, setPercent, setWidth, setHeight, toggleLock,
  percentMax, options
}) {
  return <>
    <label className="field">Resize Image
      <CustomSelect value={mode} onChange={setMode} options={options}/>
    </label>

    {mode === "percent" && <Field label="Percent" invalid={!percent}>
      <div className="input-suffix full-input">
        <input type="number" min="1" max={percentMax} value={percent} placeholder="Required"
          onChange={e => setPercent(e.target.value)}/>
        <span>%</span>
      </div>
    </Field>}

    {mode === "pixel" && <div className={`dimensions ${!width || !height ? "has-error" : ""}`}>
      <Field label="Width" invalid={!width}>
        <input type="number" min="1" value={width === 0 ? "" : width} placeholder="Required"
          onChange={e => setWidth(e.target.value)}/>
      </Field>
      <button className="lock-btn" onClick={toggleLock}>
        {lock ? <Lock size={17}/> : <Unlock size={17}/>}
      </button>
      <Field label="Height" invalid={!height}>
        <input type="number" min="1" value={height === 0 ? "" : height} placeholder="Required"
          onChange={e => setHeight(e.target.value)}/>
      </Field>
    </div>}
  </>;
}
