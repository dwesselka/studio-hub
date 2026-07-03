import { benefits } from '../../data/content'

export default function Benefits() {
  return (
    <section id="beneficios" className="section benefits">
      <div className="container">
        <div className="section__header">
          <h2>Tudo que seu negócio precisa</h2>
          <p>Ferramentas pensadas para o dia a dia de salões, barbearias e clínicas de beleza.</p>
        </div>
        <div className="benefits__grid">
          {benefits.map((item) => (
            <article key={item.title} className="benefit-card">
              <span className="benefit-card__icon" aria-hidden="true">
                {item.icon}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
