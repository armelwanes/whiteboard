import React from 'react';
import SceneObject from './SceneObject';
import KonvaSceneEditor from './KonvaSceneEditor';

const Scene = ({ 
  isActive, 
  backgroundImage,
  scene,
  selectedSceneIndex,
  onSelectObject,
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
      onClick={() => isEditing && onSelectObject && onSelectObject(null)}
    >


        <KonvaSceneEditor
          scene={scene}
          onSave={(updatedScene) => {
            updateScene(selectedSceneIndex, updatedScene)
           
          }}
        />
    </div>
  );
};

export default Scene;
