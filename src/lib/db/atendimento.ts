import { safeLocalStorage } from '@/lib/storage'
import type { Atendimento, Consumable, ConsumedSupply } from '@/features/atendimento/types'
import { earnPoints } from '@/lib/db/fidelizacao'

const ATENDIMENTO_KEY = 'infinity_atendimentos'
const CONSUMABLE_KEY = 'infinity_consumables'

function loadAtendimentos(): Atendimento[] {
  const raw = safeLocalStorage.getItem(ATENDIMENTO_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAtendimentos(list: Atendimento[]): void {
  safeLocalStorage.setItem(ATENDIMENTO_KEY, JSON.stringify(list))
}

function loadConsumables(): Consumable[] {
  const raw = safeLocalStorage.getItem(CONSUMABLE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveConsumables(list: Consumable[]): void {
  safeLocalStorage.setItem(CONSUMABLE_KEY, JSON.stringify(list))
}

export function seedConsumables(): void {
  const existing = loadConsumables()
  if (existing.length > 0) return

  const defaults: Consumable[] = [
    {
      id: 'c1',
      name: 'Shampoo',
      unit: 'ml',
      currentStock: 5000,
      minStock: 1000,
      category: 'Cabelo',
    },
    {
      id: 'c2',
      name: 'Condicionador',
      unit: 'ml',
      currentStock: 4000,
      minStock: 1000,
      category: 'Cabelo',
    },
    {
      id: 'c3',
      name: 'Máscara Capilar',
      unit: 'ml',
      currentStock: 2000,
      minStock: 500,
      category: 'Cabelo',
    },
    {
      id: 'c4',
      name: 'Tinta Cabelo',
      unit: 'un',
      currentStock: 30,
      minStock: 10,
      category: 'Cabelo',
    },
    {
      id: 'c5',
      name: 'Luva Descartável',
      unit: 'un',
      currentStock: 200,
      minStock: 50,
      category: 'Higiene',
    },
    {
      id: 'c6',
      name: 'Papel Alumínio',
      unit: 'un',
      currentStock: 500,
      minStock: 100,
      category: 'Cabelo',
    },
    { id: 'c7', name: 'Esmalte', unit: 'un', currentStock: 40, minStock: 10, category: 'Unhas' },
    { id: 'c8', name: 'Acetona', unit: 'ml', currentStock: 1000, minStock: 200, category: 'Unhas' },
    { id: 'c9', name: 'Algodão', unit: 'un', currentStock: 300, minStock: 50, category: 'Higiene' },
    {
      id: 'c10',
      name: 'Óleo Essencial',
      unit: 'ml',
      currentStock: 500,
      minStock: 100,
      category: 'Cabelo',
    },
  ]

  saveConsumables(defaults)
}

export function getConsumables(): Consumable[] {
  seedConsumables()
  return loadConsumables()
}

export function updateConsumableStock(
  consumableId: string,
  quantityUsed: number,
): Consumable | null {
  const list = loadConsumables()
  const idx = list.findIndex((c) => c.id === consumableId)
  if (idx === -1) return null

  list[idx] = {
    ...list[idx],
    currentStock: Math.max(0, list[idx].currentStock - quantityUsed),
  }

  saveConsumables(list)
  return list[idx]
}

export function deductSupplies(supplies: ConsumedSupply[]): void {
  for (const s of supplies) {
    updateConsumableStock(s.consumableId, s.quantity)
  }
}

export function getAtendimentosByDate(date: string): Atendimento[] {
  return loadAtendimentos().filter((a) => a.date === date)
}

export function getAtendimentosByClientPhone(phone: string): Atendimento[] {
  return loadAtendimentos()
    .filter((a) => a.clientPhone === phone)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getAtendimentoByAppointment(appointmentId: string): Atendimento | undefined {
  return loadAtendimentos().find((a) => a.appointmentId === appointmentId)
}

export function getAtendimentoById(id: string): Atendimento | undefined {
  return loadAtendimentos().find((a) => a.id === id)
}

export function getAllAtendimentos(): Atendimento[] {
  return loadAtendimentos()
}

function generateId(): string {
  return crypto.randomUUID()
}

export function createAtendimento(data: Omit<Atendimento, 'id' | 'createdAt'>): Atendimento {
  const list = loadAtendimentos()
  const atendimento: Atendimento = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  list.push(atendimento)
  saveAtendimentos(list)
  return atendimento
}

export function updateAtendimento(id: string, updates: Partial<Atendimento>): Atendimento | null {
  const list = loadAtendimentos()
  const idx = list.findIndex((a) => a.id === id)
  if (idx === -1) return null

  list[idx] = { ...list[idx], ...updates, id, updatedAt: new Date().toISOString() }
  saveAtendimentos(list)
  return list[idx]
}

export function completeAtendimento(id: string, supplies: ConsumedSupply[]): Atendimento | null {
  const atendimento = updateAtendimento(id, { status: 'completed', supplies })
  if (atendimento) {
    earnPoints(atendimento.clientPhone, atendimento.clientName, atendimento.totalValue)
  }
  return atendimento
}

export function cancelAtendimento(id: string): Atendimento | null {
  return updateAtendimento(id, { status: 'cancelled' })
}
