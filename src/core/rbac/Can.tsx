import type { ReactNode } from 'react'
import { usePermission } from './RBACProvider.tsx'

interface CanProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermission } = usePermission()
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>
}

interface CanAllProps {
  permissions: string[]
  children: ReactNode
  fallback?: ReactNode
}

export function CanAll({ permissions, children, fallback = null }: CanAllProps) {
  const { hasAll } = usePermission()
  return hasAll(permissions) ? <>{children}</> : <>{fallback}</>
}

interface CanAnyProps {
  permissions: string[]
  children: ReactNode
  fallback?: ReactNode
}

export function CanAny({ permissions, children, fallback = null }: CanAnyProps) {
  const { hasAny } = usePermission()
  return hasAny(permissions) ? <>{children}</> : <>{fallback}</>
}
