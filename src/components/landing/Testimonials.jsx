import { testimonials } from '../../data/content'

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section__header">
          <h2>Quem usa, recomenda</h2>
          <p>Parceiros de diferentes segmentos já transformaram sua gestão.</p>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="testimonial-card">
              <span className="testimonial-card__segment">{item.segment}</span>
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
