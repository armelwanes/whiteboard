import React from 'react';
import SceneObject from './SceneObject';

const Scene = ({ 
  isActive, 
  backgroundImage,
  objects = [],
  selectedObjectId,
  onSelectObject,
  onUpdateObject,
  onDeleteObject,
  isEditing = false,
}) => {
  return (
    <div
      className={`scene absolute inset-0 transition-opacity duration-1000 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => isEditing && onSelectObject && onSelectObject(null)}
    >
      {/* Render scene objects */}
      {objects && objects.map((obj) => (
        <SceneObject
          key={obj.id}
          object={obj}
          isSelected={selectedObjectId === obj.id}
          onSelect={onSelectObject}
          onUpdate={onUpdateObject}
          onDelete={onDeleteObject}
          isEditing={isEditing}
        />
      ))}
    </div>
  );
};

export default Scene;
