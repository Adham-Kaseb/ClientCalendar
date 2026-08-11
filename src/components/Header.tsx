import React, { useState } from 'react';
import { UserRole, NotificationItem, AuthUser } from '../types/database';
import { 
  Calendar, 
  UserCheck, 
  Crown, 
  Bell, 
  PlusCircle, 
  Send, 
  LogOut
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter.tsx';

interface HeaderProps {
  currentRole: UserRole;
  onOpenAddModal: () => void;
  onSendEmailDigest: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
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
  isRealtimeConnected,
  authenticatedUser,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const unreadCount = notifications.filter(
    (n: NotificationItem) => !n.read && n.recipient_role === currentRole
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 lg:px-10 py-4 shadow-subtle transition-all">
      <div className="max-w-[1788px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Project Branding & Title */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-[18px] bg-gradient-to-br from-[#0E6875] to-[#063D45] text-white flex items-center justify-center shadow-teal transform hover:rotate-6 transition-transform shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#0F172A] font-tajawal">
                مشروع تايم فالي
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#475569] font-medium flex items-center gap-2 mt-1">
              <span>التقويم التفاعلي لمتابعة الإنجازات اليومية</span>
              <span className="text-gray-300">•</span>
              <span className="text-[#0E6875] font-extrabold">د. وائل &amp; أدهم كاسب</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Authenticated User Identity */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          
          {/* Authenticated User Badge & Role */}
          {authenticatedUser && (
            <div className="flex items-center gap-2.5 bg-[#F8FAFC] px-4 py-2 rounded-[16px] border border-[#CBD5E1] shadow-inner">
              {authenticatedUser.role === 'client' ? (
                <div className="flex items-center gap-2 text-[#EE6C4D] bg-[#FFF0EC] px-3 py-1 rounded-[12px] border border-[#EE6C4D]/30">
                  <Crown className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-black">{authenticatedUser.name} (العميل الرئيسي)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#0E6875] bg-[#E6F3F5] px-3 py-1 rounded-[12px] border border-[#0E6875]/30">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-black">{authenticatedUser.name} (مُنفّذ المشروع)</span>
                </div>
              )}

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors mr-1"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          )}

          {/* Strict Role Action Button */}
          {currentRole === 'executor' ? (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-[#0E6875] hover:bg-[#063D45] text-white text-xs md:text-sm font-extrabold px-5 py-2.5 rounded-[12px] shadow-teal transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>تسجيل إنجاز اليوم</span>
            </button>
          ) : (
            <button
              onClick={onSendEmailDigest}
              className="flex items-center gap-2 bg-[#EE6C4D] hover:bg-[#DB5A3A] text-white text-xs md:text-sm font-extrabold px-5 py-2.5 rounded-[12px] shadow-coral transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4.5 h-4.5" />
              <span>إرسال إشعار تلخيصي</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white hover:bg-[#F8FAFC] text-[#0F172A] rounded-[14px] border border-[#CBD5E1] shadow-subtle transition-all flex items-center justify-center"
              title="مركز التنبيهات"
            >
              <Bell className="w-5 h-5 text-[#0E6875]" />
              
              {/* Perfect Circular Glowing Unread Counter Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#EE6C4D] to-[#E55335] text-white text-[11px] font-black min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center leading-none ring-2 ring-white shadow-coral animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <NotificationCenter
                notifications={notifications}
                currentRole={currentRole}
                onClose={() => setShowNotifications(false)}
                onMarkRead={onMarkNotificationRead}
              />
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
