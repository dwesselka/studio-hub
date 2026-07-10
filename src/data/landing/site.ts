export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  ctaLabel: string
  cadastroPath: string
  modules: { name: string; description: string }[]
}

export const SITE: SiteConfig = {
  name: 'StudioHub',
  tagline: 'Onde a beleza encontra a gestão',
  description:
    'Plataforma completa para salões, barbearias e clínicas: agendamento, pagamentos, marketing, IA e insights em um só lugar.',
  url: 'https://studiohub.com.br',
  ctaLabel: 'Começar grátis',
  cadastroPath: '/cadastro',
  modules: [
    { name: 'StudioHub Agenda', description: 'Agendamento inteligente sem filas' },
    { name: 'StudioHub Finance', description: 'Controle financeiro completo' },
    { name: 'StudioHub Clientes', description: 'Gestão de relacionamento' },
    { name: 'StudioHub Marketing', description: 'Campanhas e fidelização' },
    { name: 'StudioHub AI', description: 'Inteligência artificial para o seu negócio' },
    { name: 'StudioHub Pay', description: 'Pagamentos Pix, crédito e débito' },
    { name: 'StudioHub Insights', description: 'Relatórios e analytics' },
  ],
}
