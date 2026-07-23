import { useEffect, useRef, useState } from 'react';

type Language = 'en' | 'bn';

interface ELicenseeProfileCreationProps {
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
    cbcPortal: 'CBC Portal',
    pageTitle: 'e-Licensee Profile Creation',
    backToDashboard: 'Back to Dashboard',
    subtitle: 'Create your CBC service-recipient profile to apply for a bond licence and access CBMS online services.',
    next: 'Save & Continue',
    back: 'Back',
    submit: 'Submit Application',
    saveDraft: 'Save as Draft',
    required: 'Required',
    stepLabel: 'Step',
    of: 'of',
  },
  bn: {
    home: 'হোম',
    cbcPortal: 'সিবিসি পোর্টাল',
    pageTitle: 'ই-লাইসেন্সি প্রোফাইল তৈরি',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    subtitle: 'বন্ড লাইসেন্সের জন্য আবেদন এবং সিবিএমএস অনলাইন সেবা ব্যবহারের জন্য আপনার সিবিসি প্রোফাইল তৈরি করুন।',
    next: 'সংরক্ষণ করে এগিয়ে যান',
    back: 'পূর্ববর্তী',
    submit: 'আবেদন জমা দিন',
    saveDraft: 'খসড়া হিসেবে সংরক্ষণ করুন',
    required: 'আবশ্যক',
    stepLabel: 'ধাপ',
    of: 'এর মধ্যে',
  },
};

const steps = [
  { id: 'org', en: 'Organization Details', bn: 'প্রতিষ্ঠানের তথ্য', icon: 'apartment' },
  { id: 'contact', en: 'Contact & Address', bn: 'যোগাযোগ ও ঠিকানা', icon: 'contact_mail' },
  { id: 'documents', en: 'Document Upload', bn: 'নথি আপলোড', icon: 'upload_file' },
  { id: 'credentials', en: 'Credentials & Verification', bn: 'ক্রেডেনশিয়াল ও যাচাইকরণ', icon: 'verified_user' },
  { id: 'review', en: 'Review & Submit', bn: 'পর্যালোচনা ও জমা', icon: 'fact_check' },
];

