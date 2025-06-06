FROM node:lts-alpine AS base

FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=fastify:nodejs ./src ./src
COPY --chown=fastify:nodejs ./prisma ./prisma
COPY --chown=fastify:nodejs tsconfig.json ./
COPY --chown=fastify:nodejs package*.json ./

COPY .docker/node/entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER fastify
EXPOSE 3003

ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
