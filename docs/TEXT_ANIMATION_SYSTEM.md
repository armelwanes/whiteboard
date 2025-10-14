# Text Animation System Documentation

## Overview

The Text Animation System provides advanced text animation capabilities including character-by-character typing, word-by-word reveals, and various visual effects. It's designed for creating engaging text-based content in whiteboard animations.

## Features

### Animation Types

1. **Typing Effect** ⌨️
   - Character-by-character reveal
   - Customizable typing speed
   - Optional cursor display
   - Perfect for typewriter effects

2. **Word Typing** 📝
   - Word-by-word reveal
   - Natural reading flow
   - Adjustable word timing
   - Great for narration sync

3. **Fade In** 🌫️
   - Smooth opacity transition
   - Elegant entrance
   - Configurable easing
   - Clean and professional

4. **Scale In** 📏
   - Scale from small to normal
   - Dynamic entrance
   - Attention-grabbing
   - Modern style

5. **Slide In** ➡️
   - Slide from any direction (left, right, up, down)
   - Smooth motion
   - Directional emphasis
   - Versatile positioning

### Visual Effects

1. **Drop Shadow** 🌑
   - Classic drop shadow
   - Adjustable offset and blur
   - Depth and dimension
   - Universal compatibility

2. **Outline** ⭕
   - Text outline/stroke
   - Adjustable thickness
   - High contrast
   - Clear readability

3. **Glow** ✨
   - Soft glow effect
   - Multiple intensity levels
   - Ethereal appearance
   - Modern aesthetic

4. **3D Effect** 🎲
   - Depth simulation
   - Adjustable angle
   - Retro style
   - Eye-catching

5. **Neon** 🌟
   - Neon glow effect
   - Vibrant colors
   - Night-time aesthetic
   - Retro futuristic

6. **Gradient** 🎨
   - Color gradient fill
   - Custom color stops
   - Modern design
   - Flexible styling

7. **Embossed** 📌
   - Embossed appearance
   - Subtle depth
   - Professional look
   - Classic style

8. **Fire** 🔥
   - Fire effect
   - Multiple color layers
   - Dynamic appearance
   - Dramatic impact

## Using the Text Animation Editor

### Basic Workflow

1. **Open the Layer Editor** for your scene
2. **Navigate to the Text Animation section**
3. **Enter your text** in the text area
4. **Select an animation type** from the grid
5. **Choose a visual effect** for styling
6. **Adjust the speed** with the slider
7. **Click Preview** to see the animation
8. **Click Apply** to save to the layer

### Animation Speed

Control how fast the text animates:
- **Fast (10-50ms)**: Quick reveal, energetic
- **Medium (50-100ms)**: Standard reading speed
- **Slow (100-200ms)**: Dramatic, deliberate

The speed is measured in milliseconds per character/word.

### Advanced Options

Click "Afficher les options avancées" to access:

#### For Typing Animations
- **Mode**: Character-by-character or word-by-word
- **Show Cursor**: Toggle cursor visibility
- **Cursor Character**: Customize cursor symbol (|, _, █, etc.)

#### For Slide Animations
- **Direction**: Left, Right, Up, Down
- **Distance**: How far to slide from

#### For Visual Effects
- **Intensity**: Strength of glow/neon effects (5-30px)
- **Width**: Thickness of outline (1-5px)
- **Color**: Custom color for single-color effects

## Technical Implementation

### Text Animation Utilities

**textAnimation.js** provides:

```javascript
import { 
  applyTypingEffect,
  calculateAnimationDuration,
  TEXT_ANIMATION_PRESETS 
} from '../utils/textAnimation';

// Apply typing effect
const visibleText = applyTypingEffect('Hello World', 0.5, {
  mode: 'character',
  cursor: '|',
  showCursor: true
});

// Calculate animation duration
const duration = calculateAnimationDuration('Hello World', 'character', 50);
```

Available functions:
- `splitIntoCharacters(text)` - Split text into character array
- `splitIntoWords(text)` - Split text into word objects
- `applyTypingEffect(text, progress, options)` - Apply typing animation
- `getAnimatedCharacters(text, currentTime, options)` - Get character states
- `getAnimatedWords(text, currentTime, options)` - Get word states
- `calculateAnimationDuration(text, mode, baseSpeed)` - Calculate duration

### Text Effects Utilities

**textEffects.js** provides:

```javascript
import { 
  createGlowEffect,
  createTextOutline,
  TEXT_EFFECT_PRESETS 
} from '../utils/textEffects';

// Create glow effect
const glowStyle = createGlowEffect({
  color: '#00ffff',
  intensity: 15,
  layers: 3
});

// Create outline
const outlineStyle = createTextOutline({
  width: 2,
  color: '#000000'
});

// Apply preset
const style = TEXT_EFFECT_PRESETS.neon.apply({ color: '#ff00ff' });
```

Available functions:
- `createDropShadow(options)` - Drop shadow effect
- `createTextOutline(options)` - Outline effect
- `createGlowEffect(options)` - Glow effect
- `create3DEffect(options)` - 3D depth effect
- `createNeonEffect(options)` - Neon glow
- `createGradientText(options)` - Gradient fill
- `createEmbossEffect(options)` - Embossed look
- `createFireEffect(options)` - Fire effect
- `combineEffects(effects, options)` - Combine multiple effects

### React Component

**TextAnimationEditor Component:**

```jsx
<TextAnimationEditor
  layer={currentLayer}
  onLayerUpdate={(updatedLayer) => {
    // Handle layer update
  }}
/>
```

## Data Structure

Text animations are stored in the layer configuration:

