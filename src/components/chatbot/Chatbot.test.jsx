import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Chatbot from './Chatbot'
import { getAnalyticsEvents, __resetAnalyticsSessionForTests } from '../../lib/analytics'

vi.mock('../../lib/chatbot', async () => {
  const actual = await vi.importActual('../../lib/chatbot')
  return {
    ...actual,
    getChatbotResponseAsync: (message) => Promise.resolve(actual.getChatbotResponse(message)),
  }
})

describe('Critério: Chatbot conduz jornada e integra com cadastro', () => {
  beforeEach(() => {
    __resetAnalyticsSessionForTests()
  })

  it('registra chatbot_open ao abrir', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>,
    )

    await user.click(screen.getByLabelText(/Abrir chat/i))

    const events = getAnalyticsEvents()
    expect(events.some((e) => e.event === 'chatbot_open')).toBe(true)
  })

  it('responde pergunta sobre planos via quick reply', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>,
    )

    await user.click(screen.getByLabelText(/Abrir chat/i))
    await user.click(screen.getByRole('button', { name: 'Quais planos?' }))

    await waitFor(() => {
      expect(screen.getByText(/Starter/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/R\$ 97/)).toBeInTheDocument()
  })

  it('exibe link de cadastro quando lead é detectado', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>,
    )

    await user.click(screen.getByLabelText(/Abrir chat/i))
    await user.click(screen.getByRole('button', { name: 'Quero me cadastrar' }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Iniciar cadastro/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: /Iniciar cadastro/i })).toHaveAttribute('href', '/cadastro')
  })

  it('registra chatbot_lead ao clicar no CTA do chatbot', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>,
    )

    await user.click(screen.getByLabelText(/Abrir chat/i))
    await user.click(screen.getByRole('button', { name: 'Quero me cadastrar' }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Iniciar cadastro/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('link', { name: /Iniciar cadastro/i }))

    const events = getAnalyticsEvents()
    expect(events.some((e) => e.event === 'chatbot_lead')).toBe(true)
  })
})
