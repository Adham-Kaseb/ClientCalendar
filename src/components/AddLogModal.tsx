import React, { useState } from 'react';
import { DailyLog, Deliverable } from '../types/database';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { CustomSelect } from './CustomSelect.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface AddLogModalProps {
  initialDate?: string;
  onClose: () => void;
  onSave: (log: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>) => void;
}

export const AddLogModal: React.FC<AddLogModalProps> = ({
  initialDate = '2026-08-11',
  onClose,
  onSave,
}) => {
  const [logDate, setLogDate] = useState<string>(initialDate);
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [hoursSpent, setHoursSpent] = useState<number>(6.0);
  const [progressPercentage, setProgressPercentage] = useState<number>(100);
  const [status, setStatus] = useState<'completed' | 'in_progress' | 'delayed'>('completed');
  const [notes, setNotes] = useState<string>('');
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { title: 'واجهات المتابعة اليومية', status: 'done' }
  ]);
  const [newDeliverableTitle, setNewDeliverableTitle] = useState<string>('');

  const handleAddDeliverable = () => {
    if (!newDeliverableTitle.trim()) return;
    setDeliverables([...deliverables, { title: newDeliverableTitle.trim(), status: 'done' }]);
    setNewDeliverableTitle('');
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_: Deliverable, idx: number) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    onSave({
      log_date: logDate,
      title: title.trim(),
      summary: summary.trim(),
      hours_spent: Number(hoursSpent),
      progress_percentage: Number(progressPercentage),
      status,
      deliverables,
      notes: notes.trim(),
      created_by_name: 'أدهم كاسب'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        
        {/* Backdrop Fade */}
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
          className="bg-white w-full max-w-xl rounded-[28px] shadow-card-heavy border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[92vh] relative z-10"
        >
          
          {/* Header */}
          <div className="bg-[#F8FAFC] p-6 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-[16px] bg-[#0E6875] text-white flex items-center justify-center shadow-teal">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0F172A] font-tajawal">
                  تسجيل إنجاز يومي جديد (أدهم)
                </h3>
                <p className="text-xs font-bold text-[#475569]">TimeValley — المتابعة اللحظية لإنجازات د. وائل</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-200 text-[#475569] hover:text-[#0F172A] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto no-scrollbar space-y-4 flex-1">
            
            {/* Date & Hours Spent Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#0F172A] mb-1">تاريخ الإنجاز</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogDate(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F172A] mb-1">ساعات العمل المستغرقة</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hoursSpent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoursSpent(parseFloat(e.target.value))}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  required
                />
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-black text-[#0F172A] mb-1">عنوان الإنجاز اليومي</label>
              <input
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="مثال: برمجة شبكة التقويم الشهرية والربط الفوري"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                required
              />
            </div>

            {/* Summary Area */}
            <div>
              <label className="block text-xs font-black text-[#0F172A] mb-1">ملخص الإنجاز والتفاصيل</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)}
                placeholder="شرح مختصر لما تم تطويره وإنجازه خلال اليوم..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] px-4 py-2.5 text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                required
              />
            </div>

            {/* Progress Percentage & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#0F172A] mb-1">
                  نسبة الإنجاز ({progressPercentage}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPercentage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgressPercentage(parseInt(e.target.value))}
                  className="w-full accent-[#0E6875] cursor-pointer mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F172A] mb-1">حالة الإنجاز</label>
                <CustomSelect
                  value={status}
                  onChange={(val: string) => setStatus(val as any)}
                  options={[
                    { value: 'completed', label: 'مكتمل 100% (Completed)', dotColor: 'bg-emerald-500' },
                    { value: 'in_progress', label: 'قيد التنفيذ (In Progress)', dotColor: 'bg-amber-500' },
                    { value: 'delayed', label: 'تأخير محتمل (Delayed)', dotColor: 'bg-rose-500' },
                  ]}
                />
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div>
              <label className="block text-xs font-black text-[#0F172A] mb-1">التسليمات والمهام الفرعية</label>
              <div className="space-y-2 mb-2">
                {deliverables.map((item: Deliverable, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#CBD5E1]">
                    <span className="text-xs font-extrabold text-[#0F172A]">{item.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDeliverableTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDeliverableTitle(e.target.value)}
                  placeholder="أضف تسليمة فرعية (مثال: ضبط الألوان)..."
                  className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[12px] px-3.5 py-2 text-xs font-medium text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="bg-[#0E6875] text-white p-2.5 rounded-[12px] hover:bg-[#063D45] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-black text-[#0F172A] mb-1">ملاحظات إضافية (اختياري)</label>
              <input
                type="text"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                placeholder="روابط Figma، مراجع أو ملحوظات لـ د. وائل..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] px-4 py-2.5 text-xs font-medium text-[#0F172A]"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-[12px] text-xs font-extrabold text-[#475569] hover:bg-slate-100"
              >
                إلغاء
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="bg-[#0E6875] hover:bg-[#063D45] text-white font-extrabold text-xs md:text-sm px-6 py-2.5 rounded-[12px] shadow-teal transition-all"
              >
                حفظ ونشر التقرير اللحظي
              </motion.button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddLogModal;
