# Before/After Comparison: Image Positioning Fix

## Visual Comparison

### Before Fix (❌ Wrong Behavior)

```
Editor View:
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         ┌──────────┐               │
│         │  Image   │ ← At position │
│         │  Layer   │   (200, 150)  │
│         └──────────┘               │
│                                     │
└─────────────────────────────────────┘

Exported Image:
┌─────────────────────────────────────┐
│  ┌──────────┐                       │
│  │  Image   │ ← SHIFTED UP!         │
│  │  Layer   │   (200, 75)           │
│  └──────────┘                       │
│                                     │
│                                     │
│      ❌ Position doesn't match      │
└─────────────────────────────────────┘
```

**Problem:** Image appears ~75px higher in export than in editor

### After Fix (✅ Correct Behavior)

```
Editor View:
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         ┌──────────┐               │
│         │  Image   │ ← At position │
│         │  Layer   │   (200, 150)  │
│         └──────────┘               │
│                                     │
└─────────────────────────────────────┘

Exported Image:
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         ┌──────────┐               │
│         │  Image   │ ← At position │
│         │  Layer   │   (200, 150)  │
│         └──────────┘               │
│                                     │
└─────────────────────────────────────┘
```

**Result:** ✅ Image appears in the same position in both editor and export

## Technical Explanation

### Coordinate System Mismatch

#### Before Fix

**Editor (Konva):**
```javascript
<KonvaImage 
  x={200}  // Top-left corner X
  y={150}  // Top-left corner Y
/>
```
- Positions image with **top-left corner** at (200, 150)

**Export (Canvas 2D):**
```javascript
ctx.translate(200, 150);
ctx.drawImage(img, -width/2, -height/2, width, height);
```
- For a 200x150 image, this draws at:
  - X: 200 - 100 = **100** (shifted left by 100px)
  - Y: 150 - 75 = **75** (shifted up by 75px) ← THE PROBLEM

#### After Fix

**Editor (Konva):**
```javascript
<KonvaImage 
  x={200}  // Top-left corner X
  y={150}  // Top-left corner Y
/>
```
- Still positions with top-left corner at (200, 150)

**Export (Canvas 2D):**
```javascript
ctx.drawImage(img, 200, 150, width, height);
```
- Draws with **top-left corner** at (200, 150)
- ✅ **Matches editor positioning exactly**

## Real-World Impact

### Example: Profile Image at Center

**Before Fix:**
```
Scene: 1920x1080
Image: 300x300 profile photo
Position: (960, 540) - Center of scene

Editor displays: Image center at (960, 540)
Export produced: Image center at (960, 390) ← 150px too high!
```

**After Fix:**
```
Scene: 1920x1080
Image: 300x300 profile photo  
Position: (960, 540) - Center of scene

Editor displays: Image at (960, 540)
Export produces: Image at (960, 540) ✅ Perfect match!
```

## Code Comparison

### sceneExporter.js

#### Before (❌ Wrong)
```javascript
const renderImageLayer = (ctx, layer, cameraX, cameraY) => {
  // ...load image...
  
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // ❌ Translate to position and draw centered
  ctx.translate(layerX, layerY);
  if (rotation) {
    ctx.rotate(rotation * Math.PI / 180);
  }
  
  const imgWidth = img.width * scale;
  const imgHeight = img.height * scale;
  ctx.drawImage(
    img,
    -imgWidth / 2,  // ← Centers horizontally
    -imgHeight / 2, // ← Centers vertically
    imgWidth,
    imgHeight
  );
  
  ctx.restore();
};
```

#### After (✅ Fixed)
```javascript
const renderImageLayer = (ctx, layer, cameraX, cameraY) => {
  // ...load image...
  
  const layerX = (layer.position?.x || 0) - cameraX;
  const layerY = (layer.position?.y || 0) - cameraY;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  const imgWidth = img.width * scale;
  const imgHeight = img.height * scale;
  
  // ✅ Draw with top-left corner at position
  if (rotation) {
    // For rotation, translate to center, rotate, then draw
    ctx.translate(layerX + imgWidth / 2, layerY + imgHeight / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
  } else {
    // No rotation: simple top-left positioning
    ctx.drawImage(img, layerX, layerY, imgWidth, imgHeight);
  }
  
  ctx.restore();
};
```

## Test Results

### Automated Tests
```bash
$ node test/positioning-fix-test.js

Test 1: Center of canvas ✅ PASS
Test 2: Top-left corner ✅ PASS  
Test 3: With camera offset ✅ PASS

Tests passed: 3/3
```

### Visual Tests
Open `test/positioning-fix-verification.html` in a browser to see:
- Side-by-side before/after comparison
- Grid overlay showing exact positions
- Red markers indicating target coordinates

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Editor Positioning** | Top-left corner | Top-left corner |
| **Export Positioning** | ❌ Center | ✅ Top-left corner |
| **Match?** | ❌ No (shifted up) | ✅ Yes (exact match) |
| **X Offset** | -width/2 pixels | 0 pixels ✅ |
| **Y Offset** | -height/2 pixels | 0 pixels ✅ |

## Verification Steps

To verify the fix works in your scene:

1. **Create a test scene:**
   - Add an image layer
   - Position it at (400, 225)
   - Note the exact position in the editor

2. **Export the scene:**
   - Use "Export Scene" button
   - Open exported PNG

3. **Compare:**
   - ✅ Image should be at exact same position
   - ✅ No vertical shift
   - ✅ No horizontal shift

## Related Issues

This fix resolves:
- ✅ Issue: "décalage" - images shifted in export
- ✅ Misalignment between editor and export
- ✅ Coordinate system inconsistency

## Files Modified

- `src/utils/sceneExporter.js` - Scene with all layers export
- `src/utils/cameraExporter.js` - Camera view export
- `src/utils/layerExporter.js` - Individual layer export

All three files now use consistent top-left corner positioning.
