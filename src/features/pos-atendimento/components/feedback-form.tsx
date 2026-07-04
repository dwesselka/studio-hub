import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, ThumbsUp } from 'lucide-react'
import { useSubmitFeedback } from '@/features/pos-atendimento/hooks/use-pos-atendimento-data'
import { getFeedbackByAtendimento } from '@/lib/pos-atendimento-db'
import type { FeedbackScore } from '@/features/pos-atendimento/types'

interface FeedbackFormProps {
  atendimentoId: string
  clientName: string
  clientPhone: string
}

const SCORE_LABELS: Record<FeedbackScore, string> = {
  0: 'Péssimo',
  1: 'Muito Ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Regular+',
  5: 'Razoável',
  6: 'Bom',
  7: 'Bom+',
  8: 'Ótimo',
  9: 'Excelente',
  10: 'Perfeito',
}

const NPS_CATEGORIES = {
  detractors: [0, 1, 2, 3, 4, 5, 6] as FeedbackScore[],
  passive: [7, 8] as FeedbackScore[],
  promoters: [9, 10] as FeedbackScore[],
}

export function FeedbackForm({ atendimentoId, clientName, clientPhone }: FeedbackFormProps) {
  const submit = useSubmitFeedback()
  const existing = getFeedbackByAtendimento(atendimentoId)

  const [score, setScore] = useState<FeedbackScore | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (existing) {
    const isPromoter = existing.score >= 9
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
        <div className="flex justify-center">
          <ThumbsUp
            className={`h-10 w-10 ${isPromoter ? 'text-success' : existing.score <= 6 ? 'text-destructive' : 'text-warning'}`}
          />
        </div>
        <p className="text-sm font-medium text-foreground">Avaliação registrada</p>
        <p className="text-3xl font-bold text-foreground">{existing.score}/10</p>
        {existing.comment && (
          <p className="text-xs text-muted-foreground italic">&ldquo;{existing.comment}&rdquo;</p>
        )}
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
        <div className="flex justify-center">
          <Send className="h-10 w-10 text-success" />
        </div>
        <p className="text-sm font-medium text-foreground">Obrigado pelo feedback!</p>
        <p className="text-xs text-muted-foreground">
          Sua opinião nos ajuda a melhorar cada vez mais.
        </p>
      </div>
    )
  }

  async function handleSubmit() {
    if (score === null) return
    await submit.mutateAsync({
      atendimentoId,
      clientName,
      clientPhone,
      score,
      comment: comment.trim(),
    })
    setSubmitted(true)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          {clientName}, como foi sua experiência?
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          De 0 a 10, o quanto você recomendaria nosso serviço?
        </p>
      </div>

      <div className="flex justify-center gap-1">
        {([...Array(11)] as FeedbackScore[]).map((_, i) => {
          const value = i as FeedbackScore
          const isPassive = NPS_CATEGORIES.passive.includes(value)
          const isPromoter = NPS_CATEGORIES.promoters.includes(value)

          return (
            <button
              key={value}
              type="button"
              onClick={() => setScore(value)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                score === value
                  ? isPromoter
                    ? 'bg-success text-success-foreground scale-110'
                    : isPassive
                      ? 'bg-warning text-warning-foreground scale-110'
                      : 'bg-destructive text-destructive-foreground scale-110'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {value}
            </button>
          )
        })}
      </div>

      <div className="flex justify-center">
        {score !== null && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              NPS_CATEGORIES.promoters.includes(score)
                ? 'bg-success/10 text-success'
                : NPS_CATEGORIES.passive.includes(score)
                  ? 'bg-warning/10 text-warning-foreground'
                  : 'bg-destructive/10 text-destructive'
            }`}
          >
            {SCORE_LABELS[score]}
          </motion.span>
        )}
      </div>

      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Quer deixar um comentário? (opcional)"
          rows={3}
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={score === null || submit.isPending}
        className="btn btn--primary btn--lg btn--block w-full justify-center gap-2"
      >
        <Send className="h-4 w-4" />
        {submit.isPending ? 'Enviando...' : 'Enviar avaliação'}
      </button>
    </div>
  )
}
