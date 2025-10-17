import { useCallback } from 'react';
import { Scene } from '../scenes';

export function useImportConfig() {
  // Importe une configuration JSON de scènes
  const handleImportConfig = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        if (config.scenes && Array.isArray(config.scenes)) {
          const scenesService = (await import('../../app/scenes')).scenesService;
          await scenesService.bulkUpdate(config.scenes);
          window.location.reload();
        } else {
          alert('Format de fichier invalide. Le fichier doit contenir un tableau "scenes".');
        }
      } catch (error: any) {
        alert('Erreur lors de la lecture du fichier JSON: ' + error.message);
      }
    };
    reader.readAsText(file);
  }, []);

  return { handleImportConfig };
}
