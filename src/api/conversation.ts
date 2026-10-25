import { apiClient } from '@/lib/apiClient'
import type {
  AIMessage,
  Conversation,
  ConversationList,
  ConversationHistory,
  CreateConversationRequest,
  UserMessage,
} from '@/types/conversation'

type RequestOptions = {
  signal?: AbortSignal
}

export async function listConversations(options: RequestOptions = {}) {
  const response = await apiClient.get<ConversationList>('/conversations', {
    signal: options.signal,
  })

  return response.data
}

export async function createConversation(
  payload: CreateConversationRequest = {},
) {
  const response = await apiClient.post<Conversation>(
    '/conversations',
    payload,
  )

  return response.data
}

export async function deleteConversation(conversationId: string) {
  await apiClient.delete(`/conversations/${conversationId}`)
}

export async function getMessages(
  conversationId: string,
  options: RequestOptions = {},
) {
  const response = await apiClient.get<ConversationHistory>(
    `/conversations/${conversationId}/messages`,
    { signal: options.signal },
  )

  return response.data
}

export async function sendMessage(
  conversationId: string,
  payload: UserMessage,
) {
  const response = await apiClient.post<AIMessage>(
    `/conversations/${conversationId}/messages`,
    payload,
    { timeout: 120_000 },
  )

  return response.data
}