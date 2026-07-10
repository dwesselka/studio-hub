import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { AuthProvider } from '@/features/auth/context'
import { initMockApi } from '@/lib/api'

initMockApi()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
