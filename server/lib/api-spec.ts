import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

import {
  loginSchema,
  signupSchema,
  refreshSchema,
} from '../schemas/auth'
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  agendaFiltersQuery,
  dateRangeQuery,
  rescheduleSchema,
  conflictCheckQuery,
  suggestionsQuery,
} from '../schemas/agenda'
import {
  createAtendimentoSchema,
  updateAtendimentoSchema,
} from '../schemas/atendimento'
import {
  createClienteSchema,
  updateClienteSchema,
  clienteFiltersQuery,
} from '../schemas/clientes'
import { updateConfigSchema } from '../schemas/configuracoes'
import { dashboardPeriodQuery } from '../schemas/dashboard'
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from '../schemas/equipe'
import {
  loyaltyProgramSchema,
  createPromotionSchema,
  updatePromotionSchema,
} from '../schemas/fidelizacao'
import {
  businessDataSchema,
  hoursSchema,
  servicesSchema,
  teamSchema,
} from '../schemas/onboarding'
import {
  createPaymentSchema,
  updatePaymentSchema,
} from '../schemas/pagamento'
import {
  createFeedbackSchema,
  createCampaignSchema,
  updateCampaignSchema,
} from '../schemas/pos-atendimento'
import {
  createServiceSchema,
  updateServiceSchema,
} from '../schemas/servicos'
import { dateString, timeString, phoneString } from '../schemas/common'

function successResponse<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.object({
      timestamp: z.string(),
      requestId: z.string(),
    }),
  })
}

function paginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    meta: z.object({
      timestamp: z.string(),
      requestId: z.string(),
      page: z.number(),
      perPage: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  })
}

const errorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
  }),
})

const registry = new OpenAPIRegistry()

registry.register('ErrorResponse', errorResponse)

const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Token JWT de autenticação',
})

const AuthUser = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  credits: z.number(),
  plan: z.string(),
  businessName: z.string().nullable(),
  businessSegment: z.string().nullable(),
  businessAddress: z.string().nullable(),
  businessPhone: z.string().nullable(),
  businessLogo: z.string().nullable(),
  onboardingCompleted: z.boolean(),
})

const AuthTokens = z.object({
  user: AuthUser,
  accessToken: z.string(),
  refreshToken: z.string(),
})

const Appointment = z.object({
  id: z.string().uuid(),
  clientName: z.string(),
  clientPhone: z.string(),
  clientEmail: z.string().nullable().optional(),
  serviceId: z.string().uuid(),
  serviceName: z.string(),
  serviceDuration: z.number(),
  servicePrice: z.number(),
  professionalId: z.string().uuid(),
  professionalName: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'no-show']),
  notes: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  reminderSent: z.boolean(),
  confirmationSent: z.boolean(),
})

const ServicePerformed = z.object({
  serviceId: z.string().uuid(),
  serviceName: z.string(),
  duration: z.number(),
  price: z.number(),
})

const ConsumedSupply = z.object({
  consumableId: z.string().uuid(),
  consumableName: z.string(),
  quantity: z.number(),
  unit: z.string(),
})

const Atendimento = z.object({
  id: z.string().uuid(),
  appointmentId: z.string().uuid(),
  clientName: z.string(),
  clientPhone: z.string(),
  professionalId: z.string().uuid(),
  professionalName: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  services: z.array(ServicePerformed),
  supplies: z.array(ConsumedSupply),
  notes: z.string().nullable(),
  status: z.string(),
  totalValue: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

const Cliente = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  email: z.string(),
  telefone: z.string(),
  segmento: z.string().nullable(),
  ultimaVisita: z.string().nullable(),
  totalVisitas: z.number(),
  totalGasto: z.number(),
  status: z.string(),
  aniversario: z.string().nullable(),
})

const TeamMember = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.string(),
  phone: z.string(),
  email: z.string(),
  active: z.boolean(),
  commission: z.number().nullable(),
  specialties: z.array(z.string()),
  photo: z.string().nullable(),
})

const Service = z.object({
  id: z.string().uuid(),
  name: z.string(),
  duration: z.number(),
  price: z.number(),
  category: z.string(),
  active: z.boolean(),
})

const ServiceCategory = z.object({
  id: z.string(),
  name: z.string(),
  services: z.array(Service),
})

