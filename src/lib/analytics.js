const STORAGE_KEY = 'infinity_analytics_session'

function getSessionId() {
  let id = sessionStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

function getTrafficSource() {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
    referrer: document.referrer || null,
  }
}

function sendEvent(name, payload = {}) {
  const event = {
    event: name,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    page: window.location.pathname,
    ...getTrafficSource(),
    ...payload,
  }

  if (import.meta.env.DEV) {
    console.info('[analytics]', event)
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload)
  }

  window.dispatchEvent(new CustomEvent('infinity:analytics', { detail: event }))
}

export function trackPageView(page) {
  sendEvent('page_view', { page })
}

export function trackCtaClick(location, plan) {
  sendEvent('cta_click', { location, plan })
}

export function trackChatbotOpen() {
  sendEvent('chatbot_open')
}

export function trackChatbotLead(source) {
  sendEvent('chatbot_lead', { source })
}
