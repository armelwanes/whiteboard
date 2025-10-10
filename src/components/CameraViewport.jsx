import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X } from 'lucide-react';

/**
 * CameraViewport Component
 * Represents a visual camera frame that can be positioned, resized, and zoomed
 * on a scrollable scene canvas
 */
const CameraViewport = ({
  camera,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  sceneWidth = 1920,
  sceneHeight = 1080,
  canvasZoom = 1.0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  // Calculate pixel position from normalized coordinates
  const getPixelPosition = useCallback(() => {
    return {
      x: camera.position.x * sceneWidth,
      y: camera.position.y * sceneHeight,
    };
  }, [camera.position, sceneWidth, sceneHeight]);

  // Calculate pixel dimensions based on camera zoom
  // Camera viewport represents a fixed output size (e.g., 1920x1080 or 800x450)
  // Zoom affects what portion of the scene is visible, not the viewport size
  const getPixelDimensions = useCallback(() => {
    const baseWidth = camera.width || 800;
    const baseHeight = camera.height || 450;
    
    // Fixed viewport size - represents the camera frame size
    return {
      width: baseWidth,
      height: baseHeight,
    };
  }, [camera.width, camera.height]);

  const handleMouseMove = useCallback((e) => {
    if (!isSelected) return;

    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) / canvasZoom;
      const deltaY = (e.clientY - dragStart.y) / canvasZoom;
      
      const pixelPos = getPixelPosition();
      const newX = pixelPos.x + deltaX;
      const newY = pixelPos.y + deltaY;
      
      // Convert pixel position back to normalized coordinates
      onUpdate(camera.id, {
        position: {
          x: Math.max(0, Math.min(1, newX / sceneWidth)),
          y: Math.max(0, Math.min(1, newY / sceneHeight)),
        },
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [
    isSelected,
    isDragging,
    dragStart,
    camera,
    onUpdate,
    canvasZoom,
    sceneWidth,
    sceneHeight,
    getPixelPosition,
  ]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e) => {
    if (!isSelected) {
      onSelect(camera.id);
      return;
    }

    e.stopPropagation();

    if (e.target.classList.contains('camera-frame') || 
               e.target.classList.contains('camera-label')) {
      setIsDragging(true);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const pixelPos = getPixelPosition();
  const pixelDims = getPixelDimensions();

  return (
    <div
      ref={viewportRef}
      className={`camera-viewport absolute pointer-events-auto ${isSelected ? 'z-50' : 'z-40'}`}
      style={{
        left: `${pixelPos.x}px`,
        top: `${pixelPos.y}px`,
        width: `${pixelDims.width}px`,
        height: `${pixelDims.height}px`,
        transform: `scale(${canvasZoom})`,
        transformOrigin: 'top left',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Camera Frame */}
      <div
        className={`camera-frame absolute inset-0 border-4 cursor-move ${
          isSelected
            ? 'border-pink-500 bg-pink-500/10'
            : 'border-pink-300 bg-pink-300/5 hover:border-pink-400'
        }`}
        style={{
          borderStyle: 'dashed',
          borderWidth: '3px',
        }}
      >
        {/* Diagonal lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: isSelected ? 0.6 : 0.3 }}
        >
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke={isSelected ? '#ec4899' : '#f9a8d4'}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line
            x1="100%"
            y1="0"
            x2="0"
            y2="100%"
            stroke={isSelected ? '#ec4899' : '#f9a8d4'}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>

        {/* Camera Label */}
        <div
          className="camera-label absolute -top-8 left-0 bg-pink-500 text-white px-3 py-1 rounded-t-lg flex items-center gap-2 text-sm font-semibold cursor-move shadow-lg"
        >
          <Camera className="w-4 h-4" />
          <span>{camera.name || `Camera ${camera.id}`}</span>
          <span className="text-xs opacity-80">({camera.zoom.toFixed(1)}x)</span>
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(camera.id);
              }}
              className="ml-2 hover:bg-pink-600 rounded p-0.5 transition-colors"
              title="Supprimer caméra"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraViewport;
