import React, { useState, useRef, useEffect } from 'react';
import { Comment, UserRole } from '../types/database';
import { MessageSquare, Send, Crown, UserCheck, Sparkles, Radio } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentSectionProps {
  logId: string;
  comments: Comment[];
  currentRole: UserRole;
  onAddComment: (logId: string, content: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  logId,
  comments,
  currentRole,
  onAddComment,
}) => {
  const [content, setContent] = useState<string>('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const logComments = comments.filter((c: Comment) => c.log_id === logId);

  // Auto scroll to bottom when new comments arrive in realtime
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logComments.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddComment(logId, content.trim());
    setContent('');
  };

  return (
    <div className="space-y-4 font-tajawal">
      
      {/* Header Info Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center shadow-inner">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#0F172A] tracking-tight">
              مناقشات وتوجيهات المشروع
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1.2 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                دردشة فورية متصلة بـ Realtime
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs text-[#0E6875] font-black bg-[#E6F3F5] px-3 py-1 rounded-full border border-[#0E6875]/20 shadow-sm">
          {logComments.length} تعليقات
        </span>
      </div>

      {/* Realtime Chat Thread Container */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto no-scrollbar p-1">
        {logComments.length === 0 ? (
          <div className="text-center py-10 bg-[#F8FAFC] rounded-[22px] border border-dashed border-[#CBD5E1]">
            <div className="w-12 h-12 rounded-full bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-[#0F172A]">لا توجد ملاحظات سابقة على هذا الإنجاز</p>
            <p className="text-xs text-slate-400 mt-1 font-medium max-w-xs mx-auto">
              يمكن لـ د. وائل وأدهم كتابة الاستفسارات والتوجيهات هنا مباشرة وستصل فورياً عبر Supabase Realtime!
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logComments.map((comment: Comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                className={`p-4 rounded-[20px] border shadow-subtle transition-all ${
                  comment.author_role === 'client'
                    ? 'bg-[#FFF0EC] border-[#EE6C4D]/40 text-[#0F172A]'
                    : 'bg-[#E6F3F5] border-[#0E6875]/30 text-[#0F172A]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    {comment.author_role === 'client' ? (
                      <span className="w-7 h-7 rounded-full bg-[#EE6C4D] text-white flex items-center justify-center text-xs font-black shadow-coral">
                        <Crown className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-[#0E6875] text-white flex items-center justify-center text-xs font-black shadow-teal">
                        <UserCheck className="w-4 h-4" />
                      </span>
                    )}
                    <span className="text-sm font-black">{comment.author_name}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                      comment.author_role === 'client' ? 'bg-[#EE6C4D]/20 text-[#EE6C4D]' : 'bg-[#0E6875]/20 text-[#0E6875]'
                    }`}>
                      {comment.author_role === 'client' ? 'العميل' : 'المُنفّذ'}
                    </span>
                  </div>

                  <span className="text-[11px] font-extrabold text-slate-500">
                    {comment.created_at ? format(new Date(comment.created_at), 'hh:mm a', { locale: ar }) : 'الآن'}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[#0F172A] font-medium pr-9 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Realtime Chat Input Form */}
      <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
          placeholder={currentRole === 'client' ? 'أضف تعليقك أو ملاحظتك د. وائل (إرسال لحظي)...' : 'أضف رداً على الاستفسارات (إرسال لحظي)...'}
          className="flex-1 bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] rounded-[16px] px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] font-bold focus:outline-none focus:ring-2 focus:ring-[#0E6875] shadow-inner transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={!content.trim()}
          className="bg-[#0E6875] hover:bg-[#063D45] disabled:opacity-50 text-white font-black text-xs md:text-sm px-6 py-3 rounded-[16px] shadow-teal flex items-center justify-center gap-2 transition-all shrink-0 font-tajawal"
        >
          <Send className="w-4 h-4" />
          <span>إرسال</span>
        </motion.button>
      </form>
    </div>
  );
};

export default CommentSection;
