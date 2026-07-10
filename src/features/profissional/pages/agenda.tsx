import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useMotionConfig, fadeInUp } from '@/lib/motion'

export function ProfessionalAgenda() {
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Minha Agenda</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Seus agendamentos do dia</p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Nenhum agendamento encontrado para hoje</p>
      </div>
    </motion.div>
  )
}
