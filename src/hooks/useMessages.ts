import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { createConversation, getMessages, sendMessage } from '@/api/conversation'
import { ApiError, toApiError } from '@/lib/apiError'
import type { Message } from '@/types/message'

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const createdConversationId = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!conversationId) {
      createdConversationId.current = undefined
      setMessages([])
      setError(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    getMessages(conversationId, { signal: controller.signal })
      .then((history) => {
        setMessages(
          history.messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
        )
      })
      .catch((caught) => {
        if (axios.isCancel(caught)) return
        setError(toApiError(caught))
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [conversationId])

  const send = useCallback(async (content: string) => {
    if (isSending) {
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      status: 'sending'
    }

    setIsSending(true)
    setError(null)
    setMessages((current) => [...current, userMessage])

    try {
      const id =
        conversationId ??
        createdConversationId.current ??
        (await createConversation()).id

      if (!conversationId) {
        createdConversationId.current = id
      }

      const aiMessage = await sendMessage(id, {
        message_content: content,
      })

      setMessages((current) => [
        ...current.map((message) =>
          message.id === userMessage.id
            ? { ...message, status: 'sent' as const }
            : message,
        ),
        {
          id: crypto.randomUUID(),
          role: 'ai',
          content: aiMessage.content,
        },
      ])

      return id
    } catch (caught) {
      const apiError = toApiError(caught)
      setError(apiError)
      setMessages((current) =>
        current.map((message) =>
          message.id === userMessage.id
            ? { ...message, status: 'failed' as const }
            : message,
        ),
      )
    } finally {
      setIsSending(false)
    }
  }, [conversationId, isSending])

  const retry = useCallback(async () => {
    if (isSending) {
      return
    }

    const failedMessage = [...messages]
      .reverse()
      .find((message) => message.role === 'user' && message.status === 'failed')

    if (!failedMessage) {
      return
    }

    setIsSending(true)
    setError(null)
    setMessages((current) =>
      current.map((message) =>
        message.id === failedMessage.id
          ? { ...message, status: 'sending' as const }
          : message,
      ),
    )

    try {
      const id =
        conversationId ??
        createdConversationId.current ??
        (await createConversation()).id

      if (!conversationId) {
        createdConversationId.current = id
      }

      const aiMessage = await sendMessage(id, {
        message_content: failedMessage.content,
      })

      setMessages((current) => [
        ...current.map((message) =>
          message.id === failedMessage.id
            ? { ...message, status: 'sent' as const }
            : message,
        ),
        {
          id: crypto.randomUUID(),
          role: 'ai',
          content: aiMessage.content,
        },
      ])

      return id
    } catch (caught) {
      const apiError = toApiError(caught)
      setError(apiError)
      setMessages((current) =>
        current.map((message) =>
          message.id === failedMessage.id
            ? { ...message, status: 'failed' as const }
            : message,
        ),
      )
    } finally {
      setIsSending(false)
    }
  }, [conversationId, isSending, messages])

  return { messages, isLoading, isSending, error, send, retry }
}