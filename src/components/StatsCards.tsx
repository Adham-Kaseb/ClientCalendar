import React from 'react';
import { DailyLog, UserRole } from '../types/database';
import { Clock, Calendar, TrendingUp, Award, CheckCircle2, Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  logs: DailyLog[];
  currentRole: UserRole;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ logs, currentRole }) => {
  // Calculate total hours
  const totalHours = logs.reduce((sum: number, log: DailyLog) => sum + (log.hours_spent || 0), 0);
  
  // Calculate logged days count
  const totalDays = logs.length;
  
  // Calculate average completion rate
  const avgCompletion = totalDays > 0
    ? Math.round(logs.reduce((sum: number, log: DailyLog) => sum + (log.progress_percentage || 0), 0) / totalDays)
    : 0;

  // Calculate client approval status
  const completedLogs = logs.filter((l: DailyLog) => l.status === 'completed').length;
  const isFullyApproved = totalDays > 0 && completedLogs === totalDays;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
      
      {/* Stat 1: Total Completion Rate */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-subtle hover:shadow-card-heavy transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#475569] uppercase tracking-wider font-tajawal">معدل إنجاز المهام</span>
          <div className="w-12 h-12 rounded-[18px] bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight font-tajawal">
              {avgCompletion}%
            </span>
            <span className="text-xs font-bold text-[#475569] bg-slate-100 px-2.5 py-1 rounded-md">
              {totalDays > 0 ? `${completedLogs}/${totalDays} يوم` : '0 أيام'}
            </span>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${avgCompletion}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-[#0E6875] h-full rounded-full shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Stat 2: Total Accumulated Hours */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-subtle hover:shadow-card-heavy transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#475569] uppercase tracking-wider font-tajawal">ساعات العمل التراكمية</span>
          <div className="w-12 h-12 rounded-[18px] bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight font-tajawal">
              {totalHours.toFixed(1)}
            </span>
            <span className="text-sm font-extrabold text-[#475569]">ساعة عمل</span>
          </div>

          <p className="text-xs text-[#0E6875] font-extrabold mt-2.5 flex items-center gap-1.5 bg-[#E6F3F5] px-3 py-1 rounded-[10px] w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>معدل {totalDays > 0 ? (totalHours / totalDays).toFixed(1) : '0'} ساعة / يوم عمل</span>
          </p>
        </div>
      </motion.div>

      {/* Stat 3: Total Recorded Days */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-subtle hover:shadow-card-heavy transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#475569] uppercase tracking-wider font-tajawal">الأيام المسجلة بالتقويم</span>
          <div className="w-12 h-12 rounded-[18px] bg-[#FFF0EC] text-[#EE6C4D] flex items-center justify-center shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight font-tajawal">
              {totalDays}
            </span>
            <span className="text-sm font-extrabold text-[#475569]">أيام إنجاز</span>
          </div>

          <p className="text-xs text-[#EE6C4D] font-extrabold mt-2.5 flex items-center gap-1.5 bg-[#FFF0EC] px-3 py-1 rounded-[10px] w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تحديثات مستمرة وموثقة في TimeValley</span>
          </p>
        </div>
      </motion.div>

      {/* Stat 4: Client Approval & Role Status */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-subtle hover:shadow-card-heavy transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#475569] uppercase tracking-wider font-tajawal">حالة اعتماد د. وائل</span>
          <div className="w-12 h-12 rounded-[18px] bg-[#E6F3F5] text-emerald-600 flex items-center justify-center shadow-sm">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl lg:text-3xl font-black text-emerald-800 tracking-tight font-tajawal flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>{isFullyApproved ? 'مُعتمد بالكامل' : 'مُعتمد ومتابع'}</span>
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs font-bold text-[#475569]">
            <span>الدخول الحالي:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-black ${
              currentRole === 'client' ? 'bg-[#FFF0EC] text-[#EE6C4D]' : 'bg-[#E6F3F5] text-[#0E6875]'
            }`}>
              {currentRole === 'client' ? 'د. وائل (العميل)' : 'أدهم (المُنفّذ)'}
            </span>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default StatsCards;
