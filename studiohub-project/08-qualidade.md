# Qualidade — Infinity Partner

## Visão

Pipeline de qualidade: ESLint, Prettier, Husky, GitHub Actions, testes, coverage, code review, conventional commits.

## Ferramentas

| Ferramenta | Função |
|---|---|
| ESLint 10 | Linting TypeScript + React |
| Prettier 3 | Formatação automática |
| Husky 9 | Git hooks (pre-commit) |
| lint-staged | Lint apenas arquivos staged |
| Vitest 4 | Test runner (frontend + backend) |
| Testing Library | Testes de componentes React |
| GitHub Actions | CI/CD |

## Scripts

```bash
pnpm lint        # ESLint em src/ (zero warnings)
pnpm format      # Prettier em src/**/*.{ts,tsx,css}
pnpm test        # Testes frontend (Vitest)
pnpm test:server # Testes backend
pnpm build       # tsc -b && vite build
```

## Husky + lint-staged

No pre-commit:
1. `lint-staged` roda ESLint + Prettier nos arquivos modificados
2. Se falhar, o commit é bloqueado

## Conventional Commits

```
feat: adicionar tela de agendamento recorrente
fix: corrigir cálculo de horários sobrepostos
chore: atualizar dependências
refactor: extrair hook useAgendaData
test: adicionar testes para cancelamento de agendamento
docs: atualizar README com novas rotas
```

## Cobertura de testes

### Frontend

- Testes unitários para hooks, utils, formatação
- Testes de componente (Chatbot, storage, analytics)
- Testes de aceitação (fluxo de descoberta)

### Backend

- Testes para crypto (hash + verificação)
- Testes para cache
- Testes para errors (AppError, classes derivadas)
- Testes para rate-limit

### Meta

- Coverage mínimo: 70% (alvo: 80%+ para produção)
- Testes rodam em todo PR via GitHub Actions

## GitHub Actions

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm test:server
      - run: pnpm build
```

## Code Review

- Todo PR deve ser revisado por ao menos 1 pessoa
- Checklist de review:
  - Código segue os padrões do projeto
  - Testes foram adicionados/atualizados
  - Nenhuma exposição de secrets
  - TypeScript compila sem erros
  - Lint passa sem warnings
