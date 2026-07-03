import { chatbotKnowledge } from '@/data/content'

function scoreMatch(message: string, keywords: string[]): number {
  const lower = message.toLowerCase()
  return keywords.reduce((score, kw) => (lower.includes(kw) ? score + 1 : score), 0)
}

export interface ChatbotResponse {
  text: string
  lead: boolean
}

export function getChatbotResponse(message: string): ChatbotResponse {
  const trimmed = message.trim()
  if (!trimmed) return { text: chatbotKnowledge.fallback, lead: false }

  let best = null
  let bestScore = 0

  for (const topic of chatbotKnowledge.topics) {
    const score = scoreMatch(trimmed, topic.keywords)
    if (score > bestScore) {
      bestScore = score
      best = topic
    }
  }

  if (best) {
    return { text: best.answer, lead: best.lead ?? false }
  }

  return { text: chatbotKnowledge.fallback, lead: false }
}

async function fetchBackendChat(message: string): Promise<ChatbotResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) throw new Error(`Backend chat API error with status: ${response.status}`)

  return await response.json()
}

export async function getChatbotResponseAsync(message: string): Promise<ChatbotResponse> {
  try {
    return await fetchBackendChat(message)
  } catch (err) {
    console.error('[Chatbot API Error]: Redirecionando para o chatbot local de fallback.', err)
    return getChatbotResponse(message)
  }
}