```javascript
{
  id: 'layer-1',
  name: 'My Text Layer',
  text: 'Hello World',
  textAnimation: {
    type: 'typing',        // Animation type
    speed: 50,             // Speed in ms per unit
    mode: 'character',     // character or word
    options: {
      cursor: '|',
      showCursor: true,
      direction: 'left'    // For slide animations
    }
  },
  textEffect: {
    type: 'glow',          // Effect type
    options: {
      color: '#4ECDC4',
      intensity: 10,
      width: 2
    }
  }
}
```

## Best Practices

### Animation Selection

- **Typing**: Best for code, terminal outputs, quotes
- **Word Typing**: Best for narration, subtitles
- **Fade In**: Best for titles, headings
- **Scale In**: Best for emphasis, call-to-action
- **Slide In**: Best for lists, bullet points

### Effect Selection

- **Shadow**: Universal, works everywhere
- **Outline**: High contrast backgrounds
- **Glow**: Dark backgrounds, emphasis
- **3D/Neon**: Retro themes, creative content
- **Gradient**: Modern designs, branding
- **Fire**: Dramatic moments, warnings

### Performance Tips

1. **Optimize Text Length**: Shorter text animates faster
2. **Appropriate Speed**: Match speed to context
3. **Minimal Effects**: Don't overuse effects
4. **Test Readability**: Ensure text remains readable
5. **Consider Audience**: Match style to target audience

### Accessibility

- **Sufficient Contrast**: Ensure text is readable
- **Animation Duration**: Not too fast for reading
- **Provide Alternatives**: Consider static fallbacks
- **Test Readability**: Check with various backgrounds

## Use Cases

### Educational Content
- **Typing**: Code demonstrations
- **Word Typing**: Step-by-step instructions
- **Fade In**: Section titles
- **Shadow/Outline**: Better readability

### Marketing Videos
- **Scale In**: Call-to-action
- **Gradient**: Brand colors
- **Glow**: Product features
- **Slide In**: Bullet points

### Presentations
- **Fade In**: Slide titles
- **Word Typing**: Quotes
- **Emboss**: Professional look
- **3D**: Creative emphasis

### Social Media
- **Typing**: Attention-grabbing
- **Neon**: Trendy aesthetic
- **Fire**: Dramatic announcements
- **Quick animations**: Short attention spans

## Examples

### Professional Quote

```javascript
{
  text: "Innovation distinguishes between a leader and a follower.",
  textAnimation: {
    type: 'wordTyping',
    speed: 100,
    mode: 'word',
    options: { showCursor: false }
  },
  textEffect: {
    type: 'shadow',
    options: {
      offsetY: 3,
      blur: 6,
      color: 'rgba(0, 0, 0, 0.3)'
    }
  }
}
```

### Retro Gaming Style

```javascript
{
  text: "GAME OVER",
  textAnimation: {
    type: 'scaleIn',
    speed: 30
  },
  textEffect: {
    type: 'neon',
    options: {
      color: '#ff00ff',
      intensity: 20
    }
  }
}
```

### Modern Call-to-Action

```javascript
{
  text: "Get Started Today",
  textAnimation: {
    type: 'fadeIn',
    speed: 80
  },
  textEffect: {
    type: 'gradient',
    options: {
      colors: ['#4ECDC4', '#FF6B6B'],
      direction: 'to right'
    }
  }
}
```

### Code Typing Effect

```javascript
{
  text: "const hello = 'world';",
  textAnimation: {
    type: 'typing',
    speed: 50,
    mode: 'character',
    options: {
      cursor: '_',
      showCursor: true
    }
  },
  textEffect: {
    type: 'glow',
    options: {
      color: '#00ff00',
      intensity: 8
    }
  }
}
```

## Timeline Integration

Text animations integrate with the timeline system:

1. **Start Time**: When animation begins
2. **Duration**: Automatically calculated from text length and speed
3. **Sync**: Can be synchronized with audio narration
4. **Sequencing**: Multiple text layers can be animated in sequence

## Combining Animations and Effects

You can combine different animations and effects for unique results:

- **Typing + Glow**: Matrix-style code
- **Slide In + Shadow**: Professional slides
- **Word Typing + Gradient**: Modern marketing
- **Fade In + 3D**: Retro titles
- **Scale In + Neon**: Attention-grabbing CTAs

## Future Enhancements

Planned features for future releases:

- Text path animations (curved text)
- Letter spacing animations
- Color transitions
- Bounce and elastic effects
- Text masking effects
- Advanced gradient animations
- Text morphing
- 3D transformations
- Integration with voice synthesis

## Troubleshooting

### Animation not visible
- Check that text is not empty
- Verify animation speed is appropriate
- Ensure layer is visible on timeline

### Effects not applying
- Check browser compatibility
- Verify CSS properties are supported
- Test with different effect types

### Poor readability
- Increase contrast with outline effect
- Add drop shadow for depth
- Choose appropriate background
- Adjust effect intensity

## API Reference

### TEXT_ANIMATION_PRESETS

Available presets:
- `typing` - Character-by-character typing
- `wordTyping` - Word-by-word reveal
- `fadeIn` - Fade in transition
- `scaleIn` - Scale from small
- `slideIn` - Slide from direction

### TEXT_EFFECT_PRESETS

Available effects:
- `shadow` - Drop shadow
- `outline` - Text outline
- `glow` - Glow effect
- `3d` - 3D depth
- `neon` - Neon glow
- `gradient` - Gradient fill
- `emboss` - Embossed style
- `fire` - Fire effect
- `modern` - Modern combined effect
- `retro` - Retro 80s style

---

**Created**: October 2025  
**Version**: 1.0.0  
**Status**: Production Ready
