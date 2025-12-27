import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

interface EliteAuthProps {
  onLogin: () => void;
}

export default function EliteAuth({ onLogin }: { onLogin: () => void }) {
  const handleLogin = async () => {
    try {
      // ፖፕ አፕ እንዳይዘጋ ቀጥታ ውጤቱን እንቀበላለን
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        onLogin(); // ሎጊን ሲሳካ ወደ ዋናው ገጽ እንዲያልፍ
      }
    } catch (err) {
      console.error("Authentication Error:", err);
    }
  };

  const handlePayment = () => {
    // ቀጥታ ወደ ቴሌግራምህ እንዲሄድ
    window.location.href = "https://t.me/Cipher_attack";
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#020617', // ጥቁር ሰማያዊ (Dark Slate)
      backgroundImage: 'radial-gradient(circle at top right, #1e293b, #020617)',
      color: 'white', 
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* ብርሀን የሚፈነጥቅ የጀርባ ዲዛይን (Glow Effect) */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        backgroundColor: '#3b82f6',
        filter: 'blur(120px)',
        opacity: '0.1',
        zIndex: 0
      }}></div>

      <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
        <img 
          src="/cipher.png" 
          alt="Cipher Logo" 
          style={{ 
            width: '80px', 
            height: '80px',
            marginBottom: '24px', 
            borderRadius: '20px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' 
          }} 
        />
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          marginBottom: '12px',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(to bottom right, #ffffff, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Cipher Studio Elite
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '40px', 
          lineHeight: '1.6', 
          color: '#94a3b8' 
        }}>
          የላቁ የ AI መሳሪያዎችን እና ያልተገደበ አገልግሎትን ያግኙ።
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {/* Google Button */}
          <button 
            onClick={handleLogin} 
            style={{ 
              padding: '16px', 
              backgroundColor: '#ffffff', 
              color: '#0f172a', 
              border: 'none', 
              borderRadius: '14px', 
              fontSize: '16px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            በ Google ይግቡ
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            margin: '10px 0',
            color: '#475569'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
            <span style={{ fontSize: '14px' }}>ወይም</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
          </div>

          {/* Telegram/Payment Button */}
          <button 
            onClick={handlePayment} 
            style={{ 
              padding: '16px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '14px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            አሁኑኑ ይግዙ — 300 ብር ብቻ
          </button>
        </div>

        <p style={{ marginTop: '32px', fontSize: '13px', color: '#475569' }}>
          የህይወት ዘመን ፍቃድ በመግዛት ሁሉንም የፕሪሚየም አገልግሎቶች ያግኙ።
        </p>
      </div>
    </div>
  );
}
