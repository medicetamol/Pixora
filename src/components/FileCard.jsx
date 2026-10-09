import { Download, Image as ImageIcon, X } from "lucide-react";
import { formatBytes, savingPercent } from "../utils/format";
import { downloadBlob } from "../utils/image";

/** One selected image. `className` carries the page-specific card layout. */
export default function FileCard({ item, className = "", onRemove, onPreview }) {
  return <div className={`file-card ${className}`}>
    <img src={item.preview} alt="" />
    <div className="file-meta">
      <strong title={item.file.name}>{item.file.name}</strong>
      <span>{item.width} × {item.height} • {formatBytes(item.file.size)}</span>
      {item.result && <>
        <span className="result-line">{formatBytes(item.file.size)} → {formatBytes(item.result.size)}</span>
        <span className="saving">↓ {savingPercent(item)}% smaller</span>
      </>}
    </div>
    <button className="icon-btn remove" onClick={() => onRemove(item.id)} aria-label="Remove"><X size={18}/></button>
    {item.result && <div className="file-actions">
      <button className="soft-action" onClick={() => onPreview(item)}><ImageIcon size={16}/> Preview</button>
      <button className="soft-action" onClick={() => downloadBlob(item.result.blob, item.result.name)}><Download size={16}/> Download</button>
    </div>}
  </div>;
}
