import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Play, Square } from 'lucide-react';
import ParticleSystem from '../ParticleSystem';
import { PARTICLE_PRESETS } from '../../utils/particlePresets';

interface ParticleEditorProps {
  layer: any;
  onLayerUpdate: (updates: any) => void;
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * Particle Editor Component
 * UI for creating and configuring particle effects
 */
const ParticleEditor: React.FC<ParticleEditorProps> = ({ 
  layer, 
  onLayerUpdate,
  canvasWidth = 800,
  canvasHeight = 600
}) => {
  const [selectedEffect, setSelectedEffect] = useState('confetti');
  const [position, setPosition] = useState({ x: 400, y: 300 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [effectOptions, setEffectOptions] = useState({
    duration: 3,
    rate: 5,
    maxParticles: 100,
    color: '#FF6B6B'
  });

  const effects = layer?.particleEffects || [];

  const effectTypes = [
    { id: 'confetti', name: 'Confettis', icon: '🎊', description: 'Confettis de célébration' },
    { id: 'sparkles', name: 'Étincelles', icon: '✨', description: 'Étoiles scintillantes' },
    { id: 'explosion', name: 'Explosion', icon: '💥', description: 'Explosion de particules' },
    { id: 'smoke', name: 'Fumée', icon: '💨', description: 'Fumée montante' },
    { id: 'magic', name: 'Magie', icon: '🪄', description: 'Effet magique' },
    { id: 'firework', name: 'Feu d\'artifice', icon: '🎆', description: 'Feu d\'artifice' },
    { id: 'rain', name: 'Pluie', icon: '🌧️', description: 'Pluie tombante' },
    { id: 'snow', name: 'Neige', icon: '❄️', description: 'Neige tombante' },
    { id: 'hearts', name: 'Cœurs', icon: '💕', description: 'Cœurs flottants' }
  ];

  const handleAddEffect = () => {
    const newEffect = {
      id: `effect-${Date.now()}`,
      type: selectedEffect,
      x: position.x,
      y: position.y,
      options: { ...effectOptions },
      timestamp: 0 // When to trigger in timeline
    };

    const updatedEffects = [...effects, newEffect];
    onLayerUpdate({
      ...layer,
      particleEffects: updatedEffects
    });
  };

  const handleRemoveEffect = (effectId) => {
    const updatedEffects = effects.filter(e => e.id !== effectId);
    onLayerUpdate({
      ...layer,
      particleEffects: updatedEffects
    });
  };

  const handleUpdateEffect = (effectId, updates) => {
    const updatedEffects = effects.map(e =>
      e.id === effectId ? { ...e, ...updates } : e
    );
    onLayerUpdate({
      ...layer,
      particleEffects: updatedEffects
    });
  };

  const handleCanvasClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ 
      x: Math.round(x),
      y: Math.round(y)
    });
  };

  const previewEffects = isPlaying ? [
    {
      type: selectedEffect,
      x: position.x,
      y: position.y,
      options: effectOptions
    }
  ] : [];

  return (
    <div className="particle-editor space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-purple-400">
        <Sparkles className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Effets de Particules</h3>
      </div>

      {/* Preview Canvas */}
      <div className="relative bg-secondary/30 rounded-lg overflow-hidden border-2 border-border">
        <div 
          className="relative cursor-crosshair"
          onClick={handleCanvasClick}
        >
          <ParticleSystem
            effects={previewEffects}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full"
            autoStart={true}
          />
          
          {/* Position marker */}
          <div
            className="absolute w-4 h-4 border-2 border-purple-400 rounded-full pointer-events-none"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        {/* Position display */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          X: {position.x}, Y: {position.y}
        </div>
      </div>

      {/* Effect Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Type d'effet
        </label>
        <div className="grid grid-cols-3 gap-2">
          {effectTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedEffect(type.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedEffect === type.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-border bg-secondary/30 hover:border-purple-400'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-xs font-medium text-foreground">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Effect Options */}
      <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
        <h4 className="text-sm font-medium text-foreground">Options</h4>
        
        {/* Duration */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Durée (secondes)
          </label>
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={effectOptions.duration}
            onChange={(e) => setEffectOptions({
              ...effectOptions,
              duration: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-white text-sm"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Taux d'émission
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={effectOptions.rate}
            onChange={(e) => setEffectOptions({
              ...effectOptions,
              rate: parseInt(e.target.value)
            })}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-right">{effectOptions.rate} particules/frame</div>
        </div>

        {/* Max Particles */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Nombre maximum de particules
          </label>
          <input
            type="range"
            min="10"
            max="200"
            step="10"
            value={effectOptions.maxParticles}
            onChange={(e) => setEffectOptions({
              ...effectOptions,
              maxParticles: parseInt(e.target.value)
            })}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-right">{effectOptions.maxParticles} particules</div>
        </div>

        {/* Color */}
        {['explosion', 'sparkles', 'smoke', 'magic', 'rain', 'snow', 'hearts'].includes(selectedEffect) && (
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Couleur
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={effectOptions.color}
                onChange={(e) => setEffectOptions({
                  ...effectOptions,
                  color: e.target.value
                })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={effectOptions.color}
                onChange={(e) => setEffectOptions({
                  ...effectOptions,
                  color: e.target.value
                })}
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded text-white text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4" />
              Arrêter l'aperçu
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Aperçu
            </>
          )}
        </button>

        <button
          onClick={handleAddEffect}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Effects List */}
      {effects.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Effets ajoutés</h4>
          <div className="space-y-2">
            {effects.map(effect => {
              const effectType = effectTypes.find(t => t.id === effect.type);
              return (
                <div
                  key={effect.id}
                  className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border"
                >
                  <div className="text-2xl">{effectType?.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{effectType?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Position: ({effect.x}, {effect.y}) • 
                      Durée: {effect.options.duration}s
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEffect(effect.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticleEditor;
