export type AtendimentoStatus = 'in-progress' | 'completed' | 'cancelled'

export interface Consumable {
  id: string
  name: string
  unit: 'ml' | 'g' | 'un'
  currentStock: number
  minStock: number
  category?: string
}

export interface ConsumedSupply {
  consumableId: string
  consumableName: string
  quantity: number
  unit: string
}

export interface ServicePerformed {
  serviceId: string
  serviceName: string
  duration: number
  price: number
}

export interface Atendimento {
  id: string
  appointmentId: string
  clientName: string
  clientPhone: string
  professionalId: string
  professionalName: string
  date: string
  startTime: string
  endTime: string
  services: ServicePerformed[]
  supplies: ConsumedSupply[]
  notes: string
  status: AtendimentoStatus
  totalValue: number
  createdAt: string
  updatedAt?: string
}

export const STATUS_LABELS: Record<AtendimentoStatus, string> = {
  'in-progress': 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

export const STATUS_VARIANTS: Record<AtendimentoStatus, string> = {
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'destructive',
}
