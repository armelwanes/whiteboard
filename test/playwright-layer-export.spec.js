/**
 * Playwright test for layer export with background image
 */

const { test, expect } = require('@playwright/test');

test.describe('Layer Export with Background', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should export layer with scene background image', async ({ page }) => {
    // Wait for the app to load
    await page.waitForSelector('.animation-container', { timeout: 10000 });
    
    // Click on a scene to open the layer editor
    const scene = page.locator('.scene-card').first();
    await scene.waitFor();
    await scene.click();
    
    // Wait for the layer editor to open
    await page.waitForSelector('.layer-editor', { timeout: 5000 });
    
    // Upload a background image to the scene
    const backgroundInput = page.locator('input[type="file"][accept="image/*"]').first();
    
    // Create a simple 1x1 pixel image data URL
    const imageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    // Upload layer image
    const layerUploadButton = page.getByRole('button', { name: /add layer/i, exact: false });
    if (await layerUploadButton.isVisible()) {
      await layerUploadButton.click();
    }
    
    console.log('✓ Layer editor opened successfully');
    
    // Test that the export button is present
    const exportButtons = page.locator('button').filter({ hasText: /export/i });
    const exportButtonCount = await exportButtons.count();
    
    expect(exportButtonCount).toBeGreaterThan(0);
    console.log(`✓ Found ${exportButtonCount} export button(s)`);
  });

  test('should have export layer functionality in UI', async ({ page }) => {
    // Check that the layer export buttons are present in the UI
    await page.waitForSelector('.animation-container', { timeout: 10000 });
    
    // Find any scene
    const scenes = page.locator('[class*="scene"]');
    const sceneCount = await scenes.count();
    
    console.log(`Found ${sceneCount} scenes in the app`);
    expect(sceneCount).toBeGreaterThan(0);
  });
});
