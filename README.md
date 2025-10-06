# Whiteboard Animation

Une application web interactive pour créer des vidéos d'animation structurées en plusieurs scènes cohérentes avec synchronisation audio et timeline avancée.

![Whiteboard Animation Demo](https://github.com/user-attachments/assets/3cd5387b-13f3-4a2f-93d6-5eac1b364561)

## 🎯 Fonctionnalités

- **Scènes multiples** : Divisez votre narration en plusieurs scènes distinctes
- **Timeline avancée** : Contrôlez précisément la synchronisation des éléments visuels
- **Animations fluides** : Transitions élégantes entre les scènes
- **Contrôles de lecture** : Play, pause, et navigation entre les scènes
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
│   │   └── Timeline.jsx             # Contrôles de la timeline
│   ├── data/
│   │   └── scenes.js                # Données des scènes
│   ├── App.jsx                      # Composant principal
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

### Créer une nouvelle histoire

Pour créer votre propre histoire avec plusieurs scènes, modifiez le fichier `src/data/scenes.js` :

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
- **animation** : Type d'animation (actuellement 'fade')

### Contrôles de lecture

- **▶ Play / ⏸ Pause** : Démarre ou met en pause l'animation
- **Timeline** : Cliquez sur la barre de progression pour naviguer
- **Boutons de scènes** : Cliquez pour sauter directement à une scène

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
