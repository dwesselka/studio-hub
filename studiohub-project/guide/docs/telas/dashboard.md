# Dashboard

Tela principal do sistema após login. Exibe métricas em tempo real do dia.

## Layout

```
┌──────────────────────────────────────────────┐
│ 📊 Dashboard                                 │
├──────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ │ 12   │ │ 87%  │ │ R$   │ │ 4    │        │
│ │ Hoje │ │ Ocup. │ │1.840 │ │Pend. │        │  ← Cards de métricas
│ └──────┘ └──────┘ └──────┘ └──────┘        │
├──────────────────────────────────────────────┤
│ Agenda do Dia                                │
│ ┌────────────────────────────────────────┐   │
│ │ 09:00  Ana Costa   Corte   Camila  ✅  │   │
│ │ 10:30  João M.     Corte   Rafael ✅   │   │  ← Timeline
│ │ 14:00  Juliana R.  Mani    Pri    ⏳  │   │
│ │ 15:30  Carlos S.   Barba   Rafa   ✅  │   │
│ └────────────────────────────────────────┘   │
├──────────────────────────────────────────────┤
│ Próximos Atendimentos / Alertas              │
└──────────────────────────────────────────────┘
```

## Componentes

- Cards de métrica (Total hoje, ocupação, faturamento, pendentes)
- Timeline de agendamentos do dia
- Atalhos rápidos para ações frequentes
- Gráfico de ocupação da semana (futuro)

## API

```
GET /v1/dashboard
Response: { today: 12, occupancy: "87%", revenue: "R$ 1.840", pending: 4 }
```
