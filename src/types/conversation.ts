export type Conversation = {
  id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
}

export type ConversationList = {
  count_conversations: number
  conversations: Conversation[]
}

export type MessageType = 'user' | 'ai'

export type ChatMessage = {
  id: string
  conversation_id: string
  role: MessageType
  content: string
  created_at: string 
}

export type ConversationHistory = {
  conversation_id: string
  messages: ChatMessage[]
}

export type CreateConversationRequest = {
  title?: string | null
}

export type UserMessage = {
  message_content: string
}

export type AIMessage = { 
  conversation_id: string
  content: string
}