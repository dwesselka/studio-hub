# Relatórios

## Objetivo

Oferecer dashboard com métricas operacionais e financeiras, além de recomendações da IA para melhorar o negócio.

## Escopo (in / out)

**In:**
- Dashboard com KPIs: ocupação, receita, retenção, no-show
- Recomendações da IA com base nos dados
- Exportação/filtros por período e unidade

**Out:**
- Campanhas de fidelização (etapa 08)
- BI avançado ou integrações contábeis externas

## Subtasks

- [ ] Criar dashboard principal com KPIs do período selecionado
- [ ] Exibir taxa de ocupação (horários preenchidos vs. disponíveis)
- [ ] Exibir receita total, ticket médio e receita por profissional/serviço
- [ ] Exibir taxa de retenção e clientes recorrentes vs. novos
- [ ] Exibir taxa de no-show e cancelamentos
- [ ] Implementar recomendações da IA (ex.: horários ociosos, serviços mais rentáveis)
- [ ] Adicionar filtros por período (dia, semana, mês, customizado)
- [ ] Permitir exportação de dados (CSV ou PDF)
- [ ] Criar gráficos de tendência para receita e ocupação

## Critérios de aceite

- Dashboard carrega KPIs principais em menos de 3 segundos
- Filtros de período atualizam todos os widgets consistentemente
- Recomendações da IA são geradas com base em dados reais do negócio
- Exportação inclui dados filtrados do período selecionado
- Métricas refletem dados de agendamento, atendimento e pagamento

## Dependências

- [04-atendimento.md](04-atendimento.md) — dados de serviços prestados
- [05-pagamento.md](05-pagamento.md) — dados financeiros
- [06-pos-atendimento.md](06-pos-atendimento.md) — dados de retenção e feedback

## Notas técnicas

- Cache de agregações para períodos frequentes (hoje, semana, mês)
- IA pode usar prompt com snapshot dos KPIs para gerar recomendações acionáveis
- Considerar comparação período atual vs. anterior
