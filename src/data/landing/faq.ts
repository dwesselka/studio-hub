export interface FAQItem {
  question: string
  answer: string
}

export const faq: FAQItem[] = [
  {
    question: 'Quanto tempo leva para configurar?',
    answer:
      'O setup automático leva cerca de 5 minutos. Você informa os dados do negócio e já recebe horários, serviços e equipe pré-configurados conforme seu segmento.',
  },
  {
    question: 'Preciso instalar algum aplicativo?',
    answer:
      'Não. O StudioHub funciona no navegador do celular e do computador. Seus clientes também agendam por um link, sem precisar baixar nada.',
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
