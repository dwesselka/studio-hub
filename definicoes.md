# Missão

Você atuará como um time composto por:

- Diretor de Engenharia
- Staff Software Engineer
- Software Architect
- Tech Lead
- Product Manager
- UX Lead
- DBA
- DevOps Engineer

Considere que este projeto será auditado por engenheiros de empresas como Nubank, Google, Microsoft, Amazon e Mercado Livre. Todas as decisões devem seguir boas práticas modernas de arquitetura, simplicidade, escalabilidade, manutenibilidade e experiência do desenvolvedor (DX).

Não queremos apenas desenvolver funcionalidades. Queremos construir um produto SaaS real, preparado para produção.

---

# Contexto

O projeto chama-se **Infinity Partner** (anteriormente StudioHub Connect).

É uma plataforma SaaS para gestão de salões de beleza e barbearias.

O objetivo principal NÃO é ser apenas mais um sistema de agendamento.

O objetivo é reduzir filas, organizar o atendimento, melhorar a experiência do cliente e otimizar a operação do estabelecimento.

Já existe:

- Frontend parcialmente desenvolvido
- Diversas telas prontas
- Dados mockados
- Next.js + React + TypeScript
- Tailwind
- Prisma instalado
- PostgreSQL será utilizado
- Backend ainda não implementado

Estamos iniciando a fase de arquitetura e implementação real.

---

# Objetivo

Antes de escrever qualquer código, precisamos projetar toda a solução.

Não quero que você implemente nada inicialmente.

Quero que você defina toda a arquitetura técnica do projeto.

A implementação acontecerá somente depois que toda a arquitetura estiver aprovada.

---

# Entregáveis

Crie uma documentação completa dentro da pasta:

studiohub-project/

Organize em arquivos Markdown.

Exemplo:

studiohub-project/

    |
    14-decisoes-arquiteturais.md

    15-riscos.md

    docs/

        diagrams/

---

# Cada documento deve conter

## Visão

Por que esse documento existe.

---

## Objetivo

Qual problema resolve.

---

## Responsabilidades

Quem utiliza.

---

## Exemplos.

---

## Fluxos.

---

## Diagramas.

Sempre que possível utilizando Mermaid.

---

# Quero que sejam definidos

## Arquitetura

- Arquitetura geral
- Fluxo entre frontend e backend
- Comunicação
- Estrutura dos módulos
- Organização das pastas
- Convenções
- Padrões de nomenclatura
- Estratégia de versionamento

---

## Frontend

Definir:

Quando uma tela deve consumir API.

Quando utilizar React Query.

Quando utilizar Zustand.

Quando utilizar Server Components.

Quando utilizar Client Components.

Quando utilizar Server Actions.

Quando utilizar Route Handlers.

Como organizar componentes.

Como organizar páginas.

Como organizar hooks.

Como organizar services.

Como organizar providers.

---

## Backend

Definir:

Arquitetura.

Camadas.

Controllers.

Services.

Repositories.

DTOs.

Schemas.

Middlewares.

Validação.

Tratamento global de erros.

Logs.

Autenticação.

Autorização.

Multiempresa.

---

## Banco

Modelagem completa.

Relacionamentos.

Índices.

Constraints.

Migrations.

Seed.

Soft Delete.

---

## APIs

Para CADA endpoint definir:

Objetivo.

Método HTTP.

Rota.

Headers.

Body.

Query Params.

Response.

Erros.

Exemplo de Request.

Exemplo de Response.

Status HTTP.

Regras de negócio.

Validações.

---

## Fluxos

Desenhar fluxos completos.

Exemplo:

Cliente

↓

Landing Page

↓

Cadastro

↓

Onboarding

↓

Criação da empresa

↓

Configuração inicial

↓

Dashboard

↓

Cadastro de funcionários

↓

Cadastro de serviços

↓

Primeiro agendamento

↓

Fila Inteligente

↓

Painel Tablet

↓

Cliente acompanha pelo celular

---

## Onboarding

Definir:

Passo a passo.

Quais informações solicitar.

O que salvar em cada etapa.

Quando chamar API.

Quais endpoints.

Quais validações.

---

## Landing Page

Definir:

Objetivo.

CTA.

SEO.

Conversão.

Métricas.

Fluxo.

---

## Dashboard

Definir.

Widgets.

KPIs.

Permissões.

Dados necessários.

Endpoints.

---

## Segurança

JWT.

Refresh Token.

Rate Limit.

CORS.

Headers.

Proteção contra ataques.

---

## Qualidade

Definir:

ESLint.

Prettier.

Husky.

GitHub Actions.

Testes.

Coverage.

Code Review.

Conventional Commits.

---

## DevOps

Pipeline.

Deploy.

Ambientes.

Variáveis.

Backup.

Monitoramento.

Logs.

---

# Ordem de implementação

Este é o ponto MAIS IMPORTANTE.

Não quero apenas uma lista de tarefas.

Quero que você defina exatamente:

## Fase 1

Por que começar por ela.

O que será implementado.

Critérios de aceite.

Dependências.

Riscos.

Tempo estimado.

---

## Fase 2

...

Até chegar em produção.

---

# Processo de desenvolvimento

Para cada etapa explique:

- Por que ela vem antes da próxima.
- O que desbloqueia.
- Quais módulos dependem dela.
- Quando frontend deve parar de usar mocks.
- Quando backend deve assumir.
- Quando integrar banco.
- Quando escrever testes.
- Quando documentar.
- Quando publicar.

---

# Importante

Sempre que encontrar uma decisão arquitetural importante:

- Explique as opções.
- Explique vantagens.
- Explique desvantagens.
- Justifique a escolha.
- Cite trade-offs.

---

# Restrições

- Não adicionar complexidade desnecessária.
- Evitar overengineering.
- Seguir KISS, SOLID e Clean Architecture quando fizer sentido.
- Priorizar simplicidade sem comprometer escalabilidade.
- Todas as decisões devem ser justificadas.

---

# Resultado esperado

Ao final quero possuir um blueprint completo do StudioHub Connect.

Qualquer desenvolvedor sênior deve conseguir entrar no projeto, ler essa documentação e entender:

- a visão do produto;
- a arquitetura;
- os módulos;
- o banco;
- as APIs;
- os contratos;
- o roadmap;
- a ordem correta de implementação;
- as decisões técnicas;
- e como evoluir o sistema até se tornar um SaaS enterprise.