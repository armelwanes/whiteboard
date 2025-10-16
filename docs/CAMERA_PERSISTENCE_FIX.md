# Camera Persistence Fix

## Issue Description

**Original Issue (French):**
> "les camera ne pas enregistrer quand je change de scene et revient au precedent les cameras ne sont plus la sauf le camera par defaut"

**Translation:**
> "the cameras are not saved when I change scenes and return to the previous one, the cameras are no longer there except for the default camera"

## Problem Analysis

When users added custom cameras to a scene and then switched to another scene and back, all custom cameras were lost - only the default camera remained.

### Root Cause

The issue was in `src/components/SceneCanvas.jsx` at three callback locations where camera updates were being persisted:

1. `handleAddCamera` (line 146)
2. `handleUpdateCamera` (line 157)  
3. `handleDeleteCamera` (line 176)

**Before:**
```jsx
onUpdateScene({ ...scene, sceneCameras: updatedCameras });
```

**Problem:** The `scene` prop was a stale reference that didn't include other updates made to `editedScene` in the parent `LayerEditor` component. When spreading `...scene`, it would overwrite fields that had been updated elsewhere, causing data loss.

## Solution Implemented

### Changes Made

Changed all three camera update callbacks to only pass the camera updates without spreading the entire scene object:

**After:**
```jsx
onUpdateScene({ sceneCameras: updatedCameras });
```

### Updated Dependencies

Removed the stale `scene` dependency from the useCallback dependency arrays:

**Before:**
```jsx
}, [sceneCameras, scene, onUpdateScene]);
```

**After:**
```jsx
}, [sceneCameras, onUpdateScene]);
```

### Added Scene Change Detection

Added a new useEffect to reset the `hasInitialCentered` flag when the scene ID changes:

```jsx
// Reset centering flag when scene ID changes
React.useEffect(() => {
  setHasInitialCentered(false);
}, [scene.id]);
```

This ensures that when switching between scenes, the canvas will auto-center on the selected camera again, providing a better user experience.

## Technical Details

### Data Flow

1. **Camera Added:** 
   - `handleAddCamera` → `setSceneCameras(updatedCameras)`
   - `onUpdateScene({ sceneCameras: updatedCameras })`
   - LayerEditor: `setEditedScene({ ...editedScene, sceneCameras: updatedCameras })`
   - SceneCanvas receives updated scene prop
   - useEffect syncs local state with scene.sceneCameras

2. **Scene Switch:**
   - User clicks different scene
   - LayerEditor updates with new scene data
   - SceneCanvas useEffect detects scene.id change
   - Resets centering flag for smooth user experience
   - Loads cameras from scene.sceneCameras (now persisted correctly)

3. **Scene Return:**
   - User switches back to original scene
   - Scene data loaded from localStorage (via App.jsx)
   - Custom cameras are now present in scene.sceneCameras ✅
   - SceneCanvas displays all cameras correctly

### Why This Fix Works

By only passing `{ sceneCameras: updatedCameras }` instead of `{ ...scene, sceneCameras: updatedCameras }`, we ensure:

1. **No Data Overwrites:** Other fields in editedScene are preserved
2. **Proper State Updates:** Only the camera array is updated
3. **Correct Persistence:** When LayerEditor saves, all fields including cameras are saved correctly
4. **Clean Merging:** The spread operator in LayerEditor (`{ ...editedScene, ...updates }`) correctly merges the camera updates

## Files Modified

- **src/components/SceneCanvas.jsx** (10 lines changed)
  - Line 146: `handleAddCamera` - removed scene spread
  - Line 147: Updated dependencies
  - Line 157: `handleUpdateCamera` - removed scene spread  
  - Line 158: Updated dependencies
  - Line 176: `handleDeleteCamera` - removed scene spread
  - Line 177: Updated dependencies
  - Lines 209-212: Added scene ID change detection

## Testing

### Manual Test Steps

1. ✅ Open LayerEditor for Scene 1
2. ✅ Add a custom camera (Camera 1)
3. ✅ Add another camera (Camera 2)  
4. ✅ Position cameras at different locations
5. ✅ Save and close LayerEditor
6. ✅ Switch to Scene 2
7. ✅ Return to Scene 1
8. ✅ Open LayerEditor for Scene 1
9. ✅ **Verify:** Both Camera 1 and Camera 2 are still present
10. ✅ **Verify:** Camera positions are preserved
11. ✅ **Verify:** Default camera is still present

### Expected Results

- ✅ Custom cameras persist across scene switches
- ✅ Default camera always present
- ✅ Camera properties (position, zoom, duration) preserved
- ✅ No data loss when switching scenes
- ✅ Canvas auto-centers on selected camera when returning to scene

## Related Issues

This fix addresses the camera persistence portion of the issue. The timeline visibility portion was already fixed in a previous commit (see `TIMELINE_VISIBILITY_FIX.md`).

## Timeline Visibility Status

Timeline visibility was previously fixed in `src/components/AnimationContainer.jsx`:
- ✅ Line 97: `min-h-0` class prevents animation-stage from overflowing
- ✅ Line 138: `flex-shrink-0` class prevents timeline from being squeezed

Both issues mentioned in the original GitHub issue are now resolved.
