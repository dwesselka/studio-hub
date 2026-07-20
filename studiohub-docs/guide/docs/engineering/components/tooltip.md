# Tooltip

Tooltip ao hover/foco. Baseado em `@radix-ui/react-tooltip`.

**Arquivo:** `src/components/ui/tooltip.tsx`

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Texto do tooltip</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Componentes: `TooltipProvider` (pai), `Tooltip`, `TooltipTrigger` (elemento alvo), `TooltipContent` (conteúdo que aparece).
