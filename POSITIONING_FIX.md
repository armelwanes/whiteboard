# Image Export Positioning Fix (Décalage Issue)

## Issue Description

**Reported Issue:** Images exported from the whiteboard application appeared shifted upward (décalé vers le haut) compared to their position in the editor.

**Visual Evidence:**
- In the editor: Image displayed at correct position
- In export: Same image shifted upward

## Root Cause Analysis

### The Problem

There was a **coordinate system mismatch** between the editor and export functions:

1. **Editor (SceneCanvas.jsx):**
   - Uses Konva's `<Image>` component
   - Positions images with their **top-left corner** at `(x, y)`
   - Code: `<KonvaImage x={layer.position?.x} y={layer.position?.y} />`

2. **Export Functions (sceneExporter.js, cameraExporter.js, layerExporter.js):**
   - Use Canvas 2D API `drawImage()`
   - Were positioning images with their **center** at `(x, y)`
   - Code: `ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight)`

### Why This Caused the Issue

When an image is 200x150 pixels:
- **Top-left positioning:** Image starts at (x, y)
- **Center positioning:** Image starts at (x - 100, y - 75)

This creates an offset of:
- **X offset:** -100 pixels (shifted left)
- **Y offset:** -75 pixels (shifted up) ← This caused the visible "décalage"

## The Fix

### Changes Made

Modified three export utility files to use **top-left corner positioning** instead of center positioning:

1. **src/utils/sceneExporter.js**
2. **src/utils/cameraExporter.js**
3. **src/utils/layerExporter.js**

### Code Changes

**Before (❌ Wrong):**
```javascript
// Centered positioning - doesn't match editor
ctx.save();
ctx.translate(layerX, layerY);
if (rotation) {
  ctx.rotate(rotation * Math.PI / 180);
}
ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
ctx.restore();
```

**After (✅ Fixed):**
```javascript
// Top-left positioning - matches editor
if (rotation) {
  // For rotated images, translate to center, rotate, then draw centered
  ctx.translate(layerX + imgWidth / 2, layerY + imgHeight / 2);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
} else {
  // No rotation: simple top-left positioning
  ctx.drawImage(img, layerX, layerY, imgWidth, imgHeight);
}
```

### Special Handling for Rotation

When images are rotated, we still need to:
1. Translate to the center point of where the image will be
2. Apply rotation around that center
3. Draw image centered on the rotated context

This ensures rotated images pivot correctly around their center while maintaining top-left positioning when not rotated.

## Verification

### Automated Tests

Created `test/positioning-fix-test.js` with 3 test cases:

```
Test 1: Center of canvas ✅ PASS
Test 2: Top-left corner ✅ PASS  
Test 3: With camera offset ✅ PASS

Tests passed: 3/3
```

### Visual Demonstration

Created `test/positioning-fix-verification.html` showing:
- Before/after comparison
- Visual grid with position markers
- Technical explanation

To view: Open `test/positioning-fix-verification.html` in a browser.

## Impact

### What's Fixed
✅ Scene exports now match editor display exactly  
✅ Camera view exports align correctly  
✅ Individual layer exports position correctly  
✅ Rotated images still work properly  

### What's Not Affected
- Text layers (already used top-left positioning)
- Shape layers (already used centered positioning appropriately)
- Background images (use different rendering logic)

## Testing the Fix

### In the Application

1. Open the whiteboard editor
2. Add an image layer and position it in the scene
3. Export the scene (or layer, or camera view)
4. Compare exported image with editor display
5. ✅ Positions should now match exactly

### With Test Files

```bash
# Run automated test
node test/positioning-fix-test.js

# View visual demonstration
open test/positioning-fix-verification.html
```

## Technical Details

### Files Modified
- `src/utils/sceneExporter.js` (lines 163-189)
- `src/utils/cameraExporter.js` (lines 79-92)
- `src/utils/layerExporter.js` (lines 238-262)

### Backward Compatibility
✅ This fix maintains backward compatibility because:
- Export format hasn't changed (still PNG)
- Only positioning calculation changed
- No changes to data structures
- Existing exports remain valid (just had wrong positioning)

## Conclusion

The "décalage" issue was caused by a fundamental mismatch in coordinate systems between the editor and export functions. By aligning both to use top-left corner positioning for images, the export now accurately reflects what users see in the editor.

**Status:** ✅ FIXED

**Verified:** All tests passing, build successful, visual comparison confirms fix.
