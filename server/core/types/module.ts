/**
 * ServerModuleManifest — Contrato que cada módulo server-side deve implementar.
 *
 * O módulo exporta seu manifest e o sistema auto-registra rotas,
 * permissões e middlewares sem alterar o server/index.ts.
 */

import type { Hono } from 'hono'

export interface ServerModuleManifest {
  /** Identificador único (deve ser igual ao ModuleManifest.id do shared) */
  id: string
  name: string
  version: string
  /** Router Hono com as rotas deste módulo */
  router: Hono
  /** Permissões requeridas (para documentação/validação) */
  permissions: string[]
}
