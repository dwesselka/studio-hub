import type {
  OnboardingData,
  BusinessData,
  DayHours,
  ServiceItem,
  TeamMember,
  OnboardingProgress,
} from '@/features/onboarding/types'
import { DEFAULT_HOURS, SEGMENT_SERVICES, generateId } from '@/features/onboarding/types'
import { apiClient } from '@/lib/api'
import { safeLocalStorage } from '@/lib/storage'

const STORAGE_KEY = 'infinity_auth'

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const raw = safeLocalStorage.getItem(STORAGE_KEY)
  const tokens: { accessToken?: string } | null = raw ? JSON.parse(raw) : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (tokens?.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`
  }

  const method = (options.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') ?? 'GET'
  const body = options.body ? JSON.parse(options.body as string) : undefined

  const response = await apiClient.request<T>(method, path, { body, headers })
  return response.data
}

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

export async function saveBusinessData(
  data: BusinessData,
): Promise<{ onboardingData: { business: BusinessData } }> {
  return apiFetch('/onboarding/business', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function saveHours(
  hours: DayHours[],
): Promise<{ onboardingData: { hours: DayHours[] } }> {
  return apiFetch('/onboarding/hours', {
    method: 'PUT',
    body: JSON.stringify(hours),
  })
}

export async function saveServices(
  services: ServiceItem[],
): Promise<{ onboardingData: { services: ServiceItem[] } }> {
  const body = services.map(({ name, duration, price, category }) => ({
    name,
    duration,
    price,
    category,
  }))
  return apiFetch('/onboarding/services', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function saveTeam(
  team: TeamMember[],
): Promise<{ onboardingData: { team: TeamMember[] } }> {
  return apiFetch('/onboarding/team', {
    method: 'PUT',
    body: JSON.stringify(team),
  })
}

export async function completeOnboarding(): Promise<{ onboardingData: { completed: boolean } }> {
  return apiFetch('/onboarding/complete', {
    method: 'POST',
  })
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
