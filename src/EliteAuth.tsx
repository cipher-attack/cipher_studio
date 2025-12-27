import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

export default function EliteAuth({ onLogin }: { onLogin: () => void }) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '20px' }}>
      <img src="/cipher.png" alt="Logo" style={{ width: '100px', marginBottom: '20px', borderRadius: '50%' }} />
      <h1 style={{ marginBottom: '10px' }}>Cipher Studio Elite</h1>
      <p style={{ marginBottom: '40px', textAlign: 'center', color: '#94a3b8' }}>የላቀ የ AI አቅም ለማግኘት ይግቡ ወይም የህይወት ዘመን ፍቃድ ይግዙ።</p>
      
      <button onClick={handleLogin} style={{ padding: '15px 30px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', width: '100%', maxWidth: '300px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
        <span style={{ fontSize: '20px' }}>G</span> በ Google ይግቡ
      </button>

      <div style={{ margin: '20px 0', color: '#64748b' }}>ወይም</div>

      <button onClick={() => window.open('https://chapa.link/your-link', '_blank')} style={{ padding: '15px 30px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', width: '100%', maxWidth: '300px', cursor: 'pointer' }}>
        በ 300 ብር ይግዙ (Chapa)
      </button>
    </div>
  );
}

