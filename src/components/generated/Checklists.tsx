import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';
type Section = 'documents' | 'eligibility';

interface ChecklistsProps {
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
    pageTitle: 'Checklists',
    subtitle: 'Configurable checklist of required documents and eligibility criteria for every CBC service.',
    backToDashboard: 'Back to Dashboard',
    manageContent: 'Manage Checklists',
    services: 'Services',
    requiredDocuments: 'Required Documents',
    eligibilityCriteria: 'Eligibility Criteria',
    completed: 'completed',
    reset: 'Reset',
    print: 'Print / Download',
    addItem: 'Add Item',
    edit: 'Edit',
    delete: 'Delete',
    drawerAddTitle: 'Add Checklist Item',
    drawerEditTitle: 'Edit Checklist Item',
    section: 'Section',
    textEn: 'Item Text (English)',
    textBn: 'Item Text (Bangla)',
    cancel: 'Cancel',
    save: 'Save Item',
    confirmDeleteTitle: 'Remove this item?',
    confirmDeleteBody: 'This will remove the item from the checklist for this service.',
    confirmDeleteAction: 'Remove Item',
    items: 'items',
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'চেকলিস্ট',
    subtitle: 'প্রতিটি সিবিসি সেবার জন্য প্রয়োজনীয় নথি ও যোগ্যতার মানদণ্ডের কনফিগারযোগ্য চেকলিস্ট।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    manageContent: 'চেকলিস্ট ব্যবস্থাপনা',
    services: 'সেবাসমূহ',
    requiredDocuments: 'প্রয়োজনীয় নথি',
    eligibilityCriteria: 'যোগ্যতার মানদণ্ড',
    completed: 'সম্পন্ন',
    reset: 'রিসেট',
    print: 'প্রিন্ট / ডাউনলোড',
    addItem: 'আইটেম যোগ করুন',
    edit: 'সম্পাদনা',
    delete: 'মুছে ফেলুন',
    drawerAddTitle: 'চেকলিস্ট আইটেম যোগ করুন',
    drawerEditTitle: 'চেকলিস্ট আইটেম সম্পাদনা করুন',
    section: 'সেকশন',
    textEn: 'আইটেমের লেখা (ইংরেজি)',
    textBn: 'আইটেমের লেখা (বাংলা)',
    cancel: 'বাতিল',
    save: 'আইটেম সংরক্ষণ করুন',
    confirmDeleteTitle: 'এই আইটেমটি সরাবেন?',
    confirmDeleteBody: 'এটি এই সেবার চেকলিস্ট থেকে আইটেমটি সরিয়ে দেবে।',
    confirmDeleteAction: 'আইটেম সরান',
    items: 'টি আইটেম',
  },
};

interface ChecklistItem {
  id: string;
  en: string;
  bn: string;
}

interface ServiceChecklist {
  id: string;
  icon: string;
  en: string;
  bn: string;
  documents: ChecklistItem[];
  eligibility: ChecklistItem[];
}

