# Guide d'Architecture & Développement - Frontend

## 📋 Vue d'ensemble

Ce document décrit l'architecture complète du projet  Frontend et fournit les instructions nécessaires pour développer efficacement de nouvelles fonctionnalités avec l'IA.

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
src/
├── app/                     # Modules métier organisés par fonctionnalité
│   ├── [feature]/
│   │   ├── components/      # Composants spécifiques à la fonctionnalité
│   │   ├── hooks/          # Hooks React personnalisés
│   │   ├── api/            # Services API
│   │   ├── schema.ts       # Schémas de validation Zod
│   │   ├── types.ts        # Types TypeScript
│   │   ├── config.ts       # Configuration (query keys, etc.)
│   │   ├── store.ts        # État global Zustand (si nécessaire)
│   │   └── index.ts        # Point d'entrée d'exportation
├── components/             # Composants réutilisables (Atomic Design)
│   ├── atoms/              # Composants de base
│   ├── molecules/          # Combinaisons d'atomes
│   └── organisms/          # Composants complexes
├── pages/                  # Pages organisées par visibilité
│   ├── public/             # Pages publiques (auth, landing)
│   └── private/            # Pages privées (dashboard, monitoring)
├── services/               # Services transversaux
│   ├── api/                # Client HTTP et configuration
│   ├── react-query/        # Utilitaires React Query
│   ├── languages/          # Internationalisation
│   └── session/            # Gestion de session
└── config/                 # Configuration globale
```

## 🔧 Stack Technologique

### Dépendances Principales
- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **React Router 7.5** - Navigation
- **React Query (TanStack)** - Gestion d'état serveur
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas
- **Zustand** - Gestion d'état local
- **Tailwind CSS 4.1** - Styling
- **Radix UI** - Composants primitifs
- **Axios** - Client HTTP
- **i18next** - Internationalisation
- **Better Auth** - Authentification

## 🎯 Développement de Fonctionnalités

### 1. Structure d'une Fonctionnalité

Chaque fonctionnalité doit être organisée dans `src/app/[nom-fonctionnalite]/` :

```typescript
// src/app/children/schema.ts
import { z } from "zod";

export const addChildrenSchema = z.object({
  firstname: z.string().min(1, "auth.errors.firstName.required"),
  lastname: z.string(),
  birthday: z.string().min(1, "birthday.required")
});

// src/app/children/types.ts
export type Children = z.infer<typeof childrenSchema>;
export type ChildrenPayload = z.infer<typeof addChildrenSchema>;

// src/app/children/config.ts
export const childrenKeys = createQueryKeys({
  entity: 'children'
});

// src/app/children/index.ts
export { useChildren } from './hooks/use-children';
export { useChildrenActions } from './hooks/use-children-actions';
export type { Children, ChildrenPayload } from './types';
```

### 2. Hooks Personnalisés

#### Hook de Query (Lecture)
```typescript
// src/app/children/hooks/use-children.ts
export const useChildren = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: childrenKeys.lists(),
    queryFn: () => childrenService.list({ page: 1, limit: 10 }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: childrenKeys.lists(),
      refetchType: 'all'
    });
  };

  return { ...query, invalidate };
};
```

#### Hook d'Actions (Mutations)
```typescript
// src/app/children/hooks/use-children-actions.ts
export const useChildrenActions = () => {
  const mutations = useMutations<Children, ChildrenPayload>({
    service: childrenService,
    queryKeys: childrenKeys,
    successMessages: {
      create: t('monitoring.children.create.success')
    }
  });

  return {
    create: mutations.create,
    update: mutations.modify,
    isUpdating: mutations.isModifing,
    invalidate: mutations.invalidate
  };
};
```

### 3. Services API

#### Configuration des Endpoints
```typescript
// src/config/api.ts
export const API_ENDPOINTS = {
  children: {
    base: `${prefix}/v1/children`,
    create: `${prefix}/v1/children`,
    list: (qs: string) => `${prefix}/v1/parents/children?${qs}`,
    detail: (id: string) => `${prefix}/v1/children/${id}`,
    update: (id: string) => `${prefix}/v1/children/${id}`,
    delete: (id: string) => `${prefix}/v1/children/${id}`
  }
} as const;
```

#### Service HTTP
```typescript
// src/app/children/query.ts
export const childrenService = new BaseService<Children, ChildrenPayload>(
  http.private,
  API_ENDPOINTS.children
);
```

### 4. Composants & Formulaires

#### Structure d'un Composant
```typescript
// Suivre cet ordre dans les composants :
export function MonComposant({ prop1, prop2 }: Props) {
  // 1. État local
  const [loading, setLoading] = useState(false);
  
  // 2. Hooks personnalisés
  const { t } = useTranslation();
  const { data, isLoading } = useChildren();
  
  // 3. Effets
  useEffect(() => {
    // logique d'effet
  }, [dependencies]);

  // 4. Gestionnaires d'événements
  const handleSubmit = (data: FormData) => {
    // logique de soumission
  };

  // 5. JSX
  return (
    <div>
      {/* Contenu du composant */}
    </div>
  );
}
```

#### Formulaires avec React Hook Form + Zod
```typescript
const { control, handleSubmit, reset } = useForm<ChildrenPayload>({
  defaultValues: {
    firstname: "",
    lastname: "",
    birthday: ""
  },
  resolver: zodResolver(addChildrenSchema),
  mode: "onChange"
});

