import React, { useState } from 'react';
import { DailyLog, Comment, UserRole, Deliverable } from '../types/database';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Award,
  Crown
} from 'lucide-react';
import { CommentSection } from './CommentSection.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface DayDetailsModalProps {
  log: DailyLog;
  currentRole: UserRole;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (logId: string, content: string) => void;
  onApproveLog?: (logId: string) => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  log,
  currentRole,
  comments,
  onClose,
  onAddComment,
  onApproveLog,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  const logComments = comments.filter((c: Comment) => c.log_id === log.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        
        {/* Animated Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Animated Spring Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-white w-full max-w-3xl rounded-[28px] shadow-card-heavy border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[92vh] relative z-10"
        >
          
          {/* Modal Header */}
          <div className="bg-[#F8FAFC] p-4 sm:p-6 border-b border-[#E2E8F0] relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] sm:rounded-[18px] bg-[#0E6875] text-white flex items-center justify-center shadow-teal shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-black text-[#0F172A] font-tajawal truncate leading-tight">
                    {log.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] sm:text-xs font-black text-[#0E6875] bg-[#E6F3F5] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#0E6875]/20 whitespace-nowrap">
                      إنجاز {log.log_date}
                    </span>
                    <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-black whitespace-nowrap ${
                      log.status === 'completed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {log.progress_percentage}% إنجاز
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-200 text-[#475569] hover:text-[#0F172A] rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </div>

          {/* Modal Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-4 sm:px-7 bg-white relative overflow-x-auto no-scrollbar whitespace-nowrap py-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2.5 px-4 text-xs sm:text-sm font-black transition-all flex items-center gap-2 relative shrink-0 rounded-[12px] ${
                activeTab === 'details' 
                  ? 'text-[#0E6875] bg-[#E6F3F5] border border-[#0E6875]/20 shadow-sm' 
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span>تفاصيل الإنجاز والتسليمات</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`py-2.5 px-4 text-xs sm:text-sm font-black transition-all flex items-center gap-2 relative shrink-0 rounded-[12px] ${
                activeTab === 'comments' 
                  ? 'text-[#0E6875] bg-[#E6F3F5] border border-[#0E6875]/20 shadow-sm' 
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span>تعليقات وملاحظات د. وائل</span>
              {logComments.length > 0 && (
                <span className="bg-[#EE6C4D] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-coral">
                  {logComments.length}
                </span>
              )}
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="p-7 overflow-y-auto no-scrollbar space-y-6 flex-1">
            
            {activeTab === 'details' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Summary Box */}
                <div>
                  <h4 className="text-xs font-black text-[#475569] uppercase tracking-wider mb-2.5">الملخص التنفيذي</h4>
                  <p className="text-base text-[#0F172A] bg-[#F8FAFC] p-5 rounded-[20px] border border-[#E2E8F0] leading-relaxed font-medium">
                    {log.summary}
                  </p>
                </div>

                {/* Hours & Progress Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-[20px] bg-[#E6F3F5] border border-[#0E6875]/25 flex items-center gap-4">
                    <Clock className="w-6 h-6 text-[#0E6875]" />
                    <div>
                      <p className="text-xs font-extrabold text-[#475569]">ساعات العمل المستغرقة</p>
                      <p className="text-xl font-black text-[#0E6875]">{log.hours_spent} ساعة عمل</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-[20px] bg-[#FFF0EC] border border-[#EE6C4D]/30 flex items-center gap-4">
                    <Award className="w-6 h-6 text-[#EE6C4D]" />
                    <div>
                      <p className="text-xs font-extrabold text-[#475569]">المُنفّذ المسئول</p>
                      <p className="text-xl font-black text-[#0F172A]">{log.created_by_name}</p>
                    </div>
                  </div>
                </div>

                {/* Deliverables Sub-tasks List */}
                {log.deliverables && log.deliverables.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-[#475569] uppercase tracking-wider mb-3">
                      قائمة التسليمات والمهام المنجزة ({log.deliverables.length})
                    </h4>
                    <div className="space-y-2.5">
                      {log.deliverables.map((item: Deliverable, idx: number) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-[14px] bg-white border border-[#E2E8F0] hover:border-[#0E6875] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="text-sm font-bold text-[#0F172A]">{item.title}</span>
                          </div>
                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            مكتمل
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {log.notes && (
                  <div>
                    <h4 className="text-xs font-black text-[#475569] uppercase tracking-wider mb-2">ملاحظات جانبية</h4>
                    <div className="p-4 rounded-[16px] bg-amber-50 border border-amber-300 text-amber-950 text-sm leading-relaxed font-medium">
                      {log.notes}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Tab 2: Comments & Client Discussion Thread */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CommentSection
                  logId={log.id}
                  comments={logComments}
                  currentRole={currentRole}
                  onAddComment={onAddComment}
                />
              </motion.div>
            )}

          </div>

          {/* Modal Footer Actions */}
          <div className="p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
            <div className="text-xs font-bold text-[#475569] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>التحديثات مرتبطة بـ Realtime Engine</span>
            </div>

            <div className="flex items-center gap-3">
              {currentRole === 'client' && onApproveLog && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onApproveLog(log.id)}
                  className="flex items-center gap-2 bg-[#EE6C4D] hover:bg-[#DB5A3A] text-white font-extrabold text-xs md:text-sm px-5 py-2.5 rounded-[12px] shadow-coral transition-all"
                >
                  <Crown className="w-4.5 h-4.5 text-amber-200" />
                  <span>اعتماد التقرير د. وائل</span>
                </motion.button>
              )}

              <button
                onClick={onClose}
                className="bg-white hover:bg-slate-100 text-[#0F172A] border border-[#CBD5E1] font-extrabold text-xs md:text-sm px-5 py-2.5 rounded-[12px] transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DayDetailsModal;
