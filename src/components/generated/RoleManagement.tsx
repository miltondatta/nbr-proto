import { useState } from 'react';
import { accessLevelMeta, moduleCatalog, roleTiers as seedRoleTiers, type AccessLevel, type RoleTier } from './roleManagementData';
type Language = 'en' | 'bn';
interface RoleManagementProps {
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
const customPalette = ['#EC4899', '#0891B2', '#CA8A04', '#7C3AED', '#059669'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Role Management',
    subtitle: 'The five system-wide role tiers defined for CBMS — designations, user counts and the module permission matrix governing access across the platform.',
    backToDashboard: 'Back to Dashboard',
    statRoles: 'Role Tiers',
    statUsers: 'Total Users Governed',
    statModules: 'Modules Governed',
    statCustom: 'Custom Roles',
    createRole: 'Create Custom Role',
    viewDetails: 'View Details',
    hideDetails: 'Hide Details',
    designationsTitle: 'Designations',
    accessSummary: 'Access Summary',
    remove: 'Remove Role',
    edit: 'Edit Permissions',
    customBadge: 'Custom',
    matrixTitle: 'Module Permission Matrix',
    matrixModuleCol: 'Module',
    modalTitle: 'Create Custom Role',
    modalTitleEdit: 'Edit Role Permissions',
    roleName: 'Role Name',
    roleNamePlaceholder: 'e.g. Zone Audit Supervisor',
    cloneFrom: 'Clone Permissions From',
    designationsLabel: 'Designations (comma-separated)',
    designationsPlaceholder: 'e.g. Zone Audit Lead, Regional Coordinator',
    permissionsLabel: 'Module Permissions',
    cancel: 'Cancel',
    save: 'Create Role',
    saveEdit: 'Save Changes',
    nameRequired: 'Enter a role name to continue.',
    createdNotice: 'Custom role created and added to the permission matrix.',
    updatedNotice: 'Role permissions updated.',
    removedNotice: 'Custom role removed.',
    userCountSuffix: 'users',
    footerNote: 'System Users are managed under User Management; this screen governs which modules each role tier — and any custom role cloned from one — can access, at Full, Read-Only or No Access level.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'রোল ব্যবস্থাপনা',
    subtitle: 'সিবিএমএস-এর জন্য নির্ধারিত পাঁচটি সিস্টেম-ব্যাপী রোল স্তর — পদবি, ব্যবহারকারী সংখ্যা এবং প্ল্যাটফর্ম জুড়ে অ্যাক্সেস নিয়ন্ত্রণকারী মডিউল পারমিশন ম্যাট্রিক্স।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    statRoles: 'রোল স্তর',
    statUsers: 'নিয়ন্ত্রিত মোট ব্যবহারকারী',
    statModules: 'নিয়ন্ত্রিত মডিউল',
    statCustom: 'কাস্টম রোল',
    createRole: 'কাস্টম রোল তৈরি করুন',
    viewDetails: 'বিস্তারিত দেখুন',
    hideDetails: 'বিস্তারিত লুকান',
    designationsTitle: 'পদবি',
    accessSummary: 'অ্যাক্সেস সারসংক্ষেপ',
    remove: 'রোল অপসারণ করুন',
    edit: 'পারমিশন সম্পাদনা করুন',
    customBadge: 'কাস্টম',
    matrixTitle: 'মডিউল পারমিশন ম্যাট্রিক্স',
    matrixModuleCol: 'মডিউল',
    modalTitle: 'কাস্টম রোল তৈরি করুন',
    modalTitleEdit: 'রোল পারমিশন সম্পাদনা করুন',
    roleName: 'রোলের নাম',
    roleNamePlaceholder: 'যেমন: জোন অডিট সুপারভাইজার',
    cloneFrom: 'যার থেকে পারমিশন ক্লোন করবেন',
    designationsLabel: 'পদবি (কমা দিয়ে পৃথক)',
    designationsPlaceholder: 'যেমন: জোন অডিট লিড, রিজিওনাল কোঅর্ডিনেটর',
    permissionsLabel: 'মডিউল পারমিশন',
    cancel: 'বাতিল',
    save: 'রোল তৈরি করুন',
    saveEdit: 'পরিবর্তন সংরক্ষণ করুন',
    nameRequired: 'চালিয়ে যেতে একটি রোলের নাম লিখুন।',
    createdNotice: 'কাস্টম রোল তৈরি হয়েছে এবং পারমিশন ম্যাট্রিক্সে যুক্ত হয়েছে।',
    updatedNotice: 'রোলের পারমিশন আপডেট হয়েছে।',
    removedNotice: 'কাস্টম রোল অপসারণ করা হয়েছে।',
    userCountSuffix: 'জন ব্যবহারকারী',
    footerNote: 'সিস্টেম ইউজারদের ইউজার ব্যবস্থাপনার অধীনে পরিচালনা করা হয়; এই স্ক্রিনটি নিয়ন্ত্রণ করে প্রতিটি রোল স্তর — এবং তা থেকে ক্লোনকৃত যেকোনো কাস্টম রোল — কোন মডিউলে সম্পূর্ণ, শুধু-পঠন বা কোনো অ্যাক্সেস পাবে না।'
  }
};
type T = typeof T['en'];
const accessCycle: AccessLevel[] = ['none', 'read-only', 'full'];
function RoleFormModal({
  mode,
  editTarget,
  baseRoles,
  language,
  t,
  onClose,
  onSave
}: {
  mode: 'create' | 'edit';
  editTarget?: RoleTier;
  baseRoles: RoleTier[];
  language: Language;
  t: T;
  onClose: () => void;
  onSave: (role: RoleTier) => void;
}) {
  const [name, setName] = useState('');
  const [cloneFromId, setCloneFromId] = useState(baseRoles[0]?.id ?? '');
  const [designationsText, setDesignationsText] = useState('');
  const cloneFrom = baseRoles.find(r => r.id === cloneFromId) ?? baseRoles[0];
  const [permissions, setPermissions] = useState<Record<string, AccessLevel>>(() => ({
    ...(mode === 'edit' && editTarget ? editTarget.access : cloneFrom?.access)
  }));
  const [error, setError] = useState(false);
  const handleCloneChange = (id: string) => {
    setCloneFromId(id);
    const src = baseRoles.find(r => r.id === id);
    if (src) setPermissions({
      ...src.access
    });
  };
  const cyclePermission = (moduleId: string) => {
    setPermissions(prev => {
      const current = prev[moduleId] ?? 'none';
      const nextIdx = (accessCycle.indexOf(current) + 1) % accessCycle.length;
      return {
        ...prev,
        [moduleId]: accessCycle[nextIdx]
      };
    });
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-base font-bold text-[#1E293B]">{mode === 'edit' ? t.modalTitleEdit : t.modalTitle}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-4">
          {mode === 'edit' && editTarget ? <div className="flex items-center gap-3 rounded-lg bg-[#F5F7FA] p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{
            backgroundColor: `${editTarget.color}1A`,
            color: editTarget.color
          }}>
                <Icon name={editTarget.icon} className="text-[20px]" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#1E293B]">{language === 'en' ? editTarget.nameEn : editTarget.nameBn}</p>
                <p className="text-xs text-[#64748B]">{editTarget.userCount.toLocaleString()} {t.userCountSuffix}</p>
              </div>
            </div> : <>
              <Field label={t.roleName}>
                <input type="text" value={name} onChange={e => {
              setName(e.target.value);
              setError(false);
            }} placeholder={t.roleNamePlaceholder} className={`${inputClass} ${error ? 'border-[#DC2626]' : ''}`} />
              </Field>
              <Field label={t.cloneFrom}>
                <select value={cloneFromId} onChange={e => handleCloneChange(e.target.value)} className={inputClass}>
                  {baseRoles.map(r => <option key={r.id} value={r.id}>{language === 'en' ? r.nameEn : r.nameBn}</option>)}
                </select>
              </Field>
              <Field label={t.designationsLabel}>
                <input type="text" value={designationsText} onChange={e => setDesignationsText(e.target.value)} placeholder={t.designationsPlaceholder} className={inputClass} />
              </Field>
              {error && <p className="text-xs font-medium text-[#DC2626]">{t.nameRequired}</p>}
            </>}
          <div>
            <span className="text-[13px] font-semibold text-[#334155]">{t.permissionsLabel}</span>
            <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-[#E2E8F0]">
              {moduleCatalog.map(m => {
              const level = permissions[m.id] ?? 'none';
              const meta = accessLevelMeta[level];
              return <button key={m.id} type="button" onClick={() => cyclePermission(m.id)} className="flex w-full items-center justify-between gap-2 border-b border-[#F1F5F9] px-3 py-2 text-left text-xs last:border-b-0 hover:bg-[#F8FAFC]">
                    <span className="text-[#334155]">{language === 'en' ? m.labelEn : m.labelBn}</span>
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{
                  backgroundColor: `${meta.color}1A`,
                  color: meta.color
                }}>
                      <Icon name={meta.icon} className="text-[12px]" />
                      {meta[language]}
                    </span>
                  </button>;
            })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
          <button type="button" onClick={onClose} className={ACTION_BTN_OUTLINE}>{t.cancel}</button>
          <button type="button" onClick={() => {
          if (mode === 'edit' && editTarget) {
            onSave({
              ...editTarget,
              access: permissions
            });
            return;
          }
          if (!name.trim()) {
            setError(true);
            return;
          }
          const designations = designationsText.split(',').map(s => s.trim()).filter(Boolean).map(s => ({
            en: s,
            bn: s
          }));
          onSave({
            id: `custom-${Date.now()}`,
            nameEn: name.trim(),
            nameBn: name.trim(),
            descEn: `Custom role cloned from ${cloneFrom ? cloneFrom.nameEn : 'System User'}, with individually adjusted module permissions.`,
            descBn: `${cloneFrom ? cloneFrom.nameBn : 'সিস্টেম ইউজার'} থেকে ক্লোনকৃত কাস্টম রোল, পৃথকভাবে সামঞ্জস্যকৃত মডিউল পারমিশনসহ।`,
            designations,
            userCount: 0,
            color: customPalette[Math.floor(Math.random() * customPalette.length)],
            icon: 'star',
            access: permissions,
            custom: true
          });
        }} className={ACTION_BTN_GREEN}>
            <Icon name={mode === 'edit' ? 'save' : 'add_circle'} className="text-[14px]" />
            {mode === 'edit' ? t.saveEdit : t.save}
          </button>
        </div>
      </div>
    </div>;
}
export function RoleManagement({
  language,
  onDone
}: RoleManagementProps) {
  const t = T[language];
  const [tiers, setTiers] = useState<RoleTier[]>(seedRoleTiers);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    mode: 'create';
  } | {
    mode: 'edit';
    tier: RoleTier;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const totalUsers = tiers.reduce((sum, r) => sum + r.userCount, 0);
  const customCount = tiers.filter(r => r.custom).length;
  const accessSummary = (tier: RoleTier) => {
    const values = moduleCatalog.map(m => tier.access[m.id] ?? 'none');
    return {
      full: values.filter(v => v === 'full').length,
      readOnly: values.filter(v => v === 'read-only').length,
      none: values.filter(v => v === 'none').length
    };
  };
  const handleRemove = (id: string) => {
    setTiers(prev => prev.filter(r => r.id !== id));
    if (expandedId === id) setExpandedId(null);
    showToast(t.removedNotice);
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button type="button" onClick={() => setFormState({
        mode: 'create'
      })} className={`${ACTION_BTN} shrink-0`}>
          <Icon name="add" className="text-[14px]" />
          {t.createRole}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="account_tree" label={t.statRoles} value={tiers.length} color="#0A4D8C" />
        <StatCard icon="groups" label={t.statUsers} value={totalUsers.toLocaleString()} color="#00A86B" />
        <StatCard icon="apps" label={t.statModules} value={moduleCatalog.length} color="#1E88E5" />
        <StatCard icon="star" label={t.statCustom} value={customCount} color="#EC4899" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tiers.map(tier => {
        const expanded = expandedId === tier.id;
        const summary = accessSummary(tier);
        return <div key={tier.id} className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{
                  backgroundColor: `${tier.color}1A`,
                  color: tier.color
                }}>
                    <Icon name={tier.icon} className="text-[22px]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? tier.nameEn : tier.nameBn}</h3>
                      {tier.custom && <span className="rounded-full bg-[#FCE7F3] px-2 py-0.5 text-[10px] font-semibold text-[#DB2777]">{t.customBadge}</span>}
                    </div>
                    <p className="text-xs text-[#64748B]">{tier.userCount.toLocaleString()} {t.userCountSuffix}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[#64748B]">{language === 'en' ? tier.descEn : tier.descBn}</p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
                <span className="rounded-full px-2 py-1" style={{
                backgroundColor: `${accessLevelMeta.full.color}1A`,
                color: accessLevelMeta.full.color
              }}>{summary.full} {accessLevelMeta.full[language]}</span>
                <span className="rounded-full px-2 py-1" style={{
                backgroundColor: `${accessLevelMeta['read-only'].color}1A`,
                color: accessLevelMeta['read-only'].color
              }}>{summary.readOnly} {accessLevelMeta['read-only'][language]}</span>
                <span className="rounded-full px-2 py-1" style={{
                backgroundColor: `${accessLevelMeta.none.color}1A`,
                color: accessLevelMeta.none.color
              }}>{summary.none} {accessLevelMeta.none[language]}</span>
              </div>
              {expanded && <div className="flex flex-col gap-2 rounded-lg bg-[#F5F7FA] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">{t.designationsTitle}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tier.designations.map((d, i) => <span key={i} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#334155] shadow-sm">{d[language]}</span>)}
                  </div>
                  {tier.designationNoteEn && <p className="text-[11px] italic text-[#94A3B8]">{language === 'en' ? tier.designationNoteEn : tier.designationNoteBn}</p>}
                </div>}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setExpandedId(expanded ? null : tier.id)} className={ACTION_BTN_OUTLINE}>
                  <Icon name={expanded ? 'expand_less' : 'expand_more'} className="text-[14px]" />
                  {expanded ? t.hideDetails : t.viewDetails}
                </button>
                <button type="button" onClick={() => setFormState({
                mode: 'edit',
                tier
              })} className={ACTION_BTN}>
                  <Icon name="edit" className="text-[14px]" />
                  {t.edit}
                </button>
                {tier.custom && <button type="button" onClick={() => handleRemove(tier.id)} className={ACTION_BTN_RED}>
                    <Icon name="delete" className="text-[14px]" />
                    {t.remove}
                  </button>}
              </div>
            </div>;
      })}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#1E293B]">{t.matrixTitle}</h2>
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              <tr>
                <th className="sticky left-0 bg-[#F5F7FA] px-4 py-3">{t.matrixModuleCol}</th>
                {tiers.map(tier => <th key={tier.id} className="px-3 py-3 text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{
                    backgroundColor: tier.color
                  }} />
                      {language === 'en' ? tier.nameEn : tier.nameBn}
                    </span>
                  </th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {moduleCatalog.map(m => <tr key={m.id} className="hover:bg-[#F8FAFC]">
                  <td className="sticky left-0 whitespace-nowrap bg-white px-4 py-2.5 font-medium text-[#334155]">{language === 'en' ? m.labelEn : m.labelBn}</td>
                  {tiers.map(tier => {
                const level = tier.access[m.id] ?? 'none';
                const meta = accessLevelMeta[level];
                return <td key={tier.id} className="px-3 py-2.5 text-center">
                        <span style={{
                    color: meta.color
                  }}>
                          <Icon name={meta.icon} className="text-[16px]" />
                        </span>
                      </td>;
              })}
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">
        <Icon name="info" className="mr-1 align-text-bottom text-[14px] text-[#1E88E5]" />
        {t.footerNote}
      </p>

      {formState && <RoleFormModal mode={formState.mode} editTarget={formState.mode === 'edit' ? formState.tier : undefined} baseRoles={tiers} language={language} t={t} onClose={() => setFormState(null)} onSave={role => {
      if (formState.mode === 'edit') {
        setTiers(prev => prev.map(r => r.id === role.id ? role : r));
        showToast(t.updatedNotice);
      } else {
        setTiers(prev => [...prev, role]);
        showToast(t.createdNotice);
      }
      setFormState(null);
    }} />}
    </div>;
}
