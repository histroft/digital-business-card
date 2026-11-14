FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

EXPOSE 3000

# A new database is migrated and seeded automatically; the seed is idempotent.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && node dist/main"]
