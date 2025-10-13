/**
 * Demonstration script for Layer Export from JSON
 * Shows how to use the layer export API programmatically
 * 
 * This is a Node.js compatible demo that can be adapted for browser use.
 * In browser, you would use the actual canvas API.
 */

// Example scene with various layer types
const demoScene = {
  id: "demo-scene",
  title: "Export Demo Scene",
  layers: [
    // Text layer
    {
      id: "text-1",
      type: "text",
      position: { x: 960, y: 200 },
      scale: 1.0,
      opacity: 1.0,
      rotation: 0,
      text_config: {
        text: "Hello from JSON Export!",
        font: "Arial",
        size: 64,
        color: [0, 102, 204],
        style: "bold",
        align: "center",
        line_height: 1.2
      }
    },
    
    // Shape layer
    {
      id: "shape-1",
      type: "shape",
      position: { x: 960, y: 500 },
      scale: 1.5,
      opacity: 0.8,
      rotation: 45,
      shape_config: {
        shape_type: "star",
        width: 100,
        height: 100,
        fill_color: [255, 193, 7],
        stroke_color: [255, 152, 0],
        stroke_width: 3,
        fill_mode: "both"
      }
    },
    
    // Whiteboard layer with strokes
    {
      id: "whiteboard-1",
      type: "whiteboard",
      position: { x: 500, y: 700 },
      scale: 1.0,
      opacity: 1.0,
      rotation: 0,
      strokes: [
        {
          points: [
            { x: 0, y: 0 },
            { x: 50, y: -30 },
            { x: 100, y: 0 },
            { x: 150, y: -30 },
            { x: 200, y: 0 }
          ],
          strokeWidth: 4,
          strokeColor: "#FF5722",
          lineJoin: "round",
          lineCap: "round"
        },
        {
          points: [
            { x: 0, y: 50 },
            { x: 50, y: 80 },
            { x: 100, y: 50 },
            { x: 150, y: 80 },
            { x: 200, y: 50 }
          ],
          strokeWidth: 5,
          strokeColor: "#4CAF50",
          lineJoin: "round",
          lineCap: "round"
        }
      ]
    }
  ]
};

// Export options examples
const exportOptions = {
  // Standard export
  standard: {
    width: 1920,
    height: 1080,
    background: '#FFFFFF',
    pixelRatio: 1
  },
  
  // High resolution export
  highRes: {
    width: 3840,
    height: 2160,
    background: '#FFFFFF',
    pixelRatio: 2
  },
  
  // Transparent background
  transparent: {
    width: 1920,
    height: 1080,
    background: 'transparent',
    pixelRatio: 1
  },
  
  // Ultra high resolution
  ultraHighRes: {
    width: 1920,
    height: 1080,
    background: '#FFFFFF',
    pixelRatio: 3
  }
};

// Usage examples (in browser context)
console.log('=== Layer Export from JSON Demo ===\n');

console.log('Scene:', demoScene.title);
console.log('Number of layers:', demoScene.layers.length);
console.log('\nLayers:');

demoScene.layers.forEach((layer, index) => {
  console.log(`  ${index + 1}. ${layer.id} (type: ${layer.type})`);
  console.log(`     Position: (${layer.position.x}, ${layer.position.y})`);
  console.log(`     Scale: ${layer.scale}, Opacity: ${layer.opacity}, Rotation: ${layer.rotation}°`);
});

console.log('\n=== Export Options ===\n');

Object.entries(exportOptions).forEach(([name, options]) => {
  console.log(`${name}:`);
  console.log(`  Canvas: ${options.width}x${options.height}`);
  console.log(`  Background: ${options.background}`);
  console.log(`  Pixel Ratio: ${options.pixelRatio}x`);
  console.log(`  Output Resolution: ${options.width * options.pixelRatio}x${options.height * options.pixelRatio}`);
  console.log();
});

console.log('=== Browser Usage ===\n');
console.log('In a browser environment, you would use:');
console.log('```javascript');
console.log('import { exportLayerFromJSON, downloadDataUrl } from "./utils/layerExporter";');
console.log('');
console.log('// Export a single layer');
console.log('const layer = scene.layers[0];');
console.log('const dataUrl = await exportLayerFromJSON(layer, {');
console.log('  width: 1920,');
console.log('  height: 1080,');
console.log('  background: "#FFFFFF",');
console.log('  pixelRatio: 2');
console.log('});');
console.log('');
console.log('// Download the exported image');
console.log('downloadDataUrl(dataUrl, "layer-export.png");');
console.log('```');
console.log();

console.log('=== Validation ===\n');

// Show validation example
console.log('Layer validation ensures data integrity before export:');
console.log('```javascript');
console.log('import { validateLayerJSON } from "./utils/layerExporter";');
console.log('');
console.log('const validation = validateLayerJSON(layer);');
console.log('if (!validation.valid) {');
console.log('  console.error("Invalid layer:", validation.errors);');
console.log('}');
console.log('```');
console.log();

console.log('=== Tests ===\n');
console.log('Run the test suite to verify functionality:');
console.log('  node test/layer-export-test.js');
console.log();

console.log('=== Documentation ===\n');
console.log('For complete API documentation, see:');
console.log('  LAYER_EXPORT_API.md');
console.log();

console.log('✅ Demo completed successfully!');
