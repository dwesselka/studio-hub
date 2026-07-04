# Atendimento

## Objetivo

Registrar serviços prestados e insumos consumidos durante cada atendimento, vinculando ao histórico do cliente.

## Escopo (in / out)

**In:**
- Registro de serviços realizados por cliente/profissional
- Controle de insumos consumidos e baixa de estoque
- Histórico de atendimentos vinculado ao perfil do cliente

**Out:**
- Processamento de pagamento (etapa 05)
- Campanhas pós-atendimento (etapa 06)

## Subtasks

- [x] Criar tela de atendimento vinculada ao agendamento do dia
- [x] Registrar serviços realizados, profissional responsável e duração
- [x] Associar insumos consumidos ao atendimento com quantidade
- [x] Implementar baixa automática de estoque ao finalizar atendimento
- [x] Permitir adicionar observações e anotações por atendimento
- [x] Exibir histórico completo de atendimentos no perfil do cliente
- [x] Marcar atendimento como concluído, em andamento ou cancelado
- [x] Gerar resumo do atendimento para encaminhar ao pagamento

## Critérios de aceite

- Cada atendimento registra serviços, profissional e insumos utilizados
- Estoque é atualizado automaticamente após conclusão
- Histórico do cliente mostra todos os atendimentos anteriores
- Atendimentos do dia aparecem listados a partir dos agendamentos
- Dados do atendimento ficam disponíveis para pagamento e relatórios

## Dependências

- [02-onboarding.md](02-onboarding.md) — catálogo de serviços e equipe
- [03-agendamento.md](03-agendamento.md) — agendamentos como origem do atendimento

## Notas técnicas

- Insumos podem ter unidade de medida (ml, unidade, grama)
- Alerta de estoque baixo pode ser implementado como extensão
- Fotos antes/depois do atendimento como feature opcional futura
