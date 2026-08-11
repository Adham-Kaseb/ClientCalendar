import React, { useState } from "react";
import { DailyLog, Comment, UserRole } from "../types/database";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock,
  Filter,
  LayoutGrid,
  ListFilter,
  Calendar as CalendarIcon,
  MessageSquare,
  MoveHorizontal,
  Sparkles,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ar } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "./CustomSelect.tsx";

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
  const [viewMode, setViewMode] = useState<"month" | "list">("month");

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

  const weekDayNames = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  // Logs Map by Date String (YYYY-MM-DD)
  const logsByDate = new Map<string, DailyLog>();
  logs.forEach((log: DailyLog) => {
    logsByDate.set(log.log_date, log);
  });

  return (
    <div className="card-elevation p-6 lg:p-8 bg-white border border-[#E2E8F0] my-6 shadow-medium overflow-hidden">
      {/* Calendar Header Controls */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        {/* Month Navigation & Title Cluster */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-6 w-full xl:w-auto">
          {/* Month Icon & Title Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[16px] bg-gradient-to-br from-[#0E6875] to-[#0B535E] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(14,104,117,0.3)] shrink-0">
              <CalendarIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] font-tajawal tracking-tight">
                {format(currentMonth, "MMMM yyyy", { locale: ar })}
              </h2>
              <p className="text-[11px] font-bold text-slate-400 hidden sm:block">
                استعراض جدول الأيام ومتابعة الإنجازات
              </p>
            </div>
          </div>

          {/* Month Nav Buttons Pill */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1.5 rounded-[20px] border border-[#E2E8F0] shadow-sm shrink-0">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
              whileTap={{ scale: 0.95 }}
              onClick={prevMonth}
              className="p-2 sm:px-3 sm:py-2 text-[#0F172A] hover:text-[#0E6875] rounded-[14px] text-xs font-black transition-all flex items-center gap-1 bg-white/60 shadow-xs"
              title="الانتقال للشهر السابق"
            >
              <ChevronRight className="w-4 h-4 text-[#0E6875]" />
              <span className="hidden sm:inline">السابق</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={resetToToday}
              className="px-3.5 py-2 font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#0E6875] to-[#0B535E] hover:from-[#0B535E] hover:to-[#063D45] rounded-[14px] shadow-[0_4px_12px_rgba(14,104,117,0.3)] transition-all flex items-center gap-1.5 whitespace-nowrap"
              title="العودة للشهر الحالي (اليوم)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>الشهر الحالي</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
              whileTap={{ scale: 0.95 }}
              onClick={nextMonth}
              className="p-2 sm:px-3 sm:py-2 text-[#0F172A] hover:text-[#0E6875] rounded-[14px] text-xs font-black transition-all flex items-center gap-1 bg-white/60 shadow-xs"
              title="الانتقال للشهر التالي"
            >
              <span className="hidden sm:inline">التالي</span>
              <ChevronLeft className="w-4 h-4 text-[#0E6875]" />
            </motion.button>
          </div>
        </div>

        {/* View Mode Switcher Toggle */}
        <div className="flex items-center justify-center xl:justify-end w-full xl:w-auto">
          <div className="flex items-center bg-[#F1F5F9] p-1.5 rounded-[20px] border border-[#E2E8F0] relative w-full sm:w-80 lg:w-72 shadow-sm">
            <button
              onClick={() => setViewMode("month")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-[14px] text-xs sm:text-sm font-extrabold transition-all relative z-10 ${
                viewMode === "month"
                  ? "text-white"
                  : "text-slate-600 hover:text-[#0F172A]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>تقويم شهري</span>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-[14px] text-xs sm:text-sm font-extrabold transition-all relative z-10 ${
                viewMode === "list"
                  ? "text-white"
                  : "text-slate-600 hover:text-[#0F172A]"
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>قائمة يومية</span>
            </button>

            {/* Animated Tab Background Indicator */}
            <motion.div
              layout
              className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-[#0E6875] to-[#0B535E] rounded-[14px] shadow-[0_4px_12px_rgba(14,104,117,0.35)]"
              style={{
                left: viewMode === "month" ? "50%" : "6px",
                right: viewMode === "month" ? "6px" : "50%",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>
      </div>

      {/* View Mode 1: Animated Month Grid */}
      <AnimatePresence mode="wait">
        {viewMode === "month" ? (
          <motion.div
            key={currentMonth.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            {/* Mobile Only Swipe Guidance Layer Banner */}
            <div className="sm:hidden mb-3.5 bg-gradient-to-r from-[#E6F3F5] via-[#F8FAFC] to-[#E6F3F5] border border-[#0E6875]/30 rounded-[16px] py-2.5 px-4 text-center shadow-subtle animate-fadeIn">
              <p className="text-xs font-black text-[#0F172A] leading-snug text-center">
                اسحب الجدول أفقياً 👈👉 لرؤية كافة الأيام
              </p>
            </div>

            {/* Scrollable Container for 7-Column Calendar Grid on Mobile */}
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[620px] sm:min-w-full">
                {/* Day Names Header */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3 text-center">
                  {weekDayNames.map((dayName: string, idx: number) => (
                    <div
                      key={idx}
                      className="py-2 sm:py-3 text-xs sm:text-sm font-black text-white bg-[#0E6875] rounded-[8px] sm:rounded-[12px] shadow-sm tracking-wide whitespace-nowrap px-1"
                    >
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid Cells */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
                  {calendarDays.map((day: Date, dayIdx: number) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const log = logsByDate.get(dateStr);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date(2026, 7, 11));

                    // Find comments related to this log
                    const logComments = log
                      ? comments.filter((c: Comment) => c.log_id === log.id)
                      : [];
                    const clientComments = logComments.filter(
                      (c: Comment) => c.author_role === "client",
                    );
                    const executorComments = logComments.filter(
                      (c: Comment) => c.author_role === "executor",
                    );

                    // Determine relevant comments badge depending on logged in role
                    const relevantComments =
                      currentRole === "client"
                        ? executorComments
                        : clientComments;
                    const badgeBgClass =
                      currentRole === "client"
                        ? "bg-[#0E6875] text-white shadow-teal"
                        : "bg-[#EE6C4D] text-white shadow-coral";
                    const badgeTooltip =
                      currentRole === "client"
                        ? `يوجد ${executorComments.length} رد جديد من أدهم`
                        : `يوجد ${clientComments.length} ملاحظة جديدة من د. وائل`;

                    return (
                      <motion.div
                        key={dateStr}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: dayIdx * 0.01 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`min-h-[95px] sm:min-h-[130px] md:min-h-[145px] lg:min-h-[155px] p-1.5 sm:p-2.5 md:p-3 rounded-[12px] sm:rounded-[16px] md:rounded-[18px] border transition-all relative flex flex-col justify-between overflow-hidden ${
                          !isCurrentMonth
                            ? "bg-slate-50/50 border-slate-200 opacity-40"
                            : isToday
                              ? "bg-[#FFF8F3] border-[#0E6875] ring-2 ring-[#0E6875]/30 shadow-medium"
                              : log
                                ? "bg-white border-[#E2E8F0] shadow-subtle hover:border-[#0E6875] hover:shadow-teal cursor-pointer"
                                : "bg-[#F8FAFC] border-dashed border-[#CBD5E1] hover:border-[#0E6875]"
                        }`}
                      >
                        {/* Top Day Header */}
                        <div className="flex items-center justify-between mb-1 gap-1">
                          <span
                            className={`text-xs sm:text-base md:text-lg font-black w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${
                              isToday
                                ? "bg-[#0E6875] text-white shadow-teal"
                                : isCurrentMonth
                                  ? "text-[#0F172A]"
                                  : "text-[#94A3B8]"
                            }`}
                          >
                            {format(day, "d")}
                          </span>

                          {/* Role-Aware Comment Badge & Percentage Pill */}
                          <div className="flex items-center gap-1 shrink-0">
                            {relevantComments.length > 0 && (
                              <span
                                className={`${badgeBgClass} text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center gap-0.5 animate-pulse`}
                                title={badgeTooltip}
                              >
                                <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span>{relevantComments.length}</span>
                              </span>
                            )}

                            {log && (
                              <span
                                className={`hidden lg:inline-block px-2 py-0.5 rounded-full text-[10px] md:text-xs font-black ${
                                  log.status === "completed"
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                    : log.status === "in_progress"
                                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                                      : "bg-rose-100 text-rose-900 border border-rose-300"
                                }`}
                              >
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
                            {/* Mobile View (<640px): Compact Status Pill & Dot */}
                            <div className="sm:hidden flex flex-col items-center justify-center gap-1 my-auto">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  log.status === "completed"
                                    ? "bg-emerald-500 shadow-sm"
                                    : "bg-amber-500 shadow-sm"
                                }`}
                              />
                              <span className="text-[9px] font-black text-[#0E6875] truncate max-w-full">
                                {log.progress_percentage}%
                              </span>
                            </div>

                            {/* Desktop/Tablet View (>=640px): Title & Hours */}
                            <div className="hidden sm:flex flex-col justify-between flex-1">
                              <h4 className="text-xs md:text-sm font-extrabold text-[#0F172A] group-hover:text-[#0E6875] line-clamp-2 leading-snug transition-colors">
                                {log.title}
                              </h4>

                              <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-between gap-1 text-xs text-[#475569]">
                                <span className="flex items-center gap-0.5 font-extrabold text-[#0E6875] bg-[#E6F3F5] px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                  {log.hours_spent}س
                                </span>
                                <span className="text-[10px] sm:text-[11px] font-bold text-[#475569] bg-slate-100 px-1.5 py-0.5 rounded-md">
                                  {log.deliverables?.length || 0} مهام
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Empty Day Slot Add Action */
                          isCurrentMonth && (
                            <div className="mt-auto pt-1 flex items-center justify-center lg:justify-between w-full">
                              <span className="hidden lg:inline text-[11px] font-semibold text-slate-400">
                                لا يوجد سجل
                              </span>
                              {currentRole === "executor" ? (
                                <motion.button
                                  whileHover={{ scale: 1.08 }}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={() => onOpenAddForDate(dateStr)}
                                  className="text-[10px] sm:text-xs text-[#0E6875] hover:text-white hover:bg-[#0E6875] font-extrabold flex items-center gap-0.5 transition-all bg-[#E6F3F5] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[6px] sm:rounded-[8px] whitespace-nowrap shadow-xs"
                                >
                                  <Plus className="w-3 h-3 shrink-0" />
                                  <span>إضافة</span>
                                </motion.button>
                              ) : (
                                <span className="lg:hidden text-[10px] sm:text-[11px] font-semibold text-slate-400">
                                  لا يوجد سجل
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
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
                <p className="text-sm font-black text-[#475569]">
                  لا توجد إنجازات يومية مسجلة حالياً
                </p>
              </div>
            ) : (
              logs.map((log: DailyLog, idx: number) => {
                const logComments = comments.filter(
                  (c: Comment) => c.log_id === log.id,
                );
                const clientComments = logComments.filter(
                  (c: Comment) => c.author_role === "client",
                );
                const executorComments = logComments.filter(
                  (c: Comment) => c.author_role === "executor",
                );
                const relevantComments =
                  currentRole === "client" ? executorComments : clientComments;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    onClick={() => onSelectLog(log)}
                    className="p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] bg-white border border-[#E2E8F0] hover:border-[#0E6875] shadow-subtle hover:shadow-teal transition-all cursor-pointer flex flex-col justify-between gap-3.5"
                  >
                    {/* Top Row: Date Badge + Status Pill + Comment Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-[#0E6875] bg-[#E6F3F5] px-3 py-1 rounded-[10px] border border-[#0E6875]/20 flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>{log.log_date.split("-")[2]} أغسطس 2026</span>
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-[10px] text-xs font-black ${
                            log.status === "completed"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          {log.status === "completed"
                            ? "مكتمل 100%"
                            : `قيد التنفيذ (${log.progress_percentage}%)`}
                        </span>
                      </div>

                      {relevantComments.length > 0 && (
                        <span
                          className={`text-white text-xs font-black px-2.5 py-1 rounded-[10px] shadow-sm flex items-center gap-1.5 ${
                            currentRole === "client"
                              ? "bg-[#0E6875]"
                              : "bg-[#EE6C4D]"
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>
                            {currentRole === "client"
                              ? `${relevantComments.length} رد أدهم`
                              : `${relevantComments.length} ملاحظة د. وائل`}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Middle Section: Title & Description */}
                    <div>
                      <h3 className="text-base sm:text-xl font-black text-[#0F172A] font-tajawal leading-snug">
                        {log.title}
                      </h3>

                      {log.summary && (
                        <p className="text-xs sm:text-sm text-[#475569] mt-1.5 leading-relaxed font-medium line-clamp-2">
                          {log.summary}
                        </p>
                      )}
                    </div>

                    {/* Bottom Row: Work Hours, Executor & View Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#475569]">
                        <span className="flex items-center gap-1.5 text-[#0E6875] bg-[#E6F3F5] px-2.5 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          استغرق {log.hours_spent} ساعة عمل
                        </span>
                        <span className="text-slate-300 font-medium">|</span>
                        <span className="text-[#475569]">
                          المُنفّذ: {log.created_by_name}
                        </span>
                      </div>

                      <button className="w-full sm:w-auto text-xs sm:text-sm font-extrabold text-white bg-[#0E6875] hover:bg-[#063D45] px-4 py-2.5 rounded-[12px] shadow-teal transition-all text-center">
                        عرض التفاصيل والملاحظات
                      </button>
                    </div>
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
