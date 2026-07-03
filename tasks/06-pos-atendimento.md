# Pós-atendimento

## Objetivo

Coletar feedback após cada visita e disparar campanhas automáticas para aumentar retorno e engajamento.

## Escopo (in / out)

**In:**
- Coleta de feedback (NPS/avaliação)
- Campanhas automáticas pós-visita (retorno, upsell, aniversário)
- Segmentação básica por comportamento

**Out:**
- Dashboard analítico completo (etapa 07)
- Programa de pontos e fidelização (etapa 08)

## Subtasks

- [ ] Enviar solicitação de feedback (NPS ou avaliação) após atendimento concluído
- [ ] Criar formulário simples de avaliação (nota + comentário opcional)
- [ ] Configurar campanha automática de retorno (ex.: 30 dias sem visita)
- [ ] Configurar campanha de upsell (sugerir serviço complementar)
- [ ] Configurar campanha de aniversário do cliente
- [ ] Implementar segmentação básica (ativo, inativo, alto valor, em risco)
- [ ] Permitir agendar ou pausar campanhas automáticas
- [ ] Registrar taxa de resposta e conversão das campanhas

## Critérios de aceite

- Feedback é solicitado automaticamente após atendimento pago
- Campanhas disparam nos gatilhos configurados (tempo, evento, segmento)
- Parceiro pode ativar/desativar campanhas individualmente
- Segmentação classifica clientes com base em frequência e valor
- Métricas básicas de resposta e conversão são visíveis

## Dependências

- [03-agendamento.md](03-agendamento.md) — dados de visitas e frequência
- [04-atendimento.md](04-atendimento.md) — gatilho pós-atendimento concluído

## Notas técnicas

- Canais de campanha: WhatsApp, e-mail, SMS (conforme opt-in do cliente)
- Respeitar LGPD: consentimento para comunicações marketing
- Templates de mensagem editáveis pelo parceiro
