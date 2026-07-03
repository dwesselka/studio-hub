import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { plans, SITE } from '../data/content'
import { trackCtaClick, trackPageView } from '../lib/analytics'

const SEGMENTS = [
  { id: 'salao', label: 'Salão de beleza' },
  { id: 'barbearia', label: 'Barbearia' },
  { id: 'clinica', label: 'Clínica de estética' },
  { id: 'autonomo', label: 'Profissional autônomo' },
]

export default function CadastroPage() {
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plano') || 'starter'
  const selectedPlan = plans.find((p) => p.id === planId) || plans[0]

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    negocio: '',
    segmento: '',
  })

  useEffect(() => {
    trackPageView('/cadastro')
  }, [])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    trackCtaClick('cadastro-submit', planId)
    alert(
      `Cadastro recebido!\n\nPlano: ${selectedPlan.name}\nNegócio: ${form.negocio}\n\nO fluxo completo de onboarding será implementado na etapa 02.`,
    )
  }

  return (
    <div className="cadastro-page">
      <header className="cadastro-page__header">
        <div className="container">
          <Link to="/" className="header__logo">
            {SITE.name}
          </Link>
        </div>
      </header>

      <main className="container cadastro-page__main">
        <div className="cadastro-page__intro">
          <h1>Crie sua conta</h1>
          <p>Configure seu negócio em menos de 5 minutos. Sem cartão de crédito.</p>
          <div className="cadastro-page__plan">
            Plano selecionado: <strong>{selectedPlan.name}</strong> — {selectedPlan.price}
            {selectedPlan.period}
          </div>
        </div>

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Seu nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              value={form.nome}
              onChange={handleChange}
              placeholder="Maria Silva"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="maria@salao.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone / WhatsApp</label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              required
              value={form.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="form-group">
            <label htmlFor="negocio">Nome do negócio</label>
            <input
              id="negocio"
              name="negocio"
              type="text"
              required
              value={form.negocio}
              onChange={handleChange}
              placeholder="Studio Maria Hair"
            />
          </div>

          <div className="form-group">
            <label htmlFor="segmento">Segmento</label>
            <select id="segmento" name="segmento" required value={form.segmento} onChange={handleChange}>
              <option value="">Selecione...</option>
              {SEGMENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--block">
            Criar conta e continuar
          </button>

          <p className="cadastro-form__note">
            Ao continuar, você concorda com os termos de uso. Já tem conta?{' '}
            <a href="#">Fazer login</a>
          </p>
        </form>
      </main>
    </div>
  )
}
