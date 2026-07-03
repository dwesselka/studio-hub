/**
 * Abstração segura para o sessionStorage do navegador.
 * Intercepta exceções lançadas em ambientes onde o armazenamento está restrito ou bloqueado
 * (ex: modo anônimo agressivo, Safari Private Browsing) e fornece fallback em memória.
 */
class SafeSessionStorage {
  private memoryStorage: Record<string, string> = {}

  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key)
    } catch {
      return this.memoryStorage[key] || null
    }
  }

  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value)
    } catch {
      this.memoryStorage[key] = value
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch {
      delete this.memoryStorage[key]
    }
  }

  clear(): void {
    try {
      sessionStorage.clear()
    } catch {
      this.memoryStorage = {}
    }
  }
}

/**
 * Abstração segura para o localStorage do navegador.
 * Intercepta exceções de acesso de segurança e fornece fallback em memória.
 */
class SafeLocalStorage {
  private memoryStorage: Record<string, string> = {}

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return this.memoryStorage[key] || null
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      this.memoryStorage[key] = value
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      delete this.memoryStorage[key]
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch {
      this.memoryStorage = {}
    }
  }
}

export const safeSessionStorage = new SafeSessionStorage()
export const safeLocalStorage = new SafeLocalStorage()
