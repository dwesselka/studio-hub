export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  ctaLabel: string
  cadastroPath: string
}

export interface HeroConfig {
  title: string
  subtitle: string
  highlights: string[]
}

export interface Segment {
  id: string
  label: string
  description: string
  services: string[]
  accent: string
}

export interface Appointment {
  time: string
  client: string
  service: string
  pro: string
  status: 'confirmed' | 'pending'
}

export interface AgendaStats {
  occupancy: string
  today: number
  revenue: string
}

export interface HeroAgenda {
  date: string
  appointments: Appointment[]
  stats: AgendaStats
}

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface Testimonial {
  name: string
  role: string
  quote: string
  segment: 'Salão' | 'Barbearia'
}

export interface Plan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ChatbotTopic {
  keywords: string[]
  answer: string
  lead?: boolean
}

export interface ChatbotKnowledge {
  greeting: string
  topics: ChatbotTopic[]
  fallback: string
  leadPrompt: string
}

export const SITE: SiteConfig = {
  name: 'Infinity Partner',
  tagline: 'Gestão inteligente para salões e barbearias',
  description:
    'Plataforma completa para parceiros de beleza: agendamento com IA, atendimento, pagamentos e fidelização em um só lugar.',
  url: 'https://infinity-partner.com.br',
  ctaLabel: 'Começar grátis',
  cadastroPath: '/cadastro',
}

export const hero: HeroConfig = {
  title: 'Transforme seu salão ou barbearia em um negócio inteligente',
  subtitle:
    'Agenda online, confirmação no WhatsApp, pagamentos na hora e fidelização — feito para quem vive o dia a dia da beleza.',
  highlights: ['Setup em 5 minutos', 'Sem taxa de adesão', 'Suporte em português'],
}

export const segments: Segment[] = [
  {
    id: 'salao',
    label: 'Salão de beleza',
    description: 'Escova, coloração, manicure e equipe com comissão organizada.',
    services: ['Corte feminino', 'Escova', 'Coloração', 'Manicure'],
    accent: 'rose',
  },
  {
    id: 'barbearia',
    label: 'Barbearia',
    description: 'Fila, barba, assinatura e controle de cadeiras em tempo real.',
    services: ['Corte masculino', 'Barba', 'Sobrancelha', 'Plano mensal'],
    accent: 'barber',
  },
]

export const heroAgenda: HeroAgenda = {
  date: 'Hoje, 3 de julho',
  appointments: [
    {
      time: '09:00',
      client: 'Ana Costa',
      service: 'Escova + Hidratação',
      pro: 'Camila',
      status: 'confirmed',
    },
    {
      time: '10:30',
      client: 'João Mendes',
      service: 'Corte + Barba',
      pro: 'Rafael',
      status: 'confirmed',
    },
    { time: '14:00', client: 'Juliana R.', service: 'Manicure gel', pro: 'Pri', status: 'pending' },
  ],
  stats: { occupancy: '87%', today: 12, revenue: 'R$ 1.840' },
}

export const benefits: Benefit[] = [
  {
    icon: 'calendar',
    title: 'Agenda que enche sozinha',
    description:
      'Link de agendamento, confirmação automática no WhatsApp e lembretes que reduzem faltas.',
  },
  {
    icon: 'scissors',
    title: 'Atendimento na cadeira',
    description:
      'Registre serviços, produtos usados e histórico do cliente sem sair do atendimento.',
  },
  {
    icon: 'payment',
    title: 'Pix e cartão na hora',
    description: 'Receba na hora do serviço, concilie com a agenda e veja o caixa do dia.',
  },
  {
    icon: 'chart',
    title: 'Painel do dono',
    description: 'Faturamento, ocupação das cadeiras e ranking de serviços — tudo em um só lugar.',
  },
  {
    icon: 'gift',
    title: 'Cliente voltando sempre',
    description:
      'Aniversário, retorno automático e pontos de fidelidade para encher a agenda de novo.',
  },
  {
    icon: 'chat',
    title: 'Assistente para sua equipe',
    description: 'Tire dúvidas de planos, horários e serviços sem parar o salão.',
  },
]

export const testimonials: Testimonial[] = [
  {
    name: 'Camila Rocha',
    role: 'Proprietária — Studio Camila Hair',
    quote:
      'Reduzi 40% das faltas com os lembretes automáticos. Meus clientes adoram agendar pelo link.',
    segment: 'Salão',
  },
  {
    name: 'Rafael Mendes',
    role: 'Barbeiro — Barbearia Dom Rafael',
    quote:
      'Em uma semana já estava com agenda organizada e pagamentos no Pix funcionando. Muito prático.',
    segment: 'Barbearia',
  },
  {
    name: 'Priscila Andrade',
    role: 'Proprietária — Espaço Priscila Beauty',
    quote: 'A fidelização automática trouxe clientes antigos de volta. Minha agenda não para mais.',
    segment: 'Salão',
  },
]

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

