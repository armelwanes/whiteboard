/**
 * Text Effects Utilities
 * Provides visual effects for text (shadows, outlines, glow, etc.)
 */

export interface ShadowOptions {
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  color?: string;
}

export interface OutlineOptions {
  width?: number;
  color?: string;
}

export interface GlowOptions {
  color?: string;
  intensity?: number;
  layers?: number;
}

export interface Effect3DOptions {
  depth?: number;
  angle?: number;
  color?: string;
  lightColor?: string;
}

export interface NeonOptions {
  color?: string;
  intensity?: number;
}

export interface GradientOptions {
  colors?: string[];
  direction?: string;
}

export interface EmbossOptions {
  highlightColor?: string;
  shadowColor?: string;
}

export interface FireOptions {
  colors?: string[];
}

export interface CSSProperties {
  textShadow?: string;
  background?: string;
  WebkitBackgroundClip?: string;
  WebkitTextFillColor?: string;
  backgroundClip?: string;
}

export interface TextEffectPreset {
  name: string;
  description: string;
  apply: (options?: any) => CSSProperties;
}

/**
 * Create drop shadow effect
 * @param {object} options - Shadow options
 * @returns {string} CSS text-shadow value
 */
export function createDropShadow(options: ShadowOptions = {}): string {
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
export function createTextOutline(options: OutlineOptions = {}): string {
  const {
    width = 2,
    color = '#000000'
  } = options;
  
  const shadows: string[] = [];
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
export function createGlowEffect(options: GlowOptions = {}): string {
  const {
    color = '#ffffff',
    intensity = 10,
    layers = 3
  } = options;
  
  const shadows: string[] = [];
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
export function create3DEffect(options: Effect3DOptions = {}): string {
  const {
    depth = 5,
    angle = 45,
    color = 'rgba(0, 0, 0, 0.3)',
    lightColor = 'rgba(255, 255, 255, 0.3)'
  } = options;
  
  const shadows: string[] = [];
  const rad = (angle * Math.PI) / 180;
  
  for (let i = 1; i <= depth; i++) {
    const x = Math.cos(rad) * i;
    const y = Math.sin(rad) * i;
    shadows.push(`${x}px ${y}px 0 ${color}`);
  }
  
  shadows.push(`-1px -1px 0 ${lightColor}`);
  
  return shadows.join(', ');
}

/**
 * Create neon effect
 * @param {object} options - Neon effect options
 * @returns {string} CSS text-shadow value
 */
export function createNeonEffect(options: NeonOptions = {}): string {
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
export function createGradientText(options: GradientOptions = {}): CSSProperties {
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
export function createEmbossEffect(options: EmbossOptions = {}): string {
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
export function createFireEffect(options: FireOptions = {}): string {
  const colors = options.colors || [
    'rgba(255, 100, 0, 1)',
    'rgba(255, 150, 0, 0.8)',
    'rgba(255, 200, 0, 0.6)',
    'rgba(255, 255, 0, 0.4)'
  ];
  
  const shadows: string[] = [];
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
export function combineEffects(effects: string[], options: Record<string, any> = {}): CSSProperties {
  const shadows: string[] = [];
  const styles: CSSProperties = {};
  
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
export const TEXT_EFFECT_PRESETS: Record<string, TextEffectPreset> = {
  shadow: {
    name: 'Drop Shadow',
    description: 'Classic drop shadow',
    apply: (options?: ShadowOptions) => ({ textShadow: createDropShadow(options) })
  },
  
  outline: {
    name: 'Outline',
    description: 'Text outline',
    apply: (options?: OutlineOptions) => ({ textShadow: createTextOutline(options) })
  },
  
  glow: {
    name: 'Glow',
    description: 'Glowing text',
    apply: (options?: GlowOptions) => ({ textShadow: createGlowEffect(options) })
  },
  
  '3d': {
    name: '3D Effect',
    description: '3D depth effect',
    apply: (options?: Effect3DOptions) => ({ textShadow: create3DEffect(options) })
  },
  
  neon: {
    name: 'Neon',
    description: 'Neon glow effect',
    apply: (options?: NeonOptions) => ({ textShadow: createNeonEffect(options) })
  },
  
  gradient: {
    name: 'Gradient',
    description: 'Gradient fill',
    apply: (options?: GradientOptions) => createGradientText(options)
  },
  
  emboss: {
    name: 'Embossed',
    description: 'Embossed text',
    apply: (options?: EmbossOptions) => ({ textShadow: createEmbossEffect(options) })
  },
  
  fire: {
    name: 'Fire',
    description: 'Fire effect',
    apply: (options?: FireOptions) => ({ textShadow: createFireEffect(options) })
  },
  
  modern: {
    name: 'Modern',
    description: 'Modern clean look',
    apply: (options?: any) => combineEffects(['shadow', 'glow'], {
      shadow: { offsetY: 4, blur: 8, color: 'rgba(0, 0, 0, 0.2)' },
      glow: { color: options?.color || '#4ECDC4', intensity: 5, layers: 2 }
    })
  },
  
  retro: {
    name: 'Retro',
    description: 'Retro 80s style',
    apply: (options?: any) => combineEffects(['3d', 'neon'], {
      '3d': { depth: 8, angle: 135, color: 'rgba(0, 0, 0, 0.3)' },
      neon: { color: options?.color || '#ff00ff', intensity: 15 }
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
