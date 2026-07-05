import type { AppConfig } from './types'
import { safeLocalStorage } from '@/lib/storage'

const CONFIG_KEY = 'infinity_config'

export function getConfig(): AppConfig {
  const raw = safeLocalStorage.getItem(CONFIG_KEY)
  if (raw) return JSON.parse(raw)

  const defaults: AppConfig = {
    businessName: 'Meu Negócio',
    businessPhone: '(11) 99999-9999',
    businessEmail: 'contato@meunegocio.com.br',
    businessAddress: 'Rua Exemplo, 123',
    openingHours: 'Seg-Sex: 08h às 18h | Sáb: 08h às 13h',
    defaultAppointmentDuration: 60,
    allowOnlineBooking: true,
    sendReminders: true,
    reminderHoursBefore: 24,
    theme: 'system',
  }
  saveConfig(defaults)
  return defaults
}

export function saveConfig(config: AppConfig): void {
  safeLocalStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}
