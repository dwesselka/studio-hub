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

async function callOpenAiDirectly(message: string, apiKey: string): Promise<ChatbotResponse> {
  const systemPrompt = `Você é a assistente virtual do Infinity Partner, plataforma de gestão para salões, barbearias, clínicas de beleza e profissionais autônomos.

Responda APENAS sobre:
- Planos: Starter (grátis), Pro (R$ 97/mês), Clínica (R$ 197/mês)
- Funcionalidades: agendamento IA, atendimento, pagamentos Pix/cartão, relatórios, fidelização
- Processo de cadastro e onboarding (5 minutos, setup automático)
- Segmentos atendidos: salão, barbearia, clínica, autônomo

Se a pergunta for fora desse escopo, redirecione educadamente para os temas acima.
Responda em português brasileiro, de forma concisa e amigável.
Se o usuário demonstrar interesse em cadastro, sugira iniciar o cadastro gratuito.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  })

  if (!response.ok) throw new Error(`OpenAI API error with status: ${response.status}`)

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content ?? chatbotKnowledge.fallback
  const lead = /cadastr|começar|iniciar|criar conta/i.test(text)

  return { text, lead }
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
  // Em produção, nunca fazemos requisições diretas de API no lado do cliente
  if (import.meta.env.PROD) {
    try {
      return await fetchBackendChat(message)
    } catch (err) {
      console.error('[Chatbot Prod Error]: Redirecionando para o chatbot local de fallback.', err)
      return getChatbotResponse(message)
    }
  }

  // Em modo de desenvolvimento, permitimos chamada direta à OpenAI para facilitar testes
  // se a chave VITE_OPENAI_API_KEY estiver configurada localmente.
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    return getChatbotResponse(message)
  }

  console.warn(
    '[SECURITY WARNING]: Chamada direta à OpenAI em modo de desenvolvimento usando VITE_OPENAI_API_KEY. Esta chamada direta do cliente é bloqueada em produção por segurança.',
  )

  try {
    return await callOpenAiDirectly(message, apiKey)
  } catch (err) {
    console.error('[Chatbot Dev Error]:', err)
    return getChatbotResponse(message)
  }
}
