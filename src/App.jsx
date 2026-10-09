import { useEffect, useState } from "react";
import Home from "./pages/Home";
import ResizePage from "./pages/ResizePage";
import WebPPage from "./pages/WebPPage";
import { currentRoute } from "./utils/navigate";
import { sweepExpiredSessions } from "./utils/session";

export default function App() {
  const [, rerender] = useState(0);
  useEffect(() => { sweepExpiredSessions(); }, []);
  useEffect(() => {
    const f = () => rerender(x => x + 1);
    window.addEventListener("popstate", f);
    return () => window.removeEventListener("popstate", f);
  }, []);
  const path = currentRoute();
  if (path === "/resize") return <ResizePage/>;
  if (path === "/webp") return <WebPPage/>;
  return <Home/>;
}
