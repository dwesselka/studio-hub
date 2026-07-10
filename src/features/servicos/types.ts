import type { ServiceItem } from '@/features/onboarding/types'

export type { ServiceItem }

export interface ServicoCategory {
  id: string
  name: string
  services: ServiceItem[]
}
