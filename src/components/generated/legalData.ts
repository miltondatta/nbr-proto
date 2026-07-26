import { bondLicenses } from './bondLicenseData';

export type CaseStage = 'scn-requested' | 'scn-approved' | 'scn-issued' | 'writ-filed' | 'scn-response' | 'hearing-scheduled' | 'adjudication' | 'interim-order-pending' | 'demand-notice' | 'appellate-commissionerate' | 'high-court' | 'appellate-division' | 'closed-favor-bonder' | 'closed-favor-cbc' | 'bin-locked';

export type SourceModule = 'audit' | 'prevention';
export type ClosureFlavor = 'writ-annulled' | 'scn-closure-order' | 'interim-order-release' | 'high-court-release' | 'appellate-division-release';

export interface HistoryEntry {
  date: string;
  actionEn: string;
  actionBn: string;
}

export interface LegalCase {
  id: string;
  licenseNo: string;
  sourceModule: SourceModule;
  requestNote: string;
  stage: CaseStage;
  closureFlavor?: ClosureFlavor;
  scnNo?: string;
  scnIssueDate?: string;
  responseDeadline?: string;
  writFiled?: boolean;
  writVerdict?: 'favor-bonder' | 'favor-cbc';
  bonderResponse?: string;
  hearingDate?: string;
  adjudicationNote?: string;
  interimOrderVerdict?: 'approved' | 'disapproved';
  demandNoticeNo?: string;
  demandNoticeAmount?: number;
  appellateCommissionerateVerdict?: 'adjustment' | 'uphold';
  statutoryPaymentDone?: boolean;
  hardshipGranted?: boolean;
  highCourtVerdict?: 'nullify' | 'adjustment' | 'uphold';
  appellateDivisionVerdict?: 'nullify' | 'adjustment' | 'uphold';
  history: HistoryEntry[];
}

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export const stageLabels: Record<CaseStage, { en: string; bn: string }> = {
  'scn-requested': { en: 'e-SCN Requested', bn: 'ই-এসসিএন অনুরোধকৃত' },
  'scn-approved': { en: 'e-SCN Approved', bn: 'ই-এসসিএন অনুমোদিত' },
  'scn-issued': { en: 'e-SCN Issued to Bonder', bn: 'বন্ডকারীকে ই-এসসিএন ইস্যুকৃত' },
  'writ-filed': { en: 'Writ Case Filed (High Court)', bn: 'রিট মামলা দায়েরকৃত (হাইকোর্ট)' },
  'scn-response': { en: 'Bonder Responded to SCN', bn: 'বন্ডকারী এসসিএন-এর জবাব দিয়েছে' },
  'hearing-scheduled': { en: 'Hearing Scheduled', bn: 'শুনানির তারিখ নির্ধারিত' },
  adjudication: { en: 'Adjudication', bn: 'বিচারিক সিদ্ধান্ত' },
  'interim-order-pending': { en: 'Interim Order Pending (High Court)', bn: 'অন্তর্বর্তীকালীন আদেশ অপেক্ষমাণ (হাইকোর্ট)' },
  'demand-notice': { en: 'e-Demand Notice', bn: 'ই-ডিমান্ড নোটিশ' },
  'appellate-commissionerate': { en: 'Appellate Commissionerate/Tribunal', bn: 'আপিল কমিশনারেট/ট্রাইব্যুনাল' },
  'high-court': { en: 'High Court', bn: 'হাইকোর্ট' },
  'appellate-division': { en: 'Appellate Division (Supreme Court)', bn: 'আপিল বিভাগ (সুপ্রিম কোর্ট)' },
  'closed-favor-bonder': { en: 'Closed — Favor of Bonder', bn: 'বন্ধ — বন্ডকারীর পক্ষে' },
  'closed-favor-cbc': { en: 'Closed — Demand Paid', bn: 'বন্ধ — ডিমান্ড পরিশোধিত' },
  'bin-locked': { en: 'BIN Locked / License Suspended', bn: 'বিআইএন লক / লাইসেন্স স্থগিত' }
};

export const sourceModuleLabels: Record<SourceModule, { en: string; bn: string }> = {
  audit: { en: 'Annual Audit', bn: 'বার্ষিক নিরীক্ষা' },
  prevention: { en: 'Prevention', bn: 'প্রিভেনশন' }
};

