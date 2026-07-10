export interface AtendimentoResponse {
  id: string
  appointmentId: string
  clientName: string
  clientPhone: string
  professionalId: string
  professionalName: string
  date: string
  startTime: string
  endTime: string
  services: { serviceId: string; serviceName: string; duration: number; price: number }[]
  supplies: { consumableId: string; consumableName: string; quantity: number; unit: string }[]
  notes: string | null
  status: string
  totalValue: number
  createdAt: string
  updatedAt: string | null
}

export function toAtendimentoResponse(atendimento: {
  id: string
  appointmentId: string
  clientName: string
  clientPhone: string
  professionalId: string
  professionalName: string
  date: string
  startTime: string
  endTime: string
  services: unknown
  supplies: unknown
  notes: string | null
  status: string
  totalValue: number
  createdAt: Date
  updatedAt: Date | null
}): AtendimentoResponse {
  return {
    id: atendimento.id,
    appointmentId: atendimento.appointmentId,
    clientName: atendimento.clientName,
    clientPhone: atendimento.clientPhone,
    professionalId: atendimento.professionalId,
    professionalName: atendimento.professionalName,
    date: atendimento.date,
    startTime: atendimento.startTime,
    endTime: atendimento.endTime,
    services: atendimento.services as AtendimentoResponse['services'],
    supplies: atendimento.supplies as AtendimentoResponse['supplies'],
    notes: atendimento.notes,
    status: atendimento.status,
    totalValue: atendimento.totalValue,
    createdAt: atendimento.createdAt.toISOString(),
    updatedAt: atendimento.updatedAt?.toISOString() ?? null,
  }
}
