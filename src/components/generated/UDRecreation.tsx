import { useMemo, useState } from 'react';
import { amendmentsForUd, licenseOf, udAmendments, udRecords, udSourceLabels, udSyncStatusLabels, type UdRecord, type UdSource } from './udData';
type Language = 'en' | 'bn';
interface UDRecreationProps {
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
function SourceBadge({
  source,
  language
}: {
  source: UdSource;
  language: Language;
}) {
  const s = udSourceLabels[source];
  return <span className="rounded-full bg-[#EAF3FE] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C]">{s[language]}</span>;
}
const T = {
  en: {
    home: 'Home',
    udManagement: 'UD Management',
    pageTitle: 'UD Re-creation',
    subtitle: 'Every approved UD Amendment from BGMEA/BKMEA re-creates an updated version of the original UD. Each version is replicated here and listed against the parent UD to preserve a full, auditable version history.',
    backToDashboard: 'Back to Dashboard',
    totalAmendments: 'Total Amendments',
    udsWithAmendments: 'UDs with Amendments',
    maxAmendments: 'Highest Amendment Count',
    onUd: 'on',
    needsAttention: 'Sync Issues',
    searchPlaceholder: 'Search UD No, License No, or Bonder name…',
    filterSource: 'Source',
    all: 'All',
    tableHeaders: {
      udNo: 'Parent UD No.',
      bonder: 'Bonder',
      source: 'Source',
      versions: 'Versions',
      latestChange: 'Latest Change',
      action: ''
    },
    view: 'View Timeline',
    noResults: 'No amendment history matches the current filters.',
    detailTitle: 'UD Version Timeline (Re-creation History)',
    close: 'Close',
    original: 'Original UD',
    version: 'Version',
    amendmentNo: 'Amendment No.',
    amendmentDate: 'Amendment Date',
    changeSummary: 'Change Summary',
    fieldChanged: 'Field',
    before: 'Before',
    after: 'After',
    retrySync: 'Retry Sync',
    retriedNotice: 'Retry queued — re-fetching this amendment from source system.',
    syncFailed: 'Sync Failed'
  },
  bn: {
    home: 'হোম',
    udManagement: 'ইউডি ব্যবস্থাপনা',
    pageTitle: 'ইউডি পুনঃনির্মাণ',
    subtitle: 'বিজিএমইএ/বিকেএমইএ থেকে প্রতিটি অনুমোদিত ইউডি সংশোধনী মূল ইউডি-এর একটি আপডেট করা সংস্করণ পুনঃনির্মাণ করে। প্রতিটি সংস্করণ এখানে প্রতিলিপি করা হয় এবং সম্পূর্ণ নিরীক্ষাযোগ্য সংস্করণ ইতিহাস বজায় রাখতে মূল ইউডি-এর বিপরীতে তালিকাভুক্ত করা হয়।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    totalAmendments: 'মোট সংশোধনী',
    udsWithAmendments: 'সংশোধনীসহ ইউডি',
    maxAmendments: 'সর্বোচ্চ সংশোধনী সংখ্যা',
    onUd: 'তে',
    needsAttention: 'সিঙ্ক সমস্যা',
    searchPlaceholder: 'ইউডি নং, লাইসেন্স নং, বা বন্ডকারীর নাম খুঁজুন…',
    filterSource: 'উৎস',
    all: 'সব',
    tableHeaders: {
      udNo: 'মূল ইউডি নং',
      bonder: 'বন্ডকারী',
      source: 'উৎস',
      versions: 'সংস্করণ',
      latestChange: 'সর্বশেষ পরিবর্তন',
      action: ''
    },
    view: 'টাইমলাইন দেখুন',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো সংশোধনী ইতিহাস মেলেনি।',
    detailTitle: 'ইউডি সংস্করণ টাইমলাইন (পুনঃনির্মাণ ইতিহাস)',
    close: 'বন্ধ করুন',
    original: 'মূল ইউডি',
    version: 'সংস্করণ',
    amendmentNo: 'সংশোধনী নং',
    amendmentDate: 'সংশোধনীর তারিখ',
    changeSummary: 'পরিবর্তনের সারাংশ',
    fieldChanged: 'ক্ষেত্র',
    before: 'পূর্বে',
    after: 'পরে',
    retrySync: 'পুনরায় সিঙ্ক করুন',
    retriedNotice: 'পুনরায় চেষ্টা সারিবদ্ধ — উৎস সিস্টেম থেকে এই সংশোধনী পুনরায় সংগ্রহ করা হচ্ছে।',
    syncFailed: 'সিঙ্ক ব্যর্থ'
  }
};
export function UDRecreation({
  language,
  onDone
}: UDRecreationProps) {
  const t = T[language];
  const [amendments, setAmendments] = useState(udAmendments);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | UdSource>('all');
  const [selected, setSelected] = useState<UdRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };
  const amendedUds = useMemo(() => udRecords.filter(u => u.amendmentCount > 0), []);
  const counts = useMemo(() => {
    const maxUd = amendedUds.reduce((max, u) => u.amendmentCount > max.amendmentCount ? u : max, amendedUds[0]);
    return {
      totalAmendments: amendments.length,
      udsWithAmendments: amendedUds.length,
      maxUd,
      attention: amendments.filter(a => a.syncStatus === 'sync-failed').length
    };
  }, [amendments, amendedUds]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return amendedUds.filter(u => {
      const license = licenseOf(u.licenseNo);
      const matchesQuery = !q || u.udNo.toLowerCase().includes(q) || u.licenseNo.toLowerCase().includes(q) || (license?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesSource = sourceFilter === 'all' || u.source === sourceFilter;
      return matchesQuery && matchesSource;
    });
  }, [amendedUds, search, sourceFilter]);
  const handleRetry = (amendmentNo: string) => {
    setAmendments(prev => prev.map(a => a.amendmentNo === amendmentNo ? {
      ...a,
      syncStatus: 'synced',
      lastSyncedAt: '26 Jul 2026, 09:45'
    } : a));
    showToast(t.retriedNotice);
  };
  const timeline = selected ? amendmentsForUd(selected.udNo) : [];
  return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.udManagement}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      {toast && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
          <Icon name="check_circle" className="text-[16px]" />
          {toast}
        </div>}

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="difference" label={t.totalAmendments} value={counts.totalAmendments} color="#0A4D8C" />
        <StatCard icon="dynamic_feed" label={t.udsWithAmendments} value={counts.udsWithAmendments} color="#1E88E5" />
        <StatCard icon="trending_up" label={t.maxAmendments} value={counts.maxUd ? `${counts.maxUd.amendmentCount} ${t.onUd} ${counts.maxUd.udNo}` : '—'} color="#00A86B" />
        <StatCard icon="report" label={t.needsAttention} value={counts.attention} color="#DC2626" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value as any)} className={`${inputClass} sm:w-48`}>
          <option value="all">{t.filterSource}: {t.all}</option>
          <option value="bgmea">{udSourceLabels.bgmea[language]}</option>
          <option value="bkmea">{udSourceLabels.bkmea[language]}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.tableHeaders.udNo}</th>
              <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
              <th className="px-4 py-3">{t.tableHeaders.source}</th>
              <th className="px-4 py-3">{t.tableHeaders.versions}</th>
              <th className="px-4 py-3">{t.tableHeaders.latestChange}</th>
              <th className="px-4 py-3">{t.tableHeaders.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
            const license = licenseOf(u.licenseNo);
            const chain = amendmentsForUd(u.udNo);
            const latest = chain[chain.length - 1];
            return <tr key={u.udNo} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{u.udNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{license?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{u.licenseNo}</p>
                  </td>
                  <td className="px-4 py-3"><SourceBadge source={u.source} language={language} /></td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#334155]">{t.version} {u.amendmentCount}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#334155]">{latest?.changeSummary ?? '—'}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(u)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                      {t.view}
                    </button>
                  </td>
                </tr>;
          })}
            {filtered.length === 0 && <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#94A3B8]">{t.noResults}</td>
              </tr>}
          </tbody>
        </table>
      </div>

      {selected && <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
          <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.detailTitle}</h2>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#0A4D8C]">{selected.udNo}</span>
                <SourceBadge source={selected.source} language={language} />
              </div>

              <div className="relative flex flex-col gap-6 pl-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#CBD5E1]" />
                <div className="relative">
                  <span className="absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0A4D8C] ring-4 ring-[#EAF3FE]" />
                  <p className="text-[13px] font-bold text-[#1E293B]">{t.original}</p>
                  <p className="text-[11px] text-[#94A3B8]">{selected.issueDate} · {selected.finishedGoods}, {selected.exportQuantity}</p>
                </div>
                {timeline.map(a => <div key={a.amendmentNo} className="relative">
                    <span className={`absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ${a.syncStatus === 'sync-failed' ? 'bg-[#DC2626] ring-red-50' : 'bg-[#00A86B] ring-emerald-50'}`} />
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[13px] font-bold text-[#1E293B]">{t.version} {a.versionNo} · {a.amendmentNo}</p>
                        {a.syncStatus === 'sync-failed' ? <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-[#DC2626]">{t.syncFailed}</span> : <span className="text-[11px] text-[#94A3B8]">{a.amendmentDate}</span>}
                      </div>
                      <p className="mt-1 text-[13px] text-[#334155]">{a.changeSummary}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.changedFields.map(f => <div key={f.field} className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] ring-1 ring-[#E2E8F0]">
                            <span className="font-semibold text-[#334155]">{f.field}:</span>
                            <span className="text-[#94A3B8] line-through">{f.before}</span>
                            <Icon name="arrow_forward" className="text-[13px] text-[#94A3B8]" />
                            <span className="font-semibold text-[#00A86B]">{f.after}</span>
                          </div>)}
                      </div>
                      {a.syncStatus === 'sync-failed' && <button type="button" onClick={() => handleRetry(a.amendmentNo)} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]">
                          <Icon name="restart_alt" className="text-[14px]" />
                          {t.retrySync}
                        </button>}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>}
    </div>;
}
