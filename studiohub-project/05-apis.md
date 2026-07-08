# APIs — Infinity Partner

## Visão

Documentação dos endpoints da API. Objetivo, método, rota, headers, body, query params, response, erros, exemplos, regras de negócio e validações.

## Formato Padrão

- **Base URL:** `http://localhost:3001/v1` (dev) / `https://api.infinity-partner.com.br/v1` (prod)
- **Content-Type:** `application/json`
- **Auth:** `Authorization: Bearer <accessToken>` (rotas protegidas)
- **Request ID:** `X-Request-Id` (gerado automaticamente, retornado no response)

---

## Autenticação

### POST /v1/auth/signup

**Objetivo:** Criar nova conta

**Body:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "João Silva",
  "businessName": "Barbearia do João",
  "businessSegment": "BARBEARIA",
  "businessPhone": "(11) 99999-8888"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "name": "João Silva" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

**Regras:**
- Email único
- Password mínimo 6 caracteres
- Segmento deve ser válido (SALAO, BARBEARIA, CLINICA)
- Cria User + BusinessHours padrão (seg-sab 08:00-18:00)

### POST /v1/auth/login

**Objetivo:** Autenticar usuário

**Body:** `{ "email": "...", "password": "..." }`

**Response (200):** `{ user, accessToken, refreshToken }`

**Erros:** 401 se email/senha inválidos

### POST /v1/auth/refresh

**Objetivo:** Renovar access token

**Body:** `{ "refreshToken": "eyJ..." }`

**Response (200):** `{ user, accessToken, refreshToken }`

### GET /v1/auth/me

**Objetivo:** Retornar dados do usuário logado

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):** `{ id, email, name, businessName, ... }`

### POST /v1/auth/logout

**Objetivo:** Invalidar refresh token

**Response (200):** `{ "message": "Logout realizado" }`

---

## Agenda

Todas as rotas requerem `Authorization: Bearer <token>`.

### GET /v1/agenda

**Objetivo:** Listar agendamentos com filtros

**Query Params:**
| Parâmetro | Tipo | Descrição |
|---|---|---|
| date | string | Filtro por data (YYYY-MM-DD) |
| professionalId | string | Filtro por profissional |
| status | string | Filtro por status |
| page | number | Paginação (default 1) |
| perPage | number | Itens por página (default 50) |

**Response (200):**
```json
{
  "success": true,
  "data": [{ "id": "uuid", "clientName": "Maria", "date": "2026-07-08", ... }],
  "meta": { "page": 1, "perPage": 50, "total": 10, ... }
}
```

### POST /v1/agenda

**Objetivo:** Criar agendamento

**Body:**
```json
{
  "clientName": "Maria Silva",
  "clientPhone": "(11) 97777-6666",
  "serviceId": "uuid-servico",
  "professionalId": "uuid-profissional",
  "date": "2026-07-08",
  "startTime": "14:00",
  "notes": "Cliente prefere lavatório azul"
}
```

**Regras:**
- Não permitir sobreposição de horários com mesmo profissional
- Horário deve estar dentro do expediente
- Serviço e profissional devem pertencer ao mesmo estabelecimento

### PATCH /v1/agenda/:id/confirm

**Objetivo:** Confirmar agendamento

### PATCH /v1/agenda/:id/cancel

**Objetivo:** Cancelar agendamento

**Body:** `{ "reason": "Cliente desistiu" }`

### PATCH /v1/agenda/:id/reschedule

**Objetivo:** Reagendar

**Body:** `{ "date": "2026-07-10", "startTime": "15:00" }`

---

## Atendimentos

### GET /v1/atendimentos

**Objetivo:** Listar atendimentos do dia

### POST /v1/atendimentos

**Objetivo:** Iniciar atendimento (a partir de agendamento ou avulso)

### PATCH /v1/atendimentos/:id/complete

**Objetivo:** Finalizar atendimento, registrar serviços e insumos

---

## Clientes

### GET /v1/clientes

**Objetivo:** Listar clientes com filtros

**Query Params:** `?status=ATIVO`, `?search=Maria`, `?page=1&perPage=50`

### POST /v1/clientes

**Objetivo:** Cadastrar cliente

### GET /v1/clientes/:id

**Objetivo:** Detalhes do cliente (inclui histórico de visitas)

---

## Dashboard

### GET /v1/dashboard/metrics

**Objetivo:** Métricas do dia (agendamentos hoje, taxa de ocupação, etc.)

### GET /v1/dashboard/today

**Objetivo:** Resumo do dia (próximos agendamentos, atendimentos em andamento)

### GET /v1/dashboard/analytics

**Objetivo:** Analytics por período (receita, ticket médio, etc.)

---

## Demais endpoints

Os seguintes domínios seguem o mesmo padrão CRUD:

| Domínio | Métodos | Rota base |
|---|---|---|
| Equipe | GET, POST, PATCH, DELETE | `/v1/equipe` |
| Serviços | GET, POST, PATCH, DELETE | `/v1/servicos` |
| Pagamentos | GET, POST, PATCH | `/v1/pagamentos` |
| Configurações | GET, PATCH | `/v1/configuracoes` |
| Fidelização | GET, POST, PATCH | `/v1/fidelizacao` |
| Pós-Atendimento | GET, POST | `/v1/pos-atendimento` |
| Relatórios | GET | `/v1/relatorios` |
| Onboarding | GET, POST, PATCH | `/v1/onboarding` |

---

## Health Check

### GET /health

**Response (200):** `{ "status": "ok", "timestamp": "..." }`
