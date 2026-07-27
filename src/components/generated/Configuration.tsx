import { useMemo, useState } from 'react';
import { configHistorySeed, configSections, configSettings, systemInfoItems, type ConfigHistoryEntry, type ConfigSetting } from './systemConfigurationData';
type Language = 'en' | 'bn';
interface ConfigurationProps {
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
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Configuration',
    subtitle: 'System-wide technical settings — general behavior, security policy, file handling and maintenance — separate from the calculation parameters configured under Business Rules.',
    statSettings: 'Settings',
    statSections: 'Sections',
    statMaintenance: 'Maintenance Mode',
    statChanges: 'Logged Changes',
    on: 'On',
    off: 'Off',
    exportSnapshot: 'Export Configuration Snapshot',
    exportedNotice: 'Configuration snapshot exported.',
    save: 'Save',
    savedNotice: 'Setting updated.',
    lastModifiedLabel: 'Last modified',
    maintenanceWarning: 'Maintenance Mode is currently ON — only System Admin users can log in.',
    systemInfoTitle: 'System Information',
    historyTitle: 'Change History',
    footerNote: 'These settings apply platform-wide and take effect immediately on save. Calculation parameters (duty/tax rates, co-efficient tolerances, thresholds) live under Business Rules; approval-routing behavior lives under Workflow Management.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'কনফিগারেশন',
    subtitle: 'সিস্টেম-ব্যাপী প্রযুক্তিগত সেটিংস — সাধারণ আচরণ, নিরাপত্তা নীতি, ফাইল হ্যান্ডলিং ও রক্ষণাবেক্ষণ — বিজনেস রুলসের অধীনে কনফিগার করা গণনার প্যারামিটার থেকে পৃথক।',
    statSettings: 'সেটিংস',
    statSections: 'বিভাগ',
    statMaintenance: 'রক্ষণাবেক্ষণ মোড',
    statChanges: 'লগকৃত পরিবর্তন',
    on: 'চালু',
    off: 'বন্ধ',
    exportSnapshot: 'কনফিগারেশন স্ন্যাপশট এক্সপোর্ট করুন',
    exportedNotice: 'কনফিগারেশন স্ন্যাপশট এক্সপোর্ট করা হয়েছে।',
    save: 'সংরক্ষণ করুন',
    savedNotice: 'সেটিং হালনাগাদ হয়েছে।',
    lastModifiedLabel: 'সর্বশেষ পরিবর্তিত',
    maintenanceWarning: 'রক্ষণাবেক্ষণ মোড বর্তমানে চালু আছে — শুধুমাত্র সিস্টেম অ্যাডমিন ব্যবহারকারীরা লগইন করতে পারবেন।',
    systemInfoTitle: 'সিস্টেম তথ্য',
    historyTitle: 'পরিবর্তনের ইতিহাস',
    footerNote: 'এই সেটিংস প্ল্যাটফর্ম-ব্যাপী প্রযোজ্য এবং সংরক্ষণের সাথে সাথে কার্যকর হয়। গণনার প্যারামিটার (শুল্ক/কর হার, কো-এফিসিয়েন্ট সহনশীলতা, থ্রেশহোল্ড) বিজনেস রুলসের অধীনে থাকে; অনুমোদন-রাউটিং আচরণ ওয়ার্কফ্লো ব্যবস্থাপনার অধীনে থাকে।'
  }
};
type T = typeof T['en'];
function SettingRow({
  setting,
  language,
  t,
  onSave
}: {
  setting: ConfigSetting;
  language: Language;
  t: T;
  onSave: (id: string, value: string | number | boolean) => void;
}) {
  const [draft, setDraft] = useState(setting.value);
  const dirty = draft !== setting.value;
  if (setting.type === 'toggle') {
    const isOn = setting.value === true;
    return <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3.5">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1E293B]">{language === 'en' ? setting.en : setting.bn}</p>
          <p className="mt-0.5 text-xs text-[#64748B]">{language === 'en' ? setting.descriptionEn : setting.descriptionBn}</p>
          <p className="mt-1 text-[10px] text-[#94A3B8]">{t.lastModifiedLabel}: {setting.lastModified}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className={`text-xs font-semibold ${isOn ? 'text-[#00A86B]' : 'text-[#94A3B8]'}`}>{isOn ? t.on : t.off}</span>
          <button type="button" role="switch" aria-checked={isOn} onClick={() => onSave(setting.id, !setting.value)} className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${isOn ? 'bg-[#00A86B]' : 'bg-[#CBD5E1]'}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>;
  }
  return <div className="flex flex-col gap-2.5 rounded-lg border border-[#E2E8F0] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 sm:max-w-md">
        <p className="text-sm font-bold text-[#1E293B]">{language === 'en' ? setting.en : setting.bn}</p>
        <p className="mt-0.5 text-xs text-[#64748B]">{language === 'en' ? setting.descriptionEn : setting.descriptionBn}</p>
        <p className="mt-1 text-[10px] text-[#94A3B8]">{t.lastModifiedLabel}: {setting.lastModified}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {setting.type === 'number' && <div className="flex items-center gap-1.5">
            <input type="number" value={draft as number} min={setting.min} max={setting.max} onChange={e => setDraft(Number(e.target.value))} className="w-24 rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-right text-sm font-semibold outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20" />
            {setting.unit && <span className="text-xs font-semibold text-[#64748B]">{setting.unit}</span>}
          </div>}
        {setting.type === 'text' && <input type="text" value={draft as string} onChange={e => setDraft(e.target.value)} className="w-64 rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-sm outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20" />}
        {setting.type === 'select' && <select value={draft as string} onChange={e => setDraft(e.target.value)} className="w-48 rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-sm outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20">
            {(setting.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
          </select>}
        <button type="button" disabled={!dirty} onClick={() => onSave(setting.id, draft)} className={`${ACTION_BTN} disabled:cursor-not-allowed disabled:opacity-40`}>
          <Icon name="save" className="text-[13px]" />
          {t.save}
        </button>
      </div>
    </div>;
}
export function Configuration({
  language,
  onDone
}: ConfigurationProps) {
  const t = T[language];
  const [settings, setSettings] = useState<ConfigSetting[]>(configSettings);
  const [history, setHistory] = useState<ConfigHistoryEntry[]>(configHistorySeed);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3600);
  };
  const maintenanceOn = useMemo(() => settings.find(s => s.id === 's-maintenance-mode')?.value === true, [settings]);
  const handleSave = (id: string, value: string | number | boolean) => {
    const setting = settings.find(s => s.id === id);
    if (!setting) return;
    setSettings(prev => prev.map(s => s.id === id ? {
      ...s,
      value,
      lastModified: '27 Jul 2026'
    } : s));
    const displayValue = typeof value === 'boolean' ? value ? t.on : t.off : value;
    setHistory(prev => [{
      id: `ch-${Date.now()}`,
      timestamp: '27 Jul 2026',
      actor: 'System Admin',
      en: `${setting.en} changed to "${displayValue}".`,
      bn: `${setting.bn} "${displayValue}"-এ পরিবর্তিত হয়েছে।`
    }, ...prev]);
    showToast(t.savedNotice);
  };
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

      {maintenanceOn && <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs font-medium text-[#B91C1C]">
          <Icon name="warning" className="text-[16px]" />
          {t.maintenanceWarning}
        </div>}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button type="button" onClick={() => showToast(t.exportedNotice)} className={`${ACTION_BTN_OUTLINE} shrink-0`}>
          <Icon name="download" className="text-[14px]" />
          {t.exportSnapshot}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="settings" label={t.statSettings} value={settings.length} color="#0A4D8C" />
        <StatCard icon="category" label={t.statSections} value={configSections.length} color="#1E88E5" />
        <StatCard icon="build" label={t.statMaintenance} value={maintenanceOn ? t.on : t.off} color={maintenanceOn ? '#DC2626' : '#00A86B'} />
        <StatCard icon="history" label={t.statChanges} value={history.length} color="#B45309" />
      </div>

      {configSections.map(section => {
      const items = settings.filter(s => s.sectionId === section.id);
      return <div key={section.id} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{
            backgroundColor: `${section.color}1A`,
            color: section.color
          }}>
                <Icon name={section.icon} className="text-[15px]" />
              </span>
              <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? section.en : section.bn}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {items.map(setting => <SettingRow key={setting.id} setting={setting} language={language} t={t} onSave={handleSave} />)}
            </div>
          </div>;
    })}

      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-[#1E293B]">{t.systemInfoTitle}</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {systemInfoItems.map(item => <div key={item.id} className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F7FA] text-[#0A4D8C]">
                <Icon name={item.icon} className="text-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-[#64748B]">{language === 'en' ? item.en : item.bn}</p>
                <p className="truncate text-sm font-semibold text-[#1E293B]">{item.value}</p>
              </div>
            </div>)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-[#334155]">{t.historyTitle}</p>
        {history.map(h => <div key={h.id} className="flex items-start gap-2.5 rounded-lg bg-[#F8FAFC] px-3 py-2 text-xs">
            <Icon name="history" className="mt-0.5 shrink-0 text-[14px] text-[#94A3B8]" />
            <div>
              <p className="text-[#334155]">{language === 'en' ? h.en : h.bn}</p>
              <p className="mt-0.5 text-[10px] text-[#94A3B8]">{h.timestamp} · {h.actor}</p>
            </div>
          </div>)}
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">{t.footerNote}</p>
    </div>;
}