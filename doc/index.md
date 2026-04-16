# Documentación del Proyecto

## Índice

- [Setup](./setup.md) - Stack tecnológico y estructura del proyecto
- [TanStack Query](./tanstack-query.md) - Gestión de estado asíncrono y fetching de datos
- [API Hooks](./api-hooks.md) - Hooks HTTP con Axios y TanStack Query
- [Autenticación](./auth.md) - Sistema de login, logout y protección de rutas

## Visión General

Este proyecto es una aplicación React 19 con TypeScript, construida sobre Vite 8. Implementa:

- **TanStack Query v5** para gestión de estado del servidor
- **Zustand** para gestión de estado global del cliente
- **Axios** para peticiones HTTP
- **React Router v7** para routing
- **JWT con cookies HTTP-only** para autenticación

## Stack Principal

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.x | Framework UI |
| TypeScript | ~6.0 | Tipado estático |
| Vite | 8.x | Bundler/dev server |
| TanStack Query | 5.x | Server state management |
| Zustand | 5.x | Client state management |
| Axios | 1.x | HTTP client |
| React Router | 7.x | Routing |
| React Compiler | 1.0.0 | Compilación optimizada |

## Convenciones

- Package manager: **pnpm**
- Estilo de imports: `verbatimModuleSyntax` requiere `import type` para tipos
- Linting: ESLint flat config con typescript-eslint
- Variables de entorno: `VITE_*` para cliente
- Path alias: `@/` apunta a `src/`
- Sin barrel exports (index.ts)
