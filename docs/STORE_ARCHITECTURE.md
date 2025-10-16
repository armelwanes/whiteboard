# Store Architecture - Scene Management Centralization

## Vue d'ensemble

Ce document décrit l'architecture centralisée de gestion des scènes, des calques et des caméras dans le store Zustand.

## Motivation

Avant la centralisation, les opérations de gestion des scènes (ajout, mise à jour, suppression, duplication, réorganisation) étaient dispersées entre :
- Les hooks React Query (`useScenesActions`)
- Les composants de présentation (`App.tsx`, `AnimationContainer.tsx`)
- Les services API (`scenesService`)

Cette dispersion rendait difficile :
- La maintenance du code
- La compréhension du flux de données
- La gestion cohérente de l'état
- L'ajout de nouvelles fonctionnalités

## Architecture Centralisée

### Structure du Store

Le store Zustand (`src/app/scenes/store.ts`) centralise maintenant :

1. **État UI**
   - `selectedSceneIndex`: Index de la scène sélectionnée
   - `selectedLayerId`: ID du calque sélectionné
   - `showAssetLibrary`: Affichage de la bibliothèque d'assets
   - `showShapeToolbar`: Affichage de la barre d'outils de formes
   - `showCropModal`: Affichage du modal de recadrage
   - `pendingImageData`: Données d'image en attente

2. **Actions de Gestion des Scènes**
   - `createScene(payload?, scenes?)`: Créer une nouvelle scène
   - `updateScene(sceneId, data)`: Mettre à jour une scène existante
   - `deleteScene(sceneId, scenes)`: Supprimer une scène
   - `duplicateScene(sceneId)`: Dupliquer une scène
   - `reorderScenes(sceneIds)`: Réorganiser les scènes

3. **Actions de Gestion des Calques**
   - `addLayer(sceneId, layer)`: Ajouter un calque à une scène
   - `updateLayer(sceneId, layerId, data)`: Mettre à jour un calque
   - `deleteLayer(sceneId, layerId)`: Supprimer un calque

4. **Actions de Gestion des Caméras**
   - `addCamera(sceneId, camera)`: Ajouter une caméra à une scène

### Avantages de la Centralisation

#### 1. Single Source of Truth
Toutes les opérations de gestion passent par le store, garantissant une cohérence de l'état.

#### 2. Gestion Automatique de l'État UI
Le store gère automatiquement les mises à jour de l'UI associées aux opérations :
- Sélection automatique de la nouvelle scène après création
- Désélection automatique d'un calque après sa suppression
- Ajustement de l'index de scène sélectionnée après suppression

#### 3. Séparation des Responsabilités
- **Store**: Gestion de l'état et coordination des actions
- **Services**: Communication avec l'API/localStorage
- **Hooks**: Accès aux données (React Query)
- **Composants**: Présentation et interaction utilisateur

#### 4. Code Plus Maintenable
Les composants n'ont plus besoin de gérer la logique métier, ils appellent simplement les actions du store.

## Utilisation

### Dans un Composant

```typescript
import { useSceneStore } from '@/app/scenes';

function MyComponent() {
  // Accéder à l'état
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  
  // Accéder aux actions
  const createScene = useSceneStore((state) => state.createScene);
  const updateScene = useSceneStore((state) => state.updateScene);
  const deleteScene = useSceneStore((state) => state.deleteScene);
  
  // Utiliser les actions
  const handleAddScene = async () => {
    try {
      await createScene({ duration: 10, layers: [] }, scenes);
      await invalidate(); // Invalider le cache React Query
    } catch (error) {
      console.error('Error creating scene:', error);
    }
  };
  
  return (
    <button onClick={handleAddScene}>Ajouter une scène</button>
  );
}
```

### Pattern Recommandé

1. **Appeler l'action du store** pour modifier l'état
2. **Invalider le cache React Query** pour rafraîchir les données
3. **Gérer les erreurs** avec try/catch

```typescript
const handleOperation = async () => {
  try {
    await storeAction(params);
    await invalidate();
  } catch (error) {
    handleError(error);
  }
};
```

## Intégration avec React Query

Le store travaille en coordination avec React Query :
- **React Query**: Gestion du cache et récupération des données
- **Store Zustand**: Coordination des opérations et gestion de l'état UI

### Flux de Données

```
Composant
   ↓
Store Action (Zustand)
   ↓
scenesService (API/localStorage)
   ↓
Invalidation React Query
   ↓
Re-fetch automatique
   ↓
Mise à jour du Composant
```

## API du Store

### Actions de Scènes

#### `createScene(payload?, scenes?)`
Crée une nouvelle scène et sélectionne automatiquement son index.

**Paramètres:**
- `payload` (optionnel): Configuration de la scène
- `scenes` (optionnel): Liste actuelle des scènes pour déterminer l'index

**Exemple:**
```typescript
await createScene({
  duration: 10,
  layers: [],
  sceneCameras: []
}, scenes);
```

#### `updateScene(sceneId, data)`
Met à jour une scène existante.

