import { useState } from 'react'
import { motion } from 'framer-motion'
import { Power, Edit3, Send, MessageSquare, TrendingUp, Users } from 'lucide-react'
import type { Campaign } from '@/features/pos-atendimento/types'
import { CAMPAIGN_TYPE_LABELS, SEGMENT_LABELS } from '@/features/pos-atendimento/types'
import {
  useToggleCampaign,
  useUpdateCampaign,
} from '@/features/pos-atendimento/hooks/use-pos-atendimento-data'

interface CampaignCardProps {
  campaign: Campaign
  index: number
}

export function CampaignCard({ campaign, index }: CampaignCardProps) {
  const toggleMut = useToggleCampaign()
  const updateMut = useUpdateCampaign()

  const [editing, setEditing] = useState(false)
  const [editTemplate, setEditTemplate] = useState(campaign.messageTemplate)
  const [editSuggestion, setEditSuggestion] = useState(campaign.serviceSuggestion || '')

  const isActive = campaign.status === 'active'

  const responseRate =
    campaign.stats.sent > 0 ? Math.round((campaign.stats.responded / campaign.stats.sent) * 100) : 0

  const conversionRate =
    campaign.stats.responded > 0
      ? Math.round((campaign.stats.converted / campaign.stats.responded) * 100)
      : 0

  async function handleToggle() {
    await toggleMut.mutateAsync(campaign.id)
  }

  async function handleSave() {
    await updateMut.mutateAsync({
      id: campaign.id,
      updates: {
        messageTemplate: editTemplate,
        ...(campaign.type === 'upsell' ? { serviceSuggestion: editSuggestion } : {}),
      },
    })
    setEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border bg-card shadow-card overflow-hidden ${
        isActive ? 'border-border' : 'border-border/50 opacity-70'
      }`}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{campaign.name}</span>
              <span
                className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                  isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}
              >
                {isActive ? 'Ativa' : 'Pausada'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {CAMPAIGN_TYPE_LABELS[campaign.type]} ·{' '}
              {campaign.type === 'return'
                ? `${campaign.triggerDays} dias sem visita`
                : campaign.type === 'birthday'
                  ? 'No dia do aniversário'
                  : `${campaign.triggerDays} dias após visita`}
            </span>
          </div>

          <button
            onClick={handleToggle}
            disabled={toggleMut.isPending}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isActive
                ? 'bg-success/10 text-success hover:bg-success/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            aria-label={isActive ? 'Pausar campanha' : 'Ativar campanha'}
          >
            <Power className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{SEGMENT_LABELS[campaign.segment]}</span>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                Template da mensagem
              </label>
              <textarea
                value={editTemplate}
                onChange={(e) => setEditTemplate(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Variáveis: {'{{nome}}'}, {'{{link}}'}
                {campaign.type === 'upsell' && `, ${'{{servico}}'}`}
              </p>
            </div>
            {campaign.type === 'upsell' && (
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Serviço sugerido
                </label>
                <input
                  type="text"
                  value={editSuggestion}
                  onChange={(e) => setEditSuggestion(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={updateMut.isPending}
                className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {updateMut.isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {campaign.messageTemplate}
            </p>
            {campaign.type === 'upsell' && campaign.serviceSuggestion && (
              <p className="text-[11px] font-medium text-primary">
                Serviço sugerido: {campaign.serviceSuggestion}
              </p>
            )}
          </div>
        )}

        {!editing && (
          <button
            onClick={() => {
              setEditTemplate(campaign.messageTemplate)
              setEditSuggestion(campaign.serviceSuggestion || '')
              setEditing(true)
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit3 className="h-3 w-3" />
            Editar mensagem
          </button>
        )}

        <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Send className="h-3 w-3" />
              <span>Enviados</span>
            </div>
            <p className="text-sm font-bold text-foreground">{campaign.stats.sent}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <MessageSquare className="h-3 w-3" />
              <span>Respostas</span>
            </div>
            <p className="text-sm font-bold text-foreground">{responseRate}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              <span>Conversão</span>
            </div>
            <p className="text-sm font-bold text-foreground">{conversionRate}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
