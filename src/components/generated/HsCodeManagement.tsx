import { useState } from 'react';

type Language = 'en' | 'bn';
type HSCategory = 'raw-material' | 'finished-good' | 'machine';
type AppStage = 'ro-review' | 'acdc-review' | 'commissioner-review' | 'included' | 'disapproved';

interface HsCodeManagementProps {
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
    pageTitle: 'HS Code Management',
    subtitle: 'Central HS Code database synced with the ASYCUDA System, and the online workflow for bonders to apply for addition of new HS Codes to their Bond License.',
    backToDashboard: 'Back to Dashboard',
    syncBanner: 'Synced with ASYCUDA System',
    lastSync: 'Last synced',
    newApplication: 'New HS Code Application',
    pendingApplications: 'Pending Applications',
    searchPlaceholder: 'Search HS Code or description…',
    allCategories: 'All Categories',
    rawMaterial: 'Raw Material',
    finishedGood: 'Finished Good',
    machine: 'Machine',
    code: 'HS Code',
    description: 'Description',
    category: 'Category',
    taggedCodes: 'Tagged Codes',
    approvedFor: 'Approved For',
    source: 'Source',
    noResults: 'No HS Codes match your search.',
    close: 'Close',
    licensees: 'licensee(s)',
    detailTitle: 'HS Code Detail',
    asycudaSynced: 'ASYCUDA Sync',
    cbcApproved: 'CBC Approved',
    // wizard
    stepLicense: 'Bond License & Code',
    stepJustification: 'Justification & Documents',
    stepReview: 'Review & Submit',
    selectLicense: 'Bond License',
    selectLicensePlaceholder: 'Select the license to add this HS Code to',
    requestedCode: 'Requested HS Code',
    requestedCodePlaceholder: 'e.g. 5208.11.00',
    codeCategory: 'Category',
    codeDescription: 'Commercial Description',
    codeDescriptionPlaceholder: 'Describe the raw material, finished good or machine…',
    verifying: 'e-Verification',
    foundInDb: 'This HS Code already exists in the database with a matching description. It will be auto-verified.',
    notFoundInDb: 'This HS Code was not found in the current database. It will require manual verification by CBC officials.',
    justificationLabel: 'Justification for Addition',
    justificationPlaceholder: 'Explain why this HS Code needs to be added to the bond license…',
    attachSupportingDocs: 'Supporting Documents',
    uploadDoc: 'Upload',
    uploaded: 'Uploaded',
    back: 'Back',
    next: 'Save & Continue',
    submit: 'Submit Application',
    required: 'Required',
    submittedTitle: 'Application Submitted',
    submittedBody: 'Your HS Code addition application has been received and auto-assigned to a Revenue Officer for review.',
    applicationId: 'Application ID',
    trackApplication: 'Track this Application',
    // queue
    queueTitle: 'HS Code Addition — Review Queue',
    queueSubtitle: 'Sequential review pipeline — RO examination, AC/DC verification, Commissioner approval, followed by auto-inclusion into the e-Bond License and Bonder Profile.',
    filterAll: 'All',
    filterInProgress: 'In Progress',
    filterIncluded: 'Included',
    filterDisapproved: 'Disapproved',
    review: 'Review',
    reviewTitle: 'Review HS Code Application',
    stageLabels: {
      'ro-review': 'RO Examination',
      'acdc-review': 'AC/DC Verification',
      'commissioner-review': 'Commissioner Approval',
      included: 'Auto-Included',
      disapproved: 'Disapproved',
    },
    deadline: 'Review Deadline',
    overdue: 'Overdue — Escalation Notification Sent',
    onTrack: 'Within time limit',
    roNoteLabel: 'RO e-Note',
    roNotePlaceholder: 'RO examination remarks…',
    forwardToAcdc: 'Add e-Note & Forward to AC/DC',
    acdcNoteLabel: 'AC/DC e-Note',
    acdcNotePlaceholder: 'AC/DC verification remarks…',
    requestMoreDocs: 'Request Additional Documents',
    requestMoreDocsSent: 'Notification sent to Bonder requesting additional documents (CC: Commissioner).',
    moreDocsPending: 'Awaiting additional documents from Bonder.',
    docsReceived: 'Documents Received (simulate)',
    forwardToCommissioner: 'Add e-Note & Forward to Commissioner',
    commissionerNoteLabel: 'Commissioner e-Note',
    commissionerNotePlaceholder: 'Commissioner remarks…',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalReasonRequired: 'A reason is required to disapprove.',
    includedNotice: 'HS Code auto-included in e-Bond License and Bonder Profile. Bonder auto-notified of approval.',
    disapprovedNotice: 'Bonder auto-notified of disapproval.',
    resubmitLabel: 'Bonder may resubmit with new justification (system requires new information vs. previous submission).',
    updatedJustification: 'Updated Justification',
    resubmit: 'Resubmit Application',
    resubmitUnchanged: 'New justification must differ from the previous submission before resubmitting.',
    notFoundBadge: 'Not in DB — manual verification required',
    foundBadge: 'Verified in DB',
    assignedRo: 'Assigned RO',
  },
  bn: {
    home: 'হোম',
    pageTitle: 'এইচএস কোড ব্যবস্থাপনা',
    subtitle: 'অ্যাসাইকুডা সিস্টেমের সাথে সিঙ্ক্রোনাইজড কেন্দ্রীয় এইচএস কোড ডেটাবেজ, এবং বন্ডারদের তাদের বন্ড লাইসেন্সে নতুন এইচএস কোড যুক্ত করার অনলাইন কার্যপ্রবাহ।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    syncBanner: 'অ্যাসাইকুডা সিস্টেমের সাথে সিঙ্ক্রোনাইজড',
    lastSync: 'সর্বশেষ সিঙ্ক',
    newApplication: 'নতুন এইচএস কোড আবেদন',
    pendingApplications: 'অমীমাংসিত আবেদন',
    searchPlaceholder: 'এইচএস কোড বা বিবরণ খুঁজুন…',
    allCategories: 'সকল ক্যাটাগরি',
    rawMaterial: 'কাঁচামাল',
    finishedGood: 'তৈরি পণ্য',
    machine: 'যন্ত্রপাতি',
    code: 'এইচএস কোড',
    description: 'বিবরণ',
    category: 'ক্যাটাগরি',
    taggedCodes: 'ট্যাগকৃত কোড',
    approvedFor: 'অনুমোদিত',
    source: 'উৎস',
    noResults: 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো এইচএস কোড নেই।',
    close: 'বন্ধ করুন',
    licensees: 'লাইসেন্সি',
    detailTitle: 'এইচএস কোড বিবরণ',
    asycudaSynced: 'অ্যাসাইকুডা সিঙ্ক',
    cbcApproved: 'সিবিসি অনুমোদিত',
    stepLicense: 'বন্ড লাইসেন্স ও কোড',
    stepJustification: 'যৌক্তিকতা ও নথি',
    stepReview: 'পর্যালোচনা ও জমা',
    selectLicense: 'বন্ড লাইসেন্স',
    selectLicensePlaceholder: 'যে লাইসেন্সে এই এইচএস কোড যুক্ত হবে তা নির্বাচন করুন',
    requestedCode: 'অনুরোধকৃত এইচএস কোড',
    requestedCodePlaceholder: 'যেমন: ৫২০৮.১১.০০',
    codeCategory: 'ক্যাটাগরি',
    codeDescription: 'বাণিজ্যিক বিবরণ',
    codeDescriptionPlaceholder: 'কাঁচামাল, তৈরি পণ্য বা যন্ত্রপাতির বিবরণ দিন…',
    verifying: 'ই-যাচাইকরণ',
    foundInDb: 'এই এইচএস কোডটি ডেটাবেজে মিলযুক্ত বিবরণসহ ইতিমধ্যে বিদ্যমান। এটি স্বয়ংক্রিয়ভাবে যাচাই হবে।',
    notFoundInDb: 'এই এইচএস কোডটি বর্তমান ডেটাবেজে পাওয়া যায়নি। এর জন্য সিবিসি কর্মকর্তাদের ম্যানুয়াল যাচাই প্রয়োজন হবে।',
    justificationLabel: 'সংযোজনের যৌক্তিকতা',
    justificationPlaceholder: 'কেন এই এইচএস কোডটি বন্ড লাইসেন্সে যুক্ত করা প্রয়োজন তা ব্যাখ্যা করুন…',
    attachSupportingDocs: 'সহায়ক নথি',
    uploadDoc: 'আপলোড',
    uploaded: 'আপলোড হয়েছে',
    back: 'পূর্ববর্তী',
    next: 'সংরক্ষণ করে এগিয়ে যান',
    submit: 'আবেদন জমা দিন',
    required: 'আবশ্যক',
    submittedTitle: 'আবেদন জমা হয়েছে',
    submittedBody: 'আপনার এইচএস কোড সংযোজন আবেদন গৃহীত হয়েছে এবং পর্যালোচনার জন্য স্বয়ংক্রিয়ভাবে একজন রেভিনিউ অফিসারকে নিয়োগ করা হয়েছে।',
    applicationId: 'আবেদন আইডি',
    trackApplication: 'এই আবেদনটি ট্র্যাক করুন',
    queueTitle: 'এইচএস কোড সংযোজন — পর্যালোচনা সারি',
    queueSubtitle: 'ধারাবাহিক পর্যালোচনা প্রক্রিয়া — আরও পরীক্ষা, এসি/ডিসি যাচাই, কমিশনার অনুমোদন, এরপর ই-বন্ড লাইসেন্স ও বন্ডার প্রোফাইলে স্বয়ংক্রিয় অন্তর্ভুক্তি।',
    filterAll: 'সকল',
    filterInProgress: 'চলমান',
    filterIncluded: 'অন্তর্ভুক্ত',
    filterDisapproved: 'অননুমোদিত',
    review: 'পর্যালোচনা',
    reviewTitle: 'এইচএস কোড আবেদন পর্যালোচনা',
    stageLabels: {
      'ro-review': 'আরও পরীক্ষা',
      'acdc-review': 'এসি/ডিসি যাচাই',
      'commissioner-review': 'কমিশনার অনুমোদন',
      included: 'স্বয়ংক্রিয়ভাবে অন্তর্ভুক্ত',
      disapproved: 'অননুমোদিত',
    },
    deadline: 'পর্যালোচনার সময়সীমা',
    overdue: 'সময়সীমা অতিক্রান্ত — এসকেলেশন নোটিফিকেশন পাঠানো হয়েছে',
    onTrack: 'সময়সীমার মধ্যে',
    roNoteLabel: 'আরও e-নোট',
    roNotePlaceholder: 'আরও পরীক্ষার মন্তব্য…',
    forwardToAcdc: 'e-নোট যোগ করে এসি/ডিসিতে ফরওয়ার্ড করুন',
    acdcNoteLabel: 'এসি/ডিসি e-নোট',
    acdcNotePlaceholder: 'এসি/ডিসি যাচাইয়ের মন্তব্য…',
    requestMoreDocs: 'অতিরিক্ত নথি অনুরোধ',
    requestMoreDocsSent: 'বন্ডারকে অতিরিক্ত নথির অনুরোধ পাঠানো হয়েছে (সিসি: কমিশনার)।',
    moreDocsPending: 'বন্ডারের কাছ থেকে অতিরিক্ত নথির অপেক্ষায়।',
    docsReceived: 'নথি প্রাপ্ত হয়েছে (সিমুলেট)',
    forwardToCommissioner: 'e-নোট যোগ করে কমিশনারের কাছে ফরওয়ার্ড করুন',
    commissionerNoteLabel: 'কমিশনার e-নোট',
    commissionerNotePlaceholder: 'কমিশনারের মন্তব্য…',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalReasonRequired: 'অননুমোদনের জন্য একটি কারণ আবশ্যক।',
    includedNotice: 'এইচএস কোড ই-বন্ড লাইসেন্স ও বন্ডার প্রোফাইলে স্বয়ংক্রিয়ভাবে অন্তর্ভুক্ত হয়েছে। বন্ডারকে অনুমোদনের বিষয়ে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    disapprovedNotice: 'বন্ডারকে অননুমোদনের বিষয়ে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    resubmitLabel: 'বন্ডার নতুন যৌক্তিকতাসহ পুনরায় আবেদন করতে পারবেন (পূর্ববর্তী আবেদনের তুলনায় নতুন তথ্য প্রয়োজন)।',
    updatedJustification: 'হালনাগাদকৃত যৌক্তিকতা',
    resubmit: 'পুনরায় আবেদন জমা দিন',
    resubmitUnchanged: 'পুনরায় জমা দেওয়ার আগে নতুন যৌক্তিকতা পূর্ববর্তী জমা থেকে ভিন্ন হতে হবে।',
    notFoundBadge: 'ডেটাবেজে নেই — ম্যানুয়াল যাচাই প্রয়োজন',
    foundBadge: 'ডেটাবেজে যাচাইকৃত',
    assignedRo: 'নিয়োগপ্রাপ্ত আরও',
  },
};

