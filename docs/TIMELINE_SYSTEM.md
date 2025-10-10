# Timeline and Synchronization System

## Overview

The Timeline System provides professional-grade animation control for the whiteboard animator application. It implements a keyframe-based animation system with support for property tracks, markers, sync points, and advanced interpolation.

## Architecture

### Core Components

1. **Timeline Utility** (`src/utils/timelineSystem.js`)
   - Keyframe management
   - Property track system
   - Interpolation engine
   - Time markers and sync points
   - Loop segments and time remapping

2. **Timeline UI Component** (`src/components/Timeline.jsx`)
   - Visual timeline interface
   - Playback controls
   - Marker management
   - Property track visualization

3. **Animation Container** (`src/components/AnimationContainer.jsx`)
   - Integrates timeline with scene playback
   - Manages global timeline state
   - Coordinates animation loop

## Features

### 1. Global Timeline ✅

The timeline spans across all scenes/slides with:
- Configurable duration based on total scene duration
- 30 FPS frame rate (configurable)
- Unified time management
- Automatic duration updates when scenes change

**Usage:**
```javascript
import { createTimeline } from '../utils/timelineSystem';

const timeline = createTimeline(30.0, 30); // 30 seconds, 30 FPS
```

### 2. Keyframe System ✅

Universal keyframe-based animation system with:
- Property path-based addressing (e.g., `layer.0.opacity`, `camera.zoom`)
- Automatic interpolation between keyframes
- Support for any animatable property
- Time-sorted keyframe arrays

**Usage:**
```javascript
import { createKeyframe, createPropertyTrack } from '../utils/timelineSystem';

const keyframes = [
  createKeyframe(0, 0, 'linear'),      // time: 0s, value: 0
  createKeyframe(2, 1, 'ease_in_out'), // time: 2s, value: 1
  createKeyframe(5, 0, 'ease_out'),    // time: 5s, value: 0
];

const track = createPropertyTrack(keyframes);
```

### 3. Time Markers ✅

Visual markers for timeline navigation with:
- Custom labels and colors
- Metadata support
- Add/delete functionality
- Hover tooltips showing marker info

**Usage:**
```javascript
import { createTimeMarker } from '../utils/timelineSystem';

const marker = createTimeMarker(5.0, 'Important moment', '#ffcc00', {
  description: 'Key animation point'
});
```

### 4. Sync Points ✅

Synchronization between multiple elements:
- Element ID-based tracking
- Precise animation coordination
- Label and metadata support
- Time tolerance for matching

**Usage:**
```javascript
import { createSyncPoint } from '../utils/timelineSystem';

const sync = createSyncPoint(
  3.0,                           // time in seconds
  ['layer-1', 'layer-2', 'cam'], // element IDs to sync
  'All elements visible',        // label
  { type: 'visibility' }         // metadata
);
```

### 5. Animation Curves ✅

8 interpolation types for smooth animations:

| Type | Formula | Use Case |
|------|---------|----------|
| `linear` | `t` | Constant speed |
| `ease_in` | `t²` | Slow start |
| `ease_out` | `t(2-t)` | Slow end |
| `ease_in_out` | Custom quadratic | Slow both ends |
| `ease_in_cubic` | `t³` | Very slow start |
| `ease_out_cubic` | `(t-1)³+1` | Very slow end |
| `step` | No interpolation | Instant change |
| `bezier` | Custom curve | Full control |

**Usage:**
```javascript
import { applyEasing, InterpolationType } from '../utils/timelineSystem';

const progress = 0.5; // 50% through animation
const eased = applyEasing(progress, InterpolationType.EASE_IN_OUT);
// eased ≈ 0.5 (smooth transition at midpoint)
```

### 6. Time Remapping ✅

Speed up or slow down time segments:
- Configurable speed multipliers
- Slow motion effects (0.5x, 0.25x)
- Fast forward effects (2x, 4x)
- Smooth speed transitions with easing

**Usage:**
```javascript
import { createTimeRemapping } from '../utils/timelineSystem';

const slowMo = createTimeRemapping(
  5.0,  // start time
  10.0, // end time
  0.5,  // 0.5x speed (slow motion)
  'ease_in_out'
);
```

### 7. Loop Segments ✅

Repeat portions of animation seamlessly:
- Configurable loop count
- Start/end time definition
- Seamless looping
- Label support

**Usage:**
```javascript
import { createLoopSegment } from '../utils/timelineSystem';

const loop = createLoopSegment(
  2.0,  // start time
  5.0,  // end time
  3,    // loop 3 times
  'Repeat intro'
);
```

