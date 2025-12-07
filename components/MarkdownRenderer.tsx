import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Theme } from '../types';

interface MarkdownRendererProps {
  content: string;
  theme?: Theme;
  onFocusMode?: boolean;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium bg-white/5 px-2 py-1 rounded hover:bg-white/10"
      title="Copy code"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme = 'dark', onFocusMode = false }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`
      prose prose-sm md:prose-base max-w-none w-full leading-7 
      ${isDark ? 'prose-invert text-[#e4e4e7]' : 'text-[#1f2937]'}
      font-mono text-[0.92rem] tracking-tight
      prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
      prose-p:leading-relaxed prose-li:marker:text-gray-500
      prose-strong:font-bold prose-strong:text-current
      prose-em:italic
      prose-code:before:content-none prose-code:after:content-none
    `}>
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : null;
            const codeText = String(children).replace(/\n$/, '');

            return language ? (
              <div className={`relative my-4 rounded-lg overflow-hidden border ${isDark ? 'border-white/10 bg-[#0d0d0d]' : 'border-gray-200 bg-white'}`}>
                
                {/* macOS Style Header */}
                <div className={`flex justify-between items-center px-4 py-2 border-b ${isDark ? 'bg-[#18181b] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                   <div className="flex items-center gap-2">
                       <span className={`text-xs font-mono font-medium opacity-60 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{language}</span>
                   </div>
                   <CopyButton text={codeText} />
                </div>

                <SyntaxHighlighter
                  style={isDark ? vscDarkPlus : ghcolors}
                  language={language}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: 0, padding: '1.25rem', background: isDark ? '#0a0a0a' : '#ffffff', fontSize: '13px', lineHeight: '1.6' }}
                  {...props}
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={`${isDark ? 'bg-[#1e1e1e] text-blue-300' : 'bg-gray-100 text-blue-700'} rounded-md px-1.5 py-0.5 font-mono text-[0.85em] font-medium border ${isDark ? 'border-white/10' : 'border-gray-200'}`} {...props}>
                {children}
              </code>
            );
          },
          h1: ({node, ...props}) => <h1 className={`text-2xl font-bold mb-4 mt-8 pb-2 border-b ${isDark ? 'text-white border-white/10' : 'text-gray-900 border-gray-200'}`} {...props} />,
          h2: ({node, ...props}) => <h2 className={`text-xl font-bold mb-3 mt-6 ${isDark ? 'text-blue-200' : 'text-blue-800'}`} {...props} />,
          p: ({node, ...props}) => <p className={`mb-4 leading-7 ${onFocusMode ? 'focus-item' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
          ul: ({node, ...props}) => <ul className={`list-disc pl-5 mb-4 space-y-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
          ol: ({node, ...props}) => <ol className={`list-decimal pl-5 mb-4 space-y-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
          blockquote: ({node, ...props}) => <blockquote className={`border-l-4 border-blue-500/50 pl-4 py-1 italic my-4 rounded-r-lg ${isDark ? 'bg-blue-900/10 text-blue-200' : 'bg-blue-50 text-blue-800'}`} {...props} />,
          a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 hover:underline decoration-1 underline-offset-4 transition-colors font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;