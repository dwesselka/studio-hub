import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'
import { LoadingSpinner } from '@/components/ui/loading'

interface AuthGuardProps {
  children: React.ReactNode
  role?: 'lojista' | 'profissional' | 'cliente'
}

export function AuthGuard({ children, role }: AuthGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner label="Verificando acesso..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  if (!user.onboardingData?.completed) {
    return <Navigate to="/cadastro" replace />
  }

  return <>{children}</>
}
