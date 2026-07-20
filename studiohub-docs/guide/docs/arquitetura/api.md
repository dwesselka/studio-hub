# API

## Base

Todas as rotas sob `/v1/`. Backend em `http://localhost:3001`.

## Autenticação

| Método | Rota               | Descrição               |
| ------ | ------------------ | ----------------------- |
| POST   | `/v1/auth/signup`  | Criar conta             |
| POST   | `/v1/auth/login`   | Login                   |
| POST   | `/v1/auth/refresh` | Renovar tokens          |
| GET    | `/v1/auth/me`      | Dados do usuário logado |
| POST   | `/v1/auth/logout`  | Logout                  |

## Domínios (requerem Bearer token)

| Grupo         | Rotas                                                       |
| ------------- | ----------------------------------------------------------- |
| Agenda        | CRUD agendamentos, confirmação, cancelamento, reagendamento |
| Clientes      | CRUD + filtros por status/busca                             |
| Equipe        | CRUD membros                                                |
| Serviços      | CRUD + listagem por categoria                               |
| Atendimentos  | CRUD com serviços e insumos                                 |
| Pagamentos    | CRUD + métodos (PIX, crédito, débito, dinheiro)             |
| Fidelização   | Pontos, promoções, transações                               |
| Dashboard     | Métricas, hoje, analytics                                   |
| Relatórios    | KPIs por período                                            |
| Configurações | Preferências da empresa                                     |

## Documentação

Swagger UI disponível em `/docs` (gera automaticamente dos schemas Zod via `zod-to-openapi`).

## Formato de Resposta

```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```
