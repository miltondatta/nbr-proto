import { useState } from 'react';
import { bondLicenses, type BondLicense } from './bondLicenseData';
type Language = 'en' | 'bn';
type RiskConclusion = 'low-compliant-skip' | 'high-noncompliant-skip' | 'needs-visit';
type LegalOutcome = 'scn-dismissed' | 'release-certificate' | 'demand-paid' | 'interim-order' | 'demand-unpaid';
type AuditStage = 'submitted' | 'assignment' | 'verification' | 'risk-assessment' | 'factory-inspection' | 'audit-report' | 'approval' | 'completed' | 'disapproved' | 'legal-process' | 'interim-order' | 'audit-failed';
interface AnnualAuditProps {
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
const T = {
  en: {
    home: 'Home',
    pageTitle: 'Annual Audit Management',
    subtitle: 'System-detected audit launch, bonder application submission, risk-based factory inspection, and the RO/ARO → JC/DC approval pipeline, with automatic Legal Procedure escalation on disapproval.',
    backToDashboard: 'Back to Dashboard',
    upcomingTitle: 'Bonders with Upcoming Audit',
    upcomingSubtitle: 'Automatically detected by the system and notified to the bonder and relevant CBC officials.',
    daysLeft: 'days left',
    overdueLabel: 'Overdue',
    notify: 'Send Audit Notification',
    notified: 'Notified',
    startApplication: 'Start Audit Application',
    reviewQueue: 'Review Queue',
    statUpcoming: 'Upcoming',
    statInProgress: 'In Progress',
    statApproved: 'Approved',
    statDisapproved: 'Disapproved',
    statLegal: 'Legal / Interim',
    statFailed: 'Audit Failed',
    // wizard
    step0: 'Select License',
    step1: 'Checklist & Documents',
    step2: 'Application Fee',
    step3: 'Review & Submit',
    stepLabel: 'Step',
    of: 'of',
    licenseNoLabel: 'Bond License Number',
    verify: 'Verify',
    notFound: 'No license found with this number.',
    verified: 'Verified',
    bonder: 'Bonder',
    category: 'Category',
    uploadIntro: 'Upload clear scanned copies of the following documents. Accepted formats: PDF, JPG, PNG (max 2 MB each).',
    payLabel: 'Application Submission Fee',
    payAmount: 'BDT 5,000',
    payGateway: 'Payment Gateway',
    payVia: 'Pay via e-Chalan (Sonali Bank / Bangladesh Bank Integration)',
    payNow: 'Pay Now',
    paid: 'Payment Received',
    paymentRef: 'e-Chalan Reference',
    required: 'Required',
    back: 'Back',
    next: 'Save & Continue',
    submit: 'Submit Application',
    submittedTitle: 'Audit Application Submitted',
    submittedBody: 'Your annual audit application has been received. It will be assigned to a Revenue Officer for verification.',
    applicationId: 'Application ID',
    trackApplication: 'Track this Application',
    agreeDeclaration: 'I declare that the information and documents provided above are true and accurate to the best of my knowledge.',
    // queue
    queueTitle: 'Annual Audit — Review Queue',
    queueSubtitle: 'e-Assignment, document verification, risk-based inspection routing, audit report, and JC/DC approval — with automatic Legal Procedure escalation on disapproval.',
    filterAll: 'All',
    filterInProgress: 'In Progress',
    filterApproved: 'Approved',
    filterDisapproved: 'Disapproved / Legal',
    review: 'Review',
    reviewTitle: 'Review Annual Audit Application',
    close: 'Close',
    stageLabels: {
      submitted: 'Application Submitted',
      assignment: 'e-Assignment (ARO/RO)',
      verification: 'Document Verification',
      'risk-assessment': 'Risk Assessment',
      'factory-inspection': 'Factory Inspection',
      'audit-report': 'Audit Report',
      approval: 'JC/DC Approval',
      completed: 'Audit Completed',
      disapproved: 'Disapproved',
      'legal-process': 'Legal Procedure',
      'interim-order': 'Interim Order',
      'audit-failed': 'Audit Failed'
    },
    // assignment
    assignOfficer: 'Assign ARO/RO',
    assignConfirm: 'Assign by section/zone/location. System notifies the ARO/RO and the bonder.',
    assignedOfficer: 'Assigned Officer',
    assignAndNotify: 'Assign & Notify',
    // verification
    verificationNoteLabel: 'ARO e-Note & Nothi',
    verificationNotePlaceholder: 'Document examination remarks…',
    requestMoreDocs: 'Request Additional Documents',
    requestMoreDocsSent: 'Notification sent to Bonder requesting additional documents.',
    moreDocsPending: 'Awaiting additional documents from Bonder.',
    docsReceived: 'Documents Received (simulate)',
    proceedToRisk: 'Forward to Risk Assessment',
    // risk assessment
    riskParamTitle: 'Audit Parameter Management — Risk Criteria',
    riskParamHint: 'Weighted criteria (0–10) auto-scored from Bonder Profile, e-Passbook, e-Bond Register, Inventory Monitoring, and prior audit/inspection reports.',
    weight: 'Weight',
    score: 'Score',
    generateRiskReport: 'Auto-Generate Risk Assessment Report',
    riskReportTitle: 'e-Risk Assessment Report',
    riskScoreLabel: 'Weighted Risk Score',
    riskConclusionLabel: 'Conclusion',
    riskConclusions: {
      'low-compliant-skip': 'Always Compliant — Low Risk. Factory visit may be omitted.',
      'high-noncompliant-skip': 'Severely Non-Compliant — High Risk. Factory visit will not change outcome; forwarded for Legal Procedure on failure.',
      'needs-visit': 'Standard Risk — Factory Inspection Required.'
    },
    commissionerDecisionLabel: 'Commissioner e-Note & Nothi — Factory Visit Decision',
    commissionerDecisionPlaceholder: 'AC/DC recommendation and Commissioner decision on whether a factory inspection is needed…',
    approveNoVisit: 'Approve — Skip Factory Visit',
    proceedToInspection: 'Proceed to Factory Inspection',
    proceedToAuditReport: 'Proceed to Audit Report',
    // inspection
    inspectionCalendarTitle: 'Inspection e-Calendar',
    inspectionCalendarHint: 'Select a warehouse visit date. Amber dates already have a scheduled visit.',
    scheduleVisit: 'Schedule Visit & Notify Bonder',
    visitScheduledNotice: 'Auto notification sent to Bonder with the warehouse visit date.',
    visitDate: 'Visit Date',
    factoryVisitNoteLabel: 'e-Factory Visit Note (Mobile App)',
    factoryVisitNotePlaceholder: 'Inspector observations recorded at the time of visit…',
    inspectionParamTitle: 'Inspection Parameter Management',
    submitInspectionReport: 'Auto-Generate Inspection Report',
    inspectionReportTitle: 'e-Inspection Report',
    visitOmittedTitle: 'Factory Visit Omitted',
    visitOmittedBody: 'Per Risk Assessment conclusion, this audit proceeds without a factory visit.',
    // audit report
    auditReportHint: 'Based on the application, attachments, risk assessment, and factory visit report (if any).',
    markFavorable: 'Favorable — Bonder Compliant',
    markUnfavorable: 'Unfavorable — Bonder Non-Compliant',
    auditReportNoteLabel: 'e-Audit Report Note',
    auditReportNotePlaceholder: 'Audit report summary…',
    forwardToJcDc: 'Add e-Note & Nothi — Forward to JC/DC',
    // approval
    jcDcNoteLabel: 'JC/DC e-Note',
    jcDcNotePlaceholder: 'JC/DC review remarks…',
    approve: 'Approve',
    disapprove: 'Disapprove',
    disapprovalReasonLabel: 'Reason for Disapproval',
    disapprovalReasonRequired: 'A reason is required to disapprove.',
    approvedNotice: 'Bonder added to the Audit Approved Bonder List. e-Audit Confirmation generated.',
    auditConfirmation: 'e-Audit Confirmation',
    entitlementNotice: 'Deemed Exporter — eligible for Annual Entitlement Issuance based on last year’s usage, machine capacity, and Commissioner’s recommendation.',
    issueEntitlement: 'Issue Annual Entitlement',
    entitlementIssued: 'Annual Entitlement Issued',
    // disapproval / legal
    disapprovedBody: 'Bonder added to the Audit Disapproved Bonder List. Notification letter sent to Bonder.',
    bonderReplyLabel: 'Bonder Reply',
    bonderReplyPlaceholder: 'Bonder response and supporting explanation…',
    submitReply: 'Submit Reply',
    replySubmitted: 'Reply submitted and attached to the case file.',
    initiateLegal: 'Initiate Legal Process (AC/DC — Generate SCN)',
    legalHaltedNotice: 'Audit halted. Bonder’s Audit Status: “Halted for Legal Proceedings”.',
    legalOutcomeTitle: 'Legal Procedure Management — Outcome',
    legalOutcomeHint: 'Select the outcome received from the Legal Procedure Management Module.',
    legalOutcomes: {
      'scn-dismissed': 'SCN Dismissed — Closure Order Issued',
      'release-certificate': 'Legal Proceedings Dismissed — Release Certificate Issued',
      'demand-paid': 'Demand Note Issued — Paid in Full, Release Certificate Issued',
      'interim-order': 'Interim Order Issued — Temporary Completion with Entitlement',
      'demand-unpaid': 'Demand Note Issued — Unpaid, BIN Locked & License Suspended'
    },
    applyOutcome: 'Apply Outcome',
    interimOrderNotice: 'Audit Status: “Current w/ Interim Order”. This will ultimately revert to a final outcome once Case Information Management is updated.',
    resolveInterim: 'Resolve Interim Order',
    auditFailedNotice: 'Audit Status: “Audit Failed”. Bonder’s BIN has been locked and the licence suspended. All relevant stakeholders notified.',
    currentStatusNotice: 'Audit Status: “Current”.',
    finalStatus: 'Final Audit Status',
    newBadge: 'New'
  },
  bn: {
    home: 'হোম',
    pageTitle: 'বার্ষিক নিরীক্ষা ব্যবস্থাপনা',
    subtitle: 'সিস্টেম-শনাক্তকৃত নিরীক্ষা সূচনা, বন্ডকারীর আবেদন জমাদান, ঝুঁকি-ভিত্তিক কারখানা পরিদর্শন এবং আরও/এআরও → জেসি/ডিসি অনুমোদন প্রক্রিয়া, অননুমোদনের ক্ষেত্রে স্বয়ংক্রিয় আইনি প্রক্রিয়া বৃদ্ধিসহ।',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    upcomingTitle: 'আসন্ন নিরীক্ষাসহ বন্ডকারী',
    upcomingSubtitle: 'সিস্টেম কর্তৃক স্বয়ংক্রিয়ভাবে শনাক্তকৃত এবং বন্ডকারী ও সংশ্লিষ্ট সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।',
    daysLeft: 'দিন বাকি',
    overdueLabel: 'বিলম্বিত',
    notify: 'নিরীক্ষা বিজ্ঞপ্তি পাঠান',
    notified: 'অবহিত করা হয়েছে',
    startApplication: 'নিরীক্ষা আবেদন শুরু করুন',
    reviewQueue: 'পর্যালোচনা সারি',
    statUpcoming: 'আসন্ন',
    statInProgress: 'চলমান',
    statApproved: 'অনুমোদিত',
    statDisapproved: 'অননুমোদিত',
    statLegal: 'আইনি / অন্তর্বর্তী',
    statFailed: 'নিরীক্ষা ব্যর্থ',
    step0: 'লাইসেন্স নির্বাচন',
    step1: 'চেকলিস্ট ও নথি',
    step2: 'আবেদন ফি',
    step3: 'পর্যালোচনা ও জমা',
    stepLabel: 'ধাপ',
    of: 'এর মধ্যে',
    licenseNoLabel: 'বন্ড লাইসেন্স নম্বর',
    verify: 'যাচাই করুন',
    notFound: 'এই নম্বরে কোনো লাইসেন্স পাওয়া যায়নি।',
    verified: 'যাচাইকৃত',
    bonder: 'বন্ডকারী',
    category: 'ক্যাটাগরি',
    uploadIntro: 'নিচের নথিগুলোর স্পষ্ট স্ক্যান কপি আপলোড করুন। গ্রহণযোগ্য ফরম্যাট: PDF, JPG, PNG (সর্বোচ্চ ২ এমবি করে)।',
    payLabel: 'আবেদন জমাদান ফি',
    payAmount: 'টাকা ৫,০০০',
    payGateway: 'পেমেন্ট গেটওয়ে',
    payVia: 'ই-চালানের মাধ্যমে পরিশোধ করুন (সোনালী ব্যাংক / বাংলাদেশ ব্যাংক ইন্টিগ্রেশন)',
    payNow: 'এখনই পরিশোধ করুন',
    paid: 'পেমেন্ট গৃহীত',
    paymentRef: 'ই-চালান রেফারেন্স',
    required: 'আবশ্যক',
    back: 'পূর্ববর্তী',
    next: 'সংরক্ষণ করে এগিয়ে যান',
    submit: 'আবেদন জমা দিন',
    submittedTitle: 'নিরীক্ষা আবেদন জমা হয়েছে',
    submittedBody: 'আপনার বার্ষিক নিরীক্ষা আবেদন গৃহীত হয়েছে। যাচাইয়ের জন্য একজন রেভিনিউ অফিসারকে নিয়োগ করা হবে।',
    applicationId: 'আবেদন আইডি',
    trackApplication: 'এই আবেদনটি ট্র্যাক করুন',
    agreeDeclaration: 'আমি ঘোষণা করছি যে উপরে প্রদত্ত তথ্য ও নথিসমূহ আমার সর্বোত্তম জ্ঞানমতে সত্য ও সঠিক।',
    queueTitle: 'বার্ষিক নিরীক্ষা — পর্যালোচনা সারি',
    queueSubtitle: 'ই-নিয়োগ, নথি যাচাই, ঝুঁকি-ভিত্তিক পরিদর্শন রাউটিং, নিরীক্ষা প্রতিবেদন এবং জেসি/ডিসি অনুমোদন — অননুমোদনের ক্ষেত্রে স্বয়ংক্রিয় আইনি প্রক্রিয়া বৃদ্ধিসহ।',
    filterAll: 'সকল',
    filterInProgress: 'চলমান',
    filterApproved: 'অনুমোদিত',
    filterDisapproved: 'অননুমোদিত / আইনি',
    review: 'পর্যালোচনা',
    reviewTitle: 'বার্ষিক নিরীক্ষা আবেদন পর্যালোচনা',
    close: 'বন্ধ করুন',
    stageLabels: {
      submitted: 'আবেদন জমা হয়েছে',
      assignment: 'ই-নিয়োগ (আরও/এআরও)',
      verification: 'নথি যাচাই',
      'risk-assessment': 'ঝুঁকি মূল্যায়ন',
      'factory-inspection': 'কারখানা পরিদর্শন',
      'audit-report': 'নিরীক্ষা প্রতিবেদন',
      approval: 'জেসি/ডিসি অনুমোদন',
      completed: 'নিরীক্ষা সম্পন্ন',
      disapproved: 'অননুমোদিত',
      'legal-process': 'আইনি প্রক্রিয়া',
      'interim-order': 'অন্তর্বর্তীকালীন আদেশ',
      'audit-failed': 'নিরীক্ষা ব্যর্থ'
    },
    assignOfficer: 'আরও/এআরও নিয়োগ',
    assignConfirm: 'শাখা/অঞ্চল/অবস্থান অনুযায়ী নিয়োগ করুন। সিস্টেম আরও/এআরও ও বন্ডকারীকে অবহিত করবে।',
    assignedOfficer: 'নিয়োগপ্রাপ্ত কর্মকর্তা',
    assignAndNotify: 'নিয়োগ করুন ও অবহিত করুন',
    verificationNoteLabel: 'আরও e-নোট ও নথি',
    verificationNotePlaceholder: 'নথি পরীক্ষার মন্তব্য…',
    requestMoreDocs: 'অতিরিক্ত নথি অনুরোধ',
    requestMoreDocsSent: 'বন্ডারকে অতিরিক্ত নথির অনুরোধ পাঠানো হয়েছে।',
    moreDocsPending: 'বন্ডারের কাছ থেকে অতিরিক্ত নথির অপেক্ষায়।',
    docsReceived: 'নথি প্রাপ্ত হয়েছে (সিমুলেট)',
    proceedToRisk: 'ঝুঁকি মূল্যায়নে ফরওয়ার্ড করুন',
    riskParamTitle: 'নিরীক্ষা প্যারামিটার ব্যবস্থাপনা — ঝুঁকি মানদণ্ড',
    riskParamHint: 'বন্ডকারী প্রোফাইল, ই-পাসবুক, ই-বন্ড রেজিস্টার, ইনভেন্টরি মনিটরিং এবং পূর্ববর্তী নিরীক্ষা/পরিদর্শন প্রতিবেদন থেকে স্বয়ংক্রিয়ভাবে স্কোরকৃত ওজনযুক্ত মানদণ্ড (০–১০)।',
    weight: 'ওজন',
    score: 'স্কোর',
    generateRiskReport: 'স্বয়ংক্রিয়ভাবে ঝুঁকি মূল্যায়ন প্রতিবেদন তৈরি করুন',
    riskReportTitle: 'ই-ঝুঁকি মূল্যায়ন প্রতিবেদন',
    riskScoreLabel: 'ওজনযুক্ত ঝুঁকি স্কোর',
    riskConclusionLabel: 'উপসংহার',
    riskConclusions: {
      'low-compliant-skip': 'সর্বদা সম্মত — নিম্ন ঝুঁকি। কারখানা পরিদর্শন বাদ দেওয়া যেতে পারে।',
      'high-noncompliant-skip': 'গুরুতরভাবে অসম্মত — উচ্চ ঝুঁকি। কারখানা পরিদর্শন ফলাফল পরিবর্তন করবে না; ব্যর্থতার ক্ষেত্রে আইনি প্রক্রিয়ায় ফরওয়ার্ড করা হবে।',
      'needs-visit': 'স্বাভাবিক ঝুঁকি — কারখানা পরিদর্শন প্রয়োজন।'
    },
    commissionerDecisionLabel: 'কমিশনার e-নোট ও নথি — কারখানা পরিদর্শন সিদ্ধান্ত',
    commissionerDecisionPlaceholder: 'এসি/ডিসির সুপারিশ ও কারখানা পরিদর্শন প্রয়োজন কিনা সে বিষয়ে কমিশনারের সিদ্ধান্ত…',
    approveNoVisit: 'অনুমোদন — কারখানা পরিদর্শন বাদ দিন',
    proceedToInspection: 'কারখানা পরিদর্শনে এগিয়ে যান',
    proceedToAuditReport: 'নিরীক্ষা প্রতিবেদনে এগিয়ে যান',
    inspectionCalendarTitle: 'পরিদর্শন ই-ক্যালেন্ডার',
    inspectionCalendarHint: 'একটি গুদাম পরিদর্শনের তারিখ নির্বাচন করুন। অ্যাম্বার তারিখগুলোতে ইতিমধ্যে পরিদর্শন নির্ধারিত রয়েছে।',
    scheduleVisit: 'পরিদর্শন নির্ধারণ করুন ও বন্ডারকে অবহিত করুন',
    visitScheduledNotice: 'গুদাম পরিদর্শনের তারিখসহ বন্ডারকে স্বয়ংক্রিয় বিজ্ঞপ্তি পাঠানো হয়েছে।',
    visitDate: 'পরিদর্শনের তারিখ',
    factoryVisitNoteLabel: 'e-কারখানা পরিদর্শন নোট (মোবাইল অ্যাপ)',
    factoryVisitNotePlaceholder: 'পরিদর্শনের সময় পরিদর্শকের পর্যবেক্ষণ…',
    inspectionParamTitle: 'পরিদর্শন প্যারামিটার ব্যবস্থাপনা',
    submitInspectionReport: 'স্বয়ংক্রিয়ভাবে পরিদর্শন প্রতিবেদন তৈরি করুন',
    inspectionReportTitle: 'e-পরিদর্শন প্রতিবেদন',
    visitOmittedTitle: 'কারখানা পরিদর্শন বাদ দেওয়া হয়েছে',
    visitOmittedBody: 'ঝুঁকি মূল্যায়নের উপসংহার অনুযায়ী, এই নিরীক্ষা কারখানা পরিদর্শন ছাড়াই এগিয়ে যাচ্ছে।',
    auditReportHint: 'আবেদন, সংযুক্তি, ঝুঁকি মূল্যায়ন এবং কারখানা পরিদর্শন প্রতিবেদনের (যদি থাকে) ভিত্তিতে।',
    markFavorable: 'অনুকূল — বন্ডকারী সম্মত',
    markUnfavorable: 'প্রতিকূল — বন্ডকারী অসম্মত',
    auditReportNoteLabel: 'e-নিরীক্ষা প্রতিবেদন নোট',
    auditReportNotePlaceholder: 'নিরীক্ষা প্রতিবেদনের সারসংক্ষেপ…',
    forwardToJcDc: 'e-নোট ও নথি যোগ করুন — জেসি/ডিসিতে ফরওয়ার্ড করুন',
    jcDcNoteLabel: 'জেসি/ডিসি e-নোট',
    jcDcNotePlaceholder: 'জেসি/ডিসি পর্যালোচনার মন্তব্য…',
    approve: 'অনুমোদন করুন',
    disapprove: 'অননুমোদন করুন',
    disapprovalReasonLabel: 'অননুমোদনের কারণ',
    disapprovalReasonRequired: 'অননুমোদনের জন্য একটি কারণ আবশ্যক।',
    approvedNotice: 'বন্ডকারীকে নিরীক্ষা অনুমোদিত বন্ডকারী তালিকায় যুক্ত করা হয়েছে। e-নিরীক্ষা নিশ্চিতকরণ তৈরি হয়েছে।',
    auditConfirmation: 'e-নিরীক্ষা নিশ্চিতকরণ',
    entitlementNotice: 'পরোক্ষ রপ্তানিকারক — গত বছরের ব্যবহার, যন্ত্র সক্ষমতা এবং কমিশনারের সুপারিশের ভিত্তিতে বার্ষিক এনটাইটেলমেন্ট প্রদানের যোগ্য।',
    issueEntitlement: 'বার্ষিক এনটাইটেলমেন্ট প্রদান করুন',
    entitlementIssued: 'বার্ষিক এনটাইটেলমেন্ট প্রদত্ত হয়েছে',
    disapprovedBody: 'বন্ডকারীকে নিরীক্ষা অননুমোদিত বন্ডকারী তালিকায় যুক্ত করা হয়েছে। বন্ডকারীকে বিজ্ঞপ্তি পত্র পাঠানো হয়েছে।',
    bonderReplyLabel: 'বন্ডকারীর জবাব',
    bonderReplyPlaceholder: 'বন্ডকারীর প্রতিক্রিয়া ও সহায়ক ব্যাখ্যা…',
    submitReply: 'জবাব জমা দিন',
    replySubmitted: 'জবাব জমা দেওয়া হয়েছে এবং কেস ফাইলে সংযুক্ত করা হয়েছে।',
    initiateLegal: 'আইনি প্রক্রিয়া শুরু করুন (এসি/ডিসি — এসসিএন তৈরি করুন)',
    legalHaltedNotice: 'নিরীক্ষা স্থগিত। বন্ডকারীর নিরীক্ষা অবস্থা: "আইনি প্রক্রিয়ার জন্য স্থগিত"।',
    legalOutcomeTitle: 'আইনি প্রক্রিয়া ব্যবস্থাপনা — ফলাফল',
    legalOutcomeHint: 'আইনি প্রক্রিয়া ব্যবস্থাপনা মডিউল থেকে প্রাপ্ত ফলাফল নির্বাচন করুন।',
    legalOutcomes: {
      'scn-dismissed': 'এসসিএন খারিজ — সমাপনী আদেশ জারি',
      'release-certificate': 'আইনি প্রক্রিয়া খারিজ — ছাড়পত্র জারি',
      'demand-paid': 'দাবিনামা জারি — সম্পূর্ণ পরিশোধিত, ছাড়পত্র জারি',
      'interim-order': 'অন্তর্বর্তীকালীন আদেশ জারি — এনটাইটেলমেন্টসহ সাময়িক সমাপ্তি',
      'demand-unpaid': 'দাবিনামা জারি — অপরিশোধিত, বিআইএন লক ও লাইসেন্স স্থগিত'
    },
    applyOutcome: 'ফলাফল প্রয়োগ করুন',
    interimOrderNotice: 'নিরীক্ষা অবস্থা: "অন্তর্বর্তীকালীন আদেশসহ চলমান"। কেস তথ্য ব্যবস্থাপনা হালনাগাদ হলে এটি চূড়ান্ত ফলাফলে পরিণত হবে।',
    resolveInterim: 'অন্তর্বর্তীকালীন আদেশ নিষ্পত্তি করুন',
    auditFailedNotice: 'নিরীক্ষা অবস্থা: "নিরীক্ষা ব্যর্থ"। বন্ডকারীর বিআইএন লক এবং লাইসেন্স স্থগিত করা হয়েছে। সকল সংশ্লিষ্ট পক্ষকে অবহিত করা হয়েছে।',
    currentStatusNotice: 'নিরীক্ষা অবস্থা: "চলমান"।',
    finalStatus: 'চূড়ান্ত নিরীক্ষা অবস্থা',
    newBadge: 'নতুন'
  }
};
const inputClass = 'w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20';
const errorInputClass = 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20';
function Field({
  label,
  required,
  children,
  error
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </span>
      {children}
      {error && <span className="text-[11px] font-medium text-[#DC2626]">{error}</span>}
    </label>;
}
function TextInput({
  value,
  onChange,
  placeholder,
  error
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${inputClass} ${error ? errorInputClass : ''}`} />;
}
interface UploadStatus {
  uploaded: boolean;
  fileName?: string;
  size?: string;
}
function UploadRow({
  icon,
  label,
  status,
  onUpload,
  onRemove,
  language
}: {
  icon: string;
  label: string;
  status: UploadStatus;
  onUpload: () => void;
  onRemove: () => void;
  language: Language;
}) {
  return <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', status.uploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
          <Icon name={status.uploaded ? 'task_alt' : icon} className="text-[20px]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1E293B]">{label}</p>
          {status.uploaded ? <p className="truncate text-xs text-[#64748B]">
              {status.fileName} · {status.size}
            </p> : <p className="text-xs text-[#94A3B8]">{language === 'en' ? 'PDF, JPG or PNG · max 2 MB' : 'PDF, JPG বা PNG · সর্বোচ্চ ২ এমবি'}</p>}
        </div>
      </div>
      {status.uploaded ? <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{language === 'en' ? 'Uploaded' : 'আপলোড হয়েছে'}</span>
          <button type="button" onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F5F7FA] hover:text-[#DC2626]">
            <Icon name="delete" className="text-[18px]" />
          </button>
        </div> : <button type="button" onClick={onUpload} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#0A4D8C] px-3.5 py-2 text-xs font-semibold text-[#0A4D8C] transition-colors hover:bg-[#EAF3FE]">
          <Icon name="upload" className="text-[16px]" />
          {language === 'en' ? 'Upload' : 'আপলোড করুন'}
        </button>}
    </div>;
}
function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: number;
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
const documentDefs = [{
  id: 'auditApplicationForm',
  icon: 'description',
  en: 'Annual Audit Application Form',
  bn: 'বার্ষিক নিরীক্ষা আবেদন ফরম'
}, {
  id: 'financialStatements',
  icon: 'receipt_long',
  en: 'Audited Financial Statements',
  bn: 'নিরীক্ষিত আর্থিক বিবরণী'
}, {
  id: 'stockRegister',
  icon: 'inventory_2',
  en: 'Stock Register / Inventory Summary',
  bn: 'স্টক রেজিস্টার / ইনভেন্টরি সারসংক্ষেপ'
}, {
  id: 'priorAuditReport',
  icon: 'fact_check',
  en: "Previous Year's Audit Report (if any)",
  bn: 'পূর্ববর্তী বছরের নিরীক্ষা প্রতিবেদন (যদি থাকে)'
}];
const officerPool = [{
  en: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
  bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)'
}, {
  en: 'Sharmin Akter (ARO, Gazipur Zone)',
  bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)'
}, {
  en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)',
  bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)'
}];
interface CriterionDef {
  id: string;
  en: string;
  bn: string;
  weight: number;
}
const riskCriteriaDefs: CriterionDef[] = [{
  id: 'auditHistory',
  en: 'Previous Audit Compliance History',
  bn: 'পূর্ববর্তী নিরীক্ষা সম্মতি ইতিহাস',
  weight: 3
}, {
  id: 'passbookDiscrepancy',
  en: 'e-Passbook / e-Bond Register Discrepancies',
  bn: 'ই-পাসবুক / ই-বন্ড রেজিস্টার অসামঞ্জস্য',
  weight: 2
}, {
  id: 'legalExposure',
  en: 'Outstanding Legal Cases / Notices',
  bn: 'অমীমাংসিত আইনি মামলা / নোটিশ',
  weight: 3
}, {
  id: 'inventoryVariance',
  en: 'Inventory Monitoring Variance',
  bn: 'ইনভেন্টরি মনিটরিং তারতম্য',
  weight: 2
}];
const inspectionCriteriaDefs: CriterionDef[] = [{
  id: 'warehouseCondition',
  en: 'Warehouse & Storage Condition',
  bn: 'গুদাম ও সংরক্ষণাগার অবস্থা',
  weight: 3
}, {
  id: 'stockRecordAccuracy',
  en: 'Stock Record Accuracy vs. e-Passbook',
  bn: 'স্টক রেকর্ড নির্ভুলতা বনাম ই-পাসবুক',
  weight: 3
}, {
  id: 'machineryUtilization',
  en: 'Machinery Utilization Consistency',
  bn: 'যন্ত্রপাতি ব্যবহারের সামঞ্জস্যতা',
  weight: 2
}, {
  id: 'securityCompliance',
  en: 'Security & Bond Area Compliance',
  bn: 'নিরাপত্তা ও বন্ড এলাকা সম্মতি',
  weight: 2
}];
function scoreFromProfile(license: BondLicense, criterionId: string): number {
  const auditRisk: Record<string, number> = {
    compliant: 2,
    pending: 5,
    'non-compliant': 9,
    na: 4
  };
  const legalRisk: Record<string, number> = {
    clear: 1,
    'notice-issued': 6,
    'case-pending': 9
  };
  switch (criterionId) {
    case 'auditHistory':
      return auditRisk[license.auditStatus] ?? 5;
    case 'legalExposure':
      return legalRisk[license.legalStatus] ?? 3;
    case 'passbookDiscrepancy':
      return license.auditStatus === 'non-compliant' ? 7 : license.auditStatus === 'pending' ? 4 : 2;
    case 'inventoryVariance':
      return license.legalStatus === 'case-pending' ? 8 : 3;
    default:
      return 5;
  }
}
function CriteriaScorer({
  language,
  defs,
  scores,
  onScore,
  weightLabel,
  scoreLabel
}: {
  language: Language;
  defs: CriterionDef[];
  scores: Record<string, number>;
  onScore: (id: string, v: number) => void;
  weightLabel: string;
  scoreLabel: string;
}) {
  return <div className="flex flex-col gap-2">
      {defs.map(c => <div key={c.id} className="flex flex-col gap-1.5 rounded-lg border border-[#E2E8F0] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#334155]">{c[language]}</span>
            <span className="rounded-full bg-[#F5F7FA] px-2 py-0.5 text-[10px] font-semibold text-[#64748B]">
              {weightLabel}: {c.weight}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#94A3B8]">{scoreLabel}</span>
            <input type="number" min={0} max={10} value={scores[c.id] ?? 0} onChange={e => onScore(c.id, Math.max(0, Math.min(10, Number(e.target.value))))} className="w-16 rounded-lg border border-[#CBD5E1] bg-white px-2 py-1.5 text-center text-sm text-[#1E293B] outline-none focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20" />
          </div>
        </div>)}
    </div>;
}
function weightedScore(defs: CriterionDef[], scores: Record<string, number>): number {
  const totalWeight = defs.reduce((s, c) => s + c.weight, 0);
  const total = defs.reduce((s, c) => s + c.weight * (scores[c.id] ?? 0), 0);
  return totalWeight ? Math.round(total / totalWeight * 10) / 10 : 0;
}
function InspectionCalendar({
  language,
  conflictDays,
  selected,
  onSelect
}: {
  language: Language;
  conflictDays: number[];
  selected: number | null;
  onSelect: (day: number) => void;
}) {
  const days = Array.from({
    length: 31
  }, (_, i) => i + 1);
  return <div className="grid grid-cols-7 gap-1.5">
      {days.map(d => {
      const conflict = conflictDays.includes(d);
      const isSelected = selected === d;
      return <button key={d} type="button" onClick={() => onSelect(d)} className={['flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors', isSelected ? 'bg-[#0A4D8C] text-white' : conflict ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-[#F5F7FA] text-[#334155] hover:bg-[#EAF3FE]'].join(' ')} title={conflict ? language === 'en' ? 'Date conflict' : 'তারিখ দ্বন্দ্ব' : undefined}>
            {d}
          </button>;
    })}
    </div>;
}
interface AuditApplication {
  id: string;
  licenseNo: string;
  bonderEn: string;
  bonderBn: string;
  category: BondLicense['category'];
  submittedDate: string;
  stage: AuditStage;
  assignedOfficer?: string;
  verificationNote?: string;
  moreDocsRequested?: boolean;
  riskScores?: Record<string, number>;
  riskScore?: number;
  riskConclusion?: RiskConclusion;
  commissionerDecisionNote?: string;
  visitDay?: number;
  factoryVisitNote?: string;
  inspectionScores?: Record<string, number>;
  inspectionScore?: number;
  auditReportResult?: 'favorable' | 'unfavorable';
  auditReportNote?: string;
  jcDcNote?: string;
  disapprovalReason?: string;
  bonderReply?: string;
  legalOutcome?: LegalOutcome;
  finalStatusLabel?: string;
  entitlementIssued?: boolean;
}
const stageOrder: AuditStage[] = ['submitted', 'assignment', 'verification', 'risk-assessment', 'factory-inspection', 'audit-report', 'approval', 'completed'];
const upcomingAudits = [{
  licenseNo: 'BL-2020-00512',
  nameEn: 'Ha-Meem Group',
  nameBn: 'হা-মীম গ্রুপ',
  dueDate: '02 Aug 2026',
  daysLeft: 7,
  notified: true
}, {
  licenseNo: 'BL-2021-00934',
  nameEn: 'DBL Group',
  nameBn: 'ডিবিএল গ্রুপ',
  dueDate: '28 Jul 2026',
  daysLeft: 2,
  notified: true
}, {
  licenseNo: 'BL-2019-00287',
  nameEn: 'Epic Designers Ltd.',
  nameBn: 'এপিক ডিজাইনার্স লিমিটেড',
  dueDate: '20 Jul 2026',
  daysLeft: -6,
  notified: false
}, {
  licenseNo: 'BL-2022-01655',
  nameEn: 'Envoy Textiles Ltd.',
  nameBn: 'এনভয় টেক্সটাইলস লিমিটেড',
  dueDate: '10 Aug 2026',
  daysLeft: 15,
  notified: false
}];
const seedApplications: AuditApplication[] = [{
  id: 'AUD-2026-3101',
  licenseNo: 'BL-2023-02871',
  bonderEn: 'Beximco Textiles Limited',
  bonderBn: 'বেক্সিমকো টেক্সটাইলস লিমিটেড',
  category: 'deemed-exporter',
  submittedDate: '15 Jul 2026',
  stage: 'verification',
  assignedOfficer: officerPool[0].en
}, {
  id: 'AUD-2026-3088',
  licenseNo: 'BL-2024-03398',
  bonderEn: 'Radiant Apparels Ltd.',
  bonderBn: 'রেডিয়েন্ট অ্যাপারেলস লিমিটেড',
  category: 'direct-exporter',
  submittedDate: '10 Jul 2026',
  stage: 'factory-inspection',
  assignedOfficer: officerPool[1].en,
  verificationNote: 'All submitted documents examined and found in order.',
  riskScore: 5.4,
  riskConclusion: 'needs-visit'
}, {
  id: 'AUD-2026-3050',
  licenseNo: 'BL-2021-01204',
  bonderEn: 'Pacific Jeans Ltd.',
  bonderBn: 'প্যাসিফিক জিন্স লিমিটেড',
  category: 'deemed-exporter',
  submittedDate: '02 Jul 2026',
  stage: 'completed',
  assignedOfficer: officerPool[2].en,
  verificationNote: 'Documents verified without discrepancy.',
  riskScore: 2.1,
  riskConclusion: 'low-compliant-skip',
  commissionerDecisionNote: 'Bonder has an unbroken compliant audit history; Commissioner approved omission of factory visit.',
  auditReportResult: 'favorable',
  auditReportNote: 'Consistently compliant profile. Audit report favorable.',
  jcDcNote: 'Reviewed and approved without reservation.',
  finalStatusLabel: 'Current',
  entitlementIssued: true
}, {
  id: 'AUD-2026-3012',
  licenseNo: 'BL-2019-00287',
  bonderEn: 'Epic Designers Ltd.',
  bonderBn: 'এপিক ডিজাইনার্স লিমিটেড',
  category: 'direct-exporter',
  submittedDate: '18 Jun 2026',
  stage: 'legal-process',
  assignedOfficer: officerPool[0].en,
  verificationNote: 'Discrepancies noted between e-Passbook and physical stock; forwarded for risk assessment.',
  riskScore: 8.4,
  riskConclusion: 'high-noncompliant-skip',
  commissionerDecisionNote: 'Severely non-compliant profile with an active legal notice; Commissioner approved omission of factory visit.',
  auditReportResult: 'unfavorable',
  auditReportNote: 'Non-compliant. Recurring discrepancies and unresolved legal notice.',
  jcDcNote: 'Confirmed non-compliance. Forwarded for disapproval.',
  disapprovalReason: 'Recurring stock discrepancies and an unresolved legal notice indicate sustained non-compliance.',
  bonderReply: 'Bonder disputes the discrepancy figures and has requested a re-count, submitted under separate cover.'
}];
const stepDefs = [{
  id: 'select',
  en: 'Select License',
  bn: 'লাইসেন্স নির্বাচন',
  icon: 'manage_search'
}, {
  id: 'documents',
  en: 'Checklist & Documents',
  bn: 'চেকলিস্ট ও নথি',
  icon: 'upload_file'
}, {
  id: 'payment',
  en: 'Application Fee',
  bn: 'আবেদন ফি',
  icon: 'payments'
}, {
  id: 'review',
  en: 'Review & Submit',
  bn: 'পর্যালোচনা ও জমা',
  icon: 'fact_check'
}];
export function AnnualAudit({
  language,
  onDone
}: AnnualAuditProps) {
  const t = T[language];
  const [view, setView] = useState<'dashboard' | 'form' | 'queue'>('dashboard');
  const [applications, setApplications] = useState<AuditApplication[]>(seedApplications);
  const [notifiedLicenses, setNotifiedLicenses] = useState<Set<string>>(new Set(upcomingAudits.filter(a => a.notified).map(a => a.licenseNo)));
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [licenseNoInput, setLicenseNoInput] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<BondLicense | null>(null);
  const [verifyError, setVerifyError] = useState(false);
  const [docs, setDocs] = useState<Record<string, UploadStatus>>(Object.fromEntries(documentDefs.map(d => [d.id, {
    uploaded: false
  }])));
  const [paid, setPaid] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // queue state
  const [queueFilter, setQueueFilter] = useState<'all' | 'in-progress' | 'approved' | 'disapproved'>('all');
  const [selected, setSelected] = useState<AuditApplication | null>(null);
  const verifyLicense = () => {
    const found = bondLicenses.find(l => l.licenseNo.toLowerCase() === licenseNoInput.trim().toLowerCase());
    if (found) {
      setVerifiedLicense(found);
      setVerifyError(false);
    } else {
      setVerifiedLicense(null);
      setVerifyError(true);
    }
  };
  const goNext = () => {
    if (currentStep === 0 && !verifiedLicense) {
      setVerifyError(true);
      return;
    }
    if (currentStep === 1 && documentDefs.some(d => !docs[d.id]?.uploaded)) {
      const errs: Record<string, boolean> = {};
      documentDefs.forEach(d => {
        if (!docs[d.id]?.uploaded) errs[d.id] = true;
      });
      setErrors(errs);
      return;
    }
    if (currentStep === 2 && !paid) {
      setErrors({
        payment: true
      });
      return;
    }
    setErrors({});
    const next = Math.min(currentStep + 1, stepDefs.length - 1);
    setCurrentStep(next);
    setFurthestStep(f => Math.max(f, next));
  };
  const goBack = () => setCurrentStep(s => Math.max(0, s - 1));
  const handlePay = () => {
    setPaid(true);
    setPaymentRef(`ECH-2026-${Math.floor(10000 + Math.random() * 89999)}`);
  };
  const [reqId] = useState(() => `AUD-2026-${Math.floor(3200 + Math.random() * 799)}`);
  const handleSubmit = () => {
    if (!agree) {
      setErrors({
        agree: true
      });
      return;
    }
    const newApp: AuditApplication = {
      id: reqId,
      licenseNo: verifiedLicense!.licenseNo,
      bonderEn: verifiedLicense!.nameEn,
      bonderBn: verifiedLicense!.nameBn,
      category: verifiedLicense!.category,
      submittedDate: '26 Jul 2026',
      stage: 'submitted'
    };
    setApplications(prev => [newApp, ...prev]);
    setSubmittedId(reqId);
  };
  const updateApp = (id: string, patch: Partial<AuditApplication>) => {
    setApplications(prev => prev.map(a => a.id === id ? {
      ...a,
      ...patch
    } : a));
    setSelected(prev => prev && prev.id === id ? {
      ...prev,
      ...patch
    } : prev);
  };
  const counts = {
    upcoming: upcomingAudits.length,
    inProgress: applications.filter(a => !['completed', 'disapproved', 'interim-order', 'audit-failed'].includes(a.stage)).length,
    approved: applications.filter(a => a.stage === 'completed').length,
    disapproved: applications.filter(a => a.stage === 'disapproved').length,
    legal: applications.filter(a => a.stage === 'legal-process' || a.stage === 'interim-order').length,
    failed: applications.filter(a => a.stage === 'audit-failed').length
  };
  const filteredQueue = applications.filter(a => {
    if (queueFilter === 'all') return true;
    if (queueFilter === 'approved') return a.stage === 'completed';
    if (queueFilter === 'disapproved') return ['disapproved', 'legal-process', 'interim-order', 'audit-failed'].includes(a.stage);
    return !['completed', 'disapproved', 'legal-process', 'interim-order', 'audit-failed'].includes(a.stage);
  });

  if (submittedId) {
    return <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
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
          <button type="button" onClick={() => {
          const app = applications.find(a => a.id === submittedId);
          if (app) setSelected(app);
          setSubmittedId(null);
          setView('queue');
        }} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083E71]">
            <Icon name="fact_check" className="text-[18px]" />
            {t.trackApplication}
          </button>
          <button type="button" onClick={onDone} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-5 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="home" className="text-[18px]" />
            {t.backToDashboard}
          </button>
        </div>
      </div>;
  }

  if (selected) {
    const a = selected;
    const stageIndex = stageOrder.indexOf(a.stage);
    const isExceptionPath = ['disapproved', 'legal-process', 'interim-order', 'audit-failed'].includes(a.stage);
    return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
        <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">{t.reviewTitle}</h2>
              <p className="text-xs text-[#64748B]">
                {a.id} · {a[language === 'en' ? 'bonderEn' : 'bonderBn']}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]">
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>

          {toast && <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
              <Icon name="check_circle" className="text-[16px]" />
              {toast}
            </div>}

          <div className="flex flex-col gap-3 px-5 py-5">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#E2E8F0] p-4 text-[13px]">
              <div className="col-span-2">
                <p className="text-[11px] text-[#94A3B8]">{t.bonder}</p>
                <p className="font-medium text-[#1E293B]">{a[language === 'en' ? 'bonderEn' : 'bonderBn']}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{language === 'en' ? 'License No.' : 'লাইসেন্স নং'}</p>
                <p className="font-medium text-[#1E293B]">{a.licenseNo}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t.category}</p>
                <p className="font-medium text-[#1E293B]">{a.category}</p>
              </div>
            </div>

            {!isExceptionPath && stageOrder.map((stage, i) => {
            const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'upcoming';
            return <div key={stage} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full', state === 'done' ? 'bg-[#00A86B] text-white' : state === 'current' ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]'].join(' ')}>
                      <Icon name={state === 'done' ? 'check' : 'circle'} className="text-[15px]" />
                    </span>
                    {i < stageOrder.length - 1 && <span className={`w-0.5 flex-1 ${state === 'done' ? 'bg-[#00A86B]' : 'bg-[#E2E8F0]'}`} style={{
                    minHeight: '16px'
                  }} />}
                  </div>
                  <div className="flex-1 pb-5">
                    <p className={['text-sm font-semibold', state === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#1E293B]'].join(' ')}>{t.stageLabels[stage]}</p>

                    {state === 'current' && stage === 'submitted' && <button type="button" onClick={() => updateApp(a.id, {
                    stage: 'assignment'
                  })} className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                        {t.assignOfficer}
                      </button>}

                    {state === 'done' && stage === 'assignment' && <p className="mt-0.5 text-xs text-[#64748B]">
                        {t.assignedOfficer}: {a.assignedOfficer}
                      </p>}
                    {state === 'current' && stage === 'assignment' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[11px] text-[#64748B]">{t.assignConfirm}</p>
                        <Field label={t.assignedOfficer}>
                          <select value={a.assignedOfficer ?? ''} onChange={e => updateApp(a.id, {
                        assignedOfficer: e.target.value
                      })} className={inputClass}>
                            <option value="">—</option>
                            {officerPool.map(o => <option key={o.en} value={o[language]}>
                                {o[language]}
                              </option>)}
                          </select>
                        </Field>
                        <button type="button" disabled={!a.assignedOfficer} onClick={() => updateApp(a.id, {
                      stage: 'verification'
                    })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                          {t.assignAndNotify}
                        </button>
                      </div>}

                    {state === 'done' && stage === 'verification' && <p className="mt-0.5 text-xs text-[#64748B]">{a.verificationNote}</p>}
                    {state === 'current' && stage === 'verification' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <Field label={t.verificationNoteLabel}>
                          <textarea rows={3} value={a.verificationNote ?? ''} onChange={e => updateApp(a.id, {
                        verificationNote: e.target.value
                      })} placeholder={t.verificationNotePlaceholder} className={`${inputClass} resize-none`} />
                        </Field>
                        {!a.moreDocsRequested ? <button type="button" onClick={() => {
                      updateApp(a.id, {
                        moreDocsRequested: true
                      });
                      flash(t.requestMoreDocsSent);
                    }} className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:underline">
                            <Icon name="mail" className="text-[14px]" />
                            {t.requestMoreDocs}
                          </button> : <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                            <span className="text-[11px] font-medium text-amber-700">{t.moreDocsPending}</span>
                            <button type="button" onClick={() => updateApp(a.id, {
                        moreDocsRequested: false
                      })} className="rounded-full border border-amber-600 px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100">
                              {t.docsReceived}
                            </button>
                          </div>}
                        <button type="button" disabled={!a.verificationNote?.trim() || a.moreDocsRequested} onClick={() => updateApp(a.id, {
                      stage: 'risk-assessment'
                    })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                          {t.proceedToRisk}
                        </button>
                      </div>}

                    {state === 'done' && stage === 'risk-assessment' && <p className="mt-0.5 text-xs text-[#64748B]">
                        {t.riskScoreLabel}: {a.riskScore} — {a.riskConclusion && t.riskConclusions[a.riskConclusion]}
                      </p>}
                    {state === 'current' && stage === 'risk-assessment' && <RiskAssessmentPanel t={t} language={language} app={a} onUpdate={patch => updateApp(a.id, patch)} />}

                    {state === 'done' && stage === 'factory-inspection' && <p className="mt-0.5 text-xs text-[#64748B]">
                        {a.riskConclusion === 'needs-visit' ? `${t.visitDate}: ${a.visitDay ? `${a.visitDay} Aug 2026` : '—'}` : t.visitOmittedBody}
                      </p>}
                    {state === 'current' && stage === 'factory-inspection' && <FactoryInspectionPanel t={t} language={language} app={a} onUpdate={patch => updateApp(a.id, patch)} />}

                    {state === 'done' && stage === 'audit-report' && <p className="mt-0.5 text-xs text-[#64748B]">{a.auditReportNote}</p>}
                    {state === 'current' && stage === 'audit-report' && <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
                        <p className="text-[11px] text-[#64748B]">{t.auditReportHint}</p>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateApp(a.id, {
                        auditReportResult: 'favorable'
                      })} className={['rounded-full border px-3.5 py-1.5 text-[11px] font-semibold', a.auditReportResult === 'favorable' ? 'border-[#00A86B] bg-emerald-50 text-emerald-700' : 'border-[#CBD5E1] text-[#334155] hover:border-[#00A86B]'].join(' ')}>
                            {t.markFavorable}
                          </button>
                          <button type="button" onClick={() => updateApp(a.id, {
                        auditReportResult: 'unfavorable'
                      })} className={['rounded-full border px-3.5 py-1.5 text-[11px] font-semibold', a.auditReportResult === 'unfavorable' ? 'border-[#DC2626] bg-red-50 text-[#DC2626]' : 'border-[#CBD5E1] text-[#334155] hover:border-[#DC2626]'].join(' ')}>
                            {t.markUnfavorable}
                          </button>
                        </div>
                        <Field label={t.auditReportNoteLabel}>
                          <textarea rows={3} value={a.auditReportNote ?? ''} onChange={e => updateApp(a.id, {
                        auditReportNote: e.target.value
                      })} placeholder={t.auditReportNotePlaceholder} className={`${inputClass} resize-none`} />
                        </Field>
                        <button type="button" disabled={!a.auditReportResult || !a.auditReportNote?.trim()} onClick={() => updateApp(a.id, {
                      stage: 'approval'
                    })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
                          {t.forwardToJcDc}
                        </button>
                      </div>}

                    {state === 'current' && stage === 'approval' && <JcDcApprovalPanel t={t} auditReportResult={a.auditReportResult} note={a.jcDcNote ?? ''} onNoteChange={v => updateApp(a.id, {
                    jcDcNote: v
                  })} onApprove={() => {
                    updateApp(a.id, {
                      stage: 'completed',
                      finalStatusLabel: 'Current'
                    });
                    flash(t.approvedNotice);
                  }} onDisapprove={reason => updateApp(a.id, {
                    stage: 'disapproved',
                    disapprovalReason: reason
                  })} />}

                    {stage === 'completed' && a.stage === 'completed' && <div className="mt-2 flex flex-col gap-3">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                          <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                            <Icon name="workspace_premium" className="text-[18px]" />
                            {t.stageLabels.completed}
                          </p>
                          <p className="mt-1 text-xs text-emerald-800">{t.approvedNotice}</p>
                        </div>
                        <ReportCard icon="verified" title={t.auditConfirmation} lines={[[t.finalStatus, a.finalStatusLabel ?? 'Current'], [language === 'en' ? 'License No.' : 'লাইসেন্স নং', a.licenseNo]]} />
                        {a.category === 'deemed-exporter' && <div className="rounded-xl border border-blue-100 bg-[#EAF3FE] p-4">
                            <p className="text-xs text-[#0A4D8C]">{t.entitlementNotice}</p>
                            {a.entitlementIssued ? <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                                <Icon name="check_circle" className="text-[14px]" />
                                {t.entitlementIssued}
                              </p> : <button type="button" onClick={() => {
                        updateApp(a.id, {
                          entitlementIssued: true
                        });
                      }} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#083E71]">
                                {t.issueEntitlement}
                              </button>}
                          </div>}
                      </div>}
                  </div>
                </div>;
          })}

            {a.stage === 'disapproved' && <DisapprovedPanel t={t} app={a} onUpdate={patch => updateApp(a.id, patch)} onInitiateLegal={() => updateApp(a.id, {
            stage: 'legal-process'
          })} />}

            {a.stage === 'legal-process' && <LegalProcessPanel t={t} onApply={outcome => {
            if (outcome === 'interim-order') {
              updateApp(a.id, {
                legalOutcome: outcome,
                stage: 'interim-order',
                finalStatusLabel: 'Current w/ Interim Order'
              });
            } else if (outcome === 'demand-unpaid') {
              updateApp(a.id, {
                legalOutcome: outcome,
                stage: 'audit-failed',
                finalStatusLabel: 'Audit Failed'
              });
            } else {
              updateApp(a.id, {
                legalOutcome: outcome,
                stage: 'completed',
                finalStatusLabel: 'Current'
              });
              flash(t.approvedNotice);
            }
          }} />}

            {a.stage === 'interim-order' && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-amber-700">
                  <Icon name="hourglass_top" className="text-[18px]" />
                  {t.stageLabels['interim-order']}
                </p>
                <p className="mt-1 text-xs text-amber-800">{t.interimOrderNotice}</p>
                <button type="button" onClick={() => updateApp(a.id, {
              stage: 'legal-process'
            })} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-600 px-3.5 py-1.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-100">
                  {t.resolveInterim}
                </button>
              </div>}

            {a.stage === 'audit-failed' && <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
                  <Icon name="gpp_bad" className="text-[18px]" />
                  {t.stageLabels['audit-failed']}
                </p>
                <p className="mt-1 text-xs text-[#B91C1C]">{t.auditFailedNotice}</p>
              </div>}
          </div>
        </div>
      </div>;
  }

  if (view === 'form') {
    return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <button type="button" onClick={() => setView('dashboard')} className="hover:text-[#0A4D8C]">
            {t.pageTitle}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.startApplication}</span>
        </nav>

        <div className="flex items-center gap-2">
          {stepDefs.map((s, i) => <div key={s.id} className="flex flex-1 items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${i < currentStep ? 'bg-[#00A86B] text-white' : i === currentStep ? 'bg-[#0A4D8C] text-white' : 'bg-[#EEF2F6] text-[#94A3B8]'}`}>
                {i < currentStep ? <Icon name="check" className="text-[16px]" /> : i + 1}
              </span>
              <span className={`text-xs font-semibold ${i === currentStep ? 'text-[#1E293B]' : 'text-[#94A3B8]'}`}>{s[language]}</span>
              {i < stepDefs.length - 1 && <span className="mx-1 h-px flex-1 bg-[#E2E8F0]" />}
            </div>)}
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          {currentStep === 0 && <div className="flex flex-col gap-4">
              <Field label={t.licenseNoLabel} required error={verifyError ? t.notFound : undefined}>
                <div className="flex gap-2">
                  <TextInput value={licenseNoInput} onChange={v => {
                setLicenseNoInput(v);
                setVerifiedLicense(null);
                setVerifyError(false);
              }} placeholder="BL-2024-03398" error={verifyError} />
                  <button type="button" onClick={verifyLicense} className="shrink-0 rounded-lg border border-[#0A4D8C] px-4 text-xs font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                    {t.verify}
                  </button>
                </div>
              </Field>
              {verifiedLicense && <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Icon name="check_circle" className="text-[20px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1E293B]">
                      {verifiedLicense.licenseNo} · <span className="text-emerald-700">{t.verified}</span>
                    </p>
                    <p className="text-xs text-[#334155]">
                      {t.bonder}: {verifiedLicense[language === 'en' ? 'nameEn' : 'nameBn']} · {t.category}: {verifiedLicense.category}
                    </p>
                  </div>
                </div>}
            </div>}

