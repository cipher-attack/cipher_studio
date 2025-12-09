import React, { memo } from 'react';
import { ChatMessage, Theme } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Globe, UserCircle, Volume2, Copy, Pin, X } from 'lucide-react';

interface ChatMessageItemProps {
    msg: ChatMessage;
    index: number;
    theme: Theme;
    isStreaming: boolean;
    isLast: boolean;
    onLightbox: (src: string) => void;
    onSpeak: (text: string) => void;
    onPin: (index: number) => void;
    onTextAction: (action: string, text: string) => void;
}

// Cipher Logo Component duplicated here to avoid circular dependencies or complex exports
const CipherLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M 75 25 L 35 25 L 15 50 L 35 75 L 75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="40" cy="50" r="10" stroke="currentColor" strokeWidth="6" />
    <path d="M 50 50 L 85 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 68 50 L 68 62" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 78 50 L 78 58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
    msg,
    index,
    theme,
    isStreaming,
    isLast,
    onLightbox,
    onSpeak,
    onPin,
    onTextAction
}) => {
    const isDark = theme === 'dark';

    return (
        <div className={`flex gap-3 md:gap-5 group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.role === 'model' && (
                // CHANGED: Removed background colors, borders, and shadows. 
                // Increased logo size to allow it to stand out without the box.
                <div className={`flex items-start pt-1 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    <CipherLogo className="w-8 h-8 md:w-9 md:h-9 filter drop-shadow-md" />
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
                                    onClick={() => onLightbox(`data:${att.mimeType};base64,${att.data}`)}
                                />
                            ))}
                        </div>
                    )}
                    
                    {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap text-[0.9rem] md:text-[0.95rem] leading-6 md:leading-7 font-light">{msg.text}</div>
                    ) : (
                        <>
                            {/* PASSED isStreaming TO DISABLE HEAVY RENDERING DURING TYPING */}
                            <MarkdownRenderer content={msg.text} theme={theme} isStreaming={isStreaming && isLast} />
                            
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
                {msg.role === 'model' && (!isStreaming || !isLast) && (
                    <div className="mt-2 ml-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-2 md:group-hover:translate-y-0">
                        <button onClick={() => onSpeak(msg.text)} className="p-1.5 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-white/5"><Volume2 size={14} /></button>
                        <button onClick={() => navigator.clipboard.writeText(msg.text)} className="p-1.5 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-white/5"><Copy size={14} /></button>
                        <button onClick={() => onPin(index)} className={`p-1.5 rounded-lg hover:bg-white/5 ${msg.pinned ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}><Pin size={14} fill={msg.pinned ? "currentColor" : "none"}/></button>
                        <div className="h-3 w-[1px] bg-gray-600/30 mx-1"></div>
                        <button onClick={() => onTextAction('shorter', msg.text)} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 border border-transparent hover:border-white/5">Shorten</button>
                    </div>
                )}
            </div>

            {msg.role === 'user' && (
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${isDark ? 'bg-gray-800 text-gray-300 border border-white/5' : 'bg-gray-200 text-gray-600'}`}>
                    <UserCircle size={20} className="md:w-6 md:h-6" />
                </div>
            )}
        </div>
    );
};

// Custom equality check to strictly optimize performance
const arePropsEqual = (prevProps: ChatMessageItemProps, nextProps: ChatMessageItemProps) => {
    // If the message ID changed, it's a different message -> Re-render
    if (prevProps.msg.id !== nextProps.msg.id) return false;
    
    // If text content changed (streaming update), Re-render
    if (prevProps.msg.text !== nextProps.msg.text) return false;

    // If streaming status changed (affects cursor/actions), Re-render
    if (prevProps.isStreaming !== nextProps.isStreaming) return false;
    
    // If 'isLast' status changed (affects actions visibility), Re-render
    if (prevProps.isLast !== nextProps.isLast) return false;

    // If pinned status changed, Re-render
    if (prevProps.msg.pinned !== nextProps.msg.pinned) return false;
    
    // If grounding metadata arrived, Re-render
    if (prevProps.msg.groundingMetadata !== nextProps.msg.groundingMetadata) return false;

    // If theme changed, Re-render
    if (prevProps.theme !== nextProps.theme) return false;

    // Otherwise, DO NOT Re-render (ignore function prop reference changes)
    return true;
};

export default memo(ChatMessageItem, arePropsEqual);
