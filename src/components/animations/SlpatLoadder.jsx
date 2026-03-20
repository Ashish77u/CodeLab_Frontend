export default function SplashLoader() {
  return (
    <div style={{
      height: "100vh",
      background: "#0a0a0f",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      overflow: "hidden"
    }}>

      <img
        src="/logo.png"
        alt="logo"
        style={{
          width: 120,
          animation: "logoReveal 1.6s ease-out forwards"
        }}
      />

      <style>{`

        @keyframes logoReveal {

          0% {
            transform: translateY(200px) scale(0.5);
            opacity: 0;
          }

          60% {
            transform: translateY(-10px) scale(1.1);
            opacity: 1;
          }

          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }

        }

      `}</style>

    </div>
  )
}