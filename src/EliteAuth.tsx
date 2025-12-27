import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

export default function EliteAuth({ onLogin }: { onLogin: () => void }) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err) {
      alert("ስህተት ተፈጥሯል፣ እባክዎ እንደገና ይሞክሩ");
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white', height: '100vh' }}>
      <h2>Elite Cipher Studio</h2>
      <p>ይህንን AI ለመጠቀም መጀመሪያ ይግቡ</p>
      <button onClick={handleLogin} style={{ padding: '15px', backgroundColor: '#4285F4', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', width: '100%' }}>
        Sign in with Google
      </button>
      <hr style={{ margin: '30px 0' }} />
      <p>ወይም በ 300 ብር የህይወት ዘመን ፍቃድ ይግዙ</p>
      <button onClick={() => window.location.href='https://chapa.link/your-pay-link'} style={{ padding: '15px', backgroundColor: '#00c853', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', width: '100%' }}>
        በ Chapa ይክፈሉ
      </button>
    </div>
  );
}
