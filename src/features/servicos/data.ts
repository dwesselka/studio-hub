import type { ServiceItem } from './types'
import { safeLocalStorage } from '@/lib/storage'

const SERVICES_KEY = 'infinity_servicos'

export function getServicos(): ServiceItem[] {
  const raw = safeLocalStorage.getItem(SERVICES_KEY)
  if (raw) return JSON.parse(raw)

  const seed: ServiceItem[] = [
    { id: '1', name: 'Corte Feminino', duration: 60, price: 8000, category: 'Corte' },
    { id: '2', name: 'Escova', duration: 45, price: 6000, category: 'Finalização' },
    { id: '3', name: 'Coloração', duration: 120, price: 15000, category: 'Coloração' },
    { id: '4', name: 'Manicure', duration: 40, price: 4500, category: 'Mãos & Pés' },
    { id: '5', name: 'Pedicure', duration: 40, price: 4500, category: 'Mãos & Pés' },
    { id: '6', name: 'Hidratação', duration: 50, price: 7000, category: 'Tratamento' },
    { id: '7', name: 'Corte Masculino', duration: 40, price: 5000, category: 'Corte' },
    { id: '8', name: 'Barba', duration: 30, price: 3500, category: 'Barba' },
    { id: '9', name: 'Limpeza de Pele', duration: 60, price: 12000, category: 'Estética Facial' },
    {
      id: '10',
      name: 'Design de Sobrancelhas',
      duration: 20,
      price: 3000,
      category: 'Sobrancelha',
    },
  ]
  saveServicos(seed)
  return seed
}

export function saveServicos(servicos: ServiceItem[]): void {
  safeLocalStorage.setItem(SERVICES_KEY, JSON.stringify(servicos))
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
