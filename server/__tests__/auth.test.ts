import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../lib/crypto'

process.env.JWT_SECRET = 'test-secret-key-for-unit-tests'

describe('Auth Service', () => {
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
