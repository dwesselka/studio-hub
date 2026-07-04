import { safeLocalStorage } from '@/lib/storage'
import type { AuthUser } from '@/features/onboarding/types'
import { createEmptyOnboardingData } from '@/features/onboarding/db'
import { generateId } from '@/features/onboarding/types'

const AUTH_KEY = 'infinity_auth'
const SESSION_KEY = 'infinity_session'

export function getUsers(): AuthUser[] {
  const raw = safeLocalStorage.getItem(AUTH_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveUsers(users: AuthUser[]): void {
  safeLocalStorage.setItem(AUTH_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): AuthUser | undefined {
  return getUsers().find((u) => u.email === email)
}

export function findUserById(id: string): AuthUser | undefined {
  return getUsers().find((u) => u.id === id)
}

export function createUser(
  email: string,
  password: string,
  name: string,
  plan: AuthUser['plan'] = 'starter',
): AuthUser {
  const users = getUsers()

  if (users.find((u) => u.email === email)) {
    throw new Error('Este e-mail já está cadastrado')
  }

  const creditMap: Record<AuthUser['plan'], number> = {
    starter: 5,
    pro: 20,
    premium: 999,
  }

  const user: AuthUser = {
    id: generateId(),
    email,
    name,
    hashedPassword: btoa(password),
    onboardingData: createEmptyOnboardingData(),
    credits: creditMap[plan],
    plan,
  }

  user.onboardingData.account = { email, password, nome: name }
  user.onboardingData.progress.accountCreated = true

  users.push(user)
  saveUsers(users)
  return user
}

export function authenticateUser(email: string, password: string): AuthUser | null {
  const user = findUserByEmail(email)
  if (!user) return null
  if (user.hashedPassword !== btoa(password)) return null
  return user
}

export function setSession(userId: string): void {
  safeLocalStorage.setItem(SESSION_KEY, userId)
}

export function clearSession(): void {
  safeLocalStorage.removeItem(SESSION_KEY)
}

export function getSessionUserId(): string | null {
  return safeLocalStorage.getItem(SESSION_KEY)
}

export function getCurrentUser(): AuthUser | null {
  const userId = getSessionUserId()
  if (!userId) return null
  return findUserById(userId) ?? null
}

export function updateUser(userId: string, updater: (user: AuthUser) => AuthUser): AuthUser | null {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return null

  users[index] = updater(users[index])
  saveUsers(users)
  return users[index]
}

export function deductCredit(userId: string): {
  success: boolean
  remaining: number
  error?: string
} {
  const user = findUserById(userId)
  if (!user) return { success: false, remaining: 0, error: 'Usuário não encontrado' }
  if (user.credits <= 0) return { success: false, remaining: 0, error: 'Sem créditos disponíveis' }

  const updated = updateUser(userId, (u) => ({ ...u, credits: u.credits - 1 }))
  if (!updated) return { success: false, remaining: 0, error: 'Erro ao atualizar' }

  return { success: true, remaining: updated.credits }
}

export function getUserCredits(userId: string): number {
  const user = findUserById(userId)
  return user?.credits ?? 0
}
