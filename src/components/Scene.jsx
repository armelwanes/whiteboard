import React from 'react';
import LayerEditor from './LayerEditor';

const Scene = ({ 
  isActive, 
  backgroundImage,
  scene,
  title,
  content,
  selectedSceneIndex,
  isEditing = false,
  updateScene,
}) => {
  // Render layers if they exist
  const renderLayers = () => {
    if (!scene?.layers || scene.layers.length === 0) return null;
    
    return scene.layers.map((layer) => {
      if (!layer.image_path) return null;
      
      return (
        <img
          key={layer.id}
          src={layer.image_path}
          alt={layer.name || 'Layer'}
          style={{
            position: 'absolute',
            left: `${layer.position?.x || 0}px`,
            top: `${layer.position?.y || 0}px`,
            transform: `scale(${layer.scale || 1.0})`,
            opacity: layer.opacity || 1.0,
            zIndex: layer.z_index || 1,
            pointerEvents: 'none',
          }}
        />
      );
    });
  };

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
      {/* Scene Content Display */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-12">
        {renderLayers()}
        
        {/* Show title and content if no layers or always visible */}
        {(!scene?.layers || scene.layers.length === 0) && (
          <div className="text-center max-w-3xl bg-white/90 dark:bg-gray-900/80 rounded-lg p-8 shadow-lg">
            {title && (
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 whiteboard-text">
                {title}
              </h2>
            )}
            {content && (
              <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed whiteboard-text">
                {content}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scene;
