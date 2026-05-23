import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

// ── Replace these with your real EmailJS credentials ──
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
  if (!emailRegex.test(form.email)) {
   setStatus('error')
   return
}

    setStatus('loading')

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject || 'No Subject',
          message: form.message,
          reply_to: form.email,
        },
        EMAILJS_PUBLIC_KEY
      )

      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })

    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 8, color: '#e6edf3',
    fontSize: 13, outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: 12, color: '#7d8590',
    fontFamily: 'DM Sans, sans-serif',
    display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>

      {/* Header */}
      <div style={{
        padding: '64px 24px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}/>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,255,136,0.08)',
          border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: 20, padding: '5px 16px',
          fontSize: 12, color: '#7ee8a2',
          marginBottom: 20,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 6px #00ff88',
            display: 'inline-block',
          }}/>
          Get in touch
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 800, color: '#e6edf3',
          marginBottom: 16, letterSpacing: -1,
        }}>
          Contact Us
        </h1>
        <p style={{
          color: '#7d8590', fontSize: 16,
          maxWidth: 480, margin: '0 auto',
          lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif',
        }}>
          Have a question, suggestion, or want to collaborate?
          We would love to hear from you.
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 32,
      }}>

        {/* Left — Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 12, padding: 24,
          }}>
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 18, fontWeight: 700,
              color: '#e6edf3', marginBottom: 20,
            }}>
              Contact Information
            </h3>

            {[
              { icon: '📧', label: 'Email', value: 'ashishs77@gmail.com' },
              { icon: '📍', label: 'Location', value: 'Thane, Mumbai, India' },
              { icon: '⏰', label: 'Response Time', value: 'Within 24 hours' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'flex-start',
                gap: 14, marginBottom: 20,
              }}>
                <div style={{
                  width: 40, height: 40,
                  background: 'rgba(0,255,136,0.08)',
                  border: '1px solid rgba(0,255,136,0.15)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18,
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#7d8590', fontFamily: 'DM Sans, sans-serif', marginBottom: 2 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 14, color: '#e6edf3', fontFamily: 'DM Sans, sans-serif' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          {/* <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 12, padding: 24,
            }}>
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 18, fontWeight: 700,
              color: '#e6edf3', marginBottom: 16,
            }}>
              Follow Us
            </h3>
            {[
              { icon: <FaGithub size={18} />, label: 'GitHub', url: 'https://github.com/YOUR_USERNAME', color: '#e6edf3' },
              { icon: <FaLinkedin size={18} />, label: 'LinkedIn', url: 'https://linkedin.com/in/ashish-sahani1', color: '#0A66C2' },
              { icon: <FaTwitter size={18} />, label: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
              { icon: <FaInstagram size={18} />, label: 'Instagram', url: 'https://instagram.com', color: '#E1306C' },
            ].map(item => (
              
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: 12, padding: '10px 0',
                  borderBottom: '1px solid #21262d',
                  textDecoration: 'none',
                  color: '#7d8590',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = item.color}
                onMouseLeave={e => e.currentTarget.style.color = '#7d8590'}
              >
                <span style={{ color: 'inherit' }}>{item.icon}</span>
                <span>{item.label}</span>
                <span style={{ marginLeft: 'auto' }}>→</span>
              </a>
            ))}
          </div> */}
        </div>

        {/* Right — Contact Form */}
         <div style={{
          background: '#161b22',
          border: '1px solid #21262d',
          borderRadius: 12, padding: 28,
        }}>
          <h3 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 18, fontWeight: 700,
            color: '#e6edf3', marginBottom: 24,
          }}>
            Send a Message
          </h3>

          {/* Success State */}
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h4 style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 20, color: '#00ff88', marginBottom: 8,
              }}>
                Message Sent!
              </h4>
              <p style={{
                color: '#7d8590', fontSize: 14,
                fontFamily: 'DM Sans, sans-serif', marginBottom: 24,
              }}>
                Thank you for reaching out. We will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(0,255,136,0.1)',
                  border: '1px solid rgba(0,255,136,0.3)',
                  borderRadius: 8, color: '#00ff88',
                  cursor: 'pointer', fontSize: 14,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form
            onSubmit={handleSubmit}
             style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Error message */}
              {status === 'error' && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(248,81,73,0.1)',
                  border: '1px solid rgba(248,81,73,0.3)',
                  borderRadius: 8, color: '#f85149',
                  fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                }}>
                  ❌ Failed to send message. Please try again or email us directly.
                </div>
              )}

              {/* Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@gmail.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !form.name || !form.email || !form.message}
                style={{
                  padding: '12px 24px',
                  background: form.name && form.email && form.message && status !== 'loading'
                    ? '#00ff88' : '#21262d',
                  border: 'none', borderRadius: 8,
                  color: form.name && form.email && form.message && status !== 'loading'
                    ? '#0d1117' : '#7d8590',
                  fontWeight: 700, fontSize: 14,
                  cursor: form.name && form.email && form.message && status !== 'loading'
                    ? 'pointer' : 'not-allowed',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                }}
              >
                {status === 'loading' ? (
                  <>
                    <div style={{
                      width: 16, height: 16,
                      border: '2px solid #0d1117',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}/>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    Sending...
                  </>
                ) : 'Send Message →'}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}