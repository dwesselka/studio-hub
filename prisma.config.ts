import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://infinity:infinity123@localhost:5432/studiohub',
  },
  migrations: {
    seed: 'node --import tsx prisma/seed.ts',
  },
})
