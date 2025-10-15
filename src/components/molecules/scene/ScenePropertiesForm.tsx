import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScenePropertiesFormProps {
  scene: any;
  onChange: (field: string, value: any) => void;
}

export const ScenePropertiesForm: React.FC<ScenePropertiesFormProps> = ({ scene, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Titre de la scène
        </label>
        <input
          type="text"
          value={scene.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Entrez le titre..."
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Contenu
        </label>
        <textarea
          value={scene.content}
          onChange={(e) => onChange('content', e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none transition-all"
          placeholder="Entrez le contenu..."
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Durée (secondes)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          value={scene.duration}
          onChange={(e) => onChange('duration', parseInt(e.target.value) || 5)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Image de fond (URL)
        </label>
        <input
          type="text"
          value={scene.backgroundImage || ''}
          onChange={(e) => onChange('backgroundImage', e.target.value || null)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="https://example.com/image.jpg"
        />
        {scene.backgroundImage && (
          <div className="mt-3">
            <img
              src={scene.backgroundImage}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Animation Type */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Type d'animation
        </label>
        <Select
          value={scene.animation}
          onValueChange={(value) => onChange('animation', value)}
        >
          <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <SelectValue placeholder="Sélectionner une animation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="scale">Scale</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
