import { useMemo, useState } from 'react';
import {
  BondLicense,
  bondLicenses,
  licenseCategoryLabels,
  licenseStatusLabels,
  auditStatusLabels,
  legalStatusLabels,
  LicenseStatus,
  AuditStatus,
  LicenseCategory,
  LegalStatus,
} from './bondLicenseData';

type Language = 'en' | 'bn';

interface LicenseSearchProps {
  language: Language;
  onDone: () => void;
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

const T = {
  en: {
    home: 'Home',
    bondLicense: 'Bond License Management',
    pageTitle: 'License Search',
    subtitle: 'Query-based search to locate bond licenses and generate a filtered report by area, status, year, audit status and more.',
    backToDashboard: 'Back to Dashboard',
    quickSearch: 'Quick Search (License No. / BIN / Bonder Name / UP-UD No.)',
    district: 'District',
    anyDistrict: 'Any district',
    status: 'License Status',
    anyStatus: 'Any status',
    category: 'License Category',
    anyCategory: 'Any category',
    year: 'Issue Year',
    anyYear: 'Any year',
    auditStatus: 'Audit Status',
    anyAudit: 'Any audit status',
    legalStatus: 'Legal Status',
    anyLegal: 'Any legal status',
    upUdNoLabel: 'UP-UD No.',
    search: 'Search',
    reset: 'Reset Filters',
    generateReport: 'Generate Report',
    reportQueued: 'Report queued — it will be available for download shortly.',
    resultsFound: 'results found',
    noResultsTitle: 'No matching licenses',
    noResultsBody: 'Adjust your search criteria and try again.',
    startTitle: 'Search the License Database',
    startBody: 'Use quick search or the filters above to find bond licenses by area, status, year, audit status or licensee name.',
    viewProfile: 'View Full Profile',
    close: 'Close',
    bin: 'BIN',
    lienBank: 'Lien Bank',
    issueDate: 'Issue Date',
    profileTitle: 'Bonder Profile',
  },
  bn: {
    home: 'হোম',
    bondLicense: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
    pageTitle: 'লাইসেন্স অনুসন্ধান',
    subtitle: 'এলাকা, অবস্থা, বছর, নিরীক্ষা অবস্থা ইত্যাদি অনুযায়ী বন্ড লাইসেন্স খুঁজতে ও ফিল্টার করা প্রতিবেদন তৈরি করতে কোয়েরি-ভিত্তিক অনুসন্ধান।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    quickSearch: 'দ্রুত অনুসন্ধান (লাইসেন্স নং / বিআইএন / বন্ডকারীর নাম / ইউপি-ইউডি নং)',
    district: 'জেলা',
    anyDistrict: 'যেকোনো জেলা',
    status: 'লাইসেন্স অবস্থা',
    anyStatus: 'যেকোনো অবস্থা',
    category: 'লাইসেন্স ক্যাটাগরি',
    anyCategory: 'যেকোনো ক্যাটাগরি',
    year: 'ইস্যুর বছর',
    anyYear: 'যেকোনো বছর',
    auditStatus: 'নিরীক্ষা অবস্থা',
    anyAudit: 'যেকোনো নিরীক্ষা অবস্থা',
    legalStatus: 'আইনি অবস্থা',
    anyLegal: 'যেকোনো আইনি অবস্থা',
    upUdNoLabel: 'ইউপি-ইউডি নং',
    search: 'অনুসন্ধান করুন',
    reset: 'ফিল্টার রিসেট করুন',
    generateReport: 'প্রতিবেদন তৈরি করুন',
    reportQueued: 'প্রতিবেদন সারিবদ্ধ হয়েছে — এটি শীঘ্রই ডাউনলোডের জন্য উপলব্ধ হবে।',
    resultsFound: 'টি ফলাফল পাওয়া গেছে',
    noResultsTitle: 'কোনো মিলযুক্ত লাইসেন্স নেই',
    noResultsBody: 'আপনার অনুসন্ধানের মানদণ্ড সামঞ্জস্য করে আবার চেষ্টা করুন।',
    startTitle: 'লাইসেন্স ডেটাবেজ অনুসন্ধান করুন',
    startBody: 'এলাকা, অবস্থা, বছর, নিরীক্ষা অবস্থা বা লাইসেন্সির নাম অনুযায়ী বন্ড লাইসেন্স খুঁজতে উপরের দ্রুত অনুসন্ধান বা ফিল্টার ব্যবহার করুন।',
    viewProfile: 'সম্পূর্ণ প্রোফাইল দেখুন',
    close: 'বন্ধ করুন',
    bin: 'বিআইএন',
    lienBank: 'লিয়েন ব্যাংক',
    issueDate: 'ইস্যুর তারিখ',
    profileTitle: 'বন্ডকারী প্রোফাইল',
  },
};

const districts = Array.from(new Set(bondLicenses.map((l) => l.district)));
const years = Array.from(new Set(bondLicenses.map((l) => l.issueDate.split(' ').pop()!))).sort().reverse();

const selectClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">{label}</span>
      {children}
    </label>
  );
}

