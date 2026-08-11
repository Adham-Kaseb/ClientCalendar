import React from 'react';
import { DailyLog, UserRole } from '../types/database';
import { 
  Clock, 
  CalendarDays, 
  Award, 
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface StatsCardsProps {
  logs: DailyLog[];
  currentRole: UserRole;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ logs, currentRole }) => {
  const totalDays = logs.length;
  const completedLogs = logs.filter((l: DailyLog) => l.status === 'completed').length;
  const totalHours = logs.reduce((acc: number, l: DailyLog) => acc + (l.hours_spent || 0), 0);
  
  const avgProgress = totalDays > 0 
    ? Math.round(logs.reduce((acc: number, l: DailyLog) => acc + (l.progress_percentage || 0), 0) / totalDays) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
      
      {/* Card 1: Total Completion Rate */}
      <div className="card-elevation p-7 relative overflow-hidden group border border-[#E2E8F0] shadow-medium">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-[#0E6875]" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold text-[#475569] uppercase tracking-wider">معدل إنجاز المهام</p>
            <h3 className="text-4xl lg:text-5xl font-black text-[#0F172A] mt-2 font-tajawal">
              {avgProgress}%
            </h3>
          </div>
          <div className="w-14 h-14 rounded-[20px] bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center group-hover:scale-110 transition-transform shadow-teal">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#0E6875] h-2.5 rounded-full transition-all duration-700 shadow-teal" 
              style={{ width: `${avgProgress}%` }}
            />
          </div>
          <span className="text-xs font-black text-[#0E6875] mr-3 whitespace-nowrap">{completedLogs}/{totalDays} يوم</span>
        </div>
      </div>

      {/* Card 2: Total Hours Logged */}
      <div className="card-elevation p-7 relative overflow-hidden group border border-[#E2E8F0] shadow-medium">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-[#148595]" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold text-[#475569] uppercase tracking-wider">ساعات العمل التراكمية</p>
            <h3 className="text-4xl lg:text-5xl font-black text-[#0F172A] mt-2 font-tajawal">
              {totalHours.toFixed(1)} <span className="text-base font-bold text-[#475569]">ساعة</span>
            </h3>
          </div>
          <div className="w-14 h-14 rounded-[20px] bg-[#E6F3F5] text-[#148595] flex items-center justify-center group-hover:scale-110 transition-transform shadow-teal">
            <Clock className="w-7 h-7" />
          </div>
        </div>
        <p className="mt-5 text-xs font-bold text-[#475569] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#0E6875]" />
          <span>معدل {totalDays > 0 ? (totalHours / totalDays).toFixed(1) : 0} ساعة / يوم عمل</span>
        </p>
      </div>

      {/* Card 3: Days Tracked */}
      <div className="card-elevation p-7 relative overflow-hidden group border border-[#E2E8F0] shadow-medium">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-[#EE6C4D]" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold text-[#475569] uppercase tracking-wider">الأيام المسجلة</p>
            <h3 className="text-4xl lg:text-5xl font-black text-[#0F172A] mt-2 font-tajawal">
              {totalDays} <span className="text-base font-bold text-[#475569]">أيام إنجاز</span>
            </h3>
          </div>
          <div className="w-14 h-14 rounded-[20px] bg-[#FFF0EC] text-[#EE6C4D] flex items-center justify-center group-hover:scale-110 transition-transform shadow-coral">
            <CalendarDays className="w-7 h-7" />
          </div>
        </div>
        <p className="mt-5 text-xs font-bold text-[#475569] flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تحديثات مستمرة وموثقة في تايم فالي</span>
        </p>
      </div>

      {/* Card 4: Client Review Status */}
      <div className="card-elevation p-7 relative overflow-hidden group border border-[#E2E8F0] shadow-medium">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-emerald-600" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold text-[#475569] uppercase tracking-wider">حالة اعتماد د. وائل</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-2 font-tajawal flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>مُعتمد ومتابع</span>
            </h3>
          </div>
          <div className="w-14 h-14 rounded-[20px] bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-200">
            <Award className="w-7 h-7" />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between text-xs font-bold text-[#475569]">
          <span>الدخول الحالي:</span>
          <span className="font-extrabold text-[#0E6875] bg-[#E6F3F5] px-3 py-1 rounded-full border border-[#0E6875]/20">
            {currentRole === 'client' ? 'د. وائل (عرض للتعليق)' : 'أدهم (إضافة وتعديل)'}
          </span>
        </div>
      </div>

    </div>
  );
};
