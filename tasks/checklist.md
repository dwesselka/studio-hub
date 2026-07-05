# ✅ Checklist de Qualidade - StudioHub Connect

> Objetivo: garantir que o projeto siga boas práticas de arquitetura, qualidade, segurança, escalabilidade e padrões enterprise.

---

# 1. Arquitetura

## Estrutura

- [ ] Organização por domínio (`modules/features`), não por tipo de arquivo.
- [ ] Cada módulo é independente.
- [ ] Baixo acoplamento.
- [ ] Alta coesão.
- [ ] Sem dependências circulares.
- [ ] Código fácil de navegar.
- [ ] Estrutura escalável.

## Responsabilidades

- [ ] Controllers apenas recebem requests e retornam responses.
- [ ] Services contêm regras de negócio.
- [ ] Repositories acessam o banco de dados.
- [ ] Mappers convertem entidades/DTOs.
- [ ] DTOs representam entrada e saída da API.
- [ ] Schemas validam dados.

## SOLID

- [ ] Single Responsibility Principle (SRP)
- [ ] Open/Closed Principle (OCP)
- [ ] Liskov Substitution Principle (LSP)
- [ ] Interface Segregation Principle (ISP)
- [ ] Dependency Inversion Principle (DIP)

> Aplicar SOLID com bom senso, evitando abstrações desnecessárias.

---

# 2. Backend

## API

- [ ] REST consistente.
- [ ] Convenção de rotas.
- [ ] Status HTTP corretos.
- [ ] Erros padronizados.
- [ ] Versionamento preparado.
- [ ] Swagger atualizado.

## Validação

- [ ] Nunca confiar no frontend.
- [ ] Todo request validado.
- [ ] Zod em todos os endpoints.
- [ ] Sanitização de entrada.
- [ ] Tratamento de valores nulos.

## Banco de Dados

- [ ] Prisma.
- [ ] PostgreSQL.
- [ ] Migrations.
- [ ] Seed.
- [ ] Índices.
- [ ] Chaves estrangeiras.
- [ ] Constraints.
- [ ] Soft Delete quando necessário.

## Performance

- [ ] Sem N+1 Query.
- [ ] Paginação.
- [ ] Filtros.
- [ ] Busca eficiente.
- [ ] Índices analisados.
- [ ] Cache onde faz sentido.

---

# 3. Frontend

## Componentes

- [ ] Componentes pequenos.
- [ ] Componentes reutilizáveis.
- [ ] Props tipadas.
- [ ] Sem lógica excessiva.

## Estado

- [ ] React Query para estado do servidor.
- [ ] Zustand para estado global.
- [ ] Sem Prop Drilling.
- [ ] Cache inteligente.

## Formulários

- [ ] React Hook Form.
- [ ] Zod.
- [ ] Mensagens amigáveis.
- [ ] Loading.
- [ ] Disabled durante submit.

## UX

- [ ] Skeleton.
- [ ] Empty State.
- [ ] Error State.
- [ ] Success State.
- [ ] Loading State.

---

# 4. Segurança

## Autenticação

- [ ] JWT.
- [ ] Refresh Token.
- [ ] Hash com bcrypt.
- [ ] Expiração de token.
- [ ] Logout.

## Autorização

- [ ] Roles.
- [ ] Permissions.
- [ ] Middleware.

## Segurança Geral

- [ ] Proteção contra SQL Injection.
- [ ] Proteção contra XSS.
- [ ] Proteção contra CSRF (quando aplicável).
- [ ] Rate Limit.
- [ ] Security Headers.
- [ ] Variáveis sensíveis em `.env`.

---

# 5. Qualidade

## Código

- [ ] ESLint.
- [ ] Prettier.
- [ ] Sem warnings.
- [ ] Sem uso de `any`.
- [ ] Sem código morto.
- [ ] Sem duplicação.

## Testes

### Unitários

- [ ] Services.
- [ ] Utils.
- [ ] Validators.

### Integração

- [ ] API.
- [ ] Banco.
- [ ] Prisma.

### End-to-End (E2E)

- [ ] Login.
- [ ] Agendamento.
- [ ] Cadastro.
- [ ] Fluxo principal.

---

# 6. Observabilidade

- [ ] Logs estruturados.
- [ ] Correlation ID.
- [ ] Error Tracking.
- [ ] Monitoramento de Performance.
- [ ] Monitoramento da aplicação.

