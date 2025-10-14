# Particle System Documentation

## Overview

The Particle System provides dynamic visual effects for whiteboard animations. It includes a physics-based particle engine and multiple preset effects for common use cases.

## Features

### Preset Effects

The system includes 9 pre-configured particle effects:

1. **Confetti (🎊)** - Celebration effect with colorful falling confetti
2. **Sparkles (✨)** - Twinkling star particles
3. **Explosion (💥)** - Burst of particles in all directions
4. **Smoke (💨)** - Rising smoke or dust particles
5. **Magic (🪄)** - Magical sparkles with floating trail
6. **Firework (🎆)** - Firework explosion effect
7. **Rain (🌧️)** - Falling rain particles
8. **Snow (❄️)** - Gently falling snow particles
9. **Hearts (💕)** - Floating heart particles

### Customizable Parameters

Each effect can be customized with:
- **Duration**: How long the effect lasts (0.1-10 seconds)
- **Rate**: Particle emission rate (1-20 particles per frame)
- **Max Particles**: Maximum number of particles (10-200)
- **Color**: Custom color for single-color effects
- **Position**: Exact X, Y coordinates for emitter placement

## Using the Particle Editor

### Adding Effects

1. **Open the Layer Editor** for your scene
2. **Scroll to the Particle Effects section**
3. **Click on the preview canvas** to set the emission point
4. **Select an effect type** from the grid of preset effects
5. **Adjust options** as needed (duration, rate, particles, color)
6. **Click Preview** to see the effect in action
7. **Click Add** to add the effect to your layer

### Managing Effects

- **View all effects**: Added effects appear in a list below the editor
- **Remove effects**: Click the trash icon next to any effect
- **Edit position**: Click on the canvas to change emission point before adding

### Effect Options

#### Duration
Controls how long the particle emitter stays active:
- **Short (0.1-1s)**: Quick burst effects (explosions, fireworks)
- **Medium (1-3s)**: Standard effects (confetti, sparkles)
- **Long (3-10s)**: Ambient effects (rain, snow, smoke)
- **Infinite (-1)**: Continuous effects

#### Rate
Controls how many particles are emitted per frame:
- **Low (1-5)**: Subtle effects, better performance
- **Medium (5-10)**: Standard particle density
- **High (10-20)**: Dense particle clouds

#### Max Particles
Maximum number of particles that can exist simultaneously:
- **Low (10-50)**: Minimal effects, best performance
- **Medium (50-100)**: Standard particle count
- **High (100-200)**: Dense, dramatic effects

#### Color
For single-color effects (explosion, sparkles, smoke, magic, rain, snow, hearts):
- Use the color picker or enter a hex code
- Some effects (confetti, firework) use multiple colors automatically

## Technical Implementation

### Particle Engine

The particle engine (`particleEngine.js`) provides:

**Particle Class:**
- Position, velocity, acceleration
- Life span and decay
- Size, color, opacity
- Rotation and rotation speed
- Shape (circle, square, triangle, star)

**ParticleEmitter Class:**
- Continuous or burst emission
- Configurable spread angle and speed
- Duration control
- Position updates

**ParticleSystem Class:**
- Canvas-based rendering
- Multiple emitter management
- Animation loop
- Automatic cleanup

### Particle Presets

Pre-configured effects (`particlePresets.js`) include:

```javascript
import { PARTICLE_PRESETS } from '../utils/particlePresets';

// Create a confetti effect at position (400, 300)
const confetti = PARTICLE_PRESETS.confetti(400, 300, {
  duration: 3,
  rate: 5,
  maxParticles: 100
});

// Create a sparkles effect with custom color
const sparkles = PARTICLE_PRESETS.sparkles(400, 300, {
  duration: 2,
  color: '#FFD700'
});
```

### React Components

**ParticleSystem Component:**
```jsx
<ParticleSystem
  effects={[
    { type: 'confetti', x: 400, y: 300, options: { duration: 3 } },
    { type: 'sparkles', x: 500, y: 200, options: { duration: 2 } }
  ]}
  width={800}
  height={600}
  autoStart={true}
/>
```

