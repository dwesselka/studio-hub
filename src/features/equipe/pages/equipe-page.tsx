import { motion } from 'framer-motion'
import { UserCog, Phone, Mail, Tag, CheckCircle, XCircle } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { OfflineState } from '@/components/ui/state-panel'
import { Badge } from '@/components/ui/badge'
import { useEquipeData } from '../hooks/use-equipe-data'

export function EquipePage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()
  const { membros, filter, setFilter, isLoading } = useEquipeData()

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Equipe</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os profissionais do seu negócio
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(['todos', 'ativos', 'inativos'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'todos' ? 'Todos' : f === 'ativos' ? 'Ativos' : 'Inativos'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : membros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Nenhum profissional encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {membros.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{m.name}</h3>
                    <span className="text-xs text-muted-foreground">{m.role}</span>
                  </div>
                </div>
                {m.active ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {m.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {m.phone}
                </span>
                {m.commission && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Comissão: {m.commission}%
                  </span>
                )}
              </div>

              {m.specialties && m.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