---

# 7. DevOps

## Git

- [ ] Branches organizadas.
- [ ] Commits semânticos.
- [ ] Pull Requests.
- [ ] Code Review.

## CI

- [ ] Lint.
- [ ] Build.
- [ ] Testes.
- [ ] Coverage.

## CD

- [ ] Deploy automático.
- [ ] Rollback.
- [ ] Ambiente de homologação.

---

# 8. Banco de Dados

- [ ] Relacionamentos corretos.
- [ ] Índices.
- [ ] Constraints.
- [ ] Cascade apenas quando necessário.
- [ ] Nomes consistentes.
- [ ] UUID/CUID.
- [ ] Datas em UTC.

---

# 9. Escalabilidade

- [ ] Arquitetura modular.
- [ ] Fácil adicionar novos módulos.
- [ ] Multiempresa.
- [ ] Multiunidade.
- [ ] Configurações por empresa.

---

# 10. Documentação

- [ ] README completo.
- [ ] Guia de instalação.
- [ ] Arquitetura.
- [ ] Fluxo da aplicação.
- [ ] Swagger.
- [ ] ADRs (Architecture Decision Records).

---

# 11. Acessibilidade

- [ ] Navegação por teclado.
- [ ] Labels.
- [ ] Contraste adequado.
- [ ] Aria-label.
- [ ] Responsividade.

---

# 12. Performance

## Frontend

- [ ] Lazy Loading.
- [ ] Code Splitting.
- [ ] Imagens otimizadas.
- [ ] Fontes otimizadas.

## Backend

- [ ] Queries rápidas.
- [ ] Paginação.
- [ ] Cache.
- [ ] Compressão.

---

# 13. SaaS

- [ ] Multi-tenant.
- [ ] Planos.
- [ ] Limites por plano.
- [ ] Billing preparado.
- [ ] Configuração por empresa.

---

# 14. Domínio - StudioHub

## Empresas

- [ ] Cadastro.
- [ ] Configuração.
- [ ] Plano.

## Funcionários

- [ ] Agenda.
- [ ] Serviços.
- [ ] Horários.

## Clientes

- [ ] Histórico.
- [ ] Fidelidade.
- [ ] Preferências.

## Serviços

- [ ] Duração.
- [ ] Preço.
- [ ] Categoria.

## Agenda

- [ ] Agendamento.
- [ ] Cancelamento.
- [ ] Reagendamento.

## Fila Inteligente

- [ ] Check-in via QR Code.
- [ ] Tempo estimado.
- [ ] Atualização em tempo real.
- [ ] Painel para tablet.
- [ ] Acompanhamento pelo celular.

---

# 15. Diferenciais para Impressionar Recrutadores

- [ ] Arquitetura modular por domínio.
- [ ] SOLID aplicado com bom senso.
- [ ] Prisma com Migrations e Seed.
- [ ] Testes unitários e E2E dos fluxos críticos.
- [ ] Pipeline de CI (Lint + Testes + Build).
- [ ] Observabilidade (Logs + Monitoramento).
- [ ] Tratamento consistente de erros.
- [ ] Performance medida (não presumida).
- [ ] Segurança (Autenticação + Autorização + Validação).
- [ ] README que permita subir o projeto em poucos minutos.

---

# 📊 Critérios de Qualidade

## 🟥 40% — Protótipo

- Frontend funcional.
- Dados mockados.
- Navegação.
- Layout.

---

## 🟨 60% — MVP

- Backend real.
- PostgreSQL.
- Prisma.
- Autenticação.
- CRUD.
- Regras de negócio.

---

## 🟩 80% — Produção (Pilotos)

- Testes.
- Segurança.
- Deploy.
- Documentação.
- Observabilidade.
- Logs.
- Performance.

---

## 🟦 95%+ — Enterprise

- Arquitetura consolidada.
- CI/CD.
- Métricas.
- Monitoramento.
- Cache.
- Escalabilidade.
- Multi-tenant.
- Alta cobertura de testes.
- Projeto pronto para crescer.

---

# 🎯 Objetivo Final

> O objetivo não é atingir 100% imediatamente.

A prioridade é chegar rapidamente ao nível **🟩 80%**, colocar o **StudioHub Connect** em produção para alguns salões reais, validar o produto com usuários e evoluir continuamente com base em métricas e feedback.