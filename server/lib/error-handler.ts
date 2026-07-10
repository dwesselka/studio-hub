import { Context } from 'hono'
import { isAppError } from './errors'
import { error, serverError } from './response'

export function errorHandler(err: unknown, c: Context): Response {
  if (isAppError(err)) {
    return error(c, err.statusCode, err.code, err.message, err.details)
  }

  console.error('[Server Error]', err)
  return serverError(c)
}
