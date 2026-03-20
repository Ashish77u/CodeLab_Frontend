import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const baseUrl = import.meta.env.VITE_BASE_URL

  return (
    <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#0d0d1a', border: '1px solid #1a1a2e',
          borderRadius: 12, overflow: 'hidden',
          transition: 'transform 0.2s, border-color 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.borderColor = '#2a2a4a'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = '#1a1a2e'
        }}
      >
        {/* Cover Image */}
        <div style={{ height: 160, background: '#111120', overflow: 'hidden' }}>
          {project.coverImageUrl ? (
            <img
              src={`${baseUrl}${project.coverImageUrl}`}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg,#111120,#1a1a2e)',
              fontSize: 36
            }}>📁</div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px' }}>
          <h3 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700,
            color: '#e8e8f0', marginBottom: 6,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {project.title}
          </h3>

          <p style={{
            fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {project.description}
          </p>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {project.tags?.slice(0, 3).map(tag => (
              <span key={tag} style={{
                padding: '2px 8px', background: '#111120',
                border: '1px solid #2a2a3a', borderRadius: 12,
                fontSize: 10, color: '#556',
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 10, borderTop: '1px solid #1a1a2e',
          }}>
            <span style={{ fontSize: 12, color: '#444' }}>
              @{project.uploaderUsername}
            </span>
            <span style={{ fontSize: 11, color: '#333' }}>
              ↓ {project.downloadCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}