import { describe, it, expect, beforeEach } from 'vitest'
import { Cache } from '../lib/cache'

describe('Cache', () => {
  let cache: Cache<number>

  beforeEach(() => {
    cache = new Cache(1000)
  })

  it('set and get value', () => {
    cache.set('key1', 42)
    expect(cache.get('key1')).toBe(42)
  })

  it('return undefined for missing key', () => {
    expect(cache.get('inexistente')).toBeUndefined()
  })

  it('expire after ttl', async () => {
    cache = new Cache(10)
    cache.set('key', 99)
    await new Promise((r) => setTimeout(r, 20))
    expect(cache.get('key')).toBeUndefined()
  })

  it('invalidate specific key', () => {
    cache.set('key1', 1)
    cache.set('key2', 2)
    cache.invalidate('key1')
    expect(cache.get('key1')).toBeUndefined()
    expect(cache.get('key2')).toBe(2)
  })

  it('invalidate pattern', () => {
    cache.set('dashboard:metrics:1', 100)
    cache.set('dashboard:today:1', 200)
    cache.set('other:1', 300)
    cache.invalidatePattern(/^dashboard:/)
    expect(cache.get('dashboard:metrics:1')).toBeUndefined()
    expect(cache.get('dashboard:today:1')).toBeUndefined()
    expect(cache.get('other:1')).toBe(300)
  })

  it('clear all', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.clear()
    expect(cache.size).toBe(0)
  })
})
