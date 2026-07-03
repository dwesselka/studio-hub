export type AsyncState = 'idle' | 'loading' | 'success' | 'error' | 'empty' | 'offline'

export interface MetricCardData {
  id: string
  title: string
  description: string
  value: string
  trend: number
  trendLabel: string
  badge?: string
  icon: string
}

export interface NavItem {
  id: string
  label: string
  href: string
  icon: string
  shortcut?: string
  badge?: string
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

export interface PlatformStatus {
  label: string
  status: 'operational' | 'degraded' | 'offline'
  uptime: string
  lastIncident?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
