import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowLeft, Scissors, Wine, Syringe, Sparkle } from 'lucide-react'
import { useAuth } from '@/features/auth/use-auth'
import { OnboardingWizard } from '@/features/onboarding/components/onboarding-wizard'
import { SITE } from '@/data/content'
import { trackPageView } from '@/lib/analytics'

interface Slide {
  image: string
  label: string
}

const slides: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    label: 'Salão de Beleza',
  },
  {
    image: 'https://images.unsplash.com/photo-1585747861115-4de5c53e6fc7?w=800&q=80',
    label: 'Barbearia',
  },
  {
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    label: 'Clínica Estética',
  },
  {
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    label: 'Autônomo',
  },
]

type SegmentId = 'salao' | 'barbearia' | 'clinica' | 'autonomo'

interface SegmentTheme {
  label: string
  icon: typeof Scissors
  image: string
  gradient: string
  hoverGradient: string
  tagClass: string
  sparkleColor: string
  badgeClass: string
}

const SEGMENT_THEMES: Record<SegmentId, SegmentTheme> = {
  salao: {
    label: 'Salão de Beleza',
    icon: Wine,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    gradient: 'linear-gradient(135deg, #831843, #9d174d, #701a75)',
    hoverGradient: 'from-rose-400 to-rose-600',
    tagClass: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
    sparkleColor: '#f43f5e',
    badgeClass: 'from-rose-400 to-rose-600',
  },
  barbearia: {
    label: 'Barbearia',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1585747861115-4de5c53e6fc7?w=800&q=80',
    gradient: 'linear-gradient(135deg, #18181b, #27272a, #18181b)',
    hoverGradient: 'from-amber-400 to-amber-600',
    tagClass: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
    sparkleColor: '#f59e0b',
    badgeClass: 'from-amber-400 to-amber-600',
  },
  clinica: {
    label: 'Clínica Estética',
    icon: Syringe,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    gradient: 'linear-gradient(135deg, #0c4a6e, #075985, #1e3a5f)',
    hoverGradient: 'from-sky-400 to-sky-600',
    tagClass: 'border-sky-400/40 bg-sky-400/10 text-sky-300',
    sparkleColor: '#38bdf8',
    badgeClass: 'from-sky-400 to-sky-600',
  },
  autonomo: {
    label: 'Profissional Autônomo',
    icon: Sparkle,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    gradient: 'linear-gradient(135deg, #064e3b, #065f46, #0d5e3c)',
    hoverGradient: 'from-emerald-400 to-emerald-600',
    tagClass: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    sparkleColor: '#10b981',
    badgeClass: 'from-emerald-400 to-emerald-600',
  },
}

