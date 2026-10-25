import '@/styles/NewConversationHeader.css'
import { useAuth } from '@/context/AuthContext'

export function NewConversationHeader() {
  const { user } = useAuth()
  const name =
    (user?.user_metadata?.name as string | undefined)?.trim() ||
    user?.email?.split('@')[0] ||
    'There'

  return (
    <div className="new-chat">
      <h1>Hello, {name}</h1>
      <p>
        Start a conversation by typing a message below. I am here to help with
        questions about your PDFs.
      </p>
    </div>
  )
}