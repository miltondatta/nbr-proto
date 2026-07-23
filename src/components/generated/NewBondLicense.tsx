import { useState } from 'react';

type Language = 'en' | 'bn';
type Stage = 'submitted' | 'doc-verification' | 'inspection' | 'risk-assessment' | 'final-report' | 'approval' | 'payment' | 'agreement' | 'issued' | 'disapproved';
type RiskLevel = 'low' | 'medium' | 'high';

interface NewBondLicenseProps {
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
    pageTitle: 'New Bond License',
    subtitle: 'Apply for a new customs bond license for your bonded manufacturing or trading facility.',
    backToDashboard: 'Back to Dashboard',
    next: 'Save & Continue',
    back: 'Back',
    submit: 'Submit Application',
    required: 'Required',
    stepLabel: 'Step',
    of: 'of',
    pendingApplications: 'Pending Applications',
    inspectionCriteriaBtn: 'Inspection Criteria',
    riskCriteriaBtn: 'Risk Criteria',
    queueTitle: 'License Application Review Queue',
    queueSubtitle: 'Full internal review pipeline — assignment, document & Lien Bank verification, factory inspection, risk assessment, final report, approval, payment, agreement and issuance.',
    filterAll: 'All',
    filterInProgress: 'In Progress',
    filterIssued: 'Issued',
    filterDisapproved: 'Disapproved',
    assignedTo: 'Assigned to',
    notAssigned: 'Not yet assigned',
    review: 'Review',
    reviewTitle: 'Review Application',
    close: 'Close',
    stageLabels: {
      submitted: 'Application Submitted',
      'doc-verification': 'Document Verification',
      inspection: 'Factory Inspection',
      'risk-assessment': 'Risk Assessment',
      'final-report': 'Final e-Applicant Report',
      approval: 'Approval (Commissioner)',
      payment: 'Payment',
      agreement: 'e-Bond Agreement',
      issued: 'License Issued',
      disapproved: 'Disapproved',
    },
    assignOfficer: 'Assign RO/ARO',
    assignBtn: 'Assign & Start Verification',
    checklistComplete: 'e-Checklist — all required documents verified complete',
    auditCheckTitle: 'License DB Query — Audit Status Check',
    auditCheckResult: 'No duplicate license found for this applicant. Audit status: Compliant.',
    runAuditCheck: 'Run Audit Status Check',
    lienBankVerificationTitle: 'Lien Bank e-Verification',
    markLienVerified: 'Mark Lien Bank Verified',
    lienVerified: 'Verified',
    lienPending: 'Pending Verification',
    requestMoreDocs: 'Request Additional Documents',
    requestMoreDocsSent: 'Notification sent requesting additional documents from applicant.',
    officerNote: 'e-Note & Nothi',
    notePlaceholder: 'Enter examination notes…',
    proceedToInspection: 'Proceed to Factory Inspection',
    examinationNoteLabel: 'RO/ARO Examination Note (e-Note & Nothi)',
    examinationNotePlaceholder: 'Document examination findings for this application…',
    addToNothi: 'Add to e-Nothi',
    nothiRecorded: 'e-Nothi entry recorded for this stage.',
    nothiRequiredNotice: 'An examination note must be added to the e-Nothi before proceeding.',
    viewNothi: 'View e-Nothi',
    nothiTitle: 'e-Nothi — Case File',
    nothiSubtitle: 'Chronological record of official notes and examinations recorded against this application, in the style of the e-GP e-Note & Nothi system.',
    nothiEntryBy: 'By',
    nothiNoEntries: 'No e-Nothi entries have been recorded for this application yet.',
    teamFormationTitle: 'Inspection Team Formation',
    selectOfficers: 'Select inspection team members (RO/ARO)',
    formTeam: 'Form Team & Notify Members',
    teamFormed: 'Team Formed',
    calendarTitle: 'Inspection e-Calendar',
    calendarHint: 'Amber dates already have another inspection scheduled — pick any date to check for conflicts.',
    selectedDate: 'Selected Date',
    confirmSchedule: 'Confirm Schedule & Notify',
    visitNotesLabel: 'e-Factory Visit — Mobile Inspector Notes',
    visitNotesPlaceholder: 'Field observations recorded during the factory visit…',
    photosLabel: 'Photos Captured (mobile app)',
    attachPhoto: 'Attach Photo (simulate)',
    inspectionCriteriaTitle: 'Inspection e-Report — Criteria',
    pass: 'Pass',
    fail: 'Fail',
    weightLabel: 'Weight',
    weightedScore: 'Weighted Score',
    submitInspectionReport: 'Submit Inspection Report',
    compliant: 'Compliant',
    nonCompliant: 'Non-Compliant',
    noncomplianceNotice: 'Noncompliance notification sent to applicant for failed criteria.',
    viewInspectionReport: 'View Inspection Report',
    riskAssessmentTitle: 'Risk Assessment',
    riskLevelLabel: 'Risk Level',
    riskLow: 'Low',
    riskMedium: 'Medium',
    riskHigh: 'High',
    riskNoteLabel: 'Risk Assessment e-Report Note',
    generateRiskReport: 'Generate Risk Report & Proceed',
    viewRiskReport: 'View Risk Report',
    summaryTitle: 'Application Summary',
    docVerificationSummary: 'Document & Lien Bank Verification',
    recommendationLabel: 'RO/ARO Recommendation',
    outcomeLabel: 'Report Outcome',
    favorable: 'Favorable',
    unfavorable: 'Unfavorable',
    submitFinalReport: 'Submit Final Report & Forward to Commissioner',
    viewFinalReport: 'View Final Report',
    approvalTitle: 'Approval (Commissioner Sign-off)',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalReasonRequired: 'A reason is required to disapprove.',
    paymentTitle: 'Payment',
    licenseFeeLabel: 'License Fee Due (via e-Challan / Payment Gateway)',
    confirmPayment: 'Confirm Payment Received',
    agreementTitle: 'e-Bond Agreement',
    agreementBody: 'System-generated Bond Agreement is pending the applicant’s e-signature.',
    signAgreement: 'Bonder E-Signs Agreement',
    issuedTitle: 'License Issued',
    licenseNoLabel: 'Generated License No.',
    viewLicenseDoc: 'View e-Bond License',
    autoTriggered: 'Auto-Triggered Actions',
    hsCodeBound: 'HS Code bound to license',
    passbookIssued: 'e-Passbook auto-issued (see e-Passbook)',
    bondRegisterIssued: 'e-Bond Register auto-issued for deemed exporters (see e-Bond Register)',
    generalBondIssued: 'e-General Bond auto-issued (see General Bond Management)',
    entitlementPending: 'Entitlement & Machinery records will populate once those modules are available',
    disapprovedTitle: 'Application Disapproved',
    disapprovedNotice: 'Disapproval notification sent. Applicant profile marked as Disapproved Applicant.',
    verified: 'Verified',
    licenseDocTitle: 'Electronic Bond License',
    govLine1: 'Government of the People’s Republic of Bangladesh',
    govLine2: 'National Board of Revenue — Customs Bond Commissionerate',
    verificationCode: 'Verification Code',
    reportNo: 'Report No.',
    commissionerLine: 'Commissioner, Customs Bond Commissionerate',
    inspectionTeamLead: 'Inspection Team Lead',
    riskAssessedBy: 'Risk Assessed By',
    reportingOfficer: 'Reporting Officer',
    computerGenerated: 'This is a computer-generated document, valid without physical signature.',
    print: 'Print',
    download: 'Download',
    trackApplication: 'Track this Application',
    inspectionReportTitle: 'Inspection e-Report',
    riskReportTitle: 'Risk Assessment e-Report',
    finalReportTitle: 'Final e-Applicant Report',
    teamMembersLabel: 'Inspection Team',
    criteriaLabel: 'Criteria',
    levelLabel: 'Level',
    manageInspectionCriteriaTitle: 'Manage Inspection Parameters',
    manageRiskCriteriaTitle: 'Manage Risk Parameters',
    criterionEnLabel: 'Label (English)',
    criterionBnLabel: 'Label (Bangla)',
    addCriterion: 'Add Criterion',
    delete: 'Delete',
    done: 'Done',
  },
  bn: {
    home: 'হোম',
    bondLicense: 'বন্ড লাইসেন্স ব্যবস্থাপনা',
    pageTitle: 'নতুন বন্ড লাইসেন্স',
    subtitle: 'আপনার বন্ডেড উৎপাদন বা ব্যবসা প্রতিষ্ঠানের জন্য নতুন কাস্টমস বন্ড লাইসেন্সের আবেদন করুন।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    next: 'সংরক্ষণ করে এগিয়ে যান',
    back: 'পূর্ববর্তী',
    submit: 'আবেদন জমা দিন',
    required: 'আবশ্যক',
    stepLabel: 'ধাপ',
    of: 'এর মধ্যে',
    pendingApplications: 'অমীমাংসিত আবেদন',
    inspectionCriteriaBtn: 'পরিদর্শন মানদণ্ড',
    riskCriteriaBtn: 'ঝুঁকি মানদণ্ড',
    queueTitle: 'লাইসেন্স আবেদন পর্যালোচনা সারি',
    queueSubtitle: 'সম্পূর্ণ অভ্যন্তরীণ পর্যালোচনা প্রক্রিয়া — নিয়োগ, নথি ও লিয়েন ব্যাংক যাচাই, কারখানা পরিদর্শন, ঝুঁকি মূল্যায়ন, চূড়ান্ত প্রতিবেদন, অনুমোদন, পেমেন্ট, চুক্তি ও ইস্যুকরণ।',
    filterAll: 'সকল',
    filterInProgress: 'চলমান',
    filterIssued: 'ইস্যুকৃত',
    filterDisapproved: 'অননুমোদিত',
    assignedTo: 'দায়িত্বপ্রাপ্ত',
    notAssigned: 'এখনও নিয়োগ হয়নি',
    review: 'পর্যালোচনা',
    reviewTitle: 'আবেদন পর্যালোচনা',
    close: 'বন্ধ করুন',
    stageLabels: {
      submitted: 'আবেদন জমা হয়েছে',
      'doc-verification': 'নথি যাচাইকরণ',
      inspection: 'কারখানা পরিদর্শন',
      'risk-assessment': 'ঝুঁকি মূল্যায়ন',
      'final-report': 'চূড়ান্ত আবেদনকারী প্রতিবেদন',
      approval: 'অনুমোদন (কমিশনার)',
      payment: 'পেমেন্ট',
      agreement: 'ই-বন্ড চুক্তি',
      issued: 'লাইসেন্স ইস্যু হয়েছে',
      disapproved: 'অননুমোদিত',
    },
    assignOfficer: 'আরও/এআরও নিয়োগ',
    assignBtn: 'নিয়োগ করে যাচাই শুরু করুন',
    checklistComplete: 'e-চেকলিস্ট — সকল প্রয়োজনীয় নথি যাচাইকৃত ও সম্পূর্ণ',
    auditCheckTitle: 'লাইসেন্স ডিবি কোয়েরি — নিরীক্ষা অবস্থা যাচাই',
    auditCheckResult: 'এই আবেদনকারীর জন্য কোনো ডুপ্লিকেট লাইসেন্স পাওয়া যায়নি। নিরীক্ষা অবস্থা: সম্মত।',
    runAuditCheck: 'নিরীক্ষা অবস্থা যাচাই চালান',
    lienBankVerificationTitle: 'লিয়েন ব্যাংক ই-যাচাইকরণ',
    markLienVerified: 'লিয়েন ব্যাংক যাচাইকৃত চিহ্নিত করুন',
    lienVerified: 'যাচাইকৃত',
    lienPending: 'যাচাই অপেক্ষমাণ',
    requestMoreDocs: 'অতিরিক্ত নথি অনুরোধ',
    requestMoreDocsSent: 'আবেদনকারীর কাছে অতিরিক্ত নথির অনুরোধ পাঠানো হয়েছে।',
    officerNote: 'e-নোট ও নথি',
    notePlaceholder: 'পরীক্ষার মন্তব্য লিখুন…',
    proceedToInspection: 'কারখানা পরিদর্শনে এগিয়ে যান',
    examinationNoteLabel: 'আরও/এআরও পরীক্ষা মন্তব্য (e-নোট ও নথি)',
    examinationNotePlaceholder: 'এই আবেদনের পরীক্ষার ফলাফল লিখুন…',
    addToNothi: 'e-নথিতে যোগ করুন',
    nothiRecorded: 'এই ধাপের জন্য e-নথি এন্ট্রি রেকর্ড করা হয়েছে।',
    nothiRequiredNotice: 'এগিয়ে যাওয়ার আগে e-নথিতে একটি পরীক্ষা মন্তব্য যোগ করতে হবে।',
    viewNothi: 'e-নথি দেখুন',
    nothiTitle: 'e-নথি — কেস ফাইল',
    nothiSubtitle: 'এই আবেদনের বিপরীতে রেকর্ডকৃত সরকারি মন্তব্য ও পরীক্ষার কালানুক্রমিক বিবরণ, ই-জিপি e-নোট ও নথি সিস্টেমের অনুরূপ।',
    nothiEntryBy: 'কর্তৃক',
    nothiNoEntries: 'এই আবেদনের জন্য এখনও কোনো e-নথি এন্ট্রি রেকর্ড করা হয়নি।',
    teamFormationTitle: 'পরিদর্শন দল গঠন',
    selectOfficers: 'পরিদর্শন দলের সদস্য নির্বাচন করুন (আরও/এআরও)',
    formTeam: 'দল গঠন করে সদস্যদের অবহিত করুন',
    teamFormed: 'দল গঠিত হয়েছে',
    calendarTitle: 'পরিদর্শন ই-ক্যালেন্ডার',
    calendarHint: 'অ্যাম্বার তারিখগুলোতে ইতিমধ্যে অন্য একটি পরিদর্শন নির্ধারিত আছে — দ্বন্দ্ব পরীক্ষা করতে যেকোনো তারিখ নির্বাচন করুন।',
    selectedDate: 'নির্বাচিত তারিখ',
    confirmSchedule: 'সময়সূচি নিশ্চিত করুন ও অবহিত করুন',
    visitNotesLabel: 'e-ফ্যাক্টরি ভিজিট — মোবাইল ইন্সপেক্টর নোট',
    visitNotesPlaceholder: 'কারখানা পরিদর্শনের সময় রেকর্ড করা পর্যবেক্ষণ…',
    photosLabel: 'তোলা ছবি (মোবাইল অ্যাপ)',
    attachPhoto: 'ছবি সংযুক্ত করুন (সিমুলেট)',
    inspectionCriteriaTitle: 'পরিদর্শন ই-প্রতিবেদন — মানদণ্ড',
    pass: 'উত্তীর্ণ',
    fail: 'অনুত্তীর্ণ',
    weightLabel: 'ওজন',
    weightedScore: 'ওজনযুক্ত স্কোর',
    submitInspectionReport: 'পরিদর্শন প্রতিবেদন জমা দিন',
    compliant: 'সম্মত',
    nonCompliant: 'অসম্মত',
    noncomplianceNotice: 'অনুত্তীর্ণ মানদণ্ডের জন্য আবেদনকারীকে অসম্মতি বিজ্ঞপ্তি পাঠানো হয়েছে।',
    viewInspectionReport: 'পরিদর্শন প্রতিবেদন দেখুন',
    riskAssessmentTitle: 'ঝুঁকি মূল্যায়ন',
    riskLevelLabel: 'ঝুঁকির মাত্রা',
    riskLow: 'নিম্ন',
    riskMedium: 'মধ্যম',
    riskHigh: 'উচ্চ',
    riskNoteLabel: 'ঝুঁকি মূল্যায়ন ই-প্রতিবেদন নোট',
    generateRiskReport: 'ঝুঁকি প্রতিবেদন তৈরি করে এগিয়ে যান',
    viewRiskReport: 'ঝুঁকি প্রতিবেদন দেখুন',
    summaryTitle: 'আবেদনের সারসংক্ষেপ',
    docVerificationSummary: 'নথি ও লিয়েন ব্যাংক যাচাইকরণ',
    recommendationLabel: 'আরও/এআরও সুপারিশ',
    outcomeLabel: 'প্রতিবেদনের ফলাফল',
    favorable: 'অনুকূল',
    unfavorable: 'প্রতিকূল',
    submitFinalReport: 'চূড়ান্ত প্রতিবেদন জমা দিয়ে কমিশনারের কাছে পাঠান',
    viewFinalReport: 'চূড়ান্ত প্রতিবেদন দেখুন',
    approvalTitle: 'অনুমোদন (কমিশনার স্বাক্ষর)',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalReasonRequired: 'অননুমোদনের জন্য একটি কারণ আবশ্যক।',
    paymentTitle: 'পেমেন্ট',
    licenseFeeLabel: 'লাইসেন্স ফি প্রদেয় (e-চালান / পেমেন্ট গেটওয়ের মাধ্যমে)',
    confirmPayment: 'পেমেন্ট প্রাপ্তি নিশ্চিত করুন',
    agreementTitle: 'ই-বন্ড চুক্তি',
    agreementBody: 'সিস্টেম-জেনারেটেড বন্ড চুক্তি আবেদনকারীর ই-স্বাক্ষরের অপেক্ষায় রয়েছে।',
    signAgreement: 'বন্ডকারী ই-স্বাক্ষর করুন',
    issuedTitle: 'লাইসেন্স ইস্যু হয়েছে',
    licenseNoLabel: 'জেনারেটেড লাইসেন্স নং',
    viewLicenseDoc: 'ই-বন্ড লাইসেন্স দেখুন',
    autoTriggered: 'স্বয়ংক্রিয়ভাবে সম্পাদিত কার্যক্রম',
    hsCodeBound: 'লাইসেন্সের সাথে এইচএস কোড সংযুক্ত',
    passbookIssued: 'ই-পাসবুক স্বয়ংক্রিয়ভাবে ইস্যু হয়েছে (ই-পাসবুক দেখুন)',
    bondRegisterIssued: 'পরোক্ষ রপ্তানিকারকদের জন্য ই-বন্ড রেজিস্টার স্বয়ংক্রিয়ভাবে ইস্যু হয়েছে (ই-বন্ড রেজিস্টার দেখুন)',
    generalBondIssued: 'ই-জেনারেল বন্ড স্বয়ংক্রিয়ভাবে ইস্যু হয়েছে (জেনারেল বন্ড ব্যবস্থাপনা দেখুন)',
    entitlementPending: 'এনটাইটেলমেন্ট ও যন্ত্রপাতি রেকর্ড সংশ্লিষ্ট মডিউল উপলব্ধ হলে পূরণ হবে',
    disapprovedTitle: 'আবেদন অননুমোদিত',
    disapprovedNotice: 'অননুমোদন বিজ্ঞপ্তি পাঠানো হয়েছে। আবেদনকারীর প্রোফাইল অননুমোদিত আবেদনকারী হিসেবে চিহ্নিত হয়েছে।',
    verified: 'যাচাইকৃত',
    licenseDocTitle: 'ইলেকট্রনিক বন্ড লাইসেন্স',
    govLine1: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    govLine2: 'জাতীয় রাজস্ব বোর্ড — কাস্টমস বন্ড কমিশনারেট',
    verificationCode: 'যাচাইকরণ কোড',
    reportNo: 'প্রতিবেদন নং',
    commissionerLine: 'কমিশনার, কাস্টমস বন্ড কমিশনারেট',
    inspectionTeamLead: 'পরিদর্শন দল প্রধান',
    riskAssessedBy: 'ঝুঁকি মূল্যায়নকারী',
    reportingOfficer: 'প্রতিবেদনকারী কর্মকর্তা',
    computerGenerated: 'এটি একটি কম্পিউটার-জেনারেটেড নথি, শারীরিক স্বাক্ষর ছাড়াই বৈধ।',
    print: 'প্রিন্ট',
    download: 'ডাউনলোড',
    trackApplication: 'এই আবেদনটি ট্র্যাক করুন',
    inspectionReportTitle: 'পরিদর্শন ই-প্রতিবেদন',
    riskReportTitle: 'ঝুঁকি মূল্যায়ন ই-প্রতিবেদন',
    finalReportTitle: 'চূড়ান্ত আবেদনকারী প্রতিবেদন',
    teamMembersLabel: 'পরিদর্শন দল',
    criteriaLabel: 'মানদণ্ড',
    levelLabel: 'মাত্রা',
    manageInspectionCriteriaTitle: 'পরিদর্শন মানদণ্ড ব্যবস্থাপনা',
    manageRiskCriteriaTitle: 'ঝুঁকি মানদণ্ড ব্যবস্থাপনা',
    criterionEnLabel: 'লেবেল (ইংরেজি)',
    criterionBnLabel: 'লেবেল (বাংলা)',
    addCriterion: 'মানদণ্ড যোগ করুন',
    delete: 'মুছে ফেলুন',
    done: 'সম্পন্ন',
  },
};

