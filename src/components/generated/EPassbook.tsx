import { useState } from 'react';
import { bondLicenses, BondLicense } from './bondLicenseData';

type Language = 'en' | 'bn';
type Tab = 'import' | 'export';
type AlertLevel = 'ok' | 'warning' | 'expired';

interface EPassbookProps {
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
    pageTitle: 'e-Passbook',
    subtitle: 'Real-time, view-only record of import and export transactions synced from ASYCUDA World and the UD system.',
    backToDashboard: 'Back to Dashboard',
    licenseNoLabel: 'Bond License Number',
    verify: 'Verify',
    notFound: 'No license found with this number. Please check and try again.',
    lookupTitle: 'Look up a Bond License',
    lookupBody: 'Enter a bond license number to view its e-Passbook.',
    viewOnlyBadge: 'View Only — synced from ASYCUDA World & UD System',
    viewOnlyNote: 'Bonders and CBC officials cannot edit or update this passbook. Corrections must be made in ASYCUDA or the UD system and will reflect here automatically.',
    changeLicense: 'Change License',
    syncStatus: 'Synced with ASYCUDA World',
    lastSynced: 'Last synced',
    refreshSync: 'Refresh Sync',
    totalImportValue: 'Total Import Value',
    totalExportValue: 'Total Export Value',
    rawMaterialBalance: 'Raw Material Balance',
    activeAlerts: 'Active Bonding Alerts',
    importTab: 'Import Section',
    exportTab: 'Export Section',
    beNoDate: 'B/E No. & Date',
    lcNoDate: 'LC No. & Date',
    fabricDetails: 'Fabric Details',
    length: 'Length',
    totalFabric: 'Total Fabric',
    bondNoDate: 'Bond No. & Date',
    valueUsd: 'Value (USD)',
    bondingStatus: 'Bonding Status',
    hsCodeFlag: 'HS Code not in profile',
    withinPeriod: 'Within Period',
    nearingExpiry: 'Nearing Expiry',
    expired: 'Expired',
    boeNoDate: 'Bill of Export No. & Date',
    qtyProduced: 'Qty. of Produced Goods',
    fabricUsed: 'Total Fabric Used',
    exportValueUsd: 'Export Value (USD)',
    bondingAlerts: 'Bonding Period Alerts',
    daysRemaining: 'days remaining',
    daysOverdue: 'days overdue',
    notificationLog: 'Notification Log',
    system: 'System',
    cbcNotified: 'CBC officials notified',
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ই-পাসবুক',
    subtitle: 'ASYCUDA World ও ইউডি সিস্টেম থেকে সিঙ্ককৃত আমদানি ও রপ্তানি লেনদেনের রিয়েল-টাইম, শুধুমাত্র-দেখার-যোগ্য রেকর্ড।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    licenseNoLabel: 'বন্ড লাইসেন্স নম্বর',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বরে কোনো লাইসেন্স পাওয়া যায়নি। অনুগ্রহ করে যাচাই করে আবার চেষ্টা করুন।',
    lookupTitle: 'বন্ড লাইসেন্স অনুসন্ধান করুন',
    lookupBody: 'ই-পাসবুক দেখতে একটি বন্ড লাইসেন্স নম্বর প্রবেশ করান।',
    viewOnlyBadge: 'শুধুমাত্র দেখার যোগ্য — ASYCUDA World ও ইউডি সিস্টেম থেকে সিঙ্ককৃত',
    viewOnlyNote: 'বন্ডকারী ও সিবিসি কর্মকর্তারা এই পাসবুক সম্পাদনা বা হালনাগাদ করতে পারবেন না। সংশোধন ASYCUDA বা ইউডি সিস্টেমে করতে হবে এবং তা স্বয়ংক্রিয়ভাবে এখানে প্রতিফলিত হবে।',
    changeLicense: 'লাইসেন্স পরিবর্তন',
    syncStatus: 'ASYCUDA World-এর সাথে সিঙ্ককৃত',
    lastSynced: 'সর্বশেষ সিঙ্ক',
    refreshSync: 'সিঙ্ক রিফ্রেশ করুন',
    totalImportValue: 'মোট আমদানি মূল্য',
    totalExportValue: 'মোট রপ্তানি মূল্য',
    rawMaterialBalance: 'কাঁচামাল ব্যালেন্স',
    activeAlerts: 'সক্রিয় বন্ডিং সতর্কতা',
    importTab: 'আমদানি অংশ',
    exportTab: 'রপ্তানি অংশ',
    beNoDate: 'বি/ই নং ও তারিখ',
    lcNoDate: 'এলসি নং ও তারিখ',
    fabricDetails: 'ফেব্রিক বিবরণ',
    length: 'দৈর্ঘ্য',
    totalFabric: 'মোট ফেব্রিক',
    bondNoDate: 'বন্ড নং ও তারিখ',
    valueUsd: 'মূল্য (ইউএসডি)',
    bondingStatus: 'বন্ডিং অবস্থা',
    hsCodeFlag: 'এইচএস কোড প্রোফাইলে নেই',
    withinPeriod: 'মেয়াদের মধ্যে',
    nearingExpiry: 'মেয়াদ শেষের কাছাকাছি',
    expired: 'মেয়াদোত্তীর্ণ',
    boeNoDate: 'বিল অব এক্সপোর্ট নং ও তারিখ',
    qtyProduced: 'উৎপাদিত পণ্যের পরিমাণ',
    fabricUsed: 'মোট ব্যবহৃত ফেব্রিক',
    exportValueUsd: 'রপ্তানি মূল্য (ইউএসডি)',
    bondingAlerts: 'বন্ডিং সময়কাল সতর্কতা',
    daysRemaining: 'দিন বাকি',
    daysOverdue: 'দিন অতিবাহিত',
    notificationLog: 'নোটিফিকেশন লগ',
    system: 'সিস্টেম',
    cbcNotified: 'সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে',
  },
};

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
const errorInputClass = 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20';

