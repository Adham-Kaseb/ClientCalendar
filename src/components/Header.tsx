import React, { useState } from 'react';
import { UserRole, NotificationItem, AuthUser } from '../types/database';
import { 
  Calendar, 
  UserCheck, 
  Crown, 
  Bell, 
  PlusCircle, 
  Send, 
  LogOut,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter.tsx';
import { motion } from 'framer-motion';

interface HeaderProps {
  currentRole: UserRole;
  onOpenAddModal: () => void;
  onSendEmailDigest: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onResetCalendarProgress?: () => void;
  isResetting?: boolean;
  isRealtimeConnected?: boolean;
  authenticatedUser?: AuthUser | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onOpenAddModal,
  onSendEmailDigest,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  authenticatedUser,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const unreadCount = notifications.filter(
    (n: NotificationItem) => !n.read && n.recipient_role === currentRole
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] px-4 sm:px-8 lg:px-12 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-[1788px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Title Row */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[16px] bg-gradient-to-br from-[#0E6875] to-[#063D45] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(14,104,117,0.35)] shrink-0 transform hover:rotate-6 transition-transform">
              <Calendar className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] font-tajawal">
                  مشروع TimeValley
                </h1>
              </div>
              <p className="text-[11px] font-bold text-slate-500 hidden sm:block">
                التقويم التفاعلي لمتابعة الإنجازات والتسليمات
              </p>
            </div>
          </div>

          {/* Mobile Notifications Bell Trigger & Logout */}
          <div className="flex md:hidden items-center gap-2">
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-white hover:bg-slate-50 text-[#0F172A] rounded-[14px] border border-[#CBD5E1] shadow-sm transition-all flex items-center justify-center"
                title="مركز التنبيهات"
              >
                <Bell className="w-5 h-5 text-[#0E6875]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#EE6C4D] to-[#E55335] text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none ring-2 ring-white shadow-coral animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {showNotifications && (
                <NotificationCenter
                  notifications={notifications}
                  currentRole={currentRole}
                  onClose={() => setShowNotifications(false)}
                  onMarkRead={onMarkNotificationRead}
                  onClearAll={onClearAllNotifications}
                />
              )}
            </div>

            {authenticatedUser && onSignOut && (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onSignOut}
                className="p-2.5 text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-[14px] transition-colors border border-slate-200"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4.5 h-4.5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Action Controls & User Identity */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full md:w-auto">
          
          {/* Authenticated User Badge & Role */}
          {authenticatedUser && (
            <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 pl-3 rounded-[18px] border border-[#CBD5E1] shadow-inner text-xs md:text-sm font-tajawal">
              {authenticatedUser.role === 'client' ? (
                <div className="flex items-center gap-2 text-[#EE6C4D] bg-[#FFF0EC] px-3 py-1.5 rounded-[14px] border border-[#EE6C4D]/30 font-black shadow-sm">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-none">{authenticatedUser.name} (العميل)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#0E6875] bg-[#E6F3F5] px-3 py-1.5 rounded-[14px] border border-[#0E6875]/30 font-black shadow-sm">
                  <UserCheck className="w-4 h-4 text-[#0E6875] shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-none">{authenticatedUser.name} (المُنفّذ)</span>
                </div>
              )}

              {onSignOut && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onSignOut}
                  className="hidden md:flex p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all mr-0.5"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </motion.button>
              )}
            </div>
          )}

          {/* Role Action Button */}
          {currentRole === 'executor' ? (
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0E6875] to-[#0B535E] hover:from-[#0B535E] hover:to-[#063D45] text-white text-xs sm:text-sm font-black px-5 py-3 rounded-[16px] shadow-[0_4px_16px_rgba(14,104,117,0.35)] hover:shadow-[0_6px_20px_rgba(14,104,117,0.5)] transition-all font-tajawal"
            >
              <PlusCircle className="w-4.5 h-4.5 shrink-0" />
              <span>تسجيل إنجاز اليوم</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSendEmailDigest}
              className="flex items-center gap-2 bg-gradient-to-r from-[#EE6C4D] to-[#E55335] hover:from-[#E55335] hover:to-[#D44224] text-white text-xs sm:text-sm font-black px-5 py-3 rounded-[16px] shadow-[0_4px_16px_rgba(238,108,77,0.35)] hover:shadow-[0_6px_20px_rgba(238,108,77,0.5)] transition-all font-tajawal"
              title="إرسال التقرير التنفيذي الشامل وتفاصيل التسليمات إلى د. وائل عبر الإيميل"
            >
              <Send className="w-4.5 h-4.5 shrink-0" />
              <span>إرسال التقرير لـ د. وائل</span>
            </motion.button>
          )}

          {/* Desktop Notifications Trigger */}
          <div className="hidden md:block relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white hover:bg-slate-50 text-[#0F172A] rounded-[16px] border border-[#CBD5E1] shadow-sm transition-all flex items-center justify-center"
              title="مركز التنبيهات"
            >
              <Bell className="w-5 h-5 text-[#0E6875]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#EE6C4D] to-[#E55335] text-white text-[11px] font-black min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center leading-none ring-2 ring-white shadow-coral animate-pulse">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {showNotifications && (
              <NotificationCenter
                notifications={notifications}
                currentRole={currentRole}
                onClose={() => setShowNotifications(false)}
                onMarkRead={onMarkNotificationRead}
                onClearAll={onClearAllNotifications}
              />
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
