# Git Feature Discipline

## Estrutura

Cada documento `XX-nome.md` dentro de `studiohub-docs/` representa uma **feature independente**.

## Fluxo

1. A partir da branch alvo (ex: `feature/backend`), crie uma branch:

   ```bash
   git checkout -b feat/<numero>-<nome-curto> feature/backend
   ```

   Exemplo: `feat/00-visao-geral`, `feat/01-arquitetura`

2. Desenvolva a feature — edite apenas o arquivo correspondente e o que for estritamente necessário.

3. Faça commits convencionais:

   ```
   feat(00): add visão geral do projeto
   ```

4. Envie e abra PR:

   ```bash
   git push origin feat/00-visao-geral
   gh pr create --base feature/backend --head feat/00-visao-geral \
     --title "feat: visão geral" \
     --body "Completa o documento 00-visao-geral.md"
   ```

5. Após merge, delete a branch remota e local, e passe para o próximo arquivo:

   ```bash
   git branch -d feat/00-visao-geral
   ```

## Convenção de branches

| Nome                    | Descrição                                                   |
| ----------------------- | ----------------------------------------------------------- |
| `main`                  | Produção                                                    |
| `feature/*`             | Feature grande (agrupa sub-features, ex: `feature/backend`) |
| `feat/<n>-<nome-curto>` | Sub-feature atômica → PR para `feature/*`                   |

## Por quê?

- PRs pequenos, revisáveis e focados
- Cada merge conclui exatamente um documento/marco
- Histórico linear e rastreável por número
- Zero cerimônia — sem hooks, sem plugins, sem regras decoradas
