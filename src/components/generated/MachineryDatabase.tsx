import { useState } from 'react';

type Language = 'en' | 'bn';
type MachineType = 'mother' | 'auxiliary';
type SearchMode = 'machine' | 'product';

interface MachineryDatabaseProps {
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
    machineryManagement: 'Machinery Management',
    pageTitle: 'Machinery Database',
    subtitle: 'System-of-record for all machinery approved under issued Bond Licenses. Records are auto-populated on license approval and integrate with HS Code Management for mother–auxiliary machine tagging.',
    backToDashboard: 'Back to Dashboard',
    autoUpdateBanner: 'This database is automatically updated on Bond License approval and synced with HS Code Management — records are not manually created here.',
    modeMachine: 'Browse Machines',
    modeProduct: 'Search by Raw Material / Finished Good',
    searchPlaceholder: 'Query by HS Code, description, brand or licensee…',
    productSearchPlaceholder: 'Enter a raw material or finished good HS Code / description…',
    allTypes: 'All Types',
    motherMachine: 'Mother Machine',
    auxiliaryMachine: 'Auxiliary Machine',
    hsCode: 'HS Code',
    description: 'Description',
    type: 'Type',
    brand: 'Brand',
    licensee: 'Licensee',
    installed: 'Installed',
    capacity: 'Annual Capacity',
    noResults: 'No machines match your search.',
    noProductResults: 'No machines are tagged against this raw material / finished good yet.',
    close: 'Close',
    detailTitle: 'Machine Record',
    manufacturingYear: 'Manufacturing Year',
    countryOfOrigin: 'Country of Origin',
    installationDate: 'Date of Installation',
    lifeCycle: 'Machine Life Cycle',
    motherAuxiliary: 'Mother / Auxiliary',
    taggedAuxiliary: 'Tagged Auxiliary Machine HS Codes',
    taggedMother: 'Tagged Mother Machine HS Code',
    relatedProducts: 'Tagged Raw Material / Finished Good HS Codes',
    catalogue: 'Machine Catalogue',
    viewCatalogue: 'View Catalogue',
    uploadCatalogue: 'Upload Catalogue (simulate)',
    catalogueUploaded: 'Catalogue uploaded and saved to system archive.',
    licenseInfo: 'Bond License',
    years: 'years',
    perYear: '/ year',
  },
  bn: {
    home: 'হোম',
    machineryManagement: 'যন্ত্রপাতি ব্যবস্থাপনা',
    pageTitle: 'যন্ত্রপাতি ডেটাবেজ',
    subtitle: 'ইস্যুকৃত বন্ড লাইসেন্সের আওতায় অনুমোদিত সকল যন্ত্রপাতির সিস্টেম-অফ-রেকর্ড। লাইসেন্স অনুমোদনের সাথে সাথে রেকর্ড স্বয়ংক্রিয়ভাবে পূরণ হয় এবং মাদার–অক্সিলিয়ারি মেশিন ট্যাগিংয়ের জন্য এইচএস কোড ব্যবস্থাপনার সাথে সংযুক্ত।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    autoUpdateBanner: 'এই ডেটাবেজ বন্ড লাইসেন্স অনুমোদনের সাথে স্বয়ংক্রিয়ভাবে হালনাগাদ হয় এবং এইচএস কোড ব্যবস্থাপনার সাথে সিঙ্ক্রোনাইজড — এখানে ম্যানুয়ালি রেকর্ড তৈরি করা হয় না।',
    modeMachine: 'যন্ত্রপাতি ব্রাউজ করুন',
    modeProduct: 'কাঁচামাল / তৈরি পণ্য দিয়ে অনুসন্ধান',
    searchPlaceholder: 'এইচএস কোড, বিবরণ, ব্র্যান্ড বা লাইসেন্সি দিয়ে অনুসন্ধান করুন…',
    productSearchPlaceholder: 'একটি কাঁচামাল বা তৈরি পণ্যের এইচএস কোড / বিবরণ লিখুন…',
    allTypes: 'সকল ধরন',
    motherMachine: 'মাদার মেশিন',
    auxiliaryMachine: 'অক্সিলিয়ারি মেশিন',
    hsCode: 'এইচএস কোড',
    description: 'বিবরণ',
    type: 'ধরন',
    brand: 'ব্র্যান্ড',
    licensee: 'লাইসেন্সি',
    installed: 'স্থাপিত',
    capacity: 'বার্ষিক সক্ষমতা',
    noResults: 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো যন্ত্রপাতি নেই।',
    noProductResults: 'এই কাঁচামাল / তৈরি পণ্যের বিপরীতে এখনও কোনো যন্ত্রপাতি ট্যাগ করা হয়নি।',
    close: 'বন্ধ করুন',
    detailTitle: 'মেশিন রেকর্ড',
    manufacturingYear: 'উৎপাদন বছর',
    countryOfOrigin: 'উৎপত্তি দেশ',
    installationDate: 'স্থাপনের তারিখ',
    lifeCycle: 'মেশিন লাইফ সাইকেল',
    motherAuxiliary: 'মাদার / অক্সিলিয়ারি',
    taggedAuxiliary: 'ট্যাগকৃত অক্সিলিয়ারি মেশিন এইচএস কোড',
    taggedMother: 'ট্যাগকৃত মাদার মেশিন এইচএস কোড',
    relatedProducts: 'ট্যাগকৃত কাঁচামাল / তৈরি পণ্য এইচএস কোড',
    catalogue: 'মেশিন ক্যাটালগ',
    viewCatalogue: 'ক্যাটালগ দেখুন',
    uploadCatalogue: 'ক্যাটালগ আপলোড করুন (সিমুলেট)',
    catalogueUploaded: 'ক্যাটালগ আপলোড হয়ে সিস্টেম আর্কাইভে সংরক্ষিত হয়েছে।',
    licenseInfo: 'বন্ড লাইসেন্স',
    years: 'বছর',
    perYear: '/ বছর',
  },
};

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';

