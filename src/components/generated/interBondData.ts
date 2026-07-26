import { bondLicenses } from './bondLicenseData';
import { lienBanks } from './lienBankData';

export type TransferItemType = 'raw-material' | 'machinery';
export type TransferStage = 'submitted' | 'assignment' | 'risk-bond-consent' | 'ro-verification' | 'lien-bank-verification' | 'inspection-formation' | 'inspection-scheduled' | 'inspection-report' | 'final-review' | 'approved' | 'disapproved';
export type PrcStatus = 'not-due' | 'pending' | 'verified' | 'failed';

export interface TransferItem {
  hsCode: string;
  descEn: string;
  descBn: string;
  qty: string;
}

export interface InspectionScore {
  id: string;
  score: number;
}

export interface InterBondTransfer {
  id: string;
  fromLicenseNo: string;
  toLicenseNo: string;
  itemType: TransferItemType;
  items: TransferItem[];
  submittedAt: string;
  stage: TransferStage;
  assignedOfficer?: { en: string; bn: string };
  riskBondFromConsent: boolean;
  riskBondToConsent: boolean;
  roNote?: string;
  additionalDocsRequested?: boolean;
  additionalDocsProvided?: boolean;
  lienBankCode?: string;
  lienBankVerified?: boolean;
  inspectionTeam?: string[];
  inspectionDate?: string;
  inspectionScores?: InspectionScore[];
  noncomplianceItems?: string[];
  finalDecisionNote?: string;
  disapprovalReason?: string;
  transferApprovalLetterNo?: string;
  prcStatus?: PrcStatus;
}

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export function lienBankOf(bankCode?: string) {
  if (!bankCode) return undefined;
  return lienBanks.find(b => b.bankCode === bankCode);
}

export const officerPool = [{
  en: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
  bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)'
}, {
  en: 'Sharmin Akter (ARO, Gazipur Zone)',
  bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)'
}, {
  en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)',
  bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)'
}];

export const stageLabels: Record<TransferStage, { en: string; bn: string }> = {
  submitted: { en: 'Submitted', bn: 'দাখিলকৃত' },
  assignment: { en: 'ARO/RO Assignment', bn: 'আরও/এআরও বরাদ্দ' },
  'risk-bond-consent': { en: 'e-Risk Bond Consent', bn: 'ই-রিস্ক বন্ড সম্মতি' },
  'ro-verification': { en: 'RO/ARO Verification', bn: 'আরও/এআরও যাচাইকরণ' },
  'lien-bank-verification': { en: 'Lien Bank Verification', bn: 'লিয়েন ব্যাংক যাচাইকরণ' },
  'inspection-formation': { en: 'Inspection Team Formation', bn: 'পরিদর্শন দল গঠন' },
  'inspection-scheduled': { en: 'Inspection Scheduled', bn: 'পরিদর্শন নির্ধারিত' },
  'inspection-report': { en: 'Inspection Report', bn: 'পরিদর্শন প্রতিবেদন' },
  'final-review': { en: 'Final Review (ADC/JC)', bn: 'চূড়ান্ত পর্যালোচনা (এডিসি/জেসি)' },
  approved: { en: 'Approved — Transfer Letter Issued', bn: 'অনুমোদিত — ট্রান্সফার লেটার ইস্যুকৃত' },
  disapproved: { en: 'Disapproved', bn: 'অননুমোদিত' }
};

export const inspectionCriteriaDefs = [{
  id: 'itemCondition',
  en: 'Physical Condition of Transferred Items',
  bn: 'স্থানান্তরিত সামগ্রীর ভৌত অবস্থা',
  weight: 3
}, {
  id: 'quantityMatch',
  en: 'Declared vs Physical Quantity Match',
  bn: 'ঘোষিত বনাম ভৌত পরিমাণের মিল',
  weight: 3
}, {
  id: 'storageCompliance',
  en: 'Storage/Warehouse Compliance at Receiving Bonder',
  bn: 'গ্রহণকারী বন্ডকারীর গুদাম সম্মতি',
  weight: 2
}, {
  id: 'documentationAccuracy',
  en: 'Documentation Accuracy',
  bn: 'নথির সঠিকতা',
  weight: 2
}];

