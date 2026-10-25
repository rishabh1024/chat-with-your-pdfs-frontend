import type { AuthMode } from "@/types/auth";

type AuthTabsProps = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

export function AuthTabs({mode, onModeChange}: AuthTabsProps){
  return (
    <div className="auth-tabs">
      <button
      type='button'
      className={mode === "login" ? 'active' : ''}
      aria-pressed={mode === 'login'}
      onClick={() => onModeChange('login')}>
        Login
      </button>

      <button
      type="button"
      className={mode == 'signup' ? 'active' : ''}
      aria-pressed={mode == 'signup'}
      onClick={() => onModeChange('signup')}>
        Sign Up
      </button>
    </div>
  )
}