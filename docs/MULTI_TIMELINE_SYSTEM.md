# Multi-Timeline System

> **⚠️ NOTE: This feature is currently not in use.**  
> The multi-timeline system has been removed from the active codebase. This documentation is kept for reference purposes only. The application now uses a simple timeline with audio configuration at the scene level (background music) and layer level (narration, sound effects, etc.).

## Overview

The Multi-Timeline System provides parallel synchronized timelines for each scene, enabling professional-grade animation editing similar to VideoScribe or After Effects.

## Architecture

### Core Components

1. **Multi-Timeline Utility** (`src/utils/multiTimelineSystem.js`)
   - Timeline element management
   - Track creation and manipulation
   - Element overlap detection
   - Grid snapping
   - Export/import functionality

2. **Multi-Timeline UI Component** (`src/components/MultiTimeline.jsx`)
   - Visual timeline interface with parallel tracks
   - Interactive element editing (drag, resize, delete)
   - Track controls (enable/disable, lock/unlock)
   - Add element menu with type-specific options
   - Synchronized playhead across all tracks

3. **Integration** (`src/components/AnimationContainer.jsx`)
   - Per-scene multi-timeline management
   - Scene-local time calculation
   - Timeline synchronization with global playback

## Features

### 1. Four Parallel Tracks ✅

Each scene has four synchronized timeline tracks:

- **🖼️ Visuel (Visual)** - Images, text, SVG objects
- **🎵 Audio** - Music, narration, sound effects
- **🎥 Caméra (Camera)** - Pan, zoom, rotation movements
- **✨ Effets (FX)** - Fade, blur, transitions

**Usage:**
```javascript
import { createMultiTimeline } from '../utils/multiTimelineSystem';

const multiTimeline = createMultiTimeline(5.0); // 5 second scene
```

### 2. Timeline Elements ✅

Elements represent content or actions on the timeline:

- **Start time** - When the element begins
- **Duration** - How long it lasts
- **Type** - Element category (image, audio, pan, fade, etc.)
- **Data** - Element-specific configuration
- **Label** - Display name

**Usage:**
```javascript
import { createTimelineElement, addElementToTrack } from '../utils/multiTimelineSystem';

const element = createTimelineElement(
  1.0,      // startTime in seconds
  2.0,      // duration in seconds
  'image',  // type
  { src: 'path/to/image.png' }, // data
  'My Image' // label
);

const updatedTrack = addElementToTrack(track, element);
```

### 3. Interactive Editing ✅

**Drag Elements:**
- Click and drag elements horizontally to change start time
- Snaps to 0.1s grid by default
- Constrained to track bounds

**Resize Elements:**
- Drag left edge to adjust start time and duration
- Drag right edge to adjust duration only
- Minimum duration: 0.1s
- Snaps to grid

**Delete Elements:**
- Select element (click to highlight)
- Click trash icon in header
- Or use keyboard shortcut (future enhancement)

**Add Elements:**
1. Click on empty track area
2. Menu appears at click position
3. Select element type from menu
4. Element created with 1s default duration

### 4. Track Controls ✅

Each track has independent controls:

**Enable/Disable:**
- Eye icon toggles track visibility
- Blue = enabled, Gray = disabled
- Disabled tracks don't render elements

**Lock/Unlock:**
- Lock icon prevents editing
- Red = locked, Gray = unlocked
- Locked tracks can't be modified

### 5. Time Synchronization ✅

All tracks share the same time axis:

- Unified playhead across all tracks
- Time scale shows 0.5s intervals
- Synchronized with global timeline
- Scene-local time calculation

### 6. Grid Snapping ✅

Elements snap to time grid:

```javascript
import { snapToGrid } from '../utils/multiTimelineSystem';

const snappedTime = snapToGrid(1.37, 0.1); // => 1.4
```

Default grid: 0.1 seconds (configurable)

### 7. Overlap Detection ✅

Detect element conflicts:

```javascript
import { checkElementOverlap } from '../utils/multiTimelineSystem';

const hasOverlap = checkElementOverlap(
  track,
  startTime,
  duration,
  excludeId // optional: exclude specific element from check
);
```

## Track Types and Elements

### Visual Track

Element types:
- `image` - Static images
- `text` - Text overlays
- `svg` - Vector graphics

### Audio Track

Element types:
- `music` - Background music
- `narration` - Voice-over
- `sfx` - Sound effects

### Camera Track

Element types:
- `pan` - Camera movement
- `zoom` - Zoom in/out
- `rotate` - Camera rotation

### FX Track

Element types:
- `fade` - Fade in/out effects
- `blur` - Blur filter
- `transition` - Scene transitions

## Data Structure

### Multi-Timeline Format

```javascript
{
  duration: 5.0,
  tracks: {
    visual: {
      id: 'track-...',
      type: 'visual',
      name: 'Visuel',
      elements: [...],
      enabled: true,
      locked: false,
      height: 60
    },
    audio: { ... },
    camera: { ... },
    fx: { ... }
  },
  syncMarkers: []
}
```

### Timeline Element Format

```javascript
{
  id: 'element-...',
  startTime: 1.0,
  duration: 2.0,
  type: 'image',
  data: { src: 'path.png' },
  label: 'My Image'
}
```

### Track Format

```javascript
{
  id: 'track-...',
  type: 'visual',
  name: 'Visuel',
  elements: [element1, element2, ...],
  enabled: true,
  locked: false,
  height: 60
}
```

## Integration Guide

### Scene Initialization

Scenes automatically include multi-timeline:

```javascript
import { createMultiTimeline } from '../utils/multiTimelineSystem';

const scene = {
  id: 'scene-1',
  title: 'My Scene',
  duration: 5,
  multiTimeline: createMultiTimeline(5)
};
```

