# Guide de l'Éditeur de Miniatures Interactif

## Vue d'ensemble

L'éditeur de miniatures a été transformé en un éditeur d'images interactif complet utilisant React Konva. Il permet de créer des miniatures YouTube professionnelles (1280x720) avec un contrôle total sur le positionnement des éléments.

## Fonctionnalités Principales

### 1. Canvas Interactif

**Manipulation Directe**
- Cliquez et faites glisser les éléments pour les positionner
- Redimensionnez les images avec les poignées de transformation
- Faites pivoter les images avec la poignée de rotation
- Cliquez sur une zone vide pour désélectionner

**Format**
- Taille fixe: 1280x720 pixels (format YouTube)
- Export haute qualité avec pixel ratio 2x

### 2. Système de Calques

**Gestion des Calques**
- **Ajouter** des images et du texte sans limite
- **Réorganiser** les calques (boutons ▲▼)
- **Supprimer** des calques individuellement
- **Sélectionner** un calque en cliquant dessus dans la liste ou sur le canvas

**Types de Calques**
- 🖼️ **Image** - Images importées avec transformation complète
- **T** **Texte** - Texte éditable avec effets

### 3. Import d'Images

**Comment Importer**
1. Cliquez sur le bouton "Importer Image"
2. Sélectionnez une image depuis votre ordinateur
3. L'image apparaît au centre du canvas
4. Faites-la glisser pour la positionner
5. Utilisez les poignées pour redimensionner/pivoter

**Formats Supportés**
- PNG, JPG, JPEG, GIF, WebP
- Toutes les images web standard

### 4. Édition de Texte

**Ajouter du Texte**
1. Cliquez sur "Ajouter Texte"
2. Un nouveau calque de texte apparaît
3. Sélectionnez-le pour éditer ses propriétés

**Propriétés du Texte**
- **Texte** - Contenu à afficher
- **Taille** - 12 à 120 pixels
- **Couleur** - Couleur du texte
- **Contour** - Couleur du contour
- **Épaisseur contour** - 0 à 20 pixels
- **Ombre portée** - Activer/désactiver

**Positionnement**
- Le texte est centré sur sa position
- Faites-le glisser pour le repositionner
- Utilisez les poignées latérales pour ajuster la taille

### 5. Arrière-plan

**Couleur de Fond**
- Sélecteur de couleur personnalisé
- 6 préréglages de couleurs:
  - 🔴 Rouge (#dc2626)
  - 🔵 Bleu (#1e40af)
  - 🟢 Vert (#059669)
  - 🟣 Violet (#7c3aed)
  - 🟠 Orange (#ea580c)
  - 🟡 Jaune (#fbbf24)

### 6. Grille de Composition

**Règle des Tiers**
- Activez "Afficher la grille de composition"
- La grille divise le canvas en 9 sections égales
- Aide à positionner les éléments de manière équilibrée
- Suit la règle des tiers photographique

### 7. Export

**Télécharger PNG**
- Export haute qualité (2x pixel ratio = 2560x1440)
- Nom du fichier: `thumbnail-{scene-id}.png`
- Toutes les couches fusionnées

**Enregistrer**
- Sauvegarde dans les données de la scène
- Préserve la structure des calques
- Peut être rechargée pour édition ultérieure

## Raccourcis et Astuces

### Sélection
- **Clic** sur un élément → Sélectionner
- **Clic** sur zone vide → Désélectionner
- **Clic** dans la liste des calques → Sélectionner

### Positionnement
- **Glisser** → Déplacer
- **Poignées d'angle** → Redimensionner
- **Poignée de rotation** → Faire pivoter (images uniquement)

### Organisation
- **▲** → Monter le calque (premier plan)
- **▼** → Descendre le calque (arrière-plan)
- **🗑️** → Supprimer le calque

### Workflow Recommandé

1. **Définir l'arrière-plan**
   - Choisissez une couleur de fond
   - Ou importez une image de fond

2. **Ajouter les éléments**
   - Importez vos images
   - Ajoutez des textes

3. **Positionner**
   - Utilisez la grille pour l'alignement
   - Glissez les éléments en place
   - Redimensionnez si nécessaire

4. **Organiser**
   - Réordonnez les calques pour la superposition
   - Supprimez les éléments inutiles

5. **Finaliser**
   - Ajustez les détails
   - Exportez en PNG

## Exemples d'Utilisation

### Miniature Simple
```
1. Arrière-plan: Bleu (#1e40af)
2. Texte principal: "LE TITRE" (72px, blanc, contour noir)
3. Sous-texte: "Description" (48px, jaune)
```

### Miniature avec Image
```
1. Arrière-plan: Noir (#0f172a)
2. Image: Photo de produit (redimensionnée et positionnée)
3. Texte: "NOUVEAU!" (120px, rouge, ombre portée)
```

### Miniature Complexe
```
1. Arrière-plan: Dégradé (image importée)
2. Image 1: Logo (coin supérieur gauche)
3. Image 2: Produit (centre)
4. Texte 1: Titre principal (haut)
5. Texte 2: Prix (bas, surligné)
```

## Différences avec l'Ancien Éditeur

| Fonctionnalité | Ancien | Nouveau |
|----------------|---------|----------|
| Positionnement | Curseurs % | Drag & drop |
| Images | 1 fond fixe | Multiples + transform |
| Texte | 2 textes max | Illimité |
| Transformation | Non | Oui (resize, rotate) |
| Calques | Non | Oui (liste complète) |
| Interactivité | Limitée | Complète |
| Alignement | Manuel | Grille + visuel |

## Limites Connues

- Les images très volumineuses peuvent ralentir le navigateur
- L'historique d'annulation n'est pas encore implémenté
- Pas de groupement de calques
- Pas de verrouillage de calques

## Support et Compatibilité

**Navigateurs**
- Chrome/Edge: ✅ Complet
- Firefox: ✅ Complet
- Safari: ✅ Complet
- Mobile: ⚠️ Fonctionnel mais optimisé pour desktop

**Performances**
- Optimisé pour 10-15 calques
- Recommended: 5-10 calques pour fluidité maximale

## Dépannage

**L'image ne s'affiche pas**
- Vérifiez le format du fichier
- Essayez un fichier plus petit
- Rechargez la page

**Le texte ne se positionne pas correctement**
- Sélectionnez le calque de texte
- Vérifiez qu'il est bien sélectionné (surbrillance bleue)
- Glissez-le à la position souhaitée

**La transformation ne fonctionne pas**
- Cliquez sur l'élément pour le sélectionner
- Les poignées doivent apparaître
- Les textes n'ont que les poignées latérales

## Développement Futur

Fonctionnalités prévues:
- [ ] Historique d'annulation (Ctrl+Z)
- [ ] Duplication de calques
- [ ] Effets et filtres d'images
- [ ] Templates pré-configurés
- [ ] Import depuis URL
- [ ] Verrouillage de calques
- [ ] Groupement de calques
- [ ] Plus de formes géométriques

---

**Note**: Cet éditeur utilise React Konva, la même technologie que l'éditeur de scènes principal, assurant cohérence et performances.
