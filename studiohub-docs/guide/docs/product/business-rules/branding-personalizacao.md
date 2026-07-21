# Processo: Branding e Personalização por Negócio

## Processo 1 — Landing Page Genérica

### O que mudar no `Hero.tsx`

**Antes:**

```tsx
// Hero.tsx — toggle visual entre salão/barbearia
const [segment, setSegment] = useState<'salao' | 'barbearia'>('salao')

// Cada segmento tem:
// - Título diferente
// - Subtítulo diferente
// - Cores diferentes (classe .hero-panel--salao ou .hero-panel--barber)
// - CTA diferente
// - Mock de agenda diferente
```

**Depois:**

```tsx
// Hero.tsx — hero único e genérico
// - Título único: "Gestão inteligente para o seu negócio de beleza"
// - Subtítulo único: "Agende, atenda, fidelize. Tudo em um só lugar."
// - CTA único: "Começar grátis" → /cadastro
// - Mock de agenda único (neutro, sem distinção de segmento)
// - Sem toggle, sem estado de segmento
```

### O que mudar no `Segments.tsx`

**Antes:**

```tsx
// Segments.tsx — apenas 2 cards lado a lado
// "Salão de Beleza" e "Barbearia"
// Sem link, só ilustrativo
```

**Depois:**

```tsx
// Segments.tsx — grid de 4 cards (clicáveis? ou só informativos?)
// - Salão de Beleza
// - Barbearia
// - Clínica Estética
// - Profissional Autônomo
// Cada card: ícone + nome + descrição curta
// Decidir: clicar leva pra /cadastro?segmento=X ou só informa?
```

### Dependências

| Remove            | Arquivo             | Impacto                                                      |
| ----------------- | ------------------- | ------------------------------------------------------------ |
| `segment-mode.ts` | `src/data/landing/` | Pode remover — `LandingSegment` type não será mais usado     |
| `hero.ts`         | `src/data/landing/` | Refatorar — remover dados específicos por segmento           |
| Toggle CSS        | `globals.css`       | Remover classes `.hero-panel--salao` e `.hero-panel--barber` |

### Regras de Negócio

1. Landing não deve depender de segmento para renderizar
2. CTA sempre leva para `/cadastro` (sem `?segmento=`)
3. Segmento só é escolhido no onboarding (passo 1 do wizard)
4. A seção Segments é apenas vitrine — não afeta navegação

---

## Processo 2 — Marca do Negócio no App

### Sidebar (`AppSidebar`)

**Onde:** `src/components/layout/app-sidebar.tsx`

**Antes (header da sidebar):**

```tsx
<div className="sidebar-header">
  <div className="sidebar-logo">SH</div>
  <div>
    <span>StudioHub</span>
    <small>Onde a beleza encontra a gestão</small>
  </div>
</div>
```

**Depois:**

```tsx
<div className="sidebar-header">
  {user.businessLogo ? (
    <img
      src={user.businessLogo}
      alt={user.businessName}
      className="w-10 h-10 rounded object-contain"
    />
  ) : (
    <div className="sidebar-logo">{initials}</div>
  )}
  <div>
    <span>{user.businessName || 'StudioHub'}</span>
    <small>{segmentLabel(user.businessSegment) || 'Onde a beleza encontra a gestão'}</small>
  </div>
</div>
```

**Regras:**

- Se `businessLogo` existe → exibe a imagem
- Se `businessLogo` é null → exibe iniciais do nome (fallback "SH")
- Se `businessName` existe → exibe nome do negócio
- Se `businessName` é null → exibe "StudioHub"
- Abaixo do nome: label do segmento (ex: "Salão de Beleza") ou subtítulo padrão

### Header (`AppHeader`)

**Onde:** `src/components/layout/app-header.tsx`

**Antes:**

```tsx
<Breadcrumb>
  <BreadcrumbItem>Dashboard</BreadcrumbItem>
</Breadcrumb>
```

**Depois:**

```tsx
<Breadcrumb>
  <BreadcrumbItem>{user.businessName || 'StudioHub'}</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>{currentPage}</BreadcrumbItem>
</Breadcrumb>
```

**Regras:**

- Primeiro item do breadcrumb = nome do negócio
- Se `businessName` é null → "StudioHub"
- Clique no nome do negócio → leva pro dashboard

### Título da Aba do Navegador

