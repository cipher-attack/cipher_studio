import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';
import MarkdownRenderer from './components/MarkdownRenderer';
import CodeLab from './components/CodeLab';
import PromptStudio from './components/PromptStudio';
import VisionHub from './components/VisionHub';
import DataAnalyst from './components/DataAnalyst';
import DocIntel from './components/DocIntel';
import CyberHouse from './components/CyberHouse';
import About from './components/About';
import { streamContent } from './services/geminiService';
import { ModelConfig, Session, DEFAULT_CONFIG, ChatMessage, Attachment, Persona, Theme, Voice, ViewMode, GroundingMetadata } from './types';
import { 
    Box, Code, Mic, Image as ImageIcon, Send, X, StopCircle, RefreshCw, 
    Volume2, Calculator, Keyboard, Copy, Maximize2, Minimize2, Lightbulb, Zap, 
    PenTool, Terminal, ArrowDownCircle, LayoutTemplate, Sun, Moon,
    BookOpen, Languages, Scissors, FileCode, Pin, Download, UserCircle, Globe
} from 'lucide-react';

// --- Cipher Logo Component (Updated Triangle Eye) ---
const CipherLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M 75 25 L 35 25 L 15 50 L 35 75 L 75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="40" cy="50" r="10" stroke="currentColor" strokeWidth="6" />
    <path d="M 50 50 L 85 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 68 50 L 68 62" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 78 50 L 78 58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// --- Helper Components ---

const AudioVisualizer = ({ isActive }: { isActive: boolean }) => {
    if (!isActive) return <Mic size={20} />;
    return (
        <div className="flex items-center gap-0.5 h-5 w-5 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
                <div 
                    key={i} 
                    className="visualizer-bar w-1 bg-red-500 rounded-full"
                    style={{ 
                        animationDuration: `${400 + Math.random() * 300}ms`,
                        height: isActive ? '100%' : '3px',
                        animationName: 'sound',
                        animationIterationCount: 'infinite',
                        animationDirection: 'alternate'
                    }} 
                />
            ))}
        </div>
    );
};

// --- Predefined Personas ---
const PERSONAS: Persona[] = [
    { id: 'default', name: 'Pro Mode', icon: Zap, temperature: 1.0, systemInstruction: "Act as a reasoning expert. Think deeply before answering." },
    { id: 'coder', name: 'Developer', icon: Terminal, temperature: 0.2, systemInstruction: "You are an expert Senior Software Engineer. Prioritize clean, efficient, and well-documented code." },
    { id: 'creative', name: 'Creative', icon: PenTool, temperature: 1.3, systemInstruction: "You are a creative writer and storyteller. Use vivid imagery and metaphors." },
];

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
    });
};

