import { describe, it, expect, beforeEach } from 'vitest'
import { getChatbotResponse } from './chatbot'

describe('Critério: Chatbot responde FAQ sobre planos, preços e funcionalidades', () => {
  it('responde sobre planos e preços', () => {
    const response = getChatbotResponse('Quais planos vocês têm?')
    expect(response.text).toMatch(/Starter/i)
    expect(response.text).toMatch(/R\$ 97/)
    expect(response.text).toMatch(/R\$ 197/)
  })

  it('responde sobre funcionalidades', () => {
    const response = getChatbotResponse('Quais funcionalidades o sistema oferece?')
    expect(response.text).toMatch(/Agendamento/i)
    expect(response.text).toMatch(/Pagamentos/i)
  })

  it('responde "Como funciona?" com informações do produto', () => {
    const response = getChatbotResponse('Como funciona?')
    expect(response.text).not.toMatch(/Não tenho certeza/)
    expect(response.text.length).toBeGreaterThan(20)
  })

  it('conduz ao cadastro quando usuário demonstra interesse', () => {
    const response = getChatbotResponse('Quero me cadastrar')
    expect(response.lead).toBe(true)
    expect(response.text).toMatch(/cadastro/i)
  })

  it('retorna fallback útil para perguntas fora do escopo', () => {
    const response = getChatbotResponse('Qual a previsão do tempo?')
    expect(response.text).toMatch(/planos|preços|funcionalidades|cadastro/i)
  })
})
