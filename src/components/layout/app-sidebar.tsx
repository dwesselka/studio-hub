import { memo, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  Users,
  Scissors,
  CreditCard,
  Gift,
  FileText,
  UserCog,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { navigationGroups } from '@/features/dashboard/data'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Calendar,
  Users,
  Scissors,
  CreditCard,
  Gift,
  FileText,
  UserCog,
  Settings,
}

interface AppSidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onMobileClose: () => void
  className?: string
}

const NavLink = memo(function NavLink({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  active: boolean
  onNavigate?: () => void
}) {
  const Icon = iconMap[item.icon] ?? LayoutDashboard

  const link = (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
        collapsed && 'justify-center px-2',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5 text-[10px]">
              {item.badge}
            </Badge>
          )}
          {item.shortcut && (
            <kbd className="hidden xl:inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {item.shortcut}
            </kbd>
          )}
        </>
      )}
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.shortcut && <kbd className="text-[10px] opacity-60">{item.shortcut}</kbd>}
        </TooltipContent>
      </Tooltip>
    )
  }

  return link
})

export const AppSidebar = memo(function AppSidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
  className,
}: AppSidebarProps) {
  const location = useLocation()

  const isActive = useMemo(
    () => (href: string) => {
      if (href === '/app') return location.pathname === '/app'
      return location.pathname.startsWith(href)
    },
    [location.pathname],
  )

  const sidebarContent = (
    <aside
      className={cn('flex h-full flex-col border-r border-sidebar-border bg-sidebar', className)}
      aria-label="Navegação principal"
    >
      <div
        className={cn(
          'flex h-14 items-center border-b border-sidebar-border px-4',
          collapsed && 'justify-center px-2',
        )}
      >
        <Link to="/app" className="flex items-center gap-2.5" onClick={onMobileClose}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            IP
          </span>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight text-foreground">
                Infinity Partner
              </span>
              <span className="text-[10px] text-muted-foreground">Gestão inteligente</span>
            </div>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          {navigationGroups.map((group) => (
            <div key={group.id}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              {collapsed && <Separator className="mb-2" />}
              <ul className="flex flex-col gap-0.5" role="list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      item={item}
                      collapsed={collapsed}
                      active={isActive(item.href)}
                      onNavigate={onMobileClose}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Plano Profissional</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Renova em 15 dias</p>
          </div>
        </div>
      )}
    </aside>
  )

  return (
    <TooltipProvider delayDuration={0}>
      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:flex shrink-0 transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-64',
        )}
      >
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[var(--z-overlay)] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-label="Fechar menu"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="relative h-full w-[min(280px,85vw)] shadow-xl"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </TooltipProvider>
  )
})
