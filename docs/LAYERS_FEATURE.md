# Guide d'utilisation des couches (Layers)

## Vue d'ensemble

La fonctionnalité de couches (layers) permet de superposer plusieurs images sur une même scène, similaire à des applications comme Insta Doodle. Chaque couche peut être positionnée précisément, avoir sa propre vitesse d'animation, et des propriétés visuelles personnalisées.

## Accès à l'éditeur de couches

1. Cliquez sur la zone d'animation (canvas) dans l'application
2. L'éditeur de couches s'ouvrira dans une fenêtre modale
3. Vous verrez un canvas d'aperçu à gauche et un panneau de propriétés à droite

## Ajouter une couche

1. Cliquez sur le bouton **"Ajouter une couche"** en haut du canvas
2. Sélectionnez une image depuis votre ordinateur
3. L'image apparaîtra sur le canvas et sera automatiquement sélectionnée
4. La couche sera ajoutée à la liste dans le panneau de droite

## Manipuler les couches sur le canvas

### Déplacer une couche
- Cliquez et glissez l'image directement sur le canvas
- Ou modifiez les valeurs Position X et Position Y dans le panneau de propriétés

### Redimensionner une couche
- Cliquez sur la couche pour la sélectionner
- Utilisez les poignées de transformation qui apparaissent
- Ou ajustez le curseur "Échelle" dans le panneau de propriétés

### Transformer une couche
- Faites pivoter, redimensionnez et repositionnez directement sur le canvas
- Les transformations sont en temps réel

## Propriétés des couches

### Nom
Donnez un nom descriptif à votre couche pour mieux l'identifier.

### Position (X, Y)
- **Position X**: Position horizontale en pixels (0 = gauche)
- **Position Y**: Position verticale en pixels (0 = haut)

### Z-Index (Ordre)
- Détermine l'ordre de superposition des couches
- Plus le nombre est élevé, plus la couche est au-dessus
- Les couches avec un z-index plus faible sont dessinées en premier

### Échelle
- Contrôle la taille de la couche (0.1 à 3.0)
- 1.0 = taille originale
- < 1.0 = réduction
- > 1.0 = agrandissement

### Opacité
- Contrôle la transparence de la couche (0% à 100%)
- 100% = complètement opaque
- 0% = complètement transparent
- Valeurs intermédiaires = semi-transparent

### Skip Rate (Vitesse de dessin)
- Contrôle la vitesse à laquelle la couche est "dessinée" dans l'animation
- Valeurs de 1 à 50
- Plus élevé = dessin plus rapide
- Utilisé pour l'effet d'animation whiteboard

### Mode de dessin
Trois modes disponibles :

1. **Draw (Dessin progressif)** : La couche apparaît progressivement comme si elle était dessinée
2. **Eraser (Gomme)** : La couche agit comme une gomme sur les couches en dessous
3. **Static (Statique)** : La couche apparaît instantanément sans animation

### Type
- **Image** : Pour les images importées
- **Texte** : Pour les couches de texte (fonctionnalité future)

## Gestion des couches

### Liste des couches
Dans le panneau de droite, vous verrez la liste de toutes les couches de la scène avec :
- Une icône d'image 🖼️
- Le nom de la couche
- Le z-index actuel

### Actions sur les couches

#### Réorganiser l'ordre
- Utilisez les boutons **↑** (Déplacer vers le haut) et **↓** (Déplacer vers le bas)
- Change l'ordre dans la liste et met à jour automatiquement le z-index

#### Dupliquer une couche
- Cliquez sur le bouton **📋** (Dupliquer)
- Crée une copie exacte de la couche avec un léger décalage de position

#### Supprimer une couche
- Cliquez sur le bouton **🗑️** (Supprimer)
- La couche sera supprimée définitivement (pensez à sauvegarder avant)

## Sauvegarder vos modifications

1. Une fois satisfait de vos couches, cliquez sur **"Enregistrer"**
2. Les modifications seront appliquées à la scène
3. Vous verrez le nombre de couches (🖼️ X) affiché dans le panneau des scènes

## Format de données

Les couches sont stockées dans le format suivant :

```json
{
  "id": "scene-1",
  "title": "Ma Scène",
  "content": "Contenu de la scène",
  "duration": 5,
  "layers": [
    {
      "id": "layer-1234567890",
      "image_path": "data:image/png;base64,...",
      "name": "mon-image.png",
      "position": { "x": 100, "y": 100 },
      "z_index": 1,
      "skip_rate": 10,
      "scale": 1.0,
      "opacity": 1.0,
      "mode": "draw",
      "type": "image"
    }
  ]
}
```

## Conseils et astuces

### Créer une composition complexe
1. Commencez par un fond (z-index = 1)
2. Ajoutez des éléments de base (z-index = 2, 3, ...)
3. Finissez par les éléments de premier plan (z-index élevé)

### Optimiser la vitesse d'animation
- Utilisez un skip_rate plus élevé (20-30) pour des éléments rapides
- Utilisez un skip_rate plus bas (5-10) pour des détails fins

### Créer des effets de transparence
- Combinez plusieurs couches avec différentes opacités
- Utilisez l'opacité pour créer des effets de fondu

### Organiser vos couches
- Donnez des noms descriptifs à chaque couche
- Utilisez l'ordre de la liste pour garder une vue d'ensemble claire

## Limitations actuelles

- Les couches de type "texte" ne sont pas encore implémentées
- Les animations d'entrée/sortie personnalisées ne sont pas encore disponibles
- Le morphing entre couches n'est pas encore implémenté
- Les contrôles de caméra (zoom, focus) ne sont pas encore disponibles

Ces fonctionnalités sont prévues pour les prochaines versions.

## Dépannage

### La couche n'apparaît pas
- Vérifiez que l'opacité n'est pas à 0%
- Vérifiez la position (elle pourrait être hors du canvas)
- Vérifiez le z-index (elle pourrait être cachée par d'autres couches)

### Les transformations ne fonctionnent pas
- Assurez-vous que la couche est bien sélectionnée (clic dessus)
- Si le canvas ne répond pas, essayez de fermer et rouvrir l'éditeur

### L'image est trop grande/petite
- Utilisez le curseur "Échelle" pour ajuster la taille
- Ou utilisez les poignées de transformation sur le canvas

## Support

Pour toute question ou problème :
1. Consultez cette documentation
2. Vérifiez le format JSON de vos données
3. Ouvrez une issue sur GitHub avec les détails de votre problème
