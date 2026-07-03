import { memo } from 'react'
import { AlertCircle, RefreshCw, WifiOff, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface StatePanelProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

function StatePanel({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
}: StatePanelProps & { icon: typeof AlertCircle }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        {actionLabel && onAction && (
          <Button className="mt-6" onClick={onAction} variant="outline">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export const ErrorState = memo(function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StatePanel
      icon={AlertCircle}
      title="Não foi possível carregar os dados"
      description="Ocorreu um erro ao buscar as informações do dashboard. Tente novamente em instantes."
      actionLabel="Tentar novamente"
      onAction={onRetry}
    />
  )
})

export const EmptyState = memo(function EmptyState() {
  return (
    <StatePanel
      icon={Inbox}
      title="Nenhum dado disponível"
      description="Ainda não há métricas para exibir. Comece registrando agendamentos e clientes."
    />
  )
})

export const OfflineState = memo(function OfflineState() {
  return (
    <StatePanel
      icon={WifiOff}
      title="Você está offline"
      description="Conecte-se à internet para visualizar os dados mais recentes do seu negócio."
    />
  )
})
