import React, { useState } from 'react';
import { Camera, Plus, Trash2, Eye, MoveUp, MoveDown } from 'lucide-react';
import { createCamera } from '../../utils/cameraAnimator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CameraConfig {
  zoom: number;
  position: { x: number; y: number };
  duration: number;
  transition_duration: number;
  easing: string;
  [key: string]: any;
}

interface CameraControlsProps {
  cameras?: CameraConfig[];
  onChange: (cameras: CameraConfig[]) => void;
  type?: 'scene' | 'layer';
}

/**
 * CameraControls Component
 * Provides UI controls for managing camera sequences at the scene level
 * and camera settings at the layer level
 */
const CameraControls: React.FC<CameraControlsProps> = ({ cameras = [], onChange, type = 'scene' }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddCamera = () => {
    const newCamera = createCamera({
      zoom: 1.0,
      position: { x: 0.5, y: 0.5 },
      duration: 2.0,
      transition_duration: 1.0,
      easing: 'ease_out',
    });
    onChange([...cameras, newCamera]);
    setExpandedIndex(cameras.length);
  };

  const handleRemoveCamera = (index: number) => {
    const newCameras = cameras.filter((_, i) => i !== index);
    onChange(newCameras);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const handleUpdateCamera = (index: number, updates: Partial<CameraConfig>) => {
    const newCameras = [...cameras];
    newCameras[index] = { ...newCameras[index], ...updates };
    onChange(newCameras);
  };

  const handleMoveCamera = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === cameras.length - 1)
    ) {
      return;
    }
    const newCameras = [...cameras];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCameras[index], newCameras[targetIndex]] = [
      newCameras[targetIndex],
      newCameras[index],
    ];
    onChange(newCameras);
  };

  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Camera className="w-4 h-4" />
          {type === 'scene' ? 'Séquence de Caméras' : 'Caméra'}
        </h3>
        {type === 'scene' && (
          <button
            onClick={handleAddCamera}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        )}
      </div>

      <div className="space-y-2">
        {cameras.length === 0 ? (
          <p className="text-muted-foreground text-xs italic text-center py-4">
            Aucune caméra configurée.
            {type === 'scene' && <><br />Cliquez sur "Ajouter" pour créer une caméra.</>}
          </p>
        ) : (
          cameras.map((camera, index) => (
            <div
              key={index}
              className="bg-secondary rounded-lg border border-border overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-650"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-white text-xs font-medium">
                    Caméra {index + 1}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    (Zoom: {camera.zoom.toFixed(1)}x)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {type === 'scene' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCamera(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-secondary/80 rounded disabled:opacity-30"
                        title="Déplacer vers le haut"
                      >
                        <MoveUp className="w-3 h-3 text-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCamera(index, 'down');
                        }}
                        disabled={index === cameras.length - 1}
                        className="p-1 hover:bg-secondary/80 rounded disabled:opacity-30"
                        title="Déplacer vers le bas"
                      >
                        <MoveDown className="w-3 h-3 text-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCamera(index);
                        }}
                        className="p-1 hover:bg-red-600 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {expandedIndex === index && (
                <div className="p-3 border-t border-border space-y-3">
                  {/* Zoom */}
                  <div>
                    <label className="block text-foreground text-xs mb-1.5">
                      Zoom: {camera.zoom.toFixed(2)}x
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={camera.zoom}
                      onChange={(e) =>
                        handleUpdateCamera(index, { zoom: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.1x</span>
                      <span>5.0x</span>
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-foreground text-xs mb-1.5">
                      Position Focus
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-muted-foreground text-xs mb-1">
                          X: {camera.position.x.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={camera.position.x}
                          onChange={(e) =>
                            handleUpdateCamera(index, {
                              position: {
                                ...camera.position,
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
                        <label className="block text-muted-foreground text-xs mb-1">
                          Y: {camera.position.y.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={camera.position.y}
                          onChange={(e) =>
                            handleUpdateCamera(index, {
                              position: {
                                ...camera.position,
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

                  {type === 'scene' && (
                    <>
                      {/* Duration */}
                      <div>
                        <label className="block text-foreground text-xs mb-1.5">
                          Durée d'attente (secondes)
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          max="30"
                          step="0.5"
                          value={camera.duration}
                          onChange={(e) =>
                            handleUpdateCamera(index, {
                              duration: parseFloat(e.target.value) || 2.0,
                            })
                          }
                          className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Transition Duration */}
                      <div>
                        <label className="block text-foreground text-xs mb-1.5">
                          Durée de transition (secondes)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={camera.transition_duration || 0}
                          onChange={(e) =>
                            handleUpdateCamera(index, {
                              transition_duration: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Easing */}
                      <div>
                        <label className="block text-foreground text-xs mb-1.5">
                          Fonction d'Easing
                        </label>
                        <Select
                          value={camera.easing || 'ease_out'}
                          onValueChange={(value) =>
                            handleUpdateCamera(index, { easing: value })
                          }
                        >
                          <SelectTrigger className="w-full bg-secondary text-white border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Sélectionner un easing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="ease_in">Ease In</SelectItem>
                            <SelectItem value="ease_out">Ease Out (recommandé)</SelectItem>
                            <SelectItem value="ease_in_out">Ease In Out</SelectItem>
                            <SelectItem value="ease_in_cubic">Ease In Cubic</SelectItem>
                            <SelectItem value="ease_out_cubic">Ease Out Cubic</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-gray-500 text-xs mt-1">
                          {camera.easing === 'ease_out' && 'Mouvement naturel de caméra'}
                          {camera.easing === 'linear' && 'Vitesse constante'}
                          {camera.easing === 'ease_in' && 'Départ lent, arrivée rapide'}
                          {camera.easing === 'ease_in_out' && 'Début et fin fluides'}
                          {camera.easing === 'ease_in_cubic' && 'Départ très lent'}
                          {camera.easing === 'ease_out_cubic' && 'Arrêt très lent'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CameraControls;
