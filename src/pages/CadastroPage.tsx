import { useEffect, useState } from 'react'
import SuccessModal from '@/components/SuccessModal'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { plans, SITE } from '@/data/content'
import { trackCtaClick, trackPageView } from '@/lib/analytics'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const SEGMENTS = [
  { id: 'salao', label: 'Salão de beleza' },
  { id: 'barbearia', label: 'Barbearia' },
  { id: 'autonomo', label: 'Profissional autônomo' },
] as const

const cadastroSchema = z.object({
  nome: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(80, 'O nome deve ter no máximo 80 caracteres')
    .trim(),
  email: z
    .string()
    .email('Formato de e-mail inválido')
    .max(100, 'O e-mail deve ter no máximo 100 caracteres')
    .trim(),
  telefone: z
    .string()
    .min(10, 'O telefone deve incluir DDD e número')
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Formato inválido. Use (11) 99999-9999 ou similar'),
  negocio: z
    .string()
    .min(2, 'O nome do negócio deve ter pelo menos 2 caracteres')
    .max(80, 'O nome do negócio deve ter no máximo 80 caracteres')
    .trim(),
  segmento: z.string().min(1, 'Por favor, selecione um segmento'),
})

type CadastroFormData = z.infer<typeof cadastroSchema>

export default function CadastroPage() {
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plano') || 'starter'
  const selectedPlan = plans.find((p) => p.id === planId) || plans[0]

  const [isSuccess, setIsSuccess] = useState(false)
  const [negocioName, setNegocioName] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      negocio: '',
      segmento: '',
    },
  })

  useEffect(() => {
    trackPageView('/cadastro')
  }, [])

  const onSubmit = async (data: CadastroFormData) => {
    setNegocioName(data.negocio)
    trackCtaClick('cadastro-submit', planId)

    // Simulando requisição assíncrona rápida de rede
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSuccess(true)
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

      <main className="container flex-1 flex flex-col items-center justify-center py-10">
        {!isSuccess ? (
          <div className="w-full max-w-[28rem]">
            <div className="cadastro-page__intro">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Crie sua conta</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure seu negócio em menos de 5 minutos. Sem cartão de crédito.
              </p>
              <div className="cadastro-page__plan mt-3 text-xs font-semibold inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                Plano selecionado: <strong>{selectedPlan.name}</strong> — {selectedPlan.price}
                {selectedPlan.period}
              </div>
            </div>

            <form
              className="cadastro-form mt-6 bg-card border rounded-xl p-6 shadow-card"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-group">
                <label htmlFor="nome" className="text-sm font-semibold mb-1 block">
                  Seu nome
                </label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Maria Silva"
                  className={errors.nome ? 'border-destructive focus:ring-destructive' : ''}
                  {...register('nome')}
                  aria-invalid={!!errors.nome}
                  aria-describedby={errors.nome ? 'nome-error' : undefined}
                />
                {errors.nome && (
                  <span
                    id="nome-error"
                    className="text-xs text-destructive mt-1 block"
                    role="alert"
                  >
                    {errors.nome.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="text-sm font-semibold mb-1 block">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="maria@salao.com"
                  className={errors.email ? 'border-destructive focus:ring-destructive' : ''}
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span
                    id="email-error"
                    className="text-xs text-destructive mt-1 block"
                    role="alert"
                  >
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="telefone" className="text-sm font-semibold mb-1 block">
                  Telefone / WhatsApp
                </label>
                <input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className={errors.telefone ? 'border-destructive focus:ring-destructive' : ''}
                  {...register('telefone')}
                  aria-invalid={!!errors.telefone}
                  aria-describedby={errors.telefone ? 'telefone-error' : undefined}
                />
                {errors.telefone && (
                  <span
                    id="telefone-error"
                    className="text-xs text-destructive mt-1 block"
                    role="alert"
                  >
                    {errors.telefone.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="negocio" className="text-sm font-semibold mb-1 block">
                  Nome do negócio
                </label>
                <input
                  id="negocio"
                  type="text"
                  placeholder="Studio Maria Hair"
                  className={errors.negocio ? 'border-destructive focus:ring-destructive' : ''}
                  {...register('negocio')}
                  aria-invalid={!!errors.negocio}
                  aria-describedby={errors.negocio ? 'negocio-error' : undefined}
                />
                {errors.negocio && (
                  <span
                    id="negocio-error"
                    className="text-xs text-destructive mt-1 block"
                    role="alert"
                  >
                    {errors.negocio.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="segmento" className="text-sm font-semibold mb-1 block">
                  Segmento
                </label>
                <select
                  id="segmento"
                  className={errors.segmento ? 'border-destructive focus:ring-destructive' : ''}
                  {...register('segmento')}
                  aria-invalid={!!errors.segmento}
                  aria-describedby={errors.segmento ? 'segmento-error' : undefined}
                >
                  <option value="">Selecione...</option>
                  {SEGMENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.segmento && (
                  <span
                    id="segmento-error"
                    className="text-xs text-destructive mt-1 block"
                    role="alert"
                  >
                    {errors.segmento.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn--primary btn--lg btn--block w-full justify-center mt-4"
              >
                {isSubmitting ? 'Criando conta...' : 'Criar conta e continuar'}
              </button>

              <div className="cadastro-form__note text-xs text-muted-foreground mt-4 text-center">
                Ao continuar, você concorda com os termos de uso. Já tem conta?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Fazer login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <SuccessModal title="Cadastro Realizado!" onClose={() => setIsSuccess(false)}>
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Cadastro Realizado!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sua conta para o negócio <strong>{negocioName}</strong> foi criada com sucesso no
                  plano <strong>{selectedPlan.name}</strong>.
                </p>
              </div>
              <div className="w-full p-4 rounded-lg bg-muted/50 text-left text-xs space-y-2 border">
                <p className="font-semibold text-foreground">Próximos passos do Onboarding:</p>
                <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                  <li>Configuração dos horários de atendimento</li>
                  <li>Cadastro inicial do catálogo de serviços</li>
                  <li>Definição dos primeiros profissionais da equipe</li>
                </ul>
              </div>
              <Link
                to="/app"
                className="btn btn--primary btn--lg btn--block w-full justify-center gap-2"
              >
                Ir para o Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SuccessModal>
        )}
      </main>
    </div>
  )
}
