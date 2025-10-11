# Multi-Timeline System - Quick Start Guide

> **⚠️ NOTE: This feature is currently not in use.**  
> The multi-timeline system has been removed from the active codebase. This documentation is kept for reference purposes only. The application now uses a simple timeline with audio configuration at the scene level (background music) and layer level (narration, sound effects, etc.).

## 🚀 Getting Started

The multi-timeline system allows you to create complex animations with synchronized parallel tracks for visual elements, audio, camera movements, and effects.

### Basic Usage

1. **View the Multi-Timeline**
   - The multi-timeline appears below the global timeline
   - Shows current scene name and duration
   - Can be hidden/shown with toggle button

2. **Track Types**
   - **Visuel (Blue)** - Images, text, SVG objects
   - **Audio (Green)** - Music, narration, sound effects
   - **Caméra (Purple)** - Pan, zoom, rotation movements
   - **Effets (Orange)** - Fade, blur, transitions

### Adding Elements

1. Click on any track at desired time position
2. Select element type from menu
3. Element appears with 1s default duration
4. Drag to reposition, resize handles to adjust duration

### Editing Elements

- **Move**: Click and drag element horizontally
- **Resize**: Drag left or right edge
- **Select**: Click to highlight (white border)
- **Delete**: Select element, then click trash icon in header

### Track Controls

- **Eye Icon**: Enable/disable track visibility
- **Lock Icon**: Lock/unlock track editing

## 📝 Examples

### Example 1: Simple Image Animation

```javascript
// Add image at 0.5s for 2 seconds
const element = createTimelineElement(
  0.5,      // Start time
  2.0,      // Duration
  'image',  // Type
  { src: '/path/to/image.png' },
  'My Image'
);
```

### Example 2: Audio Narration

```javascript
// Add voice-over from 1s to 4s
const narration = createTimelineElement(
  1.0,
  3.0,
  'narration',
  { src: '/audio/voiceover.mp3', volume: 1.0 },
  'Voice Over'
);
```

### Example 3: Camera Pan

```javascript
// Pan camera from left to right over 2 seconds
const pan = createTimelineElement(
  0.0,
  2.0,
  'pan',
  { from: { x: 0, y: 0 }, to: { x: 100, y: 0 } },
  'Pan Right'
);
```

### Example 4: Fade Effect

```javascript
// Fade out at end of scene
const fadeOut = createTimelineElement(
  4.5,
  0.5,
  'fade',
  { from: 1.0, to: 0.0 },
  'Fade Out'
);
```

## 🎯 Key Features

- ✅ **Drag & Drop** - Intuitive element positioning
- ✅ **Grid Snapping** - Automatic alignment to 0.1s grid
- ✅ **Track Locking** - Prevent accidental edits
- ✅ **Synchronized Playhead** - Real-time preview across all tracks
- ✅ **Type-Specific Menus** - Context-aware element creation
- ✅ **Visual Feedback** - Color-coded tracks and elements

## 🔧 Advanced Features

### Overlap Detection

Elements are checked for overlap when added/moved:
```javascript
const hasOverlap = checkElementOverlap(track, startTime, duration);
```

### Export/Import

Save timeline to JSON:
```javascript
const json = exportMultiTimelineToJSON(multiTimeline);
localStorage.setItem('timeline-' + sceneId, json);
```

Load timeline from JSON:
```javascript
const json = localStorage.getItem('timeline-' + sceneId);
const timeline = importMultiTimelineFromJSON(json);
```

### Active Elements

Get all elements active at specific time:
```javascript
const activeElements = getActiveElements(multiTimeline, currentTime);
// Returns: { visual: [...], audio: [...], camera: [...], fx: [...] }
```

## 📚 Documentation

For complete API reference and detailed documentation, see:
- `docs/MULTI_TIMELINE_SYSTEM.md` - Full documentation
- `src/utils/multiTimelineSystem.js` - Core utilities
- `src/components/MultiTimeline.jsx` - UI component

## 🐛 Troubleshooting

**Element won't drag:**
- Check if track is locked (lock icon should be gray)
- Make sure animation is not playing

**Can't add element:**
- Verify track is not locked
- Try clicking different position on track

**Element disappears:**
- Check track is enabled (eye icon should be blue)
- Verify element is within scene duration

## 🎨 Customization

### Changing Grid Size

Edit `snapToGrid` calls in `MultiTimeline.jsx`:
```javascript
const time = snapToGrid(pixelsToTime(x, rect.width), 0.05); // 0.05s grid
```

### Adjusting Track Height

Modify track height in `createTrack`:
```javascript
const track = createTrack(trackType, name, [], 80); // 80px height
```

### Custom Track Colors

Edit `TRACK_COLORS` in `MultiTimeline.jsx`:
```javascript
const TRACK_COLORS = {
  [TrackType.VISUAL]: 'bg-indigo-600',
  [TrackType.AUDIO]: 'bg-emerald-600',
  // ...
};
```

## 🤝 Contributing

To add new element types:

1. Add type to element creation menu in `MultiTimeline.jsx`
2. Implement element rendering logic
3. Update documentation with new type

## 📞 Support

For questions or issues:
- See full documentation in `docs/MULTI_TIMELINE_SYSTEM.md`
- Check existing GitHub issues
- Review code comments in source files

---

**Happy Animating! 🎬**
