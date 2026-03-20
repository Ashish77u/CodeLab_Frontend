// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'

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
          }}>CL</div>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 15, color: '#e6edf3',
          }}>
            TRY CODE LAB. NO
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 24 }}>
          {['home', 'project', 'contact', 'Signin'].map(item => (
            <Link key={item}
              to={item === 'home' ? '/' : item === 'Signin' ? '/login' : `/${item}`}
              style={{
                color: '#7d8590', textDecoration: 'none',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => e.target.style.color = '#e6edf3'}
              onMouseLeave={e => e.target.style.color = '#7d8590'}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Social icons */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px 32px',
        display: 'flex', gap: 16,
      }}>
        {[
          { icon: '📷', label: 'Instagram' },
          { icon: '👤', label: 'Facebook' },
          { icon: '💬', label: 'Discord' },
          { icon: '🐦', label: 'Twitter' },
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
          color: 'rgba(255,255,255,0.03)',
          letterSpacing: -4,
          userSelect: 'none',
          display: 'block',
        }}>
          CODELAB.
        </span>
      </div>

    </footer>
  )
}