function Field({ label, required, children, error }: { label: string; required?: boolean; children: React.ReactNode; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
      {error && <span className="text-[11px] font-medium text-[#DC2626]">{error}</span>}
    </label>
  );
}

interface ImportEntry {
  beNo: string;
  beDate: string;
  lcNo: string;
  lcDate: string;
  fabric: { en: string; bn: string };
  length: string;
  totalFabric: string;
  totalFabricKg: number;
  valueUsd: number;
  hsCode: string;
  hsFlag: boolean;
  status: AlertLevel;
  daysInfo?: number;
}

interface ExportEntry {
  boeNo: string;
  boeDate: string;
  product: { en: string; bn: string };
  qtyProduced: string;
  fabricUsed: string;
  fabricUsedKg: number;
  valueUsd: number;
}

const importEntries: ImportEntry[] = [
  {
    beNo: 'C-88452', beDate: '02 Jun 2026', lcNo: '0219826001234', lcDate: '15 May 2026',
    fabric: { en: '100% Cotton Single Jersey', bn: '১০০% কটন সিঙ্গেল জার্সি' }, length: '45,000 m', totalFabric: '12,500 kg', totalFabricKg: 12500,
    valueUsd: 58400, hsCode: '6006.21.00', hsFlag: false, status: 'ok',
  },
  {
    beNo: 'C-88790', beDate: '10 Jun 2026', lcNo: '0219826001456', lcDate: '22 May 2026',
    fabric: { en: 'Polyester Twill', bn: 'পলিয়েস্টার টুইল' }, length: '30,000 m', totalFabric: '8,200 kg', totalFabricKg: 8200,
    valueUsd: 41200, hsCode: '5407.61.00', hsFlag: false, status: 'ok',
  },
  {
    beNo: 'C-89012', beDate: '18 Jun 2026', lcNo: '0219826001678', lcDate: '01 Jun 2026',
    fabric: { en: 'Elastane Rib Knit', bn: 'ইলাস্টেন রিব নিট' }, length: '12,000 m', totalFabric: '3,100 kg', totalFabricKg: 3100,
    valueUsd: 19850, hsCode: '6006.31.00', hsFlag: false, status: 'warning', daysInfo: 12,
  },
  {
    beNo: 'C-87220', beDate: '15 Mar 2026', lcNo: '0219826000890', lcDate: '28 Feb 2026',
    fabric: { en: 'Cotton Denim', bn: 'কটন ডেনিম' }, length: '22,000 m', totalFabric: '9,600 kg', totalFabricKg: 9600,
    valueUsd: 52000, hsCode: '5209.42.00', hsFlag: false, status: 'expired', daysInfo: 8,
  },
  {
    beNo: 'C-89344', beDate: '25 Jun 2026', lcNo: '0219826001789', lcDate: '09 Jun 2026',
    fabric: { en: 'Sewing Thread & Accessories', bn: 'সেলাই সুতা ও আনুষঙ্গিক' }, length: '—', totalFabric: '1,200 kg', totalFabricKg: 1200,
    valueUsd: 6750, hsCode: '5401.10.00', hsFlag: true, status: 'ok',
  },
  {
    beNo: 'C-89560', beDate: '05 Jul 2026', lcNo: '0219826001923', lcDate: '19 Jun 2026',
    fabric: { en: 'Woven Interlining', bn: 'ওভেন ইন্টারলাইনিং' }, length: '8,500 m', totalFabric: '2,400 kg', totalFabricKg: 2400,
    valueUsd: 11300, hsCode: '5407.72.00', hsFlag: false, status: 'ok',
  },
];

