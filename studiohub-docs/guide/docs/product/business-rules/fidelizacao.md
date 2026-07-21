# Fidelização

## Modelos Envolvidos

- `LoyaltyProgram`: configuração do programa (pontos por real gasto, etc.)
- `ClientPoints`: saldo de pontos do cliente
- `PointsTransaction`: histórico de transações (crédito/débito)
- `LoyaltyPromotion`: promoções ativas

## Regras

1. **Acúmulo**: X pontos a cada R$1 gasto em serviços (configurável)
2. **Resgate**: cliente troca pontos por serviços ou descontos
3. **Expiração**: pontos expiram em N meses (configurável)
4. **Promoções**: "aniversário" (dobro de pontos), "frequência" (bônus após X visitas), "indique um amigo"
5. **Campanhas**: campanhas automáticas baseadas em comportamento do cliente

## Fluxo

1. Atendimento finalizado → sistema calcula pontos com base no valor
2. `PointsTransaction` criada (crédito)
3. `ClientPoints.points` atualizado
4. Se cliente atingiu meta de promoção, bônus é aplicado automaticamente
5. Frontend exibe saldo e histórico na página de fidelização

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
