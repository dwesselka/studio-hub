import { motion } from 'framer-motion'
import { ClipboardCheck } from 'lucide-react'
import { useMotionConfig, fadeInUp } from '@/lib/motion'

export function ProfessionalAtendimentos() {
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus Atendimentos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Histórico dos seus atendimentos realizados
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Nenhum atendimento registrado</p>
      </div>
    </motion.div>
  )
}
