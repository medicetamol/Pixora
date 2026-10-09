import { useMemo, useState } from "react";
import { getTargetDims } from "../utils/image";

/**
 * Resize mode / percent / width / height / aspect-lock state used by both pages.
 * Per-page differences are options:
 *  - initialMode
 *  - percentMax + clampPercent: max of the percent input (and whether typing is clamped to it)
 *  - syncDimsOnModeChange: fill width/height from the first image when a resize mode is chosen
 */
export function useResizeSettings({
  initialMode,
  percentMax,
  clampPercent = false,
  syncDimsOnModeChange = false,
  firstItem,
  onChange
}) {
  const [mode, setModeState] = useState(initialMode);
  const [percent, setPercentState] = useState(70);
  const [width, setWidthState] = useState(0);
  const [height, setHeightState] = useState(0);
  const [lock, setLock] = useState(true);

  const heightFromWidth = w => Math.max(1, Math.round(w * firstItem.height / firstItem.width));
  const widthFromHeight = h => Math.max(1, Math.round(h * firstItem.width / firstItem.height));

  const setMode = value => {
    setModeState(value);
    if (syncDimsOnModeChange && value !== "none" && firstItem) {
      setWidthState(firstItem.width);
      setHeightState(firstItem.height);
    }
    onChange();
  };

  const setPercent = raw => {
    if (raw === "") setPercentState("");
    else setPercentState(clampPercent ? Math.min(percentMax, Number(raw)) : Number(raw));
    onChange();
  };

  // Fields may be cleared; the page then shows "Required field" and blocks the action.
  const setWidth = raw => {
    onChange();
    if (raw === "") { setWidthState(""); return; }
    const n = Number(raw);
    setWidthState(n);
    if (lock && firstItem) setHeightState(heightFromWidth(n));
  };

  const setHeight = raw => {
    onChange();
    if (raw === "") { setHeightState(""); return; }
    const n = Number(raw);
    setHeightState(n);
    if (lock && firstItem) setWidthState(widthFromHeight(n));
  };

  const toggleLock = () => { setLock(v => !v); onChange(); };

  const values = useMemo(
    () => ({ mode, percent, width, height, lock }),
    [mode, percent, width, height, lock]
  );
  const restore = s => {
    setModeState(s.mode); setPercentState(s.percent);
    setWidthState(s.width); setHeightState(s.height); setLock(s.lock);
  };

  const getDims = item => getTargetDims(item, { mode, percent, width, height, lock });
  const isInvalid =
    (mode === "pixel" && (!width || !height)) ||
    (mode === "percent" && !percent);

  return {
    mode, percent, width, height, lock,
    setMode, setPercent, setWidth, setHeight, toggleLock,
    getDims, isInvalid, percentMax, values, restore
  };
}
