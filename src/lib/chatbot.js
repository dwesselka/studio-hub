import { chatbotKnowledge } from '../data/content'

function scoreMatch(message, keywords) {
  const lower = message.toLowerCase()
  return keywords.reduce((score, kw) => (lower.includes(kw) ? score + 1 : score), 0)
}

export function getChatbotResponse(message) {
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

export async function getChatbotResponseAsync(message) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    return getChatbotResponse(message)
  }

  try {
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

    if (!response.ok) throw new Error('API error')

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? chatbotKnowledge.fallback
    const lead = /cadastr|começar|iniciar|criar conta/i.test(text)

    return { text, lead }
  } catch {
    return getChatbotResponse(message)
  }
}
