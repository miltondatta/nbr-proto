import { useState } from 'react';
import { bondLicenses, BondLicense } from './bondLicenseData';

type Language = 'en' | 'bn';
type ReqStage = 'submitted' | 'doc-verification' | 'lien-noc' | 'approval' | 'updated' | 'disapproved';

interface LicenseOwnershipChangeProps {
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
    bondLicense: 'Bond License Management',
    pageTitle: 'License Ownership Change',
    subtitle: 'Transfer ownership of an existing bond license. The bond license number remains unchanged after approval.',
    backToDashboard: 'Back to Dashboard',
    next: 'Save & Continue',
    back: 'Back',
    submit: 'Submit Request',
    required: 'Required',
    stepLabel: 'Step',
    of: 'of',
    verify: 'Verify',
    licenseNoLabel: 'Current Bond License Number',
    notFound: 'No license found with this number. Please check and try again.',
    verified: 'Verified',
    currentOwner: 'Current Bonder',
    category: 'Category',
    status: 'Status',
    pendingRequests: 'Pending Requests',
    queueTitle: 'Ownership Change Review Queue',
    queueSubtitle: 'License DB / audit check, Lien Bank NOC verification, and Commissioner approval before ownership is updated.',
    filterAll: 'All',
    filterInProgress: 'In Progress',
    filterUpdated: 'Updated',
    filterDisapproved: 'Disapproved',
    stageLabels: {
      submitted: 'Request Submitted',
      'doc-verification': 'Document / Audit Verification',
      'lien-noc': 'Lien Bank NOC Verification',
      approval: 'Commissioner Approval',
      updated: 'Ownership Updated',
      disapproved: 'Disapproved',
    },
    review: 'Review',
    reviewTitle: 'Review Ownership Change Request',
    close: 'Close',
    startVerification: 'Start Document Verification',
    auditCheckTitle: 'License DB Query — Audit Status Check',
    auditCheckResult: 'No irregularities found. Audit status: Compliant.',
    runAuditCheck: 'Run Audit Status Check',
    proceedToLienNoc: 'Proceed to Lien Bank NOC Verification',
    lienNocTitle: 'Lien Bank NOC Verification',
    lienNocVerified: 'NOC Verified',
    markLienNocVerified: 'Mark Lien Bank NOC Verified',
    proceedToApproval: 'Proceed to Approval',
    officerNote: 'e-Note & Nothi',
    notePlaceholder: 'Enter examination notes…',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalReasonRequired: 'A reason is required to disapprove.',
    updatedNotice: 'Bonder Profile updated to the new owner. Bond license number remains unchanged.',
    disapprovedNotice: 'Disapproval notification sent to applicant.',
    newOwner: 'New Owner',
    trackRequest: 'Track this Request',
  },
  bn: {
    home: 'হোম',
    bondLicense: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
    pageTitle: 'লাইসেন্স মালিকানা পরিবর্তন',
    subtitle: 'বিদ্যমান বন্ড লাইসেন্সের মালিকানা হস্তান্তর করুন। অনুমোদনের পর বন্ড লাইসেন্স নম্বর অপরিবর্তিত থাকবে।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    next: 'সংরক্ষণ করে এগিয়ে যান',
    back: 'পূর্ববর্তী',
    submit: 'অনুরোধ জমা দিন',
    required: 'আবশ্যক',
    stepLabel: 'ধাপ',
    of: 'এর মধ্যে',
    verify: 'যাচাই করুন',
    licenseNoLabel: 'বর্তমান বন্ড লাইসেন্স নম্বর',
    notFound: 'এই নম্বরে কোনো লাইসেন্স পাওয়া যায়নি। অনুগ্রহ করে যাচাই করে আবার চেষ্টা করুন।',
    verified: 'যাচাইকৃত',
    currentOwner: 'বর্তমান বন্ডকারী',
    category: 'ক্যাটাগরি',
    status: 'অবস্থা',
    pendingRequests: 'অমীমাংসিত অনুরোধ',
    queueTitle: 'মালিকানা পরিবর্তন পর্যালোচনা সারি',
    queueSubtitle: 'মালিকানা হালনাগাদের আগে লাইসেন্স ডিবি / নিরীক্ষা যাচাই, লিয়েন ব্যাংক এনওসি যাচাই এবং কমিশনার অনুমোদন।',
    filterAll: 'সকল',
    filterInProgress: 'চলমান',
    filterUpdated: 'হালনাগাদকৃত',
    filterDisapproved: 'অননুমোদিত',
    stageLabels: {
      submitted: 'অনুরোধ জমা হয়েছে',
      'doc-verification': 'নথি / নিরীক্ষা যাচাই',
      'lien-noc': 'লিয়েন ব্যাংক এনওসি যাচাই',
      approval: 'কমিশনার অনুমোদন',
      updated: 'মালিকানা হালনাগাদ',
      disapproved: 'অননুমোদিত',
    },
    review: 'পর্যালোচনা',
    reviewTitle: 'মালিকানা পরিবর্তন অনুরোধ পর্যালোচনা',
    close: 'বন্ধ করুন',
    startVerification: 'নথি যাচাই শুরু করুন',
    auditCheckTitle: 'লাইসেন্স ডিবি কোয়েরি — নিরীক্ষা অবস্থা যাচাই',
    auditCheckResult: 'কোনো অনিয়ম পাওয়া যায়নি। নিরীক্ষা অবস্থা: সম্মত।',
    runAuditCheck: 'নিরীক্ষা অবস্থা যাচাই চালান',
    proceedToLienNoc: 'লিয়েন ব্যাংক এনওসি যাচাইয়ে এগিয়ে যান',
    lienNocTitle: 'লিয়েন ব্যাংক এনওসি যাচাইকরণ',
    lienNocVerified: 'এনওসি যাচাইকৃত',
    markLienNocVerified: 'লিয়েন ব্যাংক এনওসি যাচাইকৃত চিহ্নিত করুন',
    proceedToApproval: 'অনুমোদনে এগিয়ে যান',
    officerNote: 'e-নোট ও নথি',
    notePlaceholder: 'পরীক্ষার মন্তব্য লিখুন…',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalReasonRequired: 'অননুমোদনের জন্য একটি কারণ আবশ্যক।',
    updatedNotice: 'বন্ডকারী প্রোফাইল নতুন মালিকের নামে হালনাগাদ হয়েছে। বন্ড লাইসেন্স নম্বর অপরিবর্তিত রয়েছে।',
    disapprovedNotice: 'আবেদনকারীর কাছে অননুমোদন বিজ্ঞপ্তি পাঠানো হয়েছে।',
    newOwner: 'নতুন মালিক',
    trackRequest: 'এই অনুরোধটি ট্র্যাক করুন',
  },
};

