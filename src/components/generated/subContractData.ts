import { bondLicenses } from './bondLicenseData';

export type SubContractStage = 'submitted' | 'bepza-approval' | 'assignment' | 'risk-bond-consent' | 'ro-verification' | 'lien-bank-verification' | 'final-review' | 'approved' | 'disapproved';

export interface SubContractItem {
  hsCode: string;
  descEn: string;
  descBn: string;
  qty: string;
}

export interface SubContractApplication {
  id: string;
  fromLicenseNo: string;
  toLicenseNo: string;
  items: SubContractItem[];
  submittedAt: string;
  stage: SubContractStage;
  bepzaApprovalNo?: string;
  bepzaCompletionDurationDays?: number;
  assignedOfficer?: { en: string; bn: string };
  riskBondFromConsent: boolean;
  riskBondToConsent: boolean;
  roNote?: string;
  additionalDocsRequested?: boolean;
  additionalDocsProvided?: boolean;
  lienBankCode?: string;
  lienBankVerified?: boolean;
  finalDecisionNote?: string;
  disapprovalReason?: string;
  riskBondNo?: string;
  approvalLetterNo?: string;
  bondRegisterUpdated?: boolean;
}

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
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

export const stageLabels: Record<SubContractStage, { en: string; bn: string }> = {
  submitted: { en: 'Submitted', bn: 'দাখিলকৃত' },
  'bepza-approval': { en: 'e-BEPZA Approval', bn: 'ই-বেপজা অনুমোদন' },
  assignment: { en: 'ARO/RO Assignment', bn: 'আরও/এআরও বরাদ্দ' },
  'risk-bond-consent': { en: 'e-Risk Bond Consent', bn: 'ই-রিস্ক বন্ড সম্মতি' },
  'ro-verification': { en: 'RO/ARO Verification', bn: 'আরও/এআরও যাচাইকরণ' },
  'lien-bank-verification': { en: 'Lien Bank Verification', bn: 'লিয়েন ব্যাংক যাচাইকরণ' },
  'final-review': { en: 'Final Review (ADC/JC)', bn: 'চূড়ান্ত পর্যালোচনা (এডিসি/জেসি)' },
  approved: { en: 'Approved — Risk Bond & Letter Issued', bn: 'অনুমোদিত — রিস্ক বন্ড ও পত্র ইস্যুকৃত' },
  disapproved: { en: 'Disapproved', bn: 'অননুমোদিত' }
};

