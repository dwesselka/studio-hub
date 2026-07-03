/* eslint-disable react-refresh/only-export-components */
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import '@/styles/globals.css'
import { initMockApi, simulator } from '@/lib/api'

const MockDevTools = lazy(() =>
  import('@/lib/api/devtools').then((m) => ({ default: m.MockDevTools })),
)

initMockApi()

if (import.meta.env.DEV) {
  simulator.updateConfig({ baseLatencyMs: 300, jitterMs: 100, errorRate: 0 })

  const params = new URLSearchParams(window.location.search)
  if (params.get('mockError') === 'true') {
    simulator.updateConfig({ errorRate: 0.3 })
    console.info('[API Mock] Modo de erro ativado (30%)')
  }
  if (params.get('mockLatency')) {
    simulator.updateConfig({ baseLatencyMs: parseInt(params.get('mockLatency')!) })
  }
  if (params.get('mockOffline') === 'true') {
    simulator.updateConfig({ errorRate: 1 })
    console.info('[API Mock] Modo offline simulado')
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {import.meta.env.DEV && (
      <Suspense fallback={null}>
        <MockDevTools />
      </Suspense>
    )}
  </StrictMode>,
)