const serviceChecklists: ServiceChecklist[] = [
  {
    id: 'new-bond-license',
    icon: 'note_add',
    en: 'New Bond License Application',
    bn: 'নতুন বন্ড লাইসেন্স আবেদন',
    documents: [
      { id: 'nbl-d1', en: 'Valid Trade License (renewed within last 1 year)', bn: 'বৈধ ট্রেড লাইসেন্স (গত ১ বছরের মধ্যে নবায়নকৃত)' },
      { id: 'nbl-d2', en: 'BIN and TIN Certificates', bn: 'বিআইএন ও টিআইএন সার্টিফিকেট' },
      { id: 'nbl-d3', en: 'Certificate of Incorporation / Partnership Deed', bn: 'নিবন্ধন সার্টিফিকেট / অংশীদারি দলিল' },
      { id: 'nbl-d4', en: 'Factory layout plan and rental agreement or land ownership document', bn: 'কারখানার লে-আউট পরিকল্পনা এবং ভাড়া চুক্তি বা জমির মালিকানা দলিল' },
      { id: 'nbl-d5', en: 'Bank solvency certificate', bn: 'ব্যাংক সলভেন্সি সার্টিফিকেট' },
    ],
    eligibility: [
      { id: 'nbl-e1', en: 'Applicant must hold a valid Trade License for at least 1 year', bn: 'আবেদনকারীর কমপক্ষে ১ বছরের বৈধ ট্রেড লাইসেন্স থাকতে হবে' },
      { id: 'nbl-e2', en: 'Factory premises must pass physical inspection', bn: 'কারখানা প্রাঙ্গণকে অবশ্যই সরেজমিন পরিদর্শনে উত্তীর্ণ হতে হবে' },
      { id: 'nbl-e3', en: 'No pending legal case against the applicant with NBR', bn: 'এনবিআরের সাথে আবেদনকারীর বিরুদ্ধে কোনো অমীমাংসিত আইনি মামলা থাকা যাবে না' },
    ],
  },
  {
    id: 'machinery-registration',
    icon: 'precision_manufacturing',
    en: 'Machinery Registration',
    bn: 'যন্ত্রপাতি নিবন্ধন',
    documents: [
      { id: 'mr-d1', en: 'Bill of Entry for imported machinery', bn: 'আমদানিকৃত যন্ত্রপাতির বিল অব এন্ট্রি' },
      { id: 'mr-d2', en: 'Machinery specification sheet', bn: 'যন্ত্রপাতির স্পেসিফিকেশন শিট' },
      { id: 'mr-d3', en: 'Installation certificate', bn: 'ইনস্টলেশন সার্টিফিকেট' },
      { id: 'mr-d4', en: 'Updated factory layout showing machinery placement', bn: 'যন্ত্রপাতির অবস্থান দেখানো হালনাগাদ কারখানা লে-আউট' },
    ],
    eligibility: [
      { id: 'mr-e1', en: 'Bond license must be active and in good standing', bn: 'বন্ড লাইসেন্স সক্রিয় ও সুষ্ঠু অবস্থায় থাকতে হবে' },
      { id: 'mr-e2', en: 'Machinery must be directly related to the licensed production category', bn: 'যন্ত্রপাতি অবশ্যই লাইসেন্সকৃত উৎপাদন শ্রেণীর সাথে সরাসরি সম্পর্কিত হতে হবে' },
      { id: 'mr-e3', en: 'No unresolved machinery audit discrepancies on record', bn: 'রেকর্ডে যন্ত্রপাতি সংক্রান্ত কোনো অমীমাংসিত নিরীক্ষা অসঙ্গতি থাকা যাবে না' },
    ],
  },
  {
    id: 'general-bond-renewal',
    icon: 'description',
    en: 'General Bond Renewal',
    bn: 'জেনারেল বন্ড নবায়ন',
    documents: [
      { id: 'gbr-d1', en: 'Hardcopy bond in revenue stamp (scanned copy)', bn: 'রাজস্ব স্ট্যাম্পে হার্ডকপি বন্ড (স্ক্যান কপি)' },
      { id: 'gbr-d2', en: 'Current bond license copy', bn: 'বর্তমান বন্ড লাইসেন্সের কপি' },
      { id: 'gbr-d3', en: 'Lien bank confirmation letter', bn: 'লিয়েন ব্যাংক নিশ্চিতকরণ পত্র' },
      { id: 'gbr-d4', en: 'Latest audit clearance (if applicable)', bn: 'সর্বশেষ নিরীক্ষা ক্লিয়ারেন্স (প্রযোজ্য ক্ষেত্রে)' },
    ],
    eligibility: [
      { id: 'gbr-e1', en: 'Renewal application must be submitted before bond expiry', bn: 'বন্ডের মেয়াদ শেষ হওয়ার পূর্বে নবায়ন আবেদন জমা দিতে হবে' },
      { id: 'gbr-e2', en: 'No outstanding dues against the existing bond', bn: 'বিদ্যমান বন্ডের বিপরীতে কোনো অপরিশোধিত পাওনা থাকা যাবে না' },
      { id: 'gbr-e3', en: 'Lien bank must remain active and empanelled', bn: 'লিয়েন ব্যাংক অবশ্যই সক্রিয় ও তালিকাভুক্ত থাকতে হবে' },
    ],
  },
  {
    id: 'annual-audit',
    icon: 'fact_check',
    en: 'Annual Audit',
    bn: 'বার্ষিক নিরীক্ষা',
    documents: [
      { id: 'aa-d1', en: 'Reconciled e-Passbook and Bond Register statements', bn: 'মিলকৃত ই-পাসবুক ও বন্ড রেজিস্টার বিবরণী' },
      { id: 'aa-d2', en: 'Inventory stock report (raw material and finished goods)', bn: 'ইনভেন্টরি স্টক রিপোর্ট (কাঁচামাল ও তৈরি পণ্য)' },
      { id: 'aa-d3', en: 'Machinery and utilization records', bn: 'যন্ত্রপাতি ও ব্যবহারের রেকর্ড' },
      { id: 'aa-d4', en: 'Previous audit report and compliance response (if any)', bn: 'পূর্ববর্তী নিরীক্ষা প্রতিবেদন ও সম্মতি জবাব (যদি থাকে)' },
    ],
    eligibility: [
      { id: 'aa-e1', en: 'Applicable to every bonded organization once per fiscal year', bn: 'প্রতি অর্থবছরে প্রতিটি বন্ডেড প্রতিষ্ঠানের জন্য প্রযোজ্য' },
      { id: 'aa-e2', en: 'All e-Passbook entries must be up to date before audit scheduling', bn: 'নিরীক্ষার সময়সূচির পূর্বে সকল ই-পাসবুক এন্ট্রি হালনাগাদ থাকতে হবে' },
      { id: 'aa-e3', en: 'Designated factory access must be provided to the audit team', bn: 'নিরীক্ষা দলের জন্য নির্ধারিত কারখানায় প্রবেশাধিকার প্রদান করতে হবে' },
    ],
  },
  {
    id: 'utilization-permission',
    icon: 'verified_user',
    en: 'Utilization Permission (UP)',
    bn: 'ইউটিলাইজেশন পারমিশন (ইউপি)',
    documents: [
      { id: 'up-d1', en: 'Approved Co-efficient / input-output ratio', bn: 'অনুমোদিত কো-এফিসিয়েন্ট / ইনপুট-আউটপুট অনুপাত' },
      { id: 'up-d2', en: 'Export L/C or contract copy', bn: 'রপ্তানি এলসি বা চুক্তির কপি' },
      { id: 'up-d3', en: 'Current e-Passbook balance statement', bn: 'বর্তমান ই-পাসবুক ব্যালেন্স বিবরণী' },
      { id: 'up-d4', en: 'Production order / work order copy', bn: 'উৎপাদন আদেশ / ওয়ার্ক অর্ডারের কপি' },
    ],
    eligibility: [
      { id: 'up-e1', en: 'Sufficient e-Passbook balance for the requested raw material quantity', bn: 'অনুরোধকৃত কাঁচামালের পরিমাণের জন্য পর্যাপ্ত ই-পাসবুক ব্যালেন্স থাকতে হবে' },
      { id: 'up-e2', en: 'Raw material must be within the approved HS Code list', bn: 'কাঁচামাল অবশ্যই অনুমোদিত এইচএস কোড তালিকার অন্তর্ভুক্ত হতে হবে' },
      { id: 'up-e3', en: 'No unresolved UD discrepancy for the same export order', bn: 'একই রপ্তানি আদেশের জন্য কোনো অমীমাংসিত ইউডি অসঙ্গতি থাকা যাবে না' },
    ],
  },
  {
    id: 'hs-code-inclusion',
    icon: 'tag',
    en: 'HS Code Inclusion Request',
    bn: 'এইচএস কোড অন্তর্ভুক্তির অনুরোধ',
    documents: [
      { id: 'hs-d1', en: 'Technical justification for the requested raw material', bn: 'অনুরোধকৃত কাঁচামালের প্রযুক্তিগত যৌক্তিকতা' },
      { id: 'hs-d2', en: 'Product sample specification or datasheet', bn: 'পণ্যের নমুনা স্পেসিফিকেশন বা ডেটাশিট' },
      { id: 'hs-d3', en: 'Proposed input-output co-efficient calculation', bn: 'প্রস্তাবিত ইনপুট-আউটপুট কো-এফিসিয়েন্ট হিসাব' },
    ],
    eligibility: [
      { id: 'hs-e1', en: 'Raw material must be directly consumed in the licensed finished product', bn: 'কাঁচামাল অবশ্যই লাইসেন্সকৃত তৈরি পণ্যে সরাসরি ব্যবহৃত হতে হবে' },
      { id: 'hs-e2', en: 'No duplicate HS Code already approved under the same license', bn: 'একই লাইসেন্সের আওতায় অনুরূপ এইচএস কোড ইতিমধ্যে অনুমোদিত থাকা যাবে না' },
      { id: 'hs-e3', en: 'Co-efficient provider validation required for applicable categories', bn: 'প্রযোজ্য শ্রেণীর জন্য কো-এফিসিয়েন্ট প্রোভাইডারের যাচাই প্রয়োজন' },
    ],
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

export function Checklists({ language, onDone }: ChecklistsProps) {
  const t = T[language];
  const [services, setServices] = useState<ServiceChecklist[]>(serviceChecklists);
  const [activeServiceId, setActiveServiceId] = useState(serviceChecklists[0].id);
  const [checkedMap, setCheckedMap] = useState<Record<string, Record<string, boolean>>>({});
  const [adminMode, setAdminMode] = useState(false);
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; section: Section; itemId?: string; textEn: string; textBn: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ section: Section; itemId: string } | null>(null);

  const activeService = services.find((s) => s.id === activeServiceId)!;
  const checkedForActive = checkedMap[activeServiceId] ?? {};

  const totalItems = activeService.documents.length + activeService.eligibility.length;
  const completedItems = useMemo(
    () => Object.values(checkedForActive).filter(Boolean).length,
    [checkedForActive],
  );

  const toggleChecked = (itemId: string) =>
    setCheckedMap((prev) => ({
      ...prev,
      [activeServiceId]: { ...prev[activeServiceId], [itemId]: !prev[activeServiceId]?.[itemId] },
    }));

  const resetChecklist = () => setCheckedMap((prev) => ({ ...prev, [activeServiceId]: {} }));

  const openAdd = (section: Section) => setDrawer({ mode: 'add', section, textEn: '', textBn: '' });
  const openEdit = (section: Section, item: ChecklistItem) =>
    setDrawer({ mode: 'edit', section, itemId: item.id, textEn: item.en, textBn: item.bn });

  const saveDrawer = () => {
    if (!drawer || !drawer.textEn || !drawer.textBn) return;
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== activeServiceId) return s;
        const list = s[drawer.section];
        if (drawer.mode === 'add') {
          return { ...s, [drawer.section]: [...list, { id: `item-${Date.now()}`, en: drawer.textEn, bn: drawer.textBn }] };
        }
        return { ...s, [drawer.section]: list.map((it) => (it.id === drawer.itemId ? { ...it, en: drawer.textEn, bn: drawer.textBn } : it)) };
      }),
    );
    setDrawer(null);
  };

  const removeItem = () => {
    if (!confirmDelete) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === activeServiceId ? { ...s, [confirmDelete.section]: s[confirmDelete.section].filter((it) => it.id !== confirmDelete.itemId) } : s,
      ),
    );
    setConfirmDelete(null);
  };

  const renderSection = (title: string, section: Section, items: ChecklistItem[]) => (
    <div className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-3.5">
        <h3 className="text-sm font-bold text-[#1E293B]">{title}</h3>
        {adminMode && (
          <button type="button" onClick={() => openAdd(section)} className="flex items-center gap-1 text-xs font-semibold text-[#0A4D8C] hover:underline">
            <Icon name="add" className="text-[15px]" />
            {t.addItem}
          </button>
        )}
      </div>
      <ul className="divide-y divide-[#F1F5F9]">
        {items.map((item) => {
          const checked = !!checkedForActive[item.id];
          return (
            <li key={item.id} className="flex items-start gap-3 px-5 py-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggleChecked(item.id)}
                className={[
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                  checked ? 'border-[#00A86B] bg-[#00A86B]' : 'border-[#CBD5E1] hover:border-[#0A4D8C]',
                ].join(' ')}
              >
                {checked && <Icon name="check" className="text-[14px] text-white" />}
              </button>
              <span className={`flex-1 text-[13px] leading-snug ${checked ? 'text-[#94A3B8] line-through' : 'text-[#334155]'}`}>
                {item[language]}
              </span>
              {adminMode && (
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => openEdit(section, item)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0A4D8C] hover:bg-[#EAF3FE]">
                    <Icon name="edit" className="text-[15px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete({ section, itemId: item.id })}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[#DC2626] hover:bg-red-50"
                  >
                    <Icon name="delete" className="text-[15px]" />
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-xl border border-[#E2E8F0] bg-white p-3 lg:sticky lg:top-6">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.services}</p>
          <ul className="flex flex-col gap-0.5">
            {services.map((s) => {
              const svcChecked = Object.values(checkedMap[s.id] ?? {}).filter(Boolean).length;
              const svcTotal = s.documents.length + s.eligibility.length;
              const isActive = s.id === activeServiceId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActiveServiceId(s.id)}
                    className={[
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      isActive ? 'bg-[#EAF3FE]' : 'hover:bg-[#F5F7FA]',
                    ].join(' ')}
                  >
                    <span className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', isActive ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#64748B]'].join(' ')}>
                      <Icon name={s.icon} className="text-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-[13px] font-semibold ${isActive ? 'text-[#0A4D8C]' : 'text-[#1E293B]'}`}>{s[language]}</span>
                      <span className="text-[11px] text-[#94A3B8]">
                        {svcChecked}/{svcTotal} {t.completed}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name={activeService.icon} className="text-[22px]" />
              </span>
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">{activeService[language]}</h2>
                <span className="text-xs text-[#64748B]">
                  {completedItems}/{totalItems} {t.completed} · {totalItems} {t.items}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
              >
                <Icon name="restart_alt" className="text-[16px]" />
                {t.reset}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#083E71]"
              >
                <Icon name="print" className="text-[16px]" />
                {t.print}
              </button>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
            <div
              className="h-full rounded-full bg-[#00A86B] transition-all duration-300"
              style={{ width: totalItems ? `${(completedItems / totalItems) * 100}%` : '0%' }}
            />
          </div>

          {renderSection(t.requiredDocuments, 'documents', activeService.documents)}
          {renderSection(t.eligibilityCriteria, 'eligibility', activeService.eligibility)}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setDrawer(null)}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{drawer.mode === 'add' ? t.drawerAddTitle : t.drawerEditTitle}</h2>
              <button type="button" onClick={() => setDrawer(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-4 px-5 py-5">
              <Field label={t.section}>
                <input
                  disabled
                  value={drawer.section === 'documents' ? t.requiredDocuments : t.eligibilityCriteria}
                  className={`${inputClass} bg-[#F5F7FA] text-[#64748B]`}
                />
              </Field>
              <Field label={t.textEn} required>
                <textarea
                  rows={2}
                  value={drawer.textEn}
                  onChange={(e) => setDrawer({ ...drawer, textEn: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <Field label={t.textBn} required>
                <textarea
                  rows={2}
                  value={drawer.textBn}
                  onChange={(e) => setDrawer({ ...drawer, textBn: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDrawer(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveDrawer}
                disabled={!drawer.textEn || !drawer.textBn}
                className="rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-40"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setConfirmDelete(null)}>
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
              <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.cancel}
              </button>
              <button type="button" onClick={removeItem} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
                {t.confirmDeleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
