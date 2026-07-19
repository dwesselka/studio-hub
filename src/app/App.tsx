import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@/providers'
import { PageLoader } from '@/components/ui/page-loader'
import { ReminderScheduler } from '@/components/reminder-scheduler'
import { AppRoutes } from './routes'

// Registra todos os módulos do client (pilot apenas o agenda por enquanto)
import '@/modules/agenda/index.ts'

export default function App() {
  return (
    <AppProviders>
      <ReminderScheduler />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AppProviders>
  )
}

