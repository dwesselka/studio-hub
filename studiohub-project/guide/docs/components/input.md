# Input

Componente de campo de texto com `@radix-ui/react-slot`.

**Arquivo:** `src/components/ui/input.tsx`

## Props

| Prop        | Tipo                  | Padrão | Descrição                                   |
| ----------- | --------------------- | ------ | ------------------------------------------- |
| `type`      | string                | `text` | Tipo do input (text, email, password, etc.) |
| `className` | string                | —      | Classes adicionais Tailwind                 |
| ...         | `InputHTMLAttributes` | —      | Props nativas do `<input>`                  |

## Exemplos

```tsx
<Input placeholder="Nome do cliente" />
<Input type="email" placeholder="email@exemplo.com" />
<Input type="password" placeholder="Senha" />
```

O componente aplica automaticamente:

- Borda sutil (border + ring focus)
- Transição suave no foco
- Tamanho consistente (h-9)
- Tema claro/escuro via Tailwind
