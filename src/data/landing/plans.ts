export interface Plan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'R$ 0',
    period: '/mês',
    description: 'Ideal para profissionais autônomos começando.',
    features: [
      'Até 50 agendamentos/mês',
      'Agenda online',
      'Lembretes por WhatsApp',
      '1 profissional',
    ],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 97',
    period: '/mês',
    description: 'Para salões e barbearias em crescimento.',
    features: [
      'Agendamentos ilimitados',
      'Pagamentos Pix e cartão',
      'Até 5 profissionais',
      'Relatórios básicos',
      'Campanhas de fidelização',
    ],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 197',
    period: '/mês',
    description: 'Para redes e equipes grandes com múltiplas unidades.',
    features: [
      'Tudo do Pro',
      'Profissionais ilimitados',
      'Controle de insumos',
      'Multi-unidade',
      'Suporte prioritário',
      'API e integrações',
    ],
    highlighted: false,
  },
]
