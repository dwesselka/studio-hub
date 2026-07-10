import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/features/auth/use-auth'
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

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const layersRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    trackPageView('/login')
    const interval = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 3000)
    return () => clearInterval(interval)
  }, [])

  useLayoutEffect(() => {
    layersRef.current.forEach((el, i) => {
      if (!el) return
      el.style.opacity = i === slideIndex ? '0.5' : '0'
    })
  }, [slideIndex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login(email, password)
      const home: Record<string, string> = {
        lojista: '/app',
        profissional: '/app/profissional',
        cliente: '/portal',
      }
      const redirect = user.onboardingData?.completed ? (home[user.role] ?? '/app') : '/cadastro'
      navigate(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-svh flex">
      {/* Left side — visual branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {slides.map((slide, i) => (
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
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

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
              <Sparkles className="h-8 w-8 text-amber-400 mb-4" />
              <h2 className="text-4xl font-bold text-white leading-tight">
                Gestão inteligente
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">
                  para o seu negócio
                </span>
              </h2>
              <p className="mt-4 text-base text-zinc-400 max-w-md leading-relaxed">
                Agendamentos, finanças, equipe e fidelização em um só lugar. Tudo que você precisa
                para crescer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {slides.map((slide, i) => (
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
              ))}
            </motion.div>
          </div>

          <div className="text-[11px] text-zinc-600">
            &copy; 2026 StudioHub. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                IP
              </span>
              <span className="text-lg font-semibold">{SITE.name}</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Entre com seus dados para acessar sua conta.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-8 space-y-4"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3"
              >
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-wider"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground/80 uppercase tracking-wider"
                >
                  Senha
                </label>
                <button
                  type="button"
                  className="text-[11px] text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Entrar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Ainda não tem conta?{' '}
              <Link
                to="/cadastro"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Criar conta grátis
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
