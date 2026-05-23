// src/pages/ProjectDetailPage.jsx
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { projectApi } from '../api/projectApi'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown';


const CodePreview = () => (
  <div style={{
    background: '#0d1117',
    borderRadius: 8,
    padding: '20px 24px',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 1.8,
  }}>
    <div>
      <span style={{ color: '#4ec9b0' }}>Life </span>
      <span style={{ color: '#9cdcfe' }}>myLife</span>
      <span style={{ color: '#d4d4d4' }}> = </span>
      <span style={{ color: '#c586c0' }}>new </span>
      <span style={{ color: '#4ec9b0' }}>Life()</span>
      <span style={{ color: '#d4d4d4' }}>;</span>
    </div>
    <div>
      <span style={{ color: '#9cdcfe' }}>myLife</span>
      <span style={{ color: '#d4d4d4' }}>.startLife();</span>
    </div>
    <div>
      <span style={{ color: '#c586c0' }}>while</span>
      <span style={{ color: '#d4d4d4' }}>( </span>
      <span style={{ color: '#9cdcfe' }}>myLife</span>
      <span style={{ color: '#d4d4d4' }}>.makeSuccess() )</span>
      <span style={{ color: '#d4d4d4' }}>{' {'}</span>
    </div>
    <div style={{ paddingLeft: 20 }}>
      <span style={{ color: '#9cdcfe' }}>myLife</span>
      <span style={{ color: '#d4d4d4' }}>.tryAgain();</span>
    </div>
    <div style={{ paddingLeft: 20 }}>
      <span style={{ color: '#c586c0' }}>if </span>
      <span style={{ color: '#d4d4d4' }}>(</span>
      <span style={{ color: '#9cdcfe' }}>myLife</span>
      <span style={{ color: '#d4d4d4' }}>.death())</span>
      <span style={{ color: '#d4d4d4' }}>{'{ '}</span>
      <span style={{ color: '#c586c0' }}>break</span>
      <span style={{ color: '#d4d4d4' }}>; </span>
    </div>
    <div><span style={{ color: '#d4d4d4' }}>{'}'}</span></div>
  </div>
)

