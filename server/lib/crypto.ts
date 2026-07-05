import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

const KEY_LENGTH = 64
const SALT_LENGTH = 32

function serialize(hash: Buffer, salt: Buffer): string {
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`
}

function deserialize(encoded: string): { hash: Buffer; salt: Buffer } | null {
  const parts = encoded.split(':')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return null
  return {
    salt: Buffer.from(parts[1], 'hex'),
    hash: Buffer.from(parts[2], 'hex'),
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH)
  const hash = scryptSync(password, salt, KEY_LENGTH)
  return serialize(hash, salt)
}

export function verifyPassword(password: string, encoded: string): boolean {
  const parsed = deserialize(encoded)
  if (!parsed) return false

  const { hash, salt } = parsed
  const derived = scryptSync(password, salt, KEY_LENGTH)

  if (derived.length !== hash.length) return false
  return timingSafeEqual(derived, hash)
}
