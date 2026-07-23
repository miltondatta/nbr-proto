import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';

type Language = 'en' | 'bn';
type ReqStatus = 'pending-verification' | 'pending-approval' | 'approved' | 'disapproved';

interface ExBondEntryProps {
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
    bondRegister: 'e-Bond Register',
    pageTitle: 'Ex-Bond Entry',
    subtitle: 'Supervised Bond Ex-Bond requisitions — verified and approved by an assigned RO/ARO before raw materials are released and posted to the e-Bond Register.',
    backToDashboard: 'Back to Dashboard',
    newRequisition: 'New Requisition',
    manageQueue: 'RO/ARO Review Mode',
    all: 'All',
    filterPendingVerification: 'Pending Verification',
    filterPendingApproval: 'Pending Approval',
    filterApproved: 'Approved',
    filterDisapproved: 'Disapproved',
    statusPendingVerification: 'Pending RO/ARO Verification',
    statusPendingApproval: 'Pending RO/ARO Approval',
    statusApproved: 'Approved & Posted',
    statusDisapproved: 'Disapproved',
    licenseNo: 'License No.',
    material: 'Material',
    qtyRequested: 'Qty. Requested',
    purpose: 'Purpose',
    submittedOn: 'Submitted',
    review: 'Review',
    viewDetails: 'View Details',
    noResultsTitle: 'No requisitions found',
    noResultsBody: 'Try a different filter, or submit a new requisition.',
    drawerTitle: 'New Ex-Bond Requisition',
    licenseNoLabel: 'Bond License Number',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    materialLabel: 'Material to Release',
    hsCode: 'HS Code',
    qtyLabel: 'Quantity Requested (kg)',
    purposeLabel: 'Purpose of Requisition',
    purposePlaceholder: 'e.g. Supervised release for subcontract production run',
    supportingNote: 'Supporting Note',
    cancel: 'Cancel',
    submit: 'Submit Requisition',
    required: 'Required',
    reviewTitle: 'Review Requisition',
    verificationStep: 'RO/ARO Verification',
    verified: 'Verified',
    pendingVerify: 'Pending Verification',
    markVerified: 'Mark Verified',
    approvalNote: 'e-Note & Nothi (Approval Comment)',
    notePlaceholder: 'Enter verification remarks and approval note…',
    approve: 'Approve & Post Entry',
    disapprove: 'Disapprove',
    approveBlocked: 'Verification is required before approval.',
    disapproveReasonRequired: 'A note is required to disapprove a requisition.',
    disapprovedResubmit: 'Bonder has been notified and requested to resubmit the requisition form.',
    postedOutcome: 'e-Ex Bond entry posted to e-Bond Register.',
    entryPosted: 'Ex-Bond Entry No.',
    close: 'Close',
  },
  bn: {
    home: 'হোম',
    bondRegister: 'ই-বন্ড রেজিস্টার',
    pageTitle: 'এক্স-বন্ড এন্ট্রি',
    subtitle: 'সুপারভাইজড বন্ড এক্স-বন্ড রিকুইজিশন — কাঁচামাল অবমুক্ত ও ই-বন্ড রেজিস্টারে পোস্ট করার আগে নির্ধারিত আরও/এআরও কর্তৃক যাচাই ও অনুমোদিত।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    newRequisition: 'নতুন রিকুইজিশন',
    manageQueue: 'আরও/এআরও পর্যালোচনা মোড',
    all: 'সকল',
    filterPendingVerification: 'যাচাই অপেক্ষমাণ',
    filterPendingApproval: 'অনুমোদন অপেক্ষমাণ',
    filterApproved: 'অনুমোদিত',
    filterDisapproved: 'অননুমোদিত',
    statusPendingVerification: 'আরও/এআরও যাচাই অপেক্ষমাণ',
    statusPendingApproval: 'আরও/এআরও অনুমোদন অপেক্ষমাণ',
    statusApproved: 'অনুমোদিত ও পোস্টকৃত',
    statusDisapproved: 'অননুমোদিত',
    licenseNo: 'লাইসেন্স নং',
    material: 'কাঁচামাল',
    qtyRequested: 'অনুরোধকৃত পরিমাণ',
    purpose: 'উদ্দেশ্য',
    submittedOn: 'জমার তারিখ',
    review: 'পর্যালোচনা',
    viewDetails: 'বিস্তারিত দেখুন',
    noResultsTitle: 'কোনো রিকুইজিশন পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন ফিল্টার ব্যবহার করুন, অথবা নতুন রিকুইজিশন জমা দিন।',
    drawerTitle: 'নতুন এক্স-বন্ড রিকুইজিশন',
    licenseNoLabel: 'বন্ড লাইসেন্স নম্বর',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বরে কোনো লাইসেন্স পাওয়া যায়নি।',
    materialLabel: 'অবমুক্তির জন্য কাঁচামাল',
    hsCode: 'এইচএস কোড',
    qtyLabel: 'অনুরোধকৃত পরিমাণ (কেজি)',
    purposeLabel: 'রিকুইজিশনের উদ্দেশ্য',
    purposePlaceholder: 'যেমন: সাব-কন্ট্রাক্ট উৎপাদনের জন্য সুপারভাইজড অবমুক্তি',
    supportingNote: 'সহায়ক নোট',
    cancel: 'বাতিল',
    submit: 'রিকুইজিশন জমা দিন',
    required: 'আবশ্যক',
    reviewTitle: 'রিকুইজিশন পর্যালোচনা',
    verificationStep: 'আরও/এআরও যাচাইকরণ',
    verified: 'যাচাইকৃত',
    pendingVerify: 'যাচাই অপেক্ষমাণ',
    markVerified: 'যাচাইকৃত চিহ্নিত করুন',
    approvalNote: 'e-নোট ও নথি (অনুমোদন মন্তব্য)',
    notePlaceholder: 'যাচাই মন্তব্য ও অনুমোদন নোট লিখুন…',
    approve: 'অনুমোদন ও এন্ট্রি পোস্ট করুন',
    disapprove: 'অননুমোদন করুন',
    approveBlocked: 'অনুমোদনের আগে যাচাই প্রয়োজন।',
    disapproveReasonRequired: 'অননুমোদনের জন্য একটি নোট আবশ্যক।',
    disapprovedResubmit: 'বন্ডকারীকে অবহিত করা হয়েছে এবং রিকুইজিশন ফরম পুনরায় জমা দিতে অনুরোধ জানানো হয়েছে।',
    postedOutcome: 'ই-এক্স বন্ড এন্ট্রি ই-বন্ড রেজিস্টারে পোস্ট হয়েছে।',
    entryPosted: 'এক্স-বন্ড এন্ট্রি নং',
    close: 'বন্ধ করুন',
  },
};