const typeColor: Record<MachineType, string> = { mother: 'bg-blue-50 text-[#0A4D8C]', auxiliary: 'bg-amber-50 text-amber-700' };
const typeLabel = (t: (typeof T)['en'], type: MachineType) => (type === 'mother' ? t.motherMachine : t.auxiliaryMachine);

interface RelatedProduct {
  code: string;
  labelEn: string;
  labelBn: string;
}

interface MachineRecord {
  id: string;
  hsCode: string;
  descriptionEn: string;
  descriptionBn: string;
  brand: string;
  manufacturingYear: string;
  countryOfOrigin: string;
  installationDate: string;
  machineType: MachineType;
  motherHsCode?: string;
  taggedAuxiliaryHsCodes?: string[];
  annualCapacity: string;
  lifeCycle: string;
  catalogueUrl?: string;
  relatedProducts: RelatedProduct[];
  licenseeName: string;
  bin: string;
  licenseNo: string;
}

const seedMachines: MachineRecord[] = [
  {
    id: 'MC-0001', hsCode: '8452.21.00', descriptionEn: 'Automatic sewing machine unit, industrial', descriptionBn: 'স্বয়ংক্রিয় সেলাই মেশিন ইউনিট, শিল্প',
    brand: 'Juki', manufacturingYear: '2023', countryOfOrigin: 'Japan', installationDate: '10 Feb 2024', machineType: 'mother',
    taggedAuxiliaryHsCodes: ['8452.29.00'], annualCapacity: '1,20,000 pcs', lifeCycle: '12 years', catalogueUrl: 'https://catalogue.juki.example/dll-9000c',
    relatedProducts: [
      { code: '5208.11.00', labelEn: 'Woven cotton fabric, plain weave', labelBn: 'বোনা তুলার কাপড়, সমতল বুনন' },
      { code: '5401.10.00', labelEn: 'Sewing thread of synthetic filament', labelBn: 'সিন্থেটিক ফিলামেন্টের সেলাই সুতা' },
      { code: '6109.10.00', labelEn: 'T-shirts, knitted, of cotton', labelBn: 'টি-শার্ট, নিটেড, তুলার' },
    ],
    licenseeName: 'Square Fashions Ltd.', bin: '004562178-0206', licenseNo: 'BL-2026-04521',
  },
  {
    id: 'MC-0002', hsCode: '8452.29.00', descriptionEn: 'Automatic thread trimming attachment', descriptionBn: 'স্বয়ংক্রিয় থ্রেড ট্রিমিং সংযুক্তি',
    brand: 'Juki', manufacturingYear: '2023', countryOfOrigin: 'Japan', installationDate: '10 Feb 2024', machineType: 'auxiliary',
    motherHsCode: '8452.21.00', annualCapacity: '—', lifeCycle: '10 years', catalogueUrl: undefined,
    relatedProducts: [{ code: '5401.10.00', labelEn: 'Sewing thread of synthetic filament', labelBn: 'সিন্থেটিক ফিলামেন্টের সেলাই সুতা' }],
    licenseeName: 'Square Fashions Ltd.', bin: '004562178-0206', licenseNo: 'BL-2026-04521',
  },
  {
    id: 'MC-0003', hsCode: '8447.11.00', descriptionEn: 'Circular knitting machine, cylinder diameter ≤165mm', descriptionBn: 'বৃত্তাকার নিটিং মেশিন, সিলিন্ডার ব্যাস ≤১৬৫মিমি',
    brand: 'Mayer & Cie', manufacturingYear: '2022', countryOfOrigin: 'Germany', installationDate: '05 Sep 2022', machineType: 'mother',
    taggedAuxiliaryHsCodes: ['8447.90.00'], annualCapacity: '85,000 kg', lifeCycle: '15 years', catalogueUrl: 'https://catalogue.mayercie.example/relanit-3',
    relatedProducts: [
      { code: '5402.31.00', labelEn: 'Textured yarn of nylon, single', labelBn: 'নাইলনের টেক্সচার্ড সুতা, একক' },
      { code: '6109.10.00', labelEn: 'T-shirts, knitted, of cotton', labelBn: 'টি-শার্ট, নিটেড, তুলার' },
    ],
    licenseeName: 'DBL Group', bin: '003321456-0105', licenseNo: 'BL-2021-00934',
  },
  {
    id: 'MC-0004', hsCode: '8447.90.00', descriptionEn: 'Yarn feeding attachment for circular knitting machine', descriptionBn: 'বৃত্তাকার নিটিং মেশিনের জন্য সুতা সরবরাহ সংযুক্তি',
    brand: 'Mayer & Cie', manufacturingYear: '2022', countryOfOrigin: 'Germany', installationDate: '05 Sep 2022', machineType: 'auxiliary',
    motherHsCode: '8447.11.00', annualCapacity: '—', lifeCycle: '12 years', catalogueUrl: undefined,
    relatedProducts: [{ code: '5402.31.00', labelEn: 'Textured yarn of nylon, single', labelBn: 'নাইলনের টেক্সচার্ড সুতা, একক' }],
    licenseeName: 'DBL Group', bin: '003321456-0105', licenseNo: 'BL-2021-00934',
  },
  {
    id: 'MC-0005', hsCode: '8451.40.00', descriptionEn: 'Dyeing, washing or finishing machine', descriptionBn: 'ডাইং, ওয়াশিং বা ফিনিশিং মেশিন',
    brand: 'Then Maschinen', manufacturingYear: '2021', countryOfOrigin: 'Germany', installationDate: '18 Jun 2021', machineType: 'mother',
    taggedAuxiliaryHsCodes: [], annualCapacity: '2,000 tons', lifeCycle: '18 years', catalogueUrl: undefined,
    relatedProducts: [{ code: '5208.11.00', labelEn: 'Woven cotton fabric, plain weave', labelBn: 'বোনা তুলার কাপড়, সমতল বুনন' }],
    licenseeName: 'Envoy Textiles Ltd.', bin: '005871234-0208', licenseNo: 'BL-2022-01655',
  },
  {
    id: 'MC-0006', hsCode: '8452.21.00', descriptionEn: 'Automatic sewing machine unit, industrial', descriptionBn: 'স্বয়ংক্রিয় সেলাই মেশিন ইউনিট, শিল্প',
    brand: 'Brother', manufacturingYear: '2020', countryOfOrigin: 'Vietnam', installationDate: '02 Mar 2020', machineType: 'mother',
    taggedAuxiliaryHsCodes: ['8452.29.00'], annualCapacity: '95,000 pcs', lifeCycle: '12 years', catalogueUrl: 'https://catalogue.brother.example/s-7300a',
    relatedProducts: [
      { code: '5208.11.00', labelEn: 'Woven cotton fabric, plain weave', labelBn: 'বোনা তুলার কাপড়, সমতল বুনন' },
      { code: '5401.10.00', labelEn: 'Sewing thread of synthetic filament', labelBn: 'সিন্থেটিক ফিলামেন্টের সেলাই সুতা' },
    ],
    licenseeName: 'Ha-Meem Group', bin: '001987654-0102', licenseNo: 'BL-2020-00512',
  },
  {
    id: 'MC-0007', hsCode: '8452.29.00', descriptionEn: 'Automatic thread trimming attachment', descriptionBn: 'স্বয়ংক্রিয় থ্রেড ট্রিমিং সংযুক্তি',
    brand: 'Brother', manufacturingYear: '2024', countryOfOrigin: 'Vietnam', installationDate: '14 Jul 2026', machineType: 'auxiliary',
    motherHsCode: '8452.21.00', annualCapacity: '—', lifeCycle: '10 years', catalogueUrl: undefined,
    relatedProducts: [{ code: '5401.10.00', labelEn: 'Sewing thread of synthetic filament', labelBn: 'সিন্থেটিক ফিলামেন্টের সেলাই সুতা' }],
    licenseeName: 'Ha-Meem Group', bin: '001987654-0102', licenseNo: 'BL-2020-00512',
  },
  {
    id: 'MC-0008', hsCode: '8447.11.00', descriptionEn: 'Circular knitting machine, cylinder diameter ≤165mm', descriptionBn: 'বৃত্তাকার নিটিং মেশিন, সিলিন্ডার ব্যাস ≤১৬৫মিমি',
    brand: 'Terrot', manufacturingYear: '2023', countryOfOrigin: 'Germany', installationDate: '30 Nov 2023', machineType: 'mother',
    taggedAuxiliaryHsCodes: [], annualCapacity: '70,000 kg', lifeCycle: '15 years', catalogueUrl: undefined,
    relatedProducts: [{ code: '5402.31.00', labelEn: 'Textured yarn of nylon, single', labelBn: 'নাইলনের টেক্সচার্ড সুতা, একক' }],
    licenseeName: 'Pacific Jeans Ltd.', bin: '009887766-0702', licenseNo: 'BL-2021-01204',
  },
];