## Property Track System

### Property Paths

Property paths use dot notation to address any animatable property:

- **Layer properties:**
  - `layer.0.opacity` - Layer 0 opacity (0-1)
  - `layer.0.position` - Layer 0 position {x, y}
  - `layer.0.scale` - Layer 0 scale factor
  - `layer.0.rotation` - Layer 0 rotation (degrees)

- **Camera properties:**
  - `camera.zoom` - Camera zoom level
  - `camera.position` - Camera position {x, y}
  - `camera.rotation` - Camera rotation

- **Text properties:**
  - `text.0.color` - Text color [r, g, b]
  - `text.0.fontSize` - Text font size
  - `text.0.opacity` - Text opacity

### Value Interpolation

The system automatically interpolates between different value types:

**Numbers:**
```javascript
interpolateValue(0, 100, 0.5) // => 50
```

**Positions/Arrays:**
```javascript
interpolateValue([0, 0], [100, 200], 0.5) // => [50, 100]
```

**Objects:**
```javascript
interpolateValue(
  { x: 0, y: 0 },
  { x: 100, y: 200 },
  0.5
) // => { x: 50, y: 100 }
```

**Other types:** Switch at 50% progress
```javascript
interpolateValue('fade', 'slide', 0.3) // => 'fade'
interpolateValue('fade', 'slide', 0.7) // => 'slide'
```

## Timeline UI Features

### Playback Controls

- **Skip to Start:** Jump to beginning (0:00.0)
- **Play/Pause:** Toggle animation playback
- **Skip to End:** Jump to end of timeline
- **Time Display:** Shows current time / total duration with millisecond precision

### Visual Elements

1. **Playhead:** Red vertical line with circles at top/bottom
2. **Progress Fill:** Blue semi-transparent fill showing elapsed time
3. **Scene Markers:** Vertical lines dividing scenes with labels
4. **Time Markers:** Colored vertical bars with hover tooltips
5. **Keyframes:** Purple dots showing keyframe positions (when enabled)
6. **Time Scale:** Shows time values at 0%, 25%, 50%, 75%, 100%

### Interactive Features

- **Seek:** Click anywhere on timeline to jump to that time
- **Add Marker:** Green plus button adds marker at current time
- **Delete Marker:** Trash icon in marker tooltip
- **Toggle Views:** Enable/disable keyframes and markers display

## Integration Guide

### Adding Timeline to a Component

```javascript
import { createTimeline, addPropertyTrack, createPropertyTrack, createKeyframe } from '../utils/timelineSystem';

// Create timeline
const timeline = createTimeline(30.0, 30);

// Add property track with keyframes
const opacityTrack = createPropertyTrack([
  createKeyframe(0, 0, 'ease_in'),
  createKeyframe(2, 1, 'linear'),
  createKeyframe(5, 0, 'ease_out'),
]);

addPropertyTrack(timeline, 'layer.0.opacity', opacityTrack);
```

### Getting Property Values at Runtime

```javascript
import { getTimelineValue } from '../utils/timelineSystem';

// During animation loop
const currentOpacity = getTimelineValue(timeline, 'layer.0.opacity', currentTime);
// Apply to layer: layer.opacity = currentOpacity;
```

### Export/Import Timeline

```javascript
import { exportTimelineToJSON, importTimelineFromJSON } from '../utils/timelineSystem';

// Export
const jsonString = exportTimelineToJSON(timeline);
localStorage.setItem('timeline', jsonString);

// Import
const savedJson = localStorage.getItem('timeline');
const timeline = importTimelineFromJSON(savedJson);
```

## JSON Configuration Format

### Complete Example

```json
{
  "duration": 30.0,
  "frameRate": 30,
  "propertyTracks": {
    "layer.0.opacity": {
      "keyframes": [
        {
          "time": 0,
          "value": 0,
          "interpolation": "ease_in",
          "bezierHandles": null
        },
        {
          "time": 2.0,
          "value": 1.0,
          "interpolation": "linear",
          "bezierHandles": null
        }
      ]
    },
    "camera.zoom": {
      "keyframes": [
        {
          "time": 0,
          "value": 1.0,
          "interpolation": "ease_in_out",
          "bezierHandles": null
        },
        {
          "time": 5.0,
          "value": 2.0,
          "interpolation": "bezier",
          "bezierHandles": [0.42, 0.0, 0.58, 1.0]
        }
      ]
    }
  },
  "markers": [
    {
      "time": 5.0,
      "label": "Key moment",
      "color": "#ffcc00",
      "metadata": {}
    }
  ],
  "syncPoints": [
    {
      "time": 3.0,
      "elementIds": ["layer-1", "layer-2"],
      "label": "Sync layers",
      "metadata": { "type": "visibility" }
    }
  ],
  "loopSegments": [
    {
      "startTime": 2.0,
      "endTime": 5.0,
      "loopCount": 3,
      "label": "Loop intro"
    }
  ],
  "timeRemappings": [
    {
      "startTime": 10.0,
      "endTime": 15.0,
      "speedMultiplier": 0.5,
      "easing": "ease_in_out"
    }
  ]
}
```

