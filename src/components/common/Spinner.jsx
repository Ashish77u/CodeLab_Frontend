export default function Spinner({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '2px solid #1a1a2e',
      borderTop: '2px solid #00ff88',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}