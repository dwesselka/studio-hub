# Fluxos — StudioHub

## Visão

Fluxos completos da jornada do usuário, desde o primeiro contato até a operação diária.

## Fluxo completo do cliente

```mermaid
flowchart TB
    START(["Potencial cliente"]) --> LP["Landing Page"]
    LP -->|"CTA: Começar grátis"| CAD["Cadastro"]
    LP -->|"CTA: Ver planos"| PLANOS["Página de Planos"]

    CAD --> ON["Onboarding"]

    subgraph Onboarding
        ON1["Passo 1: Dados da conta<br/>Email, senha, nome"]
        ON2["Passo 2: Dados do negócio<br/>Nome, segmento, endereço, telefone"]
        ON3["Passo 3: Horários<br/>Dias e horários de funcionamento"]
        ON4["Passo 4: Serviços<br/>Catálogo pré-populado por segmento"]
        ON5["Passo 5: Equipe<br/>Profissionais, cargos, comissões"]
    end

    ON1 --> ON2 --> ON3 --> ON4 --> ON5
    ON5 --> DASH["Dashboard"]

    DASH --> CAD_CLIENTE["Cadastrar primeiro cliente"]
    DASH --> CAD_SERVICO["Ajustar serviços"]
    DASH --> CAD_EQUIPE["Ajustar equipe"]

    CAD_CLIENTE --> AGENDA["Acessar agenda"]
    AGENDA --> NOVO_AGE["Novo agendamento"]

    NOVO_AGE -->|"Cliente chega"| ATEND["Iniciar Atendimento"]
    ATEND -->|"Finalizar"| PAGTO["Pagamento"]
    PAGTO -->|"PIX/Cartão/Dinheiro"| CONCLUIDO(["Atendimento concluído"])

    PAGTO --> POS["Pós-Atendimento"]
    POS -->|"Automático"| FEEDBACK["Solicitar feedback NPS"]
    POS -->|"Automático"| CAMPANHA["Disparar campanhas<br/>Retorno · Aniversário · Upsell"]
    FEEDBACK --> FIDELI["Fidelização<br/>Acúmulo de pontos"]
    CAMPANHA --> FIDELI
    FIDELI -->|"Cliente retorna"| AGENDA
```

## Fluxo de autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant FE as Frontend
    participant API as Backend
    participant DB as PostgreSQL

    U->>FE: Preenche email + senha
    FE->>FE: Valida com Zod (cliente)
    FE->>API: POST /v1/auth/login
    API->>DB: findUnique User (email)
    DB-->>API: User data
    API->>API: verify password (scrypt)
    API->>API: generate JWT (15min)
    API->>API: generate Refresh (7d)
    API-->>FE: { user, accessToken, refreshToken }
    FE->>FE: AuthContext.setUser(user)
    FE->>FE: Salva tokens no SafeLocalStorage
    FE-->>U: Redireciona para /app
```

## Fluxo de agendamento

```mermaid
sequenceDiagram
    participant C as Cliente
    participant P as Profissional
    participant FE as Frontend
    participant API as Backend
    participant DB as PostgreSQL

    C->>P: Solicita horário
    P->>FE: Abre agenda
    FE->>API: GET /v1/agenda?date=2026-07-08&professionalId=X
    API->>DB: Query appointments + business hours
    DB-->>API: Slots ocupados + horários
    API-->>FE: { appointments, availableSlots }
    FE->>FE: Calcula slots disponíveis
    P->>FE: Seleciona horário e serviço
    FE->>API: POST /v1/agenda { client, service, professional, date, time }
    API->>DB: Verifica conflito
    alt Conflito
        API-->>FE: 409 CONFLICT
        FE-->>P: "Horário indisponível"
    else OK
        API->>DB: Create appointment
        DB-->>API: Appointment created
        API-->>FE: 201 { appointment }
        FE-->>P: "Agendamento confirmado"
    end
