import { Link } from 'react-router-dom'
import { SITE } from '../../data/content'
import { trackCtaClick } from '../../lib/analytics'

export default function Header() {
  function handleCta() {
    trackCtaClick('header')
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          {SITE.name}
        </Link>
        <nav className="header__nav">
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
