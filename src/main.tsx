/* eslint-disable react-refresh/only-export-components */
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import '@/styles/globals.css'
import { simulator } from '@api'
import { applyEnvironment } from '@api/environment'

const MockDevTools = lazy(() => import('@api/devtools').then((m) => ({ default: m.MockDevTools })))

async function bootstrap() {
  const env = await applyEnvironment()

  const params = new URLSearchParams(window.location.search)
  if (params.get('mockError') === 'true') {
    simulator.updateConfig({ errorRate: 0.3 })
    console.info('[API] Modo de erro ativado (30%)')
  }
  if (params.get('mockLatency')) {
    simulator.updateConfig({ baseLatencyMs: parseInt(params.get('mockLatency')!) })
  }
  if (params.get('mockOffline') === 'true') {
    simulator.updateConfig({ errorRate: 1 })
    console.info('[API] Modo offline simulado')
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
      {env.devToolsEnabled && (
        <Suspense fallback={null}>
          <MockDevTools />
        </Suspense>
      )}
    </StrictMode>,
  )
}

bootstrap()
