
import React, { useState } from 'react';
import { streamContent } from '../services/geminiService';
import { ModelConfig, ModelName, Theme, DEFAULT_CONFIG } from '../types';
import { FileText, Search, ShieldCheck, List, Lightbulb, Loader2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface DocIntelProps {
    apiKey: string;
    theme: Theme;
}

const DocIntel: React.FC<DocIntelProps> = ({ apiKey, theme }) => {
    const isDark = theme === 'dark';
    const [docText, setDocText] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const runAnalysis = async (mode: 'summary' | 'audit' | 'insights') => {
        if (!docText || isProcessing) return;
        setIsProcessing(true);
        setAnalysis('');

        let prompt = "";
        switch(mode) {
            case 'summary': prompt = "Provide a comprehensive executive summary of this document. Bullet points for key takeaways."; break;
            case 'audit': prompt = "Audit this text. Find potential risks, contradictions, legal loopholes, or weak arguments."; break;
            case 'insights': prompt = "Extract hidden insights, patterns, and actionable intelligence from this text that might not be immediately obvious."; break;
        }

        const config: ModelConfig = {
            ...DEFAULT_CONFIG,
            model: ModelName.PRO, // Pro is better for large context/reasoning
            systemInstruction: "You are a Senior Document Analyst. Your output should be structured, professional, and incredibly detailed."
        };

        try {
            // Include the text in the prompt context
            const fullPrompt = `${prompt}\n\nDOCUMENT:\n${docText}`;
            await streamContent(apiKey, fullPrompt, [], [], config, (chunk) => {
                setAnalysis(chunk);
            });
        } catch (error) {
            console.error(error);
            setAnalysis("Error processing document.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden max-w-[1600px] mx-auto w-full">
            <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <FileText className="text-orange-500" /> Doc Intel
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Deep document analysis, auditing, and intelligence extraction.</p>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Input Text */}
                <div className={`lg:w-1/2 flex flex-col gap-4`}>
                    <div className={`flex-1 rounded-2xl border flex flex-col p-0 overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className={`p-3 border-b text-xs font-bold uppercase tracking-widest ${isDark ? 'border-white/5 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                            Source Document
                        </div>
                        <textarea 
                            value={docText}
                            onChange={(e) => setDocText(e.target.value)}
                            placeholder="Paste contracts, reports, articles, or essays here..."
                            className={`flex-1 w-full bg-transparent p-4 resize-none outline-none text-sm leading-relaxed ${isDark ? 'text-gray-300 placeholder-gray-600' : 'text-gray-800'}`}
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                         <button onClick={() => runAnalysis('summary')} disabled={isProcessing || !docText} className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 py-3 rounded-xl font-medium flex flex-col items-center gap-1 transition-all">
                             <List size={18} /> <span className="text-xs">Summarize</span>
                         </button>
                         <button onClick={() => runAnalysis('audit')} disabled={isProcessing || !docText} className="bg-red-600/10 hover:bg-red-600/20 text-red-500 py-3 rounded-xl font-medium flex flex-col items-center gap-1 transition-all">
                             <ShieldCheck size={18} /> <span className="text-xs">Audit & Risk</span>
                         </button>
                         <button onClick={() => runAnalysis('insights')} disabled={isProcessing || !docText} className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 py-3 rounded-xl font-medium flex flex-col items-center gap-1 transition-all">
                             <Lightbulb size={18} /> <span className="text-xs">Deep Insights</span>
                         </button>
                    </div>
                </div>

                {/* Analysis Output */}
                <div className={`flex-1 rounded-2xl border overflow-hidden flex flex-col ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <div className={`p-3 border-b text-xs font-bold uppercase tracking-widest flex justify-between ${isDark ? 'border-white/5 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                        <span>Analysis Report</span>
                        {isProcessing && <Loader2 size={14} className="animate-spin" />}
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {analysis ? (
                            <MarkdownRenderer content={analysis} theme={theme} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
                                <Search size={48} />
                                <span className="text-sm">Awaiting content...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocIntel;
