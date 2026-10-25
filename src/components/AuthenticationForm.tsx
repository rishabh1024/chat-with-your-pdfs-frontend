import type { FormEvent } from 'react'
import type { AuthenticationFormData, AuthMode } from '@/types/auth'

type AuthFormProps ={
  mode: AuthMode
  onSubmit: (data: AuthenticationFormData) => void
  isAuthenticating: boolean
  errorMessage: string | null
}

export function AuthenticationForm({mode, onSubmit, isAuthenticating, errorMessage}: AuthFormProps){
  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    await onSubmit({
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    })
  }

  const isSignUp = mode == 'signup'

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      {isSignUp && (
        <div className='form-field'>
          <label htmlFor='name'>Name</label>
          <input
          id='name'
          name='name'
          type='text'
          placeholder='Your Name'
          autoComplete='name'
          required
          />
        </div>
      )}

      <div className='form-field'>
          <label htmlFor='email'>Email</label>
          <input
          id='email'
          name='email'
          type='email'
          placeholder='Your Email ID'
          autoComplete='email'
          required
          />
      </div>

        <div className='form-field'>
          <label htmlFor='password'>Password</label>
          <input
          id='password'
          name='password'
          type='password'
          placeholder='Password'
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          required
          />
      </div>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type='submit' className='auth-submit-button' disabled={isAuthenticating}>
          {isAuthenticating ? 'Please wait while we authenticate...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
    </form>
  )
}