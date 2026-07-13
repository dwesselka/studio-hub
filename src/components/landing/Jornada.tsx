interface JournalItem {
  category: string
  title: string
  description: string
  meta: string
  icon: string
  color: string
}

const JOURNAL_ITEMS: JournalItem[] = [
  {
    category: 'Decisões',
    title: 'Escolhas documentadas por ADRs',
    description:
      'Nenhuma decisão de infra ou biblioteca é tomada no calor do momento. Cada ORM, banco ou modelo de autenticação é respaldado por Architectural Decision Records (ADRs) detalhados.',
    meta: '28 ADRs Documentados',
    icon: '📐',
    color: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
  },
  {
    category: 'Erros Reais',
    title: 'Incident #014: O Grande Índice',
    description:
      '3 horas de lentidão no banco PostgreSQL causadas por buscas textuais sem índices adequados. Solucionado via EXPLAIN ANALYZE, adicionando índices compostos no schema.',
    meta: '3h12 de investigação de incidentes',
    icon: '🚨',
    color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
  },
  {
    category: 'Aprendizados',
    title: 'Post Mortem PM-001',
    description:
      'Criamos relatórios de Post Mortem para rastrear falhas operacionais. A falha no index gerou novos testes de carga automáticos para prevenir lentidões futuras.',
    meta: '8 Relatórios Post Mortem',
    icon: '🔬',
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  },
  {
    category: 'Refatorações',
    title: 'Mock para Neon Database',
    description:
      'Evoluímos o projeto de um Mock Client síncrono local para conexões de produção reais no banco de dados na nuvem da Neon, estruturando middlewares de tratamento de erros e conexões robustas.',
    meta: 'Migração de arquitetura de persistência',
    icon: '⚗️',
    color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
  },
  {
    category: 'Evolução',
    title: 'Arquitetura com BFF & Caching',
    description:
      'Adicionamos um Backend For Frontend (BFF) com Hono para consolidar dados do dashboard e cache Redis para agilizar consultas críticas de agenda, diminuindo a carga geral de consultas no banco.',
    meta: 'Latência reduzida para < 25ms',
    icon: '🏗️',
    color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  },
]

export default function Jornada() {
  return (
    <section
      id="jornada"
      className="py-24 bg-[#0B0A0F] text-white border-t border-zinc-900 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[11px] font-mono text-violet-400 font-semibold tracking-widest uppercase mb-3">
            Build in Public
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Desenvolvido em Público
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Não escondemos o processo. Acreditamos que a engenharia de software real consiste em
            documentar os erros, compreender as falhas e evoluir a arquitetura continuamente.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Intro Card */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-[#0E0D13]/90 flex flex-col justify-between text-left lg:col-span-1 min-h-[250px]">
            <div>
              <span className="text-2xl mb-4 block">📢</span>
              <strong className="text-lg font-bold text-white tracking-tight block mb-3">
                Por que documentar tudo?
              </strong>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Todo desenvolvedor sabe que sistemas reais enfrentam falhas reais. Documentar as
                decisões e os erros do StudioHub cria um histórico transparente e serve como um
                verdadeiro laboratório vivo para novos engenheiros.
              </p>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 font-mono font-semibold flex items-center gap-1 mt-6"
            >
              Acompanhar no GitHub →
            </a>
          </div>

          {/* Journal Items */}
          {JOURNAL_ITEMS.map((item) => (
            <div
              key={item.title}
              className={`p-8 rounded-2xl border ${item.color} flex flex-col justify-between text-left min-h-[250px] transition-all hover:scale-[1.01] hover:bg-[#0E0D13]/30`}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-400">
                    {item.category}
                  </span>
                  <span className="text-xl">{item.icon}</span>
                </div>

                <strong className="text-base font-bold text-white tracking-tight block mb-3 leading-snug">
                  {item.title}
                </strong>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <span className="text-[10px] font-mono text-zinc-500 block mt-6 border-t border-zinc-900 pt-4">
                {item.meta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
