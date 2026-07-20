# Button

Componente de botão baseado em `@radix-ui/react-slot`.

**Arquivo:** `src/components/ui/button.tsx`

## Variants

| Variant       | Uso                       |
| ------------- | ------------------------- |
| `default`     | Primário                  |
| `secondary`   | Secundário                |
| `destructive` | Ação destrutiva (excluir) |
| `outline`     | Borda apenas              |
| `ghost`       | Invisível até hover       |
| `link`        | Estilo de link            |

## Sizes

| Size      | Altura       |
| --------- | ------------ |
| `default` | h-9          |
| `sm`      | h-8          |
| `lg`      | h-10         |
| `icon`    | Quadrado 9x9 |

## Props

```tsx
interface ButtonProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean // renderiza como filho (ex: Link do router)
}
```

## Exemplos

```tsx
<Button>Salvar</Button>
<Button variant="destructive">Excluir</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button asChild><Link to="/">Voltar</Link></Button>
```
