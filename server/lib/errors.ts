export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Requisição inválida', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(403, 'FORBIDDEN', message)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super(404, 'NOT_FOUND', message)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflito') {
    super(409, 'CONFLICT', message)
  }
}

export class ValidationError extends AppError {
  constructor(details: Record<string, string[]>) {
    super(422, 'VALIDATION_ERROR', 'Dados inválidos', details)
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError
}
