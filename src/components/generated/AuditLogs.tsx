import { useMemo, useState } from 'react';
import { auditLogEntries, auditModules, severityMeta, type AuditLogEntry, type AuditSeverity } from './auditLogsData';
type Language = 'en' | 'bn';
interface AuditLogsProps {
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
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const severityOptions: AuditSeverity[] = ['critical', 'warning', 'info'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Audit Logs',
    subtitle: 'System-wide, append-only audit trail of significant actions across every CBMS module — who did what, when, and from where.',
    statTotal: 'Logged Actions',
    statCritical: 'Critical',
    statToday: 'Today',
    statActors: 'Unique Actors',
    searchPlaceholder: 'Search summary, actor or reference…',
    allModules: 'All Modules',
    allSeverities: 'All Severities',
    exportLog: 'Export Log',
    exportedNotice: 'Audit log exported.',
    noResults: 'No audit entries match the current filters.',
    viewDetail: 'View Detail',
    close: 'Close',
    actorLabel: 'Actor',
    moduleLabel: 'Module',
    actionLabel: 'Action',
    channelLabel: 'Channel',
    timestampLabel: 'Timestamp',
    detailLabel: 'Detail',
    footerNote: 'Entries are immutable and append-only — Role Management, Workflow Management and Business Rules each write here whenever a System Admin changes a configuration, and every officer approval/escalation step across the module workflows is recorded automatically.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'অডিট লগ',
    subtitle: 'প্রতিটি সিবিএমএস মডিউল জুড়ে গুরুত্বপূর্ণ কার্যক্রমের সিস্টেম-ব্যাপী, সংযোজন-শুধুমাত্র অডিট ট্রেইল — কে কী করেছেন, কখন এবং কোথা থেকে।',
    statTotal: 'লগকৃত কার্যক্রম',
    statCritical: 'সংকটাপন্ন',
    statToday: 'আজ',
    statActors: 'স্বতন্ত্র অভিনেতা',
    searchPlaceholder: 'সারসংক্ষেপ, অভিনেতা বা রেফারেন্স খুঁজুন…',
    allModules: 'সব মডিউল',
    allSeverities: 'সব তীব্রতা',
    exportLog: 'লগ এক্সপোর্ট করুন',
    exportedNotice: 'অডিট লগ এক্সপোর্ট করা হয়েছে।',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো অডিট এন্ট্রি মেলে না।',
    viewDetail: 'বিস্তারিত দেখুন',
    close: 'বন্ধ করুন',
    actorLabel: 'অভিনেতা',
    moduleLabel: 'মডিউল',
    actionLabel: 'কার্যক্রম',
    channelLabel: 'চ্যানেল',
    timestampLabel: 'সময়',
    detailLabel: 'বিস্তারিত',
    footerNote: 'এন্ট্রিগুলো অপরিবর্তনীয় ও শুধুমাত্র-সংযোজন — সিস্টেম অ্যাডমিন কোনো কনফিগারেশন পরিবর্তন করলে রোল ব্যবস্থাপনা, ওয়ার্কফ্লো ব্যবস্থাপনা ও বিজনেস রুলস প্রতিটি এখানে লেখে, এবং মডিউল ওয়ার্কফ্লো জুড়ে প্রতিটি কর্মকর্তা অনুমোদন/এস্কেলেশন ধাপ স্বয়ংক্রিয়ভাবে রেকর্ড করা হয়।'
  }
};
type T = typeof T['en'];
function DetailModal({
  entry,
  language,
  t,
  onClose
}: {
  entry: AuditLogEntry;
  language: Language;
  t: T;
  onClose: () => void;
}) {
  const meta = severityMeta[entry.severity];
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-6 py-4">
          <div className="flex items-center gap-2">
            <span style={{
            color: meta.color
          }}>
              <Icon name={meta.icon} className="text-[18px]" />
            </span>
            <h3 className="text-base font-bold text-[#1E293B]">{language === 'en' ? entry.actionTypeEn : entry.actionTypeBn}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto px-6 py-4 text-sm">
          <p className="leading-relaxed text-[#334155]">{language === 'en' ? entry.detailEn : entry.detailBn}</p>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#F8FAFC] p-3 text-xs">
            <div>
              <p className="text-[#94A3B8]">{t.actorLabel}</p>
              <p className="font-semibold text-[#1E293B]">{entry.actor} ({entry.actorRole})</p>
            </div>
            <div>
              <p className="text-[#94A3B8]">{t.moduleLabel}</p>
              <p className="font-semibold text-[#1E293B]">{language === 'en' ? entry.moduleEn : entry.moduleBn}</p>
            </div>
            <div>
              <p className="text-[#94A3B8]">{t.channelLabel}</p>
              <p className="font-semibold text-[#1E293B]">{entry.channel}</p>
            </div>
            <div>
              <p className="text-[#94A3B8]">{t.timestampLabel}</p>
              <p className="font-semibold text-[#1E293B]">{entry.timestamp}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-[#E2E8F0] px-6 py-4">
          <button type="button" onClick={onClose} className={ACTION_BTN_OUTLINE}>{t.close}</button>
        </div>
      </div>
    </div>;
}
export function AuditLogs({
  language,
  onDone
}: AuditLogsProps) {
  const t = T[language];
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | AuditSeverity>('all');
  const [detailEntry, setDetailEntry] = useState<AuditLogEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3600);
  };
  const filtered = useMemo(() => auditLogEntries.filter(e => {
    const matchesModule = moduleFilter === 'all' || e.moduleEn === moduleFilter;
    const matchesSeverity = severityFilter === 'all' || e.severity === severityFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch = q === '' || e.summaryEn.toLowerCase().includes(q) || e.summaryBn.includes(search.trim()) || e.actor.toLowerCase().includes(q);
    return matchesModule && matchesSeverity && matchesSearch;
  }), [search, moduleFilter, severityFilter]);
  const stats = useMemo(() => {
    const critical = auditLogEntries.filter(e => e.severity === 'critical').length;
    const today = auditLogEntries.filter(e => e.timestamp.startsWith('27 Jul 2026')).length;
    const actors = new Set(auditLogEntries.map(e => e.actor)).size;
    return {
      critical,
      today,
      actors
    };
  }, []);
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button type="button" onClick={() => showToast(t.exportedNotice)} className={`${ACTION_BTN_OUTLINE} shrink-0`}>
          <Icon name="download" className="text-[14px]" />
          {t.exportLog}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="history" label={t.statTotal} value={auditLogEntries.length} color="#0A4D8C" />
        <StatCard icon="report" label={t.statCritical} value={stats.critical} color="#DC2626" />
        <StatCard icon="today" label={t.statToday} value={stats.today} color="#1E88E5" />
        <StatCard icon="group" label={t.statActors} value={stats.actors} color="#00A86B" />
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className={`${inputClass} sm:w-56`}>
          <option value="all">{t.allModules}</option>
          {auditModules.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as 'all' | AuditSeverity)} className={`${inputClass} sm:w-48`}>
          <option value="all">{t.allSeverities}</option>
          {severityOptions.map(s => <option key={s} value={s}>{severityMeta[s][language]}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-8 text-center text-sm text-[#64748B]">{t.noResults}</p> : filtered.map(entry => {
        const meta = severityMeta[entry.severity];
        return <button key={entry.id} type="button" onClick={() => setDetailEntry(entry)} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 text-left shadow-sm transition-colors hover:border-[#0A4D8C]">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{
            backgroundColor: `${meta.color}1A`,
            color: meta.color
          }}>
                <Icon name={meta.icon} className="text-[16px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[10px] font-semibold text-[#0A4D8C]">{language === 'en' ? entry.moduleEn : entry.moduleBn}</span>
                  <span className="text-[10px] font-semibold text-[#94A3B8]">{language === 'en' ? entry.actionTypeEn : entry.actionTypeBn}</span>
                </div>
                <p className="mt-1 text-sm text-[#1E293B]">{language === 'en' ? entry.summaryEn : entry.summaryBn}</p>
                <p className="mt-1 text-[11px] text-[#94A3B8]">{entry.timestamp} · {entry.actor} · {entry.channel}</p>
              </div>
              <span className="mt-1 shrink-0 text-[11px] font-semibold text-[#0A4D8C]">{t.viewDetail}</span>
            </button>;
      })}
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">{t.footerNote}</p>

      {detailEntry && <DetailModal entry={detailEntry} language={language} t={t} onClose={() => setDetailEntry(null)} />}
    </div>;
}
