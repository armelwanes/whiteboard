# Camera Export Improvements

## Overview
Enhanced camera export functionality to handle default camera positions more efficiently and improve layer rendering accuracy.

## Key Changes

### 1. Default Camera Position Detection
- **New Function**: `isDefaultCameraPosition(camera)`
- Checks if a camera is at the default position (0.5, 0.5) with `isDefault: true`
- Uses tolerance of 0.001 for floating-point comparison
- Returns `true` only if both position and `isDefault` flag match

### 2. Export Behavior

#### Default Camera Export
When exporting a camera at default position:
- **Before**: Always generated image file
- **After**: Saves JSON config only (no image file)
- Config includes: id, name, position, width, height, zoom, isDefault flag

#### Custom Camera Export  
Cameras at non-default positions:
- Exports as PNG image with all layers rendered
- Maintains existing behavior

### 3. Layer Rendering Improvements

#### Image Layers
- Images now centered on their position point
- Calculation: `position - (imageSize / 2)` for both X and Y
- Properly accounts for scale and opacity

#### Text Layers
- Text centered vertically using `textBaseline: 'middle'`
- Supports multi-line text with proper line spacing
- Respects text alignment (left, center, right)

#### Shape Layers
- Shapes centered on their position point
- Supports: rectangle, circle, line
- Properly handles fill and stroke modes

### 4. Camera Viewport Calculation
- **Fixed**: Camera viewport now properly centered on position
- Formula: `cameraX = (position.x * sceneWidth) - (cameraWidth / 2)`
- Ensures accurate layer positioning relative to camera

### 5. New Export Function: Individual Layers
- **New Function**: `exportLayerAsImage(layer, width, height)`
- Exports a single layer with white background
- Layer is centered on canvas
- Useful for exporting individual elements

## API Changes

### `exportDefaultCameraView(scene, sceneWidth, sceneHeight)`
**Returns:**
```javascript
{
  configOnly: boolean,
  config: {
    id: string,
    name: string,
    position: { x, y },
    width: number,
    height: number,
    zoom: number,
    isDefault: boolean
  },
  imageDataUrl: string | null
}
```

### `exportAllCameras(scene, sceneWidth, sceneHeight)`
**Returns:**
```javascript
[
  {
    camera: object,
    imageDataUrl: string | null,
    cameraName: string,
    isDefault: boolean,
    configOnly: boolean,
    config?: object  // Only present if configOnly is true
  }
]
```

### `exportLayerAsImage(layer, canvasWidth, canvasHeight)`
**New Function**
**Returns:** `Promise<string>` - Data URL of layer image

### `isDefaultCameraPosition(camera)`
**New Function**
**Returns:** `boolean` - True if camera is at default position

## UI Changes

### LayerEditor Component

#### Export Default Camera Button
- If camera is at default position: Downloads JSON config file
- If camera is custom position: Downloads PNG image
- Shows appropriate alert message

#### Export All Cameras Button
- Exports each camera according to its position
- Shows summary: X images, Y configs exported
- Default cameras → JSON files
- Custom cameras → PNG images

## Testing

### Test Coverage
- ✅ Default camera at (0.5, 0.5) with isDefault=true
- ✅ Custom camera at different position
- ✅ Camera at default position but isDefault=false
- ✅ Camera near default position (within tolerance)

### Test File
See: `test/camera-export-test.js`

Run with: `node test/camera-export-test.js`

## Benefits

1. **Efficiency**: No need to generate images for default cameras
2. **Accuracy**: Better layer centering and positioning
3. **Flexibility**: JSON config allows easy camera recreation
4. **Storage**: Smaller exports for default camera views
5. **Correctness**: Fixed centering issues mentioned in issue

## Example Usage

```javascript
import { 
  exportDefaultCameraView, 
  exportAllCameras,
  exportLayerAsImage 
} from './utils/cameraExporter';

// Export default camera
const result = await exportDefaultCameraView(scene);
if (result.configOnly) {
  // Save config as JSON
  const json = JSON.stringify(result.config, null, 2);
  // ... download JSON file
} else {
  // Download image
  downloadImage(result.imageDataUrl, 'camera.png');
}

// Export all cameras
const exports = await exportAllCameras(scene);
exports.forEach(exp => {
  if (exp.configOnly) {
    // Save JSON config
  } else {
    // Download image
    downloadImage(exp.imageDataUrl, `${exp.cameraName}.png`);
  }
});

// Export single layer
const layerImage = await exportLayerAsImage(layer, 800, 450);
downloadImage(layerImage, 'layer.png');
```

## Migration Notes

- Existing code using `exportDefaultCameraView` needs to check `result.configOnly`
- Existing code using `exportAllCameras` needs to check `exp.configOnly` for each export
- JSON config files use `.json` extension instead of `.png`
- Config files can be used to recreate camera without image capture

## Related Issues

- Fixes: "save image" issue
- Addresses: Camera not properly centered
- Implements: JSON config export for default cameras
- Improves: Layer rendering with white background
