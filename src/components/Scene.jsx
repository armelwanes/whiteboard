import React from 'react';
import LayerEditor from './LayerEditor';

const Scene = ({ 
  isActive, 
  backgroundImage,
  scene,
  selectedSceneIndex,
  isEditing = false,
  updateScene,
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
    >
      {isEditing ? (
        <LayerEditor
          scene={scene}
          onSave={(updatedScene) => {
            updateScene(selectedSceneIndex, updatedScene);
          }}
          onClose={() => {}}
        />
      ) : null}
    </div>
  );
};

export default Scene;
