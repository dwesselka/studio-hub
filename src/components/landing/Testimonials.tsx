import type { Testimonial } from '@/data/content'
import { testimonials } from '@/data/content'

const segmentClass: Record<string, string> = {
  Salão: 'salao',
  Barbearia: 'barbearia',
}

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section__header">
          <h2>Quem usa, recomenda</h2>
          <p>Donos de salão e barbeiros que já organizaram a rotina e encherem a agenda.</p>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((item: Testimonial) => (
            <blockquote key={item.name} className="testimonial-card">
              <span
                className={`testimonial-card__segment testimonial-card__segment--${segmentClass[item.segment] ?? 'salao'}`}
              >
                {item.segment}
              </span>
              <p>"{item.quote}"</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
