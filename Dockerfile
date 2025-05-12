FROM node:20-alpine AS builder

WORKDIR /app

COPY . .
RUN corepack enable && pnpm install --frozen-lockfile

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output .output
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
