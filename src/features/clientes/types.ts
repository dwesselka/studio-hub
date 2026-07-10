export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  segmento: string
  ultimaVisita: string
  totalVisitas: number
  totalGasto: number
  status: 'ativo' | 'inativo' | 'novo'
  aniversario?: string
}

export type ClienteStatus = 'todos' | 'ativo' | 'inativo' | 'novo'
