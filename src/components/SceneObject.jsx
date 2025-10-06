import React, { useState, useRef, useEffect, useCallback } from 'react';

const SceneObject = ({ 
  object, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete,
  isEditing 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const objectRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!isEditing) return;
    
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onUpdate(object.id, { x: newX, y: newY });
    } else if (isResizing && resizeHandle) {
      let newWidth = object.width;
      let newHeight = object.height;
      let newX = object.x;
      let newY = object.y;

      switch (resizeHandle) {
        case 'nw':
          newWidth = object.width - (e.clientX - object.x);
          newHeight = object.height - (e.clientY - object.y);
          newX = e.clientX;
          newY = e.clientY;
          break;
        case 'ne':
          newWidth = e.clientX - object.x;
          newHeight = object.height - (e.clientY - object.y);
          newY = e.clientY;
          break;
        case 'sw':
          newWidth = object.width - (e.clientX - object.x);
          newHeight = e.clientY - object.y;
          newX = e.clientX;
          break;
        case 'se':
          newWidth = e.clientX - object.x;
          newHeight = e.clientY - object.y;
          break;
      }

      if (newWidth > 20 && newHeight > 20) {
        onUpdate(object.id, { 
          width: Math.max(20, newWidth), 
          height: Math.max(20, newHeight),
          x: newX,
          y: newY
        });
      }
    }
  }, [isEditing, isDragging, isResizing, resizeHandle, dragStart, object, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  const handleMouseDown = (e) => {
    if (!isEditing) return;
    e.stopPropagation();
    onSelect(object.id);
    
    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
      setResizeHandle(e.target.dataset.handle);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({
      x: e.clientX - object.x,
      y: e.clientY - object.y
    });
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

  const handleFlipHorizontal = () => {
    onUpdate(object.id, { flipX: !object.flipX });
  };

  const handleFlipVertical = () => {
    onUpdate(object.id, { flipY: !object.flipY });
  };

  const handleRotate = () => {
    onUpdate(object.id, { rotation: (object.rotation + 15) % 360 });
  };

  const transform = `
    translate(${object.x}px, ${object.y}px) 
    rotate(${object.rotation || 0}deg) 
    scaleX(${object.flipX ? -1 : 1}) 
    scaleY(${object.flipY ? -1 : 1})
  `;

  return (
    <>
      <div
        ref={objectRef}
        className={`absolute cursor-move ${isSelected && isEditing ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          width: `${object.width}px`,
          height: `${object.height}px`,
          transform,
          transformOrigin: '0 0',
          zIndex: object.zIndex || 1,
        }}
        onMouseDown={handleMouseDown}
      >
        {object.type === 'image' && (
          <img
            src={object.src}
            alt={object.name || 'Scene object'}
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        )}

        {/* Resize Handles - only show when selected and editing */}
        {isSelected && isEditing && (
          <>
            <div
              className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
              data-handle="nw"
            />
            <div
              className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
              data-handle="ne"
            />
            <div
              className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
              data-handle="sw"
            />
            <div
              className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
              data-handle="se"
            />
          </>
        )}
      </div>

      {/* Control Panel - show when selected and editing */}
      {isSelected && isEditing && (
        <div
          className="absolute bg-gray-800 rounded-lg shadow-xl px-3 py-2 flex items-center gap-2 z-50"
          style={{
            left: `${object.x}px`,
            top: `${object.y - 50}px`,
          }}
        >
          <button
            onClick={handleFlipHorizontal}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
            title="Flip horizontal"
          >
            ↔️
          </button>
          <button
            onClick={handleFlipVertical}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
            title="Flip vertical"
          >
            ↕️
          </button>
          <button
            onClick={handleRotate}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
            title="Rotate 15°"
          >
            🔄
          </button>
          <button
            onClick={() => onDelete(object.id)}
            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </>
  );
};

export default SceneObject;
