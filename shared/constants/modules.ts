/**
 * Module catalog — Metadados de todos os módulos disponíveis no StudioHub.
 *
 * Usado para:
 * - Tela de seleção de módulos no onboarding
 * - Painel de configuração do workspace
 * - Marketplace de módulos (futuro)
 */

import type { Plan } from '../types/workspace.ts'

export interface ModuleCatalogEntry {
  id: string
  name: string
  description: string
  icon: string
  /** Plano mínimo para habilitar */
  requiredPlan: Plan
  /** Módulo é obrigatório (não pode ser desabilitado) */
  required: boolean
  /** Categoria para agrupamento na UI */
  category: 'core' | 'business' | 'advanced'
}

export const MODULE_CATALOG: ModuleCatalogEntry[] = [
  // Core (sempre disponíveis)
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Visão geral do negócio com métricas e atalhos',
    icon: 'LayoutDashboard',
    requiredPlan: 'STARTER',
    required: true,
    category: 'core',
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    description: 'Preferências do workspace e do usuário',
    icon: 'Settings',
    requiredPlan: 'STARTER',
    required: true,
    category: 'core',
  },

  // Starter+
  {
    id: 'agenda',
    name: 'StudioHub Agenda',
    description: 'Gestão completa de agendamentos e horários',
    icon: 'Calendar',
    requiredPlan: 'STARTER',
    required: false,
    category: 'core',
  },
  {
    id: 'clientes',
    name: 'StudioHub Clientes',
    description: 'Cadastro e gestão de clientes',
    icon: 'Users',
    requiredPlan: 'STARTER',
    required: false,
    category: 'core',
  },
  {
    id: 'servicos',
    name: 'Serviços',
    description: 'Catálogo de serviços e preços',
    icon: 'Scissors',
    requiredPlan: 'STARTER',
    required: false,
    category: 'core',
  },
  {
    id: 'equipe',
    name: 'Equipe',
    description: 'Gestão de profissionais e colaboradores',
    icon: 'UserCog',
    requiredPlan: 'STARTER',
    required: false,
    category: 'core',
  },

  // Pro+
  {
    id: 'atendimento',
    name: 'Atendimento',
    description: 'Registro e acompanhamento de atendimentos',
    icon: 'ClipboardCheck',
    requiredPlan: 'PRO',
    required: false,
    category: 'business',
  },
  {
    id: 'pagamento',
    name: 'StudioHub Pay',
    description: 'Controle financeiro e pagamentos',
    icon: 'CreditCard',
    requiredPlan: 'PRO',
    required: false,
    category: 'business',
  },
  {
    id: 'fidelizacao',
    name: 'StudioHub Marketing',
    description: 'Programas de fidelização e campanhas',
    icon: 'Gift',
    requiredPlan: 'PRO',
    required: false,
    category: 'business',
  },
  {
    id: 'relatorios',
    name: 'StudioHub Finance',
    description: 'Relatórios financeiros e operacionais',
    icon: 'FileText',
    requiredPlan: 'PRO',
    required: false,
    category: 'business',
  },

  // Premium+
  {
    id: 'analytics',
    name: 'StudioHub Insights',
    description: 'Análises avançadas e inteligência de dados',
    icon: 'BarChart3',
    requiredPlan: 'PREMIUM',
    required: false,
    category: 'advanced',
  },
  {
    id: 'pos-atendimento',
    name: 'Pós-Atendimento',
    description: 'Follow-up e feedback de clientes',
    icon: 'Heart',
    requiredPlan: 'PREMIUM',
    required: false,
    category: 'advanced',
  },

  // Enterprise
  {
    id: 'crm',
    name: 'CRM',
    description: 'Gestão de relacionamento com clientes',
    icon: 'Contact',
    requiredPlan: 'ENTERPRISE',
    required: false,
    category: 'advanced',
  },
  {
    id: 'marketing',
    name: 'Marketing Avançado',
    description: 'Automações e campanhas multicanal',
    icon: 'Megaphone',
    requiredPlan: 'ENTERPRISE',
    required: false,
    category: 'advanced',
  },
  {
    id: 'ia',
    name: 'StudioHub IA',
    description: 'Insights e automações com inteligência artificial',
    icon: 'Brain',
    requiredPlan: 'ENTERPRISE',
    required: false,
    category: 'advanced',
  },
  {
    id: 'rh',
    name: 'Recursos Humanos',
    description: 'Gestão de colaboradores, folha e ponto',
    icon: 'Briefcase',
    requiredPlan: 'ENTERPRISE',
    required: false,
    category: 'advanced',
  },
  {
    id: 'estoque',
    name: 'Estoque',
    description: 'Controle de insumos e produtos',
    icon: 'Package',
    requiredPlan: 'ENTERPRISE',
    required: false,
    category: 'advanced',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Loja de módulos e integrações de terceiros',
    icon: 'Store',
    requiredPlan: 'ENTERPRISE',
    required: false,
    category: 'advanced',
  },
]

/**
 * Retorna os módulos disponíveis para um plano específico.
 */
export function getModulesForPlan(plan: Plan): ModuleCatalogEntry[] {
  const hierarchy: Record<Plan, number> = {
    STARTER: 0,
    PRO: 1,
    PREMIUM: 2,
    ENTERPRISE: 3,
  }
  const userLevel = hierarchy[plan]
  return MODULE_CATALOG.filter((m) => hierarchy[m.requiredPlan] <= userLevel)
}

/**
 * Retorna os módulos obrigatórios (não podem ser desabilitados).
 */
export function getRequiredModules(): string[] {
  return MODULE_CATALOG.filter((m) => m.required).map((m) => m.id)
}
