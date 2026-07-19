import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useWorkspace } from '../workspace/WorkspaceProvider.tsx'
import { usePermission } from '../rbac/RBACProvider.tsx'
// feature flags would go here in the future
import { moduleRegistry } from '../module/registry.ts'
import type { NavGroup } from '@/types'
import type { ClientModule } from '../module/types.ts'

interface NavigationContextValue {
  navGroups: NavGroup[]
  modules: ClientModule[]
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

const GROUP_LABELS: Record<string, string> = {
  overview: 'Visão Geral',
  core: 'Módulos',
  business: 'Gestão',
  settings: 'Configurações',
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { workspace } = useWorkspace()
  const { permissions } = usePermission()

  const modules = useMemo(() => {
    if (!workspace) return []
    return moduleRegistry.getForWorkspace(
      workspace.modules,
      workspace.plan,
      permissions
    )
  }, [workspace, permissions])

  const navGroups = useMemo(() => {
    const groups = new Map<string, NavGroup>()
    
    for (const mod of modules) {
      for (const nav of mod.navigation) {
        // Checar feature flag - futuramente usar hook de feature flag
        // if (nav.featureFlag && !isEnabled(nav.featureFlag)) continue
        
        const group = groups.get(nav.group) ?? { 
          id: nav.group, 
          label: GROUP_LABELS[nav.group] ?? nav.group, 
          items: [] 
        }
        
        group.items.push({
          id: nav.id,
          label: nav.label,
          href: `/app${nav.path}`,
          icon: nav.icon,
          shortcut: nav.shortcut,
          badge: nav.badge ? nav.badge() : undefined,
        })
        
        groups.set(nav.group, group)
      }
    }
    
    return Array.from(groups.values())
      // Aqui poderíamos ter uma ordem fixa para os grupos também
  }, [modules])

  return (
    <NavigationContext.Provider value={{ navGroups, modules }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return ctx
}
