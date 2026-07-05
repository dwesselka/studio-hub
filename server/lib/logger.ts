import { Context, Next } from 'hono'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  requestId?: string
  method?: string
  path?: string
  status?: number
  duration?: number
  error?: string
  [key: string]: unknown
}

function writeLog(entry: LogEntry): void {
  const output = JSON.stringify(entry)
  if (entry.level === 'error') {
    console.error(output)
  } else if (entry.level === 'warn') {
    console.warn(output)
  } else {
    console.log(output)
  }
}

export function log(level: LogLevel, message: string, meta?: Partial<LogEntry>): void {
  writeLog({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  })
}

export async function requestLogger(c: Context, next: Next): Promise<void> {
  const start = Date.now()
  const requestId = c.res.headers.get('X-Request-Id') || crypto.randomUUID()

  await next()

  const duration = Date.now() - start
  const status = c.res.status

  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'

  writeLog({
    level,
    message: `${c.req.method} ${c.req.path} → ${status} (${duration}ms)`,
    timestamp: new Date().toISOString(),
    requestId,
    method: c.req.method,
    path: c.req.path,
    status,
    duration,
  })
}
