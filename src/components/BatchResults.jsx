import { Archive, Check, Download, Trash2 } from "lucide-react";
import { batchLabel, formatBytes } from "../utils/format";
import { downloadBlob } from "../utils/image";

export function SuccessCaption({ className = "", children }) {
  return <div className={`conversion-success ${className}`}>
    <Check size={18}/>
    <span>{children}</span>
  </div>;
}

/**
 * One block per run, separated by "2nd Batch" etc.
 * Each file: name on line one; "before => after" (after in green) + Preview | Download on line two.
 */
export function BatchLog({ batches, onPreview, lastBatchRef, className = "" }) {
  if (!batches.length) return null;
  return <div className={`conversion-summary ${className}`}>
    {batches.map((batch, batchIndex) => <div className="conversion-batch" key={batchIndex}
      ref={batchIndex === batches.length - 1 ? lastBatchRef : null}>
      {batchIndex > 0 && <div className="batch-separator"><span>{batchLabel(batchIndex)}</span></div>}
      {batch.map(entry => <div className="log-entry" key={entry.id}>
        <div className="log-name">{entry.name}</div>
        <div className="log-line">
          <span>{formatBytes(entry.before)} =&gt; <b className="log-after">{formatBytes(entry.after)}</b></span>
          <span className="log-actions">
            <button type="button" className="log-link" onClick={() => onPreview(entry)}>Preview</button>
            <span className="log-divider">|</span>
            <button type="button" className="log-link"
              onClick={() => downloadBlob(entry.result.blob, entry.result.name)}>Download</button>
          </span>
        </div>
      </div>)}
    </div>)}
  </div>;
}

/** Zip of everything, or the share sheet (greyed out when sharing files isn't possible). */
export function DownloadActions({ count, onZip, onShare, shareDisabled, disabled }) {
  return <div className="download-row">
    <button className="download-all-highlight ready" disabled={disabled} onClick={onZip}>
      <Archive size={19}/> Zip ({count})
    </button>
    <button className={`download-all-highlight ${shareDisabled ? "" : "ready"}`}
      disabled={disabled || shareDisabled} onClick={onShare}
      title={shareDisabled ? "Sharing files isn't available in this browser" : undefined}>
      <Download size={19}/> Download
    </button>
  </div>;
}

export function ClearAllButton({ onClick }) {
  return <button className="clear-btn" onClick={onClick}>
    <Trash2 size={17}/> Clear All
  </button>;
}
