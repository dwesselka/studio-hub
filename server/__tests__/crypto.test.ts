// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../lib/crypto'

describe('crypto', () => {
  it('hash and verify password', () => {
    const password = 'minha-senha-segura'
    const hashed = hashPassword(password)

    expect(hashed).toMatch(/^scrypt:[a-f0-9]+:[a-f0-9]+$/)
    expect(verifyPassword(password, hashed)).toBe(true)
  })

  it('reject wrong password', () => {
    const hashed = hashPassword('senha-correta')
    expect(verifyPassword('senha-errada', hashed)).toBe(false)
  })

  it('reject invalid format', () => {
    expect(verifyPassword('qualquer', 'formato-invalido')).toBe(false)
  })

  it('produce different hashes for same password', () => {
    const password = 'mesma-senha'
    const hash1 = hashPassword(password)
    const hash2 = hashPassword(password)
    expect(hash1).not.toBe(hash2)
  })
})
