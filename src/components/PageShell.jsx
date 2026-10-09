import Header from "./Header";

export default function PageShell({ title, subtitle, children }) {
  return <><Header/><main className="container">
    <div className="hero"><div className="eyebrow"><span className="dot"/> PIXORA</div><h1>{title}</h1><p>{subtitle}</p></div>
    {children}
  </main><footer>Fast • Free • Browser-based • No upload</footer></>;
}
