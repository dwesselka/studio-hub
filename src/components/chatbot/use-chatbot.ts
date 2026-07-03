import { useState, useCallback, useRef, useEffect } from 'react'
import { getChatbotResponseAsync } from '@/lib/chatbot'
import { trackChatbotOpen, trackChatbotLead } from '@/lib/analytics'
import { chatbotKnowledge } from '@/data/content'

export interface Message {
  role: 'user' | 'assistant'
  text: string
}

export function useChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLead, setShowLead] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const openedRef = useRef(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
    }
  }, [messages, loading, open, scrollToBottom])

  const handleOpen = useCallback(() => {
    setOpen(true)
    if (!openedRef.current) {
      openedRef.current = true
      trackChatbotOpen()
      setMessages([{ role: 'assistant', text: chatbotKnowledge.greeting }])
    }
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      setInput('')
      setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
      setLoading(true)

      try {
        const response = await getChatbotResponseAsync(trimmed)
        setMessages((prev) => [...prev, { role: 'assistant', text: response.text }])
        setShowLead(response.lead)
      } catch (err) {
        console.error('[Chatbot Send Error]:', err)
        setMessages((prev) => [...prev, { role: 'assistant', text: chatbotKnowledge.fallback }])
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  const handleLeadClick = useCallback(() => {
    trackChatbotLead('chatbot')
  }, [])

  return {
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
  }
}
