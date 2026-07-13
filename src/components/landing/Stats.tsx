import React from 'react'

interface Skill {
  name: string
  pct: number
  color: string
}

interface StatCard {
  icon: string
  label: string
  value: string
  sub: string
}

const SKILLS: Skill[] = [
  { name: 'Backend', pct: 85, color: 'bg-violet-500' },
  { name: 'Banco de Dados', pct: 80, color: 'bg-indigo-500' },
  { name: 'Arquitetura', pct: 75, color: 'bg-blue-500' },
  { name: 'Frontend', pct: 90, color: 'bg-emerald-500' },
  { name: 'Segurança', pct: 65, color: 'bg-amber-500' },
  { name: 'Observabilidade', pct: 60, color: 'bg-violet-400' },
  { name: 'DevOps / Infra', pct: 50, color: 'bg-indigo-400' },
  { name: 'Algoritmos', pct: 70, color: 'bg-blue-400' },
]

const STAT_CARDS: StatCard[] = [
  { icon: '🔥', label: 'Streak', value: '47', sub: 'Dias de código seguidos' },
  { icon: '🐛', label: 'Bugs Matados', value: '234', sub: 'Corrigidos em produção' },
  { icon: '📐', label: 'ADRs Escritos', value: '28', sub: 'Decisões arquiteturais' },
  { icon: '🔬', label: 'Post Mortems', value: '8', sub: 'Incidentes analisados' },
  { icon: '🏆', label: 'Desafios', value: '31', sub: 'Algoritmos distribuídos' },
  { icon: '💻', label: 'Tecnologias', value: '14', sub: 'Dominadas no ecossistema' },
]

export default function Stats() {
  return (
    <section id="stats" className="py-24 bg-[#09080D] text-white border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[11px] font-mono text-violet-400 font-semibold tracking-widest uppercase mb-3">
            Estatísticas do Lab
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Engineering Stats & RPG Score
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Gamificamos a evolução do projeto como um RPG de engenharia de software. Cada linha de
            código adiciona XP e molda nossas habilidades.
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Character RPG Sheet */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#0E0D13]/80 p-8 shadow-xl shadow-zinc-950/20 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-[40px] pointer-events-none" />

            {/* Level Card */}
            <div className="border-b border-zinc-800/80 pb-6 mb-6">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                Classe Principal
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Software Engineer
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  Nível 18
                </span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Progresso: 78% para Nível 19 (18.240 / 23.000 XP)
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 mt-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                  style={{ width: '78%' }}
                />
              </div>
            </div>

            {/* Skills Graph */}
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-4">
                Skill Leveling
              </span>

              <div className="space-y-3.5">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-400">{skill.name}</span>
                      <span className="text-zinc-200 font-semibold">{skill.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-900 border border-zinc-850 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${skill.color}`}
                        style={{ width: `${skill.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Project Achievements Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {STAT_CARDS.map((card) => (
              <div
                key={card.label}
                className="p-5 rounded-xl border border-zinc-800 bg-[#0E0D13]/40 hover:bg-[#0E0D13]/80 hover:border-zinc-700/60 transition-all text-left flex flex-col justify-between group shadow-sm"
              >
                <div className="text-2xl mb-4 group-hover:scale-110 transition-transform origin-left">
                  {card.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                    {card.label}
                  </span>
                  <strong className="text-3xl font-extrabold text-white tracking-tight">
                    {card.value}
                  </strong>
                  <p className="text-[10px] text-zinc-400 mt-1 font-mono leading-none">
                    {card.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Large Stats Highlights */}
            <div className="sm:col-span-2 md:col-span-3 p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 text-left flex flex-col sm:flex-row justify-between gap-6 sm:items-center">
              <div>
                <strong className="text-sm font-semibold text-zinc-300 block mb-1">
                  Desenvolvimento em Público
                </strong>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-md font-mono">
                  Histórico sincronizado com commits Git e decisões registradas em Markdown na
                  documentação do projeto.
                </p>
              </div>
              <div className="flex gap-8 border-t sm:border-t-0 sm:border-l border-zinc-900 pt-4 sm:pt-0 sm:pl-8 shrink-0 font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Commits</span>
                  <strong className="text-lg text-white">480+</strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Dias Totais</span>
                  <strong className="text-lg text-white">120+</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
