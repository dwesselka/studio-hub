export interface ClienteResponse {
  id: string
  nome: string
  email: string
  telefone: string
  segmento: string | null
  ultimaVisita: string | null
  totalVisitas: number
  totalGasto: number
  status: string
  aniversario: string | null
}

export function toClienteResponse(cliente: {
  id: string
  nome: string
  email: string
  telefone: string
  segmento: string | null
  ultimaVisita: string | null
  totalVisitas: number
  totalGasto: number
  status: string
  aniversario: string | null
}): ClienteResponse {
  return {
    id: cliente.id,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    segmento: cliente.segmento,
    ultimaVisita: cliente.ultimaVisita,
    totalVisitas: cliente.totalVisitas,
    totalGasto: cliente.totalGasto,
    status: cliente.status,
    aniversario: cliente.aniversario,
  }
}
