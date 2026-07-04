export interface Testimonial {
  name: string
  role: string
  quote: string
  segment: 'Salão' | 'Barbearia'
}

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
