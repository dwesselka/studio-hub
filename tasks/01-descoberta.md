                     '# Descoberta

## Objetivo

Atrair novos parceiros (salões, barbearias, clínicas e profissionais independentes) por meio de uma landing page clara e um chatbot IA que responda dúvidas e conduza ao cadastro.

## Escopo (in / out)

**In:**
- Landing page pública com proposta de valor, benefícios e CTA
- Chatbot IA para dúvidas sobre planos, funcionalidades e processo de onboarding
- SEO básico, analytics de conversão e integração com fluxo de cadastro

**Out:**
- Área logada do parceiro
- Processo completo de onboarding (etapa 02)
- Integração com gateways de pagamento

## Subtasks

- [x] Definir estrutura da landing page (hero, benefícios, depoimentos, planos, FAQ, CTA)
- [x] Implementar landing page responsiva com proposta de valor para o segmento de beleza
- [x] Configurar SEO básico (meta tags, títulos, descrições, Open Graph)
- [x] Integrar analytics de conversão (page views, cliques no CTA, origem do tráfego)
- [x] Implementar chatbot IA com base de conhecimento sobre planos e funcionalidades
- [x] Conectar chatbot ao fluxo de cadastro (link direto ou pré-preenchimento)
- [x] Criar FAQ estático complementar ao chatbot
- [x] Testar jornada completa: visita → chatbot → clique no CTA → início do cadastro

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
