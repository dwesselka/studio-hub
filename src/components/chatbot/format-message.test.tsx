import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { formatMessage } from './format-message'

describe('formatMessage', () => {
  it('renderiza texto simples sem formatação', () => {
    const { container } = render(<>{formatMessage('Olá, como posso ajudar?')}</>)
    expect(container).toHaveTextContent('Olá, como posso ajudar?')
  })

  it('converte **negrito** para <strong>', () => {
    render(<>{formatMessage('Plano **Pro** por R$ 97')}</>)
    expect(screen.getByText('Pro').tagName).toBe('STRONG')
  })

  it('quebra linhas com <br>', () => {
    const { container } = render(<>{formatMessage('Linha 1\nLinha 2')}</>)
    expect(container.innerHTML).toContain('<br>')
  })

  it('combina negrito e múltiplas linhas', () => {
    render(<>{formatMessage('**Plano Starter** — Grátis\n**Plano Pro** — R$ 97')}</>)
    const strongs = document.querySelectorAll('strong')
    expect(strongs).toHaveLength(2)
    expect(strongs[0]).toHaveTextContent('Plano Starter')
    expect(strongs[1]).toHaveTextContent('Plano Pro')
  })

  it('retorna texto vazio para string vazia', () => {
    const { container } = render(<>{formatMessage('')}</>)
    expect(container).toHaveTextContent('')
  })
})
