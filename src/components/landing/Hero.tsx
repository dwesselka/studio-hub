import { Link } from 'react-router-dom'
import { trackCtaClick } from '@/lib/analytics'
import { safeLocalStorage } from '@/lib/storage'

export default function Hero() {
  const hasSession = !!safeLocalStorage.getItem('infinity_session')
  const ctaPath = hasSession ? '/app/agendamentos' : '/cadastro'

  function handleCta(ctaType: string) {
    trackCtaClick('hero', ctaType)
  }

  return (
    <section
      aria-label="StudioHub"
      className="relative min-h-screen pt-32 pb-24 bg-[#0B0A0F] text-white flex items-center overflow-hidden font-sans"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* Text content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/5 mb-6 hover:bg-violet-500/10 transition-colors pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[11px] font-mono text-violet-300 font-semibold tracking-wider uppercase">
              Production-Grade Sandbox v1.0
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Construa software. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-indigo-400">
              Evolua como engenheiro.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            O StudioHub é um laboratório vivo de engenharia de software disfarçado de SaaS para
            agendamentos. Explore padrões de arquitetura de alta performance, boas práticas de banco
            de dados e testes end-to-end em uma aplicação real que opera em produção.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Link
              to={ctaPath}
              className="bg-white hover:bg-zinc-200 text-zinc-950 px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-white/5 flex items-center justify-center gap-2"
              onClick={() => handleCta('comecar-jornada')}
            >
              Começar Jornada
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

            <Link
              to="/login"
              className="border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
              onClick={() => handleCta('entrar')}
            >
              Entrar no App
            </Link>

            <a
              href="https://studiohub.com.br/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium flex items-center justify-center gap-1 py-3 px-2"
              onClick={() => handleCta('docs')}
            >
              Documentação
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
          </div>

          <div className="flex items-center gap-6 mt-12 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">✔</span> Zero lock-in
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">✔</span> Open Source
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">✔</span> Produção real
            </div>
          </div>
        </div>

        {/* Visual Terminal / Code Panel Mockup */}
        <div className="lg:col-span-5 w-full flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#0E0D13]/90 shadow-2xl shadow-violet-950/20 overflow-hidden font-mono text-[11px] leading-relaxed text-zinc-300">
            {/* Header / Tabs */}
            <div className="h-10 border-b border-zinc-800/80 bg-zinc-950/50 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0E0D13] border border-zinc-800/50 text-zinc-400 font-mono text-[10px]">
                <span className="text-violet-400">⚡</span> index.ts
              </div>
              <div className="text-zinc-600 text-xs font-mono">TypeScript</div>
            </div>

            {/* Code Body */}
            <div className="p-5 overflow-x-auto text-left font-mono">
              <div className="text-zinc-500 mb-1">// Initialize server router & middleware</div>
              <div>
                <span className="text-violet-400">const</span> app ={' '}
                <span className="text-blue-400">new</span>{' '}
                <span className="text-emerald-400">Hono</span>()
              </div>
              <div className="mt-1">
                app.<span className="text-blue-400">use</span>(
                <span className="text-amber-300">'/*'</span>,{' '}
                <span className="text-indigo-300">cors</span>())
              </div>
              <div className="mt-1">
                app.<span className="text-blue-400">use</span>(
                <span className="text-amber-300">'/v1/*'</span>,{' '}
                <span className="text-indigo-300">rateLimit</span>(&#123;{' '}
                <span className="text-zinc-400">maxRequests:</span>{' '}
                <span className="text-emerald-400">120</span> &#125;))
              </div>

              <div className="text-zinc-500 mt-4 mb-1">// Lazy init production pg adapter</div>
              <div>
                <span className="text-violet-400">const</span> adapter ={' '}
                <span className="text-blue-400">new</span>{' '}
                <span className="text-emerald-400">PrismaPg</span>(&#123;{' '}
                <span className="text-zinc-400">connectionString</span> &#125;)
              </div>
              <div className="mt-1">
                <span className="text-violet-400">const</span> prisma ={' '}
                <span className="text-blue-400">new</span>{' '}
                <span className="text-emerald-400">PrismaClient</span>(&#123;{' '}
                <span className="text-zinc-400">adapter</span> &#125;)
              </div>

              {/* Terminal Logs Simulation */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <div className="text-zinc-500 font-sans text-[10px] uppercase font-semibold tracking-wider mb-2">
                  System logs
                </div>
                <div className="flex gap-2 text-zinc-400">
                  <span className="text-emerald-400">info</span>
                  <span>- Database migration: public.User applied successfully.</span>
                </div>
                <div className="flex gap-2 text-zinc-400 mt-1">
                  <span className="text-emerald-400">info</span>
                  <span>- Hono server initialized on port 3001.</span>
                </div>
                <div className="flex gap-2 text-zinc-400 mt-1">
                  <span className="text-violet-400">redis</span>
                  <span>- Cache storage active (ping: 1.2ms).</span>
                </div>
                <div className="flex gap-2 text-zinc-400 mt-1">
                  <span className="text-indigo-400">otel</span>
                  <span>- Prometheus scraper connected.</span>
                </div>
                <div className="flex gap-2 text-emerald-400 mt-2 font-semibold">
                  <span>✔</span>
                  <span>All 12 backend integration tests passed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
