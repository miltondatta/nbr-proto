import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { coefficientDbArchive as seedDbArchive, licenseOf, providers as seedProviders, stageLabels, validationRequests as seedRequests, type CoefficientDbEntry, type CoefficientProvider, type RawMaterialLine, type RequestStage, type Specialist, type ValidationRequest } from './coefficientData';
type Language = 'en' | 'bn';
interface CoefficientManagementProps {
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
  stage: RequestStage;
  language: Language;
}) {
  const color = stage === 'approved' ? '#00A86B' : stage === 'rejected' ? '#DC2626' : '#B45309';
  const s = stageLabels[stage];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${color}1A`,
    color
  }}>
      {s[language]}
    </span>;
}
function VerificationBadge({
  status,
  language
}: {
  status: CoefficientProvider['verification'];
  language: Language;
}) {
  const map = {
    pending: { en: 'Pending Verification', bn: 'যাচাই অপেক্ষমাণ', color: '#B45309' },
    verified: { en: 'Verified', bn: 'যাচাইকৃত', color: '#00A86B' },
    suspended: { en: 'Suspended', bn: 'স্থগিত', color: '#DC2626' }
  } as const;
  const s = map[status];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${s.color}1A`,
    color: s.color
  }}>
      {s[language]}
    </span>;
}
function PaymentBadge({
  status,
  language
}: {
  status: CoefficientProvider['paymentSetup'];
  language: Language;
}) {
  const map = {
    pending: { en: 'Payment Setup Pending', bn: 'পেমেন্ট সেটআপ অপেক্ষমাণ', color: '#B45309' },
    configured: { en: 'Payment Configured', bn: 'পেমেন্ট কনফিগার করা হয়েছে', color: '#00A86B' }
  } as const;
  const s = map[status];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${s.color}1A`,
    color: s.color
  }}>
      {s[language]}
    </span>;
}
const normalizeLicenseNo = (s: string) => s.trim().toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, '');
const attachmentDefs = [{
  id: 'sampleProduct',
  en: 'Finished Product Sample Photo',
  bn: 'তৈরি পণ্যের নমুনা ছবি'
}, {
  id: 'billOfMaterials',
  en: 'Draft Bill of Materials',
  bn: 'বিল অব ম্যাটেরিয়ালস খসড়া'
}, {
  id: 'machinerySpec',
  en: 'Machinery Specification Sheet',
  bn: 'যন্ত্রপাতির স্পেসিফিকেশন শীট'
}];
function getProviderName(providers: CoefficientProvider[], id: string, language: Language): string {
  const p = providers.find(pr => pr.id === id);
  return p ? language === 'en' ? p.nameEn : p.nameBn : id;
}
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Co-efficient Management',
    subtitle: 'Manage DEDO and other co-efficient provider profiles, review Bonder validation requests through DEDO or outsourced providers, and maintain the searchable Co-efficient Database used across HS Code, Entitlement and UP calculations.',
    backToDashboard: 'Back to Dashboard',
    tabRequests: 'Validation Requests',
    tabProviders: 'Providers',
    tabDatabase: 'Co-efficient Database',
    newRequest: 'New Validation Request',
    pending: 'Pending Requests',
    approved: 'Approved',
    rejected: 'Rejected',
    outsourcedActive: 'Active Outsourced Cases',
    tableHeaders: {
      id: 'Request ID',
      bonder: 'Bonder',
      finishedGoods: 'Finished Goods HS',
      path: 'Path',
      stage: 'Stage',
      action: ''
    },
    review: 'Review',
    searchPlaceholder: 'Search by license no. or bonder name…',
    filterAll: 'All Stages',
    noResults: 'No validation requests match the current filters.',
    pathDbMatch: 'DB Match Reuse',
    pathDedoDirect: 'DEDO Direct',
    pathOutsourced: 'Outsourced',
    pathPending: 'Not yet decided',
    providersTitle: 'Provider Directory',
    enlistProvider: 'Enlist New Provider',
    dedoTag: 'Primary Co-efficient Provider',
    branches: 'Branches',
    specialists: 'Specialists',
    specialty: 'Key Specialty',
    verifyAuthorize: 'Verify & Authorize',
    verifiedNotice: 'Provider verified and authorized for co-efficient validation.',
    close: 'Close',
    enlistTitle: 'Enlist Other Co-efficient Provider',
    providerNameLabel: 'Provider Name',
    addressLabel: 'Address',
    phoneLabel: 'Phone No.',
    emailLabel: 'Official Email Address',
    branchLabel: 'Branches Outside Dhaka (comma separated)',
    specialtyLabel: 'Key Area of Specialty (comma separated)',
    specialistNameLabel: 'Specialist Name',
    specialistEmailLabel: 'Specialist Email',
    specialistPhoneLabel: 'Specialist Phone',
    submitEnlist: 'Submit for CBC Review',
    cancel: 'Cancel',
    enlistedNotice: 'Provider profile created — pending DEDO verification.',
    dbSearchTitle: 'Customized Search',
    dbSearchPlaceholder: 'Search by HS code, description, bonder, or provider…',
    dbTableHeaders: {
      hs: 'Finished Goods HS',
      desc: 'Description',
      rawMaterials: 'Raw Materials',
      provider: 'Provider',
      bonder: 'Bonder',
      date: 'Approved'
    },
    calcTitle: 'e-Calculation — Total Raw Material Needed',
    calcSelectEntry: 'Select a Co-efficient Database Entry',
    calcQtyLabel: 'Finished Goods Quantity (dozens)',
    calcButton: 'Calculate',
    calcResultTitle: 'Calculated Raw Material Requirement',
    reportTitle: 'e-Co-efficient Report',
    reportByFinishedGoods: 'By Finished Goods',
    reportByRawMaterial: 'By Raw Material',
    reportByProvider: 'By Provider',
    reportByBonder: 'By Bonder',
    generate: 'Generate Report',
    reportGenerated: 'Report generated and ready to export.',
    formTitle: 'Co-efficient Validation — Application',
    step1: 'Select License',
    step2: 'e-Search Existing Database',
    step3: 'Request Details & Attachments',
    step4: 'Review & Submit',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    hsCodeLabel: 'Finished Goods HS Code',
    descriptionLabel: 'Finished Goods Description',
    searchDb: 'Search Database',
    matchFoundTitle: 'Matching Co-efficient Found',
    matchFoundHint: 'This finished-goods HS code already has an approved co-efficient. You may include it directly, or continue to request a fresh validation.',
    useExisting: 'Use This Validated Co-efficient',
    continueNew: 'Continue with New Validation Request',
    noMatchTitle: 'No Existing Co-efficient Found',
    noMatchHint: 'Proceed with a new validation request to DEDO.',
    attachmentsTitle: 'Supporting Attachments (e-Attachment)',
    attach: 'Attach',
    attached: 'Attached',
    reviewTitle: 'Review Application',
    usedExistingNotice: 'Existing validated co-efficient included in the application. Attached to Bonder Profile.',
    submittedNotice: 'Application submitted. DEDO & CBC officials auto-notified for application selection.',
    pipelineTitle: 'Co-efficient Validation Pipeline',
    pathLabel: 'Path',
    slaLabel: 'SLA',
    slaDays: 'days',
    selectionTitle: 'DEDO Application Selection',
    approveFromMatch: 'Approve from Existing DB Match',
    acceptDirect: 'Accept for DEDO Direct Validation',
    outsourceTo: 'Outsource to Specialist Provider(s)',
    selectProvidersHint: 'Select one or more eligible providers to forward this request to.',
    confirmOutsource: 'Forward to Selected Providers',
    dedoValidationTitle: 'DEDO Validation — Enter Co-efficient Data',
    providerValidationTitle: 'Provider Validation — Enter Co-efficient Data',
    rawMaterialsTitle: 'Raw Materials (HS Code-wise, per unit of finished goods)',
    addLine: 'Add Raw Material Line',
    removeLine: 'Remove',
    approveArchive: 'Approve & Archive to Database',
    reject: 'Reject',
    rejectionReasonLabel: 'Reason for Rejection',
    rejectionRequired: 'A reason is required to reject.',
    reportDiscrepancy: 'Report Discrepancy Instead (e-Inspection Report)',
    inspectionNoteLabel: 'Inspection Report / Discrepancy Explanation',
    forwardFinal: 'Forward to DEDO for Final Approval',
    outsourceResponsesTitle: 'Provider Responses',
    quote: 'Quote',
    eta: 'ETA',
    responded: 'Responded',
    awaitingResponse: 'Awaiting Response',
    requestExplanation: 'Request Explanation',
    explanationRecorded: 'Explanation recorded.',
    suspendProvider: 'Suspend Provider Enlistment',
    suspendedNotice: 'Provider enlistment suspended by DEDO.',
    proceedBonderSelection: 'Proceed to Bonder Selection',
    bonderSelectionTitle: 'Bonder Selection of Provider',
    confirmSelection: 'Confirm Selection & Forward to DEDO',
    consentTitle: 'DEDO Consent',
    consentHint: 'Bonder has selected a provider. DEDO consent is required before the provider proceeds.',
    provideConsent: 'Provide Consent & Instruct Provider',
    paymentTitle: 'Provider Payment',
    paymentHint: 'Bonder must pay the selected provider before validation work begins.',
    simulatePayment: 'Simulate Payment (e-Chalan / Payment Gateway)',
    finalApprovalTitle: 'DEDO Final Approval',
    approve: 'Approve',
    disapprove: 'Disapprove',
    archivedNoticeTitle: 'Approved & Archived',
    archivedNoticeBody: 'The approved co-efficient has been attached to the Bonder Profile and added to the Co-efficient Database for future reference.',
    rejectedNoticeTitle: 'Request Rejected',
    rejectedNoticeBody: 'Bonder and CBC officials have been auto-notified with the reason for rejection.',
    validatedBy: 'Validated By'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা',
    subtitle: 'ডিইডিও ও অন্যান্য কো-এফিসিয়েন্ট প্রোভাইডার প্রোফাইল পরিচালনা করুন, ডিইডিও বা আউটসোর্সড প্রোভাইডারের মাধ্যমে বন্ডকারীর যাচাইকরণ অনুরোধ পর্যালোচনা করুন, এবং এইচএস কোড, এনটাইটেলমেন্ট ও ইউপি গণনায় ব্যবহৃত অনুসন্ধানযোগ্য কো-এফিসিয়েন্ট ডেটাবেজ বজায় রাখুন।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    tabRequests: 'যাচাইকরণ অনুরোধ',
    tabProviders: 'প্রোভাইডার',
    tabDatabase: 'কো-এফিসিয়েন্ট ডেটাবেজ',
    newRequest: 'নতুন যাচাইকরণ অনুরোধ',
    pending: 'অপেক্ষমাণ অনুরোধ',
    approved: 'অনুমোদিত',
    rejected: 'প্রত্যাখ্যাত',
    outsourcedActive: 'সক্রিয় আউটসোর্সড কেস',
    tableHeaders: {
      id: 'অনুরোধ আইডি',
      bonder: 'বন্ডকারী',
      finishedGoods: 'তৈরি পণ্য এইচএস',
      path: 'পথ',
      stage: 'ধাপ',
      action: ''
    },
    review: 'পর্যালোচনা',
    searchPlaceholder: 'লাইসেন্স নং বা বন্ডকারীর নাম খুঁজুন…',
    filterAll: 'সকল ধাপ',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো যাচাইকরণ অনুরোধ মেলেনি।',
    pathDbMatch: 'ডিবি ম্যাচ পুনঃব্যবহার',
    pathDedoDirect: 'ডিইডিও সরাসরি',
    pathOutsourced: 'আউটসোর্সড',
    pathPending: 'এখনো সিদ্ধান্ত হয়নি',
    providersTitle: 'প্রোভাইডার ডিরেক্টরি',
    enlistProvider: 'নতুন প্রোভাইডার তালিকাভুক্ত করুন',
    dedoTag: 'প্রধান কো-এফিসিয়েন্ট প্রোভাইডার',
    branches: 'শাখা',
    specialists: 'বিশেষজ্ঞ',
    specialty: 'মূল বিশেষত্ব',
    verifyAuthorize: 'যাচাই ও অনুমোদন করুন',
    verifiedNotice: 'প্রোভাইডার যাচাই ও কো-এফিসিয়েন্ট যাচাইকরণের জন্য অনুমোদিত হয়েছে।',
    close: 'বন্ধ করুন',
    enlistTitle: 'অন্যান্য কো-এফিসিয়েন্ট প্রোভাইডার তালিকাভুক্ত করুন',
    providerNameLabel: 'প্রোভাইডারের নাম',
    addressLabel: 'ঠিকানা',
    phoneLabel: 'ফোন নং',
    emailLabel: 'অফিসিয়াল ইমেইল ঠিকানা',
    branchLabel: 'ঢাকার বাইরে শাখা (কমা দিয়ে পৃথক)',
    specialtyLabel: 'মূল বিশেষত্বের ক্ষেত্র (কমা দিয়ে পৃথক)',
    specialistNameLabel: 'বিশেষজ্ঞের নাম',
    specialistEmailLabel: 'বিশেষজ্ঞের ইমেইল',
    specialistPhoneLabel: 'বিশেষজ্ঞের ফোন',
    submitEnlist: 'সিবিসি পর্যালোচনার জন্য দাখিল করুন',
    cancel: 'বাতিল করুন',
    enlistedNotice: 'প্রোভাইডার প্রোফাইল তৈরি হয়েছে — ডিইডিও যাচাইয়ের অপেক্ষায়।',
    dbSearchTitle: 'কাস্টমাইজড সার্চ',
    dbSearchPlaceholder: 'এইচএস কোড, বিবরণ, বন্ডকারী, বা প্রোভাইডার দিয়ে খুঁজুন…',
    dbTableHeaders: {
      hs: 'তৈরি পণ্য এইচএস',
      desc: 'বিবরণ',
      rawMaterials: 'কাঁচামাল',
      provider: 'প্রোভাইডার',
      bonder: 'বন্ডকারী',
      date: 'অনুমোদিত'
    },
    calcTitle: 'ই-গণনা — মোট প্রয়োজনীয় কাঁচামাল',
    calcSelectEntry: 'একটি কো-এফিসিয়েন্ট ডেটাবেজ এন্ট্রি নির্বাচন করুন',
    calcQtyLabel: 'তৈরি পণ্যের পরিমাণ (ডজন)',
    calcButton: 'গণনা করুন',
    calcResultTitle: 'গণনাকৃত কাঁচামালের প্রয়োজন',
    reportTitle: 'ই-কো-এফিসিয়েন্ট রিপোর্ট',
    reportByFinishedGoods: 'তৈরি পণ্য অনুযায়ী',
    reportByRawMaterial: 'কাঁচামাল অনুযায়ী',
    reportByProvider: 'প্রোভাইডার অনুযায়ী',
    reportByBonder: 'বন্ডকারী অনুযায়ী',
    generate: 'রিপোর্ট তৈরি করুন',
    reportGenerated: 'রিপোর্ট তৈরি হয়েছে এবং এক্সপোর্টের জন্য প্রস্তুত।',
    formTitle: 'কো-এফিসিয়েন্ট যাচাইকরণ — আবেদন',
    step1: 'লাইসেন্স নির্বাচন করুন',
    step2: 'বিদ্যমান ডেটাবেজে ই-সার্চ',
    step3: 'অনুরোধের বিবরণ ও সংযুক্তি',
    step4: 'পর্যালোচনা ও দাখিল',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বর দিয়ে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    next: 'পরবর্তী',
    back: 'পূর্ববর্তী',
    submit: 'আবেদন দাখিল করুন',
    hsCodeLabel: 'তৈরি পণ্যের এইচএস কোড',
    descriptionLabel: 'তৈরি পণ্যের বিবরণ',
    searchDb: 'ডেটাবেজ খুঁজুন',
    matchFoundTitle: 'মিলযুক্ত কো-এফিসিয়েন্ট পাওয়া গেছে',
    matchFoundHint: 'এই তৈরি পণ্যের এইচএস কোডের জন্য ইতিমধ্যে একটি অনুমোদিত কো-এফিসিয়েন্ট রয়েছে। আপনি এটি সরাসরি অন্তর্ভুক্ত করতে পারেন, অথবা নতুন যাচাইকরণের অনুরোধ চালিয়ে যেতে পারেন।',
    useExisting: 'এই যাচাইকৃত কো-এফিসিয়েন্ট ব্যবহার করুন',
    continueNew: 'নতুন যাচাইকরণ অনুরোধ চালিয়ে যান',
    noMatchTitle: 'কোনো বিদ্যমান কো-এফিসিয়েন্ট পাওয়া যায়নি',
    noMatchHint: 'ডিইডিও-এর কাছে নতুন যাচাইকরণের অনুরোধ পাঠান।',
    attachmentsTitle: 'সহায়ক সংযুক্তি (ই-সংযুক্তি)',
    attach: 'সংযুক্ত করুন',
    attached: 'সংযুক্ত হয়েছে',
    reviewTitle: 'আবেদন পর্যালোচনা',
    usedExistingNotice: 'বিদ্যমান যাচাইকৃত কো-এফিসিয়েন্ট আবেদনে অন্তর্ভুক্ত করা হয়েছে। বন্ডকারী প্রোফাইলে সংযুক্ত করা হয়েছে।',
    submittedNotice: 'আবেদন দাখিল করা হয়েছে। ডিইডিও ও সিবিসি কর্মকর্তাদের আবেদন নির্বাচনের জন্য স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    pipelineTitle: 'কো-এফিসিয়েন্ট যাচাইকরণ পাইপলাইন',
    pathLabel: 'পথ',
    slaLabel: 'এসএলএ',
    slaDays: 'দিন',
    selectionTitle: 'ডিইডিও আবেদন নির্বাচন',
    approveFromMatch: 'বিদ্যমান ডিবি ম্যাচ থেকে অনুমোদন করুন',
    acceptDirect: 'ডিইডিও সরাসরি যাচাইকরণের জন্য গ্রহণ করুন',
    outsourceTo: 'বিশেষজ্ঞ প্রোভাইডারে আউটসোর্স করুন',
    selectProvidersHint: 'এই অনুরোধ পাঠানোর জন্য এক বা একাধিক যোগ্য প্রোভাইডার নির্বাচন করুন।',
    confirmOutsource: 'নির্বাচিত প্রোভাইডারদের কাছে প্রেরণ করুন',
    dedoValidationTitle: 'ডিইডিও যাচাইকরণ — কো-এফিসিয়েন্ট ডেটা লিখুন',
    providerValidationTitle: 'প্রোভাইডার যাচাইকরণ — কো-এফিসিয়েন্ট ডেটা লিখুন',
    rawMaterialsTitle: 'কাঁচামাল (এইচএস কোড অনুযায়ী, তৈরি পণ্যের প্রতি ইউনিটে)',
    addLine: 'কাঁচামাল লাইন যোগ করুন',
    removeLine: 'সরান',
    approveArchive: 'অনুমোদন করুন ও ডেটাবেজে সংরক্ষণ করুন',
    reject: 'প্রত্যাখ্যান করুন',
    rejectionReasonLabel: 'প্রত্যাখ্যানের কারণ',
    rejectionRequired: 'প্রত্যাখ্যান করতে একটি কারণ প্রয়োজন।',
    reportDiscrepancy: 'পরিবর্তে অসঙ্গতি রিপোর্ট করুন (ই-ইন্সপেকশন রিপোর্ট)',
    inspectionNoteLabel: 'ইন্সপেকশন রিপোর্ট / অসঙ্গতির ব্যাখ্যা',
    forwardFinal: 'চূড়ান্ত অনুমোদনের জন্য ডিইডিও-কে পাঠান',
    outsourceResponsesTitle: 'প্রোভাইডার সাড়া',
    quote: 'কোটেশন',
    eta: 'সময়সীমা',
    responded: 'সাড়া দিয়েছে',
    awaitingResponse: 'সাড়ার অপেক্ষায়',
    requestExplanation: 'ব্যাখ্যা চাওয়া হয়েছে',
    explanationRecorded: 'ব্যাখ্যা রেকর্ড করা হয়েছে।',
    suspendProvider: 'প্রোভাইডারের তালিকাভুক্তি স্থগিত করুন',
    suspendedNotice: 'ডিইডিও কর্তৃক প্রোভাইডারের তালিকাভুক্তি স্থগিত করা হয়েছে।',
    proceedBonderSelection: 'বন্ডকারী নির্বাচনে এগিয়ে যান',
    bonderSelectionTitle: 'প্রোভাইডারের বন্ডকারী নির্বাচন',
    confirmSelection: 'নির্বাচন নিশ্চিত করুন ও ডিইডিও-কে পাঠান',
    consentTitle: 'ডিইডিও সম্মতি',
    consentHint: 'বন্ডকারী একজন প্রোভাইডার নির্বাচন করেছেন। প্রোভাইডার এগিয়ে যাওয়ার আগে ডিইডিও-এর সম্মতি প্রয়োজন।',
    provideConsent: 'সম্মতি প্রদান করুন ও প্রোভাইডারকে নির্দেশ দিন',
    paymentTitle: 'প্রোভাইডার পেমেন্ট',
    paymentHint: 'যাচাইকরণ কাজ শুরুর আগে বন্ডকারীকে নির্বাচিত প্রোভাইডারকে পেমেন্ট করতে হবে।',
    simulatePayment: 'পেমেন্ট সিমুলেট করুন (ই-চালান / পেমেন্ট গেটওয়ে)',
    finalApprovalTitle: 'ডিইডিও চূড়ান্ত অনুমোদন',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    archivedNoticeTitle: 'অনুমোদিত ও সংরক্ষিত',
    archivedNoticeBody: 'অনুমোদিত কো-এফিসিয়েন্ট বন্ডকারী প্রোফাইলে সংযুক্ত করা হয়েছে এবং ভবিষ্যতের জন্য কো-এফিসিয়েন্ট ডেটাবেজে যোগ করা হয়েছে।',
    rejectedNoticeTitle: 'অনুরোধ প্রত্যাখ্যাত',
    rejectedNoticeBody: 'বন্ডকারী ও সিবিসি কর্মকর্তাদের প্রত্যাখ্যানের কারণসহ স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    validatedBy: 'যাচাইকারী'
  }
};
type T = typeof T['en'];
export function CoefficientManagement({
  language,
  onDone
}: CoefficientManagementProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'apply'>('dashboard');
  const [tab, setTab] = useState<'requests' | 'providers' | 'database'>('requests');
  const [requests, setRequests] = useState<ValidationRequest[]>(seedRequests);
  const [providerList, setProviderList] = useState<CoefficientProvider[]>(seedProviders);
  const [dbArchive, setDbArchive] = useState<CoefficientDbEntry[]>(seedDbArchive);
  const [selectedRequest, setSelectedRequest] = useState<ValidationRequest | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CoefficientProvider | null>(null);
  const [showEnlist, setShowEnlist] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [queueSearch, setQueueSearch] = useState('');
  const [queueFilter, setQueueFilter] = useState<'all' | RequestStage>('all');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const counts = useMemo(() => ({
    pending: requests.filter(r => r.stage !== 'approved' && r.stage !== 'rejected').length,
    approved: requests.filter(r => r.stage === 'approved').length,
    rejected: requests.filter(r => r.stage === 'rejected').length,
    outsourced: requests.filter(r => r.path === 'outsourced' && r.stage !== 'approved' && r.stage !== 'rejected').length
  }), [requests]);
  const filteredQueue = useMemo(() => {
    const q = queueSearch.trim().toLowerCase();
    return requests.filter(r => {
      const lic = licenseOf(r.licenseNo);
      const matchesQuery = !q || r.licenseNo.toLowerCase().includes(q) || (lic?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesStage = queueFilter === 'all' || r.stage === queueFilter;
      return matchesQuery && matchesStage;
    });
  }, [requests, queueSearch, queueFilter]);
  const handleUpdateRequest = (updated: ValidationRequest, newDbEntry?: CoefficientDbEntry) => {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRequest(updated);
    if (newDbEntry) {
      setDbArchive(prev => [newDbEntry, ...prev]);
    }
  };
  const handleVerifyProvider = (id: string) => {
    setProviderList(prev => prev.map(p => p.id === id ? {
      ...p,
      verification: 'verified'
    } : p));
    setSelectedProvider(prev => prev && prev.id === id ? {
      ...prev,
      verification: 'verified'
    } : prev);
    showToast(t.verifiedNotice);
  };
  const handleSuspendProvider = (id: string) => {
    setProviderList(prev => prev.map(p => p.id === id ? {
      ...p,
      verification: 'suspended'
    } : p));
    showToast(t.suspendedNotice);
  };
  const handleEnlist = (provider: CoefficientProvider) => {
    setProviderList(prev => [...prev, provider]);
    setShowEnlist(false);
    showToast(t.enlistedNotice);
  };
  if (view === 'apply') {
    return <ApplicationWizard language={language} t={t} onCancel={() => setView('dashboard')} onExistingUsed={() => {
      setView('dashboard');
      showToast(t.usedExistingNotice);
    }} onSubmit={req => {
      setRequests(prev => [req, ...prev]);
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
          {t.newRequest}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="hourglass_top" label={t.pending} value={counts.pending} color="#B45309" />
        <StatCard icon="check_circle" label={t.approved} value={counts.approved} color="#00A86B" />
        <StatCard icon="cancel" label={t.rejected} value={counts.rejected} color="#DC2626" />
        <StatCard icon="groups" label={t.outsourcedActive} value={counts.outsourced} color="#1E88E5" />
      </div>

      <div className="flex w-fit flex-wrap rounded-full border border-[#CBD5E1] bg-white p-1">
        {(['requests', 'providers', 'database'] as const).map(v => <button key={v} type="button" onClick={() => setTab(v)} className={['rounded-full px-4 py-2 text-xs font-semibold transition-colors', tab === v ? 'bg-[#0A4D8C] text-white' : 'text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
            {v === 'requests' ? t.tabRequests : v === 'providers' ? t.tabProviders : t.tabDatabase}
          </button>)}
      </div>

      {tab === 'requests' && <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
              <input value={queueSearch} onChange={e => setQueueSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
            </div>
            <select value={queueFilter} onChange={e => setQueueFilter(e.target.value as any)} className={`${inputClass} sm:w-56`}>
              <option value="all">{t.filterAll}</option>
              {Object.keys(stageLabels).map(s => <option key={s} value={s}>{stageLabels[s as RequestStage][language]}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">{t.tableHeaders.id}</th>
                  <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
                  <th className="px-4 py-3">{t.tableHeaders.finishedGoods}</th>
                  <th className="px-4 py-3">{t.tableHeaders.path}</th>
                  <th className="px-4 py-3">{t.tableHeaders.stage}</th>
                  <th className="px-4 py-3">{t.tableHeaders.action}</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map(r => {
                const lic = licenseOf(r.licenseNo);
                const pathLabel = r.path === 'db-match' ? t.pathDbMatch : r.path === 'dedo-direct' ? t.pathDedoDirect : r.path === 'outsourced' ? t.pathOutsourced : t.pathPending;
                return <tr key={r.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                        <p className="text-[11px] text-[#94A3B8]">{r.licenseNo}</p>
                      </td>
                      <td className="px-4 py-3 text-[#334155]">
                        <p className="font-semibold text-[#0A4D8C]">{r.item.finishedGoodsHsCode}</p>
                        <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? r.item.finishedGoodsDescEn : r.item.finishedGoodsDescBn}</p>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#334155]">{pathLabel}</td>
                      <td className="px-4 py-3"><StageBadge stage={r.stage} language={language} /></td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelectedRequest(r)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                          {t.review}
                        </button>
                      </td>
                    </tr>;
              })}
                {filteredQueue.length === 0 && <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#94A3B8]">{t.noResults}</td>
                  </tr>}
              </tbody>
            </table>
          </div>
        </div>}

      {tab === 'providers' && <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E293B]">{t.providersTitle}</h2>
            <button type="button" onClick={() => setShowEnlist(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
              <Icon name="person_add" className="text-[16px]" />
              {t.enlistProvider}
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {providerList.map(p => <button key={p.id} type="button" onClick={() => setSelectedProvider(p)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name={p.isDedo ? 'verified_user' : 'science'} className="text-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#1E293B]">{language === 'en' ? p.nameEn : p.nameBn}</span>
                    {p.isDedo && <span className="rounded-full bg-[#0A4D8C]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#0A4D8C]">{t.dedoTag}</span>}
                    <VerificationBadge status={p.verification} language={language} />
                    <PaymentBadge status={p.paymentSetup} language={language} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-[#334155]">{(language === 'en' ? p.specialtyEn : p.specialtyBn).join(', ')}</p>
                  <p className="text-[11px] text-[#94A3B8]">{p.email} · {p.phone}</p>
                </div>
              </button>)}
          </div>
        </div>}

      {tab === 'database' && <CoefficientDatabaseTab language={language} t={t} entries={dbArchive} providers={providerList} onGenerate={() => showToast(t.reportGenerated)} />}

      {selectedRequest && <RequestDrawer request={selectedRequest} providers={providerList} language={language} t={t} onClose={() => setSelectedRequest(null)} onUpdate={handleUpdateRequest} onRequestExplanation={(reqId, providerId, explanation) => {
      setRequests(prev => prev.map(r => r.id === reqId ? {
        ...r,
        responses: r.responses?.map(resp => resp.providerId === providerId ? {
          ...resp,
          noResponseExplanation: explanation
        } : resp)
      } : r));
      setSelectedRequest(prev => prev && prev.id === reqId ? {
        ...prev,
        responses: prev.responses?.map(resp => resp.providerId === providerId ? {
          ...resp,
          noResponseExplanation: explanation
        } : resp)
      } : prev);
      showToast(t.explanationRecorded);
    }} onSuspendProvider={handleSuspendProvider} />}

      {selectedProvider && <ProviderDrawer provider={selectedProvider} language={language} t={t} onClose={() => setSelectedProvider(null)} onVerify={handleVerifyProvider} />}

      {showEnlist && <EnlistProviderModal language={language} t={t} onCancel={() => setShowEnlist(false)} onSubmit={handleEnlist} />}
    </div>;
}
function ProviderDrawer({
  provider,
  language,
  t,
  onClose,
  onVerify
}: {
  provider: CoefficientProvider;
  language: Language;
  t: T;
  onClose: () => void;
  onVerify: (id: string) => void;
}) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{language === 'en' ? provider.nameEn : provider.nameBn}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5 text-sm">
          <div className="flex flex-wrap gap-2">
            <VerificationBadge status={provider.verification} language={language} />
            <PaymentBadge status={provider.paymentSetup} language={language} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="col-span-2">
              <p className="text-[11px] text-[#94A3B8]">Address</p>
              <p className="font-medium text-[#1E293B]">{language === 'en' ? provider.addressEn : provider.addressBn}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.phoneLabel}</p>
              <p className="font-medium text-[#1E293B]">{provider.phone}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.emailLabel}</p>
              <p className="font-medium text-[#1E293B]">{provider.email}</p>
            </div>
            {provider.branches.length > 0 && <div className="col-span-2">
                <p className="text-[11px] text-[#94A3B8]">{t.branches}</p>
                <p className="font-medium text-[#1E293B]">{provider.branches.join(', ')}</p>
              </div>}
          </div>
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-[#334155]">{t.specialty}</p>
            <div className="flex flex-wrap gap-2">
              {(language === 'en' ? provider.specialtyEn : provider.specialtyBn).map(s => <span key={s} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-[11px] font-medium text-[#0A4D8C]">{s}</span>)}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-[#334155]">{t.specialists}</p>
            <div className="flex flex-col gap-2">
              {provider.specialists.map((s: Specialist) => <div key={s.email} className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[13px]">
                  <p className="font-semibold text-[#1E293B]">{s.name}</p>
                  <p className="text-[11px] text-[#94A3B8]">{s.email} · {s.phone}</p>
                </div>)}
            </div>
          </div>
          {!provider.isDedo && provider.verification === 'pending' && <button type="button" onClick={() => onVerify(provider.id)} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
              <Icon name="verified" className="text-[16px]" />
              {t.verifyAuthorize}
            </button>}
        </div>
      </div>
    </div>;
}
function EnlistProviderModal({
  language,
  t,
  onCancel,
  onSubmit
}: {
  language: Language;
  t: T;
  onCancel: () => void;
  onSubmit: (p: CoefficientProvider) => void;
}) {
  const [nameEn, setNameEn] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branches, setBranches] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialistName, setSpecialistName] = useState('');
  const [specialistEmail, setSpecialistEmail] = useState('');
  const [specialistPhone, setSpecialistPhone] = useState('');
  const canSubmit = nameEn.trim() && address.trim() && phone.trim() && email.trim() && specialty.trim();
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onCancel}>
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.enlistTitle}</h2>
          <button type="button" onClick={onCancel} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-5">
          <Field label={t.providerNameLabel} required>
            <TextInput value={nameEn} onChange={setNameEn} />
          </Field>
          <Field label={t.addressLabel} required>
            <TextInput value={address} onChange={setAddress} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.phoneLabel} required>
              <TextInput value={phone} onChange={setPhone} />
            </Field>
            <Field label={t.emailLabel} required>
              <TextInput value={email} onChange={setEmail} type="email" />
            </Field>
          </div>
          <Field label={t.branchLabel}>
            <TextInput value={branches} onChange={setBranches} placeholder="Chattogram, Gazipur" />
          </Field>
          <Field label={t.specialtyLabel} required>
            <TextInput value={specialty} onChange={setSpecialty} placeholder="Denim Processing, Dyeing" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label={t.specialistNameLabel}>
              <TextInput value={specialistName} onChange={setSpecialistName} />
            </Field>
            <Field label={t.specialistEmailLabel}>
              <TextInput value={specialistEmail} onChange={setSpecialistEmail} type="email" />
            </Field>
            <Field label={t.specialistPhoneLabel}>
              <TextInput value={specialistPhone} onChange={setSpecialistPhone} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
              {t.cancel}
            </button>
            <button type="button" disabled={!canSubmit} onClick={() => {
            const id = `PROV-${100 + Math.floor(Math.random() * 800)}`;
            onSubmit({
              id,
              nameEn,
              nameBn: nameEn,
              isDedo: false,
              addressEn: address,
              addressBn: address,
              phone,
              email,
              branches: branches.split(',').map(b => b.trim()).filter(Boolean),
              specialists: specialistName.trim() ? [{
                name: specialistName,
                email: specialistEmail,
                phone: specialistPhone
              }] : [],
              specialtyEn: specialty.split(',').map(s => s.trim()).filter(Boolean),
              specialtyBn: specialty.split(',').map(s => s.trim()).filter(Boolean),
              verification: 'pending',
              paymentSetup: 'pending'
            });
          }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.submitEnlist}
            </button>
          </div>
        </div>
      </div>
    </div>;
}
function CoefficientDatabaseTab({
  language,
  t,
  entries,
  providers,
  onGenerate
}: {
  language: Language;
  t: T;
  entries: CoefficientDbEntry[];
  providers: CoefficientProvider[];
  onGenerate: () => void;
}) {
  const [search, setSearch] = useState('');
  const [calcEntryId, setCalcEntryId] = useState(entries[0]?.id ?? '');
  const [calcQty, setCalcQty] = useState('1000');
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(e => e.finishedGoodsHsCode.toLowerCase().includes(q) || e.finishedGoodsDescEn.toLowerCase().includes(q) || e.providerName.toLowerCase().includes(q) || (licenseOf(e.licenseNo)?.nameEn.toLowerCase().includes(q) ?? false) || e.rawMaterials.some(r => r.hsCode.toLowerCase().includes(q) || r.descEn.toLowerCase().includes(q)));
  }, [entries, search]);
  const calcEntry = entries.find(e => e.id === calcEntryId);
  const calcResults = useMemo(() => {
    if (!calcEntry) return [];
    const qty = Number(calcQty) || 0;
    return calcEntry.rawMaterials.map(rm => {
      const numeric = parseFloat(rm.perUnitQty);
      const unit = rm.perUnitQty.replace(/^[\d.]+\s*/, '');
      const total = Number.isFinite(numeric) ? (numeric * qty).toLocaleString(undefined, {
        maximumFractionDigits: 2
      }) : '—';
      return {
        ...rm,
        total: `${total} ${unit.replace(/\/dozen|\/pcs/i, '').trim()}`
      };
    });
  }, [calcEntry, calcQty]);
  const byFinishedGoods = new Set(entries.map(e => e.finishedGoodsHsCode)).size;
  const rawMaterialCount = new Set(entries.flatMap(e => e.rawMaterials.map(r => r.hsCode))).size;
  const byProvider = new Set(entries.map(e => e.providerName)).size;
  const byBonder = new Set(entries.map(e => e.licenseNo)).size;
  return <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#1E293B]"><Icon name="search" className="text-[18px] text-[#0A4D8C]" />{t.dbSearchTitle}</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.dbSearchPlaceholder} className={inputClass} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.dbTableHeaders.hs}</th>
              <th className="px-4 py-3">{t.dbTableHeaders.rawMaterials}</th>
              <th className="px-4 py-3">{t.dbTableHeaders.provider}</th>
              <th className="px-4 py-3">{t.dbTableHeaders.bonder}</th>
              <th className="px-4 py-3">{t.dbTableHeaders.date}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => <tr key={e.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#0A4D8C]">{e.finishedGoodsHsCode}</p>
                  <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? e.finishedGoodsDescEn : e.finishedGoodsDescBn}</p>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#334155]">
                  {e.rawMaterials.map(r => <div key={r.hsCode}>{r.hsCode} — {r.perUnitQty}</div>)}
                </td>
                <td className="px-4 py-3 text-[#334155]">{e.providerName}</td>
                <td className="px-4 py-3 text-[#334155]">{licenseOf(e.licenseNo)?.nameEn ?? '—'}</td>
                <td className="px-4 py-3 text-[#334155]">{e.approvedDate}</td>
              </tr>)}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-[#1E293B]"><Icon name="calculate" className="text-[18px] text-[#0A4D8C]" />{t.calcTitle}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t.calcSelectEntry}>
            <select value={calcEntryId} onChange={e => setCalcEntryId(e.target.value)} className={inputClass}>
              {entries.map(e => <option key={e.id} value={e.id}>{e.finishedGoodsHsCode} — {language === 'en' ? e.finishedGoodsDescEn : e.finishedGoodsDescBn}</option>)}
            </select>
          </Field>
          <Field label={t.calcQtyLabel}>
            <TextInput value={calcQty} onChange={setCalcQty} type="number" />
          </Field>
        </div>
        {calcResults.length > 0 && <div className="mt-3 rounded-lg bg-[#F8FAFC] p-3">
            <p className="mb-1.5 text-[12px] font-semibold text-[#334155]">{t.calcResultTitle}</p>
            {calcResults.map(r => <p key={r.hsCode} className="text-[13px] text-[#1E293B]">{r.hsCode} — {language === 'en' ? r.descEn : r.descBn}: <span className="font-semibold text-[#0A4D8C]">{r.total}</span></p>)}
          </div>}
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-[#1E293B]"><Icon name="summarize" className="text-[18px] text-[#0A4D8C]" />{t.reportTitle}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon="checkroom" label={t.reportByFinishedGoods} value={byFinishedGoods} color="#0A4D8C" />
          <StatCard icon="science" label={t.reportByRawMaterial} value={rawMaterialCount} color="#1E88E5" />
          <StatCard icon="groups" label={t.reportByProvider} value={byProvider} color="#00A86B" />
          <StatCard icon="badge" label={t.reportByBonder} value={byBonder} color="#B45309" />
        </div>
        <button type="button" onClick={onGenerate} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
          <Icon name="description" className="text-[16px]" />
          {t.generate}
        </button>
      </div>
    </div>;
}
function RawMaterialEditor({
  lines,
  onChange,
  t
}: {
  lines: RawMaterialLine[];
  onChange: (lines: RawMaterialLine[]) => void;
  t: T;
}) {
  const update = (i: number, patch: Partial<RawMaterialLine>) => {
    onChange(lines.map((l, idx) => idx === i ? {
      ...l,
      ...patch
    } : l));
  };
  return <div className="flex flex-col gap-2">
      {lines.map((l, i) => <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-lg border border-[#E2E8F0] p-2">
          <TextInput value={l.hsCode} onChange={v => update(i, {
        hsCode: v
      })} placeholder="HS Code" />
          <TextInput value={l.descEn} onChange={v => update(i, {
        descEn: v,
        descBn: v
      })} placeholder="Description" />
          <TextInput value={l.perUnitQty} onChange={v => update(i, {
        perUnitQty: v
      })} placeholder="0.5 kg/dozen" />
          <button type="button" onClick={() => onChange(lines.filter((_, idx) => idx !== i))} className="rounded-full px-2 text-[#DC2626] hover:bg-red-50">
            <Icon name="close" className="text-[16px]" />
          </button>
        </div>)}
      <button type="button" onClick={() => onChange([...lines, {
      hsCode: '',
      descEn: '',
      descBn: '',
      perUnitQty: ''
    }])} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3.5 py-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
        <Icon name="add" className="text-[14px]" />
        {t.addLine}
      </button>
    </div>;
}
function RequestDrawer({
  request,
  providers,
  language,
  t,
  onClose,
  onUpdate,
  onRequestExplanation,
  onSuspendProvider
}: {
  request: ValidationRequest;
  providers: CoefficientProvider[];
  language: Language;
  t: T;
  onClose: () => void;
  onUpdate: (r: ValidationRequest, newDbEntry?: CoefficientDbEntry) => void;
  onRequestExplanation: (reqId: string, providerId: string, explanation: string) => void;
  onSuspendProvider: (id: string) => void;
}) {
  const lic = licenseOf(request.licenseNo);
  const [outsourceSelection, setOutsourceSelection] = useState<string[]>([]);
  const [rawLines, setRawLines] = useState<RawMaterialLine[]>(request.item.rawMaterials.length ? request.item.rawMaterials : [{
    hsCode: '',
    descEn: '',
    descBn: '',
    perUnitQty: ''
  }]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState(false);
  const [reportingDiscrepancy, setReportingDiscrepancy] = useState(false);
  const [inspectionNote, setInspectionNote] = useState('');
  const eligibleProviders = providers.filter(p => !p.isDedo && p.verification === 'verified');
  const archiveEntry = (validatedBy: string): CoefficientDbEntry => ({
    id: `CDB-${1100 + Math.floor(Math.random() * 900)}`,
    finishedGoodsHsCode: request.item.finishedGoodsHsCode,
    finishedGoodsDescEn: request.item.finishedGoodsDescEn,
    finishedGoodsDescBn: request.item.finishedGoodsDescBn,
    rawMaterials: rawLines.filter(l => l.hsCode.trim()),
    providerName: validatedBy,
    licenseNo: request.licenseNo,
    approvedDate: '26 Jul 2026'
  });
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
            <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#334155]">{t.slaLabel}: {request.slaDays} {t.slaDays}</span>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <p className="font-medium text-[#1E293B]">{lic?.nameEn} · {request.licenseNo}</p>
            <p className="mt-1 text-[13px] font-semibold text-[#0A4D8C]">{request.item.finishedGoodsHsCode} — {language === 'en' ? request.item.finishedGoodsDescEn : request.item.finishedGoodsDescBn}</p>
          </div>

          {(request.stage === 'submitted' || request.stage === 'dedo-selection') && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.selectionTitle}</p>
              <div className="flex flex-wrap gap-2">
                {request.dbMatchAvailable && <button type="button" onClick={() => onUpdate({
              ...request,
              stage: 'approved',
              path: 'db-match'
            }, undefined)} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]">
                    <Icon name="check_circle" className="text-[14px]" />
                    {t.approveFromMatch}
                  </button>}
                <button type="button" onClick={() => onUpdate({
              ...request,
              stage: 'dedo-validating',
              path: 'dedo-direct'
            })} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                  <Icon name="fact_check" className="text-[14px]" />
                  {t.acceptDirect}
                </button>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] p-3">
                <p className="mb-2 text-[12px] font-semibold text-[#334155]">{t.outsourceTo}</p>
                <p className="mb-2 text-[11px] text-[#64748B]">{t.selectProvidersHint}</p>
                <div className="flex flex-col gap-1.5">
                  {eligibleProviders.map(p => <label key={p.id} className="flex items-center gap-2 text-[13px] text-[#334155]">
                      <input type="checkbox" checked={outsourceSelection.includes(p.id)} onChange={e => setOutsourceSelection(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C]" />
                      {language === 'en' ? p.nameEn : p.nameBn}
                    </label>)}
                </div>
                <button type="button" disabled={outsourceSelection.length === 0} onClick={() => onUpdate({
              ...request,
              stage: 'outsource-response',
              path: 'outsourced',
              outsourcedTo: outsourceSelection,
              responses: outsourceSelection.map(id => ({
                providerId: id,
                responded: false
              }))
            })} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#1E88E5] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#1667B0] disabled:opacity-50">
                  <Icon name="forward_to_inbox" className="text-[14px]" />
                  {t.confirmOutsource}
                </button>
              </div>
            </div>}

          {request.stage === 'dedo-validating' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.dedoValidationTitle}</p>
              <p className="text-[12px] font-semibold text-[#334155]">{t.rawMaterialsTitle}</p>
              <RawMaterialEditor lines={rawLines} onChange={setRawLines} t={t} />
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => onUpdate({
              ...request,
              stage: 'approved',
              item: {
                ...request.item,
                rawMaterials: rawLines.filter(l => l.hsCode.trim())
              }
            }, archiveEntry('DEDO'))} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]">
                  <Icon name="check_circle" className="text-[14px]" />
                  {t.approveArchive}
                </button>
                <details>
                  <summary className="cursor-pointer text-[11px] font-semibold text-[#DC2626]">{t.reject}</summary>
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea value={rejectionReason} onChange={e => {
                  setRejectionReason(e.target.value);
                  setRejectionError(false);
                }} placeholder={t.rejectionReasonLabel} rows={2} className={`${inputClass} ${rejectionError ? errorInputClass : ''}`} />
                    {rejectionError && <p className="text-[11px] font-medium text-[#DC2626]">{t.rejectionRequired}</p>}
                    <button type="button" onClick={() => {
                  if (!rejectionReason.trim()) {
                    setRejectionError(true);
                    return;
                  }
                  onUpdate({
                    ...request,
                    stage: 'rejected',
                    rejectionReason: rejectionReason.trim()
                  });
                }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]">
                      {t.reject}
                    </button>
                  </div>
                </details>
              </div>
            </div>}

          {request.stage === 'outsource-response' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.outsourceResponsesTitle}</p>
              <div className="flex flex-col gap-2">
                {request.responses?.map(r => {
              const p = providers.find(pr => pr.id === r.providerId);
              return <div key={r.providerId} className="rounded-lg border border-[#E2E8F0] p-3 text-[13px]">
                      <p className="font-semibold text-[#1E293B]">{p ? language === 'en' ? p.nameEn : p.nameBn : r.providerId}</p>
                      {r.responded ? <p className="mt-1 text-[#00A86B]">{t.responded} — {t.quote}: ${r.quoteUsd} · {t.eta}: {r.etaDays}d</p> : <div className="mt-1">
                          <p className="text-[#B45309]">{t.awaitingResponse}</p>
                          {r.noResponseExplanation ? <p className="mt-1 text-[12px] italic text-[#64748B]">{r.noResponseExplanation}</p> : <button type="button" onClick={() => onRequestExplanation(request.id, r.providerId, 'Provider cited capacity constraints; DEDO reviewing enlistment status.')} className="mt-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-[#B45309] hover:bg-amber-100">
                              {t.requestExplanation}
                            </button>}
                          {r.noResponseExplanation && <button type="button" onClick={() => onSuspendProvider(r.providerId)} className="ml-2 rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-[#DC2626] hover:bg-red-100">
                              {t.suspendProvider}
                            </button>}
                        </div>}
                    </div>;
            })}
              </div>
              <button type="button" disabled={!request.responses?.some(r => r.responded)} onClick={() => onUpdate({
            ...request,
            stage: 'bonder-selection'
          })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
                {t.proceedBonderSelection}
              </button>
            </div>}

          {request.stage === 'bonder-selection' && <BonderSelectionPanel request={request} providers={providers} language={language} t={t} onConfirm={providerId => onUpdate({
        ...request,
        stage: 'dedo-consent',
        selectedProviderId: providerId
      })} />}

          {request.stage === 'dedo-consent' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.consentTitle}</p>
              <p className="text-[13px] text-[#334155]">{t.consentHint}</p>
              <p className="text-[13px] font-semibold text-[#0A4D8C]">{getProviderName(providers, request.selectedProviderId ?? '', language)}</p>
              <button type="button" onClick={() => onUpdate({
            ...request,
            stage: 'provider-payment'
          })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                <Icon name="how_to_reg" className="text-[14px]" />
                {t.provideConsent}
              </button>
            </div>}

          {request.stage === 'provider-payment' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.paymentTitle}</p>
              <p className="text-[13px] text-[#334155]">{t.paymentHint}</p>
              <button type="button" onClick={() => onUpdate({
            ...request,
            stage: 'provider-validating'
          })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                <Icon name="payments" className="text-[14px]" />
                {t.simulatePayment}
              </button>
            </div>}

          {request.stage === 'provider-validating' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.providerValidationTitle}</p>
              {!reportingDiscrepancy ? <>
                  <p className="text-[12px] font-semibold text-[#334155]">{t.rawMaterialsTitle}</p>
                  <RawMaterialEditor lines={rawLines} onChange={setRawLines} t={t} />
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button type="button" onClick={() => onUpdate({
                  ...request,
                  stage: 'dedo-final-approval',
                  item: {
                    ...request.item,
                    rawMaterials: rawLines.filter(l => l.hsCode.trim())
                  }
                })} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                      <Icon name="forward_to_inbox" className="text-[14px]" />
                      {t.forwardFinal}
                    </button>
                    <button type="button" onClick={() => setReportingDiscrepancy(true)} className="text-[11px] font-semibold text-[#B45309] hover:underline">
                      {t.reportDiscrepancy}
                    </button>
                  </div>
                </> : <>
                  <textarea value={inspectionNote} onChange={e => setInspectionNote(e.target.value)} placeholder={t.inspectionNoteLabel} rows={3} className={inputClass} />
                  <button type="button" disabled={!inspectionNote.trim()} onClick={() => onUpdate({
                ...request,
                stage: 'dedo-final-approval',
                inspectionNote: inspectionNote.trim()
              })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#B45309] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#92400E] disabled:opacity-50">
                    <Icon name="report" className="text-[14px]" />
                    {t.forwardFinal}
                  </button>
                </>}
            </div>}

          {request.stage === 'dedo-final-approval' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
              <p className="text-[13px] font-bold text-[#1E293B]">{t.finalApprovalTitle}</p>
              {request.inspectionNote ? <div className="rounded-lg bg-amber-50 p-3 text-[13px] text-[#92400E]">{request.inspectionNote}</div> : <div className="flex flex-col gap-1.5">
                  {request.item.rawMaterials.map(l => <p key={l.hsCode} className="text-[13px] text-[#334155]">{l.hsCode} — {language === 'en' ? l.descEn : l.descBn}: <span className="font-semibold text-[#0A4D8C]">{l.perUnitQty}</span></p>)}
                </div>}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => onUpdate({
              ...request,
              stage: 'approved'
            }, archiveEntry(getProviderName(providers, request.selectedProviderId ?? '', 'en')))} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]">
                  <Icon name="check_circle" className="text-[14px]" />
                  {t.approve}
                </button>
                <details>
                  <summary className="cursor-pointer text-[11px] font-semibold text-[#DC2626]">{t.disapprove}</summary>
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea value={rejectionReason} onChange={e => {
                  setRejectionReason(e.target.value);
                  setRejectionError(false);
                }} placeholder={t.rejectionReasonLabel} rows={2} className={`${inputClass} ${rejectionError ? errorInputClass : ''}`} />
                    {rejectionError && <p className="text-[11px] font-medium text-[#DC2626]">{t.rejectionRequired}</p>}
                    <button type="button" onClick={() => {
                  if (!rejectionReason.trim()) {
                    setRejectionError(true);
                    return;
                  }
                  onUpdate({
                    ...request,
                    stage: 'rejected',
                    rejectionReason: rejectionReason.trim()
                  });
                }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]">
                      {t.disapprove}
                    </button>
                  </div>
                </details>
              </div>
            </div>}

          {request.stage === 'approved' && <div className="flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-[#087F52]">
              <p className="font-bold">{t.archivedNoticeTitle}</p>
              <p>{t.archivedNoticeBody}</p>
              {request.item.rawMaterials.length > 0 && <div className="mt-1 flex flex-col gap-1">
                  {request.item.rawMaterials.map(l => <p key={l.hsCode}>{l.hsCode} — {language === 'en' ? l.descEn : l.descBn}: <span className="font-semibold">{l.perUnitQty}</span></p>)}
                </div>}
            </div>}

          {request.stage === 'rejected' && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-[#B91C1C]">
              <p className="font-bold">{t.rejectedNoticeTitle}</p>
              <p className="mt-1">{request.rejectionReason}</p>
              <p className="mt-2 text-[#64748B]">{t.rejectedNoticeBody}</p>
            </div>}
        </div>
      </div>
    </div>;
}
function BonderSelectionPanel({
  request,
  providers,
  language,
  t,
  onConfirm
}: {
  request: ValidationRequest;
  providers: CoefficientProvider[];
  language: Language;
  t: T;
  onConfirm: (providerId: string) => void;
}) {
  const responded = request.responses?.filter(r => r.responded) ?? [];
  const [picked, setPicked] = useState(responded[0]?.providerId ?? '');
  return <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
      <p className="text-[13px] font-bold text-[#1E293B]">{t.bonderSelectionTitle}</p>
      <div className="flex flex-col gap-1.5">
        {responded.map(r => {
        const p = providers.find(pr => pr.id === r.providerId);
        return <label key={r.providerId} className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-[13px] text-[#334155]">
              <input type="radio" name="provider-pick" checked={picked === r.providerId} onChange={() => setPicked(r.providerId)} className="h-4 w-4 text-[#0A4D8C]" />
              {p ? language === 'en' ? p.nameEn : p.nameBn : r.providerId} — {t.quote}: ${r.quoteUsd} · {t.eta}: {r.etaDays}d
            </label>;
      })}
      </div>
      <button type="button" disabled={!picked} onClick={() => onConfirm(picked)} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
        <Icon name="forward_to_inbox" className="text-[14px]" />
        {t.confirmSelection}
      </button>
    </div>;
}
function ApplicationWizard({
  language,
  t,
  onCancel,
  onExistingUsed,
  onSubmit
}: {
  language: Language;
  t: T;
  onCancel: () => void;
  onExistingUsed: () => void;
  onSubmit: (r: ValidationRequest) => void;
}) {
  const [step, setStep] = useState(1);
  const [licenseNo, setLicenseNo] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [hsCode, setHsCode] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [searched, setSearched] = useState(false);
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
  const matches = useMemo(() => {
    if (!searched || !hsCode.trim()) return [];
    return seedDbArchive.filter(e => e.finishedGoodsHsCode.toLowerCase() === hsCode.trim().toLowerCase());
  }, [searched, hsCode]);
  const canSubmit = verifiedLicense && descriptionEn.trim() && documentDefsAllAttached(attached);
  function documentDefsAllAttached(a: Record<string, boolean>) {
    return attachmentDefs.every(d => a[d.id]);
  }
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
            <Field label={t.hsCodeLabel} required>
              <div className="flex gap-2">
                <TextInput value={hsCode} onChange={v => {
              setHsCode(v);
              setSearched(false);
            }} placeholder="6109.10.00" />
                <button type="button" onClick={() => setSearched(true)} className="shrink-0 rounded-lg bg-[#0A4D8C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#083E71]">
                  {t.searchDb}
                </button>
              </div>
            </Field>
            {searched && matches.length > 0 && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#087F52]"><Icon name="check_circle" className="text-[16px]" />{t.matchFoundTitle}</p>
                <p className="mt-1 text-[12px] text-[#334155]">{t.matchFoundHint}</p>
                {matches.map(m => <div key={m.id} className="mt-2 rounded bg-white p-2 text-[12px] text-[#334155]">
                    {m.rawMaterials.map(r => <div key={r.hsCode}>{r.hsCode} — {r.descEn}: {r.perUnitQty}</div>)}
                  </div>)}
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={onExistingUsed} className="rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]">
                    {t.useExisting}
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                    {t.continueNew}
                  </button>
                </div>
              </div>}
            {searched && matches.length === 0 && <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <p className="text-[13px] font-bold text-[#1E293B]">{t.noMatchTitle}</p>
                <p className="mt-1 text-[12px] text-[#64748B]">{t.noMatchHint}</p>
              </div>}
          </>}

        {step === 3 && <>
            <Field label={t.descriptionLabel} required>
              <TextInput value={descriptionEn} onChange={setDescriptionEn} placeholder="Men's Knit Cotton T-Shirt" />
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
          </>}

        {step === 4 && verifiedLicense && <div className="flex flex-col gap-3 text-sm">
            <p className="text-[13px] font-bold text-[#1E293B]">{t.reviewTitle}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-[#F8FAFC] p-4">
              <div><p className="text-[11px] text-[#94A3B8]">Bond License No.</p><p className="font-medium text-[#1E293B]">{verifiedLicense.licenseNo}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">Bonder</p><p className="font-medium text-[#1E293B]">{verifiedLicense.nameEn}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">{t.hsCodeLabel}</p><p className="font-medium text-[#1E293B]">{hsCode}</p></div>
              <div><p className="text-[11px] text-[#94A3B8]">{t.descriptionLabel}</p><p className="font-medium text-[#1E293B]">{descriptionEn}</p></div>
            </div>
          </div>}

        <div className="flex justify-between pt-2">
          <button type="button" onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            {t.back}
          </button>
          {step < 4 ? <button type="button" disabled={step === 1 && !verifiedLicense || step === 2 && !searched} onClick={() => setStep(s => s + 1)} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.next}
            </button> : <button type="button" disabled={!canSubmit} onClick={() => {
          if (!verifiedLicense) return;
          const req: ValidationRequest = {
            id: `REQ-CE-2026-0${50 + Math.floor(Math.random() * 40)}`,
            licenseNo: verifiedLicense.licenseNo,
            submittedAt: '26 Jul 2026',
            dbMatchAvailable: matches.length > 0,
            item: {
              finishedGoodsHsCode: hsCode,
              finishedGoodsDescEn: descriptionEn,
              finishedGoodsDescBn: descriptionEn,
              rawMaterials: []
            },
            stage: 'submitted',
            slaDays: 5
          };
          onSubmit(req);
        }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.submit}
            </button>}
        </div>
      </div>
    </div>;
}
