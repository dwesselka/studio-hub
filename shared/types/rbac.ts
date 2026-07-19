/**
 * RBAC — Tipos e utilitários para controle de acesso.
 *
 * O formato de permissão segue o padrão:
 *   "<module>:<action>"
 *
 * Wildcards suportados:
 *   "*"         → acesso total (admin)
 *   "module:*"  → todas as ações do módulo
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type PermissionAction = 'read' | 'write' | 'delete' | 'export' | 'refund' | 'invite' | 'settings' | 'billing' | '*'

export type Permission = `${string}:${PermissionAction}` | '*'

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

/**
 * Verifica se um conjunto de permissões contém a permissão requerida.
 *
 * Suporta wildcards:
 * - `"*"` concede acesso a tudo
 * - `"module:*"` concede acesso a todas as ações do módulo
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string,
): boolean {
  // Admin global
  if (userPermissions.includes('*')) return true

  // Wildcard do módulo
  const [mod] = requiredPermission.split(':')
  if (mod && userPermissions.includes(`${mod}:*`)) return true

  // Permissão exata
  return userPermissions.includes(requiredPermission)
}

/**
 * Verifica se TODAS as permissões requeridas são atendidas.
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every((p) => hasPermission(userPermissions, p))
}

/**
 * Verifica se ALGUMA das permissões requeridas é atendida.
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.some((p) => hasPermission(userPermissions, p))
}
