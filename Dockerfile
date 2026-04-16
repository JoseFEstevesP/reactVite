FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN pnpm config set store-dir /app/node_modules/.pnpm/store

RUN pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm rebuild esbuild

FROM base AS production

COPY . .

RUN pnpm build

FROM nginx:alpine

COPY --from=production /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --spider -q http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

FROM base AS development

RUN chown -R node:node /app

USER node

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host"]