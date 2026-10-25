export type AuthMode = 'login' | 'signup'

export type AuthenticationFormData = {
  name?: string
  email: string
  password: string
}