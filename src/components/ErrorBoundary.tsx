import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { logError } from '@/lib/logger'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError('render_crash', { error, info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="home-page">
          <p role="alert">Something went wrong while showing this page.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
