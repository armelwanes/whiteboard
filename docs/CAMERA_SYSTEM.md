# Camera System Documentation

## Overview

The camera system in whiteboard-anim provides advanced camera controls for creating professional whiteboard animations with dynamic camera movements, zoom effects, and smooth transitions.

## Features

### Scene-Level Camera Sequences
- **Multiple Cameras**: Define multiple camera views per scene
- **Smooth Transitions**: Configurable transition durations with easing functions
- **Position Control**: Normalized coordinates (0.0-1.0) for precise positioning
- **Zoom Control**: Zoom levels from 0.1x to 5.0x
- **Duration Control**: Set hold time for each camera position

### Layer-Level Camera
- **Per-Layer Camera**: Independent camera settings for each layer
- **Static Position**: Focus on specific parts of a layer

### Layer-Level Animations
- **Post-Drawing Effects**: Animations that play after layer drawing
- **Zoom In/Out**: Smooth zoom transitions with configurable parameters
- **Focus Control**: Define the focal point for zoom animations

## Usage Guide

### Adding Scene Cameras

1. Open the **Layer Editor** (click "Éditer" button)
2. Scroll to the **"Séquence de Caméras"** section
3. Click **"Ajouter"** to add a new camera
4. Configure camera properties:
   - **Zoom**: Adjust zoom level (1.0 = normal view)
   - **Position X/Y**: Set camera focus point (0.5, 0.5 = center)
   - **Duration**: How long to hold this camera view (seconds)
   - **Transition Duration**: Time to transition from previous camera
   - **Easing**: Choose transition smoothness

5. Add more cameras to create a sequence
6. Cameras execute sequentially in order
7. Use arrow buttons to reorder cameras
8. Click **"Enregistrer"** to save

### Adding Layer Camera

1. Open the **Layer Editor** and select a layer
2. Scroll to the **"Caméra"** section (below layer properties)
3. The section will show "Aucune caméra configurée"
4. Click anywhere in the section to expand and add camera settings
5. Configure:
   - **Zoom**: Layer-specific zoom level
   - **Position**: Focus point on the layer
6. Click **"Enregistrer"** to save

### Adding Layer Animations

1. Open the **Layer Editor** and select a layer
2. Scroll to the **"Animation Post-Dessin"** section
3. Click **"Ajouter"** to create an animation
4. Configure animation:
   - **Type**: Choose "Zoom In" or "Zoom Out"
   - **Duration**: Animation length in seconds
   - **Zoom Initial/Final**: Start and end zoom values
   - **Point de Focus**: Where to focus during zoom
5. Click **"Enregistrer"** to save

## Position System

The camera system uses **normalized coordinates** where:
- **X axis**: 0.0 = left edge, 0.5 = center, 1.0 = right edge
- **Y axis**: 0.0 = top edge, 0.5 = center, 1.0 = bottom edge

Common positions:
- Center: `{x: 0.5, y: 0.5}`
- Top-left: `{x: 0.3, y: 0.25}`
- Bottom-right: `{x: 0.7, y: 0.75}`

## Easing Functions

Choose the right easing for natural camera movement:

| Easing | Description | Best For |
|--------|-------------|----------|
| **Linear** | Constant speed | Simple pans |
| **Ease In** | Slow start, fast end | Dramatic reveal |
| **Ease Out** ⭐ | Fast start, slow end | Natural camera motion (recommended) |
| **Ease In Out** | Slow start and end | Smooth back-and-forth |
| **Ease In Cubic** | Very slow start | Dramatic effect |
| **Ease Out Cubic** | Very slow end | Smooth stop |

## Best Practices

### Scene Camera Sequences

1. **Start with Overview**: Begin with zoom 1.0 to show full scene
2. **Limit Camera Count**: Use 3-5 cameras per scene for best results
3. **Use Smooth Transitions**: 1-2 second transitions work well
4. **Natural Easing**: "Ease Out" provides the most natural feel
5. **Test Positions**: Use center (0.5, 0.5) as reference point

### Layer Cameras

1. **High-Res Images**: Use high-resolution images when zooming in
2. **Consistent Zoom**: Keep zoom levels reasonable (1.5x-2.5x typically)
3. **Focus Points**: Choose meaningful focal points for viewers

### Layer Animations

1. **Subtle Zooms**: Keep zoom changes subtle (1.0x to 1.5x-2.0x)
2. **Appropriate Duration**: 1.5-3 seconds for most zoom animations
3. **Purpose-Driven**: Use animations to emphasize important content

## Examples

### Example 1: Simple Scene with Camera Sequence

```javascript
{
  "id": "scene-1",
  "title": "Introduction",
  "duration": 10,
  "cameras": [
    {
      "zoom": 1.0,
      "position": {"x": 0.5, "y": 0.5},
      "duration": 3.0
    },
    {
      "zoom": 2.0,
      "position": {"x": 0.7, "y": 0.3},
      "duration": 3.0,
      "transition_duration": 1.5,
      "easing": "ease_out"
    }
  ]
}
```

### Example 2: Layer with Camera and Animation

```javascript
{
  "id": "layer-1",
  "image_path": "diagram.png",
  "camera": {
    "zoom": 1.5,
    "position": {"x": 0.5, "y": 0.5}
  },
  "animation": {
    "type": "zoom_in",
    "duration": 2.0,
    "start_zoom": 1.0,
    "end_zoom": 1.5,
    "focus_position": {"x": 0.6, "y": 0.4}
  }
}
```

## Troubleshooting

### Camera not visible
- Check if zoom level is appropriate (not too high/low)
- Verify position coordinates are between 0.0 and 1.0
- Ensure duration values are positive numbers

### Jerky transitions
- Increase transition duration for smoother movement
- Try "ease_out" easing function
- Reduce zoom difference between cameras

### Animation not playing
- Verify animation type is set correctly
- Check that duration is > 0
- Ensure layer is selected when saving

## Technical Reference

For developers integrating with the camera system:

### Camera Object Structure
```javascript
{
  zoom: 1.0,              // float, 0.1-10
  position: {
    x: 0.5,              // float, 0.0-1.0
    y: 0.5               // float, 0.0-1.0
  },
  duration: 2.0,         // float, seconds
  transition_duration: 1.0, // float, seconds
  easing: "ease_out"     // string, easing function name
}
```

### Animation Object Structure
```javascript
{
  type: "zoom_in",       // "zoom_in" | "zoom_out"
  duration: 2.0,         // float, seconds
  start_zoom: 1.0,       // float, 0.1-10
  end_zoom: 2.0,         // float, 0.1-10
  focus_position: {
    x: 0.5,              // float, 0.0-1.0
    y: 0.5               // float, 0.0-1.0
  }
}
```

### Available Utilities

```javascript
import { easingFunctions, interpolate } from './utils/easingFunctions';
import { 
  getCameraAtTime, 
  createCamera, 
  validateCamera 
} from './utils/cameraAnimator';
```

## Future Enhancements

Potential future features:
- Pan animations (horizontal/vertical camera movement)
- Rotation support
- Camera presets for common patterns
- Preview of camera path in timeline
- Keyframe-based camera animation
- Camera shake effects

---

For more information, see the main [README.md](./README.md) or the implementation in `src/components/CameraControls.jsx`.
