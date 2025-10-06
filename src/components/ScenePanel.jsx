import React from 'react';

const ScenePanel = ({
  scenes,
  selectedSceneIndex,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  onDuplicateScene,
  onMoveScene,
}) => {
  return (
    <div className="scene-panel w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-lg">Scènes</h2>
          <span className="text-gray-400 text-sm">{scenes.length}</span>
        </div>
        <button
          onClick={onAddScene}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          + Ajouter une scène
        </button>
      </div>

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className={`scene-item p-3 border-b border-gray-800 cursor-pointer transition-colors ${
              selectedSceneIndex === index
                ? 'bg-blue-600 bg-opacity-20 border-l-4 border-l-blue-500'
                : 'hover:bg-gray-800'
            }`}
            onClick={() => onSelectScene(index)}
          >
            {/* Scene Preview */}
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-xs">
                {scene.backgroundImage ? (
                  <img
                    src={scene.backgroundImage}
                    alt={scene.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span>📄</span>
                )}
              </div>

              {/* Scene Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {index + 1}. {scene.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-xs truncate mb-1">
                  {scene.content}
                </p>
                <div className="text-gray-500 text-xs">
                  ⏱ {scene.duration}s
                </div>
              </div>
            </div>

            {/* Scene Actions */}
            {selectedSceneIndex === index && (
              <div className="flex gap-1 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveScene(index, 'up');
                  }}
                  disabled={index === 0}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                  title="Déplacer vers le haut"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveScene(index, 'down');
                  }}
                  disabled={index === scenes.length - 1}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                  title="Déplacer vers le bas"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateScene(index);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                  title="Dupliquer"
                >
                  📋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Supprimer la scène "${scene.title}" ?`)) {
                      onDeleteScene(index);
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
                  title="Supprimer"
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenePanel;
