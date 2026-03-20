import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { userApi } from '../api/userApi'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
 
export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
 
  useEffect(() => {
    const handleCallback = async () => {
      // Extract tokens from URL query params
      const params = new URLSearchParams(window.location.search)
      const token        = params.get('accessToken')
      const refreshToken = params.get('refreshToken')
 
      if (!token) {
        toast.error('Google login failed — no token received')
        navigate('/login')
        return
      }
 
      try {
        // Temporarily store token to make authenticated API call
        // We need to fetch user profile to get username etc.
        localStorage.setItem('temp_token', token)
 
        // Fetch own profile using the new token
        const profile = await userApi.getMyProfile()
 
        // Store in Zustand properly
        login(
          {
            id:              profile.id,
            username:        profile.username,
            email:           profile.email,
            profileImageUrl: profile.profileImageUrl,
            role:            profile.role,
          },
          token,
          refreshToken
        )
 
        // Clean up temp token
        localStorage.removeItem('temp_token')
 
        toast.success(`Welcome, \${profile.username}!`)
        navigate('/')
 
      } catch (error) {
        console.error('OAuth callback error:', error)
        localStorage.removeItem('temp_token')
        toast.error('Google login failed. Please try again.')
        navigate('/login')
      }
    }
 
    handleCallback()
  }, [])
 
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}>
      <Spinner size={40} />
      <p style={{ color: '#556', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
        Completing Google sign in...
      </p>
    </div>
  )
}