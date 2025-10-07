# Animation par Fichier JSON - Guide d'Utilisation

## Vue d'Ensemble

Le composant HandWritingAnimation supporte maintenant deux modes de fonctionnement:

1. **Mode Image**: Génération d'animation à partir d'une image (fonctionnalité existante)
2. **Mode JSON** (NOUVEAU): Lecture et replay d'animations exportées depuis le script Python

## Mode JSON - Comment Utiliser

### Prérequis

Pour utiliser le mode JSON, vous devez avoir:
1. Un fichier JSON d'animation (généré par le script Python avec `--export-json`)
2. L'image source originale utilisée pour générer le JSON

### Étapes d'Utilisation

#### 1. Générer le JSON depuis Python (une fois)

```bash
cd public/animator
python whiteboard_animator.py votre_image.png --export-json
```

Cela génère deux fichiers:
- `output_YYYYMMDD_HHMMSS.mp4` - La vidéo générée
- `animation_YYYYMMDD_HHMMSS.json` - Les données d'animation

#### 2. Utiliser dans l'Éditeur Web

1. Ouvrez l'application web (HandWritingAnimation)
2. Cliquez sur **"Mode JSON"** pour basculer en mode JSON
3. Cliquez sur **"Upload JSON"** et sélectionnez votre fichier JSON
4. Cliquez sur **"Upload Source Image"** et sélectionnez l'image originale
5. Cliquez sur **"Rejouer"** pour générer la vidéo
6. Une fois terminé, téléchargez la vidéo avec **"Download"**

### Avantages du Mode JSON

- **Rapidité**: Pas besoin de recalculer les strokes et la séquence de dessin
- **Reproductibilité**: La même animation sera générée à chaque fois
- **Flexibilité**: Modifiez le JSON pour ajuster le timing ou la séquence
- **Portabilité**: Partagez vos animations sous forme de fichiers JSON légers

## Structure du Fichier JSON

Le fichier JSON exporté contient:

```json
{
  "metadata": {
    "frame_rate": 30,          // Images par seconde
    "width": 640,              // Largeur vidéo
    "height": 360,             // Hauteur vidéo
    "split_len": 20,           // Taille de la grille
    "object_skip_rate": 20,    // Taux de saut
    "total_frames": 100,       // Nombre total de frames
    "hand_dimensions": {       // Dimensions de la main
      "width": 284,
      "height": 467
    }
  },
  "animation": {
    "drawing_sequence": [],
    "frames_written": [        // Séquence frame par frame
      {
        "frame_number": 0,
        "tile_drawn": {
          "grid_position": [8, 8],
          "pixel_coords": {
            "x_start": 160,
            "x_end": 180,
            "y_start": 160,
            "y_end": 180
          }
        },
        "hand_position": {
          "x": 170,
          "y": 170
        },
        "tiles_remaining": 13
      }
      // ... plus de frames
    ]
  }
}
```

## Cas d'Utilisation

### 1. Workflow Typique

```
Image Source → Python (traitement) → JSON + Vidéo
                                          ↓
                        JSON + Image → Éditeur Web → Vidéo Web
```

### 2. Édition Manuelle du JSON

Vous pouvez éditer manuellement le JSON pour:
- Modifier la vitesse (ajuster `frame_rate`)
- Changer l'ordre de dessin (réorganiser `frames_written`)
- Ajuster les positions de la main
- Filtrer certaines frames

### 3. Intégration dans des Pipelines

Le mode JSON permet d'intégrer facilement l'animation dans:
- Applications web React
- Systèmes de génération de vidéos automatiques
- Outils d'édition personnalisés
- APIs de traitement vidéo

## Comparaison des Modes

| Caractéristique | Mode Image | Mode JSON |
|----------------|------------|-----------|
| Vitesse | Lent (calcul des strokes) | Rapide (données pré-calculées) |
| Flexibilité | Haute (paramètres ajustables) | Moyenne (séquence fixe) |
| Reproductibilité | Moyenne | Haute |
| Taille fichier | ~1-5 MB (image) | ~10-500 KB (JSON) |
| Use case | Première génération | Replay, production |

## Dépannage

### Erreur "Format JSON invalide"
- Vérifiez que le fichier JSON contient bien `metadata` et `animation.frames_written`
- Assurez-vous que le JSON n'est pas corrompu

### Image ne correspond pas
- Utilisez exactement la même image qui a été utilisée pour générer le JSON
- Vérifiez que les dimensions correspondent à celles dans `metadata.width` et `metadata.height`

### Animation trop rapide/lente
- Modifiez `metadata.frame_rate` dans le JSON
- Valeurs typiques: 15-60 FPS

## Exemples

Un fichier JSON d'exemple est disponible dans:
```
public/animator/examples/sample_animation.json
```

## Pour Aller Plus Loin

- Voir `public/animator/EXPORT_FORMAT.md` pour les détails du format JSON
- Voir `public/animator/examples/use_animation_data.py` pour analyser les JSON en Python
- Consultez le code source dans `src/components/HandWritingAnimation.jsx`

## Support

Pour toute question ou problème:
1. Vérifiez la documentation dans `public/animator/`
2. Examinez les exemples fournis
3. Ouvrez une issue sur GitHub avec les détails de votre problème
