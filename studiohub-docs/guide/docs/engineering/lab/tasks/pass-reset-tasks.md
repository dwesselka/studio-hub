# Password Reset

## Status

🟡 In Progress

## Objetivo

Implementar fluxo seguro de recuperação de senha através de código enviado ao usuário.

---

# Tasks

## Frontend

- [x] Criar tela "Esqueci minha senha"
- [x] Criar componente Input OTP
- [x] Implementar contador de reenvio (60s)
- [] Criar tela de validação do código
- [x] Criar tela de nova senha
- [] Implementar validações UX

---

# Backend

- [x] Criar endpoint POST /auth/password-reset/request
- [ ] Criar geração de código
- [ ] Criar persistência do token temporário
- [ ] Criar endpoint POST /auth/password-reset/verify
- [ ] Criar endpoint POST /auth/password-reset/change

---

# Segurança

- [ ] Rate limit
- [ ] Expiração do código
- [ ] Controle de tentativas
- [ ] Auditoria

---

# Definition of Done

- [ ] Fluxo completo funcionando
- [ ] Testes automatizados
- [ ] Documentação atualizada
- [ ] Code review aprovado

---

> **Última atualização:** 2026-07-21 | **Responsável:** Equipe StudioHub
