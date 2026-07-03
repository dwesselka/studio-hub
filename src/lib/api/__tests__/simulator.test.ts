import { describe, it, expect, beforeEach } from 'vitest'
import { simulator } from '../simulator'

describe('NetworkSimulator', () => {
  beforeEach(() => {
    simulator.reset()
    simulator.resetConfig()
  })

  it('executa função com latência simulada', async () => {
    const start = performance.now()
    const result = await simulator.simulate('GET', '/test', async () => 'ok')
    const elapsed = performance.now() - start

    expect(result).toBe('ok')
    expect(elapsed).toBeGreaterThanOrEqual(0)
  })

  it('injeta erros baseado na taxa configurada', async () => {
    simulator.updateConfig({ errorRate: 1, baseLatencyMs: 0, jitterMs: 0 })

    await expect(simulator.simulate('GET', '/test', async () => 'ok')).rejects.toThrow(
      /Erro simulado/,
    )
  })

  it('emite eventos durante a simulação', async () => {
    const events: string[] = []
    simulator.on((event) => events.push(event.type))

    await simulator.simulate('POST', '/test', async () => ({ id: 1 }))

    expect(events).toContain('request')
    expect(events).toContain('response')
  })

  it('rate limita requisições acima do limite', async () => {
    simulator.updateConfig({ rateLimitPerMinute: 2, baseLatencyMs: 0, jitterMs: 0 })

    await simulator.simulate('GET', '/a', async () => 'a')
    await simulator.simulate('GET', '/b', async () => 'b')

    await expect(simulator.simulate('GET', '/c', async () => 'c')).rejects.toThrow(
      /Muitas requisições/,
    )
  })

  it('permite atualizar configuração parcialmente', () => {
    const config = simulator.updateConfig({ baseLatencyMs: 500 })
    expect(config.baseLatencyMs).toBe(500)
    expect(config.errorRate).toBe(0)
  })

  it('reset limpa contadores', () => {
    simulator.updateConfig({ errorRate: 0.5 })
    simulator.resetConfig()
    expect(simulator.getConfig().errorRate).toBe(0)
  })
})
