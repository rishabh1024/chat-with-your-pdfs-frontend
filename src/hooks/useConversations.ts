import { createConversation, deleteConversation, listConversations } from "@/api/conversation";
import { ApiError, toApiError } from "@/lib/apiError";
import type { Conversation } from "@/types/conversation";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export function useConversations(){

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setisDeleting] = useState(false)

  const loadConversations = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await listConversations({signal})
      setConversations(data.conversations)
    }
    catch (caught) {
      if (axios.isCancel(caught)) return
      setError(toApiError(caught))
    } finally {
      if (!signal?.aborted){
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {

    const controller = new AbortController()
    void loadConversations(controller.signal)

    return () => {
      controller.abort()
    }
  }, [loadConversations])

  async function create() {

    setIsCreating(true)
    setError(null)

    try {
      const conversation = await createConversation()
      setConversations((current) => [conversation, ...current])
      return conversation
    } catch (caught) {
      const apiError = toApiError(caught)
      setError(apiError)
      throw apiError
    } finally {
      setIsCreating(false)
    }
  }

  async function remove(conversationId: string){

    setisDeleting(true)
    setError(null)

    try {
      await deleteConversation(conversationId)
      setConversations((current) =>
        current.filter((conversation) => conversation.id !== conversationId),
      )
    } catch (caught) {
      const apiError = toApiError(caught)
      setError(apiError)
      throw apiError
    } finally {
      setisDeleting(false)
    }
  }

  return {
    conversations,
    isLoading,
    error,
    isCreating,
    isDeleting,
    reload: () => loadConversations(),
    create,
    remove
  }
}