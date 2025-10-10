# Camera Viewport System Documentation

## Overview

The Camera Viewport System allows you to create, position, resize, and zoom **virtual camera viewports** within a scrollable 2D scene. Each camera defines a visible area of the scene and can be manipulated independently.

## Key Concepts

### Scene vs Camera
- **Scene**: The entire canvas area (1920x1080 pixels by default)
- **Camera Viewport**: A rectangular frame showing a portion of the scene
- **Scene Zoom**: Global zoom affecting the entire canvas view
- **Camera Zoom**: Individual zoom for each camera viewport

### Coordinate System
- Camera positions use **normalized coordinates** (0.0 to 1.0)
- `position.x = 0.5, position.y = 0.5` = center of scene
- `position.x = 0.0, position.y = 0.0` = top-left corner
- `position.x = 1.0, position.y = 1.0` = bottom-right corner

### Zoom Behavior
- **Higher zoom = Smaller viewport** (inverse relationship)
- Zoom range: 0.1x to 5.0x
- Viewport size = `baseSize / zoomLevel`
- Example: 2.0x zoom = viewport is half the base size

## Features

### 1. Camera Creation
- Click **"Nouvelle Caméra"** button to add a camera
- Each camera gets a unique ID and default properties:
  - Position: Offset from previous camera
  - Size: 800x450 pixels (base size)
  - Zoom: 1.0x
  - Name: Auto-generated (Camera 1, Camera 2, etc.)

### 2. Camera Selection
- Click on a camera viewport to select it
- Selected camera shows:
  - Brighter pink border
  - Delete button (X)
  - Active zoom controls in toolbar
- Click elsewhere to deselect

### 3. Camera Repositioning
- **Drag the camera frame** to move it
- **Drag the camera label** (top bar) to move it
- Position updates in real-time
- Stays within scene bounds

### 4. Camera Resizing
- **8 resize handles** appear on selected camera:
  - 4 corner handles (diagonal resize)
  - 4 edge handles (horizontal/vertical resize)
- Drag handles to adjust viewport size
- Minimum size: 100x100 pixels
- Zoom adjusts automatically to maintain aspect ratio

### 5. Zoom Controls
- **Scene Zoom** (top right):
  - Zoom In/Out buttons
  - Reset button (back to 100%)
  - Affects entire canvas view
  - Range: 10% to 200%

- **Camera Zoom** (appears when camera selected):
  - Independent zoom per camera
  - Zoom In/Out buttons
  - Displays current zoom level
  - Range: 0.1x to 5.0x

### 6. Camera Management
- **Camera Selector**: Dropdown to switch between cameras
- **Camera Counter**: Shows total number of cameras
- **Delete**: Click X button on selected camera

## User Interface

### Camera Toolbar
Located at the top of the canvas:
```
[🎥 Caméras (2)] [Camera Selector ▼] [+ Nouvelle Caméra]
[Zoom scène: ➖ 100% ➕ ⬜] [Zoom caméra: ➖ 1.0x ➕]
```

### Camera Viewport Visual
```
┌──────────────────────────────────┐
│ 📷 Camera 1 (1.0x)           [X] │  ← Label with delete
├ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┤
┆ ╲                             ╱ ┆  ← Diagonal lines
┆   ╲                         ╱   ┆
┆     ╲                     ╱     ┆
┆       ╲                 ╱       ┆
┆         ╲             ╱         ┆
┆           ╲         ╱           ┆
┆             ╲     ╱             ┆
┆               ╲ ╱               ┆
┆               ╱ ╲               ┆
┆             ╱     ╲             ┆
┆           ╱         ╲           ┆
┆         ╱             ╲         ┆
┆       ╱                 ╲       ┆
┆     ╱                     ╲     ┆
┆   ╱                         ╲   ┆
┆ ╱                             ╲ ┆
└ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┘
●  ●  ●  ●  ●  ●  ●  ●  ← Resize handles
```

## Usage Guide

### Creating Your First Camera
1. Open the Layer Editor (click scene to edit)
2. Look for the camera toolbar at the top
3. Click **"Nouvelle Caméra"** button
4. A pink camera viewport appears on the canvas
5. Camera is automatically selected

### Positioning a Camera
1. Click the camera viewport to select it
2. Click and drag the **pink frame** or **label bar**
3. Move to desired position
4. Release mouse to drop

### Resizing a Camera
1. Select the camera viewport
2. Grab one of the **pink circular handles**:
   - **Corners**: Resize proportionally
   - **Edges**: Resize in one direction
3. Drag to resize
4. Zoom level adjusts automatically

### Zooming a Camera
1. Select the camera viewport
2. Use the **"Zoom caméra"** controls in toolbar:
   - **➖**: Decrease zoom (larger viewport)
   - **➕**: Increase zoom (smaller viewport)
