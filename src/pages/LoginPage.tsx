import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { SITE } from '@/data/content'
import { trackPageView } from '@/lib/analytics'
import { useEffect } from 'react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    trackPageView('/login')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login(email, password)
      if (user.onboardingData.completed) {
        navigate('/app')
      } else {
        navigate('/cadastro')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsSubmitting(false)
    }
  }

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

      <main className="container flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-[26rem]">
          <div className="cadastro-page__intro">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Entrar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse sua conta para gerenciar seu negócio.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="cadastro-form mt-6 bg-card border rounded-xl p-6 shadow-card"
          >
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="text-sm font-semibold mb-1 block">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@salao.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="text-sm font-semibold mb-1 block">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--primary btn--lg btn--block w-full justify-center mt-2"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="text-center mt-4 text-xs text-muted-foreground">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="text-primary hover:underline font-semibold">
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
