import { useMemo, useState } from 'react';
import { authMethodLabels, statusLabels, systemUsers as seedUsers, type AccountStatus, type AuthMethod, type SystemUserRecord } from './userManagementData';
import { accessLevelMeta, moduleCatalog, roleTiers, type RoleTierId } from './roleManagementData';
type Language = 'en' | 'bn';
interface UserManagementProps {
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
const errorInputClass = 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20';
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
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{
      backgroundColor: `${color}1A`,
      color
    }}>
        <Icon name={icon} className="text-[19px]" />
      </span>
      <div>
        <p className="text-lg font-bold text-[#1E293B]">{value}</p>
        <p className="text-[11px] leading-tight text-[#64748B]">{label}</p>
      </div>
    </div>;
}
const ACTION_BTN = 'inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]';
const ACTION_BTN_GREEN = 'inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#087F52]';
const ACTION_BTN_RED = 'inline-flex items-center gap-1.5 rounded-full bg-[#DC2626] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#B91C1C]';
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const statusFilterOrder: AccountStatus[] = ['active', 'pending-activation', 'suspended'];
const authMethodOrder: AuthMethod[] = ['password-2fa', 'password-only', 'nid-otp'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'User Management',
    subtitle: 'Manage every CBMS user account — CBC officials, monitoring authority, system admins, viewers and external stakeholders — their designation, role tier, access status and authentication method.',
    backToDashboard: 'Back to Dashboard',
    onboarded: 'Onboarded in CBMS',
    addUser: 'Add User',
    searchPlaceholder: 'Search by name, email or designation…',
    tierFilterAll: 'All Role Tiers',
    statusAll: 'All',
    tableHeaders: {
      user: 'User',
      tier: 'Role Tier',
      status: 'Status',
      auth: 'Auth Method',
      lastLogin: 'Last Login',
      action: ''
    },
    view: 'View',
    noResults: 'No users match the current filters.',
    modalTitle: 'Add New User',
    fullName: 'Full Name',
    fullNamePlaceholder: 'e.g. Rezaul Karim',
    designation: 'Designation',
    designationPlaceholder: 'Select role tier first',
    roleTier: 'Role Tier',
    email: 'Email',
    emailPlaceholder: 'name@nbr.gov.bd',
    phone: 'Phone',
    phonePlaceholder: '+880 1XXX-XXXXXX',
    authMethod: 'Authentication Method',
    cancel: 'Cancel',
    save: 'Create User',
    requiredError: 'Name, designation and a valid email are required.',
    createdNotice: 'User created with Pending Activation status.',
    drawerProfile: 'Profile',
    drawerAccess: 'Role & Module Access',
    drawerFullAccess: 'Full access',
    drawerReadOnly: 'Read-only access',
    drawerModulesOf: (n: number, total: number) => `${n} of ${total} modules`,
    activate: 'Activate',
    suspend: 'Suspend',
    resetCredentials: 'Reset Credentials',
    resetNotice: (email: string) => `Password reset link sent to ${email} (simulated — no email sent).`,
    statusChangedNotice: 'Account status updated.',
    createdOn: 'Created',
    close: 'Close',
    footerNote: 'System Users are Service Recipients (Bonders), Service Providers (CBC officials, Lien Banks, Co-efficient providers) and Monitoring Authority (Commissioners, Members, Chairman, Secretary, Minister) — each managed here with categorized accessibility, authentication and authorization.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ইউজার ব্যবস্থাপনা',
    subtitle: 'প্রতিটি সিবিএমএস ব্যবহারকারী অ্যাকাউন্ট পরিচালনা করুন — সিবিসি কর্মকর্তা, মনিটরিং কর্তৃপক্ষ, সিস্টেম অ্যাডমিন, ভিউয়ার ও বহিরাগত স্টেকহোল্ডার — তাদের পদবি, রোল স্তর, অ্যাক্সেস অবস্থা ও প্রমাণীকরণ পদ্ধতিসহ।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    onboarded: 'সিবিএমএস-এ নিবন্ধিত',
    addUser: 'ইউজার যোগ করুন',
    searchPlaceholder: 'নাম, ইমেইল বা পদবি দিয়ে খুঁজুন…',
    tierFilterAll: 'সকল রোল স্তর',
    statusAll: 'সকল',
    tableHeaders: {
      user: 'ব্যবহারকারী',
      tier: 'রোল স্তর',
      status: 'অবস্থা',
      auth: 'প্রমাণীকরণ পদ্ধতি',
      lastLogin: 'সর্বশেষ লগইন',
      action: ''
    },
    view: 'দেখুন',
    noResults: 'বর্তমান ফিল্টারের সাথে কোনো ইউজার মেলে না।',
    modalTitle: 'নতুন ইউজার যোগ করুন',
    fullName: 'পূর্ণ নাম',
    fullNamePlaceholder: 'যেমন: রেজাউল করিম',
    designation: 'পদবি',
    designationPlaceholder: 'প্রথমে রোল স্তর নির্বাচন করুন',
    roleTier: 'রোল স্তর',
    email: 'ইমেইল',
    emailPlaceholder: 'name@nbr.gov.bd',
    phone: 'ফোন',
    phonePlaceholder: '+৮৮০ ১XXX-XXXXXX',
    authMethod: 'প্রমাণীকরণ পদ্ধতি',
    cancel: 'বাতিল',
    save: 'ইউজার তৈরি করুন',
    requiredError: 'নাম, পদবি এবং একটি বৈধ ইমেইল আবশ্যক।',
    createdNotice: 'ইউজার তৈরি হয়েছে, সক্রিয়করণ মুলতুবি অবস্থায়।',
    drawerProfile: 'প্রোফাইল',
    drawerAccess: 'রোল ও মডিউল অ্যাক্সেস',
    drawerFullAccess: 'সম্পূর্ণ অ্যাক্সেস',
    drawerReadOnly: 'শুধু-পঠন অ্যাক্সেস',
    drawerModulesOf: (n: number, total: number) => `${total}টির মধ্যে ${n}টি মডিউল`,
    activate: 'সক্রিয় করুন',
    suspend: 'স্থগিত করুন',
    resetCredentials: 'ক্রেডেনশিয়াল রিসেট করুন',
    resetNotice: (email: string) => `${email}-এ পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে (সিমুলেটেড — কোনো ইমেইল পাঠানো হয়নি)।`,
    statusChangedNotice: 'অ্যাকাউন্টের অবস্থা আপডেট হয়েছে।',
    createdOn: 'তৈরির তারিখ',
    close: 'বন্ধ করুন',
    footerNote: 'সিস্টেম ইউজাররা হলেন সেবা গ্রহীতা (বন্ডকারী), সেবা প্রদানকারী (সিবিসি কর্মকর্তা, লিয়েন ব্যাংক, কো-এফিসিয়েন্ট প্রদানকারী) এবং মনিটরিং কর্তৃপক্ষ (কমিশনার, সদস্য, চেয়ারম্যান, সচিব, মন্ত্রী) — প্রত্যেককে শ্রেণিবদ্ধ অ্যাক্সেসযোগ্যতা, প্রমাণীকরণ ও অনুমোদনসহ এখানে পরিচালনা করা হয়।'
  }
};
type T = typeof T['en'];
function TierBadge({
  tierId,
  language
}: {
  tierId: RoleTierId;
  language: Language;
}) {
  const tier = roleTiers.find(r => r.id === tierId);
  if (!tier) return null;
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${tier.color}1A`,
    color: tier.color
  }}>
      <Icon name={tier.icon} className="text-[13px]" />
      {language === 'en' ? tier.nameEn : tier.nameBn}
    </span>;
}
function StatusBadge({
  status,
  language
}: {
  status: AccountStatus;
  language: Language;
}) {
  const s = statusLabels[status];
  return <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{
    backgroundColor: `${s.color}1A`,
    color: s.color
  }}>
      {s[language]}
    </span>;
}
function AddUserModal({
  language,
  t,
  onClose,
  onCreate
}: {
  language: Language;
  t: T;
  onClose: () => void;
  onCreate: (u: SystemUserRecord) => void;
}) {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [tierId, setTierId] = useState<RoleTierId>('system-user');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password-2fa');
  const [error, setError] = useState(false);
  const selectedTier = roleTiers.find(r => r.id === tierId);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-base font-bold text-[#1E293B]">{t.modalTitle}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-4">
          <Field label={t.roleTier}>
            <select value={tierId} onChange={e => setTierId(e.target.value as RoleTierId)} className={inputClass}>
              {roleTiers.filter(r => !r.custom).map(r => <option key={r.id} value={r.id}>{language === 'en' ? r.nameEn : r.nameBn}</option>)}
            </select>
          </Field>
          <Field label={t.fullName} required>
            <input type="text" value={name} onChange={e => {
            setName(e.target.value);
            setError(false);
          }} placeholder={t.fullNamePlaceholder} className={`${inputClass} ${error && !name.trim() ? errorInputClass : ''}`} />
          </Field>
          <Field label={t.designation} required>
            <input list="designation-options" type="text" value={designation} onChange={e => {
            setDesignation(e.target.value);
            setError(false);
          }} placeholder={selectedTier ? selectedTier.designations[0]?.[language] : t.designationPlaceholder} className={`${inputClass} ${error && !designation.trim() ? errorInputClass : ''}`} />
            <datalist id="designation-options">
              {selectedTier?.designations.map((d, i) => <option key={i} value={d[language]} />)}
            </datalist>
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t.email} required>
              <input type="email" value={email} onChange={e => {
              setEmail(e.target.value);
              setError(false);
            }} placeholder={t.emailPlaceholder} className={`${inputClass} ${error && !email.includes('@') ? errorInputClass : ''}`} />
            </Field>
            <Field label={t.phone}>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.phonePlaceholder} className={inputClass} />
            </Field>
          </div>
          <Field label={t.authMethod}>
            <select value={authMethod} onChange={e => setAuthMethod(e.target.value as AuthMethod)} className={inputClass}>
              {authMethodOrder.map(a => <option key={a} value={a}>{authMethodLabels[a][language]}</option>)}
            </select>
          </Field>
          {error && <p className="text-xs font-medium text-[#DC2626]">{t.requiredError}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
          <button type="button" onClick={onClose} className={ACTION_BTN_OUTLINE}>{t.cancel}</button>
          <button type="button" onClick={() => {
          if (!name.trim() || !designation.trim() || !email.includes('@')) {
            setError(true);
            return;
          }
          onCreate({
            id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
            nameEn: name.trim(),
            nameBn: name.trim(),
            designationEn: designation.trim(),
            designationBn: designation.trim(),
            roleTier: tierId,
            email: email.trim(),
            phone: phone.trim() || '—',
            status: 'pending-activation',
            authMethod,
            lastLogin: '—',
            createdDate: '26 Jul 2026'
          });
        }} className={ACTION_BTN_GREEN}>
            <Icon name="person_add" className="text-[14px]" />
            {t.save}
          </button>
        </div>
      </div>
    </div>;
}
function UserDetailDrawer({
  user,
  language,
  t,
  onClose,
  onToggleStatus,
  onResetCredentials
}: {
  user: SystemUserRecord;
  language: Language;
  t: T;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onResetCredentials: (email: string) => void;
}) {
  const tier = roleTiers.find(r => r.id === user.roleTier);
  const fullCount = tier ? moduleCatalog.filter(m => tier.access[m.id] === 'full').length : 0;
  const readOnlyCount = tier ? moduleCatalog.filter(m => tier.access[m.id] === 'read-only').length : 0;
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.drawerProfile}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{
            backgroundColor: tier?.color ?? '#64748B'
          }}>
              {(language === 'en' ? user.nameEn : user.nameBn).charAt(0)}
            </span>
            <div>
              <p className="text-base font-bold text-[#1E293B]">{language === 'en' ? user.nameEn : user.nameBn}</p>
              <p className="text-xs text-[#64748B]">{language === 'en' ? user.designationEn : user.designationBn}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <TierBadge tierId={user.roleTier} language={language} />
            <StatusBadge status={user.status} language={language} />
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-xl bg-[#F5F7FA] p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.email}</p>
              <p className="text-[#1E293B]">{user.email}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.phone}</p>
              <p className="text-[#1E293B]">{user.phone}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.authMethod}</p>
              <p className="text-[#1E293B]">{authMethodLabels[user.authMethod][language]}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.createdOn}</p>
              <p className="text-[#1E293B]">{user.createdDate}</p>
            </div>
          </div>

          {tier && <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">{t.drawerAccess}</p>
              <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] p-4">
                <p className="text-sm font-semibold text-[#1E293B]">{language === 'en' ? tier.nameEn : tier.nameBn}</p>
                <p className="text-xs text-[#64748B]">{language === 'en' ? tier.descEn : tier.descBn}</p>
                <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                  <span className="rounded-full px-2 py-1" style={{
                backgroundColor: `${accessLevelMeta.full.color}1A`,
                color: accessLevelMeta.full.color
              }}>{t.drawerFullAccess}: {t.drawerModulesOf(fullCount, moduleCatalog.length)}</span>
                  <span className="rounded-full px-2 py-1" style={{
                backgroundColor: `${accessLevelMeta['read-only'].color}1A`,
                color: accessLevelMeta['read-only'].color
              }}>{t.drawerReadOnly}: {t.drawerModulesOf(readOnlyCount, moduleCatalog.length)}</span>
                </div>
              </div>
            </div>}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => onToggleStatus(user.id)} className={user.status === 'suspended' ? ACTION_BTN_GREEN : ACTION_BTN_RED}>
              <Icon name={user.status === 'suspended' ? 'lock_open' : 'lock'} className="text-[14px]" />
              {user.status === 'suspended' ? t.activate : t.suspend}
            </button>
            <button type="button" onClick={() => onResetCredentials(user.email)} className={ACTION_BTN_OUTLINE}>
              <Icon name="key" className="text-[14px]" />
              {t.resetCredentials}
            </button>
          </div>
        </div>
      </div>
    </div>;
}
export function UserManagement({
  language,
  onDone
}: UserManagementProps) {
  const t = T[language];
  const [users, setUsers] = useState<SystemUserRecord[]>(seedUsers);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | RoleTierId>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [selectedUser, setSelectedUser] = useState<SystemUserRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const filtered = useMemo(() => users.filter(u => {
    if (tierFilter !== 'all' && u.roleTier !== tierFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const hay = `${u.nameEn} ${u.nameBn} ${u.email} ${u.designationEn} ${u.designationBn}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [users, tierFilter, statusFilter, search]);
  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? {
      ...u,
      status: u.status === 'suspended' ? 'active' : 'suspended'
    } : u));
    setSelectedUser(prev => prev && prev.id === id ? {
      ...prev,
      status: prev.status === 'suspended' ? 'active' : 'suspended'
    } : prev);
    showToast(t.statusChangedNotice);
  };
  const handleResetCredentials = (email: string) => {
    showToast(t.resetNotice(email));
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
        <button type="button" onClick={() => setShowAddModal(true)} className={`${ACTION_BTN} shrink-0`}>
          <Icon name="person_add" className="text-[14px]" />
          {t.addUser}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {roleTiers.filter(r => !r.custom).map(tier => <StatCard key={tier.id} icon={tier.icon} label={language === 'en' ? tier.nameEn : tier.nameBn} value={tier.userCount.toLocaleString()} color={tier.color} />)}
        <StatCard icon="how_to_reg" label={t.onboarded} value={users.length} color="#334155" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value as 'all' | RoleTierId)} className={`${inputClass} sm:w-auto`}>
            <option value="all">{t.tierFilterAll}</option>
            {roleTiers.filter(r => !r.custom).map(r => <option key={r.id} value={r.id}>{language === 'en' ? r.nameEn : r.nameBn}</option>)}
          </select>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setStatusFilter('all')} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusFilter === 'all' ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155]'}`}>{t.statusAll}</button>
            {statusFilterOrder.map(s => <button key={s} type="button" onClick={() => setStatusFilter(s)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusFilter === s ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155]'}`}>{statusLabels[s][language]}</button>)}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        {filtered.length === 0 ? <p className="p-6 text-center text-sm text-[#64748B]">{t.noResults}</p> : <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              <tr>
                <th className="px-4 py-3">{t.tableHeaders.user}</th>
                <th className="px-4 py-3">{t.tableHeaders.tier}</th>
                <th className="px-4 py-3">{t.tableHeaders.status}</th>
                <th className="px-4 py-3">{t.tableHeaders.auth}</th>
                <th className="px-4 py-3">{t.tableHeaders.lastLogin}</th>
                <th className="px-4 py-3">{t.tableHeaders.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map(u => <tr key={u.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1E293B]">{language === 'en' ? u.nameEn : u.nameBn}</p>
                    <p className="text-xs text-[#64748B]">{language === 'en' ? u.designationEn : u.designationBn}</p>
                  </td>
                  <td className="px-4 py-3"><TierBadge tierId={u.roleTier} language={language} /></td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} language={language} /></td>
                  <td className="px-4 py-3 text-[#64748B]">{authMethodLabels[u.authMethod][language]}</td>
                  <td className="px-4 py-3 text-[#64748B]">{u.lastLogin}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => setSelectedUser(u)} className={ACTION_BTN_OUTLINE}>
                      <Icon name="visibility" className="text-[13px]" />
                      {t.view}
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>}
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">
        <Icon name="info" className="mr-1 align-text-bottom text-[14px] text-[#1E88E5]" />
        {t.footerNote}
      </p>

      {showAddModal && <AddUserModal language={language} t={t} onClose={() => setShowAddModal(false)} onCreate={u => {
      setUsers(prev => [u, ...prev]);
      setShowAddModal(false);
      showToast(t.createdNotice);
    }} />}

      {selectedUser && <UserDetailDrawer user={selectedUser} language={language} t={t} onClose={() => setSelectedUser(null)} onToggleStatus={handleToggleStatus} onResetCredentials={handleResetCredentials} />}
    </div>;
}
