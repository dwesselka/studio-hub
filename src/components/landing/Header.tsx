import { Link } from 'react-router-dom'
import { SITE } from '@/data/content'
import { trackCtaClick } from '@/lib/analytics'

interface HeaderProps {
  onLoginClick?: () => void
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const DOCS_URL = import.meta.env.VITE_DOCS_URL

  if (!DOCS_URL) {
    throw new Error('VITE_DOCS_URL não foi configurada.')
  }

  const handleCta = () => {
    trackCtaClick('header')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0A0F]/90 backdrop-blur-md border-b border-zinc-800/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">{SITE.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
          >
            Documentação
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
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={onLoginClick}
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Entrar
          </button>
          <Link
            to={SITE.cadastroPath}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-600/25"
            onClick={handleCta}
          >
            Começar
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
