/**
 * Hono Context extensions — Tipos adicionais injetados pelos middlewares.
 *
 * Cada middleware injeta dados no contexto via c.set().
 * Aqui declaramos os tipos para que c.get() seja type-safe.
 */

declare module 'hono' {
  interface ContextVariableMap {
    // Auth middleware
    userId: string
    userEmail: string

    // Tenant middleware
    workspaceId: string
    workspace: {
      id: string
      slug: string
      name: string
      plan: string
      modules: string[]
    }

    // RBAC middleware
    memberRole: {
      id: string
      name: string
      permissions: string[]
    }

    // Validation middleware
    validBody: Record<string, unknown>
    validParams: Record<string, string>
    validQuery: Record<string, string>
  }
}

export {}
