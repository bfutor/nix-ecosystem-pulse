import { StrictMode, Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

interface EBProps { children: ReactNode }
interface EBState { error: Error | null }

class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Dashboard crashed:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: '#e6edf3', fontFamily: 'monospace', background: '#0d1117', minHeight: '100vh' }}>
          <h1 style={{ color: '#f85149', fontSize: 24 }}>Dashboard Error</h1>
          <pre style={{ marginTop: 16, whiteSpace: 'pre-wrap', color: '#8b949e' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', color: '#6e7681', fontSize: 12 }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