// Fake responses for UI (backend integration later)
const MOCK_RESPONSES = [
  { id: 1, username: 'Shubham Yadav', avatar: '🧑', text: '', isInput: true },
  { id: 2, username: 'luci', avatar: '👩', text: 'I hope you get well soon!' },
  { id: 3, username: 'Steve Yegge', avatar: '👨', text: 'I hope you get well soon!' },
  { id: 4, username: 'NorthernDev', avatar: '🧑‍💻', text: 'I hope you get well soon!' },
]

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [downloading, setDownloading] = useState(false)
  const [responseText, setResponseText] = useState('')
  const baseUrl = import.meta.env.VITE_BASE_URL

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.getById(id),
  })

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to download')
      navigate('/login')
      return
    }
    setDownloading(true)
    try {
      await projectApi.download(project.id, project.zipFileName)
      toast.success('Download started!')
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  if (isLoading) return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', minHeight: '60vh',
      background: '#0d1117',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '2px solid #21262d',
        borderTop: '2px solid #00ff88',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  if (isError || !project) return (
    <div style={{
      textAlign: 'center', color: '#f85149',
      padding: 80, background: '#0d1117',
      minHeight: '60vh',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      Project not found
    </div>
  )

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '32px 24px',
        display: 'flex', gap: 24,
        alignItems: 'flex-start',
      }}>

        {/* ── LEFT SIDEBAR — User Profile ── */}
        <div style={{
          width: 200, flexShrink: 0,
          position: 'sticky', top: 80,
        }}>
          {/* Avatar */}
          <div style={{ marginBottom: 12 }}>
            {project.uploaderProfileImageUrl ? (
              <img
                src={user.profileImageUrl.startsWith('http')
                      ? user.profileImageUrl
                      : `${import.meta.env.VITE_BASE_URL}${user.profileImageUrl}`}
                alt={project.uploaderUsername}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #30363d',
                }}
              />
            ) : (
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg,#00ff88,#00ccff)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20, fontWeight: 800, color: '#000',
              }}>
                {project.uploaderUsername?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          <Link
            to={`/profile/${project.uploaderUsername}`}
            style={{ textDecoration: 'none' }}
          >
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 15, fontWeight: 700,
              color: '#e6edf3', marginBottom: 8,
            }}>
              {project.uploaderRealName || project.uploaderUsername}
            </h3>
          </Link>

          {/* Bio */}
          <p style={{
            fontSize: 12, color: '#7d8590',
            lineHeight: 1.6, marginBottom: 16,
            fontFamily: 'DM Sans, sans-serif',
          }}>
            {project.uploaderBio || 'No bio available.'}
          </p>

          {/* Meta */}
          {[
            //  { icon: '📍', label: 'LOCATION',  value: profile.location  },
            // { icon: '🎓', label: 'EDUCATION', value: profile.education },
            // { icon: '💼', label: 'WORK',      value: profile.work      },
            // { icon: '📅', label: 'JOINED',    value: profile.joinedDate
            { icon: '📍' ,label: 'LOCATION', value: project.uploaderLocation || 'Not set' },
            { icon: '🎓' ,label: 'EDUCATION', value: project.uploaderEducation || 'Not set' },
            { icon: '💼' ,label: 'WORK', value: project.uploaderWork || 'Not set' },
            {
              icon:'📅', label: 'JOINED', value: project.uploaderJoinedDate
                ? new Date(project.uploaderJoinedDate).toLocaleDateString('en-US', {
                  month: 'short', day: '2-digit', year: 'numeric'
                })
                : 'Unknown'
            },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 9, color: '#7d8590',
                letterSpacing: 1.5, marginBottom: 3,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 12, color: '#e6edf3',
                fontFamily: 'DM Sans, sans-serif',
                lineHeight: 1.5,
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Code preview or cover image */}
          <div style={{
            borderRadius: 12, overflow: 'hidden',
            border: '1px solid #21262d', marginBottom: 24,
          }}>
            {project.coverImageUrl ? (
              <img
                // src={`${baseUrl}${project.coverImageUrl}`
                src={project.coverImageUrl.startsWith('http')
                ? project.coverImageUrl                    // ← Cloudinary URL, use as-is
                : `${baseUrl}${project.coverImageUrl}`     // ← old local URL, add baseUrl
              
              }
                alt={project.title}
                style={{ width: '100%', maxHeight: 240, objectFit: 'cover' }}
              />
            ) : (
              <CodePreview />
            )}
          </div>

          {/* Author row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg,#00ff88,#00ccff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0,
            }}>
              {project.uploaderUsername?.[0]?.toUpperCase()}
            </div>
            <div>


              <Link
                to={`/profile/${project.uploaderUsername}`}
                style={{ textDecoration: 'none' }}
              >
                <h3 style={{
                  fontSize: 13, fontWeight: 600,
                color: '#e6edf3', fontFamily: 'DM Sans, sans-serif',
                }}>
                  {project.uploaderRealName || project.uploaderUsername}
                </h3>
              </Link>


              {/* <div style={{
                fontSize: 13, fontWeight: 600,
                color: '#e6edf3', fontFamily: 'DM Sans, sans-serif',
              }}>
                {project.uploaderRealName || project.uploaderUsername}
              </div> */}
              <div style={{ fontSize: 11, color: '#7d8590', fontFamily: 'DM Sans, sans-serif' }}>
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: '2-digit', year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 24, fontWeight: 800,
            color: '#e6edf3', marginBottom: 12,
            lineHeight: 1.3,
          }}>
            {project.title}
          </h1>

          {/* Tags */}
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
          }}>
            {project.tags?.map(tag => (
              <span key={tag} style={{
                fontSize: 12, color: '#7d8590',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Description / About */}
          {/* <div style={{
            fontSize: 14, color: '#7d8590',
            lineHeight: 1.85, marginBottom: 28,
            fontFamily: 'DM Sans, sans-serif',
            whiteSpace: 'pre-line',   
            wordBreak: 'break-word'  

              
          }}>
            {project.about || project.description}
          </div> */}

  
                    
          {/* Description / About */}
          <div style={{
            fontSize: 14, 
            color: '#7d8590',
            lineHeight: 1.85, 
            marginBottom: 28,
            fontFamily: 'DM Sans, sans-serif',
            wordBreak: 'break-word'
          }}>
            <ReactMarkdown 
              components={{
                // Custom styling for elements parsed inside the Markdown text
                p: ({...props}) => <p style={{ margin: '0 0 16px 0', whiteSpace: 'pre-line' }} {...props} />,
                h1: ({...props}) => <h1 style={{ color: '#e6edf3', fontSize: '20px', margin: '20px 0 10px 0' }} {...props} />,
                h2: ({...props}) => <h2 style={{ color: '#e6edf3', fontSize: '18px', margin: '16px 0 8px 0' }} {...props} />,
                ul: ({...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '16px' }} {...props} />,
                li: ({...props}) => <li style={{ marginBottom: '4px' }} {...props} />,
                code: ({inline, ...props}) => (
                  <code style={{ 
                    background: '#21262d', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontFamily: 'monospace', 
                    color: '#ff79c6' 
                  }} {...props} />
                )
              }}
            >
              {project.about || project.description}
            </ReactMarkdown>
          </div>


          {/* Download section */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 10, padding: '20px 24px',
            marginBottom: 40,
          }}>
            <p style={{
              fontSize: 14, color: '#e6edf3',
              marginBottom: 16, fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
            }}>
              Download <strong>{project.title}</strong> : click the button below
            </p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                padding: '10px 28px',
                background: downloading ? '#21262d' : '#00ff88',
                border: 'none', borderRadius: 8,
                color: downloading ? '#7d8590' : '#0d1117',
                fontSize: 14, fontWeight: 700,
                cursor: downloading ? 'default' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {downloading ? 'Downloading...' : 'Download'}
            </button>
            <div style={{
              marginTop: 10, fontSize: 12, color: '#7d8590',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              ↓ {project.downloadCount} downloads
            </div>
          </div>

          {/* ── RESPONSES SECTION ── */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 18, fontWeight: 700,
              color: '#e6edf3', marginBottom: 24,
            }}>
              Responses (5)
              <span style={{
                fontSize: 12, color: '#7d8590',
                fontWeight: 400, marginLeft: 8,
                fontFamily: 'DM Sans, sans-serif',
              }}>
                — coming soon
              </span>
            </h2>

            {/* Response input */}
            {isAuthenticated && (
              <div style={{
                background: '#161b22',
                border: '1px solid #21262d',
                borderRadius: 10, padding: 16,
                marginBottom: 20,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, marginBottom: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#00ff88,#00ccff)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#000',
                  }}>
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: 13, color: '#e6edf3',
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                  }}>
                    {user?.username}
                  </span>
                </div>
                <textarea
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  placeholder="What are your thoughts ?"
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: '#0d1117',
                    border: '1px solid #21262d',
                    borderRadius: 8, color: '#e6edf3',
                    fontSize: 13, resize: 'vertical',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                  }}
                />
                <div style={{
                  display: 'flex', justifyContent: 'flex-end',
                  gap: 8, marginTop: 10,
                }}>
                  <button
                    onClick={() => setResponseText('')}
                    style={{
                      padding: '6px 16px',
                      background: 'transparent',
                      border: '1px solid #30363d',
                      borderRadius: 6, color: '#7d8590',
                      fontSize: 12, cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => toast('Responses feature coming soon!')}
                    style={{
                      padding: '6px 16px',
                      background: '#00ff88',
                      border: 'none', borderRadius: 6,
                      color: '#0d1117', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                    Respond
                  </button>
                </div>
              </div>
            )}

            {/* Mock responses */}
            {[
              { username: 'luci', text: 'I hope you get well soon!' },
              { username: 'Steve Yegge', text: 'I hope you get well soon!' },
              { username: 'NorthernDev', text: 'I hope you get well soon!' },
            ].map((resp, i) => (
              <div key={i} style={{
                background: '#161b22',
                border: '1px solid #21262d',
                borderRadius: 10, padding: 16,
                marginBottom: 12,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 8, marginBottom: 8,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `hsl(${i * 60 + 120}, 60%, 50%)`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>
                    {resp.username[0].toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: 13, color: '#e6edf3',
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                  }}>
                    {resp.username}
                  </span>
                </div>
                <p style={{
                  fontSize: 13, color: '#7d8590',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.6, margin: 0,
                }}>
                  {resp.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 16, padding: '40px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24, flexWrap: 'wrap',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 22, fontWeight: 800,
                color: '#e6edf3', marginBottom: 8,
              }}>
                Ready to upload your code?
              </h2>
              <p style={{
                color: '#7d8590', fontSize: 13,
                lineHeight: 1.7, marginBottom: 20,
                fontFamily: 'DM Sans, sans-serif',
                maxWidth: 280,
              }}>
                Join thousands of developers earning passive income from their source code.
              </p>
              <button
                onClick={() => navigate(isAuthenticated ? '/upload' : '/register')}
                style={{
                  padding: '10px 22px',
                  background: '#00ff88', border: 'none',
                  borderRadius: 8, color: '#0d1117',
                  fontWeight: 700, fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                Get Started
              </button>
            </div>
            <div style={{
              fontSize: 64, flexShrink: 0,
            }}>
              👨‍💻
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



 