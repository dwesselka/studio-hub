export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  ctaLabel: string
  cadastroPath: string
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
