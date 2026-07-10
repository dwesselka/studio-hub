# Clientes

Cadastro e gerenciamento de clientes.

## Layout

```
┌──────────────────────────────────────────────┐
│ 👥 Clientes                  [+ Novo Cliente] │
├──────────────────────────────────────────────┤
│ [Busca por nome...]      [Status] [Ordenar]  │  ← Filtros
├──────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐   │
│ │ Ana Costa      📞 (11) 99999-0000     │   │
│ │ 15 visitas · R$ 2.340 · ⭐ Fidelidade│   │  ← Card cliente
│ │ [Agendar] [Histórico]                  │   │
│ ├────────────────────────────────────────┤   │
│ │ João Mendes   📞 (11) 99999-0001     │   │
│ │ 3 visitas · R$ 890 · 🔄 Recente      │   │
│ │ [Agendar] [Histórico]                  │   │
│ └────────────────────────────────────────┘   │
├──────────────────────────────────────────────┤
│ Paginação: < 1 2 3 ... 10 >                  │
└──────────────────────────────────────────────┘
```

## Funcionalidades

- CRUD completo de clientes
- Busca por nome/telefone
- Filtro por status (fidelidade, recentes, inativos)
- Histórico de agendamentos e compras
- Pontos de fidelidade do cliente

## API

```
GET    /v1/clientes       → Lista (com paginação)
POST   /v1/clientes       → Criar
PATCH  /v1/clientes/:id   → Atualizar
DELETE /v1/clientes/:id   → Remover
```
