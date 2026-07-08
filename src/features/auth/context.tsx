import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthUser } from '@/features/onboarding/types'
import { safeLocalStorage } from '@/lib/storage'

const STORAGE_KEY = 'infinity_auth'

interface RawUser {
  id: string
  email: string
  name: string
  credits: number
  plan: string
  businessName?: string | null
  businessSegment?: string | null
  businessAddress?: string | null
  businessPhone?: string | null
  businessLogo?: string | null
  onboardingCompleted?: boolean
  [key: string]: unknown
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthResponse {
  user: RawUser
  accessToken: string
  refreshToken: string
}

interface ApiErrorResponse {
  success: false
  error: { code: string; message: string; details?: unknown }
}

function normalizeUser(raw: RawUser): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    hashedPassword: '',
    credits: raw.credits ?? 0,
    plan: (['starter', 'pro', 'premium'] as const).includes(raw.plan as never)
      ? (raw.plan as AuthUser['plan'])
      : 'starter',
    onboardingData: {
      account: null,
      business: raw.businessName
        ? {
            nome: raw.businessName,
            segmento: raw.businessSegment ?? '',
            endereco: raw.businessAddress ?? '',
            telefone: raw.businessPhone ?? '',
            logo: raw.businessLogo ?? undefined,
          }
        : null,
      hours: [],
      services: [],
      team: [],
      progress: {
        accountCreated: true,
        businessDataComplete: !!raw.businessName,
        hoursConfigured: !!raw.onboardingCompleted,
        servicesReviewed: !!raw.onboardingCompleted,
        teamAdded: !!raw.onboardingCompleted,
      },
      completed: !!raw.onboardingCompleted,
    },
  }
}

function getTokens(): AuthTokens | null {
  const raw = safeLocalStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

function saveTokens(tokens: AuthTokens): void {
  safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

function clearTokens(): void {
  safeLocalStorage.removeItem(STORAGE_KEY)
}

async function refreshTokens(): Promise<boolean> {
  const tokens = getTokens()
  if (!tokens?.refreshToken) return false

  try {
    const res = await fetch('/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })
    const json = await res.json()
    if (!res.ok) return false

    const { accessToken, refreshToken } = (
      json as { data: { accessToken: string; refreshToken: string } }
    ).data
    saveTokens({ accessToken, refreshToken })
    return true
  } catch {
    return false
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  const tokens = getTokens()
  if (tokens?.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`
  }

  const res = await fetch(path, { ...options, headers })
  const json = await res.json()

  if (!res.ok) {
    const err = json as ApiErrorResponse
    throw new Error(err.error?.message || `Erro ${res.status}`)
  }

  return (json as { data: T }).data
}

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signup: (email: string, password: string, name: string) => Promise<AuthUser>
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
  refreshUser: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    const tokens = getTokens()
    if (!tokens?.accessToken) {
      setIsLoading(false)
      return
    }
    try {
      const raw = await apiFetch<RawUser>('/v1/auth/me')
      setUser(normalizeUser(raw))
    } catch {
      const refreshed = await refreshTokens()
      if (refreshed) {
        try {
          const raw = await apiFetch<RawUser>('/v1/auth/me')
          setUser(normalizeUser(raw))
        } catch {
          clearTokens()
          setUser(null)
        }
      } else {
        clearTokens()
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<AuthUser> => {
      const {
        user: raw,
        accessToken,
        refreshToken,
      } = await apiFetch<AuthResponse>('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      })
      const newUser = normalizeUser(raw)
      saveTokens({ accessToken, refreshToken })
      setUser(newUser)
      return newUser
    },
    [],
  )

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const {
      user: raw,
      accessToken,
      refreshToken,
    } = await apiFetch<AuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const authed = normalizeUser(raw)
    saveTokens({ accessToken, refreshToken })
    setUser(authed)
    return authed
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiFetch('/v1/auth/logout', { method: 'POST' })
    } catch {
      // Logout local mesmo se a API falhar
    }
    clearTokens()
    setUser(null)
  }, [])

  const refreshUser = useCallback(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
