import { useAuthStore } from '../store/authStore'

export default function VerificationBanner() {
  const { user, isAuthenticated } = useAuthStore()

  // Only show if logged in and email not verified
  if (!isAuthenticated || !user) return null
  if (user.emailVerified) return null

  return (
    <div style={{
      background: 'rgba(255, 165, 0, 0.1)',
      border: '1px solid rgba(255, 165, 0, 0.3)',
      padding: '10px 24px',
      textAlign: 'center',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: 13,
      color: '#ffa500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}>
      <span>⚠️</span>
      <span>
        Please verify your email address.
        Check your inbox for the verification link.
        Your account will be deactivated in 24 hours if not verified.
      </span>
    </div>
  )
}