const Payment = z.object({
  id: z.string().uuid(),
  atendimentoId: z.string().uuid(),
  clientName: z.string(),
  clientPhone: z.string(),
  professionalName: z.string(),
  serviceNames: z.array(z.string()),
  date: z.string(),
  totalValue: z.number(),
  method: z.string(),
  status: z.string(),
  paidValue: z.number(),
  feeValue: z.number(),
  netValue: z.number(),
  pixQrCode: z.string().nullable(),
  pixCopyPaste: z.string().nullable(),
  receiptNumber: z.string().nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

const LoyaltyProgram = z.object({
  pointsPerCurrency: z.number(),
  pointsPerVisit: z.number(),
  pointsExpiryDays: z.number(),
  enabled: z.boolean(),
})

const Promotion = z.object({
  id: z.string().uuid(),
  name: z.string(),
  segment: z.string(),
  discountPercent: z.number(),
  requiredPoints: z.number(),
  serviceId: z.string().nullable(),
  serviceName: z.string().nullable(),
  expiresAt: z.string(),
  status: z.string(),
  stats: z.object({ sent: z.number(), redeemed: z.number() }),
  createdAt: z.string(),
})

const ClientPoints = z.object({
  clientPhone: z.string(),
  clientName: z.string(),
  balance: z.number(),
  lifetime: z.number(),
  updatedAt: z.string(),
})

const PointsTransaction = z.object({
  id: z.string().uuid(),
  clientPhone: z.string(),
  clientName: z.string(),
  type: z.string(),
  amount: z.number(),
  balanceAfter: z.number(),
  description: z.string(),
  createdAt: z.string(),
})

const Feedback = z.object({
  id: z.string().uuid(),
  atendimentoId: z.string().uuid(),
  clientName: z.string(),
  clientPhone: z.string(),
  score: z.number().int().min(0).max(10),
  comment: z.string().nullable(),
  createdAt: z.string(),
})

const Campaign = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  status: z.string(),
  segment: z.string(),
  triggerDays: z.number(),
  messageTemplate: z.string(),
  serviceSuggestion: z.string().nullable(),
  stats: z.object({ sent: z.number(), responded: z.number(), converted: z.number() }),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

const Config = z.object({
  businessName: z.string().nullable(),
  businessPhone: z.string().nullable(),
  businessEmail: z.string().nullable(),
  businessAddress: z.string().nullable(),
  openingHours: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    isOpen: z.boolean(),
    openTime: z.string(),
    closeTime: z.string(),
  })),
  defaultAppointmentDuration: z.number(),
  allowOnlineBooking: z.boolean(),
  sendReminders: z.boolean(),
  reminderHoursBefore: z.number(),
  theme: z.string(),
})

const DashboardMetrics = z.object({
  metrics: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    value: z.string(),
    trend: z.number(),
    trendLabel: z.string(),
    badge: z.string().optional(),
    icon: z.string(),
  })),
  todayAppointments: z.array(z.object({
    time: z.string(),
    client: z.string(),
    service: z.string(),
    status: z.string(),
  })),
  greeting: z.string(),
  status: z.object({
    label: z.string(),
    status: z.string(),
    uptime: z.string(),
    lastIncident: z.string(),
  }),
})

const DashboardToday = z.object({
  appointments: z.array(z.object({
    id: z.string(),
    clientName: z.string(),
    clientPhone: z.string(),
    serviceName: z.string(),
    professionalName: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    status: z.string(),
  })),
  totalAppointments: z.number(),
  confirmedCount: z.number(),
  totalRevenue: z.number(),
  occupancyRate: z.number(),
})

const DashboardAnalytics = z.object({
  statusDistribution: z.record(z.string(), z.number()),
  totalAppointments: z.number(),
  totalRevenue: z.number(),
  revenueByDay: z.record(z.string(), z.number()),
  topServices: z.array(z.object({ name: z.string(), count: z.number() })),
})

const SystemStatus = z.object({
  label: z.string(),
  status: z.string(),
  uptime: z.string(),
  lastIncident: z.string(),
  services: z.array(z.object({
    name: z.string(),
    status: z.string(),
    latency: z.string(),
  })),
})

const ReportKPIs = z.object({
  occupancyRate: z.number(),
  totalRevenue: z.number(),
  averageTicket: z.number(),
  retentionRate: z.number(),
  noShowRate: z.number(),
  cancellationRate: z.number(),
  totalAppointments: z.number(),
  completedAtendimentos: z.number(),
  recurringClients: z.number(),
  newClients: z.number(),
  revenueByProfessional: z.array(z.object({ name: z.string(), total: z.number() })),
  revenueByService: z.array(z.object({ name: z.string(), total: z.number() })),
  occupancyByDay: z.array(z.object({
    date: z.string(), rate: z.number(), appointments: z.number(), available: z.number(),
  })),
  revenueByDay: z.array(z.object({ date: z.string(), total: z.number() })),
})

