export interface OnboardingProgressResponse {
  accountCreated: boolean
  businessDataComplete: boolean
  hoursConfigured: boolean
  servicesReviewed: boolean
  teamAdded: boolean
}

export interface OnboardingDataResponse {
  account: { email: string; nome: string } | null
  business: {
    nome: string
    segmento: string
    endereco: string
    telefone: string
    logo?: string
  } | null
  hours: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]
  services: { id: string; name: string; duration: number; price: number; category: string }[]
  team: { id: string; name: string; role: string; phone: string; email: string }[]
  progress: OnboardingProgressResponse
  completed: boolean
}

export interface OnboardingProgressResponse {
  progress: OnboardingProgressResponse
  percent: number
  completed: boolean
}
