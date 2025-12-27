import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useEffect } from "react";

interface EliteAuthProps {
  onLogin: () => void;
  isPaidUser?: boolean; // ክፍያ መፈጸሙን ለማወቅ
}

export default function EliteAuth({ onLogin, isPaidUser = false }: EliteAuthProps) {
  
  // Reload ሲያደርግ ወይም ገጹ ሲከፈት ያልከፈለ ሰው ከሆነ በድምፅ እንዲናገር
  useEffect(() => {
    if (auth.currentUser && !isPaidUser) {
      const speakAlert = () => {
        const textEn = "Access Denied. Please complete your payment to use Cipher Studio Elite.";
        const textAm = "ፍቃድ የሎትም። እባክዎ አገልግሎቱን ለመጠቀም ክፍያዎን ያጠናቅቁ።";
        
        const msgEn = new SpeechSynthesisUtterance(textEn);
        const msgAm = new SpeechSynthesisUtterance(textAm);
        
        msgEn.lang = 'en-US';
        msgEn.rate = 0.9;
        
        window.speechSynthesis.speak(msgEn);
        // እንግሊዝኛው ሲያልቅ አማርኛውን እንዲናገር (አማርኛ በብሮውዘር ድጋፍ መሰረት ይለያያል)
        msgEn.onend = () => window.speechSynthesis.speak(msgAm);
      };
      
      // ለተጠቃሚው ድንገት ድምፅ እንዳይረብሽ ትንሽ ቆይቶ እንዲጀምር
      const timer = setTimeout(speakAlert, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPaidUser]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        onLogin();
      }
    } catch (err) {
      console.error("Authentication Error:", err);
    }
  };

  const handlePayment = () => {
    window.location.href = "https://t.me/Cipher_attack";
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#020617', 
      backgroundImage: 'radial-gradient(circle at top right, #1e293b, #020617)',
      color: 'white', 
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      overflow: 'hidden'
    }}>
      {/* ብርሀን የሚፈነጥቅ የጀርባ ዲዛይን */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        backgroundColor: '#3b82f6',
        filter: 'blur(150px)',
        opacity: '0.15',
        zIndex: 0
      }}></div>

      <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
        
        {/* Elite SVG Logo */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 75 25 L 35 25 L 15 50 L 35 75 L 75 75" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="40" cy="50" r="10" stroke="#10b981" stroke-width="6"/>
  <path d="M 50 50 L 85 50" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
  <path d="M 68 50 L 68 62" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
  <path d="M 78 50 L 78 58" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
</svg>
        </div>

        <h1 style={{ 
          fontSize: '2.8rem', 
          fontWeight: '900', 
          marginBottom: '12px',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(to bottom right, #ffffff, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Cipher Elite
        </h1>

        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '30px', 
          lineHeight: '1.6', 
          color: '#94a3b8',
          fontWeight: '400'
        }}>
          Advanced Intelligence. <br/> 
          <span style={{ color: '#3b82f6' }}>የላቁ የ AI መሳሪያዎችን እዚህ ያግኙ።</span>
        </p>

        {/* ማስጠንቀቂያ ለገቡ ግን ላልከፈሉ */}
        {auth.currentUser && !isPaidUser && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            animation: 'shake 0.5s ease-in-out'
          }}>
            <p style={{ color: '#fca5a5', fontSize: '14px', margin: 0 }}>
              ⚠️ ገብተዋል ግን ክፍያዎ ገና አልተረጋገጠም። እባክዎ ለ Cipher_attack ያሳውቁ።
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <button 
            onClick={handleLogin} 
            style={{ 
              padding: '18px', 
              backgroundColor: '#ffffff', 
              color: '#0f172a', 
              border: 'none', 
              borderRadius: '16px', 
              fontSize: '16px', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
            gap: '12px', 
            margin: '10px 0',
            color: '#334155'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
            <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>OR ACCESS</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
          </div>

          <button 
            onClick={handlePayment} 
            style={{ 
              padding: '18px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '16px', 
              fontSize: '16px', 
              fontWeight: '700', 
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            አሁኑኑ ይግዙ — 300 ብር ብቻ
          </button>
        </div>

        <div style={{ marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
          <p style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></span>
            Lifetime Access • Unlimited Prompts • Elite Support
          </p>
        </div>
      </div>
      
      {/* CSS Animation for the alert */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
