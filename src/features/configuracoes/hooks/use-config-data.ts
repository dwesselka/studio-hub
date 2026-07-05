import { useState, useCallback } from 'react'
import { getConfig, saveConfig } from '../data'
import type { AppConfig } from '../types'

export function useConfigData() {
  const [config, setConfig] = useState(() => getConfig())
  const [saved, setSaved] = useState(false)

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates }
      saveConfig(next)
      return next
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  return { config, updateConfig, saved, isLoading: false, isError: false }
}
