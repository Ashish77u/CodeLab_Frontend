///    ------------------------------ third change 
// src/pages/LandingPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { projectApi } from '../api/projectApi'
import { useAuthStore } from '../store/authStore'

// const CATEGORIES = ['All', 'Templates', 'APIs', 'Frontend', 'Backend', 'Full Apps', 'Figma']

const CodePreview = () => (
  <div style={{
    background: '#0a0a0a', borderRadius: 8,
    padding: '14px 16px', fontFamily: 'monospace',
    fontSize: 11, lineHeight: 1.7, height: 120,
    overflow: 'hidden', position: 'relative',
  }}>
    <div><span style={{ color: '#888' }}>{'life '}</span><span style={{ color: '#4ec9b0' }}>mylife</span><span style={{ color: '#888' }}>{' = new '}</span><span style={{ color: '#4ec9b0' }}>life()</span><span style={{ color: '#888' }}>;</span></div>
    <div><span style={{ color: '#4ec9b0' }}>mylife</span><span style={{ color: '#888' }}>.startLife();</span></div>
    <div><span style={{ color: '#c586c0' }}>while</span><span style={{ color: '#888' }}>{'('}</span><span style={{ color: '#4ec9b0' }}>mylife</span><span style={{ color: '#888' }}>.makeSuccess()</span><span style={{ color: '#888' }}>{')'}</span><span style={{ color: '#888' }}>{' {'}</span></div>
    <div style={{ paddingLeft: 16 }}><span style={{ color: '#4ec9b0' }}>mylife</span><span style={{ color: '#888' }}>.tryAgain();</span></div>
    <div><span style={{ color: '#888' }}>{'}'}</span></div>
    <div><span style={{ color: '#c586c0' }}>if</span><span style={{ color: '#888' }}>{'('}</span><span style={{ color: '#4ec9b0' }}>mylife</span><span style={{ color: '#888' }}>.death()</span><span style={{ color: '#888' }}>{')'}</span><span style={{ color: '#888' }}>{' {'}</span><span style={{ color: '#569cd6' }}>throws</span><span style={{ color: '#888' }}></span></div>
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
      background: 'linear-gradient(transparent, #0d1117)'
    }} />
  </div>
)

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const PAGE_SIZE = 12

  // Fetch all tags dynamically from backend
  const { data: tagsData } = useQuery({
    queryKey: ['all-tags'],
    queryFn: () => projectApi.getAllTags(),
    staleTime: 1000 * 60 * 10,
  })

  // All + dynamic tags from DB
  const CATEGORIES = ['All', ...(tagsData || [])]

  // Fetch projects — filtered by search OR active category tag
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projects', page, search, activeCategory],
    queryFn: () => {
      if (search) return projectApi.search(search, page, PAGE_SIZE)
      if (activeCategory !== 'All') return projectApi.search(activeCategory, page, PAGE_SIZE)
      return projectApi.getAll(page, PAGE_SIZE)
    },
    keepPreviousData: true,
  })

  // Real total project count for hero badge
  const totalProjects = data?.totalElements || 0

  const handleSearch = (e) => {
    e.preventDefault()
    setActiveCategory('All')
    setSearch(searchInput)
    setPage(0)
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setSearch('')
    setSearchInput('')
    setPage(0)
  }

  // Smart page numbers: 1 2 3 ... 8 9 10
  const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }
    const pages = []
    if (currentPage <= 3) {
      pages.push(0, 1, 2, 3, 4, '...', totalPages - 1)
    } else if (currentPage >= totalPages - 4) {
      pages.push(0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1)
    } else {
      pages.push(0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1)
    }
    return pages
  }

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>

      {/* ── HERO ── */}
      <div style={{
        padding: '100px 0px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          // backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
          backgroundImage: 'url(../../../public/bg-img.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.05,
          // backgroundSize: '400px 40px',
          backgroundSize: 'cover',
          pointerEvents: 'none',
        }} />

        {/* Badge with real count */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,255,136,0.08)',
          border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: 20, padding: '5px 16px',
          fontSize: 12, color: '#7ee8a2',
          marginBottom: 28, fontFamily: 'DM Sans, sans-serif',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#00ff88', display: 'inline-block',
            boxShadow: '0 0 6px #00ff88',
          }} />
          Over{' '}
          <span style={{ color: '#00ff88', fontWeight: 700 }}>
            {totalProjects > 0 ? totalProjects.toLocaleString() : '...'}
          </span>
          + source code projects available
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 800, lineHeight: 1.1,
          marginBottom: 8, color: '#e6edf3', letterSpacing: -1,
        }}>
          Premium Source Code
        </h1>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 800, lineHeight: 1.1,
          marginBottom: 24, color: '#00ff88', letterSpacing: -1,
        }}>
          Marketplace
        </h1>

        <p style={{
          color: '#7d8590', fontSize: 18,
          maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif',
        }}>
          Buy and sell production-ready code. Templates, components, full apps, and APIs — built by developers, for developers.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => document.getElementById('projects-section').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '13px 28px', background: '#00ff88',
              border: 'none', borderRadius: 8,
              color: '#0d1117', fontWeight: 700,
              fontSize: 15, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}>
            Explore Marketplace →
          </button>
          <button
            onClick={() => isAuthenticated ? navigate('/upload') : navigate('/login')}
            style={{
              padding: '13px 28px', background: 'transparent',
              border: '1px solid #30363d', borderRadius: 8,
              color: '#e6edf3', fontSize: 15, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
            }}>
            Start Selling
          </button>
        </div>
      </div>

      {/* ── PROJECTS SECTION ── */}
      <div id="projects-section" style={{
        maxWidth: 1200, margin: '0 auto', padding: '48px 24px',
      }}>

        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 28, fontWeight: 800,
          color: '#e6edf3', marginBottom: 24,
        }}>
          Projects
        </h2>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Search template, Projects and Source code"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{
              flex: 1, maxWidth: 480, padding: '9px 16px',
              background: '#161b22', border: '1px solid #30363d',
              borderRadius: 8, color: '#e6edf3', fontSize: 13,
              outline: 'none', fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <button type="submit" style={{
            padding: '9px 20px', background: '#00ff88',
            border: 'none', borderRadius: 8,
            color: '#0d1117', fontWeight: 700,
            fontSize: 13, cursor: 'pointer',
          }}>
            Search
          </button>
          {search && (
            <button type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(0) }}
              style={{
                padding: '9px 14px', background: 'transparent',
                border: '1px solid #30363d', borderRadius: 8,
                color: '#7d8590', cursor: 'pointer',
              }}>✕</button>
          )}
        </form>

        {/* Category filter tabs */}
        <div style={{
          display: 'flex', gap: 8,
          flexWrap: 'wrap', marginBottom: 24,
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '6px 16px', borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? '#00ff88' : '#30363d'}`,
                background: activeCategory === cat ? 'rgba(0,255,136,0.1)' : 'transparent',
                color: activeCategory === cat ? '#00ff88' : '#7d8590',
                fontSize: 13, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: activeCategory === cat ? 600 : 400,
                transition: 'all 0.15s',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        {data && !isLoading && data.totalElements > 0 && (
          <div style={{
            fontSize: 13, color: '#7d8590',
            fontFamily: 'DM Sans, sans-serif',
            marginBottom: 20,
          }}>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, data.totalElements)} of {data.totalElements.toLocaleString()} projects
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
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
        )}

        {/* Error */}
        {isError && (
          <div style={{
            textAlign: 'center', color: '#f85149',
            padding: 40, fontSize: 14,
            fontFamily: 'DM Sans, sans-serif',
          }}>
            Failed to load projects. Make sure backend is running on port 8080.
          </div>
        )}

        {/* Project Grid */}
        {data && !isLoading && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16, marginBottom: 40,
            }}>
              {data.content?.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Empty state */}
            {data.content?.length === 0 && (
              <div style={{
                textAlign: 'center', color: '#7d8590',
                padding: 64, fontFamily: 'DM Sans, sans-serif',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p>No projects found{search ? ` for "${search}"` : ''}</p>
              </div>
            )}

            {/* ── PAGINATION WITH PAGE NUMBERS ── */}
            {data.totalPages > 1 && (
              <div style={{ marginTop: 8 }}>
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  alignItems: 'center', gap: 6, flexWrap: 'wrap',
                }}>
                  {/* Prev */}
                  <button
                    onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo(0, 0) }}
                    disabled={page === 0}
                    style={{
                      padding: '7px 14px', borderRadius: 6,
                      border: '1px solid #30363d', background: 'transparent',
                      color: page === 0 ? '#21262d' : '#7d8590',
                      cursor: page === 0 ? 'default' : 'pointer',
                      fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    }}>
                    ← Prev
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers(page, data.totalPages).map((p, idx) => (
                    p === '...' ? (
                      <span key={`dots${idx}`} style={{
                        padding: '7px 2px', color: '#7d8590', fontSize: 13,
                      }}>···</span>
                    ) : (
                      <button key={p} onClick={() => { setPage(p); window.scrollTo(0, 0) }}
                        style={{
                          width: 36, height: 36, borderRadius: 6,
                          border: `1px solid ${page === p ? '#00ff88' : '#30363d'}`,
                          background: page === p ? 'rgba(0,255,136,0.1)' : 'transparent',
                          color: page === p ? '#00ff88' : '#7d8590',
                          cursor: 'pointer', fontSize: 13,
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: page === p ? 700 : 400,
                          transition: 'all 0.15s',
                        }}>
                        {p + 1}
                      </button>
                    )
                  ))}

                  {/* Next */}
                  <button
                    onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0) }}
                    disabled={page >= data.totalPages - 1}
                    style={{
                      padding: '7px 14px', borderRadius: 6,
                      border: '1px solid #30363d', background: 'transparent',
                      color: page >= data.totalPages - 1 ? '#21262d' : '#7d8590',
                      cursor: page >= data.totalPages - 1 ? 'default' : 'pointer',
                      fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    }}>
                    Next →
                  </button>
                </div>

                {/* Page x of y */}
                <div style={{
                  textAlign: 'center', marginTop: 10,
                  fontSize: 12, color: '#7d8590',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  Page {page + 1} of {data.totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: '#161b22', border: '1px solid #21262d',
          linerGradient: '15181E, #22272F_100%',
          borderRadius: 16, padding: '48px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: 400 }}>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 28, fontWeight: 800,
              color: '#e6edf3', marginBottom: 12,
            }}>
              Ready to sell your code?
            </h2>
            <p style={{
              color: '#7d8590', fontSize: 15,
              lineHeight: 1.7, marginBottom: 24,
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Join thousands of developers earning passive income from their source code.
            </p>
            <button
              onClick={() => isAuthenticated ? navigate('/upload') : navigate('/register')}
              style={{
                padding: '11px 24px', background: '#00ff88',
                border: 'none', borderRadius: 8,
                color: '#0d1117', fontWeight: 700,
                fontSize: 14, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}>
              Get Started
            </button>
          </div>
          <div  >

            <img style={{ width: '250px' }} src="../../public/coding-removebg-preview.png" alt="" srcset="" />

          </div>
        </div>
      </div>

    </div>
  )
}

// ── PROJECT CARD ──────────────────────────────────────────
function ProjectCard({ project }) {
  const baseUrl = import.meta.env.VITE_BASE_URL

  return (
    <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#161b22', border: '1px solid #21262d',
          borderRadius: 12, overflow: 'hidden',
          transition: 'border-color 0.2s, transform 0.2s',
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#00ff8844'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#21262d'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Cover */}
        <div style={{ height: 140, overflow: 'hidden', background: '#0d1117', flexShrink: 0 }}>
          {project.coverImageUrl ? (
            // 
            <img
              src={project.coverImageUrl.startsWith('http')
                ? project.coverImageUrl                    // ← Cloudinary URL, use as-is
                : `${baseUrl}${project.coverImageUrl}`     // ← old local URL, add baseUrl
              }
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <CodePreview />
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: 11, color: '#7d8590',
            marginBottom: 8, fontFamily: 'DM Sans, sans-serif',
          }}>
            {project.uploaderUsername} / {new Date(project.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'numeric', year: 'numeric'
            })}
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {project.tags?.slice(0, 2).map(tag => {
              const tagName = typeof tag === 'string' ? tag : tag.name
              return (
                <span key={tagName} style={{
                  padding: '2px 8px',
                  background: 'rgba(0,255,136,0.08)',
                  border: '1px solid rgba(0,255,136,0.15)',
                  borderRadius: 4, fontSize: 10, color: '#7ee8a2',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  {tagName}
                </span>
              )
            })}
          </div>

          <h3 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 14, fontWeight: 700,
            color: '#e6edf3', marginBottom: 8,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            lineHeight: 1.4,
          }}>
            {project.title}
          </h3>

          <p style={{
            fontSize: 12, color: '#7d8590', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            fontFamily: 'DM Sans, sans-serif',
            flex: 1,
          }}>
            {project.description}
          </p>

          <div style={{
            marginTop: 12, paddingTop: 10,
            borderTop: '1px solid #21262d',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <span style={{ fontSize: 11, color: '#7d8590' }}>
              ↓ {project.downloadCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}















//---------------------------------- first change
// import { useState } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { projectApi } from '../api/projectApi'
// import ProjectCard from '../components/projects/ProjectCard'
// import Spinner from '../components/common/Spinner'

// export default function LandingPage() {
//   const [page, setPage] = useState(0)
//   const [search, setSearch] = useState('')
//   const [searchInput, setSearchInput] = useState('')
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['projects', page, search],
//     queryFn: () => search
//       ? projectApi.search(search, page, 12)
//       : projectApi.getAll(page, 12),
//   })

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setSearch(searchInput)
//     setPage(0)
//   }

//   return (
//     <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

//       {/* Hero */}
//       <div style={{ textAlign: 'center', marginBottom: 56 }}>
//         <h1 style={{
//           fontFamily: 'Syne, sans-serif',
//           fontSize: 'clamp(36px, 6vw, 72px)',
//           fontWeight: 800, lineHeight: 1.1, marginBottom: 16,
//           background: 'linear-gradient(135deg, #e8e8f0, #00ff88)',
//           WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//         }}>
//           Source Code<br />Marketplace
//         </h1>
//         <p style={{ color: '#556', fontSize: 16, marginBottom: 32 }}>
//           Browse, download, and share project source code
//         </p>

//         <form onSubmit={handleSearch} style={{
//           display: 'flex', gap: 8, maxWidth: 480, margin: '0 auto'
//         }}>
//           <input
//             type="text"
//             placeholder="Search projects..."
//             value={searchInput}
//             onChange={e => setSearchInput(e.target.value)}
//             style={{
//               flex: 1, padding: '10px 16px',
//               background: '#0d0d1a', border: '1px solid #2a2a3a',
//               borderRadius: 8, color: '#e8e8f0', fontSize: 14,
//               fontFamily: 'DM Sans, sans-serif', outline: 'none',
//             }}
//           />
//           <button type="submit" style={{
//             padding: '10px 20px', background: '#00ff88',
//             border: 'none', borderRadius: 8, color: '#000',
//             fontWeight: 700, fontSize: 14, cursor: 'pointer',
//             fontFamily: 'DM Sans, sans-serif',
//           }}>
//             Search
//           </button>
//           {search && (
//             <button type="button"
//               onClick={() => { setSearch(''); setSearchInput('') }}
//               style={{
//                 padding: '10px 14px', background: 'transparent',
//                 border: '1px solid #2a2a3a', borderRadius: 8,
//                 color: '#555', cursor: 'pointer',
//               }}>✕</button>
//           )}
//         </form>
//       </div>

//       {isLoading && (
//         <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
//           <Spinner size={40} />
//         </div>
//       )}

//       {isError && (
//         <div style={{ textAlign: 'center', color: '#ff4444', padding: 40 }}>
//           Failed to load projects. Make sure your backend is running on port 8080.
//         </div>
//       )}

//       {data && (
//         <>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//             gap: 20, marginBottom: 40,
//           }}>
//             {data.content?.map(project => (
//               <ProjectCard key={project.id} project={project} />
//             ))}
//           </div>

//           {data.content?.length === 0 && (
//             <div style={{ textAlign: 'center', color: '#333', padding: 64 }}>
//               <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
//               <p>No projects found{search ? ` for "${search}"` : ''}</p>
//             </div>
//           )}

//           {data.totalPages > 1 && (
//             <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
//               <button onClick={() => setPage(p => Math.max(0, p - 1))}
//                 disabled={page === 0} style={{
//                   padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
//                   border: '1px solid #2a2a3a', background: 'transparent',
//                   color: page === 0 ? '#333' : '#888',
//                 }}>← Prev</button>
//               <span style={{ padding: '8px 16px', color: '#555', fontSize: 13 }}>
//                 {page + 1} / {data.totalPages}
//               </span>
//               <button onClick={() => setPage(p => p + 1)}
//                 disabled={page >= data.totalPages - 1} style={{
//                   padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
//                   border: '1px solid #2a2a3a', background: 'transparent',
//                   color: page >= data.totalPages - 1 ? '#333' : '#888',
//                 }}>Next →</button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }


//---------------------------------------- second change
// src/pages/LandingPage.jsx
// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { projectApi } from '../api/projectApi'
// import { useAuthStore } from '../store/authStore'

// const CATEGORIES = ['All', 'Templates', 'APIs', 'Frontend', 'Backend', 'Full Apps', 'Figma']

// const CodePreview = () => (
//   <div style={{
//     background: '#0a0a0a',
//     borderRadius: 8,
//     padding: '14px 16px',
//     fontFamily: 'monospace',
//     fontSize: 11,
//     lineHeight: 1.7,
//     height: 120,
//     overflow: 'hidden',
//     position: 'relative',
//   }}>
//     <div><span style={{color:'#888'}}>{'life '}</span><span style={{color:'#4ec9b0'}}>mylife</span><span style={{color:'#888'}}>{' = new '}</span><span style={{color:'#4ec9b0'}}>life()</span><span style={{color:'#888'}}>;</span></div>
//     <div><span style={{color:'#4ec9b0'}}>mylife</span><span style={{color:'#888'}}>.startLife();</span></div>
//     <div><span style={{color:'#c586c0'}}>while</span><span style={{color:'#888'}}>{'('}</span><span style={{color:'#4ec9b0'}}>mylife</span><span style={{color:'#888'}}>.makeSuccess()</span><span style={{color:'#888'}}>{')'}</span><span style={{color:'#888'}}>{' {'}</span></div>
//     <div style={{paddingLeft:16}}><span style={{color:'#4ec9b0'}}>mylife</span><span style={{color:'#888'}}>.tryAgain();</span></div>
//     <div><span style={{color:'#888'}}>{'}'}</span></div>
//     <div><span style={{color:'#c586c0'}}>if</span><span style={{color:'#888'}}>{'('}</span><span style={{color:'#4ec9b0'}}>mylife</span><span style={{color:'#888'}}>.death()</span><span style={{color:'#888'}}>{')'}</span><span style={{color:'#888'}}>{' {'}</span><span style={{color:'#569cd6'}}>throws</span><span style={{color:'#888'}}></span></div>
//     <div style={{
//       position:'absolute', bottom:0, left:0, right:0, height:40,
//       background:'linear-gradient(transparent, #0d1117)'
//     }}/>
//   </div>
// )

// export default function LandingPage() {
//   const [activeCategory, setActiveCategory] = useState('All')
//   const [searchInput, setSearchInput] = useState('')
//   const [search, setSearch] = useState('')
//   const [page, setPage] = useState(0)
//   const { isAuthenticated } = useAuthStore()
//   const navigate = useNavigate()

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['projects', page, search, activeCategory],
//     queryFn: () => search
//       ? projectApi.search(search, page, 10)
//       : projectApi.getAll(page, 10),
//   })

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setSearch(searchInput)
//     setPage(0)
//   }

//   return (
//     <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>

//       {/* ── HERO ─────────────────────────────────────────── */}
//       <div style={{
//         background: 'linear-gradient(180deg, #0d1117 0%, #0d1117 60%, #0d1117 100%)',
//         padding: '80px 24px 64px',
//         textAlign: 'center',
//         position: 'relative',
//         overflow: 'hidden',
//       }}>
//         {/* Background grid */}
//         <div style={{
//           position: 'absolute', inset: 0,
//           backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
//           backgroundSize: '40px 40px',
//           pointerEvents: 'none',
//         }}/>

//         {/* Badge */}
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 8,
//           background: 'rgba(0,255,136,0.08)',
//           border: '1px solid rgba(0,255,136,0.2)',
//           borderRadius: 20, padding: '5px 16px',
//           fontSize: 12, color: '#7ee8a2',
//           marginBottom: 28, fontFamily: 'DM Sans, sans-serif',
//         }}>
//           <span style={{
//             width: 6, height: 6, borderRadius: '50%',
//             background: '#00ff88', display: 'inline-block',
//             boxShadow: '0 0 6px #00ff88',
//           }}/>
//           Over 500+ source code projects available
//         </div>

//         {/* Heading */}
//         <h1 style={{
//           fontFamily: 'Syne, sans-serif',
//           fontSize: 'clamp(40px, 7vw, 80px)',
//           fontWeight: 800,
//           lineHeight: 1.1,
//           marginBottom: 8,
//           color: '#e6edf3',
//           letterSpacing: -1,
//         }}>
//           Premium Source Code
//         </h1>
//         <h1 style={{
//           fontFamily: 'Syne, sans-serif',
//           fontSize: 'clamp(40px, 7vw, 80px)',
//           fontWeight: 800,
//           lineHeight: 1.1,
//           marginBottom: 24,
//           color: '#00ff88',
//           letterSpacing: -1,
//         }}>
//           Marketplace
//         </h1>

//         <p style={{
//           color: '#7d8590',
//           fontSize: 18,
//           maxWidth: 520,
//           margin: '0 auto 40px',
//           lineHeight: 1.7,
//           fontFamily: 'DM Sans, sans-serif',
//         }}>
//           Buy and sell production-ready code. Templates, components, full apps, and APIs — built by developers, for developers.
//         </p>

//         {/* CTA Buttons */}
//         <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
//           <button
//             onClick={() => document.getElementById('projects-section').scrollIntoView({ behavior: 'smooth' })}
//             style={{
//               padding: '13px 28px',
//               background: '#00ff88',
//               border: 'none', borderRadius: 8,
//               color: '#0d1117', fontWeight: 700,
//               fontSize: 15, cursor: 'pointer',
//               fontFamily: 'DM Sans, sans-serif',
//               display: 'flex', alignItems: 'center', gap: 8,
//             }}>
//             Explore Marketplace →
//           </button>
//           <button
//             onClick={() => isAuthenticated ? navigate('/upload') : navigate('/login')}
//             style={{
//               padding: '13px 28px',
//               background: 'transparent',
//               border: '1px solid #30363d',
//               borderRadius: 8, color: '#e6edf3',
//               fontSize: 15, cursor: 'pointer',
//               fontFamily: 'DM Sans, sans-serif',
//               fontWeight: 500,
//             }}>
//             Start Selling
//           </button>
//         </div>
//       </div>

//       {/* ── PROJECTS SECTION ─────────────────────────────── */}
//       <div id="projects-section" style={{
//         maxWidth: 1200, margin: '0 auto', padding: '48px 24px',
//       }}>

//         {/* Section heading */}
//         <h2 style={{
//           fontFamily: 'Syne, sans-serif',
//           fontSize: 28, fontWeight: 800,
//           color: '#e6edf3', marginBottom: 24,
//         }}>
//           Projects
//         </h2>

//         {/* Search bar */}
//         <form onSubmit={handleSearch} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
//           <input
//             type="text"
//             placeholder="Search template, Projects and Source code"
//             value={searchInput}
//             onChange={e => setSearchInput(e.target.value)}
//             style={{
//               flex: 1, maxWidth: 480,
//               padding: '9px 16px',
//               background: '#161b22',
//               border: '1px solid #30363d',
//               borderRadius: 8, color: '#e6edf3',
//               fontSize: 13, outline: 'none',
//               fontFamily: 'DM Sans, sans-serif',
//             }}
//           />
//           <button type="submit" style={{
//             padding: '9px 20px',
//             background: '#00ff88', border: 'none',
//             borderRadius: 8, color: '#0d1117',
//             fontWeight: 700, fontSize: 13,
//             cursor: 'pointer',
//           }}>Search</button>
//           {search && (
//             <button type="button"
//               onClick={() => { setSearch(''); setSearchInput('') }}
//               style={{
//                 padding: '9px 14px', background: 'transparent',
//                 border: '1px solid #30363d', borderRadius: 8,
//                 color: '#7d8590', cursor: 'pointer',
//               }}>✕</button>
//           )}
//         </form>

//         {/* Category tabs */}
//         <div style={{
//           display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32,
//         }}>
//           {CATEGORIES.map(cat => (
//             <button key={cat}
//               onClick={() => setActiveCategory(cat)}
//               style={{
//                 padding: '6px 16px',
//                 borderRadius: 20,
//                 border: `1px solid ${activeCategory === cat ? '#00ff88' : '#30363d'}`,
//                 background: activeCategory === cat ? 'rgba(0,255,136,0.1)' : 'transparent',
//                 color: activeCategory === cat ? '#00ff88' : '#7d8590',
//                 fontSize: 13, cursor: 'pointer',
//                 fontFamily: 'DM Sans, sans-serif',
//                 fontWeight: activeCategory === cat ? 600 : 400,
//                 transition: 'all 0.15s',
//               }}>
//               {cat}
//             </button>
//           ))}
//         </div>

//          {/* Category filter tabs */}
//           {/* <div style={{
//             display: 'flex', gap: 8,
//             flexWrap: 'wrap', marginBottom: 24,
//             overflowX: 'auto', paddingBottom: 4,
//           }}>
//             {uniqueTabs.map(tab => (
//               <button key={tab}
//                 onClick={() => setActiveCategory(tab)}
//                 style={{
//                   padding: '5px 14px',
//                   borderRadius: 20, flexShrink: 0,
//                   border: `1px solid ${activeCategory === tab ? '#00ff88' : '#30363d'}`,
//                   background: activeCategory === tab
//                     ? 'rgba(0,255,136,0.1)' : 'transparent',
//                   color: activeCategory === tab ? '#00ff88' : '#7d8590',
//                   fontSize: 12, cursor: 'pointer',
//                   fontFamily: 'DM Sans, sans-serif',
//                   fontWeight: activeCategory === tab ? 600 : 400,
//                   transition: 'all 0.15s',
//                 }}>
//                 {tab}
//               </button>
//             ))}
//           </div> */}

//         {/* Loading */}
//         {isLoading && (
//           <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
//             <div style={{
//               width: 36, height: 36,
//               border: '2px solid #21262d',
//               borderTop: '2px solid #00ff88',
//               borderRadius: '50%',
//               animation: 'spin 0.8s linear infinite',
//             }}>
//               <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//             </div>
//           </div>
//         )}

//         {/* Error */}
//         {isError && (
//           <div style={{
//             textAlign: 'center', color: '#f85149', padding: 40,
//             fontSize: 14, fontFamily: 'DM Sans, sans-serif',
//           }}>
//             Failed to load projects. Make sure backend is running on port 8080.
//           </div>
//         )}

//         {/* Project Grid */}
//         {data && (
//           <>
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
//               gap: 16, marginBottom: 40,
//             }}>
//               {data.content?.map(project => (
//                 <ProjectCard key={project.id} project={project} />
//               ))}
//             </div>

//             {/* Empty state */}
//             {data.content?.length === 0 && (
//               <div style={{
//                 textAlign: 'center', color: '#7d8590',
//                 padding: 64, fontFamily: 'DM Sans, sans-serif',
//               }}>
//                 <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
//                 <p>No projects found{search ? ` for "${search}"` : ''}</p>
//               </div>
//             )}

//             {/* Pagination */}
//             {data.totalPages > 1 && (
//               <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
//                 <button onClick={() => setPage(p => Math.max(0, p - 1))}
//                   disabled={page === 0}
//                   style={{
//                     padding: '8px 16px', borderRadius: 6,
//                     border: '1px solid #30363d',
//                     background: 'transparent',
//                     color: page === 0 ? '#21262d' : '#7d8590',
//                     cursor: page === 0 ? 'default' : 'pointer',
//                   }}>← Prev</button>
//                 <span style={{
//                   padding: '8px 16px', color: '#7d8590', fontSize: 13,
//                   fontFamily: 'DM Sans, sans-serif',
//                 }}>
//                   {page + 1} / {data.totalPages}
//                 </span>
//                 <button onClick={() => setPage(p => p + 1)}
//                   disabled={page >= data.totalPages - 1}
//                   style={{
//                     padding: '8px 16px', borderRadius: 6,
//                     border: '1px solid #30363d',
//                     background: 'transparent',
//                     color: page >= data.totalPages - 1 ? '#21262d' : '#7d8590',
//                     cursor: page >= data.totalPages - 1 ? 'default' : 'pointer',
//                   }}>Next →</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── CTA BANNER ───────────────────────────────────── */}
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
//         <div style={{
//           background: '#161b22',
//           border: '1px solid #21262d',
//           borderRadius: 16, padding: '48px',
//           display: 'flex', alignItems: 'center',
//           justifyContent: 'space-between',
//           gap: 32, flexWrap: 'wrap',
//         }}>
//           <div style={{ maxWidth: 400 }}>
//             <h2 style={{
//               fontFamily: 'Syne, sans-serif',
//               fontSize: 28, fontWeight: 800,
//               color: '#e6edf3', marginBottom: 12,
//             }}>
//               Ready to sell your code?
//             </h2>
//             <p style={{
//               color: '#7d8590', fontSize: 15,
//               lineHeight: 1.7, marginBottom: 24,
//               fontFamily: 'DM Sans, sans-serif',
//             }}>
//               Join thousands of developers earning passive income from their source code.
//             </p>
//             <button
//               onClick={() => isAuthenticated ? navigate('/upload') : navigate('/register')}
//               style={{
//                 padding: '11px 24px',
//                 background: '#00ff88',
//                 border: 'none', borderRadius: 8,
//                 color: '#0d1117', fontWeight: 700,
//                 fontSize: 14, cursor: 'pointer',
//                 fontFamily: 'DM Sans, sans-serif',
//               }}>
//               Get Started
//             </button>
//           </div>

//           {/* Illustration */}
//           <div style={{
//             width: 200, height: 160,
//             background: 'linear-gradient(135deg, #1c2128, #0d1117)',
//             borderRadius: 12,
//             display: 'flex', alignItems: 'center',
//             justifyContent: 'center',
//             border: '1px solid #30363d',
//             fontSize: 64,
//           }}>
//             <img src="../../../Image/coding-removebg-preview.png" alt="" srcset="" />
//           </div>
//         </div>
//       </div>

//     </div>
//   )
// }

// // ── PROJECT CARD ──────────────────────────────────────────
// function ProjectCard({ project }) {
//   const baseUrl = import.meta.env.VITE_BASE_URL

//   return (
//     <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
//       <div
//         style={{
//           background: '#161b22',
//           border: '1px solid #21262d',
//           borderRadius: 12, overflow: 'hidden',
//           transition: 'border-color 0.2s, transform 0.2s',
//           cursor: 'pointer',
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.borderColor = '#00ff8844'
//           e.currentTarget.style.transform = 'translateY(-2px)'
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.borderColor = '#21262d'
//           e.currentTarget.style.transform = 'translateY(0)'
//         }}
//       >
//         {/* Cover — code preview or image */}
//         <div style={{ height: 140, overflow: 'hidden', background: '#0d1117' }}>
//           {project.coverImageUrl ? (
//             <img
//               src={`${baseUrl}${project.coverImageUrl}`}
//               alt={project.title}
//               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//             />
//           ) : (
//             <CodePreview />
//           )}
//         </div>

//         {/* Content */}
//         <div style={{ padding: '14px 16px' }}>
//           {/* Author + date */}
//           <div style={{
//             fontSize: 11, color: '#7d8590',
//             marginBottom: 8, fontFamily: 'DM Sans, sans-serif',
//           }}>
//             {project.uploaderUsername} / {new Date(project.createdAt).toLocaleDateString('en-GB', {
//               day: '2-digit', month: 'numeric', year: 'numeric'
//             })}
//           </div>

//           {/* Tags */}
//           <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
//             {project.tags?.slice(0, 2).map(tag => (
//               <span key={tag} style={{
//                 padding: '2px 8px',
//                 background: 'rgba(0,255,136,0.08)',
//                 border: '1px solid rgba(0,255,136,0.15)',
//                 borderRadius: 4,
//                 fontSize: 10, color: '#7ee8a2',
//                 fontFamily: 'DM Sans, sans-serif',
//               }}>
//                 {tag}
//               </span>
//             ))}
//           </div>

//           {/* Title */}
//           <h3 style={{
//             fontFamily: 'Syne, sans-serif',
//             fontSize: 14, fontWeight: 700,
//             color: '#e6edf3', marginBottom: 8,
//             display: '-webkit-box',
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: 'vertical',
//             overflow: 'hidden',
//           }}>
//             {project.title}
//           </h3>

//           {/* Description */}
//           <p style={{
//             fontSize: 12, color: '#7d8590',
//             lineHeight: 1.6,
//             display: '-webkit-box',
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: 'vertical',
//             overflow: 'hidden',
//             fontFamily: 'DM Sans, sans-serif',
//           }}>
//             {project.description}
//           </p>

//           {/* Downloads */}
//           <div style={{
//             marginTop: 12, paddingTop: 10,
//             borderTop: '1px solid #21262d',
//             display: 'flex', justifyContent: 'flex-end',
//           }}>
//             <span style={{ fontSize: 11, color: '#7d8590' }}>
//               ↓ {project.downloadCount}
//             </span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }