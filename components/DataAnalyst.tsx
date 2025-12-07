
import React, { useState } from 'react';
import { streamContent } from '../services/geminiService';
import { ModelConfig, ModelName, Theme, DEFAULT_CONFIG } from '../types';
import { BarChart2, PieChart, TrendingUp, Play, Loader2, Code as CodeIcon } from 'lucide-react';

interface DataAnalystProps {
    apiKey: string;
    theme: Theme;
}

const DataAnalyst: React.FC<DataAnalystProps> = ({ apiKey, theme }) => {
    const isDark = theme === 'dark';
    const [dataInput, setDataInput] = useState('');
    const [chartCode, setChartCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleVisualize = async () => {
        if (!dataInput || isGenerating) return;
        setIsGenerating(true);
        setChartCode('');

        const systemInstruction = `
            You are a Data Visualization Expert. 
            Your goal is to take raw text, CSV, or JSON data provided by the user and turn it into a beautiful, modern HTML Chart using Chart.js.

            RULES:
            1. Output a SINGLE HTML file containing the Chart.js CDN logic.
            2. The design must be modern. Use a dark theme if specified, otherwise light.
            3. Make the charts interactive and animated.
            4. Do not include markdown ticks like \`\`\`html. Just return the raw HTML code.
            5. Ensure the chart takes up the full width/height of the window.
            6. Use nice colors (gradients if possible) that match a professional dashboard.
        `;

        const config: ModelConfig = {
            ...DEFAULT_CONFIG,
            model: ModelName.FLASH,
            systemInstruction
        };

        try {
            const prompt = `Create a visualization for this data. If the user didn't specify chart type, pick the best one: ${dataInput}. Theme: ${theme}`;
            
            await streamContent(apiKey, prompt, [], [], config, (chunk) => {
                const cleanChunk = chunk.replace(/```html/g, '').replace(/```/g, '');
                setChartCode(cleanChunk);
            });
        } catch (error) {
            console.error(error);
            setChartCode("Error generating visualization.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden max-w-[1600px] mx-auto w-full">
            <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <BarChart2 className="text-green-500" /> Data Analyst
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Turn raw numbers into interactive visual insights.</p>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Input Section */}
                <div className={`lg:w-1/3 flex flex-col gap-4`}>
                    <div className={`flex-1 rounded-2xl border flex flex-col p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <label className={`text-xs font-bold uppercase tracking-widest mb-3 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Data Source</label>
                        <textarea 
                            value={dataInput}
                            onChange={(e) => setDataInput(e.target.value)}
                            placeholder="Paste CSV, JSON, or just describe your data (e.g., 'Q1 Sales: 50k, Q2: 75k...')"
                            className={`flex-1 w-full bg-transparent resize-none outline-none text-sm font-mono leading-relaxed ${isDark ? 'text-gray-300 placeholder-gray-600' : 'text-gray-800'}`}
                        />
                    </div>
                    
                    <button 
                        onClick={handleVisualize}
                        disabled={isGenerating || !dataInput}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                        Visualize Data
                    </button>
                </div>

                {/* Output/Chart Section */}
                <div className={`flex-1 rounded-2xl border overflow-hidden relative flex flex-col ${isDark ? 'bg-[#121212] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    {chartCode ? (
                        <iframe 
                            srcDoc={chartCode}
                            className="w-full h-full border-0"
                            title="Chart Visualization"
                            sandbox="allow-scripts"
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-4">
                            <div className="flex gap-4">
                                <PieChart size={48} />
                                <TrendingUp size={48} />
                            </div>
                            <span className="text-sm font-medium">Visualization Dashboard</span>
                        </div>
                    )}
                    
                    {chartCode && (
                        <div className="absolute top-4 right-4 flex gap-2">
                             <button 
                                onClick={() => navigator.clipboard.writeText(chartCode)}
                                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-md transition-colors"
                                title="Copy HTML Code"
                             >
                                <CodeIcon size={16} />
                             </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataAnalyst;
