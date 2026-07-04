import { Link } from 'react-router-dom'
import type { Plan } from '@/data/content'
import { plans, SITE } from '@/data/content'
import { trackCtaClick } from '@/lib/analytics'

export default function Plans() {
  function handleCta(plan: string) {
    trackCtaClick('plans', plan)
  }

  return (
    <section id="planos" className="section plans">
      <div className="container">
        <div className="section__header">
          <h2>Planos para cada momento</h2>
          <p>Comece grátis e evolua conforme seu negócio cresce. Sem taxa de adesão.</p>
        </div>
        <div className="plans__grid">
          {plans.map((plan: Plan) => (
            <article
              key={plan.id}
              className={`plan-card${plan.highlighted ? ' plan-card--highlighted' : ''}`}
            >
              {plan.highlighted && <span className="plan-card__badge">Mais popular</span>}
              <h3>{plan.name}</h3>
              <div className="plan-card__price">
                <span className="plan-card__amount">{plan.price}</span>
                <span className="plan-card__period">{plan.period}</span>
              </div>
              <p className="plan-card__description">{plan.description}</p>
              <ul className="plan-card__features">
                {plan.features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                to={`${SITE.cadastroPath}?plano=${plan.id}`}
                className={`btn ${plan.highlighted ? 'btn--primary' : 'btn--outline'} btn--block`}
                onClick={() => handleCta(plan.id)}
              >
                Escolher {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
