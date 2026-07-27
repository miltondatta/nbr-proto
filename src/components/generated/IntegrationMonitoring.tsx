import { useMemo, useState } from 'react';
import { connectionLogSeed, integrationConnections, statusMeta, type AuthType, type ConnectionLogEntry, type IntegrationConnection } from './integrationMonitoringData';
type Language = 'en' | 'bn';
interface IntegrationMonitoringProps {
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
const ACTION_BTN_OUTLINE = 'inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]';
const authTypeOptions: AuthType[] = ['API Key', 'OAuth 2.0', 'Basic Auth', 'Access Token'];
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Integration Monitoring',
    subtitle: 'Third-party integration monitoring platform — track connection health, configure connectivity attributes and test each integration on demand.',
    statTotal: 'Integrations',
    statConnected: 'Connected',
    statAttention: 'Need Attention',
    statUptime: 'Avg. Uptime',
    listTitle: 'Integrated Connections',
    relatedModule: 'Used by',
    latency: 'Latency',
    uptime: 'Uptime',
    lastChecked: 'Last checked',
    testConnection: 'Test Connection',
    testing: 'Testing…',
    testOk: 'Connection OK',
    testFault: 'Connection faulty',
    configure: 'Configure',
    connectivityTitle: 'Connectivity Attributes',
    urlLabel: 'Endpoint URL',
    usernameLabel: 'User Name',
    passwordLabel: 'Password / Secret',
    authTypeLabel: 'Auth Type',
    sampleFormatTitle: 'Sample Data Format (JSON)',
    sampleRequest: 'Request',
    sampleResponse: 'Response',
    lastIncident: 'Last Incident',
    saveConfig: 'Save Configuration',
    close: 'Close',
    savedNotice: 'Connectivity attributes updated.',
    logTitle: 'Recent Check Log',
    modalTitleFor: 'Configure',
    footerNote: 'Every integration listed here can be individually tested by pressing “Test Connection” — a meaningful exception message is shown whenever a check fails, and the dashboard summary above rolls up the current connection status across all integrations.'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'ইন্টিগ্রেশন মনিটরিং',
    subtitle: 'তৃতীয় পক্ষের ইন্টিগ্রেশন মনিটরিং প্ল্যাটফর্ম — সংযোগের স্বাস্থ্য ট্র্যাক করুন, কানেক্টিভিটি অ্যাট্রিবিউট কনফিগার করুন এবং প্রয়োজনে প্রতিটি ইন্টিগ্রেশন পরীক্ষা করুন।',
    statTotal: 'ইন্টিগ্রেশন',
    statConnected: 'সংযুক্ত',
    statAttention: 'মনোযোগ প্রয়োজন',
    statUptime: 'গড় আপটাইম',
    listTitle: 'সংযুক্ত সংযোগসমূহ',
    relatedModule: 'ব্যবহৃত হয়',
    latency: 'লেটেন্সি',
    uptime: 'আপটাইম',
    lastChecked: 'সর্বশেষ পরীক্ষিত',
    testConnection: 'সংযোগ পরীক্ষা করুন',
    testing: 'পরীক্ষা চলছে…',
    testOk: 'সংযোগ ঠিক আছে',
    testFault: 'সংযোগ ত্রুটিপূর্ণ',
    configure: 'কনফিগার করুন',
    connectivityTitle: 'কানেক্টিভিটি অ্যাট্রিবিউট',
    urlLabel: 'এন্ডপয়েন্ট ইউআরএল',
    usernameLabel: 'ব্যবহারকারীর নাম',
    passwordLabel: 'পাসওয়ার্ড / সিক্রেট',
    authTypeLabel: 'অথ টাইপ',
    sampleFormatTitle: 'নমুনা ডেটা ফরম্যাট (JSON)',
    sampleRequest: 'রিকোয়েস্ট',
    sampleResponse: 'রেসপন্স',
    lastIncident: 'সর্বশেষ ঘটনা',
    saveConfig: 'কনফিগারেশন সংরক্ষণ করুন',
    close: 'বন্ধ করুন',
    savedNotice: 'কানেক্টিভিটি অ্যাট্রিবিউট হালনাগাদ হয়েছে।',
    logTitle: 'সাম্প্রতিক পরীক্ষার লগ',
    modalTitleFor: 'কনফিগার করুন',
    footerNote: 'এখানে তালিকাভুক্ত প্রতিটি ইন্টিগ্রেশন "সংযোগ পরীক্ষা করুন" চেপে পৃথকভাবে পরীক্ষা করা যায় — কোনো চেক ব্যর্থ হলে একটি অর্থবহ ব্যতিক্রম বার্তা দেখানো হয়, এবং উপরের ড্যাশবোর্ড সারসংক্ষেপ সব ইন্টিগ্রেশন জুড়ে বর্তমান সংযোগ অবস্থা একত্রিত করে।'
  }
};
type T = typeof T['en'];
function ConfigureModal({
  connection,
  language,
  t,
  onClose,
  onSave
}: {
  connection: IntegrationConnection;
  language: Language;
  t: T;
  onClose: () => void;
  onSave: (id: string, patch: Partial<IntegrationConnection>) => void;
}) {
  const [url, setUrl] = useState(connection.url);
  const [username, setUsername] = useState(connection.username);
  const [password, setPassword] = useState('••••••••••••');
  const [authType, setAuthType] = useState<AuthType>(connection.authType);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-base font-bold text-[#1E293B]">{t.modalTitleFor}: {language === 'en' ? connection.en : connection.bn}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#94A3B8]">{t.connectivityTitle}</p>
          <Field label={t.urlLabel}>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t.usernameLabel}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t.passwordLabel}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t.authTypeLabel}>
            <select value={authType} onChange={e => setAuthType(e.target.value as AuthType)} className={inputClass}>
              {authTypeOptions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
          <button type="button" onClick={onClose} className={ACTION_BTN_OUTLINE}>{t.close}</button>
          <button type="button" onClick={() => {
          onSave(connection.id, {
            url,
            username,
            authType
          });
        }} className={ACTION_BTN_GREEN}>
            <Icon name="save" className="text-[14px]" />
            {t.saveConfig}
          </button>
        </div>
      </div>
    </div>;
}
function ConnectionCard({
  connection,
  language,
  t,
  onTest,
  onConfigure,
  testingId
}: {
  connection: IntegrationConnection;
  language: Language;
  t: T;
  onTest: (id: string) => void;
  onConfigure: (connection: IntegrationConnection) => void;
  testingId: string | null;
}) {
  const meta = statusMeta[connection.status];
  const isTesting = testingId === connection.id;
  return <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
            <Icon name={connection.icon} className="text-[22px]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#1E293B]">{language === 'en' ? connection.en : connection.bn}</h3>
            <p className="text-[11px] text-[#64748B]">{t.relatedModule}: {language === 'en' ? connection.relatedModuleEn : connection.relatedModuleBn}</p>
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
      <p className="text-xs leading-relaxed text-[#64748B]">{language === 'en' ? connection.descriptionEn : connection.descriptionBn}</p>
      {connection.lastIncidentEn && <p className="flex items-start gap-1.5 rounded-lg bg-red-50 px-2.5 py-2 text-[11px] text-[#B91C1C]">
          <Icon name="error" className="mt-0.5 shrink-0 text-[13px]" />
          <span>{language === 'en' ? connection.lastIncidentEn : connection.lastIncidentBn}</span>
        </p>}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-lg bg-[#F8FAFC] py-2">
          <p className="font-bold text-[#1E293B]">{connection.latencyMs}ms</p>
          <p className="text-[#94A3B8]">{t.latency}</p>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] py-2">
          <p className="font-bold text-[#1E293B]">{connection.uptimePercent}%</p>
          <p className="text-[#94A3B8]">{t.uptime}</p>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] py-2">
          <p className="font-bold text-[#1E293B]">{connection.authType}</p>
          <p className="text-[#94A3B8]">{t.authTypeLabel}</p>
        </div>
      </div>
      <p className="text-[10px] text-[#94A3B8]">{t.lastChecked}: {connection.lastChecked}</p>
      <div className="flex gap-2">
        <button type="button" disabled={isTesting} onClick={() => onTest(connection.id)} className={`${ACTION_BTN} flex-1 justify-center disabled:cursor-wait disabled:opacity-60`}>
          <Icon name={isTesting ? 'sync' : 'bolt'} className={`text-[14px] ${isTesting ? 'animate-spin' : ''}`} />
          {isTesting ? t.testing : t.testConnection}
        </button>
        <button type="button" onClick={() => onConfigure(connection)} className={ACTION_BTN_OUTLINE}>
          <Icon name="settings" className="text-[14px]" />
          {t.configure}
        </button>
      </div>
    </div>;
}
export function IntegrationMonitoring({
  language,
  onDone
}: IntegrationMonitoringProps) {
  const t = T[language];
  const [connections, setConnections] = useState<IntegrationConnection[]>(integrationConnections);
  const [log, setLog] = useState<ConnectionLogEntry[]>(connectionLogSeed);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [configureTarget, setConfigureTarget] = useState<IntegrationConnection | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3600);
  };
  const stats = useMemo(() => {
    const connected = connections.filter(c => c.status === 'connected').length;
    const attention = connections.filter(c => c.status !== 'connected').length;
    const avgUptime = connections.reduce((sum, c) => sum + c.uptimePercent, 0) / connections.length;
    return {
      connected,
      attention,
      avgUptime: avgUptime.toFixed(1)
    };
  }, [connections]);
  const handleTest = (id: string) => {
    const connection = connections.find(c => c.id === id);
    if (!connection) return;
    setTestingId(id);
    window.setTimeout(() => {
      const ok = connection.status !== 'down';
      const timestamp = '27 Jul 2026, 09:45';
      setConnections(prev => prev.map(c => c.id === id ? {
        ...c,
        status: ok ? 'connected' : 'down',
        lastChecked: timestamp,
        latencyMs: ok ? Math.max(80, Math.round(c.latencyMs * 0.6)) : c.latencyMs
      } : c));
      setLog(prev => [{
        id: `log-${Date.now()}`,
        timestamp,
        en: `${connection.en} — ${ok ? 'health check passed.' : 'connection still refused, needs admin attention.'}`,
        bn: `${connection.bn} — ${ok ? 'হেলথ চেক সফল হয়েছে।' : 'সংযোগ এখনও প্রত্যাখ্যাত, প্রশাসকের মনোযোগ প্রয়োজন।'}`,
        result: ok ? 'ok' : 'fault'
      }, ...prev]);
      setTestingId(null);
      showToast(ok ? t.testOk : t.testFault);
    }, 1400);
  };
  const handleSaveConfig = (id: string, patch: Partial<IntegrationConnection>) => {
    setConnections(prev => prev.map(c => c.id === id ? {
      ...c,
      ...patch
    } : c));
    setConfigureTarget(null);
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

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon="cable" label={t.statTotal} value={connections.length} color="#0A4D8C" />
        <StatCard icon="check_circle" label={t.statConnected} value={stats.connected} color="#00A86B" />
        <StatCard icon="warning" label={t.statAttention} value={stats.attention} color="#DC2626" />
        <StatCard icon="monitoring" label={t.statUptime} value={`${stats.avgUptime}%`} color="#1E88E5" />
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-[#334155]">{t.listTitle}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {connections.map(c => <ConnectionCard key={c.id} connection={c} language={language} t={t} onTest={handleTest} onConfigure={setConfigureTarget} testingId={testingId} />)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-[#334155]">{t.logTitle}</p>
        {log.map(entry => <div key={entry.id} className="flex items-start gap-2.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3 text-xs shadow-sm">
            <Icon name={entry.result === 'ok' ? 'check_circle' : 'error'} className={`mt-0.5 shrink-0 text-[14px] ${entry.result === 'ok' ? 'text-[#00A86B]' : 'text-[#DC2626]'}`} />
            <div>
              <p className="text-[#334155]">{language === 'en' ? entry.en : entry.bn}</p>
              <p className="mt-0.5 text-[10px] text-[#94A3B8]">{entry.timestamp}</p>
            </div>
          </div>)}
      </div>

      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">{t.footerNote}</p>

      {configureTarget && <ConfigureModal connection={configureTarget} language={language} t={t} onClose={() => setConfigureTarget(null)} onSave={handleSaveConfig} />}
    </div>;
}