export const faq: FAQItem[] = [
  {
    question: 'Quanto tempo leva para configurar?',
    answer:
      'O setup automático leva cerca de 5 minutos. Você informa os dados do negócio e já recebe horários, serviços e equipe pré-configurados conforme seu segmento.',
  },
  {
    question: 'Preciso instalar algum aplicativo?',
    answer:
      'Não. O Infinity Partner funciona no navegador do celular e do computador. Seus clientes também agendam por um link, sem precisar baixar nada.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'No plano Pro e Clínica você pode receber via Pix e cartão de crédito/débito, com conciliação automática no painel.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer:
      'Sim. Não há fidelidade nem multa. Você pode cancelar quando quiser diretamente no painel.',
  },
  {
    question: 'Funciona para profissional autônomo?',
    answer:
      'Sim! O plano Starter é gratuito e perfeito para quem atende sozinho e quer organizar a agenda sem custo.',
  },
  {
    question: 'Como funciona o suporte?',
    answer:
      'Oferecemos suporte por chat e e-mail em português. Clientes do plano Clínica têm atendimento prioritário.',
  },
]

export const chatbotKnowledge: ChatbotKnowledge = {
  greeting:
    'Olá! Sou a assistente do Infinity Partner. Posso ajudar com dúvidas sobre planos, funcionalidades e como começar. Como posso ajudar?',
  topics: [
    {
      keywords: [
        'plano',
        'planos',
        'preço',
        'preços',
        'valor',
        'quanto custa',
        'custo',
        'mensalidade',
      ],
      answer:
        'Temos 3 planos:\n\n• **Starter** — Grátis (até 50 agendamentos/mês, 1 profissional)\n• **Pro** — R$ 97/mês (agendamentos ilimitados, pagamentos, até 5 profissionais)\n• **Clínica** — R$ 197/mês (profissionais ilimitados, multi-unidade, suporte prioritário)\n\nTodos sem taxa de adesão. Quer começar o cadastro?',
    },
    {
      keywords: [
        'funcionalidade',
        'funcionalidades',
        'recurso',
        'recursos',
        'o que faz',
        'o que oferece',
        'como funciona',
      ],
      answer:
        'O Infinity Partner oferece:\n\n• Agendamento com IA e lembretes automáticos\n• Registro de atendimentos e insumos\n• Pagamentos Pix e cartão\n• Relatórios e dashboard\n• Campanhas de fidelização\n• Chatbot para seus clientes\n\nPosso detalhar alguma dessas funcionalidades?',
    },
    {
      keywords: ['agendamento', 'agenda', 'marcar', 'horário', 'horarios'],
      answer:
        'O agendamento inteligente sugere os melhores horários, envia confirmações e lembretes por WhatsApp, e reduz faltas. Seus clientes agendam por um link personalizado, sem app.',
    },
    {
      keywords: [
        'cadastro',
        'cadastrar',
        'começar',
        'iniciar',
        'registrar',
        'criar conta',
        'signup',
      ],
      answer:
        'O cadastro leva cerca de 5 minutos! Você informa e-mail, dados do negócio e segmento (salão, barbearia, clínica ou autônomo). O setup automático configura horários e serviços iniciais.\n\nPosso te levar direto para o cadastro?',
      lead: true,
    },
    {
      keywords: ['onboarding', 'configurar', 'setup', 'configuração', 'instalar'],
      answer:
        'Após o cadastro, um wizard guiado configura seu negócio em etapas: dados → horários → serviços → equipe. O sistema pré-popula serviços conforme seu segmento. Tudo editável depois.',
    },
    {
      keywords: ['pagamento', 'pix', 'cartão', 'cartao', 'receber'],
      answer:
        'Nos planos Pro e Clínica você recebe via Pix e cartão, com conciliação automática. O plano Starter é gratuito e focado em organização da agenda.',
    },
    {
      keywords: ['salão', 'salao', 'barbearia', 'clínica', 'clinica', 'autônomo', 'autonomo'],
      answer:
        'Atendemos salões, barbearias, clínicas de estética e profissionais autônomos. O setup automático adapta serviços e configurações ao seu segmento.',
    },
    {
      keywords: ['cancelar', 'cancelamento', 'fidelidade', 'contrato'],
      answer:
        'Não há fidelidade nem multa. Você pode cancelar a qualquer momento pelo painel, sem burocracia.',
    },
    {
      keywords: ['suporte', 'ajuda', 'contato', 'atendimento humano'],
      answer:
        'Nosso suporte é em português, por chat e e-mail. Clientes do plano Clínica têm atendimento prioritário.',
    },
  ],
  fallback:
    'Não tenho certeza sobre isso, mas posso ajudar com planos, preços, funcionalidades e cadastro. Quer que eu te levar para criar sua conta gratuita?',
  leadPrompt: 'Ótimo! Clique no botão abaixo para iniciar seu cadastro gratuito:',
}
