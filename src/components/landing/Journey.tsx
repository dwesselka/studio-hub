import { useState } from 'react'

interface JourneyStep {
  title: string
  sprint: string
  description: string
  status: 'done' | 'active' | 'planned'
  techs: string[]
  details: string
  docLink?: string
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: 'Autenticação & RBAC',
    sprint: 'Sprint 01 — Fundação',
    description: 'Sistema seguro de autenticação com controle de acesso baseado em roles (RBAC).',
    status: 'done',
    techs: ['JWT', 'Prisma ORM', 'RBAC', 'PostgreSQL'],
    details:
      'Implementação de autenticação stateless via JSON Web Tokens e controle hierárquico de acessos (Lojista, Profissional, Cliente) diretamente integrados via middlewares baseados em Hono.',
    docLink: '/docs/perfis-acesso',
  },
  {
    title: 'Onboarding Dinâmico',
    sprint: 'Sprint 01 — Fundação',
    description: 'Fluxo adaptativo para coleta de dados de negócio e configurações iniciais.',
    status: 'done',
    techs: ['Zod Validation', 'React Router', 'Prisma'],
    details:
      'Configuração guiada de horários de funcionamento, cadastro rápido de equipe e precificação inteligente baseada no segmento de negócio.',
    docLink: '/docs/onboarding',
  },
  {
    title: 'BFF & Cache Layer',
    sprint: 'Sprint 02 — Performance',
    description: 'Camada intermediária BFF e cache Redis para otimização de requisições pesadas.',
    status: 'active',
    techs: ['Redis', 'BFF Pattern', 'API Gateway'],
    details:
      'Estruturação do padrão Backend For Frontend para unificar dados e aplicação de cache in-memory agressivo com expiração em tempo real, reduzindo latência do painel principal em 3.2x.',
    docLink: '/docs/migracao-mock-neon',
  },
  {
    title: 'Observabilidade & Logs',
    sprint: 'Sprint 03 — Operação',
    description: 'Monitoramento detalhado da integridade e latência das APIs em tempo real.',
    status: 'planned',
    techs: ['OpenTelemetry', 'Prometheus', 'Grafana', 'Jaeger'],
    details:
      'Coleta distribuída de métricas da aplicação com tracing estruturado para rastrear gargalos em consultas de banco de dados e controle preventivo de recursos de infraestrutura.',
    docLink: '/docs/observabilidade',
  },
  {
    title: 'Geolocalização Espacial',
    sprint: 'Sprint 04 — Geolocalização',
    description: 'Busca por proximidade geográfica de estúdios e profissionais.',
    status: 'planned',
    techs: ['PostGIS', 'Google Maps API', 'Spatial Query'],
    details:
      'Fase ativa de modelagem. Substituição do cálculo Haversine puro por extensões nativas de geometria do PostgreSQL (PostGIS) visando melhor indexação de geolocalização e performance de escala.',
    docLink: '/docs/geolocalizacao',
  },
  {
    title: 'Notificações & Background Jobs',
    sprint: 'Sprint 05 — Notificações',
    description: 'Filas assíncronas para envio de lembretes e confirmações.',
    status: 'planned',
    techs: ['FCM (Firebase)', 'Bull Queue', 'Redis', 'Node Workers'],
    details:
      'Fila distribuída de tarefas em background para escalonamento automático de alertas preventivos do WhatsApp e notificações push no mobile.',
    docLink: '/docs/roadmaps',
  },
  {
    title: 'Checkout & Webhooks',
    sprint: 'Sprint 06 — Monetização',
    description: 'Integração completa com Stripe para cobrança recorrente e planos.',
    status: 'planned',
    techs: ['Stripe SDK', 'Webhooks Signature', 'Idempotência'],
    details:
      'Gateway de pagamento integrado com tratamento rigoroso de webhooks usando cabeçalhos assinados e mecanismos de idempotência para evitar duplicidade de transações.',
    docLink: '/docs/checkout',
  },
  {
    title: 'Multi-tenancy Físico',
    sprint: 'Sprint 07 — Escala',
    description: 'Isolamento completo e segurança de dados do inquilino a nível físico.',
    status: 'planned',
    techs: ['PostgreSQL Schema Isolation', 'Tenant Router'],
    details:
      'Substituição do isolamento lógico simples (tenant_id) por isolamento físico real baseado em múltiplos esquemas do PostgreSQL, garantindo máxima privacidade.',
    docLink: '/docs/multi-tenancy',
  },
]

export default function Journey() {
  const [selectedIdx, setSelectedIdx] = useState<number>(4) // default to active task (Geolocalização)

  const activeStep = JOURNEY_STEPS[selectedIdx]

  return (
    <section
      id="journey"
      className="py-24 bg-[#0B0A0F] text-white border-t border-zinc-900 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[11px] font-mono text-violet-400 font-semibold tracking-widest uppercase mb-3">
            Evolução Cronológica
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Engineering Journey
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Acompanhe o roadmap de implementação prática. Cada etapa representa um marco de
            arquitetura implementado de forma pública e transparente.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Timeline side (left) */}
          <div className="lg:col-span-6 relative pl-6 border-l border-zinc-800/80 space-y-4">
            {JOURNEY_STEPS.map((step, idx) => {
              const isSelected = selectedIdx === idx
              const isDone = step.status === 'done'
              const isActive = step.status === 'active'

              return (
                <button
                  key={step.title}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all relative flex items-start justify-between gap-4 group ${
                    isSelected
                      ? 'bg-zinc-900/60 border-zinc-700/80 shadow-md shadow-violet-950/5'
                      : 'bg-transparent border-transparent hover:bg-zinc-900/30'
                  }`}
                >
                  {/* Indicator Dot */}
                  <span
                    className={`absolute left-[-29px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20'
                        : isActive
                          ? 'bg-violet-500 border-violet-400 animate-pulse shadow-lg shadow-violet-500/20'
                          : 'bg-zinc-800 border-zinc-700'
                    }`}
                  />

                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                      {step.sprint}
                    </span>
                    <strong
                      className={`text-sm font-semibold transition-colors ${
                        isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                      }`}
                    >
                      {step.title}
                    </strong>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{step.description}</p>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 uppercase tracking-wider font-semibold border ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : isActive
                          ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isDone ? '✔ OK' : isActive ? '🔄 Dev' : '🔒 lock'}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Details side (right) */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="rounded-2xl border border-zinc-800/80 bg-[#0E0D13]/80 p-8 shadow-xl shadow-zinc-950/20 backdrop-blur-sm relative overflow-hidden text-left">
              {/* Subtle background pattern */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/5 rounded-full blur-[60px]" />

              <span className="text-[10px] font-mono text-violet-400 font-semibold tracking-wider block mb-2 uppercase">
                {activeStep.sprint}
              </span>

              <h3 className="text-xl font-bold mb-4 text-white">{activeStep.title}</h3>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-mono">
                {activeStep.details}
              </p>

              {/* Technologies */}
              <div className="mb-8">
                <span className="text-[10px] font-mono text-zinc-500 block mb-2.5 uppercase font-semibold">
                  Módulos e Tecnologias
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStep.techs.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-900">
                <a
                  href={activeStep.docLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  Abrir Documentação
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>

                <span className="text-[11px] font-mono text-zinc-500">
                  Status:{' '}
                  {activeStep.status === 'done'
                    ? 'Auditado em produção'
                    : activeStep.status === 'active'
                      ? 'Execução ativa'
                      : 'Planejado no Backlog'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
