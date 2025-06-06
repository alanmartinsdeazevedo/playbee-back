FROM node:lts-alpine AS base

# Dependências
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app

# Copiar dependências da etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

RUN npx prisma generate

RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=fastify:nodejs /app/dist ./dist
COPY --from=builder --chown=fastify:nodejs /app/prisma ./prisma
COPY --from=builder --chown=fastify:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER fastify

EXPOSE 3003

CMD ["npm", "run", "start:migrate"]