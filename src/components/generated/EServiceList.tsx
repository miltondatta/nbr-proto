import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';
type Status = 'active' | 'draft';

interface EServiceListProps {
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
    cbcPortal: 'CBC Portal',
    pageTitle: 'e-Service List',
    subtitle: 'Category-wise online directory of all services provided by the Customs Bond Commissionerate.',
    backToDashboard: 'Back to Dashboard',
    searchPlaceholder: 'Search services…',
    all: 'All Services',
    adminMode: 'Manage Services',
    addService: 'Add New Service',
    noResultsTitle: 'No services found',
    noResultsBody: 'Try a different search term or category filter.',
    viewDetails: 'View Details',
    processingTime: 'Processing time',
    requiredDocs: 'Required documents',
    active: 'Active',
    draft: 'Draft',
    edit: 'Edit',
    deactivate: 'Deactivate',
    activate: 'Activate',
    delete: 'Delete',
    resultsCount: 'services',
    drawerAddTitle: 'Add New Service',
    drawerEditTitle: 'Edit Service',
    category: 'Category',
    nameEn: 'Service Name (English)',
    nameBn: 'Service Name (Bangla)',
    descEn: 'Description (English)',
    descBn: 'Description (Bangla)',
    icon: 'Icon',
    processingTimeLabel: 'Processing Time',
    docsCount: 'Required Documents (count)',
    status: 'Status',
    cancel: 'Cancel',
    save: 'Save Service',
    confirmDeleteTitle: 'Delete this service?',
    confirmDeleteBody: 'This will remove the service from the public e-Service List. This action can be undone by an administrator later.',
    confirmDeleteAction: 'Delete Service',
    required: 'Required',
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'ই-সার্ভিস লিস্ট',
    subtitle: 'কাস্টমস বন্ড কমিশনারেট কর্তৃক প্রদত্ত সকল সেবার ক্যাটাগরি-ভিত্তিক অনলাইন তালিকা।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    searchPlaceholder: 'সেবা অনুসন্ধান করুন…',
    all: 'সকল সেবা',
    adminMode: 'সেবা ব্যবস্থাপনা',
    addService: 'নতুন সেবা যোগ করুন',
    noResultsTitle: 'কোনো সেবা পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন অনুসন্ধান শব্দ বা ক্যাটাগরি ফিল্টার ব্যবহার করে দেখুন।',
    viewDetails: 'বিস্তারিত দেখুন',
    processingTime: 'প্রক্রিয়াকরণ সময়',
    requiredDocs: 'প্রয়োজনীয় নথি',
    active: 'সক্রিয়',
    draft: 'খসড়া',
    edit: 'সম্পাদনা',
    deactivate: 'নিষ্ক্রিয় করুন',
    activate: 'সক্রিয় করুন',
    delete: 'মুছে ফেলুন',
    resultsCount: 'টি সেবা',
    drawerAddTitle: 'নতুন সেবা যোগ করুন',
    drawerEditTitle: 'সেবা সম্পাদনা করুন',
    category: 'ক্যাটাগরি',
    nameEn: 'সেবার নাম (ইংরেজি)',
    nameBn: 'সেবার নাম (বাংলা)',
    descEn: 'বিবরণ (ইংরেজি)',
    descBn: 'বিবরণ (বাংলা)',
    icon: 'আইকন',
    processingTimeLabel: 'প্রক্রিয়াকরণ সময়',
    docsCount: 'প্রয়োজনীয় নথি (সংখ্যা)',
    status: 'অবস্থা',
    cancel: 'বাতিল',
    save: 'সেবা সংরক্ষণ করুন',
    confirmDeleteTitle: 'এই সেবাটি মুছে ফেলবেন?',
    confirmDeleteBody: 'এটি ই-সার্ভিস লিস্ট থেকে সেবাটি সরিয়ে দেবে। পরবর্তীতে একজন প্রশাসক এটি পুনরুদ্ধার করতে পারবেন।',
    confirmDeleteAction: 'সেবা মুছুন',
    required: 'আবশ্যক',
  },
};

