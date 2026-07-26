import { useMemo, useState } from 'react';
import { incomingPool, moduleTagLabels, seedNotifications, typeMeta, type AppNotification, type NotificationModuleId, type NotificationType } from './notificationData';
type Language = 'en' | 'bn';
interface NotificationCenterProps {
  language: Language;
  onDone: () => void;
  onNavigate?: (id: string) => void;
}
function Icon({
  name,
  className = ''
}: {
  name: string;
  className?: string;
}) {
  return <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>;
}
const inputClass = 'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
const ACTION_BTN = 'inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]';
const ACTION_BTN_OUTLINE = 'inline-flex items-center justify-center gap-1.5 rounded-full border border-[#CBD5E1] px-3 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA] whitespace-nowrap';
function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}) {
  return <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{
      backgroundColor: `${color}1A`,
      color
    }}>
        <Icon name={icon} className="text-[22px]" />
      </span>
      <div>
        <p className="text-xl font-bold text-[#1E293B]">{value}</p>
        <p className="text-xs text-[#64748B]">{label}</p>
      </div>
    </div>;
}
const moduleFilterOrder: NotificationModuleId[] = ['utilization-permission', 'legal-procedures', 'coefficient', 'inter-bond-transfer', 'sub-contract', 'entitlement', 'inventory-monitoring', 'annual-audit', 'case-information', 'license-database', 'reports', 'system'];
const today = '26 Jul 2026';
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Notification Center',
    subtitle: 'A unified inbox for e-notifications generated across every CBMS module — instant push delivery while logged on, queued delivery on next login while offline.',
    backToDashboard: 'Back to Dashboard',
    statUnread: 'Unread',
    statAction: 'Action Required',
    statHighPriority: 'High Priority',
    statTotal: 'Total Notifications',
    onlineTitle: 'You are Online',
    offlineTitle: 'You are Offline',
    onlineDesc: 'New notifications are pushed instantly, the same way you would receive an email alert while logged on.',
    offlineDesc: 'Notifications are queued silently and will all be delivered the moment you log back on.',
    goOffline: 'Go Offline',
    goOnline: 'Go Online',
    simulateIncoming: 'Simulate Incoming Notification',
    queuedBadge: (n: number) => `${n} queued while offline`,
    deliveredWhileAway: (n: number) => `Welcome back — ${n} notification${n === 1 ? '' : 's'} received while you were offline.`,
    pushReceived: 'New notification',
    filterAll: 'All',
    filterUnread: 'Unread',
    filterAction: 'Action Required',
    moduleFilterAll: 'All Modules',
    searchPlaceholder: 'Search notifications…',
    markAllRead: 'Mark All as Read',
    markRead: 'Mark as Read',
    markUnread: 'Mark as Unread',
    goToModule: 'Go to Module',
    dismiss: 'Dismiss',
    highPriority: 'High',
    empty: 'No notifications match the current filters.',
    footerNote: 'Push notifications are generated the instant a user is logged on; offline users receive every queued notification immediately upon their next login, per the CBMS Push Notification specification.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'নোটিফিকেশন সেন্টার',
    subtitle: 'সিবিএমএস-এর প্রতিটি মডিউল থেকে তৈরি ই-নোটিফিকেশনের একীভূত ইনবক্স — লগ-অন থাকাকালীন তাৎক্ষণিক পুশ ডেলিভারি, অফলাইনে থাকলে পরবর্তী লগ-ইনে সারিবদ্ধ ডেলিভারি।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    statUnread: 'অপঠিত',
    statAction: 'পদক্ষেপ প্রয়োজন',
    statHighPriority: 'উচ্চ অগ্রাধিকার',
    statTotal: 'মোট নোটিফিকেশন',
    onlineTitle: 'আপনি অনলাইনে আছেন',
    offlineTitle: 'আপনি অফলাইনে আছেন',
    onlineDesc: 'লগ-অন থাকাকালীন নতুন নোটিফিকেশন তাৎক্ষণিকভাবে পুশ করা হয়, ইমেইল অ্যালার্টের মতোই।',
    offlineDesc: 'নোটিফিকেশনগুলো নীরবে সারিবদ্ধ থাকবে এবং আপনি পুনরায় লগ-অন করার সাথে সাথে সবগুলো পৌঁছে দেওয়া হবে।',
    goOffline: 'অফলাইনে যান',
    goOnline: 'অনলাইনে যান',
    simulateIncoming: 'আগত নোটিফিকেশন সিমুলেট করুন',
    queuedBadge: (n: number) => `অফলাইনে থাকাকালীন ${n}টি সারিবদ্ধ`,
    deliveredWhileAway: (n: number) => `স্বাগতম — আপনি অফলাইনে থাকাকালীন ${n}টি নোটিফিকেশন এসেছে।`,
    pushReceived: 'নতুন নোটিফিকেশন',
    filterAll: 'সকল',
    filterUnread: 'অপঠিত',
    filterAction: 'পদক্ষেপ প্রয়োজন',
    moduleFilterAll: 'সকল মডিউল',
    searchPlaceholder: 'নোটিফিকেশন খুঁজুন…',
    markAllRead: 'সব পঠিত হিসেবে চিহ্নিত করুন',
    markRead: 'পঠিত হিসেবে চিহ্নিত করুন',
    markUnread: 'অপঠিত হিসেবে চিহ্নিত করুন',
    goToModule: 'মডিউলে যান',
    dismiss: 'খারিজ করুন',
    highPriority: 'উচ্চ',
    empty: 'বর্তমান ফিল্টারের সাথে কোনো নোটিফিকেশন মেলে না।',
    footerNote: 'ব্যবহারকারী লগ-অন থাকাকালীন সাথে সাথে পুশ নোটিফিকেশন তৈরি হয়; অফলাইন ব্যবহারকারীরা পরবর্তী লগ-ইনে সারিবদ্ধ সকল নোটিফিকেশন সাথে সাথে পান, সিবিএমএস পুশ নোটিফিকেশন স্পেসিফিকেশন অনুযায়ী।'
  }
};
type T = typeof T['en'];
function NotificationRow({
  n,
  language,
  t,
  onMarkRead,
  onDismiss,
  onNavigate
}: {
  n: AppNotification;
  language: Language;
  t: T;
  onMarkRead: (id: string, read: boolean) => void;
  onDismiss: (id: string) => void;
  onNavigate?: (id: string) => void;
}) {
  const mod = moduleTagLabels[n.moduleId];
  const tm = typeMeta[n.type];
  return <div className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-start ${n.read ? 'border-[#E2E8F0] bg-white' : 'border-[#BFDBFE] bg-[#F5F9FF]'}`}>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{
      backgroundColor: `${tm.color}1A`,
      color: tm.color
    }}>
        <Icon name={tm.icon} className="text-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#1E88E5]" />}
          <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? n.titleEn : n.titleBn}</h3>
          {n.priority === 'high' && <span className="rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-semibold text-[#DC2626]">{t.highPriority}</span>}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{language === 'en' ? n.bodyEn : n.bodyBn}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#94A3B8]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2 py-0.5 font-semibold text-[#334155]">
            <Icon name={mod.icon} className="text-[12px]" />
            {mod[language]}
          </span>
          {n.refId && <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-mono text-[#334155]">{n.refId}</span>}
          <span>{n.recipient[language]}</span>
          <span>•</span>
          <span>{n.timestamp}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:w-[150px] sm:flex-col">
        {n.moduleId !== 'system' && onNavigate && <button type="button" onClick={() => onNavigate(n.moduleId)} className={ACTION_BTN_OUTLINE}>
            <Icon name="open_in_new" className="text-[13px]" />
            {t.goToModule}
          </button>}
        <button type="button" onClick={() => onMarkRead(n.id, !n.read)} className={ACTION_BTN_OUTLINE}>
          <Icon name={n.read ? 'mark_email_unread' : 'mark_email_read'} className="text-[13px]" />
          {n.read ? t.markUnread : t.markRead}
        </button>
        <button type="button" onClick={() => onDismiss(n.id)} className={ACTION_BTN_OUTLINE}>
          <Icon name="close" className="text-[13px]" />
          {t.dismiss}
        </button>
      </div>
    </div>;
}
export function NotificationCenter({
  language,
  onDone,
  onNavigate
}: NotificationCenterProps) {
  const t = T[language];
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [offlineQueue, setOfflineQueue] = useState<AppNotification[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'unread' | NotificationType>('all');
  const [moduleFilter, setModuleFilter] = useState<'all' | NotificationModuleId>('all');
  const [search, setSearch] = useState('');
  const [incomingIndex, setIncomingIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [pushToast, setPushToast] = useState<AppNotification | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const unreadCount = notifications.filter(n => !n.read).length;
  const actionCount = notifications.filter(n => n.type === 'action-required' && !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;
  const filtered = useMemo(() => notifications.filter(n => {
    if (filterType === 'unread' && n.read) return false;
    if (filterType === 'action-required' && n.type !== 'action-required') return false;
    if (moduleFilter !== 'all' && n.moduleId !== moduleFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const hay = `${n.titleEn} ${n.titleBn} ${n.bodyEn} ${n.bodyBn} ${n.refId ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [notifications, filterType, moduleFilter, search]);
  const handleMarkRead = (id: string, read: boolean) => {
    setNotifications(prev => prev.map(n => n.id === id ? {
      ...n,
      read
    } : n));
  };
  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
    showToast(t.markAllRead);
  };
  const handleToggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    if (next && offlineQueue.length > 0) {
      setNotifications(prev => [...offlineQueue, ...prev]);
      showToast(t.deliveredWhileAway(offlineQueue.length));
      setOfflineQueue([]);
    }
  };
  const handleSimulateIncoming = () => {
    const tmpl = incomingPool[incomingIndex % incomingPool.length];
    setIncomingIndex(i => i + 1);
    const now = new Date();
    const notif: AppNotification = {
      ...tmpl,
      id: `NTF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: `${today}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      read: false
    };
    if (isOnline) {
      setNotifications(prev => [notif, ...prev]);
      setPushToast(notif);
      window.setTimeout(() => setPushToast(null), 4800);
    } else {
      setOfflineQueue(prev => [notif, ...prev]);
    }
  };
  return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <span className="flex items-center gap-1.5">
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
        </span>
      </nav>

      {toast && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
          <Icon name="check_circle" className="text-[16px]" />
          {toast}
        </div>}

      {pushToast && <div className="flex items-start gap-3 rounded-xl border-l-4 bg-white p-3.5 shadow-lg" style={{
      borderLeftColor: typeMeta[pushToast.type].color
    }}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
            <Icon name="notifications_active" className="text-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.pushReceived}</p>
            <p className="text-sm font-bold text-[#1E293B]">{language === 'en' ? pushToast.titleEn : pushToast.titleBn}</p>
            <p className="text-xs text-[#64748B]">{language === 'en' ? pushToast.bodyEn : pushToast.bodyBn}</p>
          </div>
          <button type="button" onClick={() => setPushToast(null)} className="rounded-full p-1 text-[#94A3B8] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[16px]" />
          </button>
        </div>}

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="mark_email_unread" label={t.statUnread} value={unreadCount} color="#1E88E5" />
        <StatCard icon="bolt" label={t.statAction} value={actionCount} color="#B45309" />
        <StatCard icon="warning" label={t.statHighPriority} value={highPriorityCount} color="#DC2626" />
        <StatCard icon="all_inbox" label={t.statTotal} value={notifications.length} color="#0A4D8C" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{
          backgroundColor: isOnline ? '#00A86B1A' : '#64748B1A',
          color: isOnline ? '#00A86B' : '#64748B'
        }}>
            <Icon name={isOnline ? 'wifi' : 'wifi_off'} className="text-[20px]" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#1E293B]">{isOnline ? t.onlineTitle : t.offlineTitle}</p>
            <p className="max-w-md text-xs text-[#64748B]">{isOnline ? t.onlineDesc : t.offlineDesc}</p>
            {!isOnline && offlineQueue.length > 0 && <p className="mt-1 text-xs font-semibold text-[#B45309]">{t.queuedBadge(offlineQueue.length)}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleSimulateIncoming} className={ACTION_BTN}>
            <Icon name="add_alert" className="text-[14px]" />
            {t.simulateIncoming}
          </button>
          <button type="button" onClick={handleToggleOnline} className={ACTION_BTN_OUTLINE}>
            <Icon name={isOnline ? 'wifi_off' : 'wifi'} className="text-[14px]" />
            {isOnline ? t.goOffline : t.goOnline}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {([{
            id: 'all',
            label: t.filterAll
          }, {
            id: 'unread',
            label: t.filterUnread
          }, {
            id: 'action-required',
            label: t.filterAction
          }] as const).map(f => <button key={f.id} type="button" onClick={() => setFilterType(f.id)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${filterType === f.id ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155]'}`}>{f.label}</button>)}
          </div>
          <button type="button" onClick={handleMarkAllRead} className={ACTION_BTN_OUTLINE}>
            <Icon name="done_all" className="text-[13px]" />
            {t.markAllRead}
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
          </div>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value as 'all' | NotificationModuleId)} className={`${inputClass} sm:w-auto`}>
            <option value="all">{t.moduleFilterAll}</option>
            {moduleFilterOrder.map(m => <option key={m} value={m}>{moduleTagLabels[m][language]}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center text-sm text-[#64748B]">{t.empty}</p> : filtered.map(n => <NotificationRow key={n.id} n={n} language={language} t={t} onMarkRead={handleMarkRead} onDismiss={handleDismiss} onNavigate={onNavigate} />)}
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">
        <Icon name="info" className="mr-1 align-text-bottom text-[14px] text-[#1E88E5]" />
        {t.footerNote}
      </p>
    </div>;
}
