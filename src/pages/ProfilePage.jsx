// src/pages/ProfilePage.jsx
import { useState, useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const CodePreview = () => (
  <div style={{
    width: 80, height: 60, background: '#0d1117',
    borderRadius: 6, padding: '6px 8px',
    fontFamily: 'monospace', fontSize: 7,
    lineHeight: 1.6, overflow: 'hidden', flexShrink: 0,
  }}>
    <div style={{color:'#4ec9b0'}}>Life myLife = new Life();</div>
    <div style={{color:'#d4d4d4'}}>myLife.startLife();</div>
    <div style={{color:'#c586c0'}}>while( myLife.makeSuccess() {'{'}</div>
    <div style={{color:'#d4d4d4', paddingLeft: 8}}>myLife.tryAgain();</div>
    <div style={{color:'#c586c0'}}>if (myLife.death()){'{ break; }'}</div>
  </div>
)

export default function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated, user: currentUser, updateUser } = useAuthStore()
  const isOwnProfile = isAuthenticated && currentUser?.username === username
  const baseUrl = import.meta.env.VITE_BASE_URL

  const [activeCategory, setActiveCategory] = useState('All')
  const [showMenu, setShowMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const menuRef = useRef(null)

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => isOwnProfile
      ? userApi.getMyProfile()
      : userApi.getPublicProfile(username),
  })

  // Fetch user projects
  const { data: projectsData } = useQuery({
    queryKey: ['userProjects', username],
    queryFn: () => userApi.getUserProjects(username),
    enabled: !!username,
  })

  // Get unique tags from all projects
  const allTags = [...new Set(
      projectsData?.content?.flatMap(p =>
        p.tags?.map(t => typeof t === 'string' ? t : t.name) || []
      ) || []
    )
  ]
  // Remove duplicates
  const uniqueTabs = [...new Set(allTags)]

  // Filter projects by active category
  const filteredProjects = projectsData?.content?.filter(project => {
    if (activeCategory === 'All') return true
    const tagNames = project.tags?.map(t => typeof t === 'string' ? t : t.name) || []
    return tagNames.some(t => t.toLowerCase() === activeCategory.toLowerCase())
  }) || []

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      updateUser(data)
      queryClient.invalidateQueries(['profile', username])
      toast.success('Profile updated!')
      setShowEditModal(false)
    },
    onError: () => toast.error('Update failed'),
  })

  // Profile image upload mutation
  const imageMutation = useMutation({
    mutationFn: userApi.uploadProfileImage,
    onSuccess: (data) => {
      updateUser({ profileImageUrl: data.profileImageUrl })
      queryClient.invalidateQueries(['profile', username])
      toast.success('Profile image updated!')
    },
    onError: () => toast.error('Image upload failed'),
  })

  const openEditModal = () => {
    setEditForm({
      realName:   profile?.realName   || '',
      bio:        profile?.bio        || '',
      location:   profile?.location   || '',
      education:  profile?.education  || '',
      work:       profile?.work       || '',
      websiteUrl: profile?.websiteUrl || '',
    })
    setShowMenu(false)
    setShowEditModal(true)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) imageMutation.mutate(file)
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

  if (!profile) return (
    <div style={{
      textAlign: 'center', color: '#f85149',
      padding: 80, background: '#0d1117',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      User not found
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

        {/* ── LEFT — Projects ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Username heading */}
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 28, fontWeight: 800,
            color: '#e6edf3', marginBottom: 20,
          }}>
            {profile.realName || profile.username}
          </h1>

          {/* Category filter tabs */}
          <div style={{
            display: 'flex', gap: 8,
            flexWrap: 'wrap', marginBottom: 24,
            overflowX: 'auto', paddingBottom: 4,
          }}>
            {uniqueTabs.map(tab => (
              <button key={tab}
                onClick={() => setActiveCategory(tab)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 20, flexShrink: 0,
                  border: `1px solid ${activeCategory === tab ? '#00ff88' : '#30363d'}`,
                  background: activeCategory === tab
                    ? 'rgba(0,255,136,0.1)' : 'transparent',
                  color: activeCategory === tab ? '#00ff88' : '#7d8590',
                  fontSize: 12, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: activeCategory === tab ? 600 : 400,
                  transition: 'all 0.15s',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Project list */}
          {filteredProjects.length === 0 ? (
            <div style={{
              textAlign: 'center', color: '#7d8590',
              padding: '48px 0', fontFamily: 'DM Sans, sans-serif',
            }}>
              No projects found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredProjects.map(project => (
                <ProjectListCard
                  key={project.id}
                  project={project}
                  baseUrl={baseUrl}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT — Profile Card ── */}
        <div style={{
          width: 240, flexShrink: 0,
          position: 'sticky', top: 80,
          background: '#161b22',
          border: '1px solid #21262d',
          borderRadius: 16, padding: '20px',
        }}>
          {/* Three dots menu — only own profile */}
          {isOwnProfile && (
            <div ref={menuRef} style={{
              display: 'flex', justifyContent: 'flex-end',
              marginBottom: 12, position: 'relative',
            }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  background: 'transparent', border: 'none',
                  color: '#7d8590', cursor: 'pointer',
                  fontSize: 18, padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                ···
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <div style={{
                  position: 'absolute', top: 28, right: 0,
                  background: '#1c2128',
                  border: '1px solid #30363d',
                  borderRadius: 8, padding: '6px 0',
                  minWidth: 160, zIndex: 50,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  {[
                    { label: '✏️ Edit Profile', action: openEditModal },
                    { label: '📸 Change Photo', action: () => {
                      document.getElementById('profile-image-input').click()
                      setShowMenu(false)
                    }},
                    { label: '⬆️ Upload Project', action: () => {
                      navigate('/upload')
                      setShowMenu(false)
                    }},
                  ].map(item => (
                    <button key={item.label}
                      onClick={item.action}
                      style={{
                        display: 'block', width: '100%',
                        padding: '8px 16px', background: 'transparent',
                        border: 'none', color: '#e6edf3',
                        fontSize: 13, cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                      onMouseEnter={e => e.target.style.background = '#21262d'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Hidden image input */}
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
          )}

          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl.startsWith('http')
                  ? profile.profileImageUrl
                  : `${baseUrl}${profile.profileImageUrl}`
                }
                alt={profile.username}
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #21262d',
                }}
              />
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg,#00ff88,#00ccff)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto',
                fontSize: 28, fontWeight: 800, color: '#000',
              }}>
                {profile.username?.[0]?.toUpperCase()}
              </div>
            )}

            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 16, fontWeight: 700,
              color: '#e6edf3', marginTop: 10, marginBottom: 0,
            }}>
              {profile.realName || profile.username}
            </h3>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p style={{
              fontSize: 12, color: '#7d8590',
              lineHeight: 1.6, marginBottom: 16,
              fontFamily: 'DM Sans, sans-serif',
            }}>
              {profile.bio}
            </p>
          )}

          {/* Meta info */}
          {[
            { icon: '📍', label: 'LOCATION',  value: profile.location  },
            { icon: '🎓', label: 'EDUCATION', value: profile.education },
            { icon: '💼', label: 'WORK',      value: profile.work      },
            { icon: '📅', label: 'JOINED',    value: profile.joinedDate
              ? new Date(profile.joinedDate).toLocaleDateString('en-US', {
                  month: 'short', day: '2-digit', year: 'numeric'
                })
              : null
            },
          ].map(item => item.value ? (
            <div key={item.label} style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 9, color: '#7d8590',
                letterSpacing: 1.5, marginBottom: 3,
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              }}>
                {item.icon} {item.label}
              </div>
              <div style={{
                fontSize: 12, color: '#e6edf3',
                fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5,
              }}>
                {item.value}
              </div>
            </div>
          ) : null)}

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 16, marginTop: 16,
            paddingTop: 16, borderTop: '1px solid #21262d',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 20, fontWeight: 800, color: '#00ff88',
              }}>
                {profile.totalProjects}
              </div>
              <div style={{ fontSize: 10, color: '#7d8590' }}>Projects</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 20, fontWeight: 800, color: '#00ccff',
              }}>
                {profile.totalDownloads}
              </div>
              <div style={{ fontSize: 10, color: '#7d8590' }}>Downloads</div>
            </div>
          </div>

          {/* Website */}
          {profile.websiteUrl && (
            <a href={profile.websiteUrl} target="_blank" rel="noreferrer"
              style={{
                display: 'block', marginTop: 14,
                fontSize: 12, color: '#00ff88',
                textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif',
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
              🔗 {profile.websiteUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {showEditModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 200,
          padding: 24,
        }}>
          <div style={{
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 16, padding: 32,
            width: '100%', maxWidth: 480,
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 24,
            }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 20, fontWeight: 800, color: '#e6edf3',
              }}>
                Edit Profile
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'transparent', border: 'none',
                  color: '#7d8590', fontSize: 20, cursor: 'pointer',
                }}>
                ✕
              </button>
            </div>

            {[
              { key: 'realName',   label: 'Full Name',   placeholder: 'John Doe' },
              { key: 'bio',        label: 'Bio',         placeholder: 'Tell us about yourself...', multiline: true },
              { key: 'location',   label: 'Location',    placeholder: 'India / Mumbai' },
              { key: 'education',  label: 'Education',   placeholder: 'B.Tech Computer Science' },
              { key: 'work',       label: 'Work',        placeholder: 'Software Engineer at...' },
              { key: 'websiteUrl', label: 'Website URL', placeholder: 'https://yoursite.com' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 12,
                  color: '#7d8590', marginBottom: 6,
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    value={editForm[field.key] || ''}
                    onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={3}
                    style={{
                      width: '100%', padding: '9px 12px',
                      background: '#0d1117',
                      border: '1px solid #21262d',
                      borderRadius: 8, color: '#e6edf3',
                      fontSize: 13, resize: 'vertical',
                      fontFamily: 'DM Sans, sans-serif',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <input
                    value={editForm[field.key] || ''}
                    onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', padding: '9px 12px',
                      background: '#0d1117',
                      border: '1px solid #21262d',
                      borderRadius: 8, color: '#e6edf3',
                      fontSize: 13,
                      fontFamily: 'DM Sans, sans-serif',
                      outline: 'none',
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  flex: 1, padding: 11,
                  background: 'transparent',
                  border: '1px solid #30363d',
                  borderRadius: 8, color: '#7d8590',
                  fontSize: 14, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate(editForm)}
                disabled={updateMutation.isPending}
                style={{
                  flex: 1, padding: 11,
                  background: updateMutation.isPending ? '#21262d' : '#00ff88',
                  border: 'none', borderRadius: 8,
                  color: updateMutation.isPending ? '#7d8590' : '#0d1117',
                  fontSize: 14, fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── PROJECT LIST CARD (horizontal layout) ──────────────────
function ProjectListCard({ project, baseUrl }) {
  // const tagNames = project.tags?.map(t => typeof t === 'string' ? t : t.name) || []

  return (
    <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#161b22',
          border: '1px solid #21262d',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', gap: 16,
          alignItems: 'flex-start',
          transition: 'border-color 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff8844'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}
      >
        {/* Text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 15, fontWeight: 700,
            color: '#e6edf3', marginBottom: 8,
            lineHeight: 1.3,
          }}>
            {project.title}
          </h3>
          <p style={{
            fontSize: 12, color: '#7d8590',
            lineHeight: 1.6, marginBottom: 10,
            fontFamily: 'DM Sans, sans-serif',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.description}
          </p>
          <div style={{ fontSize: 11, color: '#7d8590', fontFamily: 'DM Sans, sans-serif' }}>
            {new Date(project.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: '2-digit', year: 'numeric'
            })}
          </div>
        </div>

        {/* Cover image or code preview */}
        <div style={{ flexShrink: 0 }}>
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl.startsWith('http')
                ? project.coverImageUrl                    // ← Cloudinary URL, use as-is
                : `${baseUrl}${project.coverImageUrl}`     // ← old local URL, add baseUrl
            }
              alt={project.title}
              style={{
                width: 80, height: 60,
                borderRadius: 6, objectFit: 'cover',
                border: '1px solid #21262d',
              }}
            />
          ) : (
            <CodePreview />
          )}
        </div>
      </div>
    </Link>
  )
}










// -------------------------------------------------------
// import { useParams } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { userApi } from '../api/userApi'
// // import ProjectCard from '../components/projects/ProjectCard'
// import ProjectCard from '../components/projects/ProjectCard'
// import Spinner from '../components/common/Spinner'

// export default function ProfilePage() {
//   const { username } = useParams()
//   const baseUrl = import.meta.env.VITE_BASE_URL

//   const { data: profile, isLoading } = useQuery({
//     queryKey: ['profile', username],
//     queryFn: () => userApi.getPublicProfile(username),
//   })

//   const { data: projectsData } = useQuery({
//     queryKey: ['userProjects', username],
//     queryFn: () => userApi.getUserProjects(username),
//     enabled: !!username,
//   })

//   if (isLoading) return (
//     <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
//       <Spinner size={40} />
//     </div>
//   )

//   if (!profile) return (
//     <div style={{ textAlign: 'center', color: '#ff4444', padding: 80 }}>
//       User not found
//     </div>
//   )

//   return (
//     <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

//       <div style={{
//         display: 'flex', gap: 32, alignItems: 'flex-start',
//         background: '#0d0d1a', border: '1px solid #1a1a2e',
//         borderRadius: 16, padding: 32, marginBottom: 40,
//         flexWrap: 'wrap',
//       }}>
//         {/* Avatar */}
//         {profile.profileImageUrl ? (
//           <img src={`${baseUrl}${profile.profileImageUrl}`}
//             alt={profile.username}
//             style={{
//               width: 100, height: 100, borderRadius: '50%',
//               objectFit: 'cover', border: '3px solid #1a1a2e', flexShrink: 0
//             }} />
//         ) : (
//           <div style={{
//             width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
//             background: 'linear-gradient(135deg,#00ff88,#00ccff)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: 36, fontWeight: 800, color: '#000'
//           }}>
//             {profile.username?.[0]?.toUpperCase()}
//           </div>
//         )}

//         {/* Info */}
//         <div style={{ flex: 1, minWidth: 200 }}>
//           <h1 style={{
//             fontFamily: 'Syne, sans-serif', fontSize: 28,
//             fontWeight: 800, color: '#e8e8f0', marginBottom: 4
//           }}>
//             {profile.realName || profile.username}
//           </h1>
//           <p style={{ color: '#556', fontSize: 14, marginBottom: 12 }}>
//             @{profile.username}
//           </p>
//           {profile.bio && (
//             <p style={{ color: '#778', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
//               {profile.bio}
//             </p>
//           )}
//           <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//             {profile.location  && <span style={{ fontSize: 12, color: '#445' }}>📍 {profile.location}</span>}
//             {profile.work      && <span style={{ fontSize: 12, color: '#445' }}>💼 {profile.work}</span>}
//             {profile.education && <span style={{ fontSize: 12, color: '#445' }}>🎓 {profile.education}</span>}
//             {profile.websiteUrl && (
//               <a href={profile.websiteUrl} target="_blank" rel="noreferrer"
//                 style={{ fontSize: 12, color: '#00ff88', textDecoration: 'none' }}>
//                 🔗 {profile.websiteUrl.replace(/^https?:\/\//, '')}
//               </a>
//             )}
//             <span style={{ fontSize: 12, color: '#445' }}>
//               📅 Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', {
//                 month: 'long', year: 'numeric'
//               })}
//             </span>
//           </div>
//         </div>

//         {/* Stats */}
//         <div style={{ display: 'flex', gap: 24 }}>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{
//               fontFamily: 'Syne, sans-serif', fontSize: 28,
//               fontWeight: 800, color: '#00ff88'
//             }}>{profile.totalProjects}</div>
//             <div style={{ fontSize: 11, color: '#445' }}>Projects</div>
//           </div>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{
//               fontFamily: 'Syne, sans-serif', fontSize: 28,
//               fontWeight: 800, color: '#00ccff'
//             }}>{profile.totalDownloads}</div>
//             <div style={{ fontSize: 11, color: '#445' }}>Downloads</div>
//           </div>
//         </div>
//       </div>

//       <h2 style={{
//         fontFamily: 'Syne, sans-serif', fontSize: 22,
//         fontWeight: 700, color: '#e8e8f0', marginBottom: 20
//       }}>
//         Projects by @{username}
//       </h2>

//       {projectsData?.content?.length === 0 && (
//         <div style={{ textAlign: 'center', color: '#333', padding: 40 }}>
//           No projects published yet.
//         </div>
//       )}

//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//         gap: 20,
//       }}>
//         {projectsData?.content?.map(project => (
//           <ProjectCard key={project.id} project={project} />
//         ))}
//       </div>
//     </div>
//   )
// }