---
outline: deep
---

# Perfis de Acesso (RBAC)

## Visão Geral

O sistema possui **3 perfis de acesso**, cada um com permissões específicas:

| Perfil           | Descrição                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Lojista**      | Dono do negócio. Acesso total ao sistema.                                                     |
| **Profissional** | Funcionário (cabeleireiro, barbeiro, manicure, etc.). Login próprio com permissões limitadas. |
| **Cliente**      | Cliente do salão. Portal próprio para agendamentos, histórico e fidelidade.                   |

---

## Modelagem

### User (Prisma)

```prisma
enum Role {
  lojista
  profissional
  cliente
}

model User {
  id               String   @id @default(uuid())
  email            String   @unique
  hashedPassword   String
  name             String
  role             Role     @default(lojista)

  // Relacionamento com o dono do negócio
  businessOwnerId  String?
  businessOwner    User?    @relation("BusinessOwner", fields: [businessOwnerId], references: [id])

  // Profissionais vinculados a este User
  staffAccounts    User[]   @relation("BusinessOwner")

  // Link para TeamMember (se for profissional)
  teamMemberId     String?  @unique
  teamMember       TeamMember? @relation(fields: [teamMemberId], references: [id])

  // Link para Cliente (se for cliente)
  clienteId        String?  @unique
  cliente          Cliente? @relation(fields: [clienteId], references: [id])

  // --- Campos do Lojista (apenas para role = lojista) ---
  credits            Int       @default(5)
  plan               String    @default("starter")
  businessName       String?
  businessSegment    String?
  businessAddress    String?
  businessPhone      String?
  businessLogo       String?
  onboardingCompleted Boolean  @default(false)

  // --- Relações existentes (apontam para o lojista) ---
  businessHours      BusinessHour[]
  services           Service[]
  teamMembers        TeamMember[]
  clients            Cliente[]
  consumables        Consumable[]
  appointments       Appointment[]
  atendimentos       Atendimento[]
  payments           Payment[]
  loyaltyProgram     LoyaltyProgram?
  clientPoints       ClientPoints[]
  pointsTransactions PointsTransaction[]
  promotions         LoyaltyPromotion[]
  feedbacks          Feedback[]
  campaigns          Campaign[]

  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

### Regras

- **Lojista** (`role = lojista`):
  - `businessOwnerId` = `null` (é raiz)
  - Possui todos os campos de negócio (`credits`, `plan`, `businessName`, etc.)
  - É dono de todas as relações (serviços, equipe, clientes, etc.)

- **Profissional** (`role = profissional`):
  - `businessOwnerId` → ID do lojista
  - `teamMemberId` → ID do registro em `TeamMember`
  - **Não** possui campos de negócio (são herdados do lojista)
  - Visualiza apenas dados associados a ele próprio (próprios agendamentos, próprios atendimentos)

- **Cliente** (`role = cliente`):
  - `businessOwnerId` → ID do lojista
  - `clienteId` → ID do registro em `Cliente`
  - Acessa apenas seus próprios dados (agendamentos, histórico, pontos)

---

## Matriz de Permissões

| Funcionalidade     | Lojista                             | Profissional                | Cliente                     |
| ------------------ | ----------------------------------- | --------------------------- | --------------------------- |
| **Dashboard**      | Geral do negócio                    | Próprio desempenho          | ❌                          |
| **Agenda**         | Todos os profissionais              | Própria agenda              | Próprios agendamentos       |
| **Atendimento**    | Todos                               | Próprios                    | ❌                          |
| **Clientes**       | CRUD completo                       | Consulta (visualizar dados) | ❌                          |
| **Financeiro**     | Completo (recebimentos, relatórios) | ❌                          | ❌                          |
| **Equipe**         | CRUD completo                       | ❌                          | ❌                          |
| **Serviços**       | CRUD completo                       | ❌                          | ❌                          |
| **Configurações**  | Completo                            | ❌                          | ❌                          |
| **Fidelidade**     | Gerenciar programa                  | Consultar pontos do cliente | Próprios pontos e promoções |
| **Campanhas**      | CRUD completo                       | ❌                          | ❌                          |
| **Insumos**        | CRUD completo                       | ❌                          | ❌                          |
| **Perfil Próprio** | Editar                              | Editar                      | Editar                      |

---

## Middleware de Autorização

### `roleGuard`

```typescript
// server/lib/middleware.ts
export function roleGuard(...allowedRoles: Role[]) {
  return async (c: Context, next: Next) => {
    const userRole = c.get('userRole') as Role
    if (!allowedRoles.includes(userRole)) {
      return c.json({ error: 'FORBIDDEN', message: 'Acesso não autorrado' }, 403)
    }
    await next()
  }
}
```

### Uso nas rotas

```typescript
// server/routes/dashboard.ts
router.get('/dashboard', authGuard, roleGuard('lojista'), dashboardHandler)

// server/routes/agenda.ts
router.get('/agenda', authGuard, roleGuard('lojista', 'profissional'), agendaHandler)
router.get('/agenda/minhas', authGuard, roleGuard('profissional'), minhasAgendasHandler)

// server/routes/clientes.ts
router.get('/clientes', authGuard, roleGuard('lojista'), listarClientes)
router.get('/clientes/:id', authGuard, roleGuard('lojista', 'profissional'), detalheCliente)
```

### `authGuard` modificado

O `authGuard` atual (que extrai `userId` e `userEmail`) deve também popular `c.set('userRole', user.role)` e `c.set('businessOwnerId', user.businessOwnerId ?? user.id)` para que as queries filtrem corretamente.

---

## Fluxo de Criação de Cada Perfil

### Lojista

Fluxo atual de signup inalterado:

```
POST /v1/auth/signup { email, password, name }
  → Cria User com role = lojista
  → Cria horários padrão
  → Cria programa de fidelidade padrão
  → Retorna tokens
