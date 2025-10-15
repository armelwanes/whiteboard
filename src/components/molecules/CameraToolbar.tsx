import React from 'react';
import { Camera, Plus, ZoomIn, ZoomOut, Maximize2, Lock, Unlock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CameraToolbarProps {
  cameras?: any[];
  selectedCameraId: string | null;
  onAddCamera: () => void;
  onSelectCamera: (id: string) => void;
  onZoomCamera: (delta: number) => void;
  onDeleteCamera?: () => void;
  onToggleCameraLock?: () => void;
  [key: string]: any;
}

/**
 * CameraToolbar Component
 * Provides controls for managing cameras in the viewport
 */
const CameraToolbar: React.FC<CameraToolbarProps> = ({
  cameras = [],
  selectedCameraId,
  onAddCamera,
  onSelectCamera,
  onZoomCamera,
  onToggleLock,
  sceneZoom = 1.0,
  onSceneZoom,
}) => {
  // Select first camera by default if none is selected
  const effectiveSelectedCameraId = selectedCameraId || (cameras.length > 0 ? cameras[0].id : null);
  const selectedCamera = cameras.find(c => c.id === effectiveSelectedCameraId);

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2.5 flex items-center justify-between">
      {/* Left Section - Camera List */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Camera className="w-5 h-5 text-pink-400" />
          <span className="text-sm">Caméras ({cameras.length})</span>
        </div>

        {/* Camera Selector */}
        {cameras.length > 0 && (
          <Select
            value={selectedCameraId || ''}
            onValueChange={(value) => onSelectCamera(value || null)}
          >
            <SelectTrigger className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 max-w-xs">
              <SelectValue placeholder="Aucune sélection" />
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '300px' }}>
              <SelectItem value="">Aucune sélection</SelectItem>
              {cameras.map((camera, index) => (
                <SelectItem key={camera.id} value={camera.id}>
                  {index + 1}. {camera.name || `Camera ${camera.id}`} ({camera.zoom.toFixed(1)}x)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      <div className="flex items-center gap-3">
        {/* Scene Zoom */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Zoom scène:</span>
          <button
            onClick={() => onSceneZoom(Math.max(0.1, sceneZoom - 0.1))}
            className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors"
            title="Dézoom scène"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-white font-mono text-xs min-w-[3rem] text-center">
            {(sceneZoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => onSceneZoom(Math.min(2.0, sceneZoom + 0.1))}
            className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors"
            title="Zoom scène"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSceneZoom(1.0)}
            className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors"
            title="Réinitialiser zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Camera Zoom (if camera selected) */}
        {selectedCamera && (
          <>
            <div className="w-px h-5 bg-gray-600" />
            
            {/* Lock/Unlock Button */}
            {!selectedCamera.isDefault && (
              <>
                <button
                  onClick={() => onToggleLock(selectedCameraId)}
                  className={`${
                    selectedCamera.locked 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  } text-white p-1 rounded transition-colors flex items-center gap-1`}
                  title={selectedCamera.locked ? 'Déverrouiller caméra' : 'Verrouiller caméra'}
                >
                  {selectedCamera.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span className="text-xs">{selectedCamera.locked ? 'Verrouillé' : 'Déverrouillé'}</span>
                </button>
                <div className="w-px h-5 bg-gray-600" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CameraToolbar;
