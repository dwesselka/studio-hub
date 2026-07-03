# Onboarding

## Objetivo

Permitir que novos parceiros se cadastrem rapidamente e tenham o negócio configurado automaticamente para começar a operar.

## Escopo (in / out)

**In:**
- Cadastro rápido (e-mail/social, dados do negócio, segmento)
- Setup automático: horários padrão, serviços iniciais, equipe
- Wizard guiado + checklist de conclusão do perfil

**Out:**
- Agendamento de clientes finais (etapa 03)
- Configurações avançadas de estoque e financeiro

## Subtasks

- [x] Implementar cadastro com e-mail e senha (e opcionalmente login social)
- [x] Coletar dados do negócio: nome, segmento, endereço, telefone, logo
- [x] Criar wizard guiado em etapas (dados → horários → serviços → equipe)
- [x] Configurar horários padrão de funcionamento por dia da semana
- [x] Pré-popular catálogo de serviços conforme segmento escolhido
- [x] Permitir cadastro inicial de profissionais/equipe
- [x] Exibir checklist de conclusão do perfil com progresso visual
- [ ] Enviar e-mail de boas-vindas com próximos passos
- [x] Redirecionar ao dashboard após conclusão do setup mínimo

## Critérios de aceite

- Parceiro consegue concluir cadastro em menos de 5 minutos
- Setup automático cria horários, serviços e estrutura mínima do negócio
- Checklist indica itens pendentes e percentual de conclusão
- Dados persistidos e acessíveis após login
- Fluxo funciona em mobile e desktop

## Dependências

- [01-descoberta.md](01-descoberta.md) — CTA da landing page deve apontar para este fluxo

## Notas técnicas

- Segmentos sugeridos: salão, barbearia, clínica estética, profissional autônomo
- Serviços pré-populados devem ser editáveis após o setup
- Considerar multi-unidade como extensão futura
