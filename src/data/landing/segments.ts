export interface Segment {
  id: string
  label: string
  description: string
  services: string[]
  accent: string
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
  {
    id: 'clinica',
    label: 'Clínica Estética',
    description: 'Procedimentos, pacotes e agendamento de consultas com horários organizados.',
    services: ['Limpeza de pele', 'Design de sobrancelhas', 'Depilação', 'Pacotes'],
    accent: 'purple',
  },
  {
    id: 'autonomo',
    label: 'Profissional Autônomo',
    description: 'Gestão simples para quem trabalha sozinho em casa ou a domicílio.',
    services: ['Agenda', 'Cartão de visitas', 'Controle financeiro', 'Divulgação'],
    accent: 'sky',
  },
]
