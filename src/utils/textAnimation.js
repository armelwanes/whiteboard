/**
 * Text Animation Utilities
 * Provides character-by-character and word-by-word animation effects
 */

/**
 * Split text into characters while preserving spaces and newlines
 */
export function splitIntoCharacters(text) {
  return text.split('');
}

/**
 * Split text into words while preserving whitespace
 */
export function splitIntoWords(text) {
  const words = [];
  const regex = /(\S+|\s+)/g;
  let match;
  
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
export function calculateCharacterReveal(progress, totalChars) {
  return Math.floor(progress * totalChars);
}

/**
 * Calculate reveal progress for word-by-word animation
 * @param {number} progress - Animation progress (0-1)
 * @param {number} totalWords - Total number of words
 * @returns {number} Number of words to reveal
 */
export function calculateWordReveal(progress, totalWords) {
  return Math.floor(progress * totalWords);
}

/**
 * Apply typing animation effect
 * @param {string} text - Full text to animate
 * @param {number} progress - Animation progress (0-1)
 * @param {object} options - Animation options
 * @returns {string} Visible portion of text
 */
export function applyTypingEffect(text, progress, options = {}) {
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
export function calculateCharDelay(charIndex, totalChars, options = {}) {
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
export function getAnimatedCharacters(text, currentTime, options = {}) {
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
export function getAnimatedWords(text, currentTime, options = {}) {
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
export function createFadeInAnimation(progress, options = {}) {
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
export function createScaleAnimation(progress, options = {}) {
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
export function createSlideAnimation(progress, options = {}) {
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
export const TEXT_ANIMATION_PRESETS = {
  typing: {
    name: 'Typing',
    description: 'Character-by-character typing effect',
    apply: (text, progress, options) => applyTypingEffect(text, progress, { 
      mode: 'character', 
      ...options 
    })
  },
  
  wordTyping: {
    name: 'Word Typing',
    description: 'Word-by-word reveal effect',
    apply: (text, progress, options) => applyTypingEffect(text, progress, { 
      mode: 'word', 
      ...options 
    })
  },
  
  fadeIn: {
    name: 'Fade In',
    description: 'Smooth fade-in effect',
    apply: (text, progress, options) => text,
    getStyle: (progress, options) => createFadeInAnimation(progress, options)
  },
  
  scaleIn: {
    name: 'Scale In',
    description: 'Scale from small to normal',
    apply: (text, progress, options) => text,
    getStyle: (progress, options) => createScaleAnimation(progress, options)
  },
  
  slideIn: {
    name: 'Slide In',
    description: 'Slide from direction',
    apply: (text, progress, options) => text,
    getStyle: (progress, options) => createSlideAnimation(progress, options)
  }
};

/**
 * Calculate animation duration based on text length and mode
 * @param {string} text - Text to animate
 * @param {string} mode - Animation mode ('character' or 'word')
 * @param {number} baseSpeed - Base speed in ms per unit
 * @returns {number} Duration in milliseconds
 */
export function calculateAnimationDuration(text, mode = 'character', baseSpeed = 50) {
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
