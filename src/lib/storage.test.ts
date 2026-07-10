import { describe, it, expect, beforeEach, vi } from 'vitest'
import { safeSessionStorage, safeLocalStorage } from './storage'

describe('safeSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('setItem e getItem funcionam normalmente', () => {
    safeSessionStorage.setItem('key', 'value')
    expect(safeSessionStorage.getItem('key')).toBe('value')
  })

  it('removeItem remove a chave', () => {
    safeSessionStorage.setItem('key', 'value')
    safeSessionStorage.removeItem('key')
    expect(safeSessionStorage.getItem('key')).toBeNull()
  })

  it('clear remove todas as chaves', () => {
    safeSessionStorage.setItem('a', '1')
    safeSessionStorage.setItem('b', '2')
    safeSessionStorage.clear()
    expect(safeSessionStorage.getItem('a')).toBeNull()
    expect(safeSessionStorage.getItem('b')).toBeNull()
  })

  it('retorna null para chave inexistente', () => {
    expect(safeSessionStorage.getItem('nao_existe')).toBeNull()
  })

  it('fallback para memória quando sessionStorage falha', () => {
    const setItemSpy = vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    safeSessionStorage.setItem('fallback', 'memory_value')
    expect(safeSessionStorage.getItem('fallback')).toBe('memory_value')

    setItemSpy.mockRestore()
  })
})

describe('safeLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('setItem e getItem funcionam normalmente', () => {
    safeLocalStorage.setItem('key', 'value')
    expect(safeLocalStorage.getItem('key')).toBe('value')
  })

  it('removeItem remove a chave', () => {
    safeLocalStorage.setItem('key', 'value')
    safeLocalStorage.removeItem('key')
    expect(safeLocalStorage.getItem('key')).toBeNull()
  })

  it('clear remove todas as chaves', () => {
    safeLocalStorage.setItem('a', '1')
    safeLocalStorage.setItem('b', '2')
    safeLocalStorage.clear()
    expect(safeLocalStorage.getItem('a')).toBeNull()
    expect(safeLocalStorage.getItem('b')).toBeNull()
  })

  it('retorna null para chave inexistente', () => {
    expect(safeLocalStorage.getItem('nao_existe')).toBeNull()
  })

  it('fallback para memória quando localStorage falha', () => {
    const getItemSpy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    safeLocalStorage.setItem('fallback', 'memory_value')
    expect(safeLocalStorage.getItem('fallback')).toBe('memory_value')

    getItemSpy.mockRestore()
  })
})