const inputClass =
  'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
const errorInputClass = 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20';

function Field({ label, required, children, error }: { label: string; required?: boolean; children: React.ReactNode; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
      {error && <span className="text-[11px] font-medium text-[#DC2626]">{error}</span>}
    </label>
  );
}

function PillGroup({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            'rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
            value === opt.value ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const officerPool = [
  { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
];

const categoryLabel = (t: (typeof T)['en'], c: HSCategory) => (c === 'raw-material' ? t.rawMaterial : c === 'finished-good' ? t.finishedGood : t.machine);
const categoryColor: Record<HSCategory, string> = { 'raw-material': 'bg-blue-50 text-[#0A4D8C]', 'finished-good': 'bg-emerald-50 text-emerald-700', machine: 'bg-amber-50 text-amber-700' };

interface HSCodeRecord {
  code: string;
  descriptionEn: string;
  descriptionBn: string;
  category: HSCategory;
  taggedCodes: string[];
  approvedFor: string[];
  source: 'asycuda' | 'cbc';
}

const hsCodeDatabase: HSCodeRecord[] = [
  { code: '5208.11.00', descriptionEn: 'Woven cotton fabric, plain weave, ≤100g/m²', descriptionBn: 'বোনা তুলার কাপড়, সমতল বুনন, ≤১০০ গ্রাম/মি²', category: 'raw-material', taggedCodes: ['8452.21.00'], approvedFor: ['Square Fashions Ltd.', 'DBL Group', 'Radiant Apparels Ltd.'], source: 'asycuda' },
  { code: '5402.31.00', descriptionEn: 'Textured yarn of nylon, single, ≤50 tex', descriptionBn: 'নাইলনের টেক্সচার্ড সুতা, একক, ≤৫০ টেক্স', category: 'raw-material', taggedCodes: ['8447.11.00'], approvedFor: ['DBL Group', 'Envoy Textiles Ltd.'], source: 'asycuda' },
  { code: '5401.10.00', descriptionEn: 'Sewing thread of synthetic filament', descriptionBn: 'সিন্থেটিক ফিলামেন্টের সেলাই সুতা', category: 'raw-material', taggedCodes: ['8452.21.00'], approvedFor: ['Square Fashions Ltd.', 'Ha-Meem Group', 'Pacific Jeans Ltd.'], source: 'asycuda' },
  { code: '9606.21.00', descriptionEn: 'Buttons of plastic', descriptionBn: 'প্লাস্টিকের বোতাম', category: 'raw-material', taggedCodes: [], approvedFor: ['Fakir Fashion Ltd.'], source: 'cbc' },
  { code: '9607.19.00', descriptionEn: 'Slide fasteners (zippers)', descriptionBn: 'স্লাইড ফাস্টেনার (জিপার)', category: 'raw-material', taggedCodes: [], approvedFor: ['Pacific Jeans Ltd.', 'Jamuna Denims Ltd.'], source: 'cbc' },
  { code: '6109.10.00', descriptionEn: 'T-shirts, singlets, knitted or crocheted, of cotton', descriptionBn: 'টি-শার্ট, সিঙ্গলেট, নিটেড বা ক্রোশেটেড, তুলার', category: 'finished-good', taggedCodes: ['5208.11.00', '5401.10.00'], approvedFor: ['Square Fashions Ltd.', 'Meghna Knit Composite Ltd.'], source: 'asycuda' },
  { code: '6203.42.00', descriptionEn: "Men's trousers, of cotton, not knitted", descriptionBn: 'পুরুষদের ট্রাউজার, তুলার, নিটেড নয়', category: 'finished-good', taggedCodes: ['5208.11.00', '9607.19.00'], approvedFor: ['Pacific Jeans Ltd.', 'Jamuna Denims Ltd.'], source: 'asycuda' },
  { code: '8452.21.00', descriptionEn: 'Automatic sewing machine units, industrial', descriptionBn: 'স্বয়ংক্রিয় সেলাই মেশিন ইউনিট, শিল্প', category: 'machine', taggedCodes: ['5208.11.00', '5401.10.00'], approvedFor: ['Square Fashions Ltd.', 'DBL Group', 'Ha-Meem Group'], source: 'asycuda' },
  { code: '8447.11.00', descriptionEn: 'Circular knitting machines, cylinder diameter ≤165mm', descriptionBn: 'বৃত্তাকার নিটিং মেশিন, সিলিন্ডার ব্যাস ≤১৬৫মিমি', category: 'machine', taggedCodes: ['5402.31.00'], approvedFor: ['DBL Group', 'Envoy Textiles Ltd.'], source: 'asycuda' },
  { code: '8451.40.00', descriptionEn: 'Dyeing, washing or finishing machines', descriptionBn: 'ডাইং, ওয়াশিং বা ফিনিশিং মেশিন', category: 'machine', taggedCodes: [], approvedFor: ['Envoy Textiles Ltd.'], source: 'cbc' },
];

const licenseOptions = [
  { bin: '008834521-0705', licenseNo: 'BL-2026-70211', name: 'Comfort Knit Composite Ltd.' },
  { bin: '007745210-0604', licenseNo: 'BL-2026-70198', name: 'Silver Line Garments Ltd.' },
  { bin: '004562178-0206', licenseNo: 'BL-2026-04521', name: 'Square Fashions Ltd.' },
  { bin: '003321456-0105', licenseNo: 'BL-2021-00934', name: 'DBL Group' },
  { bin: '009887766-0702', licenseNo: 'BL-2021-01204', name: 'Pacific Jeans Ltd.' },
];

const documentDefs = [
  { id: 'techSpec', en: 'Technical Specification Sheet', bn: 'টেকনিক্যাল স্পেসিফিকেশন শীট' },
  { id: 'invoice', en: 'Import Invoice / Proforma Invoice', bn: 'আমদানি চালান / প্রোফর্মা ইনভয়েস' },
  { id: 'catalogue', en: 'Product / Machine Catalogue', bn: 'পণ্য / যন্ত্রপাতি ক্যাটালগ' },
];

interface HsCodeApplication {
  id: string;
  bin: string;
  licenseNo: string;
  licenseeName: string;
  requestedCode: string;
  category: HSCategory;
  description: string;
  justification: string;
  submittedDate: string;
  stage: AppStage;
  existsInDb: boolean;
  assignedRo: string;
  roDeadline: string;
  roOverdue: boolean;
  roNote?: string;
  acdcDeadline?: string;
  acdcOverdue?: boolean;
  acdcNote?: string;
  moreDocsRequested?: boolean;
  commissionerNote?: string;
  disapprovalReason?: string;
}

const stageOrder: AppStage[] = ['ro-review', 'acdc-review', 'commissioner-review', 'included'];

const seedApplications: HsCodeApplication[] = [
  {
    id: 'HSA-2026-4401', bin: '008834521-0705', licenseNo: 'BL-2026-70211', licenseeName: 'Comfort Knit Composite Ltd.',
    requestedCode: '9606.22.00', category: 'raw-material', description: 'Buttons of base metal, for garment finishing',
    justification: 'New order requires metal snap buttons not previously listed against this license.', submittedDate: '20 Jul 2026',
    stage: 'ro-review', existsInDb: false, assignedRo: officerPool[0].en, roDeadline: '22 Jul 2026', roOverdue: true,
  },
  {
    id: 'HSA-2026-4388', bin: '007745210-0604', licenseNo: 'BL-2026-70198', licenseeName: 'Silver Line Garments Ltd.',
    requestedCode: '8451.40.00', category: 'machine', description: 'Additional dyeing and finishing machine for expanded capacity',
    justification: 'Factory expansion adds a second finishing line; machine already exists in DB, tagged for verification of new import.', submittedDate: '17 Jul 2026',
    stage: 'acdc-review', existsInDb: true, assignedRo: officerPool[1].en, roDeadline: '19 Jul 2026', roOverdue: false,
    roNote: 'Requested HS Code verified against database; matches declared machine specification. Forwarded for AC/DC verification.',
    acdcDeadline: '24 Jul 2026', acdcOverdue: false, moreDocsRequested: true,
  },
  {
    id: 'HSA-2026-4350', bin: '004562178-0206', licenseNo: 'BL-2026-04521', licenseeName: 'Square Fashions Ltd.',
    requestedCode: '9607.19.00', category: 'raw-material', description: 'Slide fasteners (zippers) for new denim product line',
    justification: 'Buyer has approved a new denim line requiring zippers not currently bound to this bond license.', submittedDate: '10 Jul 2026',
    stage: 'commissioner-review', existsInDb: true, assignedRo: officerPool[2].en, roDeadline: '13 Jul 2026', roOverdue: false,
    roNote: 'HS Code exists in database with matching description under other licensees. No discrepancy found.',
    acdcDeadline: '17 Jul 2026', acdcOverdue: false, acdcNote: 'Verified RO examination and supporting invoice. Recommended for approval.',
  },
  {
    id: 'HSA-2026-4290', bin: '003321456-0105', licenseNo: 'BL-2021-00934', licenseeName: 'DBL Group',
    requestedCode: '8447.11.00', category: 'machine', description: 'Additional circular knitting machine unit',
    justification: 'Capacity expansion — additional circular knitting machine imported to meet increased production demand.', submittedDate: '28 Jun 2026',
    stage: 'included', existsInDb: true, assignedRo: officerPool[0].en, roDeadline: '01 Jul 2026', roOverdue: false,
    roNote: 'Machine HS Code verified against Machinery Database; auto-tagged to existing raw material codes.',
    acdcDeadline: '05 Jul 2026', acdcOverdue: false, acdcNote: 'Verified. No objection. Forwarded to Commissioner.',
    commissionerNote: 'Approved. Consistent with declared production capacity increase.',
  },
  {
    id: 'HSA-2026-4265', bin: '009887766-0702', licenseNo: 'BL-2021-01204', licenseeName: 'Pacific Jeans Ltd.',
    requestedCode: '6204.62.00', category: 'finished-good', description: "Women's trousers, of cotton denim, not knitted",
    justification: 'Requesting addition without adequate machine/raw material cross-reference on file.', submittedDate: '15 Jun 2026',
    stage: 'disapproved', existsInDb: false, assignedRo: officerPool[1].en, roDeadline: '18 Jun 2026', roOverdue: false,
    roNote: 'HS Code not found in database. Manual verification requested from Bonder; description insufficiently specific.',
    acdcDeadline: '22 Jun 2026', acdcOverdue: false, acdcNote: 'Cross-reference to raw material/machine codes missing. Forwarded to Commissioner with concerns noted.',
    commissionerNote: 'Insufficient justification and missing cross-reference documentation.',
    disapprovalReason: 'Application does not establish a clear link between the requested finished-good HS Code and previously approved raw material / machine codes on this license.',
  },
];

function UploadRow({ label, uploaded, onUpload, language }: { label: string; uploaded: boolean; onUpload: () => void; language: Language }) {
  const t = T[language];
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5">
      <div className="flex items-center gap-3">
        <span className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', uploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
          <Icon name={uploaded ? 'task_alt' : 'description'} className="text-[18px]" />
        </span>
        <span className="text-sm font-semibold text-[#1E293B]">{label}</span>
      </div>
      {uploaded ? (
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{t.uploaded}</span>
      ) : (
        <button type="button" onClick={onUpload} className="flex items-center gap-1.5 rounded-lg border border-[#0A4D8C] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
          <Icon name="upload" className="text-[15px]" />
          {t.uploadDoc}
        </button>
      )}
    </div>
  );
}

const initialForm = { licenseBin: '', requestedCode: '', category: 'raw-material' as HSCategory, description: '', justification: '' };

export function HsCodeManagement({ language, onDone }: HsCodeManagementProps) {
  const t = T[language];
  const [applications, setApplications] = useState<HsCodeApplication[]>(seedApplications);
  const [view, setView] = useState<'database' | 'form' | 'queue'>('database');
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [docs, setDocs] = useState<Record<string, boolean>>(Object.fromEntries(documentDefs.map((d) => [d.id, false])));
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | HSCategory>('all');
  const [detailCode, setDetailCode] = useState<HSCodeRecord | null>(null);

  const [queueFilter, setQueueFilter] = useState<'all' | 'in-progress' | 'included' | 'disapproved'>('all');
  const [selected, setSelected] = useState<HsCodeApplication | null>(null);
  const [resubmitDraft, setResubmitDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filteredDb = hsCodeDatabase.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.code.toLowerCase().includes(q) && !r.descriptionEn.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const pendingCount = applications.filter((a) => a.stage !== 'included' && a.stage !== 'disapproved').length;
  const filteredQueue = applications.filter((a) => {
    if (queueFilter === 'all') return true;
    if (queueFilter === 'included') return a.stage === 'included';
    if (queueFilter === 'disapproved') return a.stage === 'disapproved';
    return a.stage !== 'included' && a.stage !== 'disapproved';
  });

  const updateApp = (id: string, patch: Partial<HsCodeApplication>) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const requiredByStep: Record<number, (keyof typeof form)[]> = {
    0: ['licenseBin', 'requestedCode', 'description'],
    1: ['justification'],
    2: [],
  };
  const validateStep = (step: number) => {
    const nextErrors: Record<string, boolean> = {};
    (requiredByStep[step] ?? []).forEach((f) => {
      if (!form[f]) nextErrors[f as string] = true;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, 2));
  };
  const existsInDb = hsCodeDatabase.some((r) => r.code.toLowerCase() === form.requestedCode.trim().toLowerCase());

  const handleSubmit = () => {
    const license = licenseOptions.find((l) => l.bin === form.licenseBin);
    if (!license) return;
    const id = `HSA-2026-${Math.floor(4500 + Math.random() * 400)}`;
    const newApp: HsCodeApplication = {
      id, bin: license.bin, licenseNo: license.licenseNo, licenseeName: license.name,
      requestedCode: form.requestedCode, category: form.category, description: form.description, justification: form.justification,
      submittedDate: '23 Jul 2026', stage: 'ro-review', existsInDb, assignedRo: officerPool[0].en, roDeadline: '26 Jul 2026', roOverdue: false,
    };
    setApplications((prev) => [newApp, ...prev]);
    setSubmittedId(id);
  };

  const openApp = (a: HsCodeApplication) => {
    setSelected(a);
    setResubmitDraft(a.justification);
  };

  if (submittedId) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check_circle" className="text-[36px]" />
          </span>
          <h1 className="text-xl font-bold text-[#1E293B]">{t.submittedTitle}</h1>
          <p className="max-w-md text-sm leading-relaxed text-[#64748B]">{t.submittedBody}</p>
          <div className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.applicationId}</p>
            <p className="text-lg font-bold text-[#0A4D8C]">{submittedId}</p>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              const app = applications.find((a) => a.id === submittedId);
              if (app) openApp(app);
              setSubmittedId(null);
              setView('queue');
              setForm(initialForm);
              setCurrentStep(0);
              setDocs(Object.fromEntries(documentDefs.map((d) => [d.id, false])));
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083E71]"
          >
            <Icon name="fact_check" className="text-[18px]" />
            {t.trackApplication}
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittedId(null);
              setView('database');
              setForm(initialForm);
              setCurrentStep(0);
              setDocs(Object.fromEntries(documentDefs.map((d) => [d.id, false])));
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-5 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]"
          >
            <Icon name="home" className="text-[18px]" />
            {t.backToDashboard}
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    const a = selected;
    const stageIndex = stageOrder.indexOf(a.stage);
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
        <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">{t.reviewTitle}</h2>
              <p className="text-xs text-[#64748B]">
                {a.id} · {a.licenseeName} · {a.requestedCode}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>

          {toast && (
            <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
              <Icon name="check_circle" className="text-[16px]" />
              {toast}
            </div>
          )}

          <div className="flex flex-col gap-3 px-5 py-5">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryColor[a.category]}`}>{categoryLabel(t, a.category)}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.existsInDb ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {a.existsInDb ? t.foundBadge : t.notFoundBadge}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#1E293B]">{a.description}</p>
              <p className="mt-1 text-xs text-[#64748B]">
                {t.assignedRo}: {a.assignedRo}
              </p>
            </div>

            {a.stage === 'disapproved' ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
                  <Icon name="cancel" className="text-[18px]" />
                  {t.stageLabels.disapproved}
                </p>
                <p className="mt-1 text-xs text-[#B91C1C]">{a.disapprovalReason}</p>
                <p className="mt-2 text-xs text-[#DC2626]">{t.disapprovedNotice}</p>
                <div className="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-red-300 bg-white p-3">
                  <p className="text-[11px] text-[#94A3B8]">{t.resubmitLabel}</p>
                  <Field label={t.updatedJustification}>
                    <textarea rows={3} value={resubmitDraft} onChange={(e) => setResubmitDraft(e.target.value)} className={`${inputClass} resize-none`} />
                  </Field>
                  <button
                    type="button"
                    onClick={() => {
                      if (resubmitDraft.trim() === a.justification.trim()) {
                        flash(t.resubmitUnchanged);
                        return;
                      }
                      updateApp(a.id, {
                        justification: resubmitDraft, stage: 'ro-review', disapprovalReason: undefined, commissionerNote: undefined,
                        acdcNote: undefined, acdcDeadline: undefined, acdcOverdue: false, moreDocsRequested: false,
                        roNote: undefined, roDeadline: '26 Jul 2026', roOverdue: false,
                      });
                    }}
                    className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]"
                  >
                    {t.resubmit}
                  </button>
                </div>
              </div>
            ) : (
              stageOrder.map((stage, i) => {
                const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'upcoming';
                return (
                  <div key={stage} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={[
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]',
                        ].join(' ')}
                      >
                        <Icon name={state === 'done' ? 'check' : 'circle'} className="text-[15px]" />
                      </span>
                      {i < stageOrder.length - 1 && <span className={`w-0.5 flex-1 ${state === 'done' ? 'bg-[#00A86B]' : 'bg-[#E2E8F0]'}`} style={{ minHeight: '16px' }} />}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className={['text-sm font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{t.stageLabels[stage]}</p>

                      {state === 'done' && stage === 'ro-review' && <p className="mt-0.5 text-xs text-[#64748B]">{a.roNote}</p>}
                      {state === 'done' && stage === 'acdc-review' && <p className="mt-0.5 text-xs text-[#64748B]">{a.acdcNote}</p>}
                      {state === 'done' && stage === 'commissioner-review' && <p className="mt-0.5 text-xs text-[#64748B]">{a.commissionerNote}</p>}

                      {state === 'current' && stage === 'ro-review' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          {a.roOverdue ? (
                            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#DC2626]">
                              <Icon name="warning" className="text-[15px]" />
                              {t.overdue}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1.5 text-[11px] text-emerald-700">
                              <Icon name="schedule" className="text-[15px]" />
                              {t.deadline}: {a.roDeadline} ({t.onTrack})
                            </p>
                          )}
                          <Field label={t.roNoteLabel}>
                            <textarea rows={3} value={a.roNote ?? ''} onChange={(e) => updateApp(a.id, { roNote: e.target.value })} placeholder={t.roNotePlaceholder} className={`${inputClass} resize-none`} />
                          </Field>
                          <button
                            type="button"
                            disabled={!a.roNote?.trim()}
                            onClick={() => updateApp(a.id, { stage: 'acdc-review', acdcDeadline: '30 Jul 2026', acdcOverdue: false })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                          >
                            {t.forwardToAcdc}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'acdc-review' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          {a.acdcOverdue ? (
                            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#DC2626]">
                              <Icon name="warning" className="text-[15px]" />
                              {t.overdue}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1.5 text-[11px] text-emerald-700">
                              <Icon name="schedule" className="text-[15px]" />
                              {t.deadline}: {a.acdcDeadline} ({t.onTrack})
                            </p>
                          )}
                          <Field label={t.acdcNoteLabel}>
                            <textarea rows={3} value={a.acdcNote ?? ''} onChange={(e) => updateApp(a.id, { acdcNote: e.target.value })} placeholder={t.acdcNotePlaceholder} className={`${inputClass} resize-none`} />
                          </Field>
                          {!a.moreDocsRequested ? (
                            <button type="button" onClick={() => { updateApp(a.id, { moreDocsRequested: true }); flash(t.requestMoreDocsSent); }} className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:underline">
                              <Icon name="mail" className="text-[14px]" />
                              {t.requestMoreDocs}
                            </button>
                          ) : (
                            <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                              <span className="text-[11px] font-medium text-amber-700">{t.moreDocsPending}</span>
                              <button type="button" onClick={() => updateApp(a.id, { moreDocsRequested: false })} className="rounded-full border border-amber-600 px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100">
                                {t.docsReceived}
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            disabled={!a.acdcNote?.trim() || a.moreDocsRequested}
                            onClick={() => updateApp(a.id, { stage: 'commissioner-review' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                          >
                            {t.forwardToCommissioner}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'commissioner-review' && (
                        <CommissionerPanel
                          t={t}
                          note={a.commissionerNote ?? ''}
                          onNoteChange={(v) => updateApp(a.id, { commissionerNote: v })}
                          onApprove={() => {
                            flash(t.includedNotice);
                            updateApp(a.id, { stage: 'included' });
                          }}
                          onDisapprove={(reason) => updateApp(a.id, { stage: 'disapproved', disapprovalReason: reason })}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {a.stage === 'included' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                  <Icon name="workspace_premium" className="text-[18px]" />
                  {t.stageLabels.included}
                </p>
                <p className="mt-1 text-xs text-emerald-800">{t.includedNotice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'queue') {
    return (
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <button type="button" onClick={() => setView('database')} className="hover:text-[#0A4D8C]">
            {t.pageTitle}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.pendingApplications}</span>
        </nav>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">{t.queueTitle}</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.queueSubtitle}</p>
          </div>
          <button type="button" onClick={() => setView('database')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.back}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'in-progress', 'included', 'disapproved'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setQueueFilter(f)}
              className={['rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', queueFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
            >
              {f === 'all' ? t.filterAll : f === 'in-progress' ? t.filterInProgress : f === 'included' ? t.filterIncluded : t.filterDisapproved}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredQueue.map((a) => (
            <button key={a.id} type="button" onClick={() => openApp(a)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name="tag" className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{a.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.stage === 'included' ? 'bg-emerald-50 text-emerald-700' : a.stage === 'disapproved' ? 'bg-red-50 text-[#DC2626]' : 'bg-blue-50 text-[#0A4D8C]'}`}>
                    {t.stageLabels[a.stage]}
                  </span>
                  {a.roOverdue && a.stage === 'ro-review' && <Icon name="warning" className="text-[15px] text-[#DC2626]" />}
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                  {a.licenseeName} · {a.requestedCode}
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  {a.description} · {a.submittedDate}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white">{t.review}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'form') {
    const wizardSteps = [t.stepLicense, t.stepJustification, t.stepReview];
    const selectedLicense = licenseOptions.find((l) => l.bin === form.licenseBin);
    return (
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <button type="button" onClick={() => setView('database')} className="hover:text-[#0A4D8C]">
            {t.pageTitle}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.newApplication}</span>
        </nav>

        <div className="flex items-center gap-2">
          {wizardSteps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${i < currentStep ? 'bg-[#00A86B] text-white' : i === currentStep ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]'}`}>
                {i < currentStep ? <Icon name="check" className="text-[16px]" /> : i + 1}
              </span>
              <span className={`text-xs font-semibold ${i === currentStep ? 'text-[#1E293B]' : 'text-[#94A3B8]'}`}>{label}</span>
              {i < wizardSteps.length - 1 && <span className="mx-1 h-px flex-1 bg-[#E2E8F0]" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          {currentStep === 0 && (
            <div className="flex flex-col gap-5">
              <Field label={t.selectLicense} required error={errors.licenseBin ? t.required : undefined}>
                <select value={form.licenseBin} onChange={(e) => set('licenseBin', e.target.value)} className={`${inputClass} ${errors.licenseBin ? errorInputClass : ''}`}>
                  <option value="">{t.selectLicensePlaceholder}</option>
                  {licenseOptions.map((l) => (
                    <option key={l.bin} value={l.bin}>
                      {l.licenseNo} — {l.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label={t.requestedCode} required error={errors.requestedCode ? t.required : undefined}>
                  <input value={form.requestedCode} onChange={(e) => set('requestedCode', e.target.value)} placeholder={t.requestedCodePlaceholder} className={`${inputClass} ${errors.requestedCode ? errorInputClass : ''}`} />
                </Field>
                <Field label={t.codeCategory}>
                  <PillGroup
                    value={form.category}
                    onChange={(v) => set('category', v)}
                    options={[
                      { value: 'raw-material', label: t.rawMaterial },
                      { value: 'finished-good', label: t.finishedGood },
                      { value: 'machine', label: t.machine },
                    ]}
                  />
                </Field>
              </div>
              <Field label={t.codeDescription} required error={errors.description ? t.required : undefined}>
                <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder={t.codeDescriptionPlaceholder} className={`${inputClass} resize-none ${errors.description ? errorInputClass : ''}`} />
              </Field>
              {form.requestedCode.trim() && (
                <div className={`flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-xs ${existsInDb ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  <Icon name={existsInDb ? 'check_circle' : 'info'} className="mt-0.5 text-[16px]" />
                  <div>
                    <p className="font-semibold">{t.verifying}</p>
                    <p>{existsInDb ? t.foundInDb : t.notFoundInDb}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex flex-col gap-5">
              <Field label={t.justificationLabel} required error={errors.justification ? t.required : undefined}>
                <textarea rows={4} value={form.justification} onChange={(e) => set('justification', e.target.value)} placeholder={t.justificationPlaceholder} className={`${inputClass} resize-none ${errors.justification ? errorInputClass : ''}`} />
              </Field>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-[#334155]">{t.attachSupportingDocs}</p>
                {documentDefs.map((d) => (
                  <UploadRow key={d.id} label={d[language]} uploaded={docs[d.id]} language={language} onUpload={() => setDocs((prev) => ({ ...prev, [d.id]: true }))} />
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-3">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-[#E2E8F0] p-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] text-[#94A3B8]">{t.selectLicense}</dt>
                  <dd className="text-sm font-semibold text-[#1E293B]">{selectedLicense ? `${selectedLicense.licenseNo} — ${selectedLicense.name}` : '—'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#94A3B8]">{t.requestedCode}</dt>
                  <dd className="text-sm font-semibold text-[#1E293B]">{form.requestedCode || '—'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#94A3B8]">{t.codeCategory}</dt>
                  <dd className="text-sm font-semibold text-[#1E293B]">{categoryLabel(t, form.category)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#94A3B8]">{t.verifying}</dt>
                  <dd className={`text-sm font-semibold ${existsInDb ? 'text-emerald-700' : 'text-amber-700'}`}>{existsInDb ? t.foundBadge : t.notFoundBadge}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] text-[#94A3B8]">{t.codeDescription}</dt>
                  <dd className="text-sm text-[#1E293B]">{form.description || '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] text-[#94A3B8]">{t.justificationLabel}</dt>
                  <dd className="text-sm text-[#1E293B]">{form.justification || '—'}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-5">
            <button
              type="button"
              onClick={currentStep === 0 ? () => setView('database') : () => setCurrentStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]"
            >
              <Icon name="arrow_back" className="text-[16px]" />
              {t.back}
            </button>
            {currentStep === 2 ? (
              <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#048f5c]">
                {t.submit}
                <Icon name="send" className="text-[16px]" />
              </button>
            ) : (
              <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083E71]">
                {t.next}
                <Icon name="arrow_forward" className="text-[16px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6">
      {detailCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6" onClick={() => setDetailCode(null)}>
          <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-base font-bold text-[#1E293B]">{t.detailTitle}</h2>
              <button type="button" onClick={() => setDetailCode(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto px-5 py-5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#0A4D8C]">{detailCode.code}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryColor[detailCode.category]}`}>{categoryLabel(t, detailCode.category)}</span>
              </div>
              <p className="text-sm text-[#334155]">{detailCode[language === 'en' ? 'descriptionEn' : 'descriptionBn']}</p>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.source}</p>
                <p className="text-sm text-[#1E293B]">{detailCode.source === 'asycuda' ? t.asycudaSynced : t.cbcApproved}</p>
              </div>
              {detailCode.taggedCodes.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.taggedCodes}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {detailCode.taggedCodes.map((c) => (
                      <span key={c} className="rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[11px] font-semibold text-[#334155]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {t.approvedFor} ({detailCode.approvedFor.length} {t.licensees})
                </p>
                <ul className="mt-1 flex flex-col gap-1">
                  {detailCode.approvedFor.map((n) => (
                    <li key={n} className="text-sm text-[#1E293B]">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={() => setDetailCode(null)} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
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
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" onClick={() => { setForm(initialForm); setCurrentStep(0); setErrors({}); setDocs(Object.fromEntries(documentDefs.map((d) => [d.id, false]))); setView('form'); }} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
            <Icon name="add" className="text-[16px]" />
            {t.newApplication}
          </button>
          <button type="button" onClick={() => setView('queue')} className="relative inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="fact_check" className="text-[16px]" />
            {t.pendingApplications}
            {pendingCount > 0 && <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">{pendingCount}</span>}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
        <Icon name="sync" className="text-[18px]" />
        {t.syncBanner} · {t.lastSync}: 23 Jul 2026, 06:00
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className={`${inputClass} pl-9`} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'raw-material', 'finished-good', 'machine'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={['rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors', categoryFilter === c ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
            >
              {c === 'all' ? t.allCategories : categoryLabel(t, c)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA] text-left text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">{t.code}</th>
              <th className="px-4 py-3">{t.description}</th>
              <th className="px-4 py-3">{t.category}</th>
              <th className="px-4 py-3">{t.approvedFor}</th>
              <th className="px-4 py-3">{t.source}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDb.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#94A3B8]">
                  {t.noResults}
                </td>
              </tr>
            ) : (
              filteredDb.map((r) => (
                <tr key={r.code} onClick={() => setDetailCode(r)} className="cursor-pointer border-b border-[#F1F5F9] transition-colors last:border-0 hover:bg-[#F5F7FA]">
                  <td className="px-4 py-3 font-semibold text-[#0A4D8C]">{r.code}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-[#334155]">{r[language === 'en' ? 'descriptionEn' : 'descriptionBn']}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryColor[r.category]}`}>{categoryLabel(t, r.category)}</span>
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">
                    {r.approvedFor.length} {t.licensees}
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">{r.source === 'asycuda' ? t.asycudaSynced : t.cbcApproved}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommissionerPanel({
  t,
  note,
  onNoteChange,
  onApprove,
  onDisapprove,
}: {
  t: (typeof T)['en'];
  note: string;
  onNoteChange: (v: string) => void;
  onApprove: () => void;
  onDisapprove: (reason: string) => void;
}) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      <Field label={t.commissionerNoteLabel}>
        <textarea rows={3} value={note} onChange={(e) => onNoteChange(e.target.value)} placeholder={t.commissionerNotePlaceholder} className={`${inputClass} resize-none`} />
      </Field>
      {showReason && (
        <Field label={t.disapprovalReasonLabel} error={error}>
          <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputClass} resize-none`} />
        </Field>
      )}
      <div className="flex gap-2">
        {!showReason ? (
          <button type="button" onClick={() => setShowReason(true)} className="rounded-full border border-[#DC2626] px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50">
            {t.disapprove}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!reason.trim()) {
                setError(t.disapprovalReasonRequired);
                return;
              }
              onDisapprove(reason);
            }}
            className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]"
          >
            {t.disapprove}
          </button>
        )}
        <button type="button" onClick={onApprove} className="rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]">
          {t.approve}
        </button>
      </div>
    </div>
  );
}
