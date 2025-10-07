# Quick Start - Animation par JSON

## Pour l'utilisateur (Quick Reference)

### Workflow Simple

#### Étape 1: Générer le JSON (Python)
```bash
cd public/animator
python whiteboard_animator.py mon_image.png --export-json
```
**Résultat**: 2 fichiers générés
- `animation_YYYYMMDD_HHMMSS.json` ← Vous avez besoin de celui-ci
- `output_YYYYMMDD_HHMMSS.mp4`

#### Étape 2: Utiliser dans l'éditeur Web
1. Ouvrir l'application: `npm run dev`
2. Cliquer sur **"Hand Writing Test"** dans la toolbar
3. Cliquer sur **"Mode JSON"** (bouton bleu)
4. **Upload JSON**: Sélectionner le fichier JSON généré
5. **Upload Source Image**: Sélectionner l'image originale (`mon_image.png`)
6. Cliquer sur **"Rejouer"**
7. Attendre la génération (barre de progression)
8. **"Download"** pour télécharger la vidéo WebM

### Avantages vs Mode Image

| Mode Image | Mode JSON |
|------------|-----------|
| Lent (calcul) | Rapide (pré-calculé) |
| Créatif | Reproductible |
| Flexible | Stable |

### Quand utiliser chaque mode?

**Mode Image**: 
- Première génération d'une animation
- Expérimentation avec différents paramètres
- Nouvelle image jamais traitée

**Mode JSON**:
- Re-générer une animation existante
- Production (besoin de reproductibilité)
- Modification du timing sans recalcul
- Intégration dans un pipeline automatisé

### Structure du JSON (Simplifié)

```json
{
  "metadata": {
    "frame_rate": 30,      // FPS
    "width": 640,          // Largeur
    "height": 360,         // Hauteur
    "total_frames": 100    // Nombre de frames
  },
  "animation": {
    "frames_written": [    // Séquence frame par frame
      {
        "frame_number": 0,
        "tile_drawn": { ... },
        "hand_position": { "x": 170, "y": 170 }
      }
      // ... autres frames
    ]
  }
}
```

### Personnalisation du JSON

Vous pouvez éditer manuellement le JSON pour:

1. **Changer la vitesse**:
   ```json
   "metadata": {
     "frame_rate": 60  // Double vitesse (était 30)
   }
   ```

2. **Inverser l'ordre de dessin**:
   ```javascript
   // Dans un éditeur JSON ou script
   data.animation.frames_written.reverse()
   ```

3. **Filtrer certaines frames** (dessiner moins):
   ```javascript
   // Garder seulement 1 frame sur 2
   data.animation.frames_written = 
     data.animation.frames_written.filter((_, i) => i % 2 === 0)
   ```

### Résolution de Problèmes

**Erreur: "Format JSON invalide"**
- Vérifier que le fichier JSON est bien généré par le script Python
- S'assurer que le fichier n'est pas corrompu

**Erreur: "Upload the source image"**
- Vous devez uploader l'image ORIGINALE (celle utilisée pour générer le JSON)
- Les dimensions doivent correspondre

**Animation trop rapide/lente**
- Modifier `metadata.frame_rate` dans le JSON
- Valeurs recommandées: 15-60

**La main n'apparaît pas**
- Vérifier que les images de la main sont dans `public/data/images/`
- Rafraîchir la page

### Fichiers d'Exemple

Un exemple complet est fourni:
- **JSON**: `public/animator/examples/sample_animation.json`
- Testez-le pour comprendre le format

### Documentation Complète

Pour plus de détails, voir:
- `docs/JSON_ANIMATION_MODE.md` - Guide complet
- `public/animator/EXPORT_FORMAT.md` - Format JSON détaillé
- `README.md` - Vue d'ensemble du projet

## Support

Questions? Consultez d'abord la documentation puis ouvrez une issue GitHub avec:
- Le message d'erreur exact
- Les étapes que vous avez suivies
- La taille de votre JSON et image
