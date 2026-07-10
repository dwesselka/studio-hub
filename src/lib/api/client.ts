import type { ApiRequest, ApiResponse } from './types'
import { ApiRequestError } from './types'
import { simulator } from './simulator'

type RequestInterceptor = (req: ApiRequest) => ApiRequest | Promise<ApiRequest>
type ResponseInterceptor = (res: ApiResponse) => ApiResponse | Promise<ApiResponse>
type ErrorInterceptor = (
  err: ApiRequestError,
  req: ApiRequest,
) => ApiRequestError | Promise<ApiRequestError>

type RequestHandler = (req: ApiRequest) => Promise<ApiResponse>

interface PendingRequest {
  controller: AbortController
  timestamp: number
}

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []
  private handler: RequestHandler | null = null
  private pending: Map<string, PendingRequest> = new Map()
  private cache = new Map<string, { data: unknown; expiresAt: number }>()

  onRequest(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor)
    return () => {
      const idx = this.requestInterceptors.indexOf(interceptor)
      if (idx >= 0) this.requestInterceptors.splice(idx, 1)
    }
  }

  onResponse(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor)
    return () => {
      const idx = this.responseInterceptors.indexOf(interceptor)
      if (idx >= 0) this.responseInterceptors.splice(idx, 1)
    }
  }

  onError(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor)
    return () => {
      const idx = this.errorInterceptors.indexOf(interceptor)
      if (idx >= 0) this.errorInterceptors.splice(idx, 1)
    }
  }

  setHandler(handler: RequestHandler): void {
    this.handler = handler
  }

  private getCacheKey(req: ApiRequest): string {
    return `${req.method}:${req.path}:${JSON.stringify(req.params ?? {})}`
  }

  private isDeduplicable(req: ApiRequest): boolean {
    return req.method === 'GET'
  }

  private async executeWithRetry(req: ApiRequest, attempt = 0): Promise<ApiResponse> {
    if (!this.handler) {
      throw ApiRequestError.serverError('Mock server não configurado')
    }

    const config = simulator.getConfig()

    try {
      const response = await simulator.simulate(req.method, req.path, async () => {
        return await this.handler!(req)
      })

      return response
    } catch (err) {
      const apiError =
        err instanceof ApiRequestError ? err : ApiRequestError.serverError((err as Error).message)

      const shouldRetry =
        attempt < config.retryCount &&
        (apiError.status >= 500 || apiError.status === 429 || apiError.status === 0)

      if (shouldRetry) {
        await new Promise((r) => setTimeout(r, config.retryDelayMs * (attempt + 1)))
        return this.executeWithRetry(req, attempt + 1)
      }
      throw apiError
    }
  }

  async request<TBody = unknown, TResponse = unknown>(
    method: string,
    path: string,
    options: {
      body?: TBody
      params?: Record<string, string>
      headers?: Record<string, string>
      cacheMs?: number
      deduplicate?: boolean
      signal?: AbortSignal
    } = {},
  ): Promise<ApiResponse<TResponse>> {
    let req: ApiRequest = {
      method: method as ApiRequest['method'],
      path,
      params: options.params,
      body: options.body as Record<string, unknown>,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    }

    for (const interceptor of this.requestInterceptors) {
      req = await interceptor(req)
    }

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        throw ApiRequestError.timeout('Requisição cancelada')
      })
    }

    const cacheKey = this.getCacheKey(req)
    const canCache = options.cacheMs && options.cacheMs > 0 && this.isDeduplicable(req)
    const canDedupe = options.deduplicate !== false && this.isDeduplicable(req)

    if (canCache) {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data as ApiResponse<TResponse>
      }
    }

    if (canDedupe) {
      const pending = this.pending.get(cacheKey)
      if (pending) {
        throw ApiRequestError.conflict('Requisição duplicada em andamento')
      }
    }

    const controller = new AbortController()
    if (canDedupe) {
      this.pending.set(cacheKey, { controller, timestamp: Date.now() })
    }

    try {
      let response = await this.executeWithRetry(req)

      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response)
      }

      if (canCache) {
        this.cache.set(cacheKey, { data: response, expiresAt: Date.now() + options.cacheMs! })
      }

      return response as ApiResponse<TResponse>
    } catch (err) {
      let error =
        err instanceof ApiRequestError ? err : ApiRequestError.serverError((err as Error).message)

      for (const interceptor of this.errorInterceptors) {
        error = await interceptor(error, req)
      }

      throw error
    } finally {
      if (canDedupe) {
        this.pending.delete(cacheKey)
      }
    }
  }

  get<TResponse = unknown>(
    path: string,
    options?: {
      params?: Record<string, string>
      headers?: Record<string, string>
      cacheMs?: number
      signal?: AbortSignal
    },
  ): Promise<ApiResponse<TResponse>> {
    return this.request('GET', path, options)
  }

  post<TBody = unknown, TResponse = unknown>(
    path: string,
    body?: TBody,
    options?: {
      params?: Record<string, string>
      headers?: Record<string, string>
      signal?: AbortSignal
    },
  ): Promise<ApiResponse<TResponse>> {
    return this.request('POST', path, { ...options, body })
  }

  put<TBody = unknown, TResponse = unknown>(
    path: string,
    body?: TBody,
    options?: {
      params?: Record<string, string>
      headers?: Record<string, string>
      signal?: AbortSignal
    },
  ): Promise<ApiResponse<TResponse>> {
    return this.request('PUT', path, { ...options, body })
  }

  patch<TBody = unknown, TResponse = unknown>(
    path: string,
    body?: TBody,
    options?: {
      params?: Record<string, string>
      headers?: Record<string, string>
      signal?: AbortSignal
    },
  ): Promise<ApiResponse<TResponse>> {
    return this.request('PATCH', path, { ...options, body })
  }

  delete<TResponse = unknown>(
    path: string,
    options?: {
      params?: Record<string, string>
      headers?: Record<string, string>
      signal?: AbortSignal
    },
  ): Promise<ApiResponse<TResponse>> {
    return this.request('DELETE', path, options ?? {})
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) this.cache.delete(key)
      }
    } else {
      this.cache.clear()
    }
  }

  clearPending(): void {
    for (const [, pending] of this.pending) {
      pending.controller.abort()
    }
    this.pending.clear()
  }

  reset(): void {
    this.cache.clear()
    this.clearPending()
    this.requestInterceptors = []
    this.responseInterceptors = []
    this.errorInterceptors = []
  }
}

export const apiClient = new ApiClient()
