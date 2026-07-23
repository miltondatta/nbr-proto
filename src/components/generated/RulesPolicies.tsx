import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';
type DocType = 'act' | 'rule' | 'sro' | 'guideline' | 'policy';
type DocStatus = 'active' | 'superseded';

interface RulesPoliciesProps {
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
    pageTitle: 'Rules & Policies',
    subtitle: 'Online directory of Acts, Rules, SROs, Circulars, Guidelines and Policies governing all Customs Bond Commissionerate services.',
    backToDashboard: 'Back to Dashboard',
    manageContent: 'Manage Directory',
    addDocument: 'Add Document',
    searchPlaceholder: 'Search rules, policies, reference numbers…',
    all: 'All Documents',
    noResultsTitle: 'No documents found',
    noResultsBody: 'Try a different search term or document type filter.',
    refNo: 'Reference No.',
    issued: 'Issued',
    active: 'Active',
    superseded: 'Superseded',
    download: 'Download',
    edit: 'Edit',
    delete: 'Delete',
    drawerAddTitle: 'Add Document',
    drawerEditTitle: 'Edit Document',
    docType: 'Document Type',
    titleEn: 'Title (English)',
    titleBn: 'Title (Bangla)',
    descEn: 'Summary (English)',
    descBn: 'Summary (Bangla)',
    refNoLabel: 'Reference / Gazette No.',
    issueDate: 'Issue Date',
    fileSize: 'File Size',
    status: 'Status',
    cancel: 'Cancel',
    save: 'Save Document',
    confirmDeleteTitle: 'Remove this document?',
    confirmDeleteBody: 'This will remove the document from the public Rules & Policies directory.',
    confirmDeleteAction: 'Remove Document',
    types: {
      act: 'Act',
      rule: 'Rule',
      sro: 'SRO / Circular',
      guideline: 'Guideline',
      policy: 'Policy',
    },
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'নিয়ম ও নীতিমালা',
    subtitle: 'কাস্টমস বন্ড কমিশনারেটের সকল সেবা পরিচালনাকারী আইন, বিধি, এসআরও, সার্কুলার, নির্দেশিকা ও নীতিমালার অনলাইন ডিরেক্টরি।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    manageContent: 'ডিরেক্টরি ব্যবস্থাপনা',
    addDocument: 'নথি যোগ করুন',
    searchPlaceholder: 'নিয়ম, নীতিমালা, রেফারেন্স নম্বর অনুসন্ধান করুন…',
    all: 'সকল নথি',
    noResultsTitle: 'কোনো নথি পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন অনুসন্ধান শব্দ বা নথির ধরন ফিল্টার ব্যবহার করে দেখুন।',
    refNo: 'রেফারেন্স নং',
    issued: 'জারির তারিখ',
    active: 'সক্রিয়',
    superseded: 'বাতিলকৃত',
    download: 'ডাউনলোড',
    edit: 'সম্পাদনা',
    delete: 'মুছে ফেলুন',
    drawerAddTitle: 'নথি যোগ করুন',
    drawerEditTitle: 'নথি সম্পাদনা করুন',
    docType: 'নথির ধরন',
    titleEn: 'শিরোনাম (ইংরেজি)',
    titleBn: 'শিরোনাম (বাংলা)',
    descEn: 'সারসংক্ষেপ (ইংরেজি)',
    descBn: 'সারসংক্ষেপ (বাংলা)',
    refNoLabel: 'রেফারেন্স / গেজেট নং',
    issueDate: 'জারির তারিখ',
    fileSize: 'ফাইল সাইজ',
    status: 'অবস্থা',
    cancel: 'বাতিল',
    save: 'নথি সংরক্ষণ করুন',
    confirmDeleteTitle: 'এই নথিটি সরাবেন?',
    confirmDeleteBody: 'এটি নিয়ম ও নীতিমালা ডিরেক্টরি থেকে নথিটি সরিয়ে দেবে।',
    confirmDeleteAction: 'নথি সরান',
    types: {
      act: 'আইন',
      rule: 'বিধি',
      sro: 'এসআরও / সার্কুলার',
      guideline: 'নির্দেশিকা',
      policy: 'নীতিমালা',
    },
  },
};

