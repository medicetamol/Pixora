import { Check, RefreshCw } from "lucide-react";

/** Idle -> busy -> done button used for Convert / Resize. */
export default function ProcessButton({
  className, doneClassName, busy, done, disabled, onClick,
  idleIcon, idleLabel, busyLabel, doneLabel, spinnerSize
}) {
  return <button className={`${className} ${done ? doneClassName : ""}`} disabled={disabled} onClick={onClick}>
    {busy ? <><RefreshCw className="spin" size={spinnerSize}/> {busyLabel}</> :
     done ? <><Check size={18}/> {doneLabel}</> :
     <>{idleIcon} {idleLabel}</>}
  </button>;
}
