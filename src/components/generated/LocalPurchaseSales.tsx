import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';
type Kind = 'purchase' | 'sale';
type SaleType = 'raw-material' | 'finished-product';
type AppStatus = 'pending-ivas' | 'pending-approval' | 'approved' | 'disapproved';

interface LocalPurchaseSalesProps {
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
    pageTitle: 'Local Purchase & Sales',
    subtitle: 'Apply for local purchase or sale of bonded raw materials and finished goods, verified via i-VAS and approved by CBC.',
    backToDashboard: 'Back to Dashboard',
    purchaseTab: 'Purchase',
    saleTab: 'Sales',
    newPurchase: 'New Purchase Application',
    newSale: 'New Sale Application',
    manageQueue: 'Manage Applications',
    all: 'All',
    filterPendingIvas: 'Pending i-VAS',
    filterPendingApproval: 'Pending CBC Approval',
    filterApproved: 'Approved',
    filterDisapproved: 'Disapproved',
    statusPendingIvas: 'Pending i-VAS Verification',
    statusPendingApproval: 'Pending CBC Approval',
    statusApproved: 'Approved',
    statusDisapproved: 'Disapproved',
    saleTypeLabel: { 'raw-material': 'Raw Material', 'finished-product': 'Finished Product' },
    material: 'Material / Product',
    qty: 'Quantity',
    value: 'Value',
    supplier: 'Supplier',
    buyer: 'Buyer',
    submittedOn: 'Submitted',
    review: 'Review',
    viewDetails: 'View Details',
    noResultsTitle: 'No applications found',
    noResultsBody: 'Try a different filter, or submit a new application.',
    drawerPurchaseTitle: 'New Local Purchase Application',
    drawerSaleTitle: 'New Local Sale Application',
    materialName: 'Material Name',
    hsCode: 'HS Code',
    quantityKg: 'Quantity (kg)',
    localValueBdt: 'Local Value (Tk.)',
    supplierName: 'Supplier Name',
    supplierBin: 'Supplier BIN',
    vatChallanNo: 'VAT Challan No.',
    vatChallanUpload: 'VAT Challan (scanned copy)',
    saleType: 'Sale Type',
    productName: 'Material / Product Name',
    saleValueBdt: 'Sale Value (Tk.)',
    buyerName: 'Buyer Name',
    buyerAddress: 'Buyer Address',
    linkedExBondSerial: 'Linked Ex-Bond Serial (for finished product)',
    supportingDoc: 'Supporting Document',
    cancel: 'Cancel',
    submit: 'Submit Application',
    required: 'Required',
    reviewTitle: 'Review Application',
    ivasVerification: 'i-VAS Verification (BIN validation)',
    ivasVerified: 'Verified',
    ivasPending: 'Pending Verification',
    markIvasVerified: 'Mark i-VAS Verified',
    approvalNote: 'CBC Approval Note',
    notePlaceholder: 'Enter verification remarks and approval note…',
    approve: 'Approve',
    disapprove: 'Disapprove',
    approveBlocked: 'i-VAS verification is required before approval.',
    disapproveReasonRequired: 'A note is required to disapprove a request.',
    approvedOutcomePurchase: 'Raw materials added to inventory. In-Bond entry posted to e-Bond Register. Annual Entitlement adjusted.',
    approvedOutcomeSale: 'Raw materials/goods subtracted from inventory. Ex-Bond entry posted to e-Bond Register.',
    entryPosted: 'Entry Posted',
    close: 'Close',
    disapprovalReason: 'Reason for Disapproval',
  },
  bn: {
    home: 'হোম',
    bondRegister: 'ই-বন্ড রেজিস্টার',
    pageTitle: 'স্থানীয় ক্রয় ও বিক্রয়',
    subtitle: 'বন্ডেড কাঁচামাল ও তৈরি পণ্যের স্থানীয় ক্রয় বা বিক্রয়ের জন্য আবেদন করুন, i-VAS দ্বারা যাচাইকৃত ও সিবিসি কর্তৃক অনুমোদিত।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    purchaseTab: 'ক্রয়',
    saleTab: 'বিক্রয়',
    newPurchase: 'নতুন ক্রয় আবেদন',
    newSale: 'নতুন বিক্রয় আবেদন',
    manageQueue: 'আবেদন ব্যবস্থাপনা',
    all: 'সকল',
    filterPendingIvas: 'i-VAS অপেক্ষমাণ',
    filterPendingApproval: 'সিবিসি অনুমোদন অপেক্ষমাণ',
    filterApproved: 'অনুমোদিত',
    filterDisapproved: 'অননুমোদিত',
    statusPendingIvas: 'i-VAS যাচাইকরণ অপেক্ষমাণ',
    statusPendingApproval: 'সিবিসি অনুমোদন অপেক্ষমাণ',
    statusApproved: 'অনুমোদিত',
    statusDisapproved: 'অননুমোদিত',
    saleTypeLabel: { 'raw-material': 'কাঁচামাল', 'finished-product': 'তৈরি পণ্য' },
    material: 'কাঁচামাল / পণ্য',
    qty: 'পরিমাণ',
    value: 'মূল্য',
    supplier: 'সরবরাহকারী',
    buyer: 'ক্রেতা',
    submittedOn: 'জমার তারিখ',
    review: 'পর্যালোচনা',
    viewDetails: 'বিস্তারিত দেখুন',
    noResultsTitle: 'কোনো আবেদন পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন ফিল্টার ব্যবহার করুন, অথবা নতুন আবেদন জমা দিন।',
    drawerPurchaseTitle: 'নতুন স্থানীয় ক্রয় আবেদন',
    drawerSaleTitle: 'নতুন স্থানীয় বিক্রয় আবেদন',
    materialName: 'কাঁচামালের নাম',
    hsCode: 'এইচএস কোড',
    quantityKg: 'পরিমাণ (কেজি)',
    localValueBdt: 'স্থানীয় মূল্য (টাকা)',
    supplierName: 'সরবরাহকারীর নাম',
    supplierBin: 'সরবরাহকারীর বিআইএন',
    vatChallanNo: 'ভ্যাট চালান নং',
    vatChallanUpload: 'ভ্যাট চালান (স্ক্যান কপি)',
    saleType: 'বিক্রয়ের ধরন',
    productName: 'কাঁচামাল / পণ্যের নাম',
    saleValueBdt: 'বিক্রয় মূল্য (টাকা)',
    buyerName: 'ক্রেতার নাম',
    buyerAddress: 'ক্রেতার ঠিকানা',
    linkedExBondSerial: 'সংযুক্ত এক্স-বন্ড সিরিয়াল (তৈরি পণ্যের জন্য)',
    supportingDoc: 'সহায়ক নথি',
    cancel: 'বাতিল',
    submit: 'আবেদন জমা দিন',
    required: 'আবশ্যক',
    reviewTitle: 'আবেদন পর্যালোচনা',
    ivasVerification: 'i-VAS যাচাইকরণ (বিআইএন যাচাই)',
    ivasVerified: 'যাচাইকৃত',
    ivasPending: 'যাচাই অপেক্ষমাণ',
    markIvasVerified: 'i-VAS যাচাইকৃত চিহ্নিত করুন',
    approvalNote: 'সিবিসি অনুমোদন মন্তব্য',
    notePlaceholder: 'যাচাই মন্তব্য ও অনুমোদন নোট লিখুন…',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    approveBlocked: 'অনুমোদনের আগে i-VAS যাচাই প্রয়োজন।',
    disapproveReasonRequired: 'অননুমোদনের জন্য একটি নোট আবশ্যক।',
    approvedOutcomePurchase: 'কাঁচামাল ইনভেন্টরিতে যুক্ত হয়েছে। ই-বন্ড রেজিস্টারে ইন-বন্ড এন্ট্রি পোস্ট হয়েছে। বার্ষিক এনটাইটেলমেন্ট সমন্বয় করা হয়েছে।',
    approvedOutcomeSale: 'কাঁচামাল/পণ্য ইনভেন্টরি থেকে বিয়োগ হয়েছে। ই-বন্ড রেজিস্টারে এক্স-বন্ড এন্ট্রি পোস্ট হয়েছে।',
    entryPosted: 'এন্ট্রি পোস্ট হয়েছে',
    close: 'বন্ধ করুন',
    disapprovalReason: 'অননুমোদনের কারণ',
  },
};

