# Fidelização

## Objetivo

Reter clientes por meio de programa de pontos, promoções personalizadas e campanhas recorrentes com acompanhamento de conversão.

## Escopo (in / out)

**In:**
- Programa de pontos e recompensas
- Promoções personalizadas por perfil de cliente
- Campanhas recorrentes e acompanhamento de conversão

**Out:**
- Marketplace externo ou parcerias com marcas
- Gamificação avançada

## Subtasks

- [ ] Definir regras do programa de pontos (acúmulo por valor, visita ou serviço)
- [ ] Implementar resgate de pontos por desconto ou serviço gratuito
- [ ] Exibir saldo de pontos no perfil do cliente
- [ ] Criar promoções personalizadas por segmento (alto valor, inativo, aniversariante)
- [ ] Configurar campanhas recorrentes (mensal, sazonal, datas comemorativas)
- [ ] Acompanhar conversão de promoções (enviadas, abertas, resgatadas)
- [ ] Notificar clientes sobre pontos acumulados e promoções disponíveis
- [ ] Permitir ao parceiro criar e editar regras de fidelização

## Critérios de aceite

- Clientes acumulam pontos automaticamente após pagamento confirmado
- Resgate de pontos aplica desconto ou benefício no próximo atendimento
- Promoções podem ser direcionadas por segmento de cliente
- Parceiro visualiza taxa de conversão das campanhas de fidelização
- Regras de pontos e promoções são configuráveis sem suporte técnico

## Dependências

- [06-pos-atendimento.md](06-pos-atendimento.md) — segmentação e campanhas base
- [07-relatorios.md](07-relatorios.md) — métricas de retenção e conversão

## Notas técnicas

- Pontos podem expirar após período configurável
- Integrar com fluxo de pagamento para aplicar desconto por resgate
- Ciclo de fidelização alimenta campanhas de descoberta (indicação/referral) como extensão futura
