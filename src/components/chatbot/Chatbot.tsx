import React, { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Send } from 'lucide-react'
import { chatbotKnowledge, SITE } from '@/data/content'
import { useChatbot } from './use-chatbot'
import { formatMessage } from './format-message'
import { useFocusTrap } from '@/hooks/use-focus-trap'

const QUICK_REPLIES = ['Quais planos?', 'Como funciona?', 'Quero me cadastrar'] as const

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

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      sendMessage(input)
    },
    [sendMessage, input],
  )

  useFocusTrap(panelRef, open, handleClose)

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
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className="chatbot-panel"
          role="dialog"
          aria-label="Assistente virtual do StudioHub"
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
              onClick={handleClose}
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

          <form className="chatbot-panel__input" onSubmit={handleSubmit}>
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
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
