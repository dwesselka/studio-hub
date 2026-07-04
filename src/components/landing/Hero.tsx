import { useState } from 'react'
import { Link } from 'react-router-dom'
import { heroAgenda, SITE } from '@/data/content'
import { trackCtaClick } from '@/lib/analytics'
import { safeLocalStorage } from '@/lib/storage'

interface SegmentConfig {
  id: string
  label: string
  eyebrow: string
  title: string
  subtitle: string
  pills: string[]
  btnClass: string
  btnLabel: string
  mockTitle: string
  mockStatsLabel: string
  mockStatsValue: string
  image: string
  panelClass: string
  overlayClass: string
  titleClass: string
  subtitleClass: string
  pillsClass: string
  eyebrowClass: string
  trustClass: string
  mockClass: string
  mockHeaderClass: string
  mockTitleClass: string
  mockDateClass: string
  mockItemClass: string
  mockTimeClass: string
  mockClientClass: string
  mockServiceClass: string
  mockStatsClass: string
  mockRevenueClass: string
}

const SEGMENTS: SegmentConfig[] = [
  {
    id: 'salao',
    label: 'Salão de Beleza',
    eyebrow: 'Para salões de beleza',
    title: 'Sua agenda cheia, sua equipe rendendo',
    subtitle:
      'Agendamento online, lembretes no WhatsApp e comissão da equipe — tudo automatizado.',
    pills: ['Escova & coloração', 'Comissão da equipe', 'Manicure integrada'],
    btnClass: 'hero-panel__btn--salao',
    btnLabel: 'Começar para Salão',
    mockTitle: 'Agenda do dia',
    mockStatsLabel: 'Ocupação hoje',
    mockStatsValue: heroAgenda.stats.occupancy,
    image: '/hero-salao.png',
    panelClass: 'hero-panel--salao',
    overlayClass: '',
    titleClass: '',
    subtitleClass: '',
    pillsClass: '',
    eyebrowClass: '',
    trustClass: '',
    mockClass: 'hero-mock--salao',
    mockHeaderClass: '',
    mockTitleClass: '',
    mockDateClass: '',
    mockItemClass: '',
    mockTimeClass: '',
    mockClientClass: '',
    mockServiceClass: '',
    mockStatsClass: '',
    mockRevenueClass: '',
  },
  {
    id: 'barbearia',
    label: 'Barbearia',
    eyebrow: 'Para barbearias',
    title: 'Fila zerada, caixa no positivo',
    subtitle: 'Controle de cadeiras, planos mensais e Pix na hora — sem papel, sem confusão.',
    pills: ['Corte & barba', 'Plano mensal', 'Cadeiras em tempo real'],
    btnClass: 'hero-panel__btn--barber',
    btnLabel: 'Começar para Barbearia',
    mockTitle: 'Fila ao vivo',
    mockStatsLabel: 'Receita hoje',
    mockStatsValue: heroAgenda.stats.revenue,
    image: '/hero-barbearia.png',
    panelClass: 'hero-panel--barber',
    overlayClass: 'hero-panel__overlay--dark',
    titleClass: 'hero-panel__title--light',
    subtitleClass: 'hero-panel__subtitle--light',
    pillsClass: 'hero-panel__pills--dark',
    eyebrowClass: 'hero-panel__eyebrow--gold',
    trustClass: 'hero-panel__trust--light',
    mockClass: 'hero-mock--barber',
    mockHeaderClass: 'hero-mock__header--dark',
    mockTitleClass: 'hero-mock__title--gold',
    mockDateClass: 'hero-mock__date--gold',
    mockItemClass: 'hero-mock__item--dark',
    mockTimeClass: 'hero-mock__time--gold',
    mockClientClass: 'hero-mock__client--light',
    mockServiceClass: 'hero-mock__service--muted',
    mockStatsClass: 'hero-mock__stat--dark',
    mockRevenueClass: 'hero-mock__revenue',
  },
]

export default function Hero() {
  const [segment, setSegment] = useState('salao')
  const current = SEGMENTS.find((s) => s.id === segment) ?? SEGMENTS[0]

  const hasSession = !!safeLocalStorage.getItem('infinity_session')
  const ctaPath = hasSession ? '/app/agendamentos' : `${SITE.cadastroPath}?segmento=${segment}`

  function handleCta() {
    trackCtaClick('hero', segment)
  }

  return (
    <section className="hero-section" aria-label={`Infinity Partner para ${current.label}`}>
      <div className="hero-toggle">
        {SEGMENTS.map((seg) => (
          <button
            key={seg.id}
            type="button"
            className={`hero-toggle__btn${segment === seg.id ? ' hero-toggle__btn--active' : ''}`}
            onClick={() => setSegment(seg.id)}
            aria-pressed={segment === seg.id}
            aria-label={`Ver opção ${seg.label}`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      <div className={`hero-panel ${current.panelClass}`}>
        <div
          className="hero-panel__bg"
          style={{ backgroundImage: `url('${current.image}')` }}
          aria-hidden="true"
        />
        <div className={`hero-panel__overlay ${current.overlayClass}`} aria-hidden="true" />

        <div className="hero-panel__content">
          <span className={`hero-panel__eyebrow ${current.eyebrowClass}`}>{current.eyebrow}</span>
          <h1 className={`hero-panel__title ${current.titleClass}`}>
            {current.title.split(', ').map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className={`hero-panel__subtitle ${current.subtitleClass}`}>{current.subtitle}</p>

          <ul className={`hero-panel__pills ${current.pillsClass}`}>
            {current.pills.map((pill) => (
              <li key={pill}>{pill}</li>
            ))}
          </ul>

          <div className="hero-panel__actions">
            <Link
              to={ctaPath}
              className={`btn ${current.btnClass} btn--lg`}
              onClick={handleCta}
            >
              {current.btnLabel}
            </Link>
          </div>

          <p className={`hero-panel__trust ${current.trustClass}`}>
            Setup em 5 min · Sem cartão de crédito
          </p>
        </div>

        <div className={`hero-mock ${current.mockClass}`} aria-hidden="true">
          <div className={`hero-mock__header ${current.mockHeaderClass}`}>
            <div className="hero-mock__dot-row">
              <span /><span /><span />
            </div>
            <span className={`hero-mock__title ${current.mockTitleClass}`}>{current.mockTitle}</span>
          </div>
          <div className={`hero-mock__date ${current.mockDateClass}`}>{heroAgenda.date}</div>
          <ul className="hero-mock__list">
            {heroAgenda.appointments.map((apt) => (
              <li key={apt.time} className={`hero-mock__item ${current.mockItemClass}`}>
                <time className={`hero-mock__time ${current.mockTimeClass}`}>{apt.time}</time>
                <div className="hero-mock__info">
                  <strong className={current.mockClientClass}>{apt.client}</strong>
                  <span className={current.mockServiceClass}>{apt.service}</span>
                </div>
                <span className={`hero-mock__status hero-mock__status--${apt.status}`}>
                  {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                </span>
              </li>
            ))}
          </ul>
          <div className={`hero-mock__stat ${current.mockStatsClass}`}>
            <span>{current.mockStatsLabel}</span>
            <strong className={current.mockRevenueClass}>{current.mockStatsValue}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