const steps = [
  { id: 'select', en: 'Select License', bn: 'লাইসেন্স নির্বাচন', icon: 'manage_search' },
  { id: 'new-owner', en: 'New Owner Details', bn: 'নতুন মালিকের তথ্য', icon: 'person_add' },
  { id: 'documents', en: 'Supporting Documents', bn: 'সহায়ক নথি', icon: 'upload_file' },
  { id: 'review', en: 'Review & Submit', bn: 'পর্যালোচনা ও জমা', icon: 'fact_check' },
];

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

function TextInput({ value, onChange, placeholder, error, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; error?: boolean; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputClass} ${error ? errorInputClass : ''}`} />
  );
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
  language,
}: {
  icon: string;
  label: string;
  required: boolean;
  status: UploadStatus;
  onUpload: () => void;
  onRemove: () => void;
  language: Language;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', status.uploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
          <Icon name={status.uploaded ? 'task_alt' : icon} className="text-[20px]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1E293B]">
            {label}
            {required && <span className="ml-1 text-[#DC2626]">*</span>}
          </p>
          {status.uploaded ? (
            <p className="truncate text-xs text-[#64748B]">
              {status.fileName} · {status.size}
            </p>
          ) : (
            <p className="text-xs text-[#94A3B8]">{language === 'en' ? 'PDF, JPG or PNG · max 2 MB' : 'PDF, JPG বা PNG · সর্বোচ্চ ২ এমবি'}</p>
          )}
        </div>
      </div>
      {status.uploaded ? (
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে'}</span>
          <button type="button" onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F5F7FA] hover:text-[#DC2626]">
            <Icon name="delete" className="text-[18px]" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={onUpload} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] transition-colors hover:bg-[#EAF3FE]">
          <Icon name="upload" className="text-[16px]" />
          {language === 'en' ? 'Upload' : 'আপলোড করুন'}
        </button>
      )}
    </div>
  );
}

function StepperNav({ language, currentStep, furthestStep, onJump }: { language: Language; currentStep: number; furthestStep: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex flex-col gap-1">
      {steps.map((s, i) => {
        const state = i < currentStep ? 'done' : i === currentStep ? 'current' : 'upcoming';
        const clickable = i <= furthestStep;
        return (
          <li key={s.id}>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onJump(i)}
              className={['flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors', state === 'current' ? 'bg-[#EAF3FE]' : 'hover:bg-[#F5F7FA]', !clickable ? 'cursor-not-allowed opacity-60' : ''].join(' ')}
            >
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors',
                  state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]',
                ].join(' ')}
              >
                {state === 'done' ? <Icon name="check" className="text-[18px]" /> : i + 1}
              </span>
              <span className={['block truncate text-[13px] font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{s[language]}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

const documentDefs = [
  { id: 'transferDeed', icon: 'description', en: 'Transfer Deed / Ownership Agreement', bn: 'হস্তান্তর দলিল / মালিকানা চুক্তি', required: true },
  { id: 'lienNoc', icon: 'account_balance', en: "No Objection Certificate from Lien Bank", bn: 'লিয়েন ব্যাংকের অনাপত্তি সনদ', required: true },
  { id: 'newOwnerNid', icon: 'contact_page', en: 'NID of New Owner', bn: 'নতুন মালিকের এনআইডি', required: true },
  { id: 'boardResolution', icon: 'gavel', en: 'Board Resolution / Partnership Deed Amendment', bn: 'বোর্ড রেজোলিউশন / অংশীদারি দলিল সংশোধন', required: true },
];

const stageOrder: ReqStage[] = ['submitted', 'doc-verification', 'lien-noc', 'approval', 'updated'];

interface OwnershipRequest {
  id: string;
  licenseNo: string;
  currentOwnerEn: string;
  currentOwnerBn: string;
  newOwnerName: string;
  submittedDate: string;
  stage: ReqStage;
  auditChecked?: boolean;
  lienNocVerified?: boolean;
  approvalNote?: string;
  disapprovalReason?: string;
}

const seedRequests: OwnershipRequest[] = [
  {
    id: 'OWN-2026-7031', licenseNo: 'BL-2022-01876', currentOwnerEn: 'Jamuna Denims Ltd.', currentOwnerBn: 'যমুনা ডেনিমস লিমিটেড',
    newOwnerName: 'Md. Aminul Haque', submittedDate: '19 Jul 2026', stage: 'doc-verification', auditChecked: false, lienNocVerified: false,
  },
  {
    id: 'OWN-2026-7018', licenseNo: 'BL-2020-00743', currentOwnerEn: 'Meghna Knit Composite Ltd.', currentOwnerBn: 'মেঘনা নিট কম্পোজিট লিমিটেড',
    newOwnerName: 'Farhana Chowdhury', submittedDate: '14 Jul 2026', stage: 'lien-noc', auditChecked: true, lienNocVerified: false,
  },
  {
    id: 'OWN-2026-7005', licenseNo: 'BL-2019-00456', currentOwnerEn: 'Ananta Denim Technology Ltd.', currentOwnerBn: 'অনন্ত ডেনিম টেকনোলজি লিমিটেড',
    newOwnerName: 'Shahriar Kabir', submittedDate: '28 Jun 2026', stage: 'updated', auditChecked: true, lienNocVerified: true,
    approvalNote: 'All checks passed. Ownership transfer approved.',
  },
];

export function LicenseOwnershipChange({ language, onDone }: LicenseOwnershipChangeProps) {
  const t = T[language];
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [licenseNoInput, setLicenseNoInput] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<BondLicense | null>(null);
  const [verifyError, setVerifyError] = useState(false);
  const [form, setForm] = useState({
    newOwnerName: '',
    newOwnerNid: '',
    newOwnerDesignation: '',
    newOwnerMobile: '',
    newOwnerEmail: '',
    effectiveDate: '',
    reason: '',
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [docs, setDocs] = useState<Record<string, UploadStatus>>(Object.fromEntries(documentDefs.map((d) => [d.id, { uploaded: false }])));
  const [submitted, setSubmitted] = useState(false);
  const [reqId] = useState(() => `OWN-2026-${Math.floor(7000 + Math.random() * 999)}`);

  const [requests, setRequests] = useState<OwnershipRequest[]>(seedRequests);
  const [view, setView] = useState<'form' | 'queue'>('form');
  const [queueFilter, setQueueFilter] = useState<'all' | 'in-progress' | 'updated' | 'disapproved'>('all');
  const [selected, setSelected] = useState<OwnershipRequest | null>(null);

  const set = (key: keyof typeof form, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const verifyLicense = () => {
    const found = bondLicenses.find((l) => l.licenseNo.toLowerCase() === licenseNoInput.trim().toLowerCase());
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
    1: ['newOwnerName', 'newOwnerNid', 'newOwnerMobile', 'effectiveDate', 'reason'],
    2: [],
    3: [],
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
    fields.forEach((f) => {
      if (!form[f]) nextErrors[f as string] = true;
    });
    if (step === 2) {
      documentDefs.forEach((d) => {
        if (d.required && !docs[d.id]?.uploaded) nextErrors[d.id] = true;
      });
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    const next = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(next);
    setFurthestStep((f) => Math.max(f, next));
  };
  const goBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    if (!form.agree) {
      setErrors({ agree: true });
      return;
    }
    const newReq: OwnershipRequest = {
      id: reqId,
      licenseNo: verifiedLicense!.licenseNo,
      currentOwnerEn: verifiedLicense!.nameEn,
      currentOwnerBn: verifiedLicense!.nameBn,
      newOwnerName: form.newOwnerName,
      submittedDate: '23 Jul 2026',
      stage: 'submitted',
    };
    setRequests((prev) => [newReq, ...prev]);
    setSubmitted(true);
  };

  const updateReq = (id: string, patch: Partial<OwnershipRequest>) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const pendingCount = requests.filter((r) => r.stage !== 'updated' && r.stage !== 'disapproved').length;
  const filteredRequests = requests.filter((r) => {
    if (queueFilter === 'all') return true;
    if (queueFilter === 'updated') return r.stage === 'updated';
    if (queueFilter === 'disapproved') return r.stage === 'disapproved';
    return r.stage !== 'updated' && r.stage !== 'disapproved';
  });

  if (selected) {
    const r = selected;
    const stageIndex = stageOrder.indexOf(r.stage);
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
        <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
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

          <div className="flex flex-col gap-3 px-5 py-5">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#E2E8F0] p-4 text-[13px]">
              <div className="col-span-2">
                <p className="text-[11px] text-[#94A3B8]">{t.currentOwner}</p>
                <p className="font-medium text-[#1E293B]">{r[language === 'en' ? 'currentOwnerEn' : 'currentOwnerBn']}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t.newOwner}</p>
                <p className="font-medium text-[#1E293B]">{r.newOwnerName}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? 'License No.' : 'লাইসেন্স নং'}</p>
                <p className="font-medium text-[#1E293B]">{r.licenseNo}</p>
              </div>
            </div>

            {r.stage === 'disapproved' ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
                  <Icon name="cancel" className="text-[18px]" />
                  {t.stageLabels.disapproved}
                </p>
                <p className="mt-1 text-xs text-[#B91C1C]">{r.disapprovalReason}</p>
                <p className="mt-2 text-xs text-[#DC2626]">{t.disapprovedNotice}</p>
              </div>
            ) : (
              stageOrder.map((stage, i) => {
                const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'upcoming';
                return (
                  <div key={stage} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={[
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]',
                        ].join(' ')}
                      >
                        <Icon name={state === 'done' ? 'check' : 'circle'} className="text-[15px]" />
                      </span>
                      {i < stageOrder.length - 1 && <span className={`w-0.5 flex-1 ${state === 'done' ? 'bg-[#00A86B]' : 'bg-[#E2E8F0]'}`} style={{ minHeight: '16px' }} />}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className={['text-sm font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{t.stageLabels[stage]}</p>

                      {state === 'current' && stage === 'submitted' && (
                        <button
                          type="button"
                          onClick={() => updateReq(r.id, { stage: 'doc-verification' })}
                          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]"
                        >
                          {t.startVerification}
                        </button>
                      )}

                      {state === 'done' && stage === 'doc-verification' && <p className="mt-0.5 text-xs text-[#64748B]">{t.auditCheckResult}</p>}
                      {state === 'current' && stage === 'doc-verification' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                            <span className="text-xs font-semibold text-[#334155]">{t.auditCheckTitle}</span>
                            {r.auditChecked ? (
                              <span className="text-[11px] font-semibold text-emerald-700">{t.auditCheckResult}</span>
                            ) : (
                              <button type="button" onClick={() => updateReq(r.id, { auditChecked: true })} className="rounded-full border border-[#0A4D8C] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                                {t.runAuditCheck}
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            disabled={!r.auditChecked}
                            onClick={() => updateReq(r.id, { stage: 'lien-noc' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                          >
                            {t.proceedToLienNoc}
                          </button>
                        </div>
                      )}

                      {state === 'done' && stage === 'lien-noc' && <p className="mt-0.5 text-xs text-[#64748B]">{t.lienNocVerified}</p>}
                      {state === 'current' && stage === 'lien-noc' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                            <span className="text-xs font-semibold text-[#334155]">{t.lienNocTitle}</span>
                            {r.lienNocVerified ? (
                              <span className="text-[11px] font-semibold text-emerald-700">{t.lienNocVerified}</span>
                            ) : (
                              <button type="button" onClick={() => updateReq(r.id, { lienNocVerified: true })} className="rounded-full border border-[#0A4D8C] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                                {t.markLienNocVerified}
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            disabled={!r.lienNocVerified}
                            onClick={() => updateReq(r.id, { stage: 'approval' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                          >
                            {t.proceedToApproval}
                          </button>
                        </div>
                      )}

                      {state === 'done' && stage === 'approval' && <p className="mt-0.5 text-xs text-[#64748B]">{r.approvalNote}</p>}
                      {state === 'current' && stage === 'approval' && (
                        <OwnershipApprovalPanel
                          t={t}
                          note={r.approvalNote ?? ''}
                          onNoteChange={(v) => updateReq(r.id, { approvalNote: v })}
                          onApprove={() => updateReq(r.id, { stage: 'updated' })}
                          onDisapprove={(reason) => updateReq(r.id, { stage: 'disapproved', disapprovalReason: reason })}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {r.stage === 'updated' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                  <Icon name="workspace_premium" className="text-[18px]" />
                  {t.stageLabels.updated}
                </p>
                <p className="mt-1 text-xs text-emerald-800">{t.updatedNotice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'queue') {
    return (
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
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
          {(['all', 'in-progress', 'updated', 'disapproved'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setQueueFilter(f)}
              className={[
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                queueFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
              ].join(' ')}
            >
              {f === 'all' ? t.filterAll : f === 'in-progress' ? t.filterInProgress : f === 'updated' ? t.filterUpdated : t.filterDisapproved}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredRequests.map((r) => (
            <button key={r.id} type="button" onClick={() => setSelected(r)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name="sync_alt" className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{r.id}</span>
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      r.stage === 'updated' ? 'bg-emerald-50 text-emerald-700' : r.stage === 'disapproved' ? 'bg-red-50 text-[#DC2626]' : 'bg-blue-50 text-[#0A4D8C]',
                    ].join(' ')}
                  >
                    {t.stageLabels[r.stage]}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                  {r.licenseNo} · {r[language === 'en' ? 'currentOwnerEn' : 'currentOwnerBn']} → {r.newOwnerName}
                </p>
                <p className="text-[11px] text-[#94A3B8]">{r.submittedDate}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white">{t.review}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (submitted) {
    const req = requests.find((r) => r.id === reqId)!;
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check_circle" className="text-[36px]" />
          </span>
          <h1 className="text-xl font-bold text-[#1E293B]">{language === 'en' ? 'Ownership Change Request Submitted' : 'মালিকানা পরিবর্তন অনুরোধ জমা হয়েছে'}</h1>
          <p className="max-w-md text-sm leading-relaxed text-[#64748B]">
            {language === 'en'
              ? `Your request for ${verifiedLicense?.licenseNo} has been received. The bond license number will remain unchanged after approval.`
              : `${verifiedLicense?.licenseNo}-এর জন্য আপনার অনুরোধ গৃহীত হয়েছে। অনুমোদনের পর বন্ড লাইসেন্স নম্বর অপরিবর্তিত থাকবে।`}
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
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.bondLicense}</span>
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
          <StepperNav language={language} currentStep={currentStep} furthestStep={furthestStep} onJump={setCurrentStep} />
        </aside>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
              <Icon name={steps[currentStep].icon} className="text-[20px]" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                {t.stepLabel} {currentStep + 1} {t.of} {steps.length}
              </p>
              <h2 className="text-base font-bold text-[#1E293B]">{steps[currentStep][language]}</h2>
            </div>
          </div>

          {currentStep === 0 && (
            <div className="flex flex-col gap-4">
              <Field label={t.licenseNoLabel} required error={verifyError ? t.notFound : undefined}>
                <div className="flex gap-2">
                  <TextInput
                    value={licenseNoInput}
                    onChange={(v) => {
                      setLicenseNoInput(v);
                      setVerifiedLicense(null);
                      setVerifyError(false);
                    }}
                    placeholder="BL-2024-03398"
                    error={verifyError}
                  />
                  <button type="button" onClick={verifyLicense} className="shrink-0 rounded-lg border border-[#0A4D8C] px-4 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                    {t.verify}
                  </button>
                </div>
              </Field>

              {verifiedLicense && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Icon name="check_circle" className="text-[20px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1E293B]">
                      {verifiedLicense.licenseNo} · <span className="text-emerald-700">{t.verified}</span>
                    </p>
                    <p className="text-xs text-[#334155]">
                      {t.currentOwner}: {verifiedLicense[language === 'en' ? 'nameEn' : 'nameBn']} · {t.status}: {verifiedLicense.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={language === 'en' ? 'New Owner Name' : 'নতুন মালিকের নাম'} required error={errors.newOwnerName ? t.required : undefined}>
                <TextInput value={form.newOwnerName} onChange={(v) => set('newOwnerName', v)} placeholder="Md. Rafiqul Islam" error={errors.newOwnerName} />
              </Field>
              <Field label={language === 'en' ? 'New Owner NID Number' : 'নতুন মালিকের এনআইডি নম্বর'} required error={errors.newOwnerNid ? t.required : undefined}>
                <TextInput value={form.newOwnerNid} onChange={(v) => set('newOwnerNid', v)} placeholder="1985XXXXXXXXXX" error={errors.newOwnerNid} />
              </Field>
              <Field label={language === 'en' ? 'Designation' : 'পদবি'}>
                <TextInput value={form.newOwnerDesignation} onChange={(v) => set('newOwnerDesignation', v)} placeholder="Managing Director" />
              </Field>
              <Field label={language === 'en' ? 'Mobile Number' : 'মোবাইল নম্বর'} required error={errors.newOwnerMobile ? t.required : undefined}>
                <TextInput value={form.newOwnerMobile} onChange={(v) => set('newOwnerMobile', v)} placeholder="+880 1XXXXXXXXX" error={errors.newOwnerMobile} />
              </Field>
              <Field label={language === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা'}>
                <TextInput value={form.newOwnerEmail} onChange={(v) => set('newOwnerEmail', v)} placeholder="rafiqul@example.com" type="email" />
              </Field>
              <Field label={language === 'en' ? 'Effective Date of Transfer' : 'হস্তান্তরের কার্যকরী তারিখ'} required error={errors.effectiveDate ? t.required : undefined}>
                <TextInput value={form.effectiveDate} onChange={(v) => set('effectiveDate', v)} placeholder="01 Sep 2026" error={errors.effectiveDate} />
              </Field>
              <div className="sm:col-span-2">
                <Field label={language === 'en' ? 'Reason for Ownership Change' : 'মালিকানা পরিবর্তনের কারণ'} required error={errors.reason ? t.required : undefined}>
                  <textarea
                    rows={3}
                    value={form.reason}
                    onChange={(e) => set('reason', e.target.value)}
                    className={`${inputClass} resize-none ${errors.reason ? errorInputClass : ''}`}
                  />
                </Field>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#64748B]">
                {language === 'en'
                  ? 'Upload clear scanned copies of the following documents. Accepted formats: PDF, JPG, PNG (max 2 MB each).'
                  : 'নিচের নথিগুলোর স্পষ্ট স্ক্যান কপি আপলোড করুন। গ্রহণযোগ্য ফরম্যাট: PDF, JPG, PNG (সর্বোচ্চ ২ এমবি করে)।'}
              </p>
              {documentDefs.map((d) => (
                <UploadRow
                  key={d.id}
                  icon={d.icon}
                  label={d[language]}
                  required={d.required}
                  status={docs[d.id]}
                  language={language}
                  onUpload={() =>
                    setDocs((prev) => ({ ...prev, [d.id]: { uploaded: true, fileName: `${d.id}_scan.pdf`, size: `${(0.4 + Math.random() * 1.4).toFixed(1)} MB` } }))
                  }
                  onRemove={() => setDocs((prev) => ({ ...prev, [d.id]: { uploaded: false } }))}
                />
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="manage_search" className="text-[18px] text-[#0A4D8C]" />
                    <span className="text-sm font-semibold text-[#1E293B]">{steps[0][language]}</span>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(0)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                    {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  <div className="flex justify-between gap-3 text-[13px]">
                    <dt className="text-[#64748B]">{language === 'en' ? 'License No.' : 'লাইসেন্স নং'}</dt>
                    <dd className="font-medium text-[#1E293B]">{verifiedLicense?.licenseNo}</dd>
                  </div>
                  <div className="flex justify-between gap-3 text-[13px]">
                    <dt className="text-[#64748B]">{t.currentOwner}</dt>
                    <dd className="truncate font-medium text-[#1E293B]">{verifiedLicense?.[language === 'en' ? 'nameEn' : 'nameBn']}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="person_add" className="text-[18px] text-[#0A4D8C]" />
                    <span className="text-sm font-semibold text-[#1E293B]">{steps[1][language]}</span>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                    {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  {[
                    [language === 'en' ? 'New Owner' : 'নতুন মালিক', form.newOwnerName || '—'],
                    [language === 'en' ? 'Mobile' : 'মোবাইল', form.newOwnerMobile || '—'],
                    [language === 'en' ? 'Effective Date' : 'কার্যকরী তারিখ', form.effectiveDate || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 text-[13px]">
                      <dt className="text-[#64748B]">{k}</dt>
                      <dd className="truncate font-medium text-[#1E293B]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="upload_file" className="text-[18px] text-[#0A4D8C]" />
                    <span className="text-sm font-semibold text-[#1E293B]">{steps[2][language]}</span>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                    {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  {documentDefs.map((d) => (
                    <div key={d.id} className="flex justify-between gap-3 text-[13px]">
                      <dt className="text-[#64748B]">{d[language]}</dt>
                      <dd className="font-medium text-[#1E293B]">{docs[d.id]?.uploaded ? (language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে') : (language === 'en' ? 'Not uploaded' : 'আপলোড হয়নি')}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input id="agree" type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C] focus:ring-[#1E88E5]" />
                <label htmlFor="agree" className="text-sm text-[#334155]">
                  {language === 'en'
                    ? 'I declare that the information and documents provided above are true and accurate to the best of my knowledge.'
                    : 'আমি ঘোষণা করছি যে উপরে প্রদত্ত তথ্য ও নথিসমূহ আমার সর্বোত্তম জ্ঞানমতে সত্য ও সঠিক।'}
                </label>
              </div>
              {errors.agree && <span className="text-[11px] font-medium text-[#DC2626]">{t.required}</span>}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-5">
            <button
              type="button"
              onClick={currentStep === 0 ? onDone : goBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
            >
              <Icon name="arrow_back" className="text-[16px]" />
              {currentStep === 0 ? t.backToDashboard : t.back}
            </button>
            {currentStep === steps.length - 1 ? (
              <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#048f5c]">
                {t.submit}
                <Icon name="send" className="text-[16px]" />
              </button>
            ) : (
              <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]">
                {t.next}
                <Icon name="arrow_forward" className="text-[16px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnershipApprovalPanel({
  t,
  note,
  onNoteChange,
  onApprove,
  onDisapprove,
}: {
  t: (typeof T)['en'];
  note: string;
  onNoteChange: (v: string) => void;
  onApprove: () => void;
  onDisapprove: (reason: string) => void;
}) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      <Field label={t.officerNote}>
        <textarea rows={3} value={note} onChange={(e) => onNoteChange(e.target.value)} placeholder={t.notePlaceholder} className={`${inputClass} resize-none`} />
      </Field>
      {showReason && (
        <Field label={t.disapprovalReasonLabel} error={error}>
          <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputClass} resize-none`} />
        </Field>
      )}
      <div className="flex gap-2">
        {!showReason ? (
          <button type="button" onClick={() => setShowReason(true)} className="rounded-full border border-[#DC2626] px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50">
            {t.disapprove}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!reason.trim()) {
                setError(t.disapprovalReasonRequired);
                return;
              }
              onDisapprove(reason);
            }}
            className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]"
          >
            {t.disapprove}
          </button>
        )}
        <button type="button" onClick={onApprove} className="rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]">
          {t.approve}
        </button>
      </div>
    </div>
  );
}
