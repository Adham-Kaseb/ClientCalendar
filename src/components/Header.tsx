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
  RotateCcw
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter.tsx';

interface HeaderProps {
  currentRole: UserRole;
  onOpenAddModal: () => void;
  onSendEmailDigest: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onResetCalendarProgress?: () => void;
  isResetting?: boolean;
  isRealtimeConnected: boolean;
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
  onResetCalendarProgress,
  isResetting = false,
  isRealtimeConnected,
  authenticatedUser,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const unreadCount = notifications.filter(
    (n: NotificationItem) => !n.read && n.recipient_role === currentRole
  ).length;

  return (
    <header className="relative md:sticky md:top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-3 sm:px-6 lg:px-10 py-3 sm:py-4 shadow-subtle transition-all">
      <div className="max-w-[1788px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Top Header Row on Mobile: Brand Title & Notification Trigger */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#0F172A] font-tajawal">
            مشروع TimeValley
          </h1>

          {/* Mobile Notifications Bell Trigger & Logout */}
          <div className="flex md:hidden items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-white hover:bg-[#F8FAFC] text-[#0F172A] rounded-[12px] border border-[#CBD5E1] shadow-subtle transition-all flex items-center justify-center"
                title="مركز التنبيهات"
              >
                <Bell className="w-4.5 h-4.5 text-[#0E6875]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#EE6C4D] to-[#E55335] text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none ring-2 ring-white shadow-coral animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

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
              <button
                onClick={onSignOut}
                className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 rounded-[12px] transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Authenticated User Identity */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full md:w-auto">
          
          {/* Authenticated User Badge & Role */}
          {authenticatedUser && (
            <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 sm:px-4 py-1.5 sm:py-2 rounded-[14px] sm:rounded-[16px] border border-[#CBD5E1] shadow-inner text-[11px] sm:text-xs md:text-sm">
              {authenticatedUser.role === 'client' ? (
                <div className="flex items-center gap-1.5 text-[#EE6C4D] bg-[#FFF0EC] px-2.5 py-1 rounded-[10px] sm:rounded-[12px] border border-[#EE6C4D]/30">
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="font-black truncate max-w-[140px] sm:max-w-none">{authenticatedUser.name} (العميل)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[#0E6875] bg-[#E6F3F5] px-2.5 py-1 rounded-[10px] sm:rounded-[12px] border border-[#0E6875]/30">
                  <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="font-black truncate max-w-[140px] sm:max-w-none">{authenticatedUser.name} (المُنفّذ)</span>
                </div>
              )}

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="hidden md:block p-1.5 text-slate-400 hover:text-rose-600 transition-colors mr-1"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          )}

          {/* Protected Master Reset Button (Adham/Executor Only) */}
          {currentRole === 'executor' && onResetCalendarProgress && (
            <button
              onClick={onResetCalendarProgress}
              disabled={isResetting}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] sm:text-xs md:text-sm font-extrabold px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-[12px] shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              title="تصفير التقويم ومسح كافة سجلات المتابعة والتجهيز للإطلاق الرسمى فورياً على جميع الأجهزة (Realtime)"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-rose-600 shrink-0 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'جاري التصفير اللحظي...' : 'تصفير التقويم للإطلاق'}</span>
            </button>
          )}

          {/* Strict Role Action Button */}
          {currentRole === 'executor' ? (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 bg-[#0E6875] hover:bg-[#063D45] text-white text-[11px] sm:text-xs md:text-sm font-extrabold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-[12px] shadow-teal transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>تسجيل إنجاز اليوم</span>
            </button>
          ) : (
            <button
              onClick={onSendEmailDigest}
              className="flex items-center gap-1.5 bg-[#EE6C4D] hover:bg-[#DB5A3A] text-white text-[11px] sm:text-xs md:text-sm font-extrabold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-[12px] shadow-coral transition-all transform hover:-translate-y-0.5"
              title="إرسال التقرير التنفيذي الشامل وتفاصيل التسليمات إلى د. وائل عبر الإيميل"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>إرسال التقرير لـ د. وائل</span>
            </button>
          )}

          {/* Desktop Notifications Trigger */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white hover:bg-[#F8FAFC] text-[#0F172A] rounded-[14px] border border-[#CBD5E1] shadow-subtle transition-all flex items-center justify-center"
              title="مركز التنبيهات"
            >
              <Bell className="w-5 h-5 text-[#0E6875]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#EE6C4D] to-[#E55335] text-white text-[11px] font-black min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center leading-none ring-2 ring-white shadow-coral animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

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
