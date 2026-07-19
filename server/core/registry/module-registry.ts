import { Hono } from 'hono'
import type { ServerModuleManifest } from '../types/module.ts'

class ServerModuleRegistry {
  private modules = new Map<string, ServerModuleManifest>()

  register(manifest: ServerModuleManifest): void {
    if (this.modules.has(manifest.id)) {
      console.warn(`[ModuleRegistry] Module "${manifest.id}" is already registered. Overwriting.`)
    }
    this.modules.set(manifest.id, manifest)
    console.log(`[ModuleRegistry] Registered module: ${manifest.id}`)
  }

  getAll(): ServerModuleManifest[] {
    return Array.from(this.modules.values())
  }

  getById(id: string): ServerModuleManifest | undefined {
    return this.modules.get(id)
  }

  /**
   * Monta todas as rotas dos módulos registrados na instância do app.
   */
  mountRoutes(app: Hono): void {
    const v1 = new Hono()
    
    for (const mod of this.getAll()) {
      v1.route(`/${mod.id}`, mod.router)
      console.log(`[ModuleRegistry] Mounted routes for: /v1/${mod.id}`)
    }
    
    app.route('/v1', v1)
  }
}

export const serverModuleRegistry = new ServerModuleRegistry()
