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

export function createEmptyOnboardingData(): OnboardingData {
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

export function updateUserOnboarding(
  userId: string,
  updater: (data: OnboardingData) => OnboardingData,
): AuthUser | null {
  const AUTH_KEY = 'infinity_auth'
  const users: AuthUser[] = JSON.parse(safeLocalStorage.getItem(AUTH_KEY) || '[]')
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return null

  users[index].onboardingData = updater(users[index].onboardingData)
  safeLocalStorage.setItem(AUTH_KEY, JSON.stringify(users))
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