function Field({
  label,
  required,
  children,
  hint,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
      {hint && !error && <span className="text-[11px] text-[#94A3B8]">{hint}</span>}
      {error && <span className="text-[11px] font-medium text-[#DC2626]">{error}</span>}
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
const errorInputClass = 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20';

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} ${error ? errorInputClass : ''}`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} ${error ? errorInputClass : ''} ${value ? '' : 'text-[#94A3B8]'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-[#1E293B]">
          {o}
        </option>
      ))}
    </select>
  );
}

function StepperNav({
  language,
  currentStep,
  furthestStep,
  onJump,
}: {
  language: Language;
  currentStep: number;
  furthestStep: number;
  onJump: (i: number) => void;
}) {
  return (
    <ol className="flex flex-col gap-1">
      {steps.map((s, i) => {
        const state = i < currentStep ? 'done' : i === currentStep ? 'current' : 'upcoming';
        const clickable = i <= furthestStep;
        return (
          <li key={s.id}>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onJump(i)}
              className={[
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                state === 'current' ? 'bg-[#EAF3FE]' : 'hover:bg-[#F5F7FA]',
                !clickable ? 'cursor-not-allowed opacity-60' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors',
                  state === 'done'
                    ? 'bg-[#00A86B] text-white'
                    : state === 'current'
                      ? 'bg-[#0A4D8C] text-white'
                      : 'bg-[#EEF2F6] text-[#94A3B8]',
                ].join(' ')}
              >
                {state === 'done' ? <Icon name="check" className="text-[18px]" /> : i + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={[
                    'block truncate text-[13px] font-semibold',
                    state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]',
                  ].join(' ')}
                >
                  {s[language]}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function UploadRow({
  icon,
  label,
  required,
  status,
  onUpload,
  onRemove,
  language,
}: {
  icon: string;
  label: string;
  required: boolean;
  status: { uploaded: boolean; fileName?: string; size?: string };
  onUpload: () => void;
  onRemove: () => void;
  language: Language;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={[
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            status.uploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]',
          ].join(' ')}
        >
          <Icon name={status.uploaded ? 'task_alt' : icon} className="text-[20px]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1E293B]">
            {label}
            {required && <span className="ml-1 text-[#DC2626]">*</span>}
          </p>
          {status.uploaded ? (
            <p className="truncate text-xs text-[#64748B]">
              {status.fileName} · {status.size}
            </p>
          ) : (
            <p className="text-xs text-[#94A3B8]">{language === 'en' ? 'PDF, JPG or PNG · max 2 MB' : 'PDF, JPG বা PNG · সর্বোচ্চ ২ এমবি'}</p>
          )}
        </div>
      </div>
      {status.uploaded ? (
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            {language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে'}
          </span>
          <button type="button" onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F5F7FA] hover:text-[#DC2626]">
            <Icon name="delete" className="text-[18px]" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUpload}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] transition-colors hover:bg-[#EAF3FE]"
        >
          <Icon name="upload" className="text-[16px]" />
          {language === 'en' ? 'Upload' : 'আপলোড করুন'}
        </button>
      )}
    </div>
  );
}

function OtpBoxes({ value, onChange, length = 6 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const setDigit = (i: number, d: string) => {
    const clean = d.replace(/\D/g, '').slice(-1);
    const next = digits.slice();
    next[i] = clean;
    onChange(next.join(''));
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="h-11 w-10 rounded-lg border border-[#CBD5E1] text-center text-lg font-bold text-[#1E293B] outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20"
        />
      ))}
    </div>
  );
}

function useCountdown(active: boolean, seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!active) return;
    setRemaining(seconds);
    const id = setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return remaining;
}

function StrengthMeter({ password, language }: { password: string; language: Language }) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(
    Boolean,
  ).length;
  const labels = {
    en: ['Too short', 'Weak', 'Fair', 'Good', 'Strong'],
    bn: ['খুব ছোট', 'দুর্বল', 'মোটামুটি', 'ভালো', 'শক্তিশালী'],
  };
  const colors = ['bg-[#E2E8F0]', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'];
  const idx = password ? score : -1;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= idx - 1 ? colors[Math.max(idx, 1)] : 'bg-[#E2E8F0]'}`} />
        ))}
      </div>
      {password && <span className="text-[11px] text-[#64748B]">{labels[language][idx]}</span>}
    </div>
  );
}

const initialForm = {
  orgType: '',
  orgNameEn: '',
  orgNameBn: '',
  bin: '',
  tin: '',
  tradeLicenseNo: '',
  tradeLicenseAuthority: '',
  establishedYear: '',
  contactName: '',
  designation: '',
  nid: '',
  mobile: '',
  email: '',
  address: '',
  district: '',
  upazila: '',
  sameAddress: true,
  factoryAddress: '',
  userId: '',
  password: '',
  confirmPassword: '',
  agree: false,
};

const orgTypes = {
  en: ['Public Limited Company', 'Private Limited Company', 'Proprietorship', 'Partnership'],
  bn: ['পাবলিক লিমিটেড কোম্পানি', 'প্রাইভেট লিমিটেড কোম্পানি', 'একমালিকানা প্রতিষ্ঠান', 'অংশীদারি প্রতিষ্ঠান'],
};

const districts = {
  en: ['Dhaka', 'Chattogram', 'Gazipur', 'Narayanganj', 'Savar', 'Cumilla', 'Khulna', 'Rajshahi'],
  bn: ['ঢাকা', 'চট্টগ্রাম', 'গাজীপুর', 'নারায়ণগঞ্জ', 'সাভার', 'কুমিল্লা', 'খুলনা', 'রাজশাহী'],
};

