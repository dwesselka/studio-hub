import type { NetworkConfig } from './types'

export type SimulationEventType =
  'request' | 'response' | 'error' | 'timeout' | 'retry' | 'rate-limit'
export type SimulationListener = (event: SimulationEvent) => void

export interface SimulationEvent {
  type: SimulationEventType
  timestamp: string
  method: string
  path: string
  durationMs?: number
  status?: number
  error?: string
  retryAttempt?: number
}

export { type NetworkConfig }

export const DEFAULT_NETWORK_CONFIG: NetworkConfig = {
  baseLatencyMs: 200,
  jitterMs: 100,
  errorRate: 0,
  timeoutMs: 10_000,
  retryCount: 2,
  retryDelayMs: 500,
  rateLimitPerMinute: 60,
}

class NetworkSimulator {
  private config: NetworkConfig = { ...DEFAULT_NETWORK_CONFIG }
  private listeners: Set<SimulationListener> = new Set()
  private requestTimestamps: number[] = []
  private requestCount = 0

  getConfig(): NetworkConfig {
    return { ...this.config }
  }

  updateConfig(partial: Partial<NetworkConfig>): NetworkConfig {
    this.config = { ...this.config, ...partial }
    return this.getConfig()
  }

  resetConfig(): void {
    this.config = { ...DEFAULT_NETWORK_CONFIG }
  }

  on(handler: SimulationListener): () => void {
    this.listeners.add(handler)
    return () => this.listeners.delete(handler)
  }

  private emit(event: SimulationEvent): void {
    for (const handler of this.listeners) {
      try {
        handler(event)
      } catch {
        /* swallow listener errors */
      }
    }
  }

  private getRandomLatency(): number {
    const jitter = (Math.random() - 0.5) * 2 * this.config.jitterMs
    return Math.max(0, this.config.baseLatencyMs + jitter)
  }

  private shouldInjectError(): boolean {
    if (this.config.errorRate <= 0) return false
    return Math.random() < this.config.errorRate
  }

  private checkRateLimit(): boolean {
    const now = Date.now()
    const windowMs = 60_000
    this.requestTimestamps = this.requestTimestamps.filter((t) => now - t < windowMs)
    if (this.requestTimestamps.length >= this.config.rateLimitPerMinute) {
      return false
    }
    this.requestTimestamps.push(now)
    return true
  }

  async simulate<T>(method: string, path: string, fn: () => Promise<T>): Promise<T> {
    const requestId = `${this.requestCount++}-${crypto.randomUUID().slice(0, 8)}`
    const startTime = performance.now()

    this.emit({
      type: 'request',
      timestamp: new Date().toISOString(),
      method,
      path,
    })

    if (!this.checkRateLimit()) {
      this.emit({
        type: 'rate-limit',
        timestamp: new Date().toISOString(),
        method,
        path,
        status: 429,
      })
      throw Object.assign(new Error('Muitas requisições'), {
        code: 'RATE_LIMITED',
        status: 429,
        retryAfter: 30,
      })
    }

    const latency = this.getRandomLatency()
    const hasError = this.shouldInjectError()

    await new Promise((r) => setTimeout(r, latency))

    if (hasError) {
      const serverErrors = [500, 502, 503, 504]
      const status = serverErrors[Math.floor(Math.random() * serverErrors.length)]
      const durationMs = performance.now() - startTime
      this.emit({
        type: 'error',
        timestamp: new Date().toISOString(),
        method,
        path,
        status,
        error: `Erro simulado ${status}`,
        durationMs,
      })
      throw Object.assign(new Error(`Erro simulado ${status}`), {
        code: 'SERVER_ERROR',
        status,
        requestId,
      })
    }

    try {
      const result = await fn()
      const durationMs = performance.now() - startTime
      this.emit({
        type: 'response',
        timestamp: new Date().toISOString(),
        method,
        path,
        status: 200,
        durationMs,
      })
      return result
    } catch (err) {
      const durationMs = performance.now() - startTime
      this.emit({
        type: 'error',
        timestamp: new Date().toISOString(),
        method,
        path,
        error: (err as Error).message,
        durationMs,
      })
      throw err
    }
  }

  getMetrics(): { totalRequests: number; recentErrors: number /* simplified */ } {
    return { totalRequests: this.requestCount, recentErrors: 0 }
  }

  reset(): void {
    this.requestTimestamps = []
    this.requestCount = 0
  }
}

export const simulator = new NetworkSimulator()
