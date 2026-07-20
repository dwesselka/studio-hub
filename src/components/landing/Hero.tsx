import { Link } from 'react-router-dom'
import { trackCtaClick } from '@/lib/analytics'
import { safeLocalStorage } from '@/lib/storage'

interface HeroProps {
  onLoginClick?: () => void
}

const features = [
  {
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
        />
      </svg>
    ),
    title: 'Arquitetura Limpa',
    description:
      'Explore uma arquitetura modular e escalável baseada em princípios sólidos e boas práticas.',
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Testes Automatizados',
    description:
      'Testes unitários, integração e end-to-end para garantir qualidade em cada etapa do desenvolvimento.',
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        />
      </svg>
    ),
    title: 'Deploy Contínuo',
    description: 'Pipelines automatizadas com CI/CD para entregas rápidas, seguras e confiáveis.',
  },
]
export default function Hero({ onLoginClick }: HeroProps) {
  const hasSession = !!safeLocalStorage.getItem('infinity_session')
  const ctaPath = hasSession ? '/app/agendamentos' : '/signup'

  function handleCta(ctaType: string) {
    trackCtaClick('hero', ctaType)
  }

  return (
    <section
      aria-label="StudioHub Hero"
      className="relative min-h-screen flex flex-col bg-[#0B0A0F] text-white overflow-hidden font-sans"
    >
      {/* Subtle background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 translate-x-1/3 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[150px]" />
      </div>

      {/* Main hero content — fills the viewport */}
      <div className="relative z-10 flex-1 flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-0">
          {/* ── Left: copy ── */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-500/30 bg-blue-500/8 mb-8">
              <svg
                className="w-3.5 h-3.5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span className="text-[11px] font-semibold text-blue-300 tracking-widest uppercase font-mono">
                Production-Ready
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-tight leading-[1.05] mb-5">
              Construa software.
              <br />
              <span className="font-bold text-4xl sm:text-5xl lg:text-[3rem] xl:text-[3.5rem] text-zinc-300">
                Evolua como engenheiro.
              </span>
            </h1>

            {/* Description */}
            <p className="text-[15px] text-zinc-400 max-w-lg leading-relaxed mb-10">
              O StudioHub é um laboratório vivo de engenharia de software. Explore padrões de
              arquitetura, boas práticas de banco de dados e testes end-to-end.
            </p>

            {/* CTA group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10">
              <Link
                to={ctaPath}
                id="hero-cta-btn"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-px active:translate-y-0"
                onClick={() => handleCta('comecar-gratuitamente')}
              >
                Começar Gratuitamente
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>

            {/* "Já tem conta?" */}
            <p className="text-sm text-zinc-500">
              Já tem conta?{' '}
              {onLoginClick ? (
                <button
                  id="hero-login-btn"
                  onClick={() => {
                    handleCta('entrar')
                    onLoginClick()
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Entrar
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  onClick={() => handleCta('entrar')}
                >
                  Entrar
                </Link>
              )}
            </p>
          </div>

          {/* ── Right: code panel ── */}
          <div className="w-full flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-xl border border-zinc-800/80 bg-[#0E0D13] shadow-2xl shadow-black/50 overflow-hidden font-mono text-[12px] leading-relaxed text-zinc-300">
              {/* Tab bar */}
              <div className="h-10 border-b border-zinc-800 bg-zinc-950/60 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/50 text-zinc-400 text-[10px]">
                  server.ts
                </div>
                <span className="text-zinc-600 text-[10px]">TypeScript</span>
              </div>

              {/* Code body */}
              <div className="p-5 overflow-x-auto text-left space-y-0.5">
                <CodeLine n={1}>
                  <span className="text-blue-400">const</span>{' '}
                  <span className="text-emerald-400">app</span>{' '}
                  <span className="text-zinc-300">=</span>{' '}
                  <span className="text-violet-400">createApplication</span>
                  <span className="text-zinc-300">();</span>
                </CodeLine>
                <CodeLine n={2}>{''}</CodeLine>
                <CodeLine n={3}>
                  <span className="text-emerald-400">app</span>
                  <span className="text-zinc-300">.</span>
                  <span className="text-blue-400">use</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-violet-400">Auth</span>
                  <span className="text-zinc-300">());</span>
                </CodeLine>
                <CodeLine n={4}>
                  <span className="text-emerald-400">app</span>
                  <span className="text-zinc-300">.</span>
                  <span className="text-blue-400">use</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-violet-400">RateLimiter</span>
                  <span className="text-zinc-300">());</span>
                </CodeLine>
                <CodeLine n={5}>
                  <span className="text-emerald-400">app</span>
                  <span className="text-zinc-300">.</span>
                  <span className="text-blue-400">use</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-violet-400">RequestLogger</span>
                  <span className="text-zinc-300">());</span>
                </CodeLine>
                <CodeLine n={6}>{''}</CodeLine>
                <CodeLine n={7}>
                  <span className="text-violet-400">await</span>{' '}
                  <span className="text-emerald-400">Database</span>
                  <span className="text-zinc-300">.</span>
                  <span className="text-blue-400">connect</span>
                  <span className="text-zinc-300">();</span>
                </CodeLine>
                <CodeLine n={8}>
                  <span className="text-violet-400">await</span>{' '}
                  <span className="text-emerald-400">Cache</span>
                  <span className="text-zinc-300">.</span>
                  <span className="text-blue-400">connect</span>
                  <span className="text-zinc-300">();</span>
                </CodeLine>
                <CodeLine n={9}>{''}</CodeLine>
                <CodeLine n={10}>
                  <span className="text-emerald-400">app</span>
                  <span className="text-zinc-300">.</span>
                  <span className="text-blue-400">listen</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-amber-400">3000</span>
                  <span className="text-zinc-300">);</span>
                </CodeLine>
                <CodeLine n={11}>{''}</CodeLine>
                <CodeLine n={12}>
                  <span className="text-zinc-500">// ✓ PostgreSQL connected</span>
                </CodeLine>
                <CodeLine n={13}>
                  <span className="text-zinc-500">// ✓ Redis connected</span>
                </CodeLine>
                <CodeLine n={14}>
                  <span className="text-zinc-500">// ✓ OpenTelemetry enabled</span>
                </CodeLine>
                <CodeLine n={15}>
                  <span className="text-zinc-500">// ✓ Health checks passing</span>
                </CodeLine>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-10 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-5 py-4 hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-blue-500/20 bg-blue-500/8 flex items-center justify-center mt-0.5">
                {f.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Helper: line with line number gutter
function CodeLine({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="select-none text-zinc-700 w-4 text-right flex-shrink-0">{n}</span>
      <span className="flex-1">{children}</span>
    </div>
  )
}
