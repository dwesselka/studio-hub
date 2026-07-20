import type { ModuleManifest } from '@shared/types/module.ts'
import type { ComponentType, LazyExoticComponent } from 'react'

export interface ClientModuleRoute {
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>
}

export interface ClientModule extends ModuleManifest {
  routes: ClientModuleRoute[]
}
