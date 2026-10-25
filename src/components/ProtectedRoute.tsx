import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoadingSession } = useAuth()

  if (isLoadingSession) {
    return <p>Checking your session...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}