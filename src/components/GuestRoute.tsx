import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

type GuestRouteProps = {
  children: ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoadingSession } = useAuth()

  if (isLoadingSession) {
    return <p>Checking your session...</p>
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}