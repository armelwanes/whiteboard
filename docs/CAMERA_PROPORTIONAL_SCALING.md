# Camera-Proportional Image Scaling Implementation

## Overview
Implemented automatic camera-proportional scaling for cropped/uploaded images to ensure they fit within the camera viewport and are properly centered.

## Problem Statement
The original issue (in French) described:
> "en faite l'image crop doit etre proportionnel par rapport scene parce que l'image cropper peu etre tres grand, il faut que ca ssoit proportionnel au camera actuel et il soit centrer sur celui ci"

Translation: The cropped image must be proportional to the scene because the cropped image can be very large. It must be proportional to the current camera and centered on it.

### Issues Identified:
1. Large images were added at full scale (1.0) regardless of camera size
2. Images were not automatically fitted to camera viewport
3. No automatic centering within camera view
4. Export images didn't properly show camera-centered content

## Solution

### Changes Made

#### 1. ImageCropModal.jsx
Modified to extract and pass image dimensions to the parent component:

```javascript
const handleCropComplete = async () => {
  let imageDimensions = null;
  
  if (completedCrop && imgRef.current) {
    // For cropped images, use canvas dimensions
    imageDimensions = {
      width: canvas.width,
      height: canvas.height
    };
  } else if (imgRef.current) {
    // For full images, use natural dimensions
    imageDimensions = {
      width: imgRef.current.naturalWidth,
      height: imgRef.current.naturalHeight
    };
  }
  
  // Pass dimensions to callback
  onCropComplete(finalImageUrl, imageDimensions);
};
```

#### 2. LayerEditor.jsx
Enhanced to calculate proportional scale based on camera viewport:

```javascript
const handleCropComplete = (croppedImageUrl, imageDimensions) => {
  // Get camera dimensions (default: 800x450)
  let cameraWidth = 800;
  let cameraHeight = 450;
  
  if (selectedCamera) {
    cameraWidth = selectedCamera.width || 800;
    cameraHeight = selectedCamera.height || 450;
  }
  
  // Calculate scale to fit within 80% of camera viewport
  let calculatedScale = 1.0;
  if (imageDimensions) {
    const maxWidth = cameraWidth * 0.8;
    const maxHeight = cameraHeight * 0.8;
    
    const scaleX = maxWidth / imageDimensions.width;
    const scaleY = maxHeight / imageDimensions.height;
    
    // Use smaller scale to ensure it fits both dimensions
    // Never scale up (min with 1.0)
    calculatedScale = Math.min(scaleX, scaleY, 1.0);
  }
  
  // Create layer with calculated scale
  const newLayer = {
    // ...
    scale: calculatedScale,
    position: { 
      x: selectedCamera.position.x * sceneWidth,  // Centered on camera
      y: selectedCamera.position.y * sceneHeight
    }
  };
};
```

## Algorithm Details

### Scale Calculation
1. **Get camera dimensions**: Width and height of current camera (default: 800x450)
2. **Calculate max dimensions**: 80% of camera size to leave margin
   - maxWidth = cameraWidth * 0.8
   - maxHeight = cameraHeight * 0.8
3. **Calculate scale ratios**:
   - scaleX = maxWidth / imageWidth
   - scaleY = maxHeight / imageHeight
4. **Select final scale**: `min(scaleX, scaleY, 1.0)`
   - Ensures image fits both dimensions
   - Never scales up (preserves quality)

### Example Calculations

#### Small Image (400x300)
- Camera: 800x450
- Max: 640x360
- scaleX = 640/400 = 1.6
- scaleY = 360/300 = 1.2
- **Final**: min(1.6, 1.2, 1.0) = **1.0** (no scaling)

#### Large Image (2000x1500)
- Camera: 800x450
- Max: 640x360
- scaleX = 640/2000 = 0.32
- scaleY = 360/1500 = 0.24
- **Final**: min(0.32, 0.24, 1.0) = **0.24** (scaled down)

## Testing

### Test Cases

#### Test 1: Small Image (No Scaling)
- **Input**: 400x300 PNG
- **Expected**: scale = 1.0
- **Result**: ✅ PASS (scale = 1.00)

#### Test 2: Large Image (Auto-Scaling)
- **Input**: 2000x1500 PNG
- **Expected**: scale = 0.24
- **Result**: ✅ PASS (scale = 0.24)

### Manual Testing Steps
1. Open LayerEditor for a scene
2. Click "Add Image"
3. Upload test_star.png (400x300)
4. Click "Apply Crop"
5. Verify scale = 1.00
6. Add another image: large-test.png (2000x1500)
7. Click "Use Full Image"
8. Verify scale = 0.24

## Benefits

1. **Automatic Fitting**: Images automatically fit within camera viewport
2. **Quality Preservation**: Never scales up, only down
3. **Proper Centering**: Images positioned at camera center
4. **Aspect Ratio**: Maintains original aspect ratio
5. **User Experience**: No manual scaling needed
6. **Export Quality**: Exported images properly centered on camera

## Related Files

- `src/components/ImageCropModal.jsx`: Image dimension extraction
- `src/components/LayerEditor.jsx`: Scale calculation logic
- `src/utils/cameraExporter.js`: Export functionality (already handles centering)

## Future Enhancements

Possible improvements for future iterations:
1. Allow users to adjust the margin percentage (currently 80%)
2. Add visual indicator showing camera viewport during image upload
3. Support for different aspect ratio cameras
4. Option to override auto-scaling for advanced users

## Compatibility

- Works with existing camera system
- Compatible with all camera sizes
- Maintains backward compatibility with existing scenes
- No breaking changes to API or data structure

## Related Documentation

- `CAMERA_EXPORT_IMPROVEMENTS.md`: Camera export system
- `LAYER_CAMERA_POSITIONING_FIX.md`: Layer positioning
- `EXPORT_EXAMPLES.md`: Export examples and calculations
