// The site may be served from a sub-path (GitHub Pages: /Pixora/), so routes are kept
// relative to Vite's BASE_URL.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Current route without the base path, e.g. "/", "/resize", "/webp". */
export function currentRoute() {
  let p = window.location.pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  return p.replace(/\/+$/, "") || "/";
}

export function navigate(route) {
  window.history.pushState({}, "", BASE + route);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function scrollToRef(ref, delay = 180) {
  requestAnimationFrame(() => setTimeout(() =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), delay));
}
