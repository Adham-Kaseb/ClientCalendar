import React, { useEffect, useState } from 'react';
import { Calendar, Crown, CheckCircle2, Terminal, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '../types/database';

interface SplashLoaderProps {
  userName: string;
  userRole: UserRole;
  onComplete: () => void;
}

// Code Snippets Stream with Syntax Meta
const CODE_SNIPPETS = [
  { line: "// 🚀 TimeValley Realtime Calendar Engine...", color: "text-emerald-400" },
  { line: "const client = 'Dr. Wael'; // Project Client", color: "text-[#38BDF8]" },
  { line: "const executor = 'Adham Kaseb'; // Fullstack Dev", color: "text-amber-300" },
  { line: "async function syncSupabaseLogs() {", color: "text-purple-300" },
  { line: "  const { data } = await supabase.from('logs').select();", color: "text-cyan-200" },
  { line: "  return data.filter(log => log.status === 'completed');", color: "text-emerald-300" },
  { line: "}", color: "text-purple-300" },
  { line: "console.log('✓ Realtime Websockets Active');", color: "text-emerald-400 font-extrabold" }
];

export const SplashLoader: React.FC<SplashLoaderProps> = ({
  userName,
  userRole,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [typedIndex, setTypedIndex] = useState<number>(0);

  useEffect(() => {
    // Progress loader interval
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2.5));
    }, 40);

    // Live Typewriter character index counter
    const typewriterInterval = setInterval(() => {
      setTypedIndex((prev) => (prev < 320 ? prev + 1 : prev));
    }, 18);

    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(typewriterInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Helper to slice character stream
  const getTypedSnippet = (snippetText: string, offset: number) => {
    const startOffset = offset * 35;
    if (typedIndex < startOffset) return "";
    const charCount = typedIndex - startOffset;
    return snippetText.slice(0, charCount);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-[#051C22] text-white flex flex-col items-center justify-center p-6 font-tajawal select-none overflow-hidden">
      
      {/* 1. Cyberpunk Ambient Lighting Glow Spotlights */}
      <div className="absolute top-0 right-0 w-[650px] h-[650px] rounded-full bg-[#0E6875]/30 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full bg-[#EE6C4D]/25 blur-[150px] pointer-events-none animate-pulse" />

      {/* 2. Left Floating IDE Terminal Window */}
      <div className="hidden lg:block absolute left-8 top-16 w-80 bg-[#07252C]/90 backdrop-blur-xl rounded-[20px] border border-[#0E6875]/40 shadow-card-heavy overflow-hidden z-0 opacity-85">
        {/* macOS Window Controls Header */}
        <div className="bg-[#04161A] px-4 py-3 flex items-center justify-between border-b border-[#0E6875]/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-mono text-cyan-300/70 font-bold flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#0E6875]" />
            TimeValleyEngine.ts
          </span>
        </div>

        {/* Live Typewriter Code Lines */}
        <div className="p-4 font-mono text-[11px] leading-relaxed space-y-2 text-right dir-ltr">
          {CODE_SNIPPETS.slice(0, 4).map((item, idx) => {
            const typedText = getTypedSnippet(item.line, idx);
            const isCurrentlyTyping = typedText.length > 0 && typedText.length < item.line.length;
            return (
              <div key={idx} className={`${item.color} flex items-center gap-1`}>
                <span className="text-slate-600 select-none text-[10px] w-4">{idx + 1}</span>
                <span>{typedText}</span>
                {isCurrentlyTyping && (
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Right Floating IDE Terminal Window */}
      <div className="hidden lg:block absolute right-8 bottom-16 w-84 bg-[#07252C]/90 backdrop-blur-xl rounded-[20px] border border-[#0E6875]/40 shadow-card-heavy overflow-hidden z-0 opacity-85">
        {/* macOS Window Controls Header */}
        <div className="bg-[#04161A] px-4 py-3 flex items-center justify-between border-b border-[#0E6875]/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Terminal — Supabase
          </span>
        </div>

        {/* Live Typewriter Code Lines */}
        <div className="p-4 font-mono text-[11px] leading-relaxed space-y-2 text-right dir-ltr">
          {CODE_SNIPPETS.slice(4, 8).map((item, idx) => {
            const typedText = getTypedSnippet(item.line, idx + 4);
            const isCurrentlyTyping = typedText.length > 0 && typedText.length < item.line.length;
            return (
              <div key={idx} className={`${item.color} flex items-center gap-1`}>
                <span className="text-slate-600 select-none text-[10px] w-4">{idx + 5}</span>
                <span>{typedText}</span>
                {isCurrentlyTyping && (
                  <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Animated Developer Workstation SVG with Scanning Code Beams */}
      <div className="absolute bottom-3 sm:bottom-6 opacity-40 pointer-events-none flex items-center justify-center">
        <svg className="w-72 h-40 sm:w-96 sm:h-48 text-[#0E6875]" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk Surface */}
          <rect x="20" y="160" width="360" height="8" rx="4" fill="#0E6875" opacity="0.8" />
          <rect x="40" y="168" width="12" height="30" fill="#063D45" />
          <rect x="348" y="168" width="12" height="30" fill="#063D45" />

          {/* Main Code Monitor 1 */}
          <rect x="80" y="60" width="130" height="90" rx="8" fill="#09353D" stroke="#22D3EE" strokeWidth="2" />
          <rect x="135" y="150" width="20" height="10" fill="#0E6875" />
          
          {/* Live Scanning Typing Code Lines on Monitor 1 */}
          <motion.line 
            x1="92" y1="78" x2="160" y2="78" 
            stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" 
            animate={{ opacity: [0.3, 1, 0.3], x2: [110, 170, 110] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.line 
            x1="92" y1="90" x2="190" y2="90" 
            stroke="#34D399" strokeWidth="3" strokeLinecap="round" 
            animate={{ opacity: [0.5, 1, 0.5], x2: [120, 195, 120] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.line 
            x1="92" y1="102" x2="140" y2="102" 
            stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.line 
            x1="92" y1="114" x2="175" y2="114" 
            stroke="#EE6C4D" strokeWidth="3" strokeLinecap="round" 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Secondary Code Monitor 2 */}
          <rect x="220" y="70" width="100" height="80" rx="8" fill="#09353D" stroke="#38BDF8" strokeWidth="2" />
          <rect x="260" y="150" width="20" height="10" fill="#0E6875" />
          <line x1="230" y1="86" x2="295" y2="86" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="230" y1="98" x2="280" y2="98" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />

          {/* Developer Coffee Cup with Steam */}
          <rect x="330" y="140" width="14" height="20" rx="3" fill="#EE6C4D" />
          <motion.path 
            d="M337 132 Q339 125 337 120" 
            stroke="#F59E0B" 
            strokeWidth="2" 
            strokeLinecap="round" 
            animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Keyboard & Mouse */}
          <rect x="140" y="154" width="70" height="5" rx="2" fill="#38BDF8" opacity="0.8" />
          <circle cx="230" cy="156" r="3" fill="#38BDF8" opacity="0.8" />
        </svg>
      </div>

      {/* 5. Main Foreground Glassmorphic Loader Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center text-center relative z-10 bg-[#072A32]/85 backdrop-blur-xl p-8 rounded-[36px] border border-white/20 shadow-card-heavy max-w-sm w-full"
      >
        
        {/* Brand Emblem with Glowing Pulse Ring */}
        <div className="relative mb-5">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[28px] bg-[#0E6875]/50 blur-md"
          />

          <div className="w-20 h-20 rounded-[26px] bg-gradient-to-br from-[#0E6875] to-[#063D45] text-white flex items-center justify-center shadow-teal border border-white/30 relative z-10">
            <Calendar className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* User Identity Chip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md mb-3"
        >
          {userRole === 'client' ? (
            <>
              <Crown className="w-4 h-4 text-[#EE6C4D]" />
              <span className="text-xs font-black text-white">حساب د. وائل (العميل)</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-white">حساب أدهم (المُنفّذ)</span>
            </>
          )}
        </motion.div>

        {/* Clean Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-2xl md:text-3xl font-black tracking-tight text-white font-tajawal"
        >
          مشروع TimeValley
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-xs md:text-sm text-white/80 mt-1 font-medium"
        >
          مرحباً بك، <strong className="text-white font-bold">{userName}</strong>
        </motion.p>

        {/* Sleek 0% to 100% Percentage Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex items-center justify-center text-xs font-black tracking-widest text-emerald-400 font-mono bg-white/10 px-4 py-1.5 rounded-full border border-white/15 shadow-inner"
        >
          <span>{Math.round(progress)}%</span>
        </motion.div>

        {/* Ultra-Clean Glowing Progress Bar */}
        <div className="w-60 h-2 bg-white/15 rounded-full overflow-hidden mt-3 relative border border-white/10 shadow-inner">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#EE6C4D] via-[#F59E0B] to-amber-300 rounded-full shadow-[0_0_14px_rgba(238,108,77,0.7)]"
          />
        </div>

      </motion.div>

      {/* Subdued Footer Note */}
      <div className="mt-8 text-center text-[11px] text-white/50 font-bold relative z-10">
        <span>بيئة عمل وتصميم مخصص لـ د. وائل وأدهم كاسب</span>
      </div>

    </div>
  );
};

export default SplashLoader;
