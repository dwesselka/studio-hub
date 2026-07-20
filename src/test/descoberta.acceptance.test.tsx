import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Hero from '@/components/landing/Hero'
import Header from '@/components/landing/Header'
import CTA from '@/components/landing/CTA'
import Plans from '@/components/landing/Plans'
import LandingPage from '@/pages/LandingPage'
import CadastroPage from '@/pages/CadastroPage'
import App from '@/app/App'
import { SITE } from '@/data/content'

import { AppProviders } from '@/providers'

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, '', route)
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AppProviders>,
  )
}

describe('Critério: Landing page pública sem autenticação', () => {
  it('renderiza a landing em / sem redirecionamento', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /Construa software/i })).toBeInTheDocument()
  })

  it('renderiza cadastro em /cadastro sem autenticação', async () => {
    window.history.pushState({}, '', '/cadastro')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /Comece grátis/i })).toBeInTheDocument()
  })

  it('LandingPage exibe seções principais', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Construa software/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /StudioHub/i })).toBeInTheDocument()
  })
})

describe('Critério: CTA principal leva ao fluxo de cadastro', () => {
  it('Hero CTA aponta para /cadastro', async () => {
    renderWithRouter(<Hero />)
    expect(screen.getByRole('link', { name: /Começar Jornada/i })).toHaveAttribute(
      'href',
      SITE.cadastroPath,
    )
  })

  it('Header CTA aponta para /cadastro', () => {
    renderWithRouter(<Header />)
    const cta = screen.getByRole('link', { name: /Começar Jornada/i })
    expect(cta).toHaveAttribute('href', SITE.cadastroPath)
  })

  it('Banner CTA aponta para /cadastro', () => {
    renderWithRouter(<CTA />)
    const cta = screen.getByRole('link', { name: SITE.ctaLabel })
    expect(cta).toHaveAttribute('href', SITE.cadastroPath)
  })

  it('Planos levam ao cadastro com plano pré-selecionado', () => {
    renderWithRouter(<Plans />)
    const proLink = screen.getByRole('link', { name: /Escolher Pro/i })
    expect(proLink).toHaveAttribute('href', `${SITE.cadastroPath}?plano=pro`)
  })

  it('CadastroPage exibe plano da query string', () => {
    renderWithRouter(<CadastroPage />, { route: '/cadastro?plano=premium' })
    expect(screen.getByText('premium')).toBeInTheDocument()
  })

  it('formulário de cadastro é submetível', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CadastroPage />)

    await user.type(screen.getByLabelText(/Seu nome/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/E-mail/i), 'maria@test.com')
    await user.type(screen.getByLabelText(/^Senha/i), '123456')
    await user.type(screen.getByLabelText(/Confirmar senha/i), '123456')

    const submit = screen.getByRole('button', { name: /Criar conta/i })
    expect(submit).toBeEnabled()
  })
})

describe('Critério: Validação de formulário no cadastro', () => {
  it('exibe erros de validação para campos vazios', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CadastroPage />)

    await user.click(screen.getByRole('button', { name: /Criar conta/i }))

    expect(await screen.findByText(/nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument()
    expect(screen.getByText(/formato de e-mail inválido/i)).toBeInTheDocument()
    expect(screen.getByText(/A senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument()
  })

  it('exibe erro para e-mail inválido', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CadastroPage />)

    await user.type(screen.getByLabelText(/Seu nome/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/E-mail/i), 'email-invalido')
    await user.type(screen.getByLabelText(/^Senha/i), '123456')
    await user.type(screen.getByLabelText(/Confirmar senha/i), '123456')

    await user.click(screen.getByRole('button', { name: /Criar conta/i }))

    expect(await screen.findByText(/formato de e-mail inválido/i)).toBeInTheDocument()
  })

  it('exibe erro para nome muito curto', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CadastroPage />)

    await user.type(screen.getByLabelText(/Seu nome/i), 'AB')
    await user.type(screen.getByLabelText(/E-mail/i), 'maria@test.com')
    await user.type(screen.getByLabelText(/^Senha/i), '123456')
    await user.type(screen.getByLabelText(/Confirmar senha/i), '123456')

    await user.click(screen.getByRole('button', { name: /Criar conta/i }))

    expect(await screen.findByText(/pelo menos 3 caracteres/i)).toBeInTheDocument()
  })

  it('exibe estado de carregamento durante submissão', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CadastroPage />)

    await user.type(screen.getByLabelText(/Seu nome/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/E-mail/i), 'maria@test.com')
    await user.type(screen.getByLabelText(/^Senha/i), '123456')
    await user.type(screen.getByLabelText(/Confirmar senha/i), '123456')

    const submitBtn = screen.getByRole('button', { name: /Criar conta/i })
    await user.click(submitBtn)

    expect(await screen.findByText(/Criando conta/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Criando conta/i })).toBeDisabled()
  })

  it('campos possuem atributos de acessibilidade', () => {
    renderWithRouter(<CadastroPage />)

    expect(screen.getByLabelText(/Seu nome/i)).toHaveAttribute('aria-invalid', 'false')
    expect(screen.getByLabelText(/E-mail/i)).toHaveAttribute('type', 'email')

    const form = screen.getByRole('button', { name: /Criar conta/i }).closest('form')
    expect(form).toHaveAttribute('novalidate')
  })
})

describe('Critério: Página responsiva em mobile e desktop', () => {
  it('index.html define viewport para mobile', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8')
    expect(html).toMatch(/name="viewport"/)
    expect(html).toMatch(/width=device-width/)
  })

  it('globals.css contém breakpoints mobile e desktop', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/globals.css'), 'utf-8')
    expect(css).toMatch(/@media \(min-width: 640px\)/)
    expect(css).toMatch(/@media \(min-width: 768px\)/)
    expect(css).toMatch(/@media \(min-width: 1024px\)/)
  })

  it('header oculta navegação em mobile e exibe em desktop', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/globals.css'), 'utf-8')
    expect(css).toMatch(/\.header__nav[\s\S]*display:\s*none/)
    expect(css).toMatch(/@media \(min-width: 768px\)[\s\S]*\.header__nav[\s\S]*display:\s*flex/)
  })

  it('hero usa layout flexível responsivo', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/globals.css'), 'utf-8')
    expect(css).toMatch(/\.hero-section[\s\S]*min-height/)
    expect(css).toMatch(/\.hero-panel[\s\S]*flex/)
  })
})
