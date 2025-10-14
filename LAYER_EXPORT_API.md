# Layer Export API Documentation

## Overview

The Layer Export API provides functionality to export individual layers from JSON scene data to PNG images. Unlike screenshot-based exports, this API reconstructs layers from their JSON definitions, ensuring reliable and reproducible output.

## Features

- ✅ Export layers from JSON (no screenshot/DOM capture)
- ✅ Support for all layer types: image, text, shape, whiteboard
- ✅ White background (default) or transparent
- ✅ Configurable pixel ratio for high-resolution exports
- ✅ Proper handling of transformations (position, scale, rotation)
- ✅ CORS-friendly image loading
- ✅ Whiteboard strokes with smooth curves
- ✅ JSON validation

## API Reference

### `exportLayerFromJSON(layer, options)`

Export a single layer to PNG from JSON data.

**Parameters:**
- `layer` (object) - Layer object from JSON scene
- `options` (object) - Export options:
  - `width` (number) - Canvas width in pixels (default: 1920)
  - `height` (number) - Canvas height in pixels (default: 1080)
  - `background` (string) - Background color (default: '#FFFFFF', use 'transparent' for no background)
  - `pixelRatio` (number) - Pixel ratio for high-res export (default: 1, use 2 or 3 for retina displays)
  - `sceneWidth` (number) - Scene width for positioning context (default: 9600)
  - `sceneHeight` (number) - Scene height for positioning context (default: 5400)
  - `sceneBackgroundImage` (string) - Optional scene background image URL to render behind the layer (whiteboard background)

**Returns:** `Promise<string>` - Data URL of the exported PNG

**Example:**
```javascript
import { exportLayerFromJSON } from './utils/layerExporter';

const layer = {
  id: 'text-1',
  type: 'text',
  position: { x: 960, y: 540 },
  text_config: {
    text: 'Hello World',
    font: 'Arial',
    size: 48,
    color: [0, 0, 0]
  }
};

const dataUrl = await exportLayerFromJSON(layer, {
  width: 1920,
  height: 1080,
  background: '#FFFFFF',
  pixelRatio: 2
});

// Download the image
const a = document.createElement('a');
a.href = dataUrl;
a.download = 'text-layer.png';
a.click();
```

### `exportSceneLayer(scene, layerId, options)`

Export a specific layer from a scene by its ID.

**Parameters:**
- `scene` (object) - Scene object with layers array
- `layerId` (string) - ID of the layer to export
- `options` (object) - Same options as `exportLayerFromJSON`

**Returns:** `Promise<string>` - Data URL of the exported PNG

**Example:**
```javascript
import { exportSceneLayer } from './utils/layerExporter';

const scene = {
  layers: [
    {
      id: 'layer-1',
      type: 'image',
      image_path: '/test.png',
      position: { x: 100, y: 100 }
    }
  ]
};

const dataUrl = await exportSceneLayer(scene, 'layer-1', {
  background: 'transparent',
  pixelRatio: 3
});
```

### `validateLayerJSON(layer)`

Validate a layer object against the expected JSON schema.

**Parameters:**
- `layer` (object) - Layer object to validate

**Returns:** `object` - Validation result
  - `valid` (boolean) - Whether the layer is valid
  - `errors` (string[]) - Array of error messages

**Example:**
```javascript
import { validateLayerJSON } from './utils/layerExporter';

const layer = {
  id: 'test-1',
  type: 'image',
  image_path: '/test.png'
};

const result = validateLayerJSON(layer);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### `downloadDataUrl(dataUrl, filename)`

Helper function to download a data URL as a file.

**Parameters:**
- `dataUrl` (string) - Data URL to download
- `filename` (string) - Filename for the download

**Example:**
```javascript
import { exportLayerFromJSON, downloadDataUrl } from './utils/layerExporter';

