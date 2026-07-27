import { useMemo, useState } from 'react';
import { businessRules, masterListCategories, masterListItems, ruleCategories, ruleHistorySeed, type BusinessRule, type MasterListItem, type RuleHistoryEntry } from './businessRulesData';
type Language = 'en' | 'bn';
interface BusinessRulesProps {
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
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">{label}</span>
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
const ACTION_BTN_RED = 'inline-flex items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]';
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Business Rules',
    subtitle: 'Configure the business rules and calculation parameters — duty/tax rates, co-efficient and machinery parameters, bonding SLAs, financial rates and approval thresholds — used across CBMS.',
    exportPlan: 'Export Configuration Plan',
    addItem: 'Add Configuration Item',
    tabParameters: 'Calculation Parameters',
    tabMaster: 'Master Data Lists',
    tabHistory: 'Change History',
    statRules: 'Configurable Rules',
    statCategories: 'Categories',
    statMasterItems: 'Master Data Items',
    statChanges: 'Logged Changes',
    searchPlaceholder: 'Search rules by name…',
    allCategories: 'All Categories',
    lastModifiedLabel: 'Last modified',
    byLabel: 'by',
    saveRow: 'Save',
    savedNotice: 'Rule value updated.',
    outOfRangeNotice: 'Value must be within the allowed range.',
    masterAdd: 'Add Row',
    masterRemove: 'Remove',
    masterName: 'Item name',
    masterRate: 'Rate (%)',
    masterAddedNotice: 'Master data row added.',
    masterRemovedNotice: 'Master data row removed.',
    modalTitle: 'Add Configuration Item',
    itemName: 'Item name (English)',
    itemNameBn: 'Item name (Bengali)',
    itemCategory: 'Category',
    itemType: 'Value type',
    itemValue: 'Initial value',
    itemDescription: 'Description',
    cancel: 'Cancel',
    save: 'Add Item',
    nameRequired: 'Enter an item name to continue.',
    createdNotice: 'Configuration item added.',
    exportedNotice: 'Business Rule Configuration Plan exported.',
    historyEmpty: 'No changes logged yet.',
    typePercentage: 'Percentage',
    typeCurrency: 'Currency (BDT)',
    typeDays: 'Days',
    typeNumber: 'Number',
    footerNote: 'Every rule here is independently configurable — values take effect immediately for new transactions; master data (right of the divider) is deliberately kept separate from calculation parameters so lists can be extended without touching the calculation logic.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'বিজনেস রুলস',
    subtitle: 'শুল্ক/কর হার, কো-এফিসিয়েন্ট ও মেশিনারি প্যারামিটার, বন্ডিং এসএলএ, আর্থিক হার এবং অনুমোদন থ্রেশহোল্ড — সিবিএমএস জুড়ে ব্যবহৃত বিজনেস রুলস ও গণনার প্যারামিটার কনফিগার করুন।',
    exportPlan: 'কনফিগারেশন প্ল্যান এক্সপোর্ট করুন',
    addItem: 'কনফিগারেশন আইটেম যোগ করুন',
    tabParameters: 'গণনার প্যারামিটার',
    tabMaster: 'মাস্টার ডেটা তালিকা',
    tabHistory: 'পরিবর্তনের ইতিহাস',
    statRules: 'কনফিগারযোগ্য রুলস',
    statCategories: 'বিভাগ',
    statMasterItems: 'মাস্টার ডেটা আইটেম',
    statChanges: 'লগকৃত পরিবর্তন',
    searchPlaceholder: 'নাম দিয়ে রুলস খুঁজুন…',
    allCategories: 'সব বিভাগ',
    lastModifiedLabel: 'সর্বশেষ পরিবর্তিত',
    byLabel: 'দ্বারা',
    saveRow: 'সংরক্ষণ করুন',
    savedNotice: 'রুলের মান হালনাগাদ হয়েছে।',
    outOfRangeNotice: 'মান অনুমোদিত সীমার মধ্যে হতে হবে।',
    masterAdd: 'সারি যোগ করুন',
    masterRemove: 'অপসারণ',
    masterName: 'আইটেমের নাম',
    masterRate: 'হার (%)',
    masterAddedNotice: 'মাস্টার ডেটা সারি যোগ হয়েছে।',
    masterRemovedNotice: 'মাস্টার ডেটা সারি অপসারিত হয়েছে।',
    modalTitle: 'কনফিগারেশন আইটেম যোগ করুন',
    itemName: 'আইটেমের নাম (ইংরেজি)',
    itemNameBn: 'আইটেমের নাম (বাংলা)',
    itemCategory: 'বিভাগ',
    itemType: 'মানের ধরন',
    itemValue: 'প্রাথমিক মান',
    itemDescription: 'বিবরণ',
    cancel: 'বাতিল',
    save: 'আইটেম যোগ করুন',
    nameRequired: 'চালিয়ে যেতে একটি আইটেমের নাম লিখুন।',
    createdNotice: 'কনফিগারেশন আইটেম যোগ করা হয়েছে।',
    exportedNotice: 'বিজনেস রুল কনফিগারেশন প্ল্যান এক্সপোর্ট করা হয়েছে।',
    historyEmpty: 'এখনও কোনো পরিবর্তন লগ করা হয়নি।',
    typePercentage: 'শতাংশ',
    typeCurrency: 'মুদ্রা (৳)',
    typeDays: 'দিন',
    typeNumber: 'সংখ্যা',
    footerNote: 'এখানে প্রতিটি রুল স্বাধীনভাবে কনফিগারযোগ্য — নতুন লেনদেনের জন্য মান তাৎক্ষণিকভাবে কার্যকর হয়; মাস্টার ডেটা (বিভাজকের ডানে) ইচ্ছাকৃতভাবে গণনার প্যারামিটার থেকে পৃথক রাখা হয়েছে যাতে গণনার লজিক স্পর্শ না করে তালিকা সম্প্রসারণ করা যায়।'
  }
};
type T = typeof T['en'];
const valueTypeUnit: Record<string, string> = {
  percentage: '%',
  currency: 'BDT',
  days: 'd',
  number: ''
};
function RuleRow({
  rule,
  language,
  t,
  categoryColor,
  onSave
}: {
  rule: BusinessRule;
  language: Language;
  t: T;
  categoryColor: string;
  onSave: (id: string, value: number) => boolean;
}) {
  const [draft, setDraft] = useState(rule.value);
  const [error, setError] = useState(false);
  const dirty = draft !== rule.value;
  return <div className="flex flex-col gap-2.5 rounded-lg border border-[#E2E8F0] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#1E293B]">{language === 'en' ? rule.en : rule.bn}</p>
        <p className="mt-0.5 max-w-lg text-xs text-[#64748B]">{language === 'en' ? rule.descriptionEn : rule.descriptionBn}</p>
        <p className="mt-1 text-[10px] text-[#94A3B8]">{t.lastModifiedLabel}: {rule.lastModified} {t.byLabel} {rule.modifiedBy}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1.5">
          <input type="number" value={draft} onChange={e => {
          setDraft(Number(e.target.value));
          setError(false);
        }} className={`w-28 rounded-lg border px-2.5 py-2 text-right text-sm font-semibold outline-none ${error ? 'border-[#DC2626]' : 'border-[#CBD5E1] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20'}`} />
          <span className="text-xs font-semibold" style={{
          color: categoryColor
        }}>{valueTypeUnit[rule.valueType]}</span>
        </div>
        <button type="button" disabled={!dirty} onClick={() => {
        const ok = onSave(rule.id, draft);
        if (!ok) setError(true);
      }} className={`${ACTION_BTN} disabled:cursor-not-allowed disabled:opacity-40`}>
          <Icon name="save" className="text-[13px]" />
          {t.saveRow}
        </button>
      </div>
      {error && <p className="text-[10px] font-semibold text-[#DC2626]">{t.outOfRangeNotice} ({rule.min}–{rule.max})</p>}
    </div>;
}
function AddItemModal({
  language,
  t,
  onClose,
  onSave
}: {
  language: Language;
  t: T;
  onClose: () => void;
  onSave: (rule: BusinessRule) => void;
}) {
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [categoryId, setCategoryId] = useState(ruleCategories[0].id);
  const [valueType, setValueType] = useState<BusinessRule['valueType']>('percentage');
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-base font-bold text-[#1E293B]">{t.modalTitle}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-4">
          <Field label={t.itemName}>
            <input type="text" value={nameEn} onChange={e => {
            setNameEn(e.target.value);
            setError(false);
          }} className={`${inputClass} ${error ? 'border-[#DC2626]' : ''}`} />
          </Field>
          <Field label={t.itemNameBn}>
            <input type="text" value={nameBn} onChange={e => setNameBn(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t.itemCategory}>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
              {ruleCategories.map(c => <option key={c.id} value={c.id}>{language === 'en' ? c.en : c.bn}</option>)}
            </select>
          </Field>
          <Field label={t.itemType}>
            <select value={valueType} onChange={e => setValueType(e.target.value as BusinessRule['valueType'])} className={inputClass}>
              <option value="percentage">{t.typePercentage}</option>
              <option value="currency">{t.typeCurrency}</option>
              <option value="days">{t.typeDays}</option>
              <option value="number">{t.typeNumber}</option>
            </select>
          </Field>
          <Field label={t.itemValue}>
            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className={inputClass} />
          </Field>
          <Field label={t.itemDescription}>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={inputClass} />
          </Field>
          {error && <p className="text-xs font-medium text-[#DC2626]">{t.nameRequired}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
          <button type="button" onClick={onClose} className={ACTION_BTN_OUTLINE}>{t.cancel}</button>
          <button type="button" onClick={() => {
          if (!nameEn.trim()) {
            setError(true);
            return;
          }
          onSave({
            id: `custom-${Date.now()}`,
            categoryId,
            en: nameEn.trim(),
            bn: nameBn.trim() || nameEn.trim(),
            descriptionEn: description,
            descriptionBn: description,
            valueType,
            value,
            min: 0,
            max: valueType === 'currency' ? 1000000000 : valueType === 'percentage' ? 100 : 100000,
            lastModified: '26 Jul 2026',
            modifiedBy: 'System Admin'
          });
        }} className={ACTION_BTN_GREEN}>
            <Icon name="add_circle" className="text-[14px]" />
            {t.save}
          </button>
        </div>
      </div>
    </div>;
}
export function BusinessRules({
  language,
  onDone
}: BusinessRulesProps) {
  const t = T[language];
  const [tab, setTab] = useState<'parameters' | 'master' | 'history'>('parameters');
  const [rules, setRules] = useState<BusinessRule[]>(businessRules);
  const [masterItems, setMasterItems] = useState<MasterListItem[]>(masterListItems);
  const [history, setHistory] = useState<RuleHistoryEntry[]>(ruleHistorySeed);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3600);
  };
  const logChange = (en: string, bn: string) => {
    setHistory(prev => [{
      id: `h-${Date.now()}`,
      timestamp: '26 Jul 2026',
      actor: 'System Admin',
      en,
      bn
    }, ...prev]);
  };
  const filteredRules = useMemo(() => rules.filter(r => (categoryFilter === 'all' || r.categoryId === categoryFilter) && (search.trim() === '' || r.en.toLowerCase().includes(search.trim().toLowerCase()) || r.bn.includes(search.trim()))), [rules, categoryFilter, search]);
  const handleSaveRule = (id: string, value: number): boolean => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return false;
    if (value < rule.min || value > rule.max) return false;
    setRules(prev => prev.map(r => r.id === id ? {
      ...r,
      value,
      lastModified: '26 Jul 2026',
      modifiedBy: 'System Admin'
    } : r));
    logChange(`${rule.en} changed to ${value}${valueTypeUnit[rule.valueType]}.`, `${rule.bn} ${value}${valueTypeUnit[rule.valueType]}-এ পরিবর্তিত হয়েছে।`);
    showToast(t.savedNotice);
    return true;
  };
  const addMasterRow = () => {
    setMasterItems(prev => [...prev, {
      id: `m-${Date.now()}`,
      categoryId: 'duty-slabs',
      en: 'New Slab',
      bn: 'নতুন স্ল্যাব',
      ratePercent: 0
    }]);
    showToast(t.masterAddedNotice);
  };
  const updateMasterRow = (id: string, patch: Partial<MasterListItem>) => {
    setMasterItems(prev => prev.map(m => m.id === id ? {
      ...m,
      ...patch
    } : m));
  };
  const removeMasterRow = (id: string) => {
    setMasterItems(prev => prev.filter(m => m.id !== id));
    showToast(t.masterRemovedNotice);
  };
  const tabs: {
    id: 'parameters' | 'master' | 'history';
    label: string;
    icon: string;
  }[] = [{
    id: 'parameters',
    label: t.tabParameters,
    icon: 'tune'
  }, {
    id: 'master',
    label: t.tabMaster,
    icon: 'table_rows'
  }, {
    id: 'history',
    label: t.tabHistory,
    icon: 'history'
  }];
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => showToast(t.exportedNotice)} className={ACTION_BTN_OUTLINE}>
            <Icon name="download" className="text-[14px]" />
            {t.exportPlan}
          </button>
          <button type="button" onClick={() => setShowAddModal(true)} className={ACTION_BTN}>
            <Icon name="add" className="text-[14px]" />
            {t.addItem}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="rule" label={t.statRules} value={rules.length} color="#0A4D8C" />
        <StatCard icon="category" label={t.statCategories} value={ruleCategories.length} color="#1E88E5" />
        <StatCard icon="table_rows" label={t.statMasterItems} value={masterItems.length} color="#00A86B" />
        <StatCard icon="history" label={t.statChanges} value={history.length} color="#B45309" />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(tb => <button key={tb.id} type="button" onClick={() => setTab(tb.id)} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${tab === tb.id ? 'bg-[#0A4D8C] text-white' : 'border border-[#CBD5E1] text-[#334155] hover:bg-[#F5F7FA]'}`}>
            <Icon name={tb.icon} className="text-[14px]" />
            {tb.label}
          </button>)}
      </div>

      {tab === 'parameters' && <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={`${inputClass} sm:w-64`}>
              <option value="all">{t.allCategories}</option>
              {ruleCategories.map(c => <option key={c.id} value={c.id}>{language === 'en' ? c.en : c.bn}</option>)}
            </select>
          </div>

          {ruleCategories.map(cat => {
        const items = filteredRules.filter(r => r.categoryId === cat.id);
        if (items.length === 0) return null;
        return <div key={cat.id} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{
              backgroundColor: `${cat.color}1A`,
              color: cat.color
            }}>
                    <Icon name={cat.icon} className="text-[15px]" />
                  </span>
                  <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? cat.en : cat.bn}</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map(rule => <RuleRow key={rule.id} rule={rule} language={language} t={t} categoryColor={cat.color} onSave={handleSaveRule} />)}
                </div>
              </div>;
      })}
        </div>}

      {tab === 'master' && <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? masterListCategories[0].en : masterListCategories[0].bn}</h3>
            <button type="button" onClick={addMasterRow} className={ACTION_BTN}>
              <Icon name="add" className="text-[14px]" />
              {t.masterAdd}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
                  <th className="py-2 pr-3">{t.masterName}</th>
                  <th className="py-2 pr-3">{t.masterRate}</th>
                  <th className="py-2 pr-3 text-right">{t.masterRemove}</th>
                </tr>
              </thead>
              <tbody>
                {masterItems.map(item => <tr key={item.id} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="py-2 pr-3">
                      <input type="text" value={language === 'en' ? item.en : item.bn} onChange={e => updateMasterRow(item.id, language === 'en' ? {
                  en: e.target.value
                } : {
                  bn: e.target.value
                })} className="w-full rounded-md border border-[#CBD5E1] px-2.5 py-1.5 text-sm outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20" />
                    </td>
                    <td className="py-2 pr-3">
                      <input type="number" value={item.ratePercent} onChange={e => updateMasterRow(item.id, {
                  ratePercent: Number(e.target.value)
                })} className="w-24 rounded-md border border-[#CBD5E1] px-2.5 py-1.5 text-sm outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20" />
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <button type="button" onClick={() => removeMasterRow(item.id)} className="text-[#94A3B8] hover:text-[#DC2626]">
                        <Icon name="delete" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      {tab === 'history' && <div className="flex flex-col gap-2">
          {history.length === 0 ? <p className="text-sm text-[#64748B]">{t.historyEmpty}</p> : history.map(h => <div key={h.id} className="flex items-start gap-2.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3 text-xs shadow-sm">
                <Icon name="history" className="mt-0.5 shrink-0 text-[14px] text-[#94A3B8]" />
                <div>
                  <p className="text-[#334155]">{language === 'en' ? h.en : h.bn}</p>
                  <p className="mt-0.5 text-[10px] text-[#94A3B8]">{h.timestamp} · {h.actor}</p>
                </div>
              </div>)}
        </div>}

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">{t.footerNote}</p>

      {showAddModal && <AddItemModal language={language} t={t} onClose={() => setShowAddModal(false)} onSave={rule => {
      setRules(prev => [...prev, rule]);
      logChange(`New configuration item "${rule.en}" added.`, `নতুন কনফিগারেশন আইটেম "${rule.bn}" যোগ করা হয়েছে।`);
      setShowAddModal(false);
      showToast(t.createdNotice);
    }} />}
    </div>;
}