interface Category {
  id: string;
  en: string;
  bn: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  { id: 'licensing', en: 'Bond Licensing', bn: 'বন্ড লাইসেন্সিং', icon: 'assignment', color: '#0A4D8C' },
  { id: 'inventory', en: 'Bond & Inventory', bn: 'বন্ড ও ইনভেন্টরি', icon: 'inventory_2', color: '#00A86B' },
  { id: 'machinery', en: 'Machinery', bn: 'যন্ত্রপাতি', icon: 'precision_manufacturing', color: '#B45309' },
  { id: 'compliance', en: 'Compliance & Legal', bn: 'সম্মতি ও আইনি', icon: 'gavel', color: '#B91C1C' },
  { id: 'utilization', en: 'Utilization & Entitlement', bn: 'ব্যবহার ও এনটাইটেলমেন্ট', icon: 'insights', color: '#6D28D9' },
  { id: 'banking', en: 'Bank & Transfer', bn: 'ব্যাংক ও ট্রান্সফার', icon: 'account_balance', color: '#1E88E5' },
];

interface Service {
  id: string;
  categoryId: string;
  icon: string;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  processing: { en: string; bn: string };
  docsCount: number;
  status: Status;
}

const initialServices: Service[] = [
  {
    id: 'svc-new-license',
    categoryId: 'licensing',
    icon: 'note_add',
    nameEn: 'New Bond License Application',
    nameBn: 'নতুন বন্ড লাইসেন্স আবেদন',
    descEn: 'Apply for a new customs bond license for a bonded manufacturing or trading facility.',
    descBn: 'বন্ডেড উৎপাদন বা ব্যবসা প্রতিষ্ঠানের জন্য নতুন কাস্টমস বন্ড লাইসেন্সের আবেদন।',
    processing: { en: '21 working days', bn: '২১ কার্যদিবস' },
    docsCount: 9,
    status: 'active',
  },
  {
    id: 'svc-ownership-change',
    categoryId: 'licensing',
    icon: 'sync_alt',
    nameEn: 'Bond License Ownership Change',
    nameBn: 'বন্ড লাইসেন্স মালিকানা পরিবর্তন',
    descEn: 'Transfer ownership of an existing bond license to a new proprietor or entity.',
    descBn: 'বিদ্যমান বন্ড লাইসেন্সের মালিকানা নতুন মালিক বা প্রতিষ্ঠানের নামে হস্তান্তর।',
    processing: { en: '15 working days', bn: '১৫ কার্যদিবস' },
    docsCount: 6,
    status: 'active',
  },
  {
    id: 'svc-name-change',
    categoryId: 'licensing',
    icon: 'edit_square',
    nameEn: 'Company Name Change',
    nameBn: 'কোম্পানির নাম পরিবর্তন',
    descEn: 'Update the licensed company name on record after a legal name change.',
    descBn: 'আইনগত নাম পরিবর্তনের পর লাইসেন্সকৃত কোম্পানির নাম হালনাগাদ।',
    processing: { en: '10 working days', bn: '১০ কার্যদিবস' },
    docsCount: 4,
    status: 'active',
  },
  {
    id: 'svc-hs-code',
    categoryId: 'licensing',
    icon: 'tag',
    nameEn: 'HS Code Inclusion Request',
    nameBn: 'এইচএস কোড অন্তর্ভুক্তির অনুরোধ',
    descEn: 'Request inclusion of additional raw material HS Codes under an existing bond license.',
    descBn: 'বিদ্যমান বন্ড লাইসেন্সের আওতায় অতিরিক্ত কাঁচামালের এইচএস কোড অন্তর্ভুক্তির অনুরোধ।',
    processing: { en: '10 working days', bn: '১০ কার্যদিবস' },
    docsCount: 3,
    status: 'active',
  },
  {
    id: 'svc-general-bond',
    categoryId: 'inventory',
    icon: 'description',
    nameEn: 'General Bond Renewal',
    nameBn: 'জেনারেল বন্ড নবায়ন',
    descEn: 'Renew the General Bond executed against an active bond license before expiry.',
    descBn: 'মেয়াদ শেষ হওয়ার পূর্বে সক্রিয় বন্ড লাইসেন্সের বিপরীতে জেনারেল বন্ড নবায়ন।',
    processing: { en: '7 working days', bn: '৭ কার্যদিবস' },
    docsCount: 2,
    status: 'active',
  },
  {
    id: 'svc-passbook',
    categoryId: 'inventory',
    icon: 'import_contacts',
    nameEn: 'e-Passbook Issuance',
    nameBn: 'ই-পাসবুক ইস্যু',
    descEn: 'Automatically issued electronic passbook recording import, export and utilization entries.',
    descBn: 'আমদানি, রপ্তানি ও ব্যবহারের তথ্য রেকর্ড করে স্বয়ংক্রিয়ভাবে ইস্যুকৃত ইলেকট্রনিক পাসবুক।',
    processing: { en: 'Instant (system-generated)', bn: 'তাৎক্ষণিক (সিস্টেম জেনারেটেড)' },
    docsCount: 0,
    status: 'active',
  },
  {
    id: 'svc-local-purchase',
    categoryId: 'inventory',
    icon: 'shopping_cart',
    nameEn: 'Local Purchase & Sales Entry',
    nameBn: 'স্থানীয় ক্রয় ও বিক্রয় এন্ট্রি',
    descEn: 'Record local procurement and sale of bonded raw materials and finished goods.',
    descBn: 'বন্ডেড কাঁচামাল ও তৈরি পণ্যের স্থানীয় ক্রয়-বিক্রয় নথিভুক্তকরণ।',
    processing: { en: '3 working days', bn: '৩ কার্যদিবস' },
    docsCount: 3,
    status: 'active',
  },
  {
    id: 'svc-ex-bond',
    categoryId: 'inventory',
    icon: 'call_made',
    nameEn: 'Ex-Bond Entry',
    nameBn: 'এক্স-বন্ড এন্ট্রি',
    descEn: 'Apply for supervised release of bonded goods into the local market.',
    descBn: 'বন্ডেড পণ্য তত্ত্বাবধানে স্থানীয় বাজারে অবমুক্তির জন্য আবেদন।',
    processing: { en: '5 working days', bn: '৫ কার্যদিবস' },
    docsCount: 4,
    status: 'active',
  },
  {
    id: 'svc-machinery-reg',
    categoryId: 'machinery',
    icon: 'precision_manufacturing',
    nameEn: 'Machinery Registration',
    nameBn: 'যন্ত্রপাতি নিবন্ধন',
    descEn: 'Register new machinery imported or purchased under a bonded facility.',
    descBn: 'বন্ডেড প্রতিষ্ঠানের আওতায় আমদানি বা ক্রয়কৃত নতুন যন্ত্রপাতি নিবন্ধন।',
    processing: { en: '12 working days', bn: '১২ কার্যদিবস' },
    docsCount: 5,
    status: 'active',
  },
  {
    id: 'svc-machinery-sale',
    categoryId: 'machinery',
    icon: 'sell',
    nameEn: 'Machinery Sale / Transfer Approval',
    nameBn: 'যন্ত্রপাতি বিক্রয় / হস্তান্তর অনুমোদন',
    descEn: 'Seek approval to sell or transfer registered bonded machinery.',
    descBn: 'নিবন্ধিত বন্ডেড যন্ত্রপাতি বিক্রয় বা হস্তান্তরের জন্য অনুমোদন গ্রহণ।',
    processing: { en: '10 working days', bn: '১০ কার্যদিবস' },
    docsCount: 4,
    status: 'active',
  },
  {
    id: 'svc-machinery-decommission',
    categoryId: 'machinery',
    icon: 'power_off',
    nameEn: 'Machinery Decommissioning',
    nameBn: 'যন্ত্রপাতি অবলুপ্তকরণ',
    descEn: 'Apply to decommission and remove machinery from the bonded inventory.',
    descBn: 'বন্ডেড ইনভেন্টরি থেকে যন্ত্রপাতি অবলুপ্ত ও অপসারণের আবেদন।',
    processing: { en: '15 working days', bn: '১৫ কার্যদিবস' },
    docsCount: 3,
    status: 'draft',
  },
  {
    id: 'svc-lien-bank',
    categoryId: 'banking',
    icon: 'account_balance',
    nameEn: 'Lien Bank Addition / Change',
    nameBn: 'লিয়েন ব্যাংক সংযোজন / পরিবর্তন',
    descEn: 'Add a new lien bank or change the existing lien bank linked to a bond license.',
    descBn: 'নতুন লিয়েন ব্যাংক সংযোজন অথবা বন্ড লাইসেন্সের সাথে সংযুক্ত বিদ্যমান লিয়েন ব্যাংক পরিবর্তন।',
    processing: { en: '7 working days', bn: '৭ কার্যদিবস' },
    docsCount: 3,
    status: 'active',
  },
  {
    id: 'svc-inter-bond',
    categoryId: 'banking',
    icon: 'compare_arrows',
    nameEn: 'Inter-Bond Transfer',
    nameBn: 'ইন্টার-বন্ড ট্রান্সফার',
    descEn: 'Transfer raw materials or machinery between two licensed bonded organizations.',
    descBn: 'দুটি লাইসেন্সপ্রাপ্ত বন্ডেড প্রতিষ্ঠানের মধ্যে কাঁচামাল বা যন্ত্রপাতি হস্তান্তর।',
    processing: { en: '10 working days', bn: '১০ কার্যদিবস' },
    docsCount: 5,
    status: 'active',
  },
  {
    id: 'svc-sub-contract',
    categoryId: 'banking',
    icon: 'handshake',
    nameEn: 'Sub-Contract Registration',
    nameBn: 'সাব-কন্ট্রাক্ট নিবন্ধন',
    descEn: 'Register a subcontract manufacturing arrangement between bonded organizations.',
    descBn: 'বন্ডেড প্রতিষ্ঠানসমূহের মধ্যে সাব-কন্ট্রাক্ট উৎপাদন ব্যবস্থা নিবন্ধন।',
    processing: { en: '10 working days', bn: '১০ কার্যদিবস' },
    docsCount: 4,
    status: 'draft',
  },
  {
    id: 'svc-audit',
    categoryId: 'compliance',
    icon: 'fact_check',
    nameEn: 'Annual Audit Scheduling',
    nameBn: 'বার্ষিক নিরীক্ষা সময়সূচি',
    descEn: 'Schedule and track the mandatory annual audit for a bonded organization.',
    descBn: 'বন্ডেড প্রতিষ্ঠানের বাধ্যতামূলক বার্ষিক নিরীক্ষার সময়সূচি ও অগ্রগতি ট্র্যাকিং।',
    processing: { en: '30 working days', bn: '৩০ কার্যদিবস' },
    docsCount: 7,
    status: 'active',
  },
  {
    id: 'svc-legal',
    categoryId: 'compliance',
    icon: 'balance',
    nameEn: 'Legal Case Filing & Show Cause Response',
    nameBn: 'আইনি মামলা দায়ের ও শোকজ জবাব',
    descEn: 'Respond to show cause notices and track legal or adjudication case status.',
    descBn: 'শোকজ নোটিশের জবাব প্রদান এবং আইনি বা বিচারিক মামলার অবস্থা ট্র্যাকিং।',
    processing: { en: 'Varies by case', bn: 'মামলাভেদে পরিবর্তনশীল' },
    docsCount: 5,
    status: 'draft',
  },
  {
    id: 'svc-ud',
    categoryId: 'utilization',
    icon: 'cloud_sync',
    nameEn: 'UD Integration & Verification',
    nameBn: 'ইউডি ইন্টিগ্রেশন ও যাচাইকরণ',
    descEn: 'Sync and verify Utilization Declarations received from BGMEA/BKMEA systems.',
    descBn: 'BGMEA/BKMEA সিস্টেম থেকে প্রাপ্ত ইউটিলাইজেশন ডিক্লারেশন সিঙ্ক ও যাচাইকরণ।',
    processing: { en: '5 working days', bn: '৫ কার্যদিবস' },
    docsCount: 2,
    status: 'active',
  },
  {
    id: 'svc-entitlement',
    categoryId: 'utilization',
    icon: 'pie_chart',
    nameEn: 'Entitlement Assessment',
    nameBn: 'এনটাইটেলমেন্ট মূল্যায়ন',
    descEn: 'Assess duty-free raw material entitlement based on production capacity.',
    descBn: 'উৎপাদন সক্ষমতার ভিত্তিতে শুল্কমুক্ত কাঁচামাল এনটাইটেলমেন্ট মূল্যায়ন।',
    processing: { en: '20 working days', bn: '২০ কার্যদিবস' },
    docsCount: 6,
    status: 'active',
  },
  {
    id: 'svc-up',
    categoryId: 'utilization',
    icon: 'verified_user',
    nameEn: 'Utilization Permission (UP)',
    nameBn: 'ইউটিলাইজেশন পারমিশন (ইউপি)',
    descEn: 'Apply for permission to utilize imported bonded raw materials in production.',
    descBn: 'উৎপাদনে আমদানিকৃত বন্ডেড কাঁচামাল ব্যবহারের অনুমতির জন্য আবেদন।',
    processing: { en: '14 working days', bn: '১৪ কার্যদিবস' },
    docsCount: 4,
    status: 'active',
  },
];

