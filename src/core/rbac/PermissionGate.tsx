import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usePermission } from './RBACProvider.tsx'

interface PermissionGateProps {
  permission: string
  children: ReactNode
  redirectTo?: string
}

export function PermissionGate({ permission, children, redirectTo = '/app' }: PermissionGateProps) {
  const { hasPermission } = usePermission()
  const location = useLocation()

  if (!hasPermission(permission)) {
    // Evitar loop infinito se redirecionar para a mesma página
    if (location.pathname === redirectTo) {
      return (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-xl font-bold">Acesso Negado</h2>
            <p className="text-muted-foreground mt-2">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      )
    }

    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
