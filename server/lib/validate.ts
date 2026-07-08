import { MiddlewareHandler } from 'hono'
import type { ZodSchema } from 'zod'
import { validationError } from './response'

interface ValidationSchemas {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

export function validate(schemas: ValidationSchemas): MiddlewareHandler {
  return async (c, next) => {
    const errors: Record<string, string[]> = {}

    if (schemas.params) {
      const result = schemas.params.safeParse(c.req.param())
      if (!result.success) {
        const formatted = result.error.issues.map(
          (issue) => `${issue.path.join('.')}: ${issue.message}`,
        )
        errors.params = formatted
      } else {
        c.set('validParams', result.data)
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(c.req.query())
      if (!result.success) {
        const formatted = result.error.issues.map(
          (issue) => `${issue.path.join('.')}: ${issue.message}`,
        )
        errors.query = formatted
      } else {
        c.set('validQuery', result.data)
      }
    }

    if (schemas.body) {
      const body = await c.req.json().catch(() => ({}))
      const result = schemas.body.safeParse(body)
      if (!result.success) {
        const issues = result.error.issues
        for (const issue of issues) {
          const path = issue.path.join('.') || '_root'
          if (!errors[path]) errors[path] = []
          errors[path].push(issue.message)
        }
      } else {
        c.set('validBody', result.data)
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(c, errors)
    }

    await next()
  }
}

export function validateBody(schema: ZodSchema): MiddlewareHandler {
  return validate({ body: schema })
}

export function validateParams(schema: ZodSchema): MiddlewareHandler {
  return validate({ params: schema })
}

export function validateQuery(schema: ZodSchema): MiddlewareHandler {
  return validate({ query: schema })
}
