# PR: Scene Export with Real Dimensions and Camera-Based Cropping

## Issue Resolved

**Title:** save image

**Description (French):**
> Exportation de la scène avec dimensions réelles et cropping basé sur la caméra
> 
> Maintenant que nous avons accès à la position réelle de la caméra, nous pouvons implémenter l'exportation de la scène avec les caractéristiques suivantes :
> 
> Fonctionnalités demandées:
> 1. Exporter la scène avec ses dimensions réelles (taille actuelle)
> 2. Inclure le layer spécifique concerné
> 3. Appliquer un cropping automatique basé sur la vue de la caméra par défaut

## Solution Summary

This PR implements a complete scene export feature that allows users to export all layers combined as a single image with:
- ✅ **Real dimensions** (uses camera size: 800×450 by default)
- ✅ **All layers combined** (single image output)
- ✅ **Automatic cropping** (based on default camera viewport)

## Implementation Details

### 1. New Utility: `src/utils/sceneExporter.js`
Complete scene export utility with:
- `exportSceneImage(scene, options)` - Main export function
- Camera-based cropping logic
- Support for all layer types (image, text, shape, whiteboard)
- Scene background cropping
- Proper z-order, opacity, rotation, scaling

### 2. UI Integration: `src/components/LayerEditor.jsx`
- Added "Export Scène Complète" section
- Added "Exporter Scène" button (indigo colored)
- Added `handleExportScene()` handler
- Positioned logically before camera export options

### 3. Testing
- **Unit tests:** `test/scene-export-test.js` (4/4 passing)
- **Visual demo:** `test/demo-scene-export.html`
- **Build:** ✅ Success

### 4. Documentation
- **Technical docs:** `SCENE_EXPORT_IMPLEMENTATION.md` (complete)
- Includes API documentation, examples, and comparison tables

## Files Changed

**New Files (4):**
- `src/utils/sceneExporter.js` (485 lines)
- `test/scene-export-test.js`
- `test/demo-scene-export.html`
- `SCENE_EXPORT_IMPLEMENTATION.md`

**Modified Files (1):**
- `src/components/LayerEditor.jsx`

**Total:** ~1,471 lines added

## How It Works

### Camera-Based Cropping
```javascript
// 1. Get default camera
const defaultCamera = scene.sceneCameras.find(cam => cam.isDefault);

// 2. Use camera dimensions (real size)
const canvasWidth = defaultCamera.width || 800;
const canvasHeight = defaultCamera.height || 450;

// 3. Calculate camera viewport in scene
const cameraX = (camera.position.x * sceneWidth) - (canvasWidth / 2);
const cameraY = (camera.position.y * sceneHeight) - (canvasHeight / 2);

// 4. Position layers relative to camera
const layerX = layer.position.x - cameraX;
const layerY = layer.position.y - cameraY;
```

### Example Calculation
**Scene:** 9600×5400, **Camera:** (0.5, 0.5) @ 800×450, **Layer:** (4800, 2700)

```
Camera viewport: (4400, 2475) to (5200, 2925)
Layer in export: (400, 225) → Centered ✓
Export size: 800×450 (real camera dimensions) ✓
```

## UI Preview

![Scene Export UI](https://github.com/user-attachments/assets/96de68f7-5338-4ee8-bc3b-6d2e9e3c0d61)

The new "Export Scène Complète" section appears in the Properties panel with:
- 📷 Icon and clear heading
- "Exporter Scène" button (indigo color)
- Descriptive text explaining the feature

## User Workflow

### Before (Workaround)
1. Export each layer individually
2. Manually combine in external tool
3. Manually crop to camera viewport
4. ❌ Time-consuming and error-prone

### After (This PR)
1. Click "Exporter Scène" button
2. ✅ Done! Single image with all layers, correctly cropped

## Testing Results

### Unit Tests ✅
```
✓ Scene structure is valid
✓ Camera viewport calculated correctly
✓ Layer positioned correctly relative to camera
✓ Correctly throws error when no default camera
```

### Build Status ✅
```
✓ 1770 modules transformed
✓ built in 1.30s
No new errors or warnings
```

## Benefits

1. **One-Click Export** - Single button exports complete scene
2. **WYSIWYG** - Export matches camera view exactly
3. **Real Dimensions** - Uses actual camera size
4. **Automatic Cropping** - No manual work needed
5. **High Quality** - Programmatic rendering (not screenshot)
6. **All Layer Types** - Images, text, shapes, whiteboard strokes
7. **Background Support** - Scene backgrounds properly included

## Requirements Satisfied

✅ All three requirements from the issue:

1. **Exporter la scène avec ses dimensions réelles**
   - Uses camera dimensions (real size)

2. **Inclure le layer spécifique concerné**
   - All visible layers combined

3. **Appliquer un cropping automatique basé sur la vue de la caméra par défaut**
   - Automatic cropping based on camera viewport

## Verification

- [x] Builds successfully
- [x] All tests pass
- [x] UI integrated and visible
- [x] Documentation complete
- [x] No breaking changes
- [x] Backward compatible
- [x] Ready for review

## Status

✅ **READY FOR MERGE**
