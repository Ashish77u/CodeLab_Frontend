import { useEffect, useState, useRef  } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()


  const hasVerified = useRef(false)  // Prevent double verification on re-render

  

//   useEffect(() => {
//   const token = searchParams.get('token')
//   if (!token) {
//     setStatus('error')
//     setMessage('Invalid verification link.')
//     return
//   }

//   authApi.verifyEmail(token)
//     .then(res => {
//       setStatus('success')
//       setMessage(res.message || 'Email verified successfully!')
//       setTimeout(() => navigate('/login'), 3000)
//     })
//     .catch(err => {
//       setStatus('error')
//       setMessage(
//         err.response?.data?.message ||
//         'Verification failed. Link may be expired.'
//       )
//     })
// }, [])

useEffect(() => {
  if (hasVerified.current) return
  hasVerified.current = true

  const token = searchParams.get('token')
  if (!token) {
    setStatus('error')
    setMessage('Invalid verification link.')
    return
  }

  authApi.verifyEmail(token)
    .then(res => {
      setStatus('success')
      setMessage(res.message || 'Email verified successfully!')
      setTimeout(() => navigate('/login'), 3000)
    })
    .catch(err => {
      setStatus('error')
      setMessage(
        err.response?.data?.message ||
        'Verification failed. Link may be expired.'
      )
    })
}, [])

  return (
    <div style={{
      background: '#0d1117', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#161b22',
        border: '1px solid #21262d',
        borderRadius: 12, padding: 40,
        textAlign: 'center', maxWidth: 420,
        width: '100%',
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: 48, height: 48,
              border: '3px solid #21262d',
              borderTop: '3px solid #00ff88',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px',
            }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: '#7d8590', fontFamily: 'DM Sans, sans-serif' }}>
              Verifying your email...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              color: '#00ff88', marginBottom: 8,
            }}>
              Email Verified!
            </h2>
            <p style={{
              color: '#7d8590', fontFamily: 'DM Sans, sans-serif',
              marginBottom: 20,
            }}>
              {message}
            </p>
            <p style={{ color: '#444', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
              Redirecting to login in 3 seconds...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              color: '#f85149', marginBottom: 8,
            }}>
              Verification Failed
            </h2>
            <p style={{
              color: '#7d8590', fontFamily: 'DM Sans, sans-serif',
              marginBottom: 20,
            }}>
              {message}
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 24px',
                background: '#00ff88',
                border: 'none', borderRadius: 8,
                color: '#0d1117', fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}




