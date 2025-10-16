import React from 'react';
import { TextPropertiesForm } from './TextPropertiesForm';

export interface LayerPropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const LayerPropertiesForm: React.FC<LayerPropertiesFormProps> = ({
  layer,
  onPropertyChange
}) => {
  if (!layer) return null;

  // If it's a text layer, show text-specific properties
  if (layer.type === 'text') {
    return (
      <>
        <TextPropertiesForm layer={layer} onPropertyChange={onPropertyChange} />
        <div className="bg-secondary/30 rounded-lg p-4 border border-border mt-3">
          <h3 className="text-foreground font-semibold mb-3 text-sm">
            Propriétés Générales
          </h3>

          <div className="mb-3">
            <label className="block text-foreground text-xs mb-1.5">
              Nom
            </label>
            <input
              type="text"
              value={layer.name || ''}
              onChange={(e) => onPropertyChange(layer.id, 'name', e.target.value)}
              className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nom de la couche"
            />
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Position X
              </label>
              <input
                type="number"
                value={Math.round(layer.position?.x || 0)}
                onChange={(e) => onPropertyChange(layer.id, 'position', {
                  ...layer.position,
                  x: parseInt(e.target.value) || 0
                })}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Position Y
              </label>
              <input
                type="number"
                value={Math.round(layer.position?.y || 0)}
                onChange={(e) => onPropertyChange(layer.id, 'position', {
                  ...layer.position,
                  y: parseInt(e.target.value) || 0
                })}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-foreground text-xs mb-1.5">
              Échelle: {(layer.scale || 1.0).toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={layer.scale || 1.0}
              onChange={(e) => onPropertyChange(layer.id, 'scale', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label className="block text-foreground text-xs mb-1.5">
              Opacité: {Math.round((layer.opacity || 1.0) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={layer.opacity || 1.0}
              onChange={(e) => onPropertyChange(layer.id, 'opacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label className="block text-foreground text-xs mb-1.5">
              Skip Rate (Vitesse de dessin)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={layer.skip_rate || 10}
              onChange={(e) => onPropertyChange(layer.id, 'skip_rate', parseInt(e.target.value) || 10)}
              className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-gray-500 text-xs mt-1">
              Plus élevé = dessin plus rapide
            </p>
          </div>
        </div>
      </>
    );
  }

  // Default rendering for non-text layers
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-foreground font-semibold mb-3 text-sm">
        Propriétés de la Couche Sélectionnée
      </h3>

      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Nom
        </label>
        <input
          type="text"
          value={layer.name || ''}
          onChange={(e) => onPropertyChange(layer.id, 'name', e.target.value)}
          className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nom de la couche"
        />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-foreground text-xs mb-1.5">
            Position X
          </label>
          <input
            type="number"
            value={Math.round(layer.position?.x || 0)}
            onChange={(e) => onPropertyChange(layer.id, 'position', {
              ...layer.position,
              x: parseInt(e.target.value) || 0
            })}
            className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-foreground text-xs mb-1.5">
            Position Y
          </label>
          <input
            type="number"
            value={Math.round(layer.position?.y || 0)}
            onChange={(e) => onPropertyChange(layer.id, 'position', {
              ...layer.position,
              y: parseInt(e.target.value) || 0
            })}
            className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Échelle: {(layer.scale || 1.0).toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={layer.scale || 1.0}
          onChange={(e) => onPropertyChange(layer.id, 'scale', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Opacité: {Math.round((layer.opacity || 1.0) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={layer.opacity || 1.0}
          onChange={(e) => onPropertyChange(layer.id, 'opacity', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">
          Skip Rate (Vitesse de dessin)
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={layer.skip_rate || 10}
          onChange={(e) => onPropertyChange(layer.id, 'skip_rate', parseInt(e.target.value) || 10)}
          className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-gray-500 text-xs mt-1">
          Plus élevé = dessin plus rapide
        </p>
      </div>
    </div>
  );
};
