import { motion } from 'framer-motion'
import { Search, Scissors, Clock, DollarSign, Filter } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { OfflineState } from '@/components/ui/state-panel'
import { useServicosData } from '../hooks/use-servicos-data'
import { formatPrice } from '../data'

export function ServicosPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()
  const { servicos, categories, categoryFilter, setCategoryFilter, search, setSearch, isLoading } =
    useServicosData()

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Serviços</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Catálogo de serviços oferecidos</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => setCategoryFilter('todas')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              categoryFilter === 'todas'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : servicos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Nenhum serviço encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{s.name}</h3>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary mt-1">
                    {s.category}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {s.duration} min
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatPrice(s.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