const typeStyles: Record<DocType, { icon: string; color: string }> = {
  act: { icon: 'gavel', color: '#0A4D8C' },
  rule: { icon: 'rule', color: '#00A86B' },
  sro: { icon: 'campaign', color: '#B45309' },
  guideline: { icon: 'menu_book', color: '#6D28D9' },
  policy: { icon: 'policy', color: '#B91C1C' },
};

const docTypes: DocType[] = ['act', 'rule', 'sro', 'guideline', 'policy'];

interface Doc {
  id: string;
  type: DocType;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  refNo: string;
  issueDate: string;
  fileSize: string;
  status: DocStatus;
}

const initialDocs: Doc[] = [
  {
    id: 'doc-customs-act',
    type: 'act',
    titleEn: 'The Customs Act, 1969 (as amended 2023)',
    titleBn: 'কাস্টমস আইন, ১৯৬৯ (সংশোধিত ২০২৩)',
    descEn: 'Principal legislation governing customs administration, including bonded warehouse licensing and control provisions.',
    descBn: 'বন্ডেড গুদাম লাইসেন্সিং ও নিয়ন্ত্রণ বিধানসহ কাস্টমস প্রশাসন পরিচালনাকারী মূল আইন।',
    refNo: 'Act No. IV of 1969',
    issueDate: '15 Mar 2023',
    fileSize: '2.4 MB',
    status: 'active',
  },
  {
    id: 'doc-bond-license-rules',
    type: 'rule',
    titleEn: 'Bond License Rules, 2018',
    titleBn: 'বন্ড লাইসেন্স বিধিমালা, ২০১৮',
    descEn: 'Detailed procedural rules for issuance, renewal, ownership change and cancellation of bond licences.',
    descBn: 'বন্ড লাইসেন্স ইস্যু, নবায়ন, মালিকানা পরিবর্তন ও বাতিলের বিস্তারিত পদ্ধতিগত বিধি।',
    refNo: 'S.R.O. 96-AIN/2018',
    issueDate: '02 Apr 2018',
    fileSize: '860 KB',
    status: 'active',
  },
  {
    id: 'doc-warehouse-amendment',
    type: 'sro',
    titleEn: 'Bonded Warehouse (Amendment) SRO',
    titleBn: 'বন্ডেড গুদাম (সংশোধন) এসআরও',
    descEn: 'Amends bonded warehouse licensing conditions and introduces revised security deposit requirements.',
    descBn: 'বন্ডেড গুদাম লাইসেন্সিং শর্তাবলী সংশোধন এবং জামানত সংক্রান্ত সংশোধিত প্রয়োজনীয়তা প্রবর্তন।',
    refNo: 'S.R.O. 145-AIN/2023',
    issueDate: '11 Jun 2023',
    fileSize: '410 KB',
    status: 'active',
  },
  {
    id: 'doc-hs-code-circular',
    type: 'sro',
    titleEn: 'Revised HS Code Verification Process',
    titleBn: 'সংশোধিত এইচএস কোড যাচাইকরণ প্রক্রিয়া',
    descEn: 'NBR circular introducing the revised verification workflow for raw material HS Code inclusion requests.',
    descBn: 'কাঁচামালের এইচএস কোড অন্তর্ভুক্তির আবেদনের জন্য সংশোধিত যাচাইকরণ পদ্ধতি সংক্রান্ত এনবিআর সার্কুলার।',
    refNo: 'NBR/Cus/Bond/2026/17',
    issueDate: '20 Jul 2026',
    fileSize: '295 KB',
    status: 'active',
  },
  {
    id: 'doc-general-bond-guideline',
    type: 'guideline',
    titleEn: 'General Bond Execution Guidelines, 2021',
    titleBn: 'জেনারেল বন্ড সম্পাদন নির্দেশিকা, ২০২১',
    descEn: 'Step-by-step guidance for executing, renewing and extending General Bonds against a bond licence.',
    descBn: 'বন্ড লাইসেন্সের বিপরীতে জেনারেল বন্ড সম্পাদন, নবায়ন ও মেয়াদ বৃদ্ধির ধাপে ধাপে নির্দেশনা।',
    refNo: 'CBC/GDL/2021-04',
    issueDate: '18 Jan 2021',
    fileSize: '540 KB',
    status: 'active',
  },
  {
    id: 'doc-audit-policy',
    type: 'policy',
    titleEn: 'Annual Audit Policy for Bonded Warehouses, 2022',
    titleBn: 'বন্ডেড গুদামের বার্ষিক নিরীক্ষা নীতিমালা, ২০২২',
    descEn: 'Defines audit frequency, scope, reconciliation requirements and non-compliance escalation procedures.',
    descBn: 'নিরীক্ষার পর্যায়ক্রম, পরিধি, মিলকরণ প্রয়োজনীয়তা এবং অ-সম্মতি উর্ধ্বতনকরণ পদ্ধতি নির্ধারণ করে।',
    refNo: 'CBC/POL/2022-11',
    issueDate: '30 Aug 2022',
    fileSize: '1.1 MB',
    status: 'active',
  },
  {
    id: 'doc-machinery-rules',
    type: 'rule',
    titleEn: 'Machinery Import & Decommissioning Rules, 2019',
    titleBn: 'যন্ত্রপাতি আমদানি ও অবলুপ্তকরণ বিধিমালা, ২০১৯',
    descEn: 'Rules governing import, sale, transfer and decommissioning of machinery under bonded facilities.',
    descBn: 'বন্ডেড প্রতিষ্ঠানের আওতায় যন্ত্রপাতি আমদানি, বিক্রয়, হস্তান্তর ও অবলুপ্তকরণ পরিচালনাকারী বিধি।',
    refNo: 'S.R.O. 212-AIN/2019',
    issueDate: '07 Oct 2019',
    fileSize: '705 KB',
    status: 'active',
  },
  {
    id: 'doc-lien-bank-policy',
    type: 'policy',
    titleEn: 'Lien Bank Empanelment Policy, 2020',
    titleBn: 'লিয়েন ব্যাংক তালিকাভুক্তকরণ নীতিমালা, ২০২০',
    descEn: 'Eligibility criteria and empanelment procedure for scheduled banks acting as lien banks for bonders.',
    descBn: 'বন্ডকারীদের জন্য লিয়েন ব্যাংক হিসেবে তফসিলি ব্যাংকের যোগ্যতা মানদণ্ড ও তালিকাভুক্তকরণ পদ্ধতি।',
    refNo: 'CBC/POL/2020-07',
    issueDate: '14 Feb 2020',
    fileSize: '380 KB',
    status: 'active',
  },
  {
    id: 'doc-ud-verification',
    type: 'sro',
    titleEn: 'Utilization Declaration (UD) Verification SRO',
    titleBn: 'ইউটিলাইজেশন ডিক্লারেশন (ইউডি) যাচাইকরণ এসআরও',
    descEn: 'Establishes the verification mechanism for UD data received from BGMEA/BKMEA systems.',
    descBn: 'BGMEA/BKMEA সিস্টেম থেকে প্রাপ্ত ইউডি তথ্যের যাচাইকরণ পদ্ধতি নির্ধারণ করে।',
    refNo: 'S.R.O. 88-AIN/2022',
    issueDate: '05 May 2022',
    fileSize: '325 KB',
    status: 'superseded',
  },
  {
    id: 'doc-subcontract-guideline',
    type: 'guideline',
    titleEn: 'Sub-Contract Manufacturing Guidelines, 2023',
    titleBn: 'সাব-কন্ট্রাক্ট উৎপাদন নির্দেশিকা, ২০২৩',
    descEn: 'Operating guidance for subcontract manufacturing arrangements between bonded organizations.',
    descBn: 'বন্ডেড প্রতিষ্ঠানসমূহের মধ্যে সাব-কন্ট্রাক্ট উৎপাদন ব্যবস্থার পরিচালনা নির্দেশিকা।',
    refNo: 'CBC/GDL/2023-02',
    issueDate: '09 Mar 2023',
    fileSize: '465 KB',
    status: 'active',
  },
  {
    id: 'doc-licensing-fees-sro',
    type: 'sro',
    titleEn: 'Bonded Warehouse Licensing (Fees & Renewal) SRO',
    titleBn: 'বন্ডেড গুদাম লাইসেন্সিং (ফি ও নবায়ন) এসআরও',
    descEn: 'Revises licence fees, renewal charges and late-renewal penalty structure for bonded warehouses.',
    descBn: 'বন্ডেড গুদামের লাইসেন্স ফি, নবায়ন চার্জ এবং বিলম্বিত নবায়ন জরিমানার কাঠামো সংশোধন করে।',
    refNo: 'S.R.O. 210-AIN/2024',
    issueDate: '22 Sep 2024',
    fileSize: '298 KB',
    status: 'active',
  },
  {
    id: 'doc-inventory-policy',
    type: 'policy',
    titleEn: 'Anti-Pilferage & Inventory Monitoring Policy, 2021',
    titleBn: 'পিলফারেজ প্রতিরোধ ও ইনভেন্টরি মনিটরিং নীতিমালা, ২০২১',
    descEn: 'Sets minimum inventory monitoring, reconciliation and reporting standards to prevent pilferage.',
    descBn: 'পিলফারেজ প্রতিরোধে ন্যূনতম ইনভেন্টরি মনিটরিং, মিলকরণ ও প্রতিবেদন মান নির্ধারণ করে।',
    refNo: 'CBC/POL/2021-09',
    issueDate: '25 Nov 2021',
    fileSize: '620 KB',
    status: 'active',
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

const emptyDraft = (): Doc => ({
  id: `doc-${Date.now()}`,
  type: 'guideline',
  titleEn: '',
  titleBn: '',
  descEn: '',
  descBn: '',
  refNo: '',
  issueDate: '',
  fileSize: '',
  status: 'active',
});

export function RulesPolicies({ language, onDone }: RulesPoliciesProps) {
  const t = T[language];
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<DocType | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; draft: Doc } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter((d) => {
      const matchesType = !activeType || d.type === activeType;
      const matchesSearch =
        !q ||
        d.titleEn.toLowerCase().includes(q) ||
        d.titleBn.includes(q) ||
        d.refNo.toLowerCase().includes(q) ||
        d.descEn.toLowerCase().includes(q) ||
        d.descBn.includes(q);
      return matchesType && matchesSearch;
    });
  }, [docs, search, activeType]);

  const countFor = (type: DocType | null) => docs.filter((d) => !type || d.type === type).length;

  const openAdd = () => setDrawer({ mode: 'add', draft: emptyDraft() });
  const openEdit = (d: Doc) => setDrawer({ mode: 'edit', draft: { ...d } });

  const saveDraft = () => {
    if (!drawer) return;
    const d = drawer.draft;
    if (!d.titleEn || !d.titleBn) return;
    setDocs((prev) => (drawer.mode === 'add' ? [d, ...prev] : prev.map((x) => (x.id === d.id ? d : x))));
    setDrawer(null);
  };

  const removeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
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
              {t.manageContent}
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
                {t.addDocument}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveType(null)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              activeType === null ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
            ].join(' ')}
          >
            {t.all} ({countFor(null)})
          </button>
          {docTypes.map((type) => {
            const style = typeStyles[type];
            const isActive = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={['flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', isActive ? 'text-white' : 'text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
                style={isActive ? { backgroundColor: style.color, borderColor: style.color } : { borderColor: '#CBD5E1' }}
              >
                <Icon name={style.icon} className="text-[14px]" />
                {t.types[type]} ({countFor(type)})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
          <Icon name="search_off" className="text-[36px] text-[#94A3B8]" />
          <h2 className="text-sm font-bold text-[#1E293B]">{t.noResultsTitle}</h2>
          <p className="text-xs text-[#64748B]">{t.noResultsBody}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((d) => {
            const style = typeStyles[d.type];
            return (
              <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${style.color}1A`, color: style.color }}
                >
                  <Icon name={style.icon} className="text-[22px]" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: `${style.color}1A`, color: style.color }}>
                      {t.types[d.type]}
                    </span>
                    {d.status === 'superseded' && (
                      <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#64748B]">
                        {t.superseded}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-sm font-bold leading-snug text-[#1E293B]">{d[language === 'en' ? 'titleEn' : 'titleBn']}</h3>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#64748B]">{d[language === 'en' ? 'descEn' : 'descBn']}</p>
                </div>

                <div className="flex shrink-0 flex-col gap-1 text-[11px] text-[#64748B] sm:w-44">
                  <span className="flex items-center gap-1.5">
                    <Icon name="tag" className="text-[13px] text-[#94A3B8]" />
                    {t.refNo}: <span className="font-medium text-[#334155]">{d.refNo}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="event" className="text-[13px] text-[#94A3B8]" />
                    {t.issued}: <span className="font-medium text-[#334155]">{d.issueDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="description" className="text-[13px] text-[#94A3B8]" />
                    PDF · <span className="font-medium text-[#334155]">{d.fileSize}</span>
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 border-t border-[#F1F5F9] pt-3 sm:border-t-0 sm:pt-0">
                  {adminMode && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(d)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]"
                      >
                        <Icon name="edit" className="text-[16px]" />
                        {t.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(d.id)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50"
                      >
                        <Icon name="delete" className="text-[16px]" />
                        {t.delete}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg border border-[#CBD5E1] px-3 py-1.5 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
                  >
                    <Icon name="download" className="text-[16px]" />
                    {t.download}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setDrawer(null)}>
          <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{drawer.mode === 'add' ? t.drawerAddTitle : t.drawerEditTitle}</h2>
              <button type="button" onClick={() => setDrawer(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4 px-5 py-5">
              <Field label={t.docType} required>
                <select
                  value={drawer.draft.type}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, type: e.target.value as DocType } })}
                  className={inputClass}
                >
                  {docTypes.map((type) => (
                    <option key={type} value={type}>
                      {t.types[type]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t.titleEn} required>
                <input
                  value={drawer.draft.titleEn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, titleEn: e.target.value } })}
                  placeholder="e.g. Bonded Warehouse Security Guidelines, 2026"
                  className={inputClass}
                />
              </Field>
              <Field label={t.titleBn} required>
                <input
                  value={drawer.draft.titleBn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, titleBn: e.target.value } })}
                  placeholder="যেমন: বন্ডেড গুদাম নিরাপত্তা নির্দেশিকা, ২০২৬"
                  className={inputClass}
                />
              </Field>
              <Field label={t.descEn}>
                <textarea
                  rows={3}
                  value={drawer.draft.descEn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, descEn: e.target.value } })}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <Field label={t.descBn}>
                <textarea
                  rows={3}
                  value={drawer.draft.descBn}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, descBn: e.target.value } })}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t.refNoLabel}>
                  <input
                    value={drawer.draft.refNo}
                    onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, refNo: e.target.value } })}
                    placeholder="S.R.O. 000-AIN/2026"
                    className={inputClass}
                  />
                </Field>
                <Field label={t.issueDate}>
                  <input
                    value={drawer.draft.issueDate}
                    onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, issueDate: e.target.value } })}
                    placeholder="23 Jul 2026"
                    className={inputClass}
                  />
                </Field>
                <Field label={t.fileSize}>
                  <input
                    value={drawer.draft.fileSize}
                    onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, fileSize: e.target.value } })}
                    placeholder="480 KB"
                    className={inputClass}
                  />
                </Field>
                <Field label={t.status}>
                  <div className="flex gap-2 pt-1">
                    {(['active', 'superseded'] as DocStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setDrawer({ ...drawer, draft: { ...drawer.draft, status: st } })}
                        className={[
                          'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                          drawer.draft.status === st ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155]',
                        ].join(' ')}
                      >
                        {st === 'active' ? t.active : t.superseded}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDrawer(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={!drawer.draft.titleEn || !drawer.draft.titleBn}
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
              <button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button type="button" onClick={() => removeDoc(confirmDeleteId)} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                {t.confirmDeleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
