import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProviders } from '@/providers'
import { AppLayout } from '@/layouts/app-layout'

const LandingPage = lazy(() => import('@/pages/LandingPage.jsx'))
const CadastroPage = lazy(() => import('@/pages/CadastroPage.jsx'))
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)

function PageLoader() {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-background"
      role="status"
      aria-label="Carregando"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground animate-pulse">
          IP
        </div>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  )
}
