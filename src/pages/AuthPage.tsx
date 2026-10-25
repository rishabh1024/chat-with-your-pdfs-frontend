import { useState } from "react"
import { useNavigate } from "react-router-dom"
import pdfLogo from "@/assets/logo.svg"
import type { AuthenticationFormData, AuthMode } from "@/types/auth"
import { AuthTabs } from "@/components/AuthTabs"
import { AuthenticationForm } from "@/components/AuthenticationForm"
import "@/styles/AuthPage.css"
import { supabase } from '@/lib/supabase'

export function AuthenticationPage(){

  const [mode, setMode] = useState<AuthMode>('login')
  const navigate = useNavigate()

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(data: AuthenticationFormData) {

    setIsAuthenticating(true)
    setErrorMessage(null)

    try {
      const result = 
      mode === 'signup'
      ? await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      })
      : await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

    if (result.error){
      setErrorMessage(result.error.message)
      return
    }

    if (!result.data.session){
      setErrorMessage('Authentication succeeded, but no session was created.')
      return
    }
    navigate('/')
    }

    catch {
      setErrorMessage('Something unexpedted happened. Please try again')
    }
    finally{
      setIsAuthenticating(false)
    }
    }
    

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <img src={pdfLogo} alt="" />
          <h1>
            Chat with
            <span>PDFs</span>
          </h1>
        </div>

        <p className="auth-subtitle">Sign in to continue</p>

        <AuthTabs mode={mode} onModeChange={setMode} />
        <AuthenticationForm mode={mode} onSubmit={handleSubmit} isAuthenticating = {isAuthenticating} errorMessage={errorMessage} />
      </section>
    </main>
  )
}