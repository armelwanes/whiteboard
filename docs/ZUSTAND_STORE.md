# Scene State Management with Zustand

## Overview
This document describes the Zustand store implementation for scene state management, which eliminates prop drilling in the whiteboard application.

## Store Location
`src/app/scenes/store.ts`

## Store Structure

### State
```typescript
{
  // Scene Selection
  selectedSceneIndex: number;      // Currently selected scene index
  selectedLayerId: string | null;  // Currently selected layer ID
  
  // UI State
  showAssetLibrary: boolean;       // Show/hide asset library modal
  showShapeToolbar: boolean;       // Show/hide shape toolbar modal
  showCropModal: boolean;          // Show/hide image crop modal
  pendingImageData: any | null;    // Data for pending image operations
}
```

### Actions
- `setSelectedSceneIndex(index: number)` - Select a scene by index
- `setSelectedLayerId(id: string | null)` - Select a layer by ID
- `setShowAssetLibrary(show: boolean)` - Toggle asset library visibility
- `setShowShapeToolbar(show: boolean)` - Toggle shape toolbar visibility
- `setShowCropModal(show: boolean)` - Toggle crop modal visibility
- `setPendingImageData(data: any | null)` - Set pending image data
- `reset()` - Reset all state to initial values

## Usage Examples

### Basic Usage
```typescript
import { useSceneStore } from '@/app/scenes';

function MyComponent() {
  // Select specific state
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  
  // Select specific action
  const setSelectedSceneIndex = useSceneStore((state) => state.setSelectedSceneIndex);
  
  // Use in component
  const handleClick = () => {
    setSelectedSceneIndex(2);
  };
}
```

### Using the Helper Hook
```typescript
import { useCurrentScene } from '@/app/scenes';

function MyComponent() {
  const currentScene = useCurrentScene();
  
  if (!currentScene) {
    return <div>No scene selected</div>;
  }
  
  return <div>{currentScene.title}</div>;
}
```

### Multiple State Selection
```typescript
import { useSceneStore } from '@/app/scenes';

function MyComponent() {
  // Efficient: only re-renders when these specific values change
  const { selectedSceneIndex, selectedLayerId, setSelectedLayerId } = useSceneStore(
    (state) => ({
      selectedSceneIndex: state.selectedSceneIndex,
      selectedLayerId: state.selectedLayerId,
      setSelectedLayerId: state.setSelectedLayerId,
    })
  );
}
```

## Migration Guide

### Before (Prop Drilling)
```typescript
// App.tsx
const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);

<AnimationContainer
  selectedSceneIndex={selectedSceneIndex}
  setSelectedSceneIndex={setSelectedSceneIndex}
  // ... many other props
/>

// AnimationContainer.tsx
<ScenePanel
  selectedSceneIndex={selectedSceneIndex}
  onSelectScene={setSelectedSceneIndex}
  // ... more props
/>
```

### After (Zustand Store)
```typescript
// App.tsx (no prop drilling needed)
<AnimationContainer
  // selectedSceneIndex removed!
  // setSelectedSceneIndex removed!
/>

// AnimationContainer.tsx (no prop drilling needed)
<ScenePanel
  // selectedSceneIndex removed!
  // onSelectScene removed!
/>

// ScenePanel.tsx (uses store directly)
const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
const setSelectedSceneIndex = useSceneStore((state) => state.setSelectedSceneIndex);
```

## Components Using the Store

### Direct Usage
These components directly use the store:
- `App.tsx` - For UI state (showShapeToolbar, showAssetLibrary)
- `AnimationContainer.tsx` - For all scene state
- `ScenePanel.tsx` - For scene selection
- `LayerEditor.tsx` - For UI state

### Indirect Usage (via props)
Some components still receive data via props but the source is now the store:
- `PropertiesPanel.tsx` - Receives scene from AnimationContainer
- `Scene.tsx` - Receives scene props

## Best Practices

### 1. Select Only What You Need
```typescript
// ❌ Bad: Re-renders on any store change
const store = useSceneStore();

// ✅ Good: Only re-renders when selectedSceneIndex changes
const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
```

### 2. Use Helper Hooks When Available
```typescript
// ❌ Less convenient
const { scenes } = useScenes();
const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
const currentScene = scenes[selectedSceneIndex];

// ✅ More convenient
const currentScene = useCurrentScene();
```

### 3. Group Related State Updates
```typescript
// If you need to update multiple related pieces of state,
// do it in separate calls - Zustand handles batching automatically
setSelectedSceneIndex(2);
setSelectedLayerId(null); // Clear layer selection when changing scenes
```

## Performance Notes

- Zustand uses React's `useSyncExternalStore` under the hood for optimal performance
- Component only re-renders when selected state slice changes
- Store updates are synchronous and batched automatically
- No need for memo or callback optimizations for store access

## Future Enhancements

Potential improvements to consider:
1. Add computed selectors for derived state
2. Add middleware for persistence (localStorage)
3. Add devtools integration for debugging
4. Create more specific hooks for common patterns
5. Add history/undo functionality in the store

## Related Files
- `src/app/scenes/store.ts` - Store definition
- `src/app/scenes/hooks/useCurrentScene.ts` - Helper hook
- `src/app/scenes/index.ts` - Exports
