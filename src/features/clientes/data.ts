import type { Cliente } from './types'
import { safeLocalStorage } from '@/lib/storage'

const CLIENTS_KEY = 'infinity_clientes'

export function getClientes(): Cliente[] {
  const raw = safeLocalStorage.getItem(CLIENTS_KEY)
  return raw ? JSON.parse(raw) : seedClientes()
}

export function saveClientes(clientes: Cliente[]): void {
  safeLocalStorage.setItem(CLIENTS_KEY, JSON.stringify(clientes))
}

function seedClientes(): Cliente[] {
  const data: Cliente[] = [
    {
      id: '1',
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 99999-0001',
      segmento: 'salao',
      ultimaVisita: '2026-07-03',
      totalVisitas: 18,
      totalGasto: 2840,
      status: 'ativo',
      aniversario: '15/03',
    },
    {
      id: '2',
      nome: 'Juliana Mendes',
      email: 'juliana@email.com',
      telefone: '(11) 99999-0002',
      segmento: 'salao',
      ultimaVisita: '2026-07-02',
      totalVisitas: 12,
      totalGasto: 1950,
      status: 'ativo',
      aniversario: '22/07',
    },
    {
      id: '3',
      nome: 'Carla Souza',
      email: 'carla@email.com',
      telefone: '(11) 99999-0003',
      segmento: 'barbearia',
      ultimaVisita: '2026-06-28',
      totalVisitas: 8,
      totalGasto: 720,
      status: 'inativo',
    },
    {
      id: '4',
      nome: 'Mariana Lima',
      email: 'mariana@email.com',
      telefone: '(11) 99999-0004',
      segmento: 'salao',
      ultimaVisita: '2026-07-04',
      totalVisitas: 5,
      totalGasto: 620,
      status: 'novo',
      aniversario: '10/12',
    },
    {
      id: '5',
      nome: 'Patrícia Oliveira',
      email: 'patricia@email.com',
      telefone: '(11) 99999-0005',
      segmento: 'clinica',
      ultimaVisita: '2026-07-01',
      totalVisitas: 25,
      totalGasto: 5200,
      status: 'ativo',
      aniversario: '05/09',
    },
    {
      id: '6',
      nome: 'Roberto Alves',
      email: 'roberto@email.com',
      telefone: '(11) 99999-0006',
      segmento: 'barbearia',
      ultimaVisita: '2026-06-25',
      totalVisitas: 3,
      totalGasto: 210,
      status: 'novo',
    },
    {
      id: '7',
      nome: 'Fernanda Santos',
      email: 'fernanda@email.com',
      telefone: '(11) 99999-0007',
      segmento: 'salao',
      ultimaVisita: '2026-07-03',
      totalVisitas: 15,
      totalGasto: 2100,
      status: 'ativo',
      aniversario: '30/01',
    },
    {
      id: '8',
      nome: 'Luciana Pereira',
      email: 'luciana@email.com',
      telefone: '(11) 99999-0008',
      segmento: 'clinica',
      ultimaVisita: '2026-06-15',
      totalVisitas: 2,
      totalGasto: 350,
      status: 'inativo',
    },
  ]
  saveClientes(data)
  return data
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
