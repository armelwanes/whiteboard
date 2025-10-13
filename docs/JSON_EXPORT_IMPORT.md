# Configuration Export/Import - Guide d'Utilisation

## Vue d'Ensemble

L'application whiteboard supporte maintenant l'export et l'import de configurations de scènes au format JSON. Cette fonctionnalité permet de:
- **Sauvegarder** vos projets pour les réutiliser plus tard
- **Partager** vos configurations avec d'autres utilisateurs
- **Faire des backups** de votre travail
- **Versionner** vos projets

## Export de Configuration

### Comment exporter

1. Ouvrez votre projet dans l'application
2. Dans le panneau de gauche "Scènes", cliquez sur le bouton **"Export"**
3. Un fichier JSON sera automatiquement téléchargé avec le nom `whiteboard-config-YYYY-MM-DD.json`

### Contenu du fichier exporté

Le fichier JSON contient:
```json
{
  "version": "1.0.0",
  "exportDate": "2025-10-13T15:38:34.307Z",
  "scenes": [
    {
      "id": "scene-1",
      "title": "Ma Scène",
      "content": "Contenu de la scène...",
      "duration": 5,
      "backgroundImage": null,
      "animation": "fade",
      "layers": [...],
      "cameras": [...],
      "sceneCameras": [...],
      "multiTimeline": {...},
      "audio": {...}
    }
  ]
}
```

## Import de Configuration

### Comment importer

1. Dans le panneau de gauche "Scènes", cliquez sur le bouton **"Import"**
2. Sélectionnez un fichier JSON de configuration précédemment exporté
3. Vos scènes seront remplacées par celles du fichier importé
4. Un message de confirmation apparaîtra

⚠️ **Attention**: L'import remplace toutes vos scènes actuelles. Assurez-vous d'avoir sauvegardé votre travail avant d'importer.

## Cas d'Utilisation

### 1. Sauvegarde et Restauration
```
Travail en cours → Export JSON → Sauvegarde locale
Plus tard: Import JSON → Reprise du travail
```

### 2. Collaboration
```
Créateur A → Export → Partage du JSON → Import par Créateur B
```

### 3. Gestion de Versions
```
Projet v1 → Export → projet-v1.json
Modifications → Projet v2 → Export → projet-v2.json
```

## Compatibilité

- **Format**: JSON valide
- **Version**: 1.0.0
- **Encodage**: UTF-8
- **Extension**: `.json`

## Dépannage

### Erreur "Format de fichier invalide"
- Vérifiez que le fichier est un JSON valide
- Assurez-vous que le fichier contient un tableau "scenes"
- Vérifiez que le fichier n'est pas corrompu

### Les images ne s'affichent pas après import
- Les images encodées en base64 dans les layers sont conservées
- Les URLs d'images externes doivent être accessibles

## Notes Techniques

- Les configurations sont également sauvegardées automatiquement dans le localStorage du navigateur
- L'export/import permet de transférer les configurations entre navigateurs ou machines
- Toutes les propriétés des scènes sont préservées (layers, cameras, timelines, audio, etc.)
