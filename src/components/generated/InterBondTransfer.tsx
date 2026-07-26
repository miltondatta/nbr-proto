import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { lienBanks } from './lienBankData';
import { inspectionCriteriaDefs, interBondTransfers as seedTransfers, licenseOf, officerPool, stageLabels, type InterBondTransfer, type TransferItemType, type TransferStage } from './interBondData';
type Language = 'en' | 'bn';
interface InterBondTransferProps {
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
  stage: TransferStage;
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
  id: 'transferRequest',
  en: 'Transfer Request Letter',
  bn: 'ট্রান্সফার অনুরোধপত্র'
}, {
  id: 'stockStatement',
  en: 'Current Stock/Machinery Statement',
  bn: 'বর্তমান মজুদ/যন্ত্রপাতি বিবরণী'
}];
const stageOrder: TransferStage[] = ['submitted', 'assignment', 'risk-bond-consent', 'ro-verification', 'lien-bank-verification', 'inspection-formation', 'inspection-scheduled', 'inspection-report', 'final-review', 'approved'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Inter-Bond Transfer Management',
    subtitle: 'Manages transfer of bonded raw materials or machinery between two Bonders — dual e-Risk Bond consent, Lien Bank verification, Inspection Team formation/visit/report, and (for raw materials) post-approval PRC follow-up.',
    backToDashboard: 'Back to Dashboard',
    newApplication: 'New Transfer Application',
    pending: 'Pending Applications',
    approved: 'Approved',
    disapproved: 'Disapproved',
    prcPending: 'PRC Pending',
    searchPlaceholder: 'Search by license no. or bonder name…',
    filterAll: 'All Stages',
    tableHeaders: {
      id: 'Transfer ID',
      from: 'From Bonder',
      to: 'To Bonder',
      items: 'Items',
      type: 'Type',
      stage: 'Stage',
      action: ''
    },
    review: 'Review',
    rawMaterial: 'Raw Material',
    machinery: 'Machinery',
    noResults: 'No transfer applications match the current filters.',
    formTitle: 'Inter-Bond Transfer — Application',
    step1: 'Select Bonders',
    step2: 'Item Type & Items',
    step3: 'Attachments',
    step4: 'Review & Submit',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    fromLicenseLabel: 'From Bonder (Giving) — Bond License No.',
    toLicenseLabel: 'To Bonder (Receiving) — Bond License No.',
    sameLicenseError: 'From and To Bonder must be different.',
    itemTypeLabel: 'Item Type',
    itemsTitle: 'Items to Transfer',
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
    pipelineTitle: 'Inter-Bond Transfer Pipeline',
    autoChecklistTitle: 'e-Checklist & e-Notification',
    checklistComplete: 'All required documents attached — e-checklist passed.',
    notificationSent: 'Applicant and CBC officials auto-notified of submission.',
    assignProceed: 'Auto-Assign ARO/RO & Proceed',
    assignmentTitle: 'ARO/RO Assignment',
    assignmentHint: 'Commissioner assigns by zone/location.',
    notifyProceed: 'Notify & Proceed',
    riskBondTitle: 'e-Risk Bond — Dual Bonder Consent',
    riskBondHint: 'System has generated an electronic Risk Bond. Both the giving and receiving Bonder must log in and provide consent before proceeding.',
    fromConsent: 'From Bonder Consents',
    toConsent: 'To Bonder Consents',
    consentGiven: 'Consent Given',
    bothConsentedNotice: 'Both Bonders consented. e-Risk Bond attached to both Bonder Profiles and the application.',
    proceedVerification: 'Proceed to RO/ARO Verification',
    verificationTitle: 'RO/ARO Verification',
    licenseeStatusTitle: 'e-Licensee Status Check / e-Audit Status',
    otherLicenseFound: 'Receiving Bonder holds another license under this ownership',
    noOtherLicense: 'No other license found under this ownership for the Receiving Bonder.',
    auditStatusLabel: 'Audit Status',
    roNoteLabel: 'RO/ARO e-Note',
    requestAdditionalDocs: 'Request Additional Supporting Documents',
    additionalDocsRequested: 'Additional documents requested from applicant.',
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
    proceedInspectionFormation: 'Proceed to Inspection Team Formation',
    inspectionFormationTitle: 'Inspection Team Formation',
    selectTeamHint: 'Select CBC officials to form the Inspection Team from the existing pool.',
    approveTeam: 'Approve Team Formation & Notify Members',
    inspectionScheduleTitle: 'Inspection e-Calendar',
    inspectionDateLabel: 'Inspection Visit Date',
    scheduleInspection: 'Schedule & Notify Applicant + Team',
    inspectionReportTitle: 'e-Factory Visit — Inspection Parameter Scoring',
    scoreHint: 'Inspector scores each parameter (0–10) at the time of the factory visit via mobile app.',
    generateReport: 'Generate Inspection e-Report & Forward',
    noncomplianceTitle: 'Noncompliance Notification',
    noncomplianceHint: 'The following criteria did not meet requirement. Applicant has been auto-notified.',
    finalReviewTitle: 'Final e-Applicant Report (RO/ARO → ADC/JC)',
    finalNoteLabel: 'Final Decision Note',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalRequired: 'A reason is required to disapprove.',
    disapprovedTitle: 'Application Disapproved',
    disapprovedBody: 'Bonder has been auto-notified of the disapproval.',
    approvalLetterTitle: 'e-Transfer Approval Letter',
    approvalLetterIssued: 'Letter No.',
    approvalLetterNote: 'This letter authorizes the transfer of the items listed below between the named Bonders and has been attached to both Bonder Profiles.',
    prcTitle: 'Post-Approval PRC Follow-up (Raw Materials)',
    prcHint: 'Bonder must provide Proceeds Realization Certificate (PRC) information 3 months after approval.',
    prcNotDue: 'Not yet due.',
    simulateSubmitPrc: 'Simulate: Bonder Submits PRC Information',
    verifyPrcBb: 'Verify via Bangladesh Bank Integration — Success',
    failPrc: 'Verify via Bangladesh Bank Integration — Failed',
    prcVerifiedNotice: 'PRC information validated through Bangladesh Bank integration. CBC officials notified.',
    prcFailedNotice: 'PRC validation failed or not provided. CBC officials auto-notified to take necessary action.',
    prcSubmittedWaiting: 'PRC information submitted by Bonder — awaiting Bangladesh Bank validation.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ইন্টার বন্ড ট্রান্সফার ব্যবস্থাপনা',
    subtitle: 'দুই বন্ডকারীর মধ্যে বন্ডেড কাঁচামাল বা যন্ত্রপাতি স্থানান্তর পরিচালনা করে — দ্বৈত ই-রিস্ক বন্ড সম্মতি, লিয়েন ব্যাংক যাচাইকরণ, পরিদর্শন দল গঠন/পরিদর্শন/প্রতিবেদন, এবং (কাঁচামালের জন্য) অনুমোদনোত্তর পিআরসি ফলো-আপ।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    newApplication: 'নতুন ট্রান্সফার আবেদন',
    pending: 'অপেক্ষমাণ আবেদন',
    approved: 'অনুমোদিত',
    disapproved: 'অননুমোদিত',
    prcPending: 'পিআরসি অপেক্ষমাণ',
    searchPlaceholder: 'লাইসেন্স নং বা বন্ডকারীর নাম খুঁজুন…',
    filterAll: 'সকল ধাপ',
    tableHeaders: {
      id: 'ট্রান্সফার আইডি',
      from: 'প্রদানকারী বন্ডকারী',
      to: 'গ্রহণকারী বন্ডকারী',
      items: 'সামগ্রী',
      type: 'ধরন',
      stage: 'ধাপ',
      action: ''
    },
    review: 'পর্যালোচনা',
    rawMaterial: 'কাঁচামাল',
    machinery: 'যন্ত্রপাতি',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো ট্রান্সফার আবেদন মেলেনি।',
    formTitle: 'ইন্টার বন্ড ট্রান্সফার — আবেদন',
    step1: 'বন্ডকারী নির্বাচন করুন',
    step2: 'সামগ্রীর ধরন ও তালিকা',
    step3: 'সংযুক্তি',
    step4: 'পর্যালোচনা ও দাখিল',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বর দিয়ে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    next: 'পরবর্তী',
    back: 'পূর্ববর্তী',
    submit: 'আবেদন দাখিল করুন',
    fromLicenseLabel: 'প্রদানকারী বন্ডকারী — বন্ড লাইসেন্স নং',
    toLicenseLabel: 'গ্রহণকারী বন্ডকারী — বন্ড লাইসেন্স নং',
    sameLicenseError: 'প্রদানকারী ও গ্রহণকারী বন্ডকারী ভিন্ন হতে হবে।',
    itemTypeLabel: 'সামগ্রীর ধরন',
    itemsTitle: 'স্থানান্তরযোগ্য সামগ্রী',
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
    pipelineTitle: 'ইন্টার বন্ড ট্রান্সফার পাইপলাইন',
    autoChecklistTitle: 'ই-চেকলিস্ট ও ই-নোটিফিকেশন',
    checklistComplete: 'সকল প্রয়োজনীয় নথি সংযুক্ত হয়েছে — ই-চেকলিস্ট উত্তীর্ণ।',
    notificationSent: 'দাখিলের বিষয়ে আবেদনকারী ও সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    assignProceed: 'স্বয়ংক্রিয়ভাবে আরও/এআরও বরাদ্দ করুন ও এগিয়ে যান',
    assignmentTitle: 'আরও/এআরও বরাদ্দ',
    assignmentHint: 'কমিশনার জোন/অবস্থান অনুযায়ী বরাদ্দ করেন।',
    notifyProceed: 'অবহিত করুন ও এগিয়ে যান',
    riskBondTitle: 'ই-রিস্ক বন্ড — দ্বৈত বন্ডকারী সম্মতি',
    riskBondHint: 'সিস্টেম একটি ইলেকট্রনিক রিস্ক বন্ড তৈরি করেছে। এগিয়ে যাওয়ার আগে প্রদানকারী ও গ্রহণকারী উভয় বন্ডকারীকে লগইন করে সম্মতি দিতে হবে।',
    fromConsent: 'প্রদানকারী বন্ডকারীর সম্মতি',
    toConsent: 'গ্রহণকারী বন্ডকারীর সম্মতি',
    consentGiven: 'সম্মতি প্রদত্ত',
    bothConsentedNotice: 'উভয় বন্ডকারী সম্মতি দিয়েছেন। ই-রিস্ক বন্ড উভয় বন্ডকারী প্রোফাইল ও আবেদনে সংযুক্ত করা হয়েছে।',
    proceedVerification: 'আরও/এআরও যাচাইকরণে এগিয়ে যান',
    verificationTitle: 'আরও/এআরও যাচাইকরণ',
    licenseeStatusTitle: 'ই-লাইসেন্সি স্ট্যাটাস চেক / ই-অডিট স্ট্যাটাস',
    otherLicenseFound: 'গ্রহণকারী বন্ডকারীর এই মালিকানার অধীনে আরেকটি লাইসেন্স রয়েছে',
    noOtherLicense: 'গ্রহণকারী বন্ডকারীর এই মালিকানার অধীনে অন্য কোনো লাইসেন্স পাওয়া যায়নি।',
    auditStatusLabel: 'অডিট স্ট্যাটাস',
    roNoteLabel: 'আরও/এআরও ই-নোট',
    requestAdditionalDocs: 'অতিরিক্ত সহায়ক নথি অনুরোধ করুন',
    additionalDocsRequested: 'আবেদনকারীর কাছে অতিরিক্ত নথি অনুরোধ করা হয়েছে।',
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
    proceedInspectionFormation: 'পরিদর্শন দল গঠনে এগিয়ে যান',
    inspectionFormationTitle: 'পরিদর্শন দল গঠন',
    selectTeamHint: 'বিদ্যমান পুল থেকে পরিদর্শন দল গঠনের জন্য সিবিসি কর্মকর্তা নির্বাচন করুন।',
    approveTeam: 'দল গঠন অনুমোদন করুন ও সদস্যদের অবহিত করুন',
    inspectionScheduleTitle: 'ই-পরিদর্শন ক্যালেন্ডার',
    inspectionDateLabel: 'পরিদর্শন পরিদর্শনের তারিখ',
    scheduleInspection: 'নির্ধারণ করুন ও আবেদনকারী + দলকে অবহিত করুন',
    inspectionReportTitle: 'ই-ফ্যাক্টরি ভিজিট — পরিদর্শন প্যারামিটার স্কোরিং',
    scoreHint: 'পরিদর্শক মোবাইল অ্যাপের মাধ্যমে ফ্যাক্টরি পরিদর্শনের সময় প্রতিটি প্যারামিটার (০–১০) স্কোর করেন।',
    generateReport: 'ই-পরিদর্শন প্রতিবেদন তৈরি করুন ও পাঠান',
    noncomplianceTitle: 'অসম্মতি বিজ্ঞপ্তি',
    noncomplianceHint: 'নিম্নলিখিত মানদণ্ডগুলো প্রয়োজনীয়তা পূরণ করেনি। আবেদনকারীকে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    finalReviewTitle: 'চূড়ান্ত ই-আবেদনকারী প্রতিবেদন (আরও/এআরও → এডিসি/জেসি)',
    finalNoteLabel: 'চূড়ান্ত সিদ্ধান্তের নোট',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalRequired: 'অননুমোদন করতে একটি কারণ প্রয়োজন।',
    disapprovedTitle: 'আবেদন অননুমোদিত',
    disapprovedBody: 'বন্ডকারীকে অননুমোদনের বিষয়ে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    approvalLetterTitle: 'ই-ট্রান্সফার অনুমোদন পত্র',
    approvalLetterIssued: 'পত্র নং',
    approvalLetterNote: 'এই পত্রটি নিম্নলিখিত সামগ্রীর স্থানান্তর অনুমোদন করে এবং উভয় বন্ডকারী প্রোফাইলে সংযুক্ত করা হয়েছে।',
    prcTitle: 'অনুমোদনোত্তর পিআরসি ফলো-আপ (কাঁচামাল)',
    prcHint: 'অনুমোদনের ৩ মাস পর বন্ডকারীকে প্রসিডস রিয়েলাইজেশন সার্টিফিকেট (পিআরসি) তথ্য প্রদান করতে হবে।',
    prcNotDue: 'এখনো সময় হয়নি।',
    simulateSubmitPrc: 'সিমুলেট: বন্ডকারী পিআরসি তথ্য দাখিল করেন',
    verifyPrcBb: 'বাংলাদেশ ব্যাংক ইন্টিগ্রেশনের মাধ্যমে যাচাই — সফল',
    failPrc: 'বাংলাদেশ ব্যাংক ইন্টিগ্রেশনের মাধ্যমে যাচাই — ব্যর্থ',
    prcVerifiedNotice: 'বাংলাদেশ ব্যাংক ইন্টিগ্রেশনের মাধ্যমে পিআরসি তথ্য যাচাই করা হয়েছে। সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।',
    prcFailedNotice: 'পিআরসি যাচাই ব্যর্থ হয়েছে বা প্রদান করা হয়নি। প্রয়োজনীয় ব্যবস্থা নিতে সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    prcSubmittedWaiting: 'বন্ডকারী কর্তৃক পিআরসি তথ্য দাখিল করা হয়েছে — বাংলাদেশ ব্যাংকের যাচাইয়ের অপেক্ষায়।'
  }
};
type T = typeof T['en'];
export function InterBondTransfer({
  language,
  onDone
}: InterBondTransferProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'apply'>('dashboard');
  const [transfers, setTransfers] = useState<InterBondTransfer[]>(seedTransfers);
  const [selected, setSelected] = useState<InterBondTransfer | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | TransferStage>('all');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const counts = useMemo(() => ({
    pending: transfers.filter(x => x.stage !== 'approved' && x.stage !== 'disapproved').length,
    approved: transfers.filter(x => x.stage === 'approved').length,
    disapproved: transfers.filter(x => x.stage === 'disapproved').length,
    prcPending: transfers.filter(x => x.prcStatus === 'pending').length
  }), [transfers]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transfers.filter(x => {
      const from = licenseOf(x.fromLicenseNo);
      const to = licenseOf(x.toLicenseNo);
      const matchesQuery = !q || x.fromLicenseNo.toLowerCase().includes(q) || x.toLicenseNo.toLowerCase().includes(q) || (from?.nameEn.toLowerCase().includes(q) ?? false) || (to?.nameEn.toLowerCase().includes(q) ?? false);
      const matchesFilter = filter === 'all' || x.stage === filter;
      return matchesQuery && matchesFilter;
    });
  }, [transfers, search, filter]);
  const handleUpdate = (updated: InterBondTransfer) => {
    setTransfers(prev => prev.map(x => x.id === updated.id ? updated : x));
    setSelected(updated);
  };
  if (view === 'apply') {
    return <ApplicationWizard language={language} t={t} onCancel={() => setView('dashboard')} onSubmit={x => {
      setTransfers(prev => [x, ...prev]);
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
        <StatCard icon="fact_check" label={t.prcPending} value={counts.prcPending} color="#1E88E5" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as any)} className={`${inputClass} sm:w-56`}>
          <option value="all">{t.filterAll}</option>
          {Object.keys(stageLabels).map(s => <option key={s} value={s}>{stageLabels[s as TransferStage][language]}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.tableHeaders.id}</th>
              <th className="px-4 py-3">{t.tableHeaders.from}</th>
              <th className="px-4 py-3">{t.tableHeaders.to}</th>
              <th className="px-4 py-3">{t.tableHeaders.type}</th>
              <th className="px-4 py-3">{t.tableHeaders.stage}</th>
              <th className="px-4 py-3">{t.tableHeaders.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(x => {
            const from = licenseOf(x.fromLicenseNo);
            const to = licenseOf(x.toLicenseNo);
            return <tr key={x.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{x.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{from?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{x.fromLicenseNo}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B]">{to?.nameEn ?? '—'}</p>
                    <p className="text-[11px] text-[#94A3B8]">{x.toLicenseNo}</p>
                  </td>
                  <td className="px-4 py-3 text-[#334155]">{x.itemType === 'raw-material' ? t.rawMaterial : t.machinery}</td>
                  <td className="px-4 py-3"><StageBadge stage={x.stage} language={language} /></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(x)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
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

      {selected && <TransferDrawer transfer={selected} language={language} t={t} onClose={() => setSelected(null)} onUpdate={handleUpdate} onToast={showToast} />}
    </div>;
}
function TransferDrawer({
  transfer: x,
  language,
  t,
  onClose,
  onUpdate,
  onToast
}: {
  transfer: InterBondTransfer;
  language: Language;
  t: T;
  onClose: () => void;
  onUpdate: (x: InterBondTransfer) => void;
  onToast: (msg: string) => void;
}) {
  const from = licenseOf(x.fromLicenseNo);
  const to = licenseOf(x.toLicenseNo);
  const [roNote, setRoNote] = useState(x.roNote ?? '');
  const [roNoteError, setRoNoteError] = useState(false);
  const [selectedBank, setSelectedBank] = useState(x.lienBankCode ?? lienBanks[0]?.bankCode ?? '');
  const [teamSelection, setTeamSelection] = useState<string[]>(x.inspectionTeam ?? []);
  const [inspectionDate, setInspectionDate] = useState(x.inspectionDate ?? '10 Aug 2026');
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(inspectionCriteriaDefs.map(c => [c.id, x.inspectionScores?.find(s => s.id === c.id)?.score ?? 8])));
  const [finalNote, setFinalNote] = useState(x.finalDecisionNote ?? '');
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [disapprovalError, setDisapprovalError] = useState(false);
  const isException = x.stage === 'disapproved';
  const currentIndex = stageOrder.indexOf(x.stage);
  const otherLicenseOfOwner = bondLicenses.find(l => l.licenseNo !== x.toLicenseNo && l.nameEn === to?.nameEn);
  const weightedAvg = inspectionCriteriaDefs.reduce((sum, c) => sum + scores[c.id] * c.weight, 0) / inspectionCriteriaDefs.reduce((sum, c) => sum + c.weight, 0);
  const noncompliant = inspectionCriteriaDefs.filter(c => scores[c.id] < 7);
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
            <span className="text-lg font-bold text-[#0A4D8C]">{x.id}</span>
            <StageBadge stage={x.stage} language={language} />
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <p className="font-medium text-[#1E293B]">{t.tableHeaders.from}: {from?.nameEn} · {x.fromLicenseNo}</p>
            <p className="mt-1 font-medium text-[#1E293B]">{t.tableHeaders.to}: {to?.nameEn} · {x.toLicenseNo}</p>
            <div className="mt-2 flex flex-col gap-1">
              {x.items.map(it => <p key={it.hsCode} className="text-[13px] text-[#334155]">{it.hsCode} — {language === 'en' ? it.descEn : it.descBn}: <span className="font-semibold text-[#0A4D8C]">{it.qty}</span></p>)}
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
                    ...x,
                    stage: 'assignment',
                    assignedOfficer: officerPool[Math.floor(Math.random() * officerPool.length)]
                  })} className={`${ACTION_BTN} mt-1 w-fit`}>
                          <Icon name="person_add" className="text-[14px]" />
                          {t.assignProceed}
                        </button>
                      </div>}

                    {status === 'current' && s === 'assignment' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.assignmentHint}</p>
                        <p className="text-[13px] font-semibold text-[#0A4D8C]">{x.assignedOfficer?.[language] ?? officerPool[0][language]}</p>
                        <button type="button" onClick={() => onUpdate({
                    ...x,
                    stage: 'risk-bond-consent',
                    assignedOfficer: x.assignedOfficer ?? officerPool[0]
                  })} className={`${ACTION_BTN} w-fit`}>
                          {t.notifyProceed}
                        </button>
                      </div>}

                    {status === 'current' && s === 'risk-bond-consent' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.riskBondHint}</p>
                        <div className="flex flex-wrap gap-2">
                          {x.riskBondFromConsent ? <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[14px]" />{t.fromConsent}: {t.consentGiven}</span> : <button type="button" onClick={() => onUpdate({
                      ...x,
                      riskBondFromConsent: true
                    })} className={ACTION_BTN_OUTLINE}>{t.fromConsent}</button>}
                          {x.riskBondToConsent ? <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[14px]" />{t.toConsent}: {t.consentGiven}</span> : <button type="button" onClick={() => onUpdate({
                      ...x,
                      riskBondToConsent: true
                    })} className={ACTION_BTN_OUTLINE}>{t.toConsent}</button>}
                        </div>
                        {x.riskBondFromConsent && x.riskBondToConsent && <>
                            <p className="text-[12px] text-[#00A86B]">{t.bothConsentedNotice}</p>
                            <button type="button" onClick={() => onUpdate({
                        ...x,
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
                          {!x.additionalDocsRequested ? <button type="button" onClick={() => onUpdate({
                      ...x,
                      additionalDocsRequested: true
                    })} className={ACTION_BTN_OUTLINE}>{t.requestAdditionalDocs}</button> : !x.additionalDocsProvided ? <button type="button" onClick={() => {
                      onUpdate({
                        ...x,
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
                      ...x,
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
                        {!x.lienBankCode ? <button type="button" onClick={() => {
                    onUpdate({
                      ...x,
                      lienBankCode: selectedBank
                    });
                    onToast(t.lienBankSentNotice);
                  }} className={`${ACTION_BTN} w-fit`}>{t.sendRequest}</button> : !x.lienBankVerified ? <button type="button" onClick={() => {
                    onUpdate({
                      ...x,
                      lienBankVerified: true
                    });
                    onToast(t.lienBankVerifiedNotice);
                  }} className={`${ACTION_BTN} w-fit`}>{t.lienBankVerify}</button> : <button type="button" onClick={() => onUpdate({
                    ...x,
                    stage: 'inspection-formation'
                  })} className={`${ACTION_BTN_GREEN} w-fit`}>{t.proceedInspectionFormation}</button>}
                      </div>}

                    {status === 'current' && s === 'inspection-formation' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.selectTeamHint}</p>
                        {officerPool.map(o => <label key={o.en} className="flex items-center gap-2 text-[13px] text-[#334155]">
                            <input type="checkbox" checked={teamSelection.includes(o.en)} onChange={e => setTeamSelection(prev => e.target.checked ? [...prev, o.en] : prev.filter(n => n !== o.en))} className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C]" />
                            {o[language]}
                          </label>)}
                        <button type="button" disabled={teamSelection.length === 0} onClick={() => onUpdate({
                    ...x,
                    stage: 'inspection-scheduled',
                    inspectionTeam: teamSelection
                  })} className={`${ACTION_BTN} w-fit disabled:opacity-50`}>
                          {t.approveTeam}
                        </button>
                      </div>}

                    {status === 'current' && s === 'inspection-scheduled' && <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                        <Field label={t.inspectionDateLabel}>
                          <TextInput value={inspectionDate} onChange={setInspectionDate} />
                        </Field>
                        <button type="button" onClick={() => onUpdate({
                    ...x,
                    stage: 'inspection-report',
                    inspectionDate
                  })} className={`${ACTION_BTN} w-fit`}>
                          <Icon name="event" className="text-[14px]" />
                          {t.scheduleInspection}
                        </button>
                      </div>}

                    {status === 'current' && s === 'inspection-report' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[12px] text-[#64748B]">{t.scoreHint}</p>
                        {inspectionCriteriaDefs.map(c => <div key={c.id} className="flex items-center justify-between gap-2">
                            <span className="text-[12px] text-[#334155]">{c[language]}</span>
                            <input type="number" min={0} max={10} value={scores[c.id]} onChange={e => setScores(prev => ({
                        ...prev,
                        [c.id]: Math.max(0, Math.min(10, Number(e.target.value) || 0))
                      }))} className="w-16 rounded-lg border border-[#CBD5E1] px-2 py-1 text-sm" />
                          </div>)}
                        <p className="text-[12px] font-semibold text-[#334155]">Weighted Average: <span className="text-[#0A4D8C]">{weightedAvg.toFixed(1)}/10</span></p>
                        {noncompliant.length > 0 && <div className="rounded-lg bg-amber-50 p-2.5 text-[12px] text-[#B45309]">
                            <p className="font-semibold">{t.noncomplianceTitle}</p>
                            <p>{t.noncomplianceHint}</p>
                            <ul className="mt-1 list-disc pl-4">
                              {noncompliant.map(c => <li key={c.id}>{c[language]}</li>)}
                            </ul>
                          </div>}
                        <button type="button" onClick={() => onUpdate({
                    ...x,
                    stage: 'final-review',
                    inspectionScores: inspectionCriteriaDefs.map(c => ({
                      id: c.id,
                      score: scores[c.id]
                    })),
                    noncomplianceItems: noncompliant.map(c => c.id)
                  })} className={`${ACTION_BTN} w-fit`}>
                          <Icon name="description" className="text-[14px]" />
                          {t.generateReport}
                        </button>
                      </div>}

                    {status === 'current' && s === 'final-review' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        {x.noncomplianceItems && x.noncomplianceItems.length > 0 && <p className="rounded bg-amber-50 p-2 text-[12px] text-[#B45309]">{t.noncomplianceTitle}: {x.noncomplianceItems.map(id => inspectionCriteriaDefs.find(c => c.id === id)?.[language]).join(', ')}</p>}
                        <Field label={t.finalNoteLabel}>
                          <textarea value={finalNote} onChange={e => setFinalNote(e.target.value)} rows={2} className={inputClass} />
                        </Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => onUpdate({
                      ...x,
                      stage: 'approved',
                      finalDecisionNote: finalNote.trim(),
                      transferApprovalLetterNo: `TAL-2026-${1000 + Math.floor(Math.random() * 900)}`,
                      prcStatus: x.itemType === 'raw-material' ? 'pending' : undefined
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
                            ...x,
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

          {x.stage === 'approved' && <div className="flex flex-col gap-3">
              <div className="rounded-xl border-2 border-[#0A4D8C]/20 bg-white p-5">
                <div className="flex items-center justify-between border-b border-dashed border-[#CBD5E1] pb-3">
                  <p className="text-base font-bold text-[#0A4D8C]">{t.approvalLetterTitle}</p>
                  <p className="text-[12px] text-[#64748B]">{t.approvalLetterIssued}: {x.transferApprovalLetterNo}</p>
                </div>
                <p className="mt-2 text-[12px] text-[#64748B]">{t.approvalLetterNote}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {x.items.map(it => <p key={it.hsCode} className="text-[13px] text-[#334155]">{it.hsCode} — {language === 'en' ? it.descEn : it.descBn}: <span className="font-semibold text-[#0A4D8C]">{it.qty}</span></p>)}
                </div>
              </div>

              {x.itemType === 'raw-material' && <div className="rounded-xl border border-[#E2E8F0] p-4">
                  <p className="text-[13px] font-bold text-[#1E293B]">{t.prcTitle}</p>
                  <p className="mt-1 text-[12px] text-[#64748B]">{t.prcHint}</p>
                  {x.prcStatus === 'pending' && <button type="button" onClick={() => onToast(t.prcSubmittedWaiting)} className={`${ACTION_BTN_OUTLINE} mt-2 w-fit`}>
                      {t.simulateSubmitPrc}
                    </button>}
                  {x.prcStatus === 'pending' && <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => {
                  onUpdate({
                    ...x,
                    prcStatus: 'verified'
                  });
                  onToast(t.prcVerifiedNotice);
                }} className={`${ACTION_BTN_GREEN} w-fit`}>{t.verifyPrcBb}</button>
                      <button type="button" onClick={() => {
                  onUpdate({
                    ...x,
                    prcStatus: 'failed'
                  });
                  onToast(t.prcFailedNotice);
                }} className={`${ACTION_BTN_RED} w-fit`}>{t.failPrc}</button>
                    </div>}
                  {x.prcStatus === 'verified' && <p className="mt-2 text-[12px] font-semibold text-[#00A86B]">{t.prcVerifiedNotice}</p>}
                  {x.prcStatus === 'failed' && <p className="mt-2 text-[12px] font-semibold text-[#DC2626]">{t.prcFailedNotice}</p>}
                </div>}
            </div>}

          {isException && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-[#B91C1C]">
              <p className="font-bold">{t.disapprovedTitle}</p>
              <p className="mt-1">{x.disapprovalReason}</p>
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
  onSubmit: (x: InterBondTransfer) => void;
}) {
  const [step, setStep] = useState(1);
  const [fromLicenseNo, setFromLicenseNo] = useState('');
  const [verifiedFrom, setVerifiedFrom] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [fromNotFound, setFromNotFound] = useState(false);
  const [toLicenseNo, setToLicenseNo] = useState('');
  const [verifiedTo, setVerifiedTo] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [toNotFound, setToNotFound] = useState(false);
  const [sameLicenseErr, setSameLicenseErr] = useState(false);
  const [itemType, setItemType] = useState<TransferItemType>('raw-material');
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
            }} placeholder="BL-2020-00512" error={toNotFound} />
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
            <Field label={t.itemTypeLabel}>
              <div className="flex gap-2">
                {(['raw-material', 'machinery'] as const).map(it => <button key={it} type="button" onClick={() => setItemType(it)} className={['rounded-full px-4 py-2 text-xs font-semibold transition-colors', itemType === it ? 'bg-[#0A4D8C] text-white' : 'border border-[#CBD5E1] text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
                    {it === 'raw-material' ? t.rawMaterial : t.machinery}
                  </button>)}
              </div>
            </Field>
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
              <div className="col-span-2"><p className="text-[11px] text-[#94A3B8]">{t.itemTypeLabel}</p><p className="font-medium text-[#1E293B]">{itemType === 'raw-material' ? t.rawMaterial : t.machinery}</p></div>
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
          const x: InterBondTransfer = {
            id: `IBT-2026-0${90 + Math.floor(Math.random() * 90)}`,
            fromLicenseNo: verifiedFrom.licenseNo,
            toLicenseNo: verifiedTo.licenseNo,
            itemType,
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
          onSubmit(x);
        }} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-50">
              {t.submit}
            </button>}
        </div>
      </div>
    </div>;
}
