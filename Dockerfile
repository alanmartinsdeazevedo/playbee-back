FROM node:lts-alpine AS base

FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package*.json ./
RUN npm ci

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=fastify:nodejs ./src ./src
COPY --chown=fastify:nodejs ./prisma ./prisma
COPY --chown=fastify:nodejs package*.json ./

RUN npx prisma generate

USER fastify
EXPOSE 3003

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx -r tsconfig-paths/register src/server.ts"]