```

### Profissional

Criado pelo **lojista** na tela de equipe:

```
POST /v1/equipe { name, role, phone, email, commission, specialties }
  → Cria TeamMember
  → Envia email convite para o profissional definir senha
  → Profissional acessa link, define senha → User com role = profissional é criado
  → Login do profissional redireciona para /app/profissional
```

**Endpoint de convite:**

```typescript
POST /v1/equipe/:id/convite
  → Gera token de convite (válido por 48h)
  → Envia email com link: /convite?token=xxx
```

**Endpoint de ativação:**

```typescript
POST /v1/auth/ativar-convite { token, password }
  → Valida token
  → Cria User { role: profissional, businessOwnerId, teamMemberId }
  → Retorna tokens
```

### Cliente

Duas formas de criação:

**1. Pelo Lojista (no cadastro de clientes):**

```
POST /v1/clientes { nome, email, telefone, ... }
  → Cria Cliente
  → Opcionalmente envia convite para criar acesso ao portal
```

**2. Auto-cadastro pelo portal:**

```
POST /v1/auth/cadastro-cliente { nome, email, telefone, password, businessSlug }
  → Localiza o lojista pelo slug
  → Cria Cliente + User { role: cliente, businessOwnerId, clienteId }
  → Retorna tokens
```

---

## Frontend — Rotas por Perfil

### Estrutura de Rotas

```typescript
// src/app/App.tsx
<Routes>
  {/* Públicas */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/cadastro" element={<OnboardingPage />} />
  <Route path="/convite" element={<ConvitePage />} />

  {/* Lojista */}
  <Route path="/app" element={<AuthGuard role="lojista"><AppLayout /></AuthGuard>}>
    <Route index element={<DashboardPage />} />
    <Route path="agendamentos" element={<AgendaPage />} />
    <Route path="atendimento" element={<AtendimentoPage />} />
    <Route path="pos-atendimento" element={<PosAtendimentoPage />} />
    <Route path="clientes" element={<ClientesPage />} />
    <Route path="servicos" element={<ServicosPage />} />
    <Route path="equipe" element={<EquipePage />} />
    <Route path="pagamentos" element={<PagamentoPage />} />
    <Route path="relatorios" element={<RelatoriosPage />} />
    <Route path="analytics" element={<AnalyticsPage />} />
    <Route path="fidelizacao" element={<FidelizacaoPage />} />
    <Route path="configuracoes" element={<ConfiguracoesPage />} />
  </Route>

  {/* Profissional */}
  <Route path="/app/profissional" element={<AuthGuard role="profissional"><ProfessionalLayout /></AuthGuard>}>
    <Route index element={<ProfessionalDashboard />} />
    <Route path="agenda" element={<MyAgendaPage />} />
    <Route path="atendimentos" element={<MyAtendimentosPage />} />
    <Route path="clientes" element={<ClientesConsultaPage />} />
  </Route>

  {/* Cliente */}
  <Route path="/portal" element={<AuthGuard role="cliente"><ClientLayout /></AuthGuard>}>
    <Route index element={<ClientDashboard />} />
    <Route path="agendamentos" element={<MyAppointmentsPage />} />
    <Route path="historico" element={<MyHistoryPage />} />
    <Route path="fidelidade" element={<MyLoyaltyPage />} />
    <Route path="perfil" element={<MyProfilePage />} />
  </Route>
</Routes>
```

### AuthGuard com role

```typescript
// src/features/auth/guard.tsx
export function AuthGuard({ role, children }: { role?: Role; children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner label="Verificando acesso..." />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  if (user.role === 'lojista' && !user.onboardingData?.completed)
    return <Navigate to="/cadastro" replace />

  return <>{children}</>
}
```

### Sidebar por Perfil

Cada perfil tem sua própria sidebar com navegação específica:

- **Lojista**: Sidebar completa (Dashboard, Agenda, Atendimento, Clientes, Serviços, Equipe, Financeiro, etc.)
- **Profissional**: Sidebar simplificada (Dashboard, Minha Agenda, Meus Atendimentos, Clientes)
- **Cliente**: Sidebar do portal (Meus Agendamentos, Histórico, Fidelidade, Perfil)

---

## Implementação — Passos

### Fase 1 — Backend

1. Adicionar campo `role` ao modelo `User` no Prisma
2. Adicionar `businessOwnerId`, `teamMemberId`, `clienteId` ao modelo `User`
3. Criar migration
4. Modificar `authGuard` para popular `userRole` e `businessOwnerId` no contexto
5. Criar `roleGuard` middleware
6. Aplicar `roleGuard` nas rotas conforme matriz de permissões
7. Adaptar queries para filtrar por `businessOwnerId` quando `role ≠ lojista`
8. Criar endpoints de convite e ativação para profissionais
9. Criar endpoint de auto-cadastro para clientes

### Fase 2 — Frontend

1. Adicionar `role` ao `AuthUser` type no frontend
2. Modificar `AuthGuard` para aceitar `role` opcional
3. Criar layouts específicos (ProfessionalLayout, ClientLayout)
4. Criar componentes de sidebar por perfil
5. Adaptar `apiFetch` para incluir o role nas chamadas
6. Criar páginas do profissional (dashboard, agenda, atendimentos, clientes)
7. Criar páginas do portal do cliente

### Fase 3 — Seed

1. Adicionar profissionais de exemplo com User vinculado
2. Adicionar clientes com User vinculado
3. Atualizar seed para criar dados de exemplo para todos os perfis

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
