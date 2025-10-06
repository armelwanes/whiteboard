import React from 'react';
import SceneObject from './SceneObject';

const Scene = ({ 
  title, 
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
      <div className="relative h-full flex flex-col items-center justify-center p-8 bg-black bg-opacity-40">
        <div 
          className={`text-content ${
            isActive ? 'animate-in' : ''
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center drop-shadow-lg">
            {title}
          </h2>
        </div>
      </div>

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
