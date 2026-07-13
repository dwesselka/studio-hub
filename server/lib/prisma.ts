/**
 * Cliente Prisma exclusivo para o servidor (Node.js).
 * Não use este módulo no frontend — ele não tem guard de browser.
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      '[Prisma] DATABASE_URL não definida. ' +
        'Certifique-se de que o servidor é iniciado com --env-file .env.development',
    )
  }
  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { _prismaServer?: PrismaClient }

export const prisma = globalForPrisma._prismaServer ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma._prismaServer = prisma
}
