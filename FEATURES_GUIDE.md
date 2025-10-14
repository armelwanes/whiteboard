# Guide des Nouvelles Fonctionnalités

## 🎵 Gestionnaire Audio Amélioré

### Accès
1. Ouvrez une scène dans l'éditeur
2. Regardez le panneau des propriétés à droite
3. Trouvez le panneau "Gestionnaire Audio" (fond sombre avec dégradé)
4. Cliquez pour développer

### Interface

```
┌─────────────────────────────────────────────┐
│ 🎵 Gestionnaire Audio          [▼]         │
│    2 pistes                                 │
├─────────────────────────────────────────────┤
│                                             │
│  🔊 Volume Principal           [====] 75%  │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━]           │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   🎵     │ │   🎤     │ │   🎧     │  │
│  │ Musique  │ │ Voix-off │ │  Effet   │  │
│  └──────────┘ └──────────┘ └──────────┘  │
│                                             │
│  Pistes Audio:                             │
│                                             │
│  ┌──────────────────────────────────────┐ │
│  │ [▶] 🎵 Musique de fond                │ │
│  │     background-music.mp3              │ │
│  │     🔊 [═════════════] 50%     [🗑]   │ │
│  └──────────────────────────────────────┘ │
│                                             │
│  ┌──────────────────────────────────────┐ │
│  │ [▶] 🎤 Voix-off                       │ │
│  │     narration.mp3                     │ │
│  │     🔊 [═══════════════] 100%  [🗑]   │ │
│  └──────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Fonctionnalités

**Types de pistes:**
- **🎵 Musique** (Bleu) - Musique de fond qui boucle automatiquement
- **🎤 Voix-off** (Vert) - Narration ou commentaires vocaux
- **🎧 Effet** (Violet) - Effets sonores et bruitages

**Contrôles par piste:**
- **▶/❚❚** - Aperçu audio (lecture/pause)
- **🔊** - Volume individuel (0-100%)
- **🗑** - Supprimer la piste

**Contrôles globaux:**
- **Volume Principal** - Contrôle le volume de toutes les pistes
- **Panneau repliable** - Économise l'espace à l'écran

### Workflow

1. **Ajouter une piste:**
   - Cliquez sur le bouton du type désiré (Musique/Voix-off/Effet)
   - Sélectionnez un fichier audio depuis votre ordinateur
   - La piste apparaît dans la liste

2. **Gérer les pistes:**
   - Aperçu: Cliquez sur ▶ pour écouter
   - Volume: Ajustez le curseur de volume
   - Supprimer: Cliquez sur 🗑 pour retirer

3. **Volume global:**
   - Utilisez le curseur "Volume Principal" pour tout ajuster en même temps
   - Pratique pour baisser rapidement tout l'audio

### Formats supportés
- MP3 (recommandé pour la musique)
- WAV (haute qualité pour effets)
- OGG (bon compromis)
- M4A/AAC (voix)
- WEBM (moderne)

---

## 🎬 Créateur de Miniatures YouTube

### Accès
1. Ouvrez une scène dans l'éditeur
2. Cliquez sur le bouton rouge caméra (🎥) en haut à droite
3. La fenêtre du créateur s'ouvre

### Interface

```
┌────────────────────────────────────────────────────────────────┐
│ 🎥 Créateur de Miniature                              [✕]     │
│    Style YouTube 1280x720                                      │
├──────────────────────────────────┬─────────────────────────────┤
│                                  │                             │
│  [Vue YouTube] [Plein Écran]    │  🖼 Arrière-plan            │
│                                  │  [Importer Image]           │
│  ┌───────────────────────────┐  │  Couleur: [████]            │
│  │  ┌──────────────────────┐ │  │  Opacité: [═══] 30%         │
│  │  │                      │ │  │                             │
│  │  │   VOTRE TITRE ICI    │ │  │  ✏️ Texte                   │
│  │  │                      │ │  │  Titre: [____________]      │
│  │  │     12:34            │ │  │  Sous-titre: [_______]      │
│  │  └──────────────────────┘ │  │                             │
│  │  👤 Nom de la Chaîne     │  │  Couleur titre: [████]      │
│  │  1,2M vues • il y a 1j   │  │  Couleur sous-t: [████]     │
│  └───────────────────────────┘  │                             │
│                                  │  Taille: [════] 72px        │
│  [📥 Télécharger PNG]           │  Alignement: [◀][●][▶]     │
│  [💾 Enregistrer]               │  ☑ Contour texte            │
│                                  │  ☑ Ombre texte              │
│                                  │                             │
│                                  │  Position X: [══] 50%       │
│                                  │  Position Y: [══] 50%       │
│                                  │                             │
│                                  │  🎨 Modèles de couleurs     │
│                                  │  [Rouge] [Bleu] [Vert]      │
│                                  │  [Violet] [Orange] [Noir]   │
│                                  │                             │
│                                  │  ☐ Grille de composition    │
└──────────────────────────────────┴─────────────────────────────┘
```

### Modes d'aperçu

**1. Vue YouTube (recommandé)**
- Simule l'apparence réelle sur YouTube
- Affiche le contexte (chaîne, vues, date)
- Taille réaliste d'une miniature dans les résultats
- Idéal pour voir le rendu final

**2. Plein Écran**
- Affiche la miniature en grande taille
- Voir tous les détails
- Parfait pour ajuster les éléments

### Panneaux de contrôle

**🖼 Arrière-plan**
- **Importer Image:** Téléchargez une image de fond
- **Couleur:** Choisissez une couleur unie
- **Opacité superposition:** Assombrit l'image pour rendre le texte lisible (0-100%)

**✏️ Texte**
- **Titre principal:** Texte principal de la miniature
- **Sous-titre:** Texte secondaire optionnel
- **Couleurs:** Choisissez les couleurs pour chaque texte
- **Taille:** Ajustez de 30 à 120 pixels
- **Alignement:** Gauche, Centre, Droite
- **Contour texte:** Ajoute un contour noir pour la lisibilité
- **Ombre texte:** Ajoute une ombre pour la profondeur
- **Position X/Y:** Déplacez le texte (en pourcentage)

**🎨 Modèles de couleurs**
Cliquez sur un modèle pour appliquer instantanément:
- **Rouge Énergique:** Accrocheur et dynamique
- **Bleu Professionnel:** Sérieux et fiable
- **Vert Frais:** Naturel et apaisant
- **Violet Créatif:** Artistique et original
- **Orange Chaleureux:** Amical et accueillant
- **Noir Élégant:** Sophistiqué et premium

**⚙️ Utilitaires**
- **Grille de composition:** Affiche la règle des tiers pour un positionnement optimal

### Workflow

**1. Créer une miniature de base:**
```
1. Cliquez sur 🎥 (bouton rouge caméra)
2. Le titre de votre scène est déjà rempli
3. Choisissez un modèle de couleurs
4. Ajustez la taille du texte
5. Téléchargez le PNG
```

**2. Miniature avec image de fond:**
```
1. Cliquez sur "Importer Image"
2. Sélectionnez votre image
3. Ajustez l'opacité de superposition (30-50% recommandé)
4. Positionnez le texte pour éviter les zones importantes
5. Activez "Contour texte" et "Ombre texte"
6. Téléchargez le PNG
```

**3. Miniature professionnelle:**
```
1. Importez une image de haute qualité
2. Activez la grille de composition
3. Positionnez le texte selon la règle des tiers
4. Utilisez une taille de texte grande (80-100px)
5. Choisissez des couleurs contrastées
6. Ajoutez un sous-titre si nécessaire
7. Prévisualisez en mode YouTube
8. Téléchargez le PNG
```

### Conseils de design

**Lisibilité:**
- Texte grand et gras (minimum 60px)
- Contours noirs pour contraste
- Ombre pour profondeur
- Couleurs vives et contrastées

**Composition:**
- Utilisez la règle des tiers (grille)
- Laissez de l'espace autour du texte
- Évitez de mettre le texte sur des zones détaillées de l'image

**Couleurs:**
- Utilisez les modèles pré-configurés
- Rouge/Jaune: Attention et énergie
- Bleu: Professionnel et fiable
- Vert: Naturel et éducatif
- Violet: Créatif et unique

**Mobile:**
- Les miniatures sont souvent vues sur mobile
- Texte extra large
- Moins de texte = mieux
- Test en vue YouTube pour voir le rendu petit

### Export

**📥 Télécharger PNG:**
- Télécharge la miniature (1280x720)
- Qualité haute résolution
- Prêt pour upload YouTube

**💾 Enregistrer:**
- Sauvegarde la miniature avec la scène
- Peut être modifiée plus tard
- Accessible via les données de la scène

---

## 💡 Cas d'usage

### Vidéo éducative
```
Audio:
- 🎵 Musique de fond calme (30% volume)
- 🎤 Voix-off explicative (100% volume)

