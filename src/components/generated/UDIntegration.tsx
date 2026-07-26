import { useMemo, useState } from 'react';
import { licenseOf, udRecords, udSourceLabels, udSyncStatusLabels, type UdRecord, type UdSource, type UdSyncStatus } from './udData';
type Language = 'en' | 'bn';
interface UDIntegrationProps {
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
function SyncBadge({
  status,
  language
}: {
  status: UdSyncStatus;
  language: Language;
}) {
  const s = udSyncStatusLabels[status];
  return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${s.color}1A`,
    color: s.color
  }}>
      <Icon name={status === 'synced' ? 'check_circle' : status === 'pending-sync' ? 'hourglass_top' : 'error'} className="text-[13px]" />
      {s[language]}
    </span>;
}
const T = {
  en: {
    home: 'Home',
    udManagement: 'UD Management',
    pageTitle: 'UD Integration',
    subtitle: 'Approved Utilization Declarations (UDs) issued by BGMEA/BKMEA are fetched automatically and replicated here without inconsistency from the original source, categorized for easy search and retrieval per bonder.',
    backToDashboard: 'Back to Dashboard',
    lastFullSync: 'Last full sync',
    syncNow: 'Sync Now',
    syncing: 'Syncing…',
    syncCompleteNotice: 'Sync complete — all pending UDs fetched from BGMEA/BKMEA UD System.',
    totalUds: 'Total UDs Synced',
    fromBgmea: 'From BGMEA',
    fromBkmea: 'From BKMEA',
    needsAttention: 'Needs Attention',
    searchPlaceholder: 'Search UD No, License No, or Bonder name…',
    filterSource: 'Source',
    filterStatus: 'Sync Status',
    all: 'All',
    tableHeaders: {
      udNo: 'UD No.',
      bonder: 'Bonder',
      source: 'Source',
      finishedGoods: 'Finished Goods',
      qty: 'Export Qty',
      status: 'Sync Status',
      action: ''
    },
    view: 'View',
    noResults: 'No UD records match the current filters.',
    detailTitle: 'UD Record Detail',
    close: 'Close',
    bin: 'BIN',
    licenseNo: 'Bond License No.',
    issueDate: 'Issue Date',
    exportQuantity: 'Export Quantity',
    exportValue: 'Export Value (USD)',
    recordStatus: 'Record Status',
    amendments: 'Amendments Linked',
    lastSynced: 'Last Synced At',
    integrationScopeTitle: 'Integration Scope',
    integrationScope: ['Bonder Profile & License DB Management', 'e-Bond Register / e-Passbook Management', 'UP (Utilization Permission) Management', 'HS Code Management'],
    retrySync: 'Retry Sync',
    retriedNotice: 'Retry queued — re-fetching this UD from source system.',
    active: 'Active',
    inactive: 'Inactive'
  },
  bn: {
    home: 'হোম',
    udManagement: 'ইউডি ব্যবস্থাপনা',
    pageTitle: 'ইউডি ইন্টিগ্রেশন',
    subtitle: 'বিজিএমইএ/বিকেএমইএ কর্তৃক অনুমোদিত ইউটিলাইজেশন ডিক্লারেশন (ইউডি) স্বয়ংক্রিয়ভাবে সংগ্রহ করা হয় এবং মূল উৎস থেকে কোনো অসামঞ্জস্য ছাড়াই এখানে প্রতিলিপি করা হয়, প্রতিটি বন্ডকারীর জন্য সহজে খোঁজার জন্য শ্রেণিবদ্ধ করা হয়।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    lastFullSync: 'সর্বশেষ সম্পূর্ণ সিঙ্ক',
    syncNow: 'এখনই সিঙ্ক করুন',
    syncing: 'সিঙ্ক করা হচ্ছে…',
    syncCompleteNotice: 'সিঙ্ক সম্পন্ন — বিজিএমইএ/বিকেএমইএ ইউডি সিস্টেম থেকে সকল অপেক্ষমাণ ইউডি সংগ্রহ করা হয়েছে।',
    totalUds: 'মোট সিঙ্ক করা ইউডি',
    fromBgmea: 'বিজিএমইএ থেকে',
    fromBkmea: 'বিকেএমইএ থেকে',
    needsAttention: 'মনোযোগ প্রয়োজন',
    searchPlaceholder: 'ইউডি নং, লাইসেন্স নং, বা বন্ডকারীর নাম খুঁজুন…',
    filterSource: 'উৎস',
    filterStatus: 'সিঙ্ক স্ট্যাটাস',
    all: 'সব',
    tableHeaders: {
      udNo: 'ইউডি নং',
      bonder: 'বন্ডকারী',
      source: 'উৎস',
      finishedGoods: 'তৈরি পণ্য',
      qty: 'রপ্তানি পরিমাণ',
      status: 'সিঙ্ক স্ট্যাটাস',
      action: ''
    },
    view: 'দেখুন',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো ইউডি রেকর্ড মেলেনি।',
    detailTitle: 'ইউডি রেকর্ড বিবরণ',
    close: 'বন্ধ করুন',
    bin: 'বিআইএন',
    licenseNo: 'বন্ড লাইসেন্স নং',
    issueDate: 'ইস্যুর তারিখ',
    exportQuantity: 'রপ্তানি পরিমাণ',
    exportValue: 'রপ্তানি মূল্য (USD)',
    recordStatus: 'রেকর্ড স্ট্যাটাস',
    amendments: 'সংযুক্ত সংশোধনী',
    lastSynced: 'সর্বশেষ সিঙ্ক করা হয়েছে',
    integrationScopeTitle: 'ইন্টিগ্রেশন স্কোপ',
    integrationScope: ['বন্ডকারী প্রোফাইল ও লাইসেন্স ডিবি ব্যবস্থাপনা', 'ই-বন্ড রেজিস্টার / ই-পাসবুক ব্যবস্থাপনা', 'ইউপি (ইউটিলাইজেশন পারমিশন) ব্যবস্থাপনা', 'এইচএস কোড ব্যবস্থাপনা'],
    retrySync: 'পুনরায় সিঙ্ক করুন',
    retriedNotice: 'পুনরায় চেষ্টা সারিবদ্ধ — উৎস সিস্টেম থেকে এই ইউডি পুনরায় সংগ্রহ করা হচ্ছে।',
    active: 'সক্রিয়',
    inactive: 'নিষ্ক্রিয়'
  }
};
export function UDIntegration({
  language,
  onDone
}: UDIntegrationProps) {
  const t = T[language];
  const [records, setRecords] = useState<UdRecord[]>(udRecords);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | UdSource>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UdSyncStatus>('all');
  const [selected, setSelected] = useState<UdRecord | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastFullSync, setLastFullSync] = useState('26 Jul 2026, 09:02');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };
  const counts = useMemo(() => ({
    total: records.length,
    bgmea: records.filter(r => r.source === 'bgmea').length,
    bkmea: records.filter(r => r.source === 'bkmea').length,
    attention: records.filter(r => r.syncStatus !== 'synced').length
  }), [records]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter(r => {
      const license = licenseOf(r.licenseNo);
      const matchesQuery = !q || r.udNo.toLowerCase().includes(q) || r.licenseNo.toLowerCase().includes(q) || (license?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesSource = sourceFilter === 'all' || r.source === sourceFilter;
      const matchesStatus = statusFilter === 'all' || r.syncStatus === statusFilter;
      return matchesQuery && matchesSource && matchesStatus;
    });
  }, [records, search, sourceFilter, statusFilter]);
  const handleSyncNow = () => {
    setSyncing(true);
    window.setTimeout(() => {
      setRecords(prev => prev.map(r => r.syncStatus === 'pending-sync' ? {
        ...r,
        syncStatus: 'synced',
        lastSyncedAt: '26 Jul 2026, 09:45'
      } : r));
      setLastFullSync('26 Jul 2026, 09:45');
      setSyncing(false);
      showToast(t.syncCompleteNotice);
    }, 900);
  };
  const handleRetry = (udNo: string) => {
    setRecords(prev => prev.map(r => r.udNo === udNo ? {
      ...r,
      syncStatus: 'synced',
      lastSyncedAt: '26 Jul 2026, 09:45'
    } : r));
    setSelected(prev => prev && prev.udNo === udNo ? {
      ...prev,
      syncStatus: 'synced',
      lastSyncedAt: '26 Jul 2026, 09:45'
    } : prev);
    showToast(t.retriedNotice);
  };
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-[#334155]">
          <Icon name="cloud_sync" className="text-[20px] text-[#0A4D8C]" />
          <span>{t.lastFullSync}: <span className="font-semibold">{lastFullSync}</span></span>
        </div>
        <button type="button" disabled={syncing} onClick={handleSyncNow} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-60">
          <Icon name={syncing ? 'progress_activity' : 'sync'} className={`text-[16px] ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? t.syncing : t.syncNow}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="folder_shared" label={t.totalUds} value={counts.total} color="#0A4D8C" />
        <StatCard icon="storefront" label={t.fromBgmea} value={counts.bgmea} color="#1E88E5" />
        <StatCard icon="storefront" label={t.fromBkmea} value={counts.bkmea} color="#00A86B" />
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
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className={`${inputClass} sm:w-48`}>
          <option value="all">{t.filterStatus}: {t.all}</option>
          <option value="synced">{udSyncStatusLabels.synced[language]}</option>
          <option value="pending-sync">{udSyncStatusLabels['pending-sync'][language]}</option>
          <option value="sync-failed">{udSyncStatusLabels['sync-failed'][language]}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.tableHeaders.udNo}</th>
              <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
              <th className="px-4 py-3">{t.tableHeaders.source}</th>
              <th className="px-4 py-3">{t.tableHeaders.finishedGoods}</th>
              <th className="px-4 py-3">{t.tableHeaders.qty}</th>
              <th className="px-4 py-3">{t.tableHeaders.status}</th>
              <th className="px-4 py-3">{t.tableHeaders.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
            const license = licenseOf(r.licenseNo);
            return <tr key={r.udNo} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{r.udNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{license?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{r.licenseNo}</p>
                  </td>
                  <td className="px-4 py-3"><SourceBadge source={r.source} language={language} /></td>
                  <td className="px-4 py-3 text-[#334155]">{r.finishedGoods}</td>
                  <td className="px-4 py-3 text-[#334155]">{r.exportQuantity}</td>
                  <td className="px-4 py-3"><SyncBadge status={r.syncStatus} language={language} /></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(r)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                      {t.view}
                    </button>
                  </td>
                </tr>;
          })}
            {filtered.length === 0 && <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#94A3B8]">{t.noResults}</td>
              </tr>}
          </tbody>
        </table>
      </div>

      {selected && <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
          <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
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
                <SyncBadge status={selected.syncStatus} language={language} />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.licenseNo}</p>
                  <p className="font-medium text-[#1E293B]">{selected.licenseNo}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.bin}</p>
                  <p className="font-medium text-[#1E293B]">{licenseOf(selected.licenseNo)?.bin ?? '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-[#94A3B8]">{t.tableHeaders.finishedGoods}</p>
                  <p className="font-medium text-[#1E293B]">{selected.finishedGoods}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.exportQuantity}</p>
                  <p className="font-medium text-[#1E293B]">{selected.exportQuantity}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.exportValue}</p>
                  <p className="font-medium text-[#1E293B]">${selected.exportValueUsd.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.issueDate}</p>
                  <p className="font-medium text-[#1E293B]">{selected.issueDate}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.recordStatus}</p>
                  <p className="font-medium text-[#1E293B]">{selected.status === 'active' ? t.active : t.inactive}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.amendments}</p>
                  <p className="font-medium text-[#1E293B]">{selected.amendmentCount}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.lastSynced}</p>
                  <p className="font-medium text-[#1E293B]">{selected.lastSyncedAt}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[13px] font-semibold text-[#334155]">{t.integrationScopeTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {t.integrationScope.map(scope => <span key={scope} className="rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[11px] font-medium text-[#334155]">
                      {scope}
                    </span>)}
                </div>
              </div>

              {selected.syncStatus === 'sync-failed' && <button type="button" onClick={() => handleRetry(selected.udNo)} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                  <Icon name="restart_alt" className="text-[16px]" />
                  {t.retrySync}
                </button>}
            </div>
          </div>
        </div>}
    </div>;
}
