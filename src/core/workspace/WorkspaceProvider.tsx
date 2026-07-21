import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Workspace, WorkspaceMember, WorkspaceRole } from '@shared/types/workspace.ts'
import { useAuth } from '@/features/auth/use-auth'
//import { apiClient } from '@/lib/api'

interface WorkspaceContextValue {
  workspace: Workspace | null
  member: WorkspaceMember | null
  role: WorkspaceRole | null
  isLoading: boolean
  error: Error | null
  refreshWorkspace: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [member, setMember] = useState<WorkspaceMember | null>(null)
  const [role, setRole] = useState<WorkspaceRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<Error | null>(null)

  const fetchWorkspace = async () => {
    if (!user) {
      setWorkspace(null)
      setMember(null)
      setRole(null)
      setIsLoading(false)
      return
    }

    /*try {
      setIsLoading(true)
      // Endpoint que retorna o workspace ativo do usuário (baseado no X-Workspace ou padrão)
      const res = await apiClient.get('/workspace/active')
      const data = res.data as {
        workspace: Workspace
        member: WorkspaceMember
        role: WorkspaceRole
      
      }  

      setWorkspace(data.workspace)
      setMember(data.member)
      setRole(data.role)
      setError(null)
    } catch (err) {
      console.error('[WorkspaceProvider] Error fetching workspace:', err)
      setError(err instanceof Error ? err : new Error('Failed to load workspace'))
    } finally {
      setIsLoading(false)
    }*/
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkspace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        member,
        role,
        isLoading,
        error,
        refreshWorkspace: fetchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return ctx
}
