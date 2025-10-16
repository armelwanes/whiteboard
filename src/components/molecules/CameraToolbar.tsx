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
    <div className="bg-secondary/50 border-b border-border px-4 py-2.5 flex items-center justify-between">
      {/* Left Section - Camera List */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Camera className="w-5 h-5 text-primary" />
          <span className="text-sm">Caméras ({cameras.length})</span>
        </div>

        {/* Camera Selector */}
        {cameras.length > 0 && (
          <Select
            value={selectedCameraId || 'none'}
            onValueChange={(value) => onSelectCamera(value === 'none' ? null : value)}
          >
            <SelectTrigger className="bg-white text-foreground border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary max-w-xs">
              <SelectValue placeholder="Aucune sélection" />
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '300px' }}>
              <SelectItem value="none">Aucune sélection</SelectItem>
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Caméra
        </button>
      </div>

      {/* Right Section - Zoom Controls */}
      <div className="flex items-center gap-3">
        {/* Scene Zoom */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Zoom scène:</span>
          <button
            onClick={() => onSceneZoom(Math.max(0.1, sceneZoom - 0.1))}
            className="bg-secondary hover:bg-secondary/80 text-foreground p-1.5 rounded-lg transition-colors"
            title="Dézoom scène"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-foreground font-semibold text-xs min-w-[3rem] text-center">
            {(sceneZoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => onSceneZoom(Math.min(2.0, sceneZoom + 0.1))}
            className="bg-secondary hover:bg-secondary/80 text-foreground p-1.5 rounded-lg transition-colors"
            title="Zoom scène"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSceneZoom(1.0)}
            className="bg-secondary hover:bg-secondary/80 text-foreground p-1.5 rounded-lg transition-colors"
            title="Réinitialiser zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Camera Zoom (if camera selected) */}
        {selectedCamera && (
          <>
            <div className="w-px h-5 bg-border" />
            
            {/* Lock/Unlock Button */}
            {!selectedCamera.isDefault && (
              <>
                <button
                  onClick={() => onToggleLock(selectedCameraId)}
                  className={`${
                    selectedCamera.locked 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-secondary hover:bg-secondary/80'
                  } text-${selectedCamera.locked ? 'primary-foreground' : 'foreground'} p-1 rounded transition-colors flex items-center gap-1`}
                  title={selectedCamera.locked ? 'Déverrouiller caméra' : 'Verrouiller caméra'}
                >
                  {selectedCamera.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span className="text-xs">{selectedCamera.locked ? 'Verrouillé' : 'Déverrouillé'}</span>
                </button>
                <div className="w-px h-5 bg-border" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CameraToolbar;
