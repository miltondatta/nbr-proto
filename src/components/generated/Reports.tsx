import { useMemo, useState } from 'react';
import { categoryLabels, formatLabels, reportCatalog as seedCatalog, generatedReports as seedGenerated, type GeneratedReport, type ReportCategory, type ReportDefinition, type ReportFormat } from './reportsData';
type Language = 'en' | 'bn';
interface ReportsProps {
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
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
    </label>;
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
const ACTION_BTN = 'inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]';
const ACTION_BTN_GREEN = 'inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]';
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const formatOrder: ReportFormat[] = ['pdf', 'excel', 'rtf', 'csv', 'html'];
const categoryOrder: ReportCategory[] = ['task-wise', 'user-wise', 'time-wise'];
const genericFieldDefs = [{
  id: 'licenseNo',
  en: 'License No.',
  bn: 'লাইসেন্স নং'
}, {
  id: 'bonderName',
  en: 'Bonder Name',
  bn: 'বন্ডকারীর নাম'
}, {
  id: 'district',
  en: 'District/Zone',
  bn: 'জেলা/জোন'
}, {
  id: 'status',
  en: 'Status/Stage',
  bn: 'অবস্থা/পর্যায়'
}, {
  id: 'officer',
  en: 'Assigned Officer',
  bn: 'বরাদ্দকৃত কর্মকর্তা'
}, {
  id: 'date',
  en: 'Date/Time',
  bn: 'তারিখ/সময়'
}, {
  id: 'value',
  en: 'Amount (Taka)',
  bn: 'পরিমাণ (টাকা)'
}];
const moduleOptions = [{
  en: 'Bond License Management',
  bn: 'বন্ড লাইসেন্স ব্যবস্থাপনা'
}, {
  en: 'Annual Audit',
  bn: 'বার্ষিক নিরীক্ষা'
}, {
  en: 'Entitlement Management',
  bn: 'এনটাইটেলমেন্ট ব্যবস্থাপনা'
}, {
  en: 'Co-efficient Management',
  bn: 'কো-এফিসিয়েন্ট ব্যবস্থাপনা'
}, {
  en: 'UP Management',
  bn: 'ইউপি ব্যবস্থাপনা'
}, {
  en: 'Inventory Monitoring',
  bn: 'ইনভেন্টরি মনিটরিং'
}, {
  en: 'Legal Management',
  bn: 'আইনি ব্যবস্থাপনা'
}, {
  en: 'Inter-Bond Transfer',
  bn: 'ইন্টার-বন্ড ট্রান্সফার'
}, {
  en: 'Sub Contract Management',
  bn: 'সাব কন্ট্রাক্ট ব্যবস্থাপনা'
}];
const today = '26 Jul 2026';
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Reports',
    subtitle: 'Predefined and on-demand reporting — generated task-wise, user-wise or time/date-wise, in Bengali or English, exportable to PDF, Excel, RTF, CSV and HTML.',
    backToDashboard: 'Back to Dashboard',
    statCatalog: 'Predefined Reports',
    statGenerated: 'Generated This Month',
    statFormats: 'Export Formats Supported',
    tabCatalog: 'Report Catalog',
    tabBuilder: 'On-Demand Report Builder',
    tabHistory: 'Generated Reports History',
    searchPlaceholder: 'Search report name or module…',
    filterAll: 'All Categories',
    module: 'Module',
    generate: 'Generate',
    generateModalTitle: 'Generate Report',
    dateFrom: 'From Date',
    dateTo: 'To Date',
    format: 'Export Format',
    language: 'Language',
    langEn: 'English',
    langBn: 'Bengali (বাংলা)',
    cancel: 'Cancel',
    confirmGenerate: 'Generate Report',
    generatedNotice: 'Report generated and added to history.',
    builderTitle: 'Custom Report Builder',
    builderSubtitle: 'Drag-and-drop style template designer — select a module, choose fields, group by, and format.',
    builderModule: 'Data Source Module',
    builderFields: 'Fields to Include',
    builderGroupBy: 'Group Report By',
    builderReportName: 'Report Title',
    builderReportNamePlaceholder: 'e.g. Zone-2 Weekly Activity Summary',
    generateCustom: 'Generate Custom Report',
    customBuilderError: 'Enter a report title and select at least one field.',
    historyEmpty: 'No reports generated yet.',
    tableHeaders: {
      id: 'Report ID',
      name: 'Report',
      generatedAt: 'Generated At',
      by: 'Generated By',
      lang: 'Lang',
      format: 'Format',
      range: 'Date Range',
      size: 'Size',
      action: ''
    },
    download: 'Download',
    downloadingNotice: (fmt: string) => `Downloading as ${fmt}… (simulated — no file transferred)`,
    custom: 'Custom',
    engineNote: 'The reporting engine reads data across all modules, supports predefined and on-demand templates, and is designed for fast, lightweight generation in both languages.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'প্রতিবেদন',
    subtitle: 'পূর্বনির্ধারিত ও চাহিদা অনুযায়ী প্রতিবেদন — কাজ, ব্যবহারকারী বা সময়/তারিখ অনুযায়ী তৈরি, বাংলা বা ইংরেজিতে, পিডিএফ, এক্সেল, আরটিএফ, সিএসভি ও এইচটিএমএল-এ রপ্তানিযোগ্য।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    statCatalog: 'পূর্বনির্ধারিত প্রতিবেদন',
    statGenerated: 'এই মাসে তৈরিকৃত',
    statFormats: 'সমর্থিত রপ্তানি ফরম্যাট',
    tabCatalog: 'প্রতিবেদন ক্যাটালগ',
    tabBuilder: 'চাহিদা অনুযায়ী প্রতিবেদন নির্মাতা',
    tabHistory: 'তৈরিকৃত প্রতিবেদনের ইতিহাস',
    searchPlaceholder: 'প্রতিবেদনের নাম বা মডিউল খুঁজুন…',
    filterAll: 'সকল বিভাগ',
    module: 'মডিউল',
    generate: 'তৈরি করুন',
    generateModalTitle: 'প্রতিবেদন তৈরি করুন',
    dateFrom: 'শুরুর তারিখ',
    dateTo: 'শেষের তারিখ',
    format: 'রপ্তানি ফরম্যাট',
    language: 'ভাষা',
    langEn: 'ইংরেজি',
    langBn: 'বাংলা',
    cancel: 'বাতিল',
    confirmGenerate: 'প্রতিবেদন তৈরি করুন',
    generatedNotice: 'প্রতিবেদন তৈরি হয়েছে এবং ইতিহাসে যুক্ত হয়েছে।',
    builderTitle: 'কাস্টম প্রতিবেদন নির্মাতা',
    builderSubtitle: 'ড্র্যাগ-অ্যান্ড-ড্রপ ধাঁচের টেমপ্লেট ডিজাইনার — একটি মডিউল, ফিল্ড, গ্রুপিং ও ফরম্যাট নির্বাচন করুন।',
    builderModule: 'তথ্য উৎস মডিউল',
    builderFields: 'অন্তর্ভুক্ত ফিল্ড',
    builderGroupBy: 'গ্রুপ করুন',
    builderReportName: 'প্রতিবেদনের শিরোনাম',
    builderReportNamePlaceholder: 'যেমন: জোন-২ সাপ্তাহিক কার্যক্রম সারসংক্ষেপ',
    generateCustom: 'কাস্টম প্রতিবেদন তৈরি করুন',
    customBuilderError: 'একটি প্রতিবেদনের শিরোনাম লিখুন এবং কমপক্ষে একটি ফিল্ড নির্বাচন করুন।',
    historyEmpty: 'এখনো কোনো প্রতিবেদন তৈরি হয়নি।',
    tableHeaders: {
      id: 'প্রতিবেদন আইডি',
      name: 'প্রতিবেদন',
      generatedAt: 'তৈরির সময়',
      by: 'তৈরিকারী',
      lang: 'ভাষা',
      format: 'ফরম্যাট',
      range: 'তারিখ পরিসর',
      size: 'আকার',
      action: ''
    },
    download: 'ডাউনলোড',
    downloadingNotice: (fmt: string) => `${fmt} হিসেবে ডাউনলোড হচ্ছে… (সিমুলেটেড — কোনো ফাইল স্থানান্তরিত হয়নি)`,
    custom: 'কাস্টম',
    engineNote: 'রিপোর্টিং ইঞ্জিন সকল মডিউল থেকে তথ্য পড়ে, পূর্বনির্ধারিত ও চাহিদা অনুযায়ী টেমপ্লেট সমর্থন করে এবং উভয় ভাষায় দ্রুত, হালকা-ওজনের প্রতিবেদন তৈরির জন্য ডিজাইনকৃত।'
  }
};
type T = typeof T['en'];
function FormatBadge({
  format,
  language
}: {
  format: ReportFormat;
  language: Language;
}) {
  const f = formatLabels[format];
  return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${f.color}1A`,
    color: f.color
  }}>
      <Icon name={f.icon} className="text-[13px]" />
      {f[language]}
    </span>;
}
function GenerateModal({
  report,
  language,
  t,
  onClose,
  onConfirm
}: {
  report: ReportDefinition;
  language: Language;
  t: T;
  onClose: () => void;
  onConfirm: (dateFrom: string, dateTo: string, format: ReportFormat, lang: 'en' | 'bn') => void;
}) {
  const [dateFrom, setDateFrom] = useState('01 Jul 2026');
  const [dateTo, setDateTo] = useState(today);
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [lang, setLang] = useState<'en' | 'bn'>(language);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">{t.generateModalTitle}</h3>
            <p className="mt-0.5 text-sm text-[#64748B]">{language === 'en' ? report.nameEn : report.nameBn}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.dateFrom}>
            <input type="text" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t.dateTo}>
            <input type="text" value={dateTo} onChange={e => setDateTo(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label={t.format}>
          <select value={format} onChange={e => setFormat(e.target.value as ReportFormat)} className={inputClass}>
            {formatOrder.map(f => <option key={f} value={f}>{formatLabels[f][language]}</option>)}
          </select>
        </Field>
        <Field label={t.language}>
          <select value={lang} onChange={e => setLang(e.target.value as 'en' | 'bn')} className={inputClass}>
            <option value="en">{t.langEn}</option>
            <option value="bn">{t.langBn}</option>
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={ACTION_BTN_OUTLINE}>{t.cancel}</button>
          <button type="button" onClick={() => onConfirm(dateFrom, dateTo, format, lang)} className={ACTION_BTN_GREEN}>
            <Icon name="auto_awesome" className="text-[14px]" />
            {t.confirmGenerate}
          </button>
        </div>
      </div>
    </div>;
}
export function Reports({
  language,
  onDone
}: ReportsProps) {
  const t = T[language];
  const [tab, setTab] = useState<'catalog' | 'builder' | 'history'>('catalog');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ReportCategory>('all');
  const [catalog, setCatalog] = useState<ReportDefinition[]>(seedCatalog);
  const [generated, setGenerated] = useState<GeneratedReport[]>(seedGenerated);
  const [modalReport, setModalReport] = useState<ReportDefinition | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter(r => {
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (!q) return true;
      return r.nameEn.toLowerCase().includes(q) || r.nameBn.includes(q) || r.module.en.toLowerCase().includes(q);
    });
  }, [catalog, search, categoryFilter]);
  const genCount = generated.filter(g => g.generatedAt.includes('Jul 2026')).length;
  return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <span className="flex items-center gap-1.5">
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
        </span>
      </nav>

      {toast && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
          <Icon name="check_circle" className="text-[16px]" />
          {toast}
        </div>}

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="fact_check" label={t.statCatalog} value={catalog.length} color="#0A4D8C" />
        <StatCard icon="history" label={t.statGenerated} value={genCount} color="#00A86B" />
        <StatCard icon="file_download" label={t.statFormats} value={formatOrder.length} color="#B45309" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0]">
        {(['catalog', 'builder', 'history'] as const).map(tb => <button key={tb} type="button" onClick={() => setTab(tb)} className={`border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors ${tab === tb ? 'border-[#0A4D8C] text-[#0A4D8C]' : 'border-transparent text-[#64748B] hover:text-[#1E293B]'}`}>
            {tb === 'catalog' ? t.tabCatalog : tb === 'builder' ? t.tabBuilder : t.tabHistory}
          </button>)}
      </div>

      {tab === 'catalog' && <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => setCategoryFilter('all')} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${categoryFilter === 'all' ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155]'}`}>{t.filterAll}</button>
              {categoryOrder.map(c => <button key={c} type="button" onClick={() => setCategoryFilter(c)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${categoryFilter === c ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155]'}`}>{categoryLabels[c][language]}</button>)}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCatalog.map(r => <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-[#EAF3FE] px-2.5 py-1 text-[10px] font-semibold text-[#0A4D8C]">{r.module[language]}</span>
                  <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-semibold text-[#334155]">{categoryLabels[r.category][language]}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? r.nameEn : r.nameBn}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{language === 'en' ? r.descEn : r.descBn}</p>
                </div>
                <button type="button" onClick={() => setModalReport(r)} className={`${ACTION_BTN} w-fit`}>
                  <Icon name="auto_awesome" className="text-[14px]" />
                  {t.generate}
                </button>
              </div>)}
          </div>
        </div>}

      {tab === 'builder' && <CustomBuilder language={language} t={t} onGenerate={(name, format, lang) => {
      const id = `RPT-CUSTOM-${catalog.length + 1}`;
      const def: ReportDefinition = {
        id,
        nameEn: name,
        nameBn: name,
        module: {
          en: t.custom,
          bn: t.custom
        },
        category: 'task-wise',
        descEn: '',
        descBn: ''
      };
      setCatalog(prev => [...prev, def]);
      setGenerated(prev => [{
        id: `GEN-CUSTOM-${prev.length + 1}`,
        reportId: id,
        generatedAt: `${today}, ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`,
        generatedBy: {
          en: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
          bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)'
        },
        language: lang,
        format,
        dateRangeFrom: '01 Jul 2026',
        dateRangeTo: today,
        fileSizeKb: 64
      }, ...prev]);
      showToast(t.generatedNotice);
      setTab('history');
    }} />}

      {tab === 'history' && <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          {generated.length === 0 ? <p className="p-6 text-center text-sm text-[#64748B]">{t.historyEmpty}</p> : <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                <tr>
                  <th className="px-4 py-3">{t.tableHeaders.id}</th>
                  <th className="px-4 py-3">{t.tableHeaders.name}</th>
                  <th className="px-4 py-3">{t.tableHeaders.generatedAt}</th>
                  <th className="px-4 py-3">{t.tableHeaders.by}</th>
                  <th className="px-4 py-3">{t.tableHeaders.format}</th>
                  <th className="px-4 py-3">{t.tableHeaders.range}</th>
                  <th className="px-4 py-3">{t.tableHeaders.size}</th>
                  <th className="px-4 py-3">{t.tableHeaders.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {generated.map(g => {
              const def = catalog.find(c => c.id === g.reportId);
              return <tr key={g.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-mono text-xs text-[#334155]">{g.id}</td>
                      <td className="px-4 py-3 text-[#1E293B]">{def ? language === 'en' ? def.nameEn : def.nameBn : g.reportId}</td>
                      <td className="px-4 py-3 text-[#64748B]">{g.generatedAt}</td>
                      <td className="px-4 py-3 text-[#64748B]">{g.generatedBy[language]}</td>
                      <td className="px-4 py-3"><FormatBadge format={g.format} language={language} /></td>
                      <td className="px-4 py-3 text-[#64748B]">{g.dateRangeFrom} – {g.dateRangeTo}</td>
                      <td className="px-4 py-3 text-[#64748B]">{g.fileSizeKb} KB</td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" onClick={() => showToast(t.downloadingNotice(formatLabels[g.format][language]))} className={ACTION_BTN_OUTLINE}>
                          <Icon name="file_download" className="text-[14px]" />
                          {t.download}
                        </button>
                      </td>
                    </tr>;
            })}
              </tbody>
            </table>}
        </div>}

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">
        <Icon name="info" className="mr-1 align-text-bottom text-[14px] text-[#1E88E5]" />
        {t.engineNote}
      </p>

      {modalReport && <GenerateModal report={modalReport} language={language} t={t} onClose={() => setModalReport(null)} onConfirm={(dateFrom, dateTo, format, lang) => {
      setGenerated(prev => [{
        id: `GEN-${Date.now()}`,
        reportId: modalReport.id,
        generatedAt: `${today}, ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`,
        generatedBy: {
          en: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
          bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)'
        },
        language: lang,
        format,
        dateRangeFrom: dateFrom,
        dateRangeTo: dateTo,
        fileSizeKb: Math.round(80 + Math.random() * 600)
      }, ...prev]);
      setModalReport(null);
      showToast(t.generatedNotice);
      setTab('history');
    }} />}
    </div>;
}
function CustomBuilder({
  language,
  t,
  onGenerate
}: {
  language: Language;
  t: T;
  onGenerate: (name: string, format: ReportFormat, lang: 'en' | 'bn') => void;
}) {
  const [reportName, setReportName] = useState('');
  const [module, setModule] = useState(moduleOptions[0]);
  const [fields, setFields] = useState<Record<string, boolean>>({});
  const [groupBy, setGroupBy] = useState<ReportCategory>('task-wise');
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [lang, setLang] = useState<'en' | 'bn'>(language);
  const [error, setError] = useState(false);
  const selectedFieldCount = Object.values(fields).filter(Boolean).length;
  return <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-bold text-[#1E293B]">{t.builderTitle}</h3>
        <p className="mt-1 text-sm text-[#64748B]">{t.builderSubtitle}</p>
      </div>

      <Field label={t.builderReportName} required>
        <input type="text" value={reportName} onChange={e => {
        setReportName(e.target.value);
        setError(false);
      }} placeholder={t.builderReportNamePlaceholder} className={`${inputClass} ${error && !reportName.trim() ? 'border-[#DC2626]' : ''}`} />
      </Field>

      <Field label={t.builderModule}>
        <select value={module.en} onChange={e => setModule(moduleOptions.find(m => m.en === e.target.value) ?? moduleOptions[0])} className={inputClass}>
          {moduleOptions.map(m => <option key={m.en} value={m.en}>{m[language]}</option>)}
        </select>
      </Field>

      <div>
        <span className="text-[13px] font-semibold text-[#334155]">{t.builderFields}{selectedFieldCount > 0 && <span className="ml-2 rounded-full bg-[#EAF3FE] px-2 py-0.5 text-[10px] font-bold text-[#0A4D8C]">{selectedFieldCount}</span>}</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {genericFieldDefs.map(f => <label key={f.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${fields[f.id] ? 'border-[#0A4D8C] bg-[#EAF3FE] text-[#0A4D8C]' : 'border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]'}`}>
              <input type="checkbox" checked={!!fields[f.id]} onChange={e => {
            setFields(prev => ({
              ...prev,
              [f.id]: e.target.checked
            }));
            setError(false);
          }} className="accent-[#0A4D8C]" />
              {f[language]}
            </label>)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label={t.builderGroupBy}>
          <select value={groupBy} onChange={e => setGroupBy(e.target.value as ReportCategory)} className={inputClass}>
            {categoryOrder.map(c => <option key={c} value={c}>{categoryLabels[c][language]}</option>)}
          </select>
        </Field>
        <Field label={t.format}>
          <select value={format} onChange={e => setFormat(e.target.value as ReportFormat)} className={inputClass}>
            {formatOrder.map(f => <option key={f} value={f}>{formatLabels[f][language]}</option>)}
          </select>
        </Field>
        <Field label={t.language}>
          <select value={lang} onChange={e => setLang(e.target.value as 'en' | 'bn')} className={inputClass}>
            <option value="en">{t.langEn}</option>
            <option value="bn">{t.langBn}</option>
          </select>
        </Field>
      </div>

      {error && <p className="text-xs font-medium text-[#DC2626]">{t.customBuilderError}</p>}

      <button type="button" onClick={() => {
      if (!reportName.trim() || selectedFieldCount === 0) {
        setError(true);
        return;
      }
      onGenerate(reportName.trim(), format, lang);
      setReportName('');
      setFields({});
    }} className={`${ACTION_BTN_GREEN} w-fit`}>
        <Icon name="auto_awesome" className="text-[14px]" />
        {t.generateCustom}
      </button>
    </div>;
}
