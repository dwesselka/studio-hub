# Avatar

Componente de avatar/foto de perfil baseado em `@radix-ui/react-avatar`.

**Arquivo:** `src/components/ui/avatar.tsx`

```tsx
<Avatar>
  <AvatarImage src="/foto.jpg" alt="Nome" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

- `AvatarImage`: image normal
- `AvatarFallback`: iniciais do nome (exibe enquanto imagem carrega ou falha)
- Tamanhos: usar Tailwind (`w-10 h-10`, `w-8 h-8`)
