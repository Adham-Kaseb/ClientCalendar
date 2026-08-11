import React from 'react';
import { NotificationItem, UserRole } from '../types/database';
import { Bell, Clock, X, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  currentRole: UserRole;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  currentRole,
  onClose,
  onMarkRead,
}) => {
  const roleNotifications = notifications.filter(
    (n: NotificationItem) => n.recipient_role === currentRole
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute left-0 mt-3 w-80 md:w-96 bg-white rounded-[24px] shadow-card-heavy border border-[#CBD5E1] z-[9999] overflow-hidden"
      >
        
        {/* Header */}
        <div className="bg-[#F8FAFC] p-4.5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#0E6875]" />
            <h4 className="text-sm font-black text-[#0F172A] font-tajawal">مركز التنبيهات والإشعارات</h4>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* List */}
        <div className="p-3.5 max-h-[340px] overflow-y-auto space-y-2.5">
          {roleNotifications.length === 0 ? (
            <div className="text-center py-7 text-xs font-bold text-[#475569]">
              <Sparkles className="w-7 h-7 text-[#0E6875]/40 mx-auto mb-2" />
              <span>لا توجد تنبيهات جديدة حالياً</span>
            </div>
          ) : (
            roleNotifications.map((notif: NotificationItem) => (
              <motion.div
                key={notif.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => onMarkRead(notif.id)}
                className={`p-3.5 rounded-[16px] border transition-all cursor-pointer ${
                  notif.read 
                    ? 'bg-white border-[#E2E8F0] opacity-75' 
                    : 'bg-[#FFF0EC] border-[#EE6C4D]/50 shadow-subtle'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs md:text-sm font-black text-[#0F172A]">{notif.title}</span>
                  {!notif.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EE6C4D] animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-[#475569] leading-relaxed font-medium">{notif.body}</p>
                <div className="mt-2 text-[10px] text-[#0E6875] font-extrabold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{notif.created_at ? format(new Date(notif.created_at), 'hh:mm a', { locale: ar }) : 'الآن'}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
          <p className="text-xs font-extrabold text-[#0E6875]">
            نظام التنبيهات مرتبط بـ Resend API و Web Push
          </p>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;
