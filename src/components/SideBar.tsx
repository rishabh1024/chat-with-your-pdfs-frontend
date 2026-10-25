import pdfLogo from '@/assets/logo.svg'
import { useConversations } from '@/hooks/useConversations'
import '@/styles/Sidebar.css'
import { useNavigate, useParams } from 'react-router-dom'
import { logError } from '@/lib/logger'

interface SidebarProps {
  onClose: () => void
}


export function Sidebar({ onClose }: SidebarProps){

  const navigate = useNavigate()
  const { conversationId } = useParams()

  const {
    conversations,
    isLoading,
    error,
    isCreating,
    reload,
    create,
    isDeleting,
    remove
  } = useConversations()

  async function handleNewChat(){
    try {
      const conversation = await create()
      navigate(`/conversation/${conversation.id}`)
    } catch (caught) {
      logError('create_conversation_failed', caught)
    }
  }

  async function handleChatDelete(id: string) {
    const confirmed = window.confirm('Delete this conversation?')
    if (!confirmed) return
    try {
      await remove(id)
      if (id === conversationId) {
        navigate('/')
      }
    } catch (caught) {
      logError('delete_conversation_failed', caught)
    }
  }

  function formatRelativeTime(iso: string) {
    const deltaMs = Date.now() - new Date(iso).getTime()
    const minutes = Math.round(deltaMs / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.round(hours / 24)
    return `${days}d ago`
  }


  return (
    <aside className='sidebar-menu'>
      <div className='sidebar-header'>
        <div className='sidebar-brand-logo'>
          <img className='sidebar-logo-image' src={pdfLogo} alt="Chat with PDFs" />
          <span className='brand-name'>
            Chat With Your PDFs
          </span>
        </div>

        <button className='sidebar-close-button' type='button' aria-label='Close Sidebar' onClick={onClose}>
          <span aria-hidden='true' />
          <span aria-hidden='true' />
        </button>
      </div>

      <nav className='sidebar-tabs' aria-label='Sidebar Navigation'>
        <button className='sidebar-tab active' type='button'>
          History
        </button>
        <button className='sidebar-tab' type='button'>
          Docs
        </button>
      </nav>

      <section className='sidebar-content'>
        <div className='sidebar-section-header'>
          <h2>Recent Chats</h2>

          <button className='new-chat-button' type='button' onClick={handleNewChat} disabled={isCreating}>
            {isCreating ? 'Creating New Chat...' : 'New Chat'}
          </button>
        </div>

        <div className="conversation-list">
          {isLoading && <p> Loading conversations... </p>}

          {!isLoading && error && (
            <div>
              <p role="alert">{error.message}</p>
              <button type='button' onClick={reload}>
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && conversations.length === 0 && (
            <p className="empty-conversations">
            </p>
          )}

          {!isLoading && !error && conversations.length > 0 && (
            <ul>
              {conversations.map((conversation) => (
                <li key={conversation.id} className={conversation.id === conversationId ? 'selected': undefined}>
                  <button
                    type="button"
                    className='conversation-title'
                    onClick={() => navigate(`/conversation/${conversation.id}`)}
                  >
                    {conversation.title ?? 'New Conversation'}
                  <span className="conversation-time">
                    {formatRelativeTime(conversation.updated_at)}
                  </span>  
                  </button>
                  <button
                    type="button"
                    className='conversation-delete'
                    onClick={() => handleChatDelete(conversation.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </aside>
  )
 }