const exportEntries: ExportEntry[] = [
  { boeNo: 'EXP-2026-04512', boeDate: '20 Jun 2026', product: { en: 'T-Shirts', bn: 'টি-শার্ট' }, qtyProduced: '42,000 pcs', fabricUsed: '9,800 kg (Cotton Single Jersey)', fabricUsedKg: 9800, valueUsd: 186000 },
  { boeNo: 'EXP-2026-04589', boeDate: '28 Jun 2026', product: { en: 'Polo Shirts', bn: 'পোলো শার্ট' }, qtyProduced: '18,500 pcs', fabricUsed: '5,600 kg (Polyester Twill)', fabricUsedKg: 5600, valueUsd: 92400 },
  { boeNo: 'EXP-2026-04721', boeDate: '08 Jul 2026', product: { en: 'Denim Jeans', bn: 'ডেনিম জিন্স' }, qtyProduced: '25,000 pcs', fabricUsed: '8,900 kg (Cotton Denim)', fabricUsedKg: 8900, valueUsd: 210500 },
  { boeNo: 'EXP-2026-04850', boeDate: '15 Jul 2026', product: { en: 'Leggings', bn: 'লেগিংস' }, qtyProduced: '12,000 pcs', fabricUsed: '2,850 kg (Elastane Rib Knit)', fabricUsedKg: 2850, valueUsd: 58200 },
];

const statusStyle: Record<AlertLevel, { bg: string; color: string; icon: string }> = {
  ok: { bg: 'bg-emerald-50', color: '#00A86B', icon: 'check_circle' },
  warning: { bg: 'bg-amber-50', color: '#B45309', icon: 'warning' },
  expired: { bg: 'bg-red-50', color: '#DC2626', icon: 'error' },
};

function notificationLog(language: Language) {
  return [
    { icon: 'workspace_premium', tone: 'ok', en: 'e-Passbook issued and linked to Bonder Profile.', bn: 'ই-পাসবুক ইস্যু হয়ে বন্ডকারী প্রোফাইলে সংযুক্ত হয়েছে।', date: '18 Nov 2024' },
    { icon: 'call_received', tone: 'ok', en: 'Import entry recorded — B/E No. C-89560.', bn: 'আমদানি এন্ট্রি রেকর্ড হয়েছে — বি/ই নং C-89560।', date: '05 Jul 2026' },
    { icon: 'warning', tone: 'warning', en: 'HS Code 5401.10.00 not listed in Bonder Profile — CBC officials notified.', bn: 'এইচএস কোড 5401.10.00 বন্ডকারী প্রোফাইলে তালিকাভুক্ত নয় — সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।', date: '25 Jun 2026' },
    { icon: 'schedule', tone: 'warning', en: 'Bonding period alert — B/E No. C-89012 nearing expiry (12 days remaining).', bn: 'বন্ডিং সময়কাল সতর্কতা — বি/ই নং C-89012-এর মেয়াদ শেষ হতে যাচ্ছে (১২ দিন বাকি)।', date: '11 Jul 2026' },
    { icon: 'error', tone: 'expired', en: 'Bonding period expired — B/E No. C-87220.', bn: 'বন্ডিং সময়কাল মেয়াদোত্তীর্ণ — বি/ই নং C-87220।', date: '15 Jul 2026' },
    { icon: 'call_made', tone: 'ok', en: 'Export entry recorded — Bill of Export No. EXP-2026-04850.', bn: 'রপ্তানি এন্ট্রি রেকর্ড হয়েছে — বিল অব এক্সপোর্ট নং EXP-2026-04850।', date: '15 Jul 2026' },
  ];
}

