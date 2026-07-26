import { useMemo, useState } from 'react';
import { biWidgets, categoryLabels, dashboardTypeLabels, roleOptions, type ChartDistributionSlice, type DashboardType, type Role, type WidgetCategory } from './biData';
import { officerPool } from './upData';
type Language = 'en' | 'bn';
interface BusinessIntelligenceProps {
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
const inputClass = 'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const dashboardOrder: DashboardType[] = ['operational', 'tactical', 'strategic'];
const categoryOrder: WidgetCategory[] = ['performance', 'fraud', 'budget', 'financial', 'forecast', 'scorecard', 'strategic-planning', 'data-analysis'];
const trendMeta = {
  up: {
    icon: 'trending_up',
    color: '#00A86B'
  },
  down: {
    icon: 'trending_down',
    color: '#DC2626'
  },
  flat: {
    icon: 'trending_flat',
    color: '#64748B'
  }
} as const;
function Sparkline({
  data,
  color,
  chartId
}: {
  data: number[];
  color: string;
  chartId: string;
}) {
  const width = 220;
  const height = 56;
  const pad = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: pad + i / (data.length - 1) * (width - pad * 2),
    y: pad + (1 - (v - min) / range) * (height - pad * 2)
  }));
  let line = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    line += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`;
  }
  line += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  const area = `${line} L ${points[points.length - 1].x} ${height - pad} L ${points[0].x} ${height - pad} Z`;
  const gradientId = `bi-spark-${chartId}`;
  const last = points[points.length - 1];
  return <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-14 w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} stroke="none" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="3" fill={color} />
    </svg>;
}
function RadialGauge({
  percent,
  color
}: {
  percent: number;
  color: string;
}) {
  const size = 88;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{
      transition: 'stroke-dashoffset 0.6s ease'
    }} />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" style={{
      fontSize: '18px',
      fontWeight: 700,
      fill: '#1E293B'
    }}>{clamped}%</text>
    </svg>;
}
function MiniBarChart({
  data,
  color,
  language
}: {
  data: ChartDistributionSlice[];
  color: string;
  language: Language;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return <div className="flex items-end gap-1.5" style={{
    height: '76px'
  }}>
      {data.map((d, i) => <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] font-bold text-[#334155]">{d.value}</span>
          <div className="w-full rounded-t-md transition-all" style={{
        height: `${Math.max(4, d.value / max * 40)}px`,
        backgroundColor: color
      }} />
          <span className="line-clamp-2 text-center text-[9px] leading-tight text-[#64748B]">{language === 'en' ? d.labelEn : d.labelBn}</span>
        </div>)}
    </div>;
}
const taskHighlights = [{
  officer: officerPool[0],
  countEn: '4 tasks awaiting action',
  countBn: '৪টি কাজ পদক্ষেপের অপেক্ষায়',
  icon: 'pending_actions'
}, {
  officer: officerPool[1],
  countEn: '2 tasks nearing deadline',
  countBn: '২টি কাজের সময়সীমা ঘনিয়ে আসছে',
  icon: 'schedule'
}, {
  officer: officerPool[2],
  countEn: '6 tasks in progress',
  countBn: '৬টি কাজ চলমান',
  icon: 'sync'
}];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Business Intelligence',
    subtitle: 'Role-based, customizable BI dashboards — Operational, Tactical and Strategic — covering performance measurement, fraud detection, budgeting, financial drill-down, forecasting, score carding, strategic planning and data analysis.',
    backToDashboard: 'Back to Dashboard',
    viewingAs: 'Viewing dashboard as',
    exportPdf: 'Export PDF',
    exportHtml: 'Export HTML',
    exportedNotice: (fmt: string) => `Dashboard exported as ${fmt} (simulated — no file transferred).`,
    filterAll: 'All Categories',
    highlightsTitle: 'Highlighted Task Assignment',
    customize: 'Customize Dashboard',
    doneCustomizing: 'Done Customizing',
    hideWidget: 'Hide',
    hiddenNotice: (n: number) => `${n} widget${n === 1 ? '' : 's'} hidden on this dashboard.`,
    resetWidgets: 'Show All',
    noWidgets: 'No widgets match this dashboard type and category.',
    footerNote: 'Dashboards use ETL pipelines drawn from every CBMS module and are exportable as static PDF reports alongside the live web view, per role-based access.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'বিজনেস ইন্টেলিজেন্স',
    subtitle: 'ভূমিকা-ভিত্তিক, কাস্টমাইজযোগ্য বিআই ড্যাশবোর্ড — অপারেশনাল, ট্যাকটিক্যাল ও স্ট্র্যাটেজিক — কর্মক্ষমতা পরিমাপ, জালিয়াতি শনাক্তকরণ, বাজেট, আর্থিক বিস্তারিত বিশ্লেষণ, পূর্বাভাস, স্কোরকার্ডিং, কৌশলগত পরিকল্পনা ও তথ্য বিশ্লেষণ অন্তর্ভুক্ত।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    viewingAs: 'ড্যাশবোর্ড দেখা হচ্ছে',
    exportPdf: 'পিডিএফ রপ্তানি',
    exportHtml: 'এইচটিএমএল রপ্তানি',
    exportedNotice: (fmt: string) => `ড্যাশবোর্ড ${fmt} হিসেবে রপ্তানি হয়েছে (সিমুলেটেড — কোনো ফাইল স্থানান্তরিত হয়নি)।`,
    filterAll: 'সকল বিভাগ',
    highlightsTitle: 'হাইলাইটকৃত কাজ বরাদ্দ',
    customize: 'ড্যাশবোর্ড কাস্টমাইজ করুন',
    doneCustomizing: 'কাস্টমাইজেশন সম্পন্ন',
    hideWidget: 'লুকান',
    hiddenNotice: (n: number) => `এই ড্যাশবোর্ডে ${n}টি উইজেট লুকানো আছে।`,
    resetWidgets: 'সব দেখান',
    noWidgets: 'এই ড্যাশবোর্ড ধরন ও বিভাগের সাথে কোনো উইজেট মেলে না।',
    footerNote: 'ড্যাশবোর্ডগুলো প্রতিটি সিবিএমএস মডিউল থেকে ইটিএল পাইপলাইন ব্যবহার করে এবং ভূমিকা-ভিত্তিক অ্যাক্সেস অনুযায়ী লাইভ ওয়েব ভিউয়ের পাশাপাশি স্ট্যাটিক পিডিএফ প্রতিবেদন হিসেবে রপ্তানিযোগ্য।'
  }
};
type T = typeof T['en'];
export function BusinessIntelligence({
  language,
  onDone
}: BusinessIntelligenceProps) {
  const t = T[language];
  const [role, setRole] = useState<Role>('commissioner');
  const [dashboardType, setDashboardType] = useState<DashboardType>('strategic');
  const [categoryFilter, setCategoryFilter] = useState<'all' | WidgetCategory>('all');
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [customizing, setCustomizing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3800);
  };
  const handleRoleChange = (r: Role) => {
    setRole(r);
    const opt = roleOptions.find(o => o.id === r);
    if (opt) setDashboardType(opt.defaultDashboard);
  };
  const visibleWidgets = useMemo(() => biWidgets.filter(w => w.dashboards.includes(dashboardType) && (categoryFilter === 'all' || w.category === categoryFilter) && !hidden.has(w.id)), [dashboardType, categoryFilter, hidden]);
  const dtMeta = dashboardTypeLabels[dashboardType];
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

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-[#334155]">{t.viewingAs}</span>
          <select value={role} onChange={e => handleRoleChange(e.target.value as Role)} className={`${inputClass} w-auto min-w-[240px]`}>
            {roleOptions.map(r => <option key={r.id} value={r.id}>{r[language]}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => showToast(t.exportedNotice('PDF'))} className={ACTION_BTN_OUTLINE}>
            <Icon name="picture_as_pdf" className="text-[14px]" />
            {t.exportPdf}
          </button>
          <button type="button" onClick={() => showToast(t.exportedNotice('HTML'))} className={ACTION_BTN_OUTLINE}>
            <Icon name="html" className="text-[14px]" />
            {t.exportHtml}
          </button>
          <button type="button" onClick={() => setCustomizing(c => !c)} className={customizing ? 'inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white' : ACTION_BTN_OUTLINE}>
            <Icon name="tune" className="text-[14px]" />
            {customizing ? t.doneCustomizing : t.customize}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {dashboardOrder.map(dt => {
        const m = dashboardTypeLabels[dt];
        return <button key={dt} type="button" onClick={() => setDashboardType(dt)} className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${dashboardType === dt ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'}`}>
              <Icon name={m.icon} className="text-[15px]" />
              {m[language]}
            </button>;
      })}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3">
        <Icon name={dtMeta.icon} className="mt-0.5 text-[20px] text-[#0A4D8C]" />
        <p className="text-sm text-[#64748B]">{dtMeta[`desc${language === 'en' ? 'En' : 'Bn'}` as 'descEn' | 'descBn']}</p>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1E293B]">
          <Icon name="campaign" className="text-[18px] text-[#B45309]" />
          {t.highlightsTitle}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {taskHighlights.map((h, i) => <div key={i} className="flex items-center gap-3 rounded-lg bg-[#F5F7FA] p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name={h.icon} className="text-[18px]" />
              </span>
              <div>
                <p className="text-xs font-semibold text-[#1E293B]">{h.officer[language]}</p>
                <p className="text-[11px] text-[#64748B]">{language === 'en' ? h.countEn : h.countBn}</p>
              </div>
            </div>)}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setCategoryFilter('all')} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${categoryFilter === 'all' ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155]'}`}>{t.filterAll}</button>
          {categoryOrder.map(c => <button key={c} type="button" onClick={() => setCategoryFilter(c)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${categoryFilter === c ? 'bg-[#0A4D8C] text-white' : 'bg-[#F1F5F9] text-[#334155]'}`}>{categoryLabels[c][language]}</button>)}
        </div>
        {hidden.size > 0 && <button type="button" onClick={() => setHidden(new Set())} className="flex items-center gap-1 text-xs font-semibold text-[#1E88E5] hover:underline">
            <Icon name="visibility" className="text-[14px]" />
            {t.hiddenNotice(hidden.size)} · {t.resetWidgets}
          </button>}
      </div>

      {visibleWidgets.length === 0 ? <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center text-sm text-[#64748B]">{t.noWidgets}</p> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleWidgets.map(w => {
        const tr = trendMeta[w.trend];
        return <div key={w.id} className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-semibold text-[#334155]">{categoryLabels[w.category][language]}</span>
                  {customizing && <button type="button" onClick={() => setHidden(prev => new Set(prev).add(w.id))} className="rounded-full p-1 text-[#94A3B8] hover:bg-[#F5F7FA] hover:text-[#DC2626]" title={t.hideWidget}>
                      <Icon name="visibility_off" className="text-[16px]" />
                    </button>}
                </div>
                <p className="text-xs font-semibold text-[#334155]">{language === 'en' ? w.titleEn : w.titleBn}</p>
                <p className="text-2xl font-bold text-[#1E293B]">{w.value}</p>
                <span className="flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{
            backgroundColor: `${tr.color}1A`,
            color: tr.color
          }}>
                  <Icon name={tr.icon} className="text-[12px]" />
                  {language === 'en' ? w.trendLabelEn : w.trendLabelBn}
                </span>
                {w.chartType === 'sparkline' && w.series && <Sparkline data={w.series} color={tr.color} chartId={w.id} />}
                {w.chartType === 'radial' && typeof w.percent === 'number' && <div className="flex justify-center py-1">
                    <RadialGauge percent={w.percent} color={tr.color} />
                  </div>}
                {w.chartType === 'bar' && w.distribution && <MiniBarChart data={w.distribution} color={tr.color} language={language} />}
                <p className="text-[11px] leading-relaxed text-[#64748B]">{language === 'en' ? w.descEn : w.descBn}</p>
              </div>;
      })}
        </div>}

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">
        <Icon name="info" className="mr-1 align-text-bottom text-[14px] text-[#1E88E5]" />
        {t.footerNote}
      </p>
    </div>;
}
