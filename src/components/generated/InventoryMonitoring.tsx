import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { coefficientMatchFor, comparisonRecords as seedComparisons, idealUsageRecords as seedIdealUsage, inventoryProfiles as seedProfiles, ledgerEntries as seedLedger, licenseOf, sourceLabels, type ComparisonRecord, type IdealUsageRecord, type InventoryProfile, type LedgerEntry, type LedgerSource } from './inventoryData';
type Language = 'en' | 'bn';
interface InventoryMonitoringProps {
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
function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">{label}</span>
      {children}
    </label>;
}
function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />;
}
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
  source: LedgerSource;
  language: Language;
}) {
  const s = sourceLabels[source];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${s.color}1A`,
    color: s.color
  }}>
      {s[language]}
    </span>;
}
const today = new Date('2026-07-26T00:00:00');
function addMonths(dateStr: string, months: number): Date {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d;
}
function daysUntil(d: Date): number {
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}
function hashOffset(seed: string, base: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return Math.round(base * ((h % 21 - 10) / 1000));
}
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Bonder Inventory Monitoring',
    subtitle: 'System-maintained inventory profile per bonder, auto-updated from Bond Register/Passbook, local purchases and inter-bond transfers, with auto-calculated ideal usage/balance and a physical-count comparison report.',
    backToDashboard: 'Back to Dashboard',
    tabProfiles: 'Inventory Profiles',
    tabLedger: 'Inventory Ledger',
    tabUsageBalance: 'Ideal Usage & Balance',
    tabComparison: 'Comparison Report',
    bondersMonitored: 'Bonders Monitored',
    nearExpiry: 'HS Codes Near/Past Bonding Expiry',
    discrepancies: 'Flagged Discrepancies',
    pendingCalc: 'Ideal Usage Records Pending Calculation',
    simulateNewProfile: 'Simulate: New License Approved → Auto-Create Profile',
    profileCreatedNotice: 'Inventory profile auto-created and attached to Bonder Profile.',
    tableHeaders: {
      bonder: 'Bonder',
      hsCode: 'HS Code',
      type: 'Type',
      risk: 'Risk',
      bondingPeriod: 'Bonding Period',
      expiry: 'Expiry Status',
      onHand: 'On-Hand (Ledger Balance)',
      action: ''
    },
    rawMaterial: 'Raw Material',
    finishedGoods: 'Finished Goods',
    highRisk: 'High-Risk',
    standardRisk: 'Standard',
    months: 'months',
    expired: 'Expired',
    nearExpiryBadge: 'Near Expiry',
    ok: 'OK',
    notifyCbc: 'Notify CBC',
    notifiedNotice: 'Expiry notification sent to relevant CBC officials.',
    ledgerTitle: 'Inventory Ledger',
    filterBonder: 'Filter by Bonder',
    allBonders: 'All Bonders',
    ledgerHeaders: {
      date: 'Date',
      bonder: 'Bonder',
      hsCode: 'HS Code',
      source: 'Source',
      qty: 'Qty Change',
      reference: 'Reference'
    },
    simulateBeImport: 'Simulate B/E Import',
    simulateTransfer: 'Simulate Inter-Bond Transfer',
    addLocalPurchase: 'Add Local Purchase (Manual Entry)',
    addLocalPurchaseTitle: 'Local Purchase — Manual ARO/RO Entry',
    selectBonder: 'Bonder',
    hsCodeLabel: 'HS Code',
    qtyLabel: 'Quantity',
    unitCostLabel: 'Unit Cost (USD)',
    vatChalanLabel: 'VAT Chalan Reference',
    add: 'Add Entry',
    cancel: 'Cancel',
    entryAddedNotice: 'Local purchase recorded in Inventory Ledger.',
    usageBalanceTitle: 'Auto Calculation of Ideal Usage',
    usageHeaders: {
      egm: 'EGM No.',
      bonder: 'Bonder',
      finishedGoods: 'Finished Goods',
      exporterType: 'Exporter Type',
      status: 'Status'
    },
    direct: 'Direct Exporter',
    deemed: 'Deemed Exporter',
    calculated: 'Calculated',
    pendingCalculation: 'Pending Calculation',
    calculateUsage: 'Calculate Ideal Usage (Co-efficient + UD Integration)',
    calculatedNotice: 'Ideal usage calculated from Co-efficient Management and UD Integration data.',
    noCoefficientMatch: 'No matching co-efficient found — manual entry required.',
    linkedUd: 'Linked UD',
    linkedUp: 'Linked UP',
    balanceTitle: 'Auto Calculation of Ideal Inventory Balance',
    balanceHint: 'System Balance = total ledger quantity (B/E imports + local purchases ± inter-bond transfers) minus total ideal usage from all exports.',
    balanceHeaders: {
      bonder: 'Bonder',
      hsCode: 'HS Code',
      ledgerTotal: 'Ledger Total',
      idealUsageTotal: 'Ideal Usage Total',
      systemBalance: 'System Balance',
      crossCheck: 'Cross-Check',
      status: 'Status'
    },
    crossCheckPassbook: 'vs e-Passbook',
    crossCheckBondRegister: 'vs e-Bond Register',
    matched: 'Matched',
    discrepancy: 'Discrepancy',
    comparisonTitle: 'Inventory Balance Comparison Report',
    comparisonHint: 'Compares raw materials physically found at the bonded warehouse during audit/inspection against the system-calculated inventory balance.',
    recordCount: 'Record New Physical Count',
    recordCountTitle: 'Record Physical Count — Audit/Inspection',
    inspectionType: 'Inspection Type',
    inspectionAudit: 'Annual Audit',
    inspectionVisit: 'Ad-hoc Inspection',
    physicalQtyLabel: 'Physical Quantity Found',
    systemQtyPreview: 'Current System Balance',
    submitCount: 'Record Count',
    countRecordedNotice: 'Physical count recorded and compared against system balance.',
    comparisonHeaders: {
      date: 'Date',
      bonder: 'Bonder',
      type: 'Type',
      hsCode: 'HS Code',
      physical: 'Physical',
      system: 'System',
      variance: 'Variance'
    }
  },
  bn: {
    home: 'হোম',
    pageTitle: 'বন্ডকারী ইনভেন্টরি মনিটরিং',
    subtitle: 'প্রতিটি বন্ডকারীর জন্য সিস্টেম-রক্ষিত ইনভেন্টরি প্রোফাইল, বন্ড রেজিস্টার/পাসবুক, স্থানীয় ক্রয় ও আন্তঃ-বন্ড স্থানান্তর থেকে স্বয়ংক্রিয়ভাবে আপডেটকৃত, স্বয়ংক্রিয়ভাবে গণনাকৃত আদর্শ ব্যবহার/ব্যালেন্স এবং একটি ভৌত-গণনা তুলনা রিপোর্টসহ।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    tabProfiles: 'ইনভেন্টরি প্রোফাইল',
    tabLedger: 'ইনভেন্টরি লেজার',
    tabUsageBalance: 'আদর্শ ব্যবহার ও ব্যালেন্স',
    tabComparison: 'তুলনা রিপোর্ট',
    bondersMonitored: 'পর্যবেক্ষণাধীন বন্ডকারী',
    nearExpiry: 'বন্ডিং মেয়াদ শেষের কাছাকাছি/অতীত এইচএস কোড',
    discrepancies: 'চিহ্নিত অসঙ্গতি',
    pendingCalc: 'গণনার অপেক্ষায় আদর্শ ব্যবহার রেকর্ড',
    simulateNewProfile: 'সিমুলেট: নতুন লাইসেন্স অনুমোদিত → স্বয়ংক্রিয় প্রোফাইল তৈরি',
    profileCreatedNotice: 'ইনভেন্টরি প্রোফাইল স্বয়ংক্রিয়ভাবে তৈরি হয়েছে এবং বন্ডকারী প্রোফাইলে সংযুক্ত হয়েছে।',
    tableHeaders: {
      bonder: 'বন্ডকারী',
      hsCode: 'এইচএস কোড',
      type: 'ধরন',
      risk: 'ঝুঁকি',
      bondingPeriod: 'বন্ডিং সময়কাল',
      expiry: 'মেয়াদ অবস্থা',
      onHand: 'হাতে থাকা (লেজার ব্যালেন্স)',
      action: ''
    },
    rawMaterial: 'কাঁচামাল',
    finishedGoods: 'তৈরি পণ্য',
    highRisk: 'উচ্চ-ঝুঁকি',
    standardRisk: 'স্ট্যান্ডার্ড',
    months: 'মাস',
    expired: 'মেয়াদোত্তীর্ণ',
    nearExpiryBadge: 'মেয়াদ শেষের কাছাকাছি',
    ok: 'ঠিক আছে',
    notifyCbc: 'সিবিসি-কে অবহিত করুন',
    notifiedNotice: 'সংশ্লিষ্ট সিবিসি কর্মকর্তাদের মেয়াদ শেষের বিজ্ঞপ্তি পাঠানো হয়েছে।',
    ledgerTitle: 'ইনভেন্টরি লেজার',
    filterBonder: 'বন্ডকারী অনুযায়ী ফিল্টার',
    allBonders: 'সকল বন্ডকারী',
    ledgerHeaders: {
      date: 'তারিখ',
      bonder: 'বন্ডকারী',
      hsCode: 'এইচএস কোড',
      source: 'উৎস',
      qty: 'পরিমাণ পরিবর্তন',
      reference: 'রেফারেন্স'
    },
    simulateBeImport: 'বি/ই আমদানি সিমুলেট করুন',
    simulateTransfer: 'আন্তঃ-বন্ড স্থানান্তর সিমুলেট করুন',
    addLocalPurchase: 'স্থানীয় ক্রয় যোগ করুন (ম্যানুয়াল এন্ট্রি)',
    addLocalPurchaseTitle: 'স্থানীয় ক্রয় — ম্যানুয়াল আরও/এআরও এন্ট্রি',
    selectBonder: 'বন্ডকারী',
    hsCodeLabel: 'এইচএস কোড',
    qtyLabel: 'পরিমাণ',
    unitCostLabel: 'ইউনিট খরচ (USD)',
    vatChalanLabel: 'ভ্যাট চালান রেফারেন্স',
    add: 'এন্ট্রি যোগ করুন',
    cancel: 'বাতিল করুন',
    entryAddedNotice: 'স্থানীয় ক্রয় ইনভেন্টরি লেজারে রেকর্ড করা হয়েছে।',
    usageBalanceTitle: 'আদর্শ ব্যবহারের স্বয়ংক্রিয় গণনা',
    usageHeaders: {
      egm: 'ইজিএম নং',
      bonder: 'বন্ডকারী',
      finishedGoods: 'তৈরি পণ্য',
      exporterType: 'রপ্তানিকারকের ধরন',
      status: 'স্ট্যাটাস'
    },
    direct: 'সরাসরি রপ্তানিকারক',
    deemed: 'ডিমড রপ্তানিকারক',
    calculated: 'গণনাকৃত',
    pendingCalculation: 'গণনার অপেক্ষায়',
    calculateUsage: 'আদর্শ ব্যবহার গণনা করুন (কো-এফিসিয়েন্ট + ইউডি ইন্টিগ্রেশন)',
    calculatedNotice: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা ও ইউডি ইন্টিগ্রেশন ডেটা থেকে আদর্শ ব্যবহার গণনা করা হয়েছে।',
    noCoefficientMatch: 'কোনো মিলযুক্ত কো-এফিসিয়েন্ট পাওয়া যায়নি — ম্যানুয়াল এন্ট্রি প্রয়োজন।',
    linkedUd: 'সংযুক্ত ইউডি',
    linkedUp: 'সংযুক্ত ইউপি',
    balanceTitle: 'আদর্শ ইনভেন্টরি ব্যালেন্সের স্বয়ংক্রিয় গণনা',
    balanceHint: 'সিস্টেম ব্যালেন্স = মোট লেজার পরিমাণ (বি/ই আমদানি + স্থানীয় ক্রয় ± আন্তঃ-বন্ড স্থানান্তর) বিয়োগ সকল রপ্তানি থেকে মোট আদর্শ ব্যবহার।',
    balanceHeaders: {
      bonder: 'বন্ডকারী',
      hsCode: 'এইচএস কোড',
      ledgerTotal: 'লেজার মোট',
      idealUsageTotal: 'আদর্শ ব্যবহার মোট',
      systemBalance: 'সিস্টেম ব্যালেন্স',
      crossCheck: 'ক্রস-চেক',
      status: 'স্ট্যাটাস'
    },
    crossCheckPassbook: 'ই-পাসবুকের বিপরীতে',
    crossCheckBondRegister: 'ই-বন্ড রেজিস্টারের বিপরীতে',
    matched: 'মিলেছে',
    discrepancy: 'অসঙ্গতি',
    comparisonTitle: 'ইনভেন্টরি ব্যালেন্স তুলনা রিপোর্ট',
    comparisonHint: 'অডিট/পরিদর্শনের সময় বন্ডেড গুদামে ভৌতভাবে পাওয়া কাঁচামালের সাথে সিস্টেম-গণিত ইনভেন্টরি ব্যালেন্সের তুলনা করে।',
    recordCount: 'নতুন ভৌত গণনা রেকর্ড করুন',
    recordCountTitle: 'ভৌত গণনা রেকর্ড করুন — অডিট/পরিদর্শন',
    inspectionType: 'পরিদর্শনের ধরন',
    inspectionAudit: 'বার্ষিক নিরীক্ষা',
    inspectionVisit: 'অ্যাড-হক পরিদর্শন',
    physicalQtyLabel: 'পাওয়া ভৌত পরিমাণ',
    systemQtyPreview: 'বর্তমান সিস্টেম ব্যালেন্স',
    submitCount: 'গণনা রেকর্ড করুন',
    countRecordedNotice: 'ভৌত গণনা রেকর্ড করা হয়েছে এবং সিস্টেম ব্যালেন্সের সাথে তুলনা করা হয়েছে।',
    comparisonHeaders: {
      date: 'তারিখ',
      bonder: 'বন্ডকারী',
      type: 'ধরন',
      hsCode: 'এইচএস কোড',
      physical: 'ভৌত',
      system: 'সিস্টেম',
      variance: 'পার্থক্য'
    }
  }
};
type T = typeof T['en'];
export function InventoryMonitoring({
  language,
  onDone
}: InventoryMonitoringProps) {
  const t = T[language];
  const [tab, setTab] = useState<'profiles' | 'ledger' | 'usage-balance' | 'comparison'>('profiles');
  const [profiles, setProfiles] = useState<InventoryProfile[]>(seedProfiles);
  const [ledger, setLedger] = useState<LedgerEntry[]>(seedLedger);
  const [idealUsage, setIdealUsage] = useState<IdealUsageRecord[]>(seedIdealUsage);
  const [comparisons, setComparisons] = useState<ComparisonRecord[]>(seedComparisons);
  const [toast, setToast] = useState<string | null>(null);
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showRecordCount, setShowRecordCount] = useState(false);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const flatProfileLines = useMemo(() => profiles.flatMap(p => p.lines.map(l => ({
    profile: p,
    line: l
  }))), [profiles]);
  const ledgerBalance = (licenseNo: string, hsCode: string) => ledger.filter(e => e.licenseNo === licenseNo && e.hsCode === hsCode).reduce((sum, e) => sum + e.qtyChange, 0);
  const idealUsageTotal = (licenseNo: string, hsCode: string) => idealUsage.filter(r => r.licenseNo === licenseNo && r.calculated).flatMap(r => r.idealUsageLines).filter(l => l.hsCode === hsCode).reduce((sum, l) => sum + l.idealQty, 0);
  const rawMaterialLines = useMemo(() => flatProfileLines.filter(f => f.line.type === 'raw-material'), [flatProfileLines]);
  const counts = useMemo(() => {
    const nearExpiryCount = flatProfileLines.filter(f => {
      const expiry = addMonths(f.profile.createdDate, f.line.bondingPeriodMonths);
      return daysUntil(expiry) <= 60;
    }).length;
    const balanceRows = rawMaterialLines.map(f => {
      const systemBalance = ledgerBalance(f.profile.licenseNo, f.line.hsCode) - idealUsageTotal(f.profile.licenseNo, f.line.hsCode);
      const offset = hashOffset(f.profile.licenseNo + f.line.hsCode, systemBalance);
      const crossCheckValue = systemBalance + offset;
      const variancePct = systemBalance === 0 ? 0 : Math.abs(offset / systemBalance) * 100;
      return variancePct > 1;
    });
    return {
      bonders: profiles.length,
      nearExpiry: nearExpiryCount,
      discrepancies: balanceRows.filter(Boolean).length + comparisons.flatMap(c => c.lines).filter(l => Math.abs(l.physicalQty - l.systemQty) / l.systemQty * 100 > 1).length,
      pendingCalc: idealUsage.filter(r => !r.calculated).length
    };
  }, [flatProfileLines, rawMaterialLines, profiles, idealUsage, comparisons]);
  const handleSimulateProfile = () => {
    const unprofiled = bondLicenses.find(l => !profiles.some(p => p.licenseNo === l.licenseNo));
    if (!unprofiled) return;
    setProfiles(prev => [...prev, {
      licenseNo: unprofiled.licenseNo,
      createdDate: '26 Jul 2026',
      lines: [{
        hsCode: '5208.52.00',
        descEn: 'Woven Cotton Fabric',
        descBn: 'বোনা তুলা কাপড়',
        type: 'raw-material',
        risk: 'standard',
        bondingPeriodMonths: 18,
        unit: 'kg'
      }]
    }]);
    showToast(t.profileCreatedNotice);
  };
  const handleSimulateBe = () => {
    const p = profiles[Math.floor(Math.random() * profiles.length)];
    const line = p.lines.find(l => l.type === 'raw-material') ?? p.lines[0];
    setLedger(prev => [{
      id: `LED-2026-${1000 + prev.length}`,
      licenseNo: p.licenseNo,
      hsCode: line.hsCode,
      date: '26 Jul 2026',
      source: 'be-import',
      qtyChange: 5000 + Math.floor(Math.random() * 4000),
      unit: line.unit,
      unitCostUsd: 3.1,
      reference: `B/E-2026-${120000 + prev.length}`
    }, ...prev]);
    showToast(t.entryAddedNotice);
  };
  const handleSimulateTransfer = () => {
    const p = profiles[Math.floor(Math.random() * profiles.length)];
    const line = p.lines.find(l => l.type === 'raw-material') ?? p.lines[0];
    setLedger(prev => [{
      id: `LED-2026-${2000 + prev.length}`,
      licenseNo: p.licenseNo,
      hsCode: line.hsCode,
      date: '26 Jul 2026',
      source: 'inter-bond-transfer',
      qtyChange: -(500 + Math.floor(Math.random() * 1000)),
      unit: line.unit,
      reference: `IBT-2026-${100 + prev.length}`
    }, ...prev]);
    showToast(t.entryAddedNotice);
  };
  const handleCalculateUsage = (record: IdealUsageRecord) => {
    const match = coefficientMatchFor(record.finishedGoodsHsCode);
    const lines = match ? match.rawMaterials.map(rm => {
      const numeric = parseFloat(rm.perUnitQty);
      return {
        hsCode: rm.hsCode,
        descEn: rm.descEn,
        descBn: rm.descBn,
        idealQty: Number.isFinite(numeric) ? Math.round(numeric * record.finishedGoodsQtyDozen) : 0,
        unit: 'kg'
      };
    }) : [];
    setIdealUsage(prev => prev.map(r => r.id === record.id ? {
      ...r,
      calculated: true,
      idealUsageLines: lines
    } : r));
    showToast(t.calculatedNotice);
  };
  return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
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
        <StatCard icon="inventory_2" label={t.bondersMonitored} value={counts.bonders} color="#0A4D8C" />
        <StatCard icon="event_busy" label={t.nearExpiry} value={counts.nearExpiry} color="#B45309" />
        <StatCard icon="report" label={t.discrepancies} value={counts.discrepancies} color="#DC2626" />
        <StatCard icon="calculate" label={t.pendingCalc} value={counts.pendingCalc} color="#1E88E5" />
      </div>

      <div className="flex w-fit flex-wrap rounded-full border border-[#CBD5E1] bg-white p-1">
        {(['profiles', 'ledger', 'usage-balance', 'comparison'] as const).map(v => <button key={v} type="button" onClick={() => setTab(v)} className={['rounded-full px-4 py-2 text-xs font-semibold transition-colors', tab === v ? 'bg-[#0A4D8C] text-white' : 'text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
            {v === 'profiles' ? t.tabProfiles : v === 'ledger' ? t.tabLedger : v === 'usage-balance' ? t.tabUsageBalance : t.tabComparison}
          </button>)}
      </div>

      {tab === 'profiles' && <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <button type="button" onClick={handleSimulateProfile} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
              <Icon name="bolt" className="text-[16px]" />
              {t.simulateNewProfile}
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
                  <th className="px-4 py-3">{t.tableHeaders.hsCode}</th>
                  <th className="px-4 py-3">{t.tableHeaders.type}</th>
                  <th className="px-4 py-3">{t.tableHeaders.risk}</th>
                  <th className="px-4 py-3">{t.tableHeaders.bondingPeriod}</th>
                  <th className="px-4 py-3">{t.tableHeaders.expiry}</th>
                  <th className="px-4 py-3">{t.tableHeaders.onHand}</th>
                  <th className="px-4 py-3">{t.tableHeaders.action}</th>
                </tr>
              </thead>
              <tbody>
                {flatProfileLines.map(({
                profile,
                line
              }) => {
                const lic = licenseOf(profile.licenseNo);
                const expiry = addMonths(profile.createdDate, line.bondingPeriodMonths);
                const days = daysUntil(expiry);
                const status = days < 0 ? 'expired' : days <= 60 ? 'near' : 'ok';
                const balance = line.type === 'raw-material' ? ledgerBalance(profile.licenseNo, line.hsCode) - idealUsageTotal(profile.licenseNo, line.hsCode) : null;
                return <tr key={profile.licenseNo + line.hsCode} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                        <p className="text-[11px] text-[#94A3B8]">{profile.licenseNo}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#0A4D8C]">{line.hsCode}</p>
                        <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? line.descEn : line.descBn}</p>
                      </td>
                      <td className="px-4 py-3 text-[#334155]">{line.type === 'raw-material' ? t.rawMaterial : t.finishedGoods}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${line.risk === 'high' ? 'bg-red-50 text-[#DC2626]' : 'bg-[#F1F5F9] text-[#334155]'}`}>{line.risk === 'high' ? t.highRisk : t.standardRisk}</span>
                      </td>
                      <td className="px-4 py-3 text-[#334155]">{line.bondingPeriodMonths} {t.months}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status === 'expired' ? 'bg-red-50 text-[#DC2626]' : status === 'near' ? 'bg-amber-50 text-[#B45309]' : 'bg-emerald-50 text-[#00A86B]'}`}>
                          {status === 'expired' ? t.expired : status === 'near' ? t.nearExpiryBadge : t.ok}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#334155]">{balance !== null ? `${balance.toLocaleString()} ${line.unit}` : '—'}</td>
                      <td className="px-4 py-3">
                        {status !== 'ok' && <button type="button" onClick={() => showToast(t.notifiedNotice)} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-[#B45309] hover:bg-amber-100">
                            {t.notifyCbc}
                          </button>}
                      </td>
                    </tr>;
              })}
              </tbody>
            </table>
          </div>
        </div>}

      {tab === 'ledger' && <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <select value={ledgerFilter} onChange={e => setLedgerFilter(e.target.value)} className={`${inputClass} sm:w-64`}>
              <option value="all">{t.allBonders}</option>
              {profiles.map(p => <option key={p.licenseNo} value={p.licenseNo}>{licenseOf(p.licenseNo)?.nameEn}</option>)}
            </select>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleSimulateBe} className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                <Icon name="local_shipping" className="text-[15px]" />
                {t.simulateBeImport}
              </button>
              <button type="button" onClick={handleSimulateTransfer} className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                <Icon name="swap_horiz" className="text-[15px]" />
                {t.simulateTransfer}
              </button>
              <button type="button" onClick={() => setShowAddPurchase(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                <Icon name="add" className="text-[15px]" />
                {t.addLocalPurchase}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">{t.ledgerHeaders.date}</th>
                  <th className="px-4 py-3">{t.ledgerHeaders.bonder}</th>
                  <th className="px-4 py-3">{t.ledgerHeaders.hsCode}</th>
                  <th className="px-4 py-3">{t.ledgerHeaders.source}</th>
                  <th className="px-4 py-3">{t.ledgerHeaders.qty}</th>
                  <th className="px-4 py-3">{t.ledgerHeaders.reference}</th>
                </tr>
              </thead>
              <tbody>
                {ledger.filter(e => ledgerFilter === 'all' || e.licenseNo === ledgerFilter).map(e => {
                const lic = licenseOf(e.licenseNo);
                return <tr key={e.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 text-[#334155]">{e.date}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                        <p className="text-[11px] text-[#94A3B8]">{e.licenseNo}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{e.hsCode}</td>
                      <td className="px-4 py-3"><SourceBadge source={e.source} language={language} /></td>
                      <td className={`px-4 py-3 font-semibold ${e.qtyChange < 0 ? 'text-[#DC2626]' : 'text-[#00A86B]'}`}>{e.qtyChange > 0 ? '+' : ''}{e.qtyChange.toLocaleString()} {e.unit}</td>
                      <td className="px-4 py-3 text-[12px] text-[#64748B]">{e.reference}{e.note && <p className="italic text-[#94A3B8]">{e.note}</p>}</td>
                    </tr>;
              })}
              </tbody>
            </table>
          </div>
        </div>}

      {tab === 'usage-balance' && <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-[#1E293B]">{t.usageBalanceTitle}</h2>
            <div className="flex flex-col gap-2">
              {idealUsage.map(r => {
              const lic = licenseOf(r.licenseNo);
              const match = coefficientMatchFor(r.finishedGoodsHsCode);
              return <div key={r.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-bold text-[#0A4D8C]">{r.egmNo} · {lic?.nameEn}</p>
                        <p className="text-[12px] text-[#64748B]">{r.finishedGoodsHsCode} — {language === 'en' ? r.finishedGoodsDescEn : r.finishedGoodsDescBn} · {r.finishedGoodsQtyDozen.toLocaleString()} dozen</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#EAF3FE] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C]">{r.exporterType === 'direct' ? t.direct : t.deemed}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.calculated ? 'bg-emerald-50 text-[#00A86B]' : 'bg-amber-50 text-[#B45309]'}`}>{r.calculated ? t.calculated : t.pendingCalculation}</span>
                      </div>
                    </div>
                    {(r.linkedUdNo || r.linkedUpId) && <p className="mt-1 text-[11px] text-[#94A3B8]">{r.linkedUdNo && `${t.linkedUd}: ${r.linkedUdNo}`}{r.linkedUdNo && r.linkedUpId && ' · '}{r.linkedUpId && `${t.linkedUp}: ${r.linkedUpId}`}</p>}
                    {r.calculated ? <div className="mt-2 flex flex-col gap-1">
                        {r.idealUsageLines.map(l => <p key={l.hsCode} className="text-[13px] text-[#334155]">{l.hsCode} — {language === 'en' ? l.descEn : l.descBn}: <span className="font-semibold text-[#0A4D8C]">{l.idealQty.toLocaleString()} {l.unit}</span></p>)}
                      </div> : <button type="button" onClick={() => handleCalculateUsage(r)} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                        <Icon name="calculate" className="text-[14px]" />
                        {t.calculateUsage}
                      </button>}
                    {!r.calculated && !match && <p className="mt-1 text-[11px] text-[#B45309]">{t.noCoefficientMatch}</p>}
                  </div>;
            })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-[#1E293B]">{t.balanceTitle}</h2>
            <p className="text-[12px] text-[#64748B]">{t.balanceHint}</p>
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                    <th className="px-4 py-3">{t.balanceHeaders.bonder}</th>
                    <th className="px-4 py-3">{t.balanceHeaders.hsCode}</th>
                    <th className="px-4 py-3">{t.balanceHeaders.ledgerTotal}</th>
                    <th className="px-4 py-3">{t.balanceHeaders.idealUsageTotal}</th>
                    <th className="px-4 py-3">{t.balanceHeaders.systemBalance}</th>
                    <th className="px-4 py-3">{t.balanceHeaders.crossCheck}</th>
                    <th className="px-4 py-3">{t.balanceHeaders.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterialLines.map(({
                  profile,
                  line
                }) => {
                  const lic = licenseOf(profile.licenseNo);
                  const exporterType = lic?.category === 'deemed-exporter' ? 'deemed' : 'direct';
                  const ledgerTotal = ledgerBalance(profile.licenseNo, line.hsCode);
                  const usageTotal = idealUsageTotal(profile.licenseNo, line.hsCode);
                  const systemBalance = ledgerTotal - usageTotal;
                  const offset = hashOffset(profile.licenseNo + line.hsCode, systemBalance);
                  const crossCheckValue = systemBalance + offset;
                  const variancePct = systemBalance === 0 ? 0 : Math.abs(offset / systemBalance) * 100;
                  const status = variancePct > 1 ? 'discrepancy' : 'matched';
                  return <tr key={profile.licenseNo + line.hsCode} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                          <p className="text-[11px] text-[#94A3B8]">{profile.licenseNo}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{line.hsCode}</td>
                        <td className="px-4 py-3 text-[#334155]">{ledgerTotal.toLocaleString()} {line.unit}</td>
                        <td className="px-4 py-3 text-[#334155]">{usageTotal.toLocaleString()} {line.unit}</td>
                        <td className="px-4 py-3 font-semibold text-[#1E293B]">{systemBalance.toLocaleString()} {line.unit}</td>
                        <td className="px-4 py-3 text-[12px] text-[#64748B]">{crossCheckValue.toLocaleString()} {line.unit} <span className="text-[11px] text-[#94A3B8]">({exporterType === 'direct' ? t.crossCheckPassbook : t.crossCheckBondRegister})</span></td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status === 'matched' ? 'bg-emerald-50 text-[#00A86B]' : 'bg-red-50 text-[#DC2626]'}`}>{status === 'matched' ? t.matched : t.discrepancy}</span>
                        </td>
                      </tr>;
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>}

      {tab === 'comparison' && <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="max-w-2xl text-[13px] text-[#64748B]">{t.comparisonHint}</p>
            <button type="button" onClick={() => setShowRecordCount(true)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
              <Icon name="fact_check" className="text-[16px]" />
              {t.recordCount}
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">{t.comparisonHeaders.date}</th>
                  <th className="px-4 py-3">{t.comparisonHeaders.bonder}</th>
                  <th className="px-4 py-3">{t.comparisonHeaders.type}</th>
                  <th className="px-4 py-3">{t.comparisonHeaders.hsCode}</th>
                  <th className="px-4 py-3">{t.comparisonHeaders.physical}</th>
                  <th className="px-4 py-3">{t.comparisonHeaders.system}</th>
                  <th className="px-4 py-3">{t.comparisonHeaders.variance}</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.flatMap(c => c.lines.map(l => ({
                c,
                l
              }))).map(({
                c,
                l
              }) => {
                const lic = licenseOf(c.licenseNo);
                const variancePct = Math.abs(l.physicalQty - l.systemQty) / l.systemQty * 100;
                return <tr key={c.id + l.hsCode} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 text-[#334155]">{c.inspectionDate}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                        <p className="text-[11px] text-[#94A3B8]">{c.licenseNo}</p>
                      </td>
                      <td className="px-4 py-3 text-[#334155]">{c.inspectionType === 'audit' ? t.inspectionAudit : t.inspectionVisit}</td>
                      <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{l.hsCode}</td>
                      <td className="px-4 py-3 text-[#334155]">{l.physicalQty.toLocaleString()} {l.unit}</td>
                      <td className="px-4 py-3 text-[#334155]">{l.systemQty.toLocaleString()} {l.unit}</td>
                      <td className={`px-4 py-3 font-semibold ${variancePct > 1 ? 'text-[#DC2626]' : 'text-[#00A86B]'}`}>{variancePct.toFixed(1)}%</td>
                    </tr>;
              })}
              </tbody>
            </table>
          </div>
        </div>}

      {showAddPurchase && <AddLocalPurchaseModal language={language} t={t} profiles={profiles} onCancel={() => setShowAddPurchase(false)} onSubmit={entry => {
      setLedger(prev => [entry, ...prev]);
      setShowAddPurchase(false);
      showToast(t.entryAddedNotice);
    }} />}

      {showRecordCount && <RecordCountModal language={language} t={t} profiles={profiles} ledgerBalance={ledgerBalance} idealUsageTotal={idealUsageTotal} onCancel={() => setShowRecordCount(false)} onSubmit={record => {
      setComparisons(prev => [record, ...prev]);
      setShowRecordCount(false);
      showToast(t.countRecordedNotice);
    }} />}
    </div>;
}
function AddLocalPurchaseModal({
  language,
  t,
  profiles,
  onCancel,
  onSubmit
}: {
  language: Language;
  t: T;
  profiles: InventoryProfile[];
  onCancel: () => void;
  onSubmit: (entry: LedgerEntry) => void;
}) {
  const [licenseNo, setLicenseNo] = useState(profiles[0]?.licenseNo ?? '');
  const [hsCode, setHsCode] = useState('');
  const [qty, setQty] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [vatRef, setVatRef] = useState('');
  const rawLines = profiles.find(p => p.licenseNo === licenseNo)?.lines.filter(l => l.type === 'raw-material') ?? [];
  const canSubmit = licenseNo && hsCode && qty.trim() && vatRef.trim();
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onCancel}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1E293B]">{t.addLocalPurchaseTitle}</h2>
          <button type="button" onClick={onCancel} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Field label={t.selectBonder}>
            <select value={licenseNo} onChange={e => {
            setLicenseNo(e.target.value);
            setHsCode('');
          }} className={inputClass}>
              {profiles.map(p => <option key={p.licenseNo} value={p.licenseNo}>{licenseOf(p.licenseNo)?.nameEn}</option>)}
            </select>
          </Field>
          <Field label={t.hsCodeLabel}>
            <select value={hsCode} onChange={e => setHsCode(e.target.value)} className={inputClass}>
              <option value="">—</option>
              {rawLines.map(l => <option key={l.hsCode} value={l.hsCode}>{l.hsCode} — {language === 'en' ? l.descEn : l.descBn}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t.qtyLabel}>
              <TextInput value={qty} onChange={setQty} type="number" />
            </Field>
            <Field label={t.unitCostLabel}>
              <TextInput value={unitCost} onChange={setUnitCost} type="number" />
            </Field>
          </div>
          <Field label={t.vatChalanLabel}>
            <TextInput value={vatRef} onChange={setVatRef} placeholder="VAT-CHALAN-000000" />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
              {t.cancel}
            </button>
            <button type="button" disabled={!canSubmit} onClick={() => {
            const line = rawLines.find(l => l.hsCode === hsCode);
            onSubmit({
              id: `LED-2026-${3000 + Math.floor(Math.random() * 900)}`,
              licenseNo,
              hsCode,
              date: '26 Jul 2026',
              source: 'local-purchase-manual',
              qtyChange: Number(qty) || 0,
              unit: line?.unit ?? 'kg',
              unitCostUsd: Number(unitCost) || undefined,
              reference: vatRef.trim()
            });
          }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.add}
            </button>
          </div>
        </div>
      </div>
    </div>;
}
function RecordCountModal({
  language,
  t,
  profiles,
  ledgerBalance,
  idealUsageTotal,
  onCancel,
  onSubmit
}: {
  language: Language;
  t: T;
  profiles: InventoryProfile[];
  ledgerBalance: (licenseNo: string, hsCode: string) => number;
  idealUsageTotal: (licenseNo: string, hsCode: string) => number;
  onCancel: () => void;
  onSubmit: (record: ComparisonRecord) => void;
}) {
  const [licenseNo, setLicenseNo] = useState(profiles[0]?.licenseNo ?? '');
  const [hsCode, setHsCode] = useState('');
  const [inspectionType, setInspectionType] = useState<'audit' | 'inspection'>('inspection');
  const [physicalQty, setPhysicalQty] = useState('');
  const rawLines = profiles.find(p => p.licenseNo === licenseNo)?.lines.filter(l => l.type === 'raw-material') ?? [];
  const selectedLine = rawLines.find(l => l.hsCode === hsCode);
  const systemQty = selectedLine ? ledgerBalance(licenseNo, hsCode) - idealUsageTotal(licenseNo, hsCode) : 0;
  const canSubmit = licenseNo && hsCode && physicalQty.trim();
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onCancel}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1E293B]">{t.recordCountTitle}</h2>
          <button type="button" onClick={onCancel} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Field label={t.selectBonder}>
            <select value={licenseNo} onChange={e => {
            setLicenseNo(e.target.value);
            setHsCode('');
          }} className={inputClass}>
              {profiles.map(p => <option key={p.licenseNo} value={p.licenseNo}>{licenseOf(p.licenseNo)?.nameEn}</option>)}
            </select>
          </Field>
          <Field label={t.hsCodeLabel}>
            <select value={hsCode} onChange={e => setHsCode(e.target.value)} className={inputClass}>
              <option value="">—</option>
              {rawLines.map(l => <option key={l.hsCode} value={l.hsCode}>{l.hsCode} — {language === 'en' ? l.descEn : l.descBn}</option>)}
            </select>
          </Field>
          <Field label={t.inspectionType}>
            <select value={inspectionType} onChange={e => setInspectionType(e.target.value as any)} className={inputClass}>
              <option value="inspection">{t.inspectionVisit}</option>
              <option value="audit">{t.inspectionAudit}</option>
            </select>
          </Field>
          {selectedLine && <p className="text-[12px] text-[#64748B]">{t.systemQtyPreview}: <span className="font-semibold text-[#0A4D8C]">{systemQty.toLocaleString()} {selectedLine.unit}</span></p>}
          <Field label={t.physicalQtyLabel}>
            <TextInput value={physicalQty} onChange={setPhysicalQty} type="number" />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
              {t.cancel}
            </button>
            <button type="button" disabled={!canSubmit} onClick={() => {
            if (!selectedLine) return;
            onSubmit({
              id: `CMP-2026-${100 + Math.floor(Math.random() * 900)}`,
              licenseNo,
              inspectionDate: '26 Jul 2026',
              inspectionType,
              lines: [{
                hsCode,
                descEn: selectedLine.descEn,
                descBn: selectedLine.descBn,
                physicalQty: Number(physicalQty) || 0,
                systemQty,
                unit: selectedLine.unit
              }]
            });
          }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.submitCount}
            </button>
          </div>
        </div>
      </div>
    </div>;
}
