import React from 'react';

interface ObjectsListProps {
  objects: any[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
}

export const ObjectsList: React.FC<ObjectsListProps> = ({
  objects,
  selectedObjectId,
  onSelectObject,
  onDeleteObject,
}) => {
  return (
    <div>
      <label className="block text-white font-semibold mb-2 text-sm">
        Objets dans la scène ({objects.length})
      </label>
      <div className="space-y-2">
        {objects.length === 0 ? (
          <p className="text-muted-foreground text-xs italic">Aucun objet pour le moment</p>
        ) : (
          objects.map((obj) => (
            <div
              key={obj.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                selectedObjectId === obj.id
                  ? 'bg-primary bg-opacity-20 border border-primary'
                  : 'bg-secondary/30 hover:bg-secondary/80 border border-border'
              }`}
              onClick={() => onSelectObject(obj.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🖼️</span>
                <div>
                  <p className="text-white text-sm font-medium truncate max-w-[150px]">
                    {obj.name || 'Image'}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {Math.round(obj.width)} × {Math.round(obj.height)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteObject(obj.id);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
