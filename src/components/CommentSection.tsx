import React, { useState } from 'react';
import { Comment, UserRole } from '../types/database';
import { MessageSquare, Send, Crown, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddComment(logId, content.trim());
    setContent('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-[#475569] uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#0E6875]" />
          <span>مناقشات وتوجيهات المشروع</span>
        </h4>
        <span className="text-xs text-[#0E6875] font-black bg-[#E6F3F5] px-3 py-1 rounded-full border border-[#0E6875]/20">
          {comments.length} تعليقات
        </span>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-[#F8FAFC] rounded-[18px] border border-dashed border-[#CBD5E1]">
            <MessageSquare className="w-8 h-8 text-[#0E6875]/40 mx-auto mb-2" />
            <p className="text-xs font-black text-[#475569]">لا توجد ملاحظات سابقة على هذا الإنجاز</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">يمكن لـ د. وائل إضافة توجيهاته وتعليقاته مباشرة</p>
          </div>
        ) : (
          comments.map((comment: Comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-[18px] border transition-all ${
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
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                    comment.author_role === 'client' ? 'bg-[#EE6C4D]/20 text-[#EE6C4D]' : 'bg-[#0E6875]/20 text-[#0E6875]'
                  }`}>
                    {comment.author_role === 'client' ? 'العميل' : 'المُنفّذ'}
                  </span>
                </div>

                <span className="text-xs font-bold text-[#475569]">
                  {comment.created_at ? format(new Date(comment.created_at), 'hh:mm a', { locale: ar }) : 'الآن'}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-[#0F172A] font-medium pr-9">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2.5">
        <input
          type="text"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
          placeholder={currentRole === 'client' ? 'أضف تعليقك أو ملاحظتك د. وائل...' : 'أضف رداً على الاستفسارات...'}
          className="flex-1 bg-white border border-[#CBD5E1] rounded-[14px] px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] font-bold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="bg-[#0E6875] hover:bg-[#063D45] disabled:opacity-50 text-white font-extrabold text-xs md:text-sm px-5 py-3 rounded-[14px] shadow-teal flex items-center gap-2 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>إرسال</span>
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
