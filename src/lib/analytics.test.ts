import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  trackPageView,
  trackCtaClick,
  trackChatbotOpen,
  trackChatbotLead,
  getAnalyticsEvents,
  __resetAnalyticsSessionForTests,
} from './analytics'

describe('Critério: Analytics registra eventos de conversão', () => {
  beforeEach(() => {
    __resetAnalyticsSessionForTests()
  })

  it('registra page_view', () => {
    trackPageView('/')
    const events = getAnalyticsEvents()
    expect(events).toHaveLength(1)
    expect(events[0].event).toBe('page_view')
    expect(events[0].page).toBe('/')
  })

  it('registra cta_click com localização e plano', () => {
    trackCtaClick('hero')
    trackCtaClick('plans', 'pro')

    const events = getAnalyticsEvents()
    expect(events.filter((e: { event: string }) => e.event === 'cta_click')).toHaveLength(2)
    expect(events[0].location).toBe('hero')
    expect(events[1].location).toBe('plans')
    expect(events[1].plan).toBe('pro')
  })

  it('registra chatbot_open', () => {
    trackChatbotOpen()
    const events = getAnalyticsEvents()
    expect(events[0].event).toBe('chatbot_open')
  })

  it('registra chatbot_lead', () => {
    trackChatbotLead('chatbot')
    const events = getAnalyticsEvents()
    expect(events[0].event).toBe('chatbot_lead')
    expect(events[0].source).toBe('chatbot')
  })

  it('dispara CustomEvent infinity:analytics', () => {
    const handler = vi.fn()
    window.addEventListener('infinity:analytics', handler)
    trackPageView('/cadastro')
    expect(handler).toHaveBeenCalledOnce()
    expect(handler.mock.calls[0][0].detail.event).toBe('page_view')
    window.removeEventListener('infinity:analytics', handler)
  })

  it('inclui origem do tráfego UTM nos eventos', () => {
    window.history.pushState({}, '', '/?utm_source=google&utm_medium=cpc')
    trackPageView('/')
    const events = getAnalyticsEvents()
    expect(events[0].utm_source).toBe('google')
    expect(events[0].utm_medium).toBe('cpc')
    window.history.pushState({}, '', '/')
  })
})
