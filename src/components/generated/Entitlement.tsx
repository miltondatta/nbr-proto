import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { entitlementRecords as seedEntitlements, inclusionRequests as seedInclusions, inclusionStageLabels, licenseOf, triggerLabels, type EntitlementRecord, type InclusionRequest, type InclusionStage } from './entitlementData';
type Language = 'en' | 'bn';
interface EntitlementProps {
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
const errorInputClass = 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20';
function Field({
  label,
  required,
  children,
  error
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
      {error && <span className="text-[11px] font-medium text-[#DC2626]">{error}</span>}
    </label>;
}
function TextInput({
  value,
  onChange,
  placeholder,
  error,
  type = 'text'
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  type?: string;
}) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${inputClass} ${error ? errorInputClass : ''}`} />;
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
function TriggerBadge({
  trigger,
  language
}: {
  trigger: EntitlementRecord['trigger'];
  language: Language;
}) {
  const s = triggerLabels[trigger];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${s.color}1A`,
    color: s.color
  }}>
      {s[language]}
    </span>;
}
function StageBadge({
  stage,
  language
}: {
  stage: InclusionStage;
  language: Language;
}) {
  const color = stage === 'issued' ? '#00A86B' : stage === 'disapproved' ? '#DC2626' : '#B45309';
  const s = inclusionStageLabels[stage];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${color}1A`,
    color
  }}>
      {s[language]}
    </span>;
}
const normalizeLicenseNo = (s: string) => s.trim().toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, '');
const officerPool = [{
  en: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
  bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)'
}, {
  en: 'Sharmin Akter (ARO, Gazipur Zone)',
  bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)'
}, {
  en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)',
  bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)'
}];
const documentDefs = [{
  id: 'salesContract',
  en: 'Sales Contract / Buyer Purchase Order',
  bn: 'বিক্রয় চুক্তি / ক্রেতার ক্রয় আদেশ'
}, {
  id: 'productionPlan',
  en: 'Revised Production Plan',
  bn: 'সংশোধিত উৎপাদন পরিকল্পনা'
}, {
  id: 'stockStatement',
  en: 'Current Raw Material Stock Statement',
  bn: 'বর্তমান কাঁচামাল মজুদ বিবরণী'
}];
const stageOrder: InclusionStage[] = ['submitted', 'assignment', 'ro-verification', 'commissioner-approval', 'issued'];
const today = new Date('2026-07-26T00:00:00');
function isWindowOpen(dateStr: string): boolean {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() >= today.getTime();
}
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Entitlement Management',
    subtitle: 'Annual raw-material entitlement is auto-issued on Bond License approval and after Annual Audit approval, and can be topped up mid-year through an Inclusion/Addition request reviewed by RO/ARO and the Commissioner.',
    backToDashboard: 'Back to Dashboard',
    tabDashboard: 'Dashboard',
    tabQueue: 'Inclusion Requests',
    newRequest: 'New Inclusion / Addition Request',
    totalActive: 'Active Entitlements',
    viaLicense: 'Via License Approval',
    viaAudit: 'Via Audit Approval',
    pendingInclusion: 'Pending Inclusion Requests',
    simulatorTitle: 'Auto-Issuance Simulator',
    simulatorHint: 'System-triggered issuance — demonstrates the automatic calculation described in Annex-II §1.14.',
    simulateLicense: 'Simulate: New License Approved',
    simulateAudit: 'Simulate: Audit Approved',
    simulatedNotice: 'e-Annual Entitlement issued and attached to Bonder Profile. Bonder & Relevant Stakeholders notified.',
    entitlementListTitle: 'Issued Entitlements',
    tableHeaders: {
      id: 'Entitlement ID',
      bonder: 'Bonder',
      trigger: 'Trigger',
      items: 'HS Codes',
      value: 'Total Value (USD)',
      status: 'Status',
      action: ''
    },
    view: 'View',
    active: 'Active',
    superseded: 'Superseded',
    inclusionQueueTitle: 'Inclusion / Addition Requests',
    noRequests: 'No inclusion requests found.',
    review: 'Review',
    detailTitle: 'Entitlement Detail',
    close: 'Close',
    licenseNo: 'Bond License No.',
    bin: 'BIN',
    issueDate: 'Issue Date',
    calculationBasis: 'Calculation Basis',
    editWindow: 'Manual-Edit Window Expiry',
    editOpen: 'Open — Commissioner may still adjust',
    editClosed: 'Closed — amount is final',
    itemsTitle: 'Entitled Raw Materials (by HS Code)',
    overrideTitle: 'Commissioner Override',
    overrideApplied: 'Override applied',
    overrideNoteLabel: 'Override Note',
    applyOverride: 'Apply Override',
    overrideAmountLabel: 'Adjust Total Value (USD)',
    overrideReasonLabel: 'Reason for Override',
    overrideRequired: 'A note is required to apply a manual override.',
    overriddenNotice: 'Custom entitlement amount recorded. e-Notification re-sent to Bonder & Relevant Stakeholders.',
    formTitle: 'Entitlement Inclusion / Addition — Application',
    step1: 'Select License',
    step2: 'Requested Items & Attachments',
    step3: 'e-Verification Preview',
    step4: 'Review & Submit',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    requestedItemsTitle: 'Requested Additional Raw Materials',
    hsCodeLabel: 'HS Code',
    descriptionLabel: 'Description',
    additionalQtyLabel: 'Additional Quantity Requested',
    justificationLabel: 'Justification',
    addItem: 'Add Another Item',
    removeItem: 'Remove',
    attachmentsTitle: 'Supporting Attachments (e-Attachment)',
    attach: 'Attach',
    attached: 'Attached',
    autoVerifyTitle: 'System Auto-Verification',
    autoVerifyHint: 'System auto-verifies usage from e-Bond Register, UD System and ASYCUDA World, and auto-calculates a suggested quantity by averaging usage-to-date and adding a predefined buffer.',
    reviewTitle: 'Review Application',
    submittedNotice: 'Application submitted. Routed for officer assignment and RO/ARO verification.',
    pipelineTitle: 'Inclusion / Addition Request Pipeline',
    stageLabels: inclusionStageLabels,
    assignOfficer: 'Assign Officer',
    selectOfficer: 'Select an officer to verify this request',
    assignForward: 'Assign & Forward',
    roVerificationNote: 'RO/ARO e-Note & Nothi',
    roNotePlaceholder: 'Enter verification remarks before forwarding to Commissioner…',
    forwardCommissioner: 'Forward to Commissioner (e-Note & Nothi)',
    roNoteRequired: 'An e-Note is required before forwarding.',
    commissionerReviewTitle: 'Commissioner Review',
    roRecommendation: "RO/ARO's Recommendation",
    customAmount: 'Enter Custom Entitlement Amount (if necessary)',
    approveIssue: 'Approve & Issue Entitlement',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalRequired: 'A reason is required to disapprove.',
    disapprovedNoticeTitle: 'Application Disapproved',
    disapprovedNoticeBody: 'The Bonder has been auto-notified with CBC notes and may revert to the application to resubmit.',
    issuedNoticeTitle: 'Entitlement Issued',
    issuedNoticeBody: 'e-Annual Entitlement generated, forwarded to Bond Application module, and attached to Bonder Profile.',
    linkedEntitlement: 'Linked Entitlement Record',
    filterAll: 'All Stages',
    searchPlaceholder: 'Search by license no. or bonder name…'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'এনটাইটেলমেন্ট ব্যবস্থাপনা',
    subtitle: 'বন্ড লাইসেন্স অনুমোদনের পর এবং বার্ষিক নিরীক্ষা অনুমোদনের পর বার্ষিক কাঁচামাল এনটাইটেলমেন্ট স্বয়ংক্রিয়ভাবে ইস্যু করা হয়, এবং আরও/এআরও ও কমিশনার কর্তৃক পর্যালোচিত ইনক্লুশন/সংযোজন অনুরোধের মাধ্যমে বছরের মাঝামাঝি টপ-আপ করা যায়।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    tabDashboard: 'ড্যাশবোর্ড',
    tabQueue: 'ইনক্লুশন অনুরোধ',
    newRequest: 'নতুন ইনক্লুশন / সংযোজন অনুরোধ',
    totalActive: 'সক্রিয় এনটাইটেলমেন্ট',
    viaLicense: 'লাইসেন্স অনুমোদনের মাধ্যমে',
    viaAudit: 'নিরীক্ষা অনুমোদনের মাধ্যমে',
    pendingInclusion: 'অপেক্ষমাণ ইনক্লুশন অনুরোধ',
    simulatorTitle: 'স্বয়ংক্রিয়-ইস্যু সিমুলেটর',
    simulatorHint: 'সিস্টেম-ট্রিগারড ইস্যু — Annex-II §১.১৪-এ বর্ণিত স্বয়ংক্রিয় গণনা প্রদর্শন করে।',
    simulateLicense: 'সিমুলেট: নতুন লাইসেন্স অনুমোদিত',
    simulateAudit: 'সিমুলেট: নিরীক্ষা অনুমোদিত',
    simulatedNotice: 'ই-বার্ষিক এনটাইটেলমেন্ট ইস্যু করা হয়েছে এবং বন্ডকারী প্রোফাইলে সংযুক্ত করা হয়েছে। বন্ডকারী ও সংশ্লিষ্ট স্টেকহোল্ডারদের অবহিত করা হয়েছে।',
    entitlementListTitle: 'ইস্যুকৃত এনটাইটেলমেন্ট',
    tableHeaders: {
      id: 'এনটাইটেলমেন্ট আইডি',
      bonder: 'বন্ডকারী',
      trigger: 'ট্রিগার',
      items: 'এইচএস কোড',
      value: 'মোট মূল্য (USD)',
      status: 'স্ট্যাটাস',
      action: ''
    },
    view: 'দেখুন',
    active: 'সক্রিয়',
    superseded: 'প্রতিস্থাপিত',
    inclusionQueueTitle: 'ইনক্লুশন / সংযোজন অনুরোধ',
    noRequests: 'কোনো ইনক্লুশন অনুরোধ পাওয়া যায়নি।',
    review: 'পর্যালোচনা',
    detailTitle: 'এনটাইটেলমেন্ট বিবরণ',
    close: 'বন্ধ করুন',
    licenseNo: 'বন্ড লাইসেন্স নং',
    bin: 'বিআইএন',
    issueDate: 'ইস্যুর তারিখ',
    calculationBasis: 'গণনার ভিত্তি',
    editWindow: 'ম্যানুয়াল-এডিট উইন্ডো মেয়াদ',
    editOpen: 'খোলা — কমিশনার এখনও সমন্বয় করতে পারেন',
    editClosed: 'বন্ধ — পরিমাণ চূড়ান্ত',
    itemsTitle: 'এনটাইটেলড কাঁচামাল (এইচএস কোড অনুযায়ী)',
    overrideTitle: 'কমিশনার ওভাররাইড',
    overrideApplied: 'ওভাররাইড প্রয়োগ করা হয়েছে',
    overrideNoteLabel: 'ওভাররাইড নোট',
    applyOverride: 'ওভাররাইড প্রয়োগ করুন',
    overrideAmountLabel: 'মোট মূল্য সমন্বয় করুন (USD)',
    overrideReasonLabel: 'ওভাররাইডের কারণ',
    overrideRequired: 'ম্যানুয়াল ওভাররাইড প্রয়োগ করতে একটি নোট প্রয়োজন।',
    overriddenNotice: 'কাস্টম এনটাইটেলমেন্ট পরিমাণ রেকর্ড করা হয়েছে। বন্ডকারী ও সংশ্লিষ্ট স্টেকহোল্ডারদের পুনরায় অবহিত করা হয়েছে।',
    formTitle: 'এনটাইটেলমেন্ট ইনক্লুশন / সংযোজন — আবেদন',
    step1: 'লাইসেন্স নির্বাচন করুন',
    step2: 'অনুরোধকৃত আইটেম ও সংযুক্তি',
    step3: 'ই-যাচাইকরণ প্রিভিউ',
    step4: 'পর্যালোচনা ও দাখিল',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বর দিয়ে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    next: 'পরবর্তী',
    back: 'পূর্ববর্তী',
    submit: 'আবেদন দাখিল করুন',
    requestedItemsTitle: 'অনুরোধকৃত অতিরিক্ত কাঁচামাল',
    hsCodeLabel: 'এইচএস কোড',
    descriptionLabel: 'বিবরণ',
    additionalQtyLabel: 'অনুরোধকৃত অতিরিক্ত পরিমাণ',
    justificationLabel: 'যৌক্তিকতা',
    addItem: 'আরেকটি আইটেম যোগ করুন',
    removeItem: 'সরান',
    attachmentsTitle: 'সহায়ক সংযুক্তি (ই-সংযুক্তি)',
    attach: 'সংযুক্ত করুন',
    attached: 'সংযুক্ত হয়েছে',
    autoVerifyTitle: 'সিস্টেম স্বয়ংক্রিয়-যাচাই',
    autoVerifyHint: 'সিস্টেম ই-বন্ড রেজিস্টার, ইউডি সিস্টেম এবং অ্যাসাইকুডা ওয়ার্ল্ড থেকে ব্যবহার স্বয়ংক্রিয়ভাবে যাচাই করে এবং এখন পর্যন্ত ব্যবহারের গড় নিয়ে একটি পূর্বনির্ধারিত বাফার যোগ করে প্রস্তাবিত পরিমাণ গণনা করে।',
    reviewTitle: 'আবেদন পর্যালোচনা',
    submittedNotice: 'আবেদন দাখিল করা হয়েছে। কর্মকর্তা বরাদ্দ ও আরও/এআরও যাচাইয়ের জন্য পাঠানো হয়েছে।',
    pipelineTitle: 'ইনক্লুশন / সংযোজন অনুরোধ পাইপলাইন',
    stageLabels: inclusionStageLabels,
    assignOfficer: 'কর্মকর্তা বরাদ্দ করুন',
    selectOfficer: 'এই অনুরোধ যাচাইয়ের জন্য একজন কর্মকর্তা নির্বাচন করুন',
    assignForward: 'বরাদ্দ ও প্রেরণ করুন',
    roVerificationNote: 'আরও/এআরও ই-নোট ও নথি',
    roNotePlaceholder: 'কমিশনারের কাছে পাঠানোর আগে যাচাইকরণ মন্তব্য লিখুন…',
    forwardCommissioner: 'কমিশনারের কাছে প্রেরণ করুন (ই-নোট ও নথি)',
    roNoteRequired: 'প্রেরণের আগে একটি ই-নোট প্রয়োজন।',
    commissionerReviewTitle: 'কমিশনার পর্যালোচনা',
    roRecommendation: 'আরও/এআরও-এর সুপারিশ',
    customAmount: 'কাস্টম এনটাইটেলমেন্ট পরিমাণ লিখুন (প্রয়োজনে)',
    approveIssue: 'অনুমোদন করুন ও এনটাইটেলমেন্ট ইস্যু করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalRequired: 'অননুমোদন করতে একটি কারণ প্রয়োজন।',
    disapprovedNoticeTitle: 'আবেদন অননুমোদিত',
    disapprovedNoticeBody: 'বন্ডকারীকে সিবিসি নোটসহ স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে এবং পুনরায় দাখিলের জন্য আবেদনে ফিরে যেতে পারেন।',
    issuedNoticeTitle: 'এনটাইটেলমেন্ট ইস্যুকৃত',
    issuedNoticeBody: 'ই-বার্ষিক এনটাইটেলমেন্ট তৈরি হয়েছে, বন্ড অ্যাপ্লিকেশন মডিউলে প্রেরিত হয়েছে এবং বন্ডকারী প্রোফাইলে সংযুক্ত করা হয়েছে।',
    linkedEntitlement: 'সংযুক্ত এনটাইটেলমেন্ট রেকর্ড',
    filterAll: 'সকল ধাপ',
    searchPlaceholder: 'লাইসেন্স নং বা বন্ডকারীর নাম খুঁজুন…'
  }
};
export function Entitlement({
  language,
  onDone
}: EntitlementProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'form' | 'queue'>('dashboard');
  const [entitlements, setEntitlements] = useState<EntitlementRecord[]>(seedEntitlements);
  const [inclusions, setInclusions] = useState<InclusionRequest[]>(seedInclusions);
  const [selectedEntitlement, setSelectedEntitlement] = useState<EntitlementRecord | null>(null);
  const [selectedInclusion, setSelectedInclusion] = useState<InclusionRequest | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [queueFilter, setQueueFilter] = useState<'all' | InclusionStage>('all');
  const [queueSearch, setQueueSearch] = useState('');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const counts = useMemo(() => ({
    active: entitlements.filter(e => e.status === 'active').length,
    viaLicense: entitlements.filter(e => e.trigger === 'license-approval').length,
    viaAudit: entitlements.filter(e => e.trigger === 'audit-approval').length,
    pendingInclusion: inclusions.filter(r => r.stage !== 'issued' && r.stage !== 'disapproved').length
  }), [entitlements, inclusions]);
  const nextEntId = () => `ENT-2026-${(300 + entitlements.length).toString().padStart(4, '0')}`;
  const handleSimulateLicense = () => {
    const pool = bondLicenses.filter(l => !entitlements.some(e => e.licenseNo === l.licenseNo && e.trigger === 'license-approval'));
    const lic = pool[Math.floor(Math.random() * pool.length)] ?? bondLicenses[0];
    const rec: EntitlementRecord = {
      id: nextEntId(),
      licenseNo: lic.licenseNo,
      trigger: 'license-approval',
      issueDate: '26 Jul 2026',
      items: [{
        hsCode: '5208.52.00',
        descriptionEn: 'Woven Cotton Fabric',
        descriptionBn: 'বোনা তুলা কাপড়',
        entitledQty: `${(120 + Math.floor(Math.random() * 80)) * 1000} kg`
      }],
      totalValueUsd: 280000 + Math.floor(Math.random() * 250000),
      calculationNote: '30% of yearly machine capacity as per HS Code, pulled from Machinery Database (auto-calculated on License Approval).',
      commissionerOverride: false,
      editWindowExpiry: '26 Aug 2026',
      status: 'active'
    };
    setEntitlements(prev => [rec, ...prev]);
    showToast(t.simulatedNotice);
  };
  const handleSimulateAudit = () => {
    const pool = bondLicenses.filter(l => !entitlements.some(e => e.licenseNo === l.licenseNo && e.trigger === 'audit-approval'));
    const lic = pool[Math.floor(Math.random() * pool.length)] ?? bondLicenses[0];
    const rec: EntitlementRecord = {
      id: nextEntId(),
      licenseNo: lic.licenseNo,
      trigger: 'audit-approval',
      issueDate: '26 Jul 2026',
      items: [{
        hsCode: '6006.22.00',
        descriptionEn: 'Knitted Cotton Fabric, Dyed',
        descriptionBn: 'নিটেড তুলা কাপড়, রঙিন',
        entitledQty: `${(200 + Math.floor(Math.random() * 150)) * 1000} kg`
      }],
      totalValueUsd: 380000 + Math.floor(Math.random() * 400000),
      calculationNote: "Last year's export usage + 20% buffer, minus raw material already in stock. Validated by Annual Audit Module (auto-calculated immediately after Audit Approval).",
      commissionerOverride: false,
      editWindowExpiry: '26 Aug 2026',
      status: 'active'
    };
    setEntitlements(prev => [rec, ...prev]);
    showToast(t.simulatedNotice);
  };
  const handleApplyOverride = (id: string, amount: number, note: string) => {
    setEntitlements(prev => prev.map(e => e.id === id ? {
      ...e,
      totalValueUsd: amount,
      commissionerOverride: true,
      overrideNote: note
    } : e));
    setSelectedEntitlement(prev => prev && prev.id === id ? {
      ...prev,
      totalValueUsd: amount,
      commissionerOverride: true,
      overrideNote: note
    } : prev);
    showToast(t.overriddenNotice);
  };
  const filteredQueue = useMemo(() => {
    const q = queueSearch.trim().toLowerCase();
    return inclusions.filter(r => {
      const lic = licenseOf(r.licenseNo);
      const matchesQuery = !q || r.licenseNo.toLowerCase().includes(q) || (lic?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesStage = queueFilter === 'all' || r.stage === queueFilter;
      return matchesQuery && matchesStage;
    });
  }, [inclusions, queueSearch, queueFilter]);
  if (view === 'form') {
    return <InclusionForm language={language} onCancel={() => setView('dashboard')} onSubmit={req => {
      setInclusions(prev => [req, ...prev]);
      setView('dashboard');
      showToast(t.submittedNotice);
    }} t={t} />;
  }
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button type="button" onClick={() => setView('form')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
          <Icon name="add_circle" className="text-[16px]" />
          {t.newRequest}
        </button>
      </div>

      <div className="flex w-fit rounded-full border border-[#CBD5E1] bg-white p-1">
        {(['dashboard', 'queue'] as const).map(v => <button key={v} type="button" onClick={() => setView(v)} className={['rounded-full px-4 py-2 text-xs font-semibold transition-colors', view === v ? 'bg-[#0A4D8C] text-white' : 'text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
            {v === 'dashboard' ? t.tabDashboard : t.tabQueue}
          </button>)}
      </div>

      {view === 'dashboard' && <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon="pie_chart" label={t.totalActive} value={counts.active} color="#0A4D8C" />
            <StatCard icon="verified" label={t.viaLicense} value={counts.viaLicense} color="#1E88E5" />
            <StatCard icon="fact_check" label={t.viaAudit} value={counts.viaAudit} color="#00A86B" />
            <StatCard icon="hourglass_top" label={t.pendingInclusion} value={counts.pendingInclusion} color="#B45309" />
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Icon name="bolt" className="text-[18px] text-[#0A4D8C]" />
              <p className="text-sm font-bold text-[#1E293B]">{t.simulatorTitle}</p>
            </div>
            <p className="mt-1 text-xs text-[#64748B]">{t.simulatorHint}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={handleSimulateLicense} className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                <Icon name="badge" className="text-[15px]" />
                {t.simulateLicense}
              </button>
              <button type="button" onClick={handleSimulateAudit} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-[#00A86B] hover:bg-[#00A86B] hover:text-white">
                <Icon name="fact_check" className="text-[15px]" />
                {t.simulateAudit}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-[#1E293B]">{t.entitlementListTitle}</h2>
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                    <th className="px-4 py-3">{t.tableHeaders.id}</th>
                    <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
                    <th className="px-4 py-3">{t.tableHeaders.trigger}</th>
                    <th className="px-4 py-3">{t.tableHeaders.items}</th>
                    <th className="px-4 py-3">{t.tableHeaders.value}</th>
                    <th className="px-4 py-3">{t.tableHeaders.status}</th>
                    <th className="px-4 py-3">{t.tableHeaders.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {entitlements.map(e => {
                const lic = licenseOf(e.licenseNo);
                return <tr key={e.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{e.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                          <p className="text-[11px] text-[#94A3B8]">{e.licenseNo}</p>
                        </td>
                        <td className="px-4 py-3"><TriggerBadge trigger={e.trigger} language={language} /></td>
                        <td className="px-4 py-3 text-[#334155]">{e.items.length}</td>
                        <td className="px-4 py-3 text-[#334155]">${e.totalValueUsd.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${e.status === 'active' ? 'bg-emerald-50 text-[#00A86B]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                            {e.status === 'active' ? t.active : t.superseded}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => setSelectedEntitlement(e)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                            {t.view}
                          </button>
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>
          </div>
        </>}

      {view === 'queue' && <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
              <input value={queueSearch} onChange={e => setQueueSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
            </div>
            <select value={queueFilter} onChange={e => setQueueFilter(e.target.value as any)} className={`${inputClass} sm:w-56`}>
              <option value="all">{t.filterAll}</option>
              {stageOrder.concat('disapproved').map(s => <option key={s} value={s}>{inclusionStageLabels[s][language]}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">{t.tableHeaders.id}</th>
                  <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
                  <th className="px-4 py-3">{t.hsCodeLabel}</th>
                  <th className="px-4 py-3">{t.additionalQtyLabel}</th>
                  <th className="px-4 py-3">{t.tableHeaders.status}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map(r => {
                const lic = licenseOf(r.licenseNo);
                return <tr key={r.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                        <p className="text-[11px] text-[#94A3B8]">{r.licenseNo}</p>
                      </td>
                      <td className="px-4 py-3 text-[#334155]">{r.items[0]?.hsCode}</td>
                      <td className="px-4 py-3 text-[#334155]">{r.items[0]?.additionalQty}</td>
                      <td className="px-4 py-3"><StageBadge stage={r.stage} language={language} /></td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelectedInclusion(r)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                          {t.review}
                        </button>
                      </td>
                    </tr>;
              })}
                {filteredQueue.length === 0 && <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#94A3B8]">{t.noRequests}</td>
                  </tr>}
              </tbody>
            </table>
          </div>
        </div>}

      {selectedEntitlement && <EntitlementDrawer record={selectedEntitlement} language={language} t={t} onClose={() => setSelectedEntitlement(null)} onOverride={handleApplyOverride} />}

      {selectedInclusion && <InclusionDrawer request={selectedInclusion} language={language} t={t} onClose={() => setSelectedInclusion(null)} onUpdate={updated => {
      setInclusions(prev => prev.map(r => r.id === updated.id ? updated : r));
      setSelectedInclusion(updated);
    }} onIssue={(updated, entitlement) => {
      setInclusions(prev => prev.map(r => r.id === updated.id ? updated : r));
      setEntitlements(prev => [entitlement, ...prev]);
      setSelectedInclusion(updated);
      showToast(t.simulatedNotice);
    }} />}
    </div>;
}
function EntitlementDrawer({
  record,
  language,
  t,
  onClose,
  onOverride
}: {
  record: EntitlementRecord;
  language: Language;
  t: typeof T['en'];
  onClose: () => void;
  onOverride: (id: string, amount: number, note: string) => void;
}) {
  const [amount, setAmount] = useState(String(record.totalValueUsd));
  const [note, setNote] = useState('');
  const [error, setError] = useState(false);
  const lic = licenseOf(record.licenseNo);
  const windowOpen = isWindowOpen(record.editWindowExpiry);
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.detailTitle}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-[#0A4D8C]">{record.id}</span>
            <TriggerBadge trigger={record.trigger} language={language} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.licenseNo}</p>
              <p className="font-medium text-[#1E293B]">{record.licenseNo}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.bin}</p>
              <p className="font-medium text-[#1E293B]">{lic?.bin ?? '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] text-[#94A3B8]">Bonder</p>
              <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.issueDate}</p>
              <p className="font-medium text-[#1E293B]">{record.issueDate}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.editWindow}</p>
              <p className={`font-medium ${windowOpen ? 'text-[#00A86B]' : 'text-[#94A3B8]'}`}>{record.editWindowExpiry} — {windowOpen ? t.editOpen : t.editClosed}</p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-[#334155]">{t.calculationBasis}</p>
            <p className="rounded-lg bg-[#F8FAFC] p-3 text-[13px] text-[#334155]">{record.calculationNote}</p>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#334155]">{t.itemsTitle}</p>
            <div className="flex flex-col gap-2">
              {record.items.map(it => <div key={it.hsCode} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2 text-[13px]">
                  <div>
                    <p className="font-semibold text-[#0A4D8C]">{it.hsCode}</p>
                    <p className="text-[#334155]">{language === 'en' ? it.descriptionEn : it.descriptionBn}</p>
                  </div>
                  <p className="font-semibold text-[#1E293B]">{it.entitledQty}</p>
                </div>)}
            </div>
            <p className="mt-2 text-sm font-bold text-[#1E293B]">{t.tableHeaders.value}: ${record.totalValueUsd.toLocaleString()}</p>
          </div>

          {record.commissionerOverride && record.overrideNote && <div className="rounded-lg border border-[#F59E0B]/40 bg-amber-50 p-3 text-[13px] text-[#92400E]">
              <p className="font-semibold">{t.overrideApplied}</p>
              <p className="mt-0.5">{record.overrideNote}</p>
            </div>}

          {windowOpen && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.overrideTitle}</p>
              <Field label={t.overrideAmountLabel}>
                <TextInput value={amount} onChange={setAmount} type="number" />
              </Field>
              <Field label={t.overrideReasonLabel} required error={error ? t.overrideRequired : undefined}>
                <textarea value={note} onChange={e => {
              setNote(e.target.value);
              setError(false);
            }} rows={3} className={inputClass} />
              </Field>
              <button type="button" onClick={() => {
            if (!note.trim()) {
              setError(true);
              return;
            }
            onOverride(record.id, Number(amount) || record.totalValueUsd, note.trim());
          }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                <Icon name="edit_note" className="text-[16px]" />
                {t.applyOverride}
              </button>
            </div>}
        </div>
      </div>
    </div>;
}
function InclusionDrawer({
  request,
  language,
  t,
  onClose,
  onUpdate,
  onIssue
}: {
  request: InclusionRequest;
  language: Language;
  t: typeof T['en'];
  onClose: () => void;
  onUpdate: (r: InclusionRequest) => void;
  onIssue: (r: InclusionRequest, e: EntitlementRecord) => void;
}) {
  const lic = licenseOf(request.licenseNo);
  const [officer, setOfficer] = useState(officerPool[0]);
  const [roNote, setRoNote] = useState(request.eNote ?? '');
  const [roNoteError, setRoNoteError] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [disapprovalError, setDisapprovalError] = useState(false);
  const isException = request.stage === 'disapproved';
  const currentIndex = stageOrder.indexOf(request.stage);
  const item = request.items[0];
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.pipelineTitle}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-[#0A4D8C]">{request.id}</span>
            <StageBadge stage={request.stage} language={language} />
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <p className="font-medium text-[#1E293B]">{lic?.nameEn} · {request.licenseNo}</p>
            <p className="mt-1 text-[13px] text-[#334155]">{item.hsCode} — {language === 'en' ? item.descriptionEn : item.descriptionBn}</p>
            <p className="text-[13px] font-semibold text-[#0A4D8C]">+{item.additionalQty}</p>
            <p className="mt-1 text-[12px] text-[#64748B]">{language === 'en' ? item.justificationEn : item.justificationBn}</p>
          </div>

          <div className="rounded-lg border border-[#CBD5E1] bg-white p-3 text-[12px] text-[#334155]">
            <p className="flex items-center gap-1.5 font-semibold text-[#0A4D8C]"><Icon name="verified" className="text-[15px]" />{t.autoVerifyTitle}</p>
            <p className="mt-1">{language === 'en' ? request.autoVerifiedNoteEn : request.autoVerifiedNoteBn}</p>
            <p className="mt-1 italic text-[#64748B]">{request.suggestedQtyNote}</p>
          </div>

          {!isException && <div className="relative flex flex-col gap-5 pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#CBD5E1]" />
              {stageOrder.map((s, i) => {
            const status = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
            return <div key={s} className="relative">
                    <span className={`absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ${status === 'done' ? 'bg-[#00A86B] ring-emerald-50' : status === 'current' ? 'bg-[#0A4D8C] ring-[#EAF3FE]' : 'bg-[#CBD5E1] ring-white'}`} />
                    <p className={`text-[13px] font-bold ${status === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'}`}>{inclusionStageLabels[s][language]}</p>

                    {status === 'current' && s === 'assignment' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.selectOfficer}</p>
                        <select value={officer.en} onChange={e => setOfficer(officerPool.find(o => o.en === e.target.value) ?? officerPool[0])} className={inputClass}>
                          {officerPool.map(o => <option key={o.en} value={o.en}>{o[language]}</option>)}
                        </select>
                        <button type="button" onClick={() => onUpdate({
                    ...request,
                    stage: 'ro-verification',
                    assignedOfficer: officer
                  })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                          <Icon name="person_add" className="text-[14px]" />
                          {t.assignForward}
                        </button>
                      </div>}

                    {status === 'current' && s === 'ro-verification' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.roVerificationNote} — {request.assignedOfficer?.[language]}</p>
                        <textarea value={roNote} onChange={e => {
                    setRoNote(e.target.value);
                    setRoNoteError(false);
                  }} placeholder={t.roNotePlaceholder} rows={3} className={`${inputClass} ${roNoteError ? errorInputClass : ''}`} />
                        {roNoteError && <p className="text-[11px] font-medium text-[#DC2626]">{t.roNoteRequired}</p>}
                        <button type="button" onClick={() => {
                    if (!roNote.trim()) {
                      setRoNoteError(true);
                      return;
                    }
                    onUpdate({
                      ...request,
                      stage: 'commissioner-approval',
                      eNote: roNote.trim()
                    });
                  }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                          <Icon name="forward_to_inbox" className="text-[14px]" />
                          {t.forwardCommissioner}
                        </button>
                      </div>}

                    {status === 'current' && s === 'commissioner-approval' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] font-semibold text-[#334155]">{t.roRecommendation}</p>
                        <p className="rounded bg-[#F8FAFC] p-2 text-[12px] text-[#334155]">{request.eNote}</p>
                        <Field label={t.customAmount}>
                          <TextInput value={customAmount} onChange={setCustomAmount} type="number" placeholder={item.additionalQty} />
                        </Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => {
                      const entId = `ENT-2026-0${200 + Math.floor(Math.random() * 90)}`;
                      const entitlement: EntitlementRecord = {
                        id: entId,
                        licenseNo: request.licenseNo,
                        trigger: 'inclusion-addition',
                        issueDate: '26 Jul 2026',
                        items: [{
                          hsCode: item.hsCode,
                          descriptionEn: item.descriptionEn,
                          descriptionBn: item.descriptionBn,
                          entitledQty: customAmount ? `${customAmount} kg` : item.additionalQty
                        }],
                        totalValueUsd: 40000 + Math.floor(Math.random() * 60000),
                        calculationNote: `Approved Inclusion/Addition request ${request.id}, verified against e-Bond Register usage trend.`,
                        commissionerOverride: !!customAmount,
                        overrideNote: customAmount ? `Commissioner set custom amount of ${customAmount} kg.` : undefined,
                        editWindowExpiry: '26 Aug 2026',
                        status: 'active'
                      };
                      onIssue({
                        ...request,
                        stage: 'issued',
                        commissionerOverride: !!customAmount,
                        overrideNote: entitlement.overrideNote,
                        issuedEntitlementId: entId
                      }, entitlement);
                    }} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]">
                            <Icon name="check_circle" className="text-[14px]" />
                            {t.approveIssue}
                          </button>
                          <details className="w-full">
                            <summary className="cursor-pointer text-[11px] font-semibold text-[#DC2626]">{t.disapprove}</summary>
                            <div className="mt-2 flex flex-col gap-2">
                              <textarea value={disapprovalReason} onChange={e => {
                          setDisapprovalReason(e.target.value);
                          setDisapprovalError(false);
                        }} placeholder={t.disapprovalReasonLabel} rows={2} className={`${inputClass} ${disapprovalError ? errorInputClass : ''}`} />
                              {disapprovalError && <p className="text-[11px] font-medium text-[#DC2626]">{t.disapprovalRequired}</p>}
                              <button type="button" onClick={() => {
                          if (!disapprovalReason.trim()) {
                            setDisapprovalError(true);
                            return;
                          }
                          onUpdate({
                            ...request,
                            stage: 'disapproved',
                            disapprovalReason: disapprovalReason.trim()
                          });
                        }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]">
                                {t.disapprove}
                              </button>
                            </div>
                          </details>
                        </div>
                      </div>}

                    {status === 'done' && s === 'issued' && request.issuedEntitlementId && <p className="mt-1 text-[12px] text-[#64748B]">{t.linkedEntitlement}: <span className="font-semibold text-[#0A4D8C]">{request.issuedEntitlementId}</span></p>}
                  </div>;
          })}
            </div>}

          {request.stage === 'issued' && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-[#087F52]">
              <p className="font-bold">{t.issuedNoticeTitle}</p>
              <p className="mt-1">{t.issuedNoticeBody}</p>
              {request.issuedEntitlementId && <p className="mt-1 font-semibold">{t.linkedEntitlement}: {request.issuedEntitlementId}</p>}
            </div>}

          {isException && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-[#B91C1C]">
              <p className="font-bold">{t.disapprovedNoticeTitle}</p>
              <p className="mt-1">{request.disapprovalReason}</p>
              <p className="mt-2 text-[#64748B]">{t.disapprovedNoticeBody}</p>
            </div>}
        </div>
      </div>
    </div>;
}
function InclusionForm({
  language,
  onCancel,
  onSubmit,
  t
}: {
  language: Language;
  onCancel: () => void;
  onSubmit: (r: InclusionRequest) => void;
  t: typeof T['en'];
}) {
  const [step, setStep] = useState(1);
  const [licenseNo, setLicenseNo] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [hsCode, setHsCode] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [additionalQty, setAdditionalQty] = useState('');
  const [justification, setJustification] = useState('');
  const [attached, setAttached] = useState<Record<string, boolean>>({});
  const verify = () => {
    const found = bondLicenses.find(l => normalizeLicenseNo(l.licenseNo) === normalizeLicenseNo(licenseNo));
    if (found) {
      setVerifiedLicense(found);
      setNotFound(false);
    } else {
      setVerifiedLicense(undefined);
      setNotFound(true);
    }
  };
  const canSubmit = verifiedLicense && hsCode.trim() && additionalQty.trim() && justification.trim() && documentDefs.every(d => attached[d.id]);
  return <div className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.formTitle}</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#1E293B]">{t.formTitle}</h1>

      <div className="flex items-center gap-2">
        {[t.step1, t.step2, t.step3, t.step4].map((label, i) => <div key={label} className="flex flex-1 items-center gap-2">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${step === i + 1 ? 'bg-[#0A4D8C] text-white' : step > i + 1 ? 'bg-[#00A86B] text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
              {step > i + 1 ? <Icon name="check" className="text-[14px]" /> : i + 1}
            </span>
            <span className={`hidden text-xs font-medium sm:block ${step === i + 1 ? 'text-[#1E293B]' : 'text-[#94A3B8]'}`}>{label}</span>
            {i < 3 && <span className="h-px flex-1 bg-[#E2E8F0]" />}
          </div>)}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        {step === 1 && <>
            <Field label={t.licenseNo} required>
              <div className="flex gap-2">
                <TextInput value={licenseNo} onChange={v => {
              setLicenseNo(v);
              setVerifiedLicense(undefined);
              setNotFound(false);
            }} placeholder="BL-2022-01876" error={notFound} />
                <button type="button" onClick={verify} className="shrink-0 rounded-lg bg-[#0A4D8C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#083E71]">
                  {t.verify}
                </button>
              </div>
              {notFound && <p className="text-[11px] font-medium text-[#DC2626]">{t.notFound}</p>}
            </Field>
            {verifiedLicense && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
                <Icon name="check_circle" className="text-[16px]" />
                {verifiedLicense.licenseNo} · {t.verified} · {verifiedLicense.nameEn}
              </div>}
          </>}

        {step === 2 && <>
            <p className="text-[13px] font-bold text-[#1E293B]">{t.requestedItemsTitle}</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t.hsCodeLabel} required>
                <TextInput value={hsCode} onChange={setHsCode} placeholder="5208.52.00" />
              </Field>
              <Field label={t.additionalQtyLabel} required>
                <TextInput value={additionalQty} onChange={setAdditionalQty} placeholder="12,000 kg" />
              </Field>
              <Field label={t.descriptionLabel}>
                <TextInput value={descriptionEn} onChange={setDescriptionEn} placeholder="Woven Cotton Fabric" />
              </Field>
            </div>
            <Field label={t.justificationLabel} required>
              <textarea value={justification} onChange={e => setJustification(e.target.value)} rows={3} className={inputClass} />
            </Field>
            <p className="mt-2 text-[13px] font-bold text-[#1E293B]">{t.attachmentsTitle}</p>
            <div className="flex flex-col gap-2">
              {documentDefs.map(d => <div key={d.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2.5">
                  <span className="text-[13px] text-[#334155]">{d[language]}</span>
                  {attached[d.id] ? <span className="flex items-center gap-1 text-[12px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[15px]" />{t.attached}</span> : <button type="button" onClick={() => setAttached(prev => ({
                ...prev,
                [d.id]: true
              }))} className="rounded-full bg-[#EAF3FE] px-3 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                      {t.attach}
                    </button>}
                </div>)}
            </div>
          </>}

        {step === 3 && <div className="flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-sm font-bold text-[#0A4D8C]"><Icon name="verified" className="text-[18px]" />{t.autoVerifyTitle}</p>
            <p className="text-[13px] text-[#334155]">{t.autoVerifyHint}</p>
            <div className="rounded-lg bg-[#F8FAFC] p-3 text-[13px] text-[#334155]">
              <p>HS {hsCode || '—'}: {t.additionalQtyLabel} = <span className="font-semibold text-[#0A4D8C]">{additionalQty || '—'}</span></p>
              <p className="mt-1 italic text-[#64748B]">System-suggested amount, based on average usage-to-date plus a predefined buffer, will be confirmed by the assigned RO/ARO after cross-checking e-Bond Register, UD System and ASYCUDA World records.</p>
            </div>
          </div>}

        {step === 4 && verifiedLicense && <div className="flex flex-col gap-3 text-sm">
            <p className="text-[13px] font-bold text-[#1E293B]">{t.reviewTitle}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-[#F8FAFC] p-4">
              <div><p className="text-[11px] text-[#94A3B8]">{t.licenseNo}</p><p className="font-medium text-[#1E293B]">{verifiedLicense.licenseNo}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">Bonder</p><p className="font-medium text-[#1E293B]">{verifiedLicense.nameEn}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">{t.hsCodeLabel}</p><p className="font-medium text-[#1E293B]">{hsCode}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">{t.additionalQtyLabel}</p><p className="font-medium text-[#1E293B]">{additionalQty}</p></div>
              <div className="col-span-2"><p className="text-[11px] text-[#94A3B8]">{t.justificationLabel}</p><p className="font-medium text-[#1E293B]">{justification}</p></div>
            </div>
          </div>}

        <div className="flex justify-between pt-2">
          <button type="button" onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            {t.back}
          </button>
          {step < 4 ? <button type="button" disabled={step === 1 && !verifiedLicense} onClick={() => setStep(s => s + 1)} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.next}
            </button> : <button type="button" disabled={!canSubmit} onClick={() => {
          if (!verifiedLicense) return;
          const req: InclusionRequest = {
            id: `INC-2026-00${40 + Math.floor(Math.random() * 50)}`,
            licenseNo: verifiedLicense.licenseNo,
            requestedAt: '26 Jul 2026',
            items: [{
              hsCode,
              descriptionEn: descriptionEn || hsCode,
              descriptionBn: descriptionEn || hsCode,
              additionalQty,
              justificationEn: justification,
              justificationBn: justification
            }],
            autoVerifiedNoteEn: 'Auto-verification pending assigned officer confirmation against e-Bond Register, UD System and ASYCUDA World records.',
            autoVerifiedNoteBn: 'ই-বন্ড রেজিস্টার, ইউডি সিস্টেম এবং অ্যাসাইকুডা ওয়ার্ল্ড রেকর্ডের বিপরীতে বরাদ্দকৃত কর্মকর্তার নিশ্চিতকরণের অপেক্ষায় স্বয়ংক্রিয়-যাচাই।',
            suggestedQtyNote: `System-suggested amount pending confirmation, based on requested quantity of ${additionalQty}.`,
            stage: 'submitted'
          };
          onSubmit(req);
        }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.submit}
            </button>}
        </div>
      </div>
    </div>;
}
