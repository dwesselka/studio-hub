# Atendimento

Gerenciamento da fila de atendimentos em tempo real.

## Layout

```
┌──────────────────────────────────────────────┐
│ ✂️ Atendimento                   [Fila: 3]   │
├──────────────────────────────────────────────┤
│ Em Andamento                                │
│ ┌────────────────────────────────────────┐   │
│ │ Ana Costa  · Corte + Barba             │   │
│ │ Início: 10:30  · Camila               │   │
│ │ [Adicionar Serviço] [Finalizar]        │   │  ← Card ativo
│ └────────────────────────────────────────┘   │
├──────────────────────────────────────────────┤
│ Na Fila                                     │
│ ┌────────────────────────────────────────┐   │
│ │ João M.  · Barba  · 10:30  · Rafael  │   │
│ │ Juliana  · Mani   · 14:00  · Pri     │   │
│ └────────────────────────────────────────┘   │
├──────────────────────────────────────────────┤
│ Insumos do Atendimento Atual:               │
│ ● Shampoo 50ml  ● Condicionador 30ml       │  ← Baixa estoque
└──────────────────────────────────────────────┘
```

## Funcionalidades

- Iniciar atendimento (cliente sai da fila)
- Adicionar serviços prestados durante o atendimento
- Registrar insumos consumidos (baixa automática no estoque)
- Finalizar atendimento (gera registro de pagamento)
- Histórico de atendimentos do cliente

## API

```
GET    /v1/atendimentos       → Lista atendimentos
POST   /v1/atendimentos       → Iniciar atendimento
PATCH  /v1/atendimentos/:id   → Atualizar (add serviço/insumo)
POST   /v1/atendimentos/:id/finalizar → Finalizar
```

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
