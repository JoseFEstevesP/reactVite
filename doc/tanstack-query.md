# TanStack Query v5

## Instalación

```bash
pnpm add @tanstack/react-query
```

## Configuración

### QueryProvider

Ubicación: `src/providers/QueryProvider.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,    // 5 min
        gcTime: 1000 * 60 * 30,      // 30 min
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Uso en main.tsx

```tsx
import { QueryProvider } from './providers/QueryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
)
```

## API Principal

### Hooks

| Hook | Propósito |
|------|-----------|
| `useQuery` | Fetching de datos |
| `useMutation` | Modificaciones (POST, PUT, DELETE) |
| `useQueryClient` | Acceso al cliente desde componentes |

### useQuery

```tsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
  staleTime: 1000 * 60 * 5,
})
```

### useMutation

```tsx
const mutation = useMutation({
  mutationFn: postData,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] })
  },
})

mutation.mutate(payload)
```

### queryClient Methods

```tsx
const queryClient = useQueryClient()

queryClient.invalidateQueries({ queryKey: ['todos'] })
queryClient.setQueryData(['todo', id], newData)
queryClient.getQueryData(['todos'])
```

## Patrones Recomendados

### 1. queryOptions Helper

Crear opciones reutilizables para type-safety:

```tsx
// src/api/queryOptions.ts
export function createQueryOptions<TData, TVariables = void>(options: {
  queryKey: string[]
  queryFn: (variables?: TVariables) => Promise<TData>
  staleTime?: number
  enabled?: boolean | ((variables?: TVariables) => boolean)
}) {
  return queryOptions({
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    staleTime: options.staleTime ?? 1000 * 60 * 5,
    enabled: options.enabled,
  })
}
```

### 2. Patrón de Query con Variables

```tsx
const userQueryOptions = (userId: string) => queryOptions({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId,
})

// En componente
const { data } = useQuery(userQueryOptions(userId))
```

### 3. Invalidación Post-Mutación

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    queryClient.setQueryData(['todo', variables.id], variables)
  },
})
```

## Configuración Global

| Opción | Default | Descripción |
|--------|---------|-------------|
| `staleTime` | 0 | Tiempo hasta que data se considera stale |
| `gcTime` | 1000 * 60 * 5 | Tiempo en cache (antes cacheTime) |
| `retry` | 3 | Intentos en caso de error |
| `refetchOnWindowFocus` | true | Refetch al recuperar foco |

## Hooks API Pre-configurados

Para facilitar el uso, existen hooks pre-configurados en `src/api/hooks/`:

- `useGet` - Fetch con caching
- `usePost` - Creación con invalidación
- `usePut` - Actualización con invalidación
- `useDelete` - Eliminación con invalidación

Ver [API Hooks](./api-hooks.md) para documentación detallada.

## Recursos

- [Documentación oficial](https://tanstack.com/query/latest)
- [API Reference](https://tanstack.com/query/latest/reference/react-query)
