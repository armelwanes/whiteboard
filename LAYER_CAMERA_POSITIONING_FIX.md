# Layer Camera Positioning Fix

## Issue Summary

The user reported that new layers should be added at the current camera position ("il faut aussi que les nouvelle couche ajouter soit dans la camera actuel").

## Problem Analysis

When adding a new layer via the "Ajouter une couche" button, the layer needs to be positioned at the currently selected camera's viewport center, not at a fixed position like (100, 100).

### Existing Implementation

The LayerEditor component already had camera-aware positioning code:

```jsx
const [selectedCamera, setSelectedCamera] = useState(null);

// SceneCanvas notifies LayerEditor of camera selection
<SceneCanvas
  onSelectCamera={setSelectedCamera}
  ...
/>

// Image upload handler uses selected camera
const handleImageUpload = (e) => {
  let initialX = 100;
  let initialY = 100;
  
  if (selectedCamera && selectedCamera.position) {
    initialX = selectedCamera.position.x * sceneWidth;
    initialY = selectedCamera.position.y * sceneHeight;
  }
  // Create layer at calculated position
};
```

### Issues Identified

1. **Default position too far from center**: The fallback position (100, 100) was in the top-left corner, far from the default camera center
2. **Camera state initialization**: The `selectedCamera` might be `null` initially before SceneCanvas notifies the parent
3. **Scene switching**: Camera selection wasn't being reset when switching scenes

## Solution Implemented

### LayerEditor.jsx Changes

#### 1. Improved Default Position

**Before:**
```jsx
let initialX = 100;
let initialY = 100;
```

**After:**
```jsx
let initialX = sceneWidth / 2;  // 4800 (center of 9600px scene)
let initialY = sceneHeight / 2;  // 2700 (center of 5400px scene)
```

**Reasoning**: 
- The scene is 9600x5400 pixels (1920*5 x 1080*5)
- The default camera is centered at position (0.5, 0.5)
- Default position should match: (0.5 * 9600, 0.5 * 5400) = (4800, 2700)
- This ensures layers appear at the scene center even if `selectedCamera` is temporarily `null`

#### 2. Camera Reset on Scene Change

**Before:**
```jsx
React.useEffect(() => {
  setEditedScene({ ...scene, ... });
  setSelectedLayerId(null);
}, [scene]);
```

**After:**
```jsx
React.useEffect(() => {
  setEditedScene({ ...scene, ... });
  setSelectedLayerId(null);
  setSelectedCamera(null);  // Reset camera selection
}, [scene]);
```

**Reasoning**: When switching between scenes, the camera selection should be reset to avoid using a camera from a different scene.

## Camera Position System

### Scene Dimensions
- Width: 1920 * 5 = 9600 pixels
- Height: 1080 * 5 = 5400 pixels

### Normalized Coordinates
Cameras use normalized positions (0.0 to 1.0):
- `{ x: 0.5, y: 0.5 }` = center of scene
- `{ x: 0.0, y: 0.0 }` = top-left corner
- `{ x: 1.0, y: 1.0 }` = bottom-right corner

### Pixel Conversion
```javascript
pixelX = camera.position.x * sceneWidth;
pixelY = camera.position.y * sceneHeight;
```

### Default Camera
The default camera created by `createDefaultCamera()`:
```javascript
{
  id: 'default-camera',
  name: 'Caméra Par Défaut',
  zoom: 1.0,
  position: { x: 0.5, y: 0.5 },  // Center
  width: 800,
  height: 450,
  isDefault: true,
  ...
}
```

## How It Works

### Flow Diagram

```
User clicks "Ajouter une couche"
  ↓
File dialog opens
  ↓
User selects image
  ↓
handleImageUpload() called
  ↓
Check if selectedCamera exists
  ├─ Yes: Calculate position from camera
  │   initialX = camera.position.x * 9600
  │   initialY = camera.position.y * 5400
  │
  └─ No: Use default center position
      initialX = 9600 / 2 = 4800
      initialY = 5400 / 2 = 2700
  ↓
Create layer at calculated position
  ↓
Layer appears at camera center
```

### Camera Selection Update

SceneCanvas maintains the selected camera and notifies LayerEditor:

```jsx
// In SceneCanvas
React.useEffect(() => {
  if (onSelectCamera) {
    const selectedCamera = sceneCameras.find(cam => cam.id === selectedCameraId);
    onSelectCamera(selectedCamera);
  }
}, [selectedCameraId, sceneCameras, onSelectCamera]);
```

When the user:
1. Opens the LayerEditor → SceneCanvas effect runs → selectedCamera is set
2. Clicks a camera viewport → selectedCameraId changes → effect runs → selectedCamera updates
3. Adds a layer → Uses the current selectedCamera position

## Examples

### Example 1: Default Camera
- Camera position: `{ x: 0.5, y: 0.5 }`
- Scene size: 9600 x 5400
- Layer position: (4800, 2700) ✓

### Example 2: Custom Camera
- Camera position: `{ x: 0.3, y: 0.7 }`
- Scene size: 9600 x 5400
- Layer position: (2880, 3780) ✓

### Example 3: No Camera Selected (Fallback)
- selectedCamera: `null`
- Scene size: 9600 x 5400
- Layer position: (4800, 2700) ✓ (same as default camera)

## Result

✅ New layers are now consistently positioned at the center of the selected camera viewport.
✅ Default position matches the default camera center when no camera is explicitly selected.
✅ Camera selection properly resets when switching between scenes.

## Testing

To test the fix:
1. Open LayerEditor for a scene
2. Select different cameras (if multiple exist)
3. Click "Ajouter une couche" and upload an image
4. Verify the layer appears centered in the selected camera viewport
5. Switch to another scene and add a layer
6. Verify the layer uses the new scene's camera position

## Files Modified

- `src/components/LayerEditor.jsx` (5 lines changed)

## Related Issues

This addresses the second part of the issue: "il faut aussi que les nouvelle couche ajouter soit dans la camera actuel"

## Documentation References

- Previous implementation: `CAMERA_FIXES.md`
- Camera system: `CAMERA_IMPLEMENTATION.md`
- Camera utilities: `src/utils/cameraAnimator.js`
