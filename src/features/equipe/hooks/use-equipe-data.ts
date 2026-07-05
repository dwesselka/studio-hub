import { useState, useMemo } from 'react'
import { getEquipe } from '../data'

export function useEquipeData() {
  const [membros] = useState(() => getEquipe())
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos')

  const filtered = useMemo(() => {
    if (filter === 'todos') return membros
    return membros.filter((m) => (filter === 'ativos' ? m.active : !m.active))
  }, [membros, filter])

  return { membros: filtered, filter, setFilter, isLoading: false, isError: false }
}