export const legalCases: LegalCase[] = [{
  id: 'LC-2026-101',
  licenseNo: 'BL-2025-04012',
  sourceModule: 'audit',
  requestNote: 'Passbook discrepancy identified during annual audit — raw material shortfall of 8,400 kg unaccounted for.',
  stage: 'scn-requested',
  history: [{ date: '20 Jul 2026', actionEn: 'e-SCN request raised via e-Note & Nothi by Audit section to AC/DC.', actionBn: 'অডিট বিভাগ কর্তৃক ই-নোট ও নথির মাধ্যমে এসি/ডিসি-এর কাছে ই-এসসিএন অনুরোধ উত্থাপিত।' }]
}, {
  id: 'LC-2026-098',
  licenseNo: 'BL-2020-00743',
  sourceModule: 'audit',
  requestNote: 'Non-compliant audit status with unresolved legal notice — escalated for SCN.',
  stage: 'scn-approved',
  history: [{ date: '10 Jul 2026', actionEn: 'e-SCN request raised via e-Note & Nothi by Audit section.', actionBn: 'অডিট বিভাগ কর্তৃক ই-নোট ও নথির মাধ্যমে ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '13 Jul 2026', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন এবং ই-এসসিএন তৈরি করেছেন।' }]
}, {
  id: 'LC-2026-095',
  licenseNo: 'BL-2019-00287',
  sourceModule: 'prevention',
  requestNote: 'Suspected diversion of bonded raw materials flagged by Prevention section during routine check.',
  stage: 'scn-issued',
  scnNo: 'SCN-2026-0095',
  scnIssueDate: '18 Jun 2026',
  responseDeadline: '18 Jul 2026',
  history: [{ date: '10 Jun 2026', actionEn: 'e-SCN request raised via e-Note & Nothi by Prevention section.', actionBn: 'প্রিভেনশন বিভাগ কর্তৃক ই-নোট ও নথির মাধ্যমে ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '14 Jun 2026', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন এবং ই-এসসিএন তৈরি করেছেন।' }, { date: '18 Jun 2026', actionEn: 'e-SCN SCN-2026-0095 issued to Bonder; Bonder Profile and Audit Management notified. Response due 18 Jul 2026.', actionBn: 'ই-এসসিএন SCN-2026-0095 বন্ডকারীকে ইস্যু করা হয়েছে; বন্ডকারী প্রোফাইল ও অডিট ব্যবস্থাপনাকে অবহিত করা হয়েছে। জবাবের শেষ তারিখ ১৮ জুলাই ২০২৬।' }]
}, {
  id: 'LC-2026-090',
  licenseNo: 'BL-2018-00098',
  sourceModule: 'prevention',
  requestNote: 'Unauthorized local sale of bonded finished goods suspected.',
  stage: 'writ-filed',
  scnNo: 'SCN-2026-0090',
  scnIssueDate: '02 May 2026',
  responseDeadline: '02 Jun 2026',
  writFiled: true,
  history: [{ date: '20 Apr 2026', actionEn: 'e-SCN request raised via e-Note & Nothi by Prevention section.', actionBn: 'প্রিভেনশন বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '25 Apr 2026', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন।' }, { date: '02 May 2026', actionEn: 'e-SCN SCN-2026-0090 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2026-0090 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '10 May 2026', actionEn: 'Bonder filed a writ case in High Court to nullify the SCN without responding. CBC officials notified via Case Information Input Management.', actionBn: 'বন্ডকারী জবাব না দিয়ে এসসিএন বাতিলের জন্য হাইকোর্টে রিট মামলা দায়ের করেছেন। কেস তথ্য ইনপুট ব্যবস্থাপনার মাধ্যমে সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।' }]
}, {
  id: 'LC-2026-085',
  licenseNo: 'BL-2021-01204',
  sourceModule: 'audit',
  requestNote: 'Audit flagged inventory variance exceeding tolerance for two consecutive years.',
  stage: 'scn-response',
  scnNo: 'SCN-2026-0085',
  scnIssueDate: '15 Apr 2026',
  responseDeadline: '15 May 2026',
  writFiled: false,
  bonderResponse: 'Variance attributed to a documented machine breakdown in Q3; repair records and revised production logs attached.',
  history: [{ date: '01 Apr 2026', actionEn: 'e-SCN request raised via e-Note & Nothi by Audit section.', actionBn: 'অডিট বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '05 Apr 2026', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন।' }, { date: '15 Apr 2026', actionEn: 'e-SCN SCN-2026-0085 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2026-0085 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '10 May 2026', actionEn: 'Bonder submitted response with attached documents (machine breakdown records, revised production logs).', actionBn: 'বন্ডকারী সংযুক্ত নথিসহ জবাব দাখিল করেছেন (মেশিন বিকল রেকর্ড, সংশোধিত উৎপাদন লগ)।' }]
}, {
  id: 'LC-2026-080',
  licenseNo: 'BL-2024-03650',
  sourceModule: 'prevention',
  requestNote: 'Mismatch between declared and physically found raw materials during spot check.',
  stage: 'hearing-scheduled',
  scnNo: 'SCN-2026-0080',
  scnIssueDate: '20 Mar 2026',
  responseDeadline: '20 Apr 2026',
  writFiled: false,
  bonderResponse: 'Requested in-person hearing to present physical stock reconciliation records.',
  hearingDate: '05 Aug 2026',
  history: [{ date: '10 Mar 2026', actionEn: 'e-SCN request raised via e-Note & Nothi by Prevention section.', actionBn: 'প্রিভেনশন বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '15 Mar 2026', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন।' }, { date: '20 Mar 2026', actionEn: 'e-SCN SCN-2026-0080 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2026-0080 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '18 Apr 2026', actionEn: 'Bonder submitted response requesting an in-person hearing.', actionBn: 'বন্ডকারী ব্যক্তিগতভাবে শুনানির অনুরোধসহ জবাব দাখিল করেছেন।' }, { date: '22 Apr 2026', actionEn: 'Hearing scheduled for 05 Aug 2026 via e-Calendar; details recorded via e-Note & Nothi.', actionBn: 'ই-ক্যালেন্ডারের মাধ্যমে ০৫ আগস্ট ২০২৬ তারিখে শুনানি নির্ধারিত; ই-নোট ও নথির মাধ্যমে বিস্তারিত রেকর্ড করা হয়েছে।' }]
}, {
  id: 'LC-2026-070',
  licenseNo: 'BL-2022-01655',
  sourceModule: 'audit',
  requestNote: 'Repeated audit non-compliance with unresolved legal notice from prior year.',
  stage: 'adjudication',
  scnNo: 'SCN-2026-0070',
  scnIssueDate: '05 Feb 2026',
  responseDeadline: '05 Mar 2026',
  writFiled: false,
  bonderResponse: 'No response received within the prescribed time.',
  history: [{ date: '20 Jan 2026', actionEn: 'e-SCN request raised via e-Note & Nothi by Audit section.', actionBn: 'অডিট বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '25 Jan 2026', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন।' }, { date: '05 Feb 2026', actionEn: 'e-SCN SCN-2026-0070 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2026-0070 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '06 Mar 2026', actionEn: 'No response received within prescribed time. Bonder and CBC officials notified; case forwarded to Adjudication.', actionBn: 'নির্ধারিত সময়ের মধ্যে কোনো জবাব পাওয়া যায়নি। বন্ডকারী ও সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে; মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।' }]
}, {
  id: 'LC-2026-060',
  licenseNo: 'BL-2020-00512',
  sourceModule: 'audit',
  requestNote: 'Confirmed shortfall of raw materials against ideal usage calculation.',
  stage: 'demand-notice',
  scnNo: 'SCN-2025-0212',
  scnIssueDate: '10 Nov 2025',
  responseDeadline: '10 Dec 2025',
  writFiled: false,
  bonderResponse: 'No response received within the prescribed time.',
  adjudicationNote: 'Unsatisfactory — no response to SCN. Adjudication Order issued imposing duty and fine on the confirmed shortfall.',
  demandNoticeNo: 'DN-2025-0212',
  demandNoticeAmount: 486000,
  history: [{ date: '25 Oct 2025', actionEn: 'e-SCN request raised via e-Note & Nothi by Audit section.', actionBn: 'অডিট বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '05 Nov 2025', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন।' }, { date: '10 Nov 2025', actionEn: 'e-SCN SCN-2025-0212 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2025-0212 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '11 Dec 2025', actionEn: 'No response received. Case forwarded to Adjudication.', actionBn: 'কোনো জবাব পাওয়া যায়নি। মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।' }, { date: '20 Dec 2025', actionEn: 'e-Adjudication Order issued. Interim Order not pursued by Bonder within prescribed time.', actionBn: 'ই-বিচারিক আদেশ জারি করা হয়েছে। নির্ধারিত সময়ের মধ্যে বন্ডকারী অন্তর্বর্তীকালীন আদেশের জন্য আবেদন করেননি।' }, { date: '02 Jan 2026', actionEn: 'e-Demand Notice DN-2025-0212 issued for ৳4,86,000 (duty, fine, VAT).', actionBn: 'শুল্ক, জরিমানা, ভ্যাটসহ ৳৪,৮৬,০০০ পরিমাণের জন্য ই-ডিমান্ড নোটিশ DN-2025-0212 জারি করা হয়েছে।' }]
}, {
  id: 'LC-2026-050',
  licenseNo: 'BL-2023-02998',
  sourceModule: 'prevention',
  requestNote: 'Discrepancy in machinery import declaration identified by Prevention.',
  stage: 'appellate-commissionerate',
  scnNo: 'SCN-2025-0188',
  scnIssueDate: '02 Sep 2025',
  responseDeadline: '02 Oct 2025',
  writFiled: false,
  bonderResponse: 'Response deemed unsatisfactory by CBC.',
  adjudicationNote: 'Unsatisfactory response. Adjudication Order issued.',
  demandNoticeNo: 'DN-2025-0188',
  demandNoticeAmount: 312000,
  history: [{ date: '15 Aug 2025', actionEn: 'e-SCN request raised via e-Note & Nothi by Prevention section.', actionBn: 'প্রিভেনশন বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '20 Aug 2025', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন।' }, { date: '02 Sep 2025', actionEn: 'e-SCN SCN-2025-0188 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2025-0188 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '01 Oct 2025', actionEn: 'Bonder responded; response deemed unsatisfactory. Case forwarded to Adjudication.', actionBn: 'বন্ডকারী জবাব দিয়েছেন; জবাব অসন্তোষজনক বিবেচিত হয়েছে। মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।' }, { date: '15 Oct 2025', actionEn: 'e-Adjudication Order issued.', actionBn: 'ই-বিচারিক আদেশ জারি করা হয়েছে।' }, { date: '25 Oct 2025', actionEn: 'e-Demand Notice DN-2025-0188 issued for ৳3,12,000.', actionBn: '৳৩,১২,০০০ পরিমাণের জন্য ই-ডিমান্ড নোটিশ DN-2025-0188 জারি করা হয়েছে।' }, { date: '05 Nov 2025', actionEn: 'Bonder filed for re-evaluation at Appellate Commissionerate. CBC officials notified.', actionBn: 'বন্ডকারী আপিল কমিশনারেটে পুনর্মূল্যায়নের জন্য আবেদন করেছেন। সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।' }]
}, {
  id: 'LC-2026-040',
  licenseNo: 'BL-2021-00934',
  sourceModule: 'audit',
  requestNote: 'Persistent non-compliance with pending legal case history.',
  stage: 'high-court',
  scnNo: 'SCN-2025-0140',
  scnIssueDate: '10 May 2025',
  responseDeadline: '10 Jun 2025',
  writFiled: false,
  bonderResponse: 'Response deemed unsatisfactory by CBC.',
  adjudicationNote: 'Unsatisfactory response. Adjudication Order issued.',
  demandNoticeNo: 'DN-2025-0140',
  demandNoticeAmount: 915000,
  appellateCommissionerateVerdict: 'uphold',
  statutoryPaymentDone: true,
  hardshipGranted: false,
  history: [{ date: '20 Apr 2025', actionEn: 'e-SCN request raised via e-Note & Nothi by Audit section.', actionBn: 'অডিট বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '25 Apr 2025', actionEn: 'AC/DC approved the SCN request and generated e-SCN.', actionBn: 'এসি/ডিসি এসসিএন অনুরোধ অনুমোদন করেছেন।' }, { date: '10 May 2025', actionEn: 'e-SCN SCN-2025-0140 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2025-0140 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '15 Jun 2025', actionEn: 'Response deemed unsatisfactory. Case forwarded to Adjudication.', actionBn: 'জবাব অসন্তোষজনক বিবেচিত হয়েছে। মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।' }, { date: '01 Jul 2025', actionEn: 'e-Adjudication Order issued.', actionBn: 'ই-বিচারিক আদেশ জারি করা হয়েছে।' }, { date: '15 Jul 2025', actionEn: 'e-Demand Notice DN-2025-0140 issued for ৳9,15,000.', actionBn: '৳৯,১৫,০০০ পরিমাণের জন্য ই-ডিমান্ড নোটিশ DN-2025-0140 জারি করা হয়েছে।' }, { date: '01 Aug 2025', actionEn: 'Bonder pursued Appellate Commissionerate.', actionBn: 'বন্ডকারী আপিল কমিশনারেটে আবেদন করেছেন।' }, { date: '20 Aug 2025', actionEn: 'Appellate Commissionerate verdict: uphold current Demand Notice. Bonder notified to pay.', actionBn: 'আপিল কমিশনারেটের রায়: বর্তমান ডিমান্ড নোটিশ বহাল। বন্ডকারীকে পরিশোধের জন্য অবহিত করা হয়েছে।' }, { date: '05 Sep 2025', actionEn: 'Bonder pursued High Court for re-evaluation. Notified to make statutory payment prior to hearing.', actionBn: 'বন্ডকারী পুনর্মূল্যায়নের জন্য হাইকোর্টে আবেদন করেছেন। শুনানির পূর্বে সংবিধিবদ্ধ পেমেন্টের জন্য অবহিত করা হয়েছে।' }, { date: '12 Sep 2025', actionEn: 'Bonder paid statutory duty (10% cash + 10% treasury chalan) electronically.', actionBn: 'বন্ডকারী ইলেকট্রনিকভাবে সংবিধিবদ্ধ শুল্ক পরিশোধ করেছেন (১০% নগদ + ১০% ট্রেজারি চালান)।' }]
}, {
  id: 'LC-2026-030',
  licenseNo: 'BL-2019-00456',
  sourceModule: 'prevention',
  requestNote: 'Suspected mislabeling of finished goods HS code.',
  stage: 'closed-favor-bonder',
  closureFlavor: 'high-court-release',
  scnNo: 'SCN-2025-0066',
  scnIssueDate: '12 Feb 2025',
  responseDeadline: '12 Mar 2025',
  writFiled: false,
  bonderResponse: 'Response deemed unsatisfactory by CBC.',
  adjudicationNote: 'Unsatisfactory response. Adjudication Order issued.',
  demandNoticeNo: 'DN-2025-0066',
  demandNoticeAmount: 227000,
  appellateCommissionerateVerdict: 'uphold',
  statutoryPaymentDone: true,
  highCourtVerdict: 'nullify',
  history: [{ date: '20 Jan 2025', actionEn: 'e-SCN request raised via e-Note & Nothi by Prevention section.', actionBn: 'প্রিভেনশন বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '05 Feb 2025', actionEn: 'e-SCN SCN-2025-0066 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2025-0066 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '15 Mar 2025', actionEn: 'e-Demand Notice DN-2025-0066 issued for ৳2,27,000 following Adjudication.', actionBn: 'বিচারিক সিদ্ধান্তের পর ৳২,২৭,০০০ পরিমাণের জন্য ই-ডিমান্ড নোটিশ DN-2025-0066 জারি করা হয়েছে।' }, { date: '02 Apr 2025', actionEn: 'Appellate Commissionerate upheld the Demand Notice.', actionBn: 'আপিল কমিশনারেট ডিমান্ড নোটিশ বহাল রেখেছেন।' }, { date: '20 Apr 2025', actionEn: 'Bonder paid statutory duty and pursued High Court.', actionBn: 'বন্ডকারী সংবিধিবদ্ধ শুল্ক পরিশোধ করে হাইকোর্টে আবেদন করেছেন।' }, { date: '30 Jun 2025', actionEn: 'High Court verdict: nullify the Demand Notice. e-Release Certificate issued to Bonder. Audit Management updated.', actionBn: 'হাইকোর্টের রায়: ডিমান্ড নোটিশ বাতিল। বন্ডকারীকে ই-রিলিজ সার্টিফিকেট ইস্যু করা হয়েছে। অডিট ব্যবস্থাপনা আপডেট করা হয়েছে।' }]
}, {
  id: 'LC-2026-020',
  licenseNo: 'BL-2022-01876',
  sourceModule: 'audit',
  requestNote: 'Ideal usage variance beyond configured threshold flagged during audit.',
  stage: 'closed-favor-cbc',
  scnNo: 'SCN-2025-0033',
  scnIssueDate: '08 Jan 2025',
  responseDeadline: '08 Feb 2025',
  writFiled: false,
  bonderResponse: 'No response received within the prescribed time.',
  adjudicationNote: 'No response. Adjudication Order issued.',
  demandNoticeNo: 'DN-2025-0033',
  demandNoticeAmount: 154000,
  history: [{ date: '20 Dec 2024', actionEn: 'e-SCN request raised via e-Note & Nothi by Audit section.', actionBn: 'অডিট বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '08 Jan 2025', actionEn: 'e-SCN SCN-2025-0033 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2025-0033 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '09 Feb 2025', actionEn: 'No response received. Case forwarded to Adjudication.', actionBn: 'কোনো জবাব পাওয়া যায়নি। মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।' }, { date: '20 Feb 2025', actionEn: 'e-Demand Notice DN-2025-0033 issued for ৳1,54,000.', actionBn: '৳১,৫৪,০০০ পরিমাণের জন্য ই-ডিমান্ড নোটিশ DN-2025-0033 জারি করা হয়েছে।' }, { date: '10 Mar 2025', actionEn: 'Bonder paid the full Demand Note amount electronically via e-Chalan. Case closed and e-Release Certificate auto-generated.', actionBn: 'বন্ডকারী ই-চালানের মাধ্যমে সম্পূর্ণ ডিমান্ড নোট পরিমাণ ইলেকট্রনিকভাবে পরিশোধ করেছেন। মামলাটি বন্ধ করা হয়েছে এবং ই-রিলিজ সার্টিফিকেট স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।' }]
}, {
  id: 'LC-2026-010',
  licenseNo: 'BL-2018-00098',
  sourceModule: 'prevention',
  requestNote: 'Confirmed diversion of bonded machinery outside authorized premises.',
  stage: 'bin-locked',
  scnNo: 'SCN-2024-0410',
  scnIssueDate: '05 Sep 2024',
  responseDeadline: '05 Oct 2024',
  writFiled: false,
  bonderResponse: 'No response received within the prescribed time.',
  adjudicationNote: 'No response. Adjudication Order issued.',
  demandNoticeNo: 'DN-2024-0410',
  demandNoticeAmount: 690000,
  history: [{ date: '15 Aug 2024', actionEn: 'e-SCN request raised via e-Note & Nothi by Prevention section.', actionBn: 'প্রিভেনশন বিভাগ কর্তৃক ই-এসসিএন অনুরোধ উত্থাপিত।' }, { date: '05 Sep 2024', actionEn: 'e-SCN SCN-2024-0410 issued to Bonder.', actionBn: 'ই-এসসিএন SCN-2024-0410 বন্ডকারীকে ইস্যু করা হয়েছে।' }, { date: '06 Oct 2024', actionEn: 'No response received. Case forwarded to Adjudication.', actionBn: 'কোনো জবাব পাওয়া যায়নি। মামলাটি বিচারিক সিদ্ধান্তের জন্য পাঠানো হয়েছে।' }, { date: '20 Oct 2024', actionEn: 'e-Demand Notice DN-2024-0410 issued for ৳6,90,000.', actionBn: '৳৬,৯০,০০০ পরিমাণের জন্য ই-ডিমান্ড নোটিশ DN-2024-0410 জারি করা হয়েছে।' }, { date: '25 Nov 2024', actionEn: 'No response to Demand Notice received within prescribed time. BIN locked in ASYCUDA via integration. License status changed to Suspended. Bonder and CBC officials notified.', actionBn: 'নির্ধারিত সময়ের মধ্যে ডিমান্ড নোটিশের কোনো জবাব পাওয়া যায়নি। ইন্টিগ্রেশনের মাধ্যমে অ্যাসাইকুডায় বিআইএন লক করা হয়েছে। লাইসেন্স স্ট্যাটাস স্থগিত করা হয়েছে। বন্ডকারী ও সিবিসি কর্মকর্তাদের অবহিত করা হয়েছে।' }]
}];
