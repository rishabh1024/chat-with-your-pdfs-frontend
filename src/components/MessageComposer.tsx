import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import '@/styles/MessageComposer.css'

type MessageComposerProps = {
  onSendMessage: (content: string) => void | Promise<void>
  disabled?: boolean
  isSending?: boolean
}

export function MessageComposer({
  onSendMessage,
  disabled = false,
  isSending = false,
}: MessageComposerProps) {
  const [input, setInput] = useState('')

  function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }
    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const content = input.trim()

    if (!content || disabled) {
      return
    }

    void onSendMessage(content)
    setInput('')
  }

  return (
    <form className="message-composer" onSubmit={handleSubmit}>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={
          isSending ? 'Waiting for a reply...' : 'Ask anything about your PDFs...'
        }
        aria-label="Message"
        rows={1}
        disabled={disabled}
        onKeyDown={handleKeyPress}
      />

      <button type="submit" disabled={disabled || !input.trim()}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}