const tradeLicenseAuthorities = {
  en: [
    'Dhaka North City Corporation',
    'Dhaka South City Corporation',
    'Chattogram City Corporation',
    'Gazipur City Corporation',
    'Narayanganj City Corporation',
    'Khulna City Corporation',
    'Rajshahi City Corporation',
    'Sylhet City Corporation',
    'Barishal City Corporation',
    'Rangpur City Corporation',
    'Cumilla City Corporation',
    'Mymensingh City Corporation',
    'Paurashava (Municipality)',
    'Union Parishad',
  ],
  bn: [
    'ঢাকা উত্তর সিটি কর্পোরেশন',
    'ঢাকা দক্ষিণ সিটি কর্পোরেশন',
    'চট্টগ্রাম সিটি কর্পোরেশন',
    'গাজীপুর সিটি কর্পোরেশন',
    'নারায়ণগঞ্জ সিটি কর্পোরেশন',
    'খুলনা সিটি কর্পোরেশন',
    'রাজশাহী সিটি কর্পোরেশন',
    'সিলেট সিটি কর্পোরেশন',
    'বরিশাল সিটি কর্পোরেশন',
    'রংপুর সিটি কর্পোরেশন',
    'কুমিল্লা সিটি কর্পোরেশন',
    'ময়মনসিংহ সিটি কর্পোরেশন',
    'পৌরসভা',
    'ইউনিয়ন পরিষদ',
  ],
};

const documentDefs = [
  { id: 'tradeLicense', icon: 'description', en: 'Trade License (copy)', bn: 'ট্রেড লাইসেন্স (কপি)', required: true },
  { id: 'binCert', icon: 'badge', en: 'BIN Certificate', bn: 'বিআইএন সার্টিফিকেট', required: true },
  { id: 'tinCert', icon: 'receipt_long', en: 'TIN Certificate', bn: 'টিআইএন সার্টিফিকেট', required: true },
  { id: 'incorporation', icon: 'gavel', en: 'Certificate of Incorporation / Partnership Deed', bn: 'নিবন্ধন সার্টিফিকেট / অংশীদারি দলিল', required: true },
  { id: 'nidCopy', icon: 'contact_page', en: 'NID of Authorized Person', bn: 'অনুমোদিত ব্যক্তির এনআইডি', required: true },
  { id: 'photo', icon: 'account_circle', en: 'Passport-size Photograph', bn: 'পাসপোর্ট সাইজ ছবি', required: false },
];

