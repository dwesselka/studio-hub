# Pagamentos

## Modelos Envolvidos

- `Payment`: pagamento vinculado a um atendimento
- `Atendimento`: atendimento que gerou o pagamento

## Métodos Aceitos

| Método     | Descrição                                   |
| ---------- | ------------------------------------------- |
| `pix`      | QR Code gerado (futuro: integração com PSP) |
| `credit`   | Cartão de crédito                           |
| `debit`    | Cartão de débito                            |
| `cash`     | Dinheiro                                    |
| `transfer` | Transferência bancária                      |

## Regras

1. **Pagamento parcial**: permite registrar pagamentos parciais (múltiplos payments para um atendimento)
2. **Status**: `pending` → `paid` | `cancelled` | `refunded`
3. **Estorno**: só permitido em até 7 dias (configurável)
4. **PIX**: gera código de pagamento (futuro: integração com provedor)
5. **Múltiplos métodos**: um atendimento pode ser pago com combinação de métodos

## Fluxo

1. Atendimento finalizado → sistema sugere valor total
2. Profissional registra pagamento (método + valor)
3. Frontend exibe QR Code PIX se o método for PIX
4. Payment salvo com status `paid`
5. Histórico disponível em relatórios
