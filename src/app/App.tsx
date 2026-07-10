import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProviders } from '@/providers'
import { AppLayout } from '@/layouts/app-layout'
import { ProfessionalLayout } from '@/layouts/professional-layout'
import { ClientLayout } from '@/layouts/client-layout'
import { AuthGuard } from '@/features/auth/guard'
import { PageLoader } from '@/components/ui/page-loader'
import { ReminderScheduler } from '@/components/reminder-scheduler'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ConvitePage = lazy(() => import('@/pages/ConvitePage'))
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
const AnalyticsPage = lazy(() =>
  import('@/features/analytics/pages/analytics-page').then((m) => ({
    default: m.AnalyticsPage,
  })),
)
const ClientesPage = lazy(() =>
  import('@/features/clientes/pages/clientes-page').then((m) => ({
    default: m.ClientesPage,
  })),
)
const ServicosPage = lazy(() =>
  import('@/features/servicos/pages/servicos-page').then((m) => ({
    default: m.ServicosPage,
  })),
)
const EquipePage = lazy(() =>
  import('@/features/equipe/pages/equipe-page').then((m) => ({
    default: m.EquipePage,
  })),
)
const ConfiguracoesPage = lazy(() =>
  import('@/features/configuracoes/pages/configuracoes-page').then((m) => ({
    default: m.ConfiguracoesPage,
  })),
)

const ProfessionalDashboard = lazy(() =>
  import('@/features/profissional/pages/dashboard').then((m) => ({
    default: m.ProfessionalDashboard,
  })),
)
const ProfessionalAgenda = lazy(() =>
  import('@/features/profissional/pages/agenda').then((m) => ({ default: m.ProfessionalAgenda })),
)
const ProfessionalAtendimentos = lazy(() =>
  import('@/features/profissional/pages/atendimentos').then((m) => ({
    default: m.ProfessionalAtendimentos,
  })),
)

const ClientDashboard = lazy(() =>
  import('@/features/cliente/pages/dashboard').then((m) => ({ default: m.ClientDashboard })),
)
const ClientAgendamentos = lazy(() =>
  import('@/features/cliente/pages/agendamentos').then((m) => ({ default: m.ClientAgendamentos })),
)
const ClientFidelidade = lazy(() =>
  import('@/features/cliente/pages/fidelidade').then((m) => ({ default: m.ClientFidelidade })),
)
const ClientPerfil = lazy(() =>
  import('@/features/cliente/pages/perfil').then((m) => ({ default: m.ClientPerfil })),
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
            <Route path="/convite" element={<ConvitePage />} />
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
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="clientes" element={<ClientesPage />} />
              <Route path="servicos" element={<ServicosPage />} />
              <Route path="equipe" element={<EquipePage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
            </Route>
            <Route
              path="/app/profissional"
              element={
                <AuthGuard role="profissional">
                  <ProfessionalLayout />
                </AuthGuard>
              }
            >
              <Route index element={<ProfessionalDashboard />} />
              <Route path="agenda" element={<ProfessionalAgenda />} />
              <Route path="atendimentos" element={<ProfessionalAtendimentos />} />
            </Route>
            <Route
              path="/portal"
              element={
                <AuthGuard role="cliente">
                  <ClientLayout />
                </AuthGuard>
              }
            >
              <Route index element={<ClientDashboard />} />
              <Route path="agendamentos" element={<ClientAgendamentos />} />
              <Route path="fidelidade" element={<ClientFidelidade />} />
              <Route path="perfil" element={<ClientPerfil />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  )
}
