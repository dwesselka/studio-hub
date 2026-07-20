import React from 'react'

interface Tech {
  name: string
  purpose: string
  details: string
  icon: React.ReactNode
}

const TECHS: Tech[] = [
  {
    name: 'React',
    purpose: 'Interface Declarativa & SPA',
    details:
      'Utilizado para criar uma interface de usuário responsiva, rica e componentizada, garantindo transições de páginas sem recarregamento e gerenciamento de estado previsível com React Query.',
    icon: (
      <svg
        className="w-6 h-6 text-[#61DAFB]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 38.3C52.7 38.3 54.9 36.1 54.9 33.3C54.9 30.6 52.7 28.4 50 28.4C47.3 28.4 45.1 30.6 45.1 33.3C45.1 36.1 47.3 38.3 50 38.3Z"
          fill="currentColor"
        />
        <path
          d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0ZM50 83.3C31.6 83.3 16.7 68.4 16.7 50C16.7 31.6 31.6 16.7 50 16.7C68.4 16.7 83.3 31.6 83.3 50C83.3 68.4 68.4 83.3 50 83.3Z"
          fill="currentColor"
          opacity="0.1"
        />
        <path
          d="M83.4 39.4C82.1 34.6 77.3 31.3 71.7 31.3C70.6 31.3 69.5 31.5 68.4 31.8C65.5 25.5 59.8 21.2 52.9 21.2C52 21.2 51 21.3 50 21.5C49 21.3 48 21.2 47.1 21.2C40.2 21.2 34.5 25.5 31.6 31.8C30.5 31.5 29.4 31.3 28.3 31.3C22.7 31.3 17.9 34.6 16.6 39.4C12.8 42.6 10.4 47.1 10.4 52.1C10.4 57.1 12.8 61.6 16.6 64.8C17.9 69.6 22.7 72.9 28.3 72.9C29.4 72.9 30.5 72.7 31.6 72.4C34.5 78.7 40.2 83 47.1 83C48 83 49 82.9 50 82.7C51 82.9 52 83 52.9 83C59.8 83 65.5 78.7 68.4 72.4C69.5 72.7 70.6 72.9 71.7 72.9C77.3 72.9 82.1 69.6 83.4 64.8C87.2 61.6 89.6 57.1 89.6 52.1C89.6 47.1 87.2 42.6 83.4 39.4ZM50 63.3C43.8 63.3 38.8 58.3 38.8 52.1C38.8 45.9 43.8 40.9 50 40.9C56.2 40.9 61.2 45.9 61.2 52.1C61.2 58.3 56.2 63.3 50 63.3Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'Vite',
    purpose: 'Bundler Rápido & HMR',
    details:
      'Gerencia o build da aplicação frontend com Hot Module Replacement extremamente rápido e bundling otimizado de assets estáticos em produção.',
    icon: (
      <svg
        className="w-6 h-6 text-[#646CFF]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M84.7 17.5L50 82.5L15.3 17.5H84.7Z" fill="currentColor" opacity="0.1" />
        <path d="M84.7 17.5L50 82.5L50 17.5H84.7Z" fill="currentColor" opacity="0.2" />
        <path
          d="M50 3L87.5 20V57L50 97L12.5 57V20L50 3Z"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M50 20L75 35L50 82.5L25 35L50 20Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    purpose: 'Segurança Estática & Tipagem',
    details:
      'Tipagem forte em todo o fluxo de dados do frontend ao backend, prevenindo bugs de runtime e garantindo contratos de API consistentes com DTOs seguros.',
    icon: (
      <svg
        className="w-6 h-6 text-[#3178C6]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" rx="16" fill="currentColor" opacity="0.1" />
        <rect width="100" height="100" rx="16" stroke="currentColor" strokeWidth="6" />
        <path d="M35 30H65V38H54V75H46V38H35V30Z" fill="currentColor" />
        <path
          d="M72 58C68 58 65 60 65 64C65 68 72 69 72 72C72 74 69 75 66 75C62 75 60 73 59 70L53 74C56 79 60 81 66 81C73 81 78 77 78 72C78 66 71 65 71 62C71 60 73 59 76 59C79 59 81 61 82 63L88 59C86 54 81 52 76 52C72 52 72 58 72 58Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'Prisma ORM',
    purpose: 'Modelagem & Migrations',
    details:
      'ORM nativo de tipos seguros que atua como ponte para o banco de dados relacional. Facilita consultas otimizadas e controle rigoroso do histórico de migrations.',
    icon: (
      <svg
        className="w-6 h-6 text-[#5A67D8]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 5L90 28.1V74.4L50 97.5L10 74.4V28.1L50 5Z"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M50 15L80 32.3V67.7L50 85L20 67.7V32.3L50 15Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path d="M50 32L70 43.5V66.5L50 78L30 66.5V43.5L50 32Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'PostgreSQL',
    purpose: 'Banco de Dados ACID Principal',
    details:
      'Banco de dados relacional que hospeda os dados com transações estritas. Utiliza índices otimizados e extensões avançadas (como PostGIS) para filtros complexos.',
    icon: (
      <svg
        className="w-6 h-6 text-[#4169E1]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 5C25.1 5 5 25.1 5 50C5 74.9 25.1 95 50 95C74.9 95 95 74.9 95 50C95 25.1 74.9 5 50 5Z"
          fill="currentColor"
          opacity="0.1"
        />
        <path
          d="M50 5C25.1 5 5 25.1 5 50C5 74.9 25.1 95 50 95C74.9 95 95 74.9 95 50C95 25.1 74.9 5 50 5Z"
          stroke="currentColor"
          strokeWidth="6"
        />
        <path
          d="M30 35C30 30 35 25 45 25C58 25 70 32 70 45C70 58 58 70 45 70C35 70 30 65 30 60V35Z"
          fill="currentColor"
        />
        <path d="M45 42.5H62.5V47.5H45V42.5Z" fill="currentColor" className="text-[#0B0A0F]" />
      </svg>
    ),
  },
  {
    name: 'JWT',
    purpose: 'Autenticação Stateless',
    details:
      'Tokens assinados criptograficamente utilizados para autenticação segura e stateless nas rotas HTTP do servidor Hono, garantindo isolamento de sessão.',
    icon: (
      <svg
        className="w-6 h-6 text-[#D63AFF]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 10L90 30V70L50 90L10 70V30L50 10Z" fill="currentColor" opacity="0.1" />
        <path
          d="M50 10L90 30V70L50 90L10 70V30L50 10Z"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="15" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Docker',
    purpose: 'Ambiente de Container Isolado',
    details:
      'Garante que todo o ambiente de desenvolvimento local (como banco PostgreSQL, Redis e instâncias Node) seja idêntico ao ambiente de produção.',
    icon: (
      <svg
        className="w-6 h-6 text-[#2496ED]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="15" y="45" width="20" height="20" rx="4" fill="currentColor" />
        <rect x="40" y="45" width="20" height="20" rx="4" fill="currentColor" />
        <rect x="65" y="45" width="20" height="20" rx="4" fill="currentColor" />
        <rect x="40" y="20" width="20" height="20" rx="4" fill="currentColor" opacity="0.6" />
        <path
          d="M5 75C25 75 35 85 50 85C65 85 75 75 95 75"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: 'Node / Hono',
    purpose: 'Servidor HTTP Otimizado',
    details:
      'Runtime assíncrono rodando Hono.js. Fornece uma API REST rápida para processar agendamentos, com middlewares de validação Zod e segurança nativa.',
    icon: (
      <svg
        className="w-6 h-6 text-[#339933]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 5L90 28V72L50 95L10 72V28L50 5Z" fill="currentColor" opacity="0.1" />
        <path
          d="M50 5L90 28V72L50 95L10 72V28L50 5Z"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M30 45C30 35 38 30 50 30C62 30 70 35 70 45C70 55 62 60 50 60C38 60 30 55 30 45Z"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
    ),
  },
]

export default function Architecture() {
  return (
    <section
      id="architecture"
      className="py-24 bg-[#0B0A0F] text-white border-t border-zinc-900 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[11px] font-mono text-violet-400 font-semibold tracking-widest uppercase mb-3">
            Infraestrutura & Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Production-Grade Architecture
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Exibimos apenas as tecnologias efetivamente integradas ao sistema. Sem artifícios ou
            termos vagos: cada módulo tem um propósito documentado.
          </p>
        </div>

        {/* Techs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TECHS.map((tech) => (
            <div
              key={tech.name}
              className="p-6 rounded-2xl border border-zinc-850 bg-[#0E0D13]/50 hover:bg-[#0E0D13]/80 hover:border-zinc-800 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                {/* Tech logo & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-center transition-colors group-hover:border-zinc-700">
                    {tech.icon}
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-sm font-bold text-white tracking-tight leading-none mb-1">
                      {tech.name}
                    </strong>
                    <span className="text-[10px] text-zinc-500 font-mono">{tech.purpose}</span>
                  </div>
                </div>

                {/* Details */}
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{tech.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
