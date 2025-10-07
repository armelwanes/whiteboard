# Whiteboard Animation

Une application web interactive pour créer des vidéos d'animation structurées en plusieurs scènes cohérentes avec synchronisation audio et timeline avancée.

![Whiteboard Animation Demo](https://github.com/user-attachments/assets/3cd5387b-13f3-4a2f-93d6-5eac1b364561)

## 🎯 Fonctionnalités

- **Gestion de scènes avancée** : Interface complète pour gérer vos scènes
  - Panneau latéral avec aperçu de toutes les scènes
  - Ajout, suppression, duplication et réorganisation des scènes
  - Éditeur modal pour modifier les propriétés des scènes
- **Animation Handwriting** : Deux modes de génération d'animations
  - **Mode Image** : Génération automatique d'animation à partir d'une image
  - **Mode JSON** ⭐ NOUVEAU : Replay d'animations exportées depuis Python
- **Scènes multiples** : Divisez votre narration en plusieurs scènes distinctes
- **Timeline avancée** : Contrôlez précisément la synchronisation des éléments visuels
- **Animations fluides** : Transitions élégantes entre les scènes
- **Contrôles de lecture** : Play, pause, et navigation entre les scènes
- **Persistance des données** : Vos scènes sont sauvegardées automatiquement dans le navigateur
- **Interface intuitive** : Interface utilisateur moderne construite avec React et Tailwind CSS
- **Responsive** : Fonctionne sur tous les écrans

## 🚀 Technologies utilisées

- **Vite** : Outil de build rapide pour le développement
- **React** : Bibliothèque JavaScript pour l'interface utilisateur
- **Tailwind CSS** : Framework CSS utilitaire pour le style
- **JavaScript (ES6+)** : Langage de programmation moderne

## 📦 Installation

```bash
# Cloner le projet
git clone https://github.com/armelgeek/whiteboard-anim.git
cd whiteboard-anim

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le projet sera accessible sur `http://localhost:5173/`

## 🏗️ Build pour la production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

## 📁 Structure du projet

```
whiteboard-anim/
├── src/
│   ├── components/
│   │   ├── AnimationContainer.jsx  # Conteneur principal de l'animation
│   │   ├── Scene.jsx                # Composant pour chaque scène
│   │   ├── ScenePanel.jsx           # Panneau de gestion des scènes
│   │   ├── SceneEditor.jsx          # Éditeur modal de scènes
│   │   ├── Toolbar.jsx              # Barre d'outils
│   │   └── Timeline.jsx             # Contrôles de la timeline
│   ├── data/
│   │   └── scenes.js                # Données des scènes (template initial)
│   ├── App.jsx                      # Composant principal avec gestion d'état
│   ├── App.css                      # Styles personnalisés
│   ├── index.css                    # Styles Tailwind
│   └── main.jsx                     # Point d'entrée
├── public/                          # Assets statiques
├── index.html                       # Template HTML
├── tailwind.config.js               # Configuration Tailwind
├── postcss.config.js                # Configuration PostCSS
├── vite.config.js                   # Configuration Vite
└── package.json                     # Dépendances du projet
```

## 🎬 Utilisation

### Interface de gestion des scènes

L'application dispose maintenant d'une interface complète de gestion des scènes :

#### Panneau latéral (gauche)
- Visualisez toutes vos scènes avec aperçu
- Cliquez sur "+ Ajouter une scène" pour créer une nouvelle scène
- Sélectionnez une scène pour la modifier
- Utilisez les boutons ↑ ↓ pour réorganiser les scènes
- Cliquez sur 📋 pour dupliquer une scène
- Cliquez sur 🗑 pour supprimer une scène

#### Barre d'outils (haut)
- **✏️ Éditer** : Ouvre l'éditeur de scène
- **🔤 Texte** : Ajouter du texte (à venir)
- **⬜ Formes** : Ajouter des formes (à venir)
- **🖼️ Image** : Ajouter des images (à venir)
- **📹 Caméra** : Contrôles caméra (à venir)

#### Éditeur de scène
L'éditeur modal vous permet de personnaliser chaque scène :
- **Titre** : Nom de la scène
- **Contenu** : Description ou narration
- **Durée** : Entre 1 et 60 secondes
- **Image de fond** : URL d'une image (avec aperçu)
- **Type d'animation** : Fade, Slide, ou Scale

### Créer une nouvelle histoire (méthode traditionnelle)

Vous pouvez toujours créer des scènes en modifiant le fichier `src/data/scenes.js` :

```javascript
export const sampleStory = [
  {
    id: 'scene-1',
    title: 'Votre titre',
    content: 'Votre contenu...',
    duration: 5, // durée en secondes
    backgroundImage: null, // optionnel: URL d'une image de fond
    animation: 'fade' // type d'animation
  },
  // Ajoutez plus de scènes...
];
```

### Propriétés des scènes

- **id** : Identifiant unique de la scène
- **title** : Titre affiché dans la scène
- **content** : Contenu/texte de la scène
- **duration** : Durée de la scène en secondes
- **backgroundImage** : URL optionnelle d'une image de fond
- **animation** : Type d'animation ('fade', 'slide', 'scale')

### Contrôles de lecture

- **▶ Play / ⏸ Pause** : Démarre ou met en pause l'animation
- **Timeline** : Cliquez sur la barre de progression pour naviguer
- **Boutons de scènes** : Cliquez pour sauter directement à une scène

### Persistance des données

Vos scènes sont automatiquement sauvegardées dans le navigateur (localStorage). 
Pour réinitialiser et revenir à l'histoire d'exemple, effacez les données du site dans les paramètres de votre navigateur.

## 🎨 Personnalisation

### Modifier les styles

Les styles peuvent être personnalisés dans :
- `src/App.css` : Animations et styles personnalisés
- `src/index.css` : Directives Tailwind
- `tailwind.config.js` : Configuration Tailwind (thèmes, couleurs, etc.)

### Ajouter des animations

Ajoutez de nouvelles animations CSS dans `src/App.css` :

```css
@keyframes votreAnimation {
  from { /* état initial */ }
  to { /* état final */ }
}
```

## 📝 Exemples de scénarios

L'application inclut un exemple d'histoire "Le parcours de l'apprentissage" avec 5 scènes :
1. Le Début
2. La Découverte
3. Les Défis
4. La Persévérance
5. Le Succès

Chaque scène dure 5 secondes, pour une durée totale de 25 secondes.

## 🎨 Animation Handwriting - Mode JSON

Le composant HandWriting supporte maintenant le **Mode JSON** qui permet de rejouer des animations exportées depuis le script Python.

### Utilisation rapide

1. Générez le JSON avec Python:
```bash
cd public/animator
python whiteboard_animator.py votre_image.png --export-json
```

2. Dans l'éditeur web:
   - Basculez en **"Mode JSON"**
   - Uploadez le fichier JSON généré
   - Uploadez l'image source originale
   - Cliquez sur **"Rejouer"**

### Avantages
- ⚡ Génération rapide (pas de recalcul)
- 🔄 Reproductibilité parfaite
- 📝 Éditable (modifiez le JSON pour ajuster)
- 💾 Léger (JSON < 1MB vs vidéo plusieurs MB)

📖 **Documentation complète**: Voir `docs/JSON_ANIMATION_MODE.md`

## 🔧 Développement

```bash
# Lancer en mode développement avec hot reload
npm run dev

# Vérifier le code avec ESLint
npm run lint

# Builder pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🙏 Remerciements

- [Vite](https://vitejs.dev/) pour l'excellent outil de build
- [React](https://react.dev/) pour la bibliothèque UI
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS

---

Créé avec ❤️ pour raconter des histoires de manière visuelle et interactive
