import { safeLocalStorage } from '@/lib/storage'

interface Storable {
  id: string
}

interface DBOptions {
  persistKey?: string
  useCache?: boolean
}

const DB_PREFIX = 'infinity_api_db_'

class InMemoryTable<T extends Storable> {
  private data: Map<string, T> = new Map()
  private persistKey: string
  private useCache: boolean
  private dirty = false
  private flushTimer: ReturnType<typeof setTimeout> | null = null

  constructor(name: string, options: DBOptions = {}) {
    this.persistKey = options.persistKey ?? `${DB_PREFIX}${name}`
    this.useCache = options.useCache ?? true
    this.load()
  }

  private load(): void {
    if (!this.useCache) return
    try {
      const raw = safeLocalStorage.getItem(this.persistKey)
      if (raw) {
        const items: T[] = JSON.parse(raw)
        for (const item of items) {
          this.data.set(item.id, item)
        }
      }
    } catch {
      this.data.clear()
    }
  }

  private scheduleFlush(): void {
    if (!this.useCache) return
    this.dirty = true
    if (this.flushTimer) clearTimeout(this.flushTimer)
    this.flushTimer = setTimeout(() => this.flush(), 500)
  }

  flush(): void {
    if (!this.dirty || !this.useCache) return
    try {
      const items = Array.from(this.data.values())
      safeLocalStorage.setItem(this.persistKey, JSON.stringify(items))
      this.dirty = false
    } catch {
      console.warn(`[DB] Falha ao persistir tabela ${this.persistKey}`)
    }
  }

  getAll(): T[] {
    return Array.from(this.data.values())
  }

  getById(id: string): T | undefined {
    return this.data.get(id)
  }

  find(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate)
  }

  findOne(predicate: (item: T) => boolean): T | undefined {
    return this.getAll().find(predicate)
  }

  private ensureId(item: T): T {
    if (!item.id) {
      ;(item as Record<string, unknown>).id = crypto.randomUUID()
    }
    return item
  }

  insert(item: T): T {
    this.ensureId(item)
    if (this.data.has(item.id)) {
      throw new Error(`Conflito: registro ${item.id} já existe`)
    }
    this.data.set(item.id, item)
    this.scheduleFlush()
    return item
  }

  update(id: string, changes: Partial<T>): T {
    const existing = this.data.get(id)
    if (!existing) {
      throw new Error(`Registro ${id} não encontrado`)
    }
    const updated = { ...existing, ...changes, id }
    this.data.set(id, updated)
    this.scheduleFlush()
    return updated
  }

  upsert(item: T): T {
    this.data.set(item.id, item)
    this.scheduleFlush()
    return item
  }

  delete(id: string): boolean {
    const removed = this.data.delete(id)
    if (removed) this.scheduleFlush()
    return removed
  }

  count(): number {
    return this.data.size
  }

  clear(): void {
    this.data.clear()
    this.scheduleFlush()
  }

  paginate(
    page = 1,
    perPage = 20,
    sort?: (a: T, b: T) => number,
  ): { items: T[]; total: number; page: number; perPage: number; totalPages: number } {
    let items = this.getAll()
    if (sort) items = items.sort(sort)
    const total = items.length
    const totalPages = Math.ceil(total / perPage)
    const start = (page - 1) * perPage
    return {
      items: items.slice(start, start + perPage),
      total,
      page,
      perPage,
      totalPages,
    }
  }
}

class InMemoryDatabase {
  private tables: Map<string, InMemoryTable<Storable>> = new Map()

  getOrCreate<T extends Storable>(name: string, options?: DBOptions): InMemoryTable<T> {
    if (!this.tables.has(name)) {
      this.tables.set(name, new InMemoryTable<T>(name, options))
    }
    return this.tables.get(name) as InMemoryTable<T>
  }

  flushAll(): void {
    for (const table of this.tables.values()) {
      table.flush()
    }
  }

  clearAll(): void {
    for (const table of this.tables.values()) {
      table.clear()
    }
  }
}

export const db = new InMemoryDatabase()
export { InMemoryTable }
export type { Storable }
