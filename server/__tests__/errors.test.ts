import { describe, it, expect } from 'vitest'
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ConflictError,
  BadRequestError,
  isAppError,
} from '../lib/errors'

describe('errors', () => {
  it('AppError with status and code', () => {
    const err = new AppError(418, 'TEAPOT', 'Sou um bule')
    expect(err.statusCode).toBe(418)
    expect(err.code).toBe('TEAPOT')
    expect(err.message).toBe('Sou um bule')
    expect(err.name).toBe('AppError')
  })

  it('NotFoundError', () => {
    const err = new NotFoundError()
    expect(err.statusCode).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
  })

  it('UnauthorizedError', () => {
    const err = new UnauthorizedError()
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
  })

  it('ValidationError with details', () => {
    const err = new ValidationError({ email: ['E-mail inválido'] })
    expect(err.statusCode).toBe(422)
    expect(err.code).toBe('VALIDATION_ERROR')
    expect(err.details).toEqual({ email: ['E-mail inválido'] })
  })

  it('ConflictError', () => {
    const err = new ConflictError()
    expect(err.statusCode).toBe(409)
    expect(err.code).toBe('CONFLICT')
  })

  it('BadRequestError', () => {
    const err = new BadRequestError('Requisição inválida', { field: 'error' })
    expect(err.statusCode).toBe(400)
    expect(err.code).toBe('BAD_REQUEST')
    expect(err.details).toEqual({ field: 'error' })
  })

  it('isAppError identifies AppError instances', () => {
    expect(isAppError(new NotFoundError())).toBe(true)
    expect(isAppError(new Error('generic'))).toBe(false)
    expect(isAppError('string')).toBe(false)
    expect(isAppError(null)).toBe(false)
  })
})
