import { useState } from 'react'
import type { TeamMember } from '@/features/onboarding/types'
import { Pencil, Trash2, Plus, User } from 'lucide-react'

interface StepTeamProps {
  defaultTeam: TeamMember[]
  onSubmit: (team: TeamMember[]) => void
  onBack: () => void
  onSkip: () => void
}

const emptyForm = { name: '', role: '', phone: '', email: '' }

export function StepTeam({ defaultTeam, onSubmit, onBack, onSkip }: StepTeamProps) {
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const startAdd = () => {
    const newId = crypto.randomUUID()
    setEditingId(newId)
    setForm({ name: '', role: '', phone: '', email: '' })
  }

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setForm({ name: member.name, role: member.role, phone: member.phone, email: member.email })
  }

  const saveMember = () => {
    if (!form.name.trim()) return

    if (editingId && team.find((m) => m.id === editingId)) {
      setTeam((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...form } : m)))
    } else if (editingId) {
      setTeam((prev) => [...prev, { id: editingId, ...form }])
    }
    resetForm()
  }

  const removeMember = (id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(team)
  }

  const hasMember = team.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Equipe</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Cadastre os profissionais que trabalham no seu negócio
        </p>
      </div>

      {hasMember && (
        <div className="space-y-2">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground block truncate">
                  {member.name}
                </span>
                <span className="text-xs text-muted-foreground">{member.role}</span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">{member.phone}</span>
              <button
                type="button"
                onClick={() => startEdit(member)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={`Editar ${member.name}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeMember(member.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                aria-label={`Remover ${member.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editingId ? (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            {team.find((m) => m.id === editingId) ? 'Editar profissional' : 'Novo profissional'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-0.5 block">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-sm"
                placeholder="Nome do profissional"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-0.5 block">
                Função
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-sm"
                placeholder="Cabelereiro, barbeiro..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-0.5 block">
                Telefone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-sm"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-0.5 block">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-sm"
                placeholder="profissional@email.com"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={saveMember} className="btn btn--primary btn--sm">
              Salvar
            </button>
            <button type="button" onClick={resetForm} className="btn btn--outline btn--sm">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={startAdd}
          className="btn btn--outline btn--sm w-full justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar profissional
        </button>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn btn--outline btn--lg flex-1 justify-center"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="btn btn--outline btn--lg flex-1 justify-center"
        >
          Pular etapa
        </button>
        <button type="submit" className="btn btn--primary btn--lg flex-[2] justify-center">
          {hasMember ? 'Finalizar cadastro' : 'Pular e finalizar'}
        </button>
      </div>
    </form>
  )
}
