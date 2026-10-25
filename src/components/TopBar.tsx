import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface TopBarProps {
  onOpenSidebar: () => void
}

export function TopBar({ onOpenSidebar} : TopBarProps) {

  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  async function handleSignOut() {
      
      setIsSigningOut(true)
      setSignOutError(null)
      try {
        await signOut()
      } catch (error) {
        console.error('Sign out failed:', error)
        setSignOutError('Could not log out. Please try again.')
      } finally {
        setIsSigningOut(false)
      }
    }


  return (
    <header className='top-bar'>
      <button className='top-bar-menu-button' type="button" aria-label="Open Sidebar" onClick={onOpenSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className='top-bar-brand-logo'>
        <span>Chat With Your PDFs</span>
      </div>

      <div className='top-bar-user-info'>
        <span>{user?.email}</span>
        <button
        className='logout-button'
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}>
        {isSigningOut ? 'Logging out...' : 'Logout'}
        </button>
        {signOutError && (
          <span className='top-bar-error' role="alert">{signOutError}</span>
        )}
      </div>
    </header>
  )
}