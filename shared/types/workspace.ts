/**
 * Workspace — Tipos compartilhados para multi-tenancy.
 *
 * Cada cliente possui um Workspace contendo identidade visual,
 * plano, módulos habilitados, membros e configurações.
 */

// ---------------------------------------------------------------------------
// Plano
// ---------------------------------------------------------------------------

export type Plan = 'STARTER' | 'PRO' | 'PREMIUM' | 'ENTERPRISE'

export const PLAN_HIERARCHY: Record<Plan, number> = {
  STARTER: 0,
  PRO: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
}

/**
 * Verifica se `userPlan` atende ao requisito mínimo `requiredPlan`.
 */
export function meetsMinPlan(userPlan: Plan, requiredPlan: Plan): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[requiredPlan]
}

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------

export interface WorkspaceBranding {
  logo: string | null
  favicon: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

// ---------------------------------------------------------------------------
// Workspace
// ---------------------------------------------------------------------------

export interface Workspace {
  id: string
  slug: string
  name: string
  ownerId: string

  // Branding
  logo: string | null
  favicon: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string

  // Plano e módulos
  plan: Plan
  modules: string[]

  // Domínio customizado (futuro)
  customDomain: string | null

  // Configurações gerais
  settings: Record<string, unknown>

  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Workspace Member
// ---------------------------------------------------------------------------

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  roleId: string
  joinedAt: string
}

// ---------------------------------------------------------------------------
// Role
// ---------------------------------------------------------------------------

export interface WorkspaceRole {
  id: string
  workspaceId: string
  name: string
  isSystem: boolean
  permissions: string[]
  createdAt: string
}

// ---------------------------------------------------------------------------
// Convite
// ---------------------------------------------------------------------------

export interface WorkspaceInvite {
  id: string
  workspaceId: string
  email: string
  roleId: string
  token: string
  expiresAt: string
  acceptedAt: string | null
  createdAt: string
}
