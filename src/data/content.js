export const SITE = {
  name: 'Infinity Partner',
  tagline: 'Gestão inteligente para salões, barbearias e clínicas de beleza',
  description:
    'Plataforma completa para parceiros de beleza: agendamento com IA, atendimento, pagamentos e fidelização em um só lugar.',
  url: 'https://infinity-partner.com.br',
  ctaLabel: 'Começar grátis',
  cadastroPath: '/cadastro',
}

export const hero = {
  title: 'Transforme seu salão em um negócio inteligente',
  subtitle:
    'Agendamento com IA, controle de atendimentos, pagamentos e campanhas de fidelização — tudo em uma plataforma feita para o segmento de beleza.',
  highlights: ['Setup em 5 minutos', 'Sem taxa de adesão', 'Suporte em português'],
}

export const benefits = [
  {
    icon: '📅',
    title: 'Agendamento inteligente',
    description:
      'A IA sugere horários, envia confirmações automáticas e reduz faltas com lembretes personalizados.',
  },
  {
    icon: '💇',
    title: 'Atendimento completo',
    description:
      'Registre serviços, insumos e histórico do cliente em poucos cliques, direto do celular.',
  },
  {
    icon: '💳',
    title: 'Pagamentos integrados',
    description: 'Aceite Pix e cartão, concilie recebimentos e acompanhe o fluxo de caixa em tempo real.',
  },
  {
    icon: '📊',
    title: 'Relatórios e insights',
    description:
      'Dashboard com métricas de faturamento, ocupação e recomendações para crescer seu negócio.',
  },
  {
    icon: '🎁',
    title: 'Fidelização automática',
    description:
      'Campanhas de retorno, promoções personalizadas e programa de pontos para manter clientes voltando.',
  },
  {
    icon: '🤖',
    title: 'Assistente IA 24h',
    description:
      'Chatbot que responde dúvidas dos seus clientes e ajuda sua equipe no dia a dia.',
  },
]

export const testimonials = [
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
    name: 'Dra. Juliana Costa',
    role: 'Dermatologista estética — Clínica JC',
    quote:
      'O controle de insumos e o histórico de procedimentos facilitaram muito a gestão da clínica.',
    segment: 'Clínica',
  },
]

export const plans = [
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
    id: 'clinica',
    name: 'Clínica',
    price: 'R$ 197',
    period: '/mês',
    description: 'Para clínicas e redes com múltiplas unidades.',
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

export const faq = [
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

export const chatbotKnowledge = {
  greeting:
    'Olá! Sou a assistente do Infinity Partner. Posso ajudar com dúvidas sobre planos, funcionalidades e como começar. Como posso ajudar?',
  topics: [
    {
      keywords: ['plano', 'planos', 'preço', 'preços', 'valor', 'quanto custa', 'custo', 'mensalidade'],
      answer:
        'Temos 3 planos:\n\n• **Starter** — Grátis (até 50 agendamentos/mês, 1 profissional)\n• **Pro** — R$ 97/mês (agendamentos ilimitados, pagamentos, até 5 profissionais)\n• **Clínica** — R$ 197/mês (profissionais ilimitados, multi-unidade, suporte prioritário)\n\nTodos sem taxa de adesão. Quer começar o cadastro?',
    },
    {
      keywords: ['funcionalidade', 'funcionalidades', 'recurso', 'recursos', 'o que faz', 'o que oferece'],
      answer:
        'O Infinity Partner oferece:\n\n• Agendamento com IA e lembretes automáticos\n• Registro de atendimentos e insumos\n• Pagamentos Pix e cartão\n• Relatórios e dashboard\n• Campanhas de fidelização\n• Chatbot para seus clientes\n\nPosso detalhar alguma dessas funcionalidades?',
    },
    {
      keywords: ['agendamento', 'agenda', 'marcar', 'horário', 'horarios'],
      answer:
        'O agendamento inteligente sugere os melhores horários, envia confirmações e lembretes por WhatsApp, e reduz faltas. Seus clientes agendam por um link personalizado, sem app.',
    },
    {
      keywords: ['cadastro', 'cadastrar', 'começar', 'iniciar', 'registrar', 'criar conta', 'signup'],
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
    'Não tenho certeza sobre isso, mas posso ajudar com planos, preços, funcionalidades e cadastro. Quer que eu te leve para criar sua conta gratuita?',
  leadPrompt: 'Ótimo! Clique no botão abaixo para iniciar seu cadastro gratuito:',
}
