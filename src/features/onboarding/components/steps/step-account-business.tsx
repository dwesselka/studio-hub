import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SEGMENTS } from '@/features/onboarding/types'
import type { OnboardingAccount, BusinessData } from '@/features/onboarding/types'
import { useSearchParams } from 'react-router-dom'

const schema = z
  .object({
    nome: z.string().min(3, 'Mínimo de 3 caracteres').max(80).trim(),
    email: z.string().email('E-mail inválido').max(100).trim(),
    senha: z.string().min(6, 'Mínimo de 6 caracteres').max(100),
    confirmarSenha: z.string().min(1, 'Confirme sua senha'),
    negocio: z.string().min(2, 'Mínimo de 2 caracteres').max(80).trim(),
    segmento: z.string().min(1, 'Selecione um segmento'),
    endereco: z.string().min(5, 'Informe o endereço completo').max(200).trim(),
    telefone: z
      .string()
      .min(10, 'Inclua DDD e número')
      .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Formato inválido. Ex: (11) 99999-9999'),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'Senhas não conferem',
    path: ['confirmarSenha'],
  })

type FormData = z.infer<typeof schema>

interface StepAccountBusinessProps {
  defaultAccount?: OnboardingAccount | null
  defaultBusiness?: BusinessData | null
  onSubmit: (account: OnboardingAccount, business: BusinessData) => void
  isSubmitting?: boolean
}

export function StepAccountBusiness({
  defaultAccount,
  defaultBusiness,
  onSubmit,
  isSubmitting,
}: StepAccountBusinessProps) {
  const [searchParams] = useSearchParams()
  const segmentQuery = searchParams.get('segmento') || ''

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: defaultAccount?.nome || '',
      email: defaultAccount?.email || '',
      senha: '',
      confirmarSenha: '',
      negocio: defaultBusiness?.nome || '',
      segmento: defaultBusiness?.segmento || segmentQuery,
      endereco: defaultBusiness?.endereco || '',
      telefone: defaultBusiness?.telefone || '',
    },
  })

  const handleFormSubmit = (data: FormData) => {
    onSubmit(
      { nome: data.nome, email: data.email, password: data.senha },
      {
        nome: data.negocio,
        segmento: data.segmento,
        endereco: data.endereco,
        telefone: data.telefone,
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Dados da conta</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Suas informações de acesso</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group !mb-0">
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
          />
          {errors.nome && (
            <span className="text-xs text-destructive mt-1 block">{errors.nome.message}</span>
          )}
        </div>

        <div className="form-group !mb-0">
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
          />
          {errors.email && (
            <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group !mb-0">
          <label htmlFor="senha" className="text-sm font-semibold mb-1 block">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            className={errors.senha ? 'border-destructive focus:ring-destructive' : ''}
            {...register('senha')}
            aria-invalid={!!errors.senha}
          />
          {errors.senha && (
            <span className="text-xs text-destructive mt-1 block">{errors.senha.message}</span>
          )}
        </div>

        <div className="form-group !mb-0">
          <label htmlFor="confirmarSenha" className="text-sm font-semibold mb-1 block">
            Confirmar senha
          </label>
          <input
            id="confirmarSenha"
            type="password"
            placeholder="Repita a senha"
            className={errors.confirmarSenha ? 'border-destructive focus:ring-destructive' : ''}
            {...register('confirmarSenha')}
            aria-invalid={!!errors.confirmarSenha}
          />
          {errors.confirmarSenha && (
            <span className="text-xs text-destructive mt-1 block">
              {errors.confirmarSenha.message}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h2 className="text-lg font-bold text-foreground">Dados do negócio</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Informações do seu estabelecimento</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group !mb-0">
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
          />
          {errors.negocio && (
            <span className="text-xs text-destructive mt-1 block">{errors.negocio.message}</span>
          )}
        </div>

        <div className="form-group !mb-0">
          <label htmlFor="segmento" className="text-sm font-semibold mb-1 block">
            Segmento
          </label>
          <select
            id="segmento"
            className={errors.segmento ? 'border-destructive focus:ring-destructive' : ''}
            {...register('segmento')}
            aria-invalid={!!errors.segmento}
          >
            <option value="">Selecione...</option>
            {SEGMENTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.segmento && (
            <span className="text-xs text-destructive mt-1 block">{errors.segmento.message}</span>
          )}
        </div>

        <div className="form-group !mb-0 sm:col-span-2">
          <label htmlFor="endereco" className="text-sm font-semibold mb-1 block">
            Endereço
          </label>
          <input
            id="endereco"
            type="text"
            placeholder="Rua, número, bairro, cidade"
            className={errors.endereco ? 'border-destructive focus:ring-destructive' : ''}
            {...register('endereco')}
            aria-invalid={!!errors.endereco}
          />
          {errors.endereco && (
            <span className="text-xs text-destructive mt-1 block">{errors.endereco.message}</span>
          )}
        </div>

        <div className="form-group !mb-0">
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
          />
          {errors.telefone && (
            <span className="text-xs text-destructive mt-1 block">{errors.telefone.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn--primary btn--lg btn--block w-full justify-center mt-2"
      >
        {isSubmitting ? 'Salvando...' : 'Continuar'}
      </button>
    </form>
  )
}
