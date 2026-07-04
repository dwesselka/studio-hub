export interface Benefit {
  icon: string
  title: string
  description: string
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
