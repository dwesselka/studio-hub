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

export const chatbotKnowledge: ChatbotKnowledge = {
  greeting:
    'Olá! Sou a assistente do StudioHub. Posso ajudar com dúvidas sobre planos, funcionalidades e como começar. Como posso ajudar?',
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
        'O StudioHub oferece:\n\n• StudioHub Agenda — Agendamento inteligente\n• StudioHub Pay — Pagamentos Pix e cartão\n• StudioHub Clientes — CRM completo\n• StudioHub Finance — Controle financeiro\n• StudioHub Marketing — Campanhas e fidelização\n• StudioHub AI — Inteligência artificial\n• StudioHub Insights — Relatórios e analytics\n\nPosso detalhar algum desses módulos?',
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
