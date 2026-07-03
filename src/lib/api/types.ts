export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequest<TBody = unknown> {
  method: HttpMethod
  path: string
  params?: Record<string, string>
  body?: TBody
  headers?: Record<string, string>
}

export interface ApiResponse<TData = unknown> {
  data: TData
  status: number
  statusText: string
  headers: Record<string, string>
  timestamp: string
  requestId: string
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
  status: number
  requestId: string
}

export class ApiRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly requestId: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }

  static unauthorized(msg = 'Não autorizado'): ApiRequestError {
    return new ApiRequestError('UNAUTHORIZED', msg, 401, crypto.randomUUID())
  }

  static notFound(msg = 'Recurso não encontrado'): ApiRequestError {
    return new ApiRequestError('NOT_FOUND', msg, 404, crypto.randomUUID())
  }

  static conflict(msg = 'Conflito'): ApiRequestError {
    return new ApiRequestError('CONFLICT', msg, 409, crypto.randomUUID())
  }

  static validation(details: Record<string, string[]>): ApiRequestError {
    return new ApiRequestError(
      'VALIDATION_ERROR',
      'Dados inválidos',
      422,
      crypto.randomUUID(),
      details,
    )
  }

  static rateLimited(retryAfter = 30): ApiRequestError {
    return new ApiRequestError(
      'RATE_LIMITED',
      `Muitas requisições. Tente novamente em ${retryAfter}s`,
      429,
      crypto.randomUUID(),
      { retryAfter },
    )
  }

  static timeout(msg = 'Tempo limite excedido'): ApiRequestError {
    return new ApiRequestError('TIMEOUT', msg, 408, crypto.randomUUID())
  }

  static serverError(msg = 'Erro interno do servidor'): ApiRequestError {
    return new ApiRequestError('SERVER_ERROR', msg, 500, crypto.randomUUID())
  }

  static networkError(msg = 'Falha de conexão'): ApiRequestError {
    return new ApiRequestError('NETWORK_ERROR', msg, 0, crypto.randomUUID())
  }
}

export type ApiResult<T> =
  { success: true; data: T; response: ApiResponse<T> } | { success: false; error: ApiRequestError }

export interface PaginatedRequest {
  page?: number
  perPage?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface NetworkConfig {
  baseLatencyMs: number
  jitterMs: number
  errorRate: number
  timeoutMs: number
  retryCount: number
  retryDelayMs: number
  rateLimitPerMinute: number
}
