/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
let prisma: any = null

if (typeof window === 'undefined') {
  try {
    const { PrismaClient } = require('@prisma/client')
    const { PrismaPg } = require('@prisma/adapter-pg')

    const globalForPrisma = globalThis as unknown as { prisma: any }

    function createPrismaClient(): any {
      const url = process.env.DATABASE_URL
      if (!url) return null

      const adapter = new PrismaPg({ connectionString: url })
      return new PrismaClient({ adapter })
    }

    prisma = globalForPrisma.prisma ?? createPrismaClient()

    if (prisma) {
      globalForPrisma.prisma = prisma
    }
  } catch (e) {
    // Silently fail in client context
  }
}

export { prisma }
