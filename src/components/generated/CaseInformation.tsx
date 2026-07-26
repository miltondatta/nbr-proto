import { useMemo, useState } from 'react';
import { bondLicenses } from './bondLicenseData';
import { cbcCases as seedCases, courtTypeLabels, groundLabels, legalCaseOf, licenseOf, type AttachmentDoc, type CaseGround, type CbcCase, type CourtProceedingEntry, type CourtType } from './caseInfoData';
import { stageLabels as legalStageLabels } from './legalData';
type Language = 'en' | 'bn';
interface CaseInformationProps {
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
const inputClass = 'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
function Field({
  label,
  children,
  required
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
    </label>;
}
function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />;
}
function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: number | string;
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
function GroundBadge({
  ground,
  language
}: {
  ground: CaseGround;
  language: Language;
}) {
  return <span className="rounded-full bg-[#EAF3FE] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C]">{groundLabels[ground][language]}</span>;
}
const normalizeLicenseNo = (s: string) => s.trim().toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, '');
const ACTION_BTN = 'inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]';
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const today = new Date('2026-07-26T00:00:00');
function nextActivityFor(c: CbcCase): {
  date: string;
  courtType: CourtType;
} | null {
  let best: {
    date: string;
    ts: number;
    courtType: CourtType;
  } | null = null;
  for (const p of c.proceedings) {
    for (const hd of p.hearingDates) {
      const ts = new Date(hd).getTime();
      if (Number.isFinite(ts) && ts >= today.getTime() && (!best || ts < best.ts)) {
        best = {
          date: hd,
          ts,
          courtType: p.courtType
        };
      }
    }
  }
  return best ? {
    date: best.date,
    courtType: best.courtType
  } : null;
}
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Case Information Input',
    subtitle: 'CBC e-Case Register for filing cases against Bonders (tax evasion, criminal, money laundering, non-compliance), plus court proceeding logging (writ, High Court, appellate) that auto-forwards verdict information to Legal Procedure Management.',
    backToDashboard: 'Back to Dashboard',
    registerCase: 'Register New Case',
    activeCases: 'Active Cases',
    upcomingActivity: 'Upcoming Court Activity (30 Days)',
    pendingForward: 'Verdicts Pending Forward to Legal',
    closedCases: 'Closed Cases',
    dashboardTitle: 'Notification Dashboard — Active Cases (Chronological)',
    dashboardHint: 'Shows the next scheduled court activity for each active case. Click a case to drill into detail.',
    tableHeaders: {
      id: 'Case No.',
      bonder: 'Bonder',
      ground: 'Ground',
      nextActivity: 'Next Court Activity',
      status: 'Status',
      action: ''
    },
    noUpcoming: 'No upcoming activity scheduled',
    view: 'View',
    active: 'Active',
    closed: 'Closed',
    allCasesTitle: 'All Registered Cases',
    searchPlaceholder: 'Search by license no. or bonder name…',
    noResults: 'No cases match the current filters.',
    formTitle: 'CBC e-Case Register — New Case',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    submit: 'File Case',
    cancel: 'Cancel',
    groundLabel: 'Ground for Filing',
    groundOtherLabel: 'Specify Other Ground',
    descriptionLabel: 'Case Description',
    filedNotice: 'Case registered with a unique case number. Bonder and related CBC officials auto-notified.',
    caseTitle: 'Case Detail',
    licenseNo: 'Bond License No.',
    filedDate: 'Filed Date',
    filedBy: 'Filed By',
    description: 'Description',
    attachmentsTitle: 'e-Attachment — Archived Documents',
    attach: 'Attach',
    attached: 'Attached',
    attachedNotice: 'Document attached and archived, tagged to Bonder Profile.',
    proceedingsTitle: 'Court Proceedings',
    addProceeding: 'Add Court Proceeding Entry',
    noProceedings: 'No court proceedings recorded yet for this case.',
    courtTypeLabel: 'Court Type',
    filingDateLabel: 'Filing Date',
    hearingDatesLabel: 'Hearing Dates',
    addHearingDate: 'Add Hearing Date',
    verdictDateLabel: 'Verdict Date (if available)',
    verdictDateShown: 'Verdict Date',
    verdictDetailLabel: 'Verdict Detail (if available)',
    saveProceeding: 'Save Proceeding',
    cancelProceeding: 'Cancel',
    forwardVerdict: 'Forward Verdict to Legal Procedure Management',
    forwardedBadge: 'Forwarded to Legal Procedure Management',
    forwardedNotice: 'Verdict information auto-forwarded to Legal Procedure Management, Bonder Profile, and Audit Management where applicable.',
    linkedCase: 'Linked Legal Procedure Case',
    linkedCaseStage: 'Current Stage'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'মামলার তথ্য ইনপুট',
    subtitle: 'বন্ডকারীর বিরুদ্ধে মামলা দায়েরের জন্য সিবিসি ই-কেস রেজিস্টার (কর ফাঁকি, ফৌজদারি, অর্থ পাচার, অসম্মতি), এবং আদালতি কার্যক্রম লগিং (রিট, হাইকোর্ট, আপিল) যা স্বয়ংক্রিয়ভাবে আইনি প্রক্রিয়া ব্যবস্থাপনায় রায়ের তথ্য পাঠায়।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    registerCase: 'নতুন মামলা নিবন্ধন করুন',
    activeCases: 'চলমান মামলা',
    upcomingActivity: 'আসন্ন আদালতি কার্যক্রম (৩০ দিন)',
    pendingForward: 'আইনি বিভাগে প্রেরণের অপেক্ষায় রায়',
    closedCases: 'সমাপ্ত মামলা',
    dashboardTitle: 'বিজ্ঞপ্তি ড্যাশবোর্ড — চলমান মামলা (কালানুক্রমিক)',
    dashboardHint: 'প্রতিটি চলমান মামলার পরবর্তী নির্ধারিত আদালতি কার্যক্রম দেখায়। বিস্তারিত দেখতে একটি মামলায় ক্লিক করুন।',
    tableHeaders: {
      id: 'মামলা নং',
      bonder: 'বন্ডকারী',
      ground: 'কারণ',
      nextActivity: 'পরবর্তী আদালতি কার্যক্রম',
      status: 'স্ট্যাটাস',
      action: ''
    },
    noUpcoming: 'কোনো আসন্ন কার্যক্রম নির্ধারিত নেই',
    view: 'দেখুন',
    active: 'চলমান',
    closed: 'সমাপ্ত',
    allCasesTitle: 'সকল নিবন্ধিত মামলা',
    searchPlaceholder: 'লাইসেন্স নং বা বন্ডকারীর নাম খুঁজুন…',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো মামলা মেলেনি।',
    formTitle: 'সিবিসি ই-কেস রেজিস্টার — নতুন মামলা',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বর দিয়ে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    submit: 'মামলা দায়ের করুন',
    cancel: 'বাতিল করুন',
    groundLabel: 'দায়েরের কারণ',
    groundOtherLabel: 'অন্যান্য কারণ উল্লেখ করুন',
    descriptionLabel: 'মামলার বিবরণ',
    filedNotice: 'একটি অনন্য মামলা নম্বরসহ মামলা নিবন্ধিত হয়েছে। বন্ডকারী ও সংশ্লিষ্ট সিবিসি কর্মকর্তাদের স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    caseTitle: 'মামলার বিবরণ',
    licenseNo: 'বন্ড লাইসেন্স নং',
    filedDate: 'দায়েরের তারিখ',
    filedBy: 'দায়েরকারী',
    description: 'বিবরণ',
    attachmentsTitle: 'ই-সংযুক্তি — সংরক্ষিত নথি',
    attach: 'সংযুক্ত করুন',
    attached: 'সংযুক্ত হয়েছে',
    attachedNotice: 'নথি সংযুক্ত ও সংরক্ষণ করা হয়েছে, বন্ডকারী প্রোফাইলে ট্যাগ করা হয়েছে।',
    proceedingsTitle: 'আদালতি কার্যক্রম',
    addProceeding: 'আদালতি কার্যক্রম এন্ট্রি যোগ করুন',
    noProceedings: 'এই মামলার জন্য এখনো কোনো আদালতি কার্যক্রম রেকর্ড করা হয়নি।',
    courtTypeLabel: 'আদালতের ধরন',
    filingDateLabel: 'দায়েরের তারিখ',
    hearingDatesLabel: 'শুনানির তারিখসমূহ',
    addHearingDate: 'শুনানির তারিখ যোগ করুন',
    verdictDateLabel: 'রায়ের তারিখ (যদি থাকে)',
    verdictDateShown: 'রায়ের তারিখ',
    verdictDetailLabel: 'রায়ের বিবরণ (যদি থাকে)',
    saveProceeding: 'কার্যক্রম সংরক্ষণ করুন',
    cancelProceeding: 'বাতিল করুন',
    forwardVerdict: 'আইনি প্রক্রিয়া ব্যবস্থাপনায় রায় প্রেরণ করুন',
    forwardedBadge: 'আইনি প্রক্রিয়া ব্যবস্থাপনায় প্রেরিত',
    forwardedNotice: 'রায়ের তথ্য স্বয়ংক্রিয়ভাবে আইনি প্রক্রিয়া ব্যবস্থাপনা, বন্ডকারী প্রোফাইল এবং প্রযোজ্য ক্ষেত্রে অডিট ব্যবস্থাপনায় পাঠানো হয়েছে।',
    linkedCase: 'সংযুক্ত আইনি প্রক্রিয়া মামলা',
    linkedCaseStage: 'বর্তমান ধাপ'
  }
};
type T = typeof T['en'];
export function CaseInformation({
  language,
  onDone
}: CaseInformationProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'new-case'>('dashboard');
  const [cases, setCases] = useState<CbcCase[]>(seedCases);
  const [selected, setSelected] = useState<CbcCase | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const counts = useMemo(() => {
    const in30Days = today.getTime() + 30 * 86400000;
    return {
      active: cases.filter(c => c.status === 'active').length,
      upcoming: cases.filter(c => {
        const na = nextActivityFor(c);
        return na && new Date(na.date).getTime() <= in30Days;
      }).length,
      pendingForward: cases.flatMap(c => c.proceedings).filter(p => p.verdictDetail && !p.forwardedToLegal).length,
      closed: cases.filter(c => c.status === 'closed').length
    };
  }, [cases]);
  const activeSorted = useMemo(() => {
    const active = cases.filter(c => c.status === 'active');
    return active.slice().sort((a, b) => {
      const na = nextActivityFor(a);
      const nb = nextActivityFor(b);
      if (na && nb) return new Date(na.date).getTime() - new Date(nb.date).getTime();
      if (na) return -1;
      if (nb) return 1;
      return 0;
    });
  }, [cases]);
  const filteredAll = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cases.filter(c => {
      const lic = licenseOf(c.licenseNo);
      return !q || c.licenseNo.toLowerCase().includes(q) || (lic?.nameEn.toLowerCase().includes(q) ?? false) || c.id.toLowerCase().includes(q);
    });
  }, [cases, search]);
  const handleUpdate = (updated: CbcCase) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
  };
  if (view === 'new-case') {
    return <NewCaseForm language={language} t={t} onCancel={() => setView('dashboard')} onSubmit={c => {
      setCases(prev => [c, ...prev]);
      setView('dashboard');
      showToast(t.filedNotice);
    }} />;
  }
  return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
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
        <button type="button" onClick={() => setView('new-case')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
          <Icon name="add_circle" className="text-[16px]" />
          {t.registerCase}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="folder_open" label={t.activeCases} value={counts.active} color="#0A4D8C" />
        <StatCard icon="event_upcoming" label={t.upcomingActivity} value={counts.upcoming} color="#B45309" />
        <StatCard icon="forward_to_inbox" label={t.pendingForward} value={counts.pendingForward} color="#1E88E5" />
        <StatCard icon="task_alt" label={t.closedCases} value={counts.closed} color="#00A86B" />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-bold text-[#1E293B]">{t.dashboardTitle}</h2>
          <p className="text-[12px] text-[#64748B]">{t.dashboardHint}</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                <th className="px-4 py-3">{t.tableHeaders.id}</th>
                <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
                <th className="px-4 py-3">{t.tableHeaders.ground}</th>
                <th className="px-4 py-3">{t.tableHeaders.nextActivity}</th>
                <th className="px-4 py-3">{t.tableHeaders.action}</th>
              </tr>
            </thead>
            <tbody>
              {activeSorted.map(c => {
              const lic = licenseOf(c.licenseNo);
              const na = nextActivityFor(c);
              return <tr key={c.id} className="cursor-pointer border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]" onClick={() => setSelected(c)}>
                    <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                      <p className="text-[11px] text-[#94A3B8]">{c.licenseNo}</p>
                    </td>
                    <td className="px-4 py-3"><GroundBadge ground={c.ground} language={language} /></td>
                    <td className="px-4 py-3 text-[13px] text-[#334155]">
                      {na ? <span>{courtTypeLabels[na.courtType][language]} — <span className="font-semibold text-[#B45309]">{na.date}</span></span> : <span className="text-[#94A3B8]">{t.noUpcoming}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={e => {
                    e.stopPropagation();
                    setSelected(c);
                  }} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                        {t.view}
                      </button>
                    </td>
                  </tr>;
            })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#1E293B]">{t.allCasesTitle}</h2>
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                <th className="px-4 py-3">{t.tableHeaders.id}</th>
                <th className="px-4 py-3">{t.tableHeaders.bonder}</th>
                <th className="px-4 py-3">{t.tableHeaders.ground}</th>
                <th className="px-4 py-3">{t.tableHeaders.status}</th>
                <th className="px-4 py-3">{t.tableHeaders.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAll.map(c => {
              const lic = licenseOf(c.licenseNo);
              return <tr key={c.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1E293B]">{lic?.nameEn ?? '—'}</p>
                      <p className="text-[11px] text-[#94A3B8]">{c.licenseNo}</p>
                    </td>
                    <td className="px-4 py-3"><GroundBadge ground={c.ground} language={language} /></td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.status === 'active' ? 'bg-amber-50 text-[#B45309]' : 'bg-emerald-50 text-[#00A86B]'}`}>{c.status === 'active' ? t.active : t.closed}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setSelected(c)} className="rounded-full bg-[#EAF3FE] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                        {t.view}
                      </button>
                    </td>
                  </tr>;
            })}
              {filteredAll.length === 0 && <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#94A3B8]">{t.noResults}</td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <CaseDrawer cbcCase={selected} language={language} t={t} onClose={() => setSelected(null)} onUpdate={handleUpdate} onToast={showToast} />}
    </div>;
}
function NewCaseForm({
  language,
  t,
  onCancel,
  onSubmit
}: {
  language: Language;
  t: T;
  onCancel: () => void;
  onSubmit: (c: CbcCase) => void;
}) {
  const [licenseNo, setLicenseNo] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<ReturnType<typeof licenseOf>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [ground, setGround] = useState<CaseGround>('tax-evasion');
  const [groundOther, setGroundOther] = useState('');
  const [description, setDescription] = useState('');
  const verify = () => {
    const found = bondLicenses.find(l => normalizeLicenseNo(l.licenseNo) === normalizeLicenseNo(licenseNo));
    if (found) {
      setVerifiedLicense(found);
      setNotFound(false);
    } else {
      setVerifiedLicense(undefined);
      setNotFound(true);
    }
  };
  const canSubmit = verifiedLicense && description.trim() && (ground !== 'other' || groundOther.trim());
  return <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.formTitle}</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#1E293B]">{t.formTitle}</h1>
      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <Field label={t.licenseNo} required>
          <div className="flex gap-2">
            <TextInput value={licenseNo} onChange={v => {
            setLicenseNo(v);
            setVerifiedLicense(undefined);
            setNotFound(false);
          }} placeholder="BL-2022-01876" />
            <button type="button" onClick={verify} className="shrink-0 rounded-lg bg-[#0A4D8C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#083E71]">
              {t.verify}
            </button>
          </div>
          {notFound && <p className="mt-1 text-[11px] font-medium text-[#DC2626]">{t.notFound}</p>}
        </Field>
        {verifiedLicense && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
            <Icon name="check_circle" className="text-[16px]" />
            {verifiedLicense.licenseNo} · {t.verified} · {verifiedLicense.nameEn}
          </div>}
        <Field label={t.groundLabel} required>
          <div className="flex flex-wrap gap-2">
            {(['tax-evasion', 'criminal', 'money-laundering', 'non-compliance', 'other'] as const).map(g => <button key={g} type="button" onClick={() => setGround(g)} className={['rounded-full px-3.5 py-2 text-xs font-semibold transition-colors', ground === g ? 'bg-[#0A4D8C] text-white' : 'border border-[#CBD5E1] text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}>
                {groundLabels[g][language]}
              </button>)}
          </div>
        </Field>
        {ground === 'other' && <Field label={t.groundOtherLabel} required>
            <TextInput value={groundOther} onChange={setGroundOther} />
          </Field>}
        <Field label={t.descriptionLabel} required>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputClass} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className={ACTION_BTN_OUTLINE}>
            {t.cancel}
          </button>
          <button type="button" disabled={!canSubmit} onClick={() => {
          if (!verifiedLicense) return;
          onSubmit({
            id: `CBC-2026-${100 + Math.floor(Math.random() * 800)}`,
            licenseNo: verifiedLicense.licenseNo,
            ground,
            groundOther: ground === 'other' ? groundOther.trim() : undefined,
            filedDate: '26 Jul 2026',
            filedBy: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
            description: description.trim(),
            attachments: [{
              id: 'caseBrief',
              nameEn: 'Case Brief / Complaint Document',
              nameBn: 'মামলার সংক্ষিপ্তসার / অভিযোগ নথি',
              attached: true
            }, {
              id: 'evidenceFile',
              nameEn: 'Supporting Evidence File',
              nameBn: 'সহায়ক প্রমাণ ফাইল',
              attached: false
            }],
            proceedings: [],
            status: 'active'
          });
        }} className={`${ACTION_BTN} disabled:opacity-50`}>
            {t.submit}
          </button>
        </div>
      </div>
    </div>;
}
function CaseDrawer({
  cbcCase: c,
  language,
  t,
  onClose,
  onUpdate,
  onToast
}: {
  cbcCase: CbcCase;
  language: Language;
  t: T;
  onClose: () => void;
  onUpdate: (c: CbcCase) => void;
  onToast: (msg: string) => void;
}) {
  const lic = licenseOf(c.licenseNo);
  const [showAddProceeding, setShowAddProceeding] = useState(false);
  const toggleAttach = (docId: string) => {
    onUpdate({
      ...c,
      attachments: c.attachments.map(d => d.id === docId ? {
        ...d,
        attached: true
      } : d)
    });
    onToast(t.attachedNotice);
  };
  const handleForward = (proceedingId: string) => {
    onUpdate({
      ...c,
      proceedings: c.proceedings.map(p => p.id === proceedingId ? {
        ...p,
        forwardedToLegal: true
      } : p)
    });
    onToast(t.forwardedNotice);
  };
  const handleAddProceeding = (entry: CourtProceedingEntry) => {
    onUpdate({
      ...c,
      proceedings: [...c.proceedings, entry]
    });
    setShowAddProceeding(false);
  };
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.caseTitle}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-[#0A4D8C]">{c.id}</span>
            <GroundBadge ground={c.ground} language={language} />
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.status === 'active' ? 'bg-amber-50 text-[#B45309]' : 'bg-emerald-50 text-[#00A86B]'}`}>{c.status === 'active' ? t.active : t.closed}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <div className="col-span-2">
              <p className="text-[11px] text-[#94A3B8]">Bonder</p>
              <p className="font-medium text-[#1E293B]">{lic?.nameEn} · {c.licenseNo}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.filedDate}</p>
              <p className="font-medium text-[#1E293B]">{c.filedDate}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8]">{t.filedBy}</p>
              <p className="font-medium text-[#1E293B]">{c.filedBy}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] text-[#94A3B8]">{t.description}</p>
              <p className="font-medium text-[#1E293B]">{c.description}{c.groundOther ? ` (${c.groundOther})` : ''}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#334155]">{t.attachmentsTitle}</p>
            <div className="flex flex-col gap-2">
              {c.attachments.map(d => <AttachmentRow key={d.id} doc={d} language={language} t={t} onAttach={() => toggleAttach(d.id)} />)}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#334155]">{t.proceedingsTitle}</p>
              <button type="button" onClick={() => setShowAddProceeding(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3 py-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
                <Icon name="add" className="text-[14px]" />
                {t.addProceeding}
              </button>
            </div>
            {c.proceedings.length === 0 && <p className="text-[12px] text-[#94A3B8]">{t.noProceedings}</p>}
            {c.proceedings.map(p => {
            const linked = legalCaseOf(p.linkedLegalCaseId);
            return <div key={p.id} className="rounded-xl border border-[#E2E8F0] p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-[#0A4D8C]">{courtTypeLabels[p.courtType][language]}</p>
                    {p.forwardedToLegal && <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[13px]" />{t.forwardedBadge}</span>}
                  </div>
                  <p className="mt-1 text-[12px] text-[#64748B]">{t.filingDateLabel}: {p.filingDate}</p>
                  <p className="text-[12px] text-[#64748B]">{t.hearingDatesLabel}: {p.hearingDates.join(', ')}</p>
                  {p.verdictDate && <p className="mt-1 text-[13px] text-[#334155]"><span className="font-semibold">{t.verdictDateShown}:</span> {p.verdictDate}</p>}
                  {p.verdictDetail && <p className="text-[13px] text-[#334155]">{p.verdictDetail}</p>}
                  {linked && <p className="mt-1 text-[11px] text-[#94A3B8]">{t.linkedCase}: {linked.id} · {t.linkedCaseStage}: {legalStageLabels[linked.stage][language]}</p>}
                  {p.verdictDetail && !p.forwardedToLegal && <button type="button" onClick={() => handleForward(p.id)} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                      <Icon name="forward_to_inbox" className="text-[14px]" />
                      {t.forwardVerdict}
                    </button>}
                </div>;
          })}
            {showAddProceeding && <AddProceedingForm language={language} t={t} onCancel={() => setShowAddProceeding(false)} onSubmit={handleAddProceeding} />}
          </div>
        </div>
      </div>
    </div>;
}
function AttachmentRow({
  doc,
  language,
  t,
  onAttach
}: {
  doc: AttachmentDoc;
  language: Language;
  t: T;
  onAttach: () => void;
}) {
  return <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2.5">
      <span className="text-[13px] text-[#334155]">{language === 'en' ? doc.nameEn : doc.nameBn}</span>
      {doc.attached ? <span className="flex items-center gap-1 text-[12px] font-semibold text-[#00A86B]"><Icon name="check_circle" className="text-[15px]" />{t.attached}</span> : <button type="button" onClick={onAttach} className="rounded-full bg-[#EAF3FE] px-3 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
          {t.attach}
        </button>}
    </div>;
}
function AddProceedingForm({
  language,
  t,
  onCancel,
  onSubmit
}: {
  language: Language;
  t: T;
  onCancel: () => void;
  onSubmit: (entry: CourtProceedingEntry) => void;
}) {
  const [courtType, setCourtType] = useState<CourtType>('writ');
  const [filingDate, setFilingDate] = useState('26 Jul 2026');
  const [hearingDates, setHearingDates] = useState<string[]>(['']);
  const [verdictDate, setVerdictDate] = useState('');
  const [verdictDetail, setVerdictDetail] = useState('');
  const canSubmit = filingDate.trim() && hearingDates.some(d => d.trim());
  return <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-[#CBD5E1] p-3.5">
      <Field label={t.courtTypeLabel}>
        <select value={courtType} onChange={e => setCourtType(e.target.value as CourtType)} className={inputClass}>
          {(['writ', 'high-court', 'appellate-commissionerate', 'appellate-division'] as const).map(ct => <option key={ct} value={ct}>{courtTypeLabels[ct][language]}</option>)}
        </select>
      </Field>
      <Field label={t.filingDateLabel}>
        <TextInput value={filingDate} onChange={setFilingDate} />
      </Field>
      <Field label={t.hearingDatesLabel}>
        <div className="flex flex-col gap-2">
          {hearingDates.map((d, i) => <TextInput key={i} value={d} onChange={v => setHearingDates(prev => prev.map((x, idx) => idx === i ? v : x))} placeholder="26 Aug 2026" />)}
          <button type="button" onClick={() => setHearingDates(prev => [...prev, ''])} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EAF3FE] px-3 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#0A4D8C] hover:text-white">
            <Icon name="add" className="text-[13px]" />
            {t.addHearingDate}
          </button>
        </div>
      </Field>
      <Field label={t.verdictDateLabel}>
        <TextInput value={verdictDate} onChange={setVerdictDate} />
      </Field>
      <Field label={t.verdictDetailLabel}>
        <textarea value={verdictDetail} onChange={e => setVerdictDetail(e.target.value)} rows={2} className={inputClass} />
      </Field>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className={ACTION_BTN_OUTLINE}>
          {t.cancelProceeding}
        </button>
        <button type="button" disabled={!canSubmit} onClick={() => {
        onSubmit({
          id: `CP-2026-${1000 + Math.floor(Math.random() * 900)}`,
          courtType,
          filingDate: filingDate.trim(),
          hearingDates: hearingDates.map(d => d.trim()).filter(Boolean),
          verdictDate: verdictDate.trim() || undefined,
          verdictDetail: verdictDetail.trim() || undefined,
          forwardedToLegal: false
        });
      }} className={`${ACTION_BTN} disabled:opacity-50`}>
          {t.saveProceeding}
        </button>
      </div>
    </div>;
}
