import { useEffect } from 'react'
import { scheduleReminders } from '@/lib/agenda-db'
import { executeCampaigns } from '@/lib/pos-atendimento-db'

export function ReminderScheduler() {
  useEffect(() => {
    scheduleReminders()
    executeCampaigns()
    const interval = setInterval(() => {
      scheduleReminders()
      executeCampaigns()
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  return null
}
