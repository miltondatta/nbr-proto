import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';

interface KnowledgeBaseProps {
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
    pageTitle: 'Knowledge Base',
    subtitle: 'Frequently asked questions covering bond licensing, e-Passbook, machinery, audit, lien banks and general account topics.',
    backToDashboard: 'Back to Dashboard',
    manageContent: 'Manage Knowledge Base',
    addFaq: 'Add FAQ',
    searchPlaceholder: 'Search frequently asked questions…',
    all: 'All Topics',
    noResultsTitle: 'No questions found',
    noResultsBody: 'Try a different search term or topic filter.',
    edit: 'Edit',
    delete: 'Delete',
    wasHelpful: 'Was this helpful?',
    yes: 'Yes',
    no: 'No',
    thanks: 'Thanks for your feedback',
    drawerAddTitle: 'Add FAQ',
    drawerEditTitle: 'Edit FAQ',
    category: 'Topic',
    questionEn: 'Question (English)',
    questionBn: 'Question (Bangla)',
    answerEn: 'Answer (English)',
    answerBn: 'Answer (Bangla)',
    cancel: 'Cancel',
    save: 'Save FAQ',
    confirmDeleteTitle: 'Remove this FAQ?',
    confirmDeleteBody: 'This will remove the question from the public Knowledge Base.',
    confirmDeleteAction: 'Remove FAQ',
    results: 'questions',
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'নলেজ বেস',
    subtitle: 'বন্ড লাইসেন্সিং, ই-পাসবুক, যন্ত্রপাতি, নিরীক্ষা, লিয়েন ব্যাংক ও সাধারণ অ্যাকাউন্ট বিষয়ক সচরাচর জিজ্ঞাসিত প্রশ্ন।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    manageContent: 'নলেজ বেস ব্যবস্থাপনা',
    addFaq: 'প্রশ্ন যোগ করুন',
    searchPlaceholder: 'সচরাচর জিজ্ঞাসিত প্রশ্ন অনুসন্ধান করুন…',
    all: 'সকল বিষয়',
    noResultsTitle: 'কোনো প্রশ্ন পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন অনুসন্ধান শব্দ বা বিষয় ফিল্টার ব্যবহার করে দেখুন।',
    edit: 'সম্পাদনা',
    delete: 'মুছে ফেলুন',
    wasHelpful: 'এটি কি সহায়ক ছিল?',
    yes: 'হ্যাঁ',
    no: 'না',
    thanks: 'আপনার মতামতের জন্য ধন্যবাদ',
    drawerAddTitle: 'প্রশ্ন যোগ করুন',
    drawerEditTitle: 'প্রশ্ন সম্পাদনা করুন',
    category: 'বিষয়',
    questionEn: 'প্রশ্ন (ইংরেজি)',
    questionBn: 'প্রশ্ন (বাংলা)',
    answerEn: 'উত্তর (ইংরেজি)',
    answerBn: 'উত্তর (বাংলা)',
    cancel: 'বাতিল',
    save: 'প্রশ্ন সংরক্ষণ করুন',
    confirmDeleteTitle: 'এই প্রশ্নটি সরাবেন?',
    confirmDeleteBody: 'এটি নলেজ বেস থেকে প্রশ্নটি সরিয়ে দেবে।',
    confirmDeleteAction: 'প্রশ্ন সরান',
    results: 'টি প্রশ্ন',
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
  { id: 'passbook', en: 'e-Passbook & Bond Register', bn: 'ই-পাসবুক ও বন্ড রেজিস্টার', icon: 'import_contacts', color: '#00A86B' },
  { id: 'machinery', en: 'Machinery', bn: 'যন্ত্রপাতি', icon: 'precision_manufacturing', color: '#B45309' },
  { id: 'audit', en: 'Audit & Compliance', bn: 'নিরীক্ষা ও সম্মতি', icon: 'fact_check', color: '#B91C1C' },
  { id: 'lien-bank', en: 'Lien Bank', bn: 'লিয়েন ব্যাংক', icon: 'account_balance', color: '#1E88E5' },
  { id: 'account', en: 'General & Account', bn: 'সাধারণ ও অ্যাকাউন্ট', icon: 'account_circle', color: '#6D28D9' },
];

interface Faq {
  id: string;
  categoryId: string;
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
}

const initialFaqs: Faq[] = [
  {
    id: 'faq-1',
    categoryId: 'licensing',
    qEn: 'How long does it take to get a new bond license approved?',
    qBn: 'নতুন বন্ড লাইসেন্স অনুমোদন পেতে কত সময় লাগে?',
    aEn: 'Standard processing time is 21 working days from submission of a complete application, subject to factory inspection scheduling.',
    aBn: 'সম্পূর্ণ আবেদন জমা দেওয়ার পর কারখানা পরিদর্শনের সময়সূচি সাপেক্ষে সাধারণত ২১ কার্যদিবস সময় লাগে।',
  },
  {
    id: 'faq-2',
    categoryId: 'licensing',
    qEn: 'Can I transfer my bond license to another person?',
    qBn: 'আমি কি আমার বন্ড লাইসেন্স অন্য কারও নামে হস্তান্তর করতে পারি?',
    aEn: 'Yes, use the License Ownership Change service. The bond license number remains unchanged; only the ownership record is updated after approval.',
    aBn: 'হ্যাঁ, লাইসেন্স মালিকানা পরিবর্তন সেবা ব্যবহার করুন। বন্ড লাইসেন্স নম্বর অপরিবর্তিত থাকে; অনুমোদনের পর শুধুমাত্র মালিকানার রেকর্ড হালনাগাদ হয়।',
  },
  {
    id: 'faq-3',
    categoryId: 'licensing',
    qEn: 'What happens if my Trade License expires during the application process?',
    qBn: 'আবেদন প্রক্রিয়া চলাকালীন আমার ট্রেড লাইসেন্সের মেয়াদ শেষ হয়ে গেলে কী হবে?',
    aEn: 'You must submit a renewed Trade License before the application can proceed to the approval stage.',
    aBn: 'আবেদনটি অনুমোদনের পর্যায়ে যাওয়ার আগে আপনাকে নবায়নকৃত ট্রেড লাইসেন্স জমা দিতে হবে।',
  },
  {
    id: 'faq-4',
    categoryId: 'passbook',
    qEn: 'Can I edit entries in my e-Passbook directly?',
    qBn: 'আমি কি সরাসরি আমার ই-পাসবুকের এন্ট্রি সম্পাদনা করতে পারি?',
    aEn: 'No. e-Passbook entries are fetched automatically from ASYCUDA World and the UD system. Corrections must be made at the source system and will reflect here automatically.',
    aBn: 'না। ই-পাসবুক এন্ট্রি স্বয়ংক্রিয়ভাবে ASYCUDA World ও ইউডি সিস্টেম থেকে সংগৃহীত হয়। সংশোধন মূল সিস্টেমে করতে হবে এবং তা এখানে স্বয়ংক্রিয়ভাবে প্রতিফলিত হবে।',
  },
  {
    id: 'faq-5',
    categoryId: 'passbook',
    qEn: 'How is my e-Passbook balance calculated?',
    qBn: 'আমার ই-পাসবুক ব্যালেন্স কীভাবে হিসাব করা হয়?',
    aEn: 'Balance is the running difference between imported quantities (per HS Code) and utilized or exported quantities, updated in real time.',
    aBn: 'ব্যালেন্স হলো আমদানিকৃত পরিমাণ (প্রতি এইচএস কোড অনুযায়ী) এবং ব্যবহৃত বা রপ্তানিকৃত পরিমাণের মধ্যে চলমান পার্থক্য, যা রিয়েল টাইমে হালনাগাদ হয়।',
  },
  {
    id: 'faq-6',
    categoryId: 'machinery',
    qEn: 'Do I need CBC approval before selling bonded machinery?',
    qBn: 'বন্ডেড যন্ত্রপাতি বিক্রয়ের আগে কি সিবিসি অনুমোদন প্রয়োজন?',
    aEn: 'Yes, machinery sale or transfer requires prior approval through the Machinery Sale/Transfer service before any transaction is finalized.',
    aBn: 'হ্যাঁ, যেকোনো লেনদেন চূড়ান্ত করার আগে যন্ত্রপাতি বিক্রয়/হস্তান্তর সেবার মাধ্যমে পূর্বানুমোদন প্রয়োজন।',
  },
  {
    id: 'faq-7',
    categoryId: 'machinery',
    qEn: 'What documents are needed to register new machinery?',
    qBn: 'নতুন যন্ত্রপাতি নিবন্ধনের জন্য কী কী নথি প্রয়োজন?',
    aEn: 'Import documents (Bill of Entry), machinery specification sheet, installation certificate, and factory layout showing machinery placement.',
    aBn: 'আমদানি নথি (বিল অব এন্ট্রি), যন্ত্রপাতির স্পেসিফিকেশন শিট, ইনস্টলেশন সার্টিফিকেট এবং যন্ত্রপাতির অবস্থান দেখানো কারখানা লে-আউট।',
  },
  {
    id: 'faq-8',
    categoryId: 'audit',
    qEn: 'How often is an Annual Audit required?',
    qBn: 'বার্ষিক নিরীক্ষা কত ঘন ঘন প্রয়োজন হয়?',
    aEn: 'Every bonded organization is subject to a mandatory audit once every fiscal year, as scheduled by the Annual Audit module.',
    aBn: 'প্রতিটি বন্ডেড প্রতিষ্ঠানের জন্য বার্ষিক নিরীক্ষা মডিউলের সময়সূচি অনুযায়ী প্রতি অর্থবছরে একবার বাধ্যতামূলক নিরীক্ষা প্রযোজ্য।',
  },
  {
    id: 'faq-9',
    categoryId: 'audit',
    qEn: 'What happens if my audit report shows a discrepancy?',
    qBn: 'নিরীক্ষা প্রতিবেদনে অসঙ্গতি দেখা গেলে কী হবে?',
    aEn: 'A discrepancy triggers a compliance review; you may be asked to submit clarifications or, in serious cases, the matter proceeds to Legal Procedure Management.',
    aBn: 'অসঙ্গতি একটি সম্মতি পর্যালোচনা শুরু করে; আপনাকে ব্যাখ্যা জমা দিতে বলা হতে পারে অথবা গুরুতর ক্ষেত্রে বিষয়টি আইনি প্রক্রিয়া ব্যবস্থাপনায় প্রেরণ করা হয়।',
  },
  {
    id: 'faq-10',
    categoryId: 'lien-bank',
    qEn: 'Can I have more than one lien bank for a single bond license?',
    qBn: 'একটি বন্ড লাইসেন্সের জন্য কি একাধিক লিয়েন ব্যাংক থাকতে পারে?',
    aEn: 'Yes, provided each lien bank is duly empanelled and the arrangement is approved by CBC.',
    aBn: 'হ্যাঁ, তবে প্রতিটি লিয়েন ব্যাংক যথাযথভাবে তালিকাভুক্ত এবং ব্যবস্থাটি সিবিসি কর্তৃক অনুমোদিত হতে হবে।',
  },
  {
    id: 'faq-11',
    categoryId: 'lien-bank',
    qEn: 'How do I change my lien bank?',
    qBn: 'আমি কীভাবে আমার লিয়েন ব্যাংক পরিবর্তন করব?',
    aEn: 'Submit a Lien Bank Change request; the new bank must complete e-verification before the change is finalized.',
    aBn: 'একটি লিয়েন ব্যাংক পরিবর্তন অনুরোধ জমা দিন; পরিবর্তন চূড়ান্ত হওয়ার আগে নতুন ব্যাংককে ই-ভেরিফিকেশন সম্পন্ন করতে হবে।',
  },
  {
    id: 'faq-12',
    categoryId: 'account',
    qEn: 'I forgot my CBMS User ID, how do I recover it?',
    qBn: 'আমি আমার সিবিএমএস ইউজার আইডি ভুলে গেছি, কীভাবে পুনরুদ্ধার করব?',
    aEn: 'Use the "Forgot User ID" option on the login page, or contact CBC Support with your BIN for identity verification.',
    aBn: 'লগইন পৃষ্ঠায় "ইউজার আইডি ভুলে গেছেন" অপশন ব্যবহার করুন, অথবা পরিচয় যাচাইয়ের জন্য আপনার বিআইএনসহ সিবিসি সাপোর্টে যোগাযোগ করুন।',
  },
  {
    id: 'faq-13',
    categoryId: 'account',
    qEn: 'Is CBMS available on mobile?',
    qBn: 'সিবিএমএস কি মোবাইলে ব্যবহার করা যায়?',
    aEn: 'Yes, Android, iOS and Windows mobile applications are available with offline entry support that auto-syncs when connectivity is restored.',
    aBn: 'হ্যাঁ, অ্যান্ড্রয়েড, আইওএস ও উইন্ডোজ মোবাইল অ্যাপ্লিকেশন উপলব্ধ, যা অফলাইন এন্ট্রি সমর্থন করে এবং সংযোগ পুনরুদ্ধার হলে স্বয়ংক্রিয়ভাবে সিঙ্ক হয়।',
  },
];

