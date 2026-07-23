import { useState } from 'react';

type Language = 'en' | 'bn';

interface PortalContentsProps {
  language: Language;
  onDone: () => void;
  onSelect: (id: string) => void;
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
    pageTitle: 'Portal Contents',
    subtitle: 'The public information hub of the CBC service portal — key hyperlinks, notices, application forms and submission guidelines for all bond services.',
    backToDashboard: 'Back to Dashboard',
    manageContent: 'Manage Content',
    editBanner: 'Edit Banner',
    registerCta: 'Register / Create Profile',
    browseCta: 'Browse All Services',
    stats: {
      bonders: 'Registered Bonders',
      licenses: 'Active Bond Licenses',
      processing: 'Avg. Processing Time',
      banks: 'Lien Banks Onboard',
    },
    quickLinks: 'Quick Links',
    latestNotices: 'Latest Notices',
    viewAll: 'View all',
    formsGuidelines: 'Application Forms & Submission Guidelines',
    new: 'New',
    drawerTitle: 'Edit Portal Banner',
    heroTitleEn: 'Banner Title (English)',
    heroTitleBn: 'Banner Title (Bangla)',
    heroSubtitleEn: 'Banner Subtitle (English)',
    heroSubtitleBn: 'Banner Subtitle (Bangla)',
    primaryCtaEn: 'Primary Button Label (English)',
    primaryCtaBn: 'Primary Button Label (Bangla)',
    secondaryCtaEn: 'Secondary Button Label (English)',
    secondaryCtaBn: 'Secondary Button Label (Bangla)',
    cancel: 'Cancel',
    save: 'Save Banner',
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'পোর্টাল কন্টেন্ট',
    subtitle: 'সিবিসি সেবা পোর্টালের সাধারণ তথ্য কেন্দ্র — সকল বন্ড সেবার গুরুত্বপূর্ণ লিংক, নোটিশ, আবেদন ফরম ও জমাদান নির্দেশিকা।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    manageContent: 'কন্টেন্ট ব্যবস্থাপনা',
    editBanner: 'ব্যানার সম্পাদনা',
    registerCta: 'নিবন্ধন / প্রোফাইল তৈরি করুন',
    browseCta: 'সকল সেবা দেখুন',
    stats: {
      bonders: 'নিবন্ধিত বন্ডকারী',
      licenses: 'সক্রিয় বন্ড লাইসেন্স',
      processing: 'গড় প্রক্রিয়াকরণ সময়',
      banks: 'যুক্ত লিয়েন ব্যাংক',
    },
    quickLinks: 'কুইক লিংক',
    latestNotices: 'সাম্প্রতিক নোটিশ',
    viewAll: 'সব দেখুন',
    formsGuidelines: 'আবেদন ফরম ও জমাদান নির্দেশিকা',
    new: 'নতুন',
    drawerTitle: 'পোর্টাল ব্যানার সম্পাদনা',
    heroTitleEn: 'ব্যানার শিরোনাম (ইংরেজি)',
    heroTitleBn: 'ব্যানার শিরোনাম (বাংলা)',
    heroSubtitleEn: 'ব্যানার সাবটাইটেল (ইংরেজি)',
    heroSubtitleBn: 'ব্যানার সাবটাইটেল (বাংলা)',
    primaryCtaEn: 'প্রাইমারি বাটন লেবেল (ইংরেজি)',
    primaryCtaBn: 'প্রাইমারি বাটন লেবেল (বাংলা)',
    secondaryCtaEn: 'সেকেন্ডারি বাটন লেবেল (ইংরেজি)',
    secondaryCtaBn: 'সেকেন্ডারি বাটন লেবেল (বাংলা)',
    cancel: 'বাতিল',
    save: 'ব্যানার সংরক্ষণ করুন',
  },
};

const stats = [
  { key: 'bonders', icon: 'domain', value: '4,812' },
  { key: 'licenses', icon: 'verified', value: '3,204' },
  { key: 'processing', icon: 'schedule', value: { en: '14 Days', bn: '১৪ দিন' } },
  { key: 'banks', icon: 'account_balance', value: '42' },
] as const;

const quickLinks = [
  { id: 'rules-policies', icon: 'gavel', en: 'Rules & Policies', bn: 'নিয়ম ও নীতিমালা', color: '#0A4D8C' },
  { id: 'checklists', icon: 'checklist', en: 'Checklists', bn: 'চেকলিস্ট', color: '#00A86B' },
  { id: 'knowledge-base', icon: 'menu_book', en: 'Knowledge Base', bn: 'নলেজ বেস', color: '#6D28D9' },
  { id: 'notices', icon: 'campaign', en: 'Notices', bn: 'নোটিশ', color: '#B45309' },
  { id: 'discussion-forum', icon: 'forum', en: 'Discussion Forum', bn: 'আলোচনা ফোরাম', color: '#1E88E5' },
  { id: 'e-service-list', icon: 'list_alt', en: 'e-Service List', bn: 'ই-সার্ভিস লিস্ট', color: '#B91C1C' },
];

