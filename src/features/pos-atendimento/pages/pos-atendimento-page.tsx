import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  MessageSquare,
  ThumbsUp,
  Users,
  Star,
  Heart,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { ErrorState, OfflineState } from '@/components/ui/state-panel'
import {
  useCampaigns,
  useFeedback,
  useNPS,
} from '@/features/pos-atendimento/hooks/use-pos-atendimento-data'
import { CampaignCard } from '@/features/pos-atendimento/components/campaign-card'
import { FeedbackForm } from '@/features/pos-atendimento/components/feedback-form'
import { getAllAtendimentos } from '@/lib/atendimento-db'

export function PosAtendimentoPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()

  const {
    data: campaigns = [],
    isError: campaignsError,
    refetch: refetchCampaigns,
  } = useCampaigns()
  const {
    data: feedbackList = [],
    isError: feedbackError,
    refetch: refetchFeedback,
  } = useFeedback()
  const { data: nps, isError: npsError } = useNPS()

  const recentAtendimentos = useMemo(() => {
    return getAllAtendimentos()
      .filter((a) => a.status === 'completed')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10)
  }, [])

  const isError = campaignsError || feedbackError || npsError
  const refetch = () => {
    refetchCampaigns()
    refetchFeedback()
  }

  if (!online) return <OfflineState />
  if (isError) return <ErrorState onRetry={refetch} />

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pós-Atendimento</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Feedback, campanhas automáticas e segmentação de clientes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{nps?.score ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">NPS</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ThumbsUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{nps?.promoters ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">Promotores</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Heart className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{nps?.passive ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">Neutros</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{nps?.detractors ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">Detratores</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Campanhas Automáticas
            </h3>

            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Nenhuma campanha configurada</p>
                <p className="text-xs text-muted-foreground mt-1">
                  As campanhas serão criadas automaticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c, i) => (
                  <CampaignCard key={c.id} campaign={c} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              Avaliar Atendimento
            </h3>

            {recentAtendimentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Heart className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  Nenhum atendimento concluído recentemente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Selecione um atendimento para registrar o feedback:
                </p>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {recentAtendimentos.map((a) => (
                    <details key={a.id} className="group">
                      <summary className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-foreground hover:border-primary/30 transition-colors [&::-webkit-details-marker]:hidden">
                        <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="flex-1 truncate">{a.clientName}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </summary>
                      <div className="mt-2 px-1">
                        <FeedbackForm
                          atendimentoId={a.id}
                          clientName={a.clientName}
                          clientPhone={a.clientPhone}
                        />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Últimas Avaliações
            </h3>

            {feedbackList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Nenhuma avaliação recebida.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {feedbackList.slice(0, 10).map((f) => (
                  <div key={f.id} className="rounded-lg border border-border p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{f.clientName}</span>
                      <span
                        className={`text-xs font-bold ${
                          f.score >= 9
                            ? 'text-success'
                            : f.score <= 6
                              ? 'text-destructive'
                              : 'text-warning'
                        }`}
                      >
                        {f.score}/10
                      </span>
                    </div>
                    {f.comment && (
                      <p className="text-[11px] text-muted-foreground italic">
                        &ldquo;{f.comment}&rdquo;
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(f.createdAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
