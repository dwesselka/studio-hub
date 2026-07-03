import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  OnboardingAccount,
  BusinessData,
  DayHours,
  ServiceItem,
  TeamMember,
} from '@/features/onboarding/types'
import { DEFAULT_HOURS } from '@/features/onboarding/types'
import { useAuth } from '@/features/auth/use-auth'
import {
  saveBusinessData,
  saveHours,
  saveServices,
  saveTeam,
  completeOnboarding,
  getPrePopulatedServices,
} from '@/lib/onboarding-db'
import { StepIndicator } from './step-indicator'
import { StepAccountBusiness } from './steps/step-account-business'
import { StepHours } from './steps/step-hours'
import { StepServices } from './steps/step-services'
import { StepTeam } from './steps/step-team'
import { CompletionChecklist } from './completion-checklist'
import { trackCtaClick } from '@/lib/analytics'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const STEP_LABELS = ['Dados', 'Horários', 'Serviços', 'Equipe']

interface OnboardingWizardProps {
  existingAccount?: OnboardingAccount | null
  existingBusiness?: BusinessData | null
  existingHours?: DayHours[]
  existingServices?: ServiceItem[]
  existingTeam?: TeamMember[]
}

export function OnboardingWizard({
  existingAccount,
  existingBusiness,
  existingHours,
  existingServices,
  existingTeam,
}: OnboardingWizardProps) {
  const navigate = useNavigate()
  const { user, signup, refreshUser } = useAuth()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [account, setAccount] = useState<OnboardingAccount | null>(existingAccount ?? null)
  const [business, setBusiness] = useState<BusinessData | null>(existingBusiness ?? null)
  const [hours, setHours] = useState<DayHours[]>(
    existingHours ?? DEFAULT_HOURS.map((h) => ({ ...h })),
  )
  const [services, setServices] = useState<ServiceItem[]>(existingServices ?? [])
  const [team, setTeam] = useState<TeamMember[]>(existingTeam ?? [])

  const userId = user?.id

  const progress = {
    accountCreated: !!user,
    businessDataComplete: !!business,
    hoursConfigured: hours.some((h) => h.isOpen),
    servicesReviewed: services.length > 0,
    teamAdded: team.length > 0,
  }

  const handleAccountBusiness = async (acc: OnboardingAccount, bus: BusinessData) => {
    setError(null)
    setIsSubmitting(true)

    try {
      if (!user) {
        trackCtaClick('onboarding-signup', bus.segmento)
        const newUser = await signup(acc.email, acc.password, acc.nome)
        saveBusinessData(newUser.id, bus)
        setAccount(acc)
        setBusiness(bus)

        const prepopulated = getPrePopulatedServices(bus.segmento)
        setServices(prepopulated)
      } else {
        if (!userId) return
        saveBusinessData(userId, bus)
        setBusiness(bus)

        if (existingServices?.length === 0) {
          const prepopulated = getPrePopulatedServices(bus.segmento)
          setServices(prepopulated)
        }
      }

      setIsSubmitting(false)
      setStep(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
      setIsSubmitting(false)
    }
  }

  const handleHours = (newHours: DayHours[]) => {
    setHours(newHours)
    if (userId) saveHours(userId, newHours)
    setStep(2)
  }

  const handleServices = (newServices: ServiceItem[]) => {
    setServices(newServices)
    if (userId) saveServices(userId, newServices)
    setStep(3)
  }

  const handleTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam)
    if (userId) {
      saveTeam(userId, newTeam)
      completeOnboarding(userId)
      refreshUser()
    }
    setIsComplete(true)
    trackCtaClick('onboarding-complete')
  }

  const handleSkipTeam = () => {
    if (userId) {
      saveTeam(userId, [])
      completeOnboarding(userId)
      refreshUser()
    }
    setIsComplete(true)
    trackCtaClick('onboarding-complete')
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Cadastro concluído!</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Seu negócio <strong>{business?.nome}</strong> está configurado e pronto para receber
            agendamentos.
          </p>
        </div>
        <button onClick={() => navigate('/app')} className="btn btn--primary btn--lg gap-2">
          Ir para o Dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={step} totalSteps={4} labels={STEP_LABELS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {step === 0 && (
              <StepAccountBusiness
                defaultAccount={account}
                defaultBusiness={business}
                onSubmit={handleAccountBusiness}
                isSubmitting={isSubmitting}
              />
            )}
            {step === 1 && (
              <StepHours defaultHours={hours} onSubmit={handleHours} onBack={() => setStep(0)} />
            )}
            {step === 2 && (
              <StepServices
                segmento={business?.segmento || ''}
                defaultServices={services}
                onSubmit={handleServices}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepTeam
                defaultTeam={team}
                onSubmit={handleTeam}
                onBack={() => setStep(2)}
                onSkip={handleSkipTeam}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CompletionChecklist progress={progress} />
          </div>
        </div>
      </div>
    </div>
  )
}
