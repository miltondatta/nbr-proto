import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';
type NoticeCategory = 'general' | 'circular' | 'tender' | 'holiday' | 'maintenance' | 'deadline';

interface NoticesProps {
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
    pageTitle: 'Notices',
    subtitle: 'Official notice board of the Customs Bond Commissionerate — circulars, tenders, holidays, deadlines and system alerts.',
    backToDashboard: 'Back to Dashboard',
    manageContent: 'Manage Notices',
    addNotice: 'Add Notice',
    searchPlaceholder: 'Search notices…',
    all: 'All Notices',
    noResultsTitle: 'No notices found',
    noResultsBody: 'Try a different search term or category filter.',
    pinned: 'Pinned',
    pin: 'Pin',
    unpin: 'Unpin',
    edit: 'Edit',
    delete: 'Delete',
    download: 'Download attachment',
    new: 'New',
    drawerAddTitle: 'Add Notice',
    drawerEditTitle: 'Edit Notice',
    category: 'Category',
    titleEn: 'Notice Title (English)',
    titleBn: 'Notice Title (Bangla)',
    bodyEn: 'Notice Text (English)',
    bodyBn: 'Notice Text (Bangla)',
    date: 'Publish Date',
    attachment: 'Attachment (file name)',
    pinCheckbox: 'Pin to top of notice board',
    cancel: 'Cancel',
    save: 'Save Notice',
    confirmDeleteTitle: 'Remove this notice?',
    confirmDeleteBody: 'This will remove the notice from the public notice board.',
    confirmDeleteAction: 'Remove Notice',
    views: 'views',
    categories: {
      general: 'General',
      circular: 'Circular',
      tender: 'Tender',
      holiday: 'Public Holiday',
      maintenance: 'System Maintenance',
      deadline: 'Deadline Reminder',
    },
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'নোটিশ',
    subtitle: 'কাস্টমস বন্ড কমিশনারেটের সরকারি নোটিশ বোর্ড — সার্কুলার, দরপত্র, ছুটি, সময়সীমা ও সিস্টেম সতর্কবার্তা।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    manageContent: 'নোটিশ ব্যবস্থাপনা',
    addNotice: 'নোটিশ যোগ করুন',
    searchPlaceholder: 'নোটিশ অনুসন্ধান করুন…',
    all: 'সকল নোটিশ',
    noResultsTitle: 'কোনো নোটিশ পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন অনুসন্ধান শব্দ বা ক্যাটাগরি ফিল্টার ব্যবহার করে দেখুন।',
    pinned: 'পিন করা',
    pin: 'পিন করুন',
    unpin: 'আনপিন করুন',
    edit: 'সম্পাদনা',
    delete: 'মুছে ফেলুন',
    download: 'সংযুক্তি ডাউনলোড',
    new: 'নতুন',
    drawerAddTitle: 'নোটিশ যোগ করুন',
    drawerEditTitle: 'নোটিশ সম্পাদনা করুন',
    category: 'ক্যাটাগরি',
    titleEn: 'নোটিশ শিরোনাম (ইংরেজি)',
    titleBn: 'নোটিশ শিরোনাম (বাংলা)',
    bodyEn: 'নোটিশের বিবরণ (ইংরেজি)',
    bodyBn: 'নোটিশের বিবরণ (বাংলা)',
    date: 'প্রকাশের তারিখ',
    attachment: 'সংযুক্তি (ফাইলের নাম)',
    pinCheckbox: 'নোটিশ বোর্ডের শীর্ষে পিন করুন',
    cancel: 'বাতিল',
    save: 'নোটিশ সংরক্ষণ করুন',
    confirmDeleteTitle: 'এই নোটিশটি সরাবেন?',
    confirmDeleteBody: 'এটি পাবলিক নোটিশ বোর্ড থেকে নোটিশটি সরিয়ে দেবে।',
    confirmDeleteAction: 'নোটিশ সরান',
    views: 'বার দেখা হয়েছে',
    categories: {
      general: 'সাধারণ',
      circular: 'সার্কুলার',
      tender: 'দরপত্র',
      holiday: 'সরকারি ছুটি',
      maintenance: 'সিস্টেম রক্ষণাবেক্ষণ',
      deadline: 'সময়সীমা স্মরণিকা',
    },
  },
};

