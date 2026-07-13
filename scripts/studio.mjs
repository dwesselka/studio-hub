/**
 * Wrapper para o Prisma Studio no Windows com pnpm.
 * Resolve ERR_STREAM_PREMATURE_CLOSE ao rodar com stdin: 'ignore'.
 */
import { spawn } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Carrega variáveis do .env.development
const envPath = resolve('.env.development')
const extraEnv = {}

if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    extraEnv[key] = val
  }
}

const prismaBin = resolve('node_modules/prisma/build/index.js')

const studio = spawn(process.execPath, [prismaBin, 'studio'], {
  // stdin: 'ignore' evita o ERR_STREAM_PREMATURE_CLOSE
  stdio: ['ignore', 'inherit', 'inherit'],
  env: { ...process.env, ...extraEnv },
})

studio.on('exit', (code) => process.exit(code ?? 0))
process.on('SIGINT', () => studio.kill('SIGINT'))
process.on('SIGTERM', () => studio.kill('SIGTERM'))
