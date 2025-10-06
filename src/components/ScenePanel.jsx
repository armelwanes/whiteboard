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
    <div className="scene-panel w-72 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-700 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-gray-700 bg-gray-800 bg-opacity-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-xl">Scènes</h2>
            <p className="text-gray-400 text-xs mt-0.5">{scenes.length} scène{scenes.length > 1 ? 's' : ''}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center">
            <span className="text-blue-400 font-bold text-lg">{scenes.length}</span>
          </div>
        </div>
        <button
          onClick={onAddScene}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nouvelle scène</span>
        </button>
      </div>

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className={`scene-item p-4 border-b border-gray-800 cursor-pointer transition-all ${
              selectedSceneIndex === index
                ? 'bg-blue-600 bg-opacity-20 border-l-4 border-l-blue-500 shadow-lg'
                : 'hover:bg-gray-800 hover:shadow-md'
            }`}
            onClick={() => onSelectScene(index)}
          >
            {/* Scene Preview */}
            <div className="flex items-start gap-3 mb-2">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-20 h-14 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs overflow-hidden shadow-md border border-gray-700">
                {scene.backgroundImage ? (
                  <img
                    src={scene.backgroundImage}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📄</span>
                )}
              </div>

              {/* Scene Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-white font-bold text-sm truncate">
                    {index + 1}. {scene.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-xs truncate mb-2 leading-relaxed">
                  {scene.content}
                </p>
                <div className="flex items-center gap-3 text-gray-500 text-xs">
                  <span className="flex items-center gap-1">
                    ⏱ {scene.duration}s
                  </span>
                  {scene.objects && scene.objects.length > 0 && (
                    <span className="flex items-center gap-1">
                      🖼️ {scene.objects.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Scene Actions */}
            {selectedSceneIndex === index && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveScene(index, 'up');
                  }}
                  disabled={index === 0}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white text-xs py-2 px-2 rounded-lg transition-all font-medium shadow-sm"
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
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white text-xs py-2 px-2 rounded-lg transition-all font-medium shadow-sm"
                  title="Déplacer vers le bas"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateScene(index);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-2 rounded-lg transition-all font-medium shadow-sm"
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-2 rounded-lg transition-all font-medium shadow-sm"
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
