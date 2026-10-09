// Tiny IndexedDB key-value store. Every call fails soft (returns null/false)
// so the app still works when storage is unavailable (e.g. private mode).
const DB_NAME = "imagetools";
const STORE = "sessions";
let dbPromise = null;

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    dbPromise.catch(() => { dbPromise = null; });
  }
  return dbPromise;
}

function request(mode, run) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = run(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req?.result ?? null);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

export const storageGet = key => request("readonly", s => s.get(key)).catch(() => null);
export const storageSet = (key, value) => request("readwrite", s => s.put(value, key)).then(() => true).catch(() => false);
export const storageDelete = key => request("readwrite", s => s.delete(key)).then(() => true).catch(() => false);
