/**
 * ModuleManifest — Contrato universal para módulos do StudioHub.
 *
 * Cada módulo (agenda, clientes, financeiro, etc.) implementa esse
 * contrato para se registrar automaticamente no sistema sem alterar
 * o core da aplicação.
 */

import type { Plan } from './workspace.ts'

// ---------------------------------------------------------------------------
// Permissões
// ---------------------------------------------------------------------------

export interface PermissionDef {
  /** Ex: "agenda:read" */
  id: string
  /** Ex: "Visualizar agenda" */
  name: string
  /** Descrição longa opcional */
  description?: string
}

// ---------------------------------------------------------------------------
// Navegação
// ---------------------------------------------------------------------------

export type NavGroupId = 'overview' | 'core' | 'business' | 'settings'

export interface ModuleNavItem {
  id: string
  label: string
  /** Caminho relativo ao módulo, ex: "/agendamentos" */
  path: string
  icon: string
  shortcut?: string
  /** Feature flag que controla a visibilidade deste item */
  featureFlag?: string
  /** Função que retorna uma string para o badge (ex: contagem) */
  badge?: () => string
  group: NavGroupId
  /** Posição no menu (menor = mais acima) */
  order: number
}

// ---------------------------------------------------------------------------
// Dashboard Widgets
// ---------------------------------------------------------------------------

export interface WidgetSize {
  w: number // grid columns (1-4)
  h: number // grid rows
}

export interface WidgetManifestBase {
  id: string
  name: string
  description?: string
  defaultSize: WidgetSize
  /** Permissão necessária para exibir, ex: "agenda:read" */
  permission: string
  /** Intervalo de refresh automático em ms */
  refreshInterval?: number
}

// ---------------------------------------------------------------------------
// Comandos (Command Palette)
// ---------------------------------------------------------------------------

export interface CommandDef {
  id: string
  label: string
  shortcut?: string
  /** Permissão necessária */
  permission?: string
}

// ---------------------------------------------------------------------------
// Configurações do Módulo
// ---------------------------------------------------------------------------

export interface ModuleSettingDef {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select'
  defaultValue: unknown
  options?: Array<{ label: string; value: string }>
}

// ---------------------------------------------------------------------------
// Manifest Principal
// ---------------------------------------------------------------------------

export interface ModuleManifest {
  /** Identificador único, ex: "agenda" */
  id: string
  /** Nome exibido ao usuário, ex: "StudioHub Agenda" */
  name: string
  description: string
  version: string
  /** Nome do ícone Lucide */
  icon: string

  // Controle de acesso
  /** Plano mínimo para habilitar este módulo */
  requiredPlan: Plan
  /** Permissões registradas por este módulo */
  permissions: PermissionDef[]

  // Navegação
  navigation: ModuleNavItem[]

  // Dashboard widgets
  widgets?: WidgetManifestBase[]

  // Comandos
  commands?: CommandDef[]

  // Configurações
  settings?: ModuleSettingDef[]
}
