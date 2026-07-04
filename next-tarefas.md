# Next Tarefas

Lista de próximas tarefas do projeto Infinity Partner, organizada a partir do plano atual em `tasks/`.

## Refatoração e Qualidade

- [ ] Refatorar `CadastroPage`
  - Converter para TSX.
  - Implementar validação com `Zod`.
  - Integrar `React Hook Form`.
  - Substituir `alert()` por tela/modal de sucesso animado.

- [ ] Converter componentes da Landing Page para TSX
  - Migrar componentes ainda em JSX.
  - Tipar props, dados e handlers.
  - Remover dependências de arquivos `.jsx` antigos.

- [ ] Corrigir acessibilidade e layout do `index.html`
  - Revisar carregamento de fontes no `<head>`.
  - Validar metadados essenciais.
  - Melhorar base de acessibilidade da página.

- [ ] Expandir suíte de testes
  - Adicionar testes com Vitest e React Testing Library.
  - Cobrir inputs inválidos.
  - Cobrir fluxos de erro.
  - Validar comportamento do cadastro, landing page e chatbot.

- [ ] Executar validação final
  - Rodar `npm run build`.
  - Rodar `npm run lint`.
  - Rodar `npm run test`.
  - Corrigir qualquer erro encontrado.

## Próximas Etapas do Produto

- [ ] Avançar para etapa 02: Onboarding
  - Implementar cadastro rápido.
  - Criar fluxo de setup inicial do negócio.
  - Persistir dados básicos do parceiro.

- [ ] Avançar para etapa 03: Agendamento
  - Criar fluxo de criação de agendamentos.
  - Adicionar sugestão de horários.
  - Implementar confirmação de agendamento.

- [ ] Avançar para etapa 04: Atendimento
  - Registrar serviços realizados.
  - Registrar produtos/insumos usados.
  - Preparar dados para pagamento e relatórios.
