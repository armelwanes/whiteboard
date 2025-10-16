# Guide d'utilisation shadcn/ui - Whiteboard Animation

## 📋 Introduction

Ce guide décrit l'intégration de **shadcn/ui** dans l'application Whiteboard Animation. shadcn/ui est une collection de composants UI réutilisables, accessibles et personnalisables construits avec Radix UI et Tailwind CSS.

## 🎯 Philosophie de shadcn/ui

Contrairement aux bibliothèques UI traditionnelles installées via npm, shadcn/ui copie le code source des composants directement dans votre projet. Cela vous donne :

- ✅ Contrôle total sur le code
- ✅ Personnalisation complète sans surcharge
- ✅ Pas de dépendances cachées
- ✅ Code TypeScript type-safe
- ✅ Tree-shaking optimal

## 📦 Composants Disponibles

### Composants de Base

#### Button
Bouton avec plusieurs variants et tailles.

```tsx
import { Button } from '@/components/ui';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tailles
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// Avec icônes
<Button>
  <Save className="mr-2 h-4 w-4" />
  Enregistrer
</Button>
```

#### Input
Champ de saisie stylisé avec états de focus.

```tsx
import { Input, Label } from '@/components/ui';

<div>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="email@example.com" 
  />
</div>
```

#### Textarea
Zone de texte multi-lignes.

```tsx
import { Textarea, Label } from '@/components/ui';

<div>
  <Label htmlFor="description">Description</Label>
  <Textarea 
    id="description"
    placeholder="Décrivez votre projet..."
    className="min-h-[100px]"
  />
</div>
```

### Composants de Layout

#### Card
Conteneur de contenu avec header, footer, etc.

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
    <CardDescription>Description optionnelle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenu principal</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Separator
Ligne de séparation horizontale ou verticale.

```tsx
import { Separator } from '@/components/ui';

<div>
  <p>Section 1</p>
  <Separator className="my-4" />
  <p>Section 2</p>
</div>

{/* Vertical */}
<div className="flex h-20">
  <p>Gauche</p>
  <Separator orientation="vertical" className="mx-4" />
  <p>Droite</p>
</div>
```

### Composants Interactifs

#### Dialog
Modale accessible avec overlay.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Ouvrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre de la modale</DialogTitle>
      <DialogDescription>
        Description de la modale
      </DialogDescription>
    </DialogHeader>
    <div>
      {/* Contenu */}
    </div>
    <DialogFooter>
      <Button type="submit">Enregistrer</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Select
Dropdown accessible avec recherche et navigation au clavier.

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionnez une option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

#### Switch
Toggle switch accessible.

```tsx
import { Switch, Label } from '@/components/ui';

<div className="flex items-center space-x-2">
  <Switch 
    id="airplane-mode"
    checked={enabled}
    onCheckedChange={setEnabled}
  />
  <Label htmlFor="airplane-mode">Mode avion</Label>
</div>
```

#### Slider
Contrôle de type range avec curseur.

```tsx
import { Slider } from '@/components/ui';

<Slider
  value={[value]}
  onValueChange={([newValue]) => setValue(newValue)}
  max={100}
  step={1}
  className="w-full"
/>
```

### Composants de Navigation

#### Tabs
Système d'onglets avec animations.

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Onglet 1</TabsTrigger>
    <TabsTrigger value="tab2">Onglet 2</TabsTrigger>
    <TabsTrigger value="tab3">Onglet 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Contenu de l'onglet 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Contenu de l'onglet 2</p>
  </TabsContent>
  <TabsContent value="tab3">
    <p>Contenu de l'onglet 3</p>
  </TabsContent>
</Tabs>
```

### Composants de Feedback

#### Alert
Messages d'alerte avec variants.

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui';
import { AlertCircle, CheckCircle } from 'lucide-react';

{/* Succès */}
<Alert>
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Succès</AlertTitle>
  <AlertDescription>
    Opération réussie !
  </AlertDescription>
</Alert>

{/* Erreur */}
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Erreur</AlertTitle>
  <AlertDescription>
    Une erreur est survenue.
  </AlertDescription>
</Alert>
```

