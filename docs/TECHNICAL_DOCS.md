# Whiteboard Animation - Documentation Technique

## Architecture du Projet

### Vue d'ensemble

L'application suit une architecture React moderne avec gestion d'état centralisée dans le composant App et persistence via localStorage.

### Composants Principaux

#### 0. App (src/App.jsx)
Le composant racine qui gère l'état global de l'application.

**Responsabilités:**
- Gestion de l'état des scènes (ajout, suppression, modification, réorganisation)
- Gestion de la scène sélectionnée
- Persistence des données via localStorage
- Coordination entre les composants (ScenePanel, Toolbar, AnimationContainer, SceneEditor)

**État:**
- `scenes`: Tableau de toutes les scènes
- `selectedSceneIndex`: Index de la scène actuellement sélectionnée
- `isEditorOpen`: État d'ouverture de l'éditeur modal

**Méthodes:**
- `addScene()`: Créer une nouvelle scène
- `deleteScene(index)`: Supprimer une scène
- `duplicateScene(index)`: Dupliquer une scène
- `updateScene(index, updatedScene)`: Mettre à jour une scène
- `moveScene(index, direction)`: Réorganiser les scènes

#### 1. ScenePanel (src/components/ScenePanel.jsx)
Panneau latéral pour la gestion et visualisation des scènes.

**Props:**
- `scenes`: Tableau des scènes
- `selectedSceneIndex`: Index de la scène sélectionnée
- `onSelectScene`: Callback pour sélectionner une scène
- `onAddScene`: Callback pour ajouter une scène
- `onDeleteScene`: Callback pour supprimer une scène
- `onDuplicateScene`: Callback pour dupliquer une scène
- `onMoveScene`: Callback pour réorganiser les scènes

**Fonctionnalités:**
- Liste scrollable de toutes les scènes
- Aperçu thumbnail avec image de fond si disponible
- Affichage du titre, contenu et durée de chaque scène
- Boutons d'action (↑ ↓ 📋 🗑) pour la scène sélectionnée
- Compteur de scènes
- Bouton "+ Ajouter une scène"

#### 2. Toolbar (src/components/Toolbar.jsx)
Barre d'outils horizontale en haut de l'application.

**Props:**
- `onOpenEditor`: Callback pour ouvrir l'éditeur de scène

**Fonctionnalités:**
- Bouton "Éditer" pour ouvrir l'éditeur modal
- Boutons d'outils (Texte, Formes, Image, Caméra) - placeholders pour futures fonctionnalités
- Design moderne avec séparateurs

#### 3. SceneEditor (src/components/SceneEditor.jsx)
Modal pour éditer les propriétés d'une scène.

**Props:**
- `scene`: Objet de la scène à éditer
- `onClose`: Callback pour fermer l'éditeur
- `onSave`: Callback pour sauvegarder les modifications

**Fonctionnalités:**
- Édition du titre, contenu, durée
- Sélection de l'image de fond avec aperçu
- Choix du type d'animation (Fade, Slide, Scale)
- Validation et sauvegarde
- Design modal avec overlay

#### 4. AnimationContainer (src/components/AnimationContainer.jsx)
Le composant qui gère l'animation et l'affichage des scènes.

**Responsabilités:**
- Gestion de l'état de lecture (play/pause)
- Suivi du temps actuel de l'animation
- Détermination de la scène active basée sur le temps
- Boucle d'animation avec requestAnimationFrame
- Calcul de la durée totale

**État:**
- `currentTime`: Temps actuel en secondes
- `isPlaying`: État de lecture
- `currentSceneIndex`: Index de la scène actuellement affichée

**Méthodes:**
- `handlePlayPause()`: Toggle play/pause
- `handleSeek(time)`: Navigation à un temps spécifique

#### 5. Scene (src/components/Scene.jsx)
Composant pour afficher une scène individuelle.

**Props:**
- `title`: Titre de la scène
- `content`: Contenu textuel de la scène
- `isActive`: Boolean indiquant si la scène est active
- `backgroundImage`: Image de fond optionnelle

**Fonctionnalités:**
- Transitions d'opacité fluides
- Support pour images de fond personnalisées
- Animations d'entrée pour le contenu textuel

#### 6. Timeline (src/components/Timeline.jsx)
Composant de contrôle de la timeline avec interface utilisateur complète.

**Props:**
- `currentTime`: Temps actuel
- `totalDuration`: Durée totale de l'animation
- `isPlaying`: État de lecture
- `onPlayPause`: Callback pour play/pause
- `onSeek`: Callback pour navigation
- `scenes`: Tableau des scènes pour afficher les marqueurs

**Fonctionnalités:**
- Bouton Play/Pause avec icônes
- Affichage du temps formaté (MM:SS)
- Barre de progression cliquable
- Marqueurs visuels pour chaque scène
- Boutons de navigation rapide vers les scènes

### Structure des Données

#### Format des Scènes (src/data/scenes.js)

