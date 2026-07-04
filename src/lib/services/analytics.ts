import { safeSessionStorage } from '@/lib/storage'

const STORAGE_KEY = 'infinity_analytics_session'
const EVENTS_KEY = 'infinity_analytics_events'

export interface AnalyticsEvent {
  event: string
  timestamp: string
  session_id: string
  page: string
  utm_source: string
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  [key: string]: unknown
}

function getSessionId(): string {
  let id = safeSessionStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    safeSessionStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

function getTrafficSource() {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'direct',
      utm_medium: null,
      utm_campaign: null,
      referrer: null,
    }
  }

  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
    referrer: document.referrer || null,
  }
}

function persistEvent(event: AnalyticsEvent): void {
  const stored = safeSessionStorage.getItem(EVENTS_KEY)
  const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : []
  events.push(event)
  safeSessionStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

function sendEvent(name: string, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  const event: AnalyticsEvent = {
    event: name,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    page: window.location.pathname,
    ...getTrafficSource(),
    ...payload,
  }

  persistEvent(event)

  if (import.meta.env.DEV) {
    console.info('[analytics]', event)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalWindow = window as any
  if (typeof globalWindow.gtag === 'function') {
    globalWindow.gtag('event', name, payload)
  }

  window.dispatchEvent(new CustomEvent('infinity:analytics', { detail: event }))
}

export function trackPageView(page: string): void {
  sendEvent('page_view', { page })
}

export function trackCtaClick(location: string, plan?: string): void {
  sendEvent('cta_click', { location, plan })
}

export function trackChatbotOpen(): void {
  sendEvent('chatbot_open')
}

export function trackChatbotLead(source: string): void {
  sendEvent('chatbot_lead', { source })
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  const stored = safeSessionStorage.getItem(EVENTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function clearAnalyticsEvents(): void {
  safeSessionStorage.removeItem(EVENTS_KEY)
}

export function __resetAnalyticsSessionForTests(): void {
  safeSessionStorage.removeItem(STORAGE_KEY)
  safeSessionStorage.removeItem(EVENTS_KEY)
}
