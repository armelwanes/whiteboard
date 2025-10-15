/**
 * Text Animation Utilities
 * Provides character-by-character and word-by-word animation effects
 */

export interface WordInfo {
  text: string;
  index: number;
}

export interface CharacterInfo {
  char: string;
  index: number;
  isVisible: boolean;
  opacity: number;
  delay: number;
}

export interface WordAnimationInfo {
  text: string;
  index: number;
  isVisible: boolean;
  opacity: number;
  delay: number;
}

export interface AnimationOptions {
  mode?: 'character' | 'word';
  cursor?: string;
  showCursor?: boolean;
  baseDelay?: number;
  randomness?: number;
  staggered?: boolean;
  easing?: string;
  fromScale?: number;
  toScale?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}

export interface AnimationStyle {
  opacity?: number;
  transition?: string;
  transform?: string;
}

export interface TextAnimationPreset {
  name: string;
  description: string;
  apply: (text: string, progress: number, options?: AnimationOptions) => string;
  getStyle?: (progress: number, options?: AnimationOptions) => AnimationStyle;
}

/**
 * Split text into characters while preserving spaces and newlines
 */
export function splitIntoCharacters(text: string): string[] {
  return text.split('');
}

/**
 * Split text into words while preserving whitespace
 */
export function splitIntoWords(text: string): WordInfo[] {
  const words: WordInfo[] = [];
  const regex = /(\S+|\s+)/g;
  let match: RegExpExecArray | null;
  
  while ((match = regex.exec(text)) !== null) {
    words.push({
      text: match[0],
      index: match.index
    });
  }
  
  return words;
}

/**
 * Calculate reveal progress for character-by-character animation
 * @param {number} progress - Animation progress (0-1)
 * @param {number} totalChars - Total number of characters
 * @returns {number} Number of characters to reveal
 */
export function calculateCharacterReveal(progress: number, totalChars: number): number {
  return Math.floor(progress * totalChars);
}

/**
 * Calculate reveal progress for word-by-word animation
 * @param {number} progress - Animation progress (0-1)
 * @param {number} totalWords - Total number of words
 * @returns {number} Number of words to reveal
 */
export function calculateWordReveal(progress: number, totalWords: number): number {
  return Math.floor(progress * totalWords);
}

/**
 * Apply typing animation effect
 * @param {string} text - Full text to animate
 * @param {number} progress - Animation progress (0-1)
 * @param {object} options - Animation options
 * @returns {string} Visible portion of text
 */
export function applyTypingEffect(text: string, progress: number, options: AnimationOptions = {}): string {
  const { mode = 'character', cursor = '|', showCursor = true } = options;
  
  if (mode === 'character') {
    const chars = splitIntoCharacters(text);
    const revealCount = calculateCharacterReveal(progress, chars.length);
    const visibleText = chars.slice(0, revealCount).join('');
    
    if (showCursor && progress < 1) {
      return visibleText + cursor;
    }
    
    return visibleText;
  } else if (mode === 'word') {
    const words = splitIntoWords(text);
    const revealCount = calculateWordReveal(progress, words.length);
    const visibleText = words.slice(0, revealCount).map(w => w.text).join('');
    
    if (showCursor && progress < 1) {
      return visibleText + cursor;
    }
    
    return visibleText;
  }
  
  return text;
}

/**
 * Calculate character-specific animation delay
 * @param {number} charIndex - Index of character
 * @param {number} totalChars - Total number of characters
 * @param {object} options - Animation options
 * @returns {number} Delay in milliseconds
 */
export function calculateCharDelay(charIndex: number, totalChars: number, options: AnimationOptions = {}): number {
  const { baseDelay = 50, randomness = 0 } = options;
  const randomDelay = randomness * Math.random() * baseDelay;
  return charIndex * baseDelay + randomDelay;
}

/**
 * Get visible characters with individual animation states
 * @param {string} text - Full text
 * @param {number} currentTime - Current animation time in ms
 * @param {object} options - Animation options
 * @returns {Array} Array of character objects with visibility state
 */
export function getAnimatedCharacters(text: string, currentTime: number, options: AnimationOptions = {}): CharacterInfo[] {
  const { baseDelay = 50, randomness = 0, staggered = true } = options;
  const chars = splitIntoCharacters(text);
  
  return chars.map((char, index) => {
    let delay = 0;
    
    if (staggered) {
      delay = calculateCharDelay(index, chars.length, { baseDelay, randomness });
    }
    
    const isVisible = currentTime >= delay;
    const opacity = isVisible ? 1 : 0;
    
    return {
      char,
      index,
      isVisible,
      opacity,
      delay
    };
  });
}

/**
 * Get visible words with individual animation states
 * @param {string} text - Full text
 * @param {number} currentTime - Current animation time in ms
 * @param {object} options - Animation options
 * @returns {Array} Array of word objects with visibility state
 */