```javascript
{
  id: 'scene-1',           // Identifiant unique
  title: 'Le Début',       // Titre affiché
  content: '...',          // Texte de la scène
  duration: 5,             // Durée en secondes
  backgroundImage: null,   // URL image de fond (optionnel)
  animation: 'fade'        // Type d'animation (pour extension future)
}
```

## Système d'Animation

### Timing et Synchronisation

L'animation utilise `requestAnimationFrame` pour un timing précis:

1. **Calcul du delta**: Différence entre les frames
2. **Mise à jour du temps**: Incrémentation basée sur le delta
3. **Détection de scène**: Calcul de la scène active selon le temps cumulé
4. **Rendu**: Affichage de la scène active avec transitions

### Transitions entre Scènes

- **Méthode**: Transition CSS opacity
- **Durée**: 1 seconde
- **Type**: ease-in-out
- **Z-index**: Gestion des couches pour transitions fluides

## Styles et Apparence

### Tailwind CSS

Configuration dans `tailwind.config.js`:
- Content path pour tous les fichiers JSX/TSX
- Extensions de thème possibles
- Système de design réactif

### CSS Personnalisé (App.css)

Animations définies:
- `fadeIn`: Apparition avec translation verticale
- `slideIn`: Apparition avec translation horizontale
- `scaleIn`: Apparition avec effet de zoom

## Performance

### Optimisations Implémentées

1. **requestAnimationFrame**: Animation synchronisée avec le refresh rate
2. **Cleanup**: Annulation des animations au démontage
3. **Transitions CSS**: Utilisent l'accélération hardware
4. **Refs**: Utilisation de useRef pour éviter les re-renders inutiles
5. **localStorage**: Persistence des données sans backend
6. **Lazy Rendering**: Seule la scène active est visible (opacity-based)

### Métriques de Build

- Taille du bundle JS: ~204 KB (64 KB gzippé)
- Taille du CSS: ~3 KB (1 KB gzippé)
- Temps de build: ~270ms
- Composants: 6 composants principaux

## Extension Future

### Fonctionnalités Potentielles

1. **Audio Synchronization**
   - Intégration Web Audio API
   - Synchronisation audio/visuel précise
   - Contrôle de volume

2. **Animations Avancées**
   - Types d'animations supplémentaires (rotate, bounce, zoom)
   - Animations d'éléments individuels
   - Keyframes personnalisables
   - Trajectoires de mouvement

3. **Édition Interactive** ✅ (Partiellement implémenté)
   - ✅ Interface d'édition des scènes
   - ✅ Gestion complète des scènes (CRUD)
   - 🔄 Upload d'images (actuellement via URL)
   - ✅ Prévisualisation en temps réel
   - 🔄 Éditeur visuel drag & drop

4. **Outils Créatifs** 🔄 (En développement)
   - 🔄 Ajout de texte sur le canvas
   - 🔄 Dessin de formes géométriques
   - 🔄 Import d'images et médias
   - 🔄 Contrôles de caméra/zoom

5. **Export et Partage**
   - Export en vidéo (WebM, MP4)
   - Export en GIF animé
   - Partage de projets via URL
   - Templates de scènes prédéfinis

4. **Export**
   - Export en vidéo (via canvas + FFmpeg.js)
   - Export JSON des configurations
   - Templates réutilisables

5. **Interactions Avancées**
   - Hotkeys pour contrôles
   - Mode plein écran
   - Annotations et overlays

## Tests et Validation

### Tests Manuels Effectués

✅ Lecture/pause de l'animation
✅ Navigation via timeline
✅ Saut direct aux scènes
✅ Transitions entre scènes
✅ Responsive design
✅ Build de production
✅ Linting du code

### Tests Recommandés

- Tests unitaires des composants (Jest + React Testing Library)
- Tests d'intégration du système de timing
- Tests E2E avec Playwright
- Tests de performance

## Maintenance

### Dépendances Principales

- React 19.1.1
- Vite 7.1.14 (rolldown-vite)
- Tailwind CSS 4.1.14
- @tailwindcss/postcss 4.1.14

### Commandes Utiles

```bash
npm run dev      # Développement avec HMR
npm run build    # Build de production
npm run preview  # Preview du build
npm run lint     # Vérification ESLint
```

## Notes de Développement

### Choix Techniques

1. **Vite**: Choisi pour son temps de démarrage rapide et son HMR performant
2. **Tailwind CSS**: Framework CSS utilitaire pour développement rapide
3. **React Hooks**: Utilisation exclusive des functional components et hooks
4. **requestAnimationFrame**: Pour animations fluides à 60 FPS

### Limitations Connues

1. Pas d'audio synchronisé (structure en place pour ajout futur)
2. Animations limitées à fade (extensible facilement)
3. Pas de persistence des états (peut être ajouté avec localStorage)

### Bonnes Pratiques Suivies

- Séparation des responsabilités (containers, presentational components)
- Props typées avec destructuring
- Cleanup approprié des effects
- CSS modulaire et maintenable
- Code lintable sans erreurs
