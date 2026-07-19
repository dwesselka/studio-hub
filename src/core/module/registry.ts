import type { ClientModule } from './types.ts'
import { PLAN_HIERARCHY, type Plan } from '@shared/types/workspace.ts'
import { hasPermission } from '@shared/types/rbac.ts'

class ModuleRegistry {
  private modules = new Map<string, ClientModule>()

  register(module: ClientModule): void {
    if (this.modules.has(module.id)) {
      console.warn(`[ModuleRegistry] Module "${module.id}" already registered`)
      return
    }
    this.modules.set(module.id, module)
    console.log(`[ModuleRegistry] Registered module: ${module.id}`)
  }

  getAll(): ClientModule[] {
    return Array.from(this.modules.values())
  }

  getById(id: string): ClientModule | undefined {
    return this.modules.get(id)
  }

  /**
   * Retorna os módulos disponíveis para o workspace atual baseado em:
   * 1. Módulos habilitados no workspace
   * 2. Plano do workspace atende ao requiredPlan do módulo
   * 3. Usuário tem permissão mínima (module:read)
   */
  getForWorkspace(
    enabledModules: string[],
    plan: Plan,
    permissions: string[]
  ): ClientModule[] {
    return this.getAll()
      .filter((m) => enabledModules.includes(m.id))
      .filter((m) => PLAN_HIERARCHY[plan] >= PLAN_HIERARCHY[m.requiredPlan])
      .filter((m) => hasPermission(permissions, `${m.id}:read`))
      .sort((a, b) => {
        const aOrder = a.navigation[0]?.order ?? 999
        const bOrder = b.navigation[0]?.order ?? 999
        return aOrder - bOrder
      })
  }
}

export const moduleRegistry = new ModuleRegistry()