export function getAnimatedWords(text: string, currentTime: number, options: AnimationOptions = {}): WordAnimationInfo[] {
  const { baseDelay = 200, randomness = 0 } = options;
  const words = splitIntoWords(text);
  
  return words.map((word, index) => {
    const delay = index * baseDelay + (randomness * Math.random() * baseDelay);
    const isVisible = currentTime >= delay;
    
    return {
      text: word.text,
      index,
      isVisible,
      opacity: isVisible ? 1 : 0,
      delay
    };
  });
}

/**
 * Create fade-in animation for text
 * @param {number} progress - Animation progress (0-1)
 * @param {object} options - Animation options
 * @returns {object} Style object
 */
export function createFadeInAnimation(progress: number, options: AnimationOptions = {}): AnimationStyle {
  const { easing = 'ease-in-out' } = options;
  return {
    opacity: progress,
    transition: `opacity 0.3s ${easing}`
  };
}

/**
 * Create scale animation for text
 * @param {number} progress - Animation progress (0-1)
 * @param {object} options - Animation options
 * @returns {object} Style object
 */
export function createScaleAnimation(progress: number, options: AnimationOptions = {}): AnimationStyle {
  const { fromScale = 0, toScale = 1, easing = 'ease-out' } = options;
  const scale = fromScale + (toScale - fromScale) * progress;
  
  return {
    transform: `scale(${scale})`,
    opacity: progress,
    transition: `transform 0.3s ${easing}, opacity 0.3s ${easing}`
  };
}

/**
 * Create slide animation for text
 * @param {number} progress - Animation progress (0-1)
 * @param {object} options - Animation options
 * @returns {object} Style object
 */
export function createSlideAnimation(progress: number, options: AnimationOptions = {}): AnimationStyle {
  const { direction = 'left', distance = 50, easing = 'ease-out' } = options;
  
  let x = 0;
  let y = 0;
  
  switch (direction) {
    case 'left':
      x = -distance * (1 - progress);
      break;
    case 'right':
      x = distance * (1 - progress);
      break;
    case 'up':
      y = -distance * (1 - progress);
      break;
    case 'down':
      y = distance * (1 - progress);
      break;
  }
  
  return {
    transform: `translate(${x}px, ${y}px)`,
    opacity: progress,
    transition: `transform 0.3s ${easing}, opacity 0.3s ${easing}`
  };
}

/**
 * Text animation presets
 */
export const TEXT_ANIMATION_PRESETS: Record<string, TextAnimationPreset> = {
  typing: {
    name: 'Typing',
    description: 'Character-by-character typing effect',
    apply: (text: string, progress: number, options?: AnimationOptions) => applyTypingEffect(text, progress, { 
      mode: 'character', 
      ...options 
    })
  },
  
  wordTyping: {
    name: 'Word Typing',
    description: 'Word-by-word reveal effect',
    apply: (text: string, progress: number, options?: AnimationOptions) => applyTypingEffect(text, progress, { 
      mode: 'word', 
      ...options 
    })
  },
  
  fadeIn: {
    name: 'Fade In',
    description: 'Smooth fade-in effect',
    apply: (text: string, _progress: number, _options?: AnimationOptions) => text,
    getStyle: (progress: number, options?: AnimationOptions) => createFadeInAnimation(progress, options)
  },
  
  scaleIn: {
    name: 'Scale In',
    description: 'Scale from small to normal',
    apply: (text: string, _progress: number, _options?: AnimationOptions) => text,
    getStyle: (progress: number, options?: AnimationOptions) => createScaleAnimation(progress, options)
  },
  
  slideIn: {
    name: 'Slide In',
    description: 'Slide from direction',
    apply: (text: string, _progress: number, _options?: AnimationOptions) => text,
    getStyle: (progress: number, options?: AnimationOptions) => createSlideAnimation(progress, options)
  }
};

/**
 * Calculate animation duration based on text length and mode
 * @param {string} text - Text to animate
 * @param {string} mode - Animation mode ('character' or 'word')
 * @param {number} baseSpeed - Base speed in ms per unit
 * @returns {number} Duration in milliseconds
 */
export function calculateAnimationDuration(text: string, mode: 'character' | 'word' = 'character', baseSpeed: number = 50): number {
  if (mode === 'character') {
    return text.length * baseSpeed;
  } else if (mode === 'word') {
    const words = splitIntoWords(text).filter(w => w.text.trim().length > 0);
    return words.length * baseSpeed;
  }
  return 1000;
}

export default {
  splitIntoCharacters,
  splitIntoWords,
  calculateCharacterReveal,
  calculateWordReveal,
  applyTypingEffect,
  calculateCharDelay,
  getAnimatedCharacters,
  getAnimatedWords,
  createFadeInAnimation,
  createScaleAnimation,
  createSlideAnimation,
  TEXT_ANIMATION_PRESETS,
  calculateAnimationDuration
};
