import { Link } from 'react-router-dom'
import { hero, SITE } from '../../data/content'
import { trackCtaClick } from '../../lib/analytics'

export default function Hero() {
  function handleCta() {
    trackCtaClick('hero')
  }

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__badge">Para salões, barbearias e clínicas</span>
          <h1 className="hero__title">{hero.title}</h1>
          <p className="hero__subtitle">{hero.subtitle}</p>
          <ul className="hero__highlights">
            {hero.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero__actions">
            <Link to={SITE.cadastroPath} className="btn btn--primary btn--lg" onClick={handleCta}>
              {SITE.ctaLabel}
            </Link>
            <a href="#planos" className="btn btn--outline btn--lg">
              Ver planos
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card">
            <div className="hero__card-header">
              <span className="hero__dot" />
              <span className="hero__dot" />
              <span className="hero__dot" />
            </div>
            <div className="hero__card-body">
              <div className="hero__stat">
                <strong>+32%</strong>
                <span>ocupação da agenda</span>
              </div>
              <div className="hero__stat">
                <strong>-40%</strong>
                <span>faltas de clientes</span>
              </div>
              <div className="hero__stat">
                <strong>5 min</strong>
                <span>para configurar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
