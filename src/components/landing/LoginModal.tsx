import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/features/auth/use-auth'
import { trackPageView } from '@/lib/analytics'
import { Link } from 'react-router-dom'
import { SITE } from '@/data/content'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

type LoginStep = 'login' | 'forgot-password' | 'verify-code' | 'reset-password'

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const navigate = useNavigate()
  const { login } = useAuth()

  // States
  const [step, setStep] = useState<LoginStep>('login')
  const [email, setEmail] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Modal Setup
  useEffect(() => {
    if (open) {
      trackPageView('/login')
      document.body.style.overflow = 'hidden'
      // Reset state on open
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep('login')
      setEmail('')
      setPassword('')
      setError(null)
      setOtp(['', '', '', '', '', ''])
      setNewPassword('')
      setConfirmPassword('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Timer Setup for OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (step === 'verify-code' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timeLeft])

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const maskEmail = (em: string) => {
    const [name, domain] = em.split('@')
    if (!domain) return em
    return `${name.substring(0, 3)}***@${domain}`
  }

  // Submit Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const user = await login(email, password)
      onClose()
      const home: Record<string, string> = {
        lojista: '/app',
        profissional: '/app/profissional',
        cliente: '/portal',
      }
      const redirect = user.onboardingData?.completed ? (home[user.role] ?? '/app') : '/cadastro'
      navigate(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recoveryEmail) {
      setError('Por favor, informe um e-mail.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      // API call to send code would go here
      await new Promise((r) => setTimeout(r, 1000))
      setTimeLeft(60)
      setStep('verify-code')
    } catch {
      setError('Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (timeLeft > 0) return
    setError(null)
    setIsSubmitting(true)
    try {
      // API call to resend code would go here
      await new Promise((r) => setTimeout(r, 1000))
      setTimeLeft(60)
      setOtp(['', '', '', '', '', ''])
      const activeRef = otpRefs.current[0]
      if (activeRef) activeRef.focus()
    } catch {
      setError('Erro ao reenviar código.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = useCallback(async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) return
    setError(null)
    setIsSubmitting(true)
    try {
      // API call to verify OTP would go here
      await new Promise((r) => setTimeout(r, 1000))
      setStep('reset-password')
    } catch {
      setError('Código inválido ou expirado.')
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      // API call to reset password would go here
      await new Promise((r) => setTimeout(r, 1000))
      setStep('login')
      setOtp(['', '', '', '', '', ''])
      // Show success message
    } catch {
      setError('Erro ao redefinir senha.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // OTP Input Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    // Get last char in case they typed multiple quickly
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    const currentCode = newOtp.join('')
    if (currentCode.length === 6) {
      handleVerifyCode(currentCode)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current is empty and backspace is pressed, focus previous and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        otpRefs.current[index - 1]?.focus()
      } else {
        // Just clear current
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < 6 && i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    // Focus last filled input or next empty
    const focusIndex = Math.min(5, pastedData.length)
    if (focusIndex < 6) {
      otpRefs.current[focusIndex]?.focus()
    } else {
      otpRefs.current[5]?.blur()
    }

    const currentCode = newOtp.join('')
    if (currentCode.length === 6) {
      handleVerifyCode(currentCode)
    }
  }

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Recuperar conta"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-black/60 flex min-h-0 max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Fechar modal"
                  className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col justify-center flex-1 p-8 sm:p-10 relative overflow-y-auto overflow-x-hidden">
                  <div className="md:hidden mb-8 flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                      S
                    </span>
                    <span className="text-sm font-semibold text-white">{SITE.name}</span>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mb-6"
                    >
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}

                  <AnimatePresence mode="wait">
                    {step === 'login' && (
                      <motion.div
                        key="login"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                      >
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight text-white">
                            Bem-vindo de volta
                          </h1>
                          <p className="text-sm text-zinc-400 mt-1.5">
                            Entre com seus dados para acessar sua conta.
                          </p>
                        </div>
                        <form onSubmit={handleLoginSubmit} className="mt-7 space-y-8">
                          <div className="space-y-1.5">
                            <label
                              htmlFor="login-email"
                              className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
                            >
                              E-mail
                            </label>
                            <input
                              id="login-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="seu@email.com"
                              required
                              autoComplete="email"
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor="login-password"
                                className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
                              >
                                Senha
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setError(null)
                                  setStep('forgot-password')
                                }}
                                className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                              >
                                Esqueceu sua senha?
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Sua senha"
                                required
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:shadow-xl hover:shadow-violet-900/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2 group mt-1"
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

                          <p className="text-center text-xs text-zinc-500 pt-1">
                            Ainda não tem conta?{' '}
                            <Link
                              to="/signup"
                              onClick={onClose}
                              className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              Criar conta grátis
                            </Link>
                          </p>
                        </form>
                      </motion.div>
                    )}

                    {step === 'forgot-password' && (
                      <motion.div
                        key="forgot-password"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full"
                      >
                        <div>
                          <button
                            type="button"
                            onClick={() => setStep('login')}
                            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors mb-6 uppercase tracking-wider"
                          >
                            <ArrowLeft className="w-3 h-3" /> Voltar ao login
                          </button>

                          <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                              <KeyRound className="w-7 h-7 text-violet-400" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                              Recuperar acesso
                            </h1>
                            <p className="text-sm text-zinc-400 mt-2 max-w-[280px]">
                              Informe seu e-mail para receber um código de verificação.
                            </p>
                          </div>
                        </div>
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-6 mt-auto">
                          <div className="space-y-1.5">
                            <label
                              htmlFor="recovery-email"
                              className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
                            >
                              E-mail
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-zinc-500" />
                              </div>
                              <input
                                id="recovery-email"
                                type="email"
                                value={recoveryEmail}
                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 focus:bg-zinc-900"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting || !recoveryEmail}
                            className="relative w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:shadow-xl hover:shadow-violet-900/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2 group"
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
                                Enviando...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                Enviar código
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                              </span>
                            )}
                          </button>
                        </form>
                      </motion.div>
                    )}

                    {step === 'verify-code' && (
                      <motion.div
                        key="verify-code"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full"
                      >
                        <div>
                          <button
                            type="button"
                            onClick={() => setStep('forgot-password')}
                            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors mb-6 uppercase tracking-wider"
                          >
                            <ArrowLeft className="w-3 h-3" /> Alterar e-mail
                          </button>

                          <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                              <ShieldCheck className="w-7 h-7 text-violet-400" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                              Verificar código
                            </h1>
                            <p className="text-sm text-zinc-400 mt-2 max-w-[280px]">
                              Enviamos um código de 6 dígitos para <br />
                              <strong className="text-white font-medium">
                                {maskEmail(recoveryEmail)}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="flex justify-between gap-2 mb-8">
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => {
                                  otpRefs.current[index] = el
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={handleOtpPaste}
                                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-zinc-800 bg-zinc-900/50 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 focus:bg-zinc-900"
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={timeLeft > 0 || isSubmitting}
                            className="w-full text-center text-sm font-semibold text-zinc-400 hover:text-white disabled:opacity-50 disabled:hover:text-zinc-400 transition-colors"
                          >
                            {timeLeft > 0
                              ? `Reenviar código em 00:${timeLeft.toString().padStart(2, '0')}`
                              : 'Reenviar código agora'}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 'reset-password' && (
                      <motion.div
                        key="reset-password"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full"
                      >
                        <div className="flex flex-col items-center text-center mb-8">
                          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 mt-2">
                            <KeyRound className="w-7 h-7 text-violet-400" />
                          </div>
                          <h1 className="text-2xl font-bold tracking-tight text-white">
                            Nova senha
                          </h1>
                          <p className="text-sm text-zinc-400 mt-2 max-w-[280px]">
                            Escolha uma nova senha forte para sua conta.
                          </p>
                        </div>

                        <form onSubmit={handleResetPasswordSubmit} className="space-y-5 mt-auto">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                              Nova senha
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 pr-10 text-sm text-white placeholder:text-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 focus:bg-zinc-900"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                              Confirmar senha
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 pr-10 text-sm text-white placeholder:text-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 focus:bg-zinc-900"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting || newPassword.length < 6}
                            className="relative w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:shadow-xl hover:shadow-violet-900/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2 mt-4"
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
                                Atualizando...
                              </span>
                            ) : (
                              <span>Atualizar senha</span>
                            )}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
