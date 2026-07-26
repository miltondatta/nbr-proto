import { useMemo, useState } from 'react';
import { amendmentsForUd, licenseOf, summarizationFieldDefs, udAmendments, udRecords, udSourceLabels, type UdRecord } from './udData';
type Language = 'en' | 'bn';
interface UDSummaryProps {
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
const T = {
  en: {
    home: 'Home',
    udManagement: 'UD Management',
    pageTitle: 'UD Summary',
    subtitle: 'A configurable summarization of every UD and its Amendments, showing current status after all changes — used for a quick reference while working in e-Passbook, e-Bond Register, or UP Management.',
    backToDashboard: 'Back to Dashboard',
    searchPlaceholder: 'e-Search: UD No., Amendment No., or Bonder name…',
    searchResults: 'Search Results',
    noSearchResults: 'No matching UD, Amendment, or Bonder found.',
    resultUd: 'UD',
    resultAmendment: 'Amendment',
    dashboardTitle: 'Dashboard',
    periodDay: 'Today',
    periodWeek: 'This Week',
    periodMonth: 'This Month',
    periodYear: 'This Year',
    totalUdIssued: 'UDs Issued',
    totalAmendmentsFiled: 'Amendments Filed',
    highestAmendment: 'Highest Amendment Count',
    onUd: 'on',
    configureTitle: 'Configure Summarization Fields',
    configureHint: 'Choose which fields the Custom Bond Commissionerate wants displayed in the summary table below.',
    configureToggle: 'Configure Fields',
    summaryTableTitle: 'UD & Amendment Summarization',
    colUd: 'UD No.',
    colBonder: 'Bonder',
    reportsTitle: 'Reports',
    reportActiveUd: 'Active / Inactive UDs',
    reportActiveAmd: 'Active / Inactive Amendments',
    reportMaxAmd: 'UDs Reached Maximum Amendments',
    thresholdLabel: 'Maximum amendments threshold',
    generate: 'Generate Report',
    active: 'Active',
    inactive: 'Inactive',
    udsAtOrAbove: 'UDs at or above threshold',
    reportGenerated: 'Report generated and ready to export.',
    close: 'Close',
    viewSummary: 'View Summary'
  },
  bn: {
    home: 'হোম',
    udManagement: 'ইউডি ব্যবস্থাপনা',
    pageTitle: 'ইউডি সারসংক্ষেপ',
    subtitle: 'প্রতিটি ইউডি এবং এর সংশোধনীর একটি কনফিগারযোগ্য সারসংক্ষেপ, সকল পরিবর্তনের পরে বর্তমান অবস্থা দেখায় — ই-পাসবুক, ই-বন্ড রেজিস্টার, বা ইউপি ব্যবস্থাপনায় কাজ করার সময় দ্রুত রেফারেন্সের জন্য ব্যবহৃত হয়।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    searchPlaceholder: 'ই-সার্চ: ইউডি নং, সংশোধনী নং, বা বন্ডকারীর নাম…',
    searchResults: 'অনুসন্ধানের ফলাফল',
    noSearchResults: 'কোনো মিলযুক্ত ইউডি, সংশোধনী, বা বন্ডকারী পাওয়া যায়নি।',
    resultUd: 'ইউডি',
    resultAmendment: 'সংশোধনী',
    dashboardTitle: 'ড্যাশবোর্ড',
    periodDay: 'আজ',
    periodWeek: 'এই সপ্তাহ',
    periodMonth: 'এই মাস',
    periodYear: 'এই বছর',
    totalUdIssued: 'ইস্যুকৃত ইউডি',
    totalAmendmentsFiled: 'দাখিলকৃত সংশোধনী',
    highestAmendment: 'সর্বোচ্চ সংশোধনী সংখ্যা',
    onUd: 'তে',
    configureTitle: 'সারসংক্ষেপের ক্ষেত্র কনফিগার করুন',
    configureHint: 'নিচের সারসংক্ষেপ টেবিলে কাস্টম বন্ড কমিশনারেট কোন ক্ষেত্রগুলো দেখাতে চান তা নির্বাচন করুন।',
    configureToggle: 'ক্ষেত্র কনফিগার করুন',
    summaryTableTitle: 'ইউডি ও সংশোধনী সারসংক্ষেপ',
    colUd: 'ইউডি নং',
    colBonder: 'বন্ডকারী',
    reportsTitle: 'রিপোর্ট',
    reportActiveUd: 'সক্রিয় / নিষ্ক্রিয় ইউডি',
    reportActiveAmd: 'সক্রিয় / নিষ্ক্রিয় সংশোধনী',
    reportMaxAmd: 'সর্বোচ্চ সংশোধনী প্রাপ্ত ইউডি',
    thresholdLabel: 'সর্বোচ্চ সংশোধনী থ্রেশহোল্ড',
    generate: 'রিপোর্ট তৈরি করুন',
    active: 'সক্রিয়',
    inactive: 'নিষ্ক্রিয়',
    udsAtOrAbove: 'থ্রেশহোল্ডে বা তার বেশি ইউডি',
    reportGenerated: 'রিপোর্ট তৈরি হয়েছে এবং এক্সপোর্টের জন্য প্রস্তুত।',
    close: 'বন্ধ করুন',
    viewSummary: 'সারসংক্ষেপ দেখুন'
  }
};
const fieldNameMap: Record<string, string> = {
  finishedGoods: 'Finished Goods Description',
  exportQuantity: 'Export Quantity',
  exportValue: 'Export Value (USD)',
  rawMaterialRequirement: 'Raw Material Requirement'
};
const today = new Date('2026-07-26T00:00:00');
function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 9999;
  return Math.floor((today.getTime() - d.getTime()) / 86400000);
}
export function UDSummary({
  language,
  onDone
}: UDSummaryProps) {
  const t = T[language];
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [configureOpen, setConfigureOpen] = useState(false);
  const [enabledFields, setEnabledFields] = useState<Record<string, boolean>>(() => Object.fromEntries(summarizationFieldDefs.map(f => [f.id, f.defaultOn])));
  const [selected, setSelected] = useState<UdRecord | null>(null);
  const [threshold, setThreshold] = useState(3);
  const [reportToast, setReportToast] = useState<string | null>(null);
  const periodDays: Record<typeof period, number> = {
    day: 0,
    week: 7,
    month: 31,
    year: 366
  } as any;
  const maxDays = periodDays[period];
  const udInPeriod = useMemo(() => udRecords.filter(u => daysAgo(u.issueDate) <= maxDays), [maxDays]);
  const amdInPeriod = useMemo(() => udAmendments.filter(a => daysAgo(a.amendmentDate) <= maxDays), [maxDays]);
  const maxUd = useMemo(() => udRecords.reduce((max, u) => u.amendmentCount > max.amendmentCount ? u : max, udRecords[0]), []);
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const udMatches = udRecords.filter(u => {
      const license = licenseOf(u.licenseNo);
      return u.udNo.toLowerCase().includes(q) || (license?.nameEn.toLowerCase().includes(q) ?? false);
    });
    const amdMatches = udAmendments.filter(a => a.amendmentNo.toLowerCase().includes(q));
    return {
      udMatches,
      amdMatches
    };
  }, [search]);
  const currentValue = (u: UdRecord, defId: string): string => {
    const mapped = fieldNameMap[defId];
    const chain = amendmentsForUd(u.udNo);
    if (mapped) {
      for (let i = chain.length - 1; i >= 0; i--) {
        const cf = chain[i].changedFields.find(f => f.field === mapped);
        if (cf) return cf.after;
      }
    }
    switch (defId) {
      case 'finishedGoods':
        return u.finishedGoods;
      case 'exportQuantity':
        return u.exportQuantity;
      case 'exportValue':
        return `$${u.exportValueUsd.toLocaleString()}`;
      case 'amendmentCount':
        return String(u.amendmentCount);
      case 'lastAmendmentDate':
        return chain.length ? chain[chain.length - 1].amendmentDate : '—';
      case 'source':
        return udSourceLabels[u.source][language];
      case 'rawMaterialRequirement':
        return '—';
      default:
        return '—';
    }
  };
  const activeFieldDefs = summarizationFieldDefs.filter(f => enabledFields[f.id]);
  const activeUdCount = udRecords.filter(u => u.status === 'active').length;
  const inactiveUdCount = udRecords.length - activeUdCount;
  const amdActiveCount = udAmendments.filter(a => udRecords.find(u => u.udNo === a.udNo)?.status === 'active').length;
  const amdInactiveCount = udAmendments.length - amdActiveCount;
  const overThreshold = udRecords.filter(u => u.amendmentCount >= threshold);
  const handleGenerate = () => {
    setReportToast(t.reportGenerated);
    window.setTimeout(() => setReportToast(null), 3500);
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

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        {searchResults && <div className="mt-3 flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.searchResults}</p>
            {searchResults.udMatches.length === 0 && searchResults.amdMatches.length === 0 && <p className="text-sm text-[#94A3B8]">{t.noSearchResults}</p>}
            {searchResults.udMatches.map(u => <button key={u.udNo} type="button" onClick={() => setSelected(u)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-[#1E88E5] hover:bg-[#F8FAFC] hover:underline">
                <Icon name="description" className="text-[16px]" />
                <span className="rounded-full bg-[#EAF3FE] px-2 py-0.5 text-[10px] font-semibold text-[#0A4D8C]">{t.resultUd}</span>
                {u.udNo} — {licenseOf(u.licenseNo)?.nameEn}
              </button>)}
            {searchResults.amdMatches.map(a => <button key={a.amendmentNo} type="button" onClick={() => setSelected(udRecords.find(u => u.udNo === a.udNo) ?? null)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-[#1E88E5] hover:bg-[#F8FAFC] hover:underline">
                <Icon name="difference" className="text-[16px]" />
                <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#334155]">{t.resultAmendment}</span>
                {a.amendmentNo} — {a.changeSummary}
              </button>)}
          </div>}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#1E293B]">{t.dashboardTitle}</h2>
          <div className="flex w-fit rounded-full border border-[#CBD5E1] bg-white p-1">
            {(['day', 'week', 'month', 'year'] as const).map(p => <button key={p} type="button" onClick={() => setPeriod(p)} className={['rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors', period === p ? 'bg-[#0A4D8C] text-white' : 'text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
                {p === 'day' ? t.periodDay : p === 'week' ? t.periodWeek : p === 'month' ? t.periodMonth : t.periodYear}
              </button>)}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon="folder_shared" label={t.totalUdIssued} value={udInPeriod.length} color="#0A4D8C" />
          <StatCard icon="difference" label={t.totalAmendmentsFiled} value={amdInPeriod.length} color="#1E88E5" />
          <StatCard icon="trending_up" label={t.highestAmendment} value={maxUd ? `${maxUd.amendmentCount} ${t.onUd} ${maxUd.udNo}` : '—'} color="#00A86B" />
        </div>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <button type="button" onClick={() => setConfigureOpen(o => !o)} className="flex w-full items-center justify-between px-4 py-3.5">
          <span className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
            <Icon name="tune" className="text-[18px] text-[#0A4D8C]" />
            {t.configureTitle}
          </span>
          <Icon name={configureOpen ? 'expand_less' : 'expand_more'} className="text-[20px] text-[#64748B]" />
        </button>
        {configureOpen && <div className="border-t border-[#E2E8F0] p-4">
            <p className="mb-3 text-[13px] text-[#64748B]">{t.configureHint}</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {summarizationFieldDefs.map(f => <label key={f.id} className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#334155]">
                  <input type="checkbox" checked={!!enabledFields[f.id]} onChange={e => setEnabledFields(prev => ({
                ...prev,
                [f.id]: e.target.checked
              }))} className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C] focus:ring-[#0A4D8C]" />
                  {language === 'en' ? f.labelEn : f.labelBn}
                </label>)}
            </div>
          </div>}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#1E293B]">{t.summaryTableTitle}</h2>
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                <th className="px-4 py-3">{t.colUd}</th>
                <th className="px-4 py-3">{t.colBonder}</th>
                {activeFieldDefs.map(f => <th key={f.id} className="px-4 py-3">{language === 'en' ? f.labelEn : f.labelBn}</th>)}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {udRecords.map(u => <tr key={u.udNo} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{u.udNo}</td>
                  <td className="px-4 py-3 text-[#1E293B]">{licenseOf(u.licenseNo)?.nameEn ?? '—'}</td>
                  {activeFieldDefs.map(f => <td key={f.id} className="px-4 py-3 text-[#334155]">{currentValue(u, f.id)}</td>)}
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(u)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                      {t.viewSummary}
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#1E293B]">{t.reportsTitle}</h2>
        {reportToast && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
            <Icon name="check_circle" className="text-[16px]" />
            {reportToast}
          </div>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-[#1E293B]">{t.reportActiveUd}</p>
            <p className="text-xs text-[#64748B]">{t.active}: <span className="font-semibold text-[#00A86B]">{activeUdCount}</span> · {t.inactive}: <span className="font-semibold text-[#94A3B8]">{inactiveUdCount}</span></p>
            <button type="button" onClick={handleGenerate} className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
              <Icon name="summarize" className="text-[14px]" />
              {t.generate}
            </button>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-[#1E293B]">{t.reportActiveAmd}</p>
            <p className="text-xs text-[#64748B]">{t.active}: <span className="font-semibold text-[#00A86B]">{amdActiveCount}</span> · {t.inactive}: <span className="font-semibold text-[#94A3B8]">{amdInactiveCount}</span></p>
            <button type="button" onClick={handleGenerate} className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
              <Icon name="summarize" className="text-[14px]" />
              {t.generate}
            </button>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-[#1E293B]">{t.reportMaxAmd}</p>
            <label className="flex items-center gap-2 text-xs text-[#64748B]">
              {t.thresholdLabel}
              <input type="number" min={1} value={threshold} onChange={e => setThreshold(Math.max(1, Number(e.target.value) || 1))} className="w-16 rounded-lg border border-[#CBD5E1] px-2 py-1 text-sm" />
            </label>
            <p className="text-xs text-[#64748B]">{t.udsAtOrAbove}: <span className="font-semibold text-[#0A4D8C]">{overThreshold.length}</span></p>
            <button type="button" onClick={handleGenerate} className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
              <Icon name="summarize" className="text-[14px]" />
              {t.generate}
            </button>
          </div>
        </div>
      </div>

      {selected && <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
          <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{selected.udNo}</h2>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <p className="text-sm text-[#64748B]">{licenseOf(selected.licenseNo)?.nameEn} · {selected.licenseNo}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
                {summarizationFieldDefs.map(f => <div key={f.id}>
                    <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? f.labelEn : f.labelBn}</p>
                    <p className="font-medium text-[#1E293B]">{currentValue(selected, f.id)}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </div>}
    </div>;
}