const initialFilters = {
  query: '',
  district: '',
  status: '' as LicenseStatus | '',
  category: '' as LicenseCategory | '',
  year: '',
  auditStatus: '' as AuditStatus | '',
  legalStatus: '' as LegalStatus | '',
};

export function LicenseSearch({ language, onDone }: LicenseSearchProps) {
  const t = T[language];
  const [filters, setFilters] = useState(initialFilters);
  const [submittedFilters, setSubmittedFilters] = useState<typeof initialFilters | null>(null);
  const [selected, setSelected] = useState<BondLicense | null>(null);
  const [reportToast, setReportToast] = useState(false);

  const results = useMemo(() => {
    if (!submittedFilters) return [];
    const q = submittedFilters.query.trim().toLowerCase();
    return bondLicenses.filter((l) => {
      if (q && !(l.licenseNo.toLowerCase().includes(q) || l.nameEn.toLowerCase().includes(q) || l.nameBn.includes(q) || l.bin.includes(q) || l.upUdNo.toLowerCase().includes(q))) return false;
      if (submittedFilters.district && l.district !== submittedFilters.district) return false;
      if (submittedFilters.status && l.status !== submittedFilters.status) return false;
      if (submittedFilters.category && l.category !== submittedFilters.category) return false;
      if (submittedFilters.year && !l.issueDate.endsWith(submittedFilters.year)) return false;
      if (submittedFilters.auditStatus && l.auditStatus !== submittedFilters.auditStatus) return false;
      if (submittedFilters.legalStatus && l.legalStatus !== submittedFilters.legalStatus) return false;
      return true;
    });
  }, [submittedFilters]);

  const runSearch = () => setSubmittedFilters(filters);
  const resetFilters = () => {
    setFilters(initialFilters);
    setSubmittedFilters(null);
  };

  const generateReport = () => {
    setReportToast(true);
    setTimeout(() => setReportToast(false), 3000);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.bondLicense}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <Field label={t.quickSearch}>
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#94A3B8]" />
            <input
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="e.g. BL-2026-04521, Square Fashions, 004562178-0206"
              className="w-full rounded-lg border border-[#CBD5E1] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20"
            />
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Field label={t.district}>
            <select value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })} className={selectClass}>
              <option value="">{t.anyDistrict}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.status}>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as LicenseStatus | '' })} className={selectClass}>
              <option value="">{t.anyStatus}</option>
              {(Object.keys(licenseStatusLabels) as LicenseStatus[]).map((s) => (
                <option key={s} value={s}>
                  {licenseStatusLabels[s][language]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.category}>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as LicenseCategory | '' })} className={selectClass}>
              <option value="">{t.anyCategory}</option>
              {(Object.keys(licenseCategoryLabels) as LicenseCategory[]).map((c) => (
                <option key={c} value={c}>
                  {licenseCategoryLabels[c][language]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.year}>
            <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} className={selectClass}>
              <option value="">{t.anyYear}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.auditStatus}>
            <select value={filters.auditStatus} onChange={(e) => setFilters({ ...filters, auditStatus: e.target.value as AuditStatus | '' })} className={selectClass}>
              <option value="">{t.anyAudit}</option>
              {(Object.keys(auditStatusLabels) as AuditStatus[]).map((a) => (
                <option key={a} value={a}>
                  {auditStatusLabels[a][language]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.legalStatus}>
            <select value={filters.legalStatus} onChange={(e) => setFilters({ ...filters, legalStatus: e.target.value as LegalStatus | '' })} className={selectClass}>
              <option value="">{t.anyLegal}</option>
              {(Object.keys(legalStatusLabels) as LegalStatus[]).map((s) => (
                <option key={s} value={s}>
                  {legalStatusLabels[s][language]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runSearch}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]"
          >
            <Icon name="search" className="text-[18px]" />
            {t.search}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
          >
            <Icon name="restart_alt" className="text-[18px]" />
            {t.reset}
          </button>
          {submittedFilters && results.length > 0 && (
            <button
              type="button"
              onClick={generateReport}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#00A86B] px-4 py-2.5 text-sm font-semibold text-[#00A86B] transition-colors hover:bg-emerald-50"
            >
              <Icon name="summarize" className="text-[18px]" />
              {t.generateReport}
            </button>
          )}
        </div>
      </div>

      {reportToast && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Icon name="check_circle" className="text-[18px]" />
          {t.reportQueued}
        </div>
      )}

      {!submittedFilters ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
          <Icon name="manage_search" className="text-[40px] text-[#94A3B8]" />
          <h2 className="text-sm font-bold text-[#1E293B]">{t.startTitle}</h2>
          <p className="max-w-sm text-xs text-[#64748B]">{t.startBody}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
          <Icon name="search_off" className="text-[36px] text-[#94A3B8]" />
          <h2 className="text-sm font-bold text-[#1E293B]">{t.noResultsTitle}</h2>
          <p className="text-xs text-[#64748B]">{t.noResultsBody}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-[#64748B]">
            {results.length} {t.resultsFound}
          </p>
          {results.map((l) => {
            const statusStyle = licenseStatusLabels[l.status];
            const auditStyle = auditStatusLabels[l.auditStatus];
            const legalStyle = legalStatusLabels[l.legalStatus];
            return (
              <div key={l.licenseNo} className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name="domain" className="text-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#0A4D8C]">{l.licenseNo}</span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${statusStyle.color}1A`, color: statusStyle.color }}>
                      {statusStyle[language]}
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${auditStyle.color}1A`, color: auditStyle.color }}>
                      {auditStyle[language]}
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${legalStyle.color}1A`, color: legalStyle.color }}>
                      {legalStyle[language]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[13px] font-semibold text-[#1E293B]">{l[language === 'en' ? 'nameEn' : 'nameBn']}</p>
                  <p className="text-[11px] text-[#94A3B8]">
                    {t.bin}: {l.bin} · {l.district} · {licenseCategoryLabels[l.category][language]} · {t.upUdNoLabel}: {l.upUdNo}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(l)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
                >
                  {t.viewProfile}
                  <Icon name="arrow_forward" className="text-[15px]" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.profileTitle}</h2>
              <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-4 px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name="domain" className="text-[24px]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1E293B]">{selected[language === 'en' ? 'nameEn' : 'nameBn']}</p>
                  <p className="text-xs font-semibold text-[#0A4D8C]">{selected.licenseNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#E2E8F0] p-4 text-[13px]">
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.bin}</p>
                  <p className="font-medium text-[#1E293B]">{selected.bin}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.issueDate}</p>
                  <p className="font-medium text-[#1E293B]">{selected.issueDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-[#94A3B8]">{t.lienBank}</p>
                  <p className="font-medium text-[#1E293B]">{selected.lienBank}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.legalStatus}</p>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: `${legalStatusLabels[selected.legalStatus].color}1A`, color: legalStatusLabels[selected.legalStatus].color }}
                  >
                    {legalStatusLabels[selected.legalStatus][language]}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.upUdNoLabel}</p>
                  <p className="font-medium text-[#1E293B]">{selected.upUdNo}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