const notices = [
  {
    en: 'Online submission of Annual Audit reports becomes mandatory from August 2026.',
    bn: 'আগস্ট ২০২৬ থেকে বার্ষিক নিরীক্ষা প্রতিবেদন অনলাইনে জমা দেওয়া বাধ্যতামূলক হবে।',
    date: { en: 'Posted 21 Jul 2026', bn: 'পোস্ট করা হয়েছে ২১ জুলাই ২০২৬' },
    isNew: true,
  },
  {
    en: 'Circular NBR/Cus/Bond/2026/17: Revised HS Code verification process.',
    bn: 'সার্কুলার NBR/Cus/Bond/2026/17: সংশোধিত এইচএস কোড যাচাইকরণ প্রক্রিয়া।',
    date: { en: 'Posted 20 Jul 2026', bn: 'পোস্ট করা হয়েছে ২০ জুলাই ২০২৬' },
    isNew: true,
  },
  {
    en: 'Public holiday notice: CBC offices closed 26–27 Jul 2026 for Ashura.',
    bn: 'সরকারি ছুটির নোটিশ: আশুরা উপলক্ষে ২৬–২৭ জুলাই ২০২৬ সিবিসি অফিস বন্ধ থাকবে।',
    date: { en: 'Posted 18 Jul 2026', bn: 'পোস্ট করা হয়েছে ১৮ জুলাই ২০২৬' },
    isNew: false,
  },
  {
    en: 'Portal maintenance: e-Passbook service unavailable 25 Jul, 11 PM–1 AM.',
    bn: 'পোর্টাল রক্ষণাবেক্ষণ: ২৫ জুলাই রাত ১১টা থেকে ১টা পর্যন্ত ই-পাসবুক সেবা বন্ধ থাকবে।',
    date: { en: 'Posted 17 Jul 2026', bn: 'পোস্ট করা হয়েছে ১৭ জুলাই ২০২৬' },
    isNew: false,
  },
];

const resources = [
  { icon: 'picture_as_pdf', type: 'pdf', target: 'online-application-form', en: 'New Bond License Application Form', bn: 'নতুন বন্ড লাইসেন্স আবেদন ফরম', meta: '480 KB' },
  { icon: 'picture_as_pdf', type: 'pdf', target: 'online-application-form', en: 'Machinery Registration Form', bn: 'যন্ত্রপাতি নিবন্ধন ফরম', meta: '310 KB' },
  { icon: 'picture_as_pdf', type: 'pdf', target: 'online-application-form', en: 'Ownership / Company Name Change Form', bn: 'মালিকানা / কোম্পানির নাম পরিবর্তন ফরম', meta: '265 KB' },
  { icon: 'play_circle', type: 'video', target: 'submission-guidelines', en: 'Video Guideline: How to Submit a Utilization Declaration', bn: 'ভিডিও নির্দেশিকা: ইউটিলাইজেশন ডিক্লারেশন জমা দেওয়ার পদ্ধতি', meta: '6:42' },
  { icon: 'article', type: 'guide', target: 'submission-guidelines', en: 'Text Guideline: Document Checklist for Bond Licence Renewal', bn: 'লিখিত নির্দেশিকা: বন্ড লাইসেন্স নবায়নের নথি চেকলিস্ট', meta: '4 min read' },
];

const resourceColors: Record<string, string> = {
  pdf: '#B91C1C',
  video: '#0A4D8C',
  guide: '#00A86B',
};

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">{label}</span>
      {children}
    </label>
  );
}

const initialBanner = {
  titleEn: 'Welcome to the CBC Service Portal',
  titleBn: 'সিবিসি সেবা পোর্টালে স্বাগতম',
  subtitleEn: 'One platform for bond licensing, e-Passbook, audits and every Customs Bond Commissionerate service — apply online, track status in real time.',
  subtitleBn: 'বন্ড লাইসেন্সিং, ই-পাসবুক, নিরীক্ষা এবং কাস্টমস বন্ড কমিশনারেটের সকল সেবার জন্য একটি প্ল্যাটফর্ম — অনলাইনে আবেদন করুন, রিয়েল টাইমে অবস্থা দেখুন।',
  primaryCtaEn: 'Register / Create Profile',
  primaryCtaBn: 'নিবন্ধন / প্রোফাইল তৈরি করুন',
  secondaryCtaEn: 'Browse All Services',
  secondaryCtaBn: 'সকল সেবা দেখুন',
};

