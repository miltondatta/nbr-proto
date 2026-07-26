import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { lienBanks } from './lienBankData';
import { licenseOf, officerPool, stageLabels, subContractApplications as seedApplications, type SubContractApplication, type SubContractStage } from './subContractData';
type Language = 'en' | 'bn';
interface SubContractManagementProps {
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
  stage: SubContractStage;
  language: Language;
}) {
  const color = stage === 'approved' ? '#00A86B' : stage === 'disapproved' ? '#DC2626' : '#B45309';
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
const attachmentDefs = [{
  id: 'subContractAgreement',
  en: 'Sub-Contract Agreement Draft',
  bn: 'সাব-কন্ট্রাক্ট চুক্তির খসড়া'
}, {
  id: 'processDetails',
  en: 'Process/Work Order Details',
  bn: 'প্রক্রিয়া/কার্যাদেশের বিবরণ'
}];
const stageOrder: SubContractStage[] = ['submitted', 'bepza-approval', 'assignment', 'risk-bond-consent', 'ro-verification', 'lien-bank-verification', 'final-review', 'approved'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Sub Contract Management',
    subtitle: 'Manages Bonder applications to sub-contract processing work to another Bonder (typically an EPZ enterprise) — BEPZA approval, dual e-Risk Bond consent, Lien Bank verification, and on approval an e-Risk Bond Number, e-Approval Letter, and auto e-Bond Register update.',
    backToDashboard: 'Back to Dashboard',
    newApplication: 'New Sub-Contract Application',
    pending: 'Pending Applications',
    approved: 'Approved',
    disapproved: 'Disapproved',
    awaitingBepza: 'Awaiting BEPZA Approval',
    searchPlaceholder: 'Search by license no. or bonder name…',
    filterAll: 'All Stages',
    tableHeaders: {
      id: 'Application ID',
      from: 'Bonder (Principal)',
      to: 'Sub-Contractor Bonder',
      items: 'Items',
      stage: 'Stage',
      action: ''
    },
    review: 'Review',
    noResults: 'No sub-contract applications match the current filters.',
    formTitle: 'Sub Contract — Application',
    step1: 'Select Bonders',
    step2: 'Work Items',
    step3: 'Attachments',
    step4: 'Review & Submit',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    fromLicenseLabel: 'Principal Bonder — Bond License No.',
    toLicenseLabel: 'Sub-Contractor Bonder — Bond License No.',
    sameLicenseError: 'Principal and Sub-Contractor Bonder must be different.',
    itemsTitle: 'Sub-Contracted Work Items',
    hsCodeLabel: 'HS Code',
    descriptionLabel: 'Description',
    qtyLabel: 'Quantity',
    addItem: 'Add Another Item',
    attachmentsTitle: 'Supporting Attachments (e-Attachment)',
    attach: 'Attach',
    attached: 'Attached',
    checklistNotice: 'e-Checklist passed — all required documents attached. Submission allowed.',
    reviewTitle: 'Review Application',
    submittedNotice: 'Application submitted. e-Notification sent to applicant and CBC officials.',
    pipelineTitle: 'Sub Contract Pipeline',
    checklistComplete: 'All required documents attached — e-checklist passed.',
    notificationSent: 'Applicant and CBC officials auto-notified of submission.',
    proceedBepza: 'Forward to BEPZA & Proceed',
    bepzaTitle: 'e-BEPZA Approval',
    bepzaHint: 'System forwards the necessary information to the BEPZA system for approval.',
    bepzaApprovedNotice: 'BEPZA approval received. e-Approval Letter attached to the application.',
    bepzaApprovalNoLabel: 'BEPZA Approval No.',
    bepzaDurationLabel: 'Sub-Contract Completion Duration (days)',
    assignProceed: 'Auto-Assign ARO/RO & Proceed',
    assignmentTitle: 'ARO/RO Assignment',
    assignmentHint: 'Commissioner assigns by zone/location.',
    notifyProceed: 'Notify & Proceed',
    riskBondTitle: 'e-Risk Bond & e-Consent',
    riskBondHint: 'System has generated an electronic Risk Bond. Both Bonders must log in and provide consent before proceeding.',
    fromConsent: 'Principal Bonder Consents',
    toConsent: 'Sub-Contractor Bonder Consents',
    consentGiven: 'Consent Given',
    bothConsentedNotice: 'Both Bonders consented. e-Risk Bond attached to both Bonder Profiles and the application.',
    proceedVerification: 'Proceed to RO/ARO Verification',
    verificationTitle: 'RO/ARO Verification',
    licenseeStatusTitle: 'e-Licensee Status Check / e-Audit Status',
    otherLicenseFound: 'Sub-Contractor Bonder holds another license under this ownership',
    noOtherLicense: 'No other license found under this ownership for the Sub-Contractor Bonder.',
    auditStatusLabel: 'Audit Status',
    roNoteLabel: 'RO/ARO e-Note',
    requestAdditionalDocs: 'Request Additional Supporting Documents',
    docsProvided: 'Bonder Provides Requested Documents',
    docsProvidedNotice: 'Requested documents uploaded by applicant. CBC officials auto-notified.',
    forwardLienBank: 'Forward to Lien Bank Verification',
    roNoteRequired: 'An e-Note is required before forwarding.',
    lienBankTitle: 'e-Verification Request to Lien Bank',
    selectLienBank: 'Select Lien Bank (by Bank Code)',
    sendRequest: 'Forward Attachments for Online Verification',
    lienBankSentNotice: 'Verification request sent to Lien Bank.',
    lienBankVerify: 'Mark Verified by Lien Bank',
    lienBankVerifiedNotice: 'Lien Bank completed verification. CBC officials and applicant auto-notified.',
    proceedFinal: 'Proceed to Final Review',
    finalReviewTitle: 'Final e-Applicant Report (RO/ARO → ADC/JC)',
    documentArchivingNote: 'Application, attachments, reports and notes archived in a categorized document store for easy search and retrieval.',
    finalNoteLabel: 'Final Decision Note',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalRequired: 'A reason is required to disapprove.',
    disapprovedTitle: 'Application Disapproved',
    disapprovedBody: 'Bonder has been auto-notified of the disapproval.',
    approvalOutputTitle: 'e-Risk Bond & e-Approval Letter',
    riskBondNoLabel: 'e-Risk Bond No.',
    approvalLetterNoLabel: 'e-Approval Letter No.',
    completionDurationLabel: 'BEPZA-Approved Completion Duration',
    days: 'days',
    approvalLetterNote: 'This letter authorizes the sub-contracted items listed below and has been sent to both Bonders along with the e-Risk Bond.',
    bondRegisterTitle: 'Auto e-Bond Register Update',
    bondRegisterNote: 'e-Bond Registers of both Bonders auto-updated for goods in and out under this sub-contract.',
    bondRegisterUpdatedBadge: 'e-Bond Register Updated'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'সাব কন্ট্রাক্ট ব্যবস্থাপনা',
    subtitle: 'একজন বন্ডকারীর অন্য বন্ডকারীকে (সাধারণত একটি ইপিজেড প্রতিষ্ঠান) প্রক্রিয়াকরণ কাজ সাব-কন্ট্রাক্ট করার আবেদন পরিচালনা করে — বেপজা অনুমোদন, দ্বৈত ই-রিস্ক বন্ড সম্মতি, লিয়েন ব্যাংক যাচাইকরণ, এবং অনুমোদনে একটি ই-রিস্ক বন্ড নম্বর, ই-অনুমোদন পত্র, এবং স্বয়ংক্রিয় ই-বন্ড রেজিস্টার আপডেট।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    newApplication: 'নতুন সাব-কন্ট্রাক্ট আবেদন',
    pending: 'অপেক্ষমাণ আবেদন',
    approved: 'অনুমোদিত',
    disapproved: 'অননুমোদিত',
    awaitingBepza: 'বেপজা অনুমোদনের অপেক্ষায়',
    searchPlaceholder: 'লাইসেন্স নং বা বন্ডকারীর নাম খুঁজুন…',
    filterAll: 'সকল ধাপ',
    tableHeaders: {
      id: 'আবেদন আইডি',
      from: 'বন্ডকারী (প্রধান)',
      to: 'সাব-কন্ট্রাক্টর বন্ডকারী',
      items: 'সামগ্রী',
      stage: 'ধাপ',
      action: ''
    },
    review: 'পর্যালোচনা',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো সাব-কন্ট্রাক্ট আবেদন মেলেনি।',
    formTitle: 'সাব কন্ট্রাক্ট — আবেদন',
    step1: 'বন্ডকারী নির্বাচন করুন',
    step2: 'কাজের সামগ্রী',
    step3: 'সংযুক্তি',
    step4: 'পর্যালোচনা ও দাখিল',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বর দিয়ে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    next: 'পরবর্তী',
    back: 'পূর্ববর্তী',
    submit: 'আবেদন দাখিল করুন',
    fromLicenseLabel: 'প্রধান বন্ডকারী — বন্ড লাইসেন্স নং',
    toLicenseLabel: 'সাব-কন্ট্রাক্টর বন্ডকারী — বন্ড লাইসেন্স নং',
    sameLicenseError: 'প্রধান ও সাব-কন্ট্রাক্টর বন্ডকারী ভিন্ন হতে হবে।',
    itemsTitle: 'সাব-কন্ট্রাক্টকৃত কাজের সামগ্রী',
    hsCodeLabel: 'এইচএস কোড',
    descriptionLabel: 'বিবরণ',
    qtyLabel: 'পরিমাণ',
    addItem: 'আরেকটি সামগ্রী যোগ করুন',
    attachmentsTitle: 'সহায়ক সংযুক্তি (ই-সংযুক্তি)',
    attach: 'সংযুক্ত করুন',
    attached: 'সংযুক্ত হয়েছে',
    checklistNotice: 'ই-চেকলিস্ট উত্তীর্ণ — সকল প্রয়োজনীয় নথি সংযুক্ত। দাখিল করা যাবে।',
    reviewTitle: 'আবেদন পর্যালোচনা',
    submittedNotice: 'আবেদন দাখিল করা হয়েছে। আবেদনকারী ও সিবিসি কর্মকর্তাদের ই-নোটিফিকেশন পাঠানো হয়েছে।',
    pipelineTitle: 'সাব কন্ট্রাক্ট পাইপলাইন',
    checklistComplete: 'সকল প্রয়োজনীয় নথি সংযুক্ত হয়েছে — ই-চেকলিস্ট উত্তীর্ণ।',
    notificationSent: 'দাখিলের বিষয়ে আবেদনকারী ও সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    proceedBepza: 'বেপজায় পাঠান ও এগিয়ে যান',
    bepzaTitle: 'ই-বেপজা অনুমোদন',
    bepzaHint: 'সিস্টেম বেপজা সিস্টেমে অনুমোদনের জন্য প্রয়োজনীয় তথ্য পাঠায়।',
    bepzaApprovedNotice: 'বেপজা অনুমোদন পাওয়া গেছে। ই-অনুমোদন পত্র আবেদনে সংযুক্ত করা হয়েছে।',
    bepzaApprovalNoLabel: 'বেপজা অনুমোদন নং',
    bepzaDurationLabel: 'সাব-কন্ট্রাক্ট সম্পন্নকরণ সময়কাল (দিন)',
    assignProceed: 'স্বয়ংক্রিয়ভাবে আরও/এআরও বরাদ্দ করুন ও এগিয়ে যান',
    assignmentTitle: 'আরও/এআরও বরাদ্দ',
    assignmentHint: 'কমিশনার জোন/অবস্থান অনুযায়ী বরাদ্দ করেন।',
    notifyProceed: 'অবহিত করুন ও এগিয়ে যান',
    riskBondTitle: 'ই-রিস্ক বন্ড ও ই-সম্মতি',
    riskBondHint: 'সিস্টেম একটি ইলেকট্রনিক রিস্ক বন্ড তৈরি করেছে। এগিয়ে যাওয়ার আগে উভয় বন্ডকারীকে লগইন করে সম্মতি দিতে হবে।',
    fromConsent: 'প্রধান বন্ডকারীর সম্মতি',
    toConsent: 'সাব-কন্ট্রাক্টর বন্ডকারীর সম্মতি',
    consentGiven: 'সম্মতি প্রদত্ত',
    bothConsentedNotice: 'উভয় বন্ডকারী সম্মতি দিয়েছেন। ই-রিস্ক বন্ড উভয় বন্ডকারী প্রোফাইল ও আবেদনে সংযুক্ত করা হয়েছে।',
    proceedVerification: 'আরও/এআরও যাচাইকরণে এগিয়ে যান',
    verificationTitle: 'আরও/এআরও যাচাইকরণ',
    licenseeStatusTitle: 'ই-লাইসেন্সি স্ট্যাটাস চেক / ই-অডিট স্ট্যাটাস',
    otherLicenseFound: 'সাব-কন্ট্রাক্টর বন্ডকারীর এই মালিকানার অধীনে আরেকটি লাইসেন্স রয়েছে',
    noOtherLicense: 'সাব-কন্ট্রাক্টর বন্ডকারীর এই মালিকানার অধীনে অন্য কোনো লাইসেন্স পাওয়া যায়নি।',
    auditStatusLabel: 'অডিট স্ট্যাটাস',
    roNoteLabel: 'আরও/এআরও ই-নোট',
    requestAdditionalDocs: 'অতিরিক্ত সহায়ক নথি অনুরোধ করুন',
    docsProvided: 'বন্ডকারী অনুরোধকৃত নথি প্রদান করেন',
    docsProvidedNotice: 'আবেদনকারী কর্তৃক অনুরোধকৃত নথি আপলোড করা হয়েছে। সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    forwardLienBank: 'লিয়েন ব্যাংক যাচাইকরণে পাঠান',
    roNoteRequired: 'পাঠানোর আগে একটি ই-নোট প্রয়োজন।',
    lienBankTitle: 'লিয়েন ব্যাংকে ই-যাচাইকরণ অনুরোধ',
    selectLienBank: 'লিয়েন ব্যাংক নির্বাচন করুন (ব্যাংক কোড দ্বারা)',
    sendRequest: 'অনলাইন যাচাইকরণের জন্য সংযুক্তি পাঠান',
    lienBankSentNotice: 'লিয়েন ব্যাংকে যাচাইকরণ অনুরোধ পাঠানো হয়েছে।',
    lienBankVerify: 'লিয়েন ব্যাংক কর্তৃক যাচাইকৃত হিসেবে চিহ্নিত করুন',
    lienBankVerifiedNotice: 'লিয়েন ব্যাংক যাচাইকরণ সম্পন্ন করেছে। সিবিসি কর্মকর্তা ও আবেদনকারীকে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    proceedFinal: 'চূড়ান্ত পর্যালোচনায় এগিয়ে যান',
    finalReviewTitle: 'চূড়ান্ত ই-আবেদনকারী প্রতিবেদন (আরও/এআরও → এডিসি/জেসি)',
    documentArchivingNote: 'আবেদন, সংযুক্তি, প্রতিবেদন ও নোট সহজে খোঁজার জন্য শ্রেণিবদ্ধ নথি সংরক্ষণাগারে সংরক্ষিত হয়েছে।',
    finalNoteLabel: 'চূড়ান্ত সিদ্ধান্তের নোট',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalRequired: 'অননুমোদন করতে একটি কারণ প্রয়োজন।',
    disapprovedTitle: 'আবেদন অননুমোদিত',
    disapprovedBody: 'বন্ডকারীকে অননুমোদনের বিষয়ে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    approvalOutputTitle: 'ই-রিস্ক বন্ড ও ই-অনুমোদন পত্র',
    riskBondNoLabel: 'ই-রিস্ক বন্ড নং',
    approvalLetterNoLabel: 'ই-অনুমোদন পত্র নং',
    completionDurationLabel: 'বেপজা-অনুমোদিত সম্পন্নকরণ সময়কাল',
    days: 'দিন',
    approvalLetterNote: 'এই পত্রটি নিচে তালিকাভুক্ত সাব-কন্ট্রাক্টকৃত সামগ্রী অনুমোদন করে এবং ই-রিস্ক বন্ডসহ উভয় বন্ডকারীর কাছে পাঠানো হয়েছে।',
    bondRegisterTitle: 'স্বয়ংক্রিয় ই-বন্ড রেজিস্টার আপডেট',
    bondRegisterNote: 'এই সাব-কন্ট্রাক্টের অধীনে পণ্য আসা-যাওয়ার জন্য উভয় বন্ডকারীর ই-বন্ড রেজিস্টার স্বয়ংক্রিয়ভাবে আপডেট করা হয়েছে।',
    bondRegisterUpdatedBadge: 'ই-বন্ড রেজিস্টার আপডেটকৃত'
  }
};
type T = typeof T['en'];
export function SubContractManagement({
  language,
  onDone
}: SubContractManagementProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'apply'>('dashboard');
  const [applications, setApplications] = useState<SubContractApplication[]>(seedApplications);
  const [selected, setSelected] = useState<SubContractApplication | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | SubContractStage>('all');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const counts = useMemo(() => ({
    pending: applications.filter(a => a.stage !== 'approved' && a.stage !== 'disapproved').length,
    approved: applications.filter(a => a.stage === 'approved').length,
    disapproved: applications.filter(a => a.stage === 'disapproved').length,
    awaitingBepza: applications.filter(a => a.stage === 'bepza-approval').length
  }), [applications]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter(a => {
      const from = licenseOf(a.fromLicenseNo);
      const to = licenseOf(a.toLicenseNo);
      const matchesQuery = !q || a.fromLicenseNo.toLowerCase().includes(q) || a.toLicenseNo.toLowerCase().includes(q) || (from?.nameEn.toLowerCase().includes(q) ?? false) || (to?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesFilter = filter === 'all' || a.stage === filter;
      return matchesQuery && matchesFilter;
    });
  }, [applications, search, filter]);
  const handleUpdate = (updated: SubContractApplication) => {
    setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelected(updated);
  };
  if (view === 'apply') {
    return <ApplicationWizard language={language} t={t} onCancel={() => setView('dashboard')} onSubmit={a => {
      setApplications(prev => [a, ...prev]);
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
        <StatCard icon="fact_check" label={t.awaitingBepza} value={counts.awaitingBepza} color="#1E88E5" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as any)} className={`${inputClass} sm:w-56`}>
          <option value="all">{t.filterAll}</option>
          {Object.keys(stageLabels).map(s => <option key={s} value={s}>{stageLabels[s as SubContractStage][language]}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.tableHeaders.id}</th>
              <th className="px-4 py-3">{t.tableHeaders.from}</th>
              <th className="px-4 py-3">{t.tableHeaders.to}</th>
              <th className="px-4 py-3">{t.tableHeaders.stage}</th>
              <th className="px-4 py-3">{t.tableHeaders.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
            const from = licenseOf(a.fromLicenseNo);
            const to = licenseOf(a.toLicenseNo);
            return <tr key={a.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{a.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{from?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{a.fromLicenseNo}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{to?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{a.toLicenseNo}</p>
                  </td>
                  <td className="px-4 py-3"><StageBadge stage={a.stage} language={language} /></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(a)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
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

      {selected && <ApplicationDrawer application={selected} language={language} t={t} onClose={() => setSelected(null)} onUpdate={handleUpdate} onToast={showToast} />}
    </div>;
}
function ApplicationDrawer({
  application: a,
  language,
  t,
  onClose,
  onUpdate,
  onToast
}: {
  application: SubContractApplication;
  language: Language;
  t: T;
  onClose: () => void;
  onUpdate: (a: SubContractApplication) => void;
  onToast: (msg: string) => void;
}) {
  const from = licenseOf(a.fromLicenseNo);
  const to = licenseOf(a.toLicenseNo);
  const [roNote, setRoNote] = useState(a.roNote ?? '');
  const [roNoteError, setRoNoteError] = useState(false);
  const [selectedBank, setSelectedBank] = useState(a.lienBankCode ?? lienBanks[0]?.bankCode ?? '');
  const [finalNote, setFinalNote] = useState(a.finalDecisionNote ?? '');
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [disapprovalError, setDisapprovalError] = useState(false);
  const isException = a.stage === 'disapproved';
  const currentIndex = stageOrder.indexOf(a.stage);
  const otherLicenseOfOwner = bondLicenses.find(l => l.licenseNo !== a.toLicenseNo && l.nameEn === to?.nameEn);
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
            <span className="text-lg font-bold text-[#0A4D8C]">{a.id}</span>
            <StageBadge stage={a.stage} language={language} />
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <p className="font-medium text-[#1E293B]">{t.tableHeaders.from}: {from?.nameEn} · {a.fromLicenseNo}</p>
            <p className="mt-1 font-medium text-[#1E293B]">{t.tableHeaders.to}: {to?.nameEn} · {a.toLicenseNo}</p>
            <div className="mt-2 flex flex-col gap-1">
              {a.items.map(it => <p key={it.hsCode} className="text-[13px] text-[#334155]">{it.hsCode} — {language === 'en' ? it.descEn : it.descBn}: <span className="font-semibold text-[#0A4D8C]">{it.qty}</span></p>)}
            </div>
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
                        <p className="flex items-center gap-1.5"><Icon name="notifications_active" className="text-[15px] text-[#00A86B]" />{t.notificationSent}</p>
                        <button type="button" onClick={() => onUpdate({
                    ...a,
                    stage: 'bepza-approval'
                  })} className={`${ACTION_BTN} mt-1 w-fit`}>
                          <Icon name="gavel" className="text-[14px]" />
                          {t.proceedBepza}
                        </button>
                      </div>}

                    {status === 'current' && s === 'bepza-approval' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.bepzaHint}</p>
                        <button type="button" onClick={() => onUpdate({
                    ...a,
                    stage: 'assignment',
                    bepzaApprovalNo: `BEPZA-2026-${1200 + Math.floor(Math.random() * 500)}`,
                    bepzaCompletionDurationDays: 90
                  })} className={`${ACTION_BTN} w-fit`}>
                          <Icon name="verified" className="text-[14px]" />
                          {t.proceedBepza}
                        </button>
                      </div>}

                    {status === 'current' && s === 'assignment' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        {a.bepzaApprovalNo && <p className="rounded bg-emerald-50 p-2 text-[12px] text-[#00A86B]">{t.bepzaApprovedNotice} {t.bepzaApprovalNoLabel}: {a.bepzaApprovalNo} · {t.bepzaDurationLabel}: {a.bepzaCompletionDurationDays} {t.days}</p>}
                        <p className="text-[12px] text-[#64748B]">{t.assignmentHint}</p>
                        <p className="text-[13px] font-semibold text-[#0A4D8C]">{a.assignedOfficer?.[language] ?? officerPool[0][language]}</p>
                        <button type="button" onClick={() => onUpdate({
                    ...a,
                    stage: 'risk-bond-consent',
                    assignedOfficer: a.assignedOfficer ?? officerPool[Math.floor(Math.random() * officerPool.length)]
                  })} className={`${ACTION_BTN} w-fit`}>
                          {t.notifyProceed}
                        </button>
                      </div>}

                    {status === 'current' && s === 'risk-bond-consent' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.riskBondHint}</p>
                        <div className="flex flex-wrap gap-2">
                          {a.riskBondFromConsent ? <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[14px]" />{t.fromConsent}: {t.consentGiven}</span> : <button type="button" onClick={() => onUpdate({
                      ...a,
                      riskBondFromConsent: true
                    })} className={ACTION_BTN_OUTLINE}>{t.fromConsent}</button>}
                          {a.riskBondToConsent ? <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[14px]" />{t.toConsent}: {t.consentGiven}</span> : <button type="button" onClick={() => onUpdate({
                      ...a,
                      riskBondToConsent: true
                    })} className={ACTION_BTN_OUTLINE}>{t.toConsent}</button>}
                        </div>
                        {a.riskBondFromConsent && a.riskBondToConsent && <>
                            <p className="text-[12px] text-[#00A86B]">{t.bothConsentedNotice}</p>
                            <button type="button" onClick={() => onUpdate({
                        ...a,
                        stage: 'ro-verification'
                      })} className={`${ACTION_BTN} w-fit`}>
                              {t.proceedVerification}
                            </button>
                          </>}
                      </div>}

                    {status === 'current' && s === 'ro-verification' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <div>
                          <p className="mb-1 text-[12px] font-semibold text-[#334155]">{t.licenseeStatusTitle}</p>
                          {otherLicenseOfOwner ? <p className="text-[12px] text-[#334155]">{t.otherLicenseFound}: {otherLicenseOfOwner.licenseNo}. {t.auditStatusLabel}: <span className="font-semibold">{otherLicenseOfOwner.auditStatus}</span></p> : <p className="text-[12px] text-[#94A3B8]">{t.noOtherLicense}</p>}
                        </div>
                        <Field label={t.roNoteLabel} required error={roNoteError ? t.roNoteRequired : undefined}>
                          <textarea value={roNote} onChange={e => {
                      setRoNote(e.target.value);
                      setRoNoteError(false);
                    }} rows={2} className={inputClass} />
                        </Field>
                        <div className="flex flex-wrap gap-2">
                          {!a.additionalDocsRequested ? <button type="button" onClick={() => onUpdate({
                      ...a,
                      additionalDocsRequested: true
                    })} className={ACTION_BTN_OUTLINE}>{t.requestAdditionalDocs}</button> : !a.additionalDocsProvided ? <button type="button" onClick={() => {
                      onUpdate({
                        ...a,
                        additionalDocsProvided: true
                      });
                      onToast(t.docsProvidedNotice);
                    }} className={ACTION_BTN_OUTLINE}>{t.docsProvided}</button> : <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[14px]" />{t.docsProvidedNotice}</span>}
                        </div>
                        <button type="button" onClick={() => {
                    if (!roNote.trim()) {
                      setRoNoteError(true);
                      return;
                    }
                    onUpdate({
                      ...a,
                      stage: 'lien-bank-verification',
                      roNote: roNote.trim()
                    });
                  }} className={`${ACTION_BTN} w-fit`}>
                          <Icon name="forward_to_inbox" className="text-[14px]" />
                          {t.forwardLienBank}
                        </button>
                      </div>}

                    {status === 'current' && s === 'lien-bank-verification' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <Field label={t.selectLienBank}>
                          <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className={inputClass}>
                            {lienBanks.map(b => <option key={b.bankCode} value={b.bankCode}>{b.bankCode} — {language === 'en' ? b.nameEn : b.nameBn}</option>)}
                          </select>
                        </Field>
                        {!a.lienBankCode ? <button type="button" onClick={() => {
                    onUpdate({
                      ...a,
                      lienBankCode: selectedBank
                    });
                    onToast(t.lienBankSentNotice);
                  }} className={`${ACTION_BTN} w-fit`}>{t.sendRequest}</button> : !a.lienBankVerified ? <button type="button" onClick={() => {
                    onUpdate({
                      ...a,
                      lienBankVerified: true
                    });
                    onToast(t.lienBankVerifiedNotice);
                  }} className={`${ACTION_BTN} w-fit`}>{t.lienBankVerify}</button> : <button type="button" onClick={() => onUpdate({
                    ...a,
                    stage: 'final-review'
                  })} className={`${ACTION_BTN_GREEN} w-fit`}>{t.proceedFinal}</button>}
                      </div>}

                    {status === 'current' && s === 'final-review' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.documentArchivingNote}</p>
                        <Field label={t.finalNoteLabel}>
                          <textarea value={finalNote} onChange={e => setFinalNote(e.target.value)} rows={2} className={inputClass} />
                        </Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => onUpdate({
                      ...a,
                      stage: 'approved',
                      finalDecisionNote: finalNote.trim(),
                      riskBondNo: `RB-2026-${1000 + Math.floor(Math.random() * 900)}`,
                      approvalLetterNo: `SCAL-2026-${1000 + Math.floor(Math.random() * 900)}`,
                      bondRegisterUpdated: true
                    })} className={`${ACTION_BTN_GREEN} w-fit`}>
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
                            ...a,
                            stage: 'disapproved',
                            disapprovalReason: disapprovalReason.trim()
                          });
                        }} className={`${ACTION_BTN_RED} w-fit`}>
                                {t.disapprove}
                              </button>
                            </div>
                          </details>
                        </div>
                      </div>}
                  </div>;
          })}
            </div>}

          {a.stage === 'approved' && <div className="flex flex-col gap-3">
              <div className="rounded-xl border-2 border-[#0A4D8C]/20 bg-white p-5">
                <div className="flex items-center justify-between border-b border-dashed border-[#CBD5E1] pb-3">
                  <p className="text-base font-bold text-[#0A4D8C]">{t.approvalOutputTitle}</p>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-[#64748B]">
                  <p>{t.riskBondNoLabel}: <span className="font-semibold text-[#1E293B]">{a.riskBondNo}</span></p>
                  <p>{t.approvalLetterNoLabel}: <span className="font-semibold text-[#1E293B]">{a.approvalLetterNo}</span></p>
                  <p className="col-span-2">{t.completionDurationLabel}: <span className="font-semibold text-[#1E293B]">{a.bepzaCompletionDurationDays} {t.days}</span></p>
                </div>
                <p className="mt-2 text-[12px] text-[#64748B]">{t.approvalLetterNote}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {a.items.map(it => <p key={it.hsCode} className="text-[13px] text-[#334155]">{it.hsCode} — {language === 'en' ? it.descEn : it.descBn}: <span className="font-semibold text-[#0A4D8C]">{it.qty}</span></p>)}
                </div>
              </div>
              {a.bondRegisterUpdated && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-[#087F52]">
                  <p className="flex items-center gap-1.5 font-bold"><Icon name="menu_book" className="text-[16px]" />{t.bondRegisterTitle}</p>
                  <p className="mt-1">{t.bondRegisterNote}</p>
                </div>}
            </div>}

          {isException && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-[#B91C1C]">
              <p className="font-bold">{t.disapprovedTitle}</p>
              <p className="mt-1">{a.disapprovalReason}</p>
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
  onSubmit: (a: SubContractApplication) => void;
}) {
  const [step, setStep] = useState(1);
  const [fromLicenseNo, setFromLicenseNo] = useState('');
  const [verifiedFrom, setVerifiedFrom] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [fromNotFound, setFromNotFound] = useState(false);
  const [toLicenseNo, setToLicenseNo] = useState('');
  const [verifiedTo, setVerifiedTo] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [toNotFound, setToNotFound] = useState(false);
  const [sameLicenseErr, setSameLicenseErr] = useState(false);
  const [items, setItems] = useState<{
    hsCode: string;
    descEn: string;
    qty: string;
  }[]>([{
    hsCode: '',
    descEn: '',
    qty: ''
  }]);
  const [attached, setAttached] = useState<Record<string, boolean>>({});
  const verifyFrom = () => {
    const found = bondLicenses.find(l => normalizeLicenseNo(l.licenseNo) === normalizeLicenseNo(fromLicenseNo));
    setVerifiedFrom(found);
    setFromNotFound(!found);
  };
  const verifyTo = () => {
    const found = bondLicenses.find(l => normalizeLicenseNo(l.licenseNo) === normalizeLicenseNo(toLicenseNo));
    setVerifiedTo(found);
    setToNotFound(!found);
  };
  const canProceedStep1 = verifiedFrom && verifiedTo && normalizeLicenseNo(fromLicenseNo) !== normalizeLicenseNo(toLicenseNo);
  const canSubmit = verifiedFrom && verifiedTo && items.every(it => it.hsCode.trim() && it.qty.trim()) && attachmentDefs.every(d => attached[d.id]);
  return <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-6 py-6">
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
            <Field label={t.fromLicenseLabel} required>
              <div className="flex gap-2">
                <TextInput value={fromLicenseNo} onChange={v => {
              setFromLicenseNo(v);
              setVerifiedFrom(undefined);
              setFromNotFound(false);
              setSameLicenseErr(false);
            }} placeholder="BL-2022-01876" error={fromNotFound} />
                <button type="button" onClick={verifyFrom} className="shrink-0 rounded-lg bg-[#0A4D8C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#083E71]">
                  {t.verify}
                </button>
              </div>
              {fromNotFound && <p className="text-[11px] font-medium text-[#DC2626]">{t.notFound}</p>}
            </Field>
            {verifiedFrom && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
                <Icon name="check_circle" className="text-[16px]" />
                {verifiedFrom.licenseNo} · {t.verified} · {verifiedFrom.nameEn}
              </div>}
            <Field label={t.toLicenseLabel} required>
              <div className="flex gap-2">
                <TextInput value={toLicenseNo} onChange={v => {
              setToLicenseNo(v);
              setVerifiedTo(undefined);
              setToNotFound(false);
              setSameLicenseErr(false);
            }} placeholder="BL-2018-00098" error={toNotFound} />
                <button type="button" onClick={verifyTo} className="shrink-0 rounded-lg bg-[#0A4D8C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#083E71]">
                  {t.verify}
                </button>
              </div>
              {toNotFound && <p className="text-[11px] font-medium text-[#DC2626]">{t.notFound}</p>}
              {sameLicenseErr && <p className="text-[11px] font-medium text-[#DC2626]">{t.sameLicenseError}</p>}
            </Field>
            {verifiedTo && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
                <Icon name="check_circle" className="text-[16px]" />
                {verifiedTo.licenseNo} · {t.verified} · {verifiedTo.nameEn}
              </div>}
          </>}

        {step === 2 && <>
            <p className="text-[13px] font-bold text-[#1E293B]">{t.itemsTitle}</p>
            <div className="flex flex-col gap-2">
              {items.map((it, i) => <div key={i} className="grid grid-cols-3 gap-2 rounded-lg border border-[#E2E8F0] p-2">
                  <TextInput value={it.hsCode} onChange={v => setItems(prev => prev.map((x, idx) => idx === i ? {
                ...x,
                hsCode: v
              } : x))} placeholder={t.hsCodeLabel} />
                  <TextInput value={it.descEn} onChange={v => setItems(prev => prev.map((x, idx) => idx === i ? {
                ...x,
                descEn: v
              } : x))} placeholder={t.descriptionLabel} />
                  <TextInput value={it.qty} onChange={v => setItems(prev => prev.map((x, idx) => idx === i ? {
                ...x,
                qty: v
              } : x))} placeholder={t.qtyLabel} />
                </div>)}
              <button type="button" onClick={() => setItems(prev => [...prev, {
              hsCode: '',
              descEn: '',
              qty: ''
            }])} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3.5 py-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                <Icon name="add" className="text-[14px]" />
                {t.addItem}
              </button>
            </div>
          </>}

        {step === 3 && <>
            <p className="text-[13px] font-bold text-[#1E293B]">{t.attachmentsTitle}</p>
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
            {attachmentDefs.every(d => attached[d.id]) && <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#00A86B]"><Icon name="check_circle" className="text-[15px]" />{t.checklistNotice}</p>}
          </>}

        {step === 4 && verifiedFrom && verifiedTo && <div className="flex flex-col gap-3 text-sm">
            <p className="text-[13px] font-bold text-[#1E293B]">{t.reviewTitle}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-[#F8FAFC] p-4">
              <div><p className="text-[11px] text-[#94A3B8]">{t.fromLicenseLabel}</p><p className="font-medium text-[#1E293B]">{verifiedFrom.licenseNo} — {verifiedFrom.nameEn}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">{t.toLicenseLabel}</p><p className="font-medium text-[#1E293B]">{verifiedTo.licenseNo} — {verifiedTo.nameEn}</p></div>
              {items.map((it, i) => <div key={i} className="col-span-2"><p className="text-[11px] text-[#94A3B8]">{t.itemsTitle} #{i + 1}</p><p className="font-medium text-[#1E293B]">{it.hsCode} — {it.descEn} — {it.qty}</p></div>)}
            </div>
          </div>}

        <div className="flex justify-between pt-2">
          <button type="button" onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            {t.back}
          </button>
          {step < 4 ? <button type="button" disabled={step === 1 && !canProceedStep1} onClick={() => {
          if (step === 1 && verifiedFrom && verifiedTo && normalizeLicenseNo(fromLicenseNo) === normalizeLicenseNo(toLicenseNo)) {
            setSameLicenseErr(true);
            return;
          }
          setStep(s => s + 1);
        }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.next}
            </button> : <button type="button" disabled={!canSubmit} onClick={() => {
          if (!verifiedFrom || !verifiedTo) return;
          const app: SubContractApplication = {
            id: `SC-2026-0${90 + Math.floor(Math.random() * 90)}`,
            fromLicenseNo: verifiedFrom.licenseNo,
            toLicenseNo: verifiedTo.licenseNo,
            items: items.map(it => ({
              hsCode: it.hsCode,
              descEn: it.descEn || it.hsCode,
              descBn: it.descEn || it.hsCode,
              qty: it.qty
            })),
            submittedAt: '26 Jul 2026',
            stage: 'submitted',
            riskBondFromConsent: false,
            riskBondToConsent: false
          };
          onSubmit(app);
        }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.submit}
            </button>}
        </div>
      </div>
    </div>;
}
