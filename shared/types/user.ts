/**
 * User — Tipos compartilhados para o usuário autenticado.
 */

export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Contexto do usuário autenticado após resolver workspace + role.
 * Disponível via `useAuth()` no frontend e `c.get(...)` no server.
 */
export interface AuthenticatedUser extends User {
  /** Workspace atualmente ativo */
  currentWorkspaceId: string
  /** ID do membro neste workspace */
  memberId: string
  /** Nome da role neste workspace */
  roleName: string
  /** Permissões efetivas neste workspace */
  permissions: string[]
}
