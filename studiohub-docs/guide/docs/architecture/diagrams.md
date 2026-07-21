# Diagramas de Arquitetura

## Arquitetura completa do sistema

```mermaid
C4Context
    Person(cliente, "Cliente", "Usuário final do salão")
    Person(profissional, "Profissional", "Cabeleireiro, barbeiro, etc.")
    Person(proprietario, "Proprietário", "Dono do estabelecimento")

    System_Boundary(sistema, "StudioHub") {
        Container(frontend, "Frontend", "React + Vite", "SPA com Tailwind, Radix UI, TanStack Query")
        Container(backend, "Backend", "Hono.js + Node.js", "API REST com Prisma ORM")
        ContainerDb(db, "Database", "PostgreSQL 16", "Dados do sistema")
    }

    System_Ext(whatsapp, "WhatsApp API", "Notificações e lembretes")
    System_Ext(pix, "Gateway PIX", "Pagamentos")
    System_Ext(storage, "S3/R2", "Upload de imagens")

    Rel(cliente, frontend, "Acessa landing, agenda online (futuro)")
    Rel(profissional, frontend, "Usa dashboard, agenda, atendimento")
    Rel(proprietario, frontend, "Gerencia negócio, relatórios")
    Rel(frontend, backend, "/v1/* HTTP JSON")
    Rel(backend, db, "Prisma ORM")
    Rel(backend, whatsapp, "Webhook/REST")
    Rel(backend, pix, "API de pagamentos")
    Rel(backend, storage, "Upload/Download")
```

## Fluxo de dados

```mermaid
flowchart TB
    subgraph Frontend
        COMP[Components React]
        HOOKS[Hooks use{*}Data]
        API_CLIENT[ApiClient]
        MOCK[MSW Mock Layer]
    end

    subgraph Backend
        HONO[Hono Router]
        AUTH[Auth Middleware]
        RATE[Rate Limit]
        ROUTES[Route Handlers]
        ZOD[Zod Validation]
        SERVICES[Business Services]
        DTO[DTO Formatters]
    end

    subgraph Data
        PRISMA[Prisma ORM]
        PG[(PostgreSQL)]
    end

    COMP --> HOOKS
    HOOKS --> API_CLIENT
    API_CLIENT --> MOCK
    MOCK --> HOOKS
    API_CLIENT --> HONO
    HONO --> AUTH
    AUTH --> RATE
    RATE --> ROUTES
    ROUTES --> ZOD
    ZOD --> SERVICES
    SERVICES --> DTO
    DTO --> ROUTES
    SERVICES --> PRISMA
    PRISMA --> PG
```

## Modelo de domínio

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String name
        +String hashedPassword
        +Int credits
        +Plan plan
        +String businessName
        +Segment businessSegment
        +String businessPhone
        +Boolean onboardingCompleted
    }

    class Appointment {
        +UUID id
        +String clientName
        +String clientPhone
        +String serviceName
        +Int serviceDuration
        +Decimal servicePrice
        +String professionalName
        +DateTime date
        +String startTime
        +String endTime
        +AppointmentStatus status
    }

    class Atendimento {
        +UUID id
        +String clientName
        +DateTime date
        +Json services
        +Json supplies
        +AtendimentoStatus status
        +Decimal totalValue
    }

    class Payment {
        +UUID id
        +String[] serviceNames
        +DateTime date
        +Decimal totalValue
        +PaymentMethod method
        +PaymentStatus status
        +Decimal paidValue
        +Decimal netValue
    }

    class Cliente {
        +UUID id
        +String nome
        +String telefone
        +Int totalVisitas
        +Decimal totalGasto
        +Status status
    }

    User "1" --> "many" Appointment
    User "1" --> "many" Atendimento
    User "1" --> "many" Payment
    User "1" --> "many" Cliente
    Appointment "1" --> "0..1" Atendimento
    Atendimento "1" --> "0..1" Payment
```

## Pipeline de qualidade

```mermaid
flowchart LR
    CODE["Developer Code"] --> COMMIT["git commit"]
    COMMIT --> HUSKY["Husky: pre-commit"]
    HUSKY --> LINT["lint-staged<br/>ESLint + Prettier"]
    LINT --> OK{"Passou?"}
    OK -->|"Sim"| PUSH["git push"]
    OK -->|"Não"| FIX["Corrigir"]
    FIX --> CODE
    PUSH --> CI["GitHub Actions"]
    CI --> INSTALL["pnpm install"]
    INSTALL --> LINT_ALL["pnpm lint"]
    LINT_ALL --> TEST["pnpm test + pnpm test:server"]
    TEST --> BUILD["pnpm build"]
    BUILD --> DEPLOY["Deploy"]
```

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
