
import React, { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';
import { Twitter, Youtube, Linkedin, Github, Pin as PinIcon, ExternalLink, ArrowLeft } from 'lucide-react';

interface AboutProps {
    theme: Theme;
    onBack: () => void;
}

// Reusing the Cipher Triangle Logo
const CipherLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M 75 25 L 35 25 L 15 50 L 35 75 L 75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="40" cy="50" r="10" stroke="currentColor" strokeWidth="6" />
    <path d="M 50 50 L 85 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 68 50 L 68 62" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M 78 50 L 78 58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const SocialShard = ({ 
    icon: Icon, 
    label, 
    url, 
    colorClass 
}: { 
    icon: any, 
    label: string, 
    url: string, 
    colorClass: string 
}) => {
    const [isShattered, setIsShattered] = useState(false);

    const handleClick = () => {
        setIsShattered(true);
        setTimeout(() => {
            window.open(url, '_blank');
            setTimeout(() => setIsShattered(false), 1000);
        }, 600);
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative group flex items-center justify-center p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md
                hover:scale-110 hover:border-white/30 hover:bg-white/5 transition-all duration-300 w-14 h-14 overflow-hidden
                ${isShattered ? 'pointer-events-none' : ''}
            `}
            title={label}
        >
            <div className={`relative z-10 transition-transform duration-200 ${isShattered ? 'scale-0' : 'scale-100'}`}>
                <Icon size={24} className={colorClass} />
            </div>

            {isShattered && (
                <>
                    <span className="absolute inset-0 bg-white animate-ping opacity-20"></span>
                    {[...Array(8)].map((_, i) => (
                        <span 
                            key={i}
                            className={`
                                absolute w-1/2 h-1/2 bg-current ${colorClass.replace('text-', 'bg-')} 
                                opacity-0 animate-shatter-${i % 4}
                            `}
                            style={{ 
                                left: '25%', 
                                top: '25%', 
                                transformOrigin: 'center',
                                clipPath: i % 2 === 0 ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 100%, 0 100%, 100% 0)'
                            }}
                        />
                    ))}
                </>
            )}

            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-tr from-transparent via-white to-transparent`} />
        </button>
    );
};

const TextScramble = ({ text, className }: { text: string, className?: string }) => {
    const [displayedText, setDisplayedText] = useState(text);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.split("").map((letter, index) => {
                if (index < iterations) return text[index];
                return letters[Math.floor(Math.random() * letters.length)];
            }).join(""));
            
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1/3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{displayedText}</span>;
}

