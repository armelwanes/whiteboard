import React, { useState } from 'react';
import { Film, Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * LayerAnimationControls Component
 * Provides UI controls for managing layer-level animations (zoom_in, zoom_out)
 */
const LayerAnimationControls = ({ animation, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(!!animation);

  const handleAddAnimation = () => {
    const newAnimation = {
      type: 'zoom_in',
      duration: 2.0,
      start_zoom: 1.0,
      end_zoom: 2.0,
      focus_position: { x: 0.5, y: 0.5 },
    };
    onChange(newAnimation);
    setIsExpanded(true);
  };

  const handleRemoveAnimation = () => {
    onChange(null);
    setIsExpanded(false);
  };

  const handleUpdateAnimation = (updates) => {
    onChange({ ...animation, ...updates });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Film className="w-4 h-4" />
          Animation Post-Dessin
        </h3>
        {!animation ? (
          <button
            onClick={handleAddAnimation}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        ) : (
          <button
            onClick={handleRemoveAnimation}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Supprimer
          </button>
        )}
      </div>

      {!animation ? (
        <p className="text-gray-400 text-xs italic text-center py-4">
          Aucune animation configurée.
          <br />
          Cliquez sur "Ajouter" pour créer une animation.
        </p>
      ) : (
        <div className="space-y-3">
          {/* Animation Type */}
          <div>
            <label className="block text-gray-300 text-xs mb-1.5">
              Type d'animation
            </label>
            <Select
              value={animation.type}
              onValueChange={(value) => handleUpdateAnimation({ type: value })}
            >
              <SelectTrigger className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zoom_in">Zoom In</SelectItem>
                <SelectItem value="zoom_out">Zoom Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-300 text-xs mb-1.5">
              Durée (secondes)
            </label>
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.5"
              value={animation.duration}
              onChange={(e) =>
                handleUpdateAnimation({ duration: parseFloat(e.target.value) || 2.0 })
              }
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Zoom Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-300 text-xs mb-1.5">
                Zoom Initial
              </label>
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={animation.start_zoom}
                onChange={(e) =>
                  handleUpdateAnimation({ start_zoom: parseFloat(e.target.value) || 1.0 })
                }
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs mb-1.5">
                Zoom Final
              </label>
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={animation.end_zoom}
                onChange={(e) =>
                  handleUpdateAnimation({ end_zoom: parseFloat(e.target.value) || 2.0 })
                }
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Focus Position */}
          <div>
            <label className="block text-gray-300 text-xs mb-1.5">
              Point de Focus
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-400 text-xs mb-1">
                  X: {animation.focus_position.x.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={animation.focus_position.x}
                  onChange={(e) =>
                    handleUpdateAnimation({
                      focus_position: {
                        ...animation.focus_position,
                        x: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>Gauche</span>
                  <span>Droite</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">
                  Y: {animation.focus_position.y.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={animation.focus_position.y}
                  onChange={(e) =>
                    handleUpdateAnimation({
                      focus_position: {
                        ...animation.focus_position,
                        y: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>Haut</span>
                  <span>Bas</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-700 rounded text-xs text-gray-400">
            💡 <span className="font-semibold">Info:</span> L'animation se joue après le dessin de la couche.
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerAnimationControls;
