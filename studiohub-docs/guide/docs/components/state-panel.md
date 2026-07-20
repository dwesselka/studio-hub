# StatePanel

Painel para exibir estados de UI: vazio, erro, sucesso.

**Arquivo:** `src/components/ui/state-panel.tsx`

```tsx
<StatePanel
  type="empty"
  title="Nenhum agendamento"
  description="Crie seu primeiro agendamento"
  action={<Button>Novo Agendamento</Button>}
/>
```

## Tipos

| Prop          | Tipo                              | Descrição                     |
| ------------- | --------------------------------- | ----------------------------- |
| `type`        | `'empty' \| 'error' \| 'success'` | Estado do painel              |
| `title`       | string                            | Título principal              |
| `description` | string                            | Texto secundário              |
| `action`      | ReactNode                         | Ação opcional (ex: botão CTA) |
