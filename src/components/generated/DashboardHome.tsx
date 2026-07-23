type Language = 'en' | 'bn';
interface DashboardHomeProps {
  language: Language;
  onSelect: (id: string) => void;
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
const T = {
  en: {
    home: 'Home',
    dashboard: 'Dashboard',
    welcome: 'Welcome, Md. Abdul Karim',
    subtitle: 'Deputy Commissioner · Customs Bond Commissionerate, Dhaka',
    lastLogin: 'Last login: 23 Jul 2026, 09:14 AM from Dhaka',
    quickActions: 'Quick Actions',
    recentActivities: 'Recent Activities',
    pendingTasks: 'Pending Tasks',
    announcements: 'System Announcements',
    viewAll: 'View all',
    getStartedTitle: 'No module opened yet',
    getStartedBody: 'Select a service from the left-hand navigation menu to open a module. Frequently used services also appear as quick actions above.',
    browseMenu: 'Browse main menu'
  },
  bn: {
    home: 'হোম',
    dashboard: 'ড্যাশবোর্ড',
    welcome: 'স্বাগতম, মোঃ আব্দুল করিম',
    subtitle: 'উপ কমিশনার · কাস্টমস বন্ড কমিশনারেট, ঢাকা',
    lastLogin: 'সর্বশেষ লগইন: ২৩ জুলাই ২০২৬, সকাল ৯:১৪, ঢাকা থেকে',
    quickActions: 'দ্রুত কার্যক্রম',
    recentActivities: 'সাম্প্রতিক কার্যক্রম',
    pendingTasks: 'অমীমাংসিত কাজ',
    announcements: 'সিস্টেম ঘোষণা',
    viewAll: 'সব দেখুন',
    getStartedTitle: 'এখনও কোনো মডিউল খোলা হয়নি',
    getStartedBody: 'একটি মডিউল খুলতে বাম পাশের নেভিগেশন মেনু থেকে একটি সেবা নির্বাচন করুন। ঘন ঘন ব্যবহৃত সেবাসমূহ উপরে দ্রুত কার্যক্রম হিসেবেও দেখানো হয়েছে।',
    browseMenu: 'প্রধান মেনু ব্রাউজ করুন'
  }
};
const quickActions = [{
  id: 'new-bond-license',
  icon: 'note_add',
  en: 'New Bond License Application',
  bn: 'নতুন বন্ড লাইসেন্স আবেদন',
  sub: {
    en: 'Start a fresh licence application',
    bn: 'নতুন লাইসেন্স আবেদন শুরু করুন'
  }
}, {
  id: 'license-search',
  icon: 'manage_search',
  en: 'Search License Database',
  bn: 'লাইসেন্স ডেটাবেজ অনুসন্ধান',
  sub: {
    en: 'Find bonders and licences',
    bn: 'বন্ডকারী ও লাইসেন্স খুঁজুন'
  }
}, {
  id: 'ud-integration',
  icon: 'cloud_upload',
  en: 'Submit Utilization Declaration',
  bn: 'ইউটিলাইজেশন ডিক্লারেশন জমা দিন',
  sub: {
    en: 'Sync UD from BGMEA/BKMEA',
    bn: 'BGMEA/BKMEA থেকে ইউডি সিঙ্ক করুন'
  }
}, {
  id: 'e-passbook',
  icon: 'account_balance_wallet',
  en: 'Check e-Passbook Balance',
  bn: 'ই-পাসবুক ব্যালেন্স দেখুন',
  sub: {
    en: 'View import/export ledger',
    bn: 'আমদানি/রপ্তানি লেজার দেখুন'
  }
}];
const activities = [{
  icon: 'task_alt',
  tone: 'green',
  en: 'Bond License BL-2026-04521 approved for Square Fashions Ltd.',
  bn: 'স্কয়ার ফ্যাশনস লিমিটেডের বন্ড লাইসেন্স BL-2026-04521 অনুমোদিত হয়েছে।',
  time: {
    en: '2 hours ago',
    bn: '২ ঘণ্টা আগে'
  }
}, {
  icon: 'cloud_done',
  tone: 'blue',
  en: 'UD submitted for Beximco Textiles Limited (UD No. UD-88342).',
  bn: 'বেক্সিমকো টেক্সটাইলস লিমিটেডের জন্য ইউডি জমা হয়েছে (UD No. UD-88342)।',
  time: {
    en: '4 hours ago',
    bn: '৪ ঘণ্টা আগে'
  }
}, {
  icon: 'inventory_2',
  tone: 'blue',
  en: 'e-Passbook import entry recorded — BIN 004562178-0206, HS 5208.12.00.',
  bn: 'ই-পাসবুক আমদানি এন্ট্রি রেকর্ড হয়েছে — BIN 004562178-0206, HS 5208.12.00।',
  time: {
    en: 'Yesterday, 6:12 PM',
    bn: 'গতকাল, সন্ধ্যা ৬:১২'
  }
}, {
  icon: 'account_balance',
  tone: 'green',
  en: 'Lien Bank verification completed by Sonali Bank, Motijheel Corporate Branch.',
  bn: 'সোনালী ব্যাংক, মতিঝিল কর্পোরেট শাখা কর্তৃক লিয়েন ব্যাংক যাচাই সম্পন্ন হয়েছে।',
  time: {
    en: 'Yesterday, 3:45 PM',
    bn: 'গতকাল, বিকাল ৩:৪৫'
  }
}, {
  icon: 'fact_check',
  tone: 'amber',
  en: 'Annual audit report submitted for Envoy Textiles Ltd.',
  bn: 'এনভয় টেক্সটাইলস লিমিটেডের বার্ষিক নিরীক্ষা প্রতিবেদন জমা হয়েছে।',
  time: {
    en: '2 days ago',
    bn: '২ দিন আগে'
  }
}];
const activityTone: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-[#0A4D8C]',
  amber: 'bg-amber-50 text-amber-600'
};
const tasks = [{
  en: '3 Bond License applications awaiting document verification.',
  bn: '৩টি বন্ড লাইসেন্স আবেদন নথি যাচাইয়ের অপেক্ষায় রয়েছে।',
  priority: {
    en: 'High',
    bn: 'উচ্চ'
  },
  tone: 'amber',
  due: {
    en: 'Due 24 Jul 2026',
    bn: 'শেষ তারিখ ২৪ জুলাই ২০২৬'
  }
}, {
  en: 'Annual audit overdue — DBL Group (Licence BL-2019-01187).',
  bn: 'বার্ষিক নিরীক্ষা বকেয়া — ডিবিএল গ্রুপ (লাইসেন্স BL-2019-01187)।',
  priority: {
    en: 'Critical',
    bn: 'জরুরি'
  },
  tone: 'red',
  due: {
    en: 'Due 20 Jul 2026',
    bn: 'শেষ তারিখ ২০ জুলাই ২০২৬'
  }
}, {
  en: 'UP application pending Lien Bank confirmation — Ha-Meem Group.',
  bn: 'ইউপি আবেদন লিয়েন ব্যাংক নিশ্চিতকরণের অপেক্ষায় — হা-মীম গ্রুপ।',
  priority: {
    en: 'Medium',
    bn: 'মধ্যম'
  },
  tone: 'blue',
  due: {
    en: 'Due 28 Jul 2026',
    bn: 'শেষ তারিখ ২৮ জুলাই ২০২৬'
  }
}, {
  en: 'HS Code inclusion request pending Commissioner approval.',
  bn: 'এইচএস কোড অন্তর্ভুক্তির অনুরোধ কমিশনারের অনুমোদনের অপেক্ষায়।',
  priority: {
    en: 'Medium',
    bn: 'মধ্যম'
  },
  tone: 'blue',
  due: {
    en: 'Due 30 Jul 2026',
    bn: 'শেষ তারিখ ৩০ জুলাই ২০২৬'
  }
}];
const taskTone: Record<string, string> = {
  red: 'bg-red-50 text-red-700 border border-red-100',
  amber: 'bg-amber-50 text-amber-700 border border-amber-100',
  blue: 'bg-blue-50 text-[#0A4D8C] border border-blue-100'
};
const announcements = [{
  icon: 'build',
  en: 'Scheduled maintenance: CBMS will be unavailable 26 Jul 2026, 12:00 AM – 4:00 AM for a system upgrade.',
  bn: 'নির্ধারিত রক্ষণাবেক্ষণ: সিস্টেম আপগ্রেডের জন্য ২৬ জুলাই ২০২৬, রাত ১২:০০ – ৪:০০ পর্যন্ত সিবিএমএস বন্ধ থাকবে।',
  date: {
    en: 'Posted 22 Jul 2026',
    bn: 'পোস্ট করা হয়েছে ২২ জুলাই ২০২৬'
  }
}, {
  icon: 'gavel',
  en: 'New Circular No. NBR/Cus/Bond/2026/17 issued regarding the revised HS Code verification process.',
  bn: 'সংশোধিত এইচএস কোড যাচাইকরণ প্রক্রিয়া সংক্রান্ত নতুন সার্কুলার নং NBR/Cus/Bond/2026/17 জারি করা হয়েছে।',
  date: {
    en: 'Posted 20 Jul 2026',
    bn: 'পোস্ট করা হয়েছে ২০ জুলাই ২০২৬'
  }
}, {
  icon: 'sync_problem',
  en: 'ASYCUDA World integration will undergo maintenance on 25 Jul 2026; import/export data sync may be delayed.',
  bn: 'ASYCUDA World ইন্টিগ্রেশন ২৫ জুলাই ২০২৬ তারিখে রক্ষণাবেক্ষণের আওতায় থাকবে; আমদানি/রপ্তানি তথ্য সিঙ্ক বিলম্বিত হতে পারে।',
  date: {
    en: 'Posted 19 Jul 2026',
    bn: 'পোস্ট করা হয়েছে ১৯ জুলাই ২০২৬'
  }
}];
export function DashboardHome({
  language,
  onSelect
}: DashboardHomeProps) {
  const t = T[language];
  return <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#64748B]">
        <Icon name="home" className="text-[16px]" />
        <span>{t.home}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.dashboard}</span>
      </nav>

      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-gradient-to-r from-[#0A4D8C] to-[#0E5FAE] p-6 text-white sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.welcome}</h1>
          <p className="mt-1 text-sm text-white/85">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-medium text-white/90">
          <Icon name="schedule" className="text-[16px]" />
          {t.lastLogin}
        </div>
      </div>

      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="mb-3 text-sm font-bold uppercase tracking-wide text-[#334155]">
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(a => <button key={a.id} type="button" onClick={() => onSelect(a.id)} className="group flex flex-col items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1E88E5] hover:shadow-md">
            
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C] transition-colors group-hover:bg-[#0A4D8C] group-hover:text-white">
                <Icon name={a.icon} className="text-[22px]" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1E293B]">{a[language]}</p>
                <p className="mt-0.5 text-xs text-[#64748B]">{a.sub[language]}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-[#1E88E5] opacity-0 transition-opacity group-hover:opacity-100">
                {language === 'en' ? 'Open' : 'খুলুন'}
                <Icon name="arrow_forward" className="text-[14px]" />
              </span>
            </button>)}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="recent-activities-heading" className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5">
            <h2 id="recent-activities-heading" className="text-sm font-bold text-[#1E293B]">{t.recentActivities}</h2>
            <button type="button" className="text-xs font-semibold text-[#0A4D8C] hover:underline">{t.viewAll}</button>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {activities.map((a, i) => <li key={i} className="flex gap-3 px-5 py-3">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activityTone[a.tone]}`}>
                  <Icon name={a.icon} className="text-[17px]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] leading-snug text-[#334155]">{a[language]}</p>
                  <span className="text-[11px] text-[#94A3B8]">{a.time[language]}</span>
                </div>
              </li>)}
          </ul>
        </section>

        <section aria-labelledby="pending-tasks-heading" className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5">
            <h2 id="pending-tasks-heading" className="text-sm font-bold text-[#1E293B]">{t.pendingTasks}</h2>
            <button type="button" className="text-xs font-semibold text-[#0A4D8C] hover:underline">{t.viewAll}</button>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {tasks.map((task, i) => <li key={i} className="flex flex-col gap-2 px-5 py-3">
                <p className="text-[13px] leading-snug text-[#334155]">{task[language]}</p>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${taskTone[task.tone]}`}>
                    {task.priority[language]}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">{task.due[language]}</span>
                </div>
              </li>)}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="announcements-heading" className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5">
            <h2 id="announcements-heading" className="text-sm font-bold text-[#1E293B]">{t.announcements}</h2>
            <button type="button" className="text-xs font-semibold text-[#0A4D8C] hover:underline">{t.viewAll}</button>
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {announcements.map((a, i) => <li key={i} className="flex gap-3 px-5 py-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name={a.icon} className="text-[17px]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] leading-snug text-[#334155]">{a[language]}</p>
                  <span className="text-[11px] text-[#94A3B8]">{a.date[language]}</span>
                </div>
              </li>)}
          </ul>
        </section>

        <section aria-labelledby="empty-state-heading" className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 py-8 text-center shadow-sm">
          
          <svg viewBox="0 0 160 120" className="h-28 w-36" aria-hidden="true">
            <rect x="20" y="30" width="120" height="78" rx="8" fill="#EEF2F6" />
            <rect x="20" y="30" width="120" height="20" rx="8" fill="#DCE7F5" />
            <circle cx="32" cy="40" r="3" fill="#94A3B8" />
            <circle cx="42" cy="40" r="3" fill="#94A3B8" />
            <rect x="36" y="8" width="88" height="30" rx="6" fill="#0A4D8C" opacity="0.08" />
            <rect x="48" y="60" width="64" height="8" rx="4" fill="#CBD5E1" />
            <rect x="48" y="76" width="44" height="8" rx="4" fill="#E2E8F0" />
            <circle cx="112" cy="92" r="16" fill="#00A86B" opacity="0.12" />
            <path d="M105 92l5 5 9-10" stroke="#00A86B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 id="empty-state-heading" className="text-sm font-bold text-[#1E293B]">{t.getStartedTitle}</h2>
          <p className="max-w-xs text-xs leading-relaxed text-[#64748B]">{t.getStartedBody}</p>
          <button type="button" onClick={() => onSelect('cbc-portal')} className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#083E71]">
            
            <Icon name="menu_open" className="text-[16px]" />
            {t.browseMenu}
          </button>
        </section>
      </div>
    </div>;
}