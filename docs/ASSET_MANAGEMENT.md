# Gestion d'Assets - Documentation

## Vue d'ensemble

Le système de gestion d'assets permet de centraliser et organiser toutes les ressources (images) utilisées dans vos projets d'animation whiteboard. Tous les assets uploadés sont automatiquement sauvegardés dans une bibliothèque réutilisable.

## Fonctionnalités

### 1. Bibliothèque d'Assets Intégrée

La bibliothèque d'assets est accessible depuis deux endroits :
- **Toolbar principal** : Bouton "Assets" (violet) dans la barre d'outils
- **Layer Editor** : Bouton "Asset Library" (violet) dans le panneau Properties

### 2. Storage et Persistence

- **Storage** : Les assets sont stockés dans le localStorage du navigateur
- **Format** : Base64 data URLs pour compatibilité maximale
- **Metadata** : Chaque asset contient :
  - ID unique
  - Nom du fichier
  - Type MIME
  - Dimensions (largeur × hauteur)
  - Taille (en octets)
  - Tags personnalisables
  - Date d'upload
  - Date de dernière utilisation
  - Compteur d'utilisation

### 3. Système de Tags

Les assets peuvent être organisés avec des tags :
- **Ajout de tags** : Lors de l'édition d'un asset
- **Format** : Tags en minuscules, séparés par des virgules
- **Recherche** : Filtrage par tags dans la sidebar
- **Auto-completion** : Liste de tous les tags existants

### 4. Recherche et Filtrage

#### Recherche par nom
- Barre de recherche en haut de la bibliothèque
- Recherche en temps réel dans les noms d'assets

#### Filtres d'affichage
- **Tous les assets** : Affiche tous les assets disponibles
- **Plus utilisés** : Assets les plus fréquemment utilisés (basé sur le cache)
- **Récents** : 20 derniers assets uploadés

#### Tri
Options de tri disponibles :
- **Date d'upload** : Par ordre chronologique
- **Dernière utilisation** : Assets récemment utilisés
- **Utilisation** : Par nombre d'utilisations
- **Nom** : Par ordre alphabétique
- **Taille** : Par taille de fichier

Ordre : Croissant ↑ ou Décroissant ↓

#### Filtrage par tags
- Cliquez sur un tag dans la sidebar pour filtrer
- Plusieurs tags peuvent être sélectionnés simultanément
- Bouton "Effacer les filtres" pour réinitialiser

### 5. Cache des Assets Fréquents

Le système maintient un cache intelligent :
- **Taille maximale** : 50 assets les plus utilisés
- **Tri automatique** : Par fréquence d'utilisation
- **Mise à jour** : Automatique à chaque utilisation
- **Performance** : Accès rapide aux assets fréquents

### 6. Gestion des Assets

#### Ajouter un asset
1. Cliquez sur "Ajouter" ou "Upload" 
2. Sélectionnez une image (formats supportés : PNG, JPEG, GIF, WebP, etc.)
3. L'asset est automatiquement ajouté à la bibliothèque
4. Vous pouvez ensuite ajouter des tags et modifier le nom

#### Éditer un asset
1. Cliquez sur le bouton "Éditer" (icône crayon) sur un asset
2. Modifiez le nom
3. Ajoutez ou modifiez les tags (séparés par des virgules)
4. Cliquez sur ✓ pour enregistrer ou × pour annuler

#### Supprimer un asset
1. Cliquez sur le bouton "Supprimer" (icône poubelle)
2. Confirmez la suppression
3. L'asset est retiré de la bibliothèque et du cache

#### Utiliser un asset dans une scène
1. Ouvrez la bibliothèque d'assets
2. Cliquez sur un asset pour le sélectionner
3. L'asset est automatiquement ajouté à la scène active comme nouvelle couche

### 7. Intégration avec le Workflow

