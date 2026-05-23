// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer style={{
      background: '#0d1117',
      borderTop: '1px solid #21262d',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Top footer */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '40px 24px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        {/* Logo + tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: '#00ff88',
            borderRadius: 6, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#0d1117',
            fontFamily: 'Syne, sans-serif',
          }}>CL <span style={{color: 'red'}}>.</span></div>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 15, color: '#e6edf3',
          }}>
            TRY CODELAB<span style={{color:'red'}}>.</span> NO
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 24 }}>
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


  {/* Login — goes to contact page */}
  <Link to="/login" style={{ color: '#7d8590', fontSize: 14, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
    Login
  </Link>

</nav>
        </div>
      </div>

      {/* Social icons */}


      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px 32px',
        display: 'flex', gap: 16,
      }}>
        {[
  { icon: <FaGithub size={16} />, url: 'https://github.com/YOUR_USERNAME' },
  { icon: <FaLinkedin size={16} />, url: 'https://linkedin.com' },
  { icon: <FaTwitter size={16} />, url: 'https://twitter.com' },
  { icon: <FaInstagram size={16} />, url: 'https://instagram.com' },
].map(social => (
          <button key={social.label} style={{
            width: 36, height: 36,
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 8,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16, cursor: 'pointer',
          }} title={social.label}>
            {social.icon}
          </button>
        ))}
      </div>

      {/* CODELAB watermark */}
      <div style={{
        textAlign: 'center',
        padding: '0 0 0',
        overflow: 'hidden',
        lineHeight: 0.85,
      }}>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(60px, 15vw, 160px)',
          fontWeight: 800,
          color: 'transparent',
          backgroundImage: 'linear-gradient(4deg, rgba(12, 14, 18, 1) 15%, rgba(123, 137, 157, 1) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          letterSpacing: -4,
          userSelect: 'none',
          display: 'block',
        }}>
          CODELAB<span style={{color: 'red', opacity: 0.1}}>.</span>
        </span>
      </div>

    </footer>
  )
}