import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { chatbotKnowledge, SITE } from '@/data/content'
import { useChatbot } from './use-chatbot'

const QUICK_REPLIES = ['Quais planos?', 'Como funciona?', 'Quero me cadastrar'] as const

function formatMessage(text: string): React.ReactNode {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line
        .split(/(\*\*[^*]+\*\*)/)
        .map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ))
}

export default function Chatbot() {
  const {
    open,
    setOpen,
    messages,
    input,
    setInput,
    loading,
    showLead,
    messagesEndRef,
    handleOpen,
    sendMessage,
    handleLeadClick,
  } = useChatbot()

  const fabRef = useRef<HTMLButtonElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) {
      fabRef.current?.focus()
      return
    }

    inputRef.current?.focus()

    function getFocusableElements(): HTMLElement[] {
      if (!panelRef.current) return []
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.disabled && el.offsetParent !== null)
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      if (e.key !== 'Tab') return

      const focusable = getFocusableElements()
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen])

  return (
    <>
      {!open && (
        <button
          ref={fabRef}
          type="button"
          className="chatbot-fab"
          onClick={handleOpen}
          aria-label="Abrir assistente virtual"
          aria-haspopup="dialog"
          aria-expanded={false}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className="chatbot-panel"
          role="dialog"
          aria-label="Assistente virtual do Infinity Partner"
          aria-modal="true"
        >
          <header className="chatbot-panel__header">
            <div>
              <strong>Assistente Infinity</strong>
              <span>Online agora</span>
            </div>
            <button
              type="button"
              className="chatbot-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Fechar assistente virtual"
            >
              &times;
            </button>
          </header>

          <div className="chatbot-panel__messages" tabIndex={0} aria-label="Mensagens do chat">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${msg.role}`}>
                {formatMessage(msg.text)}
              </div>
            ))}
            {loading && (
              <div
                className="chatbot-msg chatbot-msg--assistant chatbot-msg--typing"
                aria-label="Digitando..."
              >
                <span />
                <span />
                <span />
              </div>
            )}
            {showLead && !loading && (
              <div className="chatbot-lead" role="status">
                <p>{chatbotKnowledge.leadPrompt}</p>
                <Link
                  to={SITE.cadastroPath}
                  className="btn btn--primary btn--sm"
                  onClick={handleLeadClick}
                >
                  Iniciar cadastro
                </Link>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-panel__quick" aria-label="Respostas rápidas">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => sendMessage(reply)}
                disabled={loading}
                aria-label={`Perguntar: ${reply}`}
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            className="chatbot-panel__input"
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              disabled={loading}
              aria-label="Mensagem para o assistente"
              required
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar mensagem">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
