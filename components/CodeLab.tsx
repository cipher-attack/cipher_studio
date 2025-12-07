
import React, { useState } from 'react';
import { streamContent } from '../services/geminiService';
import { ModelConfig, ModelName, Theme, DEFAULT_CONFIG } from '../types';
import { Play, Code as CodeIcon, Monitor, Download, RefreshCw, Loader2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface CodeLabProps {
    apiKey: string;
    theme: Theme;
}

const CodeLab: React.FC<CodeLabProps> = ({ apiKey, theme }) => {
    const isDark = theme === 'dark';
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewMode, setViewMode] = useState<'code' | 'preview' | 'split'>('split');

    const handleGenerate = async () => {
        if (!prompt || isGenerating) return;
        setIsGenerating(true);
        setCode('');

        const systemInstruction = `
            You are an expert Frontend Developer. 
            The user wants you to build a single-file HTML application (HTML + CSS + JS).
            
            RULES:
            1. Return ONLY the raw HTML code. Do not wrap it in markdown blocks (like \`\`\`html).
            2. The code must be a complete, working HTML file.
            3. Use Tailwind CSS via CDN for styling if needed.
            4. Make it look modern, clean, and professional.
            5. Do not add explanations. Just the code.
        `;

        const config: ModelConfig = {
            ...DEFAULT_CONFIG,
            model: ModelName.FLASH,
            systemInstruction
        };

        try {
            await streamContent(apiKey, prompt, [], [], config, (chunk) => {
                // Simple cleaning if the model accidentally adds markdown despite instructions
                const cleanChunk = chunk.replace(/```html/g, '').replace(/```/g, '');
                setCode(cleanChunk);
            });
        } catch (error) {
            console.error(error);
            setCode("Error generating code. Please check your API key.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Code Lab</h1>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Generate and preview web apps instantly.</p>
                </div>
                <div className={`flex bg-black/5 dark:bg-white/5 p-1 rounded-lg`}>
                    {(['code', 'split', 'preview'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setViewMode(m)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${viewMode === m ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-black shadow-sm') : 'text-gray-500'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A calculator with a dark neon theme..."
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    className={`flex-1 px-4 py-3 rounded-xl border outline-none ${isDark ? 'bg-black/20 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                    Build
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 flex gap-4">
                
                {/* Code Editor */}
                {(viewMode === 'code' || viewMode === 'split') && (
                    <div className={`flex-1 rounded-2xl overflow-hidden border flex flex-col ${isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className={`h-10 border-b flex items-center justify-between px-4 ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                            <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                                <CodeIcon size={14} /> index.html
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(code)} className="text-xs hover:text-blue-500 transition-colors">Copy</button>
                        </div>
                        <div className="flex-1 overflow-auto p-0 text-sm font-mono custom-scrollbar">
                             <textarea 
                                readOnly 
                                value={code} 
                                className="w-full h-full bg-transparent p-4 outline-none resize-none"
                                spellCheck={false}
                             />
                        </div>
                    </div>
                )}

                {/* Preview */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                    <div className={`flex-1 rounded-2xl overflow-hidden border flex flex-col relative ${isDark ? 'bg-white border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                        <div className={`h-10 border-b flex items-center justify-between px-4 bg-gray-100 border-gray-200 text-gray-600`}>
                            <div className="flex items-center gap-2 text-xs font-mono">
                                <Monitor size={14} /> Preview
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                        </div>
                        {code ? (
                            <iframe 
                                srcDoc={code}
                                className="w-full h-full bg-white"
                                sandbox="allow-scripts"
                                title="preview"
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                                <CodeIcon size={48} className="opacity-20" />
                                <span className="text-sm">Generated app will appear here</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeLab;
