import type { Membro } from './types'
import { safeLocalStorage } from '@/lib/storage'

const TEAM_KEY = 'infinity_equipe'

export function getEquipe(): Membro[] {
  const raw = safeLocalStorage.getItem(TEAM_KEY)
  if (raw) return JSON.parse(raw)

  const seed: Membro[] = [
    {
      id: '1',
      name: 'Carla Mendes',
      role: 'Cabeleireira',
      phone: '(11) 98888-0001',
      email: 'carla@exemplo.com',
      active: true,
      commission: 40,
      specialties: ['Corte', 'Coloração'],
    },
    {
      id: '2',
      name: 'Roberto Lima',
      role: 'Barbeiro',
      phone: '(11) 98888-0002',
      email: 'roberto@exemplo.com',
      active: true,
      commission: 35,
      specialties: ['Corte Masculino', 'Barba'],
    },
    {
      id: '3',
      name: 'Juliana Costa',
      role: 'Manicure',
      phone: '(11) 98888-0003',
      email: 'juliana@exemplo.com',
      active: true,
      commission: 30,
      specialties: ['Manicure', 'Pedicure'],
    },
    {
      id: '4',
      name: 'Dr. Fábio Santos',
      role: 'Esteticista',
      phone: '(11) 98888-0004',
      email: 'fabio@exemplo.com',
      active: false,
      commission: 45,
      specialties: ['Limpeza de Pele', 'Laser'],
    },
  ]
  saveEquipe(seed)
  return seed
}

export function saveEquipe(membros: Membro[]): void {
  safeLocalStorage.setItem(TEAM_KEY, JSON.stringify(membros))
}
