import React, { useEffect, useState } from 'react';
import { Calendar, Crown, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '../types/database';

interface SplashLoaderProps {
  userName: string;
  userRole: UserRole;
  onComplete: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({
  userName,
  userRole,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2.5));
    }, 40);

    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[999999] bg-[#0A3B43] text-white flex flex-col items-center justify-center p-6 font-tajawal select-none">
      
      {/* Background Soft Glow Spotlight */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#0E6875]/30 blur-[130px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#EE6C4D]/15 blur-[120px] pointer-events-none" />

      {/* Main Clean Center Group */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center text-center relative z-10"
      >
        
        {/* Brand Emblem with Subtle Pulse Ring */}
        <div className="relative mb-6">
          {/* Subtle Outer Pulsing Aura */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[28px] bg-white/20 blur-md"
          />

          {/* Core White Icon Card */}
          <div className="w-20 h-20 rounded-[26px] bg-white text-[#0E6875] flex items-center justify-center shadow-card-heavy border border-white/90 relative z-10">
            <Calendar className="w-10 h-10 text-[#0E6875]" />
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
          مشروع تايم فالي
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-xs md:text-sm text-white/80 mt-1 font-medium"
        >
          مرحباً بك، <strong className="text-white font-bold">{userName}</strong>
        </motion.p>

        {/* Ultra-Clean Minimal Progress Bar */}
        <div className="w-56 h-1.5 bg-white/15 rounded-full overflow-hidden mt-7 relative border border-white/10">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#EE6C4D] to-emerald-400 rounded-full shadow-coral"
          />
        </div>

      </motion.div>

      {/* Subdued Minimal Footer */}
      <div className="absolute bottom-8 text-center text-[11px] font-bold text-white/40">
        تطبيق التقويم التفاعلي — تايم فالي
      </div>

    </div>
  );
};

export default SplashLoader;
