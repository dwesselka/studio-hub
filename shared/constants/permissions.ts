/**
 * Permission definitions — Catálogo de todas as permissões do sistema.
 *
 * Cada módulo registra suas permissões aqui. Usado para:
 * - Criar roles padrão no onboarding
 * - Validar permissões no RBAC
 * - Exibir no painel de configuração de roles
 */

// ---------------------------------------------------------------------------
// Permissões por módulo
// ---------------------------------------------------------------------------

export const PERMISSIONS = {
  workspace: [
    'workspace:read',
    'workspace:settings',
    'workspace:billing',
    'workspace:members',
  ],
  dashboard: [
    'dashboard:read',
  ],
  agenda: [
    'agenda:read',
    'agenda:write',
    'agenda:delete',
  ],
  clientes: [
    'clientes:read',
    'clientes:write',
    'clientes:delete',
    'clientes:export',
  ],
  servicos: [
    'servicos:read',
    'servicos:write',
    'servicos:delete',
  ],
  equipe: [
    'equipe:read',
    'equipe:write',
    'equipe:delete',
    'equipe:invite',
  ],
  atendimento: [
    'atendimento:read',
    'atendimento:write',
    'atendimento:delete',
  ],
  pagamento: [
    'pagamento:read',
    'pagamento:write',
    'pagamento:refund',
  ],
  fidelizacao: [
    'fidelizacao:read',
    'fidelizacao:write',
    'fidelizacao:delete',
  ],
  relatorios: [
    'relatorios:read',
    'relatorios:export',
  ],
  analytics: [
    'analytics:read',
    'analytics:export',
  ],
  'pos-atendimento': [
    'pos-atendimento:read',
    'pos-atendimento:write',
  ],
  configuracoes: [
    'configuracoes:read',
    'configuracoes:write',
  ],
} as const

// ---------------------------------------------------------------------------
// Roles padrão (criadas automaticamente no onboarding)
// ---------------------------------------------------------------------------

export interface DefaultRoleDef {
  name: string
  displayName: string
  description: string
  isSystem: boolean
  permissions: string[]
}

export const DEFAULT_ROLES: DefaultRoleDef[] = [
  {
    name: 'admin',
    displayName: 'Administrador',
    description: 'Acesso total ao workspace',
    isSystem: true,
    permissions: ['*'],
  },
  {
    name: 'gerente',
    displayName: 'Gerente',
    description: 'Gestão operacional sem acesso a billing',
    isSystem: true,
    permissions: [
      'dashboard:read',
      'agenda:*',
      'clientes:*',
      'servicos:*',
      'equipe:read',
      'equipe:write',
      'atendimento:*',
      'pagamento:read',
      'pagamento:write',
      'fidelizacao:*',
      'relatorios:read',
      'analytics:read',
      'pos-atendimento:*',
      'configuracoes:read',
    ],
  },
  {
    name: 'profissional',
    displayName: 'Profissional',
    description: 'Acesso à agenda própria e clientes',
    isSystem: true,
    permissions: [
      'dashboard:read',
      'agenda:read',
      'agenda:write',
      'clientes:read',
      'atendimento:read',
      'atendimento:write',
    ],
  },
  {
    name: 'recepcionista',
    displayName: 'Recepcionista',
    description: 'Gestão de agenda e atendimento ao cliente',
    isSystem: true,
    permissions: [
      'dashboard:read',
      'agenda:*',
      'clientes:read',
      'clientes:write',
      'atendimento:read',
      'atendimento:write',
      'pagamento:read',
      'pagamento:write',
    ],
  },
]

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

/** Retorna a lista flat de todas as permissões do sistema */
export function getAllPermissions(): string[] {
  return Object.values(PERMISSIONS).flat()
}

/** Retorna as permissões de um módulo específico */
export function getModulePermissions(moduleId: string): string[] {
  return (PERMISSIONS as unknown as Record<string, string[]>)[moduleId] ?? []
}

/** Labels legíveis para cada ação */
export const PERMISSION_ACTION_LABELS: Record<string, string> = {
  read: 'Visualizar',
  write: 'Criar/Editar',
  delete: 'Excluir',
  export: 'Exportar',
  refund: 'Reembolsar',
  invite: 'Convidar',
  settings: 'Configurações',
  billing: 'Faturamento',
  members: 'Membros',
}
