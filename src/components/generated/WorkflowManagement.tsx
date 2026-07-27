import { useMemo, useState } from 'react';
import { categoryMeta, roleOptions, workflowDefinitions, type WorkflowDefinition, type WorkflowStage } from './workflowManagementData';
type Language = 'en' | 'bn';
interface WorkflowManagementProps {
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
const smallInputClass = 'w-full rounded-md border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs text-[#1E293B] outline-none transition-colors focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
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
    pageTitle: 'Workflow Management',
    subtitle: 'Configure the approval-routing workflow — stage sequence, assigned roles, SLA turnaround and value thresholds — that drives every module’s approval pipeline.',
    statWorkflows: 'Configured Workflows',
    statStages: 'Total Stages',
    statAvgSla: 'Avg. Stage SLA (days)',
    statVersion: 'Highest Version',
    workflowsListTitle: 'Workflows',
    stagesTitle: 'Stage Sequence',
    addStage: 'Add Stage',
    moveUp: 'Move up',
    moveDown: 'Move down',
    deleteStage: 'Delete stage',
    stageName: 'Stage name',
    stageRole: 'Assigned role',
    stageSla: 'SLA (days)',
    exceptionBadge: 'Exception / branch',
    thresholdLabel: 'Value threshold',
    thresholdSuffix: 'BDT',
    saveChanges: 'Save Changes',
    discardChanges: 'Discard Changes',
    unsavedBadge: 'Unsaved changes',
    versionLabel: 'Version',
    lastModifiedLabel: 'Last modified',
    historyTitle: 'Change History',
    savedNotice: 'Workflow updated and published.',
    discardedNotice: 'Unsaved changes discarded.',
    minStagesWarning: 'A workflow needs at least two stages.',
    newStagePlaceholder: 'New Stage',
    footerNote: 'These workflows drive the multi-officer approval routing used throughout the Bond License, Entitlement, Co-efficient, UP, Inter-Bond Transfer, Sub-Contract and Legal Procedure modules. Editing a stage here changes only the configured routing template shown to administrators — in-flight cases keep the stage sequence they started with.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ওয়ার্কফ্লো ব্যবস্থাপনা',
    subtitle: 'অনুমোদন-রাউটিং ওয়ার্কফ্লো কনফিগার করুন — স্টেজ ক্রম, নিয়োজিত রোল, এসএলএ সময়সীমা এবং মূল্য থ্রেশহোল্ড — যা প্রতিটি মডিউলের অনুমোদন পাইপলাইন পরিচালনা করে।',
    statWorkflows: 'কনফিগার করা ওয়ার্কফ্লো',
    statStages: 'মোট স্টেজ',
    statAvgSla: 'গড় স্টেজ এসএলএ (দিন)',
    statVersion: 'সর্বোচ্চ সংস্করণ',
    workflowsListTitle: 'ওয়ার্কফ্লো',
    stagesTitle: 'স্টেজ ক্রম',
    addStage: 'স্টেজ যোগ করুন',
    moveUp: 'উপরে সরান',
    moveDown: 'নিচে সরান',
    deleteStage: 'স্টেজ মুছুন',
    stageName: 'স্টেজের নাম',
    stageRole: 'নিয়োজিত রোল',
    stageSla: 'এসএলএ (দিন)',
    exceptionBadge: 'ব্যতিক্রম / শাখা',
    thresholdLabel: 'মূল্য থ্রেশহোল্ড',
    thresholdSuffix: 'টাকা',
    saveChanges: 'পরিবর্তন সংরক্ষণ করুন',
    discardChanges: 'পরিবর্তন বাতিল করুন',
    unsavedBadge: 'অসংরক্ষিত পরিবর্তন',
    versionLabel: 'সংস্করণ',
    lastModifiedLabel: 'সর্বশেষ পরিবর্তিত',
    historyTitle: 'পরিবর্তনের ইতিহাস',
    savedNotice: 'ওয়ার্কফ্লো হালনাগাদ ও প্রকাশিত হয়েছে।',
    discardedNotice: 'অসংরক্ষিত পরিবর্তন বাতিল করা হয়েছে।',
    minStagesWarning: 'একটি ওয়ার্কফ্লোতে কমপক্ষে দুটি স্টেজ প্রয়োজন।',
    newStagePlaceholder: 'নতুন স্টেজ',
    footerNote: 'এই ওয়ার্কফ্লোগুলো বন্ড লাইসেন্স, এনটাইটেলমেন্ট, কো-এফিসিয়েন্ট, ইউপি, ইন্টার-বন্ড স্থানান্তর, সাব-কন্ট্রাক্ট এবং আইনি প্রক্রিয়া মডিউল জুড়ে ব্যবহৃত বহু-কর্মকর্তা অনুমোদন রাউটিং পরিচালনা করে। এখানে একটি স্টেজ সম্পাদনা করলে শুধুমাত্র প্রশাসকদের দেখানো কনফিগার করা রাউটিং টেমপ্লেট পরিবর্তিত হয় — চলমান মামলাগুলো তাদের শুরুর স্টেজ ক্রম বজায় রাখে।'
  }
};
type T = typeof T['en'];
let stageIdCounter = 1000;
export function WorkflowManagement({
  language,
  onDone
}: WorkflowManagementProps) {
  const t = T[language];
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(workflowDefinitions);
  const [selectedId, setSelectedId] = useState(workflowDefinitions[0].id);
  const selected = workflows.find(w => w.id === selectedId) ?? workflows[0];
  const [draftStages, setDraftStages] = useState<WorkflowStage[]>(selected.stages);
  const [draftThreshold, setDraftThreshold] = useState<number | undefined>(selected.thresholdValue);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3600);
  };
  const selectWorkflow = (id: string) => {
    const wf = workflows.find(w => w.id === id);
    if (!wf) return;
    setSelectedId(id);
    setDraftStages(wf.stages);
    setDraftThreshold(wf.thresholdValue);
    setDirty(false);
  };
  const mutateStages = (next: WorkflowStage[]) => {
    setDraftStages(next);
    setDirty(true);
  };
  const moveStage = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= draftStages.length) return;
    const next = [...draftStages];
    [next[index], next[target]] = [next[target], next[index]];
    mutateStages(next);
  };
  const updateStage = (index: number, patch: Partial<WorkflowStage>) => {
    const next = draftStages.map((s, i) => i === index ? {
      ...s,
      ...patch
    } : s);
    mutateStages(next);
  };
  const removeStage = (index: number) => {
    if (draftStages.length <= 2) {
      showToast(t.minStagesWarning);
      return;
    }
    mutateStages(draftStages.filter((_, i) => i !== index));
  };
  const addStage = () => {
    mutateStages([...draftStages, {
      id: `s-new-${stageIdCounter++}`,
      en: t.newStagePlaceholder,
      bn: t.newStagePlaceholder,
      role: roleOptions[0],
      slaDays: 1
    }]);
  };
  const discard = () => {
    setDraftStages(selected.stages);
    setDraftThreshold(selected.thresholdValue);
    setDirty(false);
    showToast(t.discardedNotice);
  };
  const save = () => {
    const today = '26 Jul 2026';
    setWorkflows(prev => prev.map(w => w.id === selected.id ? {
      ...w,
      stages: draftStages,
      thresholdValue: draftThreshold,
      version: w.version + 1,
      lastModified: today,
      history: [{
        id: `h-${Date.now()}`,
        timestamp: today,
        actor: 'System Admin',
        en: 'Stage sequence, roles or SLA updated via Workflow Management.',
        bn: 'ওয়ার্কফ্লো ব্যবস্থাপনার মাধ্যমে স্টেজ ক্রম, রোল বা এসএলএ হালনাগাদ করা হয়েছে।'
      }, ...w.history]
    } : w));
    setDirty(false);
    showToast(t.savedNotice);
  };
  const totalStages = useMemo(() => workflows.reduce((sum, w) => sum + w.stages.length, 0), [workflows]);
  const avgSla = useMemo(() => {
    const all = workflows.flatMap(w => w.stages.map(s => s.slaDays));
    return all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;
  }, [workflows]);
  const maxVersion = useMemo(() => Math.max(...workflows.map(w => w.version)), [workflows]);
  return <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-6">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="account_tree" label={t.statWorkflows} value={workflows.length} color="#0A4D8C" />
        <StatCard icon="linear_scale" label={t.statStages} value={totalStages} color="#1E88E5" />
        <StatCard icon="schedule" label={t.statAvgSla} value={avgSla} color="#00A86B" />
        <StatCard icon="new_releases" label={t.statVersion} value={`v${maxVersion}`} color="#B45309" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-sm">
          <p className="px-1 pb-1 text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">{t.workflowsListTitle}</p>
          {workflows.map(wf => {
          const meta = categoryMeta[wf.category];
          const active = wf.id === selected.id;
          return <button key={wf.id} type="button" onClick={() => selectWorkflow(wf.id)} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${active ? 'border-[#0A4D8C] bg-[#EAF3FE]' : 'border-transparent hover:bg-[#F5F7FA]'}`}>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{
              backgroundColor: `${meta.color}1A`,
              color: meta.color
            }}>
                  <Icon name={wf.icon} className="text-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${active ? 'text-[#0A4D8C]' : 'text-[#1E293B]'}`}>{language === 'en' ? wf.en : wf.bn}</p>
                  <p className="mt-0.5 truncate text-[11px]" style={{
                color: meta.color
              }}>{meta[language]}</p>
                  <p className="mt-0.5 text-[10px] text-[#94A3B8]">{wf.stages.length} · v{wf.version}</p>
                </div>
              </button>;
        })}
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1E293B]">{language === 'en' ? selected.en : selected.bn}</h2>
                {dirty && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{t.unsavedBadge}</span>}
              </div>
              <p className="mt-1 max-w-xl text-xs text-[#64748B]">{language === 'en' ? selected.descriptionEn : selected.descriptionBn}</p>
              <p className="mt-1 text-[11px] text-[#94A3B8]">{t.versionLabel} v{selected.version} · {t.lastModifiedLabel}: {selected.lastModified}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={discard} disabled={!dirty} className={`${ACTION_BTN_OUTLINE} disabled:cursor-not-allowed disabled:opacity-40`}>
                {t.discardChanges}
              </button>
              <button type="button" onClick={save} disabled={!dirty} className={`${ACTION_BTN_GREEN} disabled:cursor-not-allowed disabled:opacity-40`}>
                <Icon name="save" className="text-[14px]" />
                {t.saveChanges}
              </button>
            </div>
          </div>

          {selected.thresholdLabelEn && <Field label={`${language === 'en' ? selected.thresholdLabelEn : selected.thresholdLabelBn}`}>
              <div className="flex max-w-xs items-center gap-2">
                <input type="number" min={0} value={draftThreshold ?? 0} onChange={e => {
              setDraftThreshold(Number(e.target.value));
              setDirty(true);
            }} className={inputClass} />
                <span className="shrink-0 text-xs font-semibold text-[#64748B]">{t.thresholdSuffix}</span>
              </div>
            </Field>}

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#334155]">{t.stagesTitle}</p>
              <button type="button" onClick={addStage} className={ACTION_BTN}>
                <Icon name="add" className="text-[14px]" />
                {t.addStage}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {draftStages.map((stage, index) => <div key={stage.id} className={`rounded-lg border p-3 ${stage.isException ? 'border-dashed border-[#B45309] bg-amber-50/40' : 'border-[#E2E8F0] bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A4D8C] text-[11px] font-bold text-white">{index + 1}</span>
                      <button type="button" title={t.moveUp} onClick={() => moveStage(index, -1)} disabled={index === 0} className="text-[#94A3B8] hover:text-[#0A4D8C] disabled:opacity-30">
                        <Icon name="arrow_upward" className="text-[16px]" />
                      </button>
                      <button type="button" title={t.moveDown} onClick={() => moveStage(index, 1)} disabled={index === draftStages.length - 1} className="text-[#94A3B8] hover:text-[#0A4D8C] disabled:opacity-30">
                        <Icon name="arrow_downward" className="text-[16px]" />
                      </button>
                    </div>
                    <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-[1fr_180px_100px]">
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#64748B]">{t.stageName}</span>
                        <input type="text" value={language === 'en' ? stage.en : stage.bn} onChange={e => updateStage(index, language === 'en' ? {
                        en: e.target.value
                      } : {
                        bn: e.target.value
                      })} className={smallInputClass} />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#64748B]">{t.stageRole}</span>
                        <select value={stage.role} onChange={e => updateStage(index, {
                        role: e.target.value
                      })} className={smallInputClass}>
                          {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-[#64748B]">{t.stageSla}</span>
                        <input type="number" min={0} value={stage.slaDays} onChange={e => updateStage(index, {
                        slaDays: Number(e.target.value)
                      })} className={smallInputClass} />
                      </label>
                    </div>
                    <button type="button" title={t.deleteStage} onClick={() => removeStage(index)} className="mt-1 shrink-0 text-[#94A3B8] hover:text-[#DC2626]">
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                  {stage.isException && <p className="ml-9 mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#B45309]">
                      <Icon name="alt_route" className="text-[13px]" />
                      {t.exceptionBadge}
                    </p>}
                </div>)}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#E2E8F0] pt-4">
            <p className="text-[13px] font-semibold text-[#334155]">{t.historyTitle}</p>
            <div className="flex flex-col gap-2">
              {selected.history.map(h => <div key={h.id} className="flex items-start gap-2.5 rounded-lg bg-[#F8FAFC] px-3 py-2 text-xs">
                  <Icon name="history" className="mt-0.5 shrink-0 text-[14px] text-[#94A3B8]" />
                  <div>
                    <p className="text-[#334155]">{language === 'en' ? h.en : h.bn}</p>
                    <p className="mt-0.5 text-[10px] text-[#94A3B8]">{h.timestamp} · {h.actor}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">{t.footerNote}</p>
    </div>;
}
