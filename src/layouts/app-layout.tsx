import { memo, useCallback, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig } from '@/lib/motion'
import { useAuth } from '@/features/auth/use-auth'
import type { BreadcrumbItem } from '@/types'

const routeBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  '/app': [],
  '/app/analytics': [{ label: 'Analytics' }],
  '/app/agendamentos': [{ label: 'Agendamentos' }],
  '/app/atendimento': [{ label: 'Atendimento' }],
  '/app/pos-atendimento': [{ label: 'Pós-Atendimento' }],
  '/app/relatorios': [{ label: 'Relatórios' }],
  '/app/fidelizacao': [{ label: 'Fidelização' }],
  '/app/pagamentos': [{ label: 'Pagamentos' }],
  '/app/clientes': [{ label: 'Clientes' }],
  '/app/servicos': [{ label: 'Serviços' }],
  '/app/equipe': [{ label: 'Equipe' }],
  '/app/configuracoes': [{ label: 'Configurações' }],
}

function getBreadcrumbs(pathname: string, businessName?: string): BreadcrumbItem[] {
  const homeLabel = businessName || 'Dashboard'
  const items = routeBreadcrumbs[pathname] ?? [{ label: 'Página' }]
  return [{ label: homeLabel, href: '/app' }, ...items]
}

export const AppLayout = memo(function AppLayout() {
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
    () => getBreadcrumbs(location.pathname, businessName),
    [location.pathname, businessName],
  )

  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

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
  )
})