const ConflictCheck = z.object({
  hasConflict: z.boolean(),
  conflicts: z.array(Appointment),
})

const Suggestion = z.object({
  time: z.string(),
  professionalId: z.string().uuid(),
  professionalName: z.string().optional(),
  score: z.number(),
  reason: z.string(),
})

const OnboardingData = z.object({
  onboardingData: z.record(z.string(), z.unknown()),
})

const OnboardingProgress = z.object({
  progress: z.object({
    accountCreated: z.boolean(),
    businessDataComplete: z.boolean(),
    hoursConfigured: z.boolean(),
    servicesReviewed: z.boolean(),
    teamAdded: z.boolean(),
  }),
  percent: z.number(),
  completed: z.boolean(),
})

const PrepopulatedServices = z.array(z.object({
  name: z.string(),
  duration: z.number(),
  price: z.number(),
  category: z.string(),
}))

const LogoutResponse = z.object({
  message: z.string(),
})

const CreatedResponse = z.object({
  message: z.string(),
})

function registerPath(opts: {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: string
  tags: string[]
  summary: string
  description?: string
  requestBody?: z.ZodTypeAny
  queryParams?: z.ZodTypeAny
  pathParams?: z.ZodTypeAny
  responses: Record<number, { description: string; schema: z.ZodTypeAny }>
  auth?: boolean
}) {
  const request: Record<string, unknown> = {}
  const params: Record<string, unknown> = {}

  if (opts.requestBody) {
    request.body = {
      content: { 'application/json': { schema: opts.requestBody } },
    }
  }

  if (opts.queryParams) {
    request.query = opts.queryParams
  }

  if (opts.pathParams) {
    request.params = opts.pathParams
  }

  const responses: Record<string, { description: string; content?: Record<string, unknown> }> = {}
  for (const [status, resp] of Object.entries(opts.responses)) {
    responses[status] = {
      description: resp.description,
      content: { 'application/json': { schema: resp.schema } },
    }
  }

  registry.registerPath({
    method: opts.method,
    path: opts.path,
    tags: opts.tags,
    summary: opts.summary,
    description: opts.description,
    request: Object.keys(request).length > 0 ? request as {
      body?: { content: { 'application/json': { schema: z.ZodTypeAny } } }
      query?: z.ZodTypeAny
      params?: z.ZodTypeAny
    } : undefined,
    responses: responses as Record<string, {
      description: string
      content: { 'application/json': { schema: z.ZodTypeAny } }
    }>,
    security: opts.auth ? [{ [bearerAuth.name]: [] }] : undefined,
  })
}

const uuidParamObj = z.object({ id: z.string().uuid() })
const uuidPathParams = { id: z.string().uuid().describe('UUID do recurso') }

// ==================== Auth ====================
const authTags = ['Autenticação']

