import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, Lock, Unlock } from 'lucide-react';

/**
 * CameraViewport Component
 * Represents a visual camera frame that can be positioned and zoomed
 * on a scrollable scene canvas. The viewport has a fixed size and only
 * the zoom level can be adjusted (not the frame size itself).
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
  const [initialDimensions, setInitialDimensions] = useState({ width: 0, height: 0 });
  const [initialZoom, setInitialZoom] = useState(1.0);
  const viewportRef = useRef(null);

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

  // Calculate pixel position from normalized coordinates
  // Position represents the center of the camera, so we offset by half dimensions
  const getPixelPosition = useCallback(() => {
    const pixelDims = getPixelDimensions();
    return {
      x: (camera.position.x * sceneWidth) - (pixelDims.width / 2),
      y: (camera.position.y * sceneHeight) - (pixelDims.height / 2),
    };
  }, [camera.position, sceneWidth, sceneHeight, getPixelDimensions]);

  const handleMouseMove = useCallback((e) => {
    if (!isSelected) return;
    
    // Prevent moving/resizing if camera is locked
    if (camera.locked) return;

    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) / canvasZoom;
      const deltaY = (e.clientY - dragStart.y) / canvasZoom;
      
      const pixelPos = getPixelPosition();
      const pixelDims = getPixelDimensions();
      
      // newX and newY are top-left corner positions after drag
      const newX = pixelPos.x + deltaX;
      const newY = pixelPos.y + deltaY;
      
      // Convert top-left corner back to center position for normalized coordinates
      const centerX = newX + (pixelDims.width / 2);
      const centerY = newY + (pixelDims.height / 2);
      
      // Convert pixel position back to normalized coordinates
      onUpdate(camera.id, {
        position: {
          x: Math.max(0, Math.min(1, centerX / sceneWidth)),
          y: Math.max(0, Math.min(1, centerY / sceneHeight)),
        },
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing && resizeHandle) {
      const deltaX = (e.clientX - dragStart.x) / canvasZoom;
      const deltaY = (e.clientY - dragStart.y) / canvasZoom;
      
      let newWidth = initialDimensions.width;
      let newHeight = initialDimensions.height;
      
      // Handle different resize directions
      if (resizeHandle.includes('e')) {
        newWidth = Math.max(100, initialDimensions.width + deltaX);
      }
      if (resizeHandle.includes('w')) {
        newWidth = Math.max(100, initialDimensions.width - deltaX);
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(100, initialDimensions.height + deltaY);
      }
      if (resizeHandle.includes('n')) {
        newHeight = Math.max(100, initialDimensions.height - deltaY);
      }
      
      // Calculate inverse zoom relationship with frame size
      // Smaller frame = higher zoom (inverse relationship)
      // Use width as the primary dimension for zoom calculation
      const widthRatio = initialDimensions.width / newWidth;
      const newZoom = Math.max(0.1, Math.min(5.0, initialZoom * widthRatio));
      
      onUpdate(camera.id, {
        width: newWidth,
        height: newHeight,
        zoom: newZoom,
      });
    }
  }, [
    isSelected,
    isDragging,
    isResizing,
    resizeHandle,
    dragStart,
    initialDimensions,
    initialZoom,
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

    // Don't allow dragging/resizing if camera is locked
    if (camera.locked) {
      return;
    }

    e.stopPropagation();

    // Check if clicking on a resize handle
    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
      setResizeHandle(e.target.dataset.handle);
      setInitialDimensions({
        width: camera.width || 800,
        height: camera.height || 450,
      });
      setInitialZoom(camera.zoom || 1.0);
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
        pointerEvents: 'none', // Allow clicks to pass through by default
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Camera Frame */}
      <div
        className={`camera-frame absolute inset-0 border-4 ${
          camera.locked ? 'cursor-default' : 'cursor-move'
        } ${
          isSelected
            ? camera.locked 
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-pink-500 bg-pink-500/10'
            : camera.locked
              ? 'border-blue-300 bg-blue-300/5 hover:border-blue-400'
              : 'border-pink-300 bg-pink-300/5 hover:border-pink-400'
        }`}
        style={{
          borderStyle: camera.locked ? 'solid' : 'dashed',
          borderWidth: '3px',
          pointerEvents: 'auto', // Only the frame border is interactive
        }}
        onMouseDown={handleMouseDown}
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
          className={`camera-label absolute -top-8 left-0 text-white px-3 py-1 rounded-t-lg flex items-center gap-2 text-sm font-semibold shadow-lg ${
            camera.locked ? 'bg-blue-500 cursor-default' : 'bg-pink-500 cursor-move'
          }`}
          style={{ pointerEvents: 'auto' }}
          onMouseDown={handleMouseDown}
        >
          <Camera className="w-4 h-4" />
          {camera.locked && <Lock className="w-3 h-3" />}
          <span>{camera.name || `Camera ${camera.id}`}</span>
          <span className="text-xs opacity-80">({camera.zoom.toFixed(1)}x)</span>
          {isSelected && !camera.isDefault && (
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
          {isSelected && camera.isDefault && (
            <span className="ml-2 text-xs opacity-70">(Par défaut)</span>
          )}
        </div>
      </div>

      {/* Resize Handles - only show when selected and not locked */}
      {isSelected && !camera.locked && (
        <>
          {/* Corner Handles */}
          <div
            className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nwse-resize z-10"
            data-handle="nw"
            style={{ pointerEvents: 'auto' }}
          />
          <div
            className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nesw-resize z-10"
            data-handle="ne"
            style={{ pointerEvents: 'auto' }}
          />
          <div
            className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nesw-resize z-10"
            data-handle="sw"
            style={{ pointerEvents: 'auto' }}
          />
          <div
            className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-nwse-resize z-10"
            data-handle="se"
            style={{ pointerEvents: 'auto' }}
          />

          {/* Edge Handles */}
          <div
            className="resize-handle absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ns-resize z-10"
            data-handle="n"
            style={{ pointerEvents: 'auto' }}
          />
          <div
            className="resize-handle absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ns-resize z-10"
            data-handle="s"
            style={{ pointerEvents: 'auto' }}
          />
          <div
            className="resize-handle absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ew-resize z-10"
            data-handle="w"
            style={{ pointerEvents: 'auto' }}
          />
          <div
            className="resize-handle absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-pink-500 border-2 border-white rounded-full cursor-ew-resize z-10"
            data-handle="e"
            style={{ pointerEvents: 'auto' }}
          />
        </>
      )}
    </div>
  );
};

export default CameraViewport;
