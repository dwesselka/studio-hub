import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import { useWorkspace } from '../workspace/WorkspaceProvider.tsx'
import {
  hasPermission as rbacHasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from '@shared/types/rbac.ts'

interface RBACContextValue {
  permissions: string[]
  hasPermission: (permission: string) => boolean
  hasAll: (permissions: string[]) => boolean
  hasAny: (permissions: string[]) => boolean
}

const RBACContext = createContext<RBACContextValue | null>(null)

export function RBACProvider({ children }: { children: ReactNode }) {
  const { role } = useWorkspace()

  const permissions = useMemo(() => role?.permissions || [], [role?.permissions])

  const hasPermission = useCallback(
    (permission: string) => rbacHasPermission(permissions, permission),
    [permissions],
  )

  const hasAll = useCallback(
    (required: string[]) => hasAllPermissions(permissions, required),
    [permissions],
  )

  const hasAny = useCallback(
    (required: string[]) => hasAnyPermission(permissions, required),
    [permissions],
  )

  return (
    <RBACContext.Provider value={{ permissions, hasPermission, hasAll, hasAny }}>
      {children}
    </RBACContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePermission() {
  const ctx = useContext(RBACContext)
  if (!ctx) {
    throw new Error('usePermission must be used within a RBACProvider')
  }
  return ctx
}
