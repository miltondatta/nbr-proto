import { useMemo, useState } from 'react';

type Language = 'en' | 'bn';
type NothiStatus = 'open' | 'forwarded' | 'closed';
type NothiModule = 'bond-license-application' | 'general-bond' | 'ownership-change' | 'name-change' | 'annual-audit' | 'legal-management';

interface ENothiManagementProps {
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
    pageTitle: 'e-Nothi Management',
    subtitle: 'Centralized electronic case-file (Nothi) system for CBC officials — create, examine, forward and close official notes across all bond licensing modules, in the style of the e-GP e-Note & Nothi workflow.',
    backToDashboard: 'Back to Dashboard',
    initiateNew: 'Initiate New Nothi',
    totalNothi: 'Total Nothi',
    open: 'Open',
    forwarded: 'Forwarded',
    closed: 'Closed',
    searchPlaceholder: 'Search by Nothi No., reference ID or name…',
    allModules: 'All Modules',
    allStatus: 'All Status',
    module: 'Module',
    reference: 'Reference',
    status: 'Status',
    initiatedBy: 'Initiated By',
    initiatedOn: 'Initiated On',
    currentHolder: 'Current Holder',
    entries: 'entries',
    noResults: 'No Nothi case files match your filters.',
    close: 'Close',
    nothiCaseFile: 'e-Nothi Case File',
    timeline: 'Timeline',
    addNote: 'Add Note',
    officerLabel: 'Officer',
    noteLabel: 'Note',
    notePlaceholder: 'Enter examination note or remarks…',
    attachDocument: 'Attach Document (simulate)',
    attached: 'attached',
    saveNote: 'Save Note',
    forwardNothi: 'Forward Nothi',
    forwardTo: 'Forward To',
    forwardNoteLabel: 'Forwarding Note',
    forwardBtn: 'Forward',
    closeNothiBtn: 'Close Nothi',
    reopenBtn: 'Re-open Nothi',
    forwardedNotice: (name: string) => `Nothi forwarded to ${name}.`,
    closedNotice: 'Nothi has been closed.',
    initiateTitle: 'Initiate New e-Nothi',
    referenceIdLabel: 'Reference ID (Application / Case No.)',
    referenceNameLabel: 'Reference Name (Applicant / Licensee)',
    initialNoteLabel: 'Initial Note',
    createBtn: 'Create e-Nothi',
    cancel: 'Cancel',
    required: 'Required',
    moduleLabels: {
      'bond-license-application': 'Bond License Application',
      'general-bond': 'General Bond Management',
      'ownership-change': 'License Ownership Change',
      'name-change': 'Company Name Change',
      'annual-audit': 'Annual Audit',
      'legal-management': 'Legal Management',
    },
    print: 'Print',
    forwardedFrom: 'Forwarded to',
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ই-নথি ব্যবস্থাপনা',
    subtitle: 'সিবিসি কর্মকর্তাদের জন্য কেন্দ্রীভূত ইলেকট্রনিক কেস-ফাইল (নথি) সিস্টেম — সকল বন্ড লাইসেন্সিং মডিউল জুড়ে অফিসিয়াল নোট তৈরি, পরীক্ষা, ফরওয়ার্ড ও বন্ধ করুন, ই-জিপি ই-নোট ও নথি প্রক্রিয়ার অনুরূপ।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    initiateNew: 'নতুন নথি শুরু করুন',
    totalNothi: 'মোট নথি',
    open: 'চলমান',
    forwarded: 'ফরওয়ার্ডকৃত',
    closed: 'বন্ধ',
    searchPlaceholder: 'নথি নং, রেফারেন্স আইডি বা নাম দিয়ে খুঁজুন…',
    allModules: 'সকল মডিউল',
    allStatus: 'সকল অবস্থা',
    module: 'মডিউল',
    reference: 'রেফারেন্স',
    status: 'অবস্থা',
    initiatedBy: 'শুরুকারী',
    initiatedOn: 'শুরুর তারিখ',
    currentHolder: 'বর্তমান দায়িত্বপ্রাপ্ত',
    entries: 'এন্ট্রি',
    noResults: 'আপনার ফিল্টারের সাথে মিলে এমন কোনো নথি কেস ফাইল নেই।',
    close: 'বন্ধ করুন',
    nothiCaseFile: 'ই-নথি কেস ফাইল',
    timeline: 'সময়রেখা',
    addNote: 'নোট যোগ করুন',
    officerLabel: 'কর্মকর্তা',
    noteLabel: 'নোট',
    notePlaceholder: 'পরীক্ষার মন্তব্য বা রিমার্কস লিখুন…',
    attachDocument: 'নথি সংযুক্ত করুন (সিমুলেট)',
    attached: 'সংযুক্ত',
    saveNote: 'নোট সংরক্ষণ করুন',
    forwardNothi: 'নথি ফরওয়ার্ড করুন',
    forwardTo: 'ফরওয়ার্ড করুন',
    forwardNoteLabel: 'ফরওয়ার্ডিং নোট',
    forwardBtn: 'ফরওয়ার্ড',
    closeNothiBtn: 'নথি বন্ধ করুন',
    reopenBtn: 'নথি পুনরায় চালু করুন',
    forwardedNotice: (name: string) => `নথি ${name}-এর কাছে ফরওয়ার্ড করা হয়েছে।`,
    closedNotice: 'নথিটি বন্ধ করা হয়েছে।',
    initiateTitle: 'নতুন ই-নথি শুরু করুন',
    referenceIdLabel: 'রেফারেন্স আইডি (আবেদন / মামলা নং)',
    referenceNameLabel: 'রেফারেন্স নাম (আবেদনকারী / লাইসেন্সি)',
    initialNoteLabel: 'প্রাথমিক নোট',
    createBtn: 'ই-নথি তৈরি করুন',
    cancel: 'বাতিল',
    required: 'আবশ্যক',
    moduleLabels: {
      'bond-license-application': 'বন্ড লাইসেন্স আবেদন',
      'general-bond': 'জেনারেল বন্ড ব্যবস্থাপনা',
      'ownership-change': 'লাইসেন্স মালিকানা পরিবর্তন',
      'name-change': 'কোম্পানির নাম পরিবর্তন',
      'annual-audit': 'বার্ষিক নিরীক্ষা',
      'legal-management': 'আইনি ব্যবস্থাপনা',
    },
    print: 'প্রিন্ট',
    forwardedFrom: 'ফরওয়ার্ড করা হয়েছে',
  },
};

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';

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

