import { useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { lienBanks, portalStatusLabels, type LienBank, type LienBankBranch, type PortalStatus } from './lienBankData';
type Language = 'en' | 'bn';
interface LienBankPortalProps {
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
    pageTitle: 'Lien Bank Portal & Profile Management',
    subtitle: 'CBC-side bank profile onboarding and the Lien Bank web portal where banks verify documents, provide recommendations, and view their linked bonder list.',
    backToDashboard: 'Back to Dashboard',
    modeCbc: 'CBC — Bank Profile Management',
    modePortal: 'Lien Bank — Portal Dashboard',
    totalBanks: 'Total Banks',
    authorized: 'Portal Authorized',
    pendingAuth: 'Pending Authorization',
    notOnboarded: 'Not Onboarded',
    createProfile: 'Create Main Branch Profile',
    createProfileTitle: 'New Lien Bank — Main Branch Profile Creation',
    bankNameLabel: 'Bank Name',
    branchNameLabel: 'Main Branch Name',
    branchCodeLabel: 'Branch Code',
    addressLabel: 'Branch Address',
    contactOfficerLabel: 'Contact Officer',
    contactPhoneLabel: 'Contact Phone',
    contactEmailLabel: 'Contact Email',
    required: 'Required',
    submitProfile: 'Submit for CBC Review',
    cancel: 'Cancel',
    bankListTitle: 'Registered Lien Banks',
    branchesCount: 'AD Branches',
    linkedBonders: 'Linked Bonders',
    view: 'View',
    close: 'Close',
    bankProfileTitle: 'Bank Profile',
    mainBranch: 'Main Branch',
    adBranchesTitle: 'AD (Authorized Dealer) Branches',
    addAdBranch: 'Add AD Branch',
    addAdBranchTitle: 'Add AD Branch Profile',
    add: 'Add',
    authorizeProfile: 'Authorize Main Branch Profile',
    authorizeConfirm: 'Review the Main Branch details above, then authorize to grant portal access.',
    authorizeNotice: 'Login credentials auto-generated and sent to the designated official via email/SMS.',
    forwardDoc: 'Forward Document for Verification',
    forwardDocTitle: 'Forward Attachments to Lien Bank for e-Verification',
    selectModule: 'Source Module',
    selectLicense: 'Bond License Number',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    documentsLabel: 'Documents to Forward',
    forwardSend: 'Forward & Notify Lien Bank',
    forwardSentNotice: 'Notification sent to Lien Bank — request posted on their Portal Dashboard.',
    bonderTable: {
      license: 'License No.',
      name: 'Bonder Name',
      district: 'District',
      status: 'Status'
    },
    activeBadge: 'Active',
    inactiveBadge: 'Inactive',
    selectBankLabel: 'Viewing Portal as',
    selectBankPlaceholder: 'Select a Lien Bank',
    onlyAuthorizedNote: 'Only banks with an authorized portal profile can log in.',
    pendingRequests: 'Pending Verification Requests',
    approvedRequests: 'Approved',
    disapprovedRequests: 'Disapproved',
    requestFrom: 'Forwarded from',
    requestDate: 'Forwarded on',
    reviewRequest: 'Review Request',
    requestDetailTitle: 'Verification Request',
    bonderProfileSnapshot: 'Bonder Profile Snapshot',
    bin: 'BIN',
    category: 'Category',
    documents: 'Documents Forwarded',
    docView: 'View',
    recommendationLabel: 'Recommendation / Verification Note',
    recommendationPlaceholder: 'Enter verification remarks or recommendation…',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalReasonRequired: 'An explanation is required to disapprove.',
    approvedNotice: 'Approval recorded. CBC officials and applicant auto-notified.',
    disapprovedNotice: 'Disapproval recorded with explanation. CBC officials and applicant auto-notified.',
    noRequests: 'No requests in this category.',
    newBadge: 'New',
    autoForward: 'Auto Application Forward',
    autoForwardOn: 'Enabled — pre-defined applications route to this bank automatically upon submission.',
    filterAll: 'All',
    filterPending: 'Pending',
    filterApproved: 'Approved',
    filterDisapproved: 'Disapproved'
  },
  bn: {
    home: 'হোম',
    lienBankManagement: 'লিয়েন ব্যাংক ব্যবস্থাপনা',
    pageTitle: 'লিয়েন ব্যাংক পোর্টাল ও প্রোফাইল ব্যবস্থাপনা',
    subtitle: 'সিবিসি-পক্ষের ব্যাংক প্রোফাইল অনবোর্ডিং এবং লিয়েন ব্যাংক ওয়েব পোর্টাল, যেখানে ব্যাংক নথি যাচাই করে, সুপারিশ প্রদান করে এবং তাদের সংযুক্ত বন্ডকারী তালিকা দেখে।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    modeCbc: 'সিবিসি — ব্যাংক প্রোফাইল ব্যবস্থাপনা',
    modePortal: 'লিয়েন ব্যাংক — পোর্টাল ড্যাশবোর্ড',
    totalBanks: 'মোট ব্যাংক',
    authorized: 'পোর্টাল অনুমোদিত',
    pendingAuth: 'অনুমোদনের অপেক্ষায়',
    notOnboarded: 'নিবন্ধিত নয়',
    createProfile: 'মূল শাখা প্রোফাইল তৈরি করুন',
    createProfileTitle: 'নতুন লিয়েন ব্যাংক — মূল শাখা প্রোফাইল তৈরি',
    bankNameLabel: 'ব্যাংকের নাম',
    branchNameLabel: 'মূল শাখার নাম',
    branchCodeLabel: 'শাখা কোড',
    addressLabel: 'শাখার ঠিকানা',
    contactOfficerLabel: 'যোগাযোগকারী কর্মকর্তা',
    contactPhoneLabel: 'যোগাযোগের ফোন',
    contactEmailLabel: 'যোগাযোগের ইমেইল',
    required: 'আবশ্যক',
    submitProfile: 'সিবিসি পর্যালোচনার জন্য জমা দিন',
    cancel: 'বাতিল',
    bankListTitle: 'নিবন্ধিত লিয়েন ব্যাংকসমূহ',
    branchesCount: 'এডি শাখা',
    linkedBonders: 'সংযুক্ত বন্ডকারী',
    view: 'দেখুন',
    close: 'বন্ধ করুন',
    bankProfileTitle: 'ব্যাংক প্রোফাইল',
    mainBranch: 'মূল শাখা',
    adBranchesTitle: 'এডি (অনুমোদিত ডিলার) শাখাসমূহ',
    addAdBranch: 'এডি শাখা যোগ করুন',
    addAdBranchTitle: 'এডি শাখা প্রোফাইল যোগ করুন',
    add: 'যোগ করুন',
    authorizeProfile: 'মূল শাখা প্রোফাইল অনুমোদন করুন',
    authorizeConfirm: 'উপরের মূল শাখার বিবরণ পর্যালোচনা করুন, তারপর পোর্টাল অ্যাক্সেস প্রদানের জন্য অনুমোদন করুন।',
    authorizeNotice: 'লগইন তথ্য স্বয়ংক্রিয়ভাবে তৈরি হয়ে মনোনীত কর্মকর্তাকে ইমেইল/এসএমএসের মাধ্যমে পাঠানো হয়েছে।',
    forwardDoc: 'যাচাইয়ের জন্য নথি প্রেরণ করুন',
    forwardDocTitle: 'ই-যাচাইয়ের জন্য লিয়েন ব্যাংকে সংযুক্তি প্রেরণ',
    selectModule: 'উৎস মডিউল',
    selectLicense: 'বন্ড লাইসেন্স নম্বর',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বরে কোনো লাইসেন্স পাওয়া যায়নি।',
    documentsLabel: 'প্রেরণযোগ্য নথিসমূহ',
    forwardSend: 'প্রেরণ করুন ও লিয়েন ব্যাংককে অবহিত করুন',
    forwardSentNotice: 'লিয়েন ব্যাংকে বিজ্ঞপ্তি পাঠানো হয়েছে — অনুরোধটি তাদের পোর্টাল ড্যাশবোর্ডে পোস্ট করা হয়েছে।',
    bonderTable: {
      license: 'লাইসেন্স নং',
      name: 'বন্ডকারীর নাম',
      district: 'জেলা',
      status: 'অবস্থা'
    },
    activeBadge: 'সক্রিয়',
    inactiveBadge: 'নিষ্ক্রিয়',
    selectBankLabel: 'যে ব্যাংক হিসেবে পোর্টাল দেখছেন',
    selectBankPlaceholder: 'একটি লিয়েন ব্যাংক নির্বাচন করুন',
    onlyAuthorizedNote: 'শুধুমাত্র অনুমোদিত পোর্টাল প্রোফাইলযুক্ত ব্যাংক লগইন করতে পারবে।',
    pendingRequests: 'অমীমাংসিত যাচাই অনুরোধ',
    approvedRequests: 'অনুমোদিত',
    disapprovedRequests: 'অননুমোদিত',
    requestFrom: 'প্রেরিত হয়েছে',
    requestDate: 'প্রেরণের তারিখ',
    reviewRequest: 'অনুরোধ পর্যালোচনা',
    requestDetailTitle: 'যাচাই অনুরোধ',
    bonderProfileSnapshot: 'বন্ডকারী প্রোফাইল সারসংক্ষেপ',
    bin: 'বিআইএন',
    category: 'ক্যাটাগরি',
    documents: 'প্রেরিত নথিসমূহ',
    docView: 'দেখুন',
    recommendationLabel: 'সুপারিশ / যাচাই মন্তব্য',
    recommendationPlaceholder: 'যাচাই মন্তব্য বা সুপারিশ লিখুন…',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalReasonRequired: 'অননুমোদনের জন্য একটি ব্যাখ্যা আবশ্যক।',
    approvedNotice: 'অনুমোদন রেকর্ড করা হয়েছে। সিবিসি কর্মকর্তা ও আবেদনকারীকে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    disapprovedNotice: 'ব্যাখ্যাসহ অননুমোদন রেকর্ড করা হয়েছে। সিবিসি কর্মকর্তা ও আবেদনকারীকে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    noRequests: 'এই ক্যাটাগরিতে কোনো অনুরোধ নেই।',
    newBadge: 'নতুন',
    autoForward: 'স্বয়ংক্রিয় আবেদন প্রেরণ',
    autoForwardOn: 'সক্রিয় — পূর্বনির্ধারিত আবেদনসমূহ জমাদানের সাথে সাথে স্বয়ংক্রিয়ভাবে এই ব্যাংকে প্রেরিত হয়।',
    filterAll: 'সকল',
    filterPending: 'অমীমাংসিত',
    filterApproved: 'অনুমোদিত',
    filterDisapproved: 'অননুমোদিত'
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
function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: number;
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
function StatusBadge({
  status,
  language
}: {
  status: PortalStatus;
  language: Language;
}) {
  const s = portalStatusLabels[status];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${s.color}1A`,
    color: s.color
  }}>
      {s[language]}
    </span>;
}
const normalizeLicenseNo = (s: string) => s.trim().toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, '');
const sourceModules = [{
  en: 'License Ownership Change',
  bn: 'লাইসেন্স মালিকানা পরিবর্তন'
}, {
  en: 'Company Name Change',
  bn: 'কোম্পানির নাম পরিবর্তন'
}, {
  en: 'Lien Bank Change',
  bn: 'লিয়েন ব্যাংক পরিবর্তন'
}, {
  en: 'HS Code Addition',
  bn: 'এইচএস কোড সংযোজন'
}, {
  en: 'New Bond License',
  bn: 'নতুন বন্ড লাইসেন্স'
}];
const forwardDocumentDefs = [{
  id: 'transferDeed',
  en: 'Transfer Deed / Application Form',
  bn: 'হস্তান্তর দলিল / আবেদন ফরম'
}, {
  id: 'boardResolution',
  en: 'Board Resolution',
  bn: 'বোর্ড রেজোলিউশন'
}, {
  id: 'nid',
  en: 'NID / Trade License',
  bn: 'এনআইডি / ট্রেড লাইসেন্স'
}];
interface VerificationRequest {
  id: string;
  bankCode: string;
  sourceModuleIdx: number;
  licenseNo: string;
  licenseeName: string;
  documents: string[];
  forwardedDate: string;
  status: 'pending' | 'approved' | 'disapproved';
  recommendation?: string;
  disapprovalReason?: string;
  isNew?: boolean;
}
const seedRequests: VerificationRequest[] = [{
  id: 'LBV-2026-9101',
  bankCode: 'SBL',
  sourceModuleIdx: 0,
  licenseNo: 'BL-2026-04521',
  licenseeName: 'Square Fashions Ltd.',
  documents: ['transferDeed', 'nid'],
  forwardedDate: '21 Jul 2026',
  status: 'pending',
  isNew: true
}, {
  id: 'LBV-2026-9088',
  bankCode: 'EBL',
  sourceModuleIdx: 2,
  licenseNo: 'BL-2023-02871',
  licenseeName: 'Beximco Textiles Limited',
  documents: ['transferDeed', 'boardResolution', 'nid'],
  forwardedDate: '19 Jul 2026',
  status: 'pending'
}, {
  id: 'LBV-2026-9054',
  bankCode: 'DBBL',
  sourceModuleIdx: 3,
  licenseNo: 'BL-2022-01655',
  licenseeName: 'Envoy Textiles Ltd.',
  documents: ['nid'],
  forwardedDate: '12 Jul 2026',
  status: 'approved',
  recommendation: 'Bonder profile and attachments verified against branch records. No irregularities found.'
}, {
  id: 'LBV-2026-9021',
  bankCode: 'SBL',
  sourceModuleIdx: 1,
  licenseNo: 'BL-2021-01204',
  licenseeName: 'Pacific Jeans Ltd.',
  documents: ['boardResolution', 'nid'],
  forwardedDate: '05 Jul 2026',
  status: 'disapproved',
  disapprovalReason: 'Board resolution submitted does not match the signatory on file with this branch.'
}];
export function LienBankPortal({
  language,
  onDone
}: LienBankPortalProps) {
  const t = T[language];
  const [mode, setMode] = useState<'cbc' | 'portal'>('cbc');
  const [banks, setBanks] = useState<LienBank[]>(lienBanks);
  const [requests, setRequests] = useState<VerificationRequest[]>(seedRequests);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // CBC mode state
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [showForwardDoc, setShowForwardDoc] = useState(false);
  const [createForm, setCreateForm] = useState({
    bankName: '',
    branchName: '',
    branchCode: '',
    address: '',
    contactOfficer: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [branchForm, setBranchForm] = useState({
    nameEn: '',
    branchCode: '',
    address: '',
    contactOfficer: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [forwardForm, setForwardForm] = useState({
    moduleIdx: 0,
    licenseNo: '',
    docs: Object.fromEntries(forwardDocumentDefs.map(d => [d.id, false])) as Record<string, boolean>
  });
  const [licenseFound, setLicenseFound] = useState<typeof bondLicenses[number] | null>(null);
  const [licenseError, setLicenseError] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, boolean>>({});

  // Portal mode state
  const [portalBankCode, setPortalBankCode] = useState<string>(banks.find(b => b.portalStatus === 'authorized')?.bankCode ?? '');
  const [portalFilter, setPortalFilter] = useState<'all' | 'pending' | 'approved' | 'disapproved'>('all');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const selectedBank = banks.find(b => b.bankCode === selectedBankCode) ?? null;
  const portalBank = banks.find(b => b.bankCode === portalBankCode) ?? null;
  const authorizedBanks = banks.filter(b => b.portalStatus === 'authorized');
  const counts = {
    total: banks.length,
    authorized: banks.filter(b => b.portalStatus === 'authorized').length,
    pending: banks.filter(b => b.portalStatus === 'pending-authorization').length,
    none: banks.filter(b => b.portalStatus === 'not-onboarded').length
  };
  const bondersForBank = (bank: LienBank) => bondLicenses.filter(l => l.lienBank.startsWith(bank.nameEn));
  const requestsForBank = (bankCode: string) => requests.filter(r => r.bankCode === bankCode);
  const filteredPortalRequests = requestsForBank(portalBankCode).filter(r => portalFilter === 'all' ? true : r.status === portalFilter);
  const verifyLicense = () => {
    const found = bondLicenses.find(l => normalizeLicenseNo(l.licenseNo) === normalizeLicenseNo(forwardForm.licenseNo));
    if (found) {
      setLicenseFound(found);
      setLicenseError(false);
    } else {
      setLicenseFound(null);
      setLicenseError(true);
    }
  };
  const handleAuthorize = (bankCode: string) => {
    setBanks(prev => prev.map(b => b.bankCode === bankCode ? {
      ...b,
      portalStatus: 'authorized'
    } : b));
    flash(t.authorizeNotice);
  };
  const handleCreateProfile = () => {
    const required: (keyof typeof createForm)[] = ['bankName', 'branchName', 'branchCode', 'address', 'contactOfficer', 'contactPhone', 'contactEmail'];
    const errs: Record<string, boolean> = {};
    required.forEach(k => {
      if (!createForm[k]) errs[k] = true;
    });
    setCreateErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const code = createForm.bankName.slice(0, 3).toUpperCase();
    const newBank: LienBank = {
      bankCode: `${code}-${Math.floor(100 + Math.random() * 899)}`,
      nameEn: createForm.bankName,
      nameBn: createForm.bankName,
      portalStatus: 'pending-authorization',
      mainBranch: {
        id: 'NEW-MAIN',
        nameEn: createForm.branchName,
        nameBn: createForm.branchName,
        branchCode: createForm.branchCode,
        address: createForm.address,
        contactOfficer: createForm.contactOfficer,
        contactPhone: createForm.contactPhone,
        contactEmail: createForm.contactEmail
      },
      adBranches: []
    };
    setBanks(prev => [...prev, newBank]);
    setShowCreateProfile(false);
    setCreateForm({
      bankName: '',
      branchName: '',
      branchCode: '',
      address: '',
      contactOfficer: '',
      contactPhone: '',
      contactEmail: ''
    });
    flash(language === 'en' ? 'Main Branch profile submitted for CBC review.' : 'মূল শাখার প্রোফাইল সিবিসি পর্যালোচনার জন্য জমা দেওয়া হয়েছে।');
  };
  const handleAddBranch = () => {
    if (!selectedBank) return;
    const required: (keyof typeof branchForm)[] = ['nameEn', 'branchCode', 'address', 'contactOfficer', 'contactPhone', 'contactEmail'];
    if (required.some(k => !branchForm[k])) return;
    const newBranch: LienBankBranch = {
      id: `${selectedBank.bankCode}-AD${selectedBank.adBranches.length + 1}`,
      nameBn: branchForm.nameEn,
      ...branchForm
    };
    setBanks(prev => prev.map(b => b.bankCode === selectedBank.bankCode ? {
      ...b,
      adBranches: [...b.adBranches, newBranch]
    } : b));
    setShowAddBranch(false);
    setBranchForm({
      nameEn: '',
      branchCode: '',
      address: '',
      contactOfficer: '',
      contactPhone: '',
      contactEmail: ''
    });
  };
  const handleForwardDoc = () => {
    if (!selectedBank || !licenseFound) return;
    const docs = Object.entries(forwardForm.docs).filter(([, v]) => v).map(([k]) => k);
    const newReq: VerificationRequest = {
      id: `LBV-2026-${Math.floor(9200 + Math.random() * 700)}`,
      bankCode: selectedBank.bankCode,
      sourceModuleIdx: forwardForm.moduleIdx,
      licenseNo: licenseFound.licenseNo,
      licenseeName: licenseFound.nameEn,
      documents: docs.length ? docs : ['transferDeed'],
      forwardedDate: '26 Jul 2026',
      status: 'pending',
      isNew: true
    };
    setRequests(prev => [newReq, ...prev]);
    setShowForwardDoc(false);
    setForwardForm({
      moduleIdx: 0,
      licenseNo: '',
      docs: Object.fromEntries(forwardDocumentDefs.map(d => [d.id, false]))
    });
    setLicenseFound(null);
    flash(t.forwardSentNotice);
  };
  const updateRequest = (id: string, patch: Partial<VerificationRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      ...patch
    } : r));
    setSelectedRequest(prev => prev && prev.id === id ? {
      ...prev,
      ...patch
    } : prev);
  };
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

      {toast && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
          <Icon name="check_circle" className="text-[16px]" />
          {toast}
        </div>}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex w-fit rounded-full border border-[#CBD5E1] bg-white p-1">
        {(['cbc', 'portal'] as const).map(m => <button key={m} type="button" onClick={() => {
        setMode(m);
        setSelectedBankCode(null);
        setSelectedRequest(null);
      }} className={['rounded-full px-4 py-2 text-xs font-semibold transition-colors', mode === m ? 'bg-[#0A4D8C] text-white' : 'text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
            {m === 'cbc' ? t.modeCbc : t.modePortal}
          </button>)}
      </div>

      {mode === 'cbc' && <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon="account_balance" label={t.totalBanks} value={counts.total} color="#0A4D8C" />
            <StatCard icon="verified_user" label={t.authorized} value={counts.authorized} color="#00A86B" />
            <StatCard icon="hourglass_top" label={t.pendingAuth} value={counts.pending} color="#B45309" />
            <StatCard icon="domain_disabled" label={t.notOnboarded} value={counts.none} color="#94A3B8" />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E293B]">{t.bankListTitle}</h2>
            <button type="button" onClick={() => setShowCreateProfile(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
              <Icon name="add_business" className="text-[16px]" />
              {t.createProfile}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {banks.map(b => <button key={b.bankCode} type="button" onClick={() => setSelectedBankCode(b.bankCode)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name="account_balance" className="text-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#1E293B]">{language === 'en' ? b.nameEn : b.nameBn}</span>
                    <StatusBadge status={b.portalStatus} language={language} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-[#334155]">
                    {b.bankCode} · {language === 'en' ? b.mainBranch.nameEn : b.mainBranch.nameBn}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">
                    {b.adBranches.length} {t.branchesCount} · {bondersForBank(b).length} {t.linkedBonders}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white">{t.view}</span>
              </button>)}
          </div>
        </>}

      {mode === 'portal' && <>
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <Field label={t.selectBankLabel}>
              <select value={portalBankCode} onChange={e => setPortalBankCode(e.target.value)} className={inputClass}>
                <option value="">{t.selectBankPlaceholder}</option>
                {authorizedBanks.map(b => <option key={b.bankCode} value={b.bankCode}>
                    {language === 'en' ? b.nameEn : b.nameBn} ({b.bankCode})
                  </option>)}
              </select>
            </Field>
            <p className="mt-1.5 text-[11px] text-[#94A3B8]">{t.onlyAuthorizedNote}</p>
          </div>

          {portalBank && <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon="hourglass_top" label={t.pendingRequests} value={requestsForBank(portalBank.bankCode).filter(r => r.status === 'pending').length} color="#B45309" />
                <StatCard icon="task_alt" label={t.approvedRequests} value={requestsForBank(portalBank.bankCode).filter(r => r.status === 'approved').length} color="#00A86B" />
                <StatCard icon="cancel" label={t.disapprovedRequests} value={requestsForBank(portalBank.bankCode).filter(r => r.status === 'disapproved').length} color="#DC2626" />
              </div>

              <div className="rounded-xl border border-blue-100 bg-[#EAF3FE] p-3.5 text-xs text-[#0A4D8C]">
                <span className="font-semibold">{t.autoForward}: </span>
                {t.autoForwardOn}
              </div>

              <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'approved', 'disapproved'] as const).map(f => <button key={f} type="button" onClick={() => setPortalFilter(f)} className={['rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', portalFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}>
                    {f === 'all' ? t.filterAll : f === 'pending' ? t.filterPending : f === 'approved' ? t.filterApproved : t.filterDisapproved}
                  </button>)}
              </div>

              <div className="flex flex-col gap-3">
                {filteredPortalRequests.length === 0 && <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-center text-sm text-[#94A3B8]">{t.noRequests}</p>}
                {filteredPortalRequests.map(r => <button key={r.id} type="button" onClick={() => setSelectedRequest(r)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                      <Icon name="fact_check" className="text-[22px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#0A4D8C]">{r.id}</span>
                        {r.isNew && r.status === 'pending' && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#DC2626]">{t.newBadge}</span>}
                        <span className={['rounded-full px-2 py-0.5 text-[10px] font-semibold', r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : r.status === 'disapproved' ? 'bg-red-50 text-[#DC2626]' : 'bg-amber-50 text-amber-700'].join(' ')}>
                          {r.status === 'approved' ? t.filterApproved : r.status === 'disapproved' ? t.filterDisapproved : t.filterPending}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                        {r.licenseeName} · {r.licenseNo}
                      </p>
                      <p className="text-[11px] text-[#94A3B8]">
                        {t.requestFrom} {sourceModules[r.sourceModuleIdx][language]} · {r.forwardedDate}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white">{t.reviewRequest}</span>
                  </button>)}
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-base font-bold text-[#1E293B]">{t.linkedBonders}</h2>
                <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[11px] uppercase tracking-wide text-[#94A3B8]">
                        <th className="px-4 py-2.5">{t.bonderTable.license}</th>
                        <th className="px-4 py-2.5">{t.bonderTable.name}</th>
                        <th className="px-4 py-2.5">{t.bonderTable.district}</th>
                        <th className="px-4 py-2.5">{t.bonderTable.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bondersForBank(portalBank).map(l => <tr key={l.licenseNo} className="border-b border-[#F1F5F9] last:border-0">
                          <td className="px-4 py-2.5 font-medium text-[#0A4D8C]">{l.licenseNo}</td>
                          <td className="px-4 py-2.5">{language === 'en' ? l.nameEn : l.nameBn}</td>
                          <td className="px-4 py-2.5">{l.district}</td>
                          <td className="px-4 py-2.5">
                            <span className={['rounded-full px-2 py-0.5 text-[11px] font-semibold', l.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-[#DC2626]'].join(' ')}>
                              {l.status === 'active' ? t.activeBadge : t.inactiveBadge}
                            </span>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </>}
        </>}

      {showCreateProfile && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowCreateProfile(false)}>
          <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl bg-white p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-bold text-[#1E293B]">{t.createProfileTitle}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.bankNameLabel} required error={createErrors.bankName ? t.required : undefined}>
                <TextInput value={createForm.bankName} onChange={v => setCreateForm(f => ({
              ...f,
              bankName: v
            }))} error={createErrors.bankName} />
              </Field>
              <Field label={t.branchNameLabel} required error={createErrors.branchName ? t.required : undefined}>
                <TextInput value={createForm.branchName} onChange={v => setCreateForm(f => ({
              ...f,
              branchName: v
            }))} error={createErrors.branchName} />
              </Field>
              <Field label={t.branchCodeLabel} required error={createErrors.branchCode ? t.required : undefined}>
                <TextInput value={createForm.branchCode} onChange={v => setCreateForm(f => ({
              ...f,
              branchCode: v
            }))} error={createErrors.branchCode} />
              </Field>
              <Field label={t.contactOfficerLabel} required error={createErrors.contactOfficer ? t.required : undefined}>
                <TextInput value={createForm.contactOfficer} onChange={v => setCreateForm(f => ({
              ...f,
              contactOfficer: v
            }))} error={createErrors.contactOfficer} />
              </Field>
              <div className="sm:col-span-2">
                <Field label={t.addressLabel} required error={createErrors.address ? t.required : undefined}>
                  <TextInput value={createForm.address} onChange={v => setCreateForm(f => ({
                ...f,
                address: v
              }))} error={createErrors.address} />
                </Field>
              </div>
              <Field label={t.contactPhoneLabel} required error={createErrors.contactPhone ? t.required : undefined}>
                <TextInput value={createForm.contactPhone} onChange={v => setCreateForm(f => ({
              ...f,
              contactPhone: v
            }))} placeholder="+880 1XXXXXXXXX" error={createErrors.contactPhone} />
              </Field>
              <Field label={t.contactEmailLabel} required error={createErrors.contactEmail ? t.required : undefined}>
                <TextInput value={createForm.contactEmail} onChange={v => setCreateForm(f => ({
              ...f,
              contactEmail: v
            }))} type="email" error={createErrors.contactEmail} />
              </Field>
            </div>
            <div className="flex justify-end gap-2 border-t border-[#F1F5F9] pt-4">
              <button type="button" onClick={() => setShowCreateProfile(false)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button type="button" onClick={handleCreateProfile} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                {t.submitProfile}
              </button>
            </div>
          </div>
        </div>}

      {selectedBank && <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => {
      setSelectedBankCode(null);
      setShowAddBranch(false);
      setShowForwardDoc(false);
    }}>
          <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">{t.bankProfileTitle}</h2>
                <p className="text-xs text-[#64748B]">{language === 'en' ? selectedBank.nameEn : selectedBank.nameBn} · {selectedBank.bankCode}</p>
              </div>
              <button type="button" onClick={() => setSelectedBankCode(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-5 py-5">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedBank.portalStatus} language={language} />
              </div>

              <div className="rounded-xl border border-[#E2E8F0] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{t.mainBranch}</p>
                <dl className="grid grid-cols-1 gap-y-1.5 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#64748B]">{t.branchNameLabel}</dt>
                    <dd className="font-medium text-[#1E293B]">{language === 'en' ? selectedBank.mainBranch.nameEn : selectedBank.mainBranch.nameBn}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#64748B]">{t.branchCodeLabel}</dt>
                    <dd className="font-medium text-[#1E293B]">{selectedBank.mainBranch.branchCode}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#64748B]">{t.addressLabel}</dt>
                    <dd className="truncate font-medium text-[#1E293B]">{selectedBank.mainBranch.address}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#64748B]">{t.contactOfficerLabel}</dt>
                    <dd className="font-medium text-[#1E293B]">{selectedBank.mainBranch.contactOfficer}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#64748B]">{t.contactEmailLabel}</dt>
                    <dd className="truncate font-medium text-[#1E293B]">{selectedBank.mainBranch.contactEmail}</dd>
                  </div>
                </dl>
              </div>

              {selectedBank.portalStatus === 'pending-authorization' && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-800">{t.authorizeConfirm}</p>
                  <button type="button" onClick={() => handleAuthorize(selectedBank.bankCode)} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]">
                    <Icon name="verified_user" className="text-[16px]" />
                    {t.authorizeProfile}
                  </button>
                </div>}

              {selectedBank.portalStatus === 'authorized' && <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{t.adBranchesTitle}</p>
                    <button type="button" onClick={() => setShowAddBranch(v => !v)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                      + {t.addAdBranch}
                    </button>
                  </div>

                  {showAddBranch && <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#CBD5E1] p-3">
                      <p className="text-xs font-semibold text-[#334155]">{t.addAdBranchTitle}</p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <TextInput value={branchForm.nameEn} onChange={v => setBranchForm(f => ({
                  ...f,
                  nameEn: v
                }))} placeholder={t.branchNameLabel} />
                        <TextInput value={branchForm.branchCode} onChange={v => setBranchForm(f => ({
                  ...f,
                  branchCode: v
                }))} placeholder={t.branchCodeLabel} />
                        <TextInput value={branchForm.contactOfficer} onChange={v => setBranchForm(f => ({
                  ...f,
                  contactOfficer: v
                }))} placeholder={t.contactOfficerLabel} />
                        <TextInput value={branchForm.contactPhone} onChange={v => setBranchForm(f => ({
                  ...f,
                  contactPhone: v
                }))} placeholder={t.contactPhoneLabel} />
                        <div className="sm:col-span-2">
                          <TextInput value={branchForm.address} onChange={v => setBranchForm(f => ({
                    ...f,
                    address: v
                  }))} placeholder={t.addressLabel} />
                        </div>
                        <div className="sm:col-span-2">
                          <TextInput value={branchForm.contactEmail} onChange={v => setBranchForm(f => ({
                    ...f,
                    contactEmail: v
                  }))} placeholder={t.contactEmailLabel} type="email" />
                        </div>
                      </div>
                      <button type="button" onClick={handleAddBranch} className="w-fit rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                        {t.add}
                      </button>
                    </div>}

                  <div className="flex flex-col gap-2">
                    {selectedBank.adBranches.length === 0 && <p className="text-xs text-[#94A3B8]">—</p>}
                    {selectedBank.adBranches.map(br => <div key={br.id} className="rounded-lg border border-[#E2E8F0] p-3 text-[13px]">
                        <p className="font-semibold text-[#1E293B]">{language === 'en' ? br.nameEn : br.nameBn}</p>
                        <p className="text-xs text-[#64748B]">
                          {br.branchCode} · {br.address}
                        </p>
                      </div>)}
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-4">
                    <button type="button" onClick={() => setShowForwardDoc(v => !v)} className="inline-flex items-center gap-1.5 rounded-full border border-[#0A4D8C] px-4 py-2 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                      <Icon name="forward_to_inbox" className="text-[16px]" />
                      {t.forwardDoc}
                    </button>

                    {showForwardDoc && <div className="mt-3 flex flex-col gap-3 rounded-xl border border-dashed border-[#CBD5E1] p-3">
                        <p className="text-xs font-semibold text-[#334155]">{t.forwardDocTitle}</p>
                        <Field label={t.selectModule}>
                          <select value={forwardForm.moduleIdx} onChange={e => setForwardForm(f => ({
                    ...f,
                    moduleIdx: Number(e.target.value)
                  }))} className={inputClass}>
                            {sourceModules.map((m, i) => <option key={i} value={i}>
                                {m[language]}
                              </option>)}
                          </select>
                        </Field>
                        <Field label={t.selectLicense} error={licenseError ? t.notFound : undefined}>
                          <div className="flex gap-2">
                            <TextInput value={forwardForm.licenseNo} onChange={v => {
                      setForwardForm(f => ({
                        ...f,
                        licenseNo: v
                      }));
                      setLicenseFound(null);
                      setLicenseError(false);
                    }} placeholder="BL-2024-03398" error={licenseError} />
                            <button type="button" onClick={verifyLicense} className="shrink-0 rounded-lg border border-[#0A4D8C] px-4 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                              {t.verify}
                            </button>
                          </div>
                        </Field>
                        {licenseFound && <p className="text-[11px] font-semibold text-emerald-700">{licenseFound.nameEn}</p>}
                        <div>
                          <p className="mb-1.5 text-[13px] font-semibold text-[#334155]">{t.documentsLabel}</p>
                          <div className="flex flex-col gap-1.5">
                            {forwardDocumentDefs.map(d => <label key={d.id} className="flex items-center gap-2 text-[13px] text-[#334155]">
                                <input type="checkbox" checked={forwardForm.docs[d.id]} onChange={e => setForwardForm(f => ({
                        ...f,
                        docs: {
                          ...f.docs,
                          [d.id]: e.target.checked
                        }
                      }))} className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C]" />
                                {d[language]}
                              </label>)}
                          </div>
                        </div>
                        <button type="button" disabled={!licenseFound} onClick={handleForwardDoc} className="w-fit rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                          {t.forwardSend}
                        </button>
                      </div>}
                  </div>
                </>}
            </div>
          </div>
        </div>}

      {selectedRequest && <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelectedRequest(null)}>
          <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">{t.requestDetailTitle}</h2>
                <p className="text-xs text-[#64748B]">{selectedRequest.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedRequest(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-5 py-5">
              {(() => {
            const license = bondLicenses.find(l => l.licenseNo === selectedRequest.licenseNo);
            return <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{t.bonderProfileSnapshot}</p>
                    <dl className="grid grid-cols-2 gap-y-1.5 text-[13px]">
                      <div className="col-span-2 flex justify-between gap-3">
                        <dt className="text-[#64748B]">{t.bonderTable.name}</dt>
                        <dd className="font-medium text-[#1E293B]">{selectedRequest.licenseeName}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#64748B]">{t.bonderTable.license}</dt>
                        <dd className="font-medium text-[#1E293B]">{selectedRequest.licenseNo}</dd>
                      </div>
                      {license && <div className="flex justify-between gap-3">
                          <dt className="text-[#64748B]">{t.bin}</dt>
                          <dd className="font-medium text-[#1E293B]">{license.bin}</dd>
                        </div>}
                      {license && <div className="flex justify-between gap-3">
                          <dt className="text-[#64748B]">{t.category}</dt>
                          <dd className="font-medium text-[#1E293B]">{license.category}</dd>
                        </div>}
                    </dl>
                  </div>;
          })()}

              <div className="rounded-xl border border-[#E2E8F0] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {t.documents} · {t.requestFrom} {sourceModules[selectedRequest.sourceModuleIdx][language]}
                </p>
                <div className="flex flex-col gap-1.5">
                  {selectedRequest.documents.map(docId => {
                const d = forwardDocumentDefs.find(x => x.id === docId);
                return <div key={docId} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2 text-[13px]">
                        <span className="flex items-center gap-2 text-[#334155]">
                          <Icon name="description" className="text-[16px] text-[#0A4D8C]" />
                          {d ? d[language] : docId}
                        </span>
                        <span className="text-[11px] font-semibold text-[#0A4D8C]">{t.docView}</span>
                      </div>;
              })}
                </div>
              </div>

              {selectedRequest.status === 'pending' && <RequestActionPanel t={t} onApprove={note => {
            updateRequest(selectedRequest.id, {
              status: 'approved',
              recommendation: note,
              isNew: false
            });
            flash(t.approvedNotice);
          }} onDisapprove={reason => {
            updateRequest(selectedRequest.id, {
              status: 'disapproved',
              disapprovalReason: reason,
              isNew: false
            });
            flash(t.disapprovedNotice);
          }} />}

              {selectedRequest.status === 'approved' && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                    <Icon name="task_alt" className="text-[18px]" />
                    {t.filterApproved}
                  </p>
                  <p className="mt-1 text-xs text-emerald-800">{selectedRequest.recommendation}</p>
                </div>}

              {selectedRequest.status === 'disapproved' && <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
                    <Icon name="cancel" className="text-[18px]" />
                    {t.filterDisapproved}
                  </p>
                  <p className="mt-1 text-xs text-[#B91C1C]">{selectedRequest.disapprovalReason}</p>
                </div>}
            </div>
          </div>
        </div>}

      <div className="pt-2">
        <button type="button" onClick={onDone} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>
    </div>;
}
function RequestActionPanel({
  t,
  onApprove,
  onDisapprove
}: {
  t: (typeof T)['en'];
  onApprove: (note: string) => void;
  onDisapprove: (reason: string) => void;
}) {
  const [note, setNote] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  return <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4">
      <Field label={t.recommendationLabel}>
        <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder={t.recommendationPlaceholder} className={`${inputClass} resize-none`} />
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
        <button type="button" onClick={() => onApprove(note)} className="rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]">
          {t.approve}
        </button>
      </div>
    </div>;
}