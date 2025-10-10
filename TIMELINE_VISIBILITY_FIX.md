# Timeline Visibility Fix

## Issue Summary

The user reported that the timeline was hidden when scenes are very long ("le timeline est caché parce que la scene est tres longue").

## Problem Analysis

The `AnimationContainer` component uses a flex column layout:
```jsx
<div className="animation-container w-full h-full flex flex-col">
  <div className="animation-stage flex-1 ...">
    {/* Scene content */}
  </div>
  <div className="timeline-container p-4">
    {/* Timeline controls */}
  </div>
</div>
```

The issue was that:
1. The `animation-stage` had `flex-1` which makes it grow to fill available space
2. When scenes are tall/long, the animation-stage would expand beyond the viewport
3. The timeline at the bottom would be pushed off-screen and become inaccessible

## Solution Implemented

### AnimationContainer.jsx Changes

**Before:**
```jsx
<div className="animation-stage flex-1 relative overflow-hidden ...">
```

**After:**
```jsx
<div className="animation-stage flex-1 min-h-0 relative overflow-hidden ...">
```

**Before:**
```jsx
<div className="timeline-container p-4">
```

**After:**
```jsx
<div className="timeline-container p-4 flex-shrink-0">
```

### Explanation

1. **`min-h-0` on animation-stage**: 
   - Prevents the flex item from growing beyond its allocated space
   - Works with `overflow-hidden` to contain the content
   - Ensures the flex container properly constrains child sizes

2. **`flex-shrink-0` on timeline-container**:
   - Prevents the timeline from being squeezed when space is limited
   - Ensures the timeline always maintains its natural height
   - Guarantees the timeline remains visible at the bottom

### CSS Flexbox Behavior

In a flex column layout:
- `flex-1` = grow to fill space (can cause overflow)
- `min-h-0` = don't exceed parent constraints (respects flex sizing)
- `flex-shrink-0` = never shrink below natural size (always visible)

## Result

✅ The timeline now remains visible and accessible at all times, regardless of scene length or height.

## Testing

To test the fix:
1. Create or edit a scene with very long content
2. Verify the timeline remains visible at the bottom of the viewport
3. The animation stage should properly constrain its content with scrolling if needed
4. The timeline controls should always be accessible

## Files Modified

- `src/components/AnimationContainer.jsx` (2 lines changed)

## Related Issues

This addresses the first part of the issue: "le timeline est caché parce que la scene est tres longue donc ajuste bien pour que l'on voit le timeline"
