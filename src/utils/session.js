import { storageDelete, storageGet } from "./storage";

// Saved work is wiped this long after it was last touched.
export const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

const PAGE_KEYS = ["resize", "webp"];

export const mediaKey = key => `${key}:media`;
export const metaKey = key => `${key}:meta`;

export const clearSession = key =>
  Promise.all([storageDelete(mediaKey(key)), storageDelete(metaKey(key))]);

/** Remove expired (or half-saved) sessions of every page; run once when the app opens. */
export async function sweepExpiredSessions() {
  for (const key of PAGE_KEYS) {
    const meta = await storageGet(metaKey(key));
    if (!meta || Date.now() - meta.savedAt >= SESSION_TTL) await clearSession(key);
  }
}
