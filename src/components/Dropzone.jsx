import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function Dropzone({ onFiles, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const handle = files => {
    const list = [...files].filter(f => f.type.startsWith("image/"));
    if (list.length) onFiles(list);
  };
  return <div
    className={`dropzone ${drag ? "dragging" : ""}`}
    onDragOver={e => { e.preventDefault(); setDrag(true); }}
    onDragLeave={() => setDrag(false)}
    onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
    onClick={() => inputRef.current?.click()}
  >
    <input ref={inputRef} type="file" accept={accept} multiple hidden onChange={e => handle(e.target.files)} />
    <div className="upload-icon"><Upload size={27}/></div>
    <h3>Drop images here</h3>
    <span>or</span>
    <button className="primary" type="button" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
      <Upload size={18}/> Choose Images
    </button>
    <p>JPG • PNG • JPEG • WebP • GIF</p>
    <small>Images are processed locally in your browser.</small>
  </div>;
}
