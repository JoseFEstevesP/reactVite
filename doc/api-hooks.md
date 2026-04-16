# API Hooks - TanStack Query + Axios

## Configuración HTTP

### Axios Instance

Ubicación: `src/api/http.ts`

```tsx
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## Hooks Disponibles

### useGet

Fetch con caching automático.

```tsx
const { data, isPending, isError, error, refetch } = useGet<User[]>('/users')

// Con opciones
const { data } = useGet<User[]>('/users', {
  queryKey: ['users', { page: 1 }],
  staleTime: 30000,
  enabled: true,
})
```

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `queryKey` | `string[]` | URL | Key para cache |
| `staleTime` | `number` | 5 min | Tiempo hasta stale |
| `enabled` | `boolean` | true | Habilitar/deshabilitar |
| `config` | `RequestConfig` | - | Params y headers |

### usePost

Creación de recursos.

```tsx
const { mutate, isPending, isSuccess, error } = usePost<User, CreateUserPayload>('/users')

// Uso
mutate({ name: 'John', email: 'john@example.com' })
```

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `queryKey` | `string[]` | Queries a invalidar post-mutación |

### usePut

Actualización de recursos.

```tsx
const { mutate, isPending } = usePut<User, UpdateUserPayload>('/users/:id')

mutate({ id: 1, name: 'Jane' })
```

### useDelete

Eliminación de recursos.

```tsx
const { mutate, isPending } = useDelete('/users/:id')

mutate(undefined, { params: { id: 1 } })
```

## Tipos

```tsx
// src/api/types.ts
export interface ApiResponse<TData> {
  data: TData
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface RequestConfig {
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
}
```

## Ejemplo Completo

```tsx
import { useGet } from '@/api/hooks/useGet'
import { usePost } from '@/api/hooks/usePost'
import { useDelete } from '@/api/hooks/useDelete'

interface User {
  id: number
  name: string
  email: string
}

interface CreateUserPayload {
  name: string
  email: string
}

function Users() {
  const { data: users, isPending, error } = useGet<User[]>('/users')
  const createUser = usePost<User, CreateUserPayload>('/users')
  const deleteUser = useDelete('/users')

  if (isPending) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => deleteUser.mutate(undefined, { params: { id: user.id } })}>
            Eliminar
          </button>
        </div>
      ))}
      
      <button 
        onClick={() => createUser.mutate({ name: 'New', email: 'new@example.com' })}
        disabled={createUser.isPending}
      >
        Crear
      </button>
    </div>
  )
}
```

## Recursos

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
