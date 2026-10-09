import { ArrowRight, Maximize2, Zap } from "lucide-react";
import PageShell from "../components/PageShell";
import PrivacyNote from "../components/PrivacyNote";
import { navigate } from "../utils/navigate";

export default function Home() {
  return <PageShell title="Simple Image Tools" subtitle="Resize images or convert them to WebP — directly on your device.">
    <div className="tool-grid">
      <button className="tool-card" onClick={() => navigate("/resize")}><div className="tool-icon"><Maximize2/></div><div><h2>Resize Image</h2><p>Change dimensions, format, quality and DPI.</p></div><ArrowRight/></button>
      <button className="tool-card" onClick={() => navigate("/webp")}><div className="tool-icon"><Zap/></div><div><h2>Image → WebP</h2><p>Convert multiple images to compact WebP files.</p></div><ArrowRight/></button>
    </div>
    <PrivacyNote/>
  </PageShell>;
}
