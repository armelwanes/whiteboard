import React from 'react';
import { useObjectInteraction } from './molecules/scene/use-object-interaction';
import { ResizeHandles } from './atoms/ResizeHandles';

interface SceneObjectType {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  zIndex?: number;
  type?: string;
  src?: string;
  name?: string;
}

interface SceneObjectProps {
  object: SceneObjectType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SceneObjectType>) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
}

const SceneObject: React.FC<SceneObjectProps> = ({ 
  object, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete,
  isEditing 
}) => {
  const {
    objectRef,
    handleMouseDown,
    handleFlipHorizontal,
    handleFlipVertical,
    handleRotate,
  } = useObjectInteraction(object, isEditing, onUpdate);

  const transform = `
    translate(${object.x}px, ${object.y}px) 
    rotate(${object.rotation || 0}deg) 
    scaleX(${object.flipX ? -1 : 1}) 
    scaleY(${object.flipY ? -1 : 1})
  `;

  const handleMouseDownWithSelect = (e: React.MouseEvent) => {
    onSelect(object.id);
    handleMouseDown(e);
  };

  return (
    <>
      <div
        ref={objectRef}
        className={` cursor-move ${isSelected && isEditing ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          width: `${object.width}px`,
          height: `${object.height}px`,
          transform,
          transformOrigin: '0 0',
          zIndex: object.zIndex || 1,
        }}
        onMouseDown={handleMouseDownWithSelect}
      >
        {/**object.type === 'image' && (
          <img
            src={object.src}
            alt={object.name || 'Scene object'}
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        )**/}

        {isSelected && isEditing && <ResizeHandles />}
      </div>

      {/* Control Panel - show when selected and editing */}
      {isSelected && isEditing && (
        <div
          className=" bg-gray-800 rounded-lg shadow-xl px-3 py-2 flex items-center gap-2 z-50"
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
