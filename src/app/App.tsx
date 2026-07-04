import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProviders } from '@/providers'
import { AppLayout } from '@/layouts/app-layout'
import { AuthGuard } from '@/features/auth/guard'
import { PageLoader } from '@/components/ui/page-loader'
import { ReminderScheduler } from '@/components/reminder-scheduler'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)
const AgendaPage = lazy(() =>
  import('@/features/agenda/pages/agenda-page').then((m) => ({ default: m.AgendaPage })),
)
const AtendimentoPage = lazy(() =>
  import('@/features/atendimento/pages/atendimento-page').then((m) => ({
    default: m.AtendimentoPage,
  })),
)
const PosAtendimentoPage = lazy(() =>
  import('@/features/pos-atendimento/pages/pos-atendimento-page').then((m) => ({
    default: m.PosAtendimentoPage,
  })),
)
const RelatoriosPage = lazy(() =>
  import('@/features/relatorios/pages/relatorios-page').then((m) => ({
    default: m.RelatoriosPage,
  })),
)
const FidelizacaoPage = lazy(() =>
  import('@/features/fidelizacao/pages/fidelizacao-page').then((m) => ({
    default: m.FidelizacaoPage,
  })),
)
const PagamentoPage = lazy(() =>
  import('@/features/pagamento/pages/pagamento-page').then((m) => ({
    default: m.PagamentoPage,
  })),
)

export default function App() {
  return (
    <AppProviders>
      <ReminderScheduler />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/cadastro" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/app"
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="agendamentos" element={<AgendaPage />} />
              <Route path="atendimento" element={<AtendimentoPage />} />
              <Route path="pos-atendimento" element={<PosAtendimentoPage />} />
              <Route path="relatorios" element={<RelatoriosPage />} />
              <Route path="fidelizacao" element={<FidelizacaoPage />} />
              <Route path="pagamentos" element={<PagamentoPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  )
}
