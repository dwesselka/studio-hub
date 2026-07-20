import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { AuthProvider } from '@/features/auth/context'
import { WorkspaceProvider } from '@/core/workspace/WorkspaceProvider'
import { RBACProvider } from '@/core/rbac/RBACProvider'
import { NavigationProvider } from '@/core/navigation/NavigationProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <RBACProvider>
              <NavigationProvider>{children}</NavigationProvider>
            </RBACProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
