# Whiteboard Architecture Documentation

## Overview

This project has been refactored to follow a modern, scalable architecture pattern inspired by professional frontend development practices. The architecture is designed to support future API integration while currently using localStorage as a mock backend.

## Directory Structure

```
src/
├── app/                          # Feature modules (domain logic)
│   ├── scenes/                   # Scenes management module
│   │   ├── api/                  # API service layer
│   │   │   └── scenesService.js  # CRUD operations for scenes
│   │   ├── hooks/                # React hooks for scenes
│   │   │   └── useScenes.js      # Main hook for scene management
│   │   ├── types.js              # Type definitions
│   │   └── index.js              # Module exports
│   │
│   └── assets/                   # Assets management module
│       ├── api/                  # API service layer
│       │   └── assetsService.js  # CRUD operations for assets
│       ├── hooks/                # React hooks for assets
│       │   └── useAssets.js      # Main hook for asset management
│       └── index.js              # Module exports
│
├── components/                   # UI components (Atomic Design)
│   ├── atoms/                    # Basic UI elements
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── card.jsx
│   │   └── textarea.jsx
│   │
│   ├── molecules/                # Composite components
│   │   ├── CameraControls.jsx
│   │   ├── Timeline.jsx
│   │   ├── ImageCropModal.jsx
│   │   └── ...
│   │
│   └── organisms/                # Complex feature components
│       ├── AnimationContainer.jsx
│       ├── LayerEditor.jsx
│       ├── ScenePanel.jsx
│       └── ...
│
├── services/                     # Cross-cutting services
│   ├── api/                      # API layer
│   │   └── baseService.js        # Base service with CRUD operations
│   │
│   └── storage/                  # Storage abstraction
│       └── localStorage.js       # localStorage wrapper
│
├── config/                       # Application configuration
│   ├── api.js                    # API endpoints configuration
│   └── constants.js              # Application constants
│
├── utils/                        # Utility functions
│   ├── cameraAnimator.js
│   ├── sceneExporter.js
│   └── ...
│
├── pages/                        # Page components
│   └── HandWritingTest.jsx
│
└── data/                         # Static data
    └── scenes.js                 # Default sample scenes
```

## Architecture Patterns

### 1. Service Layer Pattern

All data operations go through service classes that abstract the data source:

```javascript
// services/api/baseService.js
class BaseService {
  async list(params) { /* ... */ }
  async detail(id) { /* ... */ }
  async create(payload) { /* ... */ }
  async update(id, payload) { /* ... */ }
  async delete(id) { /* ... */ }
}
```

**Benefits:**
- Easy to swap localStorage with real API
- Consistent interface across features
- Centralized error handling
- Mock delays simulate real API behavior

### 2. Feature Module Pattern

Each feature is organized in its own module under `app/`:

```
app/scenes/
├── api/          # Service layer for this feature
├── hooks/        # React hooks for this feature
├── types.js      # Type definitions
└── index.js      # Public API exports
```

**Benefits:**
- Feature isolation
- Clear boundaries
- Easy to test
- Scalable structure

### 3. Atomic Design Pattern

Components are organized by complexity:

- **Atoms**: Basic UI elements (buttons, inputs)
- **Molecules**: Simple component compositions (forms, cards)
- **Organisms**: Complex features (editors, panels)

**Benefits:**
- Reusability
- Consistent UI
- Clear component hierarchy
- Easy maintenance

## Key Components

### App.jsx

The main application component that:
- Uses the `useScenes` hook for scene management
- Manages global application state
- Handles routing between features
- Coordinates interactions between components

### useScenes Hook

Primary hook for scene management:

```javascript
const {
  scenes,           // Current scenes array
  loading,          // Loading state
  error,            // Error state
  createScene,      // Create new scene
  updateScene,      // Update existing scene
  deleteScene,      // Delete scene
  duplicateScene,   // Duplicate scene
  moveScene,        // Reorder scenes
} = useScenes();
```

### ScenesService

Service for scene CRUD operations:

```javascript
scenesService.list()            // Get all scenes
scenesService.detail(id)        // Get one scene
scenesService.create(data)      // Create scene
scenesService.update(id, data)  // Update scene
scenesService.delete(id)        // Delete scene
scenesService.duplicate(id)     // Duplicate scene
```

## Migration to Real API

When ready to integrate with a backend API, update the services:

1. **Create HTTP client** in `services/api/`:
   ```javascript
   // services/api/httpClient.js
   import axios from 'axios';
   
   const httpClient = axios.create({
     baseURL: process.env.VITE_API_URL,
   });
   
   export default httpClient;
   ```

2. **Update BaseService** to use HTTP client:
   ```javascript
   class BaseService {
     async list() {
       const response = await this.http.get(this.endpoints.list);
       return response.data;
     }
     // ... other methods
   }
   ```

3. **Update services** to use HTTP:
   ```javascript
   class ScenesService extends BaseService {
     constructor() {
       super(httpClient, API_ENDPOINTS.scenes);
     }
   }
   ```

## Configuration

### API Endpoints

Defined in `config/api.js`:
```javascript
export const API_ENDPOINTS = {
  scenes: {
    list: '/scenes',
    create: '/scenes',
    detail: (id) => `/scenes/${id}`,
    // ...
  },
};
```

### Constants

Defined in `config/constants.js`:
```javascript
export const STORAGE_KEYS = {
  SCENES: 'whiteboard-scenes',
  ASSETS: 'whiteboard-assets',
};
```

## Testing Approach

With this architecture:

1. **Services** can be tested independently
2. **Hooks** can be tested with React Testing Library
3. **Components** can be tested with mocked hooks
4. **Integration tests** can use mocked services

## Future Improvements

1. **Add TypeScript** for better type safety
2. **Add state management** (Zustand/Redux) if needed
3. **Add React Query** for server state caching
4. **Add error boundaries** for better error handling
5. **Add loading states** throughout the app
6. **Implement proper undo/redo** with the new architecture
7. **Add authentication layer** when backend is ready

## Development Guidelines

### Adding a New Feature

1. Create module in `app/[feature]/`
2. Create service in `app/[feature]/api/`
3. Create hooks in `app/[feature]/hooks/`
4. Create components as needed
5. Export from `app/[feature]/index.js`

### Adding a New Component

1. Determine complexity level (atom/molecule/organism)
2. Place in appropriate folder
3. Use existing atoms/molecules when possible
4. Export from folder's `index.js` if reusable

### Adding a New Service

1. Extend `BaseService` for CRUD operations
2. Add custom methods as needed
3. Use appropriate storage key
4. Export from module's `index.js`

## Notes

- Current implementation uses localStorage as mock backend
- Services simulate API delays (300ms) for realistic UX
- All data operations are async to match real API behavior
- Undo/redo functionality needs refactoring to work with services
- Import/export features updated to work with new architecture
