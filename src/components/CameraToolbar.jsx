import React from 'react';
import { Camera, Plus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

/**
 * CameraToolbar Component
 * Provides controls for managing cameras in the viewport
 */
const CameraToolbar = ({
  cameras = [],
  selectedCameraId,
  onAddCamera,
  onSelectCamera,
  onZoomCamera,
  sceneZoom = 1.0,
  onSceneZoom,
}) => {
  const selectedCamera = cameras.find(c => c.id === selectedCameraId);

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      {/* Left Section - Camera List */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Camera className="w-5 h-5 text-pink-400" />
          <span className="text-sm">Caméras ({cameras.length})</span>
        </div>

        {/* Camera Selector */}
        {cameras.length > 0 && (
          <select
            value={selectedCameraId || ''}
            onChange={(e) => onSelectCamera(e.target.value || null)}
            className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Aucune sélection</option>
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.name || `Camera ${camera.id}`} ({camera.zoom.toFixed(1)}x)
              </option>
            ))}
          </select>
        )}

        {/* Add Camera Button */}
        <button
          onClick={onAddCamera}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-1.5 px-3 rounded flex items-center gap-2 transition-colors text-sm shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Caméra
        </button>
      </div>

      {/* Right Section - Zoom Controls */}
      <div className="flex items-center gap-4">
        {/* Scene Zoom */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Zoom scène:</span>
          <button
            onClick={() => onSceneZoom(Math.max(0.1, sceneZoom - 0.1))}
            className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded transition-colors"
            title="Dézoom scène"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white font-mono text-sm min-w-[4rem] text-center">
            {(sceneZoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => onSceneZoom(Math.min(2.0, sceneZoom + 0.1))}
            className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded transition-colors"
            title="Zoom scène"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSceneZoom(1.0)}
            className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded transition-colors"
            title="Réinitialiser zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Zoom (if camera selected) */}
        {selectedCamera && (
          <>
            <div className="w-px h-6 bg-gray-600" />
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Zoom caméra:</span>
              <button
                onClick={() => onZoomCamera(selectedCameraId, Math.max(0.1, selectedCamera.zoom - 0.1))}
                className="bg-pink-700 hover:bg-pink-600 text-white p-1.5 rounded transition-colors"
                title="Dézoom caméra"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white font-mono text-sm min-w-[3rem] text-center">
                {selectedCamera.zoom.toFixed(1)}x
              </span>
              <button
                onClick={() => onZoomCamera(selectedCameraId, Math.min(5.0, selectedCamera.zoom + 0.1))}
                className="bg-pink-700 hover:bg-pink-600 text-white p-1.5 rounded transition-colors"
                title="Zoom caméra"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            {/* Scale Ratio Presets */}
            <div className="w-px h-6 bg-gray-600" />
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Ratio:</span>
              <div className="flex gap-1">
                {[0.5, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5, 2.0].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => onZoomCamera(selectedCameraId, ratio)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      Math.abs(selectedCamera.zoom - ratio) < 0.05
                        ? 'bg-pink-600 text-white font-semibold'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={`Régler le zoom à ${ratio}x`}
                  >
                    {ratio}x
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraToolbar;
