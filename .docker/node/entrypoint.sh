#!/bin/sh
npx prisma generate
npx prisma migrate deploy
npx tsx src/server.ts
