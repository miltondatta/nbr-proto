import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';

interface OnlineApplicationFormProps {
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
    pageTitle: 'Online Application Form',
    subtitle: 'Category-wise directory of hyperlinks to the online application forms for every CBC service.',
    backToDashboard: 'Back to Dashboard',
    manageContent: 'Manage Forms',
    addForm: 'Add Form',
    searchPlaceholder: 'Search application forms…',
    all: 'All Forms',
    noResultsTitle: 'No forms found',
    noResultsBody: 'Try a different search term or category filter.',
    download: 'Download',
    edit: 'Edit',
    delete: 'Delete',
    drawerAddTitle: 'Add Application Form',
    drawerEditTitle: 'Edit Application Form',
    category: 'Category',
    nameEn: 'Form Name (English)',
    nameBn: 'Form Name (Bangla)',
    fileSize: 'File Size',
    relatedService: 'Related Service',
    cancel: 'Cancel',
    save: 'Save Form',
    confirmDeleteTitle: 'Remove this form?',
    confirmDeleteBody: 'This will remove the form from the public Online Application Form directory.',
    confirmDeleteAction: 'Remove Form',
    required: 'Required',
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'অনলাইন আবেদন ফরম',
    subtitle: 'প্রতিটি সিবিসি সেবার অনলাইন আবেদন ফরমের হাইপারলিংকের ক্যাটাগরি-ভিত্তিক ডিরেক্টরি।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    manageContent: 'ফরম ব্যবস্থাপনা',
    addForm: 'ফরম যোগ করুন',
    searchPlaceholder: 'আবেদন ফরম অনুসন্ধান করুন…',
    all: 'সকল ফরম',
    noResultsTitle: 'কোনো ফরম পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন অনুসন্ধান শব্দ বা ক্যাটাগরি ফিল্টার ব্যবহার করে দেখুন।',
    download: 'ডাউনলোড',
    edit: 'সম্পাদনা',
    delete: 'মুছে ফেলুন',
    drawerAddTitle: 'আবেদন ফরম যোগ করুন',
    drawerEditTitle: 'আবেদন ফরম সম্পাদনা করুন',
    category: 'ক্যাটাগরি',
    nameEn: 'ফরমের নাম (ইংরেজি)',
    nameBn: 'ফরমের নাম (বাংলা)',
    fileSize: 'ফাইল সাইজ',
    relatedService: 'সংশ্লিষ্ট সেবা',
    cancel: 'বাতিল',
    save: 'ফরম সংরক্ষণ করুন',
    confirmDeleteTitle: 'এই ফরমটি সরাবেন?',
    confirmDeleteBody: 'এটি অনলাইন আবেদন ফরম ডিরেক্টরি থেকে ফরমটি সরিয়ে দেবে।',
    confirmDeleteAction: 'ফরম সরান',
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

interface FormDoc {
  id: string;
  categoryId: string;
  nameEn: string;
  nameBn: string;
  relatedService: string;
  fileSize: string;
}

const initialForms: FormDoc[] = [
  { id: 'f1', categoryId: 'licensing', nameEn: 'New Bond License Application Form', nameBn: 'নতুন বন্ড লাইসেন্স আবেদন ফরম', relatedService: 'New Bond License Application', fileSize: '480 KB' },
  { id: 'f2', categoryId: 'licensing', nameEn: 'License Ownership Change Form', nameBn: 'লাইসেন্স মালিকানা পরিবর্তন ফরম', relatedService: 'Bond License Ownership Change', fileSize: '310 KB' },
  { id: 'f3', categoryId: 'licensing', nameEn: 'Company Name Change Form', nameBn: 'কোম্পানির নাম পরিবর্তন ফরম', relatedService: 'Company Name Change', fileSize: '265 KB' },
  { id: 'f4', categoryId: 'licensing', nameEn: 'HS Code Inclusion Request Form', nameBn: 'এইচএস কোড অন্তর্ভুক্তির অনুরোধ ফরম', relatedService: 'HS Code Inclusion Request', fileSize: '220 KB' },
  { id: 'f5', categoryId: 'inventory', nameEn: 'General Bond Renewal Form', nameBn: 'জেনারেল বন্ড নবায়ন ফরম', relatedService: 'General Bond Management', fileSize: '195 KB' },
  { id: 'f6', categoryId: 'inventory', nameEn: 'Special General Bond Application Form', nameBn: 'স্পেশাল জেনারেল বন্ড আবেদন ফরম', relatedService: 'General Bond Management', fileSize: '205 KB' },
  { id: 'f7', categoryId: 'inventory', nameEn: 'Local Purchase & Sales Application Form', nameBn: 'স্থানীয় ক্রয় ও বিক্রয় আবেদন ফরম', relatedService: 'Local Purchase & Sales', fileSize: '240 KB' },
  { id: 'f8', categoryId: 'inventory', nameEn: 'Ex-Bond Requisition Form', nameBn: 'এক্স-বন্ড রিকুইজিশন ফরম', relatedService: 'Ex-Bond Entry', fileSize: '180 KB' },
  { id: 'f9', categoryId: 'machinery', nameEn: 'Machinery Registration Form', nameBn: 'যন্ত্রপাতি নিবন্ধন ফরম', relatedService: 'Machinery Registration', fileSize: '310 KB' },
  { id: 'f10', categoryId: 'machinery', nameEn: 'Machinery Sale / Transfer Application Form', nameBn: 'যন্ত্রপাতি বিক্রয় / হস্তান্তর আবেদন ফরম', relatedService: 'Machinery Sale / Transfer', fileSize: '275 KB' },
  { id: 'f11', categoryId: 'machinery', nameEn: 'Machinery Decommissioning Form', nameBn: 'যন্ত্রপাতি অবলুপ্তকরণ ফরম', relatedService: 'Machinery Decommissioning', fileSize: '190 KB' },
  { id: 'f12', categoryId: 'compliance', nameEn: 'Annual Audit Scheduling Form', nameBn: 'বার্ষিক নিরীক্ষা সময়সূচি ফরম', relatedService: 'Annual Audit', fileSize: '230 KB' },
  { id: 'f13', categoryId: 'banking', nameEn: 'Lien Bank Addition / Change Form', nameBn: 'লিয়েন ব্যাংক সংযোজন / পরিবর্তন ফরম', relatedService: 'Lien Bank Management', fileSize: '200 KB' },
  { id: 'f14', categoryId: 'utilization', nameEn: 'Utilization Permission (UP) Application Form', nameBn: 'ইউটিলাইজেশন পারমিশন (ইউপি) আবেদন ফরম', relatedService: 'Utilization Permission (UP)', fileSize: '250 KB' },
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

function categoryOf(id: string) {
  return categories.find((c) => c.id === id)!;
}

const emptyDraft = (): FormDoc => ({ id: `f-${Date.now()}`, categoryId: categories[0].id, nameEn: '', nameBn: '', relatedService: '', fileSize: '' });

export function OnlineApplicationForm({ language, onDone }: OnlineApplicationFormProps) {
  const t = T[language];
  const [forms, setForms] = useState<FormDoc[]>(initialForms);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; draft: FormDoc } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return forms.filter((f) => {
      const matchesCategory = !activeCategory || f.categoryId === activeCategory;
      const matchesSearch = !q || f.nameEn.toLowerCase().includes(q) || f.nameBn.includes(q) || f.relatedService.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [forms, search, activeCategory]);

  const countFor = (catId: string | null) => forms.filter((f) => !catId || f.categoryId === catId).length;

  const openAdd = () => setDrawer({ mode: 'add', draft: emptyDraft() });
  const openEdit = (f: FormDoc) => setDrawer({ mode: 'edit', draft: { ...f } });

  const saveDraft = () => {
    if (!drawer) return;
    const d = drawer.draft;
    if (!d.nameEn || !d.nameBn) return;
    setForms((prev) => (drawer.mode === 'add' ? [d, ...prev] : prev.map((f) => (f.id === d.id ? d : f))));
    setDrawer(null);
  };

  const removeForm = (id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6">
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
                <span className={['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out', adminMode ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
              </button>
            </label>
            {adminMode && (
              <button type="button" onClick={openAdd} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#048f5c]">
                <Icon name="add" className="text-[16px]" />
                {t.addForm}
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
            return (
              <div key={f.id} className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#B91C1C]">
                  <Icon name="picture_as_pdf" className="text-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}>
                      {cat[language]}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold leading-snug text-[#1E293B]">{f[language === 'en' ? 'nameEn' : 'nameBn']}</h3>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    {t.relatedService}: {f.relatedService} · PDF · {f.fileSize}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {adminMode && (
                    <>
                      <button type="button" onClick={() => openEdit(f)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                        <Icon name="edit" className="text-[16px]" />
                        {t.edit}
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(f.id)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50">
                        <Icon name="delete" className="text-[16px]" />
                        {t.delete}
                      </button>
                    </>
                  )}
                  <button type="button" className="flex items-center gap-1 rounded-lg border border-[#CBD5E1] px-3 py-1.5 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
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
              <Field label={t.category} required>
                <select value={drawer.draft.categoryId} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, categoryId: e.target.value } })} className={inputClass}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c[language]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.nameEn} required>
                <input value={drawer.draft.nameEn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, nameEn: e.target.value } })} placeholder="e.g. Machinery Registration Form" className={inputClass} />
              </Field>
              <Field label={t.nameBn} required>
                <input value={drawer.draft.nameBn} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, nameBn: e.target.value } })} placeholder="যেমন: যন্ত্রপাতি নিবন্ধন ফরম" className={inputClass} />
              </Field>
              <Field label={t.relatedService}>
                <input value={drawer.draft.relatedService} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, relatedService: e.target.value } })} className={inputClass} />
              </Field>
              <Field label={t.fileSize}>
                <input value={drawer.draft.fileSize} onChange={(e) => setDrawer({ ...drawer, draft: { ...drawer.draft, fileSize: e.target.value } })} placeholder="480 KB" className={inputClass} />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDrawer(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
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
              <button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button type="button" onClick={() => removeForm(confirmDeleteId)} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                {t.confirmDeleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
