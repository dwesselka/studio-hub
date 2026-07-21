# Agendamento

## Modelos Envolvidos

- `Appointment`: agendamento em si
- `Service`: serviço agendado
- `TeamMember`: profissional que atenderá
- `Cliente`: pessoa agendada
- `BusinessHour`: horários de funcionamento

## Regras

1. **Horário comercial**: agendamento deve cair dentro do `BusinessHour` do dia
2. **Conflito**: não pode haver dois agendamentos com mesmo profissional no mesmo horário
3. **Duração**: baseada no `Service.duration` selecionado
4. **Status**: `pending` → `confirmed` → `completed` | `cancelled`
5. **Cancelamento**: só pode cancelar com aviso mínimo (configurável por empresa)

## Fluxo

1. Frontend lista horários disponíveis baseado em BusinessHour + agendamentos existentes
2. Usuário escolhe serviço + profissional + horário
3. Validação Zod no frontend e backend
4. Backend verifica conflitos via Prisma
5. Cria Appointment com status `pending`
6. Cliente recebe confirmação (futuro: WhatsApp/email)

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
