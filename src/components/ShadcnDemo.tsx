import React, { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Badge,
  Separator,
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui';
import { 
  Save, 
  Trash2, 
  Settings, 
  HelpCircle, 
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';

export function ShadcnDemo() {
  const [volume, setVolume] = useState([50]);
  const [enabled, setEnabled] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('png');

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            shadcn/ui Components Demo
          </h1>
          <p className="text-muted-foreground">
            Composants UI modernes et accessibles pour Whiteboard Animation
          </p>
          <Badge variant="default" className="mt-4">Version 1.0</Badge>
        </div>

        <Separator />

        {/* Alerts Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Alerts</h2>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>
                Votre projet a été sauvegardé avec succès.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Impossible de charger les ressources. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <Separator />

        {/* Tabs Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Tabs</h2>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres Généraux</CardTitle>
                  <CardDescription>
                    Configurez les paramètres de base de votre projet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Nom du projet</Label>
                    <Input id="project-name" placeholder="Mon projet d'animation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Décrivez votre projet..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                      <p className="text-sm text-muted-foreground">
                        Sauvegarder automatiquement toutes les 5 minutes
                      </p>
                    </div>
                    <Switch 
                      id="auto-save"
                      checked={enabled}
                      onCheckedChange={setEnabled}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="animation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres d'Animation</CardTitle>
                  <CardDescription>
                    Contrôlez la vitesse et la qualité de l'animation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Vitesse d'animation</Label>
                    <Slider 
                      value={volume} 
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Valeur: {volume[0]}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="animation-type">Type d'animation</Label>
                    <Select defaultValue="smooth">
                      <SelectTrigger id="animation-type">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smooth">Fluide</SelectItem>
                        <SelectItem value="linear">Linéaire</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Options d'Export</CardTitle>
                  <CardDescription>
                    Choisissez le format et la qualité d'export
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Format d'export</Label>
                    <Select 
                      value={selectedFormat} 
                      onValueChange={setSelectedFormat}
                    >
                      <SelectTrigger id="export-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (Haute qualité)</SelectItem>
                        <SelectItem value="jpg">JPEG (Optimisé)</SelectItem>
                        <SelectItem value="webp">WebP (Moderne)</SelectItem>
                        <SelectItem value="gif">GIF (Animation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Format: {selectedFormat.toUpperCase()}</Badge>
                    <Badge variant="secondary">Haute qualité</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Buttons</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button variant="default">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button variant="secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
                <Button variant="ghost">Annuler</Button>
                <Button variant="link">En savoir plus</Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cliquez pour obtenir de l'aide</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Dialog Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Dialog</h2>
          <Card>
            <CardContent className="pt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Ouvrir la boîte de dialogue</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Éditer le profil</DialogTitle>
                    <DialogDescription>
                      Apportez des modifications à votre profil ici. Cliquez sur enregistrer lorsque vous avez terminé.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="name"
                        defaultValue="John Doe"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Pseudo
                      </Label>
                      <Input
                        id="username"
                        defaultValue="@johndoe"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Enregistrer les modifications</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <Card className="mt-8">
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Composants shadcn/ui intégrés avec succès
            </p>
            <Button variant="ghost" size="sm">
              Documentation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ShadcnDemo;
