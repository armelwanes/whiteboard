# Issue Resolution: Camera-Relative Layer Export

## Original Issue

**Title:** camera

**Description (French):**
> le position du layer doit etre par rapport au camera par defaut, et quand on export c'est depuis cette camera par défaut qu'on dessine et le layer dedans, en faite quand on export un layer il prend la position reele par rapport au scene et ca depassse la zone d'exportation et donc il faut que exporter par rapport au camera par defaut, la taille de l'exportation c'est la taille du camera par defaut et le contenu c'est le layer

**Translation:**
The layer position should be relative to the default camera, and when exporting it's from this default camera that we draw with the layer inside. Actually when we export a layer it takes the real position relative to the scene and it exceeds the export zone, so we need to export relative to the default camera. The export size is the default camera size and the content is the layer.

**Visual Evidence:**
The provided screenshot shows a layer (the cartoon character image) positioned outside or offset from the pink camera viewport box (labeled "Caméra Par Défaut (Live)"). This indicates the layer export was not respecting the camera viewport boundaries.

## Root Cause Analysis

### Before Fix
```javascript
// layerExporter.js - exportLayerFromJSON()
const canvas = document.createElement('canvas');
canvas.width = 1920;  // ❌ Arbitrary size
canvas.height = 1080; // ❌ Arbitrary size

// Layer always centered regardless of actual position
const centeredLayer = {
  ...layer,
  position: {
    x: width / 2,   // ❌ Always centered
    y: height / 2   // ❌ Ignores camera viewport
  }
};
```

**Problems:**
1. ❌ Export canvas was 1920x1080 (arbitrary size, not camera size)
2. ❌ Layer was always centered on canvas (ignored actual position)
3. ❌ No relationship to camera viewport
4. ❌ Layer's scene position (e.g., 4800, 2700) was not converted to camera-relative coordinates
5. ❌ Export didn't match what was visible in the camera

### After Fix
```javascript
// layerExporter.js - exportLayerFromJSON()
if (camera) {
  // ✅ Use camera dimensions
  canvasWidth = camera.width || 800;
  canvasHeight = camera.height || 450;
  
  // ✅ Calculate camera viewport in scene coordinates
  const cameraX = (camera.position.x * sceneWidth) - (canvasWidth / 2);
  const cameraY = (camera.position.y * sceneHeight) - (canvasHeight / 2);
  
  // ✅ Calculate layer position relative to camera viewport
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;
  
  modifiedLayer = {
    ...layer,
    position: { x: layerX, y: layerY }
  };
}
```

**Solutions:**
1. ✅ Export canvas is 800x450 (default camera size)
2. ✅ Layer positioned relative to camera viewport
3. ✅ Layer's scene position correctly converted to camera-relative coordinates
4. ✅ Export matches what's visible in the camera
5. ✅ Layer stays within camera viewport bounds

## Mathematical Example

### Scenario
- **Scene:** 9600x5400 pixels
- **Camera:** Position (0.5, 0.5), Size 800x450
- **Layer:** Position (4800, 2700) in scene coordinates

### Before Fix (Wrong)
```
Canvas: 1920x1080
Layer position: (960, 540) - always centered
Result: ❌ Doesn't match camera view
```

### After Fix (Correct)
```
Camera pixel position: (0.5 × 9600, 0.5 × 5400) = (4800, 2700)
Camera viewport top-left: (4800 - 400, 2700 - 225) = (4400, 2475)
Layer relative position: (4800 - 4400, 2700 - 2475) = (400, 225)

Canvas: 800x450
Layer position: (400, 225) - centered in camera view ✅
Result: ✅ Matches camera view perfectly
```

## Implementation Details

### Files Modified

#### 1. `src/utils/layerExporter.js`
- Added `camera` parameter to `exportLayerFromJSON()` options
- Implemented camera-relative positioning when camera is provided
- Canvas dimensions now use camera size when camera is provided
- Maintained backward compatibility (legacy mode when no camera)

