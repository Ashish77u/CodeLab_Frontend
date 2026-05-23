// src/components/layout/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchInput, setSearchInput] = useState('')

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      background: '#0d1117',
      borderBottom: '1px solid #21262d',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: 16,
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28,
            background: '#00ff88',
            borderRadius: 6,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11, fontWeight: 800,
            color: '#0d1117',
            fontFamily: 'Syne, sans-serif',
          }}>
            CL <span style={{ color: 'red' }}>.</span>
          </div>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 15,
            color: '#e6edf3',
          }}>
            CodeLab<span style={{ color: 'red' }}>.</span>
          </span>
        </div>
      </Link>


      {/* Nav links */}

      {/* // Change Project link to scroll behavior */}

<nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
  <Link to="/" style={{ color: '#7d8590', fontSize: 14, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
    Home
  </Link>

  {/* Project — scrolls to project section on landing page */}
  <Link
    onClick={() => {
      if (window.location.pathname === '/') {
        // Already on landing page — just scroll
        document.getElementById('projects-section')
          ?.scrollIntoView({ behavior: 'smooth' })
      } else {
        // On another page — go to landing page then scroll
        window.location.href = '/#projects-section'
      }
    }}
    style={{
      color: '#7d8590', fontSize: 14,
      fontFamily: 'DM Sans, sans-serif',
      cursor: 'pointer',
    }}
  >
    Projects
  </Link>

  {/* Contact — goes to contact page */}
  <Link to="/contact" style={{ color: '#7d8590', fontSize: 14, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
    Contact
  </Link>

</nav>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 320 }}>
        {/* <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)',
            color: '#7d8590', fontSize: 13,
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search template, Projects and Source code"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 8,
              color: '#e6edf3',
              fontSize: 12,
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
        </div> */}
      </form>

      {/* Right side */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 10, flexShrink: 0,
      }}>
        {isAuthenticated ? (
          <>
            {/* Upload button */}
            {/* <Link to="/upload" style={{
              padding: '6px 14px',
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.25)',
              borderRadius: 6, color: '#00ff88',
              textDecoration: 'none', fontSize: 13,
              fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
            }}>
              + Upload
            </Link> */}

            {/* Avatar */}
            <Link to={`/profile/${user?.username}`} style={{
              display: 'flex', alignItems: 'center',
              gap: 6, textDecoration: 'none',
            }}>
              {user?.profileImageUrl ? (
                <img
                  src={
                    user.profileImageUrl.startsWith('http')
                      ? user.profileImageUrl
                      : `${import.meta.env.VITE_BASE_URL}${user.profileImageUrl}`
                  }
                  alt={user.username}
                  onError={e => {
                    // If image fails to load, hide it and show initials instead
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                  style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #30363d',
                  }}
                />
              ) : (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#000',
                }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: 13, color: '#7d8590', fontFamily: 'DM Sans, sans-serif' }}>
                {user?.username}
              </span>
            </Link>

            <button onClick={handleLogout} style={{
              background: 'transparent',
              border: '1px solid #30363d',
              borderRadius: 6, color: '#7d8590',
              padding: '5px 12px', fontSize: 12,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: '#7d8590', textDecoration: 'none',
              fontSize: 13, fontFamily: 'DM Sans, sans-serif',
              padding: '6px 12px',
            }}>
              Sign In
            </Link>
            <Link to="/register" style={{
              padding: '7px 16px',
              background: '#00ff88',
              borderRadius: 6, color: '#0d1117',
              textDecoration: 'none', fontSize: 13,
              fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}







