# Exemples de Configuration

Ce répertoire contient des exemples de fichiers de configuration JSON pour whiteboard-anim.

## text-layer-example.json

Fichier d'exemple démontrant l'utilisation des couches de texte avec animation handwriting.

### Contenu

Le fichier contient deux scènes :

#### Scène 1 : Démonstration Couche Texte
Trois couches de texte avec différents styles :

1. **Titre Principal** (Bleu, Gras, 64px)
   - Texte multi-lignes : "Bienvenue! / Texte avec Animation Handwriting"
   - Police : Arial
   - Alignement : Centre
   - Skip rate : 15 (animation rapide)

2. **Description** (Gris foncé, Normal, 36px)
   - Texte explicatif sur trois lignes
   - Police : Helvetica
   - Opacité : 90%
   - Alignement : Centre

3. **Texte Stylisé** (Rouge, Gras Italique, 32px)
   - Démontre les différents styles disponibles
   - Police : Georgia
   - Style combiné (gras + italique)

#### Scène 2 : Texte et Images Combinés
Deux couches de texte pour titre et sous-titre :

1. **Titre** (Vert, Gras, 72px)
   - Grande taille pour l'impact visuel
   - Police : DejaVu Sans
   - Échelle : 1.2x

2. **Sous-titre** (Gris, Italique, 28px)
   - Texte explicatif sur deux lignes
   - Police : Verdana
   - Opacité : 85%
   - Interligne : 1.6 pour plus d'aération

### Utilisation

1. Copiez le contenu du fichier
2. Dans l'application, importez cette configuration
3. Explorez les différentes couches et leurs propriétés
4. Modifiez les paramètres pour comprendre leur effet

### Propriétés des Couches Texte

Chaque couche texte possède une configuration `text_config` avec :

- **text** : Le contenu du texte (utilisez `\n` pour les sauts de ligne)
- **font** : La police de caractères
  - Options : Arial, DejaVuSans, Helvetica, Times New Roman, Courier New, Verdana, Georgia, Comic Sans MS
- **size** : Taille de la police en pixels (8-200)
- **color** : Couleur au format RGB `[r, g, b]` (0-255 pour chaque composante)
- **style** : Style du texte
  - "normal" : texte standard
  - "bold" : texte en gras
  - "italic" : texte en italique
  - "bold_italic" : gras et italique combinés
- **line_height** : Espacement des lignes (0.5-3.0, défaut : 1.2)
- **align** : Alignement du texte
  - "left" : aligné à gauche
  - "center" : centré
  - "right" : aligné à droite

### Propriétés Communes aux Couches

Toutes les couches (texte et image) partagent ces propriétés :

- **id** : Identifiant unique de la couche
- **name** : Nom descriptif de la couche
- **type** : Type de couche ("text" ou "image")
- **position** : Position `{x, y}` en pixels sur le canvas
- **z_index** : Ordre d'empilement (plus élevé = au-dessus)
- **skip_rate** : Vitesse d'animation handwriting (1-50, plus élevé = plus rapide)
- **scale** : Échelle de la couche (0.1-3.0)
- **opacity** : Opacité (0.0-1.0)
- **mode** : Mode de dessin
  - "draw" : dessin progressif (handwriting)
  - "eraser" : effet de gomme
  - "static" : apparition instantanée

### Conseils d'Utilisation

1. **Hiérarchie Visuelle** : Utilisez des tailles de police différentes pour créer une hiérarchie claire
2. **Couleurs Cohérentes** : Limitez-vous à 2-3 couleurs principales pour maintenir la cohérence
3. **Skip Rate** : Ajustez selon la quantité de texte (plus de texte = skip_rate plus élevé)
4. **Alignement** : Le centrage fonctionne bien pour les titres, l'alignement à gauche pour les paragraphes
5. **Interligne** : Augmentez le line_height (1.4-1.6) pour améliorer la lisibilité des textes longs
6. **Position** : Les coordonnées (960, 540) représentent le centre d'un canvas 1920x1080

### Animation Handwriting

Le mode "draw" simule l'écriture manuscrite :
- L'animation suit les contours des caractères
- Le paramètre `skip_rate` contrôle la vitesse
- Compatible avec tous les styles et polices
- Fonctionne avec le texte multi-lignes

### Exemple de Couleurs RGB

Quelques couleurs courantes au format RGB :

- Noir : `[0, 0, 0]`
- Blanc : `[255, 255, 255]`
- Rouge : `[220, 53, 69]`
- Vert : `[40, 167, 69]`
- Bleu : `[0, 102, 204]`
- Gris foncé : `[51, 51, 51]`
- Gris moyen : `[108, 117, 125]`

Ou utilisez le sélecteur de couleur dans l'interface pour obtenir les valeurs RGB.