const SEGMENTS_LIST = Object.entries(SEGMENT_THEMES).map(([id, theme]) => ({
  id: id as SegmentId,
  ...theme,
}))

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plano') || 'starter'
  const segmentFromUrl = searchParams.get('segmento') as SegmentId | null
  const isValidSegment = segmentFromUrl && segmentFromUrl in SEGMENT_THEMES

  const [selectedSegment, setSelectedSegment] = useState<SegmentId | null>(
    isValidSegment ? segmentFromUrl : null,
  )
  const [hoveredSegment, setHoveredSegment] = useState<SegmentId | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const layersRef = useRef<(HTMLDivElement | null)[]>([])

  const existingAccount = user ? { email: user.email, password: '', nome: user.name } : null
  const existingBusiness = user?.onboardingData?.business ?? null
  const existingHours = user?.onboardingData?.hours ?? []
  const existingServices = user?.onboardingData?.services ?? []
  const existingTeam = user?.onboardingData?.team ?? []

  const showWizardDirectly = !!user
  const showSegmentSelection = !selectedSegment && !showWizardDirectly
  const activeSegmentId = hoveredSegment || selectedSegment
  const activeTheme = activeSegmentId ? SEGMENT_THEMES[activeSegmentId] : null

  useEffect(() => {
    trackPageView('/cadastro')
    const interval = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 3000)
    return () => clearInterval(interval)
  }, [])

  useLayoutEffect(() => {
    if (activeTheme) {
      layersRef.current.forEach((el) => {
        if (el) el.style.opacity = '0'
      })
    } else {
      layersRef.current.forEach((el, i) => {
        if (!el) return
        el.style.opacity = i === slideIndex ? '0.5' : '0'
      })
    }
  }, [slideIndex, activeTheme])

  const handleSegmentSelect = (segmentId: SegmentId) => {
    setSelectedSegment(segmentId)
    const params = new URLSearchParams(searchParams)
    params.set('segmento', segmentId)
    navigate(`/cadastro?${params.toString()}`, { replace: true })
  }

  const handleBackToSegments = () => {
    setSelectedSegment(null)
    setHoveredSegment(null)
    const params = new URLSearchParams(searchParams)
    params.delete('segmento')
    navigate(`/cadastro?${params.toString()}`, { replace: true })
  }

  const renderLeftPanel = () => (
    <div
      className="hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-700"
      style={activeTheme ? { background: activeTheme.gradient } : undefined}
    >
      {activeTheme ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${activeTheme.image})` }}
        />
      ) : (
        slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) {
                layersRef.current[i] = el
                el.style.opacity = '0'
              }
            }}
            className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out will-change-[opacity]"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))
      )}
      <div
        className="absolute inset-0"
        style={
          activeTheme
            ? {
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.2) 100%)',
              }
            : undefined
        }
      />
      <div
        className={
          activeTheme
            ? 'absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'
            : 'absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent'
        }
      />

      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-lg font-bold">
            IP
          </span>
          <span className="text-lg font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Sparkles
              className="h-8 w-8 mb-4 transition-colors duration-700"
              style={{ color: activeTheme?.sparkleColor ?? '#fbbf24' }}
            />
            <h2 className="text-4xl font-bold text-white leading-tight">
              {showSegmentSelection ? (
                <>
                  Comece grátis
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">
                    seu novo negócio
                  </span>
                </>
              ) : (
                <>
                  Configure seu
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">
                    {activeTheme?.label.toLowerCase() ?? 'negócio'}
                  </span>
                </>
              )}
            </h2>
            <p className="mt-4 text-base text-zinc-400 max-w-md leading-relaxed">
              {showSegmentSelection
                ? 'Selecione o segmento do seu negócio para começarmos.'
                : 'Preencha os dados abaixo e configure sua operação em poucos minutos.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            {activeTheme ? (
              <span className={`rounded-full border px-3 py-1 text-[11px] ${activeTheme.tagClass}`}>
                {activeTheme.label}
              </span>
            ) : (
              slides.map((slide, i) => (
                <span
                  key={i}
                  className={`rounded-full border px-3 py-1 text-[11px] transition-all duration-700 ${
                    i === slideIndex
                      ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                      : 'border-white/10 bg-white/5 text-zinc-500'
                  }`}
                >
                  {slide.label}
                </span>
              ))
            )}
          </motion.div>
        </div>

        <div className="text-[11px] text-zinc-600">
          &copy; 2026 Infinity Partner. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )

  const renderRightContent = () => {
    if (showWizardDirectly) return null

    if (showSegmentSelection) {
      return (
        <motion.div
          key="segment-select"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                IP
              </span>
              <span className="text-lg font-semibold">{SITE.name}</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">Começar grátis</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-8">
            Selecione o segmento do seu negócio para personalizar sua experiência.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SEGMENTS_LIST.map((segment, index) => {
              const Icon = segment.icon
              const isActive = hoveredSegment === segment.id
              return (
                <motion.button
                  key={segment.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.4 }}
                  onClick={() => handleSegmentSelect(segment.id)}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`group relative overflow-hidden rounded-xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-1 active:translate-y-0 ${
                    isActive
                      ? 'border-foreground/20 bg-card shadow-lg'
                      : 'border-border/60 bg-card/50 hover:shadow-md hover:border-foreground/10'
                  }`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm mb-3 transition-transform duration-200 group-hover:scale-105 ${segment.hoverGradient}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground">{segment.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {segment.id === 'salao'
                      ? 'Corte, coloração, manicure e mais'
                      : segment.id === 'barbearia'
                        ? 'Corte masculino, barba, pigmentação'
                        : segment.id === 'clinica'
                          ? 'Limpeza de pele, laser, massagens'
                          : 'Serviços personalizados em domicílio'}
                  </p>
                </motion.button>
              )
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </motion.div>
      )
    }

    return (
      <motion.div
        key="wizard"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={handleBackToSegments}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Trocar segmento
        </button>
        <OnboardingWizard
          existingAccount={existingAccount}
          existingBusiness={existingBusiness}
          existingHours={existingHours}
          existingServices={existingServices}
          existingTeam={existingTeam}
        />
      </motion.div>
    )
  }

  if (showWizardDirectly) {
    return (
      <div className="cadastro-page min-h-svh flex flex-col">
        <header className="cadastro-page__header">
          <div className="container">
            <Link to="/" className="header__logo">
              <span className="header__logo-mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none">
                  <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8" cy="24" r="4" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M26 6 12 18M26 26 12 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="header__logo-text">
                <strong>{SITE.name}</strong>
                <small>Beleza &amp; grooming</small>
              </span>
            </Link>
          </div>
        </header>

        <main className="container flex-1 flex flex-col py-10">
          <div className="w-full max-w-[56rem] mx-auto">
            <div className="cadastro-page__intro mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Configurar meu negócio
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure seu negócio em menos de 5 minutos. Passo a passo guiado.
              </p>
              {planId && (
                <div className="mt-3 text-xs font-semibold inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                  Plano:{' '}
                  <strong>
                    {planId === 'starter' ? 'Starter' : planId === 'pro' ? 'Pro' : 'Premium'}
                  </strong>
                </div>
              )}
            </div>

            <OnboardingWizard
              existingAccount={existingAccount}
              existingBusiness={existingBusiness}
              existingHours={existingHours}
              existingServices={existingServices}
              existingTeam={existingTeam}
            />

            <div className="text-center mt-6 text-xs text-muted-foreground">
              Ao continuar, você concorda com os termos de uso. Já tem conta?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Fazer login
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex">
      {renderLeftPanel()}

      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className={`w-full ${selectedSegment ? 'max-w-3xl' : 'max-w-sm'}`}>
          <AnimatePresence mode="wait">{renderRightContent()}</AnimatePresence>
        </div>
      </div>
    </div>
  )
}
