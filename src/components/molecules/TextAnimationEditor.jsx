import React, { useState, useEffect } from 'react';
import { Type, Play, Square, Settings } from 'lucide-react';
import { TEXT_ANIMATION_PRESETS, applyTypingEffect } from '../../utils/textAnimation';
import { TEXT_EFFECT_PRESETS } from '../../utils/textEffects';

/**
 * Text Animation Editor Component
 * UI for creating and configuring text animations
 */
const TextAnimationEditor = ({ 
  layer, 
  onLayerUpdate 
}) => {
  const [previewText, setPreviewText] = useState(layer?.text || 'Example text animation');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationType, setAnimationType] = useState(layer?.textAnimation?.type || 'typing');
  const [effectType, setEffectType] = useState(layer?.textEffect?.type || 'shadow');
  const [animationSpeed, setAnimationSpeed] = useState(layer?.textAnimation?.speed || 50);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Animation options
  const [animationOptions, setAnimationOptions] = useState({
    cursor: '|',
    showCursor: true,
    mode: layer?.textAnimation?.mode || 'character',
    direction: 'left',
    ...layer?.textAnimation?.options
  });

  // Effect options
  const [effectOptions, setEffectOptions] = useState({
    color: '#4ECDC4',
    intensity: 10,
    width: 2,
    ...layer?.textEffect?.options
  });

  // Preview animation
  useEffect(() => {
    if (!isPlaying) return;

    const duration = previewText.length * animationSpeed;
    const startTime = Date.now();
    let animationFrame;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, previewText, animationSpeed]);

  const handleStartPreview = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const handleStopPreview = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleApply = () => {
    const updatedLayer = {
      ...layer,
      text: previewText,
      textAnimation: {
        type: animationType,
        speed: animationSpeed,
        mode: animationOptions.mode,
        options: animationOptions
      },
      textEffect: {
        type: effectType,
        options: effectOptions
      }
    };
    
    onLayerUpdate(updatedLayer);
  };

  // Get animated text based on type
  const getAnimatedText = () => {
    const preset = TEXT_ANIMATION_PRESETS[animationType];
    if (!preset) return previewText;
    
    return preset.apply(previewText, progress, animationOptions);
  };

  // Get text style with effects
  const getTextStyle = () => {
    const preset = TEXT_EFFECT_PRESETS[effectType];
    const baseStyle = {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
      padding: '20px',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    if (!preset) return baseStyle;

    const effectStyle = preset.apply(effectOptions);
    return { ...baseStyle, ...effectStyle };
  };

  const animationTypes = [
    { id: 'typing', name: 'Typing', icon: '⌨️', description: 'Character by character' },
    { id: 'wordTyping', name: 'Word Typing', icon: '📝', description: 'Word by word' },
    { id: 'fadeIn', name: 'Fade In', icon: '🌫️', description: 'Smooth fade' },
    { id: 'scaleIn', name: 'Scale In', icon: '📏', description: 'Scale from small' },
    { id: 'slideIn', name: 'Slide In', icon: '➡️', description: 'Slide from side' }
  ];

  const effectTypes = [
    { id: 'shadow', name: 'Shadow', icon: '🌑' },
    { id: 'outline', name: 'Outline', icon: '⭕' },
    { id: 'glow', name: 'Glow', icon: '✨' },
    { id: '3d', name: '3D', icon: '🎲' },
    { id: 'neon', name: 'Neon', icon: '🌟' },
    { id: 'gradient', name: 'Gradient', icon: '🎨' },
    { id: 'emboss', name: 'Emboss', icon: '📌' },
    { id: 'fire', name: 'Fire', icon: '🔥' }
  ];

  return (
    <div className="text-animation-editor space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-400">
          <Type className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Animations de Texte</h3>
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Texte à animer
        </label>
        <textarea
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white resize-none"
          rows={3}
          placeholder="Entrez votre texte ici..."
        />
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Aperçu
        </label>
        <div 
          className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden"
          style={{ minHeight: '120px' }}
        >
          <div style={getTextStyle()}>
            {getAnimatedText()}
          </div>
        </div>

        {/* Progress bar */}
        {isPlaying && (
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Preview Controls */}
      <div className="flex gap-2">
        {!isPlaying ? (
          <button
            onClick={handleStartPreview}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Aperçu
          </button>
        ) : (
          <button
            onClick={handleStopPreview}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Square className="w-4 h-4" />
            Arrêter
          </button>
        )}
        
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Appliquer
        </button>
      </div>

      {/* Animation Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Type d'animation
        </label>
        <div className="grid grid-cols-2 gap-2">
          {animationTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setAnimationType(type.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                animationType === type.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{type.icon}</span>
                <span className="text-sm font-medium text-white">{type.name}</span>
              </div>
              <div className="text-xs text-gray-400">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Effect Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Effet visuel
        </label>
        <div className="grid grid-cols-4 gap-2">
          {effectTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setEffectType(type.id)}
              className={`p-2 rounded-lg border-2 transition-all ${
                effectType === type.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-purple-400'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-xs font-medium text-gray-300">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Animation Speed */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Vitesse d'animation
        </label>
        <input
          type="range"
          min="10"
          max="200"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Rapide</span>
          <span>{animationSpeed}ms/char</span>
          <span>Lent</span>
        </div>
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
      >
        <Settings className="w-4 h-4" />
        {showAdvanced ? 'Masquer' : 'Afficher'} les options avancées
      </button>

      {showAdvanced && (
        <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
          {/* Animation Mode */}
          {(animationType === 'typing' || animationType === 'wordTyping') && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Mode
                </label>
                <select
                  value={animationOptions.mode}
                  onChange={(e) => setAnimationOptions({
                    ...animationOptions,
                    mode: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="character">Caractère par caractère</option>
                  <option value="word">Mot par mot</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={animationOptions.showCursor}
                  onChange={(e) => setAnimationOptions({
                    ...animationOptions,
                    showCursor: e.target.checked
                  })}
                  className="w-4 h-4"
                />
                <label className="text-xs text-gray-400">
                  Afficher le curseur
                </label>
              </div>

              {animationOptions.showCursor && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Caractère du curseur
                  </label>
                  <input
                    type="text"
                    maxLength="1"
                    value={animationOptions.cursor}
                    onChange={(e) => setAnimationOptions({
                      ...animationOptions,
                      cursor: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              )}
            </>
          )}

          {/* Slide Direction */}
          {animationType === 'slideIn' && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Direction
              </label>
              <select
                value={animationOptions.direction}
                onChange={(e) => setAnimationOptions({
                  ...animationOptions,
                  direction: e.target.value
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="left">De la gauche</option>
                <option value="right">De la droite</option>
                <option value="up">Du haut</option>
                <option value="down">Du bas</option>
              </select>
            </div>
          )}

          {/* Effect Options */}
          {['glow', 'neon'].includes(effectType) && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Intensité
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={effectOptions.intensity}
                onChange={(e) => setEffectOptions({
                  ...effectOptions,
                  intensity: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">{effectOptions.intensity}px</div>
            </div>
          )}

          {effectType === 'outline' && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Épaisseur du contour
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={effectOptions.width}
                onChange={(e) => setEffectOptions({
                  ...effectOptions,
                  width: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">{effectOptions.width}px</div>
            </div>
          )}

          {/* Color picker for effects */}
          {['glow', 'neon', 'gradient'].includes(effectType) && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
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
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextAnimationEditor;
