import { Context } from 'hono'

export interface ApiMeta {
  timestamp: string
  requestId: string
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta: ApiMeta
}

export interface ApiErrorDetail {
  code: string
  message: string
  details?: unknown
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorDetail
  meta: ApiMeta
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface PaginatedMeta extends ApiMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: PaginatedMeta
}

function generateRequestId(): string {
  return crypto.randomUUID()
}

function buildMeta(): ApiMeta {
  return {
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
  }
}

export function success<T>(c: Context, data: T, status: number = 200): Response {
  return c.json(
    {
      success: true,
      data,
      meta: buildMeta(),
    } satisfies ApiSuccessResponse<T>,
    status,
  )
}

export function successPaginated<T>(
  c: Context,
  items: T[],
  total: number,
  page: number,
  perPage: number,
): Response {
  return c.json(
    {
      success: true,
      data: items,
      meta: {
        ...buildMeta(),
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        hasNext: page * perPage < total,
        hasPrev: page > 1,
      },
    } satisfies PaginatedResponse<T>,
  )
}

export function created<T>(c: Context, data: T): Response {
  return success(c, data, 201)
}

export function noContent(c: Context): Response {
  return c.body(null, 204)
}

export function error(
  c: Context,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): Response {
  return c.json(
    {
      success: false,
      error: { code, message, details },
      meta: buildMeta(),
    } satisfies ApiErrorResponse,
    status,
  )
}

export function badRequest(c: Context, message: string, details?: unknown): Response {
  return error(c, 400, 'BAD_REQUEST', message, details)
}

export function unauthorized(c: Context, message: string = 'Não autorizado'): Response {
  return error(c, 401, 'UNAUTHORIZED', message)
}

export function forbidden(c: Context, message: string = 'Acesso negado'): Response {
  return error(c, 403, 'FORBIDDEN', message)
}

export function notFound(c: Context, message: string = 'Recurso não encontrado'): Response {
  return error(c, 404, 'NOT_FOUND', message)
}

export function conflict(c: Context, message: string = 'Conflito'): Response {
  return error(c, 409, 'CONFLICT', message)
}

export function validationError(c: Context, details: Record<string, string[]>): Response {
  return error(c, 422, 'VALIDATION_ERROR', 'Dados inválidos', details)
}

export function serverError(c: Context, message: string = 'Erro interno do servidor'): Response {
  return error(c, 500, 'SERVER_ERROR', message)
}
