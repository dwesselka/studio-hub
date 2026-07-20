# Password Reset

## Status

🟡 In Progress

## Objetivo

Implementar fluxo seguro de recuperação de senha através de código enviado ao usuário.

---

# Tasks

## Frontend

- [ ] Criar tela "Esqueci minha senha"
- [ ] Criar componente Input OTP
- [ ] Implementar contador de reenvio (60s)
- [ ] Criar tela de validação do código
- [ ] Criar tela de nova senha
- [ ] Implementar validações UX

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
