import { useState } from 'react';
import { bondLicenses, type BondLicense } from './bondLicenseData';
import { lienBanks } from './lienBankData';
type Language = 'en' | 'bn';
type ReqStage = 'submitted' | 'assignment' | 'ro-verification' | 'lien-bank-verification' | 'acdc-review' | 'updated' | 'disapproved';
interface LienBankChangeProps {
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
const T = {
  en: {
    home: 'Home',
    lienBankManagement: 'Lien Bank Management',
    pageTitle: 'Lien Bank Change',
    subtitle: 'Apply to change or add the Lien Bank on an existing Bond License. The bond license number remains unchanged after approval.',
    backToDashboard: 'Back to Dashboard',
    next: 'Save & Continue',
    back: 'Back',
    submit: 'Submit Request',
    required: 'Required',
    stepLabel: 'Step',
    of: 'of',
    verify: 'Verify',
    licenseNoLabel: 'Bond License Number',
    notFound: 'No license found with this number. Please check and try again.',
    verified: 'Verified',
    currentOwner: 'Bonder',
    currentLienBank: 'Current Lien Bank',
    category: 'Category',
    status: 'Status',
    pendingRequests: 'Pending Requests',
    queueTitle: 'Lien Bank Change — Review Queue',
    queueSubtitle: 'Commissioner assignment, RO/ARO document examination, Lien Bank e-Verification, and AC/DC approval before the Bonder Profile is updated.',
    filterAll: 'All',
    filterInProgress: 'In Progress',
    filterUpdated: 'Updated',
    filterDisapproved: 'Disapproved',
    stageLabels: {
      submitted: 'Application Submitted',
      assignment: 'e-Assignment (Commissioner)',
      'ro-verification': 'RO/ARO Document Verification',
      'lien-bank-verification': 'Lien Bank e-Verification',
      'acdc-review': 'AC/DC Verification & Approval',
      updated: 'Lien Bank Updated',
      disapproved: 'Disapproved'
    },
    review: 'Review',
    reviewTitle: 'Review Lien Bank Change Request',
    close: 'Close',
    // step 0
    step0: 'Select License',
    step1: 'Lien Bank Details',
    step2: 'Supporting Documents',
    step3: 'Review & Submit',
    // step 1
    changeTypeLabel: 'Request Type',
    changeTypeChange: 'Change Existing Lien Bank',
    changeTypeAddition: 'Add New Lien Bank',
    newBankLabel: 'New Lien Bank',
    newBankPlaceholder: 'Select the Lien Bank to add',
    reasonLabel: 'Reason for Change / Addition',
    reasonPlaceholder: 'Explain why the Lien Bank needs to be changed or added…',
    // step 2
    uploadIntro: 'Upload clear scanned copies of the following documents. Accepted formats: PDF, JPG, PNG (max 2 MB each).',
    upload: 'Upload',
    uploaded: 'Uploaded',
    // review panel
    assignOfficer: 'Assign RO/ARO',
    assignOfficerConfirm: 'Select an RO/ARO by zone and assign this application for document examination.',
    assignAndNotify: 'Assign & Notify',
    officerNoteLabel: 'RO/ARO e-Note & Nothi',
    officerNotePlaceholder: 'Examination remarks on submitted documents…',
    forwardToLienBank: 'Add e-Note & Forward to Lien Bank',
    selectBankCode: 'Select Bank Code for e-Verification',
    bankCodeHint: 'Documents will be electronically forwarded to this Lien Bank branch for verification.',
    awaitingLienBank: 'Awaiting Lien Bank verification response.',
    simulateResponse: 'Simulate Lien Bank Verification Response',
    lienBankNoteLabel: 'Lien Bank Verification Note',
    lienBankRecommendVerified: 'Verified — Recommend Approval',
    lienBankRecommendConcern: 'Verified with Concerns — Recommend Disapproval',
    requestMoreDocs: 'Request Additional Documents',
    requestMoreDocsSent: 'Notification sent to Applicant requesting additional documents (CC: Commissioner).',
    moreDocsPending: 'Awaiting additional documents from Applicant.',
    docsReceived: 'Documents Received (simulate)',
    proceedToAcdc: 'Forward to AC/DC',
    acdcNoteLabel: 'AC/DC e-Note',
    acdcNotePlaceholder: 'AC/DC verification remarks…',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalReasonRequired: 'A reason is required to disapprove.',
    updatedNotice: 'Bonder Profile updated with the new Lien Bank. Change is viewable to all concerned authorities. Commissioner and applicant auto-notified.',
    disapprovedNotice: 'Disapproval notification sent to applicant.',
    newBank: 'Requested Lien Bank',
    trackRequest: 'Track this Request',
    lienBankRecommendation: 'Lien Bank Recommendation',
    assignedOfficer: 'Assigned Officer'
  },
  bn: {
    home: 'হোম',
    lienBankManagement: 'লিয়েন ব্যাংক ব্যবস্থাপনা',
    pageTitle: 'লিয়েন ব্যাংক পরিবর্তন',
    subtitle: 'বিদ্যমান বন্ড লাইসেন্সে লিয়েন ব্যাংক পরিবর্তন বা সংযোজনের জন্য আবেদন করুন। অনুমোদনের পর বন্ড লাইসেন্স নম্বর অপরিবর্তিত থাকবে।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    next: 'সংরক্ষণ করে এগিয়ে যান',
    back: 'পূর্ববর্তী',
    submit: 'অনুরোধ জমা দিন',
    required: 'আবশ্যক',
    stepLabel: 'ধাপ',
    of: 'এর মধ্যে',
    verify: 'যাচাই করুন',
    licenseNoLabel: 'বন্ড লাইসেন্স নম্বর',
    notFound: 'এই নম্বরে কোনো লাইসেন্স পাওয়া যায়নি। অনুগ্রহ করে যাচাই করে আবার চেষ্টা করুন।',
    verified: 'যাচাইকৃত',
    currentOwner: 'বন্ডকারী',
    currentLienBank: 'বর্তমান লিয়েন ব্যাংক',
    category: 'ক্যাটাগরি',
    status: 'অবস্থা',
    pendingRequests: 'অমীমাংসিত অনুরোধ',
    queueTitle: 'লিয়েন ব্যাংক পরিবর্তন — পর্যালোচনা সারি',
    queueSubtitle: 'বন্ডকারী প্রোফাইল হালনাগাদের আগে কমিশনার নিয়োগ, আরও/এআরও নথি যাচাই, লিয়েন ব্যাংক ই-যাচাই এবং এসি/ডিসি অনুমোদন।',
    filterAll: 'সকল',
    filterInProgress: 'চলমান',
    filterUpdated: 'হালনাগাদকৃত',
    filterDisapproved: 'অননুমোদিত',
    stageLabels: {
      submitted: 'আবেদন জমা হয়েছে',
      assignment: 'ই-নিয়োগ (কমিশনার)',
      'ro-verification': 'আরও/এআরও নথি যাচাই',
      'lien-bank-verification': 'লিয়েন ব্যাংক ই-যাচাই',
      'acdc-review': 'এসি/ডিসি যাচাই ও অনুমোদন',
      updated: 'লিয়েন ব্যাংক হালনাগাদ',
      disapproved: 'অননুমোদিত'
    },
    review: 'পর্যালোচনা',
    reviewTitle: 'লিয়েন ব্যাংক পরিবর্তন অনুরোধ পর্যালোচনা',
    close: 'বন্ধ করুন',
    step0: 'লাইসেন্স নির্বাচন',
    step1: 'লিয়েন ব্যাংক বিবরণ',
    step2: 'সহায়ক নথি',
    step3: 'পর্যালোচনা ও জমা',
    changeTypeLabel: 'অনুরোধের ধরন',
    changeTypeChange: 'বিদ্যমান লিয়েন ব্যাংক পরিবর্তন',
    changeTypeAddition: 'নতুন লিয়েন ব্যাংক সংযোজন',
    newBankLabel: 'নতুন লিয়েন ব্যাংক',
    newBankPlaceholder: 'যে লিয়েন ব্যাংক যুক্ত করতে চান তা নির্বাচন করুন',
    reasonLabel: 'পরিবর্তন/সংযোজনের কারণ',
    reasonPlaceholder: 'কেন লিয়েন ব্যাংক পরিবর্তন বা সংযোজন প্রয়োজন তা ব্যাখ্যা করুন…',
    uploadIntro: 'নিচের নথিগুলোর স্পষ্ট স্ক্যান কপি আপলোড করুন। গ্রহণযোগ্য ফরম্যাট: PDF, JPG, PNG (সর্বোচ্চ ২ এমবি করে)।',
    upload: 'আপলোড করুন',
    uploaded: 'আপলোড হয়েছে',
    assignOfficer: 'আরও/এআরও নিয়োগ',
    assignOfficerConfirm: 'অঞ্চল অনুযায়ী একজন আরও/এআরও নির্বাচন করুন এবং নথি পরীক্ষার জন্য এই আবেদনটি নিয়োগ করুন।',
    assignAndNotify: 'নিয়োগ করুন ও অবহিত করুন',
    officerNoteLabel: 'আরও/এআরও e-নোট ও নথি',
    officerNotePlaceholder: 'জমাকৃত নথির পরীক্ষার মন্তব্য…',
    forwardToLienBank: 'e-নোট যোগ করে লিয়েন ব্যাংকে ফরওয়ার্ড করুন',
    selectBankCode: 'ই-যাচাইয়ের জন্য ব্যাংক কোড নির্বাচন করুন',
    bankCodeHint: 'নথিসমূহ এই লিয়েন ব্যাংক শাখায় ইলেকট্রনিকভাবে যাচাইয়ের জন্য প্রেরণ করা হবে।',
    awaitingLienBank: 'লিয়েন ব্যাংকের যাচাই প্রতিক্রিয়ার অপেক্ষায়।',
    simulateResponse: 'লিয়েন ব্যাংক যাচাই প্রতিক্রিয়া সিমুলেট করুন',
    lienBankNoteLabel: 'লিয়েন ব্যাংক যাচাই মন্তব্য',
    lienBankRecommendVerified: 'যাচাইকৃত — অনুমোদনের সুপারিশ',
    lienBankRecommendConcern: 'উদ্বেগসহ যাচাইকৃত — অননুমোদনের সুপারিশ',
    requestMoreDocs: 'অতিরিক্ত নথি অনুরোধ',
    requestMoreDocsSent: 'আবেদনকারীকে অতিরিক্ত নথির অনুরোধ পাঠানো হয়েছে (সিসি: কমিশনার)।',
    moreDocsPending: 'আবেদনকারীর কাছ থেকে অতিরিক্ত নথির অপেক্ষায়।',
    docsReceived: 'নথি প্রাপ্ত হয়েছে (সিমুলেট)',
    proceedToAcdc: 'এসি/ডিসিতে ফরওয়ার্ড করুন',
    acdcNoteLabel: 'এসি/ডিসি e-নোট',
    acdcNotePlaceholder: 'এসি/ডিসি যাচাইয়ের মন্তব্য…',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalReasonRequired: 'অননুমোদনের জন্য একটি কারণ আবশ্যক।',
    updatedNotice: 'বন্ডকারী প্রোফাইল নতুন লিয়েন ব্যাংকসহ হালনাগাদ হয়েছে। এই পরিবর্তন সকল সংশ্লিষ্ট কর্তৃপক্ষের কাছে দৃশ্যমান। কমিশনার ও আবেদনকারীকে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    disapprovedNotice: 'আবেদনকারীর কাছে অননুমোদন বিজ্ঞপ্তি পাঠানো হয়েছে।',
    newBank: 'অনুরোধকৃত লিয়েন ব্যাংক',
    trackRequest: 'এই অনুরোধটি ট্র্যাক করুন',
    lienBankRecommendation: 'লিয়েন ব্যাংকের সুপারিশ',
    assignedOfficer: 'নিয়োগপ্রাপ্ত কর্মকর্তা'
  }
};
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
interface UploadStatus {
  uploaded: boolean;
  fileName?: string;
  size?: string;
}
function UploadRow({
  icon,
  label,
  required,
  status,
  onUpload,
  onRemove,
  language
}: {
  icon: string;
  label: string;
  required: boolean;
  status: UploadStatus;
  onUpload: () => void;
  onRemove: () => void;
  language: Language;
}) {
  return <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', status.uploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
          <Icon name={status.uploaded ? 'task_alt' : icon} className="text-[20px]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1E293B]">
            {label}
            {required && <span className="ml-1 text-[#DC2626]">*</span>}
          </p>
          {status.uploaded ? <p className="truncate text-xs text-[#64748B]">
              {status.fileName} · {status.size}
            </p> : <p className="text-xs text-[#94A3B8]">{language === 'en' ? 'PDF, JPG or PNG · max 2 MB' : 'PDF, JPG বা PNG · সর্বোচ্চ ২ এমবি'}</p>}
        </div>
      </div>
      {status.uploaded ? <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে'}</span>
          <button type="button" onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F5F7FA] hover:text-[#DC2626]">
            <Icon name="delete" className="text-[18px]" />
          </button>
        </div> : <button type="button" onClick={onUpload} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] transition-colors hover:bg-[#EAF3FE]">
          <Icon name="upload" className="text-[16px]" />
          {language === 'en' ? 'Upload' : 'আপলোড করুন'}
        </button>}
    </div>;
}
function StepperNav({
  language,
  steps,
  currentStep,
  furthestStep,
  onJump
}: {
  language: Language;
  steps: {
    id: string;
    en: string;
    bn: string;
    icon: string;
  }[];
  currentStep: number;
  furthestStep: number;
  onJump: (i: number) => void;
}) {
  return <ol className="flex flex-col gap-1">
      {steps.map((s, i) => {
      const state = i < currentStep ? 'done' : i === currentStep ? 'current' : 'upcoming';
      const clickable = i <= furthestStep;
      return <li key={s.id}>
            <button type="button" disabled={!clickable} onClick={() => clickable && onJump(i)} className={['flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors', state === 'current' ? 'bg-[#EAF3FE]' : 'hover:bg-[#F5F7FA]', !clickable ? 'cursor-not-allowed opacity-60' : ''].join(' ')}>
              <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors', state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]'].join(' ')}>
                {state === 'done' ? <Icon name="check" className="text-[18px]" /> : i + 1}
              </span>
              <span className={['block truncate text-[13px] font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{s[language]}</span>
            </button>
          </li>;
    })}
    </ol>;
}
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
  id: 'applicationLetter',
  icon: 'description',
  en: 'Application Letter for Lien Bank Change/Addition',
  bn: 'লিয়েন ব্যাংক পরিবর্তন/সংযোজনের আবেদনপত্র',
  required: true
}, {
  id: 'currentBankNoc',
  icon: 'account_balance',
  en: 'No Objection Certificate from Current Lien Bank',
  bn: 'বর্তমান লিয়েন ব্যাংকের অনাপত্তি সনদ',
  required: true
}, {
  id: 'boardResolution',
  icon: 'gavel',
  en: 'Board Resolution / Authorization Letter',
  bn: 'বোর্ড রেজোলিউশন / অনুমোদনপত্র',
  required: true
}, {
  id: 'tradeLicense',
  icon: 'badge',
  en: 'Updated Trade License Copy',
  bn: 'হালনাগাদ ট্রেড লাইসেন্সের কপি',
  required: false
}];
const normalizeLicenseNo = (s: string) => s.trim().toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, '');
const stageOrder: ReqStage[] = ['submitted', 'assignment', 'ro-verification', 'lien-bank-verification', 'acdc-review', 'updated'];
interface LienBankChangeRequest {
  id: string;
  licenseNo: string;
  bonderEn: string;
  bonderBn: string;
  currentLienBank: string;
  changeType: 'change' | 'addition';
  requestedBankCode: string;
  reason: string;
  submittedDate: string;
  stage: ReqStage;
  assignedOfficer?: string;
  officerNote?: string;
  verificationBankCode?: string;
  lienBankNote?: string;
  lienBankRecommendation?: 'verified' | 'concern';
  moreDocsRequested?: boolean;
  acdcNote?: string;
  disapprovalReason?: string;
}
const seedRequests: LienBankChangeRequest[] = [{
  id: 'LBC-2026-6041',
  licenseNo: 'BL-2022-01876',
  bonderEn: 'Jamuna Denims Ltd.',
  bonderBn: 'যমুনা ডেনিমস লিমিটেড',
  currentLienBank: 'Dutch-Bangla Bank Limited, Narayanganj Branch',
  changeType: 'change',
  requestedBankCode: 'EBL',
  reason: 'Better trade finance terms and closer branch proximity to factory.',
  submittedDate: '18 Jul 2026',
  stage: 'ro-verification',
  assignedOfficer: officerPool[0].en
}, {
  id: 'LBC-2026-6028',
  licenseNo: 'BL-2020-00743',
  bonderEn: 'Meghna Knit Composite Ltd.',
  bonderBn: 'মেঘনা নিট কম্পোজিট লিমিটেড',
  currentLienBank: 'Sonali Bank, Gazipur Branch',
  changeType: 'change',
  requestedBankCode: 'DBBL',
  reason: 'Existing lien bank branch is being consolidated by the bank; relationship manager recommended DBBL Gazipur.',
  submittedDate: '12 Jul 2026',
  stage: 'lien-bank-verification',
  assignedOfficer: officerPool[1].en,
  officerNote: 'Application and NOC examined — consistent with submitted board resolution. Forwarded for Lien Bank e-Verification.',
  verificationBankCode: 'DBBL'
}, {
  id: 'LBC-2026-5990',
  licenseNo: 'BL-2019-00456',
  bonderEn: 'Ananta Denim Technology Ltd.',
  bonderBn: 'অনন্ত ডেনিম টেকনোলজি লিমিটেড',
  currentLienBank: 'Eastern Bank Limited, Savar Branch',
  changeType: 'addition',
  requestedBankCode: 'SBL',
  reason: 'Adding a second Lien Bank to support a new LC facility for an expanded export order.',
  submittedDate: '30 Jun 2026',
  stage: 'updated',
  assignedOfficer: officerPool[2].en,
  officerNote: 'Documents verified in order. Forwarded for Lien Bank e-Verification.',
  verificationBankCode: 'SBL',
  lienBankNote: 'Bonder profile and attachments verified. No irregularities found.',
  lienBankRecommendation: 'verified',
  acdcNote: 'Verified RO/ARO examination and Lien Bank recommendation. Approved.'
}];
const stepDefs = [{
  id: 'select',
  en: 'Select License',
  bn: 'লাইসেন্স নির্বাচন',
  icon: 'manage_search'
}, {
  id: 'details',
  en: 'Lien Bank Details',
  bn: 'লিয়েন ব্যাংক বিবরণ',
  icon: 'account_balance'
}, {
  id: 'documents',
  en: 'Supporting Documents',
  bn: 'সহায়ক নথি',
  icon: 'upload_file'
}, {
  id: 'review',
  en: 'Review & Submit',
  bn: 'পর্যালোচনা ও জমা',
  icon: 'fact_check'
}];
export function LienBankChange({
  language,
  onDone
}: LienBankChangeProps) {
  const t = T[language];
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [licenseNoInput, setLicenseNoInput] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<BondLicense | null>(null);
  const [verifyError, setVerifyError] = useState(false);
  const [form, setForm] = useState({
    changeType: 'change' as 'change' | 'addition',
    requestedBankCode: '',
    reason: '',
    agree: false
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [docs, setDocs] = useState<Record<string, UploadStatus>>(Object.fromEntries(documentDefs.map(d => [d.id, {
    uploaded: false
  }])));
  const [submitted, setSubmitted] = useState(false);
  const [reqId] = useState(() => `LBC-2026-${Math.floor(6200 + Math.random() * 799)}`);
  const [requests, setRequests] = useState<LienBankChangeRequest[]>(seedRequests);
  const [view, setView] = useState<'form' | 'queue'>('form');
  const [queueFilter, setQueueFilter] = useState<'all' | 'in-progress' | 'updated' | 'disapproved'>('all');
  const [selected, setSelected] = useState<LienBankChangeRequest | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };
  const set = (key: keyof typeof form, value: string | boolean) => setForm(f => ({
    ...f,
    [key]: value
  }));
  const verifyLicense = () => {
    const found = bondLicenses.find(l => normalizeLicenseNo(l.licenseNo) === normalizeLicenseNo(licenseNoInput));
    if (found) {
      setVerifiedLicense(found);
      setVerifyError(false);
    } else {
      setVerifiedLicense(null);
      setVerifyError(true);
    }
  };
  const requiredByStep: Record<number, (keyof typeof form)[]> = {
    0: [],
    1: ['requestedBankCode', 'reason'],
    2: [],
    3: []
  };
  const validateStep = (step: number) => {
    if (step === 0) {
      if (!verifiedLicense) {
        setVerifyError(true);
        return false;
      }
      return true;
    }
    const fields = requiredByStep[step] ?? [];
    const nextErrors: Record<string, boolean> = {};
    fields.forEach(f => {
      if (!form[f]) nextErrors[f as string] = true;
    });
    if (step === 2) {
      documentDefs.forEach(d => {
        if (d.required && !docs[d.id]?.uploaded) nextErrors[d.id] = true;
      });
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const goNext = () => {
    if (!validateStep(currentStep)) return;
    const next = Math.min(currentStep + 1, stepDefs.length - 1);
    setCurrentStep(next);
    setFurthestStep(f => Math.max(f, next));
  };
  const goBack = () => setCurrentStep(s => Math.max(0, s - 1));
  const handleSubmit = () => {
    if (!form.agree) {
      setErrors({
        agree: true
      });
      return;
    }
    const newReq: LienBankChangeRequest = {
      id: reqId,
      licenseNo: verifiedLicense!.licenseNo,
      bonderEn: verifiedLicense!.nameEn,
      bonderBn: verifiedLicense!.nameBn,
      currentLienBank: verifiedLicense!.lienBank,
      changeType: form.changeType,
      requestedBankCode: form.requestedBankCode,
      reason: form.reason,
      submittedDate: '26 Jul 2026',
      stage: 'submitted'
    };
    setRequests(prev => [newReq, ...prev]);
    setSubmitted(true);
  };
  const updateReq = (id: string, patch: Partial<LienBankChangeRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      ...patch
    } : r));
    setSelected(prev => prev && prev.id === id ? {
      ...prev,
      ...patch
    } : prev);
  };
  const pendingCount = requests.filter(r => r.stage !== 'updated' && r.stage !== 'disapproved').length;
  const filteredRequests = requests.filter(r => {
    if (queueFilter === 'all') return true;
    if (queueFilter === 'updated') return r.stage === 'updated';
    if (queueFilter === 'disapproved') return r.stage === 'disapproved';
    return r.stage !== 'updated' && r.stage !== 'disapproved';
  });
  const bankName = (code: string) => {
    const b = lienBanks.find(x => x.bankCode === code);
    return b ? `${language === 'en' ? b.nameEn : b.nameBn} (${b.bankCode})` : code;
  };
  if (selected) {
    const r = selected;
    const stageIndex = stageOrder.indexOf(r.stage);
    return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
        <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">{t.reviewTitle}</h2>
              <p className="text-xs text-[#64748B]">
                {r.id} · {r.licenseNo}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>

          {toast && <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
              <Icon name="check_circle" className="text-[16px]" />
              {toast}
            </div>}

          <div className="flex flex-col gap-3 px-5 py-5">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#E2E8F0] p-4 text-[13px]">
              <div className="col-span-2">
                <p className="text-[11px] text-[#94A3B8]">{t.currentOwner}</p>
                <p className="font-medium text-[#1E293B]">{r[language === 'en' ? 'bonderEn' : 'bonderBn']}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t.currentLienBank}</p>
                <p className="font-medium text-[#1E293B]">{r.currentLienBank}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t.newBank}</p>
                <p className="font-medium text-[#1E293B]">{bankName(r.requestedBankCode)}</p>
              </div>
            </div>

            {r.stage === 'disapproved' ? <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
                  <Icon name="cancel" className="text-[18px]" />
                  {t.stageLabels.disapproved}
                </p>
                <p className="mt-1 text-xs text-[#B91C1C]">{r.disapprovalReason}</p>
                <p className="mt-2 text-xs text-[#DC2626]">{t.disapprovedNotice}</p>
              </div> : stageOrder.map((stage, i) => {
            const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'upcoming';
            return <div key={stage} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full', state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]'].join(' ')}>
                        <Icon name={state === 'done' ? 'check' : 'circle'} className="text-[15px]" />
                      </span>
                      {i < stageOrder.length - 1 && <span className={`w-0.5 flex-1 ${state === 'done' ? 'bg-[#00A86B]' : 'bg-[#E2E8F0]'}`} style={{
                  minHeight: '16px'
                }} />}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className={['text-sm font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{t.stageLabels[stage]}</p>

                      {state === 'current' && stage === 'submitted' && <button type="button" onClick={() => updateReq(r.id, {
                  stage: 'assignment'
                })} className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                          {t.assignOfficer}
                        </button>}

                      {state === 'done' && stage === 'assignment' && <p className="mt-0.5 text-xs text-[#64748B]">
                          {t.assignedOfficer}: {r.assignedOfficer}
                        </p>}
                      {state === 'current' && stage === 'assignment' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <p className="text-[11px] text-[#64748B]">{t.assignOfficerConfirm}</p>
                          <Field label={t.assignedOfficer}>
                            <select value={r.assignedOfficer ?? ''} onChange={e => updateReq(r.id, {
                      assignedOfficer: e.target.value
                    })} className={inputClass}>
                              <option value="">—</option>
                              {officerPool.map(o => <option key={o.en} value={o[language]}>
                                  {o[language]}
                                </option>)}
                            </select>
                          </Field>
                          <button type="button" disabled={!r.assignedOfficer} onClick={() => updateReq(r.id, {
                    stage: 'ro-verification'
                  })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                            {t.assignAndNotify}
                          </button>
                        </div>}

                      {state === 'done' && stage === 'ro-verification' && <p className="mt-0.5 text-xs text-[#64748B]">{r.officerNote}</p>}
                      {state === 'current' && stage === 'ro-verification' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <Field label={t.officerNoteLabel}>
                            <textarea rows={3} value={r.officerNote ?? ''} onChange={e => updateReq(r.id, {
                      officerNote: e.target.value
                    })} placeholder={t.officerNotePlaceholder} className={`${inputClass} resize-none`} />
                          </Field>
                          <Field label={t.selectBankCode}>
                            <select value={r.verificationBankCode ?? r.requestedBankCode} onChange={e => updateReq(r.id, {
                      verificationBankCode: e.target.value
                    })} className={inputClass}>
                              {lienBanks.map(b => <option key={b.bankCode} value={b.bankCode}>
                                  {language === 'en' ? b.nameEn : b.nameBn} ({b.bankCode})
                                </option>)}
                            </select>
                          </Field>
                          <p className="text-[11px] text-[#94A3B8]">{t.bankCodeHint}</p>
                          <button type="button" disabled={!r.officerNote?.trim()} onClick={() => updateReq(r.id, {
                    stage: 'lien-bank-verification',
                    verificationBankCode: r.verificationBankCode ?? r.requestedBankCode
                  })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                            {t.forwardToLienBank}
                          </button>
                        </div>}

                      {state === 'done' && stage === 'lien-bank-verification' && <p className="mt-0.5 text-xs text-[#64748B]">{r.lienBankNote}</p>}
                      {state === 'current' && stage === 'lien-bank-verification' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                            <Icon name="hourglass_top" className="text-[15px]" />
                            {t.awaitingLienBank}
                          </p>
                          {!r.lienBankRecommendation ? <>
                              <Field label={t.lienBankNoteLabel}>
                                <textarea rows={2} value={r.lienBankNote ?? ''} onChange={e => updateReq(r.id, {
                        lienBankNote: e.target.value
                      })} className={`${inputClass} resize-none`} />
                              </Field>
                              <div className="flex flex-wrap gap-2">
                                <button type="button" disabled={!r.lienBankNote?.trim()} onClick={() => updateReq(r.id, {
                        lienBankRecommendation: 'verified'
                      })} className="rounded-full border border-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-[#00A86B] hover:bg-emerald-50 disabled:opacity-40">
                                  {t.lienBankRecommendVerified}
                                </button>
                                <button type="button" disabled={!r.lienBankNote?.trim()} onClick={() => updateReq(r.id, {
                        lienBankRecommendation: 'concern'
                      })} className="rounded-full border border-amber-600 px-3.5 py-1.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-40">
                                  {t.lienBankRecommendConcern}
                                </button>
                              </div>
                            </> : <>
                              <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                                <span className={['text-[11px] font-semibold', r.lienBankRecommendation === 'verified' ? 'text-emerald-700' : 'text-amber-700'].join(' ')}>
                                  {r.lienBankRecommendation === 'verified' ? t.lienBankRecommendVerified : t.lienBankRecommendConcern}
                                </span>
                              </div>
                              {!r.moreDocsRequested ? <button type="button" onClick={() => {
                      updateReq(r.id, {
                        moreDocsRequested: true
                      });
                      flash(t.requestMoreDocsSent);
                    }} className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:underline">
                                  <Icon name="mail" className="text-[14px]" />
                                  {t.requestMoreDocs}
                                </button> : <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                                  <span className="text-[11px] font-medium text-amber-700">{t.moreDocsPending}</span>
                                  <button type="button" onClick={() => updateReq(r.id, {
                        moreDocsRequested: false
                      })} className="rounded-full border border-amber-600 px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100">
                                    {t.docsReceived}
                                  </button>
                                </div>}
                              <button type="button" disabled={r.moreDocsRequested} onClick={() => updateReq(r.id, {
                      stage: 'acdc-review'
                    })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                                {t.proceedToAcdc}
                              </button>
                            </>}
                        </div>}

                      {state === 'done' && stage === 'acdc-review' && <p className="mt-0.5 text-xs text-[#64748B]">{r.acdcNote}</p>}
                      {state === 'current' && stage === 'acdc-review' && <AcdcApprovalPanel t={t} recommendation={r.lienBankRecommendation} note={r.acdcNote ?? ''} onNoteChange={v => updateReq(r.id, {
                  acdcNote: v
                })} onApprove={() => {
                  updateReq(r.id, {
                    stage: 'updated'
                  });
                  flash(t.updatedNotice);
                }} onDisapprove={reason => updateReq(r.id, {
                  stage: 'disapproved',
                  disapprovalReason: reason
                })} />}
                    </div>
                  </div>;
          })}

            {r.stage === 'updated' && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                  <Icon name="workspace_premium" className="text-[18px]" />
                  {t.stageLabels.updated}
                </p>
                <p className="mt-1 text-xs text-emerald-800">{t.updatedNotice}</p>
              </div>}
          </div>
        </div>
      </div>;
  }
  if (view === 'queue') {
    return <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <button type="button" onClick={() => setView('form')} className="hover:text-[#0A4D8C]">
            {t.pageTitle}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.pendingRequests}</span>
        </nav>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">{t.queueTitle}</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.queueSubtitle}</p>
          </div>
          <button type="button" onClick={() => setView('form')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.back}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'in-progress', 'updated', 'disapproved'] as const).map(f => <button key={f} type="button" onClick={() => setQueueFilter(f)} className={['rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', queueFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}>
              {f === 'all' ? t.filterAll : f === 'in-progress' ? t.filterInProgress : f === 'updated' ? t.filterUpdated : t.filterDisapproved}
            </button>)}
        </div>

        <div className="flex flex-col gap-3">
          {filteredRequests.map(r => <button key={r.id} type="button" onClick={() => setSelected(r)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name="account_balance" className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{r.id}</span>
                  <span className={['rounded-full px-2 py-0.5 text-[10px] font-semibold', r.stage === 'updated' ? 'bg-emerald-50 text-emerald-700' : r.stage === 'disapproved' ? 'bg-red-50 text-[#DC2626]' : 'bg-blue-50 text-[#0A4D8C]'].join(' ')}>
                    {t.stageLabels[r.stage]}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                  {r.licenseNo} · {r[language === 'en' ? 'bonderEn' : 'bonderBn']} → {bankName(r.requestedBankCode)}
                </p>
                <p className="text-[11px] text-[#94A3B8]">{r.submittedDate}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white">{t.review}</span>
            </button>)}
        </div>
      </div>;
  }
  if (submitted) {
    const req = requests.find(r => r.id === reqId)!;
    return <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check_circle" className="text-[36px]" />
          </span>
          <h1 className="text-xl font-bold text-[#1E293B]">{language === 'en' ? 'Lien Bank Change Request Submitted' : 'লিয়েন ব্যাংক পরিবর্তন অনুরোধ জমা হয়েছে'}</h1>
          <p className="max-w-md text-sm leading-relaxed text-[#64748B]">
            {language === 'en' ? `Your request for ${verifiedLicense?.licenseNo} has been received and will be assigned to an RO/ARO for review.` : `${verifiedLicense?.licenseNo}-এর জন্য আপনার অনুরোধ গৃহীত হয়েছে এবং পর্যালোচনার জন্য একজন আরও/এআরও-কে নিয়োগ করা হবে।`}
          </p>
          <div className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{language === 'en' ? 'Request ID' : 'অনুরোধ আইডি'}</p>
            <p className="text-lg font-bold text-[#0A4D8C]">{reqId}</p>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => setSelected(req)} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]">
            <Icon name="fact_check" className="text-[18px]" />
            {t.trackRequest}
          </button>
          <button type="button" onClick={onDone} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-5 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="home" className="text-[18px]" />
            {t.backToDashboard}
          </button>
        </div>
      </div>;
  }
  return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.lienBankManagement}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button type="button" onClick={() => setView('queue')} className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
          <Icon name="fact_check" className="text-[16px]" />
          {t.pendingRequests}
          {pendingCount > 0 && <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">{pendingCount}</span>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-[#E2E8F0] bg-white p-3 lg:sticky lg:top-6">
          <StepperNav language={language} steps={stepDefs} currentStep={currentStep} furthestStep={furthestStep} onJump={setCurrentStep} />
        </aside>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
              <Icon name={stepDefs[currentStep].icon} className="text-[20px]" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                {t.stepLabel} {currentStep + 1} {t.of} {stepDefs.length}
              </p>
              <h2 className="text-base font-bold text-[#1E293B]">{stepDefs[currentStep][language]}</h2>
            </div>
          </div>

          {currentStep === 0 && <div className="flex flex-col gap-4">
              <Field label={t.licenseNoLabel} required error={verifyError ? t.notFound : undefined}>
                <div className="flex gap-2">
                  <TextInput value={licenseNoInput} onChange={v => {
                setLicenseNoInput(v);
                setVerifiedLicense(null);
                setVerifyError(false);
              }} placeholder="BL-2024-03398" error={verifyError} />
                  <button type="button" onClick={verifyLicense} className="shrink-0 rounded-lg border border-[#0A4D8C] px-4 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                    {t.verify}
                  </button>
                </div>
              </Field>

              {verifiedLicense && <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Icon name="check_circle" className="text-[20px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1E293B]">
                      {verifiedLicense.licenseNo} · <span className="text-emerald-700">{t.verified}</span>
                    </p>
                    <p className="text-xs text-[#334155]">
                      {t.currentOwner}: {verifiedLicense[language === 'en' ? 'nameEn' : 'nameBn']} · {t.currentLienBank}: {verifiedLicense.lienBank}
                    </p>
                  </div>
                </div>}
            </div>}

          {currentStep === 1 && <div className="flex flex-col gap-5">
              <Field label={t.changeTypeLabel} required>
                <div className="flex flex-wrap gap-2">
                  {(['change', 'addition'] as const).map(ct => <button key={ct} type="button" onClick={() => set('changeType', ct)} className={['rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors', form.changeType === ct ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}>
                      {ct === 'change' ? t.changeTypeChange : t.changeTypeAddition}
                    </button>)}
                </div>
              </Field>
              <Field label={t.newBankLabel} required error={errors.requestedBankCode ? t.required : undefined}>
                <select value={form.requestedBankCode} onChange={e => set('requestedBankCode', e.target.value)} className={`${inputClass} ${errors.requestedBankCode ? errorInputClass : ''}`}>
                  <option value="">{t.newBankPlaceholder}</option>
                  {lienBanks.map(b => <option key={b.bankCode} value={b.bankCode}>
                      {language === 'en' ? b.nameEn : b.nameBn} — {language === 'en' ? b.mainBranch.nameEn : b.mainBranch.nameBn}
                    </option>)}
                </select>
              </Field>
              <Field label={t.reasonLabel} required error={errors.reason ? t.required : undefined}>
                <textarea rows={3} value={form.reason} onChange={e => set('reason', e.target.value)} placeholder={t.reasonPlaceholder} className={`${inputClass} resize-none ${errors.reason ? errorInputClass : ''}`} />
              </Field>
            </div>}

          {currentStep === 2 && <div className="flex flex-col gap-3">
              <p className="text-xs text-[#64748B]">{t.uploadIntro}</p>
              {documentDefs.filter(d => d.id !== 'currentBankNoc' || form.changeType === 'change').map(d => <UploadRow key={d.id} icon={d.icon} label={d[language]} required={d.required} status={docs[d.id]} language={language} onUpload={() => setDocs(prev => ({
            ...prev,
            [d.id]: {
              uploaded: true,
              fileName: `${d.id}_scan.pdf`,
              size: `${(0.4 + Math.random() * 1.4).toFixed(1)} MB`
            }
          }))} onRemove={() => setDocs(prev => ({
            ...prev,
            [d.id]: {
              uploaded: false
            }
          }))} />)}
            </div>}

          {currentStep === 3 && <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="manage_search" className="text-[18px] text-[#0A4D8C]" />
                    <span className="text-sm font-semibold text-[#1E293B]">{stepDefs[0][language]}</span>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(0)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                    {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  <div className="flex justify-between gap-3 text-[13px]">
                    <dt className="text-[#64748B]">{t.licenseNoLabel}</dt>
                    <dd className="font-medium text-[#1E293B]">{verifiedLicense?.licenseNo}</dd>
                  </div>
                  <div className="flex justify-between gap-3 text-[13px]">
                    <dt className="text-[#64748B]">{t.currentLienBank}</dt>
                    <dd className="truncate font-medium text-[#1E293B]">{verifiedLicense?.lienBank}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="account_balance" className="text-[18px] text-[#0A4D8C]" />
                    <span className="text-sm font-semibold text-[#1E293B]">{stepDefs[1][language]}</span>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                    {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  {[[t.changeTypeLabel, form.changeType === 'change' ? t.changeTypeChange : t.changeTypeAddition], [t.newBankLabel, form.requestedBankCode ? bankName(form.requestedBankCode) : '—']].map(([k, v]) => <div key={k} className="flex justify-between gap-3 text-[13px]">
                      <dt className="text-[#64748B]">{k}</dt>
                      <dd className="truncate font-medium text-[#1E293B]">{v}</dd>
                    </div>)}
                </dl>
              </div>
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="upload_file" className="text-[18px] text-[#0A4D8C]" />
                    <span className="text-sm font-semibold text-[#1E293B]">{stepDefs[2][language]}</span>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                    {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  {documentDefs.filter(d => d.id !== 'currentBankNoc' || form.changeType === 'change').map(d => <div key={d.id} className="flex justify-between gap-3 text-[13px]">
                      <dt className="text-[#64748B]">{d[language]}</dt>
                      <dd className="font-medium text-[#1E293B]">{docs[d.id]?.uploaded ? language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে' : language === 'en' ? 'Not uploaded' : 'আপলোড হয়নি'}</dd>
                    </div>)}
                </dl>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input id="agree" type="checkbox" checked={form.agree} onChange={e => set('agree', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C] focus:ring-[#1E88E5]" />
                <label htmlFor="agree" className="text-sm text-[#334155]">
                  {language === 'en' ? 'I declare that the information and documents provided above are true and accurate to the best of my knowledge.' : 'আমি ঘোষণা করছি যে উপরে প্রদত্ত তথ্য ও নথিসমূহ আমার সর্বোত্তম জ্ঞানমতে সত্য ও সঠিক।'}
                </label>
              </div>
              {errors.agree && <span className="text-[11px] font-medium text-[#DC2626]">{t.required}</span>}
            </div>}

          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-5">
            <button type="button" onClick={currentStep === 0 ? onDone : goBack} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
              <Icon name="arrow_back" className="text-[16px]" />
              {currentStep === 0 ? t.backToDashboard : t.back}
            </button>
            {currentStep === stepDefs.length - 1 ? <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#048f5c]">
                {t.submit}
                <Icon name="send" className="text-[16px]" />
              </button> : <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]">
                {t.next}
                <Icon name="arrow_forward" className="text-[16px]" />
              </button>}
          </div>
        </div>
      </div>
    </div>;
}
function AcdcApprovalPanel({
  t,
  recommendation,
  note,
  onNoteChange,
  onApprove,
  onDisapprove
}: {
  t: (typeof T)['en'];
  recommendation?: 'verified' | 'concern';
  note: string;
  onNoteChange: (v: string) => void;
  onApprove: () => void;
  onDisapprove: (reason: string) => void;
}) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  return <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      {recommendation && <div className="flex items-center gap-1.5 rounded-lg bg-[#F5F7FA] px-3 py-2">
          <Icon name={recommendation === 'verified' ? 'thumb_up' : 'warning'} className={['text-[15px]', recommendation === 'verified' ? 'text-emerald-600' : 'text-amber-600'].join(' ')} />
          <span className="text-[11px] font-semibold text-[#334155]">{t.lienBankRecommendation}: {recommendation === 'verified' ? t.lienBankRecommendVerified : t.lienBankRecommendConcern}</span>
        </div>}
      <Field label={t.acdcNoteLabel}>
        <textarea rows={3} value={note} onChange={e => onNoteChange(e.target.value)} placeholder={t.acdcNotePlaceholder} className={`${inputClass} resize-none`} />
      </Field>
      {showReason && <Field label={t.disapprovalReasonLabel} error={error}>
          <textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} className={`${inputClass} resize-none`} />
        </Field>}
      <div className="flex gap-2">
        {!showReason ? <button type="button" onClick={() => setShowReason(true)} className="rounded-full border border-[#DC2626] px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50">
            {t.disapprove}
          </button> : <button type="button" onClick={() => {
        if (!reason.trim()) {
          setError(t.disapprovalReasonRequired);
          return;
        }
        onDisapprove(reason);
      }} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
            {t.disapprove}
          </button>}
        <button type="button" onClick={onApprove} className="rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]">
          {t.approve}
        </button>
      </div>
    </div>;
}