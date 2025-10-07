# Copilot Instructions for whiteboard-anim

## Project Overview
- **Purpose:** Interactive web app for creating multi-scene whiteboard animations with timeline, audio sync, and scene management.
- **Tech Stack:** React (SPA), Vite (build/dev), Tailwind CSS (styling), ES6+ JS.

## Architecture & Key Patterns
- **src/components/**: Main UI logic. Key files: `AnimationContainer.jsx`, `Scene.jsx`, `ScenePanel.jsx`, `Timeline.jsx`, `Toolbar.jsx`, `HandWritingAnimation.jsx`.
- **src/data/scenes.js**: Scene templates and story data. Each scene: `{ id, title, content, duration, backgroundImage, animation, objects }`.
- **src/App.jsx**: App state, routing, and layout.
- **src/App.css**: Custom CSS animations (`fade`, `slide`, `scale`) and overrides. Add new keyframes here.
- **public/**: Static assets (images, icons, etc.).
- **docs/**: Feature and technical documentation.

## Scene & Animation Model
- Scenes are objects with: `id`, `title`, `content`, `duration`, `backgroundImage`, `animation` ("fade", "slide", "scale"), and `objects` (for future extensibility).
- Scene transitions use CSS keyframes defined in `App.css`. Animation type is set per scene in data.

## Developer Workflows
- **Dev server:** `npm run dev` (Vite, hot reload)
- **Lint:** `npm run lint` (ESLint)
- **Build:** `npm run build` (production)
- **Preview:** `npm run preview` (local prod preview)
- **Add scenes:** Edit `src/data/scenes.js` or use UI editor.
- **Add animations:** Extend `src/App.css` and reference new animation in scene data.

## Conventions & Patterns
- Use functional React components and hooks.
- Scene data is persisted in browser localStorage for user stories; reset by clearing site data.
- UI state managed in `App.jsx` and passed via props/context.
- Timeline and playback controls are in `Timeline.jsx` and `Toolbar.jsx`.
- All custom CSS animations should be added to `src/App.css` and referenced by name in scene objects.
- Use Tailwind for layout and utility classes; custom styles in `App.css` only for animations and overrides.

## Integration Points
- No backend; all data is local or static.
- Images and assets loaded from `public/`.
- Future extensibility: `objects` array in scene data for more complex scene elements.

## Example: Adding a Scene
```js
{
  id: 'scene-6',
  title: 'Nouvelle scène',
  content: 'Texte...',
  duration: 5,
  backgroundImage: null,
  animation: 'fade',
  objects: []
}
```

## Example: Adding an Animation
1. Add keyframes to `src/App.css`:
```css
@keyframes bounceIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
```
2. Reference in scene data: `animation: 'bounceIn'`

---
For questions or unclear patterns, see `README.md` or ask for clarification.
