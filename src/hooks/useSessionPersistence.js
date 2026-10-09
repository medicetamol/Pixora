import { useCallback, useEffect, useRef, useState } from "react";
import { storageGet, storageSet } from "../utils/storage";
import { SESSION_TTL, clearSession, mediaKey, metaKey } from "../utils/session";

const SAVE_DELAY = 400;

/**
 * Keeps a page's work (images, results, logs, settings) in IndexedDB so it survives
 * the browser dropping the tab while you are in another app.
 *
 *  media = heavy part (items with files/blobs + batches); saved only when it changes
 *  meta  = light part (settings + done flag); saved on every change
 *
 * Returns { ready, clearSaved }: ready is false until the saved session has been restored.
 * Saved data is removed on Clear All, and 30 minutes after the work was last touched.
 */
export function useSessionPersistence(key, media, meta, apply) {
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const latest = useRef({ media, meta });
  latest.current = { media, meta };

  const mediaId = mediaKey(key);
  const metaId = metaKey(key);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [savedMeta, savedMedia] = await Promise.all([storageGet(metaId), storageGet(mediaId)]);
      if (cancelled) return;
      const fresh = savedMeta && savedMedia && Date.now() - savedMeta.savedAt < SESSION_TTL;
      if (fresh) apply(savedMedia, savedMeta);
      else if (savedMeta || savedMedia) clearSession(key);
      readyRef.current = true;
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [key]);

  const saveMedia = useCallback(() => {
    if (!readyRef.current) return;
    const { media: m } = latest.current;
    if (m.items.length === 0) clearSession(key);
    else storageSet(mediaId, m);
  }, [key]);

  const saveMeta = useCallback(() => {
    if (!readyRef.current) return;
    const { media: m, meta: t } = latest.current;
    if (m.items.length === 0) return;
    storageSet(metaId, { ...t, savedAt: Date.now() });
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(saveMedia, SAVE_DELAY);
    return () => clearTimeout(t);
  }, [ready, media]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(saveMeta, SAVE_DELAY);
    return () => clearTimeout(t);
  }, [ready, meta, media.items.length]);

  // Save immediately when the tab is hidden / app is switched away.
  useEffect(() => {
    const flush = () => { saveMedia(); saveMeta(); };
    const onVisibility = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [saveMedia, saveMeta]);

  const clearSaved = useCallback(() => { clearSession(key); }, [key]);

  return { ready, clearSaved };
}
