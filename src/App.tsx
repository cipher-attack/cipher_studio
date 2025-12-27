import { useState, useEffect } from 'react';
import { auth } from './firebase'; // አዲሱ የፈጠርነው ፋይል
import { onAuthStateChanged } from 'firebase/auth';
import EliteAuth from './EliteAuth'; // አዲሱ የሎጊን ገጽ
// ከታች ያንተ የድሮ imports እንዳሉ ይሁኑ (ለምሳሌ import Chat from './Chat'...)
// ማሳሰቢያ: እዚህ ጋር ያንተን ዋና የአፕ ኮድ ማስገባት አለብህ። ለምሳሌ:
import ChatInterface from './components/ChatInterface'; // ወይም ያንተ ዋና ኮምፖነንት ስም

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{height: '100vh', background: '#000', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;

  if (!user) {
    // ተጠቃሚው ካልገባ ወደ EliteAuth ይወስደዋል
    return <EliteAuth onLogin={() => {}} />;
  }

  // ተጠቃሚው ከገባ በኋላ የሚታየው ዋናው አፕ (ያንተ የድሮ ኮድ)
  return (
    <>
      {/* እዚህ ጋር ያንተን ዋና የአፕ ኮምፖነንት ጥራ */}
      {/* ለምሳሌ: <ChatInterface /> ወይም <Home /> */}
      <div style={{height: '100vh', width: '100vw'}}>
         {/* ለጊዜው ያንተን ኮድ እዚህ መመለስ አለብህ። ከታች የድሮ ኮድህን Copy-Paste አድርግ */}
         <ChatInterface /> 
      </div>
    </>
  );
}

export default App;

