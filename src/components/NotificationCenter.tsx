import React from "react";
import { NotificationItem, UserRole } from "../types/database";
import {
  Bell,
  Clock,
  X,
  Sparkles,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

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

  const unreadCount = roleNotifications.filter(
    (n: NotificationItem) => !n.read
  ).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="absolute left-0 mt-3.5 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-card-heavy border border-[#CBD5E1] z-[99999] overflow-hidden text-right"
      >
        {/* Decorative Caret Pointer */}
        <div className="absolute -top-2 left-5 w-4 h-4 bg-white border-t border-l border-[#CBD5E1] rotate-45" />

        {/* Header */}
        <div className="bg-[#F8FAFC] p-4.5 lg:p-5 border-b border-[#E2E8F0] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#0E6875] text-white flex items-center justify-center shadow-teal shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#0F172A] font-tajawal">
                  التنبيهات اللحظية
                </h4>
                {unreadCount > 0 && (
                  <span className="bg-[#EE6C4D] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-coral">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-[#475569]">
                مشروع تايم فالي
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-[#475569] hover:text-[#0F172A] hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </motion.button>
        </div>

        {/* List Body */}
        <div className="p-3.5 max-h-[360px] overflow-y-auto no-scrollbar space-y-2.5 relative z-10">
          {roleNotifications.length === 0 ? (
            <div className="text-center py-10 px-4 bg-[#F8FAFC] rounded-[22px] border border-dashed border-[#CBD5E1] my-1">
              <div className="w-12 h-12 rounded-full bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-black text-[#0F172A]">
                صندوق التنبيهات هادئ الآن
              </h5>
              <p className="text-xs text-[#475569] mt-1 font-medium leading-relaxed max-w-[240px] mx-auto">
                سيصلك إشعار فور تسجيل إنجاز يوم جديد أو إرسال ملاحظات على
                المشروع.
              </p>
            </div>
          ) : (
            roleNotifications.map((notif: NotificationItem) => (
              <motion.div
                key={notif.id}
                whileHover={{ y: -2 }}
                onClick={() => onMarkRead(notif.id)}
                className={`p-4 rounded-[20px] border transition-all cursor-pointer relative ${
                  notif.read
                    ? "bg-white border-[#E2E8F0] opacity-80"
                    : "bg-[#FFF0EC] border-[#EE6C4D]/40 shadow-subtle hover:border-[#EE6C4D]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs md:text-sm font-black text-[#0F172A] leading-snug">
                    {notif.title}
                  </span>
                  {!notif.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EE6C4D] shrink-0 animate-pulse mt-1" />
                  )}
                </div>

                <p className="text-xs text-[#475569] leading-relaxed font-medium">
                  {notif.body}
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] font-extrabold text-[#0E6875]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notif.created_at
                      ? format(new Date(notif.created_at), "hh:mm a", {
                          locale: ar,
                        })
                      : "الآن"}
                  </span>

                  {notif.read ? (
                    <span className="flex items-center gap-1 text-slate-400 font-bold">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      مقروء
                    </span>
                  ) : (
                    <span className="text-[#EE6C4D] font-black">
                      انقر للتمييز كمقروء
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center relative z-10 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0E6875]" />
          <p className="text-[11px] font-extrabold text-[#0E6875]">
            تحديث فوري عبر Supabase Realtime &amp; Resend
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;
