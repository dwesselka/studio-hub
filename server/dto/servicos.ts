export interface ServiceResponse {
  id: string
  name: string
  duration: number
  price: number
  category: string
  active: boolean
}

export function toServiceResponse(service: {
  id: string
  name: string
  duration: number
  price: number
  category: string
  active: boolean
}): ServiceResponse {
  return {
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
    category: service.category,
    active: service.active,
  }
}

export function toServiceCategoryResponse(services: ServiceResponse[]): {
  id: string
  name: string
  services: ServiceResponse[]
}[] {
  const grouped = new Map<string, ServiceResponse[]>()
  for (const s of services) {
    const existing = grouped.get(s.category) ?? []
    existing.push(s)
    grouped.set(s.category, existing)
  }
  return Array.from(grouped.entries()).map(([name, services]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    services,
  }))
}
