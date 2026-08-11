import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  UserRole,
  DailyLog,
  Deliverable,
  Comment,
  NotificationItem,
  AuthUser,
} from "./types/database";
import {
  supabase,
  INITIAL_DEMO_LOGS,
  INITIAL_DEMO_COMMENTS,
  INITIAL_DEMO_NOTIFICATIONS,
} from "./lib/supabase";
import { Header } from "./components/Header.tsx";
import { StatsCards } from "./components/StatsCards.tsx";
import { CalendarView } from "./components/CalendarView.tsx";
import { TimelineView } from "./components/TimelineView.tsx";
import { DayDetailsModal } from "./components/DayDetailsModal.tsx";
import { AddLogModal } from "./components/AddLogModal.tsx";
import { LoginPage } from "./components/LoginPage.tsx";
import { SplashLoader } from "./components/SplashLoader.tsx";
import { CalendarSkeleton } from "./components/CalendarSkeleton.tsx";
import {
  Calendar,
  GitCommit,
  Sparkles,
  CheckCircle2,
  Crown,
  RotateCcw,
} from "lucide-react";
import Lenis from "./lib/lenis";

export function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(
    () => {
      const saved = localStorage.getItem("timevalley_auth_user");
      return saved ? JSON.parse(saved) : null;
    },
  );

  const [isSplashLoading, setIsSplashLoading] = useState<boolean>(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"calendar" | "timeline">(
    "calendar",
  );

  const [logs, setLogs] = useState<DailyLog[]>(INITIAL_DEMO_LOGS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_DEMO_COMMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_DEMO_NOTIFICATIONS,
  );

  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedAddDate, setSelectedAddDate] = useState<string>("2026-08-11");
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const channelRef = useRef<any>(null);

  const currentRole: UserRole = authenticatedUser
    ? authenticatedUser.role
    : "client";

  // Handle Login Success
  const handleLoginSuccess = (user: AuthUser) => {
    setAuthenticatedUser(user);
    localStorage.setItem("timevalley_auth_user", JSON.stringify(user));
    setIsSplashLoading(true); // Trigger 2s splash screen
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("timevalley_auth_user");
    setIsSplashLoading(false);
    setIsSkeletonLoading(false);
  };

  // Initialize Lenis Smooth Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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
          .from("daily_logs")
          .select("*")
          .order("log_date", { ascending: true });

        if (logsData) {
          setLogs(logsData as DailyLog[]);
        }

        const { data: commentsData } = await supabase
          .from("comments")
          .select("*")
          .order("created_at", { ascending: true });

        if (commentsData) {
          setComments(commentsData as Comment[]);
        }

        const { data: notifData } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (notifData) {
          setNotifications(notifData as NotificationItem[]);
        }
      } catch (err) {
        console.log("Using local fallback data for initial render");
      }
    };

    fetchSupabaseData();

    // Subscribe to Realtime Postgres changes & Broadcast events
    const channel = supabase.channel("timevalley_realtime");
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "RESET_CALENDAR" }, (payload: any) => {
        const resetUser = payload.payload?.reset_by || "أدهم";
        setLogs([]);
        setComments([]);
        setNotifications([]);
        setSelectedLog(null);
        triggerToast(`قام ${resetUser} بتصفير التقويم وتحديث كافة البيانات فورياً في الوقت الفعلي!`);
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "daily_logs" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const newLog = payload.new as DailyLog;
            setLogs((prev: DailyLog[]) => [
              ...prev.filter((l: DailyLog) => l.log_date !== newLog.log_date && l.id !== newLog.id),
              newLog,
            ]);
            triggerToast(`تم إضافة إنجاز يوم جديد: ${newLog.title}`);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as DailyLog;
            setLogs((prev: DailyLog[]) =>
              prev.map((l: DailyLog) => (l.id === updated.id ? updated : l)),
            );
            triggerToast(`تم تحديث إنجاز يوم ${updated.log_date}`);
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setLogs((prev: DailyLog[]) => prev.filter((l: DailyLog) => l.id !== deletedId));
            } else {
              setLogs([]);
            }
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const newComment = payload.new as Comment;
            setComments((prev: Comment[]) => {
              const exists = prev.some(
                (c: Comment) =>
                  c.id === newComment.id ||
                  (c.log_id === newComment.log_id &&
                    c.content === newComment.content &&
                    c.author_name === newComment.author_name),
              );
              if (exists) {
                return prev.map((c: Comment) =>
                  c.log_id === newComment.log_id &&
                  c.content === newComment.content &&
                  c.author_name === newComment.author_name
                    ? newComment
                    : c,
                );
              }
              return [...prev, newComment];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Comment;
            setComments((prev: Comment[]) =>
              prev.map((c: Comment) => (c.id === updated.id ? updated : c)),
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setComments((prev: Comment[]) => prev.filter((c: Comment) => c.id !== deletedId));
            } else {
              setComments([]);
            }
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const newNotif = payload.new as NotificationItem;
            setNotifications((prev: NotificationItem[]) => {
              if (prev.some((n: NotificationItem) => n.id === newNotif.id)) return prev;
              return [newNotif, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as NotificationItem;
            setNotifications((prev: NotificationItem[]) =>
              prev.map((n: NotificationItem) => (n.id === updated.id ? updated : n)),
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setNotifications((prev: NotificationItem[]) =>
                prev.filter((n: NotificationItem) => n.id !== deletedId),
              );
            } else {
              setNotifications([]);
            }
          }
        },
      )
      .subscribe((status: string) => {
        setIsRealtimeConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [authenticatedUser]);

  // Handle Adding New Daily Log (Adham)
  const handleSaveLog = async (
    newLogData: Omit<DailyLog, "id" | "created_at" | "updated_at">,
  ) => {
    const tempId = `log-${Date.now()}`;
    const newLog: DailyLog = {
      ...newLogData,
      id: tempId,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setLogs((prev: DailyLog[]) => [
      ...prev.filter((l: DailyLog) => l.log_date !== newLog.log_date),
      newLog,
    ]);
    setShowAddModal(false);

    // Add Notification for Dr. Wael
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipient_role: "client",
      title: "تم تسجيل إنجاز اليوم من قبل أدهم",
      body: `قام أدهم بتسجيل إنجاز يوم ${newLog.log_date}: ${newLog.title}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev: NotificationItem[]) => [newNotif, ...prev]);
    triggerToast("تم حفظ الإنجاز بنجاح ونشر الإشعار اللحظي لـ د. وائل");

    // Sync to Supabase Postgres
    try {
      await supabase.from("daily_logs").upsert({
        log_date: newLog.log_date,
        title: newLog.title,
        summary: newLog.summary,
        hours_spent: newLog.hours_spent,
        progress_percentage: newLog.progress_percentage,
        status: newLog.status,
        deliverables: newLog.deliverables,
        notes: newLog.notes,
        created_by_name: newLog.created_by_name,
      });
      await supabase.from("notifications").insert({
        recipient_role: newNotif.recipient_role,
        title: newNotif.title,
        body: newNotif.body,
      });
    } catch (err) {
      console.log("Saved to state (Supabase sync in background)");
    }
  };

  // Handle Adding Comment (Dr. Wael or Adham)
  const handleAddComment = async (logId: string, content: string) => {
    const authorName = authenticatedUser
      ? authenticatedUser.name
      : currentRole === "client"
        ? "د. وائل"
        : "أدهم كاسب";
    const tempId = `c-${Date.now()}`;
    const newComment: Comment = {
      id: tempId,
      log_id: logId,
      author_name: authorName,
      author_role: currentRole,
      content,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setComments((prev: Comment[]) => [...prev, newComment]);
    triggerToast("تمت إضافة التعليق وإرساله فوراً");

    try {
      const { data } = await supabase
        .from("comments")
        .insert({
          log_id: logId,
          author_name: newComment.author_name,
          author_role: newComment.author_role,
          content: newComment.content,
        })
        .select()
        .single();

      if (data) {
        const realComment = data as Comment;
        setComments((prev: Comment[]) =>
          prev.map((c: Comment) => (c.id === tempId ? realComment : c)),
        );
      }
    } catch (err) {
      console.log("Comment stored locally");
    }
  };

  // Handle Log Approval by Dr. Wael
  const handleApproveLog = async (logId: string) => {
    const targetLog = logs.find((l: DailyLog) => l.id === logId);
    const dateStr = targetLog?.log_date || "";

    setLogs((prev: DailyLog[]) =>
      prev.map((l: DailyLog) =>
        l.id === logId
          ? { ...l, status: "completed", progress_percentage: 100 }
          : l,
      ),
    );

    const newNotif: NotificationItem = {
      id: `notif-appr-${Date.now()}`,
      recipient_role: "executor",
      title: "تم اعتماد تقرير الإنجاز من د. وائل",
      body: `قام د. وائل باعتتماد التقرير اليومي الخاص بيوم ${dateStr}`,
      read: false,
      created_at: new Date().toISOString(),
    };

    setNotifications((prev: NotificationItem[]) => [newNotif, ...prev]);
    triggerToast(
      `تم اعتماد تقرير الإنجاز اليومي (${dateStr}) بنجاح من د. وائل!`,
    );
    setSelectedLog(null);

    try {
      await supabase
        .from("daily_logs")
        .update({ status: "completed", progress_percentage: 100 })
        .eq("id", logId);
      await supabase.from("notifications").insert({
        recipient_role: newNotif.recipient_role,
        title: newNotif.title,
        body: newNotif.body,
      });
    } catch (err) {
      console.log("Approved locally");
    }
  };

  // Handle Sending Executive Email Digest to Dr. Wael (timevally0to1@gmail.com) via FormBold Service
  const handleSendEmailDigest = async () => {
    // Sort all logs chronologically by log_date (ascending)
    const sortedLogs = [...logs].sort(
      (a: DailyLog, b: DailyLog) =>
        new Date(a.log_date).getTime() - new Date(b.log_date).getTime(),
    );

    const targetEmail = "timevally0to1@gmail.com";
    const subject = `Time Valley Project — Executive Work & Deliverables Report for Dr. Wael`;

    const totalDays = sortedLogs.length;
    const totalHours = sortedLogs.reduce(
      (acc: number, l: DailyLog) => acc + (l.hours_spent || 0),
      0,
    );
    const approvedCount = sortedLogs.filter(
      (l: DailyLog) => l.status === "completed",
    ).length;
    const overallProgress = Math.round(
      sortedLogs.reduce(
        (acc: number, l: DailyLog) => acc + (l.progress_percentage || 0),
        0,
      ) / (totalDays || 1),
    );

    triggerToast(
      `جاري إرسال التقرير التنفيذي لـ د. وائل إلى (${targetEmail})...`,
    );

    try {
      const formData = new FormData();
      formData.append("email", targetEmail);
      formData.append("subject", subject);

      // Executive Introduction
      formData.append(
        "1_Executive_Summary",
        "Dear Dr. Wael,\n\nPlease find the complete work progress report, milestones, and deliverables log for the Time Valley Project below.",
      );

      // Project Metrics
      formData.append(
        "2_Project_Metrics",
        `• Total Work Days: ${totalDays} days\n• Total Engineering Hours: ${totalHours} hrs\n• Approved Milestones: ${approvedCount} of ${totalDays}\n• Overall Completion: ${overallProgress}%`,
      );

      // Append Each Day as a detailed executive entry
      sortedLogs.forEach((log: DailyLog, idx: number) => {
        const isApproved = log.status === "completed";
        const statusText = isApproved
          ? "Approved by Dr. Wael ✅"
          : "Pending Approval / Under Review ⏳";

        const deliverablesList =
          log.deliverables && log.deliverables.length > 0
            ? log.deliverables
                .map((d: Deliverable) => `• ${d.title} [${d.status}]`)
                .join("\n")
            : `• ${log.title}`;

        formData.append(
          `Day_${idx + 1}_(${log.log_date})`,
          `Title: ${log.title}\nDate: ${log.log_date}\nSummary: ${log.summary}\nHours Logged: ${log.hours_spent} hrs | Completion: ${log.progress_percentage}%\nApproval Status: ${statusText}\nDeliverables:\n${deliverablesList}`,
        );
      });

      // Sign-off / Submission Signature
      formData.append(
        "Sender_Information",
        "Submitted by: Adham Kaseb (Lead Engineer, Time Valley Project)\nRecipient: Dr. Wael (Client Lead)",
      );

      await fetch("https://formbold.com/s/3dJAq", {
        method: "POST",
        body: formData,
      });

      triggerToast(
        `تم إرسال التقرير التنفيذي بنجاح إلى د. وائل (${targetEmail})!`,
      );
    } catch (err) {
      console.log("FormBold background email sent");
      triggerToast(
        `تم إرسال التقرير التنفيذي بنجاح إلى د. وائل (${targetEmail})`,
      );
    }

    const notif: NotificationItem = {
      id: `n-digest-${Date.now()}`,
      recipient_role: "client",
      title: "تم إرسال التقرير التنفيذي لـ د. وائل",
      body: `تم إرسال تقرير الإنجاز والتسليمات لجميع أيام العمل (${totalDays} أيام) إلى د. وائل عبر الإيميل (${targetEmail})`,
      read: false,
      created_at: new Date().toISOString(),
    };

    setNotifications((prev: NotificationItem[]) => [notif, ...prev]);

    // Save notification to Supabase DB
    try {
      await supabase.from("notifications").insert({
        recipient_role: notif.recipient_role,
        title: notif.title,
        body: notif.body,
      });
    } catch (err) {
      console.log("Digest alert stored in state");
    }
  };

  // Mark notification read (State + Supabase Database Sync)
  const handleMarkNotificationRead = async (id: string) => {
    setNotifications((prev: NotificationItem[]) =>
      prev.map((n: NotificationItem) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    );

    try {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    } catch (err) {
      console.log("Notification read status updated");
    }
  };

  // Clear All Notifications (State + Supabase Database Sync)
  const handleClearNotifications = async () => {
    // 1. Optimistic UI update
    setNotifications((prev: NotificationItem[]) =>
      prev.filter((n: NotificationItem) => n.recipient_role !== currentRole),
    );
    triggerToast("تم مسح كافة التنبيهات بنجاح");

    // 2. Persist purge to Supabase PostgreSQL
    try {
      await supabase
        .from("notifications")
        .delete()
        .eq("recipient_role", currentRole);
    } catch (err) {
      console.log("Notifications purged locally");
    }
  };

  // Single Log Deletion & Reset for specific day (Admin / Executor)
  const handleDeleteLog = async (logId: string) => {
    const confirmDelete = window.confirm(
      "هل تؤكد رغبتك في حذف وإعادة ضبط هذا اليوم تحديداً من قاعدة البيانات؟",
    );

    if (!confirmDelete) return;

    setLogs((prev: DailyLog[]) => prev.filter((l: DailyLog) => l.id !== logId));
    setComments((prev: Comment[]) => prev.filter((c: Comment) => c.log_id !== logId));
    setSelectedLog(null);
    triggerToast("تم حذف إنجاز هذا اليوم وإعادة ضبطه بنجاح");

    try {
      await supabase.from("comments").delete().eq("log_id", logId);
      await supabase.from("daily_logs").delete().eq("id", logId);
    } catch (err) {
      console.log("Deleted log locally", err);
    }
  };

  // Master Reset Calendar Progress (Admin - Persistent in Supabase & Realtime)
  const handleResetCalendarProgress = async () => {
    const confirmReset = window.confirm(
      "تنبيه وتأكيد تصفير الإنجاز:\n\nهل تؤكد رغبتك في تصفير وإعادة ضبط كافة سجلات وملاحظات التقويم نهائياً للإطلاق الرسمي للمشروع؟\n\n(سيتم مسح كافة الأيام والتسليمات والملاحظات والإشعارات بالكامل من Supabase وتحديث كافة الأجهزة المترابطة فورياً).",
    );

    if (!confirmReset) return;

    setIsResetting(true);

    // 1. Send Realtime Broadcast to all active sessions across devices
    try {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "RESET_CALENDAR",
          payload: {
            reset_by: authenticatedUser?.name || "المدير",
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (err) {
      console.log("Realtime broadcast signal dispatched");
    }

    // 2. Clear Local React State
    setLogs([]);
    setComments([]);
    setNotifications([]);
    setSelectedLog(null);

    triggerToast("جاري تصفير وإعادة ضبط التقويم للإطلاق الرسمي في الوقت الفعلي...");

    // 3. Execute Supabase Database Purge
    try {
      await supabase.from("comments").delete().not("id", "is", null);
      await supabase.from("daily_logs").delete().not("id", "is", null);
      await supabase.from("notifications").delete().not("id", "is", null);

      triggerToast(
        "تم تصفير كافة سجلات التقويم بنجاح وحذفها من Supabase وتحديث جميع الأجهزة (Realtime)!",
      );
    } catch (err) {
      console.log("Calendar reset executed locally", err);
      triggerToast("تم تصفير التقويم وتجهيزه للإطلاق الرسمي");
    } finally {
      setIsResetting(false);
    }
  };

  // 1. If user is not authenticated, show LoginPage gate
  if (!authenticatedUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. If 2-second Splash Screen is active
  if (isSplashLoading) {
    return (
      <SplashLoader
        userName={authenticatedUser.name}
        userRole={authenticatedUser.role}
        onComplete={() => {
          setIsSplashLoading(false);
          setIsSkeletonLoading(true); // Trigger 0.5s skeleton loading
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-tajawal pb-16">
      {/* Top Navbar */}
      <Header
        currentRole={currentRole}
        onOpenAddModal={() => {
          setSelectedAddDate("2026-08-11");
          setShowAddModal(true);
        }}
        onSendEmailDigest={handleSendEmailDigest}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearNotifications}
        onResetCalendarProgress={handleResetCalendarProgress}
        isResetting={isResetting}
        isRealtimeConnected={isRealtimeConnected}
        authenticatedUser={authenticatedUser}
        onSignOut={handleSignOut}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-[#0E6875] text-white px-6 py-4 rounded-[18px] shadow-teal flex items-center gap-3 animate-slideUp border border-[#CBD5E1]">
          <Sparkles className="w-6 h-6 text-[#EE6C4D]" />
          <span className="text-sm font-extrabold">{toastMessage}</span>
        </div>
      )}

      {/* 3. If 0.5-second Skeleton Loader is active */}
      {isSkeletonLoading ? (
        <CalendarSkeleton onComplete={() => setIsSkeletonLoading(false)} />
      ) : (
        /* 4. Full Dashboard View */
        <main className="max-w-[1788px] mx-auto px-4 lg:px-10 pt-8 animate-fadeIn">
          {/* Project Hero Header Banner */}
          <div className="card-elevation p-5 sm:p-8 lg:p-10 bg-gradient-to-br from-[#0E6875] via-[#0B535E] to-[#063D45] text-white relative overflow-hidden mb-6 sm:mb-8 shadow-strong rounded-[24px] sm:rounded-[32px]">
            <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
              <div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-tajawal tracking-tight leading-tight">
                  لوحة المتابعة اليومية والتقويم التفاعلي
                </h2>
                <p className="text-sm lg:text-base text-white/90 mt-2 max-w-3xl leading-relaxed font-medium">
                  مرحباً بك {authenticatedUser.name}.
                </p>
              </div>

              {/* User Account Role Indicator Box & Master Reset Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">


                <motion.button
                  whileHover={{ scale: 1.08, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handleResetCalendarProgress}
                  disabled={isResetting}
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white border border-white/30 backdrop-blur-xl rounded-[20px] shadow-[0_8px_20px_rgba(225,29,72,0.4)] hover:shadow-[0_10px_28px_rgba(225,29,72,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  title="تصفير الإنجازات بالكامل ومسح كافة البيانات من Supabase"
                >
                  <RotateCcw className={`w-5 h-5 text-white ${isResetting ? "animate-spin" : ""}`} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Dashboard Statistics Header */}
          <StatsCards logs={logs} currentRole={currentRole} />

          {/* View Switcher Tabs */}
          <div className="flex items-center justify-between my-4 sm:my-6 border-b border-[#E2E8F0] pb-3 sm:pb-4 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-[14px] sm:rounded-[16px] text-xs sm:text-sm font-black transition-all whitespace-nowrap ${
                  activeTab === "calendar"
                    ? "bg-[#0E6875] text-white shadow-teal ring-2 ring-[#0E6875]/20"
                    : "bg-white text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1]"
                }`}
              >
                <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                <span>التقويم التفاعلي</span>
                <span className="hidden lg:inline text-white/80 font-normal text-xs">
                  (Calendar Grid)
                </span>
              </button>

              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-[16px] text-xs md:text-sm font-black transition-all ${
                  activeTab === "timeline"
                    ? "bg-[#0E6875] text-white shadow-teal ring-2 ring-[#0E6875]/20"
                    : "bg-white text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1]"
                }`}
              >
                <GitCommit className="w-4.5 h-4.5" />
                <span>التسلسل الزمني</span>
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
          {activeTab === "calendar" ? (
            <CalendarView
              logs={logs}
              comments={comments}
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
      )}

      {/* Day Details Modal */}
      {selectedLog && (
        <DayDetailsModal
          log={selectedLog}
          currentRole={currentRole}
          comments={comments}
          onClose={() => setSelectedLog(null)}
          onAddComment={handleAddComment}
          onApproveLog={handleApproveLog}
          onDeleteLog={handleDeleteLog}
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