function categoryOf(id: string) {
  return categories.find((c) => c.id === id)!;
}

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

const emptyDraft = (): Faq => ({ id: `faq-${Date.now()}`, categoryId: categories[0].id, qEn: '', qBn: '', aEn: '', aBn: '' });

export function KnowledgeBase({ language, onDone }: KnowledgeBaseProps) {
  const t = T[language];
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(initialFaqs[0]?.id ?? null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no'>>({});
  const [adminMode, setAdminMode] = useState(false);
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; draft: Faq } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCategory = !activeCategory || f.categoryId === activeCategory;
      const matchesSearch = !q || f.qEn.toLowerCase().includes(q) || f.qBn.includes(q) || f.aEn.toLowerCase().includes(q) || f.aBn.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, search, activeCategory]);

  const countFor = (catId: string | null) => faqs.filter((f) => !catId || f.categoryId === catId).length;

  const openAdd = () => setDrawer({ mode: 'add', draft: emptyDraft() });
  const openEdit = (f: Faq) => setDrawer({ mode: 'edit', draft: { ...f } });

  const saveDraft = () => {
    if (!drawer) return;
    const d = drawer.draft;
    if (!d.qEn || !d.qBn || !d.aEn || !d.aBn) return;
    setFaqs((prev) => (drawer.mode === 'add' ? [d, ...prev] : prev.map((f) => (f.id === d.id ? d : f))));
    setDrawer(null);
  };

  const removeFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
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
                {t.addFaq}
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
          {categories.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={['flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', isActive ? 'text-white' : 'text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
                style={isActive ? { backgroundColor: c.color, borderColor: c.color } : { borderColor: '#CBD5E1' }}
              >
                <Icon name={c.icon} className="text-[14px]" />
                {c[language]} ({countFor(c.id)})
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
          {filtered.map((f) => {
            const cat = categoryOf(f.categoryId);
            const isOpen = openId === f.id;
            const feedback = feedbackGiven[f.id];
            return (
              <div key={f.id} className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F8FAFC]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}>
                    <Icon name={cat.icon} className="text-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
                      {cat[language]}
                    </span>
                    <span className="block text-sm font-semibold text-[#1E293B]">{f[language === 'en' ? 'qEn' : 'qBn']}</span>
                  </div>
                  {adminMode && (
                    <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => openEdit(f)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0A4D8C] hover:bg-[#EAF3FE]">
                        <Icon name="edit" className="text-[16px]" />
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(f.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#DC2626] hover:bg-red-50">
                        <Icon name="delete" className="text-[16px]" />
                      </button>
                    </div>
                  )}
                  <Icon name="expand_more" className={`shrink-0 text-[20px] text-[#94A3B8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <div className="border-t border-[#F1F5F9] px-5 py-4 pl-[68px]">
                      <p className="text-[13px] leading-relaxed text-[#334155]">{f[language === 'en' ? 'aEn' : 'aBn']}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
                        {feedback ? (
                          <span className="flex items-center gap-1 font-medium text-emerald-600">
                            <Icon name="check_circle" className="text-[15px]" />
                            {t.thanks}
                          </span>
                        ) : (
                          <>
                            <span>{t.wasHelpful}</span>
                            <button
                              type="button"
                              onClick={() => setFeedbackGiven((p) => ({ ...p, [f.id]: 'yes' }))}
                              className="rounded-full border border-[#CBD5E1] px-2.5 py-1 font-semibold text-[#334155] hover:border-[#00A86B] hover:text-[#00A86B]"
                            >
                              {t.yes}
                            </button>
                            <button
                              type="button"
                              onClick={() => setFeedbackGiven((p) => ({ ...p, [f.id]: 'no' }))}
                              className="rounded-full border border-[#CBD5E1] px-2.5 py-1 font-semibold text-[#334155] hover:border-[#DC2626] hover:text-[#DC2626]"
                            >
                              {t.no}
                            </button>
                          </>
                        )}
                      </div>
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
              <Field label={t.questionEn} required>
                <input value={drawer.draft.qEn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, qEn: e.target.value } })} className={inputClass} />
              </Field>
              <Field label={t.questionBn} required>
                <input value={drawer.draft.qBn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, qBn: e.target.value } })} className={inputClass} />
              </Field>
              <Field label={t.answerEn} required>
                <textarea rows={4} value={drawer.draft.aEn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, aEn: e.target.value } })} className={`${inputClass} resize-none`} />
              </Field>
              <Field label={t.answerBn} required>
                <textarea rows={4} value={drawer.draft.aBn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, aBn: e.target.value } })} className={`${inputClass} resize-none`} />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDrawer(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={!drawer.draft.qEn || !drawer.draft.qBn || !drawer.draft.aEn || !drawer.draft.aBn}
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
              <button type="button" onClick={() => removeFaq(confirmDeleteId)} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                {t.confirmDeleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
