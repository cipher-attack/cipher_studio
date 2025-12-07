import React, { useState, useRef } from 'react';
import { streamContent } from '../services/geminiService';
import { ModelConfig, ModelName, Theme, DEFAULT_CONFIG, Attachment } from '../types';
import { Eye, Upload, Image as ImageIcon, ScanText, Search, Loader2, Code, FileCode2, ShieldAlert } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface VisionHubProps {
    apiKey: string;
    theme: Theme;
}

const VisionHub: React.FC<VisionHubProps> = ({ apiKey, theme }) => {
    const isDark = theme === 'dark';
    const [image, setImage] = useState<Attachment | null>(null);
    const [result, setResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                setImage({ mimeType: file.type, data: base64Data });
                setResult('');
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async (mode: 'describe' | 'extract' | 'analyze' | 'code' | 'threat') => {
        if (!image || isAnalyzing) return;
        setIsAnalyzing(true);
        setResult('');

        let prompt = "";
        let systemInfo = "You are an expert Computer Vision assistant.";

        switch(mode) {
            case 'describe': prompt = "Describe this image in vivid detail. What is happening?"; break;
            case 'extract': prompt = "Extract all visible text from this image exactly as it appears. Format it cleanly."; break;
            case 'analyze': prompt = "Analyze this image professionally. Identify objects, artistic style, colors, and potential context."; break;
            case 'code': prompt = "Extract the code from this image. Return ONLY the valid code block, formatted correctly for the detected language."; break;
            case 'threat': 
                prompt = "Perform a SECURITY AUDIT on this image. Identify: 1. Phishing indicators (URL mismatches, fake logos). 2. Sensitive data exposure (PII, Credentials). 3. Physical security risks (if a photo). Format as a Threat Report."; 
                systemInfo = "You are a Cyber Security Image Analyst. Detect threats, phishing attempts, and sensitive data leakage.";
                break;
        }

        const config: ModelConfig = {
            ...DEFAULT_CONFIG,
            model: ModelName.PRO, // Use Pro for better vision
            systemInstruction: systemInfo
        };

        try {
            await streamContent(apiKey, prompt, [image], [], config, (chunk) => {
                setResult(chunk);
            });
        } catch (error) {
            console.error(error);
            setResult("Error analyzing image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden max-w-6xl mx-auto w-full">
            <div className="mb-8">
                <h1 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Eye className="text-purple-500" /> Vision Hub
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Advanced image analysis and text extraction.</p>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0">
                {/* Left: Image Upload & Preview */}
                <div className={`md:w-1/3 flex flex-col gap-4`}>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all p-4
                            ${isDark 
                                ? 'border-white/10 hover:border-blue-500/50 hover:bg-white/5' 
                                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}
                        `}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                        {image ? (
                            <img 
                                src={`data:${image.mimeType};base64,${image.data}`} 
                                className="max-h-full max-w-full object-contain rounded-lg shadow-lg" 
                            />
                        ) : (
                            <div className="text-center opacity-50">
                                <Upload size={48} className="mx-auto mb-4" />
                                <p className="font-medium">Click to Upload Image</p>
                                <p className="text-xs mt-2">JPG, PNG, WEBP</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => analyzeImage('describe')}
                            disabled={!image || isAnalyzing}
                            className="bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            <ImageIcon size={18} /> Describe
                        </button>
                        <button 
                            onClick={() => analyzeImage('extract')}
                            disabled={!image || isAnalyzing}
                            className="bg-green-600/10 text-green-500 hover:bg-green-600/20 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            <ScanText size={18} /> OCR Text
                        </button>
                        <button 
                            onClick={() => analyzeImage('code')}
                            disabled={!image || isAnalyzing}
                            className="bg-orange-600/10 text-orange-500 hover:bg-orange-600/20 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            <FileCode2 size={18} /> Code Ext.
                        </button>
                        <button 
                            onClick={() => analyzeImage('threat')}
                            disabled={!image || isAnalyzing}
                            className="bg-red-600/10 text-red-500 hover:bg-red-600/20 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            <ShieldAlert size={18} /> Threat Detect
                        </button>
                    </div>
                </div>

                {/* Right: Analysis Result */}
                <div className={`flex-1 rounded-2xl border overflow-hidden flex flex-col ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className={`h-12 border-b flex items-center px-6 font-bold tracking-wide text-xs uppercase ${isDark ? 'border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        Analysis Result
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                        {isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                                <Loader2 size={40} className="animate-spin text-blue-500" />
                                <span className={`text-sm animate-pulse ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Vision model is analyzing...</span>
                            </div>
                        ) : result ? (
                            <MarkdownRenderer content={result} theme={theme} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <Eye size={64} />
                                <span className="mt-4 text-sm">Upload an image and select a tool</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionHub;