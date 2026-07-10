import { memo, useCallback, useMemo, useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppHeader } from '@/components/layout/app-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig } from '@/lib/motion'
import { LayoutDashboard, Calendar, Gift, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'dashboard', label: 'Início', href: '/portal', icon: LayoutDashboard },
  { id: 'agendamentos', label: 'Meus Agendamentos', href: '/portal/agendamentos', icon: Calendar },
  { id: 'fidelidade', label: 'Fidelidade', href: '/portal/fidelidade', icon: Gift },
  { id: 'perfil', label: 'Meu Perfil', href: '/portal/perfil', icon: User },
]

export const ClientLayout = memo(function ClientLayout() {
  const location = useLocation()
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarCollapsed((prev) => !prev), [])
  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), [])
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), [])

  const breadcrumbs = useMemo(() => {
    const map: Record<string, string> = {
      '/portal': 'Início',
      '/portal/agendamentos': 'Meus Agendamentos',
      '/portal/fidelidade': 'Fidelidade',
      '/portal/perfil': 'Meu Perfil',
    }
    return [
      { label: 'Portal' },
      ...(map[location.pathname] ? [{ label: map[location.pathname] }] : []),
    ]
  }, [location.pathname])

  const isActive = (href: string) => {
    if (href === '/portal') return location.pathname === '/portal'
    return location.pathname.startsWith(href)
  }

  const sidebarContent = (
    <aside
      className="flex h-full flex-col border-r border-sidebar-border bg-sidebar"
      aria-label="Portal do cliente"
    >
      <div
        className={cn(
          'flex h-14 items-center border-b border-sidebar-border px-4',
          sidebarCollapsed && 'justify-center px-2',
        )}
      >
        <Link to="/portal" className="flex items-center gap-2.5" onClick={closeMobileSidebar}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          {!sidebarCollapsed && (
            <span className="text-sm font-semibold text-foreground">Meu Portal</span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {!sidebarCollapsed && (
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cliente
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const link = (
              <Link
                key={item.id}
                to={item.href}
                onClick={closeMobileSidebar}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                  sidebarCollapsed && 'justify-center px-2',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
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
            return link
          })}
        </nav>
      </ScrollArea>
    </aside>
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-svh bg-background">
        <div
          className={cn(
            'hidden lg:flex shrink-0 transition-[width] duration-300 ease-in-out',
            sidebarCollapsed ? 'w-[68px]' : 'w-64',
          )}
        >
          {sidebarContent}
        </div>

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
              Você está offline.
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
