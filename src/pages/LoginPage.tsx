import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/features/auth/use-auth'
import { SITE } from '@/data/content'
import { trackPageView } from '@/lib/analytics'

// Theme config removed

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {
    trackPageView('/login')
  }, [])
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#09090b]">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-lg font-bold">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight">{SITE.name} Lab</span>
          </Link>

          <div className="space-y-8 mt-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Engineering RPG
              </div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Evolua seu código.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  Suba de nível.
                </span>
              </h2>
              <p className="mt-4 text-base text-zinc-400 max-w-md leading-relaxed">
                Bem-vindo ao Engineering Lab. Acompanhe sua evolução técnica, ganhe XP por deploys
                bem-sucedidos e alcance o rank S+ em arquitetura.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4 max-w-sm"
            >
              {/* Stats Cards */}
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 backdrop-blur-sm">
                <div className="text-xs text-zinc-500 font-medium mb-1">Rank Atual</div>
                <div className="text-2xl font-bold text-amber-400">S+</div>
              </div>
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 backdrop-blur-sm">
                <div className="text-xs text-zinc-500 font-medium mb-1">Engineering Score</div>
                <div className="text-2xl font-bold text-white">
                  9.850 <span className="text-xs text-blue-400 font-normal">XP</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-[11px] text-zinc-600 font-mono">v2.0.0-alpha • BUILD 8452</div>
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
                to="/signup"
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
