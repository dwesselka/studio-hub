import { describe, it, expect, beforeEach } from 'vitest'
import { apiClient } from '../client'
import { mockServer } from '../server'
import { simulator } from '../simulator'

describe('ApiClient', () => {
  beforeEach(() => {
    apiClient.reset()
    mockServer.stop()
    simulator.reset()
    simulator.resetConfig()
    simulator.updateConfig({ baseLatencyMs: 0, jitterMs: 0, errorRate: 0 })
  })

  it('rejeita requisição sem handler configurado', async () => {
    await expect(apiClient.get('/test')).rejects.toThrow(/não configurado/)
  })

  it('faz requisição GET com sucesso', async () => {
    mockServer.get('/hello', () => mockServer['jsonResponse']({ message: 'world' }))
    mockServer.start()

    const response = await apiClient.get('/api/hello')
    expect(response.status).toBe(200)
    expect(response.data).toEqual({ message: 'world' })
  })

  it('faz requisição POST com body', async () => {
    mockServer.post('/data', (req) => mockServer['jsonResponse']({ received: req.body }, 201))
    mockServer.start()

    const response = await apiClient.post('/api/data', { name: 'test' })
    expect(response.status).toBe(201)
    expect(response.data).toEqual({ received: { name: 'test' } })
  })

  it('usa interceptors de requisição', async () => {
    mockServer.get('/secure', (req) =>
      mockServer['jsonResponse']({ token: req.headers?.authorization }),
    )
    mockServer.start()

    const unsub = apiClient.onRequest((req) => ({
      ...req,
      headers: { ...req.headers, authorization: 'Bearer mock-token' },
    }))

    const response = await apiClient.get('/api/secure')
    expect(response.data).toEqual({ token: 'Bearer mock-token' })
    unsub()
  })

  it('usa interceptors de erro', async () => {
    mockServer.get('/error', () => {
      throw new Error('db error')
    })
    mockServer.start()

    const unsub = apiClient.onError((err) => {
      return Object.assign(err, { message: 'Intercepted: ' + err.message })
    })

    await expect(apiClient.get('/api/error')).rejects.toThrow(/Intercepted/)
    unsub()
  })

  it('retry em erro 500', async () => {
    let attempts = 0
    mockServer.get('/flaky', () => {
      attempts++
      if (attempts < 2) throw new Error('db error')
      return mockServer['jsonResponse']({ ok: true })
    })
    mockServer.start()
    simulator.updateConfig({ retryCount: 2, retryDelayMs: 10 })

    const response = await apiClient.get('/api/flaky')
    expect(response.data).toEqual({ ok: true })
    expect(attempts).toBe(2)
  })

  it('cacheia requisições GET', async () => {
    let callCount = 0
    mockServer.get('/cached', () => {
      callCount++
      return mockServer['jsonResponse']({ count: callCount })
    })
    mockServer.start()

    const r1 = await apiClient.get('/api/cached', { cacheMs: 5000 })
    const r2 = await apiClient.get('/api/cached', { cacheMs: 5000 })
    expect(r1.data).toEqual({ count: 1 })
    expect(r2.data).toEqual({ count: 1 })
    expect(callCount).toBe(1)
  })
})
