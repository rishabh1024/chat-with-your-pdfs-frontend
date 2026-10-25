import type { Message } from '@/types/message'

type MessageAreaProps = {
  messages: Message[]
  onRetry?: () => void
  isSending?: boolean
}

export function MessageArea({
  messages,
  onRetry,
  isSending = false,
}: MessageAreaProps) {
  return (
    <section className="message-area">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.role}${message.status === 'failed' ? ' failed' : ''}`}
        >
          {message.content}
          {message.status === 'failed' && onRetry && (
            <button
              type="button"
              className="retry-button"
              onClick={onRetry}
              disabled={isSending}
            >
              Retry
            </button>
          )}
        </div>
      ))}
    </section>
  )
}