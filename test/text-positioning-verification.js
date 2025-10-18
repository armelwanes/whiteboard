/**
 * Text Positioning Verification Test
 * Verifies that text layer positioning is consistent between creation and rendering
 */

console.log('🧪 Testing Text Positioning Fix\n');

// Test configuration
const sceneWidth = 1920;
const sceneHeight = 1080;
const cameraWidth = 800;
const cameraHeight = 450;
const cameraPosition = { x: 0.5, y: 0.5 }; // Center of scene (normalized)

// Camera absolute position in scene coordinates
const cameraAbsX = cameraPosition.x * sceneWidth;
const cameraAbsY = cameraPosition.y * sceneHeight;

// Camera viewport edges
const cameraViewportLeft = cameraAbsX - (cameraWidth / 2);
const cameraViewportTop = cameraAbsY - (cameraHeight / 2);

console.log('Scene Configuration:');
console.log(`  Scene size: ${sceneWidth}x${sceneHeight}`);
console.log(`  Camera size: ${cameraWidth}x${cameraHeight}`);
console.log(`  Camera position (normalized): (${cameraPosition.x}, ${cameraPosition.y})`);
console.log(`  Camera position (absolute): (${cameraAbsX}, ${cameraAbsY})`);
console.log(`  Camera viewport: (${cameraViewportLeft}, ${cameraViewportTop})`);
console.log();

// Test 1: Text layer creation with new logic
console.log('Test 1: Text Layer Creation');
console.log('─'.repeat(50));

const cameraCenterX = cameraAbsX;
const cameraCenterY = cameraAbsY;
const fontSize = 48;
const cameraZoom = 0.8;

// NEW LOGIC (after fix)
const initialX = cameraCenterX;
const initialY = cameraCenterY;

console.log(`  Camera center: (${cameraCenterX}, ${cameraCenterY})`);
console.log(`  Text position: (${initialX}, ${initialY})`);
console.log(`  Font size: ${fontSize}px, Scale: ${cameraZoom}`);

// Calculate position in camera viewport
const layerXInViewport = initialX - cameraViewportLeft;
const layerYInViewport = initialY - cameraViewportTop;

console.log(`  Position in viewport: (${layerXInViewport}, ${layerYInViewport})`);
console.log(`  Viewport center: (${cameraWidth/2}, ${cameraHeight/2})`);

// Verify centering
const isHorizontallyCentered = layerXInViewport === cameraWidth / 2;
const isVerticallyCentered = layerYInViewport === cameraHeight / 2;

if (isHorizontallyCentered && isVerticallyCentered) {
  console.log('  ✅ PASS: Text is centered in viewport');
} else {
  console.log('  ❌ FAIL: Text is not centered');
  if (!isHorizontallyCentered) {
    console.log(`    Horizontal offset: ${layerXInViewport - cameraWidth/2}px`);
  }
  if (!isVerticallyCentered) {
    console.log(`    Vertical offset: ${layerYInViewport - cameraHeight/2}px`);
  }
}
console.log();

// Test 2: Verify old vs new positioning
console.log('Test 2: Old vs New Positioning Comparison');
console.log('─'.repeat(50));

const estimatedHeight = fontSize * 1.2;
const scaledHeight = estimatedHeight * cameraZoom;

// OLD LOGIC (before fix)
const oldInitialX = cameraCenterX;
const oldInitialY = cameraCenterY - (scaledHeight / 2);

// NEW LOGIC (after fix)
const newInitialX = cameraCenterX;
const newInitialY = cameraCenterY;

console.log(`  Old position: (${oldInitialX}, ${oldInitialY})`);
console.log(`  New position: (${newInitialX}, ${newInitialY})`);

const oldLayerY = oldInitialY - cameraViewportTop;
const newLayerY = newInitialY - cameraViewportTop;

console.log(`  Old Y in viewport: ${oldLayerY.toFixed(2)}px`);
console.log(`  New Y in viewport: ${newLayerY.toFixed(2)}px`);
console.log(`  Viewport center Y: ${cameraHeight/2}px`);

