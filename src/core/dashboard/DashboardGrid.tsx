import { useMemo, Suspense } from 'react'
import { useNavigation } from '../navigation/NavigationProvider.tsx'
import { usePermission } from '../rbac/RBACProvider.tsx'
import { useWorkspace } from '../workspace/WorkspaceProvider.tsx'
import type { ClientWidgetManifest } from './types.ts'

function WidgetSkeleton() {
  return (
    <div className="h-full w-full animate-pulse rounded-xl bg-muted/50" />
  )
}



export function DashboardGrid() {
  const { modules } = useNavigation()
  const { hasPermission } = usePermission()
  const { workspace } = useWorkspace()

  const widgets = useMemo(() => {
    return modules
      .flatMap((m) => m.widgets ?? [])
      .filter((w) => hasPermission(w.permission)) as ClientWidgetManifest[]
  }, [modules, hasPermission])

  if (!workspace) return null

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4 lg:p-6">
      {widgets.map((widget) => {
        // Mapeia o tamanho grid para classes do Tailwind
        const colSpan = `col-span-${widget.defaultSize.w}`
        const rowSpan = `row-span-${widget.defaultSize.h}`
        
        return (
          <div 
            key={widget.id} 
            className={`${colSpan} ${rowSpan} min-h-[160px]`}
          >
            <Suspense fallback={<WidgetSkeleton />}>
              <widget.component 
                workspaceId={workspace.id} 
                size={widget.defaultSize} 
              />
            </Suspense>
          </div>
        )
      })}
    </div>
  )
}
