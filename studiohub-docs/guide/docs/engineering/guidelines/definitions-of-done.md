# 🎯 Definições de Done (DoD) & Workflow

## Objetivo

Estabelecer os critérios mínimos de qualidade e aceite exigidos antes que qualquer funcionalidade, refatoração ou Pull Request seja considerado concluído ("Done") no StudioHub.

## Critérios de Aceite para Features (Feature DoD)

1. **Código & Tipagem:**
   - Todo o código TypeScript deve compilar sem erros (`npm run build`).
   - Nenhuma violação de linting (`npm run lint`).
   - Sem uso indevido do tipo `any` não justificado.
2. **Testes:**
   - Testes unitários/integração relevantes criados ou atualizados (`npm test` e `npm run test:server`).
3. **Banco de Dados:**
   - Schemas do Prisma devidamente atualizados e migrações geradas sem breaking changes.
4. **Documentação:**
   - Endpoints de API documentados (Schemas Zod OpenAPI).
   - Documentação de telas ou regras atualizada na suite VitePress.

## Critérios de Aceite para Pull Requests (PR DoD)

- Descrição clara do que foi alterado e o porquê.
- Aprovação no pipeline de CI (testes, linting e build do VitePress).

---

> **Última atualização:** 2026-07-21 | **Responsável:** Tech Lead
