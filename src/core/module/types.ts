import type { ModuleManifest } from '@shared/types/module.ts'
import type { ComponentType, LazyExoticComponent } from 'react'

export interface ClientModuleRoute {
  path: string
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>
}

export interface ClientModule extends ModuleManifest {
  routes: ClientModuleRoute[]
}
