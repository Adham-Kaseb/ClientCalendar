import React, { useState } from 'react';
import { DailyLog, Comment, UserRole } from '../types/database';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Clock, 
  Filter, 
  LayoutGrid, 
  ListFilter,
  Calendar as CalendarIcon,
  MessageSquare
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSelect } from './CustomSelect.tsx';

interface CalendarViewProps {
  logs: DailyLog[];
  comments: Comment[];
  currentRole: UserRole;
  onSelectLog: (log: DailyLog) => void;
  onOpenAddForDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  comments,
  currentRole,
  onSelectLog,
  onOpenAddForDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  // Month navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const resetToToday = () => setCurrentMonth(new Date(2026, 7, 11));

  // Calendar dates generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 6 }); // Saturday start for Arab calendar
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 6 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDayNames = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  // Logs Map by Date String (YYYY-MM-DD)
  const logsByDate = new Map<string, DailyLog>();
  logs.forEach((log: DailyLog) => {
    if (filterStatus === 'all' || log.status === filterStatus) {
      logsByDate.set(log.log_date, log);
    }
  });

  return (
    <div className="card-elevation p-6 lg:p-8 bg-white border border-[#E2E8F0] my-6 shadow-medium overflow-hidden">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        
        {/* Month Navigation Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#F8FAFC] p-1.5 rounded-[18px] border border-[#CBD5E1] shadow-inner">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevMonth}
              className="flex items-center gap-1 px-3 py-2 hover:bg-white text-[#0F172A] rounded-[12px] text-xs font-black transition-all"
              title="الانتقال للشهر السابق"
            >
              <ChevronRight className="w-4 h-4 text-[#0E6875]" />
              <span className="hidden sm:inline">الشهر السابق</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetToToday}
              className="px-4 py-2 font-black text-xs md:text-sm text-white bg-[#0E6875] hover:bg-[#063D45] rounded-[12px] shadow-teal transition-all flex items-center gap-1.5"
              title="العودة للشهر الحالي (اليوم)"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>العودة للشهر الحالي</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextMonth}
              className="flex items-center gap-1 px-3 py-2 hover:bg-white text-[#0F172A] rounded-[12px] text-xs font-black transition-all"
              title="الانتقال للشهر التالي"
            >
              <span className="hidden sm:inline">الشهر التالي</span>
              <ChevronLeft className="w-4 h-4 text-[#0E6875]" />
            </motion.button>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] font-tajawal flex items-center gap-2">
            <span>{format(currentMonth, 'MMMM yyyy', { locale: ar })}</span>
          </h2>
        </div>

        {/* View & Status Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Custom Styled Status Filter Select */}
          <CustomSelect
            icon={<Filter className="w-4 h-4 text-[#0E6875]" />}
            value={filterStatus}
            onChange={(val: string) => setFilterStatus(val)}
            options={[
              { value: 'all', label: 'كافة الإنجازات' },
              { value: 'completed', label: 'المكتملة (100%)', dotColor: 'bg-emerald-500' },
              { value: 'in_progress', label: 'قيد التنفيذ', dotColor: 'bg-amber-500' },
              { value: 'delayed', label: 'محتمل التأخير', dotColor: 'bg-rose-500' },
            ]}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F8FAFC] p-1.5 rounded-[14px] border border-[#CBD5E1] relative">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs md:text-sm font-extrabold transition-all relative z-10 ${
                viewMode === 'month' ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>تقويم شهري</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs md:text-sm font-extrabold transition-all relative z-10 ${
                viewMode === 'list' ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>قائمة يومية</span>
            </button>

            {/* Animated Tab Background Indicator */}
            <motion.div
              layout
              className="absolute top-1.5 bottom-1.5 bg-[#0E6875] rounded-[10px] shadow-teal"
              style={{
                left: viewMode === 'month' ? '50%' : '6px',
                right: viewMode === 'month' ? '6px' : '50%',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>

        </div>

      </div>

      {/* View Mode 1: Animated Month Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'month' ? (
          <motion.div
            key={currentMonth.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            
            {/* Day Names Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {weekDayNames.map((dayName: string, idx: number) => (
                <div 
                  key={idx} 
                  className="py-3 text-xs md:text-sm font-black text-white bg-[#0E6875] rounded-[12px] shadow-sm tracking-wide"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {calendarDays.map((day: Date, dayIdx: number) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const log = logsByDate.get(dateStr);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date(2026, 7, 11));

                // Find comments related to this log
                const logComments = log ? comments.filter((c: Comment) => c.log_id === log.id) : [];
                const clientComments = logComments.filter((c: Comment) => c.author_role === 'client');

                return (
                  <motion.div
                    key={dateStr}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: dayIdx * 0.01 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`min-h-[135px] md:min-h-[155px] p-3 md:p-3.5 rounded-[18px] border transition-all relative flex flex-col justify-between ${
                      !isCurrentMonth 
                        ? 'bg-slate-50/50 border-slate-200 opacity-40' 
                        : isToday
                        ? 'bg-[#FFF8F3] border-[#0E6875] ring-2 ring-[#0E6875]/30 shadow-medium'
                        : log 
                        ? 'bg-white border-[#E2E8F0] shadow-subtle hover:border-[#0E6875] hover:shadow-teal cursor-pointer' 
                        : 'bg-[#F8FAFC] border-dashed border-[#CBD5E1] hover:border-[#0E6875]'
                    }`}
                  >
                    {/* Top Day Header */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-base md:text-lg font-black w-8 h-8 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-[#0E6875] text-white shadow-teal' 
                          : isCurrentMonth 
                          ? 'text-[#0F172A]' 
                          : 'text-[#94A3B8]'
                      }`}>
                        {format(day, 'd')}
                      </span>

                      {/* Completion Status & Client Comment Badge (ONLY Icon & Counter) */}
                      <div className="flex items-center gap-1.5">
                        {clientComments.length > 0 && (
                          <span 
                            className="bg-[#EE6C4D] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-coral flex items-center gap-1 animate-pulse"
                            title={`يوجد ${clientComments.length} ملاحظة من د. وائل`}
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{clientComments.length}</span>
                          </span>
                        )}

                        {log && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                            log.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                              : log.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {log.progress_percentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Day Content Card */}
                    {log ? (
                      <div 
                        onClick={() => onSelectLog(log)}
                        className="cursor-pointer mt-1 group flex-1 flex flex-col justify-between"
                      >
                        <h4 className="text-xs md:text-sm font-extrabold text-[#0F172A] group-hover:text-[#0E6875] line-clamp-2 leading-snug transition-colors">
                          {log.title}
                        </h4>

                        <div className="mt-2.5 flex items-center justify-between text-xs text-[#475569]">
                          <span className="flex items-center gap-1 font-extrabold text-[#0E6875] bg-[#E6F3F5] px-2 py-0.5 rounded-md">
                            <Clock className="w-3.5 h-3.5" />
                            {log.hours_spent}س
                          </span>
                          <span className="text-[11px] font-bold text-[#475569] bg-slate-100 px-2 py-0.5 rounded-md">
                            {log.deliverables?.length || 0} مهام
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Empty Day Slot Add Action */
                      isCurrentMonth && (
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-400">لا يوجد سجل</span>
                          {currentRole === 'executor' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onOpenAddForDate(dateStr)}
                              className="text-xs text-[#0E6875] hover:text-white hover:bg-[#0E6875] font-extrabold flex items-center gap-1 transition-all bg-[#E6F3F5] px-2 py-1 rounded-[8px]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>إضافة</span>
                            </motion.button>
                          )}
                        </div>
                      )
                    )}

                  </motion.div>
                );
              })}
            </div>

          </motion.div>
        ) : (
          /* View Mode 2: Animated List View */
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-6 space-y-4"
          >
            {logs.length === 0 ? (
              <div className="text-center py-12 bg-[#F8FAFC] rounded-[20px] border border-dashed border-[#CBD5E1]">
                <p className="text-sm font-black text-[#475569]">لا توجد إنجازات يومية مسجلة حالياً</p>
              </div>
            ) : (
              logs.map((log: DailyLog, idx: number) => {
                const logComments = comments.filter((c: Comment) => c.log_id === log.id);
                const clientComments = logComments.filter((c: Comment) => c.author_role === 'client');

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    onClick={() => onSelectLog(log)}
                    className="p-6 rounded-[22px] bg-white border border-[#E2E8F0] hover:border-[#0E6875] shadow-subtle hover:shadow-teal transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-[18px] bg-[#E6F3F5] text-[#0E6875] font-black flex flex-col items-center justify-center text-sm shrink-0 border border-[#0E6875]/20">
                        <span className="text-base">{log.log_date.split('-')[2]}</span>
                        <span className="text-[10px] uppercase font-bold text-[#475569]">أغسطس</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-[#0F172A] font-tajawal">
                            {log.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            log.status === 'completed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {log.status === 'completed' ? 'مكتمل 100%' : `قيد التوظيف (${log.progress_percentage}%)`}
                          </span>

                          {clientComments.length > 0 && (
                            <span className="bg-[#EE6C4D] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-coral flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{clientComments.length} ملاحظة د. وائل</span>
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-[#475569] mt-1.5 leading-relaxed line-clamp-1 font-medium">
                          {log.summary}
                        </p>

                        <div className="mt-3 flex items-center gap-4 text-xs font-bold text-[#475569]">
                          <span className="flex items-center gap-1.5 text-[#0E6875] bg-[#E6F3F5] px-2.5 py-1 rounded-md">
                            <Clock className="w-4 h-4" />
                            استغرق {log.hours_spent} ساعة عمل
                          </span>
                          <span>•</span>
                          <span>المُنفّذ: {log.created_by_name}</span>
                        </div>
                      </div>
                    </div>

                    <button className="text-xs md:text-sm font-extrabold text-white bg-[#0E6875] hover:bg-[#063D45] px-5 py-2.5 rounded-[12px] shadow-teal transition-all shrink-0">
                      عرض التفاصيل والملاحظات
                    </button>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CalendarView;
