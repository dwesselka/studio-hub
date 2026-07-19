import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useNavigation } from '@/core/navigation/NavigationProvider.tsx'
import { PermissionGate } from '@/core/rbac/PermissionGate.tsx'
import { DashboardGrid } from '@/core/dashboard/DashboardGrid.tsx'
import { AuthGuard } from '@/features/auth/guard.tsx'
import { AppLayout } from '@/layouts/app-layout.tsx'
import { PageLoader } from '@/components/ui/page-loader.tsx'
import { useWorkspace } from '@/core/workspace/WorkspaceProvider.tsx'

const LandingPage = lazy(() => import('@/pages/LandingPage.tsx'))
const CadastroPage = lazy(() => import('@/pages/CadastroPage.tsx'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage.tsx'))
const LoginPage = lazy(() => import('@/pages/LoginPage.tsx'))
const ConvitePage = lazy(() => import('@/pages/ConvitePage.tsx'))

// Temporary fallback guard for workspace
function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { workspace, isLoading } = useWorkspace()
  
  if (isLoading) return <PageLoader />
  
  // Se não tem workspace mas está logado, deve ir pro onboarding criar um
  if (!workspace) {
    return <Navigate to="/onboarding" replace />
  }
  
  return <>{children}</>
}

export function AppRoutes() {
  const { modules } = useNavigation()

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route index element={<LandingPage />} />
      <Route path="/signup" element={<CadastroPage />} />
      <Route path="/cadastro" element={<OnboardingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/convite" element={<ConvitePage />} />

      {/* Rotas Protegidas - App */}
      <Route
        path="/app"
        element={
          <AuthGuard role="lojista">
            <WorkspaceGuard>
              <AppLayout />
            </WorkspaceGuard>
          </AuthGuard>
        }
      >
        <Route index element={<DashboardGrid />} />
        
        {/* Rotas injetadas dinamicamente pelos módulos */}
        {modules.flatMap(mod => 
          mod.routes.map(route => {
            const Component = route.component
            // Tratamento de path: se for absoluto, retira o /, se for relativo mantem.
            const routePath = route.path.startsWith('/') ? route.path.slice(1) : route.path
            return (
              <Route
                key={`${mod.id}-${route.path}`}
                path={routePath}
                element={
                  <PermissionGate permission={`${mod.id}:read`}>
                    <Suspense fallback={<PageLoader />}>
                      <Component />
                    </Suspense>
                  </PermissionGate>
                }
              />
            )
          })
        )}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
