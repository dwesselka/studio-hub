import { simulator } from './simulator'

export type ApiEnvironment = 'development' | 'homologation' | 'production'

export interface ApiEnvironmentConfig {
  name: string
  label: string
  mockEnabled: boolean
  devToolsEnabled: boolean
  baseLatencyMs: number
  jitterMs: number
  errorRate: number
  logLevel: 'debug' | 'info' | 'warn' | 'silent'
  apiUrl: string
}

export const ENVIRONMENTS: Record<ApiEnvironment, ApiEnvironmentConfig> = {
  development: {
    name: 'development',
    label: 'Desenvolvimento',
    mockEnabled: true,
    devToolsEnabled: true,
    baseLatencyMs: 300,
    jitterMs: 100,
    errorRate: 0,
    logLevel: 'debug',
    apiUrl: '/api',
  },
  homologation: {
    name: 'homologation',
    label: 'Homologação',
    mockEnabled: true,
    devToolsEnabled: false,
    baseLatencyMs: 100,
    jitterMs: 50,
    errorRate: 0,
    logLevel: 'info',
    apiUrl: '/api',
  },
  production: {
    name: 'production',
    label: 'Produção',
    mockEnabled: false,
    devToolsEnabled: false,
    baseLatencyMs: 0,
    jitterMs: 0,
    errorRate: 0,
    logLevel: 'silent',
    apiUrl: import.meta.env.VITE_API_URL || '/api',
  },
}

function detectEnvironment(): ApiEnvironment {
  if (import.meta.env.VITE_ENV === 'homologation') return 'homologation'
  if (import.meta.env.PROD) return 'production'
  return 'development'
}

function createLogger(level: ApiEnvironmentConfig['logLevel']) {
  const levels = { debug: 0, info: 1, warn: 2, silent: 3 }
  const current = levels[level]

  return {
    debug: (...args: unknown[]) => { if (current <= 0) console.debug('[API]', ...args) },
    info: (...args: unknown[]) => { if (current <= 1) console.info('[API]', ...args) },
    warn: (...args: unknown[]) => { if (current <= 2) console.warn('[API]', ...args) },
  }
}

export function applyEnvironment(env?: ApiEnvironment): ApiEnvironmentConfig {
  const environment = env ?? detectEnvironment()
  const config = ENVIRONMENTS[environment]

  const logger = createLogger(config.logLevel)
  logger.info(`Ambiente: ${config.label}`)

  if (config.mockEnabled) {
    simulator.updateConfig({
      baseLatencyMs: config.baseLatencyMs,
      jitterMs: config.jitterMs,
      errorRate: config.errorRate,
    })
    logger.debug(`Mock configurado: latência=${config.baseLatencyMs}ms, jitter=${config.jitterMs}ms, erro=${config.errorRate * 100}%`)
  }

  return config
}

export const ENV = detectEnvironment()
