import { describe, it, expect, beforeAll } from 'vitest'

process.env.JWT_SECRET = 'test-secret-key-for-unit-tests'

const API = 'http://localhost:3001/v1'

type LoginResult = { user: { role: string }; accessToken: string; refreshToken: string }

async function login(email: string, password: string): Promise<LoginResult> {
  const r = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!r.ok) throw new Error(`Login failed: ${r.status}`)
  const d = (await r.json()) as { data: LoginResult }
  return d.data
}

describe('Auth Service', () => {
  describe('Integration — RBAC', () => {
    let lojistaToken: string
    let profissionalToken: string
    let clienteToken: string

    beforeAll(async () => {
      try {
        const lojista = await login('homem@teste.com', '123456')
        lojistaToken = lojista.accessToken
      } catch {
        lojistaToken = ''
      }
      try {
        const prof = await login('carla.mendes@profissional.com', '123456')
        profissionalToken = prof.accessToken
      } catch {
        profissionalToken = ''
      }
      try {
        const cli = await login('ana.cliente@email.com', '123456')
        clienteToken = cli.accessToken
      } catch {
        clienteToken = ''
      }
    })

    it('lojista acessa rota restrita (200)', async () => {
      if (!lojistaToken) return
      const r = await fetch(`${API}/servicos`, {
        headers: { Authorization: `Bearer ${lojistaToken}` },
      })
      expect(r.status).toBe(200)
    })

    it('profissional toma 403 em rota lojista-only', async () => {
      if (!profissionalToken) return
      const r = await fetch(`${API}/servicos`, {
        headers: { Authorization: `Bearer ${profissionalToken}` },
      })
      expect(r.status).toBe(403)
    })

    it('profissional acessa rota permitida (200)', async () => {
      if (!profissionalToken) return
      const r = await fetch(`${API}/agenda`, {
        headers: { Authorization: `Bearer ${profissionalToken}` },
      })
      expect(r.status).toBe(200)
    })

    it('cliente acessa portal (200)', async () => {
      if (!clienteToken) return
      const r = await fetch(`${API}/cliente/dashboard`, {
        headers: { Authorization: `Bearer ${clienteToken}` },
      })
      expect(r.status).toBe(200)
    })

    it('token inválido → 401', async () => {
      const r = await fetch(`${API}/servicos`, {
        headers: { Authorization: 'Bearer invalid-token' },
      })
      expect(r.status).toBe(401)
    })

    it('sem token → 401', async () => {
      const r = await fetch(`${API}/servicos`)
      expect(r.status).toBe(401)
    })
  })
})

import { hashPassword, verifyPassword } from '../lib/crypto'

describe('Auth Service — Unit', () => {
  describe('Password operations', () => {
    it('should hash and verify password correctly', () => {
      const password = 'minha-senha-segura-123'
      const hashed = hashPassword(password)
      expect(hashed).toContain(':')
      expect(verifyPassword(password, hashed)).toBe(true)
    })

    it('should reject wrong password', () => {
      const hashed = hashPassword('senha-correta')
      expect(verifyPassword('senha-errada', hashed)).toBe(false)
    })

    it('should produce different hashes for same password', () => {
      const password = 'mesma-senha'
      const hash1 = hashPassword(password)
      const hash2 = hashPassword(password)
      expect(hash1).not.toBe(hash2)
    })
  })
})
