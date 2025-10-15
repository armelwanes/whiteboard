# Documentation Whiteboard Animation

Bienvenue dans la documentation du projet Whiteboard Animation. Ce répertoire contient toutes les informations nécessaires pour comprendre, utiliser et développer les fonctionnalités de l'application.

## 📚 Index de la Documentation

### 🏗️ Architecture & Développement

- **[Guide d'Architecture & Développement](./ARCHITECTURE_GUIDE.md)** ⭐ RECOMMANDÉ
  - Architecture modulaire complète
  - Patterns de développement (React Query, Zustand, Zod)
  - Conventions et bonnes pratiques
  - Plan de migration progressive vers TypeScript

### 🎯 Fonctionnalités Principales

#### Gestion de Scènes & Timeline
- **[Système de Timeline](./TIMELINE_SYSTEM.md)** - Timeline avancée avec synchronisation
- **[Système Multi-Timeline](./MULTI_TIMELINE_SYSTEM.md)** - Gestion de plusieurs timelines
- **[Quickstart Multi-Timeline](./MULTI_TIMELINE_QUICKSTART.md)** - Guide de démarrage rapide

#### Animations
- **[Animation Handwriting](./HandWritingAnimation.md)** - Animations d'écriture manuscrite
- **[Mode JSON Animation](./JSON_ANIMATION_MODE.md)** - Replay d'animations depuis JSON
- **[Fix Mode JSON](./JSON_MODE_FIX.md)** - Corrections du mode JSON
- **[Système d'Animation de Texte](./TEXT_ANIMATION_SYSTEM.md)** - Effets d'animation de texte

#### Système de Caméra
- **[Système de Caméra](./CAMERA_SYSTEM.md)** - Contrôles et animations de caméra
- **[Viewport Caméra](./CAMERA_VIEWPORT_SYSTEM.md)** - Système de viewport pour la caméra

#### Export & Gestion des Couches
- **[Formats d'Export](./EXPORT_FORMATS.md)** - Différents formats d'export disponibles
- **[API Export de Couches](./JSON_EXPORT_IMPORT.md)** - Import/Export JSON des couches
- **[Fonctionnalité Couches](./LAYERS_FEATURE.md)** - Gestion avancée des couches

#### Médias & Assets
- **[Gestion des Assets](./ASSET_MANAGEMENT.md)** - Bibliothèque et gestion des ressources
- **[Support Audio](./AUDIO_SUPPORT.md)** - Intégration et synchronisation audio
- **[Recadrage d'Images](./IMAGE_CROPPING.md)** - Outil de crop d'images

#### Formes & Particules
- **[Nouvelles Formes](./NEW_SHAPES_DOCUMENTATION.md)** - Documentation des nouvelles formes
- **[Système de Particules](./PARTICLE_SYSTEM.md)** - Effets de particules

### 📝 Guides d'Utilisation

- **[Quickstart JSON](./QUICK_START_JSON.md)** - Guide rapide pour le mode JSON
- Voir le [README principal](../README.md) pour les instructions d'installation et d'utilisation de base

## 🎯 Par Où Commencer ?

### Pour les Développeurs
1. Lisez le **[Guide d'Architecture](./ARCHITECTURE_GUIDE.md)** pour comprendre la structure du projet
2. Consultez le **[Système de Timeline](./TIMELINE_SYSTEM.md)** pour comprendre le cœur de l'application
3. Explorez les fonctionnalités spécifiques selon vos besoins

### Pour les Contributeurs
1. Suivez les conventions décrites dans le [Guide d'Architecture](./ARCHITECTURE_GUIDE.md)
2. Consultez les documentations des fonctionnalités existantes avant d'en créer de nouvelles
3. Assurez-vous que votre code suit les patterns établis

### Pour les Utilisateurs
1. Commencez par le [README principal](../README.md)
2. Consultez les guides de fonctionnalités spécifiques selon vos besoins
3. Explorez les exemples fournis dans le dossier `examples/`

## 🔗 Liens Utiles

- [README Principal](../README.md)
- [Dossier Examples](../examples/)
- [Copilot Instructions](../.github/copilot-instructions.md)

## 📄 Structure des Documents

Chaque document de fonctionnalité suit généralement cette structure :
- Vue d'ensemble de la fonctionnalité
- Installation / Configuration
- Utilisation / API
- Exemples de code
- Notes techniques
- Limitations connues (si applicable)

## 🤝 Contribution à la Documentation

Lorsque vous ajoutez une nouvelle fonctionnalité, pensez à :
1. Créer un document markdown dans ce dossier
2. Mettre à jour cet index (README.md)
3. Ajouter des exemples dans le dossier `examples/` si pertinent
4. Mettre à jour le README principal si c'est une fonctionnalité majeure

---

*Dernière mise à jour : Octobre 2025*
