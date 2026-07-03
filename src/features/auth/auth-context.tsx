import { useState, useCallback, type ReactNode } from 'react'
import type { AuthUser } from '@/features/onboarding/types'
import { AuthContext } from './auth-context-def'
import {
  createUser,
  authenticateUser,
  setSession,
  clearSession,
  getCurrentUser,
  findUserByEmail,
} from '@/lib/onboarding-db'

function getInitialUser(): AuthUser | null {
  return getCurrentUser()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser)
  const [isLoading] = useState(false)

  const refreshUser = useCallback(() => {
    const current = getCurrentUser()
    setUser(current)
  }, [])

  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<AuthUser> => {
      const existing = findUserByEmail(email)
      if (existing) {
        throw new Error('Este e-mail já está cadastrado')
      }

      await new Promise((r) => setTimeout(r, 400))

      const newUser = createUser(email, password, name)
      setSession(newUser.id)
      setUser(newUser)
      return newUser
    },
    [],
  )

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    await new Promise((r) => setTimeout(r, 400))

    const authed = authenticateUser(email, password)
    if (!authed) {
      throw new Error('E-mail ou senha inválidos')
    }

    setSession(authed.id)
    setUser(authed)
    return authed
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
