import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { requestId } from './lib/middleware'
import { requestLogger } from './lib/logger'
import { rateLimit } from './lib/rate-limit'
import { errorHandler } from './lib/error-handler'

import authRoutes from './routes/auth'
import agendaRoutes from './routes/agenda'
import clientesRoutes from './routes/clientes'
import equipeRoutes from './routes/equipe'
import servicosRoutes from './routes/servicos'
import atendimentoRoutes from './routes/atendimento'
import pagamentoRoutes from './routes/pagamento'
import fidelizacaoRoutes from './routes/fidelizacao'
import posAtendimentoRoutes from './routes/pos-atendimento'
import onboardingRoutes from './routes/onboarding'
import configuracoesRoutes from './routes/configuracoes'
import dashboardRoutes from './routes/dashboard'
import relatoriosRoutes from './routes/relatorios'

const app = new Hono()

app.use('/*', cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
  credentials: true,
}))
app.use('/*', secureHeaders())
app.use('/*', requestId)
app.use('/*', requestLogger)
app.use('/v1/*', rateLimit({ maxRequests: 120 }))
app.use('/v1/auth/*', rateLimit({ maxRequests: 20, windowMs: 60000 }))

app.onError(errorHandler)

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

const v1 = new Hono()

v1.route('/auth', authRoutes)
v1.route('/agenda', agendaRoutes)
v1.route('/clientes', clientesRoutes)
v1.route('/equipe', equipeRoutes)
v1.route('/servicos', servicosRoutes)
v1.route('/atendimentos', atendimentoRoutes)
v1.route('/pagamentos', pagamentoRoutes)
v1.route('/fidelizacao', fidelizacaoRoutes)
v1.route('/pos-atendimento', posAtendimentoRoutes)
v1.route('/onboarding', onboardingRoutes)
v1.route('/configuracoes', configuracoesRoutes)
v1.route('/dashboard', dashboardRoutes)
v1.route('/relatorios', relatoriosRoutes)

app.route('/v1', v1)

const port = process.env.PORT ? Number(process.env.PORT) : 3001

serve({ fetch: app.fetch, port }, (info) => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'Servidor iniciado',
    timestamp: new Date().toISOString(),
    port: info.port,
    apiUrl: `http://localhost:${info.port}/v1`,
  }))
})