**Onde:** `src/index.html` ou via `useEffect` no `AppLayout`

```tsx
useEffect(() => {
  document.title = user.businessName ? `${user.businessName} — StudioHub` : 'StudioHub'
}, [user.businessName])
```

---

## Processo 3 — Customização Visual

### 3.1 Prisma

**Migration:** Adicionar ao modelo `User`:

```prisma
brandColor     String?  @default("#9333ea")
secondaryColor String?  @default("#a855f7")
favicon        String?
```

### 3.2 API

**POST /v1/configuracoes/aparencia**

Request:

```json
{
  "businessLogo": "data:image/png;base64,...", // ou multipart
  "brandColor": "#7c3aed",
  "secondaryColor": "#a78bfa",
  "favicon": "data:image/x-icon;base64,..."
}
```

Response:

```json
{
  "businessLogo": "https://cdn.studiohub.com/logos/uuid.png",
  "brandColor": "#7c3aed",
  "secondaryColor": "#a78bfa",
  "favicon": "https://cdn.studiohub.com/favicons/uuid.ico"
}
```

**Decisão: Upload de imagem**

Opções:

- **Base64 no JSON** → mais simples, mas aumenta payload
- **Multipart/form-data** → mais eficiente, mas mais complexo
- **Upload direto para CDN** (S3/Cloudflare R2) → ideal, mas precisa de infra

**Sugestão:** Começar com Base64 (simples), migrar para multipart depois.

**Onde armazenar as imagens:**

- Opção A: `server/uploads/` (pasta local, servido via static files)
- Opção B: Base64 no banco (simples, mas pesado)
- Opção C: Serviço externo (S3, Cloudinary)

**Sugestão:** Opção A — salvar em `server/uploads/logos/` e servir como static.

**GET /v1/auth/me** (já retorna dados do usuário)

Adicionar campos na resposta:

```json
{
  "user": {
    "businessLogo": "...",
    "brandColor": "#7c3aed",
    "secondaryColor": "#a78bfa"
  }
}
```

### 3.3 Upload de Arquivo no Servidor

**server/routes/configuracoes.ts** — novo handler:

```typescript
router.post('/aparencia', authGuard, async (c) => {
  const userId = c.get('userId')
  const body = await c.req.parseBody()

  // Se veio arquivo (multipart)
  const logoFile = body['businessLogo'] as File
  let logoUrl: string | null = null

  if (logoFile) {
    const ext = logoFile.name.split('.').pop()
    const filename = `${userId}-logo.${ext}`
    const buffer = await logoFile.arrayBuffer()
    await writeFile(`server/uploads/logos/${filename}`, Buffer.from(buffer))
    logoUrl = `/uploads/logos/${filename}`
  }

  // Atualizar cores
  await prisma.user.update({
    where: { id: userId },
    data: {
      businessLogo: logoUrl ?? undefined,
      brandColor: body['brandColor'] as string,
      secondaryColor: body['secondaryColor'] as string,
    },
  })

  return c.json({ success: true })
})
```

### 3.4 Tema Dinâmico (CSS Variables)

**Onde:** `src/providers/theme-provider.tsx`

Adicionar ao provedor de tema:

```tsx
function BrandThemeProvider({ children, user }: { children: ReactNode; user: AuthUser | null }) {
  useEffect(() => {
    const root = document.documentElement
    if (user?.brandColor) {
      root.style.setProperty('--brand-primary', user.brandColor)
      root.style.setProperty('--brand-secondary', user.secondaryColor || user.brandColor)
    } else {
      root.style.setProperty('--brand-primary', '#9333ea')
      root.style.setProperty('--brand-secondary', '#a855f7')
    }
  }, [user?.brandColor, user?.secondaryColor])

  return <>{children}</>
}
```

**CSS Variables que as cores afetam:**

| Variável            | Onde é usada                                          |
| ------------------- | ----------------------------------------------------- |
| `--brand-primary`   | Botões primários, links, hover states, sidebar active |
| `--brand-secondary` | Badges, destaques, gradientes                         |

### 3.5 Seção "Aparência" nas Configurações

**Onde:** `src/features/configuracoes/` — novo componente `AppearanceSection.tsx`

**Layout:**

