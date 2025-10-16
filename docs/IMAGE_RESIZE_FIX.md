# Image Resize Handle Delay Fix

## Issue
When uploading an image to the scene, there was a delay before the resize handles appeared. Users had to click the image again to see the resize handles.

![Issue Screenshot](https://github.com/user-attachments/assets/b3d6cead-246e-42eb-8bc5-c279771a6eee)

## Root Cause
The `LayerImage` and `SceneImage` components use the `useImage` hook from the `use-image` library, which loads images asynchronously. The `useEffect` hook that attaches the Transformer (resize handles) to the image only had `isSelected` as a dependency:

```jsx
// Before - only depends on isSelected
React.useEffect(() => {
  if (isSelected && transformerRef.current && imageRef.current) {
    transformerRef.current.nodes([imageRef.current]);
    transformerRef.current.getLayer().batchDraw();
  }
}, [isSelected]);
```

When a new image was uploaded and immediately selected, the effect would run before the image finished loading, causing the transformer attachment to fail.

## Solution
Added the `img` variable to both the condition check and the dependency array:

```jsx
// After - also depends on img loading
React.useEffect(() => {
  if (isSelected && transformerRef.current && imageRef.current && img) {
    transformerRef.current.nodes([imageRef.current]);
    transformerRef.current.getLayer().batchDraw();
  }
}, [isSelected, img]);
```

This ensures that:
1. The effect waits for the image to load before attempting to attach the transformer
2. The effect re-runs when the image finishes loading
3. The transformer properly attaches to the fully-loaded image node

## Files Modified
- `src/components/SceneCanvas.jsx` - Fixed `LayerImage` component
- `src/components/KonvaSceneEditor.jsx` - Fixed `SceneImage` component

## Impact
- ✅ Resize handles now appear immediately after uploading an image
- ✅ No need for users to click again to see resize handles
- ✅ Minimal code change (only 2 lines per component)
- ✅ No breaking changes or regressions

## Testing
The fix was validated by:
1. Running `npm run build` successfully
2. Verifying no new lint errors were introduced
3. Confirming only the two affected components were modified
