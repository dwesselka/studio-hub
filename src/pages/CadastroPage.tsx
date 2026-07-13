import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/use-auth'
import { SITE } from '@/data/content'
import { trackPageView } from '@/lib/analytics'

const cadastroSchema = z
  .object({
    name: z
      .string()
      .min(3, 'O nome deve ter pelo menos 3 caracteres')
      .max(80, 'Máximo 80 caracteres')
      .trim(),
    email: z
      .string()
      .email('Formato de e-mail inválido')
      .max(100, 'Máximo 100 caracteres')
      .toLowerCase()
      .trim(),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme sua senha'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type CadastroFormData = z.infer<typeof cadastroSchema>

export default function CadastroPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plano') ?? 'starter'
  const { signup } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    trackPageView('/cadastro')
  }, [])

  const onSubmit = async (data: CadastroFormData) => {
    setServerError(null)
    try {
      await signup(data.email, data.password, data.name)
      navigate('/cadastro', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-svh flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 items-end p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent" />
        <div className="relative z-10 space-y-6">
          <Link to="/" className="flex items-center gap-3 text-white mb-8 block">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-lg font-bold">
              IP
            </span>
            <span className="text-lg font-semibold tracking-tight">{SITE.name}</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Sparkles className="h-8 w-8 text-amber-400 mb-4" />
            <h2 className="text-4xl font-bold text-white leading-tight">
              Comece grátis,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">
                cresça sem limites
              </span>
            </h2>
            <p className="mt-4 text-base text-zinc-400 max-w-md leading-relaxed">
              Configure seu negócio em minutos. Agendamentos, equipe e finanças em um só lugar.
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-3 pt-2">
            {['Sem cartão de crédito', 'Setup em 5 min', 'Suporte incluso'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 px-3 py-1 text-[11px] font-medium"
              >
                ✓ {item}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-zinc-600 pt-4">
            © 2026 {SITE.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Criar conta</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Plano <strong className="text-primary capitalize">{planId}</strong> selecionado. Sem
              cartão de crédito.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-8 space-y-4"
            noValidate
          >
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3"
              >
                <p className="text-sm text-destructive">{serverError}</p>
              </motion.div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-wider"
              >
                Seu nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Maria Silva"
                {...register('name')}
                aria-invalid={!!errors.name}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
              />
              {errors.name && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
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
                placeholder="maria@salao.com"
                {...register('email')}
                aria-invalid={!!errors.email}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
              />
              {errors.email && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-wider"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-wider"
              >
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  {...register('confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2 group mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando conta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Criar conta grátis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground pt-1">
              Ao continuar, você concorda com os termos de uso. Já tem conta?{' '}
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
    </div>
  )
}
