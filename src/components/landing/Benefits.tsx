import type { Benefit } from '@/data/content'
import { benefits } from '@/data/content'
import BenefitIcon from './BenefitIcon'

export default function Benefits() {
  return (
    <section id="beneficios" className="section benefits">
      <div className="container">
        <div className="section__header">
          <h2>Tudo que a cadeira, a recepção e o caixa precisam</h2>
          <p>
            Do primeiro agendamento ao pagamento — sem planilha, sem caderninho, sem dor de cabeça.
          </p>
        </div>
        <div className="benefits__grid">
          {benefits.map((item: Benefit) => (
            <article key={item.title} className="benefit-card">
              <BenefitIcon name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
