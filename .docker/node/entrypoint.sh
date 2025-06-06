#!/bin/sh
npx prisma migrate deploy
npx tsx src/server.ts
