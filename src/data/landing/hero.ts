export interface HeroConfig {
  title: string
  subtitle: string
  highlights: string[]
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

export const hero: HeroConfig = {
  title: 'Transforme seu salão ou barbearia em um negócio inteligente',
  subtitle:
    'Agenda online, confirmação no WhatsApp, pagamentos na hora e fidelização — feito para quem vive o dia a dia da beleza.',
  highlights: ['Setup em 5 minutos', 'Sem taxa de adesão', 'Suporte em português'],
}

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
