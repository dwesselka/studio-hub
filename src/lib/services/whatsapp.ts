export interface WhatsAppMessage {
  to: string
  body: string
}

export function sendWhatsApp(message: WhatsAppMessage): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.info(`[WhatsApp] Mensagem enviada para ${message.to}:\n${message.body}`)
      resolve({ success: true })
    }, 800)
  })
}

export function buildWelcomeMessage(businessName: string, dashboardUrl: string): string {
  return [
    `🖐️ Olá! Seja bem-vindo ao *Infinity Partner*!`,
    ``,
    `Seu negócio *${businessName}* já está configurado e pronto para receber agendamentos.`,
    ``,
    `📌 *Próximos passos:*`,
    `1️⃣ Compartilhe seu link de agendamento com os clientes`,
    `2️⃣ Configure sua equipe e serviços no painel`,
    `3️⃣ Acompanhe seus agendamentos e faturamento`,
    ``,
    `👉 Acesse agora: ${dashboardUrl}`,
    ``,
    `Qualquer dúvida, é só chamar! 💬`,
  ].join('\n')
}