const officerPool = [
  { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  { en: 'Nusrat Jahan (ARO, Narayanganj Zone)', bn: 'নুসরাত জাহান (এআরও, নারায়ণগঞ্জ জোন)' },
  { en: 'Commissioner, Customs Bond Commissionerate', bn: 'কমিশনার, কাস্টমস বন্ড কমিশনারেট' },
];

const moduleOptions: NothiModule[] = ['bond-license-application', 'general-bond', 'ownership-change', 'name-change', 'annual-audit', 'legal-management'];

const statusColors: Record<NothiStatus, { bg: string; text: string }> = {
  open: { bg: 'bg-blue-50', text: 'text-[#0A4D8C]' },
  forwarded: { bg: 'bg-amber-50', text: 'text-amber-700' },
  closed: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

interface NothiNote {
  id: string;
  officer: string;
  note: string;
  date: string;
  attached?: boolean;
  forwardedTo?: string;
}

interface NothiCase {
  id: string;
  module: NothiModule;
  referenceId: string;
  referenceName: string;
  initiatedBy: string;
  initiatedDate: string;
  status: NothiStatus;
  currentHolder: string;
  notes: NothiNote[];
}

const seedCases: NothiCase[] = [
  {
    id: 'NOTHI-2026-00201', module: 'bond-license-application', referenceId: 'APP-2026-70211', referenceName: 'Comfort Knit Composite Ltd.',
    initiatedBy: officerPool[0].en, initiatedDate: '18 Jul 2026', status: 'open', currentHolder: officerPool[0].en,
    notes: [{ id: 'n1', officer: officerPool[0].en, note: 'Application received. Document set forwarded for RO-level examination.', date: '18 Jul 2026' }],
  },
  {
    id: 'NOTHI-2026-00195', module: 'bond-license-application', referenceId: 'APP-2026-70198', referenceName: 'Silver Line Garments Ltd.',
    initiatedBy: officerPool[1].en, initiatedDate: '13 Jul 2026', status: 'forwarded', currentHolder: officerPool[2].en,
    notes: [
      { id: 'n1', officer: officerPool[1].en, note: 'All submitted documents examined and found in order. Trade license, BIN/TIN certificates and factory layout plan verified against application.', date: '13 Jul 2026' },
      { id: 'n2', officer: officerPool[1].en, note: 'Forwarded to Inspection Team for factory visit scheduling.', date: '14 Jul 2026', forwardedTo: officerPool[2].en },
    ],
  },
  {
    id: 'NOTHI-2026-00180', module: 'bond-license-application', referenceId: 'APP-2026-70180', referenceName: 'Orchid Fashions Ltd.',
    initiatedBy: officerPool[2].en, initiatedDate: '04 Jul 2026', status: 'forwarded', currentHolder: officerPool[4].en,
    notes: [
      { id: 'n1', officer: officerPool[2].en, note: 'Documents examined and verified complete. Land ownership documents and bank solvency certificate cross-checked with originals.', date: '04 Jul 2026' },
      { id: 'n2', officer: officerPool[2].en, note: 'Factory premises inspected; machinery matched declared list; workers present as per payroll register.', date: '10 Jul 2026' },
      { id: 'n3', officer: officerPool[2].en, note: 'Final e-Applicant Report submitted — Favorable. Forwarded to Commissioner for approval decision.', date: '11 Jul 2026', forwardedTo: officerPool[4].en },
    ],
  },
  {
    id: 'NOTHI-2026-00145', module: 'bond-license-application', referenceId: 'APP-2026-70145', referenceName: 'Vertex Apparels Ltd.',
    initiatedBy: officerPool[0].en, initiatedDate: '17 Jun 2026', status: 'closed', currentHolder: officerPool[0].en,
    notes: [
      { id: 'n1', officer: officerPool[0].en, note: 'Full document set examined; trade license and machinery import invoices verified. Application forwarded for factory inspection.', date: '17 Jun 2026' },
      { id: 'n2', officer: officerPool[0].en, note: 'Site visit completed without issue; utility connections verified against declared load.', date: '22 Jun 2026' },
      { id: 'n3', officer: officerPool[0].en, note: 'All checks passed. Approved for issuance. License No. BL-2026-05102 issued; Nothi closed.', date: '25 Jun 2026' },
    ],
  },
  {
    id: 'NOTHI-2026-00088', module: 'general-bond', referenceId: 'GB-2026-3312', referenceName: 'DBL Group',
    initiatedBy: officerPool[1].en, initiatedDate: '19 Jul 2026', status: 'open', currentHolder: officerPool[1].en,
    notes: [{ id: 'n1', officer: officerPool[1].en, note: 'Lien Bank confirmation awaited before General Bond can be countersigned and issued.', date: '19 Jul 2026' }],
  },
  {
    id: 'NOTHI-2026-00076', module: 'ownership-change', referenceId: 'OWN-2026-1140', referenceName: 'Beximco Textiles Limited',
    initiatedBy: officerPool[2].en, initiatedDate: '02 Jul 2026', status: 'closed', currentHolder: officerPool[2].en,
    notes: [{ id: 'n1', officer: officerPool[2].en, note: 'Ownership transfer documents verified and approved. Updated license reissued under new ownership; Nothi closed.', date: '06 Jul 2026' }],
  },
  {
    id: 'NOTHI-2026-00071', module: 'name-change', referenceId: 'NCH-2026-0847', referenceName: 'Envoy Textiles Ltd. → Envoy Fabrics Ltd.',
    initiatedBy: officerPool[3].en, initiatedDate: '15 Jul 2026', status: 'forwarded', currentHolder: officerPool[4].en,
    notes: [{ id: 'n1', officer: officerPool[3].en, note: 'Name change gazette notification verified; forwarded to Commissioner for final sign-off.', date: '16 Jul 2026', forwardedTo: officerPool[4].en }],
  },
  {
    id: 'NOTHI-2026-00052', module: 'annual-audit', referenceId: 'AUD-2026-0219', referenceName: 'Ha-Meem Group',
    initiatedBy: officerPool[0].en, initiatedDate: '08 Jul 2026', status: 'open', currentHolder: officerPool[0].en,
    notes: [{ id: 'n1', officer: officerPool[0].en, note: 'Annual audit discrepancy flagged in machinery utilization; case referred for clarification from licensee.', date: '08 Jul 2026' }],
  },
  {
    id: 'NOTHI-2026-00034', module: 'legal-management', referenceId: 'CASE-2026-0071', referenceName: 'Epic Designers Ltd.',
    initiatedBy: officerPool[2].en, initiatedDate: '21 Jul 2026', status: 'open', currentHolder: officerPool[2].en,
    notes: [{ id: 'n1', officer: officerPool[2].en, note: 'Show-cause notice issued for non-compliance found during audit; legal proceedings initiated.', date: '21 Jul 2026' }],
  },
];

function NewNothiModal({
  language,
  t,
  onClose,
  onCreate,
}: {
  language: Language;
  t: (typeof T)['en'];
  onClose: () => void;
  onCreate: (c: { module: NothiModule; referenceId: string; referenceName: string; officer: string; note: string }) => void;
}) {
  const [module, setModule] = useState<NothiModule>('bond-license-application');
  const [referenceId, setReferenceId] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [officer, setOfficer] = useState(officerPool[0].en);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const submit = () => {
    const nextErrors: Record<string, boolean> = {};
    if (!referenceId) nextErrors.referenceId = true;
    if (!referenceName) nextErrors.referenceName = true;
    if (!note) nextErrors.note = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onCreate({ module, referenceId, referenceName, officer, note });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.initiateTitle}</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">
          <Field label={t.module}>
            <select value={module} onChange={(e) => setModule(e.target.value as NothiModule)} className={inputClass}>
              {moduleOptions.map((m) => (
                <option key={m} value={m}>
                  {t.moduleLabels[m]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.referenceIdLabel} required error={errors.referenceId ? t.required : undefined}>
            <input value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="APP-2026-70XXX" className={inputClass} />
          </Field>
          <Field label={t.referenceNameLabel} required error={errors.referenceName ? t.required : undefined}>
            <input value={referenceName} onChange={(e) => setReferenceName(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t.officerLabel}>
            <select value={officer} onChange={(e) => setOfficer(e.target.value)} className={inputClass}>
              {officerPool.map((o) => (
                <option key={o.en} value={o.en}>
                  {o[language]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.initialNoteLabel} required error={errors.note ? t.required : undefined}>
            <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.notePlaceholder} className={`${inputClass} resize-none`} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            {t.cancel}
          </button>
          <button type="button" onClick={submit} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
            {t.createBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ENothiManagement({ language, onDone }: ENothiManagementProps) {
  const t = T[language];
  const [cases, setCases] = useState<NothiCase[]>(seedCases);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'all' | NothiModule>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | NothiStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [noteOfficer, setNoteOfficer] = useState(officerPool[0].en);
  const [attachDraft, setAttachDraft] = useState(false);
  const [forwardTarget, setForwardTarget] = useState(officerPool[1].en);
  const [forwardNote, setForwardNote] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(
    () => ({
      total: cases.length,
      open: cases.filter((c) => c.status === 'open').length,
      forwarded: cases.filter((c) => c.status === 'forwarded').length,
      closed: cases.filter((c) => c.status === 'closed').length,
    }),
    [cases]
  );

  const filtered = cases.filter((c) => {
    if (moduleFilter !== 'all' && c.module !== moduleFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.id.toLowerCase().includes(q) && !c.referenceId.toLowerCase().includes(q) && !c.referenceName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const selected = cases.find((c) => c.id === selectedId) ?? null;

  const openCase = (c: NothiCase) => {
    setSelectedId(c.id);
    setNoteDraft('');
    setAttachDraft(false);
    setForwardNote('');
    setNoteOfficer(c.currentHolder);
    setForwardTarget(officerPool.find((o) => o.en !== c.currentHolder)?.en ?? officerPool[0].en);
  };

  const updateCase = (id: string, patch: Partial<NothiCase>) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addNote = () => {
    if (!selected || !noteDraft.trim()) return;
    const entry: NothiNote = { id: `n-${Date.now()}`, officer: noteOfficer, note: noteDraft, date: '23 Jul 2026', attached: attachDraft };
    updateCase(selected.id, { notes: [...selected.notes, entry] });
    setNoteDraft('');
    setAttachDraft(false);
  };

  const forwardCase = () => {
    if (!selected || !forwardNote.trim()) return;
    const entry: NothiNote = { id: `n-${Date.now()}`, officer: selected.currentHolder, note: forwardNote, date: '23 Jul 2026', forwardedTo: forwardTarget };
    updateCase(selected.id, { notes: [...selected.notes, entry], status: 'forwarded', currentHolder: forwardTarget });
    setForwardNote('');
    flash(t.forwardedNotice(forwardTarget));
  };

  const closeCase = () => {
    if (!selected) return;
    updateCase(selected.id, { status: 'closed' });
    flash(t.closedNotice);
  };

  const reopenCase = () => {
    if (!selected) return;
    updateCase(selected.id, { status: 'open' });
  };

  const createCase = (c: { module: NothiModule; referenceId: string; referenceName: string; officer: string; note: string }) => {
    const newCase: NothiCase = {
      id: `NOTHI-2026-${String(Math.floor(200 + Math.random() * 90)).padStart(5, '0')}`,
      module: c.module,
      referenceId: c.referenceId,
      referenceName: c.referenceName,
      initiatedBy: c.officer,
      initiatedDate: '23 Jul 2026',
      status: 'open',
      currentHolder: c.officer,
      notes: [{ id: 'n1', officer: c.officer, note: c.note, date: '23 Jul 2026' }],
    };
    setCases((prev) => [newCase, ...prev]);
    setShowNew(false);
    setSelectedId(newCase.id);
  };

  if (selected) {
    const colors = statusColors[selected.status];
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelectedId(null)}>
        <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
            <div>
              <h2 className="flex items-center gap-1.5 text-base font-bold text-[#1E293B]">
                <Icon name="history_edu" className="text-[20px] text-[#0A4D8C]" />
                {selected.id}
              </h2>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {t.moduleLabels[selected.module]} · {selected.referenceId} · {selected.referenceName}
              </p>
            </div>
            <button type="button" onClick={() => setSelectedId(null)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>

          {toast && (
            <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
              <Icon name="check_circle" className="text-[16px]" />
              {toast}
            </div>
          )}

          <div className="flex flex-col gap-5 px-5 py-5">
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] p-4 text-[12px] sm:grid-cols-4">
              <div>
                <p className="text-[#94A3B8]">{t.status}</p>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${colors.bg} ${colors.text}`}>
                  {selected.status === 'open' ? t.open : selected.status === 'forwarded' ? t.forwarded : t.closed}
                </span>
              </div>
              <div>
                <p className="text-[#94A3B8]">{t.initiatedBy}</p>
                <p className="font-semibold text-[#1E293B]">{selected.initiatedBy.split('(')[0].trim()}</p>
              </div>
              <div>
                <p className="text-[#94A3B8]">{t.initiatedOn}</p>
                <p className="font-semibold text-[#1E293B]">{selected.initiatedDate}</p>
              </div>
              <div>
                <p className="text-[#94A3B8]">{t.currentHolder}</p>
                <p className="font-semibold text-[#1E293B]">{selected.currentHolder.split('(')[0].trim()}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{t.timeline}</p>
              <ol className="flex flex-col gap-4">
                {selected.notes.map((entry, i) => (
                  <li key={entry.id} className="relative flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
                        <Icon name={entry.forwardedTo ? 'forward' : 'description'} className="text-[14px]" />
                      </span>
                      {i < selected.notes.length - 1 && <span className="w-0.5 flex-1 bg-[#E2E8F0]" style={{ minHeight: '12px' }} />}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-[#1E293B]">{entry.officer.split('(')[0].trim()}</span>
                        <span className="text-[11px] text-[#94A3B8]">{entry.date}</span>
                      </div>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-[#334155]">{entry.note}</p>
                      {entry.attached && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[10px] font-semibold text-[#334155]">
                          <Icon name="attach_file" className="text-[12px]" />
                          {t.attached}
                        </span>
                      )}
                      {entry.forwardedTo && (
                        <span className="mt-1 ml-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          <Icon name="forward" className="text-[12px]" />
                          {t.forwardedFrom}: {entry.forwardedTo.split('(')[0].trim()}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {selected.status !== 'closed' && (
              <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
                <p className="text-xs font-semibold text-[#334155]">{t.addNote}</p>
                <Field label={t.officerLabel}>
                  <select value={noteOfficer} onChange={(e) => setNoteOfficer(e.target.value)} className={inputClass}>
                    {officerPool.map((o) => (
                      <option key={o.en} value={o.en}>
                        {o[language]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t.noteLabel}>
                  <textarea rows={3} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder={t.notePlaceholder} className={`${inputClass} resize-none`} />
                </Field>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAttachDraft((v) => !v)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${attachDraft ? 'border-[#00A86B] bg-emerald-50 text-emerald-700' : 'border-[#CBD5E1] text-[#334155]'}`}
                  >
                    <Icon name="attach_file" className="text-[13px]" />
                    {t.attachDocument}
                  </button>
                  <button type="button" disabled={!noteDraft.trim()} onClick={addNote} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                    {t.saveNote}
                  </button>
                </div>
              </div>
            )}

            {selected.status !== 'closed' && (
              <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
                <p className="text-xs font-semibold text-[#334155]">{t.forwardNothi}</p>
                <Field label={t.forwardTo}>
                  <select value={forwardTarget} onChange={(e) => setForwardTarget(e.target.value)} className={inputClass}>
                    {officerPool
                      .filter((o) => o.en !== selected.currentHolder)
                      .map((o) => (
                        <option key={o.en} value={o.en}>
                          {o[language]}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label={t.forwardNoteLabel}>
                  <textarea rows={2} value={forwardNote} onChange={(e) => setForwardNote(e.target.value)} className={`${inputClass} resize-none`} />
                </Field>
                <button type="button" disabled={!forwardNote.trim()} onClick={forwardCase} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#0A4D8C] px-4 py-2 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE] disabled:opacity-40">
                  <Icon name="forward" className="text-[15px]" />
                  {t.forwardBtn}
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {selected.status === 'closed' ? (
                <button type="button" onClick={reopenCase} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                  <Icon name="lock_open" className="text-[15px]" />
                  {t.reopenBtn}
                </button>
              ) : (
                <button type="button" onClick={closeCase} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]">
                  <Icon name="task_alt" className="text-[15px]" />
                  {t.closeNothiBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      {showNew && <NewNothiModal language={language} t={t} onClose={() => setShowNew(false)} onCreate={createCase} />}

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setShowNew(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#083E71]">
            <Icon name="add" className="text-[16px]" />
            {t.initiateNew}
          </button>
          <button type="button" onClick={onDone} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.backToDashboard}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t.totalNothi, value: stats.total, icon: 'folder_open', color: 'text-[#0A4D8C]' },
          { label: t.open, value: stats.open, icon: 'lock_open', color: 'text-[#0A4D8C]' },
          { label: t.forwarded, value: stats.forwarded, icon: 'forward', color: 'text-amber-700' },
          { label: t.closed, value: stats.closed, icon: 'task_alt', color: 'text-emerald-700' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F7FA] ${s.color}`}>
              <Icon name={s.icon} className="text-[20px]" />
            </span>
            <div>
              <p className="text-lg font-bold text-[#1E293B]">{s.value}</p>
              <p className="text-[11px] text-[#64748B]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value as 'all' | NothiModule)} className={`${inputClass} sm:w-56`}>
          <option value="all">{t.allModules}</option>
          {moduleOptions.map((m) => (
            <option key={m} value={m}>
              {t.moduleLabels[m]}
            </option>
          ))}
        </select>
        <div className="flex gap-1.5">
          {(['all', 'open', 'forwarded', 'closed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                statusFilter === s ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
              ].join(' ')}
            >
              {s === 'all' ? t.allStatus : s === 'open' ? t.open : s === 'forwarded' ? t.forwarded : t.closed}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white py-12 text-center text-sm text-[#94A3B8]">{t.noResults}</p>
        ) : (
          filtered.map((c) => {
            const colors = statusColors[c.status];
            return (
              <button key={c.id} type="button" onClick={() => openCase(c)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name="history_edu" className="text-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#0A4D8C]">{c.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}>{c.status === 'open' ? t.open : c.status === 'forwarded' ? t.forwarded : t.closed}</span>
                    <span className="rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[10px] font-semibold text-[#334155]">{t.moduleLabels[c.module]}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[13px] font-medium text-[#334155]">
                    {c.referenceId} · {c.referenceName}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">
                    {t.initiatedBy}: {c.initiatedBy.split('(')[0].trim()} · {c.initiatedDate} · {c.notes.length} {t.entries}
                  </p>
                </div>
                <Icon name="chevron_right" className="shrink-0 text-[20px] text-[#94A3B8]" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
