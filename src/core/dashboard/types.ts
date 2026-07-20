import type { ComponentType, LazyExoticComponent } from 'react'
import type { WidgetManifestBase } from '@shared/types/module.ts'

export interface WidgetProps {
  workspaceId: string
  size: { w: number; h: number }
}

export interface ClientWidgetManifest extends WidgetManifestBase {
  component: LazyExoticComponent<ComponentType<WidgetProps>> | ComponentType<WidgetProps>
}