3. Or use the camera selector to pick different camera

### Managing Multiple Cameras
1. Add multiple cameras with **"Nouvelle Caméra"**
2. Use the **dropdown selector** to switch between them
3. Each camera maintains its own:
   - Position
   - Size
   - Zoom level
   - Name
4. Select different cameras to edit independently

### Deleting a Camera
1. Select the camera viewport
2. Click the **[X]** button on the camera label
3. Camera is removed immediately

## Data Structure

### Scene Camera Object
```javascript
{
  id: "camera-1234567890",
  name: "Camera 1",
  position: {
    x: 0.5,  // Normalized X (0.0-1.0)
    y: 0.5   // Normalized Y (0.0-1.0)
  },
  width: 800,   // Base width in pixels
  height: 450,  // Base height in pixels
  zoom: 1.0     // Zoom level (0.1-5.0)
}
```

### Scene Integration
Cameras are stored in the scene object:
```javascript
{
  id: "scene-1",
  title: "My Scene",
  // ... other scene properties
  sceneCameras: [
    { /* camera 1 */ },
    { /* camera 2 */ },
    // ...
  ]
}
```

## Keyboard Shortcuts

Currently, all interactions are mouse-based:
- **Click**: Select camera
- **Drag**: Move camera
- **Drag handle**: Resize camera
- **Click toolbar**: Zoom camera

## Tips & Best Practices

### Camera Positioning
- ✅ Position cameras to focus on important scene areas
- ✅ Use multiple cameras for different detail levels
- ✅ Offset cameras for visual variety
- ❌ Avoid overlapping cameras (can be confusing)

### Zoom Levels
- **1.0x**: Normal view (entire camera viewport visible)
- **2.0x**: Zoomed in 2x (viewport shows half the area)
- **0.5x**: Zoomed out 2x (viewport shows double the area)
- Use higher zoom (2.0x+) for detail shots
- Use lower zoom (0.5x-1.0x) for overview shots

### Scene Zoom vs Camera Zoom
- **Scene Zoom**: For editing convenience only
  - Doesn't affect camera properties
  - Just makes canvas bigger/smaller on screen
  - Use when cameras are small and hard to select
- **Camera Zoom**: Defines actual camera view
  - Affects how much scene is visible through camera
  - Persisted with scene data
  - Use to control camera field of view

### Performance
- Each camera is an independent DOM element
- Recommended limit: **10-15 cameras per scene**
- More cameras = more rendering overhead
- Delete unused cameras to maintain performance

## Troubleshooting

### Camera Not Visible
- Check if camera is within scene bounds
- Verify zoom level isn't too extreme (<0.1 or >5.0)
- Try resetting scene zoom to 100%

### Can't Select Camera
- Camera might be under another camera (z-index issue)
- Try using the dropdown selector instead
- Adjust scene zoom for easier clicking

### Resize Not Working
- Make sure camera is selected (pink border visible)
- Grab the circular handles (not the frame)
- Check minimum size constraint (100x100px)

### Zoom Producing Unexpected Results
- Remember: Higher zoom = Smaller viewport
- Check which zoom you're adjusting (scene vs camera)
- Try resetting camera zoom to 1.0x

## Future Enhancements

Planned features:
- [ ] Camera animation/keyframes
- [ ] Camera presets (16:9, 4:3, 1:1)
- [ ] Snap-to-grid positioning
- [ ] Camera groups/folders
- [ ] Export camera views as separate frames
- [ ] Camera preview thumbnails

## API Reference

### CameraViewport Component
Props:
- `camera`: Camera object
- `isSelected`: Boolean selection state
- `onSelect`: Selection callback
- `onUpdate`: Update camera properties
- `onDelete`: Delete camera
- `sceneWidth`: Scene width in pixels
- `sceneHeight`: Scene height in pixels
- `canvasZoom`: Current scene zoom level

### CameraToolbar Component
Props:
- `cameras`: Array of camera objects
- `selectedCameraId`: Currently selected camera ID
- `onAddCamera`: Create new camera
- `onSelectCamera`: Select camera by ID
- `onZoomCamera`: Adjust camera zoom
- `sceneZoom`: Current scene zoom level
- `onSceneZoom`: Adjust scene zoom

### SceneCanvas Component
Props:
- `scene`: Scene object with layers and cameras
- `onUpdateScene`: Update scene callback
- `onUpdateLayer`: Update layer callback
- `selectedLayerId`: Currently selected layer ID
- `onSelectLayer`: Select layer callback

## Related Documentation

- [Layer System](./LAYERS_IMPLEMENTATION.md)
- [Camera Animation](./CAMERA_SYSTEM.md)
- [Scene Management](./TECHNICAL_DOCS.md)
