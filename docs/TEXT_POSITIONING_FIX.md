# Text Layer Positioning Fix

## Issue Description

Text layers were not properly centered in:
1. Scene thumbnails - text appeared in the upper portion instead of centered
2. Scene exports - text position was inconsistent with the editor view
3. Imported scenes - text appeared off-center when loading saved scenes

As reported in the issue:
> "la position du texte sur le thumbnail du scene ne va pas bien, meme sur la scene il ne pas totalement centre au milieu du camera quand on l'importe"
> (Translation: "the text position on the scene thumbnail is not good, even on the scene it is not totally centered in the middle of the camera when imported")

## Root Cause Analysis

The issue stemmed from inconsistent text positioning logic across three components:

### 1. Text Layer Creation (`useLayerCreation.ts`)
```typescript
// OLD CODE - INCORRECT
const scaledHeight = estimatedHeight * cameraZoom;
const initialY = cameraCenterY - (scaledHeight / 2);  // ❌ Offset shifts text upward
```

This calculation assumed the text position would be the **top-left corner**, and tried to center the text by offsetting it upward by half its height. However, this conflicted with how the text was actually rendered.

### 2. Canvas Export Rendering (`sceneExporter.ts`)
```javascript
ctx.textAlign = align;      // 'center' for centered text
ctx.textBaseline = 'middle'; // 'middle' means y is the vertical center
ctx.fillText(line, 0, yOffset);
```

The Canvas rendering used `textBaseline='middle'`, which interprets the y-coordinate as the **vertical center** of the text, not the top edge. This conflicted with the offset calculation in text creation.

### 3. Konva Editor Rendering (`LayerText.tsx`)
```jsx
<Text
  x={layer.position?.x || 0}
  y={layer.position?.y || 0}
  align={align}
  // No offsetX or offsetY - defaults to top-left positioning
/>
```

Konva Text by default uses the x,y as the **top-left corner** of the text bounding box, regardless of the `align` property (which only affects multi-line text alignment within the box).

## The Problem Visualized

```
Camera viewport (800 x 450):
┌────────────────────────────────────┐
│                                    │
│         Center: (400, 225)         │  ← Intended text position
│                                    │
│              ★ (red)               │  ← Camera center
│                                    │
│                                    │
│   "Votre texte ici" ◄── BEFORE    │  ← Text appeared here (above center)
│                                    │
│                                    │
└────────────────────────────────────┘

Expected:
┌────────────────────────────────────┐
│                                    │
│              ★ (red)               │  ← Camera center
│       "Votre texte ici" ◄── AFTER │  ← Text centered here
│                                    │
│                                    │
└────────────────────────────────────┘
```

## Solution Implemented

### 1. Unified Positioning System
Aligned all components to use **center-based positioning**: the text position coordinate represents the center point of the text.

### 2. Changes Made

#### A. `useLayerCreation.ts` - Removed Vertical Offset
```typescript
// NEW CODE - CORRECT
const initialX = cameraCenterX;
const initialY = cameraCenterY;  // ✅ No offset, position IS the center
```

#### B. `LayerText.tsx` - Added Konva Offsets
```typescript
// Calculate offsets to center the text at its position
const [textOffsets, setTextOffsets] = useState({ offsetX: 0, offsetY: 0 });

useEffect(() => {
  if (textRef.current) {
    const width = node.width();
    const height = node.height();
    
    setTextOffsets({
      offsetX: align === 'center' ? width / 2 : 0,  // Center horizontally
      offsetY: height / 2                            // Center vertically
    });
  }
}, [layer.text_config?.text, layer.text_config?.size, ...]);

<Text
  offsetX={textOffsets.offsetX}
  offsetY={textOffsets.offsetY}
  // ... other props
/>
```

This makes Konva interpret the position as the center point, matching the Canvas export behavior.

#### C. `sceneExporter.ts` - Kept Center-Based Rendering
No changes needed - the Canvas export was already using center-based positioning with `textBaseline='middle'`.

## Mathematical Verification

Given:
- Scene size: 1920 x 1080
- Camera size: 800 x 450
- Camera position: (0.5, 0.5) - center of scene
- Font size: 48px
- Scale: 0.8

**Before Fix:**
```
cameraCenterX = 0.5 * 1920 = 960
cameraCenterY = 0.5 * 1080 = 540
estimatedHeight = 48 * 1.2 = 57.6
scaledHeight = 57.6 * 0.8 = 46.08

initialX = 960  ✓
initialY = 540 - 23.04 = 516.96  ✗ (above center)

In camera viewport:
cameraX = 960 - 400 = 560
cameraY = 540 - 225 = 315

layerX = 960 - 560 = 400  ✓ (centered)
layerY = 516.96 - 315 = 201.96  ✗ (above center of 450px viewport)
```

**After Fix:**
```
initialX = 960  ✓
initialY = 540  ✓ (at center)

In camera viewport:
layerX = 960 - 560 = 400  ✓ (centered)
layerY = 540 - 315 = 225  ✓ (centered in 450px viewport)
```

## Testing

### Manual Testing Steps
1. Create a new scene
2. Add a text layer (should appear centered in camera view)
3. Generate thumbnail (text should be centered in thumbnail)
4. Export scene and re-import (text should remain centered)

### Visual Test Files
Created test HTML files in `/tmp/`:
- `text-position-test.html` - Visual tests showing centered text
- `text-position-fix-comparison.html` - Before/after comparison

## Impact

### Fixed Issues
✅ Text appears centered in scene thumbnails
✅ Text position consistent between editor and export
✅ Text remains centered when scenes are imported
✅ Multi-line text properly centered
✅ Text with different scales/zooms centered correctly

### Potential Side Effects
⚠️ **Existing scenes with text layers may need repositioning**: Text created before this fix will appear lower than before (as they were previously offset upward). This is expected and correct behavior.

## Code Quality

- ✅ Build passes with no errors
- ✅ TypeScript compilation successful
- ✅ Follows existing code patterns
- ✅ Dynamic offset calculation prevents hardcoded values
- ✅ Maintains compatibility with existing features (rotation, scaling, etc.)

## Related Files Modified

1. `src/components/molecules/layer-management/useLayerCreation.ts`
2. `src/components/molecules/canvas/LayerText.tsx`
3. `src/utils/sceneExporter.ts` (reverted to maintain center-based rendering)

## Future Considerations

1. Consider adding a migration script for existing scenes to update text positions
2. Document the positioning system for future developers
3. Add unit tests for text positioning calculations
4. Consider adding visual regression tests for text rendering

## References

- Issue: "thumbnail and layer texte"
- Canvas API textBaseline: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline
- Canvas API textAlign: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
- Konva Text: https://konvajs.org/docs/shapes/Text.html
