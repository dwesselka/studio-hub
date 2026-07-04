import { Link } from 'react-router-dom'
import { SITE } from '@/data/content'
import { trackCtaClick } from '@/lib/analytics'

const Header: React.FC = () => {
  const handleCta = () => {
    trackCtaClick('header')
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="8" cy="24" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M26 6 12 18M26 26 12 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="header__logo-text">
            <strong>{SITE.name}</strong>
            <small>Beleza &amp; grooming</small>
          </span>
        </Link>
        <nav className="header__nav">
          <a href="#segmentos">Segmentos</a>
          <a href="#beneficios">Benefícios</a>
          <a href="#planos">Planos</a>
          <a href="#faq">FAQ</a>
        </nav>
        <Link to={SITE.cadastroPath} className="btn btn--primary btn--sm" onClick={handleCta}>
          {SITE.ctaLabel}
        </Link>
      </div>
    </header>
  )
}

export default Header