```
┌─────────────────────────────────┐
│ Aparência                       │
│ ─────────────────────────────── │
│                                 │
│ Logo do Negócio                 │
│ ┌─────────────────────┐         │
│ │    [ preview ]      │         │
│ │                     │         │
│ └─────────────────────┘         │
│ [ Upload Logo ] [ Remover ]    │
│                                 │
│ Cor Primária                    │
│ [#7c3aed] [ ■ seletor de cor ] │
│                                 │
│ Cor Secundária                  │
│ [#a78bfa] [ ■ seletor de cor ] │
│                                 │
│ [ Salvar Alterações ]           │
└─────────────────────────────────┘
```

**Estado:**

- Loading enquanto salva
- Preview em tempo real das cores (ao mudar o seletor, já atualiza a UI)
- Toast de sucesso/erro

---

## Processo 4 — Dashboard Personalizado Pós-Login

### 4.1 Tela de Boas-Vindas

**Onde:** `src/features/dashboard/pages/dashboard-page.tsx`

**Após login, se for primeira vez ou se `onboardingCompleted` mudou recentemente:**

```tsx
// DashboardHero — topo do dashboard
function DashboardHero({ user }: { user: AuthUser }) {
  const segmentLabel = {
    salao: 'Salão de Beleza',
    barbearia: 'Barbearia',
    clinica: 'Clínica Estética',
    autonomo: 'Profissional Autônomo',
  }

  return (
    <div>
      <h1>Olá, {user.name} 👋</h1>
      <p>Bem-vindo ao {user.businessName || 'StudioHub'}</p>
      <span>{segmentLabel[user.businessSegment as keyof typeof segmentLabel]}</span>
    </div>
  )
}
```

### 4.2 Métricas Adaptadas por Segmento

**Antes:** Dashboard busca métricas genéricas (total agendamentos, receita, etc.)

**Depois:** O backend aceita (ou já retorna) métricas categorizadas por segmento.

**Backend (`server/routes/dashboard.ts`):**

O endpoint `GET /v1/dashboard` já retorna dados. Verificar se já tem dados por categoria de serviço. Se sim, o frontend filtra. Se não, ajustar query:

```typescript
// Adicionar ao retorno do dashboard:
const servicesByCategory = await prisma.service.groupBy({
  by: ['category'],
  where: { userId },
  _count: { id: true },
  _sum: { price: true },
})

// Se o segmento é barbearia, destacar categorias "Corte Masculino", "Barba"
// Se é salão, destacar "Corte", "Coloração", "Finalização"
```

**Frontend — cards de métricas:**

Criar `SegmentMetrics` que renderiza cards baseados no segmento:

```tsx
function SegmentMetrics({ segment, services }: Props) {
  const config = {
    barbearia: {
      highlightCategories: ['Corte Masculino', 'Barba'],
      title: 'Serviços mais procurados',
    },
    salao: {
      highlightCategories: ['Corte', 'Coloração', 'Finalização'],
      title: 'Serviços mais procurados',
    },
    clinica: {
      highlightCategories: ['Estética Facial', 'Tratamento'],
      title: 'Procedimentos mais realizados',
    },
    autonomo: {
      highlightCategories: [],
      title: 'Seus serviços',
    },
  }
  // ...
}
```

---

## Regras de Transição e Compatibilidade

### Usuários Existentes

- `businessSegment` pode ser `null` (usuários antigos) → tratar com fallback genérico
- `businessLogo` pode ser `null` → mostrar iniciais
- `brandColor` pode ser `null` → usar cor padrão do StudioHub

### Ordem de Implementação

1. Backend: migration + endpoint de aparência
2. Frontend: seção Aparência nas configs
3. Frontend: tema dinâmico (CSS vars)
4. Frontend: sidebar + header personalizados
5. Frontend: landing page genérica
6. Frontend: dashboard personalizado + boas-vindas
7. Frontend: título da aba + favicon

---

## Dúvidas a Definir

1. **Upload:** Base64 vs multipart vs CDN externo?
2. **Segments:** Os cards da landing devem ser clicáveis (levar pro cadastro com segmento pré-selecionado) ou só informativos?
3. **Sidebar:** Qual o tamanho máximo do logo? Precisa de fallback de iniciais?
4. **Cores:** Devemos gerar paleta automática a partir da cor primária (análogas, complementares) ou só usar primary + secondary?
5. **Dashboard:** As métricas por segmento vêm do backend ou o frontend filtra o que já existe?

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
