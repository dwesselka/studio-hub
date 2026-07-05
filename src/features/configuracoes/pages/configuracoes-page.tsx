import { motion } from 'framer-motion'
import { Settings, Bell, Clock, Globe, Save } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { OfflineState } from '@/components/ui/state-panel'
import { useConfigData } from '../hooks/use-config-data'
import type { AppConfig } from '../types'

export function ConfiguracoesPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()
  const { config, updateConfig, saved } = useConfigData()

  if (!online) return <OfflineState />

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Preferências do seu negócio</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <Save className="h-3.5 w-3.5" />
            Salvo!
          </span>
        )}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
          <Settings className="h-4 w-4 text-muted-foreground" />
          Dados do Negócio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome do negócio">
            <input
              type="text"
              value={config.businessName}
              onChange={(e) => updateConfig({ businessName: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="Telefone">
            <input
              type="text"
              value={config.businessPhone}
              onChange={(e) => updateConfig({ businessPhone: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="E-mail">
            <input
              type="email"
              value={config.businessEmail}
              onChange={(e) => updateConfig({ businessEmail: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="Endereço">
            <input
              type="text"
              value={config.businessAddress}
              onChange={(e) => updateConfig({ businessAddress: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="Horário de funcionamento" className="sm:col-span-2">
            <input
              type="text"
              value={config.openingHours}
              onChange={(e) => updateConfig({ openingHours: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Agendamentos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Duração padrão (minutos)">
            <input
              type="number"
              value={config.defaultAppointmentDuration}
              onChange={(e) => updateConfig({ defaultAppointmentDuration: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="Agendamento online">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowOnlineBooking}
                onChange={(e) => updateConfig({ allowOnlineBooking: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-muted-foreground">Permitir agendamento online</span>
            </label>
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
          <Bell className="h-4 w-4 text-muted-foreground" />
          Notificações
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Lembretes">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.sendReminders}
                onChange={(e) => updateConfig({ sendReminders: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-muted-foreground">Enviar lembretes automáticos</span>
            </label>
          </Field>
          <Field label="Antecedência (horas)">
            <input
              type="number"
              value={config.reminderHoursBefore}
              onChange={(e) => updateConfig({ reminderHoursBefore: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
          <Globe className="h-4 w-4 text-muted-foreground" />
          Aparência
        </h2>
        <Field label="Tema">
          <select
            value={config.theme}
            onChange={(e) => updateConfig({ theme: e.target.value as AppConfig['theme'] })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="system">Sistema</option>
          </select>
        </Field>
      </section>
    </motion.div>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  )
}
