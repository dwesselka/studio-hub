import type { ApiRequest, ApiResponse } from './types'
import { ApiRequestError } from './types'
import { apiClient } from './client'

type RouteHandler = (req: ApiRequest) => Promise<ApiResponse> | ApiResponse

interface RouteEntry {
  method: string
  pattern: RegExp
  paramNames: string[]
  handler: RouteHandler
}

export class MockServer {
  private routes: RouteEntry[] = []
  private started = false

  get(pattern: string, handler: RouteHandler): void {
    this.register('GET', pattern, handler)
  }

  post(pattern: string, handler: RouteHandler): void {
    this.register('POST', pattern, handler)
  }

  put(pattern: string, handler: RouteHandler): void {
    this.register('PUT', pattern, handler)
  }

  patch(pattern: string, handler: RouteHandler): void {
    this.register('PATCH', pattern, handler)
  }

  delete(pattern: string, handler: RouteHandler): void {
    this.register('DELETE', pattern, handler)
  }

  private register(method: string, pattern: string, handler: RouteHandler): void {
    const paramNames: string[] = []
    const regexStr = pattern
      .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
        paramNames.push(name)
        return '([^/]+)'
      })
      .replace(/\*/g, '.*')

    this.routes.push({
      method,
      pattern: new RegExp(`^${regexStr}$`),
      paramNames,
      handler,
    })
  }

  private matchRoute(
    method: string,
    path: string,
  ): { handler: RouteHandler; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method) continue
      const match = path.match(route.pattern)
      if (match) {
        const params: Record<string, string> = {}
        for (let i = 0; i < route.paramNames.length; i++) {
          params[route.paramNames[i]] = decodeURIComponent(match[i + 1])
        }
        return { handler: route.handler, params }
      }
    }
    return null
  }

  jsonResponse<T>(data: T, status = 200): ApiResponse<T> {
    return {
      data,
      status,
      statusText: status === 200 ? 'OK' : status === 201 ? 'Created' : 'Error',
      headers: { 'content-type': 'application/json' },
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    }
  }

  start(): void {
    if (this.started) return
    this.started = true

    apiClient.setHandler(async (req) => {
      const normalizedHeaders: Record<string, string> = {}
      if (req.headers) {
        for (const [key, value] of Object.entries(req.headers)) {
          normalizedHeaders[key.toLowerCase()] = value
        }
      }

      const cleanedPath = req.path.replace(/^\/(api|v1)/, '') || '/'
      const match = this.matchRoute(req.method, cleanedPath)

      if (!match) {
        throw ApiRequestError.notFound(`Rota ${req.method} ${cleanedPath} não encontrada`)
      }

      const enrichedReq: ApiRequest = {
        ...req,
        headers: normalizedHeaders,
        params: { ...req.params, ...match.params },
        path: cleanedPath,
      }

      const result = await match.handler(enrichedReq)
      return result
    })
  }

  stop(): void {
    this.started = false
    apiClient.setHandler(null as unknown as (req: ApiRequest) => Promise<ApiResponse>)
  }

  isStarted(): boolean {
    return this.started
  }
}

export const mockServer = new MockServer()
