/**
 * Text Effects Utilities
 * Provides visual effects for text (shadows, outlines, glow, etc.)
 */

/**
 * Create drop shadow effect
 * @param {object} options - Shadow options
 * @returns {string} CSS text-shadow value
 */
export function createDropShadow(options = {}) {
  const {
    offsetX = 2,
    offsetY = 2,
    blur = 4,
    color = 'rgba(0, 0, 0, 0.5)'
  } = options;
  
  return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
}

/**
 * Create text outline effect
 * @param {object} options - Outline options
 * @returns {string} CSS text-stroke or text-shadow value
 */
export function createTextOutline(options = {}) {
  const {
    width = 2,
    color = '#000000'
  } = options;
  
  // Use multiple shadows to simulate outline
  const shadows = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const x = Math.cos(angle) * width;
    const y = Math.sin(angle) * width;
    shadows.push(`${x}px ${y}px 0 ${color}`);
  }
  
  return shadows.join(', ');
}

/**
 * Create glow effect
 * @param {object} options - Glow options
 * @returns {string} CSS text-shadow value
 */
export function createGlowEffect(options = {}) {
  const {
    color = '#ffffff',
    intensity = 10,
    layers = 3
  } = options;
  
  const shadows = [];
  for (let i = 1; i <= layers; i++) {
    const blur = intensity * i;
    shadows.push(`0 0 ${blur}px ${color}`);
  }
  
  return shadows.join(', ');
}

/**
 * Create 3D text effect
 * @param {object} options - 3D effect options
 * @returns {string} CSS text-shadow value
 */
export function create3DEffect(options = {}) {
  const {
    depth = 5,
    angle = 45,
    color = 'rgba(0, 0, 0, 0.3)',
    lightColor = 'rgba(255, 255, 255, 0.3)'
  } = options;
  
  const shadows = [];
  const rad = (angle * Math.PI) / 180;
  
  // Create depth layers
  for (let i = 1; i <= depth; i++) {
    const x = Math.cos(rad) * i;
    const y = Math.sin(rad) * i;
    shadows.push(`${x}px ${y}px 0 ${color}`);
  }
  
  // Add highlight
  shadows.push(`-1px -1px 0 ${lightColor}`);
  
  return shadows.join(', ');
}

/**
 * Create neon effect
 * @param {object} options - Neon effect options
 * @returns {string} CSS text-shadow value
 */
export function createNeonEffect(options = {}) {
  const {
    color = '#00ffff',
    intensity = 20
  } = options;
  
  return `
    0 0 ${intensity}px ${color},
    0 0 ${intensity * 2}px ${color},
    0 0 ${intensity * 3}px ${color}
  `.trim();
}

/**
 * Create gradient text effect (returns CSS object)
 * @param {object} options - Gradient options
 * @returns {object} CSS properties
 */
export function createGradientText(options = {}) {
  const {
    colors = ['#00ffff', '#ff00ff'],
    direction = 'to right'
  } = options;
  
  const gradient = `linear-gradient(${direction}, ${colors.join(', ')})`;
  
  return {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };
}

/**
 * Create embossed text effect
 * @param {object} options - Emboss options
 * @returns {string} CSS text-shadow value
 */
export function createEmbossEffect(options = {}) {
  const {
    highlightColor = 'rgba(255, 255, 255, 0.5)',
    shadowColor = 'rgba(0, 0, 0, 0.5)'
  } = options;
  
  return `
    -1px -1px 0 ${highlightColor},
    1px 1px 0 ${shadowColor}
  `.trim();
}

/**
 * Create fire text effect
 * @param {object} options - Fire effect options
 * @returns {string} CSS text-shadow value
 */
export function createFireEffect(options = {}) {
  const colors = options.colors || [
    'rgba(255, 100, 0, 1)',
    'rgba(255, 150, 0, 0.8)',
    'rgba(255, 200, 0, 0.6)',
    'rgba(255, 255, 0, 0.4)'
  ];
  
  const shadows = [];
  colors.forEach((color, index) => {
    const blur = (index + 1) * 5;
    shadows.push(`0 0 ${blur}px ${color}`);
  });
  
  return shadows.join(', ');
}

/**
 * Apply multiple effects to text
 * @param {Array<string>} effects - Array of effect names
 * @param {object} options - Options for each effect
 * @returns {object} Combined CSS properties
 */
export function combineEffects(effects, options = {}) {
  const shadows = [];
  const styles = {};
  
  effects.forEach(effectName => {
    const effectOptions = options[effectName] || {};
    
    switch (effectName) {
      case 'shadow':
        shadows.push(createDropShadow(effectOptions));
        break;
      case 'outline':
        shadows.push(createTextOutline(effectOptions));
        break;
      case 'glow':
        shadows.push(createGlowEffect(effectOptions));
        break;
      case '3d':
        shadows.push(create3DEffect(effectOptions));
        break;
      case 'neon':
        shadows.push(createNeonEffect(effectOptions));
        break;
      case 'emboss':
        shadows.push(createEmbossEffect(effectOptions));
        break;
      case 'fire':
        shadows.push(createFireEffect(effectOptions));
        break;
      case 'gradient':
        Object.assign(styles, createGradientText(effectOptions));
        break;
    }
  });
  
  if (shadows.length > 0) {
    styles.textShadow = shadows.join(', ');
  }
  
  return styles;
}

/**
 * Text effect presets
 */
export const TEXT_EFFECT_PRESETS = {
  shadow: {
    name: 'Drop Shadow',
    description: 'Classic drop shadow',
    apply: (options) => ({ textShadow: createDropShadow(options) })
  },
  
  outline: {
    name: 'Outline',
    description: 'Text outline',
    apply: (options) => ({ textShadow: createTextOutline(options) })
  },
  
  glow: {
    name: 'Glow',
    description: 'Glowing text',
    apply: (options) => ({ textShadow: createGlowEffect(options) })
  },
  
  '3d': {
    name: '3D Effect',
    description: '3D depth effect',
    apply: (options) => ({ textShadow: create3DEffect(options) })
  },
  
  neon: {
    name: 'Neon',
    description: 'Neon glow effect',
    apply: (options) => ({ textShadow: createNeonEffect(options) })
  },
  
  gradient: {
    name: 'Gradient',
    description: 'Gradient fill',
    apply: (options) => createGradientText(options)
  },
  
  emboss: {
    name: 'Embossed',
    description: 'Embossed text',
    apply: (options) => ({ textShadow: createEmbossEffect(options) })
  },
  
  fire: {
    name: 'Fire',
    description: 'Fire effect',
    apply: (options) => ({ textShadow: createFireEffect(options) })
  },
  
  modern: {
    name: 'Modern',
    description: 'Modern clean look',
    apply: (options) => combineEffects(['shadow', 'glow'], {
      shadow: { offsetY: 4, blur: 8, color: 'rgba(0, 0, 0, 0.2)' },
      glow: { color: options.color || '#4ECDC4', intensity: 5, layers: 2 }
    })
  },
  
  retro: {
    name: 'Retro',
    description: 'Retro 80s style',
    apply: (options) => combineEffects(['3d', 'neon'], {
      '3d': { depth: 8, angle: 135, color: 'rgba(0, 0, 0, 0.3)' },
      neon: { color: options.color || '#ff00ff', intensity: 15 }
    })
  }
};

export default {
  createDropShadow,
  createTextOutline,
  createGlowEffect,
  create3DEffect,
  createNeonEffect,
  createGradientText,
  createEmbossEffect,
  createFireEffect,
  combineEffects,
  TEXT_EFFECT_PRESETS
};
