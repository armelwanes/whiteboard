import { useState, useRef, useEffect, useCallback } from 'react';

interface SceneObjectType {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export const useObjectInteraction = (
  object: SceneObjectType,
  isEditing: boolean,
  onUpdate: (id: string, updates: Partial<SceneObjectType>) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const objectRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle')) {
      setIsResizing(true);
      setResizeHandle(target.dataset.handle || null);
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
    onUpdate(object.id, { rotation: ((object.rotation || 0) + 15) % 360 });
  };

  return {
    objectRef,
    isDragging,
    isResizing,
    handleMouseDown,
    handleFlipHorizontal,
    handleFlipVertical,
    handleRotate,
  };
};