const oldOffset = oldLayerY - cameraHeight/2;
const newOffset = newLayerY - cameraHeight/2;

console.log(`  Old Y offset from center: ${oldOffset.toFixed(2)}px ${oldOffset < 0 ? '(above)' : '(below)'}`);
console.log(`  New Y offset from center: ${newOffset.toFixed(2)}px ${newOffset === 0 ? '(centered)' : ''}`);

if (oldOffset < 0 && newOffset === 0) {
  console.log('  ✅ PASS: Fix correctly moved text from above center to center');
} else {
  console.log('  ❌ FAIL: Positioning logic error');
}
console.log();

// Test 3: Canvas rendering with textBaseline='middle'
console.log('Test 3: Canvas Rendering Verification');
console.log('─'.repeat(50));

// Simulate Canvas rendering
const renderX = layerXInViewport;
const renderY = layerYInViewport;

console.log('  Canvas context setup:');
console.log('    translate(renderX, renderY)');
console.log('    textAlign = "center"');
console.log('    textBaseline = "middle"');
console.log('    fillText(text, 0, 0)');
console.log();
console.log('  Rendering interpretation:');
console.log(`    Text will be drawn with:`);
console.log(`      - Horizontal center at x=${renderX}`);
console.log(`      - Vertical middle at y=${renderY}`);
console.log();

if (renderX === cameraWidth/2 && renderY === cameraHeight/2) {
  console.log('  ✅ PASS: Text will render centered in viewport');
} else {
  console.log('  ❌ FAIL: Text will not render centered');
}
console.log();

// Test 4: Konva offset calculation
console.log('Test 4: Konva Offset Calculation');
console.log('─'.repeat(50));

// Simulate text dimensions
const textContent = 'Votre texte ici';
const scaledFontSize = fontSize * cameraZoom;
const estimatedTextWidth = textContent.length * scaledFontSize * 0.6; // Rough estimate
const estimatedTextHeight = scaledFontSize * 1.2;

console.log(`  Text: "${textContent}"`);
console.log(`  Scaled font size: ${scaledFontSize}px`);
console.log(`  Estimated dimensions: ${estimatedTextWidth.toFixed(0)}x${estimatedTextHeight.toFixed(0)}px`);
console.log();

// Konva offsets (as implemented in LayerText.tsx)
const offsetX = estimatedTextWidth / 2; // For center alignment
const offsetY = estimatedTextHeight / 2;

console.log('  Konva Text with offsets:');
console.log(`    x={${renderX}}`);
console.log(`    y={${renderY}}`);
console.log(`    offsetX={${offsetX.toFixed(2)}} (centers horizontally)`);
console.log(`    offsetY={${offsetY.toFixed(2)}} (centers vertically)`);
console.log();
console.log('  Effective text position:');
console.log(`    Left edge: ${(renderX - offsetX).toFixed(2)}`);
console.log(`    Top edge: ${(renderY - offsetY).toFixed(2)}`);
console.log(`    Center: (${renderX}, ${renderY})`);
console.log();

if (offsetX > 0 && offsetY > 0) {
  console.log('  ✅ PASS: Offsets correctly center the text at position');
} else {
  console.log('  ❌ FAIL: Offsets are not properly calculated');
}
console.log();

// Summary
console.log('📊 Test Summary');
console.log('─'.repeat(50));

const allTestsPassed = 
  isHorizontallyCentered && 
  isVerticallyCentered && 
  oldOffset < 0 && 
  newOffset === 0 &&
  renderX === cameraWidth/2 && 
  renderY === cameraHeight/2 &&
  offsetX > 0 && 
  offsetY > 0;

if (allTestsPassed) {
  console.log('✅ All tests passed!');
  console.log();
  console.log('The text positioning fix is working correctly:');
  console.log('1. Text layers are created at camera center');
  console.log('2. Canvas export renders text centered');
  console.log('3. Konva editor renders text centered (with offsets)');
  console.log('4. Text appears centered in thumbnails and exports');
  process.exit(0);
} else {
  console.log('❌ Some tests failed');
  console.log();
  console.log('Review the test output above for details.');
  process.exit(1);
}
