# Ordem de Implementação — Infinity Partner

## Visão

Roadmap de implementação em fases, com critérios de aceite, dependências, riscos e estimativas.

## Fase 1: Fundação (2-3 semanas)

### Por que primeiro

Sem banco rodando e autenticação real, nada funciona em produção. Essa fase desbloqueia todas as outras.

### O que implementar

1. Rodar `prisma migrate dev` para criar as migrations
2. Rodar `pnpm db:seed` para popular banco de teste
3. Subir PostgreSQL via Docker e conectar backend
4. Configurar Vite proxy (`/v1/*` → `localhost:3001`)
5. Migrar autenticação de mock para real (plano em `migracao-login-mock-para-real.md`)
6. Configurar Swagger UI em `/docs`

### Critérios de aceite

- `pnpm db:migrate` cria todas as tabelas no PostgreSQL
- `pnpm db:seed` popula com 3 usuários de teste
- Login com email/senha real retorna JWT
- Rotas protegidas rejeitam requisições sem token
- Frontend consegue logar e ver dashboard

### Dependências

- Docker rodando
- Variáveis de ambiente configuradas (`.env.development`)

### Riscos

- Prisma adapter-pg pode ter breaking changes na v7
- Migração do auth mock → real pode quebrar sessões existentes

### Tempo estimado: 2-3 semanas

---

## Fase 2: Onboarding real (1-2 semanas)

### O que implementar

- Conectar wizard de onboarding à API real
- Cadastro de estabelecimento com criação de dados iniciais
- Upload de logo (S3/R2)

### Critérios

- Usuário cria conta e passa pelo onboarding de ponta a ponta
- Dados persistem no PostgreSQL
- Ao final, é redirecionado ao dashboard com dados reais

---

## Fase 3: Agendamento + Atendimento real (2-3 semanas)

### O que implementar

- Migrar agenda de mock para API real
- CRUD de agendamentos com verificação de conflitos
- Tela de atendimento operando com dados reais
- Notificações WhatsApp (integração)

### Critérios

- Criar/confirmar/cancelar/reagendar agendamentos persiste no banco
- Profissional vê apenas seus agendamentos
- Atendimento cria registro no banco e atualiza status

---

## Fase 4: Pagamentos (2 semanas)

### O que implementar

- Registro de pagamentos reais
- Geração de PIX (QR Code + copia e cola)
- Cálculo de taxas e valor líquido
- Extrato financeiro

### Critérios

- Pagamento PIX exibe QR code funcional
- Valor líquido considera taxa do método
- Dashboard financeiro reflete dados reais

---

## Fase 5: Pós-Atendimento + Fidelização (2 semanas)

### O que implementar

- Coleta de feedback NPS
- Campanhas automáticas (retorno, aniversário, upsell)
- Programa de pontos (acúmulo e resgate)
- Promoções segmentadas

### Critérios

- Feedback salva no banco
- Campanha dispara notificação no prazo configurado
- Pontos acumulam e resgatam corretamente

---

## Fase 6: Relatórios + Analytics (1-2 semanas)

### O que implementar

- Dashboard com KPIs reais (ocupação, receita, retenção, no-show)
- Relatórios por período com exportação CSV/PDF
- Analytics com tendências e comparações

### Critérios

- KPIs calculados a partir de dados reais do banco
- Filtros por período funcionam
- Exportação gera arquivo válido

---

## Fase 7: Produção (1-2 semanas)

### O que implementar

- Deploy frontend (Vercel/Cloudflare)
- Deploy backend (Cloud Run/Railway)
- Banco gerenciado (Neon/Supabase)
- Domínio + SSL
- Monitoramento + alertas
- Testes E2E

### Critérios

- `pnpm build` passa sem erros
- Deploy automatizado via GitHub Actions
- Health check responde 200
- Logs estruturados visíveis no dashboard

---

## Fase 8: Enterprise (contínuo)

- Multi-tenancy avançado
- RBAC completo
- Autoagendamento para clientes
- App mobile (React Native)
- Integração com Google Calendar / iCloud
- API pública para parceiros
