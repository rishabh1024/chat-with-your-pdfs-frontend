import axios from "axios";

export type ApiErrorType = | 'network' | 'timeout' | 'unauthorized' | 'forbidden' | 'notfound' | 'validation' | 'server' | 'unknown'

export class ApiError extends Error {
  error_type: ApiErrorType
  status?: number

  constructor(error_type: ApiErrorType, message: string, status?: number){
    super(message)
    this.name = 'ApiError'
    this.error_type = error_type
    this.status = status
  }
}

function extractValidationMessage(data: unknown): string | null {

  if (typeof data !== 'object' || data === null || !('detail' in data)) {
    return null
  }

  const detail = (data as { detail: unknown }).detail

  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) =>
        typeof item === 'object' && item !== null && 'msg' in item
          ? String((item as { msg: unknown }).msg)
          : null,
      )
      .filter((message): message is string => message !== null)
    return messages.length > 0 ? messages.join('; ') : null
  }
  return null
}
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError('timeout', 'The request took too long. Please try again.')
    }
    if (!error.response) {
      return new ApiError('network', 'Cannot reach the server. Check your connection and try again.')
    }
    const { status, data } = error.response
    if (status === 401) {
      return new ApiError('unauthorized', 'Your session has expired. Please sign in again.', status)
    }
    if (status === 403) {
      return new ApiError('forbidden', 'You do not have permission to perform this action.', status)
    }
    if (status === 404) {
      return new ApiError('notfound', 'We could not find what you were looking for.', status)
    }
    if (status === 422) {
      return new ApiError(
        'validation',
        extractValidationMessage(data) ?? 'Some of the information was invalid.',
        status,
      )
    }
    if (status >= 500) {
      return new ApiError('server', 'Something went wrong on our side. Please try again.', status)
    }
    return new ApiError('unknown', 'Something unexpected happened.', status)
  }
  return new ApiError('unknown', 'Something unexpected happened.')
}