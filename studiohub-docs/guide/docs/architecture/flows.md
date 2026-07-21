# Fluxos Principais

## Agendamento

```
Cliente → Frontend (React) → API (Hono) → Service → Prisma → PostgreSQL
                                                              ↓
                                                    Verifica conflitos de horário
                                                              ↓
                                                    Cria Appointment (status: pending)
```

1. Usuário seleciona serviço + profissional + horário
2. Frontend valida com Zod antes de enviar
3. API checa conflitos na agenda
4. Retorna sucesso ou erro
5. Cliente pode confirmar recebendo notificação (futuro: WhatsApp)

## Atendimento

```
Início → Seleciona cliente → Adiciona serviços prestados →
→ Registra insumos usados → Finaliza → Gera pagamento
```

1. Profissional inicia atendimento na fila
2. Adiciona serviços realizados
3. Registra consumíveis gastos (baixa no estoque)
4. Finaliza e gera registro de pagamento pendente

## Fidelização

- Cliente acumula pontos a cada atendimento finalizado
- Pontos podem ser trocados por serviços ou descontos
- Promoções automáticas: "indique um amigo", "aniversário", "frequência"
- Regras configuráveis por estabelecimento

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
