# Contribuindo

## Convenções

### Commits

Usamos commits semânticos (sem ferramenta obrigatória, mas preferimos):

```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração sem mudança de comportamento
docs: documentação
test: testes
chore: tarefas de build/config
```

### Branches

```
feature/nome-da-feature
fix/nome-do-fix
refactor/nome-da-refatoracao
```

### Código

- TypeScript estrito — sem `any`
- Componentes React com interfaces de props exportadas
- Testes junto ao arquivo: `componente.tsx` / `componente.test.tsx`
- ESLint configurado — rodar `pnpm lint` antes de commitar
- Husky + lint-staged roda ESLint e Prettier nos arquivos staged

## Estrutura de Arquivos

```
src/
  components/   → Componentes compartilhados
  features/      → Módulos funcionais (feature-sliced)
  pages/         → Páginas do router
  lib/           → Utilitários, API client, DB local
  hooks/         → Custom hooks
  providers/     → Context providers (Theme, Query, Auth)
  styles/        → Globals CSS
  types/         → Tipos globais
  test/          → Config de testes

server/
  index.ts       → Bootstrap do backend
  routes/        → Handlers HTTP
  services/      → Lógica de negócio + queries Prisma
  schemas/       → Validação Zod
  dto/           → Formatação de resposta
  lib/           → Infraestrutura (auth, cache, logger, crypto)
```

## Testes

```bash
pnpm test              # Testes do frontend
pnpm test:server       # Testes do backend (20+ testes)
pnpm test:server:watch # Modo watch
pnpm test:server:coverage # Cobertura
```
