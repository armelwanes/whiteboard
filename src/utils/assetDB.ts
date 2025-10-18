/**
 * assetDB - minimal IndexedDB wrapper for asset storage
 * Provides async functions to store/get assets when localStorage is not available
 */

const DB_NAME = 'whiteboard-assets-db';
const DB_VERSION = 1;
const ASSETS_STORE = 'assets';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = (ev.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(ASSETS_STORE)) {
        db.createObjectStore(ASSETS_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveAllAssetsToIDB(assets: any[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSETS_STORE, 'readwrite');
    const store = tx.objectStore(ASSETS_STORE);
    // Clear existing then add all
    const clearReq = store.clear();
    clearReq.onsuccess = () => {
      for (const asset of assets) {
        const toStore = { ...asset };
        try {
          // convert dataUrl to blob for storage efficiency
          if (toStore.dataUrl && typeof toStore.dataUrl === 'string' && toStore.dataUrl.startsWith('data:')) {
            const blob = dataURLToBlob(toStore.dataUrl);
            toStore.dataBlob = blob;
            delete toStore.dataUrl;
          }
        } catch (err) {
          // fallback: store as-is
          console.warn('[assetDB] failed to convert dataUrl to blob for asset', asset.id, err);
        }
        store.put(toStore);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function addAssetToIDB(asset: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSETS_STORE, 'readwrite');
    const store = tx.objectStore(ASSETS_STORE);
    const toStore = { ...asset };
    try {
      if (toStore.dataUrl && typeof toStore.dataUrl === 'string' && toStore.dataUrl.startsWith('data:')) {
        toStore.dataBlob = dataURLToBlob(toStore.dataUrl);
        delete toStore.dataUrl;
      }
    } catch (err) {
      console.warn('[assetDB] failed to convert dataUrl to blob for asset', asset.id, err);
    }
    const req = store.put(toStore);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllAssetsFromIDB(): Promise<any[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSETS_STORE, 'readonly');
    const store = tx.objectStore(ASSETS_STORE);
    const req = store.getAll();
    req.onsuccess = async () => {
      const results = req.result || [];
      // convert blobs back to dataUrl for compatibility
      const converted = await Promise.all(results.map(async (r: any) => {
        if (r.dataBlob) {
          try {
            const dataUrl = await blobToDataURL(r.dataBlob);
            r.dataUrl = dataUrl;
            delete r.dataBlob;
          } catch (err) {
            console.warn('[assetDB] failed to convert blob to dataUrl for asset', r.id, err);
          }
        }
        return r;
      }));
      resolve(converted);
    };
    req.onerror = () => reject(req.error);
  });
}

// Helper: convert dataURL to Blob
function dataURLToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Helper: convert Blob to dataURL
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function deleteAssetFromIDB(assetId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSETS_STORE, 'readwrite');
    const store = tx.objectStore(ASSETS_STORE);
    const req = store.delete(assetId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllAssetsFromIDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSETS_STORE, 'readwrite');
    const store = tx.objectStore(ASSETS_STORE);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export default {
  saveAllAssetsToIDB,
  addAssetToIDB,
  getAllAssetsFromIDB,
  deleteAssetFromIDB,
  clearAllAssetsFromIDB
};

// Migrate assets stored in localStorage (dataUrl form) into IndexedDB as blobs
export async function migrateFromLocalStorage(storageKey: string = 'whiteboard-assets'): Promise<number> {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return 0;
    const assets = JSON.parse(stored);
    if (!Array.isArray(assets) || assets.length === 0) return 0;

    // Convert each asset.dataUrl -> dataBlob and store
    const converted = assets.map((a: any) => {
      const copy = { ...a };
      try {
        if (copy.dataUrl && typeof copy.dataUrl === 'string' && copy.dataUrl.startsWith('data:')) {
          copy.dataBlob = dataURLToBlob(copy.dataUrl);
          delete copy.dataUrl;
        }
      } catch (err) {
        console.warn('[assetDB] migration: failed to convert dataUrl for asset', copy.id, err);
      }
      return copy;
    });

    await saveAllAssetsToIDB(converted);
    // mark migrated to avoid repeating
    try { localStorage.setItem(`${storageKey}-migrated`, '1'); } catch {}
    return converted.length;
  } catch (err) {
    console.error('[assetDB] migrateFromLocalStorage failed', err);
    return 0;
  }
}