export function ELicenseeProfileCreation({ language, onDone }: ELicenseeProfileCreationProps) {
  const t = T[language];
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [docs, setDocs] = useState<Record<string, { uploaded: boolean; fileName?: string; size?: string }>>(
    Object.fromEntries(documentDefs.map((d) => [d.id, { uploaded: false }])),
  );
  const [userIdStatus, setUserIdStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId] = useState(() => `CBMS-SR-2026-${Math.floor(70000 + Math.random() * 9999)}`);

  const mobileCountdown = useCountdown(mobileOtpSent && !mobileVerified, 60);
  const emailCountdown = useCountdown(emailOtpSent && !emailVerified, 60);

  const set = (key: keyof typeof form, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const requiredByStep: Record<number, (keyof typeof form)[]> = {
    0: ['orgType', 'orgNameEn', 'bin', 'tin', 'tradeLicenseNo'],
    1: ['contactName', 'designation', 'mobile', 'email', 'address', 'district'],
    2: [],
    3: ['userId', 'password', 'confirmPassword'],
    4: [],
  };

  const validateStep = (step: number) => {
    const fields = requiredByStep[step] ?? [];
    const nextErrors: Record<string, boolean> = {};
    fields.forEach((f) => {
      if (!form[f]) nextErrors[f as string] = true;
    });
    if (step === 2) {
      documentDefs.forEach((d) => {
        if (d.required && !docs[d.id]?.uploaded) nextErrors[d.id] = true;
      });
    }
    if (step === 3) {
      if (form.password && form.password !== form.confirmPassword) nextErrors.confirmPassword = true;
      if (!mobileVerified) nextErrors.mobileOtp = true;
      if (!emailVerified) nextErrors.emailOtp = true;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    const next = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(next);
    setFurthestStep((f) => Math.max(f, next));
  };
  const goBack = () => setCurrentStep((s) => Math.max(0, s - 1));
  const jumpTo = (i: number) => setCurrentStep(i);

  const checkUserId = () => {
    if (!form.userId) return;
    setUserIdStatus('checking');
    setTimeout(() => setUserIdStatus(form.userId.length >= 5 ? 'available' : 'taken'), 700);
  };

  const handleSubmit = () => {
    if (!form.agree) {
      setErrors({ agree: true });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon name="check_circle" className="text-[48px]" />
        </span>
        <h1 className="text-2xl font-bold text-[#1E293B]">
          {language === 'en' ? 'Profile Created Successfully' : 'প্রোফাইল সফলভাবে তৈরি হয়েছে'}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-[#64748B]">
          {language === 'en'
            ? 'Your service-recipient profile has been created and is pending CBC verification. Use the User ID below to log in and continue with your bond licence application.'
            : 'আপনার সার্ভিস রিসিপিয়েন্ট প্রোফাইল তৈরি হয়েছে এবং সিবিসি যাচাইয়ের অপেক্ষায় রয়েছে। লগইন করতে ও বন্ড লাইসেন্স আবেদন চালিয়ে যেতে নিচের ইউজার আইডি ব্যবহার করুন।'}
        </p>
        <div className="flex w-full items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-5 py-4">
          <div className="text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              {language === 'en' ? 'Your User ID' : 'আপনার ইউজার আইডি'}
            </p>
            <p className="text-lg font-bold text-[#0A4D8C]">{applicationId}</p>
          </div>
          <Icon name="content_copy" className="text-[20px] text-[#94A3B8]" />
        </div>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]"
          >
            <Icon name="home" className="text-[18px]" />
            {t.backToDashboard}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-5 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
          >
            <Icon name="print" className="text-[18px]" />
            {language === 'en' ? 'Download Acknowledgement' : 'স্বীকৃতিপত্র ডাউনলোড করুন'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.cbcPortal}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-[#E2E8F0] bg-white p-3 lg:sticky lg:top-6">
          <StepperNav language={language} currentStep={currentStep} furthestStep={furthestStep} onJump={jumpTo} />
        </aside>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name={steps[currentStep].icon} className="text-[20px]" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {t.stepLabel} {currentStep + 1} {t.of} {steps.length}
                </p>
                <h2 className="text-base font-bold text-[#1E293B]">{steps[currentStep][language]}</h2>
              </div>
            </div>
          </div>

          {currentStep === 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label={language === 'en' ? 'Organization Type' : 'প্রতিষ্ঠানের ধরন'} required error={errors.orgType ? t.required : undefined}>
                  <div className="flex flex-wrap gap-2">
                    {orgTypes[language].map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => set('orgType', orgTypes.en[i])}
                        className={[
                          'rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                          form.orgType === orgTypes.en[i]
                            ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white'
                            : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
                        ].join(' ')}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <Field label={language === 'en' ? 'Organization Name (English)' : 'প্রতিষ্ঠানের নাম (ইংরেজি)'} required error={errors.orgNameEn ? t.required : undefined}>
                <TextInput value={form.orgNameEn} onChange={(v) => set('orgNameEn', v)} placeholder="e.g. Square Fashions Ltd." error={errors.orgNameEn} />
              </Field>
              <Field label={language === 'en' ? 'Organization Name (Bangla)' : 'প্রতিষ্ঠানের নাম (বাংলা)'}>
                <TextInput value={form.orgNameBn} onChange={(v) => set('orgNameBn', v)} placeholder="যেমন: স্কয়ার ফ্যাশনস লিমিটেড" />
              </Field>
              <Field label="Business Identification Number (BIN)" required error={errors.bin ? t.required : undefined}>
                <TextInput value={form.bin} onChange={(v) => set('bin', v)} placeholder="004562178-0206" error={errors.bin} />
              </Field>
              <Field label="Taxpayer Identification Number (TIN)" required error={errors.tin ? t.required : undefined}>
                <TextInput value={form.tin} onChange={(v) => set('tin', v)} placeholder="123456789012" error={errors.tin} />
              </Field>
              <Field label={language === 'en' ? 'Trade License Number' : 'ট্রেড লাইসেন্স নম্বর'} required error={errors.tradeLicenseNo ? t.required : undefined}>
                <TextInput value={form.tradeLicenseNo} onChange={(v) => set('tradeLicenseNo', v)} placeholder="TRAD/DNCC/045821/2024" error={errors.tradeLicenseNo} />
              </Field>
              <Field label={language === 'en' ? 'Issuing Authority' : 'ইস্যুকারী কর্তৃপক্ষ'}>
                <SelectInput
                  value={form.tradeLicenseAuthority}
                  onChange={(v) => set('tradeLicenseAuthority', v)}
                  options={tradeLicenseAuthorities[language]}
                  placeholder={language === 'en' ? 'Select issuing authority' : 'ইস্যুকারী কর্তৃপক্ষ নির্বাচন করুন'}
                />
              </Field>
              <Field label={language === 'en' ? 'Year of Establishment' : 'প্রতিষ্ঠার সাল'}>
                <TextInput value={form.establishedYear} onChange={(v) => set('establishedYear', v)} placeholder="2008" type="number" />
              </Field>
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={language === 'en' ? 'Authorized Person Name' : 'অনুমোদিত ব্যক্তির নাম'} required error={errors.contactName ? t.required : undefined}>
                <TextInput value={form.contactName} onChange={(v) => set('contactName', v)} placeholder="Md. Rafiqul Islam" error={errors.contactName} />
              </Field>
              <Field label={language === 'en' ? 'Designation' : 'পদবি'} required error={errors.designation ? t.required : undefined}>
                <TextInput value={form.designation} onChange={(v) => set('designation', v)} placeholder="Managing Director" error={errors.designation} />
              </Field>
              <Field label={language === 'en' ? 'National ID (NID) Number' : 'জাতীয় পরিচয়পত্র নম্বর'}>
                <TextInput value={form.nid} onChange={(v) => set('nid', v)} placeholder="1985XXXXXXXXXX" />
              </Field>
              <Field label={language === 'en' ? 'Mobile Number' : 'মোবাইল নম্বর'} required error={errors.mobile ? t.required : undefined}>
                <div className="flex">
                  <span className="flex items-center rounded-l-lg border border-r-0 border-[#CBD5E1] bg-[#F5F7FA] px-3 text-sm text-[#64748B]">+880</span>
                  <input
                    value={form.mobile}
                    onChange={(e) => set('mobile', e.target.value)}
                    placeholder="1XXXXXXXXX"
                    className={`${inputClass} rounded-l-none ${errors.mobile ? errorInputClass : ''}`}
                  />
                </div>
              </Field>
              <Field label={language === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা'} required error={errors.email ? t.required : undefined}>
                <TextInput value={form.email} onChange={(v) => set('email', v)} placeholder="rafiqul@squarefashions.com.bd" type="email" error={errors.email} />
              </Field>
              <Field label={language === 'en' ? 'District' : 'জেলা'} required error={errors.district ? t.required : undefined}>
                <SelectInput
                  value={form.district}
                  onChange={(v) => set('district', v)}
                  options={districts[language]}
                  placeholder={language === 'en' ? 'Select district' : 'জেলা নির্বাচন করুন'}
                  error={errors.district}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label={language === 'en' ? 'Registered Office Address' : 'নিবন্ধিত কার্যালয়ের ঠিকানা'} required error={errors.address ? t.required : undefined}>
                  <TextInput value={form.address} onChange={(v) => set('address', v)} placeholder="Plot 45, Road 12, Uttara Industrial Area, Dhaka" error={errors.address} />
                </Field>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <input
                  id="sameAddress"
                  type="checkbox"
                  checked={form.sameAddress}
                  onChange={(e) => set('sameAddress', e.target.checked)}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C] focus:ring-[#1E88E5]"
                />
                <label htmlFor="sameAddress" className="text-sm text-[#334155]">
                  {language === 'en' ? 'Factory / bonded warehouse address is the same as above' : 'কারখানা / বন্ডেড গুদামের ঠিকানা উপরের ঠিকানার অনুরূপ'}
                </label>
              </div>
              {!form.sameAddress && (
                <div className="sm:col-span-2">
                  <Field label={language === 'en' ? 'Factory / Bonded Warehouse Address' : 'কারখানা / বন্ডেড গুদামের ঠিকানা'}>
                    <TextInput value={form.factoryAddress} onChange={(v) => set('factoryAddress', v)} placeholder="Sector 7, EPZ Road, Savar, Dhaka" />
                  </Field>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#64748B]">
                {language === 'en'
                  ? 'Upload clear scanned copies or photographs of the following documents. Accepted formats: PDF, JPG, PNG (max 2 MB each).'
                  : 'নিচের নথিগুলোর স্পষ্ট স্ক্যান কপি বা ছবি আপলোড করুন। গ্রহণযোগ্য ফরম্যাট: PDF, JPG, PNG (সর্বোচ্চ ২ এমবি করে)।'}
              </p>
              {documentDefs.map((d) => (
                <UploadRow
                  key={d.id}
                  icon={d.icon}
                  label={d[language]}
                  required={d.required}
                  status={docs[d.id]}
                  language={language}
                  onUpload={() =>
                    setDocs((prev) => ({
                      ...prev,
                      [d.id]: { uploaded: true, fileName: `${d.id}_scan.pdf`, size: `${(0.4 + Math.random() * 1.4).toFixed(1)} MB` },
                    }))
                  }
                  onRemove={() => setDocs((prev) => ({ ...prev, [d.id]: { uploaded: false } }))}
                />
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label={language === 'en' ? 'Desired User ID' : 'পছন্দসই ইউজার আইডি'} required error={errors.userId ? t.required : undefined}>
                  <div className="flex gap-2">
                    <TextInput
                      value={form.userId}
                      onChange={(v) => {
                        set('userId', v);
                        setUserIdStatus('idle');
                      }}
                      placeholder="squarefashions_bd"
                      error={errors.userId}
                    />
                    <button
                      type="button"
                      onClick={checkUserId}
                      className="shrink-0 rounded-lg border border-[#CBD5E1] px-3 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]"
                    >
                      {language === 'en' ? 'Check' : 'যাচাই করুন'}
                    </button>
                  </div>
                  {userIdStatus === 'checking' && <span className="text-[11px] text-[#94A3B8]">{language === 'en' ? 'Checking…' : 'যাচাই হচ্ছে…'}</span>}
                  {userIdStatus === 'available' && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <Icon name="check_circle" className="text-[14px]" />
                      {language === 'en' ? 'Available' : 'ব্যবহারযোগ্য'}
                    </span>
                  )}
                  {userIdStatus === 'taken' && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#DC2626]">
                      <Icon name="cancel" className="text-[14px]" />
                      {language === 'en' ? 'Already taken, try another' : 'ইতিমধ্যে ব্যবহৃত, অন্য একটি চেষ্টা করুন'}
                    </span>
                  )}
                </Field>
                <div />
                <Field label={language === 'en' ? 'Password' : 'পাসওয়ার্ড'} required error={errors.password ? t.required : undefined}>
                  <TextInput value={form.password} onChange={(v) => set('password', v)} placeholder="••••••••" type="password" error={errors.password} />
                  <StrengthMeter password={form.password} language={language} />
                </Field>
                <Field
                  label={language === 'en' ? 'Confirm Password' : 'পাসওয়ার্ড নিশ্চিত করুন'}
                  required
                  error={errors.confirmPassword ? (language === 'en' ? 'Passwords do not match' : 'পাসওয়ার্ড মিলছে না') : undefined}
                >
                  <TextInput value={form.confirmPassword} onChange={(v) => set('confirmPassword', v)} placeholder="••••••••" type="password" error={errors.confirmPassword} />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-5 border-t border-[#F1F5F9] pt-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2.5">
                  <p className="text-[13px] font-semibold text-[#334155]">
                    {language === 'en' ? 'Verify Mobile Number' : 'মোবাইল নম্বর যাচাই করুন'}
                    {mobileVerified && <Icon name="verified" className="ml-1.5 align-middle text-[16px] text-emerald-600" />}
                  </p>
                  {!mobileOtpSent ? (
                    <button
                      type="button"
                      onClick={() => setMobileOtpSent(true)}
                      disabled={!form.mobile}
                      className="w-fit rounded-lg bg-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-40"
                    >
                      {language === 'en' ? 'Send OTP' : 'ওটিপি পাঠান'}
                    </button>
                  ) : mobileVerified ? (
                    <span className="flex items-center gap-1 text-[13px] font-medium text-emerald-600">
                      <Icon name="check_circle" className="text-[16px]" />
                      {language === 'en' ? 'Verified' : 'যাচাই সম্পন্ন'}
                    </span>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <OtpBoxes value={mobileOtp} onChange={setMobileOtp} />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => mobileOtp.length === 6 && setMobileVerified(true)}
                          disabled={mobileOtp.length !== 6}
                          className="rounded-lg bg-[#00A86B] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#048f5c] disabled:opacity-40"
                        >
                          {language === 'en' ? 'Verify' : 'যাচাই করুন'}
                        </button>
                        <span className="text-[11px] text-[#94A3B8]">
                          {mobileCountdown > 0
                            ? `${language === 'en' ? 'Resend in' : 'পুনরায় পাঠান'} 00:${String(mobileCountdown).padStart(2, '0')}`
                            : (
                              <button type="button" onClick={() => setMobileOtpSent(false)} className="font-semibold text-[#0A4D8C] underline">
                                {language === 'en' ? 'Resend OTP' : 'ওটিপি আবার পাঠান'}
                              </button>
                            )}
                        </span>
                      </div>
                      {errors.mobileOtp && <span className="text-[11px] font-medium text-[#DC2626]">{language === 'en' ? 'Mobile verification required' : 'মোবাইল যাচাইকরণ আবশ্যক'}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  <p className="text-[13px] font-semibold text-[#334155]">
                    {language === 'en' ? 'Verify Email Address' : 'ইমেইল ঠিকানা যাচাই করুন'}
                    {emailVerified && <Icon name="verified" className="ml-1.5 align-middle text-[16px] text-emerald-600" />}
                  </p>
                  {!emailOtpSent ? (
                    <button
                      type="button"
                      onClick={() => setEmailOtpSent(true)}
                      disabled={!form.email}
                      className="w-fit rounded-lg bg-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#083E71] disabled:opacity-40"
                    >
                      {language === 'en' ? 'Send OTP' : 'ওটিপি পাঠান'}
                    </button>
                  ) : emailVerified ? (
                    <span className="flex items-center gap-1 text-[13px] font-medium text-emerald-600">
                      <Icon name="check_circle" className="text-[16px]" />
                      {language === 'en' ? 'Verified' : 'যাচাই সম্পন্ন'}
                    </span>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <OtpBoxes value={emailOtp} onChange={setEmailOtp} />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => emailOtp.length === 6 && setEmailVerified(true)}
                          disabled={emailOtp.length !== 6}
                          className="rounded-lg bg-[#00A86B] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#048f5c] disabled:opacity-40"
                        >
                          {language === 'en' ? 'Verify' : 'যাচাই করুন'}
                        </button>
                        <span className="text-[11px] text-[#94A3B8]">
                          {emailCountdown > 0
                            ? `${language === 'en' ? 'Resend in' : 'পুনরায় পাঠান'} 00:${String(emailCountdown).padStart(2, '0')}`
                            : (
                              <button type="button" onClick={() => setEmailOtpSent(false)} className="font-semibold text-[#0A4D8C] underline">
                                {language === 'en' ? 'Resend OTP' : 'ওটিপি আবার পাঠান'}
                              </button>
                            )}
                        </span>
                      </div>
                      {errors.emailOtp && <span className="text-[11px] font-medium text-[#DC2626]">{language === 'en' ? 'Email verification required' : 'ইমেইল যাচাইকরণ আবশ্যক'}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              {[
                { title: steps[0][language], icon: steps[0].icon, step: 0, rows: [
                  [language === 'en' ? 'Organization' : 'প্রতিষ্ঠান', form.orgNameEn || '—'],
                  ['BIN', form.bin || '—'],
                  ['TIN', form.tin || '—'],
                  [language === 'en' ? 'Trade Licence No.' : 'ট্রেড লাইসেন্স নং', form.tradeLicenseNo || '—'],
                ]},
                { title: steps[1][language], icon: steps[1].icon, step: 1, rows: [
                  [language === 'en' ? 'Contact Person' : 'যোগাযোগকারী', form.contactName || '—'],
                  [language === 'en' ? 'Mobile' : 'মোবাইল', form.mobile ? `+880 ${form.mobile}` : '—'],
                  [language === 'en' ? 'Email' : 'ইমেইল', form.email || '—'],
                  [language === 'en' ? 'District' : 'জেলা', form.district || '—'],
                ]},
                { title: steps[2][language], icon: steps[2].icon, step: 2, rows: documentDefs.map((d) => [d[language], docs[d.id]?.uploaded ? (language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে') : (language === 'en' ? 'Not uploaded' : 'আপলোড হয়নি')]) },
                { title: steps[3][language], icon: steps[3].icon, step: 3, rows: [
                  [language === 'en' ? 'User ID' : 'ইউজার আইডি', form.userId || '—'],
                  [language === 'en' ? 'Mobile Verified' : 'মোবাইল যাচাইকৃত', mobileVerified ? (language === 'en' ? 'Yes' : 'হ্যাঁ') : (language === 'en' ? 'No' : 'না')],
                  [language === 'en' ? 'Email Verified' : 'ইমেইল যাচাইকৃত', emailVerified ? (language === 'en' ? 'Yes' : 'হ্যাঁ') : (language === 'en' ? 'No' : 'না')],
                ]},
              ].map((section) => (
                <div key={section.title} className="rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon name={section.icon} className="text-[18px] text-[#0A4D8C]" />
                      <span className="text-sm font-semibold text-[#1E293B]">{section.title}</span>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(section.step)} className="text-xs font-semibold text-[#0A4D8C] hover:underline">
                      {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                    </button>
                  </div>
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                    {section.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 text-[13px]">
                        <dt className="text-[#64748B]">{k}</dt>
                        <dd className="truncate font-medium text-[#1E293B]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <div className="flex items-start gap-2 pt-1">
                <input
                  id="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => set('agree', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C] focus:ring-[#1E88E5]"
                />
                <label htmlFor="agree" className="text-sm text-[#334155]">
                  {language === 'en'
                    ? 'I declare that the information and documents provided above are true and accurate to the best of my knowledge.'
                    : 'আমি ঘোষণা করছি যে উপরে প্রদত্ত তথ্য ও নথিসমূহ আমার সর্বোত্তম জ্ঞানমতে সত্য ও সঠিক।'}
                </label>
              </div>
              {errors.agree && <span className="text-[11px] font-medium text-[#DC2626]">{t.required}</span>}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-5">
            <button
              type="button"
              onClick={currentStep === 0 ? onDone : goBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]"
            >
              <Icon name="arrow_back" className="text-[16px]" />
              {currentStep === 0 ? t.backToDashboard : t.back}
            </button>
            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#048f5c]"
              >
                {t.submit}
                <Icon name="send" className="text-[16px]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]"
              >
                {t.next}
                <Icon name="arrow_forward" className="text-[16px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
