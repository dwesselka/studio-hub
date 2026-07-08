import { safeLocalStorage } from '@/lib/storage'
import type { AuthUser } from '@/features/onboarding/types'

const SESSION_KEY = 'infinity_session'
const CREDITS_KEY = 'infinity_credits'

function getCreditsMap(): Record<string, number> {
  const raw = safeLocalStorage.getItem(CREDITS_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveCreditsMap(map: Record<string, number>): void {
  safeLocalStorage.setItem(CREDITS_KEY, JSON.stringify(map))
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
  return { id: userId } as AuthUser
}

export function deductCredit(userId: string): {
  success: boolean
  remaining: number
  error?: string
} {
  const credits = getCreditsMap()
  const current = credits[userId] ?? 5

  if (current <= 0) {
    return { success: false, remaining: 0, error: 'Sem créditos disponíveis' }
  }

  credits[userId] = current - 1
  saveCreditsMap(credits)

  return { success: true, remaining: credits[userId] }
}

export function getUserCredits(userId: string): number {
  const credits = getCreditsMap()
  return credits[userId] ?? 0
}
