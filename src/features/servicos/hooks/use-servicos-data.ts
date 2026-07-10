import { useState, useMemo } from 'react'
import { getServicos } from '../data'

export function useServicosData() {
  const [servicos] = useState(() => getServicos())
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todas')

  const categories = useMemo(() => {
    const set = new Set(servicos.map((s) => s.category))
    return Array.from(set).sort()
  }, [servicos])

  const filtered = useMemo(() => {
    let list = servicos
    if (categoryFilter !== 'todas') {
      list = list.filter((s) => s.category === categoryFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((s) => s.name.toLowerCase().includes(q))
    }
    return list
  }, [servicos, categoryFilter, search])

  return {
    servicos: filtered,
    categories,
    categoryFilter,
    setCategoryFilter,
    search,
    setSearch,
    isLoading: false,
    isError: false,
  }
}
