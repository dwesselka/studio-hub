import type { ApiRequest, ApiResponse } from './types'
import { ApiRequestError } from './types'

// Em desenvolvimento: VITE_API_URL não definido → base = '/v1' → usa proxy do Vite (sem CORS)
// Em produção/homologação: VITE_API_URL aponta para a URL real da API
const REAL_API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '/v1'

interface ApiEnvelope<T = unknown> {
  data?: T
  error?: { code?: string; message?: string; details?: unknown }
  meta?: { requestId?: string; timestamp?: string }
}

async function getAuthToken(): Promise<string | null> {
  try {
    const raw = localStorage.getItem('infinity_auth_tokens')
    if (raw) {
      const { accessToken } = JSON.parse(raw)
      return accessToken || null
    }
  } catch {
    return null
  }
  return null
}

export async function realApiHandler(req: ApiRequest): Promise<ApiResponse> {
  const url = new URL(`${REAL_API_BASE}${req.path}`, window.location.origin)

  if (req.params) {
    for (const [key, value] of Object.entries(req.params)) {
      url.searchParams.set(key, value)
    }
  }

  const token = await getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(req.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: req.body ? JSON.stringify(req.body) : undefined,
    })

    const data: ApiEnvelope = await response.json()

    if (!response.ok) {
      throw new ApiRequestError(
        data.error?.code || 'SERVER_ERROR',
        data.error?.message || 'Erro no servidor',
        response.status,
        data.meta?.requestId || crypto.randomUUID(),
        data.error?.details,
      )
    }

    return {
      data: data.data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: data.meta?.timestamp || new Date().toISOString(),
      requestId: data.meta?.requestId || crypto.randomUUID(),
    }
  } catch (err) {
    if (err instanceof ApiRequestError) throw err
    throw ApiRequestError.serverError((err as Error).message)
  }
}
