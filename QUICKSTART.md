# Quick Start Guide - Whiteboard Animation

## Démarrage Rapide (5 minutes)

### 1. Installation (1 min)

```bash
git clone https://github.com/armelgeek/whiteboard-anim.git
cd whiteboard-anim
npm install
```

### 2. Lancement (30 secondes)

```bash
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

### 3. Créer votre première histoire (3 minutes)

Éditez `src/data/scenes.js`:

```javascript
export const sampleStory = [
  {
    id: 'intro',
    title: 'Mon Projet',
    content: 'Une présentation captivante de mon idée...',
    duration: 5,
    backgroundImage: null,
    animation: 'fade'
  },
  {
    id: 'problem',
    title: 'Le Problème',
    content: 'Quel problème résolvons-nous?',
    duration: 5,
    backgroundImage: null,
    animation: 'fade'
  },
  {
    id: 'solution',
    title: 'Notre Solution',
    content: 'Voici comment nous le résolvons...',
    duration: 5,
    backgroundImage: null,
    animation: 'fade'
  }
];
```

Sauvegardez et voyez les changements en temps réel!

## Cas d'Usage Communs

### Ajouter une image de fond

```javascript
{
  id: 'scene-1',
  title: 'Bienvenue',
  content: 'Introduction...',
  duration: 5,
  backgroundImage: 'https://example.com/image.jpg', // ← Ajoutez l'URL ici
  animation: 'fade'
}
```

### Ajuster la durée des scènes

```javascript
duration: 10,  // Scène plus longue (10 secondes)
duration: 3,   // Scène courte (3 secondes)
```

### Créer une histoire de 10 scènes

```javascript
export const myStory = Array.from({ length: 10 }, (_, i) => ({
  id: `scene-${i + 1}`,
  title: `Scène ${i + 1}`,
  content: `Contenu de la scène ${i + 1}`,
  duration: 5,
  backgroundImage: null,
  animation: 'fade'
}));
```

## Commandes Essentielles

```bash
# Développement avec hot reload
npm run dev

# Build pour production
npm run build

# Vérifier le code
npm run lint

# Prévisualiser le build
npm run preview
```

## Personnalisation Rapide

### Changer les couleurs

Éditez `tailwind.config.js`:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Bleu
        secondary: '#10B981',  // Vert
      }
    },
  },
}
```

### Modifier les animations

Éditez `src/App.css` pour ajouter vos animations:

```css
@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

## Résolution de Problèmes

### L'animation ne démarre pas
- Vérifiez que `duration` est > 0 dans toutes les scènes
- Ouvrez la console du navigateur pour les erreurs

### Les styles ne s'appliquent pas
- Vérifiez que Tailwind est correctement configuré
- Essayez `npm run build` pour régénérer les styles

### Le serveur ne démarre pas
```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Exemples de Scénarios

### Pitch de Startup (30 secondes)

```javascript
export const pitchStory = [
  { id: 'hook', title: 'Le Problème', content: 'Chaque jour, des millions...', duration: 5 },
  { id: 'solution', title: 'Notre Solution', content: 'Nous proposons...', duration: 5 },
  { id: 'market', title: 'Le Marché', content: 'Un marché de X milliards...', duration: 5 },
  { id: 'team', title: 'Notre Équipe', content: 'Des experts en...', duration: 5 },
  { id: 'cta', title: 'Rejoignez-nous', content: 'Investissez dans...', duration: 5 },
  { id: 'contact', title: 'Contact', content: 'contact@startup.com', duration: 5 }
];
```

### Tutoriel (1 minute)

```javascript
export const tutorialStory = [
  { id: 'intro', title: 'Introduction', content: 'Dans ce tutoriel...', duration: 8 },
  { id: 'step1', title: 'Étape 1', content: 'Commencez par...', duration: 10 },
  { id: 'step2', title: 'Étape 2', content: 'Ensuite...', duration: 10 },
  { id: 'step3', title: 'Étape 3', content: 'Enfin...', duration: 10 },
  { id: 'tips', title: 'Conseils', content: 'Astuces importantes...', duration: 10 },
  { id: 'outro', title: 'Conclusion', content: 'Félicitations!', duration: 12 }
];
```

### Présentation Produit (45 secondes)

```javascript
export const productStory = [
  { id: 'hero', title: 'Notre Produit', content: 'Découvrez...', duration: 7 },
  { id: 'feature1', title: 'Fonctionnalité 1', content: 'Performance...', duration: 8 },
  { id: 'feature2', title: 'Fonctionnalité 2', content: 'Simplicité...', duration: 8 },
  { id: 'feature3', title: 'Fonctionnalité 3', content: 'Sécurité...', duration: 8 },
  { id: 'pricing', title: 'Tarifs', content: 'À partir de...', duration: 7 },
  { id: 'cta', title: 'Essayez Maintenant', content: 'Gratuit 30 jours', duration: 7 }
];
```

## Prochaines Étapes

1. ✅ Créez votre première histoire
2. ✅ Testez les contrôles de lecture
3. ✅ Personnalisez les styles
4. 📚 Consultez `TECHNICAL_DOCS.md` pour les détails techniques
5. 🎨 Ajoutez des images de fond
6. 🚀 Déployez sur Vercel/Netlify

## Ressources

- 📖 [Documentation complète](README.md)
- 🔧 [Documentation technique](TECHNICAL_DOCS.md)
- 💬 [Issues GitHub](https://github.com/armelgeek/whiteboard-anim/issues)

## Support

Besoin d'aide? Ouvrez une issue sur GitHub!

---

**Astuce Pro**: Utilisez les boutons de scène dans la timeline pour prévisualiser rapidement chaque scène pendant le développement. 🎬