const onSubmit = async (data: ChildrenPayload) => {
  await create(data);
  reset();
};

// Utiliser les composants contrôlés
<ControlledTextInput
  name="firstname"
  control={control}
  placeholder={t('monitoring.children.create.placeholders.firstName')}
/>
```

### 5. Gestion d'État

#### État Local avec Zustand
```typescript
// src/app/children/store.ts
interface ChildrenState {
  currentChild: Children | null;
  setCurrentChild: (child: Children) => void;
  clearCurrentChild: () => void;
}

export const useChildrenStore = create<ChildrenState>((set) => ({
  currentChild: null,
  setCurrentChild: (child) => set({ currentChild: child }),
  clearCurrentChild: () => set({ currentChild: null })
}));
```

#### Mutations avec Invalidation Automatique
```typescript
// src/services/react-query/mutation.ts
export function useMutations<T extends HasId, P>(config: MutationConfig<T, P>) {
  const handleSuccess = (type: 'create' | 'update' | 'delete', data: T) => {
    // Invalidation automatique des queries
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    
    // Mise à jour de la session si nécessaire
    if (type === 'update') {
      const selectedChild = useChildrenSession.getState().selectedChild;
      if (selectedChild && selectedChild.id === data.id) {
        login({ ...selectedChild, ...data });
      }
    }
  };
}
```

## 🎨 Design System

### Composants Atomiques
- Utilisez les composants du dossier `src/components/atoms/`
- Suivez le principe Atomic Design (atoms → molecules → organisms)

### Styling avec Tailwind
```typescript
// Couleurs personnalisées disponibles
className="bg-meko-blue-darker text-meko-blue-light-1 border-meko-blue-transparent-1"

// Classes utilitaires personnalisées
className="meko-bg custom-input" // Définis dans index.css
```

### Composants de Formulaire
```typescript
// Input basique
<Input size="small" placeholder="Texte" />

// Composants contrôlés pour les formulaires
<ControlledTextInput name="field" control={control} />
<ControlledDateTimePicker name="date" control={control} />
<ControlledOtpInput name="otp" control={control} />
```

## 🌐 Internationalisation

### Structure des Traductions
```typescript
// src/services/languages/res/fr.ts
const fr = {
  monitoring: {
    children: {
      create: {
        title: "Création compte enfant",
        firstName: "Nom de l'enfant",
        success: "Enfant créé avec succès"
      }
    }
  },
  common: {
    dashboard: 'Tableau de bord',
    save: 'Enregistrer'
  }
};
```

### Utilisation
```typescript
const { t } = useTranslation();

// Dans le JSX
<Typography>{t('monitoring.children.create.title')}</Typography>

