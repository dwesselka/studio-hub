import { createContext } from 'react'
import type { AuthUser } from '@/features/onboarding/types'

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signup: (email: string, password: string, name: string) => Promise<AuthUser>
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
  refreshUser: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
