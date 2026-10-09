import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { formatBytes } from "../utils/format";
import { downloadBlob } from "../utils/image";

export default function PreviewModal({ item, onClose }) {
  const blob = item?.result?.blob;
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!blob) { setSrc(null); return; }
    const url = URL.createObjectURL(blob);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  if (!item?.result || !src) return null;
  return <div className="modal-backdrop" onClick={onClose}>
    <div className="preview-modal" onClick={e => e.stopPropagation()}>
      <div className="modal-head">
        <div>
          <h3>Preview</h3>
          <p>{item.result.name} • {formatBytes(item.result.size)}</p>
        </div>
        <button className="icon-btn" onClick={onClose}><X/></button>
      </div>
      <div className="modal-image"><img src={src} alt={item.result.name}/></div>
      <button className="primary wide" onClick={() => downloadBlob(item.result.blob, item.result.name)}>
        <Download size={18}/> Download
      </button>
    </div>
  </div>;
}
