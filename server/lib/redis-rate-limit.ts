import { Context, Next } from 'hono'
import { error } from './response'

interface RedisClient {
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<number>
}

const memoryStore = new Map<string, { count: number; resetAt: number }>()

let redisClient: RedisClient | null = null

export function setRedisClient(client: RedisClient): void {
  redisClient = client
}

export function rateLimit(opts?: { windowMs?: number; maxRequests?: number }) {
  const windowMs = opts?.windowMs ?? 60_000
  const maxRequests = opts?.maxRequests ?? 60
  const windowSeconds = Math.ceil(windowMs / 1000)

  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'anonymous'

    if (redisClient) {
      const key = getRateKey(ip, windowMs)
      const count = await redisClient.incr(key)
      if (count === 1) {
        await redisClient.expire(key, windowSeconds)
      }

      const remaining = Math.max(0, maxRequests - count)
      c.header('X-RateLimit-Limit', String(maxRequests))
      c.header('X-RateLimit-Remaining', String(remaining))
      c.header('X-RateLimit-Reset', String(Math.ceil(Date.now() / 1000) + windowSeconds))

      if (count > maxRequests) {
        const retryAfter = windowSeconds
        c.header('Retry-After', String(retryAfter))
        return error(
          c,
          429,
          'RATE_LIMITED',
          `Muitas requisições. Tente novamente em ${retryAfter}s`,
        )
      }

      return next()
    }

    const now = Date.now()
    const entry = memoryStore.get(ip)

    if (!entry || entry.resetAt <= now) {
      memoryStore.set(ip, { count: 1, resetAt: now + windowMs })
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

function getRateKey(ip: string, windowMs: number): string {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs
  return `ratelimit:${ip}:${windowStart}`
}
