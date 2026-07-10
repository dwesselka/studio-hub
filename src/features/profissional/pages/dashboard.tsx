import { motion } from 'framer-motion'
import { Calendar, Clock, DollarSign, Star } from 'lucide-react'
import { useMotionConfig, fadeInUp } from '@/lib/motion'

const metrics = [
  { id: 'hoje', label: 'Atendimentos hoje', value: '4', icon: Calendar, color: 'text-blue-500' },
  {
    id: 'proximo',
    label: 'Próximo agendamento',
    value: '14:30',
    icon: Clock,
    color: 'text-amber-500',
  },
  {
    id: 'receita',
    label: 'Receita do dia',
    value: 'R$ 320',
    icon: DollarSign,
    color: 'text-emerald-500',
  },
  { id: 'avaliacao', label: 'Avaliação média', value: '4.8', icon: Star, color: 'text-purple-500' },
]

export function ProfessionalDashboard() {
  const { transition } = useMotionConfig()

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6 p-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Meu Painel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Resumo da sua agenda e desempenho</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-bold text-foreground">{m.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
