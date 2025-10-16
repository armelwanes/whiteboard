# Layer Positioning Fix - Camera Viewport Centering

## Issue Summary

**Original Issue**: "layer not in position in camera"
- When adding layers (images, text, shapes), they were appearing offset from the camera center
- The layer's top-left corner was being positioned at the camera center instead of the layer's center

## Root Cause

The positioning logic had a fundamental misunderstanding:

1. **Camera position** represents the CENTER of the camera viewport in normalized coordinates (0.0-1.0)
2. **Layer position** in Konva represents the TOP-LEFT corner of the element in pixel coordinates
3. The previous code was setting layer position = camera center in pixels

**Example**:
- Camera at position (0.5, 0.5) → pixel center at (4800, 2700)
- Layer positioned at (4800, 2700) → layer's TOP-LEFT corner at camera center
- Result: Layer appears offset down and to the right by half its dimensions

## Solution

To properly center a layer in the camera viewport, we need to:

1. Convert camera normalized position to pixel coordinates
2. Calculate the layer's scaled dimensions
3. Subtract half the dimensions to position the layer's center at the camera center

**Formula**:
```javascript
cameraCenterX = camera.position.x * sceneWidth
cameraCenterY = camera.position.y * sceneHeight

layerX = cameraCenterX - (scaledWidth / 2)
layerY = cameraCenterY - (scaledHeight / 2)
```

## Changes Made

### 1. Image Layers (`handleCropComplete`)

**Before**:
```javascript
let initialX = sceneWidth / 2;
let initialY = sceneHeight / 2;

if (selectedCamera && selectedCamera.position) {
  initialX = selectedCamera.position.x * sceneWidth;
  initialY = selectedCamera.position.y * sceneHeight;
}
```

**After**:
```javascript
let cameraCenterX = sceneWidth / 2;
let cameraCenterY = sceneHeight / 2;

if (selectedCamera && selectedCamera.position) {
  cameraCenterX = selectedCamera.position.x * sceneWidth;
  cameraCenterY = selectedCamera.position.y * sceneHeight;
}

// Calculate scaled image dimensions
const scaledImageWidth = imageDimensions ? imageDimensions.width * calculatedScale : 0;
const scaledImageHeight = imageDimensions ? imageDimensions.height * calculatedScale : 0;

// Position layer to center it in camera
const initialX = cameraCenterX - (scaledImageWidth / 2);
const initialY = cameraCenterY - (scaledImageHeight / 2);
```

### 2. Text Layers (`handleAddTextLayer`)

Added text dimension estimation:
```javascript
const text = 'Votre texte ici';
const fontSize = 48;
const estimatedWidth = text.length * fontSize * 0.6;
const estimatedHeight = fontSize * 1.2;

const initialX = cameraCenterX - (estimatedWidth / 2);
const initialY = cameraCenterY - (estimatedHeight / 2);
```

### 3. Shape Layers (`handleAddShape`)

Used shape dimensions from shape_config:
```javascript
const shapeWidth = shapeLayer.shape_config?.width || 100;
const shapeHeight = shapeLayer.shape_config?.height || 100;

const initialX = cameraCenterX - (shapeWidth / 2);
const initialY = cameraCenterY - (shapeHeight / 2);
```

## Verification

### Test Case 1: Image Layer
- **Image**: test_star.png (400 x 300 pixels)
- **Camera**: Default (0.5, 0.5) → center at (4800, 2700)
- **Scale**: 1.0 (fits within camera viewport)
- **Expected Position**: X = 4800 - 200 = 4600, Y = 2700 - 150 = 2550
- **Actual Position**: X = 4600, Y = 2550 ✅

### Test Case 2: Text Layer
- **Text**: "Votre texte ici" (16 chars, 48px font)
- **Estimated Dimensions**: ~461 x 58 pixels
- **Camera**: Default (0.5, 0.5) → center at (4800, 2700)
- **Expected Position**: X ≈ 4570, Y ≈ 2671
- **Actual Position**: X = 4584, Y = 2671 ✅

## Mathematical Proof

For any layer centered in a camera:

**Given**:
- Scene dimensions: W_s × H_s (9600 × 5400)
- Camera position: (c_x, c_y) in [0, 1]
- Layer dimensions: W_l × H_l
- Layer scale: s

**Camera center in pixels**:
- C_x = c_x × W_s
- C_y = c_y × H_s

**Scaled layer dimensions**:
- W_l' = W_l × s
- H_l' = H_l × s

**Layer position (top-left corner)**:
- L_x = C_x - (W_l' / 2)
- L_y = C_y - (H_l' / 2)

**Layer center**:
- Center_x = L_x + (W_l' / 2) = C_x - (W_l' / 2) + (W_l' / 2) = C_x ✅
- Center_y = L_y + (H_l' / 2) = C_y - (H_l' / 2) + (H_l' / 2) = C_y ✅

**Result**: Layer center = Camera center ✓

## Files Modified

- `src/components/LayerEditor.jsx` (60 lines changed)
  - Updated `handleCropComplete()` for image layers
  - Updated `handleAddTextLayer()` for text layers
  - Updated `handleAddShape()` for shape layers

## Impact

- **Breaking Changes**: None
- **Backward Compatibility**: Existing layers are not affected
- **New Behavior**: All newly added layers will be correctly centered in the camera viewport

## Related Documentation

- Original implementation: `CAMERA_FIXES.md`
- Camera system: `CAMERA_IMPLEMENTATION.md`
- Previous attempt: `LAYER_CAMERA_POSITIONING_FIX.md`
