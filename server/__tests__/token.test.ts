import { describe, it, expect, beforeEach } from 'vitest'
import {
  createToken,
  createRefreshToken,
  verifyToken,
  verifyRefreshToken,
  invalidateRefreshToken,
} from '../lib/token'

process.env.JWT_SECRET = 'test-secret-key-for-unit-tests'

describe('Token Service', () => {
  beforeEach(() => {})

  it('should create and verify access token', async () => {
    const token = await createToken('user-1', 'test@test.com')
    const payload = await verifyToken(token)
    expect(payload.sub).toBe('user-1')
    expect(payload.email).toBe('test@test.com')
    expect(payload.type).toBe('access')
    expect(payload.jti).toBeDefined()
  })

  it('should create and verify refresh token', async () => {
    const token = await createRefreshToken('user-1', 'test@test.com')
    const payload = await verifyRefreshToken(token)
    expect(payload).not.toBeNull()
    expect(payload!.sub).toBe('user-1')
    expect(payload!.type).toBe('refresh')
    expect(payload!.jti).toBeDefined()
  })

  it('should reject invalid refresh token', async () => {
    const payload = await verifyRefreshToken('invalid-token')
    expect(payload).toBeNull()
  })

  it('should reject used refresh token (rotation)', async () => {
    const token = await createRefreshToken('user-1', 'test@test.com')
    invalidateRefreshToken(token)
    const payload = await verifyRefreshToken(token)
    expect(payload).toBeNull()
  })

  it('should handle multiple invalidations', async () => {
    const token1 = await createRefreshToken('user-1', 'test@test.com')
    const token2 = await createRefreshToken('user-1', 'test@test.com')

    invalidateRefreshToken(token1)
    expect(await verifyRefreshToken(token1)).toBeNull()
    expect(await verifyRefreshToken(token2)).not.toBeNull()
  })
})
