import React from 'react';
import { ModelConfig, ModelName, Theme } from '../types';
import { Settings2, ChevronDown, ShieldAlert, Sliders } from 'lucide-react';

interface ControlPanelProps {
  config: ModelConfig;
  onChange: (newConfig: ModelConfig) => void;
  isOpen: boolean;
  togglePanel: () => void;
  theme: Theme;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, isOpen, togglePanel, theme }) => {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleChange = <K extends keyof ModelConfig>(key: K, value: ModelConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className={`
      fixed inset-y-0 right-0 w-[320px] z-50 transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      glass-panel ${isDark ? 'glass-dark' : 'glass-light'}
      m-3 rounded-2xl h-[calc(100vh-24px)] shadow-2xl flex flex-col overflow-y-auto
    `}>
      <div className={`h-16 border-b flex items-center justify-between px-6 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center gap-2">
            <Sliders size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            <h2 className={`font-bold text-sm tracking-wide ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>CONFIGURATION</h2>
        </div>
        <button onClick={togglePanel} className="text-gray-400 hover:text-current transition-colors">
          <Settings2 size={18} />
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Model Selection */}
        <div className="space-y-3">
          <label className={`text-[11px] font-bold uppercase tracking-widest block ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>AI Model</label>
          <div className="relative">
            <select 
              className={`
                w-full border rounded-xl px-4 py-3 text-sm outline-none appearance-none cursor-pointer transition-all shadow-sm
                ${isDark 
                  ? 'bg-black/20 border-white/10 text-gray-200 focus:border-blue-500 focus:bg-black/40' 
                  : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'}
              `}
              value={config.model}
              onChange={(e) => handleChange('model', e.target.value as ModelName)}
            >
              <option value={ModelName.FLASH}>Gemini 2.5 Flash (Fast)</option>
              <option value={ModelName.PRO}>Gemini 3.0 Pro (Deep)</option>
              <option value={ModelName.FLASH_LITE}>Gemini Flash Lite (Eco)</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Creativity (Temperature)</label>
             <input 
                type="number" 
                value={config.temperature}
                step={0.1}
                max={2}
                min={0}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className={`w-12 bg-transparent text-right text-xs outline-none border-b focus:border-blue-500 font-mono ${isDark ? 'text-blue-400 border-white/10' : 'text-blue-600 border-gray-300'}`}
             />
          </div>
          <div className={`relative w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-black/30' : 'bg-gray-200'}`}>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1" 
              value={config.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
             <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                style={{ width: `${(config.temperature / 2) * 100}%` }}
             ></div>
          </div>
        </div>

        {/* Output Length */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Max Response Length</label>
             <span className={`text-xs font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{config.maxOutputTokens}</span>
          </div>
          <div className={`relative w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-black/30' : 'bg-gray-200'}`}>
            <input 
              type="range" 
              min="100" 
              max="32000" 
              step="100" 
              value={config.maxOutputTokens}
              onChange={(e) => handleChange('maxOutputTokens', parseInt(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                style={{ width: `${(config.maxOutputTokens / 32000) * 100}%` }}
             ></div>
          </div>
        </div>

        {/* Safety Settings */}
        <div className={`space-y-4 pt-8 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center justify-between text-gray-500">
             <label className="text-[10px] font-bold uppercase tracking-widest">Compliance</label>
             <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20 font-medium">UNLOCKED</span>
          </div>
          <div className={`flex items-center gap-3 text-xs p-4 rounded-xl border ${isDark ? 'text-gray-400 bg-white/5 border-white/5' : 'text-gray-600 bg-white border-gray-100 shadow-sm'}`}>
             <ShieldAlert size={16} className="text-red-400 flex-shrink-0" />
             <span className="leading-relaxed">Safety filters disabled. The model will respond to all queries without refusal.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;