import { Link } from 'react-router-dom'
import { heroAgenda, SITE } from '../../data/content'
import { trackCtaClick } from '../../lib/analytics'

export default function Hero() {
  function handleCta(segment) {
    trackCtaClick('hero', segment)
  }

  return (
    <section className="hero-split" aria-label="Infinity Partner para salões e barbearias">
      {/* ── SALÃO ─────────────────────────────────── */}
      <div className="hero-panel hero-panel--salao">
        <div
          className="hero-panel__bg"
          style={{ backgroundImage: "url('/hero-salao.png')" }}
          aria-hidden="true"
        />
        <div className="hero-panel__overlay" aria-hidden="true" />

        <div className="hero-panel__content">
          <span className="hero-panel__eyebrow">Para salões de beleza</span>
          <h1 className="hero-panel__title">
            Sua agenda cheia,<br />
            <em>sua equipe rendendo</em>
          </h1>
          <p className="hero-panel__subtitle">
            Agendamento online, lembretes no WhatsApp e comissão da equipe — tudo automatizado.
          </p>

          <ul className="hero-panel__pills">
            <li>Escova & coloração</li>
            <li>Comissão da equipe</li>
            <li>Manicure integrada</li>
          </ul>

          <div className="hero-panel__actions">
            <Link
              to={`${SITE.cadastroPath}?segmento=salao`}
              className="btn hero-panel__btn--salao btn--lg"
              onClick={() => handleCta('salao')}
            >
              Começar para Salão
            </Link>
          </div>

          <p className="hero-panel__trust">Setup em 5 min · Sem cartão de crédito</p>
        </div>

        {/* Mini mock agenda — Salão */}
        <div className="hero-mock hero-mock--salao" aria-hidden="true">
          <div className="hero-mock__header">
            <div className="hero-mock__dot-row">
              <span /><span /><span />
            </div>
            <span className="hero-mock__title">Agenda do dia</span>
          </div>
          <div className="hero-mock__date">{heroAgenda.date}</div>
          <ul className="hero-mock__list">
            {heroAgenda.appointments.slice(0, 2).map((apt) => (
              <li key={apt.time} className="hero-mock__item">
                <time className="hero-mock__time">{apt.time}</time>
                <div className="hero-mock__info">
                  <strong>{apt.client}</strong>
                  <span>{apt.service}</span>
                </div>
                <span className={`hero-mock__status hero-mock__status--${apt.status}`}>
                  {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                </span>
              </li>
            ))}
          </ul>
          <div className="hero-mock__stat">
            <span>Ocupação hoje</span>
            <strong>{heroAgenda.stats.occupancy}</strong>
          </div>
        </div>
      </div>

      {/* ── BARBEARIA ─────────────────────────────── */}
      <div className="hero-panel hero-panel--barber">
        <div
          className="hero-panel__bg"
          style={{ backgroundImage: "url('/hero-barbearia.png')" }}
          aria-hidden="true"
        />
        <div className="hero-panel__overlay hero-panel__overlay--dark" aria-hidden="true" />

        <div className="hero-panel__content">
          <span className="hero-panel__eyebrow hero-panel__eyebrow--gold">Para barbearias</span>
          <h1 className="hero-panel__title hero-panel__title--light">
            Fila zerada,<br />
            <em className="hero-panel__em--gold">caixa no positivo</em>
          </h1>
          <p className="hero-panel__subtitle hero-panel__subtitle--light">
            Controle de cadeiras, planos mensais e Pix na hora — sem papel, sem confusão.
          </p>

          <ul className="hero-panel__pills hero-panel__pills--dark">
            <li>Corte & barba</li>
            <li>Plano mensal</li>
            <li>Cadeiras em tempo real</li>
          </ul>

          <div className="hero-panel__actions">
            <Link
              to={`${SITE.cadastroPath}?segmento=barbearia`}
              className="btn hero-panel__btn--barber btn--lg"
              onClick={() => handleCta('barbearia')}
            >
              Começar para Barbearia
            </Link>
          </div>

          <p className="hero-panel__trust hero-panel__trust--light">Setup em 5 min · Sem taxa de adesão</p>
        </div>

        {/* Mini mock agenda — Barbearia */}
        <div className="hero-mock hero-mock--barber" aria-hidden="true">
          <div className="hero-mock__header hero-mock__header--dark">
            <div className="hero-mock__dot-row">
              <span /><span /><span />
            </div>
            <span className="hero-mock__title hero-mock__title--gold">Fila ao vivo</span>
          </div>
          <div className="hero-mock__date hero-mock__date--gold">{heroAgenda.date}</div>
          <ul className="hero-mock__list">
            {heroAgenda.appointments.map((apt) => (
              <li key={apt.time} className="hero-mock__item hero-mock__item--dark">
                <time className="hero-mock__time hero-mock__time--gold">{apt.time}</time>
                <div className="hero-mock__info">
                  <strong className="hero-mock__client--light">{apt.client}</strong>
                  <span className="hero-mock__service--muted">{apt.service}</span>
                </div>
                <span className={`hero-mock__status hero-mock__status--${apt.status}`}>
                  {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                </span>
              </li>
            ))}
          </ul>
          <div className="hero-mock__stat hero-mock__stat--dark">
            <span>Receita hoje</span>
            <strong className="hero-mock__revenue">{heroAgenda.stats.revenue}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