export const subContractApplications: SubContractApplication[] = [{
  id: 'SC-2026-0301',
  fromLicenseNo: 'BL-2026-04521',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '6109.10.00', descEn: "Men's Knit Cotton T-Shirt (cut panels)", descBn: 'পুরুষদের নিটেড তুলা টি-শার্ট (কাট প্যানেল)', qty: '12,000 dozen' }],
  submittedAt: '25 Jul 2026',
  stage: 'submitted',
  riskBondFromConsent: false,
  riskBondToConsent: false
}, {
  id: 'SC-2026-0288',
  fromLicenseNo: 'BL-2023-02871',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '6110.20.00', descEn: 'Knitted Cotton Sweater (assembly)', descBn: 'নিটেড তুলা সোয়েটার (এসেম্বলি)', qty: '4,500 dozen' }],
  submittedAt: '18 Jul 2026',
  stage: 'bepza-approval',
  riskBondFromConsent: false,
  riskBondToConsent: false
}, {
  id: 'SC-2026-0270',
  fromLicenseNo: 'BL-2022-01655',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '6203.42.00', descEn: "Men's Woven Cotton Trousers (finishing)", descBn: 'পুরুষদের বোনা তুলা ট্রাউজার (ফিনিশিং)', qty: '7,800 dozen' }],
  submittedAt: '10 Jul 2026',
  stage: 'assignment',
  bepzaApprovalNo: 'BEPZA-2026-1187',
  bepzaCompletionDurationDays: 90,
  riskBondFromConsent: false,
  riskBondToConsent: false
}, {
  id: 'SC-2026-0255',
  fromLicenseNo: 'BL-2024-03398',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '6110.30.00', descEn: 'Knitted Synthetic Hooded Sweatshirt (embroidery)', descBn: 'নিটেড কৃত্রিম হুডেড সোয়েটশার্ট (এমব্রয়ডারি)', qty: '6,200 dozen' }],
  submittedAt: '02 Jul 2026',
  stage: 'risk-bond-consent',
  bepzaApprovalNo: 'BEPZA-2026-1160',
  bepzaCompletionDurationDays: 120,
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: false
}, {
  id: 'SC-2026-0230',
  fromLicenseNo: 'BL-2021-01204',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '6204.62.00', descEn: "Women's Denim Jeans (washing)", descBn: 'মহিলাদের ডেনিম জিন্স (ওয়াশিং)', qty: '5,400 dozen' }],
  submittedAt: '20 Jun 2026',
  stage: 'ro-verification',
  bepzaApprovalNo: 'BEPZA-2026-1132',
  bepzaCompletionDurationDays: 90,
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true
}, {
  id: 'SC-2026-0198',
  fromLicenseNo: 'BL-2020-00743',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '6205.20.00', descEn: "Men's Woven Cotton Shirt (buttoning)", descBn: 'পুরুষদের বোনা তুলা শার্ট (বোতাম লাগানো)', qty: '9,100 dozen' }],
  submittedAt: '05 Jun 2026',
  stage: 'lien-bank-verification',
  bepzaApprovalNo: 'BEPZA-2026-1098',
  bepzaCompletionDurationDays: 90,
  assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  roNote: 'Documents examined; both bonders in good standing. Receiving Bonder (EPZ enterprise) audit status compliant.',
  lienBankCode: 'SBL',
  lienBankVerified: false
}, {
  id: 'SC-2026-0165',
  fromLicenseNo: 'BL-2019-00456',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric (dyeing sub-process)', descBn: 'নিটেড তুলা কাপড় (ডাইং সাব-প্রসেস)', qty: '18,000 kg' }],
  submittedAt: '15 May 2026',
  stage: 'final-review',
  bepzaApprovalNo: 'BEPZA-2026-1054',
  bepzaCompletionDurationDays: 60,
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  roNote: 'Verified successfully; forwarded to ADC/JC with complete documentation.',
  lienBankCode: 'EBL',
  lienBankVerified: true
}, {
  id: 'SC-2026-0120',
  fromLicenseNo: 'BL-2023-02998',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric (printing sub-process)', descBn: 'বোনা তুলা কাপড় (প্রিন্টিং সাব-প্রসেস)', qty: '14,500 kg' }],
  submittedAt: '10 Mar 2026',
  stage: 'approved',
  bepzaApprovalNo: 'BEPZA-2026-0987',
  bepzaCompletionDurationDays: 90,
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  roNote: 'Verified successfully; forwarded to ADC/JC with complete documentation.',
  lienBankCode: 'DBBL',
  lienBankVerified: true,
  finalDecisionNote: 'All documentation satisfactory. Approved for sub-contract processing within BEPZA-approved duration.',
  riskBondNo: 'RB-2026-0120',
  approvalLetterNo: 'SCAL-2026-0120',
  bondRegisterUpdated: true
}, {
  id: 'SC-2026-0080',
  fromLicenseNo: 'BL-2022-01876',
  toLicenseNo: 'BL-2018-00098',
  items: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton (finishing sub-process)', descBn: 'ডেনিম কাপড়, তুলা (ফিনিশিং সাব-প্রসেস)', qty: '11,200 kg' }],
  submittedAt: '20 Jan 2026',
  stage: 'disapproved',
  bepzaApprovalNo: 'BEPZA-2026-0890',
  bepzaCompletionDurationDays: 60,
  assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  riskBondFromConsent: true,
  riskBondToConsent: true,
  roNote: 'Discrepancy found in declared vs. licensed processing capacity at receiving Bonder.',
  lienBankCode: 'SCB',
  lienBankVerified: true,
  disapprovalReason: 'Receiving Bonder’s licensed processing capacity insufficient to support the declared sub-contract volume within the BEPZA-approved duration.'
}];