interface Requisition {
  id: string;
  licenseNo: string;
  bonderEn: string;
  bonderBn: string;
  materialEn: string;
  materialBn: string;
  hsCode: string;
  qty: string;
  purposeEn: string;
  purposeBn: string;
  submittedDate: string;
  verified: boolean;
  status: ReqStatus;
  note: string;
  postedRef?: string;
}

const seedRequisitions: Requisition[] = [
  {
    id: 'REQ-2026-00071', licenseNo: 'BL-2020-00512', bonderEn: 'Ha-Meem Group', bonderBn: 'হা-মীম গ্রুপ',
    materialEn: 'Cotton Yarn', materialBn: 'কটন ইয়ার্ন', hsCode: '5205.24.00', qty: '500 kg',
    purposeEn: 'Supervised release for subcontract production run', purposeBn: 'সাব-কন্ট্রাক্ট উৎপাদনের জন্য সুপারভাইজড অবমুক্তি',
    submittedDate: '21 Jul 2026', verified: false, status: 'pending-verification', note: '',
  },
  {
    id: 'REQ-2026-00068', licenseNo: 'BL-2023-02998', bonderEn: 'Fakir Fashion Ltd.', bonderBn: 'ফকির ফ্যাশন লিমিটেড',
    materialEn: 'Polyester Twill', materialBn: 'পলিয়েস্টার টুইল', hsCode: '5407.61.00', qty: '300 kg',
    purposeEn: 'Sample yardage release for buyer approval', purposeBn: 'ক্রেতার অনুমোদনের জন্য নমুনা কাপড় অবমুক্তি',
    submittedDate: '18 Jul 2026', verified: true, status: 'pending-approval', note: '',
  },
  {
    id: 'REQ-2026-00055', licenseNo: 'BL-2021-01204', bonderEn: 'Pacific Jeans Ltd.', bonderBn: 'প্যাসিফিক জিন্স লিমিটেড',
    materialEn: 'Denim Fabric', materialBn: 'ডেনিম ফেব্রিক', hsCode: '5209.42.00', qty: '800 kg',
    purposeEn: 'Supervised release for subcontract washing unit', purposeBn: 'সাব-কন্ট্রাক্ট ওয়াশিং ইউনিটের জন্য সুপারভাইজড অবমুক্তি',
    submittedDate: '10 Jul 2026', verified: true, status: 'approved', note: 'Verified and compliant. Approved.', postedRef: 'SEB-2026-00045',
  },
  {
    id: 'REQ-2026-00050', licenseNo: 'BL-2019-00287', bonderEn: 'Epic Designers Ltd.', bonderBn: 'এপিক ডিজাইনার্স লিমিটেড',
    materialEn: 'Cotton Jersey', materialBn: 'কটন জার্সি', hsCode: '6006.21.00', qty: '1,200 kg',
    purposeEn: 'Supervised release for external cutting unit', purposeBn: 'বহিরাগত কাটিং ইউনিটের জন্য সুপারভাইজড অবমুক্তি',
    submittedDate: '02 Jul 2026', verified: true, status: 'disapproved',
    note: 'Requested quantity exceeds available e-Passbook balance.',
  },
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

const statusColor: Record<ReqStatus, string> = {
  'pending-verification': '#B45309',
  'pending-approval': '#1E88E5',
  approved: '#00A86B',
  disapproved: '#DC2626',
};

const emptyDraft = { licenseNo: '', material: '', hsCode: '', qty: '', purpose: '', note: '' };

export function ExBondEntry({ language, onDone }: ExBondEntryProps) {
  const t = T[language];
  const [requisitions, setRequisitions] = useState<Requisition[]>(seedRequisitions);
  const [statusFilter, setStatusFilter] = useState<ReqStatus | 'all'>('all');
  const [reviewMode, setReviewMode] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [draftLicenseVerified, setDraftLicenseVerified] = useState<{ licenseNo: string; bonderEn: string; bonderBn: string } | null>(null);
  const [draftLicenseError, setDraftLicenseError] = useState(false);
  const [selected, setSelected] = useState<Requisition | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewError, setReviewError] = useState('');

  const filtered = useMemo(() => requisitions.filter((r) => statusFilter === 'all' || r.status === statusFilter), [requisitions, statusFilter]);
  const countFor = (status: ReqStatus | 'all') => requisitions.filter((r) => status === 'all' || r.status === status).length;

  const openCompose = () => {
    setDraft(emptyDraft);
    setDraftLicenseVerified(null);
    setDraftLicenseError(false);
    setComposeOpen(true);
  };

  const verifyDraftLicense = () => {
    const found = bondLicenses.find((l) => l.licenseNo.toLowerCase() === draft.licenseNo.trim().toLowerCase());
    if (found) {
      setDraftLicenseVerified({ licenseNo: found.licenseNo, bonderEn: found.nameEn, bonderBn: found.nameBn });
      setDraftLicenseError(false);
    } else {
      setDraftLicenseVerified(null);
      setDraftLicenseError(true);
    }
  };

  const submitRequisition = () => {
    if (!draftLicenseVerified || !draft.material || !draft.qty || !draft.purpose) return;
    const newReq: Requisition = {
      id: `REQ-2026-${Math.floor(70 + Math.random() * 900)}`,
      licenseNo: draftLicenseVerified.licenseNo,
      bonderEn: draftLicenseVerified.bonderEn,
      bonderBn: draftLicenseVerified.bonderBn,
      materialEn: draft.material,
      materialBn: draft.material,
      hsCode: draft.hsCode,
      qty: `${draft.qty} kg`,
      purposeEn: draft.purpose,
      purposeBn: draft.purpose,
      submittedDate: '23 Jul 2026',
      verified: false,
      status: 'pending-verification',
      note: '',
    };
    setRequisitions((prev) => [newReq, ...prev]);
    setComposeOpen(false);
  };

  const markVerified = (id: string) => {
    setRequisitions((prev) => prev.map((r) => (r.id === id ? { ...r, verified: true, status: 'pending-approval' } : r)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, verified: true, status: 'pending-approval' } : prev));
  };

  const approveRequisition = () => {
    if (!selected) return;
    if (!selected.verified) {
      setReviewError(t.approveBlocked);
      return;
    }
    const postedRef = `SEB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const updated: Requisition = { ...selected, status: 'approved', note: reviewNote, postedRef };
    setRequisitions((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelected(null);
    setReviewNote('');
    setReviewError('');
  };

  const disapproveRequisition = () => {
    if (!selected) return;
    if (!reviewNote.trim()) {
      setReviewError(t.disapproveReasonRequired);
      return;
    }
    const updated: Requisition = { ...selected, status: 'disapproved', note: reviewNote };
    setRequisitions((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelected(null);
    setReviewNote('');
    setReviewError('');
  };

  const statusLabel: Record<ReqStatus, string> = {
    'pending-verification': t.statusPendingVerification,
    'pending-approval': t.statusPendingApproval,
    approved: t.statusApproved,
    disapproved: t.statusDisapproved,
  };

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.bondRegister}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button type="button" onClick={onDone} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending-verification', 'pending-approval', 'approved', 'disapproved'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={[
                  'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  statusFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
                ].join(' ')}
              >
                {f === 'all' ? t.all : f === 'pending-verification' ? t.filterPendingVerification : f === 'pending-approval' ? t.filterPendingApproval : f === 'approved' ? t.filterApproved : t.filterDisapproved} ({countFor(f)})
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-semibold text-[#334155]">
              {t.manageQueue}
              <button
                type="button"
                role="switch"
                aria-checked={reviewMode}
                onClick={() => setReviewMode((v) => !v)}
                className={[
                  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5] focus-visible:ring-offset-2',
                  reviewMode ? 'bg-[#0A4D8C]' : 'bg-[#CBD5E1]',
                ].join(' ')}
              >
                <span className={['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out', reviewMode ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
              </button>
            </label>
            <button type="button" onClick={openCompose} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#048f5c]">
              <Icon name="add" className="text-[16px]" />
              {t.newRequisition}
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
          <Icon name="inbox" className="text-[36px] text-[#94A3B8]" />
          <h2 className="text-sm font-bold text-[#1E293B]">{t.noResultsTitle}</h2>
          <p className="text-xs text-[#64748B]">{t.noResultsBody}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name="local_shipping" className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{r.id}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${statusColor[r.status]}1A`, color: statusColor[r.status] }}>
                    {statusLabel[r.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">{r[language === 'en' ? 'bonderEn' : 'bonderBn']} · {r.licenseNo}</p>
                <p className="text-[11px] text-[#94A3B8]">
                  {r[language === 'en' ? 'materialEn' : 'materialBn']} · {r.qty} · {t.submittedOn}: {r.submittedDate}
                  {r.postedRef && ` · ${t.entryPosted}: ${r.postedRef}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  <Icon name={r.verified ? 'verified' : 'hourglass_empty'} className="text-[13px]" />
                  {r.verified ? t.verified : t.pendingVerify}
                </span>
                {reviewMode && (r.status === 'pending-verification' || r.status === 'pending-approval') ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(r);
                      setReviewNote(r.note);
                      setReviewError('');
                    }}
                    className="rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#083E71]"
                  >
                    {t.review}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(r);
                      setReviewNote(r.note);
                      setReviewError('');
                    }}
                    className="rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]"
                  >
                    {t.viewDetails}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {composeOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setComposeOpen(false)}>
          <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.drawerTitle}</h2>
              <button type="button" onClick={() => setComposeOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-4 px-5 py-5">
              <Field label={t.licenseNoLabel} required error={draftLicenseError ? t.notFound : undefined}>
                <div className="flex gap-2">
                  <input
                    value={draft.licenseNo}
                    onChange={(e) => {
                      setDraft({ ...draft, licenseNo: e.target.value });
                      setDraftLicenseVerified(null);
                      setDraftLicenseError(false);
                    }}
                    placeholder="BL-2020-00512"
                    className={`${inputClass} ${draftLicenseError ? errorInputClass : ''}`}
                  />
                  <button type="button" onClick={verifyDraftLicense} className="shrink-0 rounded-lg border border-[#0A4D8C] px-4 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                    {t.verify}
                  </button>
                </div>
              </Field>
              {draftLicenseVerified && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-700">
                  <Icon name="check_circle" className="text-[16px]" />
                  {draftLicenseVerified[language === 'en' ? 'bonderEn' : 'bonderBn']}
                </div>
              )}
              <Field label={t.materialLabel} required>
                <input value={draft.material} onChange={(e) => setDraft({ ...draft, material: e.target.value })} placeholder="Cotton Yarn" className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t.hsCode}>
                  <input value={draft.hsCode} onChange={(e) => setDraft({ ...draft, hsCode: e.target.value })} placeholder="5205.24.00" className={inputClass} />
                </Field>
                <Field label={t.qtyLabel} required>
                  <input value={draft.qty} onChange={(e) => setDraft({ ...draft, qty: e.target.value })} placeholder="500" className={inputClass} />
                </Field>
              </div>
              <Field label={t.purposeLabel} required>
                <textarea rows={3} value={draft.purpose} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })} placeholder={t.purposePlaceholder} className={`${inputClass} resize-none`} />
              </Field>
              <Field label={t.supportingNote}>
                <textarea rows={2} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} className={`${inputClass} resize-none`} />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setComposeOpen(false)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={submitRequisition}
                disabled={!draftLicenseVerified || !draft.material || !draft.qty || !draft.purpose}
                className="rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-40"
              >
                {t.submit}
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
          <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.reviewTitle}</h2>
              <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-5 px-5 py-5">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#E2E8F0] p-4 text-[13px]">
                <div className="col-span-2">
                  <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? 'Bonder' : 'বন্ডকারী'}</p>
                  <p className="font-medium text-[#1E293B]">{selected[language === 'en' ? 'bonderEn' : 'bonderBn']}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.licenseNo}</p>
                  <p className="font-medium text-[#1E293B]">{selected.licenseNo}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.material}</p>
                  <p className="font-medium text-[#1E293B]">
                    {selected[language === 'en' ? 'materialEn' : 'materialBn']} · {selected.hsCode}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.qtyRequested}</p>
                  <p className="font-medium text-[#1E293B]">{selected.qty}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-[#94A3B8]">{t.purpose}</p>
                  <p className="font-medium text-[#1E293B]">{selected[language === 'en' ? 'purposeEn' : 'purposeBn']}</p>
                </div>
              </div>

              {selected.status === 'approved' || selected.status === 'disapproved' ? (
                <div className={`rounded-lg px-3.5 py-2.5 text-xs ${selected.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-[#DC2626]'}`}>
                  <p className="font-semibold">{selected.note}</p>
                  <p className="mt-1">{selected.status === 'approved' ? `${t.postedOutcome} (${t.entryPosted}: ${selected.postedRef})` : t.disapprovedResubmit}</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1E293B]">{t.verificationStep}</p>
                      <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${selected.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        <Icon name={selected.verified ? 'verified' : 'hourglass_empty'} className="text-[13px]" />
                        {selected.verified ? t.verified : t.pendingVerify}
                      </span>
                    </div>
                    {!selected.verified && (
                      <button
                        type="button"
                        onClick={() => markVerified(selected.id)}
                        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]"
                      >
                        <Icon name="verified" className="text-[16px]" />
                        {t.markVerified}
                      </button>
                    )}
                  </div>
                  <Field label={t.approvalNote}>
                    <textarea rows={3} value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder={t.notePlaceholder} className={`${inputClass} resize-none`} />
                  </Field>
                  {reviewError && <p className="text-[11px] font-medium text-[#DC2626]">{reviewError}</p>}
                </>
              )}
            </div>
            {(selected.status === 'pending-verification' || selected.status === 'pending-approval') && (
              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
                <button type="button" onClick={disapproveRequisition} className="rounded-full border border-[#DC2626] px-4 py-2 text-sm font-semibold text-[#DC2626] hover:bg-red-50">
                  {t.disapprove}
                </button>
                <button type="button" onClick={approveRequisition} className="rounded-full bg-[#00A86B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#048f5c]">
                  {t.approve}
                </button>
              </div>
            )}
            {(selected.status === 'approved' || selected.status === 'disapproved') && (
              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
                <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                  {t.close}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