const categoryStyles: Record<NoticeCategory, { icon: string; color: string }> = {
  general: { icon: 'campaign', color: '#0A4D8C' },
  circular: { icon: 'gavel', color: '#6D28D9' },
  tender: { icon: 'request_quote', color: '#B45309' },
  holiday: { icon: 'event', color: '#00A86B' },
  maintenance: { icon: 'build', color: '#B91C1C' },
  deadline: { icon: 'schedule', color: '#1E88E5' },
};

const noticeCategories: NoticeCategory[] = ['general', 'circular', 'tender', 'holiday', 'maintenance', 'deadline'];

interface Notice {
  id: string;
  category: NoticeCategory;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  date: string;
  attachment?: string;
  views: number;
  pinned: boolean;
}

const initialNotices: Notice[] = [
  {
    id: 'n1',
    category: 'circular',
    titleEn: 'Online submission of Annual Audit reports mandatory from August 2026',
    titleBn: 'আগস্ট ২০২৬ থেকে বার্ষিক নিরীক্ষা প্রতিবেদন অনলাইনে জমা দেওয়া বাধ্যতামূলক',
    bodyEn: 'All bonded organizations are hereby informed that, effective 01 August 2026, Annual Audit reports must be submitted exclusively through the CBMS Annual Audit module. Physical submissions will no longer be accepted at any Customs Bond Commissionerate office.',
    bodyBn: 'সকল বন্ডেড প্রতিষ্ঠানকে জানানো যাচ্ছে যে, ০১ আগস্ট ২০২৬ থেকে বার্ষিক নিরীক্ষা প্রতিবেদন কেবলমাত্র সিবিএমএস বার্ষিক নিরীক্ষা মডিউলের মাধ্যমে জমা দিতে হবে। কোনো কাস্টমস বন্ড কমিশনারেট অফিসে সরাসরি জমা গ্রহণ করা হবে না।',
    date: '21 Jul 2026',
    attachment: 'annual-audit-online-mandate.pdf',
    views: 3820,
    pinned: true,
  },
  {
    id: 'n2',
    category: 'circular',
    titleEn: 'Circular NBR/Cus/Bond/2026/17: Revised HS Code Verification Process',
    titleBn: 'সার্কুলার NBR/Cus/Bond/2026/17: সংশোধিত এইচএস কোড যাচাইকরণ প্রক্রিয়া',
    bodyEn: 'This circular introduces a revised two-tier verification workflow for HS Code inclusion requests, requiring technical justification and, where applicable, Co-efficient Provider validation prior to Commissioner approval.',
    bodyBn: 'এই সার্কুলারে এইচএস কোড অন্তর্ভুক্তির আবেদনের জন্য একটি সংশোধিত দ্বি-স্তরীয় যাচাইকরণ পদ্ধতি প্রবর্তন করা হয়েছে, যাতে কমিশনারের অনুমোদনের পূর্বে প্রযুক্তিগত যৌক্তিকতা এবং প্রযোজ্য ক্ষেত্রে কো-এফিসিয়েন্ট প্রোভাইডারের যাচাই প্রয়োজন।',
    date: '20 Jul 2026',
    attachment: 'circular-2026-17-hs-code.pdf',
    views: 2914,
    pinned: true,
  },
  {
    id: 'n3',
    category: 'holiday',
    titleEn: 'Public Holiday: CBC offices closed 26–27 Jul 2026 for Ashura',
    titleBn: 'সরকারি ছুটি: আশুরা উপলক্ষে ২৬–২৭ জুলাই ২০২৬ সিবিসি অফিস বন্ধ থাকবে',
    bodyEn: 'In observance of Ashura, all Customs Bond Commissionerate offices will remain closed on 26 and 27 July 2026. CBMS online services will remain operational; urgent matters may be reported via the CBC Support helpline.',
    bodyBn: 'আশুরা উপলক্ষে ২৬ ও ২৭ জুলাই ২০২৬ সকল কাস্টমস বন্ড কমিশনারেট অফিস বন্ধ থাকবে। সিবিএমএস অনলাইন সেবা চালু থাকবে; জরুরি বিষয়ে সিবিসি সাপোর্ট হেল্পলাইনে যোগাযোগ করা যাবে।',
    date: '18 Jul 2026',
    views: 1542,
    pinned: false,
  },
  {
    id: 'n4',
    category: 'maintenance',
    titleEn: 'Portal Maintenance: e-Passbook service unavailable 25 Jul, 11 PM–1 AM',
    titleBn: 'পোর্টাল রক্ষণাবেক্ষণ: ২৫ জুলাই রাত ১১টা থেকে ১টা পর্যন্ত ই-পাসবুক সেবা বন্ধ থাকবে',
    bodyEn: 'Scheduled maintenance will temporarily suspend e-Passbook and e-Bond Register services between 11:00 PM and 1:00 AM on 25 July 2026. All other CBMS modules will remain available.',
    bodyBn: '২৫ জুলাই ২০২৬ রাত ১১টা থেকে ১টা পর্যন্ত নির্ধারিত রক্ষণাবেক্ষণের কারণে ই-পাসবুক ও ই-বন্ড রেজিস্টার সেবা সাময়িকভাবে বন্ধ থাকবে। অন্যান্য সকল সিবিএমএস মডিউল সচল থাকবে।',
    date: '17 Jul 2026',
    views: 987,
    pinned: false,
  },
  {
    id: 'n5',
    category: 'tender',
    titleEn: 'Tender Notice: Procurement of IT Security Audit Services',
    titleBn: 'দরপত্র নোটিশ: আইটি সিকিউরিটি অডিট সেবা ক্রয়',
    bodyEn: 'Sealed tenders are invited from eligible firms for the annual IT security audit and VAPT of the CBMS platform. Tender documents can be collected from the CBC procurement cell or downloaded below.',
    bodyBn: 'সিবিএমএস প্ল্যাটফর্মের বার্ষিক আইটি সিকিউরিটি অডিট ও ভিএপিটি-র জন্য যোগ্য প্রতিষ্ঠানসমূহের কাছ থেকে সিলড দরপত্র আহ্বান করা হচ্ছে। দরপত্র নথি সিবিসি ক্রয় শাখা থেকে সংগ্রহ বা নিচে থেকে ডাউনলোড করা যাবে।',
    date: '15 Jul 2026',
    attachment: 'tender-NBR-CBC-T-2026-08.pdf',
    views: 641,
    pinned: false,
  },
  {
    id: 'n6',
    category: 'deadline',
    titleEn: 'Deadline Reminder: Q2 Utilization Declaration submission closes 31 Jul 2026',
    titleBn: 'সময়সীমা স্মরণিকা: দ্বিতীয় প্রান্তিকের ইউটিলাইজেশন ডিক্লারেশন জমার শেষ তারিখ ৩১ জুলাই ২০২৬',
    bodyEn: 'All bonders are reminded to complete Q2 (Apr–Jun 2026) Utilization Declaration submission and verification in CBMS by 31 July 2026 to avoid processing delays on pending UP applications.',
    bodyBn: 'অমীমাংসিত ইউপি আবেদনের প্রক্রিয়াকরণে বিলম্ব এড়াতে সকল বন্ডকারীকে ৩১ জুলাই ২০২৬ এর মধ্যে দ্বিতীয় প্রান্তিকের (এপ্রিল–জুন ২০২৬) ইউটিলাইজেশন ডিক্লারেশন জমা ও যাচাই সম্পন্ন করার অনুরোধ জানানো যাচ্ছে।',
    date: '14 Jul 2026',
    views: 2203,
    pinned: false,
  },
  {
    id: 'n7',
    category: 'general',
    titleEn: 'New helpline number 09611-777111 now active for CBMS support',
    titleBn: 'সিবিএমএস সহায়তার জন্য নতুন হেল্পলাইন নম্বর ০৯৬১১-৭৭৭১১১ চালু হয়েছে',
    bodyEn: 'A dedicated helpline is now available from 9 AM to 6 PM on working days for technical support related to bond license applications, e-Passbook, and other CBMS services.',
    bodyBn: 'বন্ড লাইসেন্স আবেদন, ই-পাসবুক ও অন্যান্য সিবিএমএস সেবা সংক্রান্ত কারিগরি সহায়তার জন্য কার্যদিবসে সকাল ৯টা থেকে সন্ধ্যা ৬টা পর্যন্ত একটি নিবেদিত হেল্পলাইন চালু করা হয়েছে।',
    date: '10 Jul 2026',
    views: 1120,
    pinned: false,
  },
  {
    id: 'n8',
    category: 'circular',
    titleEn: 'Circular NBR/Cus/Bond/2026/12: Updated Lien Bank empanelment list',
    titleBn: 'সার্কুলার NBR/Cus/Bond/2026/12: হালনাগাদকৃত লিয়েন ব্যাংক তালিকাভুক্তকরণ তালিকা',
    bodyEn: 'The list of empanelled lien banks has been updated to include 3 new scheduled bank branches. Bonders may select from the updated list when submitting a Lien Bank Change request.',
    bodyBn: 'তালিকাভুক্ত লিয়েন ব্যাংকের তালিকায় ৩টি নতুন তফসিলি ব্যাংক শাখা অন্তর্ভুক্ত করে হালনাগাদ করা হয়েছে। লিয়েন ব্যাংক পরিবর্তন অনুরোধ জমা দেওয়ার সময় বন্ডকারীরা হালনাগাদকৃত তালিকা থেকে নির্বাচন করতে পারবেন।',
    date: '05 Jul 2026',
    attachment: 'circular-2026-12-lien-banks.pdf',
    views: 764,
    pinned: false,
  },
  {
    id: 'n9',
    category: 'holiday',
    titleEn: 'Public Holiday: National Mourning Day, 15 Aug 2026 — CBC offices closed',
    titleBn: 'সরকারি ছুটি: জাতীয় শোক দিবস, ১৫ আগস্ট ২০২৬ — সিবিসি অফিস বন্ধ থাকবে',
    bodyEn: 'All Customs Bond Commissionerate offices will remain closed on 15 August 2026 in observance of National Mourning Day.',
    bodyBn: 'জাতীয় শোক দিবস উপলক্ষে ১৫ আগস্ট ২০২৬ সকল কাস্টমস বন্ড কমিশনারেট অফিস বন্ধ থাকবে।',
    date: '01 Jul 2026',
    views: 812,
    pinned: false,
  },
  {
    id: 'n10',
    category: 'tender',
    titleEn: 'Tender Notice: Annual Maintenance Contract for CBMS Data Center',
    titleBn: 'দরপত্র নোটিশ: সিবিএমএস ডেটা সেন্টারের বার্ষিক রক্ষণাবেক্ষণ চুক্তি',
    bodyEn: 'Tenders are invited for the annual maintenance contract (AMC) covering CBMS data center infrastructure, backup systems and disaster recovery site operations.',
    bodyBn: 'সিবিএমএস ডেটা সেন্টার অবকাঠামো, ব্যাকআপ সিস্টেম ও দুর্যোগ পুনরুদ্ধার সাইট পরিচালনা সংক্রান্ত বার্ষিক রক্ষণাবেক্ষণ চুক্তির (এএমসি) জন্য দরপত্র আহ্বান করা হচ্ছে।',
    date: '28 Jun 2026',
    attachment: 'tender-NBR-CBC-T-2026-06.pdf',
    views: 533,
    pinned: false,
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

const emptyDraft = (): Notice => ({
  id: `n-${Date.now()}`,
  category: 'general',
  titleEn: '',
  titleBn: '',
  bodyEn: '',
  bodyBn: '',
  date: '',
  views: 0,
  pinned: false,
});

export function Notices({ language, onDone }: NoticesProps) {
  const t = T[language];
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<NoticeCategory | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; draft: Notice } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = notices.filter((n) => {
      const matchesCategory = !activeCategory || n.category === activeCategory;
      const matchesSearch = !q || n.titleEn.toLowerCase().includes(q) || n.titleBn.includes(q) || n.bodyEn.toLowerCase().includes(q) || n.bodyBn.includes(q);
      return matchesCategory && matchesSearch;
    });
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [notices, search, activeCategory]);

  const countFor = (cat: NoticeCategory | null) => notices.filter((n) => !cat || n.category === cat).length;

  const togglePin = (id: string) => setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const openAdd = () => setDrawer({ mode: 'add', draft: emptyDraft() });
  const openEdit = (n: Notice) => setDrawer({ mode: 'edit', draft: { ...n } });

  const saveDraft = () => {
    if (!drawer) return;
    const d = drawer.draft;
    if (!d.titleEn || !d.titleBn || !d.date) return;
    setNotices((prev) => (drawer.mode === 'add' ? [d, ...prev] : prev.map((n) => (n.id === d.id ? d : n))));
    setDrawer(null);
  };

  const removeNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
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
                {t.addNotice}
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
          {noticeCategories.map((cat) => {
            const style = categoryStyles[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={['flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', isActive ? 'text-white' : 'text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
                style={isActive ? { backgroundColor: style.color, borderColor: style.color } : { borderColor: '#CBD5E1' }}
              >
                <Icon name={style.icon} className="text-[14px]" />
                {t.categories[cat]} ({countFor(cat)})
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
          {filtered.map((n) => {
            const style = categoryStyles[n.category];
            const isOpen = openId === n.id;
            return (
              <div key={n.id} className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                <button type="button" onClick={() => setOpenId(isOpen ? null : n.id)} aria-expanded={isOpen} className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F8FAFC]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${style.color}1A`, color: style.color }}>
                    <Icon name={style.icon} className="text-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: style.color }}>
                        {t.categories[n.category]}
                      </span>
                      {n.pinned && (
                        <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          <Icon name="push_pin" className="text-[11px]" />
                          {t.pinned}
                        </span>
                      )}
                    </div>
                    <span className="mt-0.5 block text-sm font-semibold text-[#1E293B]">{n[language === 'en' ? 'titleEn' : 'titleBn']}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-[#94A3B8]">
                      {n.date}
                      <span aria-hidden>·</span>
                      {n.views.toLocaleString()} {t.views}
                    </span>
                  </div>
                  {adminMode && (
                    <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => togglePin(n.id)}
                        title={n.pinned ? t.unpin : t.pin}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${n.pinned ? 'text-amber-600 hover:bg-amber-50' : 'text-[#94A3B8] hover:bg-[#F5F7FA]'}`}
                      >
                        <Icon name="push_pin" className="text-[16px]" />
                      </button>
                      <button type="button" onClick={() => openEdit(n)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0A4D8C] hover:bg-[#EAF3FE]">
                        <Icon name="edit" className="text-[16px]" />
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(n.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#DC2626] hover:bg-red-50">
                        <Icon name="delete" className="text-[16px]" />
                      </button>
                    </div>
                  )}
                  <Icon name="expand_more" className={`mt-1 shrink-0 text-[20px] text-[#94A3B8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <div className="border-t border-[#F1F5F9] px-5 py-4 pl-[64px]">
                      <p className="text-[13px] leading-relaxed text-[#334155]">{n[language === 'en' ? 'bodyEn' : 'bodyBn']}</p>
                      {n.attachment && (
                        <button type="button" className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] px-3 py-1.5 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
                          <Icon name="attach_file" className="text-[15px] text-[#0A4D8C]" />
                          {n.attachment}
                          <Icon name="download" className="text-[15px] text-[#94A3B8]" />
                        </button>
                      )}
                    </div>
                  </div>
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
              <Field label={t.category} required>
                <select value={drawer.draft.category} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, category: e.target.value as NoticeCategory } })} className={inputClass}>
                  {noticeCategories.map((c) => (
                    <option key={c} value={c}>
                      {t.categories[c]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.titleEn} required>
                <input value={drawer.draft.titleEn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, titleEn: e.target.value } })} className={inputClass} />
              </Field>
              <Field label={t.titleBn} required>
                <input value={drawer.draft.titleBn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, titleBn: e.target.value } })} className={inputClass} />
              </Field>
              <Field label={t.bodyEn}>
                <textarea rows={4} value={drawer.draft.bodyEn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, bodyEn: e.target.value } })} className={`${inputClass} resize-none`} />
              </Field>
              <Field label={t.bodyBn}>
                <textarea rows={4} value={drawer.draft.bodyBn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, bodyBn: e.target.value } })} className={`${inputClass} resize-none`} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t.date} required>
                  <input value={drawer.draft.date} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, date: e.target.value } })} placeholder="23 Jul 2026" className={inputClass} />
                </Field>
                <Field label={t.attachment}>
                  <input value={drawer.draft.attachment ?? ''} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, attachment: e.target.value } })} placeholder="notice.pdf" className={inputClass} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm text-[#334155]">
                <input
                  type="checkbox"
                  checked={drawer.draft.pinned}
                  onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, pinned: e.target.checked } })}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C] focus:ring-[#1E88E5]"
                />
                {t.pinCheckbox}
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDrawer(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={!drawer.draft.titleEn || !drawer.draft.titleBn || !drawer.draft.date}
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
              <button type="button" onClick={() => removeNotice(confirmDeleteId)} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                {t.confirmDeleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
