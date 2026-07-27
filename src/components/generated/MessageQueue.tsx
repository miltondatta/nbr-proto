import { useMemo, useState } from 'react';
import { queueLogSeed, queueTopics, statusMeta, type BalancingMode, type QueueLogEntry, type QueueTopic } from './messageQueueData';
type Language = 'en' | 'bn';
interface MessageQueueProps {
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
const balancingOptions: BalancingMode[] = ['Round Robin', 'Least Connections'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Message Queue',
    subtitle: 'Event-driven, message-oriented middleware backing inter-module communication across CBMS — also usable as a load balancer between producer and consumer modules.',
    statTopics: 'Queue Topics',
    statRunning: 'Running',
    statDepth: 'Total Queued',
    statDlq: 'Dead-Letter Messages',
    topicsTitle: 'Topics',
    producer: 'Producer',
    consumers: 'Consumers',
    depth: 'Queue depth',
    throughput: 'Throughput/min',
    avgProcessing: 'Avg. processing',
    dlq: 'Dead-letter',
    lastMessage: 'Last message',
    balancingMode: 'Load balancing mode',
    pause: 'Pause',
    resume: 'Resume',
    publishTest: 'Publish Test Message',
    requeueDlq: 'Requeue Dead-Letter',
    pausedNotice: 'Topic paused.',
    resumedNotice: 'Topic resumed.',
    publishedNotice: 'Test message published and processed.',
    requeuedNotice: 'Dead-letter messages requeued for processing.',
    noDlq: 'No dead-letter messages to requeue.',
    logTitle: 'Message Queue Log',
    footerNote: 'Each topic decouples a producer module from its consumers, so new modules can subscribe without customizing the producer. The load balancing mode controls how messages are distributed across consumer instances; dead-letter messages are held here for review rather than silently dropped.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'মেসেজ কিউ',
    subtitle: 'সিবিএমএস জুড়ে আন্তঃমডিউল যোগাযোগ সমর্থনকারী ইভেন্ট-চালিত, মেসেজ-ওরিয়েন্টেড মিডলওয়্যার — প্রোডিউসার ও কনজিউমার মডিউলের মধ্যে লোড ব্যালেন্সার হিসাবেও ব্যবহারযোগ্য।',
    statTopics: 'কিউ টপিক',
    statRunning: 'চলমান',
    statDepth: 'মোট কিউতে',
    statDlq: 'ডেড-লেটার বার্তা',
    topicsTitle: 'টপিক',
    producer: 'প্রোডিউসার',
    consumers: 'কনজিউমার',
    depth: 'কিউ গভীরতা',
    throughput: 'থ্রুপুট/মিনিট',
    avgProcessing: 'গড় প্রসেসিং',
    dlq: 'ডেড-লেটার',
    lastMessage: 'সর্বশেষ বার্তা',
    balancingMode: 'লোড ব্যালেন্সিং মোড',
    pause: 'স্থগিত করুন',
    resume: 'পুনরায় শুরু করুন',
    publishTest: 'টেস্ট বার্তা প্রকাশ করুন',
    requeueDlq: 'ডেড-লেটার পুনরায় সারিবদ্ধ করুন',
    pausedNotice: 'টপিক স্থগিত করা হয়েছে।',
    resumedNotice: 'টপিক পুনরায় শুরু হয়েছে।',
    publishedNotice: 'টেস্ট বার্তা প্রকাশিত ও প্রক্রিয়াকৃত হয়েছে।',
    requeuedNotice: 'ডেড-লেটার বার্তা প্রসেসিংয়ের জন্য পুনরায় সারিবদ্ধ হয়েছে।',
    noDlq: 'পুনরায় সারিবদ্ধ করার মতো কোনো ডেড-লেটার বার্তা নেই।',
    logTitle: 'মেসেজ কিউ লগ',
    footerNote: 'প্রতিটি টপিক একটি প্রোডিউসার মডিউলকে তার কনজিউমারদের থেকে পৃথক রাখে, যাতে প্রোডিউসার কাস্টমাইজ না করেই নতুন মডিউল সাবস্ক্রাইব করতে পারে। লোড ব্যালেন্সিং মোড নিয়ন্ত্রণ করে কনজিউমার ইনস্ট্যান্স জুড়ে বার্তা কীভাবে বণ্টিত হয়; ডেড-লেটার বার্তাগুলো নিঃশব্দে বাতিল না করে এখানে পর্যালোচনার জন্য রাখা হয়।'
  }
};
type T = typeof T['en'];
function TopicCard({
  topic,
  language,
  t,
  onToggle,
  onPublish,
  onRequeue,
  onBalancingChange
}: {
  topic: QueueTopic;
  language: Language;
  t: T;
  onToggle: (id: string) => void;
  onPublish: (id: string) => void;
  onRequeue: (id: string) => void;
  onBalancingChange: (id: string, mode: BalancingMode) => void;
}) {
  const meta = statusMeta[topic.status];
  return <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
            <Icon name={topic.icon} className="text-[22px]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? topic.en : topic.bn}</h3>
            <p className="font-mono text-[11px] text-[#94A3B8]">{topic.topicName}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{
        backgroundColor: `${meta.color}1A`,
        color: meta.color
      }}>
          <Icon name={meta.icon} className="text-[13px]" />
          {meta[language]}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#64748B]">
        <span className="rounded-full bg-[#F5F7FA] px-2 py-1 font-semibold text-[#0A4D8C]">{t.producer}: {language === 'en' ? topic.producerModuleEn : topic.producerModuleBn}</span>
        <Icon name="arrow_forward" className="text-[14px]" />
        {(language === 'en' ? topic.consumerModulesEn : topic.consumerModulesBn).map(c => <span key={c} className="rounded-full bg-[#F5F7FA] px-2 py-1">{c}</span>)}
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-[11px] sm:grid-cols-4">
        <div className="rounded-lg bg-[#F8FAFC] py-2">
          <p className="font-bold text-[#1E293B]">{topic.depth}</p>
          <p className="text-[#94A3B8]">{t.depth}</p>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] py-2">
          <p className="font-bold text-[#1E293B]">{topic.throughputPerMin}</p>
          <p className="text-[#94A3B8]">{t.throughput}</p>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] py-2">
          <p className="font-bold text-[#1E293B]">{topic.avgProcessingMs}ms</p>
          <p className="text-[#94A3B8]">{t.avgProcessing}</p>
        </div>
        <div className={`rounded-lg py-2 ${topic.dlqCount > 0 ? 'bg-red-50' : 'bg-[#F8FAFC]'}`}>
          <p className={`font-bold ${topic.dlqCount > 0 ? 'text-[#DC2626]' : 'text-[#1E293B]'}`}>{topic.dlqCount}</p>
          <p className={topic.dlqCount > 0 ? 'text-[#DC2626]' : 'text-[#94A3B8]'}>{t.dlq}</p>
        </div>
      </div>

      <label className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#334155]">
        {t.balancingMode}
        <select value={topic.balancingMode} onChange={e => onBalancingChange(topic.id, e.target.value as BalancingMode)} className="rounded-md border border-[#CBD5E1] px-2 py-1 text-[11px] outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20">
          {balancingOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>

      <p className="text-[10px] text-[#94A3B8]">{t.lastMessage}: {topic.lastMessageAt}</p>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onToggle(topic.id)} className={topic.status === 'paused' ? ACTION_BTN_GREEN : ACTION_BTN_OUTLINE}>
          <Icon name={topic.status === 'paused' ? 'play_arrow' : 'pause'} className="text-[13px]" />
          {topic.status === 'paused' ? t.resume : t.pause}
        </button>
        <button type="button" onClick={() => onPublish(topic.id)} className={ACTION_BTN}>
          <Icon name="send" className="text-[13px]" />
          {t.publishTest}
        </button>
        {topic.dlqCount > 0 && <button type="button" onClick={() => onRequeue(topic.id)} className={ACTION_BTN_RED}>
            <Icon name="restart_alt" className="text-[13px]" />
            {t.requeueDlq}
          </button>}
      </div>
    </div>;
}
export function MessageQueue({
  language,
  onDone
}: MessageQueueProps) {
  const t = T[language];
  const [topics, setTopics] = useState<QueueTopic[]>(queueTopics);
  const [log, setLog] = useState<QueueLogEntry[]>(queueLogSeed);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3600);
  };
  const pushLog = (en: string, bn: string, kind: QueueLogEntry['kind']) => {
    setLog(prev => [{
      id: `ql-${Date.now()}`,
      timestamp: '27 Jul 2026, 09:46',
      en,
      bn,
      kind
    }, ...prev]);
  };
  const stats = useMemo(() => ({
    running: topics.filter(t2 => t2.status === 'running').length,
    depth: topics.reduce((sum, t2) => sum + t2.depth, 0),
    dlq: topics.reduce((sum, t2) => sum + t2.dlqCount, 0)
  }), [topics]);
  const handleToggle = (id: string) => {
    setTopics(prev => prev.map(tp => {
      if (tp.id !== id) return tp;
      const nextStatus = tp.status === 'paused' ? 'running' : 'paused';
      pushLog(`${tp.en} — topic ${nextStatus === 'paused' ? 'paused' : 'resumed'} by System Admin.`, `${tp.bn} — টপিক সিস্টেম অ্যাডমিন দ্বারা ${nextStatus === 'paused' ? 'স্থগিত' : 'পুনরায় শুরু'} করা হয়েছে।`, 'info');
      return {
        ...tp,
        status: nextStatus,
        throughputPerMin: nextStatus === 'paused' ? 0 : tp.throughputPerMin
      };
    }));
    const target = topics.find(tp => tp.id === id);
    showToast(target?.status === 'paused' ? t.resumedNotice : t.pausedNotice);
  };
  const handlePublish = (id: string) => {
    setTopics(prev => prev.map(tp => tp.id === id ? {
      ...tp,
      lastMessageAt: '27 Jul 2026, 09:46',
      throughputPerMin: tp.status === 'running' ? tp.throughputPerMin + 1 : tp.throughputPerMin
    } : tp));
    const target = topics.find(tp => tp.id === id);
    if (target) pushLog(`${target.en} — test message published and delivered to ${target.consumerModulesEn.length} consumer(s).`, `${target.bn} — টেস্ট বার্তা প্রকাশিত ও ${target.consumerModulesEn.length}টি কনজিউমারে বিতরণ করা হয়েছে।`, 'info');
    showToast(t.publishedNotice);
  };
  const handleRequeue = (id: string) => {
    const target = topics.find(tp => tp.id === id);
    if (!target || target.dlqCount === 0) {
      showToast(t.noDlq);
      return;
    }
    setTopics(prev => prev.map(tp => tp.id === id ? {
      ...tp,
      dlqCount: 0,
      depth: tp.depth + target.dlqCount
    } : tp));
    pushLog(`${target.en} — ${target.dlqCount} dead-letter message(s) requeued for reprocessing.`, `${target.bn} — ${target.dlqCount}টি ডেড-লেটার বার্তা পুনরায় প্রক্রিয়াকরণের জন্য সারিবদ্ধ করা হয়েছে।`, 'info');
    showToast(t.requeuedNotice);
  };
  const handleBalancingChange = (id: string, mode: BalancingMode) => {
    setTopics(prev => prev.map(tp => tp.id === id ? {
      ...tp,
      balancingMode: mode
    } : tp));
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

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="queue" label={t.statTopics} value={topics.length} color="#0A4D8C" />
        <StatCard icon="play_circle" label={t.statRunning} value={stats.running} color="#00A86B" />
        <StatCard icon="stacked_line_chart" label={t.statDepth} value={stats.depth} color="#1E88E5" />
        <StatCard icon="report" label={t.statDlq} value={stats.dlq} color="#DC2626" />
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-[#334155]">{t.topicsTitle}</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {topics.map(tp => <TopicCard key={tp.id} topic={tp} language={language} t={t} onToggle={handleToggle} onPublish={handlePublish} onRequeue={handleRequeue} onBalancingChange={handleBalancingChange} />)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-[#334155]">{t.logTitle}</p>
        {log.map(entry => <div key={entry.id} className="flex items-start gap-2.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3 text-xs shadow-sm">
            <Icon name={entry.kind === 'error' ? 'error' : 'info'} className={`mt-0.5 shrink-0 text-[14px] ${entry.kind === 'error' ? 'text-[#DC2626]' : 'text-[#1E88E5]'}`} />
            <div>
              <p className="text-[#334155]">{language === 'en' ? entry.en : entry.bn}</p>
              <p className="mt-0.5 text-[10px] text-[#94A3B8]">{entry.timestamp}</p>
            </div>
          </div>)}
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">{t.footerNote}</p>
    </div>;
}