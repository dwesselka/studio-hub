import { memo, useCallback, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppHeader } from '@/components/layout/app-header'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig } from '@/lib/motion'
import { useAuth } from '@/features/auth/use-auth'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import { Calendar, LayoutDashboard, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '@/types'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/app/profissional', icon: LayoutDashboard },
  { id: 'agenda', label: 'Minha Agenda', href: '/app/profissional/agenda', icon: Calendar },
  {
    id: 'atendimentos',
    label: 'Meus Atendimentos',
    href: '/app/profissional/atendimentos',
    icon: ClipboardCheck,
  },
]

const routeBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  '/app/profissional': [{ label: 'Dashboard' }],
  '/app/profissional/agenda': [{ label: 'Minha Agenda' }],
  '/app/profissional/atendimentos': [{ label: 'Meus Atendimentos' }],
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  return routeBreadcrumbs[pathname] ?? [{ label: 'Profissional' }]
}

export const ProfessionalLayout = memo(function ProfessionalLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const businessName = user?.onboardingData?.business?.nome

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true)
  }, [])

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false)
  }, [])

  const breadcrumbs = useMemo(
    () => [
      { label: businessName || 'Dashboard', href: '/app' },
      ...getBreadcrumbs(location.pathname),
    ],
    [location.pathname, businessName],
  )

  const initials = (businessName || 'StudioHub')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isActive = (href: string) => {
    if (href === '/app/profissional') return location.pathname === '/app/profissional'
    return location.pathname.startsWith(href)
  }

  const sidebarContent = (
    <aside
      className="flex h-full flex-col border-r border-sidebar-border bg-sidebar"
      aria-label="Navegação do profissional"
    >
      <div
        className={cn(
          'flex h-14 items-center border-b border-sidebar-border px-4',
          sidebarCollapsed && 'justify-center px-2',
        )}
      >
        <Link to="/app" className="flex items-center gap-2.5" onClick={closeMobileSidebar}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            {initials}
          </span>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight text-foreground">
                {businessName || 'StudioHub'}
              </span>
              <span className="text-[10px] text-muted-foreground">Profissional</span>
            </div>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {!sidebarCollapsed && (
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Profissional
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const link = (
              <Link
                to={item.href}
                onClick={closeMobileSidebar}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                  sidebarCollapsed && 'justify-center px-2',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              </Link>
            )

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return <li key={item.id}>{link}</li>
          })}
        </nav>
      </ScrollArea>
    </aside>
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-svh bg-background">
        {/* Desktop sidebar */}
        <div
          className={cn(
            'hidden lg:flex shrink-0 transition-[width] duration-300 ease-in-out',
            sidebarCollapsed ? 'w-[68px]' : 'w-64',
          )}
        >
          {sidebarContent}
        </div>

        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-[var(--z-overlay)] lg:hidden" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={closeMobileSidebar}
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

        <div className="flex min-w-0 flex-1 flex-col">
          {!online && (
            <div
              role="status"
              className="bg-warning/15 px-4 py-2 text-center text-sm text-warning-foreground"
            >
              Você está offline. Algumas funcionalidades podem estar indisponíveis.
            </div>
          )}

          <AppHeader
            breadcrumbs={breadcrumbs}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
            onOpenMobileSidebar={openMobileSidebar}
          />

          <main className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={transition}
                className="mx-auto w-full max-w-[1600px]"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
})