### Accessing Active Elements

Get elements active at current time:

```javascript
import { getActiveElements } from '../utils/multiTimelineSystem';

const activeElements = getActiveElements(multiTimeline, currentTime);
// Returns: { visual: [...], audio: [...], camera: [...], fx: [...] }
```

### Export/Import

Save and load multi-timelines:

```javascript
import { 
  exportMultiTimelineToJSON, 
  importMultiTimelineFromJSON 
} from '../utils/multiTimelineSystem';

// Export
const json = exportMultiTimelineToJSON(multiTimeline);
localStorage.setItem('timeline', json);

// Import
const saved = localStorage.getItem('timeline');
const timeline = importMultiTimelineFromJSON(saved);
```

## UI Components

### MultiTimeline Component

Display and edit multi-timeline:

```jsx
<MultiTimeline
  multiTimeline={scene.multiTimeline}
  currentTime={sceneLocalTime}
  onUpdateMultiTimeline={(updated) => {
    // Handle timeline update
    updateScene(sceneIndex, { multiTimeline: updated });
  }}
  isPlaying={false}
/>
```

Props:
- `multiTimeline` - Multi-timeline object
- `currentTime` - Current playback time (scene-local)
- `onUpdateMultiTimeline` - Callback for timeline changes
- `isPlaying` - Whether animation is playing (disables editing)

### Visual Elements

**Time Scale:**
- Shows time markers at regular intervals
- Format: MM:SS.D (minutes:seconds.decisecond)

**Playhead:**
- Red vertical line with circles
- Synchronized across all tracks
- Positioned by percentage of duration

**Track Headers:**
- Icon showing track type
- Track name
- Enable/disable button (eye icon)
- Lock/unlock button (lock icon)

**Track Timeline:**
- Clickable area to add elements
- Grid lines for visual reference
- Semi-transparent background

**Elements:**
- Colored blocks (blue/green/purple/orange by track)
- Label showing element name
- Resize handles on left/right when selected
- White border when selected

**Add Menu:**
- Context menu at click position
- Type-specific element options
- Click outside to close

## Keyboard Shortcuts (Future)

Planned keyboard shortcuts:
- `Space` - Play/pause
- `Delete` - Delete selected element
- `Ctrl+D` - Duplicate element
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- Arrow keys - Move selected element
- `Shift+Drag` - Disable grid snapping

## Performance Considerations

- Timeline updates are optimized with React hooks
- Element rendering uses CSS transforms for smooth animations
- Grid snapping reduces layout recalculations
- Track height is configurable for display density

## Future Enhancements

Potential improvements:

1. **Multi-select** - Select multiple elements at once
2. **Copy/Paste** - Duplicate elements across tracks
3. **Undo/Redo** - Timeline editing history
4. **Zoom** - Zoom in/out on timeline for precision
5. **Ripple Edit** - Move multiple elements together
6. **Audio Waveforms** - Visual audio representation
7. **Keyframe Editor** - Advanced element property animation
8. **Templates** - Pre-built timeline templates
9. **Track Groups** - Organize related tracks
10. **Element Properties Panel** - Edit element details

## Examples

### Example 1: Add Visual Element

```javascript
const element = createTimelineElement(
  0.5,      // Start at 0.5s
  2.0,      // Duration 2s
  'image',
  { src: '/logo.png', scale: 1.5 },
  'Company Logo'
);

const track = multiTimeline.tracks.visual;
const updated = addElementToTrack(track, element);
```

### Example 2: Camera Pan Sequence

```javascript
const pan1 = createTimelineElement(0, 1, 'pan', 
  { from: {x: 0, y: 0}, to: {x: 100, y: 0} }, 'Pan Right');
const pan2 = createTimelineElement(1, 1, 'pan',
  { from: {x: 100, y: 0}, to: {x: 100, y: 100} }, 'Pan Down');

let track = multiTimeline.tracks.camera;
track = addElementToTrack(track, pan1);
track = addElementToTrack(track, pan2);
```

### Example 3: Audio Sync

```javascript
const music = createTimelineElement(0, 5, 'music',
  { src: '/background.mp3', volume: 0.7 }, 'Background Music');
const narration = createTimelineElement(1, 3, 'narration',
  { src: '/voiceover.mp3', volume: 1.0 }, 'Voice Over');

let track = multiTimeline.tracks.audio;
track = addElementToTrack(track, music);
track = addElementToTrack(track, narration);
```

### Example 4: Fade Transition

```javascript
const fadeOut = createTimelineElement(4, 1, 'fade',
  { from: 1.0, to: 0.0, type: 'opacity' }, 'Fade Out');

const track = multiTimeline.tracks.fx;
const updated = addElementToTrack(track, fadeOut);
```

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Touch support

## API Reference

See `src/utils/multiTimelineSystem.js` for complete API documentation.

Key functions:
- `createMultiTimeline(duration)` - Create new multi-timeline
- `createTrack(type, name, elements)` - Create track
- `createTimelineElement(startTime, duration, type, data, label)` - Create element
- `addElementToTrack(track, element)` - Add element to track
- `updateElementInTrack(track, elementId, updates)` - Update element
- `deleteElementFromTrack(track, elementId)` - Remove element
- `getActiveElements(multiTimeline, time)` - Get elements at time
- `checkElementOverlap(track, startTime, duration, excludeId)` - Check for overlaps
- `snapToGrid(time, gridSize)` - Snap time to grid

## Conclusion

The Multi-Timeline System provides professional animation editing capabilities with intuitive drag-and-drop interaction, synchronized parallel tracks, and flexible element management. It's designed to be extensible and easy to integrate with scene-based animation workflows.

For questions or feature requests, please see the main project README or open an issue.
