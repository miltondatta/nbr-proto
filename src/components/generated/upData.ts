import { bondLicenses } from './bondLicenseData';
import { udRecords } from './udData';
import { coefficientDbArchive } from './coefficientData';

export type UpStage = 'submitted' | 'assignment' | 'verification' | 'usage-validation' | 'reverted' | 'pending-approval' | 'approved' | 'disapproved';
export type UpRoute = 'adc-jc' | 'ac-dc';

export interface UpRawMaterialLine {
  hsCode: string;
  descEn: string;
  descBn: string;
  requestedQty: number;
  unit: string;
  systemCalculatedQty?: number;
  approvedQty?: number;
}

export interface UpApplication {
  id: string;
  licenseNo: string;
  submittedAt: string;
  basedOnUd: boolean;
  udNo?: string;
  trustedBuyer: boolean;
  finishedGoodsHsCode: string;
  finishedGoodsDescEn: string;
  finishedGoodsDescBn: string;
  finishedGoodsQtyDozen: number;
  rawMaterials: UpRawMaterialLine[];
  upValueTaka: number;
  thresholdPct: number;
  stage: UpStage;
  assignedOfficer?: { en: string; bn: string };
  verificationNote?: string;
  comparisonVariancePct?: number;
  route?: UpRoute;
  revertNote?: string;
  approvalNote?: string;
  rejectionReason?: string;
  upIssueDate?: string;
}

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export const officerPool = [{
  en: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
  bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)',
  zoneKeyword: 'Dhaka'
}, {
  en: 'Sharmin Akter (ARO, Gazipur Zone)',
  bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)',
  zoneKeyword: 'Gazipur'
}, {
  en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)',
  bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)',
  zoneKeyword: 'Chattogram'
}];

export function autoAssignOfficer(district: string) {
  return officerPool.find(o => district.includes(o.zoneKeyword)) ?? officerPool[0];
}

export function coefficientMatchFor(hsCode: string) {
  return coefficientDbArchive.find(e => e.finishedGoodsHsCode === hsCode);
}

export function udRecordFor(udNo?: string) {
  if (!udNo) return undefined;
  return udRecords.find(u => u.udNo === udNo);
}

export const stageLabels: Record<UpStage, { en: string; bn: string }> = {
  submitted: { en: 'Submitted', bn: 'দাখিলকৃত' },
  assignment: { en: 'ARO/RO Auto-Assignment', bn: 'আরও/এআরও স্বয়ংক্রিয় বরাদ্দ' },
  verification: { en: 'Application Verification', bn: 'আবেদন যাচাইকরণ' },
  'usage-validation': { en: 'Usage Validation', bn: 'ব্যবহার যাচাইকরণ' },
  reverted: { en: 'Reverted to Bonder', bn: 'বন্ডকারীর কাছে ফেরত' },
  'pending-approval': { en: 'Pending Approval', bn: 'অনুমোদনের অপেক্ষায়' },
  approved: { en: 'Approved & e-UP Issued', bn: 'অনুমোদিত ও ই-ইউপি ইস্যুকৃত' },
  disapproved: { en: 'Disapproved', bn: 'অননুমোদিত' }
};

