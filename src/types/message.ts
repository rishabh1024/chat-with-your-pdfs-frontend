export type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
  status?: 'sending' | 'failed' | 'sent'
}