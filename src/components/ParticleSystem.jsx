import React, { useEffect, useRef } from 'react';
import { ParticleSystem as ParticleEngine } from '../utils/particleEngine';
import { PARTICLE_PRESETS } from '../utils/particlePresets';

/**
 * ParticleSystem Component
 * Canvas-based particle effects renderer
 */
const ParticleSystem = ({ 
  effects = [],
  width = 800,
  height = 600,
  className = '',
  autoStart = true
}) => {
  const canvasRef = useRef(null);
  const particleSystemRef = useRef(null);
  const effectsRef = useRef([]);

  // Initialize particle system
  useEffect(() => {
    if (!canvasRef.current) return;

    const particleSystem = new ParticleEngine();
    particleSystem.init(canvasRef.current);
    particleSystemRef.current = particleSystem;

    if (autoStart) {
      particleSystem.start();
    }

    return () => {
      particleSystem.destroy();
      particleSystemRef.current = null;
    };
  }, [autoStart]);

  // Handle effects changes
  useEffect(() => {
    if (!particleSystemRef.current) return;

    const particleSystem = particleSystemRef.current;

    // Clear existing effects
    particleSystem.clear();
    effectsRef.current = [];

    // Add new effects
    effects.forEach(effect => {
      const { type, x, y, options } = effect;
      const presetFn = PARTICLE_PRESETS[type];
      
      if (presetFn) {
        const emitter = presetFn(x, y, options);
        particleSystem.addEmitter(emitter);
        effectsRef.current.push(emitter);
      }
    });
  }, [effects]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default ParticleSystem;
