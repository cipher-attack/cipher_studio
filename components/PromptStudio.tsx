
import React, { useState } from 'react';
import { streamContent } from '../services/geminiService';
import { ModelConfig, ModelName, Theme, DEFAULT_CONFIG } from '../types';
import { Sparkles, ArrowRight, Check, Copy, Zap, Wand2, Loader2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface PromptStudioProps {
    apiKey: string;
    theme: Theme;
    onUsePrompt: (prompt: string) => void;
}

const PromptStudio: React.FC<PromptStudioProps> = ({ apiKey, theme, onUsePrompt }) => {
    const isDark = theme === 'dark';
    const [inputPrompt, setInputPrompt] = useState('');
    const [optimizedPrompt, setOptimizedPrompt] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleOptimize = async () => {
        if (!inputPrompt || isOptimizing) return;
        setIsOptimizing(true);
        setOptimizedPrompt('');
        setExplanation('');

        const systemInstruction = `
            You are a World-Class Prompt Engineer. Your goal is to take a basic user input and transform it into a highly effective, structured prompt for an LLM.
            
            OUTPUT FORMAT:
            Return the response in two distinct sections separated by "|||SEPARATOR|||".
            
            Section 1: The Optimized Prompt (Ready to Copy). Use techniques like Persona adoption, Chain of Thought, and Clear Constraints.
            Section 2: Brief explanation of what you changed and why (3-4 bullet points).

            Do not use markdown blocks for the optimized prompt section, just raw text.
        `;

        const config: ModelConfig = {
            ...DEFAULT_CONFIG,
            model: ModelName.FLASH,
            systemInstruction
        };

        let fullText = '';
        try {
            await streamContent(apiKey, `Optimize this prompt: "${inputPrompt}"`, [], [], config, (chunk) => {
                fullText = chunk;
                const parts = fullText.split("|||SEPARATOR|||");
                if (parts[0]) setOptimizedPrompt(parts[0].trim());
                if (parts[1]) setExplanation(parts[1].trim());
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar max-w-5xl mx-auto w-full">
            <div className="mb-8">
                <h1 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Sparkles className="text-yellow-500" /> Prompt Studio
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Transform basic ideas into professional-grade AI instructions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Input */}
                <div className="flex flex-col gap-4">
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <label className={`text-xs font-bold uppercase tracking-widest mb-3 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Original Idea</label>
                        <textarea 
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            placeholder="e.g., Write a blog post about coffee..."
                            className={`w-full h-40 bg-transparent resize-none outline-none text-lg leading-relaxed ${isDark ? 'text-white placeholder-gray-600' : 'text-gray-800'}`}
                        />
                        <div className="flex justify-end mt-2">
                            <button 
                                onClick={handleOptimize}
                                disabled={isOptimizing || !inputPrompt}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                            >
                                {isOptimizing ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                                Enhance Prompt
                            </button>
                        </div>
                    </div>

                    {explanation && (
                         <div className={`p-5 rounded-2xl border ${isDark ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                            <div className="flex items-center gap-2 mb-3 text-blue-500 font-bold text-xs uppercase tracking-widest">
                                <Zap size={14} /> Optimization Strategy
                            </div>
                            <MarkdownRenderer content={explanation} theme={theme} />
                         </div>
                    )}
                </div>

                {/* Right: Output */}
                <div className="flex flex-col h-full">
                    <div className={`flex-1 p-1 rounded-2xl border relative flex flex-col ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                         <div className={`absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-[#0a0a0a] text-green-400' : 'bg-gray-50 text-green-600'}`}>
                            Optimized Result
                         </div>
                         
                         <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                             {optimizedPrompt ? (
                                 <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                     {optimizedPrompt}
                                 </pre>
                             ) : (
                                 <div className="h-full flex flex-col items-center justify-center opacity-20">
                                     <Sparkles size={48} />
                                     <span className="mt-2 text-sm">Waiting for input...</span>
                                 </div>
                             )}
                         </div>

                         {optimizedPrompt && (
                             <div className={`p-4 border-t flex justify-end gap-3 ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-white'}`}>
                                 <button 
                                    onClick={() => navigator.clipboard.writeText(optimizedPrompt)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                                 >
                                     Copy
                                 </button>
                                 <button 
                                    onClick={() => onUsePrompt(optimizedPrompt)}
                                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-green-500/20"
                                 >
                                     <ArrowRight size={16} />
                                     Use in Chat
                                 </button>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptStudio;
