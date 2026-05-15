# Agents

## Dev Commands

```bash
pnpm run dev        # Vite dev server
pnpm run build      # tsc -b && vite build (run before commit)
pnpm run lint       # oxlint (NOT eslint)
pnpm run lint:fix   # oxlint --fix
pnpm run format     # prettier --write src/**/*.{ts,tsx,css}
pnpm run preview    # vite preview
```

## Tech Stack

- **Vite 8** + **React 19** + **TypeScript ~6.0.3** (NOT TS 5.x)
- **React Compiler** via `@rolldown/plugin-babel` + `babel-plugin-react-compiler`
- **oxlint** (lint) | **Prettier** (format) | **Sass** (styles)
- **react-router-dom v7** | **Zustand** (state) | **TanStack Query v5** (server state)
- **react-hook-form** + **Zod v4** (forms/validation) | **axios** (HTTP) | **@formkit/tempo** (dates)

## Key Configs

- `vite.config.ts`: `@rolldown/plugin-babel` with `reactCompilerPreset()`, path aliases `@/`→`src/`, `@page/`→`src/page/`
- `tsconfig.app.json`: `verbatimModuleSyntax: true`, `erasableSyntaxOnly: true`, `noEmit: true`, `ignoreDeprecations: "6.0"`
- `tsconfig.node.json`: Only covers `vite.config.ts`
- `tsconfig.json`: References only (no root config)
- `oxlintrc.json`: Custom rules — `no-console: warn`, `no-debugger: error`, `no-unused-vars: error`
- `.lintstagedrc`: `oxlint --fix` + `prettier --write` on `*.{ts,tsx}`; `prettier --write` on `*.{css,json,md}`
- Pre-commit hook (husky) runs lint-staged on staged files

## Entrypoint & Routing

- `index.html` → `src/main.tsx` → `App.tsx` (React Router `<Routes>`)
- Public route: `/login` | Protected routes behind `<ProtectedRoute>` + `LDashboard` layout
- Paths: `/` (dashboard), `/rol`, `/users`, `/audits`, `/profile`

## Architecture

- **Auth**: Zustand `authStore` — `initialize()` calls session check. Token in `sessionStorage` as `miniToken`. Backend uses httpOnly cookies.
- **Axios**: Instance `http` with `withCredentials: true`, baseURL from `VITE_API_URL`. Response interceptor handles token refresh and session expiry → redirect `/login`.
- **API Hooks**: Custom wrappers around TanStack Query: `useGet`, `usePost`, `usePut`, `useDelete`, `useLogin`, `useLogout` (all in `src/api/hooks/`). Queries use `staleTime: 5min` default, `refetchOnWindowFocus: false`.
- **Toast**: Zustand `toastStore` — exported functions `toastSuccess()`/`toastError()` usable outside React components. Max 3 toasts, auto-dismiss 4s.
- **API Error Handling**: `useApiResponse` hook provides `handleSuccess()`, `handleError()` (with field-level errors for react-hook-form), `getFieldError()`.
- **Query Options**: `createQueryOptions` helper in `src/api/queryOptions.ts` standardizes TanStack Query configs.

## Environment

- `.env` is gitignored. Copy `.env.example` → `.env`. Key vars: `VITE_API_URL`, `NODE_ENV`, `APP_PORT`.
- Docker: Multi-stage `Dockerfile` (dev: pnpm dev with hot-reload; prod: nginx serves dist). `docker-compose.yml` uses `network_mode: host`.

## Constraints

- `.ts`/`.tsx` files: `verbatimModuleSyntax` (`import type` for type-only imports), `erasableSyntaxOnly` (no enums, no namespaces, no parameter properties).
- Zod v4 syntax differs from v3 — do NOT use Zod v3 APIs.
- No test framework installed (no vitest, no testing-library). Do not assume tests exist.
- No GitHub CI (no `.github/` directory).