**ParticleEditor Component:**
```jsx
<ParticleEditor
  layer={currentLayer}
  onLayerUpdate={(updatedLayer) => {
    // Handle layer update
  }}
  canvasWidth={800}
  canvasHeight={600}
/>
```

## Data Structure

Effects are stored in the layer configuration:

```javascript
{
  id: 'layer-1',
  name: 'My Layer',
  particleEffects: [
    {
      id: 'effect-1',
      type: 'confetti',
      x: 400,
      y: 300,
      options: {
        duration: 3,
        rate: 5,
        maxParticles: 100,
        color: '#FF6B6B'
      },
      timestamp: 0 // When to trigger in timeline
    }
  ]
}
```

## Performance Considerations

### Optimization Tips

1. **Limit Particle Count**: Keep maxParticles under 100 for smooth performance
2. **Use Appropriate Duration**: Shorter durations = better performance
3. **Reduce Emission Rate**: Lower rates use fewer resources
4. **Cleanup**: Effects automatically clean up when complete
5. **Canvas Size**: Smaller canvases render faster

### Best Practices

- Use **burst effects** (explosion, firework) sparingly
- **Continuous effects** (rain, snow) should have lower rates
- **Test on target devices** before finalizing
- **Combine multiple small effects** rather than one large effect
- **Use appropriate effect types** for the scene

## Use Cases

### Celebrations
- **Confetti** for achievements, victories
- **Fireworks** for grand finales
- **Sparkles** for magical moments

### Atmosphere
- **Rain** for weather scenes
- **Snow** for winter scenes
- **Smoke** for transitions, reveals

### Emphasis
- **Explosion** for impact moments
- **Magic** for special features
- **Hearts** for positive feedback

### Transitions
- **Smoke** for fade effects
- **Sparkles** for scene changes
- **Explosion** for dramatic reveals

## Examples

### Simple Confetti Celebration
```javascript
{
  type: 'confetti',
  x: 400,
  y: 100,
  options: {
    duration: 3,
    rate: 5,
    maxParticles: 100
  }
}
```

### Magical Sparkle Trail
```javascript
{
  type: 'magic',
  x: 300,
  y: 400,
  options: {
    duration: 2,
    rate: 4,
    maxParticles: 60,
    color: '#9B59B6'
  }
}
```

### Dramatic Explosion
```javascript
{
  type: 'explosion',
  x: 400,
  y: 300,
  options: {
    duration: 0.1,
    maxParticles: 50,
    color: '#FF6B6B'
  }
}
```

## Timeline Integration

Particle effects integrate with the timeline system:

1. **Timestamp**: Set when the effect triggers
2. **Duration**: How long the effect lasts
3. **Sync**: Effects can be synchronized with other animations
4. **Sequencing**: Multiple effects can be chained

## Future Enhancements

Planned features for future releases:

- Custom particle shapes from images
- Particle collision detection
- Force fields (wind, gravity zones)
- Particle trails and ribbons
- 3D particle effects
- Particle-to-particle interactions
- Advanced physics (bounce, friction)
- GPU-accelerated rendering

## Troubleshooting

### Effects not appearing
- Check that canvas dimensions are correct
- Verify effect position is within canvas bounds
- Ensure autoStart is true or manually start the system

### Poor performance
- Reduce maxParticles count
- Lower emission rate
- Shorten duration
- Reduce canvas size

### Effects end too quickly
- Increase duration parameter
- Increase particle life in presets
- Reduce decay rate

## API Reference

### ParticleEngine

```javascript
import { ParticleSystem } from '../utils/particleEngine';

const system = new ParticleSystem();
system.init(canvas);
system.start();
system.stop();
system.clear();
system.destroy();
```

### PARTICLE_PRESETS

```javascript
import { PARTICLE_PRESETS } from '../utils/particlePresets';

const emitter = PARTICLE_PRESETS.confetti(x, y, options);
```

Available presets:
- `confetti(x, y, options)`
- `sparkles(x, y, options)`
- `explosion(x, y, options)`
- `smoke(x, y, options)`
- `magic(x, y, options)`
- `firework(x, y, options)`
- `rain(x, y, options)`
- `snow(x, y, options)`
- `hearts(x, y, options)`

---

**Created**: October 2025  
**Version**: 1.0.0  
**Status**: Production Ready
