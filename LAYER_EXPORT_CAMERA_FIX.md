# Layer Export Camera Fix

## Issue
When exporting a layer, the layer position was calculated based on absolute scene coordinates and centered on an arbitrary canvas size (1920x1080), ignoring the camera viewport. This caused layers to be exported at incorrect positions, often outside the visible export area.

**Original Problem:**
- Layer positions were absolute in the 9600x5400 scene
- Export canvas was 1920x1080 (arbitrary size)
- Layers were always centered regardless of actual position
- No relationship to camera viewport

**Expected Behavior:**
- Layer export should be relative to the **default camera viewport**
- Export canvas size should match the **camera dimensions** (800x450 by default)
- Only content visible in the camera viewport should be exported
- Layer positions should be calculated relative to camera viewport, not scene

## Solution Implemented

### 1. Modified `exportLayerFromJSON` in `layerExporter.js`

**Key Changes:**
- Added `camera` parameter to options
- When camera is provided:
  - Canvas dimensions use camera size (e.g., 800x450)
  - Calculate camera viewport in scene coordinates: `(camera.position * sceneSize) - (cameraSize / 2)`
  - Calculate layer position relative to camera viewport: `layerPosition - cameraViewport`
- When camera is NOT provided (legacy):
  - Use provided dimensions or default to 1920x1080
  - Center layer on canvas (backward compatibility)

**Code:**
```javascript
if (camera) {
  // Camera-relative positioning
  const cameraX = (camera.position.x * sceneWidth) - (canvasWidth / 2);
  const cameraY = (camera.position.y * sceneHeight) - (canvasHeight / 2);
  
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;
  
  modifiedLayer = {
    ...layer,
    position: { x: layerX, y: layerY }
  };
} else {
  // Legacy: center on canvas
  modifiedLayer = {
    ...layer,
    position: { x: canvasWidth / 2, y: canvasHeight / 2 }
  };
}
```

### 2. Updated `LayerEditor.jsx`

**Changes in `handleExportLayer`:**
- Get the default camera from scene
- Pass camera to `exportLayerFromJSON`
- Include sceneWidth and sceneHeight parameters

**Changes in `handleExportAllLayers`:**
- Same updates as `handleExportLayer`
- All layers now exported with consistent camera viewport

**Code:**
```javascript
// Get the default camera for export
const cameras = editedScene.sceneCameras || [];
const defaultCamera = cameras.find(cam => cam.isDefault) || {
  position: { x: 0.5, y: 0.5 },
  width: 800,
  height: 450,
  isDefault: true
};

const dataUrl = await exportLayerFromJSON(layer, {
  camera: defaultCamera,
  sceneWidth: sceneWidth,
  sceneHeight: sceneHeight,
  background: '#FFFFFF',
  pixelRatio: 1,
  sceneBackgroundImage: editedScene.backgroundImage,
});
```

## Mathematical Verification

### Camera Viewport Calculation
For a camera at position `(0.5, 0.5)` in a `9600x5400` scene with dimensions `800x450`:

```
Camera pixel position = (0.5 * 9600, 0.5 * 5400) = (4800, 2700)
Camera viewport top-left = (4800 - 400, 2700 - 225) = (4400, 2475)
```

### Layer Position Calculation
For a layer at scene position `(4800, 2700)`:

```
Layer position relative to camera = (4800 - 4400, 2700 - 2475) = (400, 225)
```

This positions the layer at the **center** of the 800x450 export canvas ✓

For a layer at scene position `(5000, 2800)`:

```
Layer position relative to camera = (5000 - 4400, 2800 - 2475) = (600, 325)
```

This positions the layer **offset** from center in the export ✓

## Files Modified

1. **src/utils/layerExporter.js**
   - Updated `exportLayerFromJSON()` function
   - Added camera-relative positioning logic
   - Preserved backward compatibility (legacy mode when no camera)

2. **src/components/LayerEditor.jsx**
   - Updated `handleExportLayer()` to pass default camera
   - Updated `handleExportAllLayers()` to pass default camera

## Testing

**Unit Tests Created:**
- `test/layer-camera-position-logic-test.js` - Validates mathematical calculations
- `test/layer-camera-export-test.js` - Tests export function (requires DOM)

**Test Results:**
- ✓ Camera viewport calculation is correct
- ✓ Layer position relative to camera is correct
- ✓ Canvas dimensions match camera dimensions
- ✓ Legacy behavior preserved when no camera provided

## Backward Compatibility

The fix maintains **full backward compatibility**:
- When `camera` parameter is NOT provided, the original behavior is preserved
- Existing code that doesn't pass camera will continue to work
- Only new calls with camera parameter use the new viewport-relative positioning

## Usage Examples

### Export layer relative to default camera
```javascript
const defaultCamera = scene.sceneCameras.find(cam => cam.isDefault);
const dataUrl = await exportLayerFromJSON(layer, {
  camera: defaultCamera,
  sceneWidth: 9600,
  sceneHeight: 5400,
});
```

### Export layer with legacy centering (no camera)
```javascript
const dataUrl = await exportLayerFromJSON(layer, {
  width: 1920,
  height: 1080,
});
```

## Benefits

1. **Correct positioning**: Layers export at their actual position relative to camera
2. **Proper viewport**: Export shows only what's visible in the camera
3. **Consistent size**: Export canvas matches camera dimensions (800x450)
4. **WYSIWYG**: What you see in the camera is what gets exported
5. **Scene background support**: Background images render correctly in camera viewport

## Verification

Build and lint pass successfully:
```bash
npm run build  # ✓ Success
npm run lint   # ✓ No new errors
```

## Conclusion

The layer export now correctly uses camera-relative positioning, matching the behavior of `exportCameraView()`. Layers are exported at their actual position within the camera viewport, with the export canvas sized to match the camera dimensions.

**Status**: ✅ FIXED
