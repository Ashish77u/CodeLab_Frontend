// src/components/common/ErrorBoundary.jsx
import { Component } from 'react'

// Class component — React error boundaries must be class components
// Catches JS errors anywhere in the child component tree
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0f', color: '#e8e8f0',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>💥</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#666', marginBottom: 24, maxWidth: 400, textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.href = '/'
            }}
            style={{
              padding: '10px 24px',
              background: '#00ff88',
              border: 'none', borderRadius: 8,
              color: '#000', fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Go Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}