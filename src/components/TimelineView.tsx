import React from 'react';
import { DailyLog, Comment, UserRole } from '../types/database';
import { CheckCircle2, Clock, MessageSquare, ChevronLeft, Calendar, Sparkles } from 'lucide-react';

interface TimelineViewProps {
  logs: DailyLog[];
  comments: Comment[];
  currentRole: UserRole;
  onSelectLog: (log: DailyLog) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  logs,
  comments,
  onSelectLog,
}) => {
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a: DailyLog, b: DailyLog) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());

  return (
    <div className="card-elevation p-6 lg:p-8 bg-white border border-[#E2E8F0] my-6 shadow-medium">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-[#0F172A] font-tajawal flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-[#0E6875]" />
            <span>تسلسل الإنجازات الزمني — مشروع تايم فالي</span>
          </h3>
          <p className="text-xs md:text-sm font-medium text-[#475569] mt-1">عرض المخطط الزمني اليومي لإنجازات أدهم والمتابعة من د. وائل</p>
        </div>

        <span className="text-xs md:text-sm font-black text-[#0E6875] bg-[#E6F3F5] px-3.5 py-1.5 rounded-full border border-[#0E6875]/20">
          إجمالي {sortedLogs.length} يوماً مسجلاً
        </span>
      </div>

      {sortedLogs.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#F8FAFC] rounded-[24px] border border-dashed border-[#CBD5E1]">
          <Sparkles className="w-12 h-12 text-[#0E6875]/40 mx-auto mb-3" />
          <h4 className="text-lg font-black text-[#0F172A]">التقويم جاهز ونظيف لبدء المشروع</h4>
          <p className="text-sm text-[#475569] mt-1 max-w-md mx-auto font-medium">
            لم يتم تسجيل أي إنجازات بعد. بمجرد انطلاق العمل، سيقوم أدهم بتبويب الإنجازات اليومية لتظهر لـ د. وائل فوراً.
          </p>
        </div>
      ) : (
        /* Timeline List */
        <div className="relative pr-6 border-r-2 border-[#0E6875]/20 space-y-8">
          {sortedLogs.map((log: DailyLog) => {
            const logCommentsCount = comments.filter((c: Comment) => c.log_id === log.id).length;

            return (
              <div key={log.id} className="relative group">
                
                {/* Timeline Bullet Node */}
                <div className={`absolute -right-[31px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-teal transition-transform group-hover:scale-125 ${
                  log.status === 'completed' ? 'bg-[#0E6875]' : 'bg-[#EE6C4D]'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                {/* Log Card Box */}
                <div 
                  onClick={() => onSelectLog(log)}
                  className="bg-[#F8FAFC] hover:bg-white p-6 rounded-[22px] border border-[#E2E8F0] hover:border-[#0E6875] shadow-subtle hover:shadow-teal transition-all cursor-pointer mr-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-[#0E6875] bg-[#E6F3F5] px-3 py-1 rounded-full border border-[#0E6875]/20">
                        {log.log_date}
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        log.status === 'completed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {log.progress_percentage}% إنجاز
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#475569] flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#0E6875]" />
                      {log.hours_spent} ساعة عمل
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-[#0F172A] font-tajawal group-hover:text-[#0E6875] transition-colors mt-1">
                    {log.title}
                  </h4>

                  <p className="text-sm text-[#475569] mt-2 leading-relaxed line-clamp-2 font-medium">
                    {log.summary}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-xs md:text-sm font-bold">
                    <div className="flex items-center gap-4 text-[#475569]">
                      <span>تسليمات: <strong className="text-[#0F172A] font-black">{log.deliverables?.length || 0}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-[#0E6875]" />
                        {logCommentsCount} تعليق
                      </span>
                    </div>

                    <span className="text-[#0E6875] font-black flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                      <span>التفاصيل</span>
                      <ChevronLeft className="w-4 h-4" />
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default TimelineView;
