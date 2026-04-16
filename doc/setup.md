# Setup del Proyecto

## Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| React 19 | Framework UI |
| TypeScript | Tipado estático |
| Vite 8 | Bundler y dev server |
| TanStack Query 5 | Server state management |
| Zustand 5 | Client state management |
| Axios | HTTP client |
| React Compiler | Optimización de renderizado |

## Estructura del Proyecto

```
src/
├── api/                    # Capa de datos y queries
│   ├── http.ts            # Axios instance
│   ├── types.ts           # Tipos de API
│   ├── queryOptions.ts    # Helpers para queries
│   └── hooks/             # Hooks API (sin barrel export)
│       ├── useGet.ts
│       ├── usePost.ts
│       ├── usePut.ts
│       └── useDelete.ts
├── providers/              # Context providers
│   └── QueryProvider.tsx  # Proveedor de TanStack Query
├── store/                  # Zustand stores
│   └── index.ts
├── App.tsx                # Componente principal
└── main.tsx               # Entry point

.env                       # Variables de entorno (no commitear)
.env.example               # Template de .env
```

**Nota:** No usar barrel exports (index.ts). Importar desde rutas directas.

## Variables de Entorno

Crear `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

## Comandos

```bash
pnpm dev      # Iniciar dev server
pnpm build    # Build de producción (tsc + vite)
pnpm lint     # ESLint
pnpm preview  # Preview del build
```

## Configuraciones Clave

### TypeScript (`tsconfig.app.json`)

- `verbatimModuleSyntax: true` - Imports de tipos explícitos
- `noUnusedLocals/Parameters: true` - Linting estricto
- `erasableSyntaxOnly: true` - Sin enums ni namespaces
- `moduleResolution: bundler` - Resolución bundler-aware

### Vite

- Rolldown Babel plugin para React Compiler
- Plugin React oficial
