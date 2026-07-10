# Landing Page

A página inicial pública do StudioHub, com segmentação para **salão** e **barbearia**.

<div class="grid grid-cols-2 gap-4 my-6">
  <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
    <img src="/screenshots/hero-salao.png" alt="Segmento Salão" class="w-full" />
    <div class="p-3 text-center text-sm font-semibold" style="background:#f9ece8;color:#8a3f44">Segmento Salão</div>
  </div>
  <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
    <img src="/screenshots/hero-barbearia.png" alt="Segmento Barbearia" style="width:100%" />
    <div class="p-3 text-center text-sm font-semibold" style="background:#2d2a26;color:#c9a962">Segmento Barbearia</div>
  </div>
</div>

## Layout

```
┌─────────────────────────────────────────────────┐
│ [Logo] StudioHub        [Segmentos] [Login] [CTA]│  ← Header (sticky)
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐                    │
│  │  SALÃO   │  │BARBEARIA │   ← Toggle de      │
│  │          │  │          │     segmento        │
│  │ Corte,   │  │ Corte,   │                     │
│  │ Escova,  │  │ Barba,   │                     │
│  │ Manicure │  │ Plano    │                     │
│  └──────────┘  └──────────┘                     │  ← Hero Section
│                                                 │
│  "Transforme seu salão ou barbearia..."         │
│                                                 │
│  [Iniciar Teste Grátis]                         │
│                                                 │
│  ┌─ Mock agenda ──────────────────┐             │
│  │ Hoje, 3 de julho               │             │
│  │ 09:00  Ana Costa  Corte + Barba│             │
│  │ 10:30  João M.    Corte + Barba │             │
│  │ 14:00  Juliana R. Manicure Gel │             │
│  │ Ocupação: 87% · Hoje: 12       │             │
│  └───────────────────────────────┘              │
├─────────────────────────────────────────────────┤
│ Seções: Segmentos → Benefícios → Depoimentos →  │
│         Planos → FAQ → CTA Final                │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

## Componentes Envolvidos

| Componente     | Arquivo                                   | Descrição                                 |
| -------------- | ----------------------------------------- | ----------------------------------------- |
| `Header`       | `src/components/landing/Header.tsx`       | Navbar com logo, segment switch, CTA      |
| `Hero`         | `src/components/landing/Hero.tsx`         | Hero com toggle salão/barbearia + mock UI |
| `Segments`     | `src/components/landing/Segments.tsx`     | Cards dos segmentos                       |
| `Benefits`     | `src/components/landing/Benefits.tsx`     | Grid de benefícios                        |
| `Testimonials` | `src/components/landing/Testimonials.tsx` | Depoimentos                               |
| `Plans`        | `src/components/landing/Plans.tsx`        | Planos e preços                           |
| `FAQ`          | `src/components/landing/FAQ.tsx`          | Perguntas frequentes                      |
| `CTA`          | `src/components/landing/CTA.tsx`          | Call-to-action final                      |
| `Footer`       | `src/components/landing/Footer.tsx`       | Rodapé                                    |

## Segmentos

O sistema suporta dois segmentos visuais:

### Salão

- Paleta: rosa/vinho (`#a64d52`, `#f9ece8`)
- Fontes: Cormorant Garamond (títulos) + DM Sans (corpo)
- Mock: claro, clean, feminino

### Barbearia

- Paleta: carvão/dourado (`#2d2a26`, `#c9a962`)
- Fontes: mesmas, mas com peso maior
- Mock: escuro, sóbrio, masculino

## Dados

Configurado em `src/data/landing/`, com tipos separados:

| Arquivo           | Conteúdo                          |
| ----------------- | --------------------------------- |
| `site.ts`         | Nome, tagline, descrição, módulos |
| `hero.ts`         | Título, subtítulo, agenda mock    |
| `segments.ts`     | Segmentos e serviços              |
| `benefits.ts`     | Benefícios listados               |
| `testimonials.ts` | Depoimentos mock                  |
| `plans.ts`        | Planos e preços                   |
| `faq.ts`          | Perguntas frequentes              |
