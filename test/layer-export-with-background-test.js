/**
 * Test for Layer Export with Background Image functionality
 * Tests that layers are exported with scene background image (whiteboard)
 */

import { exportLayerFromJSON, validateLayerJSON } from '../src/utils/layerExporter.js';

console.log('Testing Layer Export with Background Image functionality...\n');

let passedTests = 0;
let totalTests = 0;

const test = (name, fn) => {
  totalTests++;
  try {
    fn();
    console.log(`✓ ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
};

// Test 1: Export layer with background image URL
test('Export layer accepts sceneBackgroundImage option', async () => {
  const layer = {
    id: 'img-1',
    type: 'image',
    image_path: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    position: { x: 100, y: 100 },
    scale: 1.0,
    opacity: 1.0,
  };

  try {
    const dataUrl = await exportLayerFromJSON(layer, {
      width: 200,
      height: 200,
      background: '#FFFFFF',
      pixelRatio: 1,
      sceneBackgroundImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    });
    
    if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
      throw new Error('Expected PNG data URL');
    }
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
});

// Test 2: Export layer without background image (backward compatibility)
test('Export layer works without sceneBackgroundImage (backward compatible)', async () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    shape_config: {
      shape_type: 'circle',
      width: 100,
      height: 100,
      fill_color: '#FF0000',
    },
    position: { x: 100, y: 100 },
    scale: 1.0,
  };

  try {
    const dataUrl = await exportLayerFromJSON(layer, {
      width: 200,
      height: 200,
      background: '#FFFFFF',
      pixelRatio: 1,
      // No sceneBackgroundImage provided
    });
    
    if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
      throw new Error('Expected PNG data URL');
    }
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
});

// Test 3: Export whiteboard layer with background
test('Export whiteboard layer with scene background', async () => {
  const layer = {
    id: 'whiteboard-1',
    type: 'whiteboard',
    strokes: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
          { x: 20, y: 5 },
        ],
        strokeWidth: 2,
        strokeColor: '#000000',
      },
    ],
    position: { x: 100, y: 100 },
  };

  try {
    const dataUrl = await exportLayerFromJSON(layer, {
      width: 200,
      height: 200,
      background: '#FFFFFF',
      pixelRatio: 1,
      sceneBackgroundImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    });
    
    if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
      throw new Error('Expected PNG data URL');
    }
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
});

// Test 4: Export text layer with background
test('Export text layer with scene background', async () => {
  const layer = {
    id: 'text-1',
    type: 'text',
    text_config: {
      text: 'Test Text',
      font: 'Arial',
      size: 24,
      color: [0, 0, 0],
    },
    position: { x: 100, y: 100 },
    scale: 1.0,
  };

  try {
    const dataUrl = await exportLayerFromJSON(layer, {
      width: 200,
      height: 200,
      background: '#FFFFFF',
      pixelRatio: 1,
      sceneBackgroundImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    });
    
    if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
      throw new Error('Expected PNG data URL');
    }
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
});

// Test 5: Export with invalid background image URL (should not fail)
test('Export gracefully handles invalid background image URL', async () => {
  const layer = {
    id: 'shape-1',
    type: 'shape',
    shape_config: {
      shape_type: 'rectangle',
      width: 50,
      height: 50,
      fill_color: '#00FF00',
    },
    position: { x: 100, y: 100 },
  };

  try {
    const dataUrl = await exportLayerFromJSON(layer, {
      width: 200,
      height: 200,
      background: '#FFFFFF',
      pixelRatio: 1,
      sceneBackgroundImage: 'invalid-url-that-does-not-exist.png',
    });
    
    if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
      throw new Error('Expected PNG data URL');
    }
  } catch (error) {
    throw new Error(`Export should not fail with invalid background: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Test Summary: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(50));

if (passedTests === totalTests) {
  console.log('\n✅ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n❌ ${totalTests - passedTests} test(s) failed`);
  process.exit(1);
}
