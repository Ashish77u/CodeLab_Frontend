import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  email:    z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

// CORRECT — directly triggers Google OAuth2 flow
const handleGoogleLogin = () => {
  // window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  window.location.href = `${import.meta.env.VITE_BASE_URL}/oauth2/authorization/google`
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login    = useAuthStore(s => s.login)
  const from     = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken)
      toast.success(`Welcome back, ${data.user.username}!`)
      navigate(from, { replace: true })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  })

  const inputStyle = (hasError) => ({
    width: '100%', padding: '10px 14px',
    background: '#111120',
    border: `1px solid ${hasError ? '#ff4444' : '#2a2a3a'}`,
    borderRadius: 8, color: '#e8e8f0', fontSize: 14,
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
  })

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#0d0d1a', border: '1px solid #1a1a2e',
        borderRadius: 16, padding: 40,
      }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 28,
          fontWeight: 800, marginBottom: 8, color: '#e8e8f0'
        }}>Welcome back</h1>
        <p style={{ color: '#444', fontSize: 14, marginBottom: 32 }}>
          Sign in with your email, username, or Google
        </p>

        {/* Google Button */}
        <button onClick={handleGoogleLogin} style={{
          width: '100%', padding: '11px 14px',
          background: '#fff', border: '1px solid #ddd',
          borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10,
          fontSize: 14, fontWeight: 600,
          fontFamily: 'DM Sans, sans-serif',
          marginBottom: 20, color: '#333',
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 12, marginBottom: 20,
        }}>
          <div style={{ flex: 1, height: 1, background: '#1a1a2e' }} />
          <span style={{ color: '#333', fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#1a1a2e' }} />
        </div>

        {/* Email/Username Form */}
        <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 13,
              color: '#888', marginBottom: 6
            }}>
              Email or Username
            </label>
            <input
              {...register('email')}
              type="text"
              placeholder="luci0001 or luci0001@gmail.com"
              style={inputStyle(!!errors.email)}
            />
            {errors.email && (
              <p style={{ color: '#ff4444', fontSize: 11, marginTop: 4 }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: 'block', fontSize: 13,
              color: '#888', marginBottom: 6
            }}>
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              style={inputStyle(!!errors.password)}
            />
            {errors.password && (
              <p style={{ color: '#ff4444', fontSize: 11, marginTop: 4 }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              width: '100%', padding: 12,
              background: mutation.isPending ? '#1a1a2e' : '#00ff88',
              border: 'none', borderRadius: 8,
              color: mutation.isPending ? '#555' : '#000',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}>
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#444' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#00ff88', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}