export const interBondTransfers: InterBondTransfer[] = [{
  id: 'IBT-2026-0801',
  fromLicenseNo: 'BL-2023-02871',
  toLicenseNo: 'BL-2020-00512',
  itemType: 'raw-material',
  items: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', qty: '2,200 kg' }],
  submittedAt: '25 Jul 2026',
  stage: 'submitted',
  riskBondFromConsent: false,
  riskBondToConsent: false
}, {
  id: 'IBT-2026-0788',
  fromLicenseNo: 'BL-2022-01655',
  toLicenseNo: 'BL-2019-00456',
  itemType: 'raw-material',
  items: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', qty: '5,000 kg' }],
  submittedAt: '18 Jul 2026',
  stage: 'assignment',
  riskBondFromConsent: false,
  riskBondToConsent: false
}, {
  id: 'IBT-2026-0770',
  fromLicenseNo: 'BL-2024-03398',
  toLicenseNo: 'BL-2023-02998',
  itemType: 'machinery',
  items: [{ hsCode: '8452.21.00', descEn: 'Automatic Sewing Machine Unit', descBn: 'স্বয়ংক্রিয় সেলাই মেশিন ইউনিট', qty: '6 units' }],
  submittedAt: '10 Jul 2026',
  stage: 'risk-bond-consent',
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: false
}, {
  id: 'IBT-2026-0755',
  fromLicenseNo: 'BL-2021-01204',
  toLicenseNo: 'BL-2022-01876',
  itemType: 'raw-material',
  items: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton', descBn: 'ডেনিম কাপড়, তুলা', qty: '9,600 kg' }],
  submittedAt: '02 Jul 2026',
  stage: 'ro-verification',
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true
}, {
  id: 'IBT-2026-0730',
  fromLicenseNo: 'BL-2020-00743',
  toLicenseNo: 'BL-2026-04521',
  itemType: 'raw-material',
  items: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric', descBn: 'নিটেড তুলা কাপড়', qty: '3,400 kg' }],
  submittedAt: '20 Jun 2026',
  stage: 'lien-bank-verification',
  assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  roNote: 'Documents examined; both bonders in good standing. No additional documents required.',
  lienBankCode: 'SBL',
  lienBankVerified: false
}, {
  id: 'IBT-2026-0699',
  fromLicenseNo: 'BL-2019-00287',
  toLicenseNo: 'BL-2024-03650',
  itemType: 'machinery',
  items: [{ hsCode: '8447.11.00', descEn: 'Circular Knitting Machine', descBn: 'বৃত্তাকার নিটিং মেশিন', qty: '2 units' }],
  submittedAt: '05 Jun 2026',
  stage: 'inspection-formation',
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  roNote: 'Verified successfully; forwarded for physical inspection prior to transfer.',
  lienBankCode: 'SCB',
  lienBankVerified: true
}, {
  id: 'IBT-2026-0650',
  fromLicenseNo: 'BL-2023-02871',
  toLicenseNo: 'BL-2021-00934',
  itemType: 'raw-material',
  items: [{ hsCode: '5402.47.00', descEn: 'Synthetic Filament Yarn', descBn: 'কৃত্রিম ফিলামেন্ট সুতা', qty: '4,800 kg' }],
  submittedAt: '15 May 2026',
  stage: 'inspection-scheduled',
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  lienBankCode: 'EBL',
  lienBankVerified: true,
  inspectionTeam: ['Md. Faridul Islam (RO, Dhaka Zone-2)', 'Sharmin Akter (ARO, Gazipur Zone)'],
  inspectionDate: '05 Aug 2026'
}, {
  id: 'IBT-2026-0602',
  fromLicenseNo: 'BL-2022-01876',
  toLicenseNo: 'BL-2019-00456',
  itemType: 'raw-material',
  items: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton', descBn: 'ডেনিম কাপড়, তুলা', qty: '6,200 kg' }],
  submittedAt: '10 Apr 2026',
  stage: 'final-review',
  assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  lienBankCode: 'DBBL',
  lienBankVerified: true,
  inspectionTeam: ['Kamruzzaman Bhuiyan (RO, Chattogram Zone)'],
  inspectionDate: '02 May 2026',
  inspectionScores: [{ id: 'itemCondition', score: 8 }, { id: 'quantityMatch', score: 9 }, { id: 'storageCompliance', score: 8 }, { id: 'documentationAccuracy', score: 7 }]
}, {
  id: 'IBT-2026-0540',
  fromLicenseNo: 'BL-2020-00512',
  toLicenseNo: 'BL-2023-02998',
  itemType: 'raw-material',
  items: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', qty: '3,100 kg' }],
  submittedAt: '02 Mar 2026',
  stage: 'approved',
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  lienBankCode: 'SBL',
  lienBankVerified: true,
  inspectionTeam: ['Md. Faridul Islam (RO, Dhaka Zone-2)', 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)'],
  inspectionDate: '18 Mar 2026',
  inspectionScores: [{ id: 'itemCondition', score: 9 }, { id: 'quantityMatch', score: 9 }, { id: 'storageCompliance', score: 8 }, { id: 'documentationAccuracy', score: 8 }],
  finalDecisionNote: 'All documentation and inspection findings satisfactory. Approved for transfer.',
  transferApprovalLetterNo: 'TAL-2026-0540',
  prcStatus: 'pending'
}, {
  id: 'IBT-2026-0480',
  fromLicenseNo: 'BL-2018-00098',
  toLicenseNo: 'BL-2021-01204',
  itemType: 'machinery',
  items: [{ hsCode: '8451.40.00', descEn: 'Dyeing, Washing or Finishing Machine', descBn: 'ডাইং, ওয়াশিং বা ফিনিশিং মেশিন', qty: '1 unit' }],
  submittedAt: '10 Jan 2026',
  stage: 'approved',
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  lienBankCode: 'EBL',
  lienBankVerified: true,
  inspectionTeam: ['Sharmin Akter (ARO, Gazipur Zone)'],
  inspectionDate: '25 Jan 2026',
  inspectionScores: [{ id: 'itemCondition', score: 8 }, { id: 'quantityMatch', score: 10 }, { id: 'storageCompliance', score: 9 }, { id: 'documentationAccuracy', score: 9 }],
  finalDecisionNote: 'Machinery transfer approved — no PRC requirement applicable.',
  transferApprovalLetterNo: 'TAL-2026-0480'
}, {
  id: 'IBT-2026-0420',
  fromLicenseNo: 'BL-2019-00287',
  toLicenseNo: 'BL-2018-00098',
  itemType: 'raw-material',
  items: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric', descBn: 'নিটেড তুলা কাপড়', qty: '2,900 kg' }],
  submittedAt: '15 Nov 2025',
  stage: 'disapproved',
  assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  lienBankCode: 'SCB',
  lienBankVerified: true,
  inspectionTeam: ['Kamruzzaman Bhuiyan (RO, Chattogram Zone)'],
  inspectionDate: '01 Dec 2025',
  inspectionScores: [{ id: 'itemCondition', score: 4 }, { id: 'quantityMatch', score: 3 }, { id: 'storageCompliance', score: 6 }, { id: 'documentationAccuracy', score: 5 }],
  noncomplianceItems: ['itemCondition', 'quantityMatch'],
  disapprovalReason: 'Physical inspection found significant quantity mismatch and degraded item condition inconsistent with declared transfer value.'
}];