          {currentStep === 1 && <div className="flex flex-col gap-3">
              <p className="text-xs text-[#64748B]">{t.uploadIntro}</p>
              {documentDefs.map(d => <UploadRow key={d.id} icon={d.icon} label={d[language]} status={docs[d.id]} language={language} onUpload={() => setDocs(prev => ({
            ...prev,
            [d.id]: {
              uploaded: true,
              fileName: `${d.id}_scan.pdf`,
              size: `${(0.4 + Math.random() * 1.4).toFixed(1)} MB`
            }
          }))} onRemove={() => setDocs(prev => ({
            ...prev,
            [d.id]: {
              uploaded: false
            }
          }))} />)}
            </div>}

          {currentStep === 2 && <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1E293B]">{t.payLabel}</p>
                    <p className="text-xs text-[#64748B]">{t.payVia}</p>
                  </div>
                  <p className="text-lg font-bold text-[#0A4D8C]">{t.payAmount}</p>
                </div>
                {paid ? <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                    <Icon name="check_circle" className="text-[16px] text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">
                      {t.paid} — {t.paymentRef}: {paymentRef}
                    </span>
                  </div> : <button type="button" onClick={handlePay} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                    <Icon name="payments" className="text-[16px]" />
                    {t.payNow}
                  </button>}
              </div>
              {errors.payment && <p className="text-[11px] font-medium text-[#DC2626]">{t.required}</p>}
            </div>}

          {currentStep === 3 && <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="border-b border-[#F1F5F9] px-4 py-3">
                  <span className="text-sm font-semibold text-[#1E293B]">{t.step0}</span>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  <div className="flex justify-between gap-3 text-[13px]">
                    <dt className="text-[#64748B]">{t.licenseNoLabel}</dt>
                    <dd className="font-medium text-[#1E293B]">{verifiedLicense?.licenseNo}</dd>
                  </div>
                  <div className="flex justify-between gap-3 text-[13px]">
                    <dt className="text-[#64748B]">{t.bonder}</dt>
                    <dd className="truncate font-medium text-[#1E293B]">{verifiedLicense?.[language === 'en' ? 'nameEn' : 'nameBn']}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-xl border border-[#E2E8F0]">
                <div className="border-b border-[#F1F5F9] px-4 py-3">
                  <span className="text-sm font-semibold text-[#1E293B]">{t.step2}</span>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                  <div className="flex justify-between gap-3 text-[13px]">
                    <dt className="text-[#64748B]">{t.paymentRef}</dt>
                    <dd className="font-medium text-[#1E293B]">{paymentRef}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0A4D8C] focus:ring-[#1E88E5]" />
                <label htmlFor="agree" className="text-sm text-[#334155]">
                  {t.agreeDeclaration}
                </label>
              </div>
              {errors.agree && <span className="text-[11px] font-medium text-[#DC2626]">{t.required}</span>}
            </div>}

          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-5">
            <button type="button" onClick={currentStep === 0 ? () => setView('dashboard') : goBack} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#F5F7FA]">
              <Icon name="arrow_back" className="text-[16px]" />
              {currentStep === 0 ? t.backToDashboard : t.back}
            </button>
            {currentStep === stepDefs.length - 1 ? <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-1.5 rounded-full bg-[#00A86B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#048f5c]">
                {t.submit}
                <Icon name="send" className="text-[16px]" />
              </button> : <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083E71]">
                {t.next}
                <Icon name="arrow_forward" className="text-[16px]" />
              </button>}
          </div>
        </div>
      </div>;
  }

  if (view === 'queue') {
    return <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
          <button type="button" onClick={onDone} className="flex items-center gap-1.5 hover:text-[#0A4D8C]">
            <Icon name="home" className="text-[16px]" />
            {t.home}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <button type="button" onClick={() => setView('dashboard')} className="hover:text-[#0A4D8C]">
            {t.pageTitle}
          </button>
          <Icon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-[#0A4D8C]">{t.reviewQueue}</span>
        </nav>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">{t.queueTitle}</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#64748B]">{t.queueSubtitle}</p>
          </div>
          <button type="button" onClick={() => setView('dashboard')} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="arrow_back" className="text-[16px]" />
            {t.back}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'in-progress', 'approved', 'disapproved'] as const).map(f => <button key={f} type="button" onClick={() => setQueueFilter(f)} className={['rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', queueFilter === f ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white' : 'border-[#CBD5E1] text-[#334155] hover:border-[#0A4D8C]'].join(' ')}>
              {f === 'all' ? t.filterAll : f === 'in-progress' ? t.filterInProgress : f === 'approved' ? t.filterApproved : t.filterDisapproved}
            </button>)}
        </div>

        <div className="flex flex-col gap-3">
          {filteredQueue.map(a => <button key={a.id} type="button" onClick={() => setSelected(a)} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FE] text-[#0A4D8C]">
                <Icon name="fact_check" className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#0A4D8C]">{a.id}</span>
                  <span className={['rounded-full px-2 py-0.5 text-[10px] font-semibold', a.stage === 'completed' ? 'bg-emerald-50 text-emerald-700' : ['disapproved', 'legal-process', 'interim-order', 'audit-failed'].includes(a.stage) ? 'bg-red-50 text-[#DC2626]' : 'bg-blue-50 text-[#0A4D8C]'].join(' ')}>
                    {t.stageLabels[a.stage]}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] font-medium text-[#334155]">
                  {a.licenseNo} · {a[language === 'en' ? 'bonderEn' : 'bonderBn']}
                </p>
                <p className="text-[11px] text-[#94A3B8]">{a.submittedDate}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#0A4D8C] px-3.5 py-1.5 text-xs font-semibold text-white">{t.review}</span>
            </button>)}
        </div>
      </div>;
  }

  // dashboard
  return <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-6">
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
          <p className="mt-1 max-w-3xl text-sm text-[#64748B]">{t.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={() => setView('queue')} className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F5F7FA]">
            <Icon name="fact_check" className="text-[16px]" />
            {t.reviewQueue}
          </button>
          <button type="button" onClick={() => {
          setView('form');
          setCurrentStep(0);
          setFurthestStep(0);
        }} className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
            <Icon name="add" className="text-[16px]" />
            {t.startApplication}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon="event_upcoming" label={t.statUpcoming} value={counts.upcoming} color="#1E88E5" />
        <StatCard icon="hourglass_top" label={t.statInProgress} value={counts.inProgress} color="#B45309" />
        <StatCard icon="task_alt" label={t.statApproved} value={counts.approved} color="#00A86B" />
        <StatCard icon="cancel" label={t.statDisapproved} value={counts.disapproved} color="#DC2626" />
        <StatCard icon="gavel" label={t.statLegal} value={counts.legal} color="#7C3AED" />
        <StatCard icon="gpp_bad" label={t.statFailed} value={counts.failed} color="#991B1B" />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-bold text-[#1E293B]">{t.upcomingTitle}</h2>
          <p className="text-xs text-[#64748B]">{t.upcomingSubtitle}</p>
        </div>
        <div className="flex flex-col gap-3">
          {upcomingAudits.map(u => {
          const notified = notifiedLicenses.has(u.licenseNo);
          const overdue = u.daysLeft < 0;
          return <div key={u.licenseNo} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <span className={['flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', overdue ? 'bg-red-50 text-[#DC2626]' : 'bg-[#EAF3FE] text-[#0A4D8C]'].join(' ')}>
                  <Icon name={overdue ? 'warning' : 'event'} className="text-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1E293B]">{u[language === 'en' ? 'nameEn' : 'nameBn']}</p>
                  <p className="text-[13px] text-[#334155]">
                    {u.licenseNo} · {language === 'en' ? 'Due' : 'নির্ধারিত'} {u.dueDate}
                  </p>
                  <p className={['text-[11px] font-semibold', overdue ? 'text-[#DC2626]' : 'text-[#94A3B8]'].join(' ')}>
                    {overdue ? t.overdueLabel : `${u.daysLeft} ${t.daysLeft}`}
                  </p>
                </div>
                {notified ? <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">{t.notified}</span> : <button type="button" onClick={() => setNotifiedLicenses(prev => new Set(prev).add(u.licenseNo))} className="shrink-0 rounded-full border border-[#0A4D8C] px-3.5 py-1.5 text-[11px] font-semibold text-[#0A4D8C] hover:bg-[#EAF3FE]">
                    {t.notify}
                  </button>}
              </div>;
        })}
        </div>
      </div>
    </div>;
}
function RiskAssessmentPanel({
  t,
  language,
  app,
  onUpdate
}: {
  t: (typeof T)['en'];
  language: Language;
  app: AuditApplication;
  onUpdate: (patch: Partial<AuditApplication>) => void;
}) {
  const license = bondLicenses.find(l => l.licenseNo === app.licenseNo);
  const [scores, setScores] = useState<Record<string, number>>(app.riskScores ?? Object.fromEntries(riskCriteriaDefs.map(c => [c.id, license ? scoreFromProfile(license, c.id) : 5])));
  const generate = () => {
    const score = weightedScore(riskCriteriaDefs, scores);
    const conclusion: RiskConclusion = score <= 3 ? 'low-compliant-skip' : score >= 8 ? 'high-noncompliant-skip' : 'needs-visit';
    onUpdate({
      riskScores: scores,
      riskScore: score,
      riskConclusion: conclusion
    });
  };
  return <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      <p className="text-xs font-semibold text-[#334155]">{t.riskParamTitle}</p>
      <p className="text-[11px] text-[#94A3B8]">{t.riskParamHint}</p>
      <CriteriaScorer language={language} defs={riskCriteriaDefs} scores={scores} onScore={(id, v) => setScores(s => ({
      ...s,
      [id]: v
    }))} weightLabel={t.weight} scoreLabel={t.score} />
      {!app.riskConclusion ? <button type="button" onClick={generate} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
          <Icon name="analytics" className="text-[16px]" />
          {t.generateRiskReport}
        </button> : <>
          <div className="rounded-lg bg-[#F5F7FA] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.riskReportTitle}</p>
            <p className="mt-1 text-sm font-bold text-[#1E293B]">
              {t.riskScoreLabel}: {app.riskScore}
            </p>
            <p className="mt-1 text-xs text-[#334155]">{t.riskConclusions[app.riskConclusion]}</p>
          </div>
          {app.riskConclusion !== 'needs-visit' ? <>
              <Field label={t.commissionerDecisionLabel}>
                <textarea rows={3} value={app.commissionerDecisionNote ?? ''} onChange={e => onUpdate({
              commissionerDecisionNote: e.target.value
            })} placeholder={t.commissionerDecisionPlaceholder} className={`${inputClass} resize-none`} />
              </Field>
              <button type="button" disabled={!app.commissionerDecisionNote?.trim()} onClick={() => onUpdate({
            stage: app.riskConclusion === 'high-noncompliant-skip' ? 'factory-inspection' : 'factory-inspection'
          })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c] disabled:opacity-40">
                {t.approveNoVisit}
              </button>
            </> : <button type="button" onClick={() => onUpdate({
          stage: 'factory-inspection'
        })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
              {t.proceedToInspection}
            </button>}
        </>}
    </div>;
}
function FactoryInspectionPanel({
  t,
  language,
  app,
  onUpdate
}: {
  t: (typeof T)['en'];
  language: Language;
  app: AuditApplication;
  onUpdate: (patch: Partial<AuditApplication>) => void;
}) {
  const [scores, setScores] = useState<Record<string, number>>(app.inspectionScores ?? Object.fromEntries(inspectionCriteriaDefs.map(c => [c.id, 5])));
  if (app.riskConclusion !== 'needs-visit') {
    return <div className="mt-2 flex flex-col gap-3 rounded-lg border border-dashed border-[#CBD5E1] p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[#334155]">
          <Icon name="event_busy" className="text-[15px]" />
          {t.visitOmittedTitle}
        </p>
        <p className="text-[11px] text-[#94A3B8]">{t.visitOmittedBody}</p>
        <button type="button" onClick={() => onUpdate({
        stage: 'audit-report'
      })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
          {t.proceedToAuditReport}
        </button>
      </div>;
  }
  return <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      {!app.visitDay ? <>
          <p className="text-xs font-semibold text-[#334155]">{t.inspectionCalendarTitle}</p>
          <p className="text-[11px] text-[#94A3B8]">{t.inspectionCalendarHint}</p>
          <InspectionCalendarWithState language={language} onSchedule={day => onUpdate({
        visitDay: day
      })} />
        </> : <>
          <div className="flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
            <span className="text-[11px] font-semibold text-[#334155]">
              {t.visitDate}: {app.visitDay} Aug 2026
            </span>
            <span className="text-[11px] font-medium text-emerald-700">{t.visitScheduledNotice}</span>
          </div>
          <Field label={t.factoryVisitNoteLabel}>
            <textarea rows={3} value={app.factoryVisitNote ?? ''} onChange={e => onUpdate({
          factoryVisitNote: e.target.value
        })} placeholder={t.factoryVisitNotePlaceholder} className={`${inputClass} resize-none`} />
          </Field>
          <p className="text-xs font-semibold text-[#334155]">{t.inspectionParamTitle}</p>
          <CriteriaScorer language={language} defs={inspectionCriteriaDefs} scores={scores} onScore={(id, v) => setScores(s => ({
        ...s,
        [id]: v
      }))} weightLabel={t.weight} scoreLabel={t.score} />
          {!app.inspectionScore ? <button type="button" disabled={!app.factoryVisitNote?.trim()} onClick={() => onUpdate({
        inspectionScores: scores,
        inspectionScore: weightedScore(inspectionCriteriaDefs, scores)
      })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
              <Icon name="summarize" className="text-[16px]" />
              {t.submitInspectionReport}
            </button> : <>
              <div className="rounded-lg bg-[#F5F7FA] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{t.inspectionReportTitle}</p>
                <p className="mt-1 text-sm font-bold text-[#1E293B]">
                  {t.score}: {app.inspectionScore}
                </p>
              </div>
              <button type="button" onClick={() => onUpdate({
          stage: 'audit-report'
        })} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71]">
                {t.proceedToAuditReport}
              </button>
            </>}
        </>}
    </div>;
}
function InspectionCalendarWithState({
  language,
  onSchedule
}: {
  language: Language;
  onSchedule: (day: number) => void;
}) {
  const [day, setDay] = useState<number | null>(null);
  return <div className="flex flex-col gap-3">
      <InspectionCalendar language={language} conflictDays={[6, 14, 22]} selected={day} onSelect={setDay} />
      <button type="button" disabled={!day} onClick={() => day && onSchedule(day)} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
        <Icon name="event_available" className="text-[16px]" />
        {language === 'en' ? 'Schedule Visit & Notify Bonder' : 'পরিদর্শন নির্ধারণ করুন ও বন্ডারকে অবহিত করুন'}
      </button>
    </div>;
}
function JcDcApprovalPanel({
  t,
  auditReportResult,
  note,
  onNoteChange,
  onApprove,
  onDisapprove
}: {
  t: (typeof T)['en'];
  auditReportResult?: 'favorable' | 'unfavorable';
  note: string;
  onNoteChange: (v: string) => void;
  onApprove: () => void;
  onDisapprove: (reason: string) => void;
}) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  return <div className="mt-2 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] p-3">
      {auditReportResult && <div className={['flex items-center gap-1.5 rounded-lg px-3 py-2', auditReportResult === 'favorable' ? 'bg-emerald-50' : 'bg-red-50'].join(' ')}>
          <Icon name={auditReportResult === 'favorable' ? 'thumb_up' : 'thumb_down'} className={['text-[15px]', auditReportResult === 'favorable' ? 'text-emerald-600' : 'text-[#DC2626]'].join(' ')} />
          <span className="text-[11px] font-semibold text-[#334155]">
            {auditReportResult === 'favorable' ? T.en.markFavorable : T.en.markUnfavorable}
          </span>
        </div>}
      <Field label={t.jcDcNoteLabel}>
        <textarea rows={3} value={note} onChange={e => onNoteChange(e.target.value)} placeholder={t.jcDcNotePlaceholder} className={`${inputClass} resize-none`} />
      </Field>
      {showReason && <Field label={t.disapprovalReasonLabel} error={error}>
          <textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} className={`${inputClass} resize-none`} />
        </Field>}
      <div className="flex gap-2">
        {!showReason ? <button type="button" onClick={() => setShowReason(true)} className="rounded-full border border-[#DC2626] px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50">
            {t.disapprove}
          </button> : <button type="button" onClick={() => {
        if (!reason.trim()) {
          setError(t.disapprovalReasonRequired);
          return;
        }
        onDisapprove(reason);
      }} className="rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]">
            {t.disapprove}
          </button>}
        <button type="button" disabled={!note.trim()} onClick={onApprove} className="rounded-full bg-[#00A86B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#048f5c] disabled:opacity-40">
          {t.approve}
        </button>
      </div>
    </div>;
}
function DisapprovedPanel({
  t,
  app,
  onUpdate,
  onInitiateLegal
}: {
  t: (typeof T)['en'];
  app: AuditApplication;
  onUpdate: (patch: Partial<AuditApplication>) => void;
  onInitiateLegal: () => void;
}) {
  const [reply, setReply] = useState(app.bonderReply ?? '');
  const [replySent, setReplySent] = useState(!!app.bonderReply);
  return <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
        <Icon name="cancel" className="text-[18px]" />
        {t.stageLabels.disapproved}
      </p>
      <p className="mt-1 text-xs text-[#B91C1C]">{app.disapprovalReason}</p>
      <p className="mt-2 text-xs text-[#DC2626]">{t.disapprovedBody}</p>

      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-red-300 bg-white p-3">
        <Field label={t.bonderReplyLabel}>
          <textarea rows={3} value={reply} onChange={e => setReply(e.target.value)} placeholder={t.bonderReplyPlaceholder} className={`${inputClass} resize-none`} />
        </Field>
        {!replySent ? <button type="button" disabled={!reply.trim()} onClick={() => {
        onUpdate({
          bonderReply: reply
        });
        setReplySent(true);
      }} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
            {t.submitReply}
          </button> : <p className="text-[11px] font-medium text-emerald-700">{t.replySubmitted}</p>}
      </div>

      <button type="button" onClick={onInitiateLegal} className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#DC2626] px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-100">
        <Icon name="gavel" className="text-[16px]" />
        {t.initiateLegal}
      </button>
    </div>;
}
function LegalProcessPanel({
  t,
  onApply
}: {
  t: (typeof T)['en'];
  onApply: (outcome: LegalOutcome) => void;
}) {
  const [outcome, setOutcome] = useState<LegalOutcome | ''>('');
  return <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
      <p className="flex items-center gap-1.5 text-sm font-bold text-violet-700">
        <Icon name="gavel" className="text-[18px]" />
        {t.stageLabels['legal-process']}
      </p>
      <p className="mt-1 text-xs text-violet-800">{t.legalHaltedNotice}</p>

      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-violet-300 bg-white p-3">
        <p className="text-xs font-semibold text-[#334155]">{t.legalOutcomeTitle}</p>
        <p className="text-[11px] text-[#94A3B8]">{t.legalOutcomeHint}</p>
        <div className="flex flex-col gap-1.5">
          {(Object.keys(t.legalOutcomes) as LegalOutcome[]).map(o => <label key={o} className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-2 text-[13px] text-[#334155]">
              <input type="radio" name="legalOutcome" checked={outcome === o} onChange={() => setOutcome(o)} className="h-4 w-4 border-[#CBD5E1] text-[#0A4D8C]" />
              {t.legalOutcomes[o]}
            </label>)}
        </div>
        <button type="button" disabled={!outcome} onClick={() => outcome && onApply(outcome)} className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0A4D8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#083E71] disabled:opacity-40">
          {t.applyOutcome}
        </button>
      </div>
    </div>;
}
function ReportCard({
  icon,
  title,
  lines
}: {
  icon: string;
  title: string;
  lines: [string, string][];
}) {
  return <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
        <Icon name={icon} className="text-[16px] text-[#0A4D8C]" />
        {title}
      </p>
      <dl className="mt-2 grid grid-cols-1 gap-y-1.5 text-[13px] sm:grid-cols-2">
        {lines.map(([k, v]) => <div key={k} className="flex justify-between gap-3">
            <dt className="text-[#64748B]">{k}</dt>
            <dd className="font-medium text-[#1E293B]">{v}</dd>
          </div>)}
      </dl>
    </div>;
}
