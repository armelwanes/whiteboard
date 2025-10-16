import React from 'react';
import { Palette } from 'lucide-react';

interface ColorPreset {
  name: string;
  color: string;
}

const colorPresets: ColorPreset[] = [
  { name: 'Rouge', color: '#dc2626' },
  { name: 'Bleu', color: '#1e40af' },
  { name: 'Vert', color: '#059669' },
  { name: 'Violet', color: '#7c3aed' },
  { name: 'Orange', color: '#ea580c' },
  { name: 'Jaune', color: '#fbbf24' },
];

interface ThumbnailBackgroundProps {
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

export const ThumbnailBackground: React.FC<ThumbnailBackgroundProps> = ({
  backgroundColor,
  onColorChange
}) => {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Arrière-plan
      </h3>
      
      <div className="mb-3">
        <label className="block text-foreground text-sm mb-2">Couleur de fond</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {colorPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onColorChange(preset.color)}
            className="h-10 rounded-lg hover:ring-2 ring-white transition-all"
            style={{ background: preset.color }}
            title={preset.name}
          />
        ))}
      </div>
    </div>
  );
};