const dataUrl = await exportLayerFromJSON(layer);
downloadDataUrl(dataUrl, 'my-layer.png');
```

## Layer JSON Schema

### Common Properties

All layers share these properties:

```json
{
  "id": "unique-id",
  "type": "image|text|shape|whiteboard",
  "position": { "x": 960, "y": 540 },
  "z_index": 1,
  "scale": 1.0,
  "opacity": 1.0,
  "rotation": 0
}
```

### Image Layer

```json
{
  "id": "img-1",
  "type": "image",
  "image_path": "/path/to/image.png",
  "position": { "x": 960, "y": 540 },
  "scale": 1.0,
  "opacity": 1.0,
  "rotation": 0
}
```

### Text Layer

```json
{
  "id": "text-1",
  "type": "text",
  "position": { "x": 960, "y": 540 },
  "text_config": {
    "text": "Hello World\nMultiline text",
    "font": "Arial",
    "size": 48,
    "color": [0, 102, 204],
    "style": "normal|bold|italic|bold_italic",
    "line_height": 1.2,
    "align": "left|center|right"
  }
}
```

### Shape Layer

```json
{
  "id": "shape-1",
  "type": "shape",
  "position": { "x": 960, "y": 540 },
  "shape_config": {
    "shape_type": "rectangle|circle|line|triangle|star",
    "width": 100,
    "height": 100,
    "fill_color": [255, 0, 0],
    "stroke_color": [0, 0, 0],
    "stroke_width": 2,
    "fill_mode": "fill|stroke|both"
  }
}
```

### Whiteboard Layer

```json
{
  "id": "whiteboard-1",
  "type": "whiteboard",
  "position": { "x": 960, "y": 540 },
  "strokes": [
    {
      "points": [
        { "x": 0, "y": 0 },
        { "x": 10, "y": 10 },
        { "x": 20, "y": 5 }
      ],
      "strokeWidth": 3,
      "strokeColor": "#FF0000",
      "lineJoin": "round",
      "lineCap": "round"
    }
  ]
}
```

## Export Options

### Background

- `'#FFFFFF'` - White background (default)
- `'#000000'` - Black background
- `'transparent'` - Transparent background
- Any valid CSS color value

### Pixel Ratio

Controls the resolution multiplier:

- `1` - Standard resolution (1920×1080)
- `2` - Retina/2x resolution (3840×2160)
- `3` - Ultra-high resolution (5760×3240)

Higher pixel ratios produce larger files but sharper images.

### Canvas Dimensions

Standard sizes:
- 1920×1080 (Full HD)
- 3840×2160 (4K)
- 1280×720 (HD)
- 800×450 (Thumbnail)

## Use Cases

### 1. Export Single Layer

```javascript
const dataUrl = await exportLayerFromJSON(layer, {
  width: 1920,
  height: 1080,
  background: '#FFFFFF',
  pixelRatio: 1
});
downloadDataUrl(dataUrl, 'layer.png');
```

### 2. Export with Transparent Background

```javascript
const dataUrl = await exportLayerFromJSON(layer, {
  background: 'transparent'
});
```

### 3. Export High-Resolution

```javascript
const dataUrl = await exportLayerFromJSON(layer, {
  pixelRatio: 3  // 3x resolution
});
```

### 4. Export Layer with Scene Background (Whiteboard)

```javascript
const layer = {
  id: 'img-1',
  type: 'image',
  image_path: '/layer-image.png',
  position: { x: 960, y: 540 },
  scale: 1.0
};

// Export layer with scene background image behind it
const dataUrl = await exportLayerFromJSON(layer, {
  sceneBackgroundImage: '/whiteboard-background.png'
});

// This renders the background first, then the layer on top at its recorded position
```

### 5. Export Whiteboard Layer

```javascript
const whiteboardLayer = {
  id: 'whiteboard-1',
  type: 'whiteboard',
  position: { x: 960, y: 540 },
  strokes: [
    {
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ],
      strokeWidth: 3,
      strokeColor: '#000000'
    }
  ]
};

const dataUrl = await exportLayerFromJSON(whiteboardLayer);
```

### 6. Batch Export Multiple Layers

```javascript
const scene = { layers: [...] };

for (const layer of scene.layers) {
  const dataUrl = await exportLayerFromJSON(layer);
  downloadDataUrl(dataUrl, `${layer.id}.png`);
}
```

## Error Handling

### Image Load Errors

If an image layer references an unavailable image:

```javascript
try {
  const dataUrl = await exportLayerFromJSON(imageLayer);
} catch (error) {
  console.error('Export failed:', error.message);
  // Error: "Failed to load image: /path/to/missing.png"
}
```

### Validation Errors

```javascript
const validation = validateLayerJSON(layer);
if (!validation.valid) {
  throw new Error(`Invalid layer: ${validation.errors.join(', ')}`);
}
```

### Type Errors

```javascript
try {
  await exportLayerFromJSON(unsupportedLayer);
} catch (error) {
  // Error: "Unsupported layer type: custom"
}
```

## CORS Considerations

When exporting image layers that reference external URLs:

1. Set `crossOrigin='anonymous'` on images (handled automatically)
2. Ensure the image server sends appropriate CORS headers
3. For local development, use a CORS proxy or local server

**Example CORS headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## Performance Tips

1. **Batch Exports:** Use `Promise.all()` to export multiple layers in parallel
2. **Pixel Ratio:** Use lower ratios for previews, higher for final exports
3. **Image Preloading:** Preload images before export to reduce wait time
4. **Canvas Reuse:** For multiple exports, consider reusing canvas elements

## Limitations

- ZIP export for multiple layers not yet implemented (use individual exports)
- Group layers (nested layers) not yet supported
- Video/animated layers not supported
- Maximum canvas size limited by browser (typically 16384×16384)

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Supported with smaller canvas limits

## Migration from Screenshot-Based Export

**Before (screenshot-based):**
```javascript
const canvas = document.querySelector('canvas');
const dataUrl = canvas.toDataURL('image/png');
```

**After (JSON-based):**
```javascript
const dataUrl = await exportLayerFromJSON(layer, options);
```

**Benefits:**
- No dependency on DOM/visible canvas
- Consistent output regardless of viewport
- Server-side compatible (with canvas polyfill)
- Better control over quality and size

## Testing

Run the test suite:

```bash
node test/layer-export-test.js
```

Tests cover:
- JSON validation for all layer types
- Invalid/missing fields
- Complex configurations
- Edge cases

## Examples

See `/examples/layer-export-example.json` for complete scene examples with all layer types.

## Support

For issues or questions:
1. Check this documentation
2. Review example files in `/examples/`
3. Run test suite for validation
4. Check browser console for error messages