registerPath({
  method: 'post',
  path: '/v1/auth/signup',
  tags: authTags,
  summary: 'Cadastro',
  description: 'Cria uma nova conta',
  requestBody: signupSchema,
  responses: {
    201: { description: 'Conta criada', schema: successResponse(AuthTokens) },
    409: { description: 'E-mail já cadastrado', schema: errorResponse },
    422: { description: 'Dados inválidos', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/auth/login',
  tags: authTags,
  summary: 'Login',
  description: 'Autentica um usuário',
  requestBody: loginSchema,
  responses: {
    200: { description: 'Login realizado', schema: successResponse(AuthTokens) },
    401: { description: 'Credenciais inválidas', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/auth/refresh',
  tags: authTags,
  summary: 'Renovar token',
  description: 'Renova o access token usando refresh token',
  requestBody: refreshSchema,
  responses: {
    200: { description: 'Tokens renovados', schema: successResponse(AuthTokens) },
    401: { description: 'Refresh token inválido', schema: errorResponse },
  },
})

registerPath({
  method: 'get',
  path: '/v1/auth/me',
  tags: authTags,
  summary: 'Dados do usuário',
  description: 'Retorna os dados do usuário autenticado',
  auth: true,
  responses: {
    200: { description: 'Dados do usuário', schema: successResponse(AuthUser) },
    401: { description: 'Não autorizado', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/auth/logout',
  tags: authTags,
  summary: 'Logout',
  description: 'Encerra a sessão',
  auth: true,
  responses: {
    200: { description: 'Sessão encerrada', schema: successResponse(LogoutResponse) },
  },
})

// ==================== Agenda ====================
const agendaTags = ['Agenda']

registerPath({
  method: 'get',
  path: '/v1/agenda',
  tags: agendaTags,
  summary: 'Listar agendamentos',
  description: 'Lista agendamentos com filtros',
  auth: true,
  queryParams: agendaFiltersQuery,
  responses: {
    200: { description: 'Lista de agendamentos', schema: paginatedResponse(Appointment) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/agenda/date/{date}',
  tags: agendaTags,
  summary: 'Agendamentos por data',
  description: 'Lista agendamentos de uma data específica',
  auth: true,
  pathParams: z.object({ date: dateString }),
  responses: {
    200: { description: 'Agendamentos do dia', schema: successResponse(z.array(Appointment)) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/agenda/range',
  tags: agendaTags,
  summary: 'Agendamentos por período',
  description: 'Lista agendamentos em um intervalo de datas',
  auth: true,
  queryParams: dateRangeQuery,
  responses: {
    200: { description: 'Agendamentos do período', schema: successResponse(z.array(Appointment)) },
  },
})

registerPath({
  method: 'post',
  path: '/v1/agenda',
  tags: agendaTags,
  summary: 'Criar agendamento',
  description: 'Cria um novo agendamento',
  auth: true,
  requestBody: createAppointmentSchema,
  responses: {
    201: { description: 'Agendamento criado', schema: successResponse(Appointment) },
    409: { description: 'Conflito de horário', schema: errorResponse },
    422: { description: 'Dados inválidos', schema: errorResponse },
  },
})

registerPath({
  method: 'get',
  path: '/v1/agenda/conflicts',
  tags: agendaTags,
  summary: 'Verificar conflitos',
  description: 'Verifica se há conflitos de horário para um profissional',
  auth: true,
  queryParams: conflictCheckQuery,
  responses: {
    200: { description: 'Resultado da verificação', schema: successResponse(ConflictCheck) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/agenda/suggestions',
  tags: agendaTags,
  summary: 'Sugestões de horário',
  description: 'Sugere horários disponíveis para agendamento',
  auth: true,
  queryParams: suggestionsQuery,
  responses: {
    200: { description: 'Sugestões de horário', schema: successResponse(z.array(Suggestion)) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/agenda/{id}',
  tags: agendaTags,
  summary: 'Detalhes do agendamento',
  description: 'Retorna os detalhes de um agendamento',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Detalhes do agendamento', schema: successResponse(Appointment) },
    404: { description: 'Agendamento não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'put',
  path: '/v1/agenda/{id}',
  tags: agendaTags,
  summary: 'Atualizar agendamento',
  description: 'Atualiza os dados de um agendamento',
  auth: true,
  pathParams: uuidParamObj,
  requestBody: updateAppointmentSchema,
  responses: {
    200: { description: 'Agendamento atualizado', schema: successResponse(Appointment) },
    404: { description: 'Agendamento não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'patch',
  path: '/v1/agenda/{id}/confirm',
  tags: agendaTags,
  summary: 'Confirmar agendamento',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Agendamento confirmado', schema: successResponse(Appointment) },
  },
})

registerPath({
  method: 'patch',
  path: '/v1/agenda/{id}/cancel',
  tags: agendaTags,
  summary: 'Cancelar agendamento',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Agendamento cancelado', schema: successResponse(Appointment) },
  },
})

registerPath({
  method: 'patch',
  path: '/v1/agenda/{id}/no-show',
  tags: agendaTags,
  summary: 'Marcar como não compareceu',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Agendamento marcado como no-show', schema: successResponse(Appointment) },
  },
})

registerPath({
  method: 'post',
  path: '/v1/agenda/{id}/reschedule',
  tags: agendaTags,
  summary: 'Reagendar',
  description: 'Altera a data/horário de um agendamento',
  auth: true,
  pathParams: uuidParamObj,
  requestBody: rescheduleSchema,
  responses: {
    200: { description: 'Agendamento reagendado', schema: successResponse(Appointment) },
  },
})

registerPath({
  method: 'delete',
  path: '/v1/agenda/{id}',
  tags: agendaTags,
  summary: 'Excluir agendamento',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    204: { description: 'Agendamento excluído (sem conteúdo)' },
  },
})

// ==================== Atendimento ====================
const atendimentoTags = ['Atendimentos']

registerPath({
  method: 'get',
  path: '/v1/atendimentos',
  tags: atendimentoTags,
  summary: 'Listar atendimentos',
  description: 'Lista atendimentos realizados',
  auth: true,
  responses: {
    200: { description: 'Lista de atendimentos', schema: paginatedResponse(Atendimento) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/atendimentos/{id}',
  tags: atendimentoTags,
  summary: 'Detalhes do atendimento',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Detalhes do atendimento', schema: successResponse(Atendimento) },
    404: { description: 'Atendimento não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/atendimentos',
  tags: atendimentoTags,
  summary: 'Iniciar atendimento',
  description: 'Registra um novo atendimento',
  auth: true,
  requestBody: createAtendimentoSchema,
  responses: {
    201: { description: 'Atendimento criado', schema: successResponse(Atendimento) },
    422: { description: 'Dados inválidos', schema: errorResponse },
  },
})

registerPath({
  method: 'put',
  path: '/v1/atendimentos/{id}',
  tags: atendimentoTags,
  summary: 'Atualizar atendimento',
  auth: true,
  pathParams: uuidParamObj,
  requestBody: updateAtendimentoSchema,
  responses: {
    200: { description: 'Atendimento atualizado', schema: successResponse(Atendimento) },
    404: { description: 'Atendimento não encontrado', schema: errorResponse },
  },
})

// ==================== Clientes ====================
const clientesTags = ['Clientes']

registerPath({
  method: 'get',
  path: '/v1/clientes',
  tags: clientesTags,
  summary: 'Listar clientes',
  description: 'Lista clientes com filtros',
  auth: true,
  queryParams: clienteFiltersQuery,
  responses: {
    200: { description: 'Lista de clientes', schema: paginatedResponse(Cliente) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/clientes/{id}',
  tags: clientesTags,
  summary: 'Detalhes do cliente',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Detalhes do cliente', schema: successResponse(Cliente) },
    404: { description: 'Cliente não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/clientes',
  tags: clientesTags,
  summary: 'Criar cliente',
  auth: true,
  requestBody: createClienteSchema,
  responses: {
    201: { description: 'Cliente criado', schema: successResponse(Cliente) },
    422: { description: 'Dados inválidos', schema: errorResponse },
  },
})

registerPath({
  method: 'put',
  path: '/v1/clientes/{id}',
  tags: clientesTags,
  summary: 'Atualizar cliente',
  auth: true,
  pathParams: uuidParamObj,
  requestBody: updateClienteSchema,
  responses: {
    200: { description: 'Cliente atualizado', schema: successResponse(Cliente) },
    404: { description: 'Cliente não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'delete',
  path: '/v1/clientes/{id}',
  tags: clientesTags,
  summary: 'Excluir cliente',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    204: { description: 'Cliente excluído (sem conteúdo)' },
  },
})

// ==================== Equipe ====================
const equipeTags = ['Equipe']

registerPath({
  method: 'get',
  path: '/v1/equipe',
  tags: equipeTags,
  summary: 'Listar equipe',
  description: 'Lista todos os membros da equipe',
  auth: true,
  responses: {
    200: { description: 'Lista da equipe', schema: successResponse(z.array(TeamMember)) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/equipe/{id}',
  tags: equipeTags,
  summary: 'Detalhes do membro',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Detalhes do membro', schema: successResponse(TeamMember) },
    404: { description: 'Membro não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/equipe',
  tags: equipeTags,
  summary: 'Adicionar membro',
  description: 'Adiciona um novo membro à equipe',
  auth: true,
  requestBody: createTeamMemberSchema,
  responses: {
    201: { description: 'Membro adicionado', schema: successResponse(TeamMember) },
    422: { description: 'Dados inválidos', schema: errorResponse },
  },
})

registerPath({
  method: 'put',
  path: '/v1/equipe/{id}',
  tags: equipeTags,
  summary: 'Atualizar membro',
  auth: true,
  pathParams: uuidParamObj,
  requestBody: updateTeamMemberSchema,
  responses: {
    200: { description: 'Membro atualizado', schema: successResponse(TeamMember) },
    404: { description: 'Membro não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'delete',
  path: '/v1/equipe/{id}',
  tags: equipeTags,
  summary: 'Remover membro',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    204: { description: 'Membro removido (sem conteúdo)' },
  },
})

// ==================== Servicos ====================
const servicosTags = ['Serviços']

registerPath({
  method: 'get',
  path: '/v1/servicos',
  tags: servicosTags,
  summary: 'Listar serviços',
  description: 'Lista todos os serviços (pode agrupar por categoria)',
  auth: true,
  responses: {
    200: { description: 'Lista de serviços', schema: successResponse(z.union([z.array(Service), z.array(ServiceCategory)])) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/servicos/{id}',
  tags: servicosTags,
  summary: 'Detalhes do serviço',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Detalhes do serviço', schema: successResponse(Service) },
    404: { description: 'Serviço não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/servicos',
  tags: servicosTags,
  summary: 'Criar serviço',
  auth: true,
  requestBody: createServiceSchema,
  responses: {
    201: { description: 'Serviço criado', schema: successResponse(Service) },
    422: { description: 'Dados inválidos', schema: errorResponse },
  },
})

registerPath({
  method: 'put',
  path: '/v1/servicos/{id}',
  tags: servicosTags,
  summary: 'Atualizar serviço',
  auth: true,
  pathParams: uuidParamObj,
  requestBody: updateServiceSchema,
  responses: {
    200: { description: 'Serviço atualizado', schema: successResponse(Service) },
    404: { description: 'Serviço não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'delete',
  path: '/v1/servicos/{id}',
  tags: servicosTags,
  summary: 'Excluir serviço',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    204: { description: 'Serviço excluído (sem conteúdo)' },
  },
})

// ==================== Pagamentos ====================
const pagamentoTags = ['Pagamentos']

registerPath({
  method: 'get',
  path: '/v1/pagamentos',
  tags: pagamentoTags,
  summary: 'Listar pagamentos',
  auth: true,
  responses: {
    200: { description: 'Lista de pagamentos', schema: paginatedResponse(Payment) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/pagamentos/{id}',
  tags: pagamentoTags,
  summary: 'Detalhes do pagamento',
  auth: true,
  pathParams: uuidParamObj,
  responses: {
    200: { description: 'Detalhes do pagamento', schema: successResponse(Payment) },
    404: { description: 'Pagamento não encontrado', schema: errorResponse },
  },
})

registerPath({
  method: 'post',
  path: '/v1/pagamentos',
  tags: pagamentoTags,
  summary: 'Registrar pagamento',
  auth: true,
  requestBody: createPaymentSchema,
  responses: {
    201: { description: 'Pagamento registrado', schema: successResponse(Payment) },
    422: { description: 'Dados inválidos', schema: errorResponse },
  },
})

registerPath({
  method: 'put',
  path: '/v1/pagamentos/{id}',
  tags: pagamentoTags,
  summary: 'Atualizar pagamento',
  auth: true,
  pathParams: uuidParamObj,
  requestBody: updatePaymentSchema,
  responses: {
    200: { description: 'Pagamento atualizado', schema: successResponse(Payment) },
    404: { description: 'Pagamento não encontrado', schema: errorResponse },
  },
})

// ==================== Fidelização ====================
const fidelizacaoTags = ['Fidelização']

registerPath({
  method: 'get',
  path: '/v1/fidelizacao/program',
  tags: fidelizacaoTags,
  summary: 'Programa de fidelidade',
  description: 'Retorna as configurações do programa de fidelidade',
  auth: true,
  responses: {
    200: { description: 'Configurações do programa', schema: successResponse(LoyaltyProgram) },
  },
})

registerPath({
  method: 'put',
  path: '/v1/fidelizacao/program',
  tags: fidelizacaoTags,
  summary: 'Atualizar programa',
  description: 'Atualiza as configurações do programa de fidelidade',
  auth: true,
  requestBody: loyaltyProgramSchema,
  responses: {
    200: { description: 'Programa atualizado', schema: successResponse(LoyaltyProgram) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/fidelizacao/promotions',
  tags: fidelizacaoTags,
  summary: 'Listar promoções',
  auth: true,
  responses: {
    200: { description: 'Lista de promoções', schema: successResponse(z.array(Promotion)) },
  },
})

registerPath({
  method: 'post',
  path: '/v1/fidelizacao/promotions',
  tags: fidelizacaoTags,
  summary: 'Criar promoção',
  auth: true,
  requestBody: createPromotionSchema,
  responses: {
    201: { description: 'Promoção criada', schema: successResponse(Promotion) },
  },
})

registerPath({
  method: 'put',
  path: '/v1/fidelizacao/promotions/{id}',
  tags: fidelizacaoTags,
  summary: 'Atualizar promoção',
  auth: true,
  responses: {
    200: { description: 'Promoção atualizada', schema: successResponse(Promotion) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/fidelizacao/points/{clientPhone}',
  tags: fidelizacaoTags,
  summary: 'Pontos do cliente',
  description: 'Retorna os pontos de fidelidade de um cliente',
  auth: true,
  responses: {
    200: { description: 'Pontos do cliente', schema: successResponse(ClientPoints) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/fidelizacao/transactions',
  tags: fidelizacaoTags,
  summary: 'Transações de pontos',
  description: 'Lista transações de pontos de fidelidade',
  auth: true,
  responses: {
    200: { description: 'Transações', schema: successResponse(z.array(PointsTransaction)) },
  },
})

// ==================== Pós-Atendimento ====================
const posAtendimentoTags = ['Pós-Atendimento']

registerPath({
  method: 'get',
  path: '/v1/pos-atendimento/feedback',
  tags: posAtendimentoTags,
  summary: 'Listar feedbacks',
  auth: true,
  responses: {
    200: { description: 'Lista de feedbacks', schema: paginatedResponse(Feedback) },
  },
})

registerPath({
  method: 'post',
  path: '/v1/pos-atendimento/feedback',
  tags: posAtendimentoTags,
  summary: 'Registrar feedback',
  auth: true,
  requestBody: createFeedbackSchema,
  responses: {
    201: { description: 'Feedback registrado', schema: successResponse(Feedback) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/pos-atendimento/campaigns',
  tags: posAtendimentoTags,
  summary: 'Listar campanhas',
  auth: true,
  responses: {
    200: { description: 'Lista de campanhas', schema: successResponse(z.array(Campaign)) },
  },
})

registerPath({
  method: 'post',
  path: '/v1/pos-atendimento/campaigns',
  tags: posAtendimentoTags,
  summary: 'Criar campanha',
  auth: true,
  requestBody: createCampaignSchema,
  responses: {
    201: { description: 'Campanha criada', schema: successResponse(Campaign) },
  },
})

registerPath({
  method: 'put',
  path: '/v1/pos-atendimento/campaigns/{id}',
  tags: posAtendimentoTags,
  summary: 'Atualizar campanha',
  auth: true,
  requestBody: updateCampaignSchema,
  responses: {
    200: { description: 'Campanha atualizada', schema: successResponse(Campaign) },
  },
})

registerPath({
  method: 'delete',
  path: '/v1/pos-atendimento/campaigns/{id}',
  tags: posAtendimentoTags,
  summary: 'Excluir campanha',
  auth: true,
  responses: {
    204: { description: 'Campanha excluída (sem conteúdo)' },
  },
})

// ==================== Onboarding ====================
const onboardingTags = ['Onboarding']

registerPath({
  method: 'put',
  path: '/v1/onboarding/business',
  tags: onboardingTags,
  summary: 'Dados do negócio',
  description: 'Salva os dados do negócio durante o onboarding',
  auth: true,
  requestBody: businessDataSchema,
  responses: {
    200: { description: 'Dados salvos', schema: successResponse(OnboardingData) },
  },
})

registerPath({
  method: 'put',
  path: '/v1/onboarding/hours',
  tags: onboardingTags,
  summary: 'Horários de funcionamento',
  description: 'Salva os horários de funcionamento',
  auth: true,
  requestBody: hoursSchema,
  responses: {
    200: { description: 'Horários salvos', schema: successResponse(OnboardingData) },
  },
})

registerPath({
  method: 'put',
  path: '/v1/onboarding/services',
  tags: onboardingTags,
  summary: 'Serviços do negócio',
  description: 'Salva os serviços oferecidos',
  auth: true,
  requestBody: servicesSchema,
  responses: {
    200: { description: 'Serviços salvos', schema: successResponse(OnboardingData) },
  },
})

registerPath({
  method: 'put',
  path: '/v1/onboarding/team',
  tags: onboardingTags,
  summary: 'Equipe',
  description: 'Salva os membros da equipe',
  auth: true,
  requestBody: teamSchema,
  responses: {
    200: { description: 'Equipe salva', schema: successResponse(OnboardingData) },
  },
})

registerPath({
  method: 'post',
  path: '/v1/onboarding/complete',
  tags: onboardingTags,
  summary: 'Finalizar onboarding',
  description: 'Marca o onboarding como concluído',
  auth: true,
  responses: {
    200: { description: 'Onboarding concluído', schema: successResponse(OnboardingData) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/onboarding/prepopulated/{segmento}',
  tags: onboardingTags,
  summary: 'Serviços pré-preenchidos',
  description: 'Retorna serviços sugeridos baseados no segmento',
  auth: true,
  responses: {
    200: { description: 'Serviços sugeridos', schema: successResponse(PrepopulatedServices) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/onboarding/progress',
  tags: onboardingTags,
  summary: 'Progresso do onboarding',
  description: 'Retorna o progresso atual do onboarding',
  auth: true,
  responses: {
    200: { description: 'Progresso do onboarding', schema: successResponse(OnboardingProgress) },
  },
})

// ==================== Configurações ====================
const configTags = ['Configurações']

registerPath({
  method: 'get',
  path: '/v1/configuracoes',
  tags: configTags,
  summary: 'Listar configurações',
  description: 'Retorna as configurações do estabelecimento',
  auth: true,
  responses: {
    200: { description: 'Configurações', schema: successResponse(Config) },
  },
})

registerPath({
  method: 'put',
  path: '/v1/configuracoes',
  tags: configTags,
  summary: 'Atualizar configurações',
  auth: true,
  requestBody: updateConfigSchema,
  responses: {
    200: { description: 'Configurações atualizadas', schema: successResponse(Config) },
  },
})

// ==================== Dashboard ====================
const dashboardTags = ['Dashboard']

registerPath({
  method: 'get',
  path: '/v1/dashboard/metrics',
  tags: dashboardTags,
  summary: 'Métricas do dashboard',
  description: 'Retorna as métricas principais do dashboard',
  auth: true,
  responses: {
    200: { description: 'Métricas do dashboard', schema: successResponse(DashboardMetrics) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/dashboard/today',
  tags: dashboardTags,
  summary: 'Agenda do dia',
  description: 'Retorna os agendamentos e resumo do dia',
  auth: true,
  responses: {
    200: { description: 'Agenda do dia', schema: successResponse(DashboardToday) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/dashboard/analytics',
  tags: dashboardTags,
  summary: 'Analytics',
  description: 'Retorna dados analíticos do dashboard',
  auth: true,
  responses: {
    200: { description: 'Analytics', schema: successResponse(DashboardAnalytics) },
  },
})

registerPath({
  method: 'get',
  path: '/v1/dashboard/status',
  tags: dashboardTags,
  summary: 'Status do sistema',
  description: 'Retorna o status dos serviços do sistema',
  auth: true,
  responses: {
    200: { description: 'Status do sistema', schema: successResponse(SystemStatus) },
  },
})

// ==================== Relatórios ====================
const relatoriosTags = ['Relatórios']

registerPath({
  method: 'get',
  path: '/v1/relatorios/kpis',
  tags: relatoriosTags,
  summary: 'KPIs do relatório',
  description: 'Retorna os indicadores de desempenho para o período',
  auth: true,
  responses: {
    200: { description: 'KPIs do relatório', schema: successResponse(ReportKPIs) },
  },
})

// ==================== Health ====================
registerPath({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  summary: 'Health check',
  description: 'Verifica se o servidor está operacional',
  responses: {
    200: { description: 'Servidor operacional', schema: successResponse(z.object({
      status: z.literal('ok'),
      timestamp: z.string(),
    })) },
  },
})

const generator = new OpenApiGeneratorV3(registry.definitions)

export const openApiSpec = generator.generateDocument({
  openapi: '3.0.3',
  info: {
    title: 'Infinity Style API',
    version: '1.0.0',
    description: `API do sistema Infinity Style para gestão de salões de beleza e barbearias.

## Autenticação
A maioria dos endpoints requer autenticação via Bearer JWT.
Obtenha o token através dos endpoints de login ou cadastro.`,
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Desenvolvimento' },
  ],
  tags: [
    { name: 'Autenticação', description: 'Endpoints de autenticação e gerenciamento de sessão' },
    { name: 'Agenda', description: 'Gerenciamento de agendamentos' },
    { name: 'Atendimentos', description: 'Registro e gerenciamento de atendimentos' },
    { name: 'Clientes', description: 'CRUD de clientes' },
    { name: 'Equipe', description: 'Gerenciamento da equipe' },
    { name: 'Serviços', description: 'Catálogo de serviços' },
    { name: 'Pagamentos', description: 'Registro de pagamentos' },
    { name: 'Fidelização', description: 'Programa de fidelidade e promoções' },
    { name: 'Pós-Atendimento', description: 'Feedbacks e campanhas de marketing' },
    { name: 'Onboarding', description: 'Configuração inicial do estabelecimento' },
    { name: 'Configurações', description: 'Configurações gerais do sistema' },
    { name: 'Dashboard', description: 'Métricas e indicadores' },
    { name: 'Relatórios', description: 'Relatórios e KPIs' },
    { name: 'Health', description: 'Health check do servidor' },
  ],
})
