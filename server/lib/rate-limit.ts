import { Context, Next } from 'hono'
import { error } from './response'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const DEFAULT_WINDOW_MS = 60_000
const DEFAULT_MAX_REQUESTS = 60

export function rateLimit(opts?: { windowMs?: number; maxRequests?: number }) {
  const windowMs = opts?.windowMs ?? DEFAULT_WINDOW_MS
  const maxRequests = opts?.maxRequests ?? DEFAULT_MAX_REQUESTS
  const store = new Map<string, RateLimitEntry>()

  const cleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key)
    }
  }, 30_000)

  if (cleanup.unref) cleanup.unref()

  return async (c: Context, next: Next) => {
    const key = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'anonymous'
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      c.header('X-RateLimit-Limit', String(maxRequests))
      c.header('X-RateLimit-Remaining', String(maxRequests - 1))
      c.header('X-RateLimit-Reset', String(Math.ceil((now + windowMs) / 1000)))
      return next()
    }

    entry.count++

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      c.header('Retry-After', String(retryAfter))
      c.header('X-RateLimit-Limit', String(maxRequests))
      c.header('X-RateLimit-Remaining', '0')
      c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))
      return error(c, 429, 'RATE_LIMITED', `Muitas requisições. Tente novamente em ${retryAfter}s`)
    }

    c.header('X-RateLimit-Limit', String(maxRequests))
    c.header('X-RateLimit-Remaining', String(maxRequests - entry.count))
    c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))
    await next()
  }
}
