# Agendamento

## Objetivo

Oferecer agendamento inteligente com sugestões de horários pela IA e confirmações automáticas para reduzir no-show.

## Escopo (in / out)

**In:**
- Calendário com disponibilidade de profissionais/salas
- IA para sugerir horários e reduzir no-show
- Confirmações automáticas (WhatsApp/SMS/e-mail) e lembretes

**Out:**
- Registro de serviços realizados (etapa 04)
- Cobrança e pagamento (etapa 05)

## Subtasks

- [x] Implementar calendário com visualização diária e semanal
- [x] Configurar disponibilidade por profissional, sala e horário de funcionamento
- [x] Criar fluxo de novo agendamento (cliente, serviço, profissional, horário)
- [x] Implementar sugestão de horários pela IA com base em histórico e preferências
- [ ] Permitir reagendamento e cancelamento com regras configuráveis
- [ ] Enviar confirmação automática após agendamento (WhatsApp/SMS/e-mail)
- [ ] Configurar lembretes automáticos (ex.: 24h e 2h antes)
- [x] Registrar status do agendamento (pendente, confirmado, cancelado, no-show)
- [x] Exibir lista de agendamentos do dia no dashboard

## Critérios de aceite

- Parceiro consegue criar, editar e cancelar agendamentos
- IA sugere pelo menos 3 horários alternativos quando solicitado
- Confirmações e lembretes são enviados nos canais configurados
- Calendário reflete disponibilidade real (sem conflitos de horário)
- Status de no-show pode ser registrado manualmente ou automaticamente

## Dependências

- [02-onboarding.md](02-onboarding.md) — horários, serviços e equipe configurados

## Notas técnicas

- Integração com WhatsApp Business API ou provedor de SMS
- IA pode usar histórico de no-show por cliente/horário para priorizar slots
- Considerar bloqueio de horários para intervalos e manutenção