const About: React.FC<AboutProps> = ({ theme, onBack }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    // Feature 1: Warp Speed Canvas Background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const stars: {x: number, y: number, z: number}[] = [];
        const numStars = 800;
        const speed = 2;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width/2,
                y: Math.random() * height - height/2,
                z: Math.random() * width
            });
        }

        const animate = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            stars.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.x = Math.random() * width - width/2;
                    star.y = Math.random() * height - height/2;
                    star.z = width;
                }

                const x = (star.x / star.z) * width/2 + width/2;
                const y = (star.y / star.z) * height/2 + height/2;
                const radius = Math.max(0, (1 - star.z/width) * 3);

                ctx.beginPath();
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animate);
        };
        const animId = requestAnimationFrame(animate);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setRotateY(((x - centerX) / centerX) * 20);
        setRotateX(((y - centerY) / centerY) * -20);
    };

    return (
        <div 
            className="h-full w-full relative overflow-hidden bg-black text-white perspective-container select-none"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
            style={{ perspective: '1200px' }}
        >
            {/* Feature 1: Canvas Warp Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

            {/* Feature 2: Floating Runes */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute text-green-500/10 font-mono text-4xl animate-float"
                        style={{ 
                            left: `${Math.random() * 100}%`, 
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${10 + Math.random() * 20}s`
                        }}
                    >
                        {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </div>
                ))}
            </div>

            {/* Feature 6: Return Portal Button */}
            <button 
                onClick={onBack}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 border border-green-500/30 text-green-400 font-mono text-xs hover:bg-green-500/10 hover:scale-105 transition-all group backdrop-blur-md rounded-lg"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="tracking-widest font-bold">SYSTEM RETURN</span>
            </button>

            {/* Main Holographic Card */}
            <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                <div 
                    className="
                        w-[90%] max-w-2xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 
                        shadow-[0_0_50px_rgba(0,255,100,0.05)] transition-transform duration-100 ease-out pointer-events-auto 
                        relative overflow-hidden group hover:shadow-[0_0_80px_rgba(59,130,246,0.2)]
                    "
                    style={{ 
                        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Feature 3: Holographic Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent h-[10px] w-full animate-scan pointer-events-none" />
                    
                    {/* Feature 7: Neon Breathing Border */}
                    <div className="absolute inset-0 border-2 border-transparent rounded-3xl group-hover:border-blue-500/30 transition-colors duration-500 pointer-events-none"></div>

                    {/* Feature 8: Data HUD */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1 text-[8px] font-mono text-gray-500">
                        <span>COORDS: {rotateX.toFixed(1)}, {rotateY.toFixed(1)}</span>
                        <span>SECURE: TRUE</span>
                        <span>LINK: STABLE</span>
                    </div>

                    <div className="relative z-20 flex flex-col items-center text-center" style={{ transform: 'translateZ(60px)' }}>
                        
                        {/* Feature 9: 3D Levitating Logo */}
                        <div className="mb-8 relative group cursor-default" style={{ transform: 'translateZ(40px)' }}>
                             <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-gray-900 to-black border border-white/20 flex items-center justify-center relative overflow-hidden shadow-2xl">
                                 <CipherLogo className="w-16 h-16 text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                 {/* Glitch Overlay */}
                                 <div className="absolute inset-0 bg-red-500/20 translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 mix-blend-color-dodge transition-opacity duration-75"></div>
                                 <div className="absolute inset-0 bg-blue-500/20 -translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 mix-blend-color-dodge transition-opacity duration-75"></div>
                             </div>
                             <div className="absolute -inset-4 rounded-full border border-blue-500/20 animate-spin-slow pointer-events-none"></div>
                        </div>

                        {/* Feature 4: Text Decoding */}
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 relative">
                            <TextScramble text="CIPHER ATTACK" className="hover:text-blue-400 transition-colors cursor-default" />
                        </h1>
                        
                        <h2 className="text-xl md:text-2xl font-mono text-blue-400 mb-6 flex items-center gap-3">
                             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
                             <span className="tracking-widest">BIRUK GETACHEW</span>
                        </h2>

                        <p className="text-gray-400 max-w-md mb-8 leading-relaxed font-light text-sm md:text-base border-t border-b border-white/5 py-4">
                            Red Teaming the Metaverse. <br/>
                            <span className="text-white font-medium">Cyber Security Specialist</span> & <span className="text-white font-medium">Creative Web Designer</span>. 
                        </p>
                        
                        {/* Feature 5: Audio Visualizer Bar (Fake) */}
                        <div className="flex items-center justify-center gap-1 h-8 mb-8 opacity-50">
                            {[...Array(20)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="w-1 bg-green-500 rounded-full animate-sound"
                                    style={{ 
                                        height: '20%', 
                                        animationDuration: `${0.5 + Math.random()}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Social Shards */}
                        <div className="flex gap-4 items-center justify-center" style={{ transform: 'translateZ(20px)' }}>
                            <SocialShard icon={Twitter} label="X" url="https://x.com/Cipher_attacks" colorClass="text-blue-400" />
                            <SocialShard icon={Youtube} label="YouTube" url="https://www.youtube.com/@cipher-atack" colorClass="text-red-500" />
                            <SocialShard icon={Github} label="GitHub" url="https://github.com/cipher-attack" colorClass="text-white" />
                            <SocialShard icon={Linkedin} label="LinkedIn" url="https://et.linkedin.com/in/cipher-attack-93582433b" colorClass="text-blue-600" />
                            <SocialShard icon={PinIcon} label="Pinterest" url="https://pin.it/3R6Nz" colorClass="text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: -10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
                .animate-scan { animation: scan 3s linear infinite; }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                @keyframes sound {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .animate-sound { animation: sound 1s ease-in-out infinite; }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }

                @keyframes shatter-0 { to { transform: translate(-50px, -50px) rotate(-45deg); opacity: 0; } }
                @keyframes shatter-1 { to { transform: translate(50px, -50px) rotate(45deg); opacity: 0; } }
                @keyframes shatter-2 { to { transform: translate(-50px, 50px) rotate(-135deg); opacity: 0; } }
                @keyframes shatter-3 { to { transform: translate(50px, 50px) rotate(135deg); opacity: 0; } }
            `}</style>
        </div>
    );
};

export default About;
