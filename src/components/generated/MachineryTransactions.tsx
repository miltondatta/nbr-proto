import { useState } from 'react';

type Language = 'en' | 'bn';
type TransactionType = 'purchase' | 'sale' | 'decommission';
type Stage = 'assignment' | 'doc-verification' | 'inspection' | 'final-report' | 'approval' | 'included' | 'excluded' | 'disapproved';
type MachineCategory = 'mother' | 'auxiliary';

interface MachineryTransactionsProps {
  language: Language;
  onDone: () => void;
  transactionType: TransactionType;
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

const typeMeta = {
  purchase: { icon: 'add_shopping_cart', accent: '#00A86B' },
  sale: { icon: 'sell', accent: '#1E88E5' },
  decommission: { icon: 'power_off', accent: '#DC2626' },
};

const T = {
  en: {
    home: 'Home',
    machineryManagement: 'Machinery Management',
    pageTitle: { purchase: 'Machinery Purchase', sale: 'Machinery Sale', decommission: 'Machinery Decommission' },
    subtitle: {
      purchase: 'Apply for CBC approval to add a newly purchased machine to your Bond License. On approval the machine is auto-included in the Machinery Database and your Entitlement is updated.',
      sale: 'Apply for CBC approval to sell an existing bonded machine. On approval the machine is verified against the VAT challan and removed from the Machinery Database, with your Entitlement updated.',
      decommission: 'Apply for CBC approval to decommission an existing bonded machine. On approval the machine is removed from the Machinery Database, with your Entitlement updated.',
    },
    backToDashboard: 'Back to Dashboard',
    newApplication: { purchase: 'New Purchase Application', sale: 'New Sale Application', decommission: 'New Decommission Application' },
    pendingApplications: 'Pending Applications',
    // wizard
    stepMachine: 'Machine Details',
    stepDocs: 'Documents & Attachments',
    stepReview: 'Review & Submit',
    selectLicense: 'Bond License',
    selectLicensePlaceholder: 'Select the license this transaction applies to',
    selectMachine: 'Select Machine',
    selectMachinePlaceholder: 'Select the bonded machine to transact',
    hsCode: 'HS Code',
    hsCodePlaceholder: 'e.g. 8452.21.00',
    machineDescription: 'Machine Description',
    machineDescriptionPlaceholder: 'Describe the machine…',
    brand: 'Brand',
    mfgYear: 'Manufacturing Year',
    countryOfOrigin: 'Country of Origin',
    machineCategory: 'Machine Category',
    motherMachine: 'Mother Machine',
    auxiliaryMachine: 'Auxiliary Machine',
    capacity: 'Annual Production Capacity',
    reasonLabel: { purchase: 'Justification for Purchase', sale: 'Reason for Sale', decommission: 'Reason for Decommission' },
    reasonPlaceholder: { purchase: 'Explain why this machine is being added…', sale: 'Explain why this machine is being sold…', decommission: 'Explain why this machine is being decommissioned…' },
    vatChallanLabel: 'VAT Challan Number',
    vatChallanPlaceholder: 'e.g. VAT-2026-887421',
    attachSupportingDocs: 'Supporting Documents',
    uploadDoc: 'Upload',
    uploaded: 'Uploaded',
    back: 'Back',
    next: 'Save & Continue',
    submit: 'Submit Application',
    required: 'Required',
    submittedTitle: 'Application Submitted',
    submittedBody: 'Your application has been received and auto-assigned to a Revenue Officer for zonal review.',
    applicationId: 'Application ID',
    trackApplication: 'Track this Application',
    // queue
    queueTitle: { purchase: 'Machinery Purchase — Review Queue', sale: 'Machinery Sale — Review Queue', decommission: 'Machinery Decommission — Review Queue' },
    queueSubtitle: 'Sequential review pipeline — RO/ARO examination, Lien Bank & audit verification, factory inspection, final report, ADC/JC approval.',
    filterAll: 'All',
    filterInProgress: 'In Progress',
    filterCompleted: 'Completed',
    filterDisapproved: 'Disapproved',
    review: 'Review',
    reviewTitle: 'Review Application',
    stageLabels: {
      assignment: 'e-Assignment',
      'doc-verification': 'Document Verification',
      inspection: 'Factory Inspection',
      'final-report': 'Final e-Applicant Report',
      approval: 'ADC/JC Approval',
      included: 'Machinery Database — Included',
      excluded: 'Machinery Database — Excluded',
      disapproved: 'Disapproved',
    },
    assignOfficer: 'Assign RO/ARO (by Zone)',
    assignBtn: 'Assign & Notify',
    notAssigned: 'Not yet assigned',
    assignedTo: 'Assigned to',
    examinationNoteLabel: 'RO/ARO Examination Note (e-Note & Nothi)',
    examinationNotePlaceholder: 'Document examination findings…',
    addNote: 'Add e-Note',
    noteRecorded: 'e-Note recorded.',
    lienBankTitle: 'Lien Bank e-Verification Request',
    markLienVerified: 'Mark Lien Bank Verified',
    lienVerified: 'Verified',
    auditCheckTitle: 'e-Licensee Status & Audit Check',
    runAuditCheck: 'Run Licensee / Audit Status Check',
    auditCheckResult: 'No conflicting license found. Audit status: Compliant.',
    requestMoreDocs: 'Request Additional Documents',
    requestMoreDocsSent: 'Notification sent to Bonder requesting additional documents.',
    proceedToInspection: 'Proceed to Factory Inspection',
    teamFormationTitle: 'Inspection Team Formation',
    selectOfficers: 'Select inspection team members',
    formTeam: 'Form Team & Notify Members',
    teamFormed: 'Team Formed',
    calendarTitle: 'Inspection e-Calendar',
    calendarHint: 'Amber dates already have another inspection scheduled.',
    selectedDate: 'Selected Date',
    confirmSchedule: 'Confirm Schedule & Notify',
    visitNotesLabel: 'e-Factory Visit — Mobile Inspector Notes',
    visitNotesPlaceholder: 'Field observations recorded at the time of inspection…',
    criteriaTitle: 'Inspection Criteria',
    pass: 'Pass',
    fail: 'Fail',
    weightedScore: 'Weighted Score',
    submitInspectionReport: 'Submit Inspection e-Report',
    compliant: 'Compliant',
    nonCompliant: 'Non-Compliant',
    noncomplianceNotice: 'Noncompliance notification sent to Bonder for failed criteria.',
    summaryTitle: 'Application Summary',
    finalReportNoteLabel: 'RO/ARO Note to ADC/JC',
    finalReportNotePlaceholder: 'Summarize findings and recommendation for ADC/JC…',
    forwardToAdcJc: 'Forward Final Report to ADC/JC',
    adcNoteLabel: 'ADC/JC e-Note',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalReasonRequired: 'A reason is required to disapprove.',
    approvalLetterNo: 'e-Approval Letter No.',
    includedNotice: { purchase: 'Machine auto-included in Machinery Database. Bonder Profile and e-Entitlement updated.', sale: '', decommission: '' },
    excludedNotice: 'Machine verified against VAT Challan and removed from Machinery Database. Bonder Profile and e-Entitlement updated.',
    entitlementUpdate: 'e-Entitlement Update',
    viewApprovalLetter: 'View e-Approval Letter',
    disapprovedNotice: 'Bonder auto-notified of disapproval.',
    close: 'Close',
    letterTitle: 'e-Approval Letter',
    govLine1: 'Government of the People’s Republic of Bangladesh',
    govLine2: 'National Board of Revenue — Customs Bond Commissionerate',
    authorizedItem: 'Authorized Item',
    print: 'Print',
    download: 'Download',
    computerGenerated: 'This is a computer-generated document, valid without physical signature.',
  },
  bn: {
    home: 'হোম',
    machineryManagement: 'যন্ত্রপাতি ব্যবস্থাপনা',
    pageTitle: { purchase: 'যন্ত্রপাতি ক্রয়', sale: 'যন্ত্রপাতি বিক্রয়', decommission: 'যন্ত্রপাতি অবলুপ্তকরণ' },
    subtitle: {
      purchase: 'নতুন ক্রয়কৃত যন্ত্রপাতি আপনার বন্ড লাইসেন্সে যুক্ত করতে সিবিসি অনুমোদনের জন্য আবেদন করুন। অনুমোদনের পর যন্ত্রপাতিটি স্বয়ংক্রিয়ভাবে যন্ত্রপাতি ডেটাবেজে অন্তর্ভুক্ত হয় এবং আপনার এনটাইটেলমেন্ট হালনাগাদ হয়।',
      sale: 'একটি বিদ্যমান বন্ডেড যন্ত্রপাতি বিক্রয়ের জন্য সিবিসি অনুমোদনের আবেদন করুন। অনুমোদনের পর যন্ত্রপাতিটি ভ্যাট চালান যাচাই করে যন্ত্রপাতি ডেটাবেজ থেকে অপসারণ করা হয় এবং আপনার এনটাইটেলমেন্ট হালনাগাদ হয়।',
      decommission: 'একটি বিদ্যমান বন্ডেড যন্ত্রপাতি অবলুপ্তকরণের জন্য সিবিসি অনুমোদনের আবেদন করুন। অনুমোদনের পর যন্ত্রপাতিটি যন্ত্রপাতি ডেটাবেজ থেকে অপসারণ করা হয় এবং আপনার এনটাইটেলমেন্ট হালনাগাদ হয়।',
    },
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    newApplication: { purchase: 'নতুন ক্রয় আবেদন', sale: 'নতুন বিক্রয় আবেদন', decommission: 'নতুন অবলুপ্তকরণ আবেদন' },
    pendingApplications: 'অমীমাংসিত আবেদন',
    stepMachine: 'যন্ত্রপাতির বিবরণ',
    stepDocs: 'নথি ও সংযুক্তি',
    stepReview: 'পর্যালোচনা ও জমা',
    selectLicense: 'বন্ড লাইসেন্স',
    selectLicensePlaceholder: 'যে লাইসেন্সের জন্য এই লেনদেন প্রযোজ্য তা নির্বাচন করুন',
    selectMachine: 'যন্ত্রপাতি নির্বাচন করুন',
    selectMachinePlaceholder: 'লেনদেনের জন্য বন্ডেড যন্ত্রপাতি নির্বাচন করুন',
    hsCode: 'এইচএস কোড',
    hsCodePlaceholder: 'যেমন: ৮৪৫২.২১.০০',
    machineDescription: 'যন্ত্রপাতির বিবরণ',
    machineDescriptionPlaceholder: 'যন্ত্রপাতির বিবরণ দিন…',
    brand: 'ব্র্যান্ড',
    mfgYear: 'উৎপাদন বছর',
    countryOfOrigin: 'উৎপত্তি দেশ',
    machineCategory: 'যন্ত্রপাতির ক্যাটাগরি',
    motherMachine: 'মাদার মেশিন',
    auxiliaryMachine: 'অক্সিলিয়ারি মেশিন',
    capacity: 'বার্ষিক উৎপাদন সক্ষমতা',
    reasonLabel: { purchase: 'ক্রয়ের যৌক্তিকতা', sale: 'বিক্রয়ের কারণ', decommission: 'অবলুপ্তকরণের কারণ' },
    reasonPlaceholder: { purchase: 'কেন এই যন্ত্রপাতি যুক্ত করা হচ্ছে তা ব্যাখ্যা করুন…', sale: 'কেন এই যন্ত্রপাতি বিক্রয় করা হচ্ছে তা ব্যাখ্যা করুন…', decommission: 'কেন এই যন্ত্রপাতি অবলুপ্ত করা হচ্ছে তা ব্যাখ্যা করুন…' },
    vatChallanLabel: 'ভ্যাট চালান নম্বর',
    vatChallanPlaceholder: 'যেমন: VAT-2026-887421',
    attachSupportingDocs: 'সহায়ক নথি',
    uploadDoc: 'আপলোড',
    uploaded: 'আপলোড হয়েছে',
    back: 'পূর্ববর্তী',
    next: 'সংরক্ষণ করে এগিয়ে যান',
    submit: 'আবেদন জমা দিন',
    required: 'আবশ্যক',
    submittedTitle: 'আবেদন জমা হয়েছে',
    submittedBody: 'আপনার আবেদন গৃহীত হয়েছে এবং জোনভিত্তিক পর্যালোচনার জন্য স্বয়ংক্রিয়ভাবে একজন রেভিনিউ অফিসারকে নিয়োগ করা হয়েছে।',
    applicationId: 'আবেদন আইডি',
    trackApplication: 'এই আবেদনটি ট্র্যাক করুন',
    queueTitle: { purchase: 'যন্ত্রপাতি ক্রয় — পর্যালোচনা সারি', sale: 'যন্ত্রপাতি বিক্রয় — পর্যালোচনা সারি', decommission: 'যন্ত্রপাতি অবলুপ্তকরণ — পর্যালোচনা সারি' },
    queueSubtitle: 'ধারাবাহিক পর্যালোচনা প্রক্রিয়া — আরও/এআরও পরীক্ষা, লিয়েন ব্যাংক ও নিরীক্ষা যাচাই, কারখানা পরিদর্শন, চূড়ান্ত প্রতিবেদন, এডিসি/জেসি অনুমোদন।',
    filterAll: 'সকল',
    filterInProgress: 'চলমান',
    filterCompleted: 'সম্পন্ন',
    filterDisapproved: 'অননুমোদিত',
    review: 'পর্যালোচনা',
    reviewTitle: 'আবেদন পর্যালোচনা',
    stageLabels: {
      assignment: 'e-নিয়োগ',
      'doc-verification': 'নথি যাচাইকরণ',
      inspection: 'কারখানা পরিদর্শন',
      'final-report': 'চূড়ান্ত আবেদনকারী প্রতিবেদন',
      approval: 'এডিসি/জেসি অনুমোদন',
      included: 'যন্ত্রপাতি ডেটাবেজ — অন্তর্ভুক্ত',
      excluded: 'যন্ত্রপাতি ডেটাবেজ — বাদ',
      disapproved: 'অননুমোদিত',
    },
    assignOfficer: 'আরও/এআরও নিয়োগ (জোন অনুযায়ী)',
    assignBtn: 'নিয়োগ করে অবহিত করুন',
    notAssigned: 'এখনও নিয়োগ হয়নি',
    assignedTo: 'দায়িত্বপ্রাপ্ত',
    examinationNoteLabel: 'আরও/এআরও পরীক্ষা মন্তব্য (e-নোট ও নথি)',
    examinationNotePlaceholder: 'পরীক্ষার ফলাফল লিখুন…',
    addNote: 'e-নোট যোগ করুন',
    noteRecorded: 'e-নোট রেকর্ড করা হয়েছে।',
    lienBankTitle: 'লিয়েন ব্যাংক ই-যাচাইকরণ অনুরোধ',
    markLienVerified: 'লিয়েন ব্যাংক যাচাইকৃত চিহ্নিত করুন',
    lienVerified: 'যাচাইকৃত',
    auditCheckTitle: 'ই-লাইসেন্সি অবস্থা ও নিরীক্ষা যাচাই',
    runAuditCheck: 'লাইসেন্সি / নিরীক্ষা অবস্থা যাচাই চালান',
    auditCheckResult: 'কোনো সাংঘর্ষিক লাইসেন্স পাওয়া যায়নি। নিরীক্ষা অবস্থা: সম্মত।',
    requestMoreDocs: 'অতিরিক্ত নথি অনুরোধ',
    requestMoreDocsSent: 'বন্ডারকে অতিরিক্ত নথির অনুরোধ পাঠানো হয়েছে।',
    proceedToInspection: 'কারখানা পরিদর্শনে এগিয়ে যান',
    teamFormationTitle: 'পরিদর্শন দল গঠন',
    selectOfficers: 'পরিদর্শন দলের সদস্য নির্বাচন করুন',
    formTeam: 'দল গঠন করে সদস্যদের অবহিত করুন',
    teamFormed: 'দল গঠিত হয়েছে',
    calendarTitle: 'পরিদর্শন ই-ক্যালেন্ডার',
    calendarHint: 'অ্যাম্বার তারিখগুলোতে ইতিমধ্যে অন্য একটি পরিদর্শন নির্ধারিত আছে।',
    selectedDate: 'নির্বাচিত তারিখ',
    confirmSchedule: 'সময়সূচি নিশ্চিত করুন ও অবহিত করুন',
    visitNotesLabel: 'e-ফ্যাক্টরি ভিজিট — মোবাইল ইন্সপেক্টর নোট',
    visitNotesPlaceholder: 'পরিদর্শনের সময় রেকর্ড করা পর্যবেক্ষণ…',
    criteriaTitle: 'পরিদর্শন মানদণ্ড',
    pass: 'উত্তীর্ণ',
    fail: 'অনুত্তীর্ণ',
    weightedScore: 'ওজনযুক্ত স্কোর',
    submitInspectionReport: 'পরিদর্শন ই-প্রতিবেদন জমা দিন',
    compliant: 'সম্মত',
    nonCompliant: 'অসম্মত',
    noncomplianceNotice: 'অনুত্তীর্ণ মানদণ্ডের জন্য বন্ডারকে অসম্মতি বিজ্ঞপ্তি পাঠানো হয়েছে।',
    summaryTitle: 'আবেদনের সারসংক্ষেপ',
    finalReportNoteLabel: 'এডিসি/জেসির প্রতি আরও/এআরও নোট',
    finalReportNotePlaceholder: 'এডিসি/জেসির জন্য ফলাফল ও সুপারিশ সংক্ষিপ্ত করুন…',
    forwardToAdcJc: 'এডিসি/জেসির কাছে চূড়ান্ত প্রতিবেদন ফরওয়ার্ড করুন',
    adcNoteLabel: 'এডিসি/জেসি e-নোট',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalReasonRequired: 'অননুমোদনের জন্য একটি কারণ আবশ্যক।',
    approvalLetterNo: 'e-অনুমোদন পত্র নং',
    includedNotice: { purchase: 'যন্ত্রপাতি স্বয়ংক্রিয়ভাবে যন্ত্রপাতি ডেটাবেজে অন্তর্ভুক্ত হয়েছে। বন্ডার প্রোফাইল ও ই-এনটাইটেলমেন্ট হালনাগাদ হয়েছে।', sale: '', decommission: '' },
    excludedNotice: 'যন্ত্রপাতিটি ভ্যাট চালান যাচাই করে যন্ত্রপাতি ডেটাবেজ থেকে অপসারণ করা হয়েছে। বন্ডার প্রোফাইল ও ই-এনটাইটেলমেন্ট হালনাগাদ হয়েছে।',
    entitlementUpdate: 'ই-এনটাইটেলমেন্ট হালনাগাদ',
    viewApprovalLetter: 'e-অনুমোদন পত্র দেখুন',
    disapprovedNotice: 'বন্ডারকে অননুমোদনের বিষয়ে স্বয়ংক্রিয়ভাবে অবহিত করা হয়েছে।',
    close: 'বন্ধ করুন',
    letterTitle: 'e-অনুমোদন পত্র',
    govLine1: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    govLine2: 'জাতীয় রাজস্ব বোর্ড — কাস্টমস বন্ড কমিশনারেট',
    authorizedItem: 'অনুমোদিত আইটেম',
    print: 'প্রিন্ট',
    download: 'ডাউনলোড',
    computerGenerated: 'এটি একটি কম্পিউটার-জেনারেটেড নথি, শারীরিক স্বাক্ষর ছাড়াই বৈধ।',
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
          className={['rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors', value === opt.value ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}
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

const licenseOptions = [
  { bin: '004562178-0206', licenseNo: 'BL-2026-04521', name: 'Square Fashions Ltd.' },
  { bin: '003321456-0105', licenseNo: 'BL-2021-00934', name: 'DBL Group' },
  { bin: '001987654-0102', licenseNo: 'BL-2020-00512', name: 'Ha-Meem Group' },
  { bin: '005871234-0208', licenseNo: 'BL-2022-01655', name: 'Envoy Textiles Ltd.' },
  { bin: '009887766-0702', licenseNo: 'BL-2021-01204', name: 'Pacific Jeans Ltd.' },
];

const existingMachines = [
  { id: 'MC-0001', hsCode: '8452.21.00', description: 'Automatic sewing machine unit, industrial (Juki)', bin: '004562178-0206', licenseNo: 'BL-2026-04521', name: 'Square Fashions Ltd.' },
  { id: 'MC-0005', hsCode: '8451.40.00', description: 'Dyeing, washing or finishing machine (Then Maschinen)', bin: '005871234-0208', licenseNo: 'BL-2022-01655', name: 'Envoy Textiles Ltd.' },
  { id: 'MC-0006', hsCode: '8452.21.00', description: 'Automatic sewing machine unit, industrial (Brother)', bin: '001987654-0102', licenseNo: 'BL-2020-00512', name: 'Ha-Meem Group' },
  { id: 'MC-0008', hsCode: '8447.11.00', description: 'Circular knitting machine (Terrot)', bin: '009887766-0702', licenseNo: 'BL-2021-01204', name: 'Pacific Jeans Ltd.' },
];

const documentDefs = [
  { id: 'invoice', en: 'Purchase / Sale Invoice', bn: 'ক্রয় / বিক্রয় চালান' },
  { id: 'techSpec', en: 'Technical Specification Sheet', bn: 'টেকনিক্যাল স্পেসিফিকেশন শীট' },
  { id: 'vatDoc', en: 'VAT Challan / Customs Bill of Entry', bn: 'ভ্যাট চালান / কাস্টমস বিল অব এন্ট্রি' },
];

const criteriaByType: Record<TransactionType, { id: string; en: string; bn: string; weight: number }[]> = {
  purchase: [
    { id: 'spec', en: 'Machine matches declared specification', bn: 'মেশিন ঘোষিত স্পেসিফিকেশনের সাথে মিলে', weight: 9 },
    { id: 'layout', en: 'Installation location matches factory layout', bn: 'স্থাপনের অবস্থান কারখানার লে-আউটের সাথে মিলে', weight: 6 },
    { id: 'safety', en: 'Safety compliance of installation', bn: 'স্থাপনার নিরাপত্তা সম্মতি', weight: 8 },
    { id: 'serial', en: 'Serial number / nameplate verification', bn: 'সিরিয়াল নম্বর / নেমপ্লেট যাচাই', weight: 7 },
  ],
  sale: [
    { id: 'presence', en: 'Machine physically present and matches DB record', bn: 'মেশিন বাস্তবে উপস্থিত ও ডেটাবেজ রেকর্ডের সাথে মিলে', weight: 8 },
    { id: 'vatMatch', en: 'VAT Challan value matches declared sale value', bn: 'ভ্যাট চালানের মূল্য ঘোষিত বিক্রয় মূল্যের সাথে মিলে', weight: 9 },
    { id: 'serial', en: 'Serial number / nameplate verification', bn: 'সিরিয়াল নম্বর / নেমপ্লেট যাচাই', weight: 7 },
  ],
  decommission: [
    { id: 'presence', en: 'Machine physically present and matches DB record', bn: 'মেশিন বাস্তবে উপস্থিত ও ডেটাবেজ রেকর্ডের সাথে মিলে', weight: 8 },
    { id: 'condition', en: 'End-of-life condition verified', bn: 'জীবনচক্রের সমাপ্তির অবস্থা যাচাইকৃত', weight: 7 },
    { id: 'serial', en: 'Serial number / nameplate verification', bn: 'সিরিয়াল নম্বর / নেমপ্লেট যাচাই', weight: 7 },
  ],
};

interface MachineApplication {
  id: string;
  transactionType: TransactionType;
  bin: string;
  licenseeName: string;
  licenseNo: string;
  hsCode: string;
  machineDescription: string;
  brand?: string;
  category: MachineCategory;
  reason: string;
  vatChallanNo?: string;
  submittedDate: string;
  stage: Stage;
  assignedOfficer?: string;
  lienBankVerified?: boolean;
  auditChecked?: boolean;
  docNote?: string;
  teamFormed?: boolean;
  inspectionTeamMembers?: string[];
  inspectionDate?: string;
  inspectionScheduled?: boolean;
  visitNotes?: string;
  inspectionScores?: Record<string, boolean>;
  inspectionSubmitted?: boolean;
  inspectionCompliant?: boolean;
  inspectionPct?: number;
  finalReportNote?: string;
  finalReportSubmitted?: boolean;
  adcNote?: string;
  approvalLetterNo?: string;
  disapprovalReason?: string;
}

const stageOrder: Stage[] = ['assignment', 'doc-verification', 'inspection', 'final-report', 'approval'];

function computeInspection(type: TransactionType, scores: Record<string, boolean> | undefined) {
  const config = criteriaByType[type];
  const s = scores ?? {};
  const totalWeight = config.reduce((sum, c) => sum + c.weight, 0) || 1;
  const passedWeight = config.reduce((sum, c) => sum + (s[c.id] ? c.weight : 0), 0);
  const pct = Math.round((passedWeight / totalWeight) * 100);
  return { pct, compliant: pct >= 70 };
}

const seedApplications: MachineApplication[] = [
  {
    id: 'MTX-2026-P101', transactionType: 'purchase', bin: '003321456-0105', licenseeName: 'DBL Group', licenseNo: 'BL-2021-00934',
    hsCode: '8447.90.00', machineDescription: 'Additional yarn feeding attachment for circular knitting line', brand: 'Mayer & Cie', category: 'auxiliary',
    reason: 'Capacity expansion — second knitting line requires an additional feeding attachment.', submittedDate: '19 Jul 2026', stage: 'doc-verification',
    assignedOfficer: officerPool[1].en, lienBankVerified: true, auditChecked: false,
  },
  {
    id: 'MTX-2026-P088', transactionType: 'purchase', bin: '004562178-0206', licenseeName: 'Square Fashions Ltd.', licenseNo: 'BL-2026-04521',
    hsCode: '8452.29.00', machineDescription: 'Automatic thread trimming attachment', brand: 'Juki', category: 'auxiliary',
    reason: 'Replacement unit for aging attachment on Line 3.', submittedDate: '28 Jun 2026', stage: 'included',
    assignedOfficer: officerPool[0].en, lienBankVerified: true, auditChecked: true, docNote: 'Documents examined; specification matches invoice.',
    teamFormed: true, inspectionTeamMembers: [officerPool[0].en], inspectionDate: '02 Jul 2026', inspectionScheduled: true,
    visitNotes: 'Attachment installed and verified operational on existing mother machine.', inspectionScores: Object.fromEntries(criteriaByType.purchase.map((c) => [c.id, true])),
    inspectionSubmitted: true, inspectionCompliant: true, inspectionPct: 100,
    finalReportNote: 'All checks compliant. Recommended for approval.', finalReportSubmitted: true,
    adcNote: 'Verified. Approved for inclusion.', approvalLetterNo: 'APL-2026-3391',
  },
  {
    id: 'MTX-2026-S204', transactionType: 'sale', bin: '001987654-0102', licenseeName: 'Ha-Meem Group', licenseNo: 'BL-2020-00512',
    hsCode: '8452.21.00', machineDescription: 'Automatic sewing machine unit, industrial (Brother) — MC-0006', brand: 'Brother', category: 'mother',
    reason: 'Machine being sold to a non-bonded local buyer after production line consolidation.', vatChallanNo: 'VAT-2026-661820', submittedDate: '14 Jul 2026',
    stage: 'inspection', assignedOfficer: officerPool[2].en, lienBankVerified: true, auditChecked: true,
    docNote: 'Documents and VAT challan examined; consistent with declared sale value.',
    teamFormed: true, inspectionTeamMembers: [officerPool[2].en, officerPool[1].en], inspectionDate: '21 Jul 2026', inspectionScheduled: true,
  },
  {
    id: 'MTX-2026-S177', transactionType: 'sale', bin: '009887766-0702', licenseeName: 'Pacific Jeans Ltd.', licenseNo: 'BL-2021-01204',
    hsCode: '8447.11.00', machineDescription: 'Circular knitting machine (Terrot) — MC-0008', brand: 'Terrot', category: 'mother',
    reason: 'Machine sold as part of equipment upgrade program.', vatChallanNo: 'VAT-2026-552011', submittedDate: '20 Jun 2026',
    stage: 'excluded', assignedOfficer: officerPool[0].en, lienBankVerified: true, auditChecked: true, docNote: 'Documents and VAT challan verified.',
    teamFormed: true, inspectionTeamMembers: [officerPool[0].en], inspectionDate: '25 Jun 2026', inspectionScheduled: true,
    visitNotes: 'Machine present and matches DB record; VAT challan value confirmed.', inspectionScores: Object.fromEntries(criteriaByType.sale.map((c) => [c.id, true])),
    inspectionSubmitted: true, inspectionCompliant: true, inspectionPct: 100,
    finalReportNote: 'All checks compliant. Recommended for approval.', finalReportSubmitted: true,
    adcNote: 'Verified against VAT challan. Approved.', approvalLetterNo: 'APL-2026-3204',
  },
  {
    id: 'MTX-2026-D142', transactionType: 'decommission', bin: '005871234-0208', licenseeName: 'Envoy Textiles Ltd.', licenseNo: 'BL-2022-01655',
    hsCode: '8451.40.00', machineDescription: 'Dyeing, washing or finishing machine (Then Maschinen) — MC-0005', brand: 'Then Maschinen', category: 'mother',
    reason: 'Machine has reached end of life cycle and is being decommissioned for scrap.', submittedDate: '11 Jul 2026', stage: 'final-report',
    assignedOfficer: officerPool[1].en, lienBankVerified: true, auditChecked: true, docNote: 'Documents examined; end-of-life declaration on file.',
    teamFormed: true, inspectionTeamMembers: [officerPool[1].en], inspectionDate: '17 Jul 2026', inspectionScheduled: true,
    visitNotes: 'Machine confirmed non-operational; matches declared condition for decommissioning.',
    inspectionScores: Object.fromEntries(criteriaByType.decommission.map((c) => [c.id, true])), inspectionSubmitted: true, inspectionCompliant: true, inspectionPct: 100,
  },
  {
    id: 'MTX-2026-D098', transactionType: 'decommission', bin: '004562178-0206', licenseeName: 'Square Fashions Ltd.', licenseNo: 'BL-2026-04521',
    hsCode: '8452.21.00', machineDescription: 'Automatic sewing machine unit, industrial (Juki) — MC-0001', brand: 'Juki', category: 'mother',
    reason: 'Requested decommission without adequate end-of-life documentation.', submittedDate: '05 Jun 2026', stage: 'disapproved',
    assignedOfficer: officerPool[0].en, lienBankVerified: true, auditChecked: true, docNote: 'Documents examined; end-of-life justification insufficient.',
    teamFormed: true, inspectionTeamMembers: [officerPool[0].en], inspectionDate: '10 Jun 2026', inspectionScheduled: true,
    visitNotes: 'Machine still appears operational; condition inconsistent with decommission request.',
    inspectionScores: { presence: true, condition: false, serial: true }, inspectionSubmitted: true, inspectionCompliant: false, inspectionPct: 47,
    finalReportNote: 'Inspection found machine still operational; recommend disapproval pending further justification.', finalReportSubmitted: true,
    adcNote: 'Insufficient end-of-life evidence.', disapprovalReason: 'Factory inspection found the machine still operational and inconsistent with the declared end-of-life condition. Application disapproved pending stronger justification.',
  },
];

function InspectionCalendar({ occupied, selectedDay, onSelectDay }: { occupied: Record<string, string[]>; selectedDay: string; onSelectDay: (day: string) => void }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const key = String(d).padStart(2, '0');
        const isOccupied = !!occupied[key]?.length;
        const isSelected = selectedDay === key;
        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelectDay(key)}
            title={isOccupied ? occupied[key].join(', ') : undefined}
            className={['relative flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors', isSelected ? 'bg-[#0A4D8C] text-white' : isOccupied ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-[#F5F7FA] text-[#334155] hover:bg-[#EAF3FE]'].join(' ')}
          >
            {d}
            {isOccupied && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber-500" />}
          </button>
        );
      })}
    </div>
  );
}

function QrPattern() {
  const cells = ['1110101110111', '1000100010001', '1011101110101', '1011100010101', '1000101110001', '1110100010111', '0000101110000', '1101000000101', '1010111011101', '1000100010101', '1011101011101', '1000100000001', '1110111011101'];
  const px = 6;
  return (
    <svg viewBox={`0 0 ${13 * px} ${13 * px}`} className="h-20 w-20 shrink-0">
      <rect width={13 * px} height={13 * px} fill="white" />
      {cells.map((row, y) => row.split('').map((c, x) => (c === '1' ? <rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill="#1E293B" /> : null)))}
    </svg>
  );
}

function ApprovalLetter({ language, t, app, onClose }: { language: Language; t: (typeof T)['en']; app: MachineApplication; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{t.letterTitle}</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <div className="rounded-lg border-2 border-[#CBD5E1] bg-white p-5">
            <div className="text-center">
              <p className="text-[11px] font-semibold text-[#64748B]">{t.govLine1}</p>
              <p className="text-[11px] font-semibold text-[#64748B]">{t.govLine2}</p>
              <h3 className="mt-2 text-base font-extrabold uppercase tracking-wide text-[#0A4D8C]">{t.pageTitle[app.transactionType]}</h3>
            </div>
            <div className="my-4 border-t border-dashed border-[#CBD5E1]" />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
              <div>
                <dt className="text-[#94A3B8]">{t.approvalLetterNo}</dt>
                <dd className="font-semibold text-[#1E293B]">{app.approvalLetterNo}</dd>
              </div>
              <div>
                <dt className="text-[#94A3B8]">{language === 'en' ? 'Application ID' : 'আবেদন আইডি'}</dt>
                <dd className="font-semibold text-[#1E293B]">{app.id}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#94A3B8]">{language === 'en' ? 'Licensee' : 'লাইসেন্সি'}</dt>
                <dd className="font-semibold text-[#1E293B]">
                  {app.licenseeName} · {app.licenseNo}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#94A3B8]">{t.authorizedItem}</dt>
                <dd className="font-semibold text-[#1E293B]">
                  {app.hsCode} — {app.machineDescription}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="h-8 w-32 border-b border-[#334155]" />
                <p className="text-[10px] text-[#94A3B8]">ADC / JC, Customs Bond Commissionerate</p>
              </div>
              <QrPattern />
            </div>
            <p className="mt-3 text-center text-[10px] text-[#94A3B8]">{t.computerGenerated}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="print" className="text-[16px]" />
            {t.print}
          </button>
          <button type="button" onClick={onClose} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdcApprovalPanel({ t, note, onNoteChange, onApprove, onDisapprove }: { t: (typeof T)['en']; note: string; onNoteChange: (v: string) => void; onApprove: () => void; onDisapprove: (reason: string) => void }) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  return (
    <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      <Field label={t.adcNoteLabel}>
        <textarea rows={3} value={note} onChange={(e) => onNoteChange(e.target.value)} className={`${inputClass} resize-none`} />
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

const initialForm = { licenseBin: '', machineId: '', hsCode: '', description: '', brand: '', mfgYear: '', countryOfOrigin: '', category: 'mother' as MachineCategory, capacity: '', reason: '', vatChallanNo: '' };

export function MachineryTransactions({ language, onDone, transactionType }: MachineryTransactionsProps) {
  const t = T[language];
  const accent = typeMeta[transactionType].accent;
  const isNewMachine = transactionType === 'purchase';
  const terminalStage: Stage = transactionType === 'purchase' ? 'included' : 'excluded';

  const [applications, setApplications] = useState<MachineApplication[]>(seedApplications.filter((a) => a.transactionType === transactionType));
  const [view, setView] = useState<'database' | 'form' | 'queue'>('database');
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [docs, setDocs] = useState<Record<string, boolean>>(Object.fromEntries(documentDefs.map((d) => [d.id, false])));
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [queueFilter, setQueueFilter] = useState<'all' | 'in-progress' | 'completed' | 'disapproved'>('all');
  const [selected, setSelected] = useState<MachineApplication | null>(null);
  const [viewingLetter, setViewingLetter] = useState<MachineApplication | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const pendingCount = applications.filter((a) => a.stage !== terminalStage && a.stage !== 'disapproved').length;
  const filteredQueue = applications.filter((a) => {
    if (queueFilter === 'all') return true;
    if (queueFilter === 'completed') return a.stage === terminalStage;
    if (queueFilter === 'disapproved') return a.stage === 'disapproved';
    return a.stage !== terminalStage && a.stage !== 'disapproved';
  });

  const updateApp = (id: string, patch: Partial<MachineApplication>) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const getOccupiedDates = (excludeId: string) => {
    const map: Record<string, string[]> = {};
    applications.forEach((ap) => {
      if (ap.id === excludeId) return;
      if (ap.inspectionDate?.toLowerCase().includes('jul 2026')) {
        const day = ap.inspectionDate.split(' ')[0].padStart(2, '0');
        map[day] = [...(map[day] ?? []), ap.licenseeName];
      }
    });
    return map;
  };

  const requiredByStep: Record<number, (keyof typeof form)[]> = {
    0: isNewMachine ? ['licenseBin', 'hsCode', 'description'] : ['machineId'],
    1: ['reason'],
    2: [],
  };
  const validateStep = (step: number) => {
    const nextErrors: Record<string, boolean> = {};
    (requiredByStep[step] ?? []).forEach((f) => {
      if (!form[f]) nextErrors[f as string] = true;
    });
    if (!isNewMachine && step === 1 && !form.vatChallanNo) nextErrors.vatChallanNo = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const selectedExisting = existingMachines.find((m) => m.id === form.machineId);
  const selectedLicense = licenseOptions.find((l) => l.bin === form.licenseBin);

  const handleSubmit = () => {
    const id = `MTX-2026-${transactionType[0].toUpperCase()}${Math.floor(300 + Math.random() * 600)}`;
    const base = isNewMachine
      ? { bin: selectedLicense?.bin ?? '', licenseeName: selectedLicense?.name ?? '', licenseNo: selectedLicense?.licenseNo ?? '', hsCode: form.hsCode, machineDescription: form.description, brand: form.brand, category: form.category }
      : { bin: selectedExisting?.bin ?? '', licenseeName: selectedExisting?.name ?? '', licenseNo: selectedExisting?.licenseNo ?? '', hsCode: selectedExisting?.hsCode ?? '', machineDescription: selectedExisting?.description ?? '', brand: undefined, category: 'mother' as MachineCategory };
    const newApp: MachineApplication = {
      id, transactionType, ...base, reason: form.reason, vatChallanNo: isNewMachine ? undefined : form.vatChallanNo,
      submittedDate: '23 Jul 2026', stage: 'assignment',
    };
    setApplications((prev) => [newApp, ...prev]);
    setSubmittedId(id);
  };

  const resetWizard = () => {
    setForm(initialForm);
    setCurrentStep(0);
    setErrors({});
    setDocs(Object.fromEntries(documentDefs.map((d) => [d.id, false])));
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
              if (app) setSelected(app);
              setSubmittedId(null);
              setView('queue');
              resetWizard();
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
              resetWizard();
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

  if (viewingLetter) {
    return <ApprovalLetter language={language} t={t} app={viewingLetter} onClose={() => setViewingLetter(null)} />;
  }

  if (selected) {
    const a = selected;
    const stageIndex = stageOrder.indexOf(a.stage);
    const occupied = getOccupiedDates(a.id);
    const selectedDay = a.inspectionDate ? a.inspectionDate.split(' ')[0].padStart(2, '0') : '';
    const criteria = criteriaByType[a.transactionType];
    const toggleTeamMember = (name: string) => {
      const cur = a.inspectionTeamMembers ?? [];
      updateApp(a.id, { inspectionTeamMembers: cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name] });
    };

    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
        <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">{t.reviewTitle}</h2>
              <p className="text-xs text-[#64748B]">
                {a.id} · {a.licenseeName} · {a.hsCode}
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
            {a.stage === 'disapproved' ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
                  <Icon name="cancel" className="text-[18px]" />
                  {t.stageLabels.disapproved}
                </p>
                <p className="mt-1 text-xs text-[#B91C1C]">{a.disapprovalReason}</p>
                <p className="mt-2 text-xs text-[#DC2626]">{t.disapprovedNotice}</p>
              </div>
            ) : (
              stageOrder.map((stage, i) => {
                const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'upcoming';
                return (
                  <div key={stage} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full', state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'text-white' : 'bg-[#EEF2F6] text-[#94A3B8]'].join(' ')} style={state === 'current' ? { backgroundColor: accent } : undefined}>
                        <Icon name={state === 'done' ? 'check' : 'circle'} className="text-[15px]" />
                      </span>
                      {i < stageOrder.length - 1 && <span className={`w-0.5 flex-1 ${state === 'done' ? 'bg-[#00A86B]' : 'bg-[#E2E8F0]'}`} style={{ minHeight: '16px' }} />}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className={['text-sm font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{t.stageLabels[stage]}</p>

                      {state === 'done' && stage === 'assignment' && (
                        <p className="mt-0.5 text-xs text-[#64748B]">
                          {t.assignedTo}: {a.assignedOfficer}
                        </p>
                      )}
                      {state === 'done' && stage === 'doc-verification' && <p className="mt-0.5 text-xs text-[#64748B]">{a.docNote}</p>}
                      {state === 'done' && stage === 'inspection' && (
                        <p className="mt-0.5 text-xs text-[#64748B]">
                          {a.inspectionDate} · {a.inspectionCompliant ? t.compliant : t.nonCompliant} ({a.inspectionPct}%)
                        </p>
                      )}
                      {state === 'done' && stage === 'final-report' && <p className="mt-0.5 text-xs text-[#64748B]">{a.finalReportNote}</p>}

                      {state === 'current' && stage === 'assignment' && (
                        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
                          <Field label={t.assignOfficer}>
                            <select value={a.assignedOfficer ?? ''} onChange={(e) => updateApp(a.id, { assignedOfficer: e.target.value })} className={inputClass}>
                              <option value="">—</option>
                              {officerPool.map((o) => (
                                <option key={o.en} value={o.en}>
                                  {o[language]}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <button type="button" disabled={!a.assignedOfficer} onClick={() => updateApp(a.id, { stage: 'doc-verification' })} className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-40" style={{ backgroundColor: accent }}>
                            {t.assignBtn}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'doc-verification' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                            <span className="text-xs font-semibold text-[#334155]">{t.lienBankTitle}</span>
                            {a.lienBankVerified ? (
                              <span className="text-[11px] font-semibold text-emerald-700">{t.lienVerified}</span>
                            ) : (
                              <button type="button" onClick={() => updateApp(a.id, { lienBankVerified: true })} className="rounded-full border border-[#0A4D8C] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                                {t.markLienVerified}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                            <span className="text-xs font-semibold text-[#334155]">{t.auditCheckTitle}</span>
                            {a.auditChecked ? (
                              <span className="text-[11px] font-semibold text-emerald-700">{t.auditCheckResult}</span>
                            ) : (
                              <button type="button" onClick={() => updateApp(a.id, { auditChecked: true })} className="rounded-full border border-[#0A4D8C] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                                {t.runAuditCheck}
                              </button>
                            )}
                          </div>
                          <button type="button" onClick={() => flash(t.requestMoreDocsSent)} className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:underline">
                            <Icon name="mail" className="text-[14px]" />
                            {t.requestMoreDocs}
                          </button>
                          <Field label={t.examinationNoteLabel}>
                            <textarea rows={3} value={a.docNote ?? ''} onChange={(e) => updateApp(a.id, { docNote: e.target.value })} placeholder={t.examinationNotePlaceholder} className={`${inputClass} resize-none`} />
                          </Field>
                          <button
                            type="button"
                            disabled={!a.lienBankVerified || !a.auditChecked || !a.docNote?.trim()}
                            onClick={() => updateApp(a.id, { stage: 'inspection' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                            style={{ backgroundColor: accent }}
                          >
                            {t.proceedToInspection}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'inspection' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          {!a.teamFormed ? (
                            <>
                              <p className="text-xs font-semibold text-[#334155]">{t.teamFormationTitle}</p>
                              <p className="text-[11px] text-[#94A3B8]">{t.selectOfficers}</p>
                              <div className="flex flex-wrap gap-2">
                                {officerPool.map((o) => {
                                  const active = (a.inspectionTeamMembers ?? []).includes(o.en);
                                  return (
                                    <button key={o.en} type="button" onClick={() => toggleTeamMember(o.en)} className={['rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors', active ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}>
                                      {o[language]}
                                    </button>
                                  );
                                })}
                              </div>
                              <button type="button" disabled={!(a.inspectionTeamMembers ?? []).length} onClick={() => updateApp(a.id, { teamFormed: true })} className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-40" style={{ backgroundColor: accent }}>
                                <Icon name="groups" className="text-[15px]" />
                                {t.formTeam}
                              </button>
                            </>
                          ) : !a.inspectionScheduled ? (
                            <>
                              <p className="flex items-center gap-1.5 text-xs text-emerald-700">
                                <Icon name="check_circle" className="text-[15px]" />
                                {t.teamFormed}: {(a.inspectionTeamMembers ?? []).join(', ')}
                              </p>
                              <p className="text-xs font-semibold text-[#334155]">{t.calendarTitle}</p>
                              <p className="text-[11px] text-[#94A3B8]">{t.calendarHint}</p>
                              <InspectionCalendar occupied={occupied} selectedDay={selectedDay} onSelectDay={(day) => updateApp(a.id, { inspectionDate: `${day} Jul 2026` })} />
                              {a.inspectionDate && (
                                <p className="text-xs text-[#334155]">
                                  {t.selectedDate}: <span className="font-semibold">{a.inspectionDate}</span>
                                </p>
                              )}
                              <button type="button" disabled={!a.inspectionDate} onClick={() => updateApp(a.id, { inspectionScheduled: true })} className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-40" style={{ backgroundColor: accent }}>
                                {t.confirmSchedule}
                              </button>
                            </>
                          ) : (
                            <>
                              <Field label={t.visitNotesLabel}>
                                <textarea rows={3} value={a.visitNotes ?? ''} onChange={(e) => updateApp(a.id, { visitNotes: e.target.value })} placeholder={t.visitNotesPlaceholder} className={`${inputClass} resize-none`} />
                              </Field>
                              <p className="text-xs font-semibold text-[#334155]">{t.criteriaTitle}</p>
                              {criteria.map((c) => (
                                <div key={c.id} className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-[#334155]">{c[language]}</span>
                                  <div className="flex gap-1">
                                    <button type="button" onClick={() => updateApp(a.id, { inspectionScores: { ...a.inspectionScores, [c.id]: true } })} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${a.inspectionScores?.[c.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EEF2F6] text-[#94A3B8]'}`}>
                                      {t.pass}
                                    </button>
                                    <button type="button" onClick={() => updateApp(a.id, { inspectionScores: { ...a.inspectionScores, [c.id]: false } })} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${a.inspectionScores?.[c.id] === false ? 'bg-red-100 text-[#DC2626]' : 'bg-[#EEF2F6] text-[#94A3B8]'}`}>
                                      {t.fail}
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const result = computeInspection(a.transactionType, a.inspectionScores);
                                  if (!result.compliant) flash(t.noncomplianceNotice);
                                  updateApp(a.id, { inspectionSubmitted: true, inspectionCompliant: result.compliant, inspectionPct: result.pct, stage: 'final-report' });
                                }}
                                className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                                style={{ backgroundColor: accent }}
                              >
                                {t.submitInspectionReport}
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {state === 'current' && stage === 'final-report' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <p className="text-xs font-semibold text-[#334155]">{t.summaryTitle}</p>
                          <dl className="flex flex-col gap-1.5 rounded-lg bg-[#F5F7FA] px-3 py-2 text-xs">
                            <div className="flex justify-between">
                              <dt className="text-[#64748B]">{t.stageLabels.inspection}</dt>
                              <dd className={`font-semibold ${a.inspectionCompliant ? 'text-emerald-600' : 'text-[#DC2626]'}`}>
                                {a.inspectionCompliant ? t.compliant : t.nonCompliant} ({a.inspectionPct}%)
                              </dd>
                            </div>
                          </dl>
                          <Field label={t.finalReportNoteLabel}>
                            <textarea rows={3} value={a.finalReportNote ?? ''} onChange={(e) => updateApp(a.id, { finalReportNote: e.target.value })} placeholder={t.finalReportNotePlaceholder} className={`${inputClass} resize-none`} />
                          </Field>
                          <button type="button" disabled={!a.finalReportNote?.trim()} onClick={() => updateApp(a.id, { finalReportSubmitted: true, stage: 'approval' })} className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-40" style={{ backgroundColor: accent }}>
                            {t.forwardToAdcJc}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'approval' && (
                        <AdcApprovalPanel
                          t={t}
                          note={a.adcNote ?? ''}
                          onNoteChange={(v) => updateApp(a.id, { adcNote: v })}
                          onApprove={() => updateApp(a.id, { stage: terminalStage, approvalLetterNo: `APL-2026-${Math.floor(3200 + Math.random() * 700)}` })}
                          onDisapprove={(reason) => updateApp(a.id, { stage: 'disapproved', disapprovalReason: reason })}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {a.stage === terminalStage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                  <Icon name="workspace_premium" className="text-[18px]" />
                  {t.stageLabels[terminalStage]}
                </p>
                <p className="mt-1 text-xs text-emerald-800">{transactionType === 'purchase' ? t.includedNotice.purchase : t.excludedNotice}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-800">
                  <Icon name="pie_chart" className="text-[15px]" />
                  {t.entitlementUpdate}: {transactionType === 'purchase' ? '+' : '−'}
                  {Math.floor(5000 + Math.random() * 9000)} {language === 'en' ? 'units/year' : 'ইউনিট/বছর'}
                </p>
                <button type="button" onClick={() => setViewingLetter(a)} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                  <Icon name="visibility" className="text-[15px]" />
                  {t.viewApprovalLetter}
                </button>
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
            {t.pageTitle[transactionType]}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.pendingApplications}</span>
        </nav>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">{t.queueTitle[transactionType]}</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.queueSubtitle}</p>
          </div>
          <button type="button" onClick={() => setView('database')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.back}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'in-progress', 'completed', 'disapproved'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setQueueFilter(f)} className={['rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', queueFilter === f ? 'text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')} style={queueFilter === f ? { backgroundColor: accent, borderColor: accent } : undefined}>
              {f === 'all' ? t.filterAll : f === 'in-progress' ? t.filterInProgress : f === 'completed' ? t.filterCompleted : t.filterDisapproved}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredQueue.map((a) => (
            <button key={a.id} type="button" onClick={() => setSelected(a)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: accent }}>
                <Icon name={typeMeta[transactionType].icon} className="text-[20px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{a.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.stage === terminalStage ? 'bg-emerald-50 text-emerald-700' : a.stage === 'disapproved' ? 'bg-red-50 text-[#DC2626]' : 'bg-blue-50 text-[#0A4D8C]'}`}>{t.stageLabels[a.stage]}</span>
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                  {a.licenseeName} · {a.hsCode}
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  {a.machineDescription} · {a.submittedDate}
                </p>
              </div>
              <span className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: accent }}>
                {t.review}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'form') {
    const wizardSteps = [t.stepMachine, t.stepDocs, t.stepReview];
    return (
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <button type="button" onClick={() => setView('database')} className="hover:text-[#0A4D8C]">
            {t.pageTitle[transactionType]}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.newApplication[transactionType]}</span>
        </nav>

        <div className="flex items-center gap-2">
          {wizardSteps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${i < currentStep ? 'bg-[#00A86B] text-white' : i === currentStep ? 'text-white' : 'bg-[#EEF2F6] text-[#94A3B8]'}`} style={i === currentStep ? { backgroundColor: accent } : undefined}>
                {i < currentStep ? <Icon name="check" className="text-[16px]" /> : i + 1}
              </span>
              <span className={`text-xs font-semibold ${i === currentStep ? 'text-[#1E293B]' : 'text-[#94A3B8]'}`}>{label}</span>
              {i < wizardSteps.length - 1 && <span className="mx-1 h-px flex-1 bg-[#E2E8F0]" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          {currentStep === 0 &&
            (isNewMachine ? (
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
                  <Field label={t.hsCode} required error={errors.hsCode ? t.required : undefined}>
                    <input value={form.hsCode} onChange={(e) => set('hsCode', e.target.value)} placeholder={t.hsCodePlaceholder} className={`${inputClass} ${errors.hsCode ? errorInputClass : ''}`} />
                  </Field>
                  <Field label={t.brand}>
                    <input value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inputClass} />
                  </Field>
                  <Field label={t.mfgYear}>
                    <input value={form.mfgYear} onChange={(e) => set('mfgYear', e.target.value)} className={inputClass} />
                  </Field>
                  <Field label={t.countryOfOrigin}>
                    <input value={form.countryOfOrigin} onChange={(e) => set('countryOfOrigin', e.target.value)} className={inputClass} />
                  </Field>
                </div>
                <Field label={t.machineCategory}>
                  <PillGroup value={form.category} onChange={(v) => set('category', v)} options={[{ value: 'mother', label: t.motherMachine }, { value: 'auxiliary', label: t.auxiliaryMachine }]} />
                </Field>
                <Field label={t.capacity}>
                  <input value={form.capacity} onChange={(e) => set('capacity', e.target.value)} className={inputClass} />
                </Field>
                <Field label={t.machineDescription} required error={errors.description ? t.required : undefined}>
                  <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder={t.machineDescriptionPlaceholder} className={`${inputClass} resize-none ${errors.description ? errorInputClass : ''}`} />
                </Field>
              </div>
            ) : (
              <Field label={t.selectMachine} required error={errors.machineId ? t.required : undefined}>
                <select value={form.machineId} onChange={(e) => set('machineId', e.target.value)} className={`${inputClass} ${errors.machineId ? errorInputClass : ''}`}>
                  <option value="">{t.selectMachinePlaceholder}</option>
                  {existingMachines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.hsCode} — {m.description} ({m.name})
                    </option>
                  ))}
                </select>
              </Field>
            ))}

          {currentStep === 1 && (
            <div className="flex flex-col gap-5">
              <Field label={t.reasonLabel[transactionType]} required error={errors.reason ? t.required : undefined}>
                <textarea rows={4} value={form.reason} onChange={(e) => set('reason', e.target.value)} placeholder={t.reasonPlaceholder[transactionType]} className={`${inputClass} resize-none ${errors.reason ? errorInputClass : ''}`} />
              </Field>
              {!isNewMachine && (
                <Field label={t.vatChallanLabel} required error={errors.vatChallanNo ? t.required : undefined}>
                  <input value={form.vatChallanNo} onChange={(e) => set('vatChallanNo', e.target.value)} placeholder={t.vatChallanPlaceholder} className={`${inputClass} ${errors.vatChallanNo ? errorInputClass : ''}`} />
                </Field>
              )}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-[#334155]">{t.attachSupportingDocs}</p>
                {documentDefs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                    <div className="flex items-center gap-3">
                      <span className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', docs[d.id] ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
                        <Icon name={docs[d.id] ? 'task_alt' : 'description'} className="text-[18px]" />
                      </span>
                      <span className="text-sm font-semibold text-[#1E293B]">{d[language]}</span>
                    </div>
                    {docs[d.id] ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{t.uploaded}</span>
                    ) : (
                      <button type="button" onClick={() => setDocs((prev) => ({ ...prev, [d.id]: true }))} className="flex items-center gap-1.5 rounded-lg border border-[#0A4D8C] px-3 py-1.5 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                        <Icon name="upload" className="text-[15px]" />
                        {t.uploadDoc}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-[#E2E8F0] p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-[11px] text-[#94A3B8]">{isNewMachine ? t.selectLicense : t.selectMachine}</dt>
                <dd className="text-sm font-semibold text-[#1E293B]">{isNewMachine ? (selectedLicense ? `${selectedLicense.licenseNo} — ${selectedLicense.name}` : '—') : selectedExisting ? `${selectedExisting.hsCode} — ${selectedExisting.description}` : '—'}</dd>
              </div>
              {isNewMachine && (
                <>
                  <div>
                    <dt className="text-[11px] text-[#94A3B8]">{t.hsCode}</dt>
                    <dd className="text-sm font-semibold text-[#1E293B]">{form.hsCode || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#94A3B8]">{t.machineCategory}</dt>
                    <dd className="text-sm font-semibold text-[#1E293B]">{form.category === 'mother' ? t.motherMachine : t.auxiliaryMachine}</dd>
                  </div>
                </>
              )}
              {!isNewMachine && (
                <div>
                  <dt className="text-[11px] text-[#94A3B8]">{t.vatChallanLabel}</dt>
                  <dd className="text-sm font-semibold text-[#1E293B]">{form.vatChallanNo || '—'}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-[11px] text-[#94A3B8]">{t.reasonLabel[transactionType]}</dt>
                <dd className="text-sm text-[#1E293B]">{form.reason || '—'}</dd>
              </div>
            </dl>
          )}

          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-5">
            <button type="button" onClick={currentStep === 0 ? () => setView('database') : () => setCurrentStep((s) => s - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
              <Icon name="arrow_back" className="text-[16px]" />
              {t.back}
            </button>
            {currentStep === 2 ? (
              <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#048f5c]">
                {t.submit}
                <Icon name="send" className="text-[16px]" />
              </button>
            ) : (
              <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: accent }}>
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
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-6 py-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
        <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
          <Icon name="home" className="text-[16px]" />
          {t.home}
        </button>
        <Icon name="chevron_right" className="text-[16px]" />
        <span>{t.machineryManagement}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle[transactionType]}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle[transactionType]}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle[transactionType]}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              resetWizard();
              setView('form');
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            <Icon name="add" className="text-[16px]" />
            {t.newApplication[transactionType]}
          </button>
          <button type="button" onClick={() => setView('queue')} className="relative inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="fact_check" className="text-[16px]" />
            {t.pendingApplications}
            {pendingCount > 0 && <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">{pendingCount}</span>}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {applications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white py-12 text-center text-sm text-[#94A3B8]">—</p>
        ) : (
          applications.map((a) => (
            <button key={a.id} type="button" onClick={() => setSelected(a)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: accent }}>
                <Icon name={typeMeta[transactionType].icon} className="text-[20px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{a.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.stage === terminalStage ? 'bg-emerald-50 text-emerald-700' : a.stage === 'disapproved' ? 'bg-red-50 text-[#DC2626]' : 'bg-blue-50 text-[#0A4D8C]'}`}>{t.stageLabels[a.stage]}</span>
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                  {a.licenseeName} · {a.hsCode}
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  {a.machineDescription} · {a.submittedDate}
                </p>
              </div>
              <span className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: accent }}>
                {t.review}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
