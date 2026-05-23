import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import SplashLoader from './components/animations/SlpatLoadder'

import LandingPage       from './pages/LandingPage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProfilePage       from './pages/ProfilePage'
import UploadProjectPage from './pages/UploadProjectPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'

import ContactPage from './pages/ContactPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

import VerificationBanner from './components/VerificationBanner'



function App() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // 3 seconds

    return () => clearTimeout(timer)

  }, [])

  if (loading) {
    return <SplashLoader />
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column', background: '#0a0a0f'
    }}>
      <Navbar />
          <VerificationBanner />   {/* ← add here */}


      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />





          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadProjectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400
              }}>
                <p style={{
                  color: '#555',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 24
                }}>
                  404 — Page not found
                </p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App