interface Application {
  id: string;
  kind: Kind;
  saleType?: SaleType;
  materialEn: string;
  materialBn: string;
  qty: string;
  valueBdt: string;
  partyEn: string;
  partyBn: string;
  submittedDate: string;
  ivasVerified: boolean;
  status: AppStatus;
  note: string;
  postedRef?: string;
  linkedExBondSerial?: string;
}

const seedApplications: Application[] = [
  {
    id: 'LP-2026-00301', kind: 'purchase', materialEn: 'Cotton Yarn', materialBn: 'কটন ইয়ার্ন', qty: '3,200 kg', valueBdt: '৳16,80,000',
    partyEn: 'Delta Spinning Mills Ltd.', partyBn: 'ডেল্টা স্পিনিং মিলস লিমিটেড', submittedDate: '19 Jul 2026', ivasVerified: false, status: 'pending-ivas', note: '',
  },
  {
    id: 'LP-2026-00298', kind: 'purchase', materialEn: 'Sewing Thread', materialBn: 'সেলাই সুতা', qty: '850 kg', valueBdt: '৳4,25,000',
    partyEn: 'Bengal Thread Industries', partyBn: 'বেঙ্গল থ্রেড ইন্ডাস্ট্রিজ', submittedDate: '16 Jul 2026', ivasVerified: true, status: 'pending-approval', note: '',
  },
  {
    id: 'LP-2026-00285', kind: 'purchase', materialEn: 'Dyeing Chemicals', materialBn: 'ডাইং কেমিক্যালস', qty: '1,100 kg', valueBdt: '৳7,90,000',
    partyEn: 'ACI Chemicals Ltd.', partyBn: 'এসিআই কেমিক্যালস লিমিটেড', submittedDate: '15 Jun 2026', ivasVerified: true, status: 'approved',
    note: 'Verified and compliant. Approved.', postedRef: 'LP-2026-00214',
  },
  {
    id: 'LS-2026-00112', kind: 'sale', saleType: 'raw-material', materialEn: 'Cotton Fabric Offcuts', materialBn: 'কটন ফেব্রিক অফকাট', qty: '450 kg', valueBdt: '৳1,80,000',
    partyEn: 'Green Recyclers Ltd.', partyBn: 'গ্রিন রিসাইক্লার্স লিমিটেড', submittedDate: '18 Jul 2026', ivasVerified: true, status: 'pending-approval', note: '',
  },
  {
    id: 'LS-2026-00109', kind: 'sale', saleType: 'finished-product', materialEn: 'T-Shirts (B-Grade)', materialBn: 'টি-শার্ট (বি-গ্রেড)', qty: '2,000 pcs', valueBdt: '৳4,80,000',
    partyEn: 'Local Market — Karwan Bazar Distributor', partyBn: 'স্থানীয় বাজার — কারওয়ান বাজার ডিস্ট্রিবিউটর', submittedDate: '10 Jul 2026', ivasVerified: true, status: 'approved',
    note: 'Approved for local sale.', postedRef: 'LS-2026-00098', linkedExBondSerial: 'EB-2026-1155',
  },
  {
    id: 'LS-2026-00095', kind: 'sale', saleType: 'raw-material', materialEn: 'Excess Elastic Tape', materialBn: 'অতিরিক্ত ইলাস্টিক টেপ', qty: '200 kg', valueBdt: '৳95,000',
    partyEn: 'Textile Waste Traders BD', partyBn: 'টেক্সটাইল ওয়েস্ট ট্রেডার্স বিডি', submittedDate: '02 Jul 2026', ivasVerified: true, status: 'disapproved',
    note: 'Quantity exceeds approved excess threshold; resubmit with revised quantity.',
  },
];

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
    </label>
  );
}

const statusColor: Record<AppStatus, string> = {
  'pending-ivas': '#B45309',
  'pending-approval': '#1E88E5',
  approved: '#00A86B',
  disapproved: '#DC2626',
};

interface UploadStatus {
  uploaded: boolean;
  fileName?: string;
}

function UploadRow({ label, status, onUpload, language }: { label: string; status: UploadStatus; onUpload: () => void; language: Language }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', status.uploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
          <Icon name={status.uploaded ? 'task_alt' : 'description'} className="text-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1E293B]">{label}</p>
          {status.uploaded ? (
            <p className="truncate text-xs text-[#64748B]">{status.fileName}</p>
          ) : (
            <p className="text-xs text-[#94A3B8]">{language === 'en' ? 'PDF, JPG or PNG · max 2 MB' : 'PDF, JPG বা PNG · সর্বোচ্চ ২ এমবি'}</p>
          )}
        </div>
      </div>
      {status.uploaded ? (
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে'}</span>
      ) : (
        <button type="button" onClick={onUpload} className="shrink-0 rounded-lg border border-[#0A4D8C] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
          {language === 'en' ? 'Upload' : 'আপলোড'}
        </button>
      )}
    </div>
  );
}

const emptyPurchaseDraft = { materialName: '', hsCode: '', qty: '', value: '', supplierName: '', supplierBin: '', vatChallanNo: '' };
const emptySaleDraft = { saleType: 'raw-material' as SaleType, productName: '', qty: '', value: '', buyerName: '', buyerAddress: '', exBondSerial: '' };

export function LocalPurchaseSales({ language, onDone }: LocalPurchaseSalesProps) {
  const t = T[language];
  const [tab, setTab] = useState<Kind>('purchase');
  const [applications, setApplications] = useState<Application[]>(seedApplications);
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'all'>('all');
  const [manageMode, setManageMode] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [purchaseDraft, setPurchaseDraft] = useState(emptyPurchaseDraft);
  const [saleDraft, setSaleDraft] = useState(emptySaleDraft);
  const [docStatus, setDocStatus] = useState<UploadStatus>({ uploaded: false });
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewError, setReviewError] = useState('');

  const filtered = useMemo(() => {
    return applications.filter((a) => a.kind === tab && (statusFilter === 'all' || a.status === statusFilter));
  }, [applications, tab, statusFilter]);

  const countFor = (status: AppStatus | 'all') => applications.filter((a) => a.kind === tab && (status === 'all' || a.status === status)).length;

  const openCompose = () => {
    setPurchaseDraft(emptyPurchaseDraft);
    setSaleDraft(emptySaleDraft);
    setDocStatus({ uploaded: false });
    setComposeOpen(true);
  };

  const submitApplication = () => {
    if (tab === 'purchase') {
      if (!purchaseDraft.materialName || !purchaseDraft.qty || !purchaseDraft.value || !purchaseDraft.supplierName) return;
      const newApp: Application = {
        id: `LP-2026-${Math.floor(400 + Math.random() * 99)}`,
        kind: 'purchase',
        materialEn: purchaseDraft.materialName,
        materialBn: purchaseDraft.materialName,
        qty: `${purchaseDraft.qty} kg`,
        valueBdt: `৳${purchaseDraft.value}`,
        partyEn: purchaseDraft.supplierName,
        partyBn: purchaseDraft.supplierName,
        submittedDate: '23 Jul 2026',
        ivasVerified: false,
        status: 'pending-ivas',
        note: '',
      };
      setApplications((prev) => [newApp, ...prev]);
    } else {
      if (!saleDraft.productName || !saleDraft.qty || !saleDraft.value || !saleDraft.buyerName) return;
      const newApp: Application = {
        id: `LS-2026-${Math.floor(400 + Math.random() * 99)}`,
        kind: 'sale',
        saleType: saleDraft.saleType,
        materialEn: saleDraft.productName,
        materialBn: saleDraft.productName,
        qty: saleDraft.qty,
        valueBdt: `৳${saleDraft.value}`,
        partyEn: saleDraft.buyerName,
        partyBn: saleDraft.buyerName,
        submittedDate: '23 Jul 2026',
        ivasVerified: true,
        status: 'pending-approval',
        note: '',
        linkedExBondSerial: saleDraft.exBondSerial || undefined,
      };
      setApplications((prev) => [newApp, ...prev]);
    }
    setComposeOpen(false);
  };

  const markIvasVerified = (id: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ivasVerified: true, status: 'pending-approval' } : a)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ivasVerified: true, status: 'pending-approval' } : prev));
  };

  const approveApplication = () => {
    if (!selected) return;
    if (!selected.ivasVerified) {
      setReviewError(t.approveBlocked);
      return;
    }
    const postedRef = selected.kind === 'purchase' ? `LP-2026-${Math.floor(200 + Math.random() * 99)}` : `LS-2026-${Math.floor(200 + Math.random() * 99)}`;
    const updated: Application = { ...selected, status: 'approved', note: reviewNote, postedRef };
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(null);
    setReviewNote('');
    setReviewError('');
  };

  const disapproveApplication = () => {
    if (!selected) return;
    if (!reviewNote.trim()) {
      setReviewError(t.disapproveReasonRequired);
      return;
    }
    const updated: Application = { ...selected, status: 'disapproved', note: reviewNote };
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(null);
    setReviewNote('');
    setReviewError('');
  };

  const statusLabel: Record<AppStatus, string> = {
    'pending-ivas': t.statusPendingIvas,
    'pending-approval': t.statusPendingApproval,
    approved: t.statusApproved,
    disapproved: t.statusDisapproved,
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6">
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

      <div className="flex gap-1 rounded-full bg-[#EEF2F6] p-1">
        {(['purchase', 'sale'] as Kind[]).map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => {
              setTab(tb);
              setStatusFilter('all');
            }}
            className={['flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors', tab === tb ? 'bg-white text-[#0A4D8C] shadow-sm' : 'text-[#64748B] hover:text-[#334155]'].join(' ')}
          >
            {tb === 'purchase' ? t.purchaseTab : t.saleTab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending-ivas', 'pending-approval', 'approved', 'disapproved'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={[
                  'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  statusFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
                ].join(' ')}
              >
                {f === 'all' ? t.all : f === 'pending-ivas' ? t.filterPendingIvas : f === 'pending-approval' ? t.filterPendingApproval : f === 'approved' ? t.filterApproved : t.filterDisapproved} ({countFor(f)})
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-semibold text-[#334155]">
              {t.manageQueue}
              <button
                type="button"
                role="switch"
                aria-checked={manageMode}
                onClick={() => setManageMode((v) => !v)}
                className={[
                  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5] focus-visible:ring-offset-2',
                  manageMode ? 'bg-[#0A4D8C]' : 'bg-[#CBD5E1]',
                ].join(' ')}
              >
                <span className={['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out', manageMode ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
              </button>
            </label>
            <button type="button" onClick={openCompose} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#048f5c]">
              <Icon name="add" className="text-[16px]" />
              {tab === 'purchase' ? t.newPurchase : t.newSale}
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
          {filtered.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name={a.kind === 'purchase' ? 'add_shopping_cart' : 'sell'} className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{a.id}</span>
                  {a.saleType && <span className="rounded-full bg-[#EEF2F6] px-2 py-0.5 text-[10px] font-semibold text-[#334155]">{t.saleTypeLabel[a.saleType]}</span>}
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${statusColor[a.status]}1A`, color: statusColor[a.status] }}>
                    {statusLabel[a.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-[#334155]">
                  {a[language === 'en' ? 'materialEn' : 'materialBn']} · {a.qty} · {a.valueBdt}
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  {a.kind === 'purchase' ? t.supplier : t.buyer}: {a[language === 'en' ? 'partyEn' : 'partyBn']} · {t.submittedOn}: {a.submittedDate}
                  {a.postedRef && ` · ${t.entryPosted}: ${a.postedRef}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${a.ivasVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  <Icon name={a.ivasVerified ? 'verified' : 'hourglass_empty'} className="text-[13px]" />
                  {a.ivasVerified ? t.ivasVerified : t.ivasPending}
                </span>
                {manageMode && (a.status === 'pending-ivas' || a.status === 'pending-approval') ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(a);
                      setReviewNote(a.note);
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
                      setSelected(a);
                      setReviewNote(a.note);
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
              <h2 className="text-base font-bold text-[#1E293B]">{tab === 'purchase' ? t.drawerPurchaseTitle : t.drawerSaleTitle}</h2>
              <button type="button" onClick={() => setComposeOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-4 px-5 py-5">
              {tab === 'purchase' ? (
                <>
                  <Field label={t.materialName} required>
                    <input value={purchaseDraft.materialName} onChange={(e) => setPurchaseDraft({ ...purchaseDraft, materialName: e.target.value })} placeholder="Cotton Yarn" className={inputClass} />
                  </Field>
                  <Field label={t.hsCode}>
                    <input value={purchaseDraft.hsCode} onChange={(e) => setPurchaseDraft({ ...purchaseDraft, hsCode: e.target.value })} placeholder="5205.24.00" className={inputClass} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t.quantityKg} required>
                      <input value={purchaseDraft.qty} onChange={(e) => setPurchaseDraft({ ...purchaseDraft, qty: e.target.value })} placeholder="3,200" className={inputClass} />
                    </Field>
                    <Field label={t.localValueBdt} required>
                      <input value={purchaseDraft.value} onChange={(e) => setPurchaseDraft({ ...purchaseDraft, value: e.target.value })} placeholder="16,80,000" className={inputClass} />
                    </Field>
                  </div>
                  <Field label={t.supplierName} required>
                    <input value={purchaseDraft.supplierName} onChange={(e) => setPurchaseDraft({ ...purchaseDraft, supplierName: e.target.value })} placeholder="Delta Spinning Mills Ltd." className={inputClass} />
                  </Field>
                  <Field label={t.supplierBin}>
                    <input value={purchaseDraft.supplierBin} onChange={(e) => setPurchaseDraft({ ...purchaseDraft, supplierBin: e.target.value })} placeholder="007712345-0601" className={inputClass} />
                  </Field>
                  <Field label={t.vatChallanNo}>
                    <input value={purchaseDraft.vatChallanNo} onChange={(e) => setPurchaseDraft({ ...purchaseDraft, vatChallanNo: e.target.value })} placeholder="VC-2026-08812" className={inputClass} />
                  </Field>
                  <UploadRow label={t.vatChallanUpload} status={docStatus} language={language} onUpload={() => setDocStatus({ uploaded: true, fileName: 'vat-challan.pdf' })} />
                </>
              ) : (
                <>
                  <Field label={t.saleType} required>
                    <div className="flex gap-2">
                      {(['raw-material', 'finished-product'] as SaleType[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setSaleDraft({ ...saleDraft, saleType: st })}
                          className={[
                            'rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                            saleDraft.saleType === st ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
                          ].join(' ')}
                        >
                          {t.saleTypeLabel[st]}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={t.productName} required>
                    <input value={saleDraft.productName} onChange={(e) => setSaleDraft({ ...saleDraft, productName: e.target.value })} placeholder="T-Shirts (B-Grade)" className={inputClass} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t.qty} required>
                      <input value={saleDraft.qty} onChange={(e) => setSaleDraft({ ...saleDraft, qty: e.target.value })} placeholder="2,000 pcs" className={inputClass} />
                    </Field>
                    <Field label={t.saleValueBdt} required>
                      <input value={saleDraft.value} onChange={(e) => setSaleDraft({ ...saleDraft, value: e.target.value })} placeholder="4,80,000" className={inputClass} />
                    </Field>
                  </div>
                  <Field label={t.buyerName} required>
                    <input value={saleDraft.buyerName} onChange={(e) => setSaleDraft({ ...saleDraft, buyerName: e.target.value })} placeholder="Karwan Bazar Distributor" className={inputClass} />
                  </Field>
                  <Field label={t.buyerAddress}>
                    <input value={saleDraft.buyerAddress} onChange={(e) => setSaleDraft({ ...saleDraft, buyerAddress: e.target.value })} placeholder="Karwan Bazar, Dhaka" className={inputClass} />
                  </Field>
                  {saleDraft.saleType === 'finished-product' && (
                    <Field label={t.linkedExBondSerial}>
                      <input value={saleDraft.exBondSerial} onChange={(e) => setSaleDraft({ ...saleDraft, exBondSerial: e.target.value })} placeholder="EB-2026-1155" className={inputClass} />
                    </Field>
                  )}
                  <UploadRow label={t.supportingDoc} status={docStatus} language={language} onUpload={() => setDocStatus({ uploaded: true, fileName: 'supporting-document.pdf' })} />
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setComposeOpen(false)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button type="button" onClick={submitApplication} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]">
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
                  <p className="text-[11px] text-[#94A3B8]">{selected.kind === 'purchase' ? t.supplier : t.buyer}</p>
                  <p className="font-medium text-[#1E293B]">{selected[language === 'en' ? 'partyEn' : 'partyBn']}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.material}</p>
                  <p className="font-medium text-[#1E293B]">{selected[language === 'en' ? 'materialEn' : 'materialBn']}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.qty} / {t.value}</p>
                  <p className="font-medium text-[#1E293B]">
                    {selected.qty} / {selected.valueBdt}
                  </p>
                </div>
              </div>

              {selected.status === 'approved' || selected.status === 'disapproved' ? (
                <div className={`rounded-lg px-3.5 py-2.5 text-xs ${selected.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-[#DC2626]'}`}>
                  <p className="font-semibold">{selected.note}</p>
                  {selected.postedRef && (
                    <p className="mt-1">
                      {selected.kind === 'purchase' ? t.approvedOutcomePurchase : t.approvedOutcomeSale} ({t.entryPosted}: {selected.postedRef})
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1E293B]">{t.ivasVerification}</p>
                      <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${selected.ivasVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        <Icon name={selected.ivasVerified ? 'verified' : 'hourglass_empty'} className="text-[13px]" />
                        {selected.ivasVerified ? t.ivasVerified : t.ivasPending}
                      </span>
                    </div>
                    {!selected.ivasVerified && (
                      <button
                        type="button"
                        onClick={() => markIvasVerified(selected.id)}
                        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]"
                      >
                        <Icon name="verified" className="text-[16px]" />
                        {t.markIvasVerified}
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
            {(selected.status === 'pending-ivas' || selected.status === 'pending-approval') && (
              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
                <button type="button" onClick={disapproveApplication} className="rounded-full border border-[#DC2626] px-4 py-2 text-sm font-semibold text-[#DC2626] hover:bg-red-50">
                  {t.disapprove}
                </button>
                <button type="button" onClick={approveApplication} className="rounded-full bg-[#00A86B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#048f5c]">
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
