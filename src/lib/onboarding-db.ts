import { safeLocalStorage } from '@/lib/storage'
import type {
  AuthUser,
  OnboardingData,
  BusinessData,
  DayHours,
  ServiceItem,
  TeamMember,
  OnboardingProgress,
} from '@/features/onboarding/types'
import { DEFAULT_HOURS, SEGMENT_SERVICES, generateId } from '@/features/onboarding/types'

const AUTH_KEY = 'infinity_auth'
const SESSION_KEY = 'infinity_session'

function createEmptyOnboardingData(): OnboardingData {
  return {
    account: null,
    business: null,
    hours: DEFAULT_HOURS.map((h) => ({ ...h })),
    services: [],
    team: [],
    progress: {
      accountCreated: false,
      businessDataComplete: false,
      hoursConfigured: false,
      servicesReviewed: false,
      teamAdded: false,
    },
    completed: false,
  }
}

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

export function createUser(email: string, password: string, name: string): AuthUser {
  const users = getUsers()

  if (users.find((u) => u.email === email)) {
    throw new Error('Este e-mail já está cadastrado')
  }

  const user: AuthUser = {
    id: generateId(),
    email,
    name,
    hashedPassword: btoa(password),
    onboardingData: createEmptyOnboardingData(),
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

export function updateUserOnboarding(
  userId: string,
  updater: (data: OnboardingData) => OnboardingData,
): AuthUser | null {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return null

  users[index].onboardingData = updater(users[index].onboardingData)
  saveUsers(users)
  return users[index]
}

export function saveBusinessData(userId: string, data: BusinessData): AuthUser | null {
  return updateUserOnboarding(userId, (onboarding) => ({
    ...onboarding,
    business: data,
    progress: { ...onboarding.progress, businessDataComplete: true },
  }))
}

export function saveHours(userId: string, hours: DayHours[]): AuthUser | null {
  return updateUserOnboarding(userId, (onboarding) => ({
    ...onboarding,
    hours,
    progress: { ...onboarding.progress, hoursConfigured: true },
  }))
}

export function saveServices(userId: string, services: ServiceItem[]): AuthUser | null {
  return updateUserOnboarding(userId, (onboarding) => ({
    ...onboarding,
    services,
    progress: { ...onboarding.progress, servicesReviewed: true },
  }))
}

export function saveTeam(userId: string, team: TeamMember[]): AuthUser | null {
  return updateUserOnboarding(userId, (onboarding) => ({
    ...onboarding,
    team,
    progress: { ...onboarding.progress, teamAdded: true },
  }))
}

export function completeOnboarding(userId: string): AuthUser | null {
  return updateUserOnboarding(userId, (onboarding) => ({
    ...onboarding,
    completed: true,
  }))
}

export function getPrePopulatedServices(segmento: string): ServiceItem[] {
  const templates = SEGMENT_SERVICES[segmento]
  if (!templates) return []

  return templates.map((t) => ({
    ...t,
    id: generateId(),
  }))
}

export function calculateProgress(progress: OnboardingProgress): number {
  const steps = [
    progress.accountCreated,
    progress.businessDataComplete,
    progress.hoursConfigured,
    progress.servicesReviewed,
    progress.teamAdded,
  ]
  const completed = steps.filter(Boolean).length
  return Math.round((completed / steps.length) * 100)
}
