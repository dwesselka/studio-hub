import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const isServer = typeof window === 'undefined'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient(): PrismaClient | null {
  if (!isServer) return null
  const url = process.env.DATABASE_URL
  if (!url) return null

  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (isServer && prisma) {
  globalForPrisma.prisma = prisma
}
