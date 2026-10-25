import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { AuthenticationPage } from '@/pages/AuthPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ChatInterface } from './components/ChatInterface'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GuestRoute } from './components/GuestRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      >
        <Route index element={<ChatInterface />} />
        <Route path="conversation/:conversationId" element={<ChatInterface />} />
      </Route>
      <Route path="/auth" element={
        <GuestRoute>
          <AuthenticationPage />
        </GuestRoute>
        }
        />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}
export default App