#### Upload automatique
Lorsque vous uploadez une image via :
- Le bouton "Upload" dans le Layer Editor
- Le bouton "Image" dans le Toolbar
- La fonctionnalité de crop d'image

L'image est **automatiquement sauvegardée** dans la bibliothèque d'assets pour réutilisation future.

#### Avantages
- **Pas de duplication** : Réutilisez les mêmes images sans les re-uploader
- **Organisation** : Retrouvez facilement vos images grâce aux tags
- **Performance** : Les images fréquemment utilisées sont en cache
- **Espace** : Gestion intelligente du stockage avec nettoyage automatique

## Statistiques

En haut de la bibliothèque, vous pouvez voir :
- **Nombre total d'assets**
- **Espace occupé** (en MB)

## Nettoyage Automatique

Pour gérer l'espace de stockage, le système effectue un nettoyage automatique :
- **Critère** : Assets non utilisés depuis 90 jours ET avec moins de 3 utilisations
- **Déclenchement** : Automatique lorsque le quota de stockage est atteint
- **Protection** : Les assets fréquemment utilisés sont toujours conservés

## Formats d'Image Supportés

- PNG
- JPEG / JPG
- GIF
- WebP
- SVG
- BMP
- Tous les formats supportés par `<img>` HTML

## Limitations

- **Stockage** : Limité par le localStorage du navigateur (~5-10 MB selon le navigateur)
- **Type de fichiers** : Images uniquement (pas de vidéo ou audio pour le moment)
- **Performance** : Pour de meilleurs résultats, utilisez des images optimisées

## Conseils d'Utilisation

### Organisation avec Tags
Utilisez des tags cohérents pour faciliter la recherche :
- **Par type** : `background`, `logo`, `icon`, `character`
- **Par projet** : `projet-a`, `demo`, `client-x`
- **Par thème** : `tech`, `nature`, `business`, `education`
- **Par style** : `flat`, `3d`, `illustration`, `photo`

### Optimisation des Images
Pour de meilleures performances :
1. **Résolution** : Utilisez des images adaptées à votre besoin (pas de 4K si non nécessaire)
2. **Compression** : Compressez vos images avant upload
3. **Format** : PNG pour la transparence, JPEG pour les photos
4. **Naming** : Nommez vos fichiers de manière descriptive

### Maintenance
- Revoyez régulièrement vos assets
- Supprimez les doublons
- Mettez à jour les tags pour maintenir l'organisation
- Utilisez les vues "Plus utilisés" et "Récents" pour identifier les assets importants

## API Programmatique

Le système expose des fonctions utilitaires dans `src/utils/assetManager.js` :

### Fonctions principales
```javascript
// Récupérer tous les assets
getAllAssets()

// Ajouter un asset
addAsset({ name, dataUrl, type, tags })

// Rechercher des assets
searchAssets({ query, tags, sortBy, sortOrder })

// Obtenir les assets en cache
getCachedAssets()

// Mettre à jour un asset
updateAsset(assetId, { name, tags })

// Supprimer un asset
deleteAsset(assetId)

// Obtenir tous les tags
getAllTags()

// Statistiques
getAssetStats()
```

Voir `src/utils/assetManager.js` pour la documentation complète.

## Dépannage

### Les assets ne s'affichent pas
- Vérifiez que vous n'êtes pas en navigation privée
- Vérifiez l'espace de stockage disponible
- Essayez de rafraîchir la page

### L'upload échoue
- Vérifiez la taille du fichier
- Vérifiez le format de l'image
- Videz le cache si nécessaire

### Performance lente
- Réduisez le nombre d'assets total
- Optimisez la taille de vos images
- Supprimez les assets inutilisés

## Future Améliorations

Fonctionnalités planifiées :
- Export/import de la bibliothèque d'assets
- Support de dossiers/catégories
- Prévisualisation améliorée
- Support de vidéos et audio
- Synchronisation cloud
- Collaboration multi-utilisateurs
- Historique des modifications
- Versionning des assets