Miniature:
- Fond: Image du sujet
- Texte: "Comment faire X en 5 minutes"
- Couleurs: Bleu Professionnel
- Effet: Contour + Ombre
```

### Vidéo divertissement
```
Audio:
- 🎵 Musique énergique (50% volume)
- 🎧 Effets sonores aux moments clés

Miniature:
- Fond: Image colorée
- Texte: "INCROYABLE!"
- Sous-titre: "Vous n'allez pas croire ce qui se passe"
- Couleurs: Rouge Énergique
- Texte très grand (100px)
```

### Tutoriel technique
```
Audio:
- 🎤 Voix-off détaillée (100% volume)
- 🎧 Sons de clavier/clic (30% volume)

Miniature:
- Fond: Screenshot de code
- Opacité: 40% (pour lisibilité)
- Texte: "Guide Complet"
- Sous-titre: "Débutant à Expert"
- Couleurs: Vert Frais
```

---

## 🎯 Points clés

### Gestionnaire Audio
✅ Simple: Upload en un clic
✅ Élégant: Design moderne et professionnel
✅ Moderne: Multi-pistes avec aperçu temps réel
✅ Organisé: Types visuellement distincts
✅ Contrôle: Volume individuel et global

### Créateur de Miniatures
✅ Précis: Dimensions YouTube exactes
✅ Rapide: Modèles pré-configurés
✅ Puissant: Contrôle total sur chaque aspect
✅ Visuel: Aperçu temps réel
✅ Professionnel: Rendu haute qualité

---

## 📚 Ressources

### Audio
- Musiques libres: YouTube Audio Library, Epidemic Sound
- Effets sonores: Freesound.org, Zapsplat
- Voix-off: Enregistrez avec Audacity

### Images pour miniatures
- Photos libres: Unsplash, Pexels, Pixabay
- Illustrations: Undraw, Drawkit
- Icônes: Flaticon, Icons8

### Inspiration miniatures
- Regardez les miniatures des chaînes populaires dans votre niche
- Analysez ce qui attire l'attention
- Testez différents styles

---

## ❓ FAQ

**Q: Combien de pistes audio puis-je ajouter?**
R: Illimité pour voix-off et effets. Une seule musique de fond (peut être remplacée).

**Q: Les fichiers audio sont-ils téléchargés sur un serveur?**
R: Non, tout est stocké localement dans votre navigateur en base64.

**Q: Puis-je modifier une miniature après l'avoir créée?**
R: Oui si vous l'avez sauvegardée. Sinon, recréez-la en important la même image.

**Q: Quelle taille d'audio est recommandée?**
R: Moins de 10 MB par fichier pour de bonnes performances.

**Q: Comment améliorer la qualité de ma miniature?**
R: Utilisez des images haute résolution, texte grand et gras, couleurs contrastées.

**Q: Pourquoi mes miniatures ne ressemblent pas à YouTube?**
R: Utilisez le mode "Vue YouTube" pour un aperçu réaliste.

---

## 🆘 Support

Si vous rencontrez des problèmes:
1. Vérifiez que votre navigateur supporte les fichiers audio/canvas
2. Assurez-vous que les fichiers sont dans des formats supportés
3. Videz le cache du navigateur
4. Ouvrez la console développeur pour voir les erreurs
5. Créez une issue sur GitHub avec détails

---

**Profitez de ces nouvelles fonctionnalités pour créer des vidéos professionnelles! 🎉**