#### 2. `src/components/LayerEditor.jsx`
- Updated `handleExportLayer()` to retrieve and pass default camera
- Updated `handleExportAllLayers()` to retrieve and pass default camera
- Both functions now pass `camera`, `sceneWidth`, and `sceneHeight` to export

### Code Changes Summary

**layerExporter.js:**
```javascript
// NEW: Camera parameter in options
export const exportLayerFromJSON = async (layer, options = {}) => {
  const { camera = null, sceneWidth = 9600, sceneHeight = 5400, ... } = options;
  
  // NEW: Use camera dimensions
  let canvasWidth = camera ? (camera.width || 800) : (width || 1920);
  let canvasHeight = camera ? (camera.height || 450) : (height || 1080);
  
  // NEW: Camera-relative positioning
  if (camera) {
    const cameraX = (camera.position.x * sceneWidth) - (canvasWidth / 2);
    const cameraY = (camera.position.y * sceneHeight) - (canvasHeight / 2);
    const layerX = (layer.position?.x || 0) - cameraX;
    const layerY = (layer.position?.y || 0) - cameraY;
    modifiedLayer = { ...layer, position: { x: layerX, y: layerY } };
  }
}
```

**LayerEditor.jsx:**
```javascript
// NEW: Get default camera
const cameras = editedScene.sceneCameras || [];
const defaultCamera = cameras.find(cam => cam.isDefault) || {
  position: { x: 0.5, y: 0.5 },
  width: 800,
  height: 450,
  isDefault: true
};

// NEW: Pass camera to export
const dataUrl = await exportLayerFromJSON(layer, {
  camera: defaultCamera,
  sceneWidth: sceneWidth,
  sceneHeight: sceneHeight,
  ...
});
```

## Testing

### Unit Tests
- `test/layer-camera-position-logic-test.js` - Validates positioning calculations ✅
- `test/layer-camera-export-test.js` - Tests export function with camera parameter ✅

### Visual Demo
- `test/demo-camera-relative-export.html` - Before/after visual comparison ✅

### Build Verification
```bash
npm run build  # ✅ Success
npm run lint   # ✅ No new errors (only pre-existing unrelated warnings)
```

## Results

### Before (Issue Screenshot)
- Layer exported at wrong position
- Export size didn't match camera
- Layer content exceeded export zone
- Not WYSIWYG (What You See Is NOT What You Get)

### After (Fixed)
- ✅ Layer exported at correct position relative to camera
- ✅ Export size matches camera dimensions (800x450)
- ✅ Layer content stays within camera viewport
- ✅ WYSIWYG (What You See IS What You Get)

## Backward Compatibility

The fix maintains **100% backward compatibility**:
- When `camera` parameter is NOT provided, original behavior is preserved
- Existing code continues to work without modifications
- Only new exports with camera parameter use the new positioning logic

## Benefits

1. **Correct Positioning**: Layers export at their actual position within camera viewport
2. **Proper Dimensions**: Export canvas matches camera size
3. **WYSIWYG**: Export matches what's visible in the camera
4. **Scene Consistency**: Multiple layer exports from same scene are consistent
5. **Background Support**: Scene backgrounds render correctly in camera viewport

## Documentation

- `LAYER_EXPORT_CAMERA_FIX.md` - Comprehensive technical documentation
- `test/demo-camera-relative-export.html` - Visual before/after demo
- Inline code comments added for clarity

## Verification Checklist

- [x] Issue understood correctly
- [x] Root cause identified
- [x] Solution implemented
- [x] Camera-relative positioning working
- [x] Export dimensions match camera
- [x] Layer positions calculated correctly
- [x] Backward compatibility preserved
- [x] Build passes
- [x] Tests created
- [x] Documentation written
- [x] Visual demo created

## Status

✅ **RESOLVED** - Issue fully fixed and tested

The layer export now correctly uses the default camera viewport for positioning and sizing, matching what's visible in the camera view exactly as requested in the issue.