const App: React.FC = () => {
  // --- State ---
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [apiKey, setApiKey] = useState('');
  const [currentView, setCurrentView] = useState<ViewMode>('chat');
  
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [config, setConfig] = useState<ModelConfig>(DEFAULT_CONFIG);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false); 
  const [isWideMode, setIsWideMode] = useState(false); // Feature: Wide Mode
  const [showScrollButton, setShowScrollButton] = useState(false); 
  const [lightboxImage, setLightboxImage] = useState<string | null>(null); 
  const [activePersona, setActivePersona] = useState<string>('default'); 
  const [focusModeIndex, setFocusModeIndex] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<Voice>('male'); // Feature: Voice

  const outputEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Ref to track if auto-scroll should happen
  const shouldAutoScrollRef = useRef(true);

  // --- Effects ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // Load Sessions and API Key
  useEffect(() => {
    const savedSessions = localStorage.getItem('gemini_sessions_v5');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) loadSession(parsed[0]);
      else createNewSession();
    } else {
      createNewSession();
    }

    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  // Save Sessions
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('gemini_sessions_v5', JSON.stringify(sessions));
  }, [sessions]);

  // Save API Key
  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  // SMART AUTO-SCROLL LOGIC
  useEffect(() => {
    // Only scroll if the user is near the bottom (shouldAutoScrollRef is true)
    if (isStreaming && shouldAutoScrollRef.current) {
        outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isStreaming]);

  const handleScroll = () => {
      if (chatContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
          // Logic: If we are within 50px of the bottom, enable auto-scroll. Otherwise, disable it.
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
          shouldAutoScrollRef.current = isNearBottom;
          setShowScrollButton(!isNearBottom);
      }
  };

  const scrollToBottom = () => {
      shouldAutoScrollRef.current = true;
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setTokenCount(prompt.length / 4);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [prompt]);

  // --- Logic ---
  const createNewSession = () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      history: [],
      config: { ...DEFAULT_CONFIG },
      lastModified: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    loadSession(newSession);
  };

  const loadSession = (session: Session) => {
    setCurrentSessionId(session.id);
    setHistory(session.history);
    setConfig(session.config);
    setPrompt('');
    setAttachments([]);
    setError(null);
    setIsZenMode(false);
    // Reset scroll logic on new session load
    shouldAutoScrollRef.current = true;
    setTimeout(scrollToBottom, 100);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      if (newSessions.length > 0) loadSession(newSessions[0]);
      else createNewSession();
    }
  };

  const handleRun = async (overridePrompt?: string, overrideHistory?: ChatMessage[]) => {
    const textToRun = overridePrompt ?? prompt;
    const historyToUse = overrideHistory ?? history;
    const attachmentsToUse = overridePrompt ? [] : attachments; 

    if ((!textToRun.trim() && attachmentsToUse.length === 0) || isStreaming) return;

    const userMsg: ChatMessage = { 
        id: crypto.randomUUID(),
        role: 'user', 
        text: textToRun, 
        timestamp: Date.now(), 
        attachments: [...attachmentsToUse] 
    };
    const tempHistory = [...historyToUse, userMsg];
    
    // Update state immediately so user sees their message
    setHistory(tempHistory);
    // CRITICAL: Save to session state immediately so history is not lost on refresh
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, history: tempHistory } : s));

    if (!overridePrompt) {
        setPrompt('');
        setAttachments([]);
    }
    
    // Force scroll to bottom when starting a new generation
    shouldAutoScrollRef.current = true;
    setIsStreaming(true);
    setError(null);
    setFocusModeIndex(null);

    // Update title if it's the first message
    if (historyToUse.length === 0) {
        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title: userMsg.text.slice(0, 30) } : s));
    }

    try {
      let fullResponse = '';
      let receivedMetadata: GroundingMetadata | undefined;

      setHistory(prev => [...prev, { role: 'model', text: '', timestamp: Date.now() }]);

      await streamContent(
          apiKey, 
          userMsg.text, 
          userMsg.attachments || [], 
          tempHistory.slice(0, -1), 
          config, 
          (chunk) => {
            fullResponse = chunk;
            setHistory(prev => {
                const newHist = [...prev];
                newHist[newHist.length - 1].text = chunk;
                // If we received metadata during streaming, attach it
                if (receivedMetadata) {
                    newHist[newHist.length - 1].groundingMetadata = receivedMetadata;
                }
                return newHist;
            });
          },
          (metadata) => {
              receivedMetadata = metadata;
              setHistory(prev => {
                  const newHist = [...prev];
                  newHist[newHist.length - 1].groundingMetadata = metadata;
                  return newHist;
              });
          }
      );

      // Save complete interaction to session
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, history: [...tempHistory, { id: crypto.randomUUID(), role: 'model', text: fullResponse, timestamp: Date.now(), groundingMetadata: receivedMetadata }] } : s));
    } catch (err: any) {
      setError(err.message);
      // Remove the empty model placeholder if error occurs
      setHistory(prev => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  // Feature: Text Actions
  const handleTextAction = (action: string, text: string) => {
      let prompt = "";
      switch(action) {
          case 'eli5': prompt = `Explain this like I'm 5: "${text.slice(0, 500)}..."`; break;
          case 'shorter': prompt = `Shorten this text: "${text.slice(0, 1000)}..."`; break;
          case 'translate': prompt = `Translate to Amharic: "${text.slice(0, 500)}..."`; break;
          case 'summarize': prompt = `Summarize this: "${text.slice(0, 1000)}..."`; break;
          case 'code': prompt = `Convert to code: "${text.slice(0, 1000)}..."`; break;
      }
      if(prompt) handleRun(prompt);
  };

  // Feature: Export Chat
  const exportChat = () => {
    const textContent = history.map(msg => `[${msg.role.toUpperCase()}]: ${msg.text}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cipher-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Feature: Pin Message
  const togglePin = (index: number) => {
      setHistory(prev => {
          const newHist = [...prev];
          newHist[index] = { ...newHist[index], pinned: !newHist[index].pinned };
          return newHist;
      });
  };

  // Feature: TTS Voice Selection
  const speakText = (text: string) => {
      const u = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      // Heuristic for selecting voice
      if (selectedVoice === 'male') u.voice = voices.find(v => v.name.includes('Male') || v.name.includes('David')) || voices[0];
      else if (selectedVoice === 'female') u.voice = voices.find(v => v.name.includes('Female') || v.name.includes('Zira')) || voices[0];
      else u.rate = 0.8; // Robot-like
      window.speechSynthesis.speak(u);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          try {
              const base64 = await convertFileToBase64(file);
              setAttachments(prev => [...prev, { mimeType: file.type, data: base64 }]);
          } catch (err) {
              console.error("File upload failed", err);
          }
      }
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window)) return alert("Not supported");
    if (isRecording) setIsRecording(false);
    else {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onresult = (e: any) => setPrompt(prev => prev + ' ' + e.results[0][0].transcript);
        recognition.start();
    }
  };

  const isDark = theme === 'dark';

  return (
    // Changed h-screen to h-[100dvh] for mobile browser address bar compatibility
    <div className={`flex h-[100dvh] w-screen font-sans overflow-hidden relative ${isDark ? 'mesh-bg-dark text-gray-100' : 'mesh-bg-light text-gray-900'}`}>
      
      {/* 1. SIDEBAR */}
      {!isZenMode && (
          <Sidebar 
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={(id) => loadSession(sessions.find(s => s.id === id)!)}
            onNewSession={createNewSession}
            onDeleteSession={handleDeleteSession}
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            theme={theme}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
      )}

      {/* 2. MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10 transition-all duration-300">
        
        {/* Header - Glassmorphism */}
        {currentView !== 'about' && (
        <header className={`h-16 flex-shrink-0 flex items-center justify-between px-3 md:px-4 z-20 glass-panel ${isDark ? 'glass-dark' : 'glass-light'} mx-2 md:mx-4 mt-2 md:mt-3 rounded-xl md:rounded-2xl`}>
          <div className="flex items-center gap-2 md:gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl transition-all ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}>
                <LayoutTemplate size={18} className="md:w-5 md:h-5" />
             </button>
             
             {/* Persona/Title Switcher based on View */}
             {currentView === 'chat' ? (
                <div className="hidden md:flex items-center gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent">
                    {PERSONAS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => { setActivePersona(p.id); setConfig(prev => ({ ...prev, temperature: p.temperature, systemInstruction: p.systemInstruction })) }}
                            className={`p-1.5 px-3 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${activePersona === p.id ? (isDark ? 'bg-white/20 text-white shadow-lg backdrop-blur-md' : 'bg-white text-black shadow-lg') : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                        >
                            <p.icon size={14} />
                            {p.name}
                        </button>
                    ))}
                </div>
             ) : (
                <div className="hidden md:flex items-center gap-2">
                    <span className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                        {currentView.replace('-', ' ')}
                    </span>
                </div>
             )}
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
             {currentView === 'chat' && (
                <button onClick={() => setConfig(prev => ({...prev}))} className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium ${isDark ? 'bg-white/10 text-gray-300' : 'bg-black/5 text-gray-600'}`}>
                    Est. Cost: ${((tokenCount * 0.0001) + (history.length * 0.00005)).toFixed(5)}
                </button>
             )}
             
             {currentView === 'chat' && (
                 <button onClick={exportChat} className={`p-2 md:p-2.5 rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-black'}`} title="Export Chat">
                    <Download size={18} className="md:w-5 md:h-5" />
                 </button>
             )}

             <button onClick={() => setIsWideMode(!isWideMode)} className={`hidden md:block p-2.5 rounded-xl transition-colors ${isWideMode ? 'text-blue-500' : (isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5')}`} title="Wide Mode">
                {isWideMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
             </button>

             <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} className={`p-2 md:p-2.5 rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}>
                {isDark ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
             </button>
             
             {!isZenMode && (
                <button onClick={() => setIsControlsOpen(!isControlsOpen)} className={`p-2 md:p-2.5 rounded-xl transition-colors ${isControlsOpen ? 'bg-blue-500/20 text-blue-400' : (isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5')}`}>
                    <Box size={18} className="md:w-5 md:h-5" />
                </button>
             )}
          </div>
        </header>
        )}

        {/* --- MAIN CONTENT SWITCHER --- */}
        
        {currentView === 'codelab' && <CodeLab apiKey={apiKey} theme={theme} />}
        {currentView === 'prompt-studio' && <PromptStudio apiKey={apiKey} theme={theme} onUsePrompt={(p) => { setCurrentView('chat'); setPrompt(p); }} />}
        {currentView === 'vision-hub' && <VisionHub apiKey={apiKey} theme={theme} />}
        {currentView === 'data-analyst' && <DataAnalyst apiKey={apiKey} theme={theme} />}
        {currentView === 'doc-intel' && <DocIntel apiKey={apiKey} theme={theme} />}
        {currentView === 'cyber-house' && <CyberHouse apiKey={apiKey} theme={theme} />}
        {currentView === 'about' && <About theme={theme} onBack={() => setCurrentView('chat')} />}

        {/* Default Chat View */}
        {currentView === 'chat' && (
            <>
                {/* Chat Area - Scrollable */}
                <div 
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    className={`flex-1 min-h-0 overflow-y-auto px-2 md:px-4 py-4 custom-scrollbar scroll-smooth relative ${isWideMode ? 'max-w-[1600px] mx-auto w-full px-8' : 'max-w-4xl mx-auto w-full'}`}
                >
                {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center select-none text-center">
                        <div className="mb-6 md:mb-8 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                            <div className={`relative z-10 p-5 md:p-6 rounded-3xl ${isDark ? 'glass-dark' : 'glass-light'}`}>
                                <CipherLogo className="w-16 h-16 md:w-20 md:h-20 text-blue-500" />
                            </div>
                        </div>
                        <h1 className={`text-3xl md:text-4xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Cipher Studio</h1>
                        <p className="text-gray-500 mb-8 md:mb-10 max-w-sm text-base md:text-lg font-light">Advanced reasoning. Beautifully designed.</p>
                        
                        <div className="flex gap-4 text-xs font-mono text-gray-400">
                                <span className={`px-3 py-1.5 rounded-md border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>Shift + Enter to run</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 md:space-y-8 pb-32 pt-2 md:pt-4">
                        {/* Pinned Messages Area */}
                        {history.filter(m => m.pinned).length > 0 && (
                            <div className={`mb-6 md:mb-8 p-4 md:p-5 rounded-2xl border-l-4 border-blue-500 shadow-lg ${isDark ? 'bg-black/30 border-y border-r border-white/5' : 'bg-white/60 border-y border-r border-gray-200'} backdrop-blur-md`}>
                                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-blue-500">
                                    <Pin size={12} fill="currentColor" /> Pinned Context
                                </div>
                                <div className="space-y-2">
                                    {history.filter(m => m.pinned).map(msg => (
                                        <div key={msg.id} className="text-sm opacity-80 truncate cursor-pointer hover:opacity-100 hover:text-blue-400 transition-colors" onClick={() => {
                                            togglePin(history.findIndex(h => h.id === msg.id));
                                        }}>
                                            {msg.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {history.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 md:gap-5 group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                
                                {msg.role === 'model' && (
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${isDark ? 'bg-gradient-to-br from-[#2a2a35] to-[#1a1a20] text-blue-400 border border-white/5' : 'bg-white text-blue-600 border border-gray-100'}`}>
                                        <CipherLogo className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                )}

                                <div className={`flex flex-col max-w-[90%] md:max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 md:px-6 py-3 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] relative shadow-md backdrop-blur-sm ${
                                        msg.role === 'user' 
                                        ? (isDark ? 'bg-[#27272a]/90 border border-white/10 text-white rounded-tr-sm' : 'bg-blue-600 text-white shadow-blue-500/20 rounded-tr-sm')
                                        : (isDark ? 'glass-dark rounded-tl-sm' : 'glass-light rounded-tl-sm')
                                    }`}>
                                        {/* Attachments */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="flex gap-3 mb-4 flex-wrap">
                                                {msg.attachments.map((att, i) => (
                                                    <img 
                                                        key={i} 
                                                        src={`data:${att.mimeType};base64,${att.data}`} 
                                                        className="h-32 md:h-40 rounded-xl border border-white/10 object-cover cursor-pointer hover:scale-105 transition-transform shadow-lg" 
                                                        onClick={() => setLightboxImage(`data:${att.mimeType};base64,${att.data}`)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        
                                        {msg.role === 'user' ? (
                                            <div className="whitespace-pre-wrap text-[0.9rem] md:text-[0.95rem] leading-6 md:leading-7 font-light">{msg.text}</div>
                                        ) : (
                                            <>
                                                <MarkdownRenderer content={msg.text} theme={theme} />
                                                
                                                {/* Grounding / Search Sources */}
                                                {msg.groundingMetadata && msg.groundingMetadata.groundingChunks?.length > 0 && (
                                                    <div className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 flex items-center gap-1">
                                                            <Globe size={10} /> Sources
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {msg.groundingMetadata.groundingChunks.map((chunk, i) => (
                                                                chunk.web && (
                                                                    <a 
                                                                        key={i} 
                                                                        href={chunk.web.uri} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className={`text-xs px-2 py-1 rounded-md transition-colors truncate max-w-[200px] flex items-center gap-1.5 ${isDark ? 'bg-white/5 hover:bg-white/10 text-blue-300' : 'bg-black/5 hover:bg-black/10 text-blue-600'}`}
                                                                    >
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>
                                                                        {chunk.web.title}
                                                                    </a>
                                                                )
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    {msg.role === 'model' && !isStreaming && (
                                        <div className="mt-2 ml-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-2 md:group-hover:translate-y-0">
                                            <button onClick={() => speakText(msg.text)} className="p-1.5 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-white/5"><Volume2 size={14} /></button>
                                            <button onClick={() => navigator.clipboard.writeText(msg.text)} className="p-1.5 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-white/5"><Copy size={14} /></button>
                                            <button onClick={() => togglePin(idx)} className={`p-1.5 rounded-lg hover:bg-white/5 ${msg.pinned ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}><Pin size={14} fill={msg.pinned ? "currentColor" : "none"}/></button>
                                            <div className="h-3 w-[1px] bg-gray-600/30 mx-1"></div>
                                            <button onClick={() => handleTextAction('shorter', msg.text)} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 border border-transparent hover:border-white/5">Shorten</button>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${isDark ? 'bg-gray-800 text-gray-300 border border-white/5' : 'bg-gray-200 text-gray-600'}`}>
                                        <UserCircle size={20} className="md:w-6 md:h-6" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isStreaming && (
                            <div className="flex gap-3 md:gap-5">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse ${isDark ? 'bg-[#1e1e1e] text-blue-400' : 'bg-white text-blue-600'}`}>
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div className="flex items-center gap-3 h-10">
                                    <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-sm font-mono text-gray-500">Processing complex reasoning...</span>
                                </div>
                            </div>
                        )}
                        <div ref={outputEndRef} />
                    </div>
                )}
                </div>

                {/* Scroll Button - Floating 3D */}
                {showScrollButton && (
                    <button 
                        onClick={scrollToBottom}
                        className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-2 md:p-3 rounded-full shadow-2xl z-20 hover:scale-110 transition-transform border-4 border-white/10 backdrop-blur-sm"
                    >
                        <ArrowDownCircle size={20} className="md:w-6 md:h-6" />
                    </button>
                )}

                {/* 3. INPUT AREA - FLOATING 3D CAPSULE */}
                <div className="flex-shrink-0 px-2 md:px-4 pb-4 md:pb-6 pt-2 relative z-30">
                    <div className={`
                        ${isWideMode ? 'max-w-5xl' : 'max-w-3xl'} mx-auto 
                        rounded-[1.5rem] md:rounded-[2rem] p-1.5 md:p-2 relative transition-all
                        ${isDark ? 'glass-3d-input-dark' : 'glass-3d-input-light'}
                    `}>
                        {attachments.length > 0 && (
                            <div className="flex gap-3 px-4 pt-3 pb-2 overflow-x-auto">
                                {attachments.map((att, idx) => (
                                    <div key={idx} className="relative group flex-shrink-0">
                                        <img src={`data:${att.mimeType};base64,${att.data}`} className="h-14 w-14 md:h-16 md:w-16 object-cover rounded-xl border border-white/10 shadow-md" />
                                        <button 
                                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-end gap-2 md:gap-3 px-2 md:px-3 pb-1">
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                            
                            <button onClick={() => fileInputRef.current?.click()} className={`p-2 md:p-3 rounded-2xl mb-1 transition-all duration-200 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}>
                                <ImageIcon size={20} className="md:w-[22px] md:h-[22px]" />
                            </button>
                            
                            <textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRun(); } }}
                                placeholder={isRecording ? "Listening..." : "Ask anything..."}
                                className={`w-full bg-transparent py-3 md:py-4 max-h-[150px] md:max-h-[200px] min-h-[50px] md:min-h-[56px] outline-none resize-none text-[0.95rem] md:text-[1rem] leading-relaxed placeholder-gray-500/80 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
                                rows={1}
                            />

                            <div className="flex items-center gap-1 md:gap-2 mb-1">
                                <button onClick={toggleRecording} className={`p-2 md:p-3 rounded-2xl transition-all ${isRecording ? 'text-red-500 bg-red-500/10' : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50')}`}>
                                    <AudioVisualizer isActive={isRecording} />
                                </button>
                                
                                {isStreaming ? (
                                    <button className="p-2 md:p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20" onClick={() => window.location.reload()}>
                                        <StopCircle size={20} className="md:w-[22px] md:h-[22px]" />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleRun()}
                                        disabled={!prompt.trim() && attachments.length === 0}
                                        className={`p-2 md:p-3 rounded-2xl transition-all shadow-lg ${
                                            prompt.trim() || attachments.length > 0 
                                            ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
                                            : (isDark ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                                        }`}
                                    >
                                        <Send size={20} className="md:w-[22px] md:h-[22px]" fill="currentColor" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="max-w-3xl mx-auto flex justify-between items-center mt-2 md:mt-4 px-2 md:px-4 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                            <span className="hidden md:flex items-center gap-1.5 cursor-help" title="Estimated tokens"><Calculator size={12}/> {Math.ceil(tokenCount)} tokens</span>
                            <button onClick={() => setSelectedVoice(prev => prev === 'male' ? 'female' : prev === 'female' ? 'robot' : 'male')} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors uppercase font-bold tracking-wide text-[10px]">
                                {selectedVoice}
                            </button>
                        </div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-600">
                            Gemini 2.5 Flash
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* 4. SETTINGS PANEL - Glassmorphism */}
        {!isZenMode && (
            <ControlPanel config={config} onChange={setConfig} isOpen={isControlsOpen} togglePanel={() => setIsControlsOpen(false)} theme={theme} />
        )}

        {/* Lightbox */}
        {lightboxImage && (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300" onClick={() => setLightboxImage(null)}>
                <img src={lightboxImage} className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/10" />
                <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                    <X size={24} className="md:w-8 md:h-8" />
                </button>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
