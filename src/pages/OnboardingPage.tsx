import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { OnboardingWizard } from '@/features/onboarding/components/onboarding-wizard'
import { SITE } from '@/data/content'
import { trackPageView } from '@/lib/analytics'

export default function OnboardingPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plano') || 'starter'

  useEffect(() => {
    trackPageView('/cadastro')
  }, [])

  const existingAccount = user ? { email: user.email, password: '', nome: user.name } : null

  const existingBusiness = user?.onboardingData?.business ?? null
  const existingHours = user?.onboardingData?.hours ?? []
  const existingServices = user?.onboardingData?.services ?? []
  const existingTeam = user?.onboardingData?.team ?? []

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
              {user ? 'Configurar meu negócio' : 'Criar minha conta'}
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

          {!user && (
            <div className="text-center mt-6 text-xs text-muted-foreground">
              Ao continuar, você concorda com os termos de uso. Já tem conta?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Fazer login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
