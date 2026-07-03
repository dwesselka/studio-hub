import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { chatbotKnowledge, SITE } from '../../data/content'
import { trackChatbotLead, trackChatbotOpen } from '../../lib/analytics'
import { getChatbotResponseAsync } from '../../lib/chatbot'

const QUICK_REPLIES = ['Quais planos?', 'Como funciona?', 'Quero me cadastrar']

function formatMessage(text) {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part,
      )}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ))
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLead, setShowLead] = useState(false)
  const messagesEndRef = useRef(null)
  const openedRef = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleOpen() {
    setOpen(true)
    if (!openedRef.current) {
      openedRef.current = true
      trackChatbotOpen()
      setMessages([{ role: 'assistant', text: chatbotKnowledge.greeting }])
    }
  }

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setLoading(true)

    const response = await getChatbotResponseAsync(trimmed)

    setMessages((prev) => [...prev, { role: 'assistant', text: response.text }])
    setShowLead(response.lead)
    setLoading(false)
  }

  function handleLeadClick() {
    trackChatbotLead('chatbot')
  }

  return (
    <>
      {!open && (
        <button type="button" className="chatbot-fab" onClick={handleOpen} aria-label="Abrir chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Assistente virtual">
          <header className="chatbot-panel__header">
            <div>
              <strong>Assistente Infinity</strong>
              <span>Online agora</span>
            </div>
            <button type="button" className="chatbot-panel__close" onClick={() => setOpen(false)} aria-label="Fechar chat">
              &times;
            </button>
          </header>

          <div className="chatbot-panel__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${msg.role}`}>
                {formatMessage(msg.text)}
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg--assistant chatbot-msg--typing">
                <span /><span /><span />
              </div>
            )}
            {showLead && !loading && (
              <div className="chatbot-lead">
                <p>{chatbotKnowledge.leadPrompt}</p>
                <Link to={SITE.cadastroPath} className="btn btn--primary btn--sm" onClick={handleLeadClick}>
                  Iniciar cadastro
                </Link>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-panel__quick">
            {QUICK_REPLIES.map((reply) => (
              <button key={reply} type="button" onClick={() => sendMessage(reply)} disabled={loading}>
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
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
