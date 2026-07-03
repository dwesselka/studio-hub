import { useState } from 'react'
import { getPrePopulatedServices } from '@/lib/onboarding-db'
import type { ServiceItem } from '@/features/onboarding/types'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface StepServicesProps {
  segmento: string
  defaultServices: ServiceItem[]
  onSubmit: (services: ServiceItem[]) => void
  onBack: () => void
}

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getInitialServices(segmento: string, defaultServices: ServiceItem[]): ServiceItem[] {
  if (defaultServices.length > 0) return defaultServices
  if (!segmento) return []
  return getPrePopulatedServices(segmento)
}

export function StepServices({ segmento, defaultServices, onSubmit, onBack }: StepServicesProps) {
  const [services, setServices] = useState<ServiceItem[]>(() =>
    getInitialServices(segmento, defaultServices),
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', duration: 0, price: 0, category: '' })

  const startEdit = (service: ServiceItem) => {
    setEditingId(service.id)
    setEditForm({
      name: service.name,
      duration: service.duration,
      price: service.price,
      category: service.category,
    })
  }

  const saveEdit = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...editForm } : s)))
    setEditingId(null)
  }

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  const addService = () => {
    const newId = crypto.randomUUID()
    setServices((prev) => [
      ...prev,
      { id: newId, name: 'Novo serviço', duration: 30, price: 0, category: 'Outros' },
    ])
    startEdit({ id: newId, name: 'Novo serviço', duration: 30, price: 0, category: 'Outros' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(services)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Catálogo de serviços</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Revise e edite os serviços pré-configurados para seu segmento
        </p>
      </div>

      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            {editingId === service.id ? (
              <div className="flex w-full flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[8rem]">
                  <label className="text-xs font-medium text-muted-foreground mb-0.5 block">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-0.5 block">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={editForm.duration}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, duration: Number(e.target.value) }))
                    }
                    className="w-20 rounded border border-border bg-background px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-0.5 block">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={editForm.price}
                    onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-24 rounded border border-border bg-background px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="flex gap-1 pt-5">
                  <button
                    type="button"
                    onClick={() => saveEdit(service.id)}
                    className="btn btn--primary btn--sm"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="btn btn--outline btn--sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground block truncate">
                    {service.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{service.category}</span>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {service.duration}min
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  R$ {formatPrice(service.price)}
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(service)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={`Editar ${service.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  aria-label={`Remover ${service.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addService}
        className="btn btn--outline btn--sm w-full justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar serviço
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn btn--outline btn--lg flex-1 justify-center"
        >
          Voltar
        </button>
        <button type="submit" className="btn btn--primary btn--lg flex-1 justify-center">
          Continuar
        </button>
      </div>
    </form>
  )
}