const steps = [
  { id: 'business', en: 'Business & License Type', bn: 'ব্যবসা ও লাইসেন্সের ধরন', icon: 'assignment' },
  { id: 'factory', en: 'Factory & Premises', bn: 'কারখানা ও প্রাঙ্গণ', icon: 'factory' },
  { id: 'bond-docs', en: 'General Bond & Documents', bn: 'জেনারেল বন্ড ও নথি', icon: 'upload_file' },
  { id: 'review', en: 'Review & Submit', bn: 'পর্যালোচনা ও জমা', icon: 'fact_check' },
];

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

function TextInput({ value, onChange, placeholder, error, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; error?: boolean; type?: string }) {
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

function SelectInput({ value, onChange, options, placeholder, error }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string; error?: boolean }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} ${error ? errorInputClass : ''} ${value ? '' : 'text-[#94A3B8]'}`}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-[#1E293B]">
          {o}
        </option>
      ))}
    </select>
  );
}

function PillGroup({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { en: string; bn: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.en}
          type="button"
          onClick={() => onChange(opt.en)}
          className={[
            'rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
            value === opt.en ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
          ].join(' ')}
        >
          {opt.en}
        </button>
      ))}
    </div>
  );
}

interface UploadStatus {
  uploaded: boolean;
  fileName?: string;
  size?: string;
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
  status: UploadStatus;
  onUpload: () => void;
  onRemove: () => void;
  language: Language;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', status.uploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
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
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে'}</span>
          <button type="button" onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F5F7FA] hover:text-[#DC2626]">
            <Icon name="delete" className="text-[18px]" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={onUpload} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] transition-colors hover:bg-[#EAF3FE]">
          <Icon name="upload" className="text-[16px]" />
          {language === 'en' ? 'Upload' : 'আপলোড করুন'}
        </button>
      )}
    </div>
  );
}

function StepperNav({ language, currentStep, furthestStep, onJump }: { language: Language; currentStep: number; furthestStep: number; onJump: (i: number) => void }) {
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
                  state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]',
                ].join(' ')}
              >
                {state === 'done' ? <Icon name="check" className="text-[18px]" /> : i + 1}
              </span>
              <span className={['block truncate text-[13px] font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{s[language]}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function QrPattern() {
  const cells = ['1110101110111', '1000100010001', '1011101110101', '1011100010101', '1000101110001', '1110100010111', '0000101110000', '1101000000101', '1010111011101', '1000100010101', '1011101011101', '1000100000001', '1110111011101'];
  const px = 6;
  return (
    <svg viewBox={`0 0 ${13 * px} ${13 * px}`} className="h-24 w-24 shrink-0">
      <rect width={13 * px} height={13 * px} fill="white" />
      {cells.map((row, y) => row.split('').map((c, x) => (c === '1' ? <rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill="#1E293B" /> : null)))}
    </svg>
  );
}

function BarcodePattern() {
  const widths = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 3, 2, 1, 1];
  let x = 0;
  return (
    <svg viewBox="0 0 220 46" className="h-11 w-full">
      <rect width="220" height="46" fill="white" />
      {widths.map((w, i) => {
        const bar = i % 2 === 0 ? <rect key={i} x={x} y={2} width={w * 3} height={34} fill="#1E293B" /> : null;
        x += w * 3;
        return bar;
      })}
    </svg>
  );
}

const districts = ['Dhaka', 'Chattogram', 'Gazipur', 'Narayanganj', 'Savar', 'Cumilla', 'Khulna', 'Rajshahi'];
const lienBanks = [
  'Sonali Bank, Motijheel Corporate Branch',
  'Standard Chartered Bank, Gulshan Branch',
  'Eastern Bank Limited, Motijheel Branch',
  'Dutch-Bangla Bank Limited, Agrabad Branch',
  'Sonali Bank, Savar Branch',
];

const documentDefs = [
  { id: 'tradeLicense', icon: 'description', en: 'Trade License (copy)', bn: 'ট্রেড লাইসেন্স (কপি)', required: true },
  { id: 'binTinCert', icon: 'badge', en: 'BIN & TIN Certificates', bn: 'বিআইএন ও টিআইএন সার্টিফিকেট', required: true },
  { id: 'factoryLayout', icon: 'floor_plan', en: 'Factory Layout Plan', bn: 'কারখানার লে-আউট পরিকল্পনা', required: true },
  { id: 'landDoc', icon: 'home_work', en: 'Land Ownership / Rental Agreement', bn: 'জমির মালিকানা / ভাড়া চুক্তি', required: true },
  { id: 'machineryList', icon: 'precision_manufacturing', en: 'Machinery List / Import Invoice', bn: 'যন্ত্রপাতির তালিকা / আমদানি চালান', required: true },
  { id: 'bankSolvency', icon: 'account_balance', en: 'Bank Solvency Certificate', bn: 'ব্যাংক সলভেন্সি সার্টিফিকেট', required: true },
  { id: 'generalBondHardcopy', icon: 'gavel', en: 'General Bond (hardcopy, scanned)', bn: 'জেনারেল বন্ড (হার্ডকপি, স্ক্যান)', required: true },
];

const officerPool = [
  { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  { en: 'Nusrat Jahan (ARO, Narayanganj Zone)', bn: 'নুসরাত জাহান (এআরও, নারায়ণগঞ্জ জোন)' },
];

interface Criterion {
  id: string;
  en: string;
  bn: string;
  weight: number;
}

const defaultInspectionCriteria: Criterion[] = [
  { id: 'layout', en: 'Layout of the factory', bn: 'কারখানার লে-আউট', weight: 6 },
  { id: 'safety', en: 'Safety and security compliance', bn: 'নিরাপত্তা ও সুরক্ষা সম্মতি', weight: 10 },
  { id: 'machinery', en: 'Existence and workability of declared machinery', bn: 'ঘোষিত যন্ত্রপাতির উপস্থিতি ও কার্যকারিতা', weight: 9 },
  { id: 'relevance', en: 'Relevance of input, output and machines', bn: 'ইনপুট, আউটপুট ও যন্ত্রপাতির প্রাসঙ্গিকতা', weight: 7 },
  { id: 'capacity', en: 'Production capacity', bn: 'উৎপাদন সক্ষমতা', weight: 6 },
  { id: 'utility', en: 'Utility bills and load capacity', bn: 'ইউটিলিটি বিল ও লোড ক্ষমতা', weight: 5 },
  { id: 'access', en: 'Access to the factory and surroundings', bn: 'কারখানা ও আশেপাশে প্রবেশাধিকার', weight: 4 },
];

const defaultRiskCriteria: Criterion[] = [
  { id: 'complianceHistory', en: 'Compliance & Audit History', bn: 'সম্মতি ও নিরীক্ষা ইতিহাস', weight: 9 },
  { id: 'financialStability', en: 'Financial Stability Indicators', bn: 'আর্থিক স্থিতিশীলতা সূচক', weight: 7 },
  { id: 'ownershipComplexity', en: 'Ownership Structure Complexity', bn: 'মালিকানা কাঠামোর জটিলতা', weight: 5 },
  { id: 'importVolume', en: 'Import Volume vs. Declared Capacity', bn: 'আমদানি পরিমাণ বনাম ঘোষিত সক্ষমতা', weight: 8 },
  { id: 'legalRecord', en: 'Legal / Litigation Record', bn: 'আইনি / মামলা সংক্রান্ত রেকর্ড', weight: 8 },
];

const riskNumeric: Record<RiskLevel, number> = { low: 2, medium: 5, high: 9 };

function computeInspectionResult(config: Criterion[], scores: Record<string, boolean> | undefined) {
  const s = scores ?? {};
  const totalWeight = config.reduce((sum, c) => sum + c.weight, 0) || 1;
  const passedWeight = config.reduce((sum, c) => sum + (s[c.id] ? c.weight : 0), 0);
  const pct = Math.round((passedWeight / totalWeight) * 100);
  return { pct, compliant: pct >= 70 };
}

function computeRiskResult(config: Criterion[], scores: Record<string, RiskLevel> | undefined) {
  const s = scores ?? {};
  const totalWeight = config.reduce((sum, c) => sum + c.weight, 0) || 1;
  const weightedSum = config.reduce((sum, c) => sum + riskNumeric[s[c.id] ?? 'medium'] * c.weight, 0);
  const avg = Math.round((weightedSum / totalWeight) * 10) / 10;
  const level: RiskLevel = avg <= 3.5 ? 'low' : avg <= 6.5 ? 'medium' : 'high';
  return { avg, level };
}

const stageOrder: Stage[] = ['submitted', 'doc-verification', 'inspection', 'risk-assessment', 'final-report', 'approval', 'payment', 'agreement', 'issued'];

interface NothiEntry {
  id: string;
  stage: Stage;
  officer: string;
  note: string;
  date: string;
}

interface Application {
  id: string;
  orgNameEn: string;
  orgNameBn: string;
  category: string;
  bin: string;
  submittedDate: string;
  stage: Stage;
  assignedOfficer?: string;
  lienBankVerified?: boolean;
  auditChecked?: boolean;
  nothiEntries?: NothiEntry[];
  inspectionTeamMembers?: string[];
  teamFormed?: boolean;
  inspectionDate?: string;
  inspectionScheduled?: boolean;
  visitNotes?: string;
  photosCaptured?: number;
  inspectionScores?: Record<string, boolean>;
  inspectionSubmitted?: boolean;
  inspectionCompliant?: boolean;
  inspectionPct?: number;
  riskScores?: Record<string, RiskLevel>;
  riskSubmitted?: boolean;
  riskLevel?: RiskLevel;
  riskAvg?: number;
  riskNote?: string;
  finalReportSubmitted?: boolean;
  finalReportOutcome?: 'favorable' | 'unfavorable';
  finalReportNote?: string;
  approvalNote?: string;
  disapprovalReason?: string;
  licenseNo?: string;
  paymentDone?: boolean;
  agreementSigned?: boolean;
}

const seedApplications: Application[] = [
  {
    id: 'APP-2026-70211', orgNameEn: 'Comfort Knit Composite Ltd.', orgNameBn: 'কমফোর্ট নিট কম্পোজিট লিমিটেড', category: 'Deemed Exporter', bin: '008834521-0705',
    submittedDate: '18 Jul 2026', stage: 'doc-verification', assignedOfficer: officerPool[0].en, lienBankVerified: false, auditChecked: false,
  },
  {
    id: 'APP-2026-70198', orgNameEn: 'Silver Line Garments Ltd.', orgNameBn: 'সিলভার লাইন গার্মেন্টস লিমিটেড', category: 'Direct Exporter', bin: '007745210-0604',
    submittedDate: '12 Jul 2026', stage: 'inspection', assignedOfficer: officerPool[1].en, lienBankVerified: true, auditChecked: true,
    nothiEntries: [
      { id: 'N-70198-1', stage: 'doc-verification', officer: officerPool[1].en, note: 'All submitted documents examined and found in order. Trade license, BIN/TIN certificates and factory layout plan verified against application. No discrepancies noted.', date: '13 Jul 2026' },
    ],
  },
  {
    id: 'APP-2026-70180', orgNameEn: 'Orchid Fashions Ltd.', orgNameBn: 'অর্কিড ফ্যাশনস লিমিটেড', category: 'Direct Exporter', bin: '006621478-0503',
    submittedDate: '02 Jul 2026', stage: 'approval', assignedOfficer: officerPool[2].en, lienBankVerified: true, auditChecked: true,
    nothiEntries: [
      { id: 'N-70180-1', stage: 'doc-verification', officer: officerPool[2].en, note: 'Documents examined and verified complete. Land ownership documents and bank solvency certificate cross-checked with originals.', date: '04 Jul 2026' },
      { id: 'N-70180-2', stage: 'inspection', officer: officerPool[2].en, note: 'Factory premises inspected; machinery matched declared list; workers present as per payroll register.', date: '10 Jul 2026' },
    ],
    inspectionTeamMembers: [officerPool[2].en, officerPool[1].en], teamFormed: true, inspectionDate: '10 Jul 2026', inspectionScheduled: true,
    visitNotes: 'Factory premises inspected; machinery matched declared list; workers present as per payroll register.', photosCaptured: 6,
    inspectionScores: Object.fromEntries(defaultInspectionCriteria.map((c) => [c.id, true])),
    inspectionSubmitted: true, inspectionCompliant: true, inspectionPct: 100,
    riskScores: Object.fromEntries(defaultRiskCriteria.map((c) => [c.id, 'low' as RiskLevel])),
    riskSubmitted: true, riskLevel: 'low', riskAvg: 2, riskNote: 'Standard risk profile, no adverse findings.',
    finalReportSubmitted: true, finalReportOutcome: 'favorable', finalReportNote: 'All document, inspection and risk checks compliant. Recommended for approval.',
  },
  {
    id: 'APP-2026-70145', orgNameEn: 'Vertex Apparels Ltd.', orgNameBn: 'ভার্টেক্স অ্যাপারেলস লিমিটেড', category: 'Direct Exporter', bin: '005512367-0402',
    submittedDate: '15 Jun 2026', stage: 'issued', assignedOfficer: officerPool[0].en, lienBankVerified: true, auditChecked: true,
    nothiEntries: [
      { id: 'N-70145-1', stage: 'doc-verification', officer: officerPool[0].en, note: 'Full document set examined; trade license and machinery import invoices verified. Application forwarded for factory inspection.', date: '17 Jun 2026' },
      { id: 'N-70145-2', stage: 'inspection', officer: officerPool[0].en, note: 'Site visit completed without issue; utility connections verified against declared load.', date: '22 Jun 2026' },
      { id: 'N-70145-3', stage: 'approval', officer: officerPool[0].en, note: 'All checks passed. Approved for issuance.', date: '25 Jun 2026' },
    ],
    inspectionTeamMembers: [officerPool[0].en], teamFormed: true, inspectionDate: '22 Jun 2026', inspectionScheduled: true,
    visitNotes: 'Site visit completed without issue; utility connections verified against declared load.', photosCaptured: 4,
    inspectionScores: Object.fromEntries(defaultInspectionCriteria.map((c) => [c.id, true])),
    inspectionSubmitted: true, inspectionCompliant: true, inspectionPct: 100,
    riskScores: Object.fromEntries(defaultRiskCriteria.map((c) => [c.id, 'low' as RiskLevel])),
    riskSubmitted: true, riskLevel: 'low', riskAvg: 2, riskNote: 'Compliant applicant with clean audit history.',
    finalReportSubmitted: true, finalReportOutcome: 'favorable', finalReportNote: 'Fully compliant across all checks. Recommended for approval.',
    approvalNote: 'All checks passed. Approved for issuance.', licenseNo: 'BL-2026-05102', paymentDone: true, agreementSigned: true,
  },
];

const initialForm = {
  category: '',
  orgNameEn: '',
  orgNameBn: '',
  bin: '',
  tin: '',
  tradeLicenseNo: '',
  bondingPeriod: '',
  factoryAddress: '',
  district: '',
  premisesType: '',
  factoryArea: '',
  workerCount: '',
  productionCapacity: '',
  utilityLoad: '',
  bondAmount: '',
  lienBank: '',
  agree: false,
};

function CriteriaManagerModal({
  title,
  language,
  t,
  criteria,
  onChange,
  onClose,
}: {
  title: string;
  language: Language;
  t: (typeof T)['en'];
  criteria: Criterion[];
  onChange: (next: Criterion[]) => void;
  onClose: () => void;
}) {
  const [newEn, setNewEn] = useState('');
  const [newBn, setNewBn] = useState('');
  const [newWeight, setNewWeight] = useState(5);

  const updateCriterion = (id: string, patch: Partial<Criterion>) => {
    onChange(criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const removeCriterion = (id: string) => onChange(criteria.filter((c) => c.id !== id));
  const addCriterion = () => {
    if (!newEn || !newBn) return;
    onChange([...criteria, { id: `c-${Date.now()}`, en: newEn, bn: newBn, weight: newWeight }]);
    setNewEn('');
    setNewBn('');
    setNewWeight(5);
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3 px-5 py-5">
          {criteria.map((c) => (
            <div key={c.id} className="flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3">
              <div className="grid grid-cols-2 gap-2">
                <input value={c.en} onChange={(e) => updateCriterion(c.id, { en: e.target.value })} className={inputClass} />
                <input value={c.bn} onChange={(e) => updateCriterion(c.id, { bn: e.target.value })} className={inputClass} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-[#334155]">
                  {t.weightLabel} (1–10)
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={c.weight}
                    onChange={(e) => updateCriterion(c.id, { weight: Math.min(10, Math.max(1, Number(e.target.value) || 1)) })}
                    className="w-16 rounded-lg border border-[#CBD5E1] px-2 py-1 text-xs"
                  />
                </label>
                <button type="button" onClick={() => removeCriterion(c.id)} className="flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline">
                  <Icon name="delete" className="text-[15px]" />
                  {t.delete}
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-2 rounded-lg border border-dashed border-[#CBD5E1] p-3">
            <Field label={t.criterionEnLabel}>
              <input value={newEn} onChange={(e) => setNewEn(e.target.value)} className={inputClass} />
            </Field>
            <Field label={t.criterionBnLabel}>
              <input value={newBn} onChange={(e) => setNewBn(e.target.value)} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-xs text-[#334155]">
              {t.weightLabel} (1–10)
              <input type="number" min={1} max={10} value={newWeight} onChange={(e) => setNewWeight(Math.min(10, Math.max(1, Number(e.target.value) || 1)))} className="w-16 rounded-lg border border-[#CBD5E1] px-2 py-1 text-xs" />
            </label>
            <button type="button" onClick={addCriterion} disabled={!newEn || !newBn} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00A86B] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#048f5c] disabled:opacity-40">
              <Icon name="add" className="text-[15px]" />
              {t.addCriterion}
            </button>
          </div>
        </div>
        <div className="flex justify-end border-t border-[#E2E8F0] px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083E71]">
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
}

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
            className={[
              'relative flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
              isSelected ? 'bg-[#0A4D8C] text-white' : isOccupied ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-[#F5F7FA] text-[#334155] hover:bg-[#EAF3FE]',
            ].join(' ')}
          >
            {d}
            {isOccupied && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber-500" />}
          </button>
        );
      })}
    </div>
  );
}

function NothiViewer({
  language,
  t,
  application,
  onClose,
}: {
  language: Language;
  t: (typeof T)['en'];
  application: Application;
  onClose: () => void;
}) {
  const entries = application.nothiEntries ?? [];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
          <div>
            <h2 className="flex items-center gap-1.5 text-base font-bold text-[#1E293B]">
              <Icon name="history_edu" className="text-[20px] text-[#0A4D8C]" />
              {t.nothiTitle}
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">{t.nothiSubtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          {entries.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#94A3B8]">{t.nothiNoEntries}</p>
          ) : (
            <ol className="flex flex-col gap-4">
              {entries.map((entry, i) => (
                <li key={entry.id} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAF3FE] text-[#0A4D8C]">
                      <Icon name="description" className="text-[14px]" />
                    </span>
                    {i < entries.length - 1 && <span className="w-0.5 flex-1 bg-[#E2E8F0]" style={{ minHeight: '12px' }} />}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[10px] font-semibold text-[#334155]">{t.stageLabels[entry.stage]}</span>
                      <span className="text-[11px] text-[#94A3B8]">{entry.date}</span>
                    </div>
                    <p className="mt-1 text-[12px] font-semibold text-[#1E293B]">
                      {t.nothiEntryBy}: {entry.officer}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-[#334155]">{entry.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex justify-end border-t border-[#E2E8F0] px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportDoc({
  language,
  t,
  reportType,
  application,
  inspectionCriteria,
  riskCriteria,
  onClose,
}: {
  language: Language;
  t: (typeof T)['en'];
  reportType: 'inspection' | 'risk' | 'final';
  application: Application;
  inspectionCriteria: Criterion[];
  riskCriteria: Criterion[];
  onClose: () => void;
}) {
  const a = application;
  const title = reportType === 'inspection' ? t.inspectionReportTitle : reportType === 'risk' ? t.riskReportTitle : t.finalReportTitle;
  const reportNo = `${reportType === 'inspection' ? 'INS' : reportType === 'risk' ? 'RSK' : 'FIN'}-${a.id.replace('APP-', '')}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-base font-bold text-[#1E293B]">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <div className="rounded-lg border-2 border-[#CBD5E1] bg-white p-5">
            <div className="text-center">
              <p className="text-[11px] font-semibold text-[#64748B]">{t.govLine1}</p>
              <p className="text-[11px] font-semibold text-[#64748B]">{t.govLine2}</p>
              <h3 className="mt-2 text-base font-extrabold uppercase tracking-wide text-[#0A4D8C]">{title}</h3>
            </div>
            <div className="my-4 border-t border-dashed border-[#CBD5E1]" />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
              <div>
                <dt className="text-[#94A3B8]">{t.reportNo}</dt>
                <dd className="font-semibold text-[#1E293B]">{reportNo}</dd>
              </div>
              <div>
                <dt className="text-[#94A3B8]">{language === 'en' ? 'Application ID' : 'আবেদন আইডি'}</dt>
                <dd className="font-semibold text-[#1E293B]">{a.id}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#94A3B8]">{language === 'en' ? 'Applicant' : 'আবেদনকারী'}</dt>
                <dd className="font-semibold text-[#1E293B]">
                  {a[language === 'en' ? 'orgNameEn' : 'orgNameBn']} · {a.bin}
                </dd>
              </div>
            </dl>

            {reportType === 'inspection' && (
              <>
                <div className="my-3 border-t border-[#F1F5F9]" />
                <p className="text-[11px] text-[#94A3B8]">{t.teamMembersLabel}</p>
                <p className="mb-2 text-[12px] font-medium text-[#1E293B]">{(a.inspectionTeamMembers ?? []).join(', ')} · {a.inspectionDate}</p>
                <p className="text-[11px] text-[#94A3B8]">{t.visitNotesLabel}</p>
                <p className="mb-2 text-[12px] leading-relaxed text-[#334155]">{a.visitNotes}</p>
                <table className="mt-2 w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#94A3B8]">
                      <th className="py-1 text-left font-semibold">{t.criteriaLabel}</th>
                      <th className="py-1 text-right font-semibold">{t.weightLabel}</th>
                      <th className="py-1 text-right font-semibold">{language === 'en' ? 'Result' : 'ফলাফল'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionCriteria.map((c) => (
                      <tr key={c.id} className="border-b border-[#F1F5F9]">
                        <td className="py-1 text-[#334155]">{c[language]}</td>
                        <td className="py-1 text-right text-[#64748B]">{c.weight}</td>
                        <td className={`py-1 text-right font-semibold ${a.inspectionScores?.[c.id] ? 'text-emerald-600' : 'text-[#DC2626]'}`}>
                          {a.inspectionScores?.[c.id] ? t.pass : t.fail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                  <span className="text-xs font-semibold text-[#334155]">
                    {t.weightedScore}: {a.inspectionPct}%
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.inspectionCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-[#DC2626]'}`}>
                    {a.inspectionCompliant ? t.compliant : t.nonCompliant}
                  </span>
                </div>
                <div className="mt-5 flex flex-col gap-1">
                  <div className="h-8 w-40 border-b border-[#334155]" />
                  <p className="text-[10px] text-[#94A3B8]">
                    {t.inspectionTeamLead}: {(a.inspectionTeamMembers ?? [])[0]}
                  </p>
                </div>
              </>
            )}

            {reportType === 'risk' && (
              <>
                <div className="my-3 border-t border-[#F1F5F9]" />
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#94A3B8]">
                      <th className="py-1 text-left font-semibold">{t.criteriaLabel}</th>
                      <th className="py-1 text-right font-semibold">{t.weightLabel}</th>
                      <th className="py-1 text-right font-semibold">{t.levelLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskCriteria.map((c) => {
                      const lvl = a.riskScores?.[c.id] ?? 'medium';
                      return (
                        <tr key={c.id} className="border-b border-[#F1F5F9]">
                          <td className="py-1 text-[#334155]">{c[language]}</td>
                          <td className="py-1 text-right text-[#64748B]">{c.weight}</td>
                          <td className="py-1 text-right font-semibold text-[#1E293B]">{lvl === 'low' ? t.riskLow : lvl === 'medium' ? t.riskMedium : t.riskHigh}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-2 text-[12px] leading-relaxed text-[#334155]">{a.riskNote}</p>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                  <span className="text-xs font-semibold text-[#334155]">
                    {language === 'en' ? 'Weighted Average' : 'ওজনযুক্ত গড়'}: {a.riskAvg} / 10
                  </span>
                  <span className="rounded-full bg-[#EAF3FE] px-2.5 py-1 text-[11px] font-bold text-[#0A4D8C]">
                    {a.riskLevel === 'low' ? t.riskLow : a.riskLevel === 'medium' ? t.riskMedium : t.riskHigh}
                  </span>
                </div>
                <div className="mt-5 flex flex-col gap-1">
                  <div className="h-8 w-40 border-b border-[#334155]" />
                  <p className="text-[10px] text-[#94A3B8]">
                    {t.riskAssessedBy}: {a.assignedOfficer}
                  </p>
                </div>
              </>
            )}

            {reportType === 'final' && (
              <>
                <div className="my-3 border-t border-[#F1F5F9]" />
                <dl className="flex flex-col gap-2 text-[12px]">
                  <div className="flex justify-between">
                    <dt className="text-[#64748B]">{t.docVerificationSummary}</dt>
                    <dd className="font-semibold text-emerald-600">{t.compliant}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#64748B]">{t.stageLabels.inspection}</dt>
                    <dd className={`font-semibold ${a.inspectionCompliant ? 'text-emerald-600' : 'text-[#DC2626]'}`}>
                      {a.inspectionCompliant ? t.compliant : t.nonCompliant} ({a.inspectionPct}%)
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#64748B]">{t.riskLevelLabel}</dt>
                    <dd className="font-semibold text-[#1E293B]">{a.riskLevel === 'low' ? t.riskLow : a.riskLevel === 'medium' ? t.riskMedium : t.riskHigh}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-[11px] text-[#94A3B8]">{t.recommendationLabel}</p>
                <p className="mb-2 text-[12px] leading-relaxed text-[#334155]">{a.finalReportNote}</p>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                  <span className="text-xs font-semibold text-[#334155]">{t.outcomeLabel}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.finalReportOutcome === 'favorable' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-[#DC2626]'}`}>
                    {a.finalReportOutcome === 'favorable' ? t.favorable : t.unfavorable}
                  </span>
                </div>
                <div className="mt-5 flex flex-col gap-1">
                  <div className="h-8 w-40 border-b border-[#334155]" />
                  <p className="text-[10px] text-[#94A3B8]">
                    {t.reportingOfficer}: {a.assignedOfficer}
                  </p>
                </div>
              </>
            )}

            <p className="mt-4 text-center text-[10px] text-[#94A3B8]">{t.computerGenerated}</p>
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

export function NewBondLicense({ language, onDone }: NewBondLicenseProps) {
  const t = T[language];
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [docs, setDocs] = useState<Record<string, UploadStatus>>(Object.fromEntries(documentDefs.map((d) => [d.id, { uploaded: false }])));
  const [submitted, setSubmitted] = useState(false);
  const [appId] = useState(() => `APP-2026-${Math.floor(70000 + Math.random() * 9999)}`);

  const [applications, setApplications] = useState<Application[]>(seedApplications);
  const [view, setView] = useState<'form' | 'queue'>('form');
  const [queueFilter, setQueueFilter] = useState<'all' | 'in-progress' | 'issued' | 'disapproved'>('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [viewingDoc, setViewingDoc] = useState<Application | null>(null);
  const [viewingReport, setViewingReport] = useState<{ type: 'inspection' | 'risk' | 'final'; app: Application } | null>(null);
  const [viewingNothi, setViewingNothi] = useState<Application | null>(null);
  const [nothiDraft, setNothiDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const [inspectionCriteria, setInspectionCriteria] = useState<Criterion[]>(defaultInspectionCriteria);
  const [riskCriteria, setRiskCriteria] = useState<Criterion[]>(defaultRiskCriteria);
  const [managingCriteria, setManagingCriteria] = useState<'inspection' | 'risk' | null>(null);

  const set = (key: keyof typeof form, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const requiredByStep: Record<number, (keyof typeof form)[]> = {
    0: ['category', 'orgNameEn', 'bin', 'tin', 'tradeLicenseNo', 'bondingPeriod'],
    1: ['factoryAddress', 'district', 'premisesType', 'factoryArea', 'workerCount'],
    2: ['bondAmount', 'lienBank'],
    3: [],
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

  const handleSubmit = () => {
    if (!form.agree) {
      setErrors({ agree: true });
      return;
    }
    const newApp: Application = {
      id: appId,
      orgNameEn: form.orgNameEn,
      orgNameBn: form.orgNameBn || form.orgNameEn,
      category: form.category,
      bin: form.bin,
      submittedDate: '23 Jul 2026',
      stage: 'submitted',
    };
    setApplications((prev) => [newApp, ...prev]);
    setSubmitted(true);
  };

  const updateApp = (id: string, patch: Partial<Application>) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const addNothiEntry = (id: string, stage: Stage, officer: string, note: string) => {
    if (!note.trim()) return;
    const entry: NothiEntry = { id: `N-${Date.now()}`, stage, officer: officer || '—', note, date: '23 Jul 2026' };
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, nothiEntries: [...(a.nothiEntries ?? []), entry] } : a)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, nothiEntries: [...(prev.nothiEntries ?? []), entry] } : prev));
  };

  const pendingCount = applications.filter((a) => a.stage !== 'issued' && a.stage !== 'disapproved').length;

  const filteredApps = applications.filter((a) => {
    if (queueFilter === 'all') return true;
    if (queueFilter === 'issued') return a.stage === 'issued';
    if (queueFilter === 'disapproved') return a.stage === 'disapproved';
    return a.stage !== 'issued' && a.stage !== 'disapproved';
  });

  const openApp = (a: Application) => {
    setSelected(a);
    setNothiDraft('');
  };

  const getOccupiedDates = (excludeId: string) => {
    const map: Record<string, string[]> = {};
    applications.forEach((ap) => {
      if (ap.id === excludeId) return;
      if (ap.inspectionDate && ap.inspectionDate.toLowerCase().includes('jul 2026')) {
        const day = ap.inspectionDate.split(' ')[0].padStart(2, '0');
        map[day] = [...(map[day] ?? []), ap.orgNameEn];
      }
    });
    return map;
  };

  if (managingCriteria) {
    return (
      <>
        <CriteriaManagerModal
          title={managingCriteria === 'inspection' ? t.manageInspectionCriteriaTitle : t.manageRiskCriteriaTitle}
          language={language}
          t={t}
          criteria={managingCriteria === 'inspection' ? inspectionCriteria : riskCriteria}
          onChange={managingCriteria === 'inspection' ? setInspectionCriteria : setRiskCriteria}
          onClose={() => setManagingCriteria(null)}
        />
      </>
    );
  }

  if (viewingReport) {
    return (
      <ReportDoc
        language={language}
        t={t}
        reportType={viewingReport.type}
        application={viewingReport.app}
        inspectionCriteria={inspectionCriteria}
        riskCriteria={riskCriteria}
        onClose={() => setViewingReport(null)}
      />
    );
  }

  if (viewingNothi) {
    return <NothiViewer language={language} t={t} application={viewingNothi} onClose={() => setViewingNothi(null)} />;
  }

  if (viewingDoc) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6" onClick={() => setViewingDoc(null)}>
        <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="text-base font-bold text-[#1E293B]">{t.licenseDocTitle}</h2>
            <button type="button" onClick={() => setViewingDoc(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>
          <div className="overflow-y-auto p-5">
            <div className="rounded-lg border-2 border-[#CBD5E1] bg-white p-5">
              <div className="text-center">
                <p className="text-[11px] font-semibold text-[#64748B]">{t.govLine1}</p>
                <p className="text-[11px] font-semibold text-[#64748B]">{t.govLine2}</p>
                <h3 className="mt-2 text-lg font-extrabold tracking-wide text-[#0A4D8C]">CUSTOMS BOND LICENSE</h3>
              </div>
              <div className="my-4 border-t border-dashed border-[#CBD5E1]" />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                <div>
                  <dt className="text-[#94A3B8]">{t.licenseNoLabel}</dt>
                  <dd className="font-semibold text-[#1E293B]">{viewingDoc.licenseNo}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">BIN</dt>
                  <dd className="font-semibold text-[#1E293B]">{viewingDoc.bin}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[#94A3B8]">{language === 'en' ? 'Licensee' : 'লাইসেন্সি'}</dt>
                  <dd className="font-semibold text-[#1E293B]">{viewingDoc[language === 'en' ? 'orgNameEn' : 'orgNameBn']}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">{language === 'en' ? 'Category' : 'ক্যাটাগরি'}</dt>
                  <dd className="font-semibold text-[#1E293B]">{viewingDoc.category}</dd>
                </div>
                <div>
                  <dt className="text-[#94A3B8]">{t.issuedTitle}</dt>
                  <dd className="font-semibold text-[#1E293B]">23 Jul 2026</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="h-8 w-32 border-b border-[#334155]" />
                  <p className="text-[10px] text-[#94A3B8]">{t.commissionerLine}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <QrPattern />
                  <p className="text-[9px] text-[#94A3B8]">
                    {t.verificationCode}: CBMS-{viewingDoc.licenseNo}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <BarcodePattern />
              </div>
              <p className="mt-3 text-center text-[10px] text-[#94A3B8]">{t.computerGenerated}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
            <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
              <Icon name="print" className="text-[16px]" />
              {t.print}
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
              <Icon name="download" className="text-[16px]" />
              {t.download}
            </button>
            <button type="button" onClick={() => setViewingDoc(null)} className="rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
              {t.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selected) {
    const a = selected;
    const stageIndex = stageOrder.indexOf(a.stage);
    const toggleTeamMember = (name: string) => {
      const current = a.inspectionTeamMembers ?? [];
      const next = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
      updateApp(a.id, { inspectionTeamMembers: next });
    };
    const occupied = getOccupiedDates(a.id);
    const selectedDay = a.inspectionDate ? a.inspectionDate.split(' ')[0].padStart(2, '0') : '';

    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
        <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">{t.reviewTitle}</h2>
              <p className="text-xs text-[#64748B]">
                {a.id} · {a[language === 'en' ? 'orgNameEn' : 'orgNameBn']}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setViewingNothi(a)}
                className="relative inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-3 py-1.5 text-[11px] font-semibold text-[#334155] hover:bg-[#F5F7FA]"
              >
                <Icon name="history_edu" className="text-[15px]" />
                {t.viewNothi}
                {!!a.nothiEntries?.length && <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0A4D8C] px-1 text-[10px] font-bold text-white">{a.nothiEntries.length}</span>}
              </button>
              <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
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
                  {t.disapprovedTitle}
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

                      {state === 'done' && stage === 'submitted' && (
                        <p className="mt-0.5 text-xs text-[#64748B]">
                          {t.assignedTo}: {a.assignedOfficer}
                        </p>
                      )}
                      {state === 'done' && stage === 'doc-verification' && (
                        <p className="mt-0.5 text-xs text-[#64748B]">
                          {t.lienVerified} · {t.auditCheckResult}
                        </p>
                      )}
                      {state === 'done' && stage === 'inspection' && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                          <span>
                            {a.inspectionDate} · {a.inspectionCompliant ? t.compliant : t.nonCompliant} ({a.inspectionPct}%)
                          </span>
                          <button type="button" onClick={() => setViewingReport({ type: 'inspection', app: a })} className="font-semibold text-[#0A4D8C] hover:underline">
                            {t.viewInspectionReport}
                          </button>
                        </div>
                      )}
                      {state === 'done' && stage === 'risk-assessment' && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                          <span>
                            {t.riskLevelLabel}: {a.riskLevel === 'low' ? t.riskLow : a.riskLevel === 'medium' ? t.riskMedium : t.riskHigh}
                          </span>
                          <button type="button" onClick={() => setViewingReport({ type: 'risk', app: a })} className="font-semibold text-[#0A4D8C] hover:underline">
                            {t.viewRiskReport}
                          </button>
                        </div>
                      )}
                      {state === 'done' && stage === 'final-report' && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.finalReportOutcome === 'favorable' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-[#DC2626]'}`}>
                            {a.finalReportOutcome === 'favorable' ? t.favorable : t.unfavorable}
                          </span>
                          <button type="button" onClick={() => setViewingReport({ type: 'final', app: a })} className="font-semibold text-[#0A4D8C] hover:underline">
                            {t.viewFinalReport}
                          </button>
                        </div>
                      )}
                      {state === 'done' && stage === 'approval' && <p className="mt-0.5 text-xs text-[#64748B]">{a.approvalNote}</p>}
                      {state === 'done' && stage === 'payment' && <p className="mt-0.5 text-xs text-[#64748B]">{t.confirmPayment}: Tk. 25,000</p>}
                      {state === 'done' && stage === 'agreement' && <p className="mt-0.5 text-xs text-[#64748B]">{t.signAgreement}</p>}

                      {state === 'current' && stage === 'submitted' && (
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
                          <button
                            type="button"
                            disabled={!a.assignedOfficer}
                            onClick={() => updateApp(a.id, { stage: 'doc-verification' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                          >
                            {t.assignBtn}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'doc-verification' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <p className="flex items-center gap-1.5 text-xs text-emerald-700">
                            <Icon name="check_circle" className="text-[15px]" />
                            {t.checklistComplete}
                          </p>
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
                          <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                            <span className="text-xs font-semibold text-[#334155]">{t.lienBankVerificationTitle}</span>
                            {a.lienBankVerified ? (
                              <span className="text-[11px] font-semibold text-emerald-700">{t.lienVerified}</span>
                            ) : (
                              <button type="button" onClick={() => updateApp(a.id, { lienBankVerified: true })} className="rounded-full border border-[#0A4D8C] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                                {t.markLienVerified}
                              </button>
                            )}
                          </div>
                          <button type="button" onClick={() => flash(t.requestMoreDocsSent)} className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:underline">
                            <Icon name="mail" className="text-[14px]" />
                            {t.requestMoreDocs}
                          </button>

                          <div className="flex flex-col gap-2 rounded-lg border border-dashed border-[#CBD5E1] p-3">
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#334155]">
                              <Icon name="history_edu" className="text-[15px] text-[#0A4D8C]" />
                              {t.examinationNoteLabel}
                            </p>
                            <textarea
                              rows={3}
                              value={nothiDraft}
                              onChange={(e) => setNothiDraft(e.target.value)}
                              placeholder={t.examinationNotePlaceholder}
                              className={`${inputClass} resize-none`}
                            />
                            <button
                              type="button"
                              disabled={!nothiDraft.trim()}
                              onClick={() => {
                                addNothiEntry(a.id, 'doc-verification', a.assignedOfficer ?? '', nothiDraft);
                                setNothiDraft('');
                              }}
                              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE] disabled:opacity-40"
                            >
                              {t.addToNothi}
                            </button>
                            {!!a.nothiEntries?.some((e) => e.stage === 'doc-verification') && (
                              <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                                <Icon name="check_circle" className="text-[13px]" />
                                {t.nothiRecorded}
                              </p>
                            )}
                          </div>

                          {!a.nothiEntries?.some((e) => e.stage === 'doc-verification') && (
                            <p className="text-[11px] text-[#94A3B8]">{t.nothiRequiredNotice}</p>
                          )}
                          <button
                            type="button"
                            disabled={!a.auditChecked || !a.lienBankVerified || !a.nothiEntries?.some((e) => e.stage === 'doc-verification')}
                            onClick={() => updateApp(a.id, { stage: 'inspection' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
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
                                    <button
                                      key={o.en}
                                      type="button"
                                      onClick={() => toggleTeamMember(o.en)}
                                      className={[
                                        'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                                        active ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
                                      ].join(' ')}
                                    >
                                      {o[language]}
                                    </button>
                                  );
                                })}
                              </div>
                              <button
                                type="button"
                                disabled={!(a.inspectionTeamMembers ?? []).length}
                                onClick={() => updateApp(a.id, { teamFormed: true })}
                                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                              >
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
                              <button
                                type="button"
                                disabled={!a.inspectionDate}
                                onClick={() => {
                                  updateApp(a.id, { inspectionScheduled: true, inspectionScores: Object.fromEntries(inspectionCriteria.map((c) => [c.id, true])) });
                                  flash(language === 'en' ? 'e-Notification sent to inspection team and applicant with the inspection date.' : 'পরিদর্শন দল ও আবেদনকারীকে পরিদর্শনের তারিখসহ ই-নোটিফিকেশন পাঠানো হয়েছে।');
                                }}
                                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                              >
                                {t.confirmSchedule}
                              </button>
                            </>
                          ) : (
                            <>
                              <Field label={t.visitNotesLabel}>
                                <textarea
                                  rows={3}
                                  value={a.visitNotes ?? ''}
                                  onChange={(e) => updateApp(a.id, { visitNotes: e.target.value })}
                                  placeholder={t.visitNotesPlaceholder}
                                  className={`${inputClass} resize-none`}
                                />
                              </Field>
                              <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
                                <span className="text-xs font-semibold text-[#334155]">
                                  {t.photosLabel}: {a.photosCaptured ?? 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateApp(a.id, { photosCaptured: (a.photosCaptured ?? 0) + 1 })}
                                  className="flex items-center gap-1 rounded-full border border-[#0A4D8C] px-2.5 py-1 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]"
                                >
                                  <Icon name="photo_camera" className="text-[14px]" />
                                  {t.attachPhoto}
                                </button>
                              </div>

                              <p className="text-xs font-semibold text-[#334155]">{t.inspectionCriteriaTitle}</p>
                              {inspectionCriteria.map((c) => (
                                <div key={c.id} className="flex items-center justify-between gap-2">
                                  <span className="text-xs text-[#334155]">
                                    {c[language]} <span className="text-[10px] text-[#94A3B8]">({t.weightLabel} {c.weight})</span>
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => updateApp(a.id, { inspectionScores: { ...a.inspectionScores, [c.id]: true } })}
                                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${a.inspectionScores?.[c.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EEF2F6] text-[#94A3B8]'}`}
                                    >
                                      {t.pass}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateApp(a.id, { inspectionScores: { ...a.inspectionScores, [c.id]: false } })}
                                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${a.inspectionScores?.[c.id] === false ? 'bg-red-100 text-[#DC2626]' : 'bg-[#EEF2F6] text-[#94A3B8]'}`}
                                    >
                                      {t.fail}
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const result = computeInspectionResult(inspectionCriteria, a.inspectionScores);
                                  if (!result.compliant) flash(t.noncomplianceNotice);
                                  if (a.visitNotes) addNothiEntry(a.id, 'inspection', (a.inspectionTeamMembers ?? [])[0] ?? a.assignedOfficer ?? '', a.visitNotes);
                                  updateApp(a.id, { inspectionSubmitted: true, inspectionCompliant: result.compliant, inspectionPct: result.pct, stage: 'risk-assessment' });
                                }}
                                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]"
                              >
                                {t.submitInspectionReport}
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {state === 'current' && stage === 'risk-assessment' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          {riskCriteria.map((c) => (
                            <div key={c.id} className="flex items-center justify-between gap-2">
                              <span className="text-xs text-[#334155]">
                                {c[language]} <span className="text-[10px] text-[#94A3B8]">({t.weightLabel} {c.weight})</span>
                              </span>
                              <div className="flex gap-1">
                                {(['low', 'medium', 'high'] as RiskLevel[]).map((lvl) => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => updateApp(a.id, { riskScores: { ...a.riskScores, [c.id]: lvl } })}
                                    className={[
                                      'rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors',
                                      (a.riskScores?.[c.id] ?? '') === lvl ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]',
                                    ].join(' ')}
                                  >
                                    {lvl === 'low' ? t.riskLow : lvl === 'medium' ? t.riskMedium : t.riskHigh}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Field label={t.riskNoteLabel}>
                            <textarea rows={2} value={a.riskNote ?? ''} onChange={(e) => updateApp(a.id, { riskNote: e.target.value })} className={`${inputClass} resize-none`} />
                          </Field>
                          <button
                            type="button"
                            onClick={() => {
                              const result = computeRiskResult(riskCriteria, a.riskScores);
                              updateApp(a.id, { riskSubmitted: true, riskLevel: result.level, riskAvg: result.avg, stage: 'final-report' });
                            }}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]"
                          >
                            {t.generateRiskReport}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'final-report' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <p className="text-xs font-semibold text-[#334155]">{t.summaryTitle}</p>
                          <dl className="flex flex-col gap-1.5 rounded-lg bg-[#F5F7FA] px-3 py-2 text-xs">
                            <div className="flex justify-between">
                              <dt className="text-[#64748B]">{t.docVerificationSummary}</dt>
                              <dd className="font-semibold text-emerald-600">{t.compliant}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-[#64748B]">{t.stageLabels.inspection}</dt>
                              <dd className={`font-semibold ${a.inspectionCompliant ? 'text-emerald-600' : 'text-[#DC2626]'}`}>
                                {a.inspectionCompliant ? t.compliant : t.nonCompliant} ({a.inspectionPct}%)
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-[#64748B]">{t.riskLevelLabel}</dt>
                              <dd className="font-semibold text-[#1E293B]">{a.riskLevel === 'low' ? t.riskLow : a.riskLevel === 'medium' ? t.riskMedium : t.riskHigh}</dd>
                            </div>
                          </dl>
                          <Field label={t.recommendationLabel}>
                            <textarea rows={3} value={a.finalReportNote ?? ''} onChange={(e) => updateApp(a.id, { finalReportNote: e.target.value })} className={`${inputClass} resize-none`} />
                          </Field>
                          <Field label={t.outcomeLabel}>
                            <div className="flex gap-2">
                              {(['favorable', 'unfavorable'] as const).map((o) => (
                                <button
                                  key={o}
                                  type="button"
                                  onClick={() => updateApp(a.id, { finalReportOutcome: o })}
                                  className={[
                                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                                    a.finalReportOutcome === o ? (o === 'favorable' ? 'border-[#00A86B] bg-[#00A86B] text-white' : 'border-[#DC2626] bg-[#DC2626] text-white') : 'border-[#CBD5E1] text-[#334155]',
                                  ].join(' ')}
                                >
                                  <Icon name={o === 'favorable' ? 'thumb_up' : 'thumb_down'} className="text-[14px]" />
                                  {o === 'favorable' ? t.favorable : t.unfavorable}
                                </button>
                              ))}
                            </div>
                          </Field>
                          <button
                            type="button"
                            disabled={!a.finalReportOutcome || !a.finalReportNote}
                            onClick={() => updateApp(a.id, { finalReportSubmitted: true, stage: 'approval' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40"
                          >
                            {t.submitFinalReport}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'approval' && (
                        <ApprovalPanel
                          language={language}
                          t={t}
                          note={a.approvalNote ?? ''}
                          recommendation={a.finalReportOutcome}
                          onNoteChange={(v) => updateApp(a.id, { approvalNote: v })}
                          onApprove={() => {
                            if (a.approvalNote) addNothiEntry(a.id, 'approval', a.assignedOfficer ?? '', a.approvalNote);
                            updateApp(a.id, { stage: 'payment', licenseNo: `BL-2026-${Math.floor(5000 + Math.random() * 999)}` });
                          }}
                          onDisapprove={(reason) => {
                            addNothiEntry(a.id, 'approval', a.assignedOfficer ?? '', reason);
                            updateApp(a.id, { stage: 'disapproved', disapprovalReason: reason });
                          }}
                        />
                      )}

                      {state === 'current' && stage === 'payment' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <p className="text-xs text-[#334155]">{t.licenseFeeLabel}: Tk. 25,000</p>
                          <button
                            type="button"
                            onClick={() => updateApp(a.id, { paymentDone: true, stage: 'agreement' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]"
                          >
                            {t.confirmPayment}
                          </button>
                        </div>
                      )}

                      {state === 'current' && stage === 'agreement' && (
                        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                          <p className="text-xs text-[#334155]">{t.agreementBody}</p>
                          <button
                            type="button"
                            onClick={() => updateApp(a.id, { agreementSigned: true, stage: 'issued' })}
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c]"
                          >
                            <Icon name="signature" className="text-[15px]" />
                            {t.signAgreement}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {a.stage === 'issued' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                  <Icon name="workspace_premium" className="text-[18px]" />
                  {t.licenseNoLabel}: {a.licenseNo}
                </p>
                <button type="button" onClick={() => setViewingDoc(a)} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                  <Icon name="visibility" className="text-[15px]" />
                  {t.viewLicenseDoc}
                </button>
                <div className="mt-3 flex flex-col gap-1.5 border-t border-emerald-200 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{t.autoTriggered}</p>
                  {[t.hsCodeBound, t.passbookIssued, t.bondRegisterIssued, t.generalBondIssued, t.entitlementPending].map((line) => (
                    <p key={line} className="flex items-center gap-1.5 text-[11px] text-emerald-800">
                      <Icon name="check" className="text-[13px]" />
                      {line}
                    </p>
                  ))}
                </div>
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
          <button type="button" onClick={() => setView('form')} className="hover:text-[#0A4D8C]">
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
          <button type="button" onClick={() => setView('form')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.back}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'in-progress', 'issued', 'disapproved'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setQueueFilter(f)}
              className={[
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                queueFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]',
              ].join(' ')}
            >
              {f === 'all' ? t.filterAll : f === 'in-progress' ? t.filterInProgress : f === 'issued' ? t.filterIssued : t.filterDisapproved}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredApps.map((a) => (
            <button key={a.id} type="button" onClick={() => openApp(a)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name="assignment" className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{a.id}</span>
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      a.stage === 'issued' ? 'bg-emerald-50 text-emerald-700' : a.stage === 'disapproved' ? 'bg-red-50 text-[#DC2626]' : 'bg-blue-50 text-[#0A4D8C]',
                    ].join(' ')}
                  >
                    {t.stageLabels[a.stage]}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                  {a[language === 'en' ? 'orgNameEn' : 'orgNameBn']} · {a.category}
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  {t.assignedTo}: {a.assignedOfficer ?? t.notAssigned} · {a.submittedDate}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white">{t.review}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (submitted) {
    const app = applications.find((a) => a.id === appId)!;
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check_circle" className="text-[36px]" />
          </span>
          <h1 className="text-xl font-bold text-[#1E293B]">{language === 'en' ? 'Application Submitted Successfully' : 'আবেদন সফলভাবে জমা হয়েছে'}</h1>
          <p className="max-w-md text-sm leading-relaxed text-[#64748B]">
            {language === 'en'
              ? 'Your new bond license application has been received and is queued for RO/ARO assignment.'
              : 'আপনার নতুন বন্ড লাইসেন্স আবেদন গৃহীত হয়েছে এবং আরও/এআরও নিয়োগের জন্য সারিবদ্ধ রয়েছে।'}
          </p>
          <div className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{language === 'en' ? 'Application ID' : 'আবেদন আইডি'}</p>
            <p className="text-lg font-bold text-[#0A4D8C]">{appId}</p>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => openApp(app)} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]">
            <Icon name="fact_check" className="text-[18px]" />
            {t.trackApplication}
          </button>
          <button type="button" onClick={onDone} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-5 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="home" className="text-[18px]" />
            {t.backToDashboard}
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
        <span>{t.bondLicense}</span>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="font-semibold text-[#0A4D8C]">{t.pageTitle}</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">{t.pageTitle}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" onClick={() => setManagingCriteria('inspection')} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="tune" className="text-[16px]" />
            {t.inspectionCriteriaBtn}
          </button>
          <button type="button" onClick={() => setManagingCriteria('risk')} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="rule" className="text-[16px]" />
            {t.riskCriteriaBtn}
          </button>
          <button type="button" onClick={() => setView('queue')} className="relative inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F5F7FA]">
            <Icon name="fact_check" className="text-[16px]" />
            {t.pendingApplications}
            {pendingCount > 0 && <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">{pendingCount}</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-[#E2E8F0] bg-white p-3 lg:sticky lg:top-6">
          <StepperNav language={language} currentStep={currentStep} furthestStep={furthestStep} onJump={setCurrentStep} />
        </aside>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] pb-4">
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

          {currentStep === 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label={language === 'en' ? 'License Category' : 'লাইসেন্স ক্যাটাগরি'} required error={errors.category ? t.required : undefined}>
                  <PillGroup
                    value={form.category}
                    onChange={(v) => set('category', v)}
                    options={[
                      { en: 'Direct Exporter', bn: 'প্রত্যক্ষ রপ্তানিকারক' },
                      { en: 'Deemed Exporter', bn: 'পরোক্ষ রপ্তানিকারক' },
                      { en: 'EPZ Enterprise', bn: 'ইপিজেড প্রতিষ্ঠান' },
                    ]}
                  />
                </Field>
              </div>
              <Field label={language === 'en' ? 'Organization Name (English)' : 'প্রতিষ্ঠানের নাম (ইংরেজি)'} required error={errors.orgNameEn ? t.required : undefined}>
                <TextInput value={form.orgNameEn} onChange={(v) => set('orgNameEn', v)} placeholder="e.g. Radiant Apparels Ltd." error={errors.orgNameEn} />
              </Field>
              <Field label={language === 'en' ? 'Organization Name (Bangla)' : 'প্রতিষ্ঠানের নাম (বাংলা)'}>
                <TextInput value={form.orgNameBn} onChange={(v) => set('orgNameBn', v)} placeholder="যেমন: রেডিয়েন্ট অ্যাপারেলস লিমিটেড" />
              </Field>
              <Field label="Business Identification Number (BIN)" required error={errors.bin ? t.required : undefined}>
                <TextInput value={form.bin} onChange={(v) => set('bin', v)} placeholder="006654321-0407" error={errors.bin} />
              </Field>
              <Field label="Taxpayer Identification Number (TIN)" required error={errors.tin ? t.required : undefined}>
                <TextInput value={form.tin} onChange={(v) => set('tin', v)} placeholder="123456789012" error={errors.tin} />
              </Field>
              <Field label={language === 'en' ? 'Trade License Number' : 'ট্রেড লাইসেন্স নম্বর'} required error={errors.tradeLicenseNo ? t.required : undefined}>
                <TextInput value={form.tradeLicenseNo} onChange={(v) => set('tradeLicenseNo', v)} placeholder="TRAD/DNCC/045821/2024" error={errors.tradeLicenseNo} />
              </Field>
              <Field label={language === 'en' ? 'Requested Bonding Period' : 'অনুরোধকৃত বন্ডিং সময়কাল'} required error={errors.bondingPeriod ? t.required : undefined}>
                <SelectInput
                  value={form.bondingPeriod}
                  onChange={(v) => set('bondingPeriod', v)}
                  options={['1 Year', '2 Years', '3 Years']}
                  placeholder={language === 'en' ? 'Select period' : 'সময়কাল নির্বাচন করুন'}
                  error={errors.bondingPeriod}
                />
              </Field>
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label={language === 'en' ? 'Factory / Premises Address' : 'কারখানা / প্রাঙ্গণের ঠিকানা'} required error={errors.factoryAddress ? t.required : undefined}>
                  <TextInput value={form.factoryAddress} onChange={(v) => set('factoryAddress', v)} placeholder="Sector 7, EPZ Road, Savar, Dhaka" error={errors.factoryAddress} />
                </Field>
              </div>
              <Field label={language === 'en' ? 'District' : 'জেলা'} required error={errors.district ? t.required : undefined}>
                <SelectInput value={form.district} onChange={(v) => set('district', v)} options={districts} placeholder={language === 'en' ? 'Select district' : 'জেলা নির্বাচন করুন'} error={errors.district} />
              </Field>
              <Field label={language === 'en' ? 'Premises Type' : 'প্রাঙ্গণের ধরন'} required error={errors.premisesType ? t.required : undefined}>
                <PillGroup value={form.premisesType} onChange={(v) => set('premisesType', v)} options={[{ en: 'Owned', bn: 'নিজস্ব' }, { en: 'Rented', bn: 'ভাড়াকৃত' }]} />
              </Field>
              <Field label={language === 'en' ? 'Factory Area (sq. ft.)' : 'কারখানার আয়তন (বর্গফুট)'} required error={errors.factoryArea ? t.required : undefined}>
                <TextInput value={form.factoryArea} onChange={(v) => set('factoryArea', v)} placeholder="45,000" type="number" error={errors.factoryArea} />
              </Field>
              <Field label={language === 'en' ? 'Number of Workers' : 'শ্রমিক সংখ্যা'} required error={errors.workerCount ? t.required : undefined}>
                <TextInput value={form.workerCount} onChange={(v) => set('workerCount', v)} placeholder="850" type="number" error={errors.workerCount} />
              </Field>
              <Field label={language === 'en' ? 'Monthly Production Capacity' : 'মাসিক উৎপাদন সক্ষমতা'}>
                <TextInput value={form.productionCapacity} onChange={(v) => set('productionCapacity', v)} placeholder="120,000 pcs / month" />
              </Field>
              <Field label={language === 'en' ? 'Gas / Electricity Load Capacity' : 'গ্যাস / বিদ্যুৎ লোড ক্ষমতা'}>
                <TextInput value={form.utilityLoad} onChange={(v) => set('utilityLoad', v)} placeholder="500 KW / 40 MMCFD" />
              </Field>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label={language === 'en' ? 'General Bond Amount (Tk.)' : 'জেনারেল বন্ডের পরিমাণ (টাকা)'} required error={errors.bondAmount ? t.required : undefined}>
                  <TextInput value={form.bondAmount} onChange={(v) => set('bondAmount', v)} placeholder="5,000,000" type="number" error={errors.bondAmount} />
                </Field>
                <Field label={language === 'en' ? 'Lien Bank' : 'লিয়েন ব্যাংক'} required error={errors.lienBank ? t.required : undefined}>
                  <SelectInput value={form.lienBank} onChange={(v) => set('lienBank', v)} options={lienBanks} placeholder={language === 'en' ? 'Select lien bank' : 'লিয়েন ব্যাংক নির্বাচন করুন'} error={errors.lienBank} />
                </Field>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#64748B]">
                  {language === 'en'
                    ? 'Upload clear scanned copies of the following documents. Accepted formats: PDF, JPG, PNG (max 2 MB each).'
                    : 'নিচের নথিগুলোর স্পষ্ট স্ক্যান কপি আপলোড করুন। গ্রহণযোগ্য ফরম্যাট: PDF, JPG, PNG (সর্বোচ্চ ২ এমবি করে)।'}
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
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              {[
                {
                  title: steps[0][language],
                  icon: steps[0].icon,
                  step: 0,
                  rows: [
                    [language === 'en' ? 'Category' : 'ক্যাটাগরি', form.category || '—'],
                    [language === 'en' ? 'Organization' : 'প্রতিষ্ঠান', form.orgNameEn || '—'],
                    ['BIN', form.bin || '—'],
                    [language === 'en' ? 'Bonding Period' : 'বন্ডিং সময়কাল', form.bondingPeriod || '—'],
                  ],
                },
                {
                  title: steps[1][language],
                  icon: steps[1].icon,
                  step: 1,
                  rows: [
                    [language === 'en' ? 'Address' : 'ঠিকানা', form.factoryAddress || '—'],
                    [language === 'en' ? 'District' : 'জেলা', form.district || '—'],
                    [language === 'en' ? 'Premises' : 'প্রাঙ্গণ', form.premisesType || '—'],
                    [language === 'en' ? 'Workers' : 'শ্রমিক', form.workerCount || '—'],
                  ],
                },
                {
                  title: steps[2][language],
                  icon: steps[2].icon,
                  step: 2,
                  rows: [
                    [language === 'en' ? 'Bond Amount' : 'বন্ডের পরিমাণ', form.bondAmount ? `Tk. ${form.bondAmount}` : '—'],
                    [language === 'en' ? 'Lien Bank' : 'লিয়েন ব্যাংক', form.lienBank || '—'],
                    ...documentDefs.map((d) => [d[language], docs[d.id]?.uploaded ? (language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে') : (language === 'en' ? 'Not uploaded' : 'আপলোড হয়নি')]),
                  ],
                },
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
              <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#083E71]">
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

function ApprovalPanel({
  language,
  t,
  note,
  recommendation,
  onNoteChange,
  onApprove,
  onDisapprove,
}: {
  language: Language;
  t: (typeof T)['en'];
  note: string;
  recommendation?: 'favorable' | 'unfavorable';
  onNoteChange: (v: string) => void;
  onApprove: () => void;
  onDisapprove: (reason: string) => void;
}) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      {recommendation && (
        <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
          <span className="text-xs font-semibold text-[#334155]">{t.recommendationLabel}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${recommendation === 'favorable' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-[#DC2626]'}`}>
            {recommendation === 'favorable' ? t.favorable : t.unfavorable}
          </span>
        </div>
      )}
      <Field label={t.officerNote}>
        <textarea rows={3} value={note} onChange={(e) => onNoteChange(e.target.value)} placeholder={t.notePlaceholder} className={`${inputClass} resize-none`} />
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
