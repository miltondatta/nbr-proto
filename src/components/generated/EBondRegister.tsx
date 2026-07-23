import { useState } from 'react';
import { bondLicenses, BondLicense, licenseCategoryLabels } from './bondLicenseData';

type Language = 'en' | 'bn';
type Tab = 'in-bond' | 'ex-bond';
type AlertLevel = 'ok' | 'warning' | 'expired';
type InBondSource = 'asycuda' | 'local-purchase';
type ExBondSource = 'e-up' | 'local-sale' | 'supervised';

interface EBondRegisterProps {
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
    pageTitle: 'e-Bond Register',
    subtitle: 'Real-time, view-only In-Bond and Ex-Bond ledger for deemed exporters, synced from ASYCUDA World, e-UP, and approved Local Purchase & Sales / Ex-Bond entries.',
    backToDashboard: 'Back to Dashboard',
    licenseNoLabel: 'Bond License Number',
    verify: 'Verify',
    notFound: 'No license found with this number. Please check and try again.',
    lookupTitle: 'Look up a Bond License',
    lookupBody: 'Enter a bond license number to view its e-Bond Register.',
    changeLicense: 'Change License',
    viewOnlyBadge: 'View Only — synced from ASYCUDA World, e-UP & approved entries',
    viewOnlyNote: 'Bonders and CBC officials cannot edit this register directly. Corrections must be made in the source system (ASYCUDA / e-UP) or approved through Local Purchase & Sales / Ex-Bond Entry, and will reflect here automatically.',
    deemedOnlyNote: 'This license is categorised as {category}. The e-Bond Register applies to Deemed Exporters — Direct Exporters use e-Passbook instead. Showing register for reference.',
    syncStatus: 'Synced with ASYCUDA World',
    lastSynced: 'Last synced',
    refreshSync: 'Refresh Sync',
    totalDeclaredValue: 'Total Declared Value (In-Bond)',
    totalExportValue: 'Total Export Value (Ex-Bond)',
    remainingBalance: 'Remaining Raw Material',
    activeAlerts: 'Active Bonding Alerts',
    inBondTab: 'In Bond',
    exBondTab: 'Ex Bond',
    bondNoDate: 'Bond No. & Date',
    beNoDate: 'B/E No. & Date',
    material: 'Material',
    qtyWeight: 'Qty. & Weight',
    declaredValue: 'Declared Value',
    taxAmount: 'Tax Amount',
    source: 'Source',
    status: 'Status',
    details: 'Details',
    hide: 'Hide',
    shipRotationLine: 'Ship / Rotation / Line',
    codeOrigin: 'Code No. / Country of Origin',
    tariffExchange: 'Tariff Value / Exchange Rate',
    taxableAmount: 'Taxable Amount',
    bonder: 'Bonder',
    cfAgent: 'C&F Agent',
    cfFee: 'C&F Fee',
    licenseExpiry: 'License Expiry Date',
    withinPeriod: 'Within Period',
    nearingExpiry: 'Nearing Expiry',
    expired: 'Expired',
    upNoDate: 'UP No. & Date',
    buyingCompany: 'Buying Company',
    exportValue: 'Export Value',
    qtyProduced: 'Qty. Produced',
    qtyUsed: 'Qty. Used (incl. waste)',
    qtyRemaining: 'Qty. Remaining',
    bbLcNo: 'BB L/C No.',
    prcNo: 'PRC No.',
    exBondSerial: 'Linked Ex-Bond Serial',
    sourceLabels: {
      asycuda: 'ASYCUDA',
      'local-purchase': 'Local Purchase',
      'e-up': 'e-UP',
      'local-sale': 'Local Sale',
      supervised: 'Supervised Ex-Bond',
    },
    bondingAlerts: 'Bonding Period Alerts',
    daysRemaining: 'days remaining',
    daysOverdue: 'days overdue',
    notificationLog: 'Notification Log',
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ই-বন্ড রেজিস্টার',
    subtitle: 'পরোক্ষ রপ্তানিকারকদের জন্য রিয়েল-টাইম, শুধুমাত্র-দেখার-যোগ্য ইন-বন্ড ও এক্স-বন্ড রেজিস্টার, যা ASYCUDA World, e-UP এবং অনুমোদিত স্থানীয় ক্রয়-বিক্রয় / এক্স-বন্ড এন্ট্রি থেকে সিঙ্ককৃত।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    licenseNoLabel: 'বন্ড লাইসেন্স নম্বর',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বরে কোনো লাইসেন্স পাওয়া যায়নি। অনুগ্রহ করে যাচাই করে আবার চেষ্টা করুন।',
    lookupTitle: 'বন্ড লাইসেন্স অনুসন্ধান করুন',
    lookupBody: 'ই-বন্ড রেজিস্টার দেখতে একটি বন্ড লাইসেন্স নম্বর প্রবেশ করান।',
    changeLicense: 'লাইসেন্স পরিবর্তন',
    viewOnlyBadge: 'শুধুমাত্র দেখার যোগ্য — ASYCUDA World, e-UP ও অনুমোদিত এন্ট্রি থেকে সিঙ্ককৃত',
    viewOnlyNote: 'বন্ডকারী ও সিবিসি কর্মকর্তারা এই রেজিস্টার সরাসরি সম্পাদনা করতে পারবেন না। সংশোধন উৎস সিস্টেমে (ASYCUDA / e-UP) করতে হবে অথবা স্থানীয় ক্রয়-বিক্রয় / এক্স-বন্ড এন্ট্রির মাধ্যমে অনুমোদিত হতে হবে, এবং তা স্বয়ংক্রিয়ভাবে এখানে প্রতিফলিত হবে।',
    deemedOnlyNote: 'এই লাইসেন্সটি {category} শ্রেণীভুক্ত। ই-বন্ড রেজিস্টার পরোক্ষ রপ্তানিকারকদের জন্য প্রযোজ্য — প্রত্যক্ষ রপ্তানিকারকরা পরিবর্তে ই-পাসবুক ব্যবহার করেন। রেফারেন্সের জন্য রেজিস্টার দেখানো হচ্ছে।',
    syncStatus: 'ASYCUDA World-এর সাথে সিঙ্ককৃত',
    lastSynced: 'সর্বশেষ সিঙ্ক',
    refreshSync: 'সিঙ্ক রিফ্রেশ করুন',
    totalDeclaredValue: 'মোট ঘোষিত মূল্য (ইন-বন্ড)',
    totalExportValue: 'মোট রপ্তানি মূল্য (এক্স-বন্ড)',
    remainingBalance: 'অবশিষ্ট কাঁচামাল',
    activeAlerts: 'সক্রিয় বন্ডিং সতর্কতা',
    inBondTab: 'ইন বন্ড',
    exBondTab: 'এক্স বন্ড',
    bondNoDate: 'বন্ড নং ও তারিখ',
    beNoDate: 'বি/ই নং ও তারিখ',
    material: 'কাঁচামাল',
    qtyWeight: 'পরিমাণ ও ওজন',
    declaredValue: 'ঘোষিত মূল্য',
    taxAmount: 'কর পরিমাণ',
    source: 'উৎস',
    status: 'অবস্থা',
    details: 'বিস্তারিত',
    hide: 'লুকান',
    shipRotationLine: 'জাহাজ / রোটেশন / লাইন',
    codeOrigin: 'কোড নং / উৎস দেশ',
    tariffExchange: 'ট্যারিফ মূল্য / বিনিময় হার',
    taxableAmount: 'করযোগ্য পরিমাণ',
    bonder: 'বন্ডকারী',
    cfAgent: 'সি অ্যান্ড এফ এজেন্ট',
    cfFee: 'সি অ্যান্ড এফ ফি',
    licenseExpiry: 'লাইসেন্স মেয়াদ শেষের তারিখ',
    withinPeriod: 'মেয়াদের মধ্যে',
    nearingExpiry: 'মেয়াদ শেষের কাছাকাছি',
    expired: 'মেয়াদোত্তীর্ণ',
    upNoDate: 'ইউপি নং ও তারিখ',
    buyingCompany: 'ক্রয়কারী প্রতিষ্ঠান',
    exportValue: 'রপ্তানি মূল্য',
    qtyProduced: 'উৎপাদিত পরিমাণ',
    qtyUsed: 'ব্যবহৃত পরিমাণ (অপচয়সহ)',
    qtyRemaining: 'অবশিষ্ট পরিমাণ',
    bbLcNo: 'বিবি এলসি নং',
    prcNo: 'পিআরসি নং',
    exBondSerial: 'সংযুক্ত এক্স-বন্ড সিরিয়াল',
    sourceLabels: {
      asycuda: 'ASYCUDA',
      'local-purchase': 'স্থানীয় ক্রয়',
      'e-up': 'e-UP',
      'local-sale': 'স্থানীয় বিক্রয়',
      supervised: 'সুপারভাইজড এক্স-বন্ড',
    },
    bondingAlerts: 'বন্ডিং সময়কাল সতর্কতা',
    daysRemaining: 'দিন বাকি',
    daysOverdue: 'দিন অতিবাহিত',
    notificationLog: 'নোটিফিকেশন লগ',
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

interface InBondEntry {
  id: string;
  bondNo: string;
  bondDate: string;
  beNo: string;
  beDate: string;
  ship: string;
  rotationNo: string;
  lineNo: string;
  material: { en: string; bn: string };
  qty: string;
  codeNo: string;
  origin: { en: string; bn: string };
  declaredValueUsd: number;
  tariffRate: string;
  taxableAmountBdt: string;
  taxAmountBdt: string;
  cfAgent: string;
  cfFeeBdt: string;
  licenseExpiry: string;
  source: InBondSource;
  status: AlertLevel;
  daysInfo?: number;
}

interface ExBondEntry {
  id: string;
  upNo: string;
  upDate: string;
  buyer: string;
  exportValueUsd: number;
  bbLcNo: string;
  qtyProduced: string;
  qtyUsed: string;
  qtyRemaining: string;
  prcNo: string;
  exBondSerial?: string;
  source: ExBondSource;
}

const inBondEntries: InBondEntry[] = [
  {
    id: 'ib1', bondNo: 'BL-2023-02871', bondDate: '21 Jun 2023', beNo: 'C-91002', beDate: '04 Jun 2026',
    ship: 'MV Ever Given', rotationNo: '026W', lineNo: '12',
    material: { en: 'Grey Polyester Fabric', bn: 'গ্রে পলিয়েস্টার ফেব্রিক' }, qty: '15,200 m / 6,800 kg', codeNo: '5407.61.00',
    origin: { en: 'China', bn: 'চীন' }, declaredValueUsd: 34600, tariffRate: '1 USD = 118.50 BDT', taxableAmountBdt: '৳41,02,100', taxAmountBdt: '৳6,15,300',
    cfAgent: 'Meridian C&F Services', cfFeeBdt: '৳42,000', licenseExpiry: '20 Jun 2028', source: 'asycuda', status: 'ok',
  },
  {
    id: 'ib2', bondNo: 'BL-2023-02871', bondDate: '21 Jun 2023', beNo: 'C-91340', beDate: '12 Jun 2026',
    ship: 'MV Cosco Shipping', rotationNo: '031E', lineNo: '08',
    material: { en: 'Dyeing Chemicals', bn: 'ডাইং কেমিক্যালস' }, qty: '4,100 kg', codeNo: '3204.17.00',
    origin: { en: 'India', bn: 'ভারত' }, declaredValueUsd: 12900, tariffRate: '1 USD = 118.35 BDT', taxableAmountBdt: '৳15,26,715', taxAmountBdt: '৳2,28,900',
    cfAgent: 'Meridian C&F Services', cfFeeBdt: '৳18,500', licenseExpiry: '20 Jun 2028', source: 'asycuda', status: 'ok',
  },
  {
    id: 'ib3', bondNo: 'BL-2023-02871', bondDate: '21 Jun 2023', beNo: 'LP-2026-00214', beDate: '15 Jun 2026',
    ship: '—', rotationNo: '—', lineNo: '—',
    material: { en: 'Cotton Yarn (Local Purchase)', bn: 'কটন ইয়ার্ন (স্থানীয় ক্রয়)' }, qty: '2,300 kg', codeNo: '5205.24.00',
    origin: { en: 'Bangladesh', bn: 'বাংলাদেশ' }, declaredValueUsd: 9900, tariffRate: 'VAT Challan verified via iVAS', taxableAmountBdt: '৳11,50,000', taxAmountBdt: '৳1,72,500',
    cfAgent: '—', cfFeeBdt: '—', licenseExpiry: '20 Jun 2028', source: 'local-purchase', status: 'ok',
  },
  {
    id: 'ib4', bondNo: 'BL-2023-02871', bondDate: '21 Jun 2023', beNo: 'C-90188', beDate: '20 Feb 2026',
    ship: 'MV Maersk Sentosa', rotationNo: '014W', lineNo: '05',
    material: { en: 'Zippers & Trims', bn: 'জিপার ও ট্রিমস' }, qty: '850 kg', codeNo: '9607.11.00',
    origin: { en: 'Vietnam', bn: 'ভিয়েতনাম' }, declaredValueUsd: 5400, tariffRate: '1 USD = 117.80 BDT', taxableAmountBdt: '৳6,36,120', taxAmountBdt: '৳95,400',
    cfAgent: 'Orient Shipping Agency', cfFeeBdt: '৳9,200', licenseExpiry: '20 Jun 2028', source: 'asycuda', status: 'expired', daysInfo: 6,
  },
  {
    id: 'ib5', bondNo: 'BL-2023-02871', bondDate: '21 Jun 2023', beNo: 'C-91455', beDate: '18 Jun 2026',
    ship: 'MV OOCL Bangkok', rotationNo: '033E', lineNo: '19',
    material: { en: 'Elastic Tape', bn: 'ইলাস্টিক টেপ' }, qty: '1,200 kg', codeNo: '5806.20.00',
    origin: { en: 'China', bn: 'চীন' }, declaredValueUsd: 7800, tariffRate: '1 USD = 118.60 BDT', taxableAmountBdt: '৳9,25,080', taxAmountBdt: '৳1,38,700',
    cfAgent: 'Meridian C&F Services', cfFeeBdt: '৳11,400', licenseExpiry: '20 Jun 2028', source: 'asycuda', status: 'warning', daysInfo: 9,
  },
];

const exBondEntries: ExBondEntry[] = [
  {
    id: 'eb1', upNo: 'UP-2026-03312', upDate: '25 Jun 2026', buyer: 'H&M Hennes & Mauritz', exportValueUsd: 142000, bbLcNo: '0219826002210',
    qtyProduced: '38,000 pcs', qtyUsed: '8,200 kg', qtyRemaining: '600 kg', prcNo: 'PRC-2026-08841', source: 'e-up',
  },
  {
    id: 'eb2', upNo: 'UP-2026-03389', upDate: '05 Jul 2026', buyer: 'Zara (Inditex)', exportValueUsd: 98500, bbLcNo: '0219826002298',
    qtyProduced: '22,000 pcs', qtyUsed: '5,100 kg', qtyRemaining: '300 kg', prcNo: 'PRC-2026-08902', source: 'e-up',
  },
  {
    id: 'eb3', upNo: 'LS-2026-00098', upDate: '10 Jul 2026', buyer: 'Local Market — Finished Product Sale', exportValueUsd: 4360, bbLcNo: '—',
    qtyProduced: '—', qtyUsed: '—', qtyRemaining: '—', prcNo: '—', exBondSerial: 'EB-2026-1155', source: 'local-sale',
  },
  {
    id: 'eb4', upNo: 'SEB-2026-00045', upDate: '14 Jul 2026', buyer: 'Requisition approved by RO — Cotton Yarn released', exportValueUsd: 0, bbLcNo: '—',
    qtyProduced: '—', qtyUsed: '500 kg', qtyRemaining: '—', prcNo: '—', source: 'supervised',
  },
];

const statusStyle: Record<AlertLevel, { color: string; icon: string }> = {
  ok: { color: '#00A86B', icon: 'check_circle' },
  warning: { color: '#B45309', icon: 'warning' },
  expired: { color: '#DC2626', icon: 'error' },
};

const sourceColor: Record<string, string> = {
  asycuda: '#0A4D8C',
  'local-purchase': '#6D28D9',
  'e-up': '#00A86B',
  'local-sale': '#B45309',
  supervised: '#1E88E5',
};

function notificationLog(language: Language) {
  return [
    { icon: 'workspace_premium', tone: 'ok', en: 'e-Bond Register issued and linked to Bonder Profile.', bn: 'ই-বন্ড রেজিস্টার ইস্যু হয়ে বন্ডকারী প্রোফাইলে সংযুক্ত হয়েছে।', date: '21 Jun 2023' },
    { icon: 'call_received', tone: 'ok', en: 'In-Bond entry recorded — B/E No. C-91455.', bn: 'ইন-বন্ড এন্ট্রি রেকর্ড হয়েছে — বি/ই নং C-91455।', date: '18 Jun 2026' },
    { icon: 'fact_check', tone: 'ok', en: 'Local Purchase entry LP-2026-00214 verified via iVAS and approved.', bn: 'স্থানীয় ক্রয় এন্ট্রি LP-2026-00214 iVAS-এর মাধ্যমে যাচাই ও অনুমোদিত হয়েছে।', date: '15 Jun 2026' },
    { icon: 'schedule', tone: 'warning', en: 'Bonding period alert — B/E No. C-91455 nearing expiry (9 days remaining).', bn: 'বন্ডিং সময়কাল সতর্কতা — বি/ই নং C-91455-এর মেয়াদ শেষ হতে যাচ্ছে (৯ দিন বাকি)।', date: '14 Jul 2026' },
    { icon: 'error', tone: 'expired', en: 'Bonding period expired — B/E No. C-90188.', bn: 'বন্ডিং সময়কাল মেয়াদোত্তীর্ণ — বি/ই নং C-90188।', date: '14 Jul 2026' },
    { icon: 'call_made', tone: 'ok', en: 'Ex-Bond entry recorded — UP No. UP-2026-03389.', bn: 'এক্স-বন্ড এন্ট্রি রেকর্ড হয়েছে — ইউপি নং UP-2026-03389।', date: '05 Jul 2026' },
  ];
}

const notifToneStyle: Record<string, string> = {
  ok: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  expired: 'bg-red-50 text-[#DC2626]',
};

export function EBondRegister({ language, onDone }: EBondRegisterProps) {
  const t = T[language];
  const [licenseNoInput, setLicenseNoInput] = useState('');
  const [license, setLicense] = useState<BondLicense | null>(null);
  const [verifyError, setVerifyError] = useState(false);
  const [tab, setTab] = useState<Tab>('in-bond');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('23 Jul 2026, 09:55 AM');

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
            <Icon name="receipt_long" className="text-[28px]" />
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
                  placeholder="BL-2023-02871"
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

  const totalDeclaredValue = inBondEntries.reduce((s, e) => s + e.declaredValueUsd, 0);
  const totalExportValue = exBondEntries.reduce((s, e) => s + e.exportValueUsd, 0);
  const alertEntries = inBondEntries.filter((e) => e.status !== 'ok');
  const isDeemedExporter = license.category === 'deemed-exporter';

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

      {!isDeemedExporter && (
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-4 text-amber-800">
          <Icon name="info" className="mt-0.5 text-[18px]" />
          <p className="text-xs leading-relaxed">{t.deemedOnlyNote.replace('{category}', licenseCategoryLabels[license.category][language])}</p>
        </div>
      )}

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
          <button type="button" onClick={refreshSync} className="flex items-center gap-1 rounded-full border border-[#CBD5E1] bg-white px-2.5 py-1 font-semibold text-[#334155] hover:bg-[#F5F7FA]">
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
              {license.licenseNo} · {licenseCategoryLabels[license.category][language]}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#1E293B]">${totalDeclaredValue.toLocaleString()}</p>
          <p className="mt-0.5 text-xs font-medium text-[#64748B]">{t.totalDeclaredValue}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#1E293B]">${totalExportValue.toLocaleString()}</p>
          <p className="mt-0.5 text-xs font-medium text-[#64748B]">{t.totalExportValue}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#1E293B]">900 kg</p>
          <p className="mt-0.5 text-xs font-medium text-[#64748B]">{t.remainingBalance}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <p className="text-lg font-bold text-[#DC2626]">{alertEntries.length}</p>
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
              <li key={e.id} className="flex flex-wrap items-center gap-2 text-xs text-amber-900">
                <span className="font-semibold">{e.beNo}</span>
                <span>·</span>
                <span>{e.material[language]}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${e.status === 'expired' ? 'bg-red-100 text-[#DC2626]' : 'bg-amber-100 text-amber-800'}`}>
                  {e.status === 'expired' ? `${e.daysInfo} ${t.daysOverdue}` : `${e.daysInfo} ${t.daysRemaining}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-1 rounded-full bg-[#EEF2F6] p-1">
        {(['in-bond', 'ex-bond'] as Tab[]).map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => {
              setTab(tb);
              setExpandedId(null);
            }}
            className={['flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors', tab === tb ? 'bg-white text-[#0A4D8C] shadow-sm' : 'text-[#64748B] hover:text-[#334155]'].join(' ')}
          >
            {tb === 'in-bond' ? t.inBondTab : t.exBondTab}
          </button>
        ))}
      </div>

      {tab === 'in-bond' ? (
        <div className="flex flex-col gap-3">
          {inBondEntries.map((e) => {
            const isOpen = expandedId === e.id;
            return (
              <div key={e.id} className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                <button type="button" onClick={() => setExpandedId(isOpen ? null : e.id)} className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#0A4D8C]">{e.beNo}</span>
                      <span className="text-[11px] text-[#94A3B8]">{e.beDate}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${sourceColor[e.source]}1A`, color: sourceColor[e.source] }}>
                        {t.sourceLabels[e.source]}
                      </span>
                      <span
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: `${statusStyle[e.status].color}1A`, color: statusStyle[e.status].color }}
                      >
                        <Icon name={statusStyle[e.status].icon} className="text-[12px]" />
                        {e.status === 'ok' ? t.withinPeriod : e.status === 'warning' ? t.nearingExpiry : t.expired}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[#334155]">
                      {e.material[language]} · {e.qty}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1E293B]">${e.declaredValueUsd.toLocaleString()}</p>
                      <p className="text-[11px] text-[#94A3B8]">{t.declaredValue}</p>
                    </div>
                    <Icon name="expand_more" className={`text-[20px] text-[#94A3B8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[#F1F5F9] px-4 py-4 text-[12px] sm:grid-cols-3">
                      <div>
                        <dt className="text-[#94A3B8]">{t.bondNoDate}</dt>
                        <dd className="font-medium text-[#1E293B]">
                          {e.bondNo} · {e.bondDate}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.shipRotationLine}</dt>
                        <dd className="font-medium text-[#1E293B]">
                          {e.ship} / {e.rotationNo} / {e.lineNo}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.codeOrigin}</dt>
                        <dd className="font-medium text-[#1E293B]">
                          {e.codeNo} · {e.origin[language]}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.tariffExchange}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.tariffRate}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.taxableAmount}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.taxableAmountBdt}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.taxAmount}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.taxAmountBdt}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.bonder}</dt>
                        <dd className="font-medium text-[#1E293B]">{license[language === 'en' ? 'nameEn' : 'nameBn']}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.cfAgent}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.cfAgent}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.cfFee}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.cfFeeBdt}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.licenseExpiry}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.licenseExpiry}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {exBondEntries.map((e) => {
            const isOpen = expandedId === e.id;
            return (
              <div key={e.id} className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                <button type="button" onClick={() => setExpandedId(isOpen ? null : e.id)} className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#0A4D8C]">{e.upNo}</span>
                      <span className="text-[11px] text-[#94A3B8]">{e.upDate}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${sourceColor[e.source]}1A`, color: sourceColor[e.source] }}>
                        {t.sourceLabels[e.source]}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[#334155]">{e.buyer}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1E293B]">{e.exportValueUsd > 0 ? `$${e.exportValueUsd.toLocaleString()}` : '—'}</p>
                      <p className="text-[11px] text-[#94A3B8]">{t.exportValue}</p>
                    </div>
                    <Icon name="expand_more" className={`text-[20px] text-[#94A3B8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[#F1F5F9] px-4 py-4 text-[12px] sm:grid-cols-3">
                      <div>
                        <dt className="text-[#94A3B8]">{t.qtyProduced}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.qtyProduced}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.qtyUsed}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.qtyUsed}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.qtyRemaining}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.qtyRemaining}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.bbLcNo}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.bbLcNo}</dd>
                      </div>
                      <div>
                        <dt className="text-[#94A3B8]">{t.prcNo}</dt>
                        <dd className="font-medium text-[#1E293B]">{e.prcNo}</dd>
                      </div>
                      {e.exBondSerial && (
                        <div>
                          <dt className="text-[#94A3B8]">{t.exBondSerial}</dt>
                          <dd className="font-medium text-[#1E293B]">{e.exBondSerial}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
