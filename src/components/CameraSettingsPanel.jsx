import React from 'react';
import { Settings, Clock, Zap } from 'lucide-react';

/**
 * CameraSettingsPanel Component
 * Displays detailed settings for the selected camera
 */
const CameraSettingsPanel = ({ camera, onUpdate }) => {
  if (!camera) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-5 h-5 text-pink-400" />
          <h3 className="text-white font-semibold">Paramètres de Caméra</h3>
        </div>
        <p className="text-gray-400 text-sm text-center py-4">
          Sélectionnez une caméra pour voir ses paramètres
        </p>
      </div>
    );
  }

  const handleChange = (field, value) => {
    onUpdate(camera.id, { [field]: value });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-5 h-5 text-pink-400" />
        <h3 className="text-white font-semibold">Paramètres: {camera.name}</h3>
      </div>

      <div className="space-y-4">
        {/* Camera Name */}
        <div>
          <label className="block text-gray-300 text-sm mb-1.5">
            Nom de la caméra
          </label>
          <input
            type="text"
            value={camera.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={camera.isDefault}
          />
          {camera.isDefault && (
            <p className="text-xs text-gray-500 mt-1">
              Le nom de la caméra par défaut ne peut pas être modifié
            </p>
          )}
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">
              Largeur (px)
            </label>
            <input
              type="number"
              min="100"
              max="1920"
              step="10"
              value={camera.width || 800}
              onChange={(e) => handleChange('width', parseInt(e.target.value) || 800)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={camera.locked}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">
              Hauteur (px)
            </label>
            <input
              type="number"
              min="100"
              max="1080"
              step="10"
              value={camera.height || 450}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 450)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={camera.locked}
            />
          </div>
        </div>
        {camera.locked && (
          <p className="text-xs text-gray-500">
            Déverrouillez la caméra pour modifier ses dimensions
          </p>
        )}

        {/* Transition Duration */}
        <div>
          <label className="block text-gray-300 text-sm mb-1.5">
            <Clock className="w-4 h-4 inline mr-1" />
            Durée de transition (secondes)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={camera.transition_duration || 0}
            onChange={(e) => handleChange('transition_duration', parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Temps pour passer de la caméra précédente à celle-ci
          </p>
        </div>

        {/* Movement Type */}
        <div>
          <label className="block text-gray-300 text-sm mb-1.5">
            <Zap className="w-4 h-4 inline mr-1" />
            Type de mouvement
          </label>
          <select
            value={camera.movementType || 'ease_out'}
            onChange={(e) => handleChange('movementType', e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="linear">Linéaire</option>
            <option value="ease_in">Ease In</option>
            <option value="ease_out">Ease Out</option>
            <option value="ease_in_out">Ease In Out</option>
            <option value="ease_in_cubic">Ease In Cubic</option>
            <option value="ease_out_cubic">Ease Out Cubic</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Style d'animation pour la transition
          </p>
        </div>

        {/* Pause Duration */}
        <div>
          <label className="block text-gray-300 text-sm mb-1.5">
            <Clock className="w-4 h-4 inline mr-1" />
            Pause avant caméra suivante (secondes)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={camera.pauseDuration || 0}
            onChange={(e) => handleChange('pauseDuration', parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Temps d'attente sur cette caméra avant de passer à la suivante
          </p>
        </div>

        {/* Duration (Hold Time) */}
        <div>
          <label className="block text-gray-300 text-sm mb-1.5">
            <Clock className="w-4 h-4 inline mr-1" />
            Durée d'attente (secondes)
          </label>
          <input
            type="number"
            min="0.1"
            max="30"
            step="0.5"
            value={camera.duration || 2.0}
            onChange={(e) => handleChange('duration', parseFloat(e.target.value) || 2.0)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Temps pendant lequel la caméra reste en position
          </p>
        </div>

        {/* Camera Info */}
        <div className="pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Zoom:</span>
              <span className="text-white">{camera.zoom.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between">
              <span>Position:</span>
              <span className="text-white">
                X: {camera.position.x.toFixed(2)}, Y: {camera.position.y.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ratio:</span>
              <span className="text-white">
                {(camera.width / camera.height).toFixed(2)}:1
              </span>
            </div>
            {camera.locked && (
              <div className="flex items-center gap-1 text-blue-400 mt-2">
                <span>🔒</span>
                <span>Position et taille verrouillées</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraSettingsPanel;
