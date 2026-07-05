import { useState, useMemo, useCallback } from 'react'
import { getClientes } from '../data'
import type { ClienteStatus } from '../types'

export function useClientesData() {
  const [statusFilter, setStatusFilter] = useState<ClienteStatus>('todos')
  const [search, setSearch] = useState('')
  const [clientes, setClientes] = useState(() => getClientes())

  const filtered = useMemo(() => {
    let list = clientes
    if (statusFilter !== 'todos') {
      list = list.filter((c) => c.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) => c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
      )
    }
    return list
  }, [clientes, statusFilter, search])

  const refetch = useCallback(() => {
    setClientes(getClientes())
  }, [])

  return {
    clientes: filtered,
    allClientes: clientes,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    isLoading: false,
    isError: false,
    refetch,
  }
}
