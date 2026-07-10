import { Link } from 'react-router-dom'
import { heroAgenda } from '@/data/content'
import { trackCtaClick } from '@/lib/analytics'
import { safeLocalStorage } from '@/lib/storage'

export default function Hero() {
  const hasSession = !!safeLocalStorage.getItem('infinity_session')
  const ctaPath = hasSession ? '/app/agendamentos' : '/cadastro'

  function handleCta() {
    trackCtaClick('hero', 'geral')
  }

  return (
    <section className="hero-section" aria-label="StudioHub">
      <div className="hero-panel hero-panel--salao">
        <div
          className="hero-panel__bg"
          style={{ backgroundImage: "url('/hero-salao.png')" }}
          aria-hidden="true"
        />
        <div className="hero-panel__overlay" aria-hidden="true" />

        <div className="hero-panel__content">
          <span className="hero-panel__eyebrow">Para salões e barbearias</span>
          <h1 className="hero-panel__title">
            Transforme seu negócio em uma <br />
            máquina de agendamentos
          </h1>
          <p className="hero-panel__subtitle">
            Agenda online, confirmação no WhatsApp, pagamentos na hora e fidelização — feito para
            quem vive o dia a dia da beleza.
          </p>

          <ul className="hero-panel__pills">
            <li>Setup em 5 minutos</li>
            <li>Sem taxa de adesão</li>
            <li>Suporte em português</li>
          </ul>

          <div className="hero-panel__actions">
            <Link to={ctaPath} className="btn hero-panel__btn--salao btn--lg" onClick={handleCta}>
              Começar grátis
            </Link>
          </div>

          <p className="hero-panel__trust">Setup em 5 min · Sem cartão de crédito</p>
        </div>

        <div className="hero-mock hero-mock--salao" aria-hidden="true">
          <div className="hero-mock__header">
            <div className="hero-mock__dot-row">
              <span />
              <span />
              <span />
            </div>
            <span className="hero-mock__title">Agenda do dia</span>
          </div>
          <div className="hero-mock__date">{heroAgenda.date}</div>
          <ul className="hero-mock__list">
            {heroAgenda.appointments.map((apt) => (
              <li key={apt.time} className="hero-mock__item">
                <time className="hero-mock__time">{apt.time}</time>
                <div className="hero-mock__info">
                  <strong className="hero-mock__client">{apt.client}</strong>
                  <span className="hero-mock__service">{apt.service}</span>
                </div>
                <span className={`hero-mock__status hero-mock__status--${apt.status}`}>
                  {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                </span>
              </li>
            ))}
          </ul>
          <div className="hero-mock__stat">
            <span>Ocupação hoje</span>
            <strong className="hero-mock__revenue">{heroAgenda.stats.occupancy}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
