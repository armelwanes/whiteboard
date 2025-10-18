import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '../atoms';

interface CameraItem {
  id: string;
  name?: string;
  zoom?: number;
  position?: any;
  width?: number;
  height?: number;
  isDefault?: boolean;
  archived?: boolean;
  [key: string]: any;
}

interface CameraManagerModalProps {
  cameras: CameraItem[];
  onClose: () => void;
  onSave: (updated: CameraItem[]) => void;
}

const CameraManagerModal: React.FC<CameraManagerModalProps> = ({ cameras, onClose, onSave }) => {
  const [local, setLocal] = useState<CameraItem[]>(() => cameras.map(c => ({ ...c })));

  const toggleArchive = (id: string) => {
    setLocal(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
  };

  const handleDelete = (id: string) => {
    const cam = local.find(c => c.id === id);
    if (!cam) return;
    if (cam.isDefault) {
      alert('La caméra par défaut ne peut pas être supprimée');
      return;
    }
    if (!window.confirm(`Supprimer la caméra "${cam.name || cam.id}" ? Cette action est définitive.`)) return;
    const updated = local.filter(c => c.id !== id);
    setLocal(updated);
    // Immediately persist via onSave and close modal
    onSave(updated);
    onClose();
  };

  const updateField = (id: string, field: string, value: any) => {
    setLocal(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    onSave(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Gestion des caméras</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground"><X /></button>
        </div>

        <div className="p-4 space-y-3">
          {local.map((cam) => (
            <div key={cam.id} className={`flex items-center gap-3 p-3 border rounded ${cam.archived ? 'opacity-50 bg-gray-50' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <strong>{cam.isDefault ? `${cam.name} (par défaut)` : cam.name}</strong>
                  {cam.isDefault && <span className="text-xs text-muted-foreground">(protégée)</span>}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-xs">Nom</label>
                  <input
                    className="border px-2 py-1 rounded text-sm"
                    value={cam.name || ''}
                    onChange={(e) => updateField(cam.id, 'name', e.target.value)}
                  />
                  <label className="text-xs">Zoom</label>
                  <input
                    className="border px-2 py-1 rounded text-sm w-24"
                    type="number"
                    step={0.1}
                    value={cam.zoom ?? 1}
                    onChange={(e) => updateField(cam.id, 'zoom', parseFloat(e.target.value || '1'))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!cam.isDefault && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleArchive(cam.id)}
                      className={`px-3 py-1 rounded ${cam.archived ? 'bg-green-500 text-white' : 'bg-destructive text-white'}`}
                    >
                      {cam.archived ? 'Restaurer' : 'Archiver'}
                    </button>
                    <button
                      onClick={() => handleDelete(cam.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white flex items-center gap-2"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-xs">Supprimer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave} className="bg-primary text-white">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
};

export default CameraManagerModal;