**Paramètres:**
- `sceneId`: ID de la scène à mettre à jour
- `data`: Données partielles à mettre à jour

**Exemple:**
```typescript
await updateScene('scene-123', {
  title: 'Nouvelle scène',
  duration: 15
});
```

#### `deleteScene(sceneId, scenes)`
Supprime une scène et ajuste automatiquement la sélection.

**Paramètres:**
- `sceneId`: ID de la scène à supprimer
- `scenes`: Liste actuelle des scènes

**Exemple:**
```typescript
await deleteScene('scene-123', scenes);
```

#### `duplicateScene(sceneId)`
Duplique une scène existante.

**Paramètres:**
- `sceneId`: ID de la scène à dupliquer

**Exemple:**
```typescript
await duplicateScene('scene-123');
```

#### `reorderScenes(sceneIds)`
Réorganise les scènes selon un nouvel ordre.

**Paramètres:**
- `sceneIds`: Tableau d'IDs de scènes dans le nouvel ordre

**Exemple:**
```typescript
await reorderScenes(['scene-2', 'scene-1', 'scene-3']);
```

### Actions de Calques

#### `addLayer(sceneId, layer)`
Ajoute un calque à une scène.

**Exemple:**
```typescript
await addLayer('scene-123', {
  id: 'layer-456',
  type: 'image',
  position: { x: 100, y: 100 }
});
```

#### `updateLayer(sceneId, layerId, data)`
Met à jour un calque existant.

**Exemple:**
```typescript
await updateLayer('scene-123', 'layer-456', {
  position: { x: 200, y: 200 }
});
```

#### `deleteLayer(sceneId, layerId)`
Supprime un calque et désélectionne automatiquement si nécessaire.

**Exemple:**
```typescript
await deleteLayer('scene-123', 'layer-456');
```

### Actions de Caméras

#### `addCamera(sceneId, camera)`
Ajoute une caméra à une scène.

**Exemple:**
```typescript
await addCamera('scene-123', {
  id: 'camera-789',
  position: { x: 0.5, y: 0.5 },
  zoom: 1.0
});
```

## Migration depuis l'Ancienne Architecture

### Avant (useScenesActions)

```typescript
const {
  createScene,
  updateScene,
  deleteScene,
  duplicateScene
} = useScenesActions();

await createScene(payload);
await updateScene({ id: sceneId, data: updates });
```

### Après (useSceneStore)

```typescript
const createScene = useSceneStore((state) => state.createScene);
const updateScene = useSceneStore((state) => state.updateScene);
const deleteScene = useSceneStore((state) => state.deleteScene);
const duplicateScene = useSceneStore((state) => state.duplicateScene);

await createScene(payload, scenes);
await updateScene(sceneId, updates);
```

## Bonnes Pratiques

### 1. Toujours Invalider le Cache
Après chaque opération de modification, invalidez le cache React Query :

```typescript
await storeAction(params);
await invalidate();
```

### 2. Gérer les Erreurs
Utilisez try/catch pour gérer les erreurs :

```typescript
try {
  await storeAction(params);
  await invalidate();
} catch (error) {
  console.error('Operation failed:', error);
  showErrorNotification(error);
}
```

### 3. Passer les Dépendances Nécessaires
Certaines actions nécessitent des données contextuelles (comme la liste des scènes) :

```typescript
// ✅ Bon
await createScene(payload, scenes);
await deleteScene(sceneId, scenes);

// ❌ Mauvais - contexte manquant
await createScene(payload);
```

### 4. Utiliser les Sélecteurs de Store
Ne sélectionnez que ce dont vous avez besoin pour éviter des re-renders inutiles :

```typescript
// ✅ Bon
const createScene = useSceneStore((state) => state.createScene);

// ❌ Mauvais - re-render à chaque changement du store
const store = useSceneStore();
```

## Tests

Pour tester les actions du store :

```typescript
import { useSceneStore } from '@/app/scenes/store';

// Dans vos tests
const { createScene } = useSceneStore.getState();

await createScene(mockPayload, mockScenes);
expect(useSceneStore.getState().selectedSceneIndex).toBe(mockScenes.length);
```

## Évolution Future

### Fonctionnalités Potentielles

1. **Undo/Redo**
   - Historique des actions dans le store
   - Navigation dans l'historique

2. **Optimistic Updates**
   - Mise à jour immédiate de l'UI
   - Rollback en cas d'erreur

3. **Middleware**
   - Logging des actions
   - Analytics
   - Validation

4. **Persistence**
   - Sauvegarde automatique de l'état
   - Récupération après crash

## Support

Pour toute question sur l'architecture du store, consultez :
- Le code source : `src/app/scenes/store.ts`
- Les exemples d'utilisation : `src/App.tsx`
- Les tests : À venir

## Changelog

### v1.0.0 - Centralisation Initiale
- ✅ Centralisation des opérations de scènes
- ✅ Ajout des opérations de calques
- ✅ Ajout des opérations de caméras
- ✅ Migration de App.tsx vers le nouveau store
- ✅ Documentation complète
