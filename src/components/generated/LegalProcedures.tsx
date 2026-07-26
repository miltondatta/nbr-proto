import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { legalCases as seedCases, licenseOf, sourceModuleLabels, stageLabels, type CaseStage, type LegalCase, type SourceModule } from './legalData';
type Language = 'en' | 'bn';
interface LegalProceduresProps {
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
function StageBadge({
  stage,
  language
}: {
  stage: CaseStage;
  language: Language;
}) {
  const color = stage === 'closed-favor-bonder' || stage === 'closed-favor-cbc' ? '#00A86B' : stage === 'bin-locked' ? '#DC2626' : '#B45309';
  const s = stageLabels[stage];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${color}1A`,
    color
  }}>
      {s[language]}
    </span>;
}
const normalizeLicenseNo = (s: string) => s.trim().toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, '');
const ACTION_BTN = 'inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]';
const ACTION_BTN_GREEN = 'inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]';
const ACTION_BTN_RED = 'inline-flex items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]';
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Legal Procedure Management',
    subtitle: 'Manages the full Show Cause Notice → response/writ → hearing → adjudication → interim order → demand notice → appellate escalation ladder, from initial e-SCN request through final closure or BIN lock.',
    backToDashboard: 'Back to Dashboard',
    newScn: 'New e-SCN Request',
    openCases: 'Open Cases',
    scnIssued: 'e-SCN Issued (Awaiting Bonder)',
    underAdjudication: 'Under Adjudication',
    demandPending: 'Demand Notice Pending',
    binLocked: 'BIN Locked',
    closed: 'Closed Cases',
    searchPlaceholder: 'Search by license no. or bonder name…',
    filterAll: 'All Stages',
    tableHeaders: {
      id: 'Case ID',
      bonder: 'Bonder',
      source: 'Source',
      stage: 'Stage',
      action: ''
    },
    review: 'Review',
    noResults: 'No legal cases match the current filters.',
    formTitle: 'New e-SCN Request',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    submit: 'Submit Request',
    cancel: 'Cancel',
    sourceModuleLabel: 'Requesting Section',
    requestNoteLabel: 'e-Note & Nothi — Reason for SCN Request',
    requestedNotice: 'e-SCN request raised via e-Note & Nothi to AC/DC.',
    caseTitle: 'Legal Case',
    historyTitle: 'Case History (e-Note & Nothi Log)',
    licenseNo: 'Bond License No.',
    requestNote: 'Original Request Note',
    approveScn: 'Approve SCN & Generate e-SCN',
    issueScn: 'Issue e-SCN to Bonder',
    scnNo: 'e-SCN No.',
    scnIssueDate: 'Issue Date',
    responseDeadline: 'Response Deadline',
    fileWrit: 'Bonder Files Writ Case (High Court)',
    responseNoteLabel: 'Bonder Response (with e-Attachment reference)',
    submitResponse: 'Submit Response',
    noResponseTime: 'No Response Received (Time Elapsed)',
    writVerdictTitle: 'High Court Verdict on Writ Case',
    writFavorBonder: 'Verdict Favors Bonder — SCN Null & Void',
    writFavorCbc: 'Verdict Favors CBC — Bonder Must Respond',
    respondNowTitle: 'Bonder Response (Post-Writ)',
    scheduleHearingTitle: 'Schedule Hearing',
    hearingDateLabel: 'Hearing Date',
    scheduleHearing: 'Schedule Hearing (e-Calendar)',
    hearingDate: 'Hearing Date',
    hearingOutcomeTitle: 'Hearing Outcome',
    hearingSatisfactory: 'Response Satisfactory — Issue SCN Closure Order',
    hearingUnsatisfactory: 'Response Unsatisfactory — Proceed to Adjudication',
    adjudicationTitle: 'e-Adjudication Order',
    adjudicationNoteLabel: 'Adjudication Order — Outcome & Recommendation',
    issueAdjudication: 'Issue e-Adjudication Order',
    interimPursued: 'Bonder Pursues Interim Order (High Court)',
    noInterim: 'No Interim Order Pursued — Issue Demand Notice',
    interimTitle: 'Interim Order Pending (High Court)',
    interimApproved: 'High Court Approves — Issue Seized Materials Release Order',
    interimDisapproved: 'High Court Disapproves — Proceed to Demand Notice',
    demandNoticeTitle: 'e-Demand Notice',
    demandAmountLabel: 'Demand Amount (Taka) — Duty, Fine, Tax/VAT',
    issueDemandNotice: 'Issue e-Demand Notice',
    demandNo: 'Demand Notice No.',
    demandAmount: 'Demand Amount',
    payFull: 'Bonder Pays Full Demand Note',
    pursueCommissionerate: 'Bonder Pursues Appellate Commissionerate/Tribunal',
    pursueHighCourt: 'Bonder Pursues High Court',
    pursueAppellateDivision: 'Bonder Pursues Appellate Division (Supreme Court)',
    noResponseDemand: 'No Response Within Time — Lock BIN',
    commissionerateTitle: 'Appellate Commissionerate/Tribunal Verdict',
    verdictAdjustment: 'Verdict: Adjustment of Demand Note',
    verdictUphold: 'Verdict: Uphold Current Demand Note',
    newAmountLabel: 'Revised Demand Amount (Taka)',
    verdictRecorded: 'Verdict Recorded',
    highCourtGateTitle: 'Before High Court Proceeds',
    payStatutory: 'Bonder Pays Statutory Duty (10% Cash + 10% Treasury Chalan)',
    fileHardship: 'High Court Approves Hardship Application',
    highCourtVerdictTitle: 'High Court Verdict',
    verdictNullify: 'Verdict: Nullify Demand Note — Issue e-Release Certificate',
    appellateDivisionVerdictTitle: 'Appellate Division (Supreme Court) Verdict',
    statutoryPaid: 'Statutory duty paid electronically.',
    hardshipGrantedNotice: 'Hardship application approved — statutory payment requirement cancelled.',
    closedFavorBonderTitle: 'e-SCN Closure / Release Certificate',
    closedFavorCbcTitle: 'e-Release Certificate — Demand Paid in Full',
    binLockedTitle: 'e-BIN Lock Notice',
    binLockedBody: 'No response to the Demand Notice was received within the prescribed time. The Bonder’s BIN has been locked in ASYCUDA via integration, and the License status has been changed to Suspended.',
    closureFlavors: {
      'writ-annulled': 'SCN declared Null & Void by High Court writ verdict. e-SCN Closure Order and Seized Materials Release Order issued.',
      'scn-closure-order': 'Response deemed satisfactory following hearing. e-SCN Closure Order issued.',
      'interim-order-release': 'High Court granted an Interim Order in favor of the Bonder. Seized Materials Release Order issued.',
      'high-court-release': 'High Court verdict nullified the Demand Note. e-Release Certificate issued.',
      'appellate-division-release': 'Appellate Division (Supreme Court) verdict nullified the Demand Note. e-Release Certificate issued.'
    },
    notifiedAllParties: 'Bonder and relevant CBC officials auto-notified. Audit Management updated where applicable.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'আইনি প্রক্রিয়া ব্যবস্থাপনা',
    subtitle: 'প্রাথমিক ই-এসসিএন অনুরোধ থেকে চূড়ান্ত সমাপ্তি বা বিআইএন লক পর্যন্ত সম্পূর্ণ শোকজ নোটিশ → জবাব/রিট → শুনানি → বিচারিক সিদ্ধান্ত → অন্তর্বর্তীকালীন আদেশ → ডিমান্ড নোটিশ → আপিল সিঁড়ি পরিচালনা করে।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    newScn: 'নতুন ই-এসসিএন অনুরোধ',
    openCases: 'চলমান মামলা',
    scnIssued: 'ই-এসসিএন ইস্যুকৃত (বন্ডকারীর জবাবের অপেক্ষায়)',
    underAdjudication: 'বিচারিক সিদ্ধান্তাধীন',
    demandPending: 'ডিমান্ড নোটিশ অপেক্ষমাণ',
    binLocked: 'বিআইএন লককৃত',
    closed: 'সমাপ্ত মামলা',
    searchPlaceholder: 'লাইসেন্স নং বা বন্ডকারীর নাম খুঁজুন…',
    filterAll: 'সকল ধাপ',
    tableHeaders: {
      id: 'মামলা আইডি',
      bonder: 'বন্ডকারী',
      source: 'উৎস',
      stage: 'ধাপ',
      action: ''
    },
    review: 'পর্যালোচনা',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো আইনি মামলা মেলেনি।',
    formTitle: 'নতুন ই-এসসিএন অনুরোধ',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বর দিয়ে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    submit: 'অনুরোধ দাখিল করুন',
    cancel: 'বাতিল করুন',
    sourceModuleLabel: 'অনুরোধকারী বিভাগ',
    requestNoteLabel: 'ই-নোট ও নথি — এসসিএন অনুরোধের কারণ',
    requestedNotice: 'ই-নোট ও নথির মাধ্যমে এসি/ডিসি-এর কাছে ই-এসসিএন অনুরোধ উত্থাপিত হয়েছে।',
    caseTitle: 'আইনি মামলা',
    historyTitle: 'মামলার ইতিহাস (ই-নোট ও নথি লগ)',
    licenseNo: 'বন্ড লাইসেন্স নং',
    requestNote: 'মূল অনুরোধের নোট',
    approveScn: 'এসসিএন অনুমোদন করুন ও ই-এসসিএন তৈরি করুন',
    issueScn: 'বন্ডকারীকে ই-এসসিএন ইস্যু করুন',
    scnNo: 'ই-এসসিএন নং',
    scnIssueDate: 'ইস্যুর তারিখ',
    responseDeadline: 'জবাবের শেষ তারিখ',
    fileWrit: 'বন্ডকারী রিট মামলা দায়ের করেন (হাইকোর্ট)',
    responseNoteLabel: 'বন্ডকারীর জবাব (ই-সংযুক্তি রেফারেন্সসহ)',
    submitResponse: 'জবাব দাখিল করুন',
    noResponseTime: 'কোনো জবাব পাওয়া যায়নি (সময় শেষ)',
    writVerdictTitle: 'রিট মামলার উপর হাইকোর্টের রায়',
    writFavorBonder: 'রায় বন্ডকারীর পক্ষে — এসসিএন বাতিল',
    writFavorCbc: 'রায় সিবিসি-এর পক্ষে — বন্ডকারীকে জবাব দিতে হবে',
    respondNowTitle: 'বন্ডকারীর জবাব (রিটের পর)',
    scheduleHearingTitle: 'শুনানির সময় নির্ধারণ',
    hearingDateLabel: 'শুনানির তারিখ',
    scheduleHearing: 'শুনানি নির্ধারণ করুন (ই-ক্যালেন্ডার)',
    hearingDate: 'শুনানির তারিখ',
    hearingOutcomeTitle: 'শুনানির ফলাফল',
    hearingSatisfactory: 'জবাব সন্তোষজনক — এসসিএন ক্লোজার অর্ডার ইস্যু করুন',
    hearingUnsatisfactory: 'জবাব অসন্তোষজনক — বিচারিক সিদ্ধান্তে এগিয়ে যান',
    adjudicationTitle: 'ই-বিচারিক আদেশ',
    adjudicationNoteLabel: 'বিচারিক আদেশ — ফলাফল ও সুপারিশ',
    issueAdjudication: 'ই-বিচারিক আদেশ জারি করুন',
    interimPursued: 'বন্ডকারী অন্তর্বর্তীকালীন আদেশের জন্য আবেদন করেন (হাইকোর্ট)',
    noInterim: 'কোনো অন্তর্বর্তীকালীন আদেশের আবেদন হয়নি — ডিমান্ড নোটিশ ইস্যু করুন',
    interimTitle: 'অন্তর্বর্তীকালীন আদেশ অপেক্ষমাণ (হাইকোর্ট)',
    interimApproved: 'হাইকোর্ট অনুমোদন করেছে — জব্দকৃত মালামাল ছাড়করণ আদেশ ইস্যু করুন',
    interimDisapproved: 'হাইকোর্ট অননুমোদন করেছে — ডিমান্ড নোটিশে এগিয়ে যান',
    demandNoticeTitle: 'ই-ডিমান্ড নোটিশ',
    demandAmountLabel: 'ডিমান্ড পরিমাণ (টাকা) — শুল্ক, জরিমানা, ট্যাক্স/ভ্যাট',
    issueDemandNotice: 'ই-ডিমান্ড নোটিশ ইস্যু করুন',
    demandNo: 'ডিমান্ড নোটিশ নং',
    demandAmount: 'ডিমান্ড পরিমাণ',
    payFull: 'বন্ডকারী সম্পূর্ণ ডিমান্ড নোট পরিশোধ করেন',
    pursueCommissionerate: 'বন্ডকারী আপিল কমিশনারেট/ট্রাইব্যুনালে আবেদন করেন',
    pursueHighCourt: 'বন্ডকারী হাইকোর্টে আবেদন করেন',
    pursueAppellateDivision: 'বন্ডকারী আপিল বিভাগে (সুপ্রিম কোর্ট) আবেদন করেন',
    noResponseDemand: 'সময়ের মধ্যে কোনো জবাব নেই — বিআইএন লক করুন',
    commissionerateTitle: 'আপিল কমিশনারেট/ট্রাইব্যুনালের রায়',
    verdictAdjustment: 'রায়: ডিমান্ড নোট সমন্বয়',
    verdictUphold: 'রায়: বর্তমান ডিমান্ড নোট বহাল',
    newAmountLabel: 'সংশোধিত ডিমান্ড পরিমাণ (টাকা)',
    verdictRecorded: 'রায় রেকর্ড করা হয়েছে',
    highCourtGateTitle: 'হাইকোর্টে এগিয়ে যাওয়ার পূর্বে',
    payStatutory: 'বন্ডকারী সংবিধিবদ্ধ শুল্ক পরিশোধ করেন (১০% নগদ + ১০% ট্রেজারি চালান)',
    fileHardship: 'হাইকোর্ট হার্ডশিপ আবেদন অনুমোদন করেছে',
    highCourtVerdictTitle: 'হাইকোর্টের রায়',
    verdictNullify: 'রায়: ডিমান্ড নোট বাতিল — ই-রিলিজ সার্টিফিকেট ইস্যু করুন',
    appellateDivisionVerdictTitle: 'আপিল বিভাগের (সুপ্রিম কোর্ট) রায়',
    statutoryPaid: 'সংবিধিবদ্ধ শুল্ক ইলেকট্রনিকভাবে পরিশোধ করা হয়েছে।',
    hardshipGrantedNotice: 'হার্ডশিপ আবেদন অনুমোদিত হয়েছে — সংবিধিবদ্ধ পেমেন্টের প্রয়োজনীয়তা বাতিল করা হয়েছে।',
    closedFavorBonderTitle: 'ই-এসসিএন ক্লোজার / রিলিজ সার্টিফিকেট',
    closedFavorCbcTitle: 'ই-রিলিজ সার্টিফিকেট — ডিমান্ড সম্পূর্ণ পরিশোধিত',
    binLockedTitle: 'ই-বিআইএন লক নোটিশ',
    binLockedBody: 'নির্ধারিত সময়ের মধ্যে ডিমান্ড নোটিশের কোনো জবাব পাওয়া যায়নি। ইন্টিগ্রেশনের মাধ্যমে বন্ডকারীর বিআইএন অ্যাসাইকুডায় লক করা হয়েছে, এবং লাইসেন্স স্ট্যাটাস স্থগিত করা হয়েছে।',
    closureFlavors: {
      'writ-annulled': 'হাইকোর্টের রিট রায়ে এসসিএন বাতিল ঘোষিত। ই-এসসিএন ক্লোজার অর্ডার ও জব্দকৃত মালামাল ছাড়করণ আদেশ ইস্যু করা হয়েছে।',
      'scn-closure-order': 'শুনানির পর জবাব সন্তোষজনক বিবেচিত হয়েছে। ই-এসসিএন ক্লোজার অর্ডার ইস্যু করা হয়েছে।',
      'interim-order-release': 'হাইকোর্ট বন্ডকারীর পক্ষে অন্তর্বর্তীকালীন আদেশ প্রদান করেছে। জব্দকৃত মালামাল ছাড়করণ আদেশ ইস্যু করা হয়েছে।',
      'high-court-release': 'হাইকোর্টের রায়ে ডিমান্ড নোট বাতিল হয়েছে। ই-রিলিজ সার্টিফিকেট ইস্যু করা হয়েছে।',
      'appellate-division-release': 'আপিল বিভাগের (সুপ্রিম কোর্ট) রায়ে ডিমান্ড নোট বাতিল হয়েছে। ই-রিলিজ সার্টিফিকেট ইস্যু করা হয়েছে।'
    },
    notifiedAllParties: 'বন্ডকারী ও সংশ্লিষ্ট সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে। প্রযোজ্য ক্ষেত্রে অডিট ব্যবস্থাপনা আপডেট করা হয়েছে।'
  }
};
type T = typeof T['en'];
export function LegalProcedures({
  language,
  onDone
}: LegalProceduresProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'new-scn'>('dashboard');
  const [cases, setCases] = useState<LegalCase[]>(seedCases);
  const [selected, setSelected] = useState<LegalCase | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | CaseStage>('all');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const counts = useMemo(() => ({
    open: cases.filter(c => !['closed-favor-bonder', 'closed-favor-cbc', 'bin-locked'].includes(c.stage)).length,
    scnIssued: cases.filter(c => c.stage === 'scn-issued').length,
    adjudication: cases.filter(c => c.stage === 'adjudication').length,
    demandPending: cases.filter(c => c.stage === 'demand-notice' || c.stage === 'appellate-commissionerate' || c.stage === 'high-court' || c.stage === 'appellate-division').length,
    binLocked: cases.filter(c => c.stage === 'bin-locked').length,
    closed: cases.filter(c => c.stage === 'closed-favor-bonder' || c.stage === 'closed-favor-cbc').length
  }), [cases]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cases.filter(c => {
      const lic = licenseOf(c.licenseNo);
      const matchesQuery = !q || c.licenseNo.toLowerCase().includes(q) || (lic?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesFilter = filter === 'all' || c.stage === filter;
      return matchesQuery && matchesFilter;
    });
  }, [cases, search, filter]);
  const handleUpdate = (updated: LegalCase) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
  };
  if (view === 'new-scn') {
    return <NewScnForm language={language} t={t} onCancel={() => setView('dashboard')} onSubmit={c => {
      setCases(prev => [c, ...prev]);
      setView('dashboard');
      showToast(t.requestedNotice);
    }} />;
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
        <button type="button" onClick={() => setView('new-scn')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
          <Icon name="add_circle" className="text-[16px]" />
          {t.newScn}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon="folder_open" label={t.openCases} value={counts.open} color="#0A4D8C" />
        <StatCard icon="mark_email_unread" label={t.scnIssued} value={counts.scnIssued} color="#1E88E5" />
        <StatCard icon="gavel" label={t.underAdjudication} value={counts.adjudication} color="#B45309" />
        <StatCard icon="receipt_long" label={t.demandPending} value={counts.demandPending} color="#B45309" />
        <StatCard icon="lock" label={t.binLocked} value={counts.binLocked} color="#DC2626" />
        <StatCard icon="task_alt" label={t.closed} value={counts.closed} color="#00A86B" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as any)} className={`${inputClass} sm:w-64`}>
          <option value="all">{t.filterAll}</option>
          {Object.keys(stageLabels).map(s => <option key={s} value={s}>{stageLabels[s as CaseStage][language]}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.tableHeaders.id}</th>
              <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
              <th className="px-4 py-3">{t.tableHeaders.source}</th>
              <th className="px-4 py-3">{t.tableHeaders.stage}</th>
              <th className="px-4 py-3">{t.tableHeaders.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
            const lic = licenseOf(c.licenseNo);
            return <tr key={c.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{c.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{c.licenseNo}</p>
                  </td>
                  <td className="px-4 py-3 text-[#334155]">{sourceModuleLabels[c.sourceModule][language]}</td>
                  <td className="px-4 py-3"><StageBadge stage={c.stage} language={language} /></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(c)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                      {t.review}
                    </button>
                  </td>
                </tr>;
          })}
            {filtered.length === 0 && <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#94A3B8]">{t.noResults}</td>
              </tr>}
          </tbody>
        </table>
      </div>

      {selected && <CaseDrawer legalCase={selected} language={language} t={t} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
    </div>;
}
function NewScnForm({
  language,
  t,
  onCancel,
  onSubmit
}: {
  language: Language;
  t: T;
  onCancel: () => void;
  onSubmit: (c: LegalCase) => void;
}) {
  const [licenseNo, setLicenseNo] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [sourceModule, setSourceModule] = useState<SourceModule>('audit');
  const [note, setNote] = useState('');
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
  const canSubmit = verifiedLicense && note.trim();
  return <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.formTitle}</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#1E293B]">{t.formTitle}</h1>
      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <Field label={t.licenseNo}>
          <div className="flex gap-2">
            <TextInput value={licenseNo} onChange={v => {
            setLicenseNo(v);
            setVerifiedLicense(undefined);
            setNotFound(false);
          }} placeholder="BL-2022-01876" />
            <button type="button" onClick={verify} className="shrink-0 rounded-lg bg-[#0A4D8C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#083E71]">
              {t.verify}
            </button>
          </div>
          {notFound && <p className="mt-1 text-[11px] font-medium text-[#DC2626]">{t.notFound}</p>}
        </Field>
        {verifiedLicense && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
            <Icon name="check_circle" className="text-[16px]" />
            {verifiedLicense.licenseNo} · {t.verified} · {verifiedLicense.nameEn}
          </div>}
        <Field label={t.sourceModuleLabel}>
          <div className="flex gap-2">
            {(['audit', 'prevention'] as const).map(m => <button key={m} type="button" onClick={() => setSourceModule(m)} className={['rounded-full px-4 py-2 text-xs font-semibold transition-colors', sourceModule === m ? 'bg-[#0A4D8C] text-white' : 'border border-[#CBD5E1] text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
                {sourceModuleLabels[m][language]}
              </button>)}
          </div>
        </Field>
        <Field label={t.requestNoteLabel}>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} className={inputClass} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className={ACTION_BTN_OUTLINE}>
            {t.cancel}
          </button>
          <button type="button" disabled={!canSubmit} onClick={() => {
          if (!verifiedLicense) return;
          onSubmit({
            id: `LC-2026-${100 + Math.floor(Math.random() * 800)}`,
            licenseNo: verifiedLicense.licenseNo,
            sourceModule,
            requestNote: note.trim(),
            stage: 'scn-requested',
            history: [{
              date: '26 Jul 2026',
              actionEn: `e-SCN request raised via e-Note & Nothi by ${sourceModuleLabels[sourceModule].en} section to AC/DC.`,
              actionBn: `${sourceModuleLabels[sourceModule].bn} বিভাগ কর্তৃক ই-নোট ও নথির মাধ্যমে এসি/ডিসি-এর কাছে ই-এসসিএন অনুরোধ উত্থাপিত।`
            }]
          });
        }} className={`${ACTION_BTN} disabled:opacity-50`}>
            {t.submit}
          </button>
        </div>
      </div>
    </div>;
}
function CaseDrawer({
  legalCase: c,
  language,
  t,
  onClose,
  onUpdate
}: {
  legalCase: LegalCase;
  language: Language;
  t: T;
  onClose: () => void;
  onUpdate: (c: LegalCase) => void;
}) {
  const lic = licenseOf(c.licenseNo);
  const [responseText, setResponseText] = useState('');
  const [hearingDate, setHearingDate] = useState('05 Sep 2026');
  const [adjudicationNote, setAdjudicationNote] = useState('');
  const [demandAmount, setDemandAmount] = useState('250000');
  const [revisedAmount, setRevisedAmount] = useState(String(c.demandNoticeAmount ?? 250000));
  const update = (patch: Partial<LegalCase>, actionEn: string, actionBn: string) => {
    onUpdate({
      ...c,
      ...patch,
      history: [...c.history, {
        date: '26 Jul 2026',
        actionEn,
        actionBn
      }]
    });
  };
  const escalationLevel = c.appellateDivisionVerdict ? 3 : c.highCourtVerdict ? 2 : c.appellateCommissionerateVerdict ? 1 : 0;
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.caseTitle}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-[#0A4D8C]">{c.id}</span>
            <StageBadge stage={c.stage} language={language} />
            <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#334155]">{sourceModuleLabels[c.sourceModule][language]}</span>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <p className="font-medium text-[#1E293B]">{lic?.nameEn} · {c.licenseNo}</p>
            <p className="mt-1 text-[13px] text-[#334155]">{c.requestNote}</p>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#334155]">{t.historyTitle}</p>
            <div className="relative flex flex-col gap-3 pl-5">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-[#CBD5E1]" />
              {c.history.map((h, i) => <div key={i} className="relative">
                  <span className="absolute -left-5 top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#0A4D8C]" />
                  <p className="text-[11px] text-[#94A3B8]">{h.date}</p>
                  <p className="text-[13px] text-[#334155]">{language === 'en' ? h.actionEn : h.actionBn}</p>
                </div>)}
            </div>
          </div>

          {c.stage === 'scn-requested' && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <button type="button" onClick={() => update({
            stage: 'scn-approved'
          }, 'AC/DC approved the SCN request and generated e-SCN.', 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন এবং ই-এসসিএন তৈরি করেছেন।')} className={`${ACTION_BTN} w-fit`}>
                <Icon name="task_alt" className="text-[14px]" />
                {t.approveScn}
              </button>
            </div>}

          {c.stage === 'scn-approved' && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <button type="button" onClick={() => update({
            stage: 'scn-issued',
            scnNo: `SCN-2026-${1000 + Math.floor(Math.random() * 900)}`,
            scnIssueDate: '26 Jul 2026',
            responseDeadline: '26 Aug 2026'
          }, 'e-SCN issued to Bonder; Bonder Profile and Audit Management notified. Response due within prescribed time.', 'বন্ডকারীকে ই-এসসিএন ইস্যু করা হয়েছে; বন্ডকারী প্রোফাইল ও অডিট ব্যবস্থাপনাকে অবহিত করা হয়েছে। নির্ধারিত সময়ের মধ্যে জবাব দিতে হবে।')} className={`${ACTION_BTN} w-fit`}>
                <Icon name="send" className="text-[14px]" />
                {t.issueScn}
              </button>
            </div>}

          {c.stage === 'scn-issued' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <div className="grid grid-cols-2 gap-2 text-[12px] text-[#64748B]">
                <p>{t.scnNo}: <span className="font-semibold text-[#1E293B]">{c.scnNo}</span></p>
                <p>{t.responseDeadline}: <span className="font-semibold text-[#1E293B]">{c.responseDeadline}</span></p>
              </div>
              <button type="button" onClick={() => update({
            stage: 'writ-filed',
            writFiled: true
          }, 'Bonder filed a writ case in High Court to nullify the SCN without responding. CBC officials notified.', 'বন্ডকারী জবাব না দিয়ে এসসিএন বাতিলের জন্য হাইকোর্টে রিট মামলা দায়ের করেছেন। সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।')} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                <Icon name="gavel" className="text-[14px]" />
                {t.fileWrit}
              </button>
              <Field label={t.responseNoteLabel}>
                <textarea value={responseText} onChange={e => setResponseText(e.target.value)} rows={2} className={inputClass} />
              </Field>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={!responseText.trim()} onClick={() => update({
              stage: 'scn-response',
              bonderResponse: responseText.trim()
            }, 'Bonder submitted response with attached documents.', 'বন্ডকারী সংযুক্ত নথিসহ জবাব দাখিল করেছেন।')} className={`${ACTION_BTN} disabled:opacity-50`}>
                  {t.submitResponse}
                </button>
                <button type="button" onClick={() => update({
              stage: 'adjudication',
              bonderResponse: 'No response received within the prescribed time.'
            }, 'No response received within prescribed time. Case forwarded to Adjudication.', 'নির্ধারিত সময়ের মধ্যে কোনো জবাব পাওয়া যায়নি। মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।')} className={ACTION_BTN_OUTLINE}>
                  {t.noResponseTime}
                </button>
              </div>
            </div>}

          {c.stage === 'writ-filed' && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.writVerdictTitle}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'closed-favor-bonder',
              closureFlavor: 'writ-annulled',
              writVerdict: 'favor-bonder'
            }, 'High Court writ verdict favors Bonder — SCN declared Null & Void. e-SCN Closure Order and Seized Materials Release Order issued.', 'হাইকোর্টের রিট রায় বন্ডকারীর পক্ষে — এসসিএন বাতিল ঘোষিত। ই-এসসিএন ক্লোজার অর্ডার ও জব্দকৃত মালামাল ছাড়করণ আদেশ ইস্যু করা হয়েছে।')} className={`${ACTION_BTN_GREEN} w-fit`}>
                  {t.writFavorBonder}
                </button>
                <button type="button" onClick={() => update({
              stage: 'scn-response',
              writVerdict: 'favor-cbc'
            }, 'High Court writ verdict favors CBC. Bonder must now respond to the SCN.', 'হাইকোর্টের রিট রায় সিবিসি-এর পক্ষে। বন্ডকারীকে এখন এসসিএন-এর জবাব দিতে হবে।')} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                  {t.writFavorCbc}
                </button>
              </div>
            </div>}

          {c.stage === 'scn-response' && !c.bonderResponse && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.respondNowTitle}</p>
              <Field label={t.responseNoteLabel}>
                <textarea value={responseText} onChange={e => setResponseText(e.target.value)} rows={2} className={inputClass} />
              </Field>
              <button type="button" disabled={!responseText.trim()} onClick={() => update({
            bonderResponse: responseText.trim()
          }, 'Bonder submitted response with attached documents.', 'বন্ডকারী সংযুক্ত নথিসহ জবাব দাখিল করেছেন।')} className={`${ACTION_BTN} w-fit disabled:opacity-50`}>
                {t.submitResponse}
              </button>
            </div>}

          {c.stage === 'scn-response' && c.bonderResponse && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] text-[#334155]">{c.bonderResponse}</p>
              <p className="text-[13px] font-bold text-[#1E293B]">{t.scheduleHearingTitle}</p>
              <Field label={t.hearingDateLabel}>
                <TextInput value={hearingDate} onChange={setHearingDate} />
              </Field>
              <button type="button" onClick={() => update({
            stage: 'hearing-scheduled',
            hearingDate
          }, `Hearing scheduled for ${hearingDate} via e-Calendar; details recorded via e-Note & Nothi.`, `ই-ক্যালেন্ডারের মাধ্যমে ${hearingDate} তারিখে শুনানি নির্ধারিত; ই-নোট ও নথির মাধ্যমে বিস্তারিত রেকর্ড করা হয়েছে।`)} className={`${ACTION_BTN} w-fit`}>
                <Icon name="event" className="text-[14px]" />
                {t.scheduleHearing}
              </button>
            </div>}

          {c.stage === 'hearing-scheduled' && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[12px] text-[#64748B]">{t.hearingDate}: <span className="font-semibold text-[#1E293B]">{c.hearingDate}</span></p>
              <p className="text-[13px] font-bold text-[#1E293B]">{t.hearingOutcomeTitle}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'closed-favor-bonder',
              closureFlavor: 'scn-closure-order'
            }, 'Response deemed satisfactory following hearing. e-SCN Closure Order issued. Bonder and stakeholders auto-notified.', 'শুনানির পর জবাব সন্তোষজনক বিবেচিত হয়েছে। ই-এসসিএন ক্লোজার অর্ডার ইস্যু করা হয়েছে। বন্ডকারী ও স্টেকহোল্ডারদের অবহিত করা হয়েছে।')} className={`${ACTION_BTN_GREEN} w-fit`}>
                  {t.hearingSatisfactory}
                </button>
                <button type="button" onClick={() => update({
              stage: 'adjudication'
            }, 'Response deemed unsatisfactory following hearing. Case forwarded to Adjudication.', 'শুনানির পর জবাব অসন্তোষজনক বিবেচিত হয়েছে। মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।')} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                  {t.hearingUnsatisfactory}
                </button>
              </div>
            </div>}

          {c.stage === 'adjudication' && !c.adjudicationNote && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.adjudicationTitle}</p>
              <Field label={t.adjudicationNoteLabel}>
                <textarea value={adjudicationNote} onChange={e => setAdjudicationNote(e.target.value)} rows={3} className={inputClass} />
              </Field>
              <button type="button" disabled={!adjudicationNote.trim()} onClick={() => update({
            adjudicationNote: adjudicationNote.trim()
          }, 'e-Adjudication Order issued. All relevant parties and officials notified.', 'ই-বিচারিক আদেশ জারি করা হয়েছে। সকল সংশ্লিষ্ট পক্ষ ও কর্মকর্তাদের অবহিত করা হয়েছে।')} className={`${ACTION_BTN} w-fit disabled:opacity-50`}>
                <Icon name="balance" className="text-[14px]" />
                {t.issueAdjudication}
              </button>
            </div>}

          {c.stage === 'adjudication' && c.adjudicationNote && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] text-[#334155]">{c.adjudicationNote}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'interim-order-pending'
            }, 'Bonder pursued an Interim Order at High Court following unsatisfactory Adjudication outcome. Application status pending.', 'অসন্তোষজনক বিচারিক সিদ্ধান্তের পর বন্ডকারী হাইকোর্টে অন্তর্বর্তীকালীন আদেশের জন্য আবেদন করেছেন। আবেদনের অবস্থা অপেক্ষমাণ।')} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                  {t.interimPursued}
                </button>
                <button type="button" onClick={() => update({
              stage: 'demand-notice'
            }, 'No Interim Order pursued within prescribed time. Proceeding to Demand Notice.', 'নির্ধারিত সময়ের মধ্যে কোনো অন্তর্বর্তীকালীন আদেশের আবেদন হয়নি। ডিমান্ড নোটিশে এগিয়ে যাওয়া হচ্ছে।')} className={`${ACTION_BTN} w-fit`}>
                  {t.noInterim}
                </button>
              </div>
            </div>}

          {c.stage === 'interim-order-pending' && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.interimTitle}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'closed-favor-bonder',
              closureFlavor: 'interim-order-release',
              interimOrderVerdict: 'approved'
            }, 'High Court approved the Interim Order. Seized Materials Release Order issued. Bonder and CBC officials notified.', 'হাইকোর্ট অন্তর্বর্তীকালীন আদেশ অনুমোদন করেছে। জব্দকৃত মালামাল ছাড়করণ আদেশ ইস্যু করা হয়েছে। বন্ডকারী ও সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।')} className={`${ACTION_BTN_GREEN} w-fit`}>
                  {t.interimApproved}
                </button>
                <button type="button" onClick={() => update({
              stage: 'demand-notice',
              interimOrderVerdict: 'disapproved'
            }, 'High Court disapproved the Interim Order. Proceeding to Demand Notice.', 'হাইকোর্ট অন্তর্বর্তীকালীন আদেশ অননুমোদন করেছে। ডিমান্ড নোটিশে এগিয়ে যাওয়া হচ্ছে।')} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                  {t.interimDisapproved}
                </button>
              </div>
            </div>}

          {c.stage === 'demand-notice' && !c.demandNoticeNo && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.demandNoticeTitle}</p>
              <Field label={t.demandAmountLabel}>
                <TextInput value={demandAmount} onChange={setDemandAmount} type="number" />
              </Field>
              <button type="button" onClick={() => update({
            demandNoticeNo: `DN-2026-${1000 + Math.floor(Math.random() * 900)}`,
            demandNoticeAmount: Number(demandAmount) || 0
          }, `e-Demand Notice issued for ৳${Number(demandAmount).toLocaleString()} (duty, fine, tax/VAT).`, `শুল্ক, জরিমানা, ট্যাক্স/ভ্যাটসহ ৳${Number(demandAmount).toLocaleString()} পরিমাণের জন্য ই-ডিমান্ড নোটিশ জারি করা হয়েছে।`)} className={`${ACTION_BTN} w-fit`}>
                <Icon name="receipt_long" className="text-[14px]" />
                {t.issueDemandNotice}
              </button>
            </div>}

          {c.stage === 'demand-notice' && c.demandNoticeNo && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <div className="grid grid-cols-2 gap-2 text-[12px] text-[#64748B]">
                <p>{t.demandNo}: <span className="font-semibold text-[#1E293B]">{c.demandNoticeNo}</span></p>
                <p>{t.demandAmount}: <span className="font-semibold text-[#1E293B]">৳{(c.demandNoticeAmount ?? 0).toLocaleString()}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'closed-favor-cbc'
            }, 'Bonder paid the full Demand Note amount electronically via e-Chalan. Case closed and e-Release Certificate auto-generated.', 'বন্ডকারী ই-চালানের মাধ্যমে সম্পূর্ণ ডিমান্ড নোট পরিমাণ ইলেকট্রনিকভাবে পরিশোধ করেছেন। মামলাটি বন্ধ করা হয়েছে এবং ই-রিলিজ সার্টিফিকেট স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।')} className={`${ACTION_BTN_GREEN} w-fit`}>
                  {t.payFull}
                </button>
                {escalationLevel < 3 && <button type="button" onClick={() => {
              if (escalationLevel === 0) update({
                stage: 'appellate-commissionerate'
              }, 'Bonder filed for re-evaluation at Appellate Commissionerate/Tribunal. CBC officials notified.', 'বন্ডকারী পুনর্মূল্যায়নের জন্য আপিল কমিশনারেট/ট্রাইব্যুনালে আবেদন করেছেন। সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।');else if (escalationLevel === 1) update({
                stage: 'high-court'
              }, 'Bonder pursued High Court for re-evaluation. Notified to make statutory payment prior to hearing.', 'বন্ডকারী পুনর্মূল্যায়নের জন্য হাইকোর্টে আবেদন করেছেন। শুনানির পূর্বে সংবিধিবদ্ধ পেমেন্টের জন্য অবহিত করা হয়েছে।');else update({
                stage: 'appellate-division'
              }, 'Bonder pursued Appellate Division (Supreme Court) for re-evaluation.', 'বন্ডকারী পুনর্মূল্যায়নের জন্য আপিল বিভাগে (সুপ্রিম কোর্ট) আবেদন করেছেন।');
            }} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                    {escalationLevel === 0 ? t.pursueCommissionerate : escalationLevel === 1 ? t.pursueHighCourt : t.pursueAppellateDivision}
                  </button>}
                <button type="button" onClick={() => update({
              stage: 'bin-locked'
            }, 'No response to Demand Notice received within prescribed time. BIN locked in ASYCUDA via integration. License status changed to Suspended.', 'নির্ধারিত সময়ের মধ্যে ডিমান্ড নোটিশের কোনো জবাব পাওয়া যায়নি। ইন্টিগ্রেশনের মাধ্যমে অ্যাসাইকুডায় বিআইএন লক করা হয়েছে। লাইসেন্স স্ট্যাটাস স্থগিত করা হয়েছে।')} className={`${ACTION_BTN_RED} w-fit`}>
                  {t.noResponseDemand}
                </button>
              </div>
            </div>}

          {c.stage === 'appellate-commissionerate' && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.commissionerateTitle}</p>
              <Field label={t.newAmountLabel}>
                <TextInput value={revisedAmount} onChange={setRevisedAmount} type="number" />
              </Field>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'demand-notice',
              appellateCommissionerateVerdict: 'adjustment',
              demandNoticeAmount: Number(revisedAmount) || c.demandNoticeAmount
            }, `Appellate Commissionerate verdict: adjustment of Demand Note to ৳${Number(revisedAmount).toLocaleString()}. System edited and re-issued the e-Demand Note. Bonder auto-notified to pay.`, `আপিল কমিশনারেটের রায়: ডিমান্ড নোট ৳${Number(revisedAmount).toLocaleString()}-এ সমন্বয়। সিস্টেম ই-ডিমান্ড নোট সম্পাদনা করে পুনরায় ইস্যু করেছে। বন্ডকারীকে পরিশোধের জন্য অবহিত করা হয়েছে।`)} className={`${ACTION_BTN} w-fit`}>
                  {t.verdictAdjustment}
                </button>
                <button type="button" onClick={() => update({
              stage: 'demand-notice',
              appellateCommissionerateVerdict: 'uphold'
            }, 'Appellate Commissionerate verdict: uphold current Demand Notice. Bonder notified to pay the previously issued e-Demand Note.', 'আপিল কমিশনারেটের রায়: বর্তমান ডিমান্ড নোটিশ বহাল। বন্ডকারীকে পূর্বে ইস্যুকৃত ই-ডিমান্ড নোট পরিশোধের জন্য অবহিত করা হয়েছে।')} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                  {t.verdictUphold}
                </button>
              </div>
            </div>}

          {c.stage === 'high-court' && !c.statutoryPaymentDone && !c.hardshipGranted && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.highCourtGateTitle}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              statutoryPaymentDone: true
            }, 'Bonder paid statutory duty (10% cash + 10% treasury chalan) electronically via e-Chalan/Payment Gateway.', 'বন্ডকারী ইলেকট্রনিকভাবে সংবিধিবদ্ধ শুল্ক পরিশোধ করেছেন (১০% নগদ + ১০% ট্রেজারি চালান)।')} className={`${ACTION_BTN} w-fit`}>
                  <Icon name="payments" className="text-[14px]" />
                  {t.payStatutory}
                </button>
                <button type="button" onClick={() => update({
              hardshipGranted: true
            }, 'Bonder filed for Hardship at High Court; approved. Statutory payment requirement cancelled for this Bonder.', 'বন্ডকারী হাইকোর্টে হার্ডশিপের জন্য আবেদন করেছেন; অনুমোদিত হয়েছে। এই বন্ডকারীর জন্য সংবিধিবদ্ধ পেমেন্টের প্রয়োজনীয়তা বাতিল করা হয়েছে।')} className={`${ACTION_BTN_OUTLINE} w-fit`}>
                  {t.fileHardship}
                </button>
              </div>
            </div>}

          {c.stage === 'high-court' && (c.statutoryPaymentDone || c.hardshipGranted) && !c.highCourtVerdict && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              {c.statutoryPaymentDone && <p className="text-[12px] text-[#00A86B]">{t.statutoryPaid}</p>}
              {c.hardshipGranted && <p className="text-[12px] text-[#00A86B]">{t.hardshipGrantedNotice}</p>}
              <p className="text-[13px] font-bold text-[#1E293B]">{t.highCourtVerdictTitle}</p>
              <Field label={t.newAmountLabel}>
                <TextInput value={revisedAmount} onChange={setRevisedAmount} type="number" />
              </Field>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'closed-favor-bonder',
              closureFlavor: 'high-court-release',
              highCourtVerdict: 'nullify'
            }, 'High Court verdict: nullify the Demand Note. e-Release Certificate issued to Bonder. Audit Management updated.', 'হাইকোর্টের রায়: ডিমান্ড নোটিশ বাতিল। বন্ডকারীকে ই-রিলিজ সার্টিফিকেট ইস্যু করা হয়েছে। অডিট ব্যবস্থাপনা আপডেট করা হয়েছে।')} className={`${ACTION_BTN_GREEN} w-fit`}>
                  {t.verdictNullify}
                </button>
                <button type="button" onClick={() => update({
              stage: 'demand-notice',
              highCourtVerdict: 'adjustment',
              demandNoticeAmount: Number(revisedAmount) || c.demandNoticeAmount
            }, `High Court verdict: adjustment of Demand Note to ৳${Number(revisedAmount).toLocaleString()}. System edited and re-issued the e-Demand Note. Bonder auto-notified to pay.`, `হাইকোর্টের রায়: ডিমান্ড নোট ৳${Number(revisedAmount).toLocaleString()}-এ সমন্বয়। বন্ডকারীকে পরিশোধের জন্য অবহিত করা হয়েছে।`)} className={ACTION_BTN}>
                  {t.verdictAdjustment}
                </button>
                <button type="button" onClick={() => update({
              stage: 'demand-notice',
              highCourtVerdict: 'uphold'
            }, 'High Court verdict: uphold current Demand Notice. Bonder notified to pay the previously issued e-Demand Note.', 'হাইকোর্টের রায়: বর্তমান ডিমান্ড নোটিশ বহাল। বন্ডকারীকে পূর্বে ইস্যুকৃত ই-ডিমান্ড নোট পরিশোধের জন্য অবহিত করা হয়েছে।')} className={ACTION_BTN_OUTLINE}>
                  {t.verdictUphold}
                </button>
              </div>
            </div>}

          {c.stage === 'appellate-division' && <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.appellateDivisionVerdictTitle}</p>
              <Field label={t.newAmountLabel}>
                <TextInput value={revisedAmount} onChange={setRevisedAmount} type="number" />
              </Field>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update({
              stage: 'closed-favor-bonder',
              closureFlavor: 'appellate-division-release',
              appellateDivisionVerdict: 'nullify'
            }, 'Appellate Division (Supreme Court) verdict: nullify the Demand Note. e-Release Certificate issued.', 'আপিল বিভাগের (সুপ্রিম কোর্ট) রায়: ডিমান্ড নোট বাতিল। ই-রিলিজ সার্টিফিকেট ইস্যু করা হয়েছে।')} className={`${ACTION_BTN_GREEN} w-fit`}>
                  {t.verdictNullify}
                </button>
                <button type="button" onClick={() => update({
              stage: 'demand-notice',
              appellateDivisionVerdict: 'adjustment',
              demandNoticeAmount: Number(revisedAmount) || c.demandNoticeAmount
            }, `Appellate Division verdict: adjustment of Demand Note to ৳${Number(revisedAmount).toLocaleString()}. System edited and re-issued the e-Demand Note. Bonder auto-notified to pay.`, `আপিল বিভাগের রায়: ডিমান্ড নোট ৳${Number(revisedAmount).toLocaleString()}-এ সমন্বয়। বন্ডকারীকে পরিশোধের জন্য অবহিত করা হয়েছে।`)} className={ACTION_BTN}>
                  {t.verdictAdjustment}
                </button>
                <button type="button" onClick={() => update({
              stage: 'demand-notice',
              appellateDivisionVerdict: 'uphold'
            }, 'Appellate Division verdict: uphold current Demand Notice. Bonder notified to pay the previously issued e-Demand Note — this is the final jurisdiction.', 'আপিল বিভাগের রায়: বর্তমান ডিমান্ড নোটিশ বহাল। বন্ডকারীকে পূর্বে ইস্যুকৃত ই-ডিমান্ড নোট পরিশোধের জন্য অবহিত করা হয়েছে — এটি চূড়ান্ত এখতিয়ার।')} className={ACTION_BTN_OUTLINE}>
                  {t.verdictUphold}
                </button>
              </div>
            </div>}

          {c.stage === 'closed-favor-bonder' && c.closureFlavor && <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-[13px] text-[#087F52]">
              <p className="flex items-center gap-1.5 text-base font-bold"><Icon name="verified" className="text-[20px]" />{t.closedFavorBonderTitle}</p>
              <p className="mt-2">{t.closureFlavors[c.closureFlavor]}</p>
              <p className="mt-2 text-[#64748B]">{t.notifiedAllParties}</p>
            </div>}

          {c.stage === 'closed-favor-cbc' && <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-[13px] text-[#087F52]">
              <p className="flex items-center gap-1.5 text-base font-bold"><Icon name="receipt_long" className="text-[20px]" />{t.closedFavorCbcTitle}</p>
              <p className="mt-2">{t.demandNo}: {c.demandNoticeNo} · {t.demandAmount}: ৳{(c.demandNoticeAmount ?? 0).toLocaleString()}</p>
              <p className="mt-2 text-[#64748B]">{t.notifiedAllParties}</p>
            </div>}

          {c.stage === 'bin-locked' && <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-[13px] text-[#B91C1C]">
              <p className="flex items-center gap-1.5 text-base font-bold"><Icon name="lock" className="text-[20px]" />{t.binLockedTitle}</p>
              <p className="mt-2">{t.binLockedBody}</p>
            </div>}
        </div>
      </div>
    </div>;
}