#### Tooltip
Infobulle contextuelle.

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Message d'aide</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### Badge
Étiquettes avec variants.

```tsx
import { Badge } from '@/components/ui';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies via CSS variables dans `src/index.css` :

```css
@theme {
  --color-primary: hsl(221 83% 53%);
  --color-secondary: hsl(210 40% 96%);
  --color-destructive: hsl(0 84% 60%);
  /* ... */
}
```

### Modifier un composant
Les composants sont dans `src/components/ui/`. Vous pouvez les modifier directement :

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Ajoutez vos propres variants
        custom: "bg-gradient-to-r from-purple-600 to-blue-600",
      },
    },
  }
)
```

### Dark Mode
Le dark mode est géré automatiquement via les CSS variables avec `@media (prefers-color-scheme: dark)`.

## 🔧 Configuration

### Chemins d'import
Les alias sont configurés dans :

**tsconfig.json**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**vite.config.js**
```js
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### Tailwind CSS
La configuration Tailwind supporte les variables CSS :

**tailwind.config.js**
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
```

## 📚 Exemples d'utilisation dans le projet

### Remplacer un select natif

**Avant :**
```tsx
<select onChange={(e) => setValue(e.target.value)}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

**Après :**
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionnez" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Remplacer un input range

**Avant :**
```tsx
<input 
  type="range" 
  value={volume} 
  onChange={(e) => setVolume(e.target.value)}
  min={0}
  max={100}
/>
```

**Après :**
```tsx
import { Slider } from '@/components/ui';

<Slider
  value={[volume]}
  onValueChange={([v]) => setVolume(v)}
  max={100}
  step={1}
/>
```

## 🚀 Page de Démonstration

Accédez à la page de démonstration pour voir tous les composants en action :

- **Bouton flottant** : Cliquez sur "Démo UI" en bas à droite
- **Raccourci clavier** : `Ctrl + Shift + D` (ou `Cmd + Shift + D` sur Mac)
- **URL directe** : Modifiez `src/App.tsx` pour afficher la démo par défaut

## 🔍 Accessibilité

Tous les composants shadcn/ui sont construits avec l'accessibilité en priorité :

- ✅ Navigation au clavier complète
- ✅ Lecteurs d'écran supportés (ARIA)
- ✅ Focus visible et gestion du focus
- ✅ Contraste des couleurs WCAG conforme
- ✅ Support des technologies d'assistance

## 📖 Ressources

- [Documentation officielle shadcn/ui](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/) (utilisé dans le projet)

## 🤝 Contribution

Pour ajouter de nouveaux composants shadcn/ui :

1. Visitez [ui.shadcn.com](https://ui.shadcn.com/)
2. Choisissez un composant
3. Copiez le code dans `src/components/ui/`
4. Installez les dépendances Radix UI nécessaires
5. Ajoutez l'export dans `src/components/ui/index.ts`
6. Mettez à jour ce guide avec des exemples

## ❓ FAQ

**Q: Puis-je utiliser les anciens composants ?**  
R: Oui, les anciens composants dans `src/components/atoms/` sont toujours disponibles et fonctionnels. Ils pointent maintenant vers les composants shadcn/ui.

**Q: Comment personnaliser un composant ?**  
R: Modifiez directement le fichier dans `src/components/ui/`. Le code vous appartient !

**Q: Les composants sont-ils accessibles ?**  
R: Oui, tous les composants sont construits sur Radix UI qui priorise l'accessibilité.

**Q: Puis-je utiliser ces composants avec React Hook Form ?**  
R: Absolument ! Tous les composants supportent `ref` forwarding et sont compatibles avec React Hook Form.

## 🎯 Prochaines étapes recommandées

1. Remplacer progressivement les `<select>` natifs par le composant `Select`
2. Utiliser `Dialog` pour les modales existantes
3. Ajouter des `Tooltip` sur les boutons d'action
4. Utiliser `Tabs` pour organiser les panneaux de propriétés complexes
5. Remplacer les `input[type="range"]` par `Slider`
6. Ajouter des `Badge` pour les statuts et catégories
