# Recadrage d'Images - Guide d'Utilisation

## Vue d'Ensemble

Lors de l'upload d'images dans l'application, un outil de recadrage interactif vous permet de sélectionner uniquement la partie de l'image que vous souhaitez utiliser. Cette fonctionnalité est disponible pour:
- **Ajout de couches d'images** dans l'éditeur de scènes
- **Upload d'images** dans le mode Hand Writing Animation (Mode Image et Mode JSON)

## Comment utiliser le recadrage

### Dans l'Éditeur de Scènes

1. Cliquez sur le bouton **"Ajouter une image"** (icône d'upload) dans le panneau des propriétés
2. Sélectionnez une image depuis votre ordinateur
3. La fenêtre de recadrage s'ouvre automatiquement
4. Ajustez la zone de sélection:
   - **Faites glisser** les poignées pour redimensionner
   - **Déplacez** la zone de sélection en cliquant et glissant à l'intérieur
   - **Aspect libre**: Vous pouvez recadrer dans n'importe quelle proportion
5. Choisissez une action:
   - **"Appliquer le recadrage"**: Utilise uniquement la zone sélectionnée
   - **"Utiliser l'image entière"**: Conserve l'image complète sans recadrage
   - **"Annuler"**: Annule l'upload

### Dans Hand Writing Animation

1. En **Mode Image**: Cliquez sur "Upload Image"
2. En **Mode JSON**: Après avoir chargé un JSON, cliquez sur "Upload Source Image"
3. Sélectionnez votre image
4. Utilisez l'outil de recadrage comme décrit ci-dessus

## Interface de Recadrage

### Éléments de l'interface

```
┌─────────────────────────────────────────┐
│  🖼️ Recadrer l'image               ❌   │
├─────────────────────────────────────────┤
│                                         │
│    [Image avec zone de sélection]       │
│    └─ Poignées de redimensionnement     │
│                                         │
├─────────────────────────────────────────┤
│ Instructions: Faites glisser...         │
├─────────────────────────────────────────┤
│  [Annuler] [Image entière] [Appliquer]  │
└─────────────────────────────────────────┘
```

### Contrôles

- **Poignées d'angle**: Redimensionnent en conservant ou modifiant les proportions
- **Poignées latérales**: Ajustent la largeur ou hauteur
- **Zone de sélection**: Cliquez et glissez pour déplacer

## Cas d'Utilisation

### 1. Extraire une partie d'une image composée

Si vous avez une image avec plusieurs éléments (comme l'exemple dans l'issue avec 3 panneaux), vous pouvez:
- Recadrer le panneau gauche uniquement
- Recadrer le panneau central uniquement  
- Recadrer le panneau droit uniquement

Chaque recadrage devient une couche séparée que vous pouvez animer indépendamment.

### 2. Supprimer les marges

Éliminez les bordures blanches ou les zones vides autour de votre contenu principal.

### 3. Focus sur un détail

Zoomez sur une partie spécifique d'une grande image pour créer un effet de focus.

### 4. Optimiser la taille

Réduisez la taille des fichiers en ne conservant que la partie utile de l'image.

## Avantages

✅ **Interactif**: Aperçu en temps réel de la zone sélectionnée  
✅ **Flexible**: Pas de contraintes d'aspect ratio  
✅ **Non-destructif**: L'image originale n'est jamais modifiée  
✅ **Optionnel**: Vous pouvez toujours utiliser l'image complète  
✅ **Précis**: Contrôle pixel par pixel avec les poignées

## Notes Techniques

- **Format de sortie**: PNG (préserve la transparence)
- **Qualité**: Conservation de la qualité originale dans la zone sélectionnée
- **Performance**: Le recadrage est effectué côté client (dans le navigateur)
- **Compatibilité**: Fonctionne avec tous les formats d'images supportés (PNG, JPG, GIF, etc.)

## Raccourcis Clavier

Lorsque la zone de recadrage est active:
- **Flèches**: Déplacent la zone de sélection (si supporté par le navigateur)
- **Échap**: Ferme la fenêtre (équivalent à Annuler)
- **Entrée**: Applique le recadrage (si supporté par le navigateur)

## Exemple d'Utilisation: Comic Strip

Pour créer une animation à partir d'un comic strip avec 3 panneaux:

1. **Upload de l'image complète** → Fenêtre de recadrage s'ouvre
2. **Recadrer le panneau 1** → Appliquer → Créer une couche
3. **Upload à nouveau** → Recadrer le panneau 2 → Appliquer → Nouvelle couche
4. **Upload encore** → Recadrer le panneau 3 → Appliquer → Nouvelle couche
5. **Animer chaque couche** indépendamment avec des timelines différentes

Résultat: Animation fluide passant d'un panneau à l'autre!
