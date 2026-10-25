import { NewConversationHeader } from "./NewConversationHeader";
import "@/styles/ChatInterface.css"
import { MessageComposer } from "./MessageComposer";
import { MessageArea } from "./MessageArea";
import { useMessages } from '@/hooks/useMessages'
import { useNavigate, useParams } from "react-router-dom";

export function ChatInterface(){
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const { messages, isLoading, isSending, error, send, retry } = useMessages(conversationId)

  const hasMessages = messages.length > 0

  async function goToConversationIfNeeded(id: string | undefined) {
    if (!conversationId && id) {
      navigate(`/conversation/${id}`)
    }
  }

  async function handleSendMessage(content: string) {
    const id = await send(content)
    await goToConversationIfNeeded(id)
  }

  async function handleRetry() {
    const id = await retry()
    await goToConversationIfNeeded(id)
  }

  return (
    <main className="chat-interface">
      <div className="chat-column">
        {isLoading && <p>Loading messages...</p>}
        {error && <p role="alert">{error.message}</p>}
        <section className="message-area">
          {!isLoading && !error && !hasMessages && <NewConversationHeader />}
          <MessageArea
            messages={messages}
            onRetry={handleRetry}
            isSending={isSending}
          />
        </section>

        <div className="composer-container">
          <MessageComposer
            onSendMessage={handleSendMessage}
            disabled={isSending || isLoading}
            isSending={isSending}
          />
        </div>
      </div>
    </main>
  )
}
