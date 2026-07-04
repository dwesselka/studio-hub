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

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, '', route)
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

describe('Critério: Landing page pública sem autenticação', () => {
  it('renderiza a landing em / sem redirecionamento', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /Sua agenda cheia/i })).toBeInTheDocument()
  })

  it('renderiza cadastro em /cadastro sem autenticação', async () => {
    window.history.pushState({}, '', '/cadastro')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /Criar minha conta/i })).toBeInTheDocument()
  })

  it('LandingPage exibe chatbot e seções principais', () => {
    renderWithRouter(<LandingPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByLabelText(/Abrir assistente virtual/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Sua agenda cheia/i })).toBeInTheDocument()
  })
})

describe('Critério: CTA principal leva ao fluxo de cadastro', () => {
  it('Hero CTA aponta para /cadastro', () => {
    renderWithRouter(<Hero />)
    const ctaSalao = screen.getByRole('link', { name: /Começar para Salão/i })
    expect(ctaSalao).toHaveAttribute('href', `${SITE.cadastroPath}?segmento=salao`)
    const ctaBarbearia = screen.getByRole('link', { name: /Começar para Barbearia/i })
    expect(ctaBarbearia).toHaveAttribute('href', `${SITE.cadastroPath}?segmento=barbearia`)
  })

  it('Header CTA aponta para /cadastro', () => {
    renderWithRouter(<Header />)
    const cta = screen.getByRole('link', { name: SITE.ctaLabel })
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
    expect(screen.getByText(/Plano selecionado:/i)).toHaveTextContent('Premium')
    expect(screen.getByText(/R\$ 197/)).toBeInTheDocument()
  })

  it('formulário de cadastro é submetível', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CadastroPage />)

    await user.type(screen.getByLabelText(/Seu nome/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/E-mail/i), 'maria@test.com')
    await user.type(screen.getByLabelText(/Telefone/i), '11999999999')
    await user.type(screen.getByLabelText(/Nome do negócio/i), 'Studio Test')
    await user.selectOptions(screen.getByLabelText(/Segmento/i), 'salao')

    const submit = screen.getByRole('button', { name: /Criar conta/i })
    expect(submit).toBeEnabled()
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

  it('hero usa layout em coluna no mobile e grid no desktop', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/globals.css'), 'utf-8')
    expect(css).toMatch(/\.hero-split[\s\S]*grid-template-columns/)
  })
})
