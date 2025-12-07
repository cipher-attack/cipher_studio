
import React from 'react';
import { Session, Theme, ViewMode } from '../types';
import { Plus, MessageSquare, Menu, Trash2, X, Key, Code, Sparkles, Eye, LayoutGrid, BarChart2, FileText, Shield, User } from 'lucide-react';

interface SidebarProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  theme: Theme;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const CipherLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M 75 25 L 35 25 L 15 50 L 35 75 L 75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="40" cy="50" r="10" stroke="currentColor" strokeWidth="6" />
    <path d="M 50 50 L 85 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 68 50 L 68 62" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 78 50 L 78 58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewSession, 
  onDeleteSession,
  isOpen,
  toggleSidebar,
  theme,
  apiKey,
  onApiKeyChange,
  currentView,
  onViewChange
}) => {
  const isDark = theme === 'dark';

  const NavItem = ({ view, icon: Icon, label, highlight = false }: { view: ViewMode, icon: any, label: string, highlight?: boolean }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`
        flex items-center gap-3 w-full rounded-xl p-2.5 transition-all mb-1
        ${currentView === view 
          ? (isDark ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-100') 
          : (isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5')
        }
        ${highlight && currentView !== view ? (isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600') : ''}
        ${isOpen ? '' : 'justify-center'}
      `}
      title={label}
    >
      <Icon size={18} className={highlight && currentView !== view ? "animate-pulse" : ""} />
      {isOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed md:relative top-0 left-0 h-[calc(100vh-24px)] z-40 my-3 ml-3 rounded-2xl
        ${isOpen ? 'w-[280px]' : 'w-0 md:w-[70px]'} 
        transition-all duration-300 ease-in-out
        flex flex-col flex-shrink-0
        glass-panel ${isDark ? 'glass-dark' : 'glass-light'}
        overflow-hidden border-r-0 shadow-2xl
      `}>
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}>
              <Menu size={20} />
            </button>
            <div className={`flex items-center gap-2 ${!isOpen && 'md:hidden'}`}>
                {isOpen && <CipherLogo className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
                <span className={`font-bold text-xl tracking-tight whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Cipher Studio
                </span>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-500">
             <X size={20} />
          </button>
        </div>

        {/* Modules Navigation - The "Hard Part" */}
        <div className={`px-3 py-2 ${isOpen ? '' : 'items-center flex flex-col'}`}>
            {isOpen && <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-2 opacity-60 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Modules</div>}
            
            <NavItem view="chat" icon={MessageSquare} label="Chat & Reason" />
            <NavItem view="prompt-studio" icon={Sparkles} label="Prompt Studio" />
            <NavItem view="codelab" icon={Code} label="Code Lab" />
            <NavItem view="vision-hub" icon={Eye} label="Vision Hub" />
            <NavItem view="data-analyst" icon={BarChart2} label="Data Analyst" />
            <NavItem view="doc-intel" icon={FileText} label="Doc Intel" />
            <div className={`my-1 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}></div>
            <NavItem view="cyber-house" icon={Shield} label="Cyber House" highlight={true} />
        </div>

        <div className={`my-2 mx-4 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}></div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
           {isOpen && <div className={`flex items-center justify-between px-3 py-2 mb-1`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>History</span>
                <button onClick={onNewSession} className="text-blue-500 hover:text-blue-400 transition-colors">
                    <Plus size={16} />
                </button>
           </div>}
           
           {sessions.map(session => (
             <div 
               key={session.id}
               onClick={() => {
                   onSelectSession(session.id);
                   onViewChange('chat'); // Switch back to chat when selecting a session
                   if (window.innerWidth < 768) toggleSidebar();
               }}
               className={`
                 group flex items-center justify-between h-10 rounded-lg cursor-pointer text-xs mb-1 transition-all
                 ${isOpen ? 'px-3' : 'justify-center px-2'}
                 ${currentSessionId === session.id && currentView === 'chat'
                    ? (isDark ? 'bg-white/10 text-white font-medium border border-white/5' : 'bg-white text-gray-900 font-medium shadow-sm') 
                    : (isDark ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200' : 'text-gray-600 hover:bg-white/50')
                 }
               `}
               title={session.title}
             >
               <div className="flex items-center gap-3 overflow-hidden">
                 <MessageSquare size={14} className={currentSessionId === session.id && currentView === 'chat' ? (isDark ? "text-blue-400" : "text-blue-600") : "text-gray-500"} />
                 {isOpen && <span className="truncate opacity-90">{session.title}</span>}
               </div>
               
               {isOpen && (
                 <button 
                   onClick={(e) => onDeleteSession(e, session.id)}
                   className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 rounded hover:bg-white/10 transition-all"
                 >
                   <Trash2 size={12} />
                 </button>
               )}
             </div>
           ))}
        </div>
        
        <div className="px-3 pb-2">
            <NavItem view="about" icon={User} label="About Dev" />
        </div>

        {/* API Key Input Section */}
        <div className={`mt-auto p-4 border-t flex-shrink-0 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
           <div className={`flex flex-col gap-2 ${isOpen ? 'opacity-100' : 'hidden'}`}>
                <label className={`text-[10px] font-bold uppercase tracking-widest opacity-50 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Custom API Key</label>
                <div className="relative group">
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                        placeholder="Paste Key..."
                        className={`w-full bg-transparent border rounded-lg pl-3 pr-8 py-2.5 text-xs outline-none transition-all
                        ${isDark ? 'border-white/10 focus:border-blue-500 text-white bg-black/20' : 'border-gray-200 focus:border-blue-500 text-gray-800 bg-white/50'}`}
                    />
                    <Key size={14} className="absolute right-3 top-2.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
           </div>
           
           {!isOpen && (
               <div className="flex justify-center" title="Set API Key">
                   <div className={`p-2 rounded-xl ${apiKey ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500'}`}>
                       <Key size={20} />
                   </div>
               </div>
           )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;