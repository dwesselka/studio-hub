import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthUser } from '@/features/onboarding/types'
import { safeLocalStorage } from '@/lib/storage'
import { apiClient } from '@/lib/api'

const STORAGE_KEY = 'infinity_auth'

interface RawUser {
  id: string
  email: string
  name: string
  role: string
  businessOwnerId?: string | null
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

function normalizeUser(raw: RawUser): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    role: raw.role as 'lojista' | 'profissional' | 'cliente',
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
    const { data } = await apiClient.post<
      { refreshToken: string },
      { accessToken: string; refreshToken: string }
    >('/v1/auth/refresh', { refreshToken: tokens.refreshToken })
    saveTokens(data)
    return true
  } catch {
    return false
  }
}

function authHeaders(): Record<string, string> {
  const tokens = getTokens()
  return tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(options.headers as Record<string, string>),
  }

  const method = (options.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') ?? 'GET'
  const body = options.body ? JSON.parse(options.body as string) : undefined

  try {
    const response = await apiClient.request<Record<string, unknown>, T>(method, path, {
      body,
      headers,
    })
    return response.data
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err))
  }
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