```

## Fluxo de atendimento

```mermaid
sequenceDiagram
    participant P as Profissional
    participant FE as Frontend
    participant API as Backend
    participant DB as PostgreSQL

    P->>FE: Abre tela de atendimento
    FE->>API: GET /v1/atendimentos?date=today
    API-->>FE: Lista de agendamentos do dia

    P->>FE: Cliente chegou → "Iniciar"
    FE->>API: POST /v1/atendimentos { appointmentId }
    API->>DB: Create Atendimento (status: EM_ANDAMENTO)
    API->>DB: Update Appointment (status: EM_ATENDIMENTO)
    API-->>FE: 201 { atendimento }

    P->>FE: Serviços realizados + Insumos
    P->>FE: "Finalizar"
    FE->>API: PATCH /v1/atendimentos/:id/complete { services, supplies, notes }
    API->>DB: Update Atendimento (status: CONCLUIDO, totalValue)
    API->>DB: Update Appointment (status: CONCLUIDO)
    API->>DB: Deduz insumos do estoque
    API-->>FE: { atendimento, totalValue }

    FE->>API: GET /v1/pagamentos?atendimentoId=X (sugestão de valores)
    FE-->>P: "Total: R$ 89,90. Qual forma de pagamento?"
```

## Fluxo de pagamento

```mermaid
sequenceDiagram
    participant P as Profissional
    participant FE as Frontend
    participant API as Backend

    P->>FE: Abre tela de pagamento
    FE->>API: GET /v1/pagamentos?atendimentoId=X
    API-->>FE: Valores sugeridos por serviço/profissional

    P->>FE: Seleciona método PIX
    FE->>API: POST /v1/pagamentos { atendimentoId, method: "PIX" }
    API-->>FE: QR Code + Copia e Cola

    P->>FE: Confirma pagamento
    FE->>API: PATCH /v1/pagamentos/:id/confirm { paidValue }
    API-->>FE: { payment: { status: "CONCLUIDO", netValue } }
    FE-->>P: "Pagamento confirmado!"
```

## Fluxo de onboarding

```mermaid
flowchart TB
    START["Usuário cria conta"] --> STEP1["Passo 1: Dados do Negócio<br/>• Nome do salão/barbearia<br/>• Segmento (Salão/Barbearia/Clínica)<br/>• Endereço<br/>• Telefone"]
    STEP1 --> STEP2["Passo 2: Horários<br/>• Dias de funcionamento<br/>• Horário abertura/fechamento<br/>• Múltiplos turnos opcionais"]
    STEP2 --> STEP3["Passo 3: Serviços<br/>• Catálogo pré-populado por segmento<br/>• Personalização de preços/duração<br/>• Ativar/desativar serviços"]
    STEP3 --> STEP4["Passo 4: Equipe<br/>• Nome do profissional<br/>• Cargo/função<br/>• Especialidades<br/>• Comissão"]
    STEP4 --> DONE["Onboarding concluído!"]
    DONE --> DASH["Dashboard"]

    STEP1 -.->|"POST /v1/onboarding/business"| API1
    STEP2 -.->|"POST /v1/onboarding/hours"| API2
    STEP3 -.->|"POST /v1/onboarding/services"| API3
    STEP4 -.->|"POST /v1/onboarding/team"| API4
    DONE -.->|"POST /v1/onboarding/complete"| APIDONE
```

## Fluxo de pós-atendimento e fidelização

```mermaid
flowchart LR
    ATEND["Atendimento concluído"] --> FDBK["Dispara feedback<br/>via WhatsApp"]
    FDBK -->|"Cliente responde"| NPS["Registra NPS"]
    FDBK -->|"Sem resposta em 24h"| RELEMBRAR["Relembrar via WhatsApp"]

    ATEND --> PTS["Acumula pontos<br/>(programa fidelidade)"]
    PTS --> SALDO["ClientePoints.balance += points"]

    ATEND --> CAMP["Verifica campanhas ativas"]
    CAMP -->|"30 dias sem visita"| RETORNO["Campanha de Retorno"]
    CAMP -->|"Aniversário próximo"| ANIV["Campanha de Aniversário"]
    CAMP -->|"Cliente alto gasto"| UPSELL["Campanha de Upsell"]
```

## Responsabilidades por papel

| Papel            | Ações                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| **Proprietário** | Configurar negócio, ver dashboard, gerenciar equipe/serviços, ver relatórios |
| **Profissional** | Ver agenda, realizar atendimento, registrar pagamento                        |
| **Cliente**      | Agendar (futuro: autoatendimento), receber lembretes, dar feedback           |
