# Layer Full Scene Export Implementation

## Issue Summary

**Title:** save layer

**Description (French):**
> en faite la creation de l'image avec la taille reelle du scene meme sii c'est tress grand et position dessus le layer correspondant

**Translation:**
Actually creating the image with the real size of the scene even if it's very large and positioning the corresponding layer on it.

## Problem

Previously, layers could only be exported in two ways:
1. **Camera-relative export**: Exports at camera viewport size (800x450) with layer position relative to camera
2. **Centered export**: Exports at arbitrary size with layer centered on canvas

Neither option allowed exporting a layer at the **full scene dimensions** (9600x5400) with its **real scene position**.

## Solution Implemented

Added a new `useFullScene` export mode that:
- Uses **full scene dimensions** (9600x5400) as canvas size
- Positions layer at its **real scene coordinates** (not relative to camera)
- Renders scene background at full size with layer correctly positioned

### Implementation Details

#### 1. Modified `src/utils/layerExporter.js`

**Added Parameter:**
```javascript
@param {boolean} options.useFullScene - If true, exports layer with full scene dimensions and real scene position (ignores camera)
```

**Canvas Dimension Logic:**
```javascript
if (useFullScene) {
  // Use full scene dimensions for export
  canvasWidth = sceneWidth;   // 9600
  canvasHeight = sceneHeight; // 5400
} else if (camera) {
  // Use camera dimensions when camera is provided
  canvasWidth = camera.width || 800;
  canvasHeight = camera.height || 450;
} else {
  // Fallback to provided dimensions or defaults
  canvasWidth = width || 1920;
  canvasHeight = height || 1080;
}
```

**Layer Positioning Logic:**
```javascript
if (useFullScene) {
  // Full scene mode: use layer's real scene position
  modifiedLayer = {
    ...layer,
    position: {
      x: layer.position?.x || (sceneWidth / 2),
      y: layer.position?.y || (sceneHeight / 2)
    }
  };
}
```

**Background Image Rendering:**
- In full scene mode: Renders background at full scene size (9600x5400)
- In camera mode: Crops background to camera viewport

#### 2. Modified `src/components/LayerEditor.jsx`

**Added Handler Function:**
```javascript
const handleExportLayerFullScene = async (layerId) => {
  const dataUrl = await exportLayerFromJSON(layer, {
    useFullScene: true,
    sceneWidth: sceneWidth,
    sceneHeight: sceneHeight,
    background: '#FFFFFF',
    pixelRatio: 1,
    sceneBackgroundImage: editedScene.backgroundImage,
  });
  
  const filename = `scene-${editedScene.id}-layer-${layer.name}-fullscene-${timestamp}.png`;
  downloadDataUrl(dataUrl, filename);
};
```

**Added UI Button:**
- Each layer now has **two export buttons**:
  - **Purple button** (existing): Export with camera view (800x450)
  - **Green button** (new): Export with full scene (9600x5400)

**Button Tooltips:**
- Purple: "Exporter couche (vue caméra)"
- Green: "Exporter couche (scène complète 9600x5400)"

## Usage

### In Code

```javascript
// Export layer with full scene dimensions
const dataUrl = await exportLayerFromJSON(layer, {
  useFullScene: true,
  sceneWidth: 9600,
  sceneHeight: 5400,
  background: '#FFFFFF',
  pixelRatio: 1,
  sceneBackgroundImage: scene.backgroundImage,
});
```

### In UI

1. Open the Layer Editor
2. Find the layer you want to export
3. Click the **green download button** (not the purple one)
4. Layer will be exported at 9600x5400 with real scene position

## Comparison: Camera vs Full Scene Export

| Feature | Camera Export | Full Scene Export |
|---------|---------------|-------------------|
| **Canvas Size** | 800x450 | 9600x5400 |
| **Layer Position** | Relative to camera viewport | Real scene coordinates |
| **Background** | Cropped to camera view | Full scene background |
| **Use Case** | Preview what's in camera | Complete scene with exact positioning |
| **Button Color** | Purple | Green |
| **Filename Suffix** | `layer-{name}-{date}.png` | `layer-{name}-fullscene-{date}.png` |

