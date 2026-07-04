import { Link } from 'react-router-dom'
import { SITE } from '@/data/content'
import { trackCtaClick } from '@/lib/analytics'

export default function CTA() {
  function handleCta() {
    trackCtaClick('footer-cta')
  }

  return (
    <section className="section cta-banner">
      <div className="container cta-banner__inner">
        <div>
          <h2>Pronto para transformar seu negócio?</h2>
          <p>Cadastro gratuito em 5 minutos. Sem cartão de crédito.</p>
        </div>
        <Link to={SITE.cadastroPath} className="btn btn--white btn--lg" onClick={handleCta}>
          {SITE.ctaLabel}
        </Link>
      </div>
    </section>
  )
}