export function MachineryDatabase({ language, onDone }: MachineryDatabaseProps) {
  const t = T[language];
  const [mode, setMode] = useState<SearchMode>('machine');
  const [search, setSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MachineType>('all');
  const [detail, setDetail] = useState<MachineRecord | null>(null);
  const [catalogues, setCatalogues] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const machineFiltered = seedMachines.filter((m) => {
    if (typeFilter !== 'all' && m.machineType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!m.hsCode.toLowerCase().includes(q) && !m.descriptionEn.toLowerCase().includes(q) && !m.brand.toLowerCase().includes(q) && !m.licenseeName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const productFiltered = productSearch.trim()
    ? seedMachines.filter((m) => m.relatedProducts.some((p) => p.code.toLowerCase().includes(productSearch.toLowerCase()) || p.labelEn.toLowerCase().includes(productSearch.toLowerCase())))
    : [];

  const listToShow = mode === 'machine' ? machineFiltered : productFiltered;

  const uploadCatalogue = (m: MachineRecord) => {
    setCatalogues((prev) => ({ ...prev, [m.id]: `https://archive.cbms.gov.bd/catalogues/${m.hsCode}-${m.id}.pdf` }));
    flash(t.catalogueUploaded);
  };

  const catalogueFor = (m: MachineRecord) => catalogues[m.id] ?? m.catalogueUrl;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6">
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6" onClick={() => setDetail(null)}>
          <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.detailTitle}</h2>
              <button type="button" onClick={() => setDetail(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto px-5 py-5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#0A4D8C]">{detail.hsCode}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColor[detail.machineType]}`}>{typeLabel(t, detail.machineType)}</span>
              </div>
              <p className="text-sm text-[#334155]">{detail[language === 'en' ? 'descriptionEn' : 'descriptionBn']}</p>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-lg bg-[#F5F7FA] p-3.5 text-[12px]">
                <div>
                  <dt className="text-[#94A3B8]">{t.brand}</dt>
                  <dd className="font-semibold text-[#1E293B]">{detail.brand}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">{t.manufacturingYear}</dt>
                  <dd className="font-semibold text-[#1E293B]">{detail.manufacturingYear}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">{t.countryOfOrigin}</dt>
                  <dd className="font-semibold text-[#1E293B]">{detail.countryOfOrigin}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">{t.installationDate}</dt>
                  <dd className="font-semibold text-[#1E293B]">{detail.installationDate}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">{t.capacity}</dt>
                  <dd className="font-semibold text-[#1E293B]">{detail.annualCapacity}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">{t.lifeCycle}</dt>
                  <dd className="font-semibold text-[#1E293B]">{detail.lifeCycle}</dd>
                </div>
              </dl>

              {detail.machineType === 'mother' ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.taggedAuxiliary}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {(detail.taggedAuxiliaryHsCodes ?? []).length === 0 ? (
                      <span className="text-xs text-[#94A3B8]">—</span>
                    ) : (
                      detail.taggedAuxiliaryHsCodes?.map((c) => (
                        <span key={c} className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          {c}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.taggedMother}</p>
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0A4D8C]">{detail.motherHsCode}</span>
                </div>
              )}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.relatedProducts}</p>
                <div className="mt-1 flex flex-col gap-1">
                  {detail.relatedProducts.map((p) => (
                    <div key={p.code} className="flex items-center gap-2 text-sm text-[#1E293B]">
                      <span className="rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[11px] font-semibold text-[#334155]">{p.code}</span>
                      <span>{p[language === 'en' ? 'labelEn' : 'labelBn']}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.licenseInfo}</p>
                <p className="text-sm font-semibold text-[#1E293B]">
                  {detail.licenseNo} — {detail.licenseeName}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.catalogue}</p>
                {catalogueFor(detail) ? (
                  <a href={catalogueFor(detail)} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A4D8C] hover:underline">
                    <Icon name="menu_book" className="text-[16px]" />
                    {t.viewCatalogue}
                  </a>
                ) : (
                  <button type="button" onClick={() => uploadCatalogue(detail)} className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#0A4D8C] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                    <Icon name="upload" className="text-[15px]" />
                    {t.uploadCatalogue}
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-end border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDetail(null)} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.machineryManagement}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <button type="button" onClick={onDone} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
          <Icon name="arrow_back" className="text-[16px]" />
          {t.backToDashboard}
        </button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
          <Icon name="check_circle" className="text-[16px]" />
          {toast}
        </div>
      )}

      <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-[#0A4D8C]">
        <Icon name="info" className="mt-0.5 text-[18px]" />
        {t.autoUpdateBanner}
      </div>

      <div className="flex gap-2 rounded-xl border border-[#E2E8F0] bg-white p-1.5">
        {(['machine', 'product'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={['flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition-colors', mode === m ? 'bg-[#0A4D8C] text-white' : 'text-[#334155] hover:bg-[#F5F7FA]'].join(' ')}
          >
            {m === 'machine' ? t.modeMachine : t.modeProduct}
          </button>
        ))}
      </div>

      {mode === 'machine' ? (
        <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'mother', 'auxiliary'] as const).map((ty) => (
              <button
                key={ty}
                type="button"
                onClick={() => setTypeFilter(ty)}
                className={['rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors', typeFilter === ty ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
              >
                {ty === 'all' ? t.allTypes : typeLabel(t, ty)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl border border-[#E2E8F0] bg-white p-4">
          <Icon name="search" className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder={t.productSearchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA] text-left text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.hsCode}</th>
              <th className="px-4 py-3">{t.description}</th>
              <th className="px-4 py-3">{t.type}</th>
              <th className="px-4 py-3">{t.brand}</th>
              <th className="px-4 py-3">{t.licensee}</th>
              <th className="px-4 py-3">{t.installed}</th>
            </tr>
          </thead>
          <tbody>
            {mode === 'product' && !productSearch.trim() ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#94A3B8]">
                  {t.productSearchPlaceholder}
                </td>
              </tr>
            ) : listToShow.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#94A3B8]">
                  {mode === 'machine' ? t.noResults : t.noProductResults}
                </td>
              </tr>
            ) : (
              listToShow.map((m) => (
                <tr key={m.id} onClick={() => setDetail(m)} className="cursor-pointer border-b border-[#F1F5F9] transition-colors last:border-0 hover:bg-[#F5F7FA]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{m.hsCode}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-[#334155]">{m[language === 'en' ? 'descriptionEn' : 'descriptionBn']}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColor[m.machineType]}`}>{typeLabel(t, m.machineType)}</span>
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">{m.brand}</td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-[#64748B]">{m.licenseeName}</td>
                  <td className="px-4 py-3 text-[#64748B]">{m.installationDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
