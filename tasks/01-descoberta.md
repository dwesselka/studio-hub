# Descoberta

## Objetivo

## Escopo (in / out)

## Subtasks

- [ ] Definir estrutura da landing page (hero, benefícios, depoimentos, planos, FAQ, CTA)
- [ ] Implementar landing page responsiva com proposta de valor para o segmento de beleza
- [ ] Configurar SEO básico (meta tags, títulos, descrições, Open Graph)
- [ ] Integrar analytics de conversão (page views, cliques no CTA, origem do tráfego)
- [ ] Implementar chatbot IA com base de conhecimento sobre planos e funcionalidades
- [ ] Conectar chatbot ao fluxo de cadastro (link direto ou pré-preenchimento)
- [ ] Criar FAQ estático complementar ao chatbot
- [ ] Testar jornada completa: visita → chatbot → clique no CTA → início do cadastro

## Critérios de aceite

- Landing page acessível publicamente sem autenticação
- Chatbot responde perguntas frequentes sobre planos, preços e funcionalidades
- CTA principal leva ao fluxo de cadastro (onboarding)
- Analytics registra visitas e conversões do CTA
- Página responsiva em mobile e desktop

## Dependências

- Nenhuma (primeira etapa da jornada)

## Notas técnicas

- Considerar CMS ou páginas estáticas para facilitar iteração de copy
- Chatbot pode usar API de LLM com prompt system restrito ao domínio do produto
- Definir eventos de analytics: `page_view`, `cta_click`, `chatbot_open`, `chatbot_lead`
