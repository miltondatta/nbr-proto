import { useMemo, useState } from 'react';
import {
  BondLicense,
  bondLicenses,
  licenseCategoryLabels,
  licenseStatusLabels,
  auditStatusLabels,
  legalStatusLabels,
  LicenseStatus,
} from './bondLicenseData';

type Language = 'en' | 'bn';

interface LicenseDatabaseProps {
  language: Language;
  onDone: () => void;
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

const T = {
  en: {
    home: 'Home',
    bondLicense: 'Bond License Management',
    pageTitle: 'License Database',
    subtitle: 'Master database of every bond license issued by the Customs Bond Commissionerate.',
    backToDashboard: 'Back to Dashboard',
    searchPlaceholder: 'Search by license no., bonder name or BIN…',
    all: 'All Statuses',
    totalLicenses: 'Total Licenses',
    licenseNo: 'License No.',
    bonder: 'Bonder',
    category: 'Category',
    district: 'District',
    status: 'Status',
    issued: 'Issued',
    audit: 'Audit',
    noResultsTitle: 'No licenses found',
    noResultsBody: 'Try a different search term or status filter.',
    profileTitle: 'Bonder Profile',
    bin: 'BIN',
    lienBank: 'Lien Bank',
    issueDate: 'Issue Date',
    quickLinks: 'Quick Links',
    ePassbook: 'e-Passbook',
    eBondRegister: 'e-Bond Register',
    entitlement: 'Entitlement',
    machinery: 'Machinery',
    lienBankPortal: 'Lien Bank',
    legalManagement: 'Legal',
    upUd: 'UP / UD',
    legalStatus: 'Legal Status',
    upUdNoLabel: 'UP-UD No.',
    changeStatus: 'Change License Status',
    close: 'Close',
    updateStatus: 'Update Status',
    contactInfo: 'Contact Information',
    phone: 'Mobile Number',
    email: 'Email Address',
    editContact: 'Edit',
    sendOtp: 'Send OTP to Verify',
    otpSentNote: 'A 6-digit OTP has been sent to the new mobile number and email for verification.',
    otpLabel: 'Enter OTP',
    verifyAndSave: 'Verify & Save',
    cancelEdit: 'Cancel',
    contactUpdated: 'Contact information updated and verified.',
  },
  bn: {
    home: 'হোম',
    bondLicense: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
    pageTitle: 'লাইসেন্স ডেটাবেজ',
    subtitle: 'কাস্টমস বন্ড কমিশনারেট কর্তৃক ইস্যুকৃত সকল বন্ড লাইসেন্সের মাস্টার ডেটাবেজ।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    searchPlaceholder: 'লাইসেন্স নং, বন্ডকারীর নাম বা বিআইএন দিয়ে অনুসন্ধান করুন…',
    all: 'সকল অবস্থা',
    totalLicenses: 'মোট লাইসেন্স',
    licenseNo: 'লাইসেন্স নং',
    bonder: 'বন্ডকারী',
    category: 'ক্যাটাগরি',
    district: 'জেলা',
    status: 'অবস্থা',
    issued: 'ইস্যুর তারিখ',
    audit: 'নিরীক্ষা',
    noResultsTitle: 'কোনো লাইসেন্স পাওয়া যায়নি',
    noResultsBody: 'ভিন্ন অনুসন্ধান শব্দ বা অবস্থা ফিল্টার ব্যবহার করে দেখুন।',
    profileTitle: 'বন্ডকারী প্রোফাইল',
    bin: 'বিআইএন',
    lienBank: 'লিয়েন ব্যাংক',
    issueDate: 'ইস্যুর তারিখ',
    quickLinks: 'কুইক লিংক',
    ePassbook: 'ই-পাসবুক',
    eBondRegister: 'ই-বন্ড রেজিস্টার',
    entitlement: 'এনটাইটেলমেন্ট',
    machinery: 'যন্ত্রপাতি',
    lienBankPortal: 'লিয়েন ব্যাংক',
    legalManagement: 'আইনি',
    upUd: 'ইউপি / ইউডি',
    legalStatus: 'আইনি অবস্থা',
    upUdNoLabel: 'ইউপি-ইউডি নং',
    changeStatus: 'লাইসেন্স অবস্থা পরিবর্তন',
    close: 'বন্ধ করুন',
    updateStatus: 'অবস্থা হালনাগাদ করুন',
    contactInfo: 'যোগাযোগের তথ্য',
    phone: 'মোবাইল নম্বর',
    email: 'ইমেইল ঠিকানা',
    editContact: 'সম্পাদনা',
    sendOtp: 'যাচাইয়ের জন্য ওটিপি পাঠান',
    otpSentNote: 'যাচাইয়ের জন্য নতুন মোবাইল নম্বর ও ইমেইলে একটি ৬-সংখ্যার ওটিপি পাঠানো হয়েছে।',
    otpLabel: 'ওটিপি লিখুন',
    verifyAndSave: 'যাচাই করে সংরক্ষণ করুন',
    cancelEdit: 'বাতিল',
    contactUpdated: 'যোগাযোগের তথ্য হালনাগাদ ও যাচাই হয়েছে।',
  },
};

const statusOrder: LicenseStatus[] = ['active', 'pending-renewal', 'suspended', 'cancelled'];

function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);
  const setDigit = (i: number, d: string) => {
    const clean = d.replace(/\D/g, '').slice(-1);
    const next = digits.slice();
    next[i] = clean;
    onChange(next.join(''));
  };
  return (
    <div className="flex gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          value={d}
          onChange={(e) => setDigit(i, e.target.value)}
          inputMode="numeric"
          maxLength={1}
          className="h-10 w-9 rounded-lg border border-[#CBD5E1] text-center text-sm font-bold text-[#1E293B] outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20"
        />
      ))}
    </div>
  );
}

