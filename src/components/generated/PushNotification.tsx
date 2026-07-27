import { useMemo, useState } from 'react';
import { broadcastLogSeed, notificationTemplates, priorityMeta, type BroadcastLogEntry, type NotificationPriority, type NotificationTemplate } from './pushNotificationData';
type Language = 'en' | 'bn';
interface PushNotificationProps {
  language: Language;
  onDone: () => void;
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
const ACTION_BTN = 'inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]';
const ACTION_BTN_GREEN = 'inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]';
const priorityOptions: NotificationPriority[] = ['high', 'normal', 'low'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Push Notification',
    subtitle: 'Configure instant push notification templates — delivered instantly while a user is logged on, and queued for delivery right after they log on if offline.',
    statTemplates: 'Templates',
    statActive: 'Active Templates',
    statSentToday: 'Sent Today',
    statQueued: 'Queued for Offline Delivery',
    templatesTitle: 'Notification Templates',
    triggerModule: 'Triggered by',
    channels: 'Channels',
    channelInApp: 'In-App',
    channelSms: 'SMS',
    channelEmail: 'Email',
    priority: 'Priority',
    bodyLabel: 'Message Body',
    active: 'Active',
    inactive: 'Inactive',
    save: 'Save',
    savedNotice: 'Template updated.',
    sendTest: 'Send Test Broadcast',
    lastModified: 'Last modified',
    logTitle: 'Recent Broadcasts',
    logRecipients: 'Recipients',
    logInstant: 'Delivered instantly',
    logQueued: 'Queued (offline)',
    broadcastNotice: 'Test broadcast sent.',
    footerNote: 'This screen configures what is generated and to which channels; the Notification Center is where CBC officials, Bonders and Lien Bank users actually receive it, and the Message Queue’s notification.push topic carries delivery to the SMS/Email gateway monitored under Integration Monitoring.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'পুশ নোটিফিকেশন',
    subtitle: 'তাৎক্ষণিক পুশ নোটিফিকেশন টেমপ্লেট কনফিগার করুন — ব্যবহারকারী লগ-ইন থাকা অবস্থায় তাৎক্ষণিকভাবে প্রদান করা হয়, এবং অফলাইন থাকলে লগ-ইন করার পরপরই প্রদানের জন্য সারিবদ্ধ থাকে।',
    statTemplates: 'টেমপ্লেট',
    statActive: 'সক্রিয় টেমপ্লেট',
    statSentToday: 'আজ প্রেরিত',
    statQueued: 'অফলাইন প্রদানের জন্য সারিবদ্ধ',
    templatesTitle: 'নোটিফিকেশন টেমপ্লেট',
    triggerModule: 'ট্রিগার করে',
    channels: 'চ্যানেল',
    channelInApp: 'ইন-অ্যাপ',
    channelSms: 'এসএমএস',
    channelEmail: 'ইমেইল',
    priority: 'অগ্রাধিকার',
    bodyLabel: 'বার্তার বিষয়বস্তু',
    active: 'সক্রিয়',
    inactive: 'নিষ্ক্রিয়',
    save: 'সংরক্ষণ করুন',
    savedNotice: 'টেমপ্লেট হালনাগাদ হয়েছে।',
    sendTest: 'টেস্ট ব্রডকাস্ট পাঠান',
    lastModified: 'সর্বশেষ পরিবর্তিত',
    logTitle: 'সাম্প্রতিক ব্রডকাস্ট',
    logRecipients: 'প্রাপক',
    logInstant: 'তাৎক্ষণিক প্রদান',
    logQueued: 'সারিবদ্ধ (অফলাইন)',
    broadcastNotice: 'টেস্ট ব্রডকাস্ট পাঠানো হয়েছে।',
    footerNote: 'এই স্ক্রিনটি কী তৈরি হয় এবং কোন চ্যানেলে যায় তা কনফিগার করে; নোটিফিকেশন সেন্টারে সিবিসি কর্মকর্তা, বন্ডার ও লিয়েন ব্যাংক ব্যবহারকারীরা প্রকৃতপক্ষে তা গ্রহণ করেন, এবং মেসেজ কিউ-এর notification.push টপিক এসএমএস/ইমেইল গেটওয়েতে ডেলিভারি বহন করে, যা ইন্টিগ্রেশন মনিটরিংয়ে পর্যবেক্ষণ করা হয়।'
  }
};
type T = typeof T['en'];
function TemplateRow({
  template,
  language,
  t,
  onSave,
  onSendTest
}: {
  template: NotificationTemplate;
  language: Language;
  t: T;
  onSave: (id: string, patch: Partial<NotificationTemplate>) => void;
  onSendTest: (template: NotificationTemplate) => void;
}) {
  const [body, setBody] = useState(language === 'en' ? template.bodyEn : template.bodyBn);
  const [channels, setChannels] = useState(template.channels);
  const [priority, setPriority] = useState(template.priority);
  const [active, setActive] = useState(template.active);
  const dirty = body !== (language === 'en' ? template.bodyEn : template.bodyBn) || channels.inApp !== template.channels.inApp || channels.sms !== template.channels.sms || channels.email !== template.channels.email || priority !== template.priority || active !== template.active;
  const meta = priorityMeta[priority];
  return <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? template.en : template.bn}</h3>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{
            backgroundColor: `${meta.color}1A`,
            color: meta.color
          }}>{meta[language]}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{active ? t.active : t.inactive}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#64748B]">{t.triggerModule}: {language === 'en' ? template.triggerModuleEn : template.triggerModuleBn}</p>
        </div>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#334155]">
          <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="h-4 w-4 rounded border-[#CBD5E1] accent-[#0A4D8C]" />
          {t.active}
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-[#334155]">{t.bodyLabel}</span>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={2} className={inputClass} />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-[#64748B]">{t.channels}</span>
          <div className="flex gap-3 text-xs text-[#334155]">
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={channels.inApp} onChange={e => setChannels({
              ...channels,
              inApp: e.target.checked
            })} className="h-4 w-4 rounded border-[#CBD5E1] accent-[#0A4D8C]" />{t.channelInApp}</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={channels.sms} onChange={e => setChannels({
              ...channels,
              sms: e.target.checked
            })} className="h-4 w-4 rounded border-[#CBD5E1] accent-[#0A4D8C]" />{t.channelSms}</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={channels.email} onChange={e => setChannels({
              ...channels,
              email: e.target.checked
            })} className="h-4 w-4 rounded border-[#CBD5E1] accent-[#0A4D8C]" />{t.channelEmail}</label>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-[#64748B]">{t.priority}</span>
          <select value={priority} onChange={e => setPriority(e.target.value as NotificationPriority)} className="rounded-md border border-[#CBD5E1] px-2.5 py-1.5 text-xs outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20">
            {priorityOptions.map(p => <option key={p} value={p}>{priorityMeta[p][language]}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3">
        <p className="text-[10px] text-[#94A3B8]">{t.lastModified}: {template.lastModified}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => onSendTest(template)} className={ACTION_BTN}>
            <Icon name="send" className="text-[13px]" />
            {t.sendTest}
          </button>
          <button type="button" disabled={!dirty} onClick={() => onSave(template.id, {
          bodyEn: language === 'en' ? body : template.bodyEn,
          bodyBn: language === 'bn' ? body : template.bodyBn,
          channels,
          priority,
          active
        })} className={`${ACTION_BTN_GREEN} disabled:cursor-not-allowed disabled:opacity-40`}>
            <Icon name="save" className="text-[13px]" />
            {t.save}
          </button>
        </div>
      </div>
    </div>;
}
export function PushNotification({
  language,
  onDone
}: PushNotificationProps) {
  const t = T[language];
  const [templates, setTemplates] = useState<NotificationTemplate[]>(notificationTemplates);
  const [log, setLog] = useState<BroadcastLogEntry[]>(broadcastLogSeed);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3600);
  };
  const stats = useMemo(() => {
    const sentToday = log.reduce((sum, l) => sum + l.recipients, 0);
    const queued = log.reduce((sum, l) => sum + l.queuedOffline, 0);
    return {
      sentToday,
      queued,
      active: templates.filter(tp => tp.active).length
    };
  }, [templates, log]);
  const handleSave = (id: string, patch: Partial<NotificationTemplate>) => {
    setTemplates(prev => prev.map(tp => tp.id === id ? {
      ...tp,
      ...patch,
      lastModified: '27 Jul 2026'
    } : tp));
    showToast(t.savedNotice);
  };
  const handleSendTest = (template: NotificationTemplate) => {
    const recipients = 3 + Math.floor(Math.random() * 10);
    const deliveredInstant = Math.round(recipients * 0.65);
    const queuedOffline = recipients - deliveredInstant;
    setLog(prev => [{
      id: `bl-${Date.now()}`,
      timestamp: '27 Jul 2026, 09:47',
      templateEn: template.en,
      templateBn: template.bn,
      recipients,
      deliveredInstant,
      queuedOffline
    }, ...prev]);
    showToast(t.broadcastNotice);
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

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="send" label={t.statTemplates} value={templates.length} color="#0A4D8C" />
        <StatCard icon="check_circle" label={t.statActive} value={stats.active} color="#00A86B" />
        <StatCard icon="today" label={t.statSentToday} value={stats.sentToday} color="#1E88E5" />
        <StatCard icon="schedule_send" label={t.statQueued} value={stats.queued} color="#B45309" />
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-[#334155]">{t.templatesTitle}</p>
        <div className="flex flex-col gap-3">
          {templates.map(tp => <TemplateRow key={tp.id} template={tp} language={language} t={t} onSave={handleSave} onSendTest={handleSendTest} />)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-[#334155]">{t.logTitle}</p>
        {log.map(entry => <div key={entry.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3 text-xs shadow-sm">
            <div className="flex items-start gap-2.5">
              <Icon name="send" className="mt-0.5 shrink-0 text-[14px] text-[#0A4D8C]" />
              <div>
                <p className="font-semibold text-[#334155]">{language === 'en' ? entry.templateEn : entry.templateBn}</p>
                <p className="mt-0.5 text-[10px] text-[#94A3B8]">{entry.timestamp}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-3 text-[10px] text-[#64748B]">
              <span>{t.logRecipients}: <b className="text-[#1E293B]">{entry.recipients}</b></span>
              <span>{t.logInstant}: <b className="text-[#00A86B]">{entry.deliveredInstant}</b></span>
              <span>{t.logQueued}: <b className="text-[#B45309]">{entry.queuedOffline}</b></span>
            </div>
          </div>)}
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">{t.footerNote}</p>
    </div>;
}