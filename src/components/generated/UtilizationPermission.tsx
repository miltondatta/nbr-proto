import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { udRecords } from './udData';
import { autoAssignOfficer, coefficientMatchFor, licenseOf, stageLabels, udRecordFor, upApplications as seedApplications, type UpApplication, type UpRawMaterialLine, type UpStage } from './upData';
type Language = 'en' | 'bn';
interface UtilizationPermissionProps {
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
function StageBadge({
  stage,
  language
}: {
  stage: UpStage;
  language: Language;
}) {
  const color = stage === 'approved' ? '#00A86B' : stage === 'disapproved' || stage === 'reverted' ? '#DC2626' : '#B45309';
  const s = stageLabels[stage];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${color}1A`,
    color
  }}>
      {s[language]}
    </span>;
}
const normalizeLicenseNo = (s: string) => s.trim().toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, '');
const attachmentDefs = [{
  id: 'productionSchedule',
  en: 'Production Schedule',
  bn: 'উৎপাদন সময়সূচী'
}, {
  id: 'buyerOrder',
  en: 'Buyer Order / Contract',
  bn: 'ক্রেতার আদেশ / চুক্তি'
}];
function calcVariancePct(requested: number, calculated: number): number {
  if (calculated === 0) return 0;
  return Math.abs((requested - calculated) / calculated) * 100;
}
const stageOrder: UpStage[] = ['submitted', 'assignment', 'verification', 'usage-validation', 'pending-approval', 'approved'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Utilization Permission (UP) Management',
    subtitle: 'Bonders apply for permission to use raw materials against a finished-goods order; the system auto-verifies bonder status, cross-checks against UD and Co-efficient data, and routes the application to ADC/JC or AC/DC based on value before e-UP issuance.',
    backToDashboard: 'Back to Dashboard',
    newApplication: 'New UP Application',
    pending: 'Pending Applications',
    approved: 'Approved',
    disapproved: 'Disapproved',
    reverted: 'Reverted to Bonder',
    searchPlaceholder: 'Search by license no. or bonder name…',
    filterAll: 'All Stages',
    tableHeaders: {
      id: 'UP ID',
      bonder: 'Bonder',
      finishedGoods: 'Finished Goods HS',
      value: 'UP Value (Taka)',
      stage: 'Stage',
      action: ''
    },
    review: 'Review',
    noResults: 'No UP applications match the current filters.',
    formTitle: 'Utilization Permission — Application',
    step1: 'Select License',
    step2: 'Finished Goods & UD Linkage',
    step3: 'Raw Materials, Attachments & Payment',
    step4: 'Review & Submit',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    basedOnUd: 'This application is based on an existing UD',
    selectUd: 'Select UD',
    noUdForLicense: 'No approved UD found for this license — application will proceed without UD cross-check.',
    trustedBuyer: 'Trusted Buyer Order (deemed authentic — skips manual usage validation)',
    hsCodeLabel: 'Finished Goods HS Code',
    descriptionLabel: 'Finished Goods Description',
    qtyDozenLabel: 'Finished Goods Quantity (dozens)',
    rawMaterialsTitle: 'Requested Raw Materials',
    rawHsLabel: 'HS Code',
    rawDescLabel: 'Description',
    rawQtyLabel: 'Requested Quantity',
    rawUnitLabel: 'Unit',
    addLine: 'Add Raw Material Line',
    upValueLabel: 'UP Value (Taka)',
    attachmentsTitle: 'Supporting Attachments (e-Attachment)',
    attach: 'Attach',
    attached: 'Attached',
    paymentTitle: 'e-Payment',
    payNow: 'Pay via e-Chalan / Payment Gateway',
    paid: 'Payment Confirmed',
    reviewTitle: 'Review Application',
    submittedNotice: 'Application submitted. e-Bond Register updated. Bonder & CBC officials auto-notified.',
    pipelineTitle: 'UP Application Pipeline',
    autoChecklistTitle: 'e-Checklist & e-Bond Register',
    checklistComplete: 'All required documents attached — e-checklist passed.',
    bondRegisterEntry: 'Application auto-recorded in e-Bond Register.',
    notificationSent: 'Bonder & CBC officials auto-notified of submission.',
    assignProceed: 'Auto-Assign ARO/RO & Proceed',
    assignmentTitle: 'ARO/RO Auto-Assignment',
    assignmentHint: 'System auto-assigned by bonder zone/location.',
    notifyProceed: 'Notify & Proceed to Verification',
    verificationTitle: 'Application Verification',
    autoValidationTitle: 'Auto Bonder Status Validation',
    compliant: 'Compliant',
    nonCompliant: 'Non-Compliant',
    licenseValid: 'License Valid',
    licenseInvalid: 'License Not Active',
    legalClear: 'Legal Status Clear',
    legalFlagged: 'Legal Status Flagged',
    udCrossCheckTitle: 'e-UD Cross Check',
    udMatch: 'Finished goods description matches linked UD.',
    udMismatch: 'Finished goods description differs from linked UD — flagged for manual review.',
    manualNoteLabel: 'Manual Verification Note (for documents not auto-validated)',
    manualNoteRequired: 'A verification note is required to proceed.',
    forwardUsageValidation: 'Forward to Usage Validation',
    usageValidationTitle: 'Usage Validation',
    trustedBuyerNotice: 'Trusted Buyer order — finished goods deemed authentic. Co-efficient calculation skipped.',
    forwardApprovalRouting: 'Forward to Approval Routing',
    coefficientCalcTitle: 'e-Co-efficient Validation & Calculation',
    coefficientMatchFound: 'Matching co-efficient found in database',
    noCoefficientMatch: 'No matching co-efficient found in database — using requested quantity as baseline.',
    comparisonReportTitle: 'e-Comparison Report',
    colRequested: 'Requested',
    colCalculated: 'System-Calculated',
    colVariance: 'Variance',
    thresholdLabel: 'Configurable Variance Threshold (%)',
    withinThreshold: 'Within threshold — eligible to forward to approval.',
    overThreshold: 'Above threshold — must be reverted to Bonder for correction.',
    revertToBonder: 'Revert to Bonder for Correction',
    forwardApproval: 'Within Threshold — Forward to Approval',
    revertedTitle: 'Reverted to Bonder',
    resubmit: 'Bonder Resubmits with System-Suggested Quantity',
    pendingApprovalTitle: 'Routed for Approval',
    routedAdcJc: 'UP value exceeds Tk 80,000 — routed to ADC/JC dashboard.',
    routedAcDc: 'UP value is Tk 80,000 or less — routed to AC/DC dashboard.',
    finalQtyLabel: 'Final Approved Quantity (editable)',
    approveNoteLabel: 'Approval Note',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalRequired: 'A reason is required to disapprove.',
    disapprovedTitle: 'Application Disapproved',
    disapprovedBody: 'The applicant has been auto-notified and must reapply.',
    upDocTitle: 'e-Utilization Permission (e-UP)',
    upDocIssued: 'Issued',
    upDocBonder: 'Bonder',
    upDocBin: 'BIN',
    upDocLicense: 'Bond License No.',
    upDocFinishedGoods: 'Finished Goods',
    upDocApprovedMaterials: 'Approved Raw Materials',
    upDocNote: 'This e-UP is system-generated, viewable, printable and downloadable, and has been attached to the Bonder Profile.',
    downloadUp: 'Download / Print e-UP',
    issuanceNotice: 'e-UP issued. Bonder & designated CBC officials auto-notified.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ইউটিলাইজেশন পারমিশন (ইউপি) ব্যবস্থাপনা',
    subtitle: 'বন্ডকারীরা তৈরি পণ্যের অর্ডারের বিপরীতে কাঁচামাল ব্যবহারের অনুমতির জন্য আবেদন করে; সিস্টেম স্বয়ংক্রিয়ভাবে বন্ডকারীর অবস্থা যাচাই করে, ইউডি ও কো-এফিসিয়েন্ট ডেটার বিপরীতে ক্রস-চেক করে, এবং ই-ইউপি ইস্যুর আগে মূল্যের ভিত্তিতে আবেদনটি এডিসি/জেসি বা এসি/ডিসি-এর কাছে পাঠায়।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    newApplication: 'নতুন ইউপি আবেদন',
    pending: 'অপেক্ষমাণ আবেদন',
    approved: 'অনুমোদিত',
    disapproved: 'অননুমোদিত',
    reverted: 'বন্ডকারীর কাছে ফেরত',
    searchPlaceholder: 'লাইসেন্স নং বা বন্ডকারীর নাম খুঁজুন…',
    filterAll: 'সকল ধাপ',
    tableHeaders: {
      id: 'ইউপি আইডি',
      bonder: 'বন্ডকারী',
      finishedGoods: 'তৈরি পণ্য এইচএস',
      value: 'ইউপি মূল্য (টাকা)',
      stage: 'ধাপ',
      action: ''
    },
    review: 'পর্যালোচনা',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো ইউপি আবেদন মেলেনি।',
    formTitle: 'ইউটিলাইজেশন পারমিশন — আবেদন',
    step1: 'লাইসেন্স নির্বাচন করুন',
    step2: 'তৈরি পণ্য ও ইউডি সংযোগ',
    step3: 'কাঁচামাল, সংযুক্তি ও পেমেন্ট',
    step4: 'পর্যালোচনা ও দাখিল',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বর দিয়ে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    next: 'পরবর্তী',
    back: 'পূর্ববর্তী',
    submit: 'আবেদন দাখিল করুন',
    basedOnUd: 'এই আবেদনটি একটি বিদ্যমান ইউডি-এর ভিত্তিতে',
    selectUd: 'ইউডি নির্বাচন করুন',
    noUdForLicense: 'এই লাইসেন্সের জন্য কোনো অনুমোদিত ইউডি পাওয়া যায়নি — আবেদনটি ইউডি ক্রস-চেক ছাড়াই এগিয়ে যাবে।',
    trustedBuyer: 'বিশ্বস্ত ক্রেতার অর্ডার (সত্য বলে গণ্য — ম্যানুয়াল ব্যবহার যাচাই এড়িয়ে যায়)',
    hsCodeLabel: 'তৈরি পণ্যের এইচএস কোড',
    descriptionLabel: 'তৈরি পণ্যের বিবরণ',
    qtyDozenLabel: 'তৈরি পণ্যের পরিমাণ (ডজন)',
    rawMaterialsTitle: 'অনুরোধকৃত কাঁচামাল',
    rawHsLabel: 'এইচএস কোড',
    rawDescLabel: 'বিবরণ',
    rawQtyLabel: 'অনুরোধকৃত পরিমাণ',
    rawUnitLabel: 'একক',
    addLine: 'কাঁচামাল লাইন যোগ করুন',
    upValueLabel: 'ইউপি মূল্য (টাকা)',
    attachmentsTitle: 'সহায়ক সংযুক্তি (ই-সংযুক্তি)',
    attach: 'সংযুক্ত করুন',
    attached: 'সংযুক্ত হয়েছে',
    paymentTitle: 'ই-পেমেন্ট',
    payNow: 'ই-চালান / পেমেন্ট গেটওয়ের মাধ্যমে পরিশোধ করুন',
    paid: 'পেমেন্ট নিশ্চিত হয়েছে',
    reviewTitle: 'আবেদন পর্যালোচনা',
    submittedNotice: 'আবেদন দাখিল করা হয়েছে। ই-বন্ড রেজিস্টার আপডেট হয়েছে। বন্ডকারী ও সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    pipelineTitle: 'ইউপি আবেদন পাইপলাইন',
    autoChecklistTitle: 'ই-চেকলিস্ট ও ই-বন্ড রেজিস্টার',
    checklistComplete: 'সকল প্রয়োজনীয় নথি সংযুক্ত হয়েছে — ই-চেকলিস্ট উত্তীর্ণ।',
    bondRegisterEntry: 'আবেদনটি ই-বন্ড রেজিস্টারে স্বয়ংক্রিয়ভাবে রেকর্ড হয়েছে।',
    notificationSent: 'দাখিলের বিষয়ে বন্ডকারী ও সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    assignProceed: 'স্বয়ংক্রিয়ভাবে আরও/এআরও বরাদ্দ করুন ও এগিয়ে যান',
    assignmentTitle: 'আরও/এআরও স্বয়ংক্রিয় বরাদ্দ',
    assignmentHint: 'বন্ডকারীর জোন/অবস্থান অনুযায়ী সিস্টেম স্বয়ংক্রিয়ভাবে বরাদ্দ করেছে।',
    notifyProceed: 'অবহিত করুন ও যাচাইকরণে এগিয়ে যান',
    verificationTitle: 'আবেদন যাচাইকরণ',
    autoValidationTitle: 'স্বয়ংক্রিয় বন্ডকারী স্ট্যাটাস যাচাই',
    compliant: 'কমপ্লায়েন্ট',
    nonCompliant: 'নন-কমপ্লায়েন্ট',
    licenseValid: 'লাইসেন্স বৈধ',
    licenseInvalid: 'লাইসেন্স সক্রিয় নয়',
    legalClear: 'আইনি অবস্থা পরিষ্কার',
    legalFlagged: 'আইনি অবস্থা চিহ্নিত',
    udCrossCheckTitle: 'ই-ইউডি ক্রস চেক',
    udMatch: 'তৈরি পণ্যের বিবরণ সংযুক্ত ইউডি-এর সাথে মিলে যায়।',
    udMismatch: 'তৈরি পণ্যের বিবরণ সংযুক্ত ইউডি থেকে ভিন্ন — ম্যানুয়াল পর্যালোচনার জন্য চিহ্নিত।',
    manualNoteLabel: 'ম্যানুয়াল যাচাইকরণ নোট (স্বয়ংক্রিয়ভাবে যাচাই করা যায়নি এমন নথির জন্য)',
    manualNoteRequired: 'এগিয়ে যেতে একটি যাচাইকরণ নোট প্রয়োজন।',
    forwardUsageValidation: 'ব্যবহার যাচাইকরণে পাঠান',
    usageValidationTitle: 'ব্যবহার যাচাইকরণ',
    trustedBuyerNotice: 'বিশ্বস্ত ক্রেতার অর্ডার — তৈরি পণ্য সত্য বলে গণ্য। কো-এফিসিয়েন্ট গণনা এড়িয়ে যাওয়া হয়েছে।',
    forwardApprovalRouting: 'অনুমোদন রাউটিং-এ পাঠান',
    coefficientCalcTitle: 'ই-কো-এফিসিয়েন্ট যাচাই ও গণনা',
    coefficientMatchFound: 'ডেটাবেজে মিলযুক্ত কো-এফিসিয়েন্ট পাওয়া গেছে',
    noCoefficientMatch: 'ডেটাবেজে কোনো মিলযুক্ত কো-এফিসিয়েন্ট পাওয়া যায়নি — অনুরোধকৃত পরিমাণকে ভিত্তি হিসেবে ব্যবহার করা হচ্ছে।',
    comparisonReportTitle: 'ই-তুলনা রিপোর্ট',
    colRequested: 'অনুরোধকৃত',
    colCalculated: 'সিস্টেম-গণিত',
    colVariance: 'পার্থক্য',
    thresholdLabel: 'কনফিগারযোগ্য পার্থক্য থ্রেশহোল্ড (%)',
    withinThreshold: 'থ্রেশহোল্ডের মধ্যে — অনুমোদনে পাঠানোর যোগ্য।',
    overThreshold: 'থ্রেশহোল্ডের উপরে — সংশোধনের জন্য বন্ডকারীর কাছে ফেরত পাঠাতে হবে।',
    revertToBonder: 'সংশোধনের জন্য বন্ডকারীর কাছে ফেরত পাঠান',
    forwardApproval: 'থ্রেশহোল্ডের মধ্যে — অনুমোদনে পাঠান',
    revertedTitle: 'বন্ডকারীর কাছে ফেরত পাঠানো হয়েছে',
    resubmit: 'সিস্টেম-প্রস্তাবিত পরিমাণসহ বন্ডকারী পুনরায় দাখিল করবে',
    pendingApprovalTitle: 'অনুমোদনের জন্য রাউটেড',
    routedAdcJc: 'ইউপি মূল্য ৮০,০০০ টাকার বেশি — এডিসি/জেসি ড্যাশবোর্ডে পাঠানো হয়েছে।',
    routedAcDc: 'ইউপি মূল্য ৮০,০০০ টাকা বা তার কম — এসি/ডিসি ড্যাশবোর্ডে পাঠানো হয়েছে।',
    finalQtyLabel: 'চূড়ান্ত অনুমোদিত পরিমাণ (সম্পাদনযোগ্য)',
    approveNoteLabel: 'অনুমোদন নোট',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalRequired: 'অননুমোদন করতে একটি কারণ প্রয়োজন।',
    disapprovedTitle: 'আবেদন অননুমোদিত',
    disapprovedBody: 'আবেদনকারীকে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে এবং তাকে পুনরায় আবেদন করতে হবে।',
    upDocTitle: 'ই-ইউটিলাইজেশন পারমিশন (ই-ইউপি)',
    upDocIssued: 'ইস্যুকৃত',
    upDocBonder: 'বন্ডকারী',
    upDocBin: 'বিআইএন',
    upDocLicense: 'বন্ড লাইসেন্স নং',
    upDocFinishedGoods: 'তৈরি পণ্য',
    upDocApprovedMaterials: 'অনুমোদিত কাঁচামাল',
    upDocNote: 'এই ই-ইউপি সিস্টেম-জেনারেটেড, দেখার যোগ্য, প্রিন্টযোগ্য ও ডাউনলোডযোগ্য, এবং বন্ডকারী প্রোফাইলে সংযুক্ত করা হয়েছে।',
    downloadUp: 'ই-ইউপি ডাউনলোড / প্রিন্ট করুন',
    issuanceNotice: 'ই-ইউপি ইস্যু করা হয়েছে। বন্ডকারী ও নির্ধারিত সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।'
  }
};
type T = typeof T['en'];
export function UtilizationPermission({
  language,
  onDone
}: UtilizationPermissionProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'apply'>('dashboard');
  const [applications, setApplications] = useState<UpApplication[]>(seedApplications);
  const [selected, setSelected] = useState<UpApplication | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | UpStage>('all');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const counts = useMemo(() => ({
    pending: applications.filter(a => !['approved', 'disapproved'].includes(a.stage)).length,
    approved: applications.filter(a => a.stage === 'approved').length,
    disapproved: applications.filter(a => a.stage === 'disapproved').length,
    reverted: applications.filter(a => a.stage === 'reverted').length
  }), [applications]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter(a => {
      const lic = licenseOf(a.licenseNo);
      const matchesQuery = !q || a.licenseNo.toLowerCase().includes(q) || (lic?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesFilter = filter === 'all' || a.stage === filter;
      return matchesQuery && matchesFilter;
    });
  }, [applications, search, filter]);
  const handleUpdate = (updated: UpApplication) => {
    setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelected(updated);
  };
  if (view === 'apply') {
    return <ApplicationWizard language={language} t={t} onCancel={() => setView('dashboard')} onSubmit={app => {
      setApplications(prev => [app, ...prev]);
      setView('dashboard');
      showToast(t.submittedNotice);
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
        <button type="button" onClick={() => setView('apply')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
          <Icon name="add_circle" className="text-[16px]" />
          {t.newApplication}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="hourglass_top" label={t.pending} value={counts.pending} color="#B45309" />
        <StatCard icon="check_circle" label={t.approved} value={counts.approved} color="#00A86B" />
        <StatCard icon="cancel" label={t.disapproved} value={counts.disapproved} color="#DC2626" />
        <StatCard icon="undo" label={t.reverted} value={counts.reverted} color="#94A3B8" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as any)} className={`${inputClass} sm:w-56`}>
          <option value="all">{t.filterAll}</option>
          {Object.keys(stageLabels).map(s => <option key={s} value={s}>{stageLabels[s as UpStage][language]}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.tableHeaders.id}</th>
              <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
              <th className="px-4 py-3">{t.tableHeaders.finishedGoods}</th>
              <th className="px-4 py-3">{t.tableHeaders.value}</th>
              <th className="px-4 py-3">{t.tableHeaders.stage}</th>
              <th className="px-4 py-3">{t.tableHeaders.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
            const lic = licenseOf(a.licenseNo);
            return <tr key={a.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{a.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{a.licenseNo}</p>
                  </td>
                  <td className="px-4 py-3 text-[#334155]">
                    <p className="font-semibold text-[#0A4D8C]">{a.finishedGoodsHsCode}</p>
                    <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? a.finishedGoodsDescEn : a.finishedGoodsDescBn}</p>
                  </td>
                  <td className="px-4 py-3 text-[#334155]">৳{a.upValueTaka.toLocaleString()}</td>
                  <td className="px-4 py-3"><StageBadge stage={a.stage} language={language} /></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(a)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                      {t.review}
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

      {selected && <ApplicationDrawer application={selected} language={language} t={t} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
    </div>;
}
function ComparisonTable({
  lines,
  language,
  t
}: {
  lines: UpRawMaterialLine[];
  language: Language;
  t: T;
}) {
  return <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
      <table className="w-full min-w-[520px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
            <th className="px-3 py-2">HS Code</th>
            <th className="px-3 py-2">{t.colRequested}</th>
            <th className="px-3 py-2">{t.colCalculated}</th>
            <th className="px-3 py-2">{t.colVariance}</th>
          </tr>
        </thead>
        <tbody>
          {lines.map(l => {
          const calc = l.systemCalculatedQty ?? l.requestedQty;
          const variance = calcVariancePct(l.requestedQty, calc);
          return <tr key={l.hsCode} className="border-b border-[#F1F5F9] last:border-0">
                <td className="px-3 py-2 font-semibold text-[#0A4D8C]">{l.hsCode}
                  <p className="font-normal text-[11px] text-[#94A3B8]">{language === 'en' ? l.descEn : l.descBn}</p>
                </td>
                <td className="px-3 py-2 text-[#334155]">{l.requestedQty.toLocaleString()} {l.unit}</td>
                <td className="px-3 py-2 text-[#334155]">{calc.toLocaleString()} {l.unit}</td>
                <td className={`px-3 py-2 font-semibold ${variance > 10 ? 'text-[#DC2626]' : 'text-[#00A86B]'}`}>{variance.toFixed(1)}%</td>
              </tr>;
        })}
        </tbody>
      </table>
    </div>;
}
function ApplicationDrawer({
  application,
  language,
  t,
  onClose,
  onUpdate
}: {
  application: UpApplication;
  language: Language;
  t: T;
  onClose: () => void;
  onUpdate: (a: UpApplication) => void;
}) {
  const lic = licenseOf(application.licenseNo);
  const linkedUd = udRecordFor(application.udNo);
  const coefficientMatch = coefficientMatchFor(application.finishedGoodsHsCode);
  const [manualNote, setManualNote] = useState(application.verificationNote ?? '');
  const [manualNoteError, setManualNoteError] = useState(false);
  const [threshold, setThreshold] = useState(String(application.thresholdPct));
  const [approvalNote, setApprovalNote] = useState('');
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [disapprovalError, setDisapprovalError] = useState(false);
  const [finalQty, setFinalQty] = useState<Record<string, string>>(() => Object.fromEntries(application.rawMaterials.map(l => [l.hsCode, String(l.approvedQty ?? l.requestedQty)])));
  const isException = application.stage === 'reverted' || application.stage === 'disapproved';
  const currentIndex = stageOrder.indexOf(application.stage);
  const computedLines: UpRawMaterialLine[] = application.rawMaterials.map(l => {
    if (l.systemCalculatedQty !== undefined) return l;
    const match = coefficientMatch?.rawMaterials.find(rm => rm.hsCode === l.hsCode);
    if (!match) return l;
    const numeric = parseFloat(match.perUnitQty);
    const calculated = Number.isFinite(numeric) ? Math.round(numeric * application.finishedGoodsQtyDozen) : l.requestedQty;
    return {
      ...l,
      systemCalculatedQty: calculated
    };
  });
  const maxVariance = Math.max(...computedLines.map(l => calcVariancePct(l.requestedQty, l.systemCalculatedQty ?? l.requestedQty)));
  const overThreshold = maxVariance > Number(threshold);
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
            <span className="text-lg font-bold text-[#0A4D8C]">{application.id}</span>
            <StageBadge stage={application.stage} language={language} />
            {application.trustedBuyer && <span className="rounded-full bg-[#EAF3FE] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C]">{t.trustedBuyer.split(' (')[0]}</span>}
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <p className="font-medium text-[#1E293B]">{lic?.nameEn} · {application.licenseNo}</p>
            <p className="mt-1 text-[13px] font-semibold text-[#0A4D8C]">{application.finishedGoodsHsCode} — {language === 'en' ? application.finishedGoodsDescEn : application.finishedGoodsDescBn}</p>
            <p className="text-[12px] text-[#64748B]">৳{application.upValueTaka.toLocaleString()} · {application.finishedGoodsQtyDozen.toLocaleString()} dozen</p>
          </div>

          {!isException && <div className="relative flex flex-col gap-5 pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#CBD5E1]" />
              {stageOrder.map((s, i) => {
            const status = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
            return <div key={s} className="relative">
                    <span className={`absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ${status === 'done' ? 'bg-[#00A86B] ring-emerald-50' : status === 'current' ? 'bg-[#0A4D8C] ring-[#EAF3FE]' : 'bg-[#CBD5E1] ring-white'}`} />
                    <p className={`text-[13px] font-bold ${status === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'}`}>{stageLabels[s][language]}</p>

                    {status === 'current' && s === 'submitted' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3 text-[12px] text-[#334155]">
                        <p className="flex items-center gap-1.5"><Icon name="checklist" className="text-[15px] text-[#00A86B]" />{t.checklistComplete}</p>
                        <p className="flex items-center gap-1.5"><Icon name="menu_book" className="text-[15px] text-[#00A86B]" />{t.bondRegisterEntry}</p>
                        <p className="flex items-center gap-1.5"><Icon name="notifications_active" className="text-[15px] text-[#00A86B]" />{t.notificationSent}</p>
                        <button type="button" onClick={() => onUpdate({
                    ...application,
                    stage: 'assignment',
                    assignedOfficer: autoAssignOfficer(lic?.district ?? '')
                  })} className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                          <Icon name="person_add" className="text-[14px]" />
                          {t.assignProceed}
                        </button>
                      </div>}

                    {status === 'current' && s === 'assignment' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.assignmentHint}</p>
                        <p className="text-[13px] font-semibold text-[#0A4D8C]">{application.assignedOfficer?.[language] ?? autoAssignOfficer(lic?.district ?? '')[language]}</p>
                        <button type="button" onClick={() => onUpdate({
                    ...application,
                    stage: 'verification',
                    assignedOfficer: application.assignedOfficer ?? autoAssignOfficer(lic?.district ?? '')
                  })} className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                          <Icon name="forward_to_inbox" className="text-[14px]" />
                          {t.notifyProceed}
                        </button>
                      </div>}

                    {status === 'current' && s === 'verification' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <div>
                          <p className="mb-1.5 text-[12px] font-semibold text-[#334155]">{t.autoValidationTitle}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${lic?.auditStatus === 'compliant' ? 'bg-emerald-50 text-[#00A86B]' : 'bg-red-50 text-[#DC2626]'}`}>{lic?.auditStatus === 'compliant' ? t.compliant : t.nonCompliant}</span>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${lic?.status === 'active' ? 'bg-emerald-50 text-[#00A86B]' : 'bg-red-50 text-[#DC2626]'}`}>{lic?.status === 'active' ? t.licenseValid : t.licenseInvalid}</span>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${lic?.legalStatus === 'clear' ? 'bg-emerald-50 text-[#00A86B]' : 'bg-red-50 text-[#DC2626]'}`}>{lic?.legalStatus === 'clear' ? t.legalClear : t.legalFlagged}</span>
                          </div>
                        </div>
                        {application.basedOnUd && <div>
                            <p className="mb-1.5 text-[12px] font-semibold text-[#334155]">{t.udCrossCheckTitle}</p>
                            {linkedUd ? <p className={`text-[12px] ${linkedUd.finishedGoods.toLowerCase() === application.finishedGoodsDescEn.toLowerCase() ? 'text-[#00A86B]' : 'text-[#B45309]'}`}>
                                {linkedUd.finishedGoods.toLowerCase() === application.finishedGoodsDescEn.toLowerCase() ? t.udMatch : t.udMismatch} ({application.udNo}: {linkedUd.finishedGoods})
                              </p> : <p className="text-[12px] text-[#B45309]">{t.noUdForLicense}</p>}
                          </div>}
                        <Field label={t.manualNoteLabel} required error={manualNoteError ? t.manualNoteRequired : undefined}>
                          <textarea value={manualNote} onChange={e => {
                      setManualNote(e.target.value);
                      setManualNoteError(false);
                    }} rows={2} className={inputClass} />
                        </Field>
                        <button type="button" onClick={() => {
                    if (!manualNote.trim()) {
                      setManualNoteError(true);
                      return;
                    }
                    onUpdate({
                      ...application,
                      stage: 'usage-validation',
                      verificationNote: manualNote.trim()
                    });
                  }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                          <Icon name="forward_to_inbox" className="text-[14px]" />
                          {t.forwardUsageValidation}
                        </button>
                      </div>}

                    {status === 'current' && s === 'usage-validation' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        {application.trustedBuyer ? <>
                            <p className="rounded bg-[#EAF3FE] p-2.5 text-[12px] text-[#0A4D8C]">{t.trustedBuyerNotice}</p>
                            <button type="button" onClick={() => onUpdate({
                        ...application,
                        stage: 'pending-approval',
                        route: application.upValueTaka > 80000 ? 'adc-jc' : 'ac-dc'
                      })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                              <Icon name="forward_to_inbox" className="text-[14px]" />
                              {t.forwardApprovalRouting}
                            </button>
                          </> : <>
                            <p className="text-[12px] font-semibold text-[#334155]">{t.coefficientCalcTitle}</p>
                            <p className="text-[11px] text-[#64748B]">{coefficientMatch ? `${t.coefficientMatchFound}: ${coefficientMatch.id}` : t.noCoefficientMatch}</p>
                            <p className="text-[12px] font-semibold text-[#334155]">{t.comparisonReportTitle}</p>
                            <ComparisonTable lines={computedLines} language={language} t={t} />
                            <Field label={t.thresholdLabel}>
                              <TextInput value={threshold} onChange={setThreshold} type="number" />
                            </Field>
                            <p className={`text-[12px] font-semibold ${overThreshold ? 'text-[#DC2626]' : 'text-[#00A86B]'}`}>{overThreshold ? t.overThreshold : t.withinThreshold}</p>
                            {overThreshold ? <button type="button" onClick={() => onUpdate({
                        ...application,
                        stage: 'reverted',
                        comparisonVariancePct: maxVariance,
                        rawMaterials: computedLines,
                        revertNote: `Requested quantity variance of ${maxVariance.toFixed(1)}% exceeds the ${threshold}% threshold. Bonder must correct and resubmit.`
                      })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]">
                                <Icon name="undo" className="text-[14px]" />
                                {t.revertToBonder}
                              </button> : <button type="button" onClick={() => onUpdate({
                        ...application,
                        stage: 'pending-approval',
                        comparisonVariancePct: maxVariance,
                        rawMaterials: computedLines,
                        route: application.upValueTaka > 80000 ? 'adc-jc' : 'ac-dc'
                      })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]">
                                <Icon name="check_circle" className="text-[14px]" />
                                {t.forwardApproval}
                              </button>}
                          </>}
                      </div>}

                    {status === 'current' && s === 'pending-approval' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="rounded bg-[#F8FAFC] p-2.5 text-[12px] text-[#334155]">{application.route === 'adc-jc' ? t.routedAdcJc : t.routedAcDc}</p>
                        <div className="flex flex-col gap-2">
                          {application.rawMaterials.map(l => <Field key={l.hsCode} label={`${t.finalQtyLabel} — ${l.hsCode}`}>
                              <TextInput value={finalQty[l.hsCode] ?? ''} onChange={v => setFinalQty(prev => ({
                          ...prev,
                          [l.hsCode]: v
                        }))} type="number" />
                            </Field>)}
                        </div>
                        <Field label={t.approveNoteLabel}>
                          <textarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} rows={2} className={inputClass} />
                        </Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => onUpdate({
                      ...application,
                      stage: 'approved',
                      approvalNote: approvalNote.trim() || undefined,
                      upIssueDate: '26 Jul 2026',
                      rawMaterials: application.rawMaterials.map(l => ({
                        ...l,
                        approvedQty: Number(finalQty[l.hsCode]) || l.requestedQty
                      }))
                    })} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]">
                            <Icon name="check_circle" className="text-[14px]" />
                            {t.approve}
                          </button>
                          <details>
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
                            ...application,
                            stage: 'disapproved',
                            rejectionReason: disapprovalReason.trim()
                          });
                        }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]">
                                {t.disapprove}
                              </button>
                            </div>
                          </details>
                        </div>
                      </div>}
                  </div>;
          })}
            </div>}

          {application.stage === 'reverted' && <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-[#B91C1C]">
              <p className="font-bold">{t.revertedTitle}</p>
              <p>{application.revertNote}</p>
              <button type="button" onClick={() => onUpdate({
            ...application,
            stage: 'usage-validation',
            rawMaterials: application.rawMaterials.map(l => ({
              ...l,
              requestedQty: l.systemCalculatedQty ?? l.requestedQty
            })),
            revertNote: undefined
          })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                <Icon name="replay" className="text-[14px]" />
                {t.resubmit}
              </button>
            </div>}

          {application.stage === 'approved' && <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-[#087F52]">
                <p className="font-bold">{t.issuanceNotice}</p>
              </div>
              <div className="rounded-xl border-2 border-[#0A4D8C]/20 bg-white p-5">
                <div className="flex items-center justify-between border-b border-dashed border-[#CBD5E1] pb-3">
                  <p className="text-base font-bold text-[#0A4D8C]">{t.upDocTitle}</p>
                  <p className="text-[12px] text-[#64748B]">{application.id}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                  <div><p className="text-[11px] text-[#94A3B8]">{t.upDocBonder}</p><p className="font-medium text-[#1E293B]">{lic?.nameEn}</p></div>
                  <div><p className="text-[11px] text-[#94A3B8]">{t.upDocBin}</p><p className="font-medium text-[#1E293B]">{lic?.bin}</p></div>
                  <div><p className="text-[11px] text-[#94A3B8]">{t.upDocLicense}</p><p className="font-medium text-[#1E293B]">{application.licenseNo}</p></div>
                  <div><p className="text-[11px] text-[#94A3B8]">{t.upDocIssued}</p><p className="font-medium text-[#1E293B]">{application.upIssueDate}</p></div>
                  <div className="col-span-2"><p className="text-[11px] text-[#94A3B8]">{t.upDocFinishedGoods}</p><p className="font-medium text-[#1E293B]">{application.finishedGoodsHsCode} — {language === 'en' ? application.finishedGoodsDescEn : application.finishedGoodsDescBn}</p></div>
                </div>
                <p className="mt-3 mb-1.5 text-[12px] font-semibold text-[#334155]">{t.upDocApprovedMaterials}</p>
                <div className="flex flex-col gap-1">
                  {application.rawMaterials.map(l => <p key={l.hsCode} className="text-[13px] text-[#334155]">{l.hsCode} — {language === 'en' ? l.descEn : l.descBn}: <span className="font-semibold text-[#0A4D8C]">{(l.approvedQty ?? l.requestedQty).toLocaleString()} {l.unit}</span></p>)}
                </div>
                {application.approvalNote && <p className="mt-2 text-[12px] italic text-[#64748B]">{application.approvalNote}</p>}
                <p className="mt-3 text-[11px] text-[#94A3B8]">{t.upDocNote}</p>
                <button type="button" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                  <Icon name="print" className="text-[14px]" />
                  {t.downloadUp}
                </button>
              </div>
            </div>}

          {application.stage === 'disapproved' && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-[#B91C1C]">
              <p className="font-bold">{t.disapprovedTitle}</p>
              <p className="mt-1">{application.rejectionReason}</p>
              <p className="mt-2 text-[#64748B]">{t.disapprovedBody}</p>
            </div>}
        </div>
      </div>
    </div>;
}
function ApplicationWizard({
  language,
  t,
  onCancel,
  onSubmit
}: {
  language: Language;
  t: T;
  onCancel: () => void;
  onSubmit: (a: UpApplication) => void;
}) {
  const [step, setStep] = useState(1);
  const [licenseNo, setLicenseNo] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [basedOnUd, setBasedOnUd] = useState(false);
  const [udNo, setUdNo] = useState('');
  const [trustedBuyer, setTrustedBuyer] = useState(false);
  const [hsCode, setHsCode] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [qtyDozen, setQtyDozen] = useState('');
  const [upValue, setUpValue] = useState('');
  const [rawLines, setRawLines] = useState<{
    hsCode: string;
    descEn: string;
    requestedQty: string;
    unit: string;
  }[]>([{
    hsCode: '',
    descEn: '',
    requestedQty: '',
    unit: 'kg'
  }]);
  const [attached, setAttached] = useState<Record<string, boolean>>({});
  const [paid, setPaid] = useState(false);
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
  const bonderUds = useMemo(() => verifiedLicense ? udRecords.filter(u => u.licenseNo === verifiedLicense.licenseNo) : [], [verifiedLicense]);
  const canSubmit = verifiedLicense && hsCode.trim() && descriptionEn.trim() && qtyDozen.trim() && upValue.trim() && rawLines.every(l => l.hsCode.trim() && l.requestedQty.trim()) && attachmentDefs.every(d => attached[d.id]) && paid;
  return <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-6 py-6">
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
            <Field label="Bond License No." required>
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
            <label className="flex items-center gap-2 text-[13px] font-semibold text-[#334155]">
              <input type="checkbox" checked={basedOnUd} onChange={e => setBasedOnUd(e.target.checked)} className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C]" />
              {t.basedOnUd}
            </label>
            {basedOnUd && <Field label={t.selectUd}>
                {bonderUds.length > 0 ? <select value={udNo} onChange={e => setUdNo(e.target.value)} className={inputClass}>
                    <option value="">—</option>
                    {bonderUds.map(u => <option key={u.udNo} value={u.udNo}>{u.udNo} — {u.finishedGoods}</option>)}
                  </select> : <p className="text-[12px] text-[#B45309]">{t.noUdForLicense}</p>}
              </Field>}
            <label className="flex items-center gap-2 text-[13px] font-semibold text-[#334155]">
              <input type="checkbox" checked={trustedBuyer} onChange={e => setTrustedBuyer(e.target.checked)} className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C]" />
              {t.trustedBuyer}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t.hsCodeLabel} required>
                <TextInput value={hsCode} onChange={setHsCode} placeholder="6109.10.00" />
              </Field>
              <Field label={t.qtyDozenLabel} required>
                <TextInput value={qtyDozen} onChange={setQtyDozen} type="number" />
              </Field>
            </div>
            <Field label={t.descriptionLabel} required>
              <TextInput value={descriptionEn} onChange={setDescriptionEn} placeholder="Men's Knit Cotton T-Shirt" />
            </Field>
          </>}

        {step === 3 && <>
            <p className="text-[13px] font-bold text-[#1E293B]">{t.rawMaterialsTitle}</p>
            <div className="flex flex-col gap-2">
              {rawLines.map((l, i) => <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-lg border border-[#E2E8F0] p-2">
                  <TextInput value={l.hsCode} onChange={v => setRawLines(prev => prev.map((x, idx) => idx === i ? {
                ...x,
                hsCode: v
              } : x))} placeholder={t.rawHsLabel} />
                  <TextInput value={l.descEn} onChange={v => setRawLines(prev => prev.map((x, idx) => idx === i ? {
                ...x,
                descEn: v
              } : x))} placeholder={t.rawDescLabel} />
                  <TextInput value={l.requestedQty} onChange={v => setRawLines(prev => prev.map((x, idx) => idx === i ? {
                ...x,
                requestedQty: v
              } : x))} type="number" placeholder={t.rawQtyLabel} />
                  <button type="button" onClick={() => setRawLines(prev => prev.filter((_, idx) => idx !== i))} className="rounded-full px-2 text-[#DC2626] hover:bg-red-50">
                    <Icon name="close" className="text-[16px]" />
                  </button>
                </div>)}
              <button type="button" onClick={() => setRawLines(prev => [...prev, {
              hsCode: '',
              descEn: '',
              requestedQty: '',
              unit: 'kg'
            }])} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3.5 py-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                <Icon name="add" className="text-[14px]" />
                {t.addLine}
              </button>
            </div>
            <Field label={t.upValueLabel} required>
              <TextInput value={upValue} onChange={setUpValue} type="number" />
            </Field>
            <p className="mt-2 text-[13px] font-bold text-[#1E293B]">{t.attachmentsTitle}</p>
            <div className="flex flex-col gap-2">
              {attachmentDefs.map(d => <div key={d.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2.5">
                  <span className="text-[13px] text-[#334155]">{d[language]}</span>
                  {attached[d.id] ? <span className="flex items-center gap-1 text-[12px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[15px]" />{t.attached}</span> : <button type="button" onClick={() => setAttached(prev => ({
                ...prev,
                [d.id]: true
              }))} className="rounded-full bg-[#EAF3FE] px-3 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                      {t.attach}
                    </button>}
                </div>)}
            </div>
            <p className="mt-2 text-[13px] font-bold text-[#1E293B]">{t.paymentTitle}</p>
            {paid ? <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[15px]" />{t.paid}</p> : <button type="button" onClick={() => setPaid(true)} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                <Icon name="payments" className="text-[15px]" />
                {t.payNow}
              </button>}
          </>}

        {step === 4 && verifiedLicense && <div className="flex flex-col gap-3 text-sm">
            <p className="text-[13px] font-bold text-[#1E293B]">{t.reviewTitle}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-[#F8FAFC] p-4">
              <div><p className="text-[11px] text-[#94A3B8]">Bond License No.</p><p className="font-medium text-[#1E293B]">{verifiedLicense.licenseNo}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">Bonder</p><p className="font-medium text-[#1E293B]">{verifiedLicense.nameEn}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">{t.hsCodeLabel}</p><p className="font-medium text-[#1E293B]">{hsCode}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">{t.upValueLabel}</p><p className="font-medium text-[#1E293B]">৳{upValue}</p></div>
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
          const app: UpApplication = {
            id: `UP-2026-0${60 + Math.floor(Math.random() * 40)}`,
            licenseNo: verifiedLicense.licenseNo,
            submittedAt: '26 Jul 2026',
            basedOnUd,
            udNo: basedOnUd && udNo ? udNo : undefined,
            trustedBuyer,
            finishedGoodsHsCode: hsCode,
            finishedGoodsDescEn: descriptionEn,
            finishedGoodsDescBn: descriptionEn,
            finishedGoodsQtyDozen: Number(qtyDozen) || 0,
            rawMaterials: rawLines.map(l => ({
              hsCode: l.hsCode,
              descEn: l.descEn || l.hsCode,
              descBn: l.descEn || l.hsCode,
              requestedQty: Number(l.requestedQty) || 0,
              unit: l.unit
            })),
            upValueTaka: Number(upValue) || 0,
            thresholdPct: 10,
            stage: 'submitted'
          };
          onSubmit(app);
        }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.submit}
            </button>}
        </div>
      </div>
    </div>;
}
