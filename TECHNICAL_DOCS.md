# Whiteboard Animation - Documentation Technique

## Architecture du Projet

### Composants Principaux

#### 1. AnimationContainer (src/components/AnimationContainer.jsx)
Le composant principal qui gère l'état de l'animation et coordonne tous les sous-composants.

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

#### 2. Scene (src/components/Scene.jsx)
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

#### 3. Timeline (src/components/Timeline.jsx)
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

### Métriques de Build

- Taille du bundle JS: ~195 KB (62 KB gzippé)
- Taille du CSS: ~1.6 KB (0.68 KB gzippé)
- Temps de build: ~240ms

## Extension Future

### Fonctionnalités Potentielles

1. **Audio Synchronization**
   - Intégration Web Audio API
   - Synchronisation audio/visuel précise
   - Contrôle de volume

2. **Animations Avancées**
   - Types d'animations supplémentaires (slide, scale, rotate)
   - Animations d'éléments individuels
   - Keyframes personnalisables

3. **Édition Interactive**
   - Interface d'édition des scènes
   - Upload d'images
   - Prévisualisation en temps réel

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