## Example Layer Configuration

```javascript
const layer = {
  id: 'layer-1',
  type: 'image',
  image_path: '/images/photo.jpg',
  position: { 
    x: 4800,  // Center X of scene
    y: 2700   // Center Y of scene
  },
  scale: 1.0,
  opacity: 1.0,
};

// Camera at center
const camera = {
  position: { x: 0.5, y: 0.5 },
  width: 800,
  height: 450,
};
```

**Camera Export Result:**
- Canvas: 800x450
- Layer appears at canvas center (400, 225)

**Full Scene Export Result:**
- Canvas: 9600x5400
- Layer appears at scene center (4800, 2700)

## Testing

Created comprehensive test suite:

### Test File: `test/layer-fullscene-export-test.js`

**Tests:**
1. ✓ Validate image layer with scene position
2. ✓ Validate text layer with scene position
3. ✓ Validate shape layer with scene position
4. ✓ Export options should include useFullScene parameter
5. ✓ useFullScene should take precedence over camera option
6. ✓ Layer without position should default to scene center

**Results:** 6/6 tests passing

### Demo File: `test/demo-layer-fullscene-export.html`

Visual demonstration showing side-by-side comparison of:
- Camera-relative export (800x450)
- Full scene export (9600x5400)

Open in browser to see live demo.

## Benefits

1. **Accurate Positioning**: Layers exported exactly where they are in the scene
2. **Full Resolution**: Uses entire scene dimensions, not limited to camera viewport
3. **Non-Destructive**: Doesn't replace existing camera export functionality
4. **Flexible**: Works with all layer types (image, text, shape, whiteboard)
5. **Scene Background**: Optionally includes scene background at full size

## Backward Compatibility

✅ **Fully backward compatible**
- Existing camera export still works exactly as before
- New `useFullScene` parameter is optional (defaults to `false`)
- No breaking changes to API or UI
- Purple export buttons maintain existing behavior

## Files Modified

1. `src/utils/layerExporter.js` - Added `useFullScene` option and logic
2. `src/components/LayerEditor.jsx` - Added handler and UI button

## Files Added

1. `test/layer-fullscene-export-test.js` - Unit tests
2. `test/demo-layer-fullscene-export.html` - Visual demo
3. `LAYER_FULLSCENE_EXPORT.md` - This documentation

## Build Status

✅ **Build Successful**
```
✓ built in 1.27s
```

✅ **Tests Passing**
```
Test Summary: 6/6 tests passed
```

✅ **No New Lint Errors**

## Visual Changes

### Layer List - Export Buttons

Before:
```
[Move Up] [Move Down] [Duplicate] [Export] [Delete]
                                   purple
```

After:
```
[Move Up] [Move Down] [Duplicate] [Export] [Export] [Delete]
                                   purple   green
```

**Color Coding:**
- 🟣 Purple = Camera view export (800x450)
- 🟢 Green = Full scene export (9600x5400)

## Future Enhancements

Possible future improvements:
1. Batch export all layers with full scene dimensions
2. Custom canvas size option (not just camera or full scene)
3. Export with custom crop area (user-defined viewport)
4. Progress indicator for large exports

## Verification Steps

To verify the implementation:

1. ✅ Build project: `npm run build`
2. ✅ Run tests: `node test/layer-fullscene-export-test.js`
3. ✅ View demo: Open `test/demo-layer-fullscene-export.html` in browser
4. ✅ Manual test: Create a layer, position it at (1000, 1000), export with both buttons
5. ✅ Compare outputs: Camera export should be 800x450, full scene should be 9600x5400

## Conclusion

This implementation successfully addresses the issue by providing a way to export layers with full scene dimensions and real scene positioning, while maintaining backward compatibility with existing export functionality.
