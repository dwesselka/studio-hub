import type { Segment } from '@/data/content'
import { segments } from '@/data/content'

export default function Segments() {
  return (
    <section id="segmentos" className="section segments">
      <div className="container">
        <div className="section__header">
          <h2>Feito para o seu tipo de negócio</h2>
          <p>
            Cada segmento chega com serviços, horários e configurações pré-montados — é só ajustar
            ao seu salão ou barbearia.
          </p>
        </div>
        <div className="segments__grid">
          {segments.map((segment: Segment) => (
            <article key={segment.id} className={`segment-card segment-card--${segment.accent}`}>
              <h3>{segment.label}</h3>
              <p>{segment.description}</p>
              <ul className="segment-card__services">
                {segment.services.map((service: string) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
