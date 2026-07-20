/**
 * Plan definitions — Define quais módulos e limites cada plano possui.
 */

import type { Plan } from '../types/workspace.ts'

// ---------------------------------------------------------------------------
// Módulos por plano
// ---------------------------------------------------------------------------

export const PLAN_MODULES: Record<Plan, string[]> = {
  STARTER: [
    'dashboard',
    'agenda',
    'clientes',
    'servicos',
    'equipe',
    'configuracoes',
  ],
  PRO: [
    'dashboard',
    'agenda',
    'clientes',
    'servicos',
    'equipe',
    'atendimento',
    'pagamento',
    'fidelizacao',
    'relatorios',
    'configuracoes',
  ],
  PREMIUM: [
    'dashboard',
    'agenda',
    'clientes',
    'servicos',
    'equipe',
    'atendimento',
    'pagamento',
    'fidelizacao',
    'relatorios',
    'analytics',
    'pos-atendimento',
    'configuracoes',
  ],
  ENTERPRISE: [
    'dashboard',
    'agenda',
    'clientes',
    'servicos',
    'equipe',
    'atendimento',
    'pagamento',
    'fidelizacao',
    'relatorios',
    'analytics',
    'pos-atendimento',
    'crm',
    'marketing',
    'ia',
    'rh',
    'estoque',
    'marketplace',
    'configuracoes',
  ],
}

// ---------------------------------------------------------------------------
// Limites por plano
// ---------------------------------------------------------------------------

export interface PlanLimits {
  maxMembers: number
  maxClients: number
  maxServicesPerMonth: number
  customBranding: boolean
  customDomain: boolean
  apiAccess: boolean
  prioritySupport: boolean
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  STARTER: {
    maxMembers: 3,
    maxClients: 200,
    maxServicesPerMonth: 500,
    customBranding: false,
    customDomain: false,
    apiAccess: false,
    prioritySupport: false,
  },
  PRO: {
    maxMembers: 10,
    maxClients: 2000,
    maxServicesPerMonth: 5000,
    customBranding: true,
    customDomain: false,
    apiAccess: false,
    prioritySupport: false,
  },
  PREMIUM: {
    maxMembers: 50,
    maxClients: 10000,
    maxServicesPerMonth: 50000,
    customBranding: true,
    customDomain: true,
    apiAccess: true,
    prioritySupport: true,
  },
  ENTERPRISE: {
    maxMembers: -1, // ilimitado
    maxClients: -1,
    maxServicesPerMonth: -1,
    customBranding: true,
    customDomain: true,
    apiAccess: true,
    prioritySupport: true,
  },
}

// ---------------------------------------------------------------------------
// Metadados dos planos (UI)
// ---------------------------------------------------------------------------

export interface PlanMeta {
  id: Plan
  name: string
  description: string
  highlighted: boolean
}

export const PLAN_META: PlanMeta[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    description: 'Ideal para profissionais autônomos',
    highlighted: false,
  },
  {
    id: 'PRO',
    name: 'Professional',
    description: 'Para salões e estúdios em crescimento',
    highlighted: true,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    description: 'Para redes e franquias',
    highlighted: false,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'Soluções sob medida',
    highlighted: false,
  },
]
