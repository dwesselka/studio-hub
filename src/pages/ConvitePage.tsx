import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/features/auth/use-auth'

interface ConviteInfo {
  email: string
  businessName: string | null
}

interface FetchState {
  loading: boolean
  info: ConviteInfo | null
  error: string | null
}

export default function ConvitePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const token = searchParams.get('token')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchState, setFetchState] = useState<FetchState>({
    loading: true,
    info: null,
    error: null,
  })

  useEffect(() => {
    if (!token) {
      setFetchState({ loading: false, info: null, error: 'Link inválido. Token não encontrado.' })
      return
    }

    let cancelled = false

    apiClient
      .get<ConviteInfo>(`/v1/auth/convite/${token}`)
      .then((res) => {
        if (!cancelled) setFetchState({ loading: false, info: res.data, error: null })
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Convite inválido ou expirado'
          setFetchState({ loading: false, info: null, error: msg })
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setIsSubmitting(true)

    try {
      const response = await apiClient.post<
        { token: string; name: string; password: string },
        { user: { email: string }; accessToken: string; refreshToken: string }
      >('/v1/auth/ativar-convite', { token, name, password })

      const { user: raw, accessToken, refreshToken } = response.data
      localStorage.setItem('infinity_auth', JSON.stringify({ accessToken, refreshToken }))
      await login(raw.email, password)
      navigate('/app')
    } catch (err) {
      setFetchState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Erro ao ativar conta',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (fetchState.loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Validando convite...</p>
        </div>
      </div>
    )
  }

  if (fetchState.error && !fetchState.info) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto px-6"
        >
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="mt-4 text-xl font-bold text-foreground">Convite inválido</h1>
          <p className="mt-2 text-sm text-muted-foreground">{fetchState.error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Voltar ao início
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-6 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Você foi convidado!
          </h1>
          {fetchState.info?.businessName && (
            <p className="mt-1 text-sm text-muted-foreground">
              Para fazer parte da equipe{' '}
              <span className="font-semibold">{fetchState.info.businessName}</span>
            </p>
          )}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-8 space-y-4"
        >
          {fetchState.error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
              <p className="text-sm text-destructive">{fetchState.error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
              E-mail
            </label>
            <input
              type="email"
              value={fetchState.info?.email ?? ''}
              disabled
              className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground/60 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-foreground/80 uppercase tracking-wider"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-foreground/80 uppercase tracking-wider"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Ativando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Ativar conta
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Já tem conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
