import React, { useState, useEffect } from 'react';
import { UserRole, DailyLog, Comment, NotificationItem, AuthUser } from './types/database';
import { supabase, INITIAL_DEMO_LOGS, INITIAL_DEMO_COMMENTS, INITIAL_DEMO_NOTIFICATIONS } from './lib/supabase';
import { Header } from './components/Header.tsx';
import { StatsCards } from './components/StatsCards.tsx';
import { CalendarView } from './components/CalendarView.tsx';
import { TimelineView } from './components/TimelineView.tsx';
import { DayDetailsModal } from './components/DayDetailsModal.tsx';
import { AddLogModal } from './components/AddLogModal.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { Calendar, GitCommit, Sparkles, CheckCircle2, Crown } from 'lucide-react';

export function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('timevalley_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('client');
  const [activeTab, setActiveTab] = useState<'calendar' | 'timeline'>('calendar');
  
  const [logs, setLogs] = useState<DailyLog[]>(INITIAL_DEMO_LOGS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_DEMO_COMMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_DEMO_NOTIFICATIONS);

  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedAddDate, setSelectedAddDate] = useState<string>('2026-08-11');
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync currentRole when user authenticates
  useEffect(() => {
    if (authenticatedUser) {
      setCurrentRole(authenticatedUser.role);
    }
  }, [authenticatedUser]);

  // Handle Login Success
  const handleLoginSuccess = (user: AuthUser) => {
    setAuthenticatedUser(user);
    setCurrentRole(user.role);
    localStorage.setItem('timevalley_auth_user', JSON.stringify(user));
    triggerToast(`أهلاً بك، ${user.name}! تم تسجيل الدخول بنجاح`);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem('timevalley_auth_user');
  };

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch initial logs & setup Supabase Realtime listeners
  useEffect(() => {
    if (!authenticatedUser) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: logsData } = await supabase
          .from('daily_logs')
          .select('*')
          .order('log_date', { ascending: true });

        if (logsData && logsData.length > 0) {
          setLogs(logsData as DailyLog[]);
        }

        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: true });

        if (commentsData && commentsData.length > 0) {
          setComments(commentsData as Comment[]);
        }

        const { data: notifData } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (notifData && notifData.length > 0) {
          setNotifications(notifData as NotificationItem[]);
        }
      } catch (err) {
        console.log('Using local fallback data for initial render');
      }
    };

    fetchSupabaseData();

    // Subscribe to Realtime Postgres changes
    const channel = supabase
      .channel('timevalley_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_logs' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newLog = payload.new as DailyLog;
            setLogs((prev: DailyLog[]) => [...prev.filter((l: DailyLog) => l.log_date !== newLog.log_date), newLog]);
            triggerToast(`تم إضافة إنجاز يوم جديد: ${newLog.title}`);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as DailyLog;
            setLogs((prev: DailyLog[]) => prev.map((l: DailyLog) => l.id === updated.id ? updated : l));
            triggerToast(`تم تحديث إنجاز يوم ${updated.log_date}`);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload: any) => {
          const newComment = payload.new as Comment;
          setComments((prev: Comment[]) => [...prev, newComment]);
          triggerToast(`تعليق جديد من ${newComment.author_name}`);
        }
      )
      .subscribe((status: string) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authenticatedUser]);

  // Handle Adding New Daily Log (Adham)
  const handleSaveLog = async (newLogData: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>) => {
    const tempId = `log-${Date.now()}`;
    const newLog: DailyLog = {
      ...newLogData,
      id: tempId,
      created_at: new Date().toISOString()
    };

    // Optimistic UI update
    setLogs((prev: DailyLog[]) => [...prev.filter((l: DailyLog) => l.log_date !== newLog.log_date), newLog]);
    setShowAddModal(false);

    // Add Notification for Dr. Wael
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipient_role: 'client',
      title: 'تم تسجيل إنجاز اليوم من قبل أدهم',
      body: `قام أدهم بتسجيل إنجاز يوم ${newLog.log_date}: ${newLog.title}`,
      read: false,
      created_at: new Date().toISOString()
    };
    setNotifications((prev: NotificationItem[]) => [newNotif, ...prev]);
    triggerToast('تم حفظ الإنجاز بنجاح ونشر الإشعار اللحظي لـ د. وائل');

    // Sync to Supabase Postgres
    try {
      await supabase.from('daily_logs').upsert({
        log_date: newLog.log_date,
        title: newLog.title,
        summary: newLog.summary,
        hours_spent: newLog.hours_spent,
        progress_percentage: newLog.progress_percentage,
        status: newLog.status,
        deliverables: newLog.deliverables,
        notes: newLog.notes,
        created_by_name: newLog.created_by_name
      });
      await supabase.from('notifications').insert({
        recipient_role: newNotif.recipient_role,
        title: newNotif.title,
        body: newNotif.body
      });
    } catch (err) {
      console.log('Saved to state (Supabase sync in background)');
    }
  };

  // Handle Adding Comment (Dr. Wael or Adham)
  const handleAddComment = async (logId: string, content: string) => {
    const authorName = authenticatedUser ? authenticatedUser.name : (currentRole === 'client' ? 'د. وائل' : 'أدهم كاسب');
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      log_id: logId,
      author_name: authorName,
      author_role: currentRole,
      content,
      created_at: new Date().toISOString()
    };

    setComments((prev: Comment[]) => [...prev, newComment]);
    triggerToast('تمت إضافة التعليق وإرساله فوراً');

    try {
      await supabase.from('comments').insert({
        log_id: logId,
        author_name: newComment.author_name,
        author_role: newComment.author_role,
        content: newComment.content
      });
    } catch (err) {
      console.log('Comment stored locally');
    }
  };

  // Handle Sending Email Digest simulation
  const handleSendEmailDigest = () => {
    const todayLog = logs.find((l: DailyLog) => l.log_date === '2026-08-11') || logs[logs.length - 1];
    triggerToast(`تم إرسال إيميل تلخيص الإنجاز اليومي عبر Resend إلى د. وائل (wael@timevalley.com)`);
    
    const notif: NotificationItem = {
      id: `n-digest-${Date.now()}`,
      recipient_role: 'client',
      title: 'إشعار إيميل يومي (Resend Alert)',
      body: `تم إرسال ملخص إنجاز اليوم (${todayLog?.title || 'إنجاز تايم فالي'}) لـ د. وائل.`,
      read: false,
      created_at: new Date().toISOString()
    };
    setNotifications((prev: NotificationItem[]) => [notif, ...prev]);
  };

  // Mark notification read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev: NotificationItem[]) => prev.map((n: NotificationItem) => n.id === id ? { ...n, read: true } : n));
  };

  // If user is not authenticated, show LoginPage gate
  if (!authenticatedUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-tajawal pb-16">
      
      {/* Top Navbar */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenAddModal={() => { setSelectedAddDate('2026-08-11'); setShowAddModal(true); }}
        onSendEmailDigest={handleSendEmailDigest}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        isRealtimeConnected={isRealtimeConnected}
        authenticatedUser={authenticatedUser}
        onSignOut={handleSignOut}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-[#0E6875] text-white px-6 py-4 rounded-[18px] shadow-teal flex items-center gap-3 animate-slideUp border border-white/20">
          <Sparkles className="w-6 h-6 text-[#EE6C4D]" />
          <span className="text-sm font-extrabold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-[1788px] mx-auto px-4 lg:px-10 pt-8">
        
        {/* Project Hero Header Banner */}
        <div className="card-elevation p-8 lg:p-10 bg-gradient-to-br from-[#0E6875] via-[#0B535E] to-[#063D45] text-white relative overflow-hidden mb-8 shadow-strong">
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black font-tajawal tracking-tight leading-tight">
                لوحة المتابعة اليومية والتقويم التفاعلي
              </h2>
              <p className="text-sm lg:text-base text-white/90 mt-2 max-w-3xl leading-relaxed font-medium">
                مرحباً بك {authenticatedUser.name}! يتم تحديث هذا التقويم فور تسجيل أي إنجاز يومي بواسطة أدهم دون الحاجة لإعادة تحميل الصفحة (Supabase Realtime Engine).
              </p>
            </div>

            {/* Quick Mode Indicator Box */}
            <div className="bg-white/15 backdrop-blur-lg p-5 rounded-[22px] border border-white/25 text-center shrink-0 w-full sm:w-auto shadow-glass">
              <p className="text-xs font-bold text-white/80">وضع الاستعراض الحالي:</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {currentRole === 'client' ? (
                  <>
                    <Crown className="w-6 h-6 text-[#EE6C4D]" />
                    <span className="font-black text-base text-[#EE6C4D]">حساب د. وائل (عرض للتعليق)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="font-black text-base text-emerald-300">حساب أدهم (إضافة وتحديث)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Header */}
        <StatsCards logs={logs} currentRole={currentRole} />

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between my-6 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[16px] text-xs md:text-sm font-black transition-all ${
                activeTab === 'calendar'
                  ? 'bg-[#0E6875] text-white shadow-teal ring-2 ring-[#0E6875]/20'
                  : 'bg-white text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1]'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" />
              <span>التقويم التفاعلي (Calendar Grid)</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[16px] text-xs md:text-sm font-black transition-all ${
                activeTab === 'timeline'
                  ? 'bg-[#0E6875] text-white shadow-teal ring-2 ring-[#0E6875]/20'
                  : 'bg-white text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1]'
              }`}
            >
              <GitCommit className="w-4.5 h-4.5" />
              <span>التسلسل الزمني للإنجازات (Timeline)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-[#475569]">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shadow-sm" />
            <span>مكتمل 100%</span>
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm mr-3" />
            <span>قيد التنفيذ</span>
          </div>
        </div>

        {/* Main View Component */}
        {activeTab === 'calendar' ? (
          <CalendarView
            logs={logs}
            currentRole={currentRole}
            onSelectLog={(log: DailyLog) => setSelectedLog(log)}
            onOpenAddForDate={(dateStr: string) => {
              setSelectedAddDate(dateStr);
              setShowAddModal(true);
            }}
          />
        ) : (
          <TimelineView
            logs={logs}
            comments={comments}
            currentRole={currentRole}
            onSelectLog={(log: DailyLog) => setSelectedLog(log)}
          />
        )}

      </main>

      {/* Day Details Modal */}
      {selectedLog && (
        <DayDetailsModal
          log={selectedLog}
          currentRole={currentRole}
          comments={comments}
          onClose={() => setSelectedLog(null)}
          onAddComment={handleAddComment}
          onApproveLog={(logId: string) => {
            triggerToast('تم اعتماد تقرير الإنجاز بنجاح من د. وائل!');
            setSelectedLog(null);
          }}
        />
      )}

      {/* Add Log Modal */}
      {showAddModal && (
        <AddLogModal
          initialDate={selectedAddDate}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveLog}
        />
      )}

    </div>
  );
}

export default App;
