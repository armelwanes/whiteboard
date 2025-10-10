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
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
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
  // Lower zoom = larger viewport (see more of scene)
  // Higher zoom = smaller viewport (see less of scene, more zoomed in)
  const getPixelDimensions = useCallback(() => {
    const baseWidth = camera.width || 800;
    const baseHeight = camera.height || 450;
    
    // When zoom increases, viewport size should decrease (inverse relationship)
    return {
      width: baseWidth / camera.zoom,
      height: baseHeight / camera.zoom,
    };
  }, [camera.width, camera.height, camera.zoom]);

  const handleMouseMove = useCallback((e) => {
    if (!isSelected) return;

    if (isDragging) {
      const newX = (e.clientX - dragStart.x) / canvasZoom;
      const newY = (e.clientY - dragStart.y) / canvasZoom;
      
      // Convert pixel position back to normalized coordinates
      onUpdate(camera.id, {
        position: {
          x: Math.max(0, Math.min(1, newX / sceneWidth)),
          y: Math.max(0, Math.min(1, newY / sceneHeight)),
        },
      });
    } else if (isResizing && resizeHandle) {
      const pixelPos = getPixelPosition();
      const pixelDims = getPixelDimensions();
      
      let newWidth = pixelDims.width;
      let newHeight = pixelDims.height;
      let newX = pixelPos.x;
      let newY = pixelPos.y;

      const deltaX = (e.clientX - dragStart.x) / canvasZoom;
      const deltaY = (e.clientY - dragStart.y) / canvasZoom;

      switch (resizeHandle) {
        case 'nw':
          newWidth = pixelDims.width - deltaX;
          newHeight = pixelDims.height - deltaY;
          newX = pixelPos.x + deltaX;
          newY = pixelPos.y + deltaY;
          break;
        case 'ne':
          newWidth = pixelDims.width + deltaX;
          newHeight = pixelDims.height - deltaY;
          newY = pixelPos.y + deltaY;
          break;
        case 'sw':
          newWidth = pixelDims.width - deltaX;
          newHeight = pixelDims.height + deltaY;
          newX = pixelPos.x + deltaX;
          break;
        case 'se':
          newWidth = pixelDims.width + deltaX;
          newHeight = pixelDims.height + deltaY;
          break;
        case 'n':
          newHeight = pixelDims.height - deltaY;
          newY = pixelPos.y + deltaY;
          break;
        case 's':
          newHeight = pixelDims.height + deltaY;
          break;
        case 'w':
          newWidth = pixelDims.width - deltaX;
          newX = pixelPos.x + deltaX;
          break;
        case 'e':
          newWidth = pixelDims.width + deltaX;
          break;
      }

      // Enforce minimum dimensions
      newWidth = Math.max(100, newWidth);
      newHeight = Math.max(100, newHeight);

      // Calculate new zoom to maintain aspect ratio
      const baseWidth = camera.width || 800;
      const baseHeight = camera.height || 450;
      const newZoomWidth = baseWidth / newWidth;
      const newZoomHeight = baseHeight / newHeight;
      const newZoom = Math.max(0.1, Math.min(10, (newZoomWidth + newZoomHeight) / 2));

      onUpdate(camera.id, {
        width: newWidth * newZoom,
        height: newHeight * newZoom,
        zoom: newZoom,
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
    isResizing,
    resizeHandle,
    dragStart,
    camera,
    onUpdate,
    canvasZoom,
    sceneWidth,
    sceneHeight,
    getPixelPosition,
    getPixelDimensions,
  ]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  const handleMouseDown = (e) => {
    if (!isSelected) {
      onSelect(camera.id);
      return;
    }

    e.stopPropagation();

    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
      setResizeHandle(e.target.dataset.handle);
    } else if (e.target.classList.contains('camera-frame') || 
               e.target.classList.contains('camera-label')) {
      setIsDragging(true);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const pixelPos = getPixelPosition();
  const pixelDims = getPixelDimensions();

  return (
    <div
      ref={viewportRef}
      className={`camera-viewport absolute ${isSelected ? 'z-50' : 'z-40'}`}
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

      {/* Resize Handles - only show when selected */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nwse-resize shadow-lg"
            data-handle="nw"
          />
          <div
            className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nesw-resize shadow-lg"
            data-handle="ne"
          />
          <div
            className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nesw-resize shadow-lg"
            data-handle="sw"
          />
          <div
            className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nwse-resize shadow-lg"
            data-handle="se"
          />
          
          {/* Edge handles */}
          <div
            className="resize-handle absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ns-resize shadow-lg"
            data-handle="n"
          />
          <div
            className="resize-handle absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ns-resize shadow-lg"
            data-handle="s"
          />
          <div
            className="resize-handle absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ew-resize shadow-lg"
            data-handle="w"
          />
          <div
            className="resize-handle absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ew-resize shadow-lg"
            data-handle="e"
          />
        </>
      )}
    </div>
  );
};

export default CameraViewport;