const iconChoices = [
  'note_add', 'sync_alt', 'edit_square', 'tag', 'description', 'import_contacts', 'shopping_cart', 'call_made',
  'precision_manufacturing', 'sell', 'power_off', 'account_balance', 'compare_arrows', 'handshake', 'fact_check',
  'balance', 'cloud_sync', 'pie_chart', 'verified_user', 'inventory_2',
];

function categoryOf(id: string) {
  return categories.find((c) => c.id === id)!;
}

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

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';

const emptyDraft = (): Service => ({
  id: `svc-${Date.now()}`,
  categoryId: categories[0].id,
  icon: iconChoices[0],
  nameEn: '',
  nameBn: '',
  descEn: '',
  descBn: '',
  processing: { en: '', bn: '' },
  docsCount: 0,
  status: 'draft',
});

export function EServiceList({ language, onDone }: EServiceListProps) {
  const t = T[language];
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; draft: Service } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((s) => {
      const matchesCategory = !activeCategory || s.categoryId === activeCategory;
      const matchesSearch =
        !q ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameBn.includes(q) ||
        s.descEn.toLowerCase().includes(q) ||
        s.descBn.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [services, search, activeCategory]);

  const countFor = (catId: string | null) => services.filter((s) => !catId || s.categoryId === catId).length;

  const openAdd = () => setDrawer({ mode: 'add', draft: emptyDraft() });
  const openEdit = (svc: Service) => setDrawer({ mode: 'edit', draft: { ...svc } });

  const saveDraft = () => {
    if (!drawer) return;
    const d = drawer.draft;
    if (!d.nameEn || !d.nameBn) return;
    setServices((prev) => {
      if (drawer.mode === 'add') return [d, ...prev];
      return prev.map((s) => (s.id === d.id ? d : s));
    });
    setDrawer(null);
  };

  const toggleStatus = (id: string) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'draft' : 'active' } : s)));

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.cbcPortal}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#94A3B8]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-full border border-[#E2E8F0] bg-[#F5F7FA] py-2.5 pl-10 pr-4 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:bg-white focus:ring-2 focus:ring-[#1E88E5]/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-semibold text-[#334155]">
              {t.adminMode}
              <button
                type="button"
                role="switch"
                aria-checked={adminMode}
                onClick={() => setAdminMode((v) => !v)}
                className={[
                  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5] focus-visible:ring-offset-2',
                  adminMode ? 'bg-[#0A4D8C]' : 'bg-[#CBD5E1]',
                ].join(' ')}
              >
                <span
                  className={[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
                    adminMode ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                />
              </button>
            </label>
            {adminMode && (
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#048f5c]"
              >
                <Icon name="add" className="text-[16px]" />
                {t.addService}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              activeCategory === null ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
            ].join(' ')}
          >
            {t.all} ({countFor(null)})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={[
                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                activeCategory === c.id ? 'text-white' : 'text-[#334155] hover:border-[#0A4D8C]',
              ].join(' ')}
              style={activeCategory === c.id ? { backgroundColor: c.color, borderColor: c.color } : { borderColor: '#CBD5E1' }}
            >
              <Icon name={c.icon} className="text-[14px]" />
              {c[language]} ({countFor(c.id)})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
          <Icon name="search_off" className="text-[36px] text-[#94A3B8]" />
          <h2 className="text-sm font-bold text-[#1E293B]">{t.noResultsTitle}</h2>
          <p className="text-xs text-[#64748B]">{t.noResultsBody}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => {
            const cat = categoryOf(s.categoryId);
            return (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
                  >
                    <Icon name={s.icon} className="text-[22px]" />
                  </span>
                  {adminMode && (
                    <button
                      type="button"
                      onClick={() => toggleStatus(s.id)}
                      className={[
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                        s.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
                      ].join(' ')}
                      title={s.status === 'active' ? t.deactivate : t.activate}
                    >
                      {s.status === 'active' ? t.active : t.draft}
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
                    {cat[language]}
                  </span>
                  <h3 className="mt-0.5 text-sm font-bold leading-snug text-[#1E293B]">{s[language === 'en' ? 'nameEn' : 'nameBn']}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#64748B]">
                    {s[language === 'en' ? 'descEn' : 'descBn']}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-[#F1F5F9] pt-3 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <Icon name="schedule" className="text-[14px] text-[#94A3B8]" />
                    {t.processingTime}: <span className="font-medium text-[#334155]">{s.processing[language]}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="folder_copy" className="text-[14px] text-[#94A3B8]" />
                    {t.requiredDocs}: <span className="font-medium text-[#334155]">{s.docsCount}</span>
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3">
                  {adminMode ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]"
                      >
                        <Icon name="edit" className="text-[16px]" />
                        {t.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(s.id)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50"
                      >
                        <Icon name="delete" className="text-[16px]" />
                        {t.delete}
                      </button>
                    </div>
                  ) : (
                    <span />
                  )}
                  <button type="button" className="flex items-center gap-1 text-xs font-semibold text-[#1E88E5] hover:underline">
                    {t.viewDetails}
                    <Icon name="arrow_forward" className="text-[14px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setDrawer(null)}>
          <div
            className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">
                {drawer.mode === 'add' ? t.drawerAddTitle : t.drawerEditTitle}
              </h2>
              <button type="button" onClick={() => setDrawer(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4 px-5 py-5">
              <Field label={t.category} required>
                <select
                  value={drawer.draft.categoryId}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, categoryId: e.target.value } })}
                  className={inputClass}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c[language]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t.icon}>
                <div className="flex flex-wrap gap-1.5">
                  {iconChoices.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setDrawer({ ...drawer, draft: { ...drawer.draft, icon: ic } })}
                      className={[
                        'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                        drawer.draft.icon === ic ? 'border-[#0A4D8C] bg-[#EAF3FE] text-[#0A4D8C]' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#0A4D8C]',
                      ].join(' ')}
                    >
                      <Icon name={ic} className="text-[18px]" />
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t.nameEn} required>
                <input
                  value={drawer.draft.nameEn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, nameEn: e.target.value } })}
                  placeholder="e.g. Machinery Registration"
                  className={inputClass}
                />
              </Field>
              <Field label={t.nameBn} required>
                <input
                  value={drawer.draft.nameBn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, nameBn: e.target.value } })}
                  placeholder="যেমন: যন্ত্রপাতি নিবন্ধন"
                  className={inputClass}
                />
              </Field>
              <Field label={t.descEn}>
                <textarea
                  value={drawer.draft.descEn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, descEn: e.target.value } })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <Field label={t.descBn}>
                <textarea
                  value={drawer.draft.descBn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, descBn: e.target.value } })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t.processingTimeLabel}>
                  <input
                    value={drawer.draft.processing[language]}
                    onChange={(e) =>
                      setDrawer({
                        ...drawer,
                        draft: { ...drawer.draft, processing: { ...drawer.draft.processing, [language]: e.target.value } },
                      })
                    }
                    placeholder="10 working days"
                    className={inputClass}
                  />
                </Field>
                <Field label={t.docsCount}>
                  <input
                    type="number"
                    min={0}
                    value={drawer.draft.docsCount}
                    onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, docsCount: Number(e.target.value) } })}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label={t.status}>
                <div className="flex gap-2">
                  {(['active', 'draft'] as Status[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDrawer({ ...drawer, draft: { ...drawer.draft, status: st } })}
                      className={[
                        'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                        drawer.draft.status === st ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155]',
                      ].join(' ')}
                    >
                      {st === 'active' ? t.active : t.draft}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button
                type="button"
                onClick={() => setDrawer(null)}
                className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={!drawer.draft.nameEn || !drawer.draft.nameBn}
                className="rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-40"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setConfirmDeleteId(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#DC2626]">
                <Icon name="warning" className="text-[22px]" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#1E293B]">{t.confirmDeleteTitle}</h2>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{t.confirmDeleteBody}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => removeService(confirmDeleteId)}
                className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]"
              >
                {t.confirmDeleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
