import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Gift,
  Star,
  TrendingUp,
  Users,
  Plus,
  Power,
  Edit3,
  Trophy,
  Zap,
  Crown,
} from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { ErrorState, OfflineState } from '@/components/ui/state-panel'
import {
  useLoyaltyProgram,
  useUpdateLoyaltyProgram,
  useClientsPoints,
  usePointsTransactions,
  usePromotions,
  useCreatePromotion,
  useTogglePromotion,
} from '@/features/fidelizacao/hooks/use-fidelizacao-data'
import { sendPromotionNotification } from '@/lib/fidelizacao-db'
import type { LoyaltyPromotion, LoyaltyProgram } from '@/features/fidelizacao/types'
import type { ClientSegment } from '@/features/pos-atendimento/types'
import { SEGMENT_LABELS } from '@/features/pos-atendimento/types'

export function FidelizacaoPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()

  const { data: program, refetch: refetchProgram } = useLoyaltyProgram()
  const { data: clientsPoints = [], refetch: refetchPoints } = useClientsPoints()
  const { data: transactions = [], refetch: refetchTx } = usePointsTransactions()
  const { data: promotions = [], refetch: refetchPromos } = usePromotions()
  const updateProgram = useUpdateLoyaltyProgram()
  const createPromo = useCreatePromotion()
  const togglePromo = useTogglePromotion()

  const [editingRules, setEditingRules] = useState(false)
  const [editProgram, setEditProgram] = useState<LoyaltyProgram | null>(null)
  const [showNewPromo, setShowNewPromo] = useState(false)
  const [newPromo, setNewPromo] = useState({
    name: '',
    segment: 'all' as ClientSegment,
    discountPercent: 10,
    requiredPoints: 0,
    expiresAt: '',
    serviceName: '',
  })

  const isError = false
  const refetch = () => { refetchProgram(); refetchPoints(); refetchTx(); refetchPromos() }

  const totalPointsIssued = clientsPoints.reduce((s, c) => s + c.lifetime, 0)
  const totalPointsActive = clientsPoints.reduce((s, c) => s + c.balance, 0)
  const clientsWithPoints = clientsPoints.filter((c) => c.balance > 0).length

  async function handleSaveRules() {
    if (!editProgram) return
    await updateProgram.mutateAsync(editProgram)
    setEditingRules(false)
  }

  async function handleCreatePromo() {
    if (!newPromo.name || !newPromo.expiresAt) return
    await createPromo.mutateAsync({
      name: newPromo.name,
      segment: newPromo.segment,
      discountPercent: newPromo.discountPercent,
      requiredPoints: newPromo.requiredPoints,
      serviceName: newPromo.serviceName || undefined,
      expiresAt: new Date(newPromo.expiresAt).toISOString(),
      status: 'active',
    })
    setShowNewPromo(false)
    setNewPromo({ name: '', segment: 'all', discountPercent: 10, requiredPoints: 0, expiresAt: '', serviceName: '' })
  }

  async function handleNotify(promo: LoyaltyPromotion) {
    for (const cp of clientsPoints) {
      sendPromotionNotification(cp.clientPhone, cp.clientName || 'Cliente', promo)
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Fidelização</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Programa de pontos, promoções e retenção de clientes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          icon={Star}
          label="Total de Pontos"
          value={String(totalPointsIssued)}
          color="primary"
        />
        <MetricCard
          icon={Zap}
          label="Pontos Ativos"
          value={String(totalPointsActive)}
          color="success"
        />
        <MetricCard
          icon={Users}
          label="Clientes com Pontos"
          value={String(clientsWithPoints)}
          color="info"
        />
        <MetricCard
          icon={Trophy}
          label="Transações"
          value={String(transactions.length)}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Gift className="h-4 w-4 text-muted-foreground" />
              Promoções de Fidelização
            </h3>

            <div className="space-y-2">
              {promotions.map((p) => (
                <PromotionCard
                  key={p.id}
                  promotion={p}
                  onToggle={() => togglePromo.mutateAsync(p.id).then(() => refetchPromos())}
                  onNotify={() => handleNotify(p)}
                />
              ))}
            </div>

            {showNewPromo ? (
              <div className="mt-3 rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Nova Promoção</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Nome</label>
                    <input
                      type="text"
                      value={newPromo.name}
                      onChange={(e) => setNewPromo((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Ex: Desconto de Aniversário"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Segmento</label>
                    <select
                      value={newPromo.segment}
                      onChange={(e) => setNewPromo((p) => ({ ...p, segment: e.target.value as ClientSegment }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {Object.entries(SEGMENT_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Desconto %</label>
                    <input
                      type="number"
                      value={newPromo.discountPercent}
                      onChange={(e) => setNewPromo((p) => ({ ...p, discountPercent: Number(e.target.value) }))}
                      min={0}
                      max={100}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Pontos necessários</label>
                    <input
                      type="number"
                      value={newPromo.requiredPoints}
                      onChange={(e) => setNewPromo((p) => ({ ...p, requiredPoints: Number(e.target.value) }))}
                      min={0}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Validade</label>
                    <input
                      type="date"
                      value={newPromo.expiresAt}
                      onChange={(e) => setNewPromo((p) => ({ ...p, expiresAt: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Serviço (opcional)</label>
                    <input
                      type="text"
                      value={newPromo.serviceName}
                      onChange={(e) => setNewPromo((p) => ({ ...p, serviceName: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Ex: Corte + Escova"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowNewPromo(false)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreatePromo}
                    disabled={createPromo.isPending || !newPromo.name || !newPromo.expiresAt}
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {createPromo.isPending ? 'Criando...' : 'Criar Promoção'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewPromo(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nova Promoção
              </button>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Últimas Transações
            </h3>
            {transactions.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                Nenhuma transação registrada
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {transactions.slice(0, 20).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border border-border p-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-foreground block truncate">
                        {tx.clientName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{tx.description}</span>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span
                        className={`text-xs font-bold ${
                          tx.type === 'earn' ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {tx.type === 'earn' ? '+' : ''}{tx.amount}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        Saldo: {tx.balanceAfter}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Crown className="h-4 w-4 text-muted-foreground" />
              Regras do Programa
            </h3>

            {editingRules ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Pontos por R$ 1
                  </label>
                  <input
                    type="number"
                    value={editProgram?.pointsPerCurrency ?? 10}
                    onChange={(e) =>
                      setEditProgram((p) => p ? { ...p, pointsPerCurrency: Number(e.target.value) } : p)
                    }
                    min={1}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Pontos por visita
                  </label>
                  <input
                    type="number"
                    value={editProgram?.pointsPerVisit ?? 50}
                    onChange={(e) =>
                      setEditProgram((p) => p ? { ...p, pointsPerVisit: Number(e.target.value) } : p)
                    }
                    min={0}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Expiração (dias)
                  </label>
                  <input
                    type="number"
                    value={editProgram?.pointsExpiryDays ?? 180}
                    onChange={(e) =>
                      setEditProgram((p) => p ? { ...p, pointsExpiryDays: Number(e.target.value) } : p)
                    }
                    min={1}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setEditingRules(false)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveRules}
                    disabled={updateProgram.isPending}
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {updateProgram.isPending ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Pontos por R$ 1</span>
                    <span className="font-semibold text-foreground">{program?.pointsPerCurrency ?? 10}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Pontos por visita</span>
                    <span className="font-semibold text-foreground">{program?.pointsPerVisit ?? 50}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Expiração</span>
                    <span className="font-semibold text-foreground">{program?.pointsExpiryDays ?? 180} dias</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Programa ativo</span>
                    <span className={`font-semibold ${program?.enabled ? 'text-success' : 'text-destructive'}`}>
                      {program?.enabled ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditProgram(program ?? null)
                    setEditingRules(true)
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Editar Regras
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Clientes com Mais Pontos
            </h3>
            {clientsPoints.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                Nenhum cliente com pontos
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {clientsPoints.slice(0, 10).map((cp) => (
                  <div
                    key={cp.clientPhone}
                    className="flex items-center justify-between rounded-lg border border-border p-2.5"
                  >
                    <span className="text-xs font-medium text-foreground truncate">
                      {cp.clientName || cp.clientPhone}
                    </span>
                    <span className="text-xs font-bold text-primary">{cp.balance} pts</span>
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

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
}) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    info: 'bg-sky-500/10 text-sky-500',
    secondary: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{value}</p>
          <p className="text-[11px] text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

function PromotionCard({
  promotion,
  onToggle,
  onNotify,
}: {
  promotion: LoyaltyPromotion
  onToggle: () => void
  onNotify: () => void
}) {
  const isActive = promotion.status === 'active'
  const isExpired = new Date(promotion.expiresAt) < new Date()

  return (
    <div className={`rounded-lg border p-3 ${
      isActive ? 'border-border' : 'border-border/50 opacity-70'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{promotion.name}</span>
            {isExpired && (
              <span className="text-[10px] font-medium text-destructive">Expirada</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {SEGMENT_LABELS[promotion.segment]}
            {promotion.discountPercent > 0 && ` · ${promotion.discountPercent}% off`}
            {promotion.requiredPoints > 0 && ` · ${promotion.requiredPoints} pts`}
            {promotion.serviceName && ` · ${promotion.serviceName}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onNotify}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Notificar clientes"
          >
            <Zap className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onToggle}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
              isActive
                ? 'text-success hover:bg-success/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title={isActive ? 'Pausar' : 'Ativar'}
          >
            <Power className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span>Enviadas: {promotion.stats.sent}</span>
        <span>Resgatadas: {promotion.stats.redeemed}</span>
        <span>
          Conversão:{' '}
          {promotion.stats.sent > 0
            ? `${Math.round((promotion.stats.redeemed / promotion.stats.sent) * 100)}%`
            : '-'}
        </span>
      </div>
    </div>
  )
}
