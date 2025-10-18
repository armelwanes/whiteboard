import assetDB from './assetDB';

const ASSETS_STORAGE_KEY = 'whiteboard-assets';

export async function hydrateAssetsToLocalStorage(): Promise<void> {
  try {
    const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (stored && stored.length > 10) {
      // already have assets in localStorage
      return;
    }

    const idbAssets = await assetDB.getAllAssetsFromIDB();
    if (idbAssets && idbAssets.length > 0) {
      try {
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(idbAssets));
        console.debug('[assetHydrate] hydrated assets from IndexedDB to localStorage', idbAssets.length);
      } catch (err) {
        console.warn('[assetHydrate] failed to write hydrated assets to localStorage:', err);
      }
    }
  } catch (err) {
    console.error('[assetHydrate] failed to hydrate assets from IDB:', err);
  }
}

export default hydrateAssetsToLocalStorage;