const notifToneStyle: Record<string, string> = {
  ok: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  expired: 'bg-red-50 text-[#DC2626]',
};

export function EPassbook({ language, onDone }: EPassbookProps) {
  const t = T[language];
  const [licenseNoInput, setLicenseNoInput] = useState('');
  const [license, setLicense] = useState<BondLicense | null>(null);
  const [verifyError, setVerifyError] = useState(false);
  const [tab, setTab] = useState<Tab>('import');
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('23 Jul 2026, 10:42 AM');

  const verifyLicense = () => {
    const found = bondLicenses.find((l) => l.licenseNo.toLowerCase() === licenseNoInput.trim().toLowerCase());
    if (found) {
      setLicense(found);
      setVerifyError(false);
    } else {
      setLicense(null);
      setVerifyError(true);
    }
  };

  const refreshSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSynced('23 Jul 2026, ' + new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'bn-BD', { hour: '2-digit', minute: '2-digit' }));
    }, 900);
  };

  if (!license) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
            <Icon name="import_contacts" className="text-[28px]" />
          </span>
          <h2 className="text-base font-bold text-[#1E293B]">{t.lookupTitle}</h2>
          <p className="max-w-sm text-xs text-[#64748B]">{t.lookupBody}</p>
          <div className="w-full max-w-sm text-left">
            <Field label={t.licenseNoLabel} required error={verifyError ? t.notFound : undefined}>
              <div className="flex gap-2">
                <input
                  value={licenseNoInput}
                  onChange={(e) => {
                    setLicenseNoInput(e.target.value);
                    setVerifyError(false);
                  }}
                  placeholder="BL-2024-03398"
                  className={`${inputClass} ${verifyError ? errorInputClass : ''}`}
                />
                <button type="button" onClick={verifyLicense} className="shrink-0 rounded-lg border border-[#0A4D8C] px-4 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                  {t.verify}
                </button>
              </div>
            </Field>
          </div>
          <button type="button" onClick={onDone} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0A4D8C]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.backToDashboard}
          </button>
        </div>
      </div>
    );
  }

  const totalImportValue = importEntries.reduce((s, e) => s + e.valueUsd, 0);
  const totalExportValue = exportEntries.reduce((s, e) => s + e.valueUsd, 0);
  const totalImportedKg = importEntries.reduce((s, e) => s + e.totalFabricKg, 0);
  const totalUsedKg = exportEntries.reduce((s, e) => s + e.fabricUsedKg, 0);
  const rawMaterialBalance = totalImportedKg - totalUsedKg;
  const alertEntries = importEntries.filter((e) => e.status !== 'ok');
  const activeAlertCount = alertEntries.length;

  return (
    <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLicense(null);
              setLicenseNoInput('');
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
          >
            <Icon name="sync_alt" className="text-[16px]" />
            {t.changeLicense}
          </button>
          <button type="button" onClick={onDone} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.backToDashboard}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Icon name="lock" className="mt-0.5 text-[18px] text-[#0A4D8C]" />
          <div>
            <p className="text-sm font-semibold text-[#0A4D8C]">{t.viewOnlyBadge}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#334155]">{t.viewOnlyNote}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-[#334155]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t.syncStatus}
          </span>
          <span className="text-[#94A3B8]">
            {t.lastSynced}: {lastSynced}
          </span>
          <button
            type="button"
            onClick={refreshSync}
            className="flex items-center gap-1 rounded-full border border-[#CBD5E1] bg-white px-2.5 py-1 font-semibold text-[#334155] hover:bg-[#F5F7FA]"
          >
            <Icon name="sync" className={`text-[14px] ${syncing ? 'animate-spin' : ''}`} />
            {t.refreshSync}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
            <Icon name="domain" className="text-[22px]" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#1E293B]">{license[language === 'en' ? 'nameEn' : 'nameBn']}</p>
            <p className="text-xs text-[#64748B]">
              {license.licenseNo} · {t.system}: {t.pageTitle} PB-{license.issueDate.split(' ').pop()}-{license.licenseNo.split('-').pop()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#1E293B]">${totalImportValue.toLocaleString()}</p>
          <p className="mt-0.5 text-xs font-medium text-[#64748B]">{t.totalImportValue}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#1E293B]">${totalExportValue.toLocaleString()}</p>
          <p className="mt-0.5 text-xs font-medium text-[#64748B]">{t.totalExportValue}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#1E293B]">{rawMaterialBalance.toLocaleString()} kg</p>
          <p className="mt-0.5 text-xs font-medium text-[#64748B]">{t.rawMaterialBalance}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#DC2626]">{activeAlertCount}</p>
          <p className="mt-0.5 text-xs font-medium text-[#64748B]">{t.activeAlerts}</p>
        </div>
      </div>

      {alertEntries.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-amber-800">
            <Icon name="warning" className="text-[18px]" />
            {t.bondingAlerts}
          </h3>
          <ul className="flex flex-col gap-1.5">
            {alertEntries.map((e) => (
              <li key={e.beNo} className="flex flex-wrap items-center gap-2 text-xs text-amber-900">
                <span className="font-semibold">{e.beNo}</span>
                <span>·</span>
                <span>{e.fabric[language]}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${e.status === 'expired' ? 'bg-red-100 text-[#DC2626]' : 'bg-amber-100 text-amber-800'}`}>
                  {e.status === 'expired' ? `${e.daysInfo} ${t.daysOverdue}` : `${e.daysInfo} ${t.daysRemaining}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-1 rounded-full bg-[#EEF2F6] p-1">
        {(['import', 'export'] as Tab[]).map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => setTab(tb)}
            className={[
              'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              tab === tb ? 'bg-white text-[#0A4D8C] shadow-sm' : 'text-[#64748B] hover:text-[#334155]',
            ].join(' ')}
          >
            {tb === 'import' ? t.importTab : t.exportTab}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          {tab === 'import' ? (
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">{t.beNoDate}</th>
                  <th className="px-4 py-3">{t.lcNoDate}</th>
                  <th className="px-4 py-3">{t.fabricDetails}</th>
                  <th className="px-4 py-3">{t.length}</th>
                  <th className="px-4 py-3">{t.totalFabric}</th>
                  <th className="px-4 py-3">{t.valueUsd}</th>
                  <th className="px-4 py-3">{t.bondingStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {importEntries.map((e) => (
                  <tr key={e.beNo} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#0A4D8C]">{e.beNo}</p>
                      <p className="text-[11px] text-[#94A3B8]">{e.beDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#334155]">{e.lcNo}</p>
                      <p className="text-[11px] text-[#94A3B8]">{e.lcDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#334155]">{e.fabric[language]}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[11px] text-[#94A3B8]">HS {e.hsCode}</span>
                        {e.hsFlag && (
                          <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            <Icon name="warning" className="text-[11px]" />
                            {t.hsCodeFlag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#334155]">{e.length}</td>
                    <td className="px-4 py-3 text-[#334155]">{e.totalFabric}</td>
                    <td className="px-4 py-3 font-medium text-[#1E293B]">${e.valueUsd.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span
                        className="flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ backgroundColor: `${statusStyle[e.status].color}1A`, color: statusStyle[e.status].color }}
                      >
                        <Icon name={statusStyle[e.status].icon} className="text-[13px]" />
                        {e.status === 'ok' ? t.withinPeriod : e.status === 'warning' ? t.nearingExpiry : t.expired}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">{t.boeNoDate}</th>
                  <th className="px-4 py-3">{t.qtyProduced}</th>
                  <th className="px-4 py-3">{t.fabricUsed}</th>
                  <th className="px-4 py-3">{t.exportValueUsd}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {exportEntries.map((e) => (
                  <tr key={e.boeNo}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#0A4D8C]">{e.boeNo}</p>
                      <p className="text-[11px] text-[#94A3B8]">{e.boeDate}</p>
                    </td>
                    <td className="px-4 py-3 text-[#334155]">
                      {e.qtyProduced} <span className="text-[#94A3B8]">({e.product[language]})</span>
                    </td>
                    <td className="px-4 py-3 text-[#334155]">{e.fabricUsed}</td>
                    <td className="px-4 py-3 font-medium text-[#1E293B]">${e.valueUsd.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] px-5 py-3.5">
          <h3 className="text-sm font-bold text-[#1E293B]">{t.notificationLog}</h3>
        </div>
        <ul className="divide-y divide-[#F1F5F9]">
          {notificationLog(language).map((n, i) => (
            <li key={i} className="flex gap-3 px-5 py-3">
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notifToneStyle[n.tone]}`}>
                <Icon name={n.icon} className="text-[17px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] leading-snug text-[#334155]">{n[language]}</p>
                <span className="text-[11px] text-[#94A3B8]">{n.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