export function PortalContents({ language, onDone, onSelect }: PortalContentsProps) {
  const t = T[language];
  const [adminMode, setAdminMode] = useState(false);
  const [banner, setBanner] = useState(initialBanner);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState(initialBanner);

  const openDrawer = () => {
    setDraft(banner);
    setDrawerOpen(true);
  };
  const saveDrawer = () => {
    setBanner(draft);
    setDrawerOpen(false);
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
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
          >
            <Icon name="arrow_back" className="text-[16px]" />
            {t.backToDashboard}
          </button>
        </div>
      </div>

      <div className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-gradient-to-r from-[#0A4D8C] to-[#0E5FAE] p-7 text-white sm:flex-row sm:items-center">
        {adminMode && (
          <button
            type="button"
            onClick={openDrawer}
            className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <Icon name="edit" className="text-[16px]" />
            {t.editBanner}
          </button>
        )}
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-[28px]">{language === 'en' ? banner.titleEn : banner.titleBn}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{language === 'en' ? banner.subtitleEn : banner.subtitleBn}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onSelect('e-licensee-profile-creation')}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#0A4D8C] transition-colors hover:bg-white/90"
            >
              <Icon name="person_add" className="text-[18px]" />
              {language === 'en' ? banner.primaryCtaEn : banner.primaryCtaBn}
            </button>
            <button
              type="button"
              onClick={() => onSelect('e-service-list')}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Icon name="apps" className="text-[18px]" />
              {language === 'en' ? banner.secondaryCtaEn : banner.secondaryCtaBn}
            </button>
          </div>
        </div>
        <svg viewBox="0 0 180 140" className="hidden h-32 w-40 shrink-0 opacity-90 sm:block" aria-hidden="true">
          <rect x="20" y="30" width="140" height="90" rx="10" fill="white" opacity="0.12" />
          <rect x="20" y="30" width="140" height="24" rx="10" fill="white" opacity="0.18" />
          <circle cx="34" cy="42" r="3.5" fill="white" opacity="0.5" />
          <circle cx="46" cy="42" r="3.5" fill="white" opacity="0.5" />
          <rect x="36" y="68" width="88" height="9" rx="4.5" fill="white" opacity="0.35" />
          <rect x="36" y="86" width="60" height="9" rx="4.5" fill="white" opacity="0.25" />
          <circle cx="128" cy="98" r="18" fill="#00A86B" opacity="0.3" />
          <path d="M120 98l5.5 5.5 10.5-11.5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
              <Icon name={s.icon} className="text-[22px]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-[#1E293B]">{typeof s.value === 'string' ? s.value : s.value[language]}</p>
              <p className="truncate text-[11px] font-medium text-[#64748B]">{t.stats[s.key]}</p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#334155]">{t.quickLinks}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {quickLinks.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelect(q.id)}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white p-4 text-center shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: `${q.color}1A`, color: q.color }}
              >
                <Icon name={q.icon} className="text-[22px]" />
              </span>
              <span className="text-xs font-semibold leading-snug text-[#1E293B]">{q[language]}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5">
            <h2 className="text-sm font-bold text-[#1E293B]">{t.latestNotices}</h2>
            <button type="button" onClick={() => onSelect('notices')} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
              {t.viewAll}
            </button>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {notices.map((n, i) => (
              <li key={i} className="flex gap-3 px-5 py-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name="campaign" className="text-[17px]" />
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-1.5 text-[13px] leading-snug text-[#334155]">
                    {n[language]}
                    {n.isNew && (
                      <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">{t.new}</span>
                    )}
                  </p>
                  <span className="text-[11px] text-[#94A3B8]">{n.date[language]}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5">
            <h2 className="text-sm font-bold text-[#1E293B]">{t.formsGuidelines}</h2>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onSelect('online-application-form')} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                {t.viewAll}
              </button>
            </div>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {resources.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onSelect(r.target)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-[#F8FAFC]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${resourceColors[r.type]}1A`, color: resourceColors[r.type] }}
                  >
                    <Icon name={r.icon} className="text-[19px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#334155]">{r[language]}</p>
                    <span className="text-[11px] text-[#94A3B8]">{r.meta}</span>
                  </div>
                  <Icon name={r.type === 'video' ? 'play_arrow' : 'download'} className="text-[18px] text-[#94A3B8]" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setDrawerOpen(false)}>
          <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.drawerTitle}</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-4 px-5 py-5">
              <Field label={t.heroTitleEn}>
                <input value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} className={inputClass} />
              </Field>
              <Field label={t.heroTitleBn}>
                <input value={draft.titleBn} onChange={(e) => setDraft({ ...draft, titleBn: e.target.value })} className={inputClass} />
              </Field>
              <Field label={t.heroSubtitleEn}>
                <textarea rows={3} value={draft.subtitleEn} onChange={(e) => setDraft({ ...draft, subtitleEn: e.target.value })} className={`${inputClass} resize-none`} />
              </Field>
              <Field label={t.heroSubtitleBn}>
                <textarea rows={3} value={draft.subtitleBn} onChange={(e) => setDraft({ ...draft, subtitleBn: e.target.value })} className={`${inputClass} resize-none`} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t.primaryCtaEn}>
                  <input value={draft.primaryCtaEn} onChange={(e) => setDraft({ ...draft, primaryCtaEn: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t.primaryCtaBn}>
                  <input value={draft.primaryCtaBn} onChange={(e) => setDraft({ ...draft, primaryCtaBn: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t.secondaryCtaEn}>
                  <input value={draft.secondaryCtaEn} onChange={(e) => setDraft({ ...draft, secondaryCtaEn: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t.secondaryCtaBn}>
                  <input value={draft.secondaryCtaBn} onChange={(e) => setDraft({ ...draft, secondaryCtaBn: e.target.value })} className={inputClass} />
                </Field>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button type="button" onClick={saveDrawer} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]">
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
