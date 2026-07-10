import { motion } from 'framer-motion'
import { Search, Users, Mail, Phone, Calendar, Filter } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { OfflineState } from '@/components/ui/state-panel'
import { useClientesData } from '../hooks/use-clientes-data'
import { formatCurrency } from '../data'
import type { ClienteStatus } from '../types'

const FILTERS: { key: ClienteStatus; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'ativo', label: 'Ativos' },
  { key: 'inativo', label: 'Inativos' },
  { key: 'novo', label: 'Novos' },
]

export function ClientesPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()

  const { clientes, statusFilter, setStatusFilter, search, setSearch, isLoading } =
    useClientesData()

  if (!online) return <OfflineState />

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie sua base de clientes</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : clientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                    Contato
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                    Visitas
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                    Total Gasto
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">
                    Última Visita
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{c.nome}</span>
                      <span className="block text-[11px] text-muted-foreground sm:hidden">
                        {c.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {c.telefone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-foreground">{c.totalVisitas}x</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-medium text-foreground">
                        {formatCurrency(c.totalGasto)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(c.ultimaVisita + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          c.status === 'ativo'
                            ? 'bg-success/10 text-success'
                            : c.status === 'novo'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {c.status === 'ativo' ? 'Ativo' : c.status === 'novo' ? 'Novo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}
