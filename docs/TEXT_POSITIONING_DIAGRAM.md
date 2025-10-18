# Text Positioning Fix - Visual Diagram

## Before Fix (Issue State)

```
Scene (1920 x 1080)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              Camera Viewport (800 x 450)                     │
│              ┌────────────────────────┐                      │
│              │                        │                      │
│              │   "Votre texte ici"    │  ← Text appeared    │
│              │        (wrong)         │     above center    │
│              │          ★             │  ← Camera center    │
│              │      (400, 225)        │                      │
│              │                        │                      │
│              └────────────────────────┘                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Problem: Text position calculated as cameraCenterY - (scaledHeight / 2)
         This moved text ABOVE the intended center position
         Result: Text at Y=201.96 instead of Y=225 (23px too high)
```

## After Fix (Corrected)

```
Scene (1920 x 1080)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              Camera Viewport (800 x 450)                     │
│              ┌────────────────────────────┐                  │
│              │                            │                  │
│              │          ★                 │  ← Camera center │
│              │  "Votre texte ici"         │  ← Text centered │
│              │      (centered)            │     at center    │
│              │                            │                  │
│              │                            │                  │
│              └────────────────────────────┘                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Fixed: Text position = cameraCenterY (no offset)
       Canvas renders with textBaseline='middle' at this position
       Konva uses offsetY to center text at this position
       Result: Text perfectly centered at Y=225
```

## Coordinate Systems Comparison

### Before Fix - Inconsistent Systems

```
┌─────────────────────────┐     ┌─────────────────────────┐
│   Text Layer Creation   │     │    Canvas Export        │
│                         │     │                         │
│  position.x = centerX   │────>│  textAlign = 'center'   │
│  position.y = centerY   │     │  textBaseline = 'middle'│
│             - offset ✗  │     │                         │
│                         │     │  Expects center position│
│  Creates offset position│     │  but gets offset position│
└─────────────────────────┘     └─────────────────────────┘
                                        ↓
                                   MISMATCH ✗
```

### After Fix - Consistent Center-Based

```
┌─────────────────────────┐     ┌─────────────────────────┐
│   Text Layer Creation   │     │    Canvas Export        │
│                         │     │                         │
│  position.x = centerX ✓ │────>│  textAlign = 'center'   │
│  position.y = centerY ✓ │     │  textBaseline = 'middle'│
│                         │     │                         │
│  Creates center position│     │  Uses center position   │
└─────────────────────────┘     └─────────────────────────┘
                                        ↓
                                   ALIGNED ✓

┌─────────────────────────┐
│    Konva Editor         │
│                         │
│  x = position.x         │
│  y = position.y         │
│  offsetX = width/2 ✓    │  ← Shifts anchor to center
│  offsetY = height/2 ✓   │  ← Shifts anchor to center
│                         │
│  Renders at center      │
└─────────────────────────┘
        ↓
    ALIGNED ✓
```

## Calculation Details

### Old Calculation (Incorrect)
```
Scene: 1920 x 1080
Camera: 800 x 450 at position (0.5, 0.5)

cameraCenterX = 0.5 * 1920 = 960
cameraCenterY = 0.5 * 1080 = 540

estimatedHeight = 48 * 1.2 = 57.6
scaledHeight = 57.6 * 0.8 = 46.08

initialX = 960              ✓ Correct
initialY = 540 - 23.04      ✗ Wrong! (516.96)
           ^^^^^^^^^^^^
           This offset moved text up

In camera viewport:
cameraViewportLeft = 560
cameraViewportTop = 315

layerX = 960 - 560 = 400    ✓ Centered horizontally
layerY = 516.96 - 315 = 201.96  ✗ Above center (should be 225)
```

### New Calculation (Correct)
```
Scene: 1920 x 1080
Camera: 800 x 450 at position (0.5, 0.5)

cameraCenterX = 0.5 * 1920 = 960
cameraCenterY = 0.5 * 1080 = 540

initialX = 960              ✓ Correct
initialY = 540              ✓ Correct (no offset!)

In camera viewport:
cameraViewportLeft = 560
cameraViewportTop = 315

layerX = 960 - 560 = 400    ✓ Centered horizontally (400/800)
layerY = 540 - 315 = 225    ✓ Centered vertically (225/450)
```

## Thumbnail Generation Impact

### Before Fix
```
Thumbnail (320 x 180)
┌──────────────────┐
│   "Votre texte"  │  ← Text too high
│        ★         │  ← Should be here
│                  │
└──────────────────┘

Issue: Text rendered at Y=80.78 instead of Y=90 (9.22px too high)
       Same proportional error as main viewport
```

### After Fix
```
Thumbnail (320 x 180)
┌──────────────────┐
│                  │
│  "Votre texte"   │  ← Text centered
│        ★         │  ← At center
│                  │
└──────────────────┘

Fixed: Text rendered at Y=90 (exactly centered)
       Matches main viewport behavior
```

## Code Changes Summary

### 1. useLayerCreation.ts
```typescript
// BEFORE (Wrong)
const scaledHeight = estimatedHeight * cameraZoom;
const initialY = cameraCenterY - (scaledHeight / 2);  // ✗ Offset

// AFTER (Correct)
const initialY = cameraCenterY;  // ✓ No offset, position IS center
```

### 2. LayerText.tsx
```typescript
// BEFORE (Wrong - no offsets)
<Text
  x={layer.position?.x}
  y={layer.position?.y}
  // No offsetX or offsetY
  // Position treated as top-left
/>

// AFTER (Correct - with dynamic offsets)
const [textOffsets, setTextOffsets] = useState({ offsetX: 0, offsetY: 0 });

useEffect(() => {
  if (textRef.current) {
    const width = node.width();
    const height = node.height();
    setTextOffsets({
      offsetX: align === 'center' ? width / 2 : 0,
      offsetY: height / 2
    });
  }
}, [dependencies]);

<Text
  x={layer.position?.x}
  y={layer.position?.y}
  offsetX={textOffsets.offsetX}  // ✓ Centers horizontally
  offsetY={textOffsets.offsetY}  // ✓ Centers vertically
/>
```

### 3. sceneExporter.ts
```javascript
// Remained unchanged - was already correct
ctx.textAlign = align;       // 'center' for centered text
ctx.textBaseline = 'middle'; // Position is vertical center
ctx.fillText(line, 0, yOffset);
```

## Impact on Existing Scenes

⚠️ **Note**: Existing scenes created before this fix may need adjustment:
- Text layers created with the old logic will appear ~23px lower than before
- This is expected and correct - they were previously positioned incorrectly
- Users can reposition text layers if needed using the editor

The new positioning is correct and will prevent this issue for all future text layers.
