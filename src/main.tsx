import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryProvider } from './services/react-query'
import hydrateAssetsToLocalStorage from './utils/assetHydrate'
import { migrateFromLocalStorage } from './utils/assetDB'

// Migrate any existing localStorage assets into IndexedDB (one-time), then hydrate back into localStorage
(async () => {
  try {
    const migrated = await migrateFromLocalStorage();
    if (migrated > 0) console.debug('[main] migrated assets to IndexedDB:', migrated);
  } catch (err) {
    console.error('[main] asset migration failed:', err);
  }
  hydrateAssetsToLocalStorage().catch((err) => console.error('Asset hydration failed:', err));
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
)