export const upApplications: UpApplication[] = [{
  id: 'UP-2026-0512',
  licenseNo: 'BL-2026-04521',
  submittedAt: '25 Jul 2026',
  basedOnUd: true,
  udNo: 'UD-88342',
  trustedBuyer: false,
  finishedGoodsHsCode: '6109.10.00',
  finishedGoodsDescEn: "Men's Knit Cotton T-Shirt",
  finishedGoodsDescBn: 'পুরুষদের নিটেড তুলা টি-শার্ট',
  finishedGoodsQtyDozen: 48000,
  rawMaterials: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric', descBn: 'নিটেড তুলা কাপড়', requestedQty: 9200, unit: 'kg' }],
  upValueTaka: 62000,
  thresholdPct: 10,
  stage: 'submitted'
}, {
  id: 'UP-2026-0498',
  licenseNo: 'BL-2021-00934',
  submittedAt: '22 Jul 2026',
  basedOnUd: false,
  trustedBuyer: false,
  finishedGoodsHsCode: '6203.42.00',
  finishedGoodsDescEn: "Men's Woven Cotton Trousers",
  finishedGoodsDescBn: 'পুরুষদের বোনা তুলা ট্রাউজার',
  finishedGoodsQtyDozen: 22300,
  rawMaterials: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', requestedQty: 31200, unit: 'kg' }],
  upValueTaka: 94000,
  thresholdPct: 10,
  stage: 'assignment'
}, {
  id: 'UP-2026-0480',
  licenseNo: 'BL-2023-02871',
  submittedAt: '18 Jul 2026',
  basedOnUd: false,
  trustedBuyer: false,
  finishedGoodsHsCode: '6111.20.00',
  finishedGoodsDescEn: 'Knitted Cotton Baby Garments',
  finishedGoodsDescBn: 'নিটেড তুলা শিশু পোশাক',
  finishedGoodsQtyDozen: 15600,
  rawMaterials: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', requestedQty: 6800, unit: 'kg' }],
  upValueTaka: 71000,
  thresholdPct: 10,
  stage: 'verification',
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' }
}, {
  id: 'UP-2026-0465',
  licenseNo: 'BL-2020-00512',
  submittedAt: '14 Jul 2026',
  basedOnUd: false,
  trustedBuyer: true,
  finishedGoodsHsCode: '6110.20.00',
  finishedGoodsDescEn: 'Knitted Cotton Sweater',
  finishedGoodsDescBn: 'নিটেড তুলা সোয়েটার',
  finishedGoodsQtyDozen: 61200,
  rawMaterials: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', requestedQty: 25700, unit: 'kg' }],
  upValueTaka: 88000,
  thresholdPct: 10,
  stage: 'usage-validation',
  assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  verificationNote: 'Bonder compliant, audit current, license valid. No manual discrepancy flagged.'
}, {
  id: 'UP-2026-0450',
  licenseNo: 'BL-2023-02998',
  submittedAt: '08 Jul 2026',
  basedOnUd: false,
  trustedBuyer: false,
  finishedGoodsHsCode: '6205.20.00',
  finishedGoodsDescEn: "Men's Woven Cotton Shirt",
  finishedGoodsDescBn: 'পুরুষদের বোনা তুলা শার্ট',
  finishedGoodsQtyDozen: 31000,
  rawMaterials: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', requestedQty: 30500, unit: 'kg' }, { hsCode: '9606.21.00', descEn: 'Buttons, Plastic', descBn: 'বোতাম, প্লাস্টিক', requestedQty: 2700000, unit: 'pcs' }],
  upValueTaka: 76000,
  thresholdPct: 10,
  stage: 'usage-validation',
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  verificationNote: 'Bonder compliant, audit current, license valid.'
}, {
  id: 'UP-2026-0433',
  licenseNo: 'BL-2022-01655',
  submittedAt: '28 Jun 2026',
  basedOnUd: false,
  trustedBuyer: false,
  finishedGoodsHsCode: '6203.42.00',
  finishedGoodsDescEn: "Men's Woven Cotton Trousers",
  finishedGoodsDescBn: 'পুরুষদের বোনা তুলা ট্রাউজার',
  finishedGoodsQtyDozen: 27600,
  rawMaterials: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', requestedQty: 52000, unit: 'kg', systemCalculatedQty: 37260 }, { hsCode: '9606.22.00', descEn: 'Buttons, Metal', descBn: 'বোতাম, ধাতু', requestedQty: 1500000, unit: 'pcs', systemCalculatedQty: 1324800 }],
  upValueTaka: 118000,
  thresholdPct: 10,
  stage: 'reverted',
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  verificationNote: 'Bonder compliant, audit current, license valid.',
  comparisonVariancePct: 39.5,
  revertNote: 'Requested raw material quantity for HS 5208.52.00 exceeds the system-calculated co-efficient requirement by 39.5%, above the 10% threshold. Bonder must correct and resubmit the requested quantity.'
}, {
  id: 'UP-2026-0410',
  licenseNo: 'BL-2024-03398',
  submittedAt: '15 Jun 2026',
  basedOnUd: true,
  udNo: 'UD-90188',
  trustedBuyer: false,
  finishedGoodsHsCode: '6110.30.00',
  finishedGoodsDescEn: 'Knitted Synthetic Hooded Sweatshirt',
  finishedGoodsDescBn: 'নিটেড কৃত্রিম হুডেড সোয়েটশার্ট',
  finishedGoodsQtyDozen: 15800,
  rawMaterials: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', requestedQty: 6640, unit: 'kg', systemCalculatedQty: 6636 }],
  upValueTaka: 94500,
  thresholdPct: 10,
  stage: 'pending-approval',
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  verificationNote: 'Bonder compliant, audit current, license valid. UD cross-check matched.',
  comparisonVariancePct: 0.06,
  route: 'adc-jc'
}, {
  id: 'UP-2026-0398',
  licenseNo: 'BL-2023-02998',
  submittedAt: '02 Jun 2026',
  basedOnUd: false,
  trustedBuyer: true,
  finishedGoodsHsCode: '6205.20.00',
  finishedGoodsDescEn: "Men's Woven Cotton Shirt",
  finishedGoodsDescBn: 'পুরুষদের বোনা তুলা শার্ট',
  finishedGoodsQtyDozen: 9800,
  rawMaterials: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', requestedQty: 9300, unit: 'kg' }],
  upValueTaka: 41000,
  thresholdPct: 10,
  stage: 'pending-approval',
  assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
  verificationNote: 'Bonder compliant, audit current, license valid. Trusted buyer order — finished goods auto-validated.',
  route: 'ac-dc'
}, {
  id: 'UP-2026-0350',
  licenseNo: 'BL-2019-00456',
  submittedAt: '10 Mar 2026',
  basedOnUd: false,
  trustedBuyer: false,
  finishedGoodsHsCode: '6006.22.00',
  finishedGoodsDescEn: 'Knitted Cotton Fabric, Dyed',
  finishedGoodsDescBn: 'নিটেড তুলা কাপড়, রঙিন',
  finishedGoodsQtyDozen: 8200,
  rawMaterials: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', requestedQty: 3400, unit: 'kg', systemCalculatedQty: 3380, approvedQty: 3400 }],
  upValueTaka: 68000,
  thresholdPct: 10,
  stage: 'approved',
  assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' },
  verificationNote: 'Bonder compliant, audit current, license valid.',
  comparisonVariancePct: 0.6,
  route: 'ac-dc',
  approvalNote: 'Approved as requested — variance within tolerance.',
  upIssueDate: '14 Mar 2026'
}, {
  id: 'UP-2026-0299',
  licenseNo: 'BL-2022-01876',
  submittedAt: '20 Jan 2026',
  basedOnUd: true,
  udNo: 'UD-80456',
  trustedBuyer: false,
  finishedGoodsHsCode: '6204.62.00',
  finishedGoodsDescEn: "Women's Denim Jeans",
  finishedGoodsDescBn: 'মহিলাদের ডেনিম জিন্স',
  finishedGoodsQtyDozen: 27600,
  rawMaterials: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton', descBn: 'ডেনিম কাপড়, তুলা', requestedQty: 61000, unit: 'kg', systemCalculatedQty: 44160 }],
  upValueTaka: 132000,
  thresholdPct: 10,
  stage: 'disapproved',
  assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
  verificationNote: 'Bonder compliant, audit current, license valid.',
  comparisonVariancePct: 38.1,
  route: 'adc-jc',
  rejectionReason: 'Corrected application still shows unexplained variance against UD-linked finished goods declaration. Applicant must reapply with revised production documentation.'
}];
