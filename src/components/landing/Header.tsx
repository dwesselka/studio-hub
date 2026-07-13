import { Link } from 'react-router-dom'
import { SITE } from '@/data/content'
import { trackCtaClick } from '@/lib/analytics'

const Header: React.FC = () => {
  const handleCta = () => {
    trackCtaClick('header')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0A0F]/70 backdrop-blur-md border-b border-zinc-800/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/10">
            S
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight leading-none text-white">
              {SITE.name}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
              Lab
            </span>
          </span>
        </Link>

        {/* Classes for testing compatibility while keeping modern design */}
        <nav className="header__nav hidden md:flex items-center gap-8">
          <a
            href="#journey"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
          >
            Jornada
          </a>
          <a
            href="#principles"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
          >
            Princípios
          </a>
          <a
            href="#architecture"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
          >
            Arquitetura
          </a>
          <a
            href="#stats"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
          >
            Métricas
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium px-3 py-1.5"
          >
            Entrar
          </Link>
          <Link
            to={SITE.cadastroPath}
            className="bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-1.5 rounded-md text-sm font-semibold transition-all hover:scale-[1.02] shadow-sm shadow-white/5"
            onClick={handleCta}
          >
            Começar Jornada
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