// Avec interpolation
<Typography>{t('onboarding.welcome.title', { name: userName })}</Typography>
```

## 🔄 Patterns de Navigation

### Navigation Programmatique
```typescript
const navigate = useNavigate();

// Navigation simple
navigate('/monitoring');

// Navigation avec état
navigate('/profile/avatar', { 
  state: { signUp: true, from: 'welcome' } 
});

// Navigation conditionnelle
if (sessionChild) {
  navigate('/home');
} else {
  navigate('/monitoring');
}
```

### Protection des Routes
```typescript
// Utilisation des guards de session
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

## 📝 Bonnes Pratiques

### 1. Conventions de Nommage
- **Fichiers** : kebab-case (`user-avatar.tsx`)
- **Composants** : PascalCase (`UserAvatar`)
- **Hooks** : camelCase avec préfixe `use` (`useChildren`)
- **Types** : PascalCase (`ChildrenPayload`)
- **Variables** : camelCase (`isLoading`)

### 2. Structure des Fichiers
- Un composant par fichier
- Export par défaut pour les composants principaux
- Export nommé pour les utilitaires

### 3. Commentaires dans le Code
- **Éviter les commentaires** dans le code de production
- Le code doit être auto-documenté avec des noms explicites
- Privilégier des noms de variables et fonctions clairs
- Les seuls commentaires acceptés :
  - JSDoc pour les fonctions publiques/exportées
  - Commentaires temporaires pendant le développement (à supprimer avant commit)
  - Commentaires explicatifs pour des algorithmes complexes (rare)

```typescript
// ❌ Éviter
const d = new Date(); // Date actuelle
const u = users.filter(u => u.active); // Filtrer les utilisateurs actifs

// ✅ Préférer
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
```

### 4. Gestion des Erreurs
```typescript
// Dans les hooks
const { mutate: createChild, isPending, error } = useMutation({
  mutationFn: childrenService.create,
  onSuccess: () => {
    toast.success(t('success.message'));
  },
  onError: (error) => {
    toast.error(`Erreur: ${error.message}`);
  }
});
```

### 5. Performance
- Utilisez `useMemo` pour les calculs coûteux
- Utilisez `useCallback` pour les fonctions passées en props
- Préférez la pagination pour les listes importantes

### 6. Accessibilité
- Toujours inclure `aria-label` sur les éléments interactifs
- Utiliser les rôles ARIA appropriés
- Gérer le focus keyboard

## 🚀 Checklist pour Nouvelle Fonctionnalité

### Avant de Commencer
- [ ] Créer le dossier `src/app/[feature]/`
- [ ] Définir les schémas Zod dans `schema.ts`
- [ ] Créer les types TypeScript dans `types.ts`
- [ ] Configurer les query keys dans `config.ts`

### Développement
- [ ] Créer le service API
- [ ] Implémenter les hooks (query + mutations)
- [ ] Développer les composants UI
- [ ] Ajouter les traductions (FR + EN)
- [ ] Configurer la navigation/routing

### Tests & Finalisation
- [ ] Tester les formulaires (validation, soumission)
- [ ] Vérifier la gestion d'erreur
- [ ] Valider l'accessibilité
- [ ] Optimiser les performances
- [ ] Documenter les APIs publiques

## 📚 Ressources

- [Documentation React Query](https://tanstack.com/query/latest)
- [Documentation Zod](https://zod.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation Radix UI](https://www.radix-ui.com/)
- [Guide Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

## 🤖 Instructions pour l'IA

Quand tu développes une nouvelle fonctionnalité :

1. **Analyse** d'abord la structure existante similaire
2. **Suis** l'architecture modulaire décrite
3. **Utilise** les patterns établis (hooks, services, composants)
4. **Respecte** les conventions de nommage
5. **Ajoute** les traductions nécessaires
6. **Pense** à l'invalidation des caches React Query
7. **Gère** les états de chargement et d'erreur
8. **Assure-toi** de l'accessibilité des composants

**Exemple de workflow** :
1. Créer les types et schémas
2. Implémenter le service API
3. Créer les hooks (query + actions)
4. Développer les composants UI
5. Intégrer dans les pages
6. Ajouter les traductions
7. Tester et optimiser