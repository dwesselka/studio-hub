import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { rateLimit } from '../lib/rate-limit'

describe('rateLimit', () => {
  it('allow requests within limit', async () => {
    const app = new Hono()
    app.use('/*', rateLimit({ windowMs: 60000, maxRequests: 5 }))
    app.get('/test', (c) => c.json({ ok: true }))

    for (let i = 0; i < 5; i++) {
      const res = await app.request('/test')
      expect(res.status).toBe(200)
    }
  })

  it('block requests over limit', async () => {
    const app = new Hono()
    app.use('/*', rateLimit({ windowMs: 60000, maxRequests: 2 }))
    app.get('/test', (c) => c.json({ ok: true }))

    await app.request('/test')
    await app.request('/test')
    const blocked = await app.request('/test')
    expect(blocked.status).toBe(429)

    const body = await blocked.json()
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('RATE_LIMITED')
  })

  it('include rate limit headers', async () => {
    const app = new Hono()
    app.use('/*', rateLimit({ windowMs: 60000, maxRequests: 10 }))
    app.get('/test', (c) => c.json({ ok: true }))

    const res = await app.request('/test')
    expect(res.headers.get('X-RateLimit-Limit')).toBe('10')
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('9')
    expect(res.headers.get('X-RateLimit-Reset')).toBeTruthy()
  })
})
