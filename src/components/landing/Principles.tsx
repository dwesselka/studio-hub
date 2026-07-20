import React from 'react'

interface Principle {
  title: string
  quote: string
  description: string
  icon: React.ReactNode
}

const PRINCIPLES: Principle[] = [
  {
    title: 'Pragmatismo',
    quote: 'Tecnologia resolve problemas, não tendências.',
    description:
      'Não escolhemos ferramentas pelo "hype". Cada tecnologia na nossa stack deve provar seu valor resolvendo um desafio real de negócio ou produtividade.',
    icon: (
      <svg
        className="w-5 h-5 text-violet-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: 'Trade-offs Reais',
    quote: 'Toda decisão possui trade-offs.',
    description:
      'Não existem balas de prata na engenharia. Para cada ganho em performance, há um custo de complexidade ou manutenção. Documentar esses trade-offs é o que diferencia juniores de seniores.',
    icon: (
      <svg
        className="w-5 h-5 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
        />
      </svg>
    ),
  },
  {
    title: 'Clareza Documentada',
    quote: 'Documentar é parte do desenvolvimento.',
    description:
      'Código que não é documentado eventualmente se torna legado incompreensível. Escrevemos ADRs (Architectural Decision Records) e mantemos guias vivos como parte essencial de cada pull request.',
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: 'Evolução Contínua',
    quote: 'Aprender faz parte da entrega.',
    description:
      'Codar é apenas metade do trabalho. Pesquisar novas abordagens, simular gargalos de latência e analisar logs é parte do nosso fluxo normal de entrega de software.',
    icon: (
      <svg
        className="w-5 h-5 text-violet-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
        />
      </svg>
    ),
  },
  {
    title: 'Base Empírica',
    quote: 'Contexto vence opinião.',
    description:
      'Evitamos discussões vazias de preferências pessoais. Decisões arquiteturais são tomadas com base em benchmarkings reais, análise de latência no Jaeger e volumetria do banco de dados.',
    icon: (
      <svg
        className="w-5 h-5 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
]

export default function Principles() {
  return (
    <section
      id="principles"
      className="py-24 bg-[#09080D] text-white border-t border-zinc-900 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[11px] font-mono text-violet-400 font-semibold tracking-widest uppercase mb-3">
            Filosofia de Trabalho
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Engineering Principles
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Desenvolver software robusto vai além de digitar código. Guiamos nossa engenharia por
            diretrizes que focam em clareza, sustentabilidade e performance.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-2xl border border-zinc-800 bg-[#0E0D13]/60 hover:bg-[#0E0D13]/90 hover:border-zinc-700/60 shadow-md transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-950/5 flex flex-col text-left group"
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors group-hover:border-violet-500/40">
                  {p.icon}
                </div>
                <strong className="text-base font-bold text-white tracking-tight">{p.title}</strong>
              </div>

              {/* Quote */}
              <span className="text-xs font-mono text-violet-300 font-semibold mb-3 border-l-2 border-violet-500/40 pl-3 leading-relaxed">
                "{p.quote}"
              </span>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-auto">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
