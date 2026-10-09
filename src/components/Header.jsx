import { useState } from "react";
import { Image as ImageIcon, Menu } from "lucide-react";
import { currentRoute, navigate } from "../utils/navigate";

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = currentRoute();
  const go = p => { navigate(p); setOpen(false); };
  return <header className="topbar">
    <div className="brand" onClick={() => go("/")}>
      <div className="brand-mark"><ImageIcon size={21}/></div>
      <span>Pixora</span>
    </div>
    <nav className={`nav ${open ? "nav-open" : ""}`}>
      <button className={path === "/resize" ? "active" : ""} onClick={() => go("/resize")}>Resize Image</button>
      <button className={path === "/webp" ? "active" : ""} onClick={() => go("/webp")}>Image → WebP</button>
    </nav>
    <button className="menu-btn" aria-label="Menu" onClick={() => setOpen(v => !v)}><Menu/></button>
  </header>;
}
