import React, { useState } from 'react';
import { AuthUser } from '../types/database';
import { supabase } from '../lib/supabase';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Crown, 
  UserCheck, 
  Calendar, 
  ArrowLeft,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Static user database
  const STATIC_USERS: AuthUser[] = [
    {
      id: 'usr-wael',
      username: 'dr.wael',
      name: 'د. وائل',
      role: 'client',
      email: 'wael@timevalley.com'
    },
    {
      id: 'usr-adham',
      username: 'adham',
      name: 'أدهم كاسب',
      role: 'executor',
      email: 'adham@timevalley.com'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const inputUser = username.trim().toLowerCase();
    const inputPass = password.trim();

    // Check credentials logic
    if (inputUser === 'dr.wael' && inputPass === 'timevalley') {
      const user = STATIC_USERS.find(u => u.username === 'dr.wael')!;
      onLoginSuccess(user);
    } else if (inputUser === 'adham' && inputPass === 'pass') {
      const user = STATIC_USERS.find(u => u.username === 'adham')!;
      onLoginSuccess(user);
    } else {
      // Check Supabase fallback
      try {
        const { data, error } = await supabase
          .from('user_credentials')
          .select('*')
          .eq('username', inputUser)
          .eq('password_hash', inputPass)
          .single();

        if (data && !error) {
          onLoginSuccess({
            id: data.id,
            username: data.username,
            name: data.name,
            role: data.role as any,
            email: data.email
          });
          return;
        }
      } catch (err) {
        // Fallback error
      }

      setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة');
      setIsLoading(false);
    }
  };

  // Quick 1-click Login Helper
  const handleQuickLogin = (role: 'client' | 'executor') => {
    if (role === 'client') {
      setUsername('dr.wael');
      setPassword('timevalley');
      onLoginSuccess(STATIC_USERS[0]);
    } else {
      setUsername('adham');
      setPassword('pass');
      onLoginSuccess(STATIC_USERS[1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 relative overflow-hidden font-tajawal">
      
      {/* Ambient Decorative Blurs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#0E6875]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-[#EE6C4D]/10 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-card-heavy border border-[#CBD5E1] p-8 lg:p-10 relative z-10"
      >
        
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#0E6875] to-[#063D45] text-white flex items-center justify-center shadow-teal mx-auto mb-4 transform hover:rotate-6 transition-transform">
            <Calendar className="w-8 h-8" />
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-[#0F172A] tracking-tight">
            تسجيل الدخول
          </h2>
          <p className="text-xs md:text-sm font-bold text-[#475569] mt-1">
            مشروع تايم فالي — التقويم اليومي لـ د. وائل وأدهم
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-[14px] bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black flex items-center gap-2"
          >
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-black text-[#0F172A] mb-1.5">اسم المستخدم</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dr.wael أو adham"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] pr-11 pl-4 py-3 text-sm font-extrabold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                required
              />
              <User className="w-5 h-5 text-[#0E6875] absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-black text-[#0F172A] mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] pr-11 pl-11 py-3 text-sm font-extrabold text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                required
              />
              <Lock className="w-5 h-5 text-[#0E6875] absolute right-3.5 top-3.5" />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-3.5 text-[#94A3B8] hover:text-[#0F172A]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0E6875] hover:bg-[#063D45] text-white font-black text-sm py-3.5 rounded-[14px] shadow-teal flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{isLoading ? 'جاري التحقق...' : 'دخول التقويم التفاعلي'}</span>
            <ArrowLeft className="w-4.5 h-4.5" />
          </motion.button>

        </form>

        {/* Quick Demo Login Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#CBD5E1]" />
          <span className="text-[11px] font-black text-[#475569] uppercase">الدخول السريع للاختبار</span>
          <div className="flex-1 h-px bg-[#CBD5E1]" />
        </div>

        {/* 1-Click Quick Demo Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleQuickLogin('client')}
            className="p-3.5 rounded-[16px] bg-[#FFF0EC] hover:bg-[#FFE4DC] border border-[#EE6C4D]/30 text-right transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-[#EE6C4D]" />
              <span className="text-xs font-black text-[#0F172A]">د. وائل (العميل)</span>
            </div>
            <p className="text-[10px] text-[#475569] font-bold">dr.wael / timevalley</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleQuickLogin('executor')}
            className="p-3.5 rounded-[16px] bg-[#E6F3F5] hover:bg-[#D5EBF0] border border-[#0E6875]/30 text-right transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-[#0E6875]" />
              <span className="text-xs font-black text-[#0F172A]">أدهم (المُنفّذ)</span>
            </div>
            <p className="text-[10px] text-[#475569] font-bold">adham / pass</p>
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};

export default LoginPage;