## API Reference

### Core Functions

#### `createTimeline(duration, frameRate)`
Creates a new timeline object.

**Parameters:**
- `duration` (number): Total duration in seconds
- `frameRate` (number): Frame rate (default: 30 FPS)

**Returns:** Timeline object

---

#### `createKeyframe(time, value, interpolation, bezierHandles)`
Creates a keyframe.

**Parameters:**
- `time` (number): Time in seconds
- `value` (any): Keyframe value
- `interpolation` (string): Interpolation type
- `bezierHandles` (array): Optional bezier control points

**Returns:** Keyframe object

---

#### `getTimelineValue(timeline, propertyPath, time)`
Gets animated property value at specific time.

**Parameters:**
- `timeline` (object): Timeline object
- `propertyPath` (string): Property path (e.g., "layer.0.opacity")
- `time` (number): Current time in seconds

**Returns:** Interpolated value

---

## Performance Considerations

- **Frame Rate:** 30 FPS provides smooth animation with good performance
- **Keyframe Count:** System handles hundreds of keyframes efficiently
- **Property Tracks:** No practical limit on number of tracks
- **Interpolation:** Optimized math operations for real-time animation

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support

## Future Enhancements

Potential improvements for future releases:

1. **Visual Keyframe Editor:** Drag and drop keyframes on timeline
2. **Curve Editor:** Visual bezier curve editor
3. **Property Inspector:** Real-time property value display
4. **Timeline Layers:** Group related property tracks
5. **Animation Presets:** Pre-built animation curves
6. **Timeline Zoom:** Zoom in/out for precise editing
7. **Copy/Paste Keyframes:** Duplicate animation segments
8. **Undo/Redo:** Timeline editing history
9. **Audio Sync:** Sync animations with audio tracks
10. **Export Formats:** Export to various animation formats

## Examples

### Example 1: Fade In Animation

```javascript
const fadeInTrack = createPropertyTrack([
  createKeyframe(0, 0, 'ease_in'),
  createKeyframe(1, 1, 'linear'),
]);

addPropertyTrack(timeline, 'layer.0.opacity', fadeInTrack);
```

### Example 2: Camera Pan and Zoom

```javascript
const zoomTrack = createPropertyTrack([
  createKeyframe(0, 1.0, 'ease_in_out'),
  createKeyframe(3, 2.0, 'ease_out'),
]);

const panTrack = createPropertyTrack([
  createKeyframe(0, { x: 0, y: 0 }, 'ease_in_out'),
  createKeyframe(3, { x: 100, y: 50 }, 'ease_out'),
]);

addPropertyTrack(timeline, 'camera.zoom', zoomTrack);
addPropertyTrack(timeline, 'camera.position', panTrack);
```

### Example 3: Complex Multi-Layer Animation

```javascript
// Layer 1: Fade in and move
const layer1Opacity = createPropertyTrack([
  createKeyframe(0, 0, 'ease_in'),
  createKeyframe(1, 1, 'linear'),
]);

const layer1Position = createPropertyTrack([
  createKeyframe(0, { x: 0, y: 0 }, 'ease_out'),
  createKeyframe(2, { x: 200, y: 100 }, 'linear'),
]);

// Layer 2: Delayed fade in
const layer2Opacity = createPropertyTrack([
  createKeyframe(1, 0, 'ease_in'),
  createKeyframe(2, 1, 'linear'),
]);

addPropertyTrack(timeline, 'layer.0.opacity', layer1Opacity);
addPropertyTrack(timeline, 'layer.0.position', layer1Position);
addPropertyTrack(timeline, 'layer.1.opacity', layer2Opacity);

// Add sync point
const sync = createSyncPoint(2.0, ['layer-0', 'layer-1'], 'Both visible');
timeline.syncPoints.push(sync);
```

## Conclusion

The Timeline and Synchronization System provides a complete, professional-grade solution for animation control in the whiteboard animator. It's modular, extensible, and easy to integrate with existing or new components.

For questions or feature requests, please see the main project README or open an issue.
