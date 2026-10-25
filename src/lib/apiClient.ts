import axios from 'axios'
import { supabase } from '@/lib/supabase'
import { toApiError } from '@/lib/apiError'
import { logError } from '@/lib/logger'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
})

apiClient.interceptors.request.use(async (config) => {

  const { data } = await supabase.auth.getSession()
  const accessToken = data.session?.access_token

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

let isSigningOut = false

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)){
      return Promise.reject(error)
    }

  const apiError = toApiError(error)

  if (apiError.error_type === 'unauthorized' && !isSigningOut) {
    isSigningOut = true
    supabase.auth
    .signOut()
    .catch((signOutError) => logError('auto_sign_out_failed', signOutError))
    .finally(() => {
      isSigningOut = false
    })
  }

  logError('api_request_failed', apiError)
  return Promise.reject(apiError)
  },
)
