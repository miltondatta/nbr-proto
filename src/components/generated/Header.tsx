import { useEffect, useRef, useState } from 'react';
type Language = 'en' | 'bn';
interface HeaderProps {
  language: Language;
  onLanguageChange: (l: Language) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
}
const T = {
  en: {
    org: 'Government of the People’s Republic of Bangladesh',
    appName: 'Customs Bond Management System',
    appShort: 'CBMS',
    search: 'Search bond licenses, bonders, HS codes, circulars…',
    notifications: 'Notifications',
    help: 'Help',
    viewAll: 'View all notifications',
    helpCenter: 'Help Centre',
    userGuide: 'User Guide',
    faq: 'Frequently Asked Questions',
    contact: 'Contact NBR Support',
    reportIssue: 'Report an Issue',
    callCentre: 'Call Centre',
    myProfile: 'My Profile',
    changePassword: 'Change Password',
    activityLog: 'My Activity Log',
    signOut: 'Sign Out',
    role: 'Deputy Commissioner',
    org2: 'Customs Bond Commissionerate, Dhaka'
  },
  bn: {
    org: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    appName: 'কাস্টমস বন্ড ব্যবস্থাপনা সিস্টেম',
    appShort: 'সিবিএমএস',
    search: 'বন্ড লাইসেন্স, বন্ডকারী, এইচএস কোড, সার্কুলার অনুসন্ধান করুন…',
    notifications: 'নোটিফিকেশন',
    help: 'সহায়তা',
    viewAll: 'সকল নোটিফিকেশন দেখুন',
    helpCenter: 'হেল্প সেন্টার',
    userGuide: 'ব্যবহারকারী নির্দেশিকা',
    faq: 'সচরাচর জিজ্ঞাসিত প্রশ্ন',
    contact: 'এনবিআর সাপোর্টে যোগাযোগ করুন',
    reportIssue: 'সমস্যা রিপোর্ট করুন',
    callCentre: 'কল সেন্টার',
    myProfile: 'আমার প্রোফাইল',
    changePassword: 'পাসওয়ার্ড পরিবর্তন',
    activityLog: 'আমার কার্যক্রম লগ',
    signOut: 'সাইন আউট',
    role: 'উপ কমিশনার',
    org2: 'কাস্টমস বন্ড কমিশনারেট, ঢাকা'
  }
};
const notifications = [{
  icon: 'schedule',
  tone: 'amber',
  en: 'Bond License BL-2021-00934 renewal is due in 5 days.',
  bn: 'বন্ড লাইসেন্স BL-2021-00934 নবায়ন ৫ দিনের মধ্যে করতে হবে।',
  time: {
    en: '18 min ago',
    bn: '১৮ মিনিট আগে'
  }
}, {
  icon: 'task_alt',
  tone: 'green',
  en: 'Lien Bank verification completed by Sonali Bank, Motijheel Corporate Branch.',
  bn: 'সোনালী ব্যাংক, মতিঝিল কর্পোরেট শাখা কর্তৃক লিয়েন ব্যাংক যাচাই সম্পন্ন হয়েছে।',
  time: {
    en: '1 hour ago',
    bn: '১ ঘণ্টা আগে'
  }
}, {
  icon: 'campaign',
  tone: 'blue',
  en: 'New Circular NBR/Cus/Bond/2026/17 has been published.',
  bn: 'নতুন সার্কুলার NBR/Cus/Bond/2026/17 প্রকাশিত হয়েছে।',
  time: {
    en: '3 hours ago',
    bn: '৩ ঘণ্টা আগে'
  }
}, {
  icon: 'warning',
  tone: 'red',
  en: 'UD submission deadline for Envoy Textiles Ltd. is tomorrow.',
  bn: 'এনভয় টেক্সটাইলস লিমিটেডের ইউডি জমার শেষ সময় আগামীকাল।',
  time: {
    en: 'Yesterday',
    bn: 'গতকাল'
  }
}];
const toneClasses: Record<string, string> = {
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-[#0A4D8C]',
  red: 'bg-red-50 text-red-600'
};
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
function GovEmblem() {
  return <svg viewBox="0 0 48 48" className="h-9 w-9 shrink-0" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#F5F7FA" stroke="#0A4D8C" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="18.5" fill="none" stroke="#00A86B" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M24 12c1.8 3 2.6 5.6 2.6 8 0 2.9-1.2 4.6-2.6 6.4-1.4-1.8-2.6-3.5-2.6-6.4 0-2.4.8-5 2.6-8Z" fill="#00A86B" />
      
      <path d="M14.5 20.5c3.2 1 5.6 2.4 7.3 4.2 2 2.1 2.5 4.1 2.1 6.4-2.3-.4-4.2-1.4-6.2-3.4-1.7-1.8-2.7-4.2-3.2-7.2Z" fill="#1E88E5" />
      
      <path d="M33.5 20.5c-3.2 1-5.6 2.4-7.3 4.2-2 2.1-2.5 4.1-2.1 6.4 2.3-.4 4.2-1.4 6.2-3.4 1.7-1.8 2.7-4.2 3.2-7.2Z" fill="#1E88E5" />
      
      <circle cx="24" cy="24" r="2.4" fill="#0A4D8C" />
    </svg>;
}
function NbrLogo() {
  return <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A4D8C] text-[11px] font-extrabold tracking-tight text-white">
      NBR
    </div>;
}
function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  return ref;
}
export function Header({
  language,
  onLanguageChange,
  sidebarCollapsed,
  onToggleSidebar,
  searchQuery,
  onSearchQueryChange
}: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<'notifications' | 'help' | 'profile' | null>(null);
  const t = T[language];
  const notifRef = useOutsideClose(() => setOpenMenu(m => m === 'notifications' ? null : m));
  const helpRef = useOutsideClose(() => setOpenMenu(m => m === 'help' ? null : m));
  const profileRef = useOutsideClose(() => setOpenMenu(m => m === 'profile' ? null : m));
  const toggle = (name: 'notifications' | 'help' | 'profile') => setOpenMenu(m => m === name ? null : name);
  return <header className="relative z-40 flex h-16 shrink-0 items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 shadow-sm">
      <button type="button" onClick={onToggleSidebar} title={sidebarCollapsed ? language === 'en' ? 'Expand menu' : 'মেনু প্রসারিত করুন' : language === 'en' ? 'Collapse menu' : 'মেনু সংকুচিত করুন'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#334155] transition-colors hover:bg-[#F5F7FA]">
        
        <Icon name="menu" className="text-[22px]" />
      </button>

      <div className="flex shrink-0 items-center gap-2.5 pr-3">
        <GovEmblem />
        <NbrLogo />
      </div>

      <div className="hidden shrink-0 flex-col leading-tight md:flex pr-4 border-r border-[#E2E8F0]">
        <span className="text-[11px] font-medium text-[#64748B]">{t.org}</span>
        <span className="text-[15px] font-bold text-[#0A4D8C]">
          {t.appName} <span className="text-[#00A86B]">· {t.appShort}</span>
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-xl min-w-0 flex-1 items-center">
        <div className="relative w-full">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#94A3B8]" />
          <input type="text" value={searchQuery} onChange={e => onSearchQueryChange(e.target.value)} placeholder={t.search} aria-label={t.search} className="w-full rounded-full border border-[#E2E8F0] bg-[#F5F7FA] py-2.5 pl-10 pr-4 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:bg-white focus:ring-2 focus:ring-[#1E88E5]/20" />
          
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 pl-2">
        <button type="button" onClick={() => onLanguageChange(language === 'en' ? 'bn' : 'en')} className="flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-1 py-1 text-xs font-semibold text-[#334155] transition-colors hover:border-[#1E88E5]" aria-label="Switch language">
          
          <span className={`rounded-full px-2 py-1 transition-colors ${language === 'en' ? 'bg-[#0A4D8C] text-white' : 'text-[#64748B]'}`}>EN</span>
          <span className={`rounded-full px-2 py-1 transition-colors ${language === 'bn' ? 'bg-[#0A4D8C] text-white' : 'text-[#64748B]'}`}>বাং</span>
        </button>

        <div className="relative" ref={notifRef}>
          <button type="button" onClick={() => toggle('notifications')} title={t.notifications} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#334155] transition-colors hover:bg-[#F5F7FA]" aria-haspopup="true" aria-expanded={openMenu === 'notifications'}>
            
            <Icon name="notifications" className="text-[22px]" />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white ring-2 ring-white">
              4
            </span>
          </button>
          {openMenu === 'notifications' && <div className="absolute right-0 top-11 w-96 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
                <span className="text-sm font-semibold text-[#1E293B]">{t.notifications}</span>
                <span className="rounded-full bg-[#EAF3FE] px-2 py-0.5 text-xs font-semibold text-[#0A4D8C]">4 {language === 'en' ? 'new' : 'নতুন'}</span>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.map((n, i) => <li key={i} className="flex gap-3 border-b border-[#F1F5F9] px-4 py-3 last:border-0 hover:bg-[#F8FAFC]">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClasses[n.tone]}`}>
                      <Icon name={n.icon} className="text-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] leading-snug text-[#334155]">{n[language]}</p>
                      <span className="text-[11px] text-[#94A3B8]">{n.time[language]}</span>
                    </div>
                  </li>)}
              </ul>
              <button type="button" className="w-full border-t border-[#E2E8F0] py-2.5 text-center text-sm font-semibold text-[#0A4D8C] hover:bg-[#F8FAFC]">
                {t.viewAll}
              </button>
            </div>}
        </div>

        <div className="relative" ref={helpRef}>
          <button type="button" onClick={() => toggle('help')} title={t.help} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#334155] transition-colors hover:bg-[#F5F7FA]" aria-haspopup="true" aria-expanded={openMenu === 'help'}>
            
            <Icon name="help" className="text-[22px]" />
          </button>
          {openMenu === 'help' && <div className="absolute right-0 top-11 w-72 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xl">
              <div className="border-b border-[#E2E8F0] px-4 py-3 text-sm font-semibold text-[#1E293B]">{t.helpCenter}</div>
              <div className="flex flex-col py-1.5">
                {[{
              icon: 'menu_book',
              label: t.userGuide
            }, {
              icon: 'quiz',
              label: t.faq
            }, {
              icon: 'support_agent',
              label: t.contact
            }, {
              icon: 'flag',
              label: t.reportIssue
            }].map(it => <button key={it.label} type="button" className="flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#334155] hover:bg-[#F8FAFC]">
                    <Icon name={it.icon} className="text-[18px] text-[#0A4D8C]" />
                    {it.label}
                  </button>)}
              </div>
              <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-xs text-[#64748B]">
                {t.callCentre}: <span className="font-semibold text-[#1E293B]">09611-777111</span> · support@cbms.nbr.gov.bd
              </div>
            </div>}
        </div>

        <div className="relative pl-1" ref={profileRef}>
          <button type="button" onClick={() => toggle('profile')} className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-[#F5F7FA]" aria-haspopup="true" aria-expanded={openMenu === 'profile'}>
            
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A4D8C] text-xs font-bold text-white">
              AK
            </span>
            <span className="hidden flex-col items-start leading-tight lg:flex">
              <span className="text-[13px] font-semibold text-[#1E293B]">
                {language === 'en' ? 'Md. Abdul Karim' : 'মোঃ আব্দুল করিম'}
              </span>
              <span className="text-[11px] text-[#64748B]">{t.role}</span>
            </span>
            <Icon name="expand_more" className="hidden text-[18px] text-[#94A3B8] lg:block" />
          </button>
          {openMenu === 'profile' && <div className="absolute right-0 top-11 w-64 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xl">
              <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A4D8C] text-sm font-bold text-white">AK</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1E293B]">
                    {language === 'en' ? 'Md. Abdul Karim' : 'মোঃ আব্দুল করিম'}
                  </p>
                  <p className="truncate text-[11px] text-[#64748B]">{t.org2}</p>
                </div>
              </div>
              <div className="flex flex-col py-1.5">
                {[{
              icon: 'person',
              label: t.myProfile
            }, {
              icon: 'lock_reset',
              label: t.changePassword
            }, {
              icon: 'history',
              label: t.activityLog
            }].map(it => <button key={it.label} type="button" className="flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#334155] hover:bg-[#F8FAFC]">
                    <Icon name={it.icon} className="text-[18px] text-[#0A4D8C]" />
                    {it.label}
                  </button>)}
                <button type="button" className="flex items-center gap-3 border-t border-[#E2E8F0] px-4 py-2.5 text-left text-sm font-medium text-[#DC2626] hover:bg-red-50">
                  <Icon name="logout" className="text-[18px]" />
                  {t.signOut}
                </button>
              </div>
            </div>}
        </div>
      </div>
    </header>;
}