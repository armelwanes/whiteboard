# Camera Export Examples

This document shows examples of the improved camera export behavior.

## Scenario 1: Default Camera Export

### Setup
```javascript
const scene = {
  id: 'scene-1',
  title: 'Test Scene',
  layers: [
    {
      id: 'layer-1',
      type: 'text',
      position: { x: 4800, y: 2700 },
      text_config: { text: 'Hello World', size: 48 }
    }
  ],
  sceneCameras: [
    {
      id: 'default-camera',
      name: 'Caméra Par Défaut',
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450,
      isDefault: true
    }
  ]
};
```

### Before (Old Behavior)
```javascript
const result = await exportDefaultCameraView(scene);
// Returns: string (data URL)
// Result: PNG image file downloaded
// File: scene-1-default-camera-2025-10-13.png
```

### After (New Behavior)
```javascript
const result = await exportDefaultCameraView(scene);
// Returns: object
{
  configOnly: true,
  imageDataUrl: null,
  config: {
    id: 'default-camera',
    name: 'Caméra Par Défaut',
    position: { x: 0.5, y: 0.5 },
    width: 800,
    height: 450,
    zoom: 1.0,
    isDefault: true
  }
}
// Result: JSON config file downloaded
// File: scene-1-default-camera-config-2025-10-13.json
```

**Why?** Default camera at (0.5, 0.5) doesn't need image - just config reference.

---

## Scenario 2: Custom Camera Export

### Setup
```javascript
const scene = {
  id: 'scene-1',
  title: 'Test Scene',
  layers: [
    {
      id: 'layer-1',
      type: 'image',
      image_path: 'data:image/png;base64,...',
      position: { x: 2880, y: 3780 },
      scale: 1.5
    }
  ],
  sceneCameras: [
    {
      id: 'camera-1',
      name: 'Camera 1',
      position: { x: 0.3, y: 0.7 },  // Custom position
      width: 800,
      height: 450,
      isDefault: false
    }
  ]
};
```

### Before & After (Same Behavior)
```javascript
const result = await exportDefaultCameraView(scene);
// Returns: object
{
  configOnly: false,
  imageDataUrl: 'data:image/png;base64,...'
}
// Result: PNG image file downloaded
// File: scene-1-camera-1-2025-10-13.png
```

**Why?** Custom camera position needs actual rendered image.

---

## Scenario 3: Export All Cameras (Mixed)

### Setup
```javascript
const scene = {
  id: 'scene-1',
  sceneCameras: [
    {
      id: 'default-camera',
      position: { x: 0.5, y: 0.5 },
      isDefault: true,
      name: 'Caméra Par Défaut'
    },
    {
      id: 'camera-1',
      position: { x: 0.3, y: 0.7 },
      isDefault: false,
      name: 'Camera 1'
    },
    {
      id: 'camera-2',
      position: { x: 0.8, y: 0.2 },
      isDefault: false,
      name: 'Camera 2'
    }
  ],
  layers: [/* ... */]
};
```

### Export Result
```javascript
const exports = await exportAllCameras(scene);
// Returns: array of 3 items

[
  {
    camera: { id: 'default-camera', ... },
    configOnly: true,
    imageDataUrl: null,
    config: { /* camera config */ }
  },
  {
    camera: { id: 'camera-1', ... },
    configOnly: false,
    imageDataUrl: 'data:image/png;base64,...'
  },
  {
    camera: { id: 'camera-2', ... },
    configOnly: false,
    imageDataUrl: 'data:image/png;base64,...'
  }
]
```

### Files Downloaded
1. `scene-1-Caméra Par Défaut-config-2025-10-13.json` (config only)
2. `scene-1-Camera 1-2025-10-13.png` (image)
3. `scene-1-Camera 2-2025-10-13.png` (image)

**Alert Message**: "3 caméra(s) exportée(s): 2 image(s), 1 config(s) JSON (caméras par défaut)"

---

## Scenario 4: Layer Centering Fix

### Before (Incorrect Centering)
```javascript
// Layer at position (4800, 2700)
// Image size: 200x200, scale: 1.0
const layerX = 4800 - cameraX;  // Top-left corner
const layerY = 2700 - cameraY;  // Top-left corner
ctx.drawImage(img, layerX, layerY, 200, 200);
```

**Problem**: Image positioned with top-left corner at layer position.

**Result**: ❌ Image appears off-center

```
  Layer Position (4800, 2700)
  ↓
  ┌─────────┐
  │  Image  │
  │         │
  └─────────┘
```

### After (Correct Centering)
```javascript
// Layer at position (4800, 2700)
// Image size: 200x200, scale: 1.0
const imgWidth = 200 * 1.0;
const imgHeight = 200 * 1.0;
const layerX = 4800 - cameraX - (imgWidth / 2);   // Center horizontally
const layerY = 2700 - cameraY - (imgHeight / 2);  // Center vertically
ctx.drawImage(img, layerX, layerY, imgWidth, imgHeight);
```

**Result**: ✅ Image centered on layer position

```
      ┌─────────┐
      │         │
      │    ●    │ ← Layer Position (4800, 2700)
      │  Image  │
      └─────────┘
```

---

## Scenario 5: Export Individual Layer

### New Functionality
```javascript
const layer = {
  id: 'layer-1',
  type: 'text',
  position: { x: 4800, y: 2700 },
  text_config: {
    text: 'Hello World',
    size: 48,
    color: [0, 0, 0]
  }
};

// Export layer with white background, centered
const imageDataUrl = await exportLayerAsImage(layer, 800, 450);
downloadImage(imageDataUrl, 'layer-1.png');
```

**Result**: PNG image with:
- White background (800x450)
- Text centered on canvas
- No other layers visible
- Layer properties (scale, opacity) applied

**Use Case**: Export individual elements for use in other applications

---

## Camera Viewport Calculation

### Before (Incorrect)
```javascript
const cameraX = (camera.position.x * sceneWidth) - (camera.width / 2);
const cameraY = (camera.position.y * sceneHeight) - (camera.height / 2);
```

**Issue**: Using `camera.width` instead of `canvas.width` could cause misalignment.

### After (Correct)
```javascript
const canvas = document.createElement('canvas');
canvas.width = camera.width || 800;
canvas.height = camera.height || 450;

const cameraX = (camera.position.x * sceneWidth) - (canvas.width / 2);
const cameraY = (camera.position.y * sceneHeight) - (canvas.height / 2);
```

**Fix**: Properly centers camera viewport on position.

---

## Summary of Changes

| Aspect | Before | After |
|--------|--------|-------|
| Default camera export | Always PNG image | JSON config only |
| Custom camera export | PNG image | PNG image (unchanged) |
| Layer centering | Top-left at position | Centered on position |
| Export format | String (data URL) | Object with configOnly flag |
| File types | .png only | .png and .json |
| Individual layer export | Not available | New function available |
| Multi-line text | Basic support | Proper centering with line height |

## Benefits

1. **Efficiency**: No need to generate images for default cameras
2. **Accuracy**: Layers properly centered on their positions
3. **Flexibility**: JSON configs can recreate cameras programmatically
4. **Storage**: Smaller file sizes for default camera exports
5. **Correctness**: Fixes the "image not well centered" issue
6. **Modularity**: Can export individual layers independently