export function LicenseDatabase({ language, onDone }: LicenseDatabaseProps) {
  const t = T[language];
  const [licenses, setLicenses] = useState<BondLicense[]>(bondLicenses);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<LicenseStatus | null>(null);
  const [selected, setSelected] = useState<BondLicense | null>(null);
  const [editingContact, setEditingContact] = useState(false);
  const [draftPhone, setDraftPhone] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [contactToast, setContactToast] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return licenses.filter((l) => {
      const matchesStatus = !activeStatus || l.status === activeStatus;
      const matchesSearch =
        !q || l.licenseNo.toLowerCase().includes(q) || l.nameEn.toLowerCase().includes(q) || l.nameBn.includes(q) || l.bin.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [licenses, search, activeStatus]);

  const countFor = (st: LicenseStatus | null) => licenses.filter((l) => !st || l.status === st).length;

  const setStatus = (licenseNo: string, status: LicenseStatus) => {
    setLicenses((prev) => prev.map((l) => (l.licenseNo === licenseNo ? { ...l, status } : l)));
    setSelected((prev) => (prev && prev.licenseNo === licenseNo ? { ...prev, status } : prev));
  };

  const openSelected = (l: BondLicense) => {
    setSelected(l);
    setEditingContact(false);
    setOtpSent(false);
    setOtp('');
  };

  const startEditContact = () => {
    if (!selected) return;
    setDraftPhone(selected.contactPhone);
    setDraftEmail(selected.contactEmail);
    setOtpSent(false);
    setOtp('');
    setEditingContact(true);
  };

  const verifyAndSaveContact = () => {
    if (!selected || otp.length !== 6) return;
    setLicenses((prev) => prev.map((l) => (l.licenseNo === selected.licenseNo ? { ...l, contactPhone: draftPhone, contactEmail: draftEmail } : l)));
    setSelected((prev) => (prev ? { ...prev, contactPhone: draftPhone, contactEmail: draftEmail } : prev));
    setEditingContact(false);
    setOtpSent(false);
    setOtp('');
    setContactToast(true);
    setTimeout(() => setContactToast(false), 3000);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.bondLicense}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
          <Icon name="storage" className="text-[22px]" />
        </span>
        <div>
          <p className="text-lg font-bold text-[#1E293B]">{licenses.length.toLocaleString()}</p>
          <p className="text-xs font-medium text-[#64748B]">{t.totalLicenses}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="relative w-full lg:max-w-sm">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#94A3B8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-[#E2E8F0] bg-[#F5F7FA] py-2.5 pl-10 pr-4 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:bg-white focus:ring-2 focus:ring-[#1E88E5]/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveStatus(null)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              activeStatus === null ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
            ].join(' ')}
          >
            {t.all} ({countFor(null)})
          </button>
          {statusOrder.map((st) => {
            const style = licenseStatusLabels[st];
            const isActive = activeStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setActiveStatus(st)}
                className={['rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', isActive ? 'text-white' : 'text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
                style={isActive ? { backgroundColor: style.color, borderColor: style.color } : { borderColor: '#CBD5E1' }}
              >
                {style[language]} ({countFor(st)})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
          <Icon name="search_off" className="text-[36px] text-[#94A3B8]" />
          <h2 className="text-sm font-bold text-[#1E293B]">{t.noResultsTitle}</h2>
          <p className="text-xs text-[#64748B]">{t.noResultsBody}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-5 py-3">{t.licenseNo}</th>
                  <th className="px-5 py-3">{t.bonder}</th>
                  <th className="px-5 py-3">{t.category}</th>
                  <th className="px-5 py-3">{t.district}</th>
                  <th className="px-5 py-3">{t.issued}</th>
                  <th className="px-5 py-3">{t.audit}</th>
                  <th className="px-5 py-3">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((l) => {
                  const statusStyle = licenseStatusLabels[l.status];
                  const auditStyle = auditStatusLabels[l.auditStatus];
                  return (
                    <tr key={l.licenseNo} onClick={() => openSelected(l)} className="cursor-pointer transition-colors hover:bg-[#F8FAFC]">
                      <td className="px-5 py-3 font-semibold text-[#0A4D8C]">{l.licenseNo}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-[#1E293B]">{l[language === 'en' ? 'nameEn' : 'nameBn']}</p>
                        <p className="text-[11px] text-[#94A3B8]">{t.bin}: {l.bin}</p>
                      </td>
                      <td className="px-5 py-3 text-[#334155]">{licenseCategoryLabels[l.category][language]}</td>
                      <td className="px-5 py-3 text-[#334155]">{l.district}</td>
                      <td className="px-5 py-3 text-[#334155]">{l.issueDate}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${auditStyle.color}1A`, color: auditStyle.color }}>
                          {auditStyle[language]}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${statusStyle.color}1A`, color: statusStyle.color }}>
                          {statusStyle[language]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
          <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.profileTitle}</h2>
              <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="flex flex-col gap-5 px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                  <Icon name="domain" className="text-[24px]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1E293B]">{selected[language === 'en' ? 'nameEn' : 'nameBn']}</p>
                  <p className="text-xs font-semibold text-[#0A4D8C]">{selected.licenseNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#E2E8F0] p-4 text-[13px]">
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.bin}</p>
                  <p className="font-medium text-[#1E293B]">{selected.bin}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.category}</p>
                  <p className="font-medium text-[#1E293B]">{licenseCategoryLabels[selected.category][language]}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.district}</p>
                  <p className="font-medium text-[#1E293B]">{selected.district}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.issueDate}</p>
                  <p className="font-medium text-[#1E293B]">{selected.issueDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-[#94A3B8]">{t.lienBank}</p>
                  <p className="font-medium text-[#1E293B]">{selected.lienBank}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.status}</p>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: `${licenseStatusLabels[selected.status].color}1A`, color: licenseStatusLabels[selected.status].color }}
                  >
                    {licenseStatusLabels[selected.status][language]}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.audit}</p>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: `${auditStatusLabels[selected.auditStatus].color}1A`, color: auditStatusLabels[selected.auditStatus].color }}
                  >
                    {auditStatusLabels[selected.auditStatus][language]}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.legalStatus}</p>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: `${legalStatusLabels[selected.legalStatus].color}1A`, color: legalStatusLabels[selected.legalStatus].color }}
                  >
                    {legalStatusLabels[selected.legalStatus][language]}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8]">{t.upUdNoLabel}</p>
                  <p className="font-medium text-[#1E293B]">{selected.upUdNo}</p>
                </div>
              </div>

              {contactToast && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
                  <Icon name="check_circle" className="text-[16px]" />
                  {t.contactUpdated}
                </div>
              )}

              <div className="rounded-xl border border-[#E2E8F0] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.contactInfo}</p>
                  {!editingContact && (
                    <button type="button" onClick={startEditContact} className="flex items-center gap-1 text-xs font-semibold text-[#0A4D8C] hover:underline">
                      <Icon name="edit" className="text-[15px]" />
                      {t.editContact}
                    </button>
                  )}
                </div>
                {!editingContact ? (
                  <div className="flex flex-col gap-2 text-[13px]">
                    <p className="flex items-center gap-2 text-[#1E293B]">
                      <Icon name="call" className="text-[15px] text-[#94A3B8]" />
                      {selected.contactPhone}
                    </p>
                    <p className="flex items-center gap-2 text-[#1E293B]">
                      <Icon name="mail" className="text-[15px] text-[#94A3B8]" />
                      {selected.contactEmail}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">{t.phone}</span>
                      <input
                        value={draftPhone}
                        onChange={(e) => {
                          setDraftPhone(e.target.value);
                          setOtpSent(false);
                        }}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">{t.email}</span>
                      <input
                        value={draftEmail}
                        onChange={(e) => {
                          setDraftEmail(e.target.value);
                          setOtpSent(false);
                        }}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20"
                      />
                    </label>
                    {!otpSent ? (
                      <button type="button" onClick={() => setOtpSent(true)} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                        {t.sendOtp}
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] text-[#64748B]">{t.otpSentNote}</p>
                        <span className="text-[12px] font-semibold text-[#334155]">{t.otpLabel}</span>
                        <OtpBoxes value={otp} onChange={setOtp} />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditingContact(false)} className="rounded-full border border-[#CBD5E1] px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                        {t.cancelEdit}
                      </button>
                      {otpSent && (
                        <button
                          type="button"
                          onClick={verifyAndSaveContact}
                          disabled={otp.length !== 6}
                          className="rounded-full bg-[#00A86B] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#048f5c] disabled:opacity-40"
                        >
                          {t.verifyAndSave}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.quickLinks}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: 'import_contacts', label: t.ePassbook },
                    { icon: 'receipt_long', label: t.eBondRegister },
                    { icon: 'pie_chart', label: t.entitlement },
                    { icon: 'precision_manufacturing', label: t.machinery },
                    { icon: 'account_balance', label: t.lienBankPortal },
                    { icon: 'balance', label: t.legalManagement },
                    { icon: 'verified_user', label: t.upUd },
                  ].map((link) => (
                    <button
                      key={link.label}
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-left text-xs font-semibold text-[#334155] transition-colors hover:border-[#0A4D8C] hover:bg-[#EAF3FE]"
                    >
                      <Icon name={link.icon} className="text-[16px] text-[#0A4D8C]" />
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.changeStatus}</p>
                <div className="flex flex-wrap gap-2">
                  {statusOrder.map((st) => {
                    const style = licenseStatusLabels[st];
                    const isCurrent = selected.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(selected.licenseNo, st)}
                        disabled={isCurrent}
                        className={[
                          'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed',
                          isCurrent ? 'text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
                        ].join(' ')}
                        style={isCurrent ? { backgroundColor: style.color, borderColor: style.color } : undefined}
                      >
                        {style[language]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-end border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
