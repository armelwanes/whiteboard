/**
 * Particle Effect Presets
 * Pre-configured particle effects for common use cases
 */

import { ParticleEmitter } from './particleEngine';

/**
 * Confetti Effect
 * Celebration effect with colorful falling confetti
 */
export function createConfettiEffect(x, y, options = {}) {
  const colors = options.colors || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  
  return new ParticleEmitter(x, y, {
    rate: options.rate || 5,
    maxParticles: options.maxParticles || 100,
    spread: Math.PI,
    angle: -Math.PI / 2,
    speed: 3,
    speedVariation: 2,
    duration: options.duration || 3,
    particleConfig: {
      size: 8,
      shape: 'square',
      life: 2.0,
      decay: 0.008,
      ay: 0.3,
      rotationSpeed: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
  });
}

/**
 * Sparkles Effect
 * Twinkling star particles
 */
export function createSparklesEffect(x, y, options = {}) {
  return new ParticleEmitter(x, y, {
    rate: options.rate || 3,
    maxParticles: options.maxParticles || 50,
    spread: Math.PI * 2,
    angle: 0,
    speed: 1,
    speedVariation: 0.5,
    duration: options.duration || 2,
    particleConfig: {
      size: 6,
      shape: 'star',
      life: 1.5,
      decay: 0.02,
      ay: 0,
      ax: 0,
      rotationSpeed: 0.1,
      color: options.color || '#FFD700'
    }
  });
}

/**
 * Explosion Effect
 * Burst of particles in all directions
 */
export function createExplosionEffect(x, y, options = {}) {
  const emitter = new ParticleEmitter(x, y, {
    rate: 0,
    maxParticles: options.maxParticles || 50,
    spread: Math.PI * 2,
    angle: 0,
    speed: 5,
    speedVariation: 3,
    duration: 0.1,
    particleConfig: {
      size: 8,
      shape: 'circle',
      life: 1.0,
      decay: 0.015,
      ay: 0.2,
      color: options.color || '#FF6B6B'
    }
  });
  
  // Emit all particles at once
  emitter.emit(options.maxParticles || 50);
  emitter.stop();
  
  return emitter;
}

/**
 * Smoke/Dust Effect
 * Rising smoke or dust particles
 */
export function createSmokeEffect(x, y, options = {}) {
  return new ParticleEmitter(x, y, {
    rate: options.rate || 2,
    maxParticles: options.maxParticles || 30,
    spread: Math.PI / 4,
    angle: -Math.PI / 2,
    speed: 1,
    speedVariation: 0.5,
    duration: options.duration || 3,
    particleConfig: {
      size: 20,
      shape: 'circle',
      life: 2.0,
      decay: 0.01,
      ay: -0.1, // negative for rising
      color: options.color || 'rgba(128, 128, 128, 0.3)'
    }
  });
}

/**
 * Magic Effect
 * Magical sparkles with trail
 */
export function createMagicEffect(x, y, options = {}) {
  return new ParticleEmitter(x, y, {
    rate: options.rate || 4,
    maxParticles: options.maxParticles || 60,
    spread: Math.PI * 2,
    angle: 0,
    speed: 2,
    speedVariation: 1,
    duration: options.duration || 2,
    particleConfig: {
      size: 5,
      shape: 'star',
      life: 1.5,
      decay: 0.015,
      ay: -0.1,
      rotationSpeed: 0.15,
      color: options.color || '#9B59B6'
    }
  });
}

/**
 * Firework Effect
 * Firework explosion with trail
 */
export function createFireworkEffect(x, y, options = {}) {
  const colors = options.colors || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const emitter = new ParticleEmitter(x, y, {
    rate: 0,
    maxParticles: 100,
    spread: Math.PI * 2,
    angle: 0,
    speed: 4,
    speedVariation: 2,
    duration: 0.1,
    particleConfig: {
      size: 4,
      shape: 'circle',
      life: 1.5,
      decay: 0.012,
      ay: 0.3,
      color: color
    }
  });
  
  // Emit all particles at once
  emitter.emit(100);
  emitter.stop();
  
  return emitter;
}

/**
 * Rain Effect
 * Falling rain particles
 */
export function createRainEffect(x, y, options = {}) {
  return new ParticleEmitter(x, y, {
    rate: options.rate || 5,
    maxParticles: options.maxParticles || 100,
    spread: Math.PI / 8,
    angle: Math.PI / 2,
    speed: 8,
    speedVariation: 2,
    duration: options.duration || -1,
    particleConfig: {
      size: 2,
      shape: 'circle',
      life: 2.0,
      decay: 0.01,
      ay: 0.5,
      color: options.color || '#6DB5E8'
    }
  });
}

/**
 * Snow Effect
 * Gently falling snow particles
 */
export function createSnowEffect(x, y, options = {}) {
  return new ParticleEmitter(x, y, {
    rate: options.rate || 3,
    maxParticles: options.maxParticles || 50,
    spread: Math.PI / 6,
    angle: Math.PI / 2,
    speed: 1,
    speedVariation: 0.5,
    duration: options.duration || -1,
    particleConfig: {
      size: 5,
      shape: 'circle',
      life: 3.0,
      decay: 0.005,
      ay: 0.1,
      color: options.color || '#FFFFFF'
    }
  });
}

/**
 * Hearts Effect
 * Floating hearts
 */
export function createHeartsEffect(x, y, options = {}) {
  return new ParticleEmitter(x, y, {
    rate: options.rate || 2,
    maxParticles: options.maxParticles || 30,
    spread: Math.PI / 4,
    angle: -Math.PI / 2,
    speed: 2,
    speedVariation: 1,
    duration: options.duration || 3,
    particleConfig: {
      size: 10,
      shape: 'circle',
      life: 2.0,
      decay: 0.01,
      ay: -0.05,
      color: options.color || '#FF1493'
    }
  });
}

// Preset configurations object for easy access
export const PARTICLE_PRESETS = {
  confetti: createConfettiEffect,
  sparkles: createSparklesEffect,
  explosion: createExplosionEffect,
  smoke: createSmokeEffect,
  magic: createMagicEffect,
  firework: createFireworkEffect,
  rain: createRainEffect,
  snow: createSnowEffect,
  hearts: createHeartsEffect
};

export default PARTICLE_PRESETS;
