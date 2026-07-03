# Pagamento

## Objetivo

Processar pagamentos via Pix e cartão, registrar receitas por atendimento e oferecer insights financeiros básicos.

## Escopo (in / out)

**In:**
- Cobrança via Pix e cartão
- Conciliação e registro financeiro por atendimento
- Insights: ticket médio, receita por serviço/profissional

**Out:**
- Relatórios avançados e dashboards completos (etapa 07)
- Programa de fidelização (etapa 08)

## Subtasks

- [ ] Integrar gateway de pagamento para Pix (QR code e copia-e-cola)
- [ ] Integrar gateway de pagamento para cartão (crédito/débito)
- [ ] Vincular pagamento ao atendimento concluído
- [ ] Registrar forma de pagamento, valor, taxas e status (pago, pendente, estornado)
- [ ] Implementar conciliação automática de transações Pix
- [ ] Exibir resumo financeiro do dia (receita, pendências, ticket médio)
- [ ] Calcular receita por serviço e por profissional
- [ ] Permitir registro manual de pagamento em dinheiro
- [ ] Gerar comprovante ou recibo por transação

## Critérios de aceite

- Parceiro consegue cobrar via Pix e cartão a partir de um atendimento
- Pagamentos ficam vinculados ao atendimento e ao cliente
- Status de pagamento é atualizado automaticamente quando possível
- Insights básicos (ticket médio, receita por serviço/profissional) são exibidos
- Conciliação Pix registra pagamentos confirmados sem ação manual

## Dependências

- [04-atendimento.md](04-atendimento.md) — atendimento concluído gera cobrança

## Notas técnicas

- Avaliar gateways: Stripe, Mercado Pago, PagSeguro, Asaas
- Taxas do gateway devem ser registradas para cálculo de receita líquida
- Webhooks para confirmação assíncrona de pagamentos Pix
