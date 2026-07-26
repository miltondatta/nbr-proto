import { bondLicenses } from './bondLicenseData';

export type EntitlementTrigger = 'license-approval' | 'audit-approval' | 'inclusion-addition';
export type EntitlementStatus = 'active' | 'superseded';
export type InclusionStage = 'submitted' | 'assignment' | 'ro-verification' | 'commissioner-approval' | 'issued' | 'disapproved';

export interface EntitlementItem {
  hsCode: string;
  descriptionEn: string;
  descriptionBn: string;
  entitledQty: string;
}

export interface EntitlementRecord {
  id: string;
  licenseNo: string;
  trigger: EntitlementTrigger;
  issueDate: string;
  items: EntitlementItem[];
  totalValueUsd: number;
  calculationNote: string;
  commissionerOverride: boolean;
  overrideNote?: string;
  editWindowExpiry: string;
  status: EntitlementStatus;
}

export interface InclusionItem {
  hsCode: string;
  descriptionEn: string;
  descriptionBn: string;
  additionalQty: string;
  justificationEn: string;
  justificationBn: string;
}

export interface InclusionRequest {
  id: string;
  licenseNo: string;
  requestedAt: string;
  items: InclusionItem[];
  autoVerifiedNoteEn: string;
  autoVerifiedNoteBn: string;
  suggestedQtyNote: string;
  stage: InclusionStage;
  assignedOfficer?: { en: string; bn: string };
  eNote?: string;
  commissionerOverride?: boolean;
  overrideNote?: string;
  disapprovalReason?: string;
  issuedEntitlementId?: string;
}

export const triggerLabels: Record<EntitlementTrigger, { en: string; bn: string; color: string }> = {
  'license-approval': { en: 'Bond License Approval', bn: 'বন্ড লাইসেন্স অনুমোদন', color: '#0A4D8C' },
  'audit-approval': { en: 'Annual Audit Approval', bn: 'বার্ষিক নিরীক্ষা অনুমোদন', color: '#00A86B' },
  'inclusion-addition': { en: 'Inclusion / Addition Request', bn: 'অন্তর্ভুক্তি / সংযোজন অনুরোধ', color: '#1E88E5' }
};

export const inclusionStageLabels: Record<InclusionStage, { en: string; bn: string }> = {
  submitted: { en: 'Submitted', bn: 'দাখিলকৃত' },
  assignment: { en: 'Officer Assignment', bn: 'কর্মকর্তা বরাদ্দ' },
  'ro-verification': { en: 'RO/ARO Verification', bn: 'আরও/এআরও যাচাই' },
  'commissioner-approval': { en: 'Commissioner Approval', bn: 'কমিশনার অনুমোদন' },
  issued: { en: 'Entitlement Issued', bn: 'এনটাইটেলমেন্ট ইস্যুকৃত' },
  disapproved: { en: 'Disapproved', bn: 'অননুমোদিত' }
};

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export const entitlementRecords: EntitlementRecord[] = [
  {
    id: 'ENT-2026-0142',
    licenseNo: 'BL-2026-04521',
    trigger: 'license-approval',
    issueDate: '16 Jan 2026',
    items: [
      { hsCode: '5208.52.00', descriptionEn: 'Woven Cotton Fabric', descriptionBn: 'বোনা তুলা কাপড়', entitledQty: '186,000 kg' },
      { hsCode: '5401.10.00', descriptionEn: 'Sewing Thread of Synthetic Filaments', descriptionBn: 'কৃত্রিম ফিলামেন্টের সেলাই সুতা', entitledQty: '9,200 kg' }
    ],
    totalValueUsd: 512000,
    calculationNote: '30% of yearly machine capacity (620,000 kg equivalent) as per HS Code, pulled from Machinery Database.',
    commissionerOverride: false,
    editWindowExpiry: '15 Feb 2026',
    status: 'active'
  },
  {
    id: 'ENT-2025-0098',
    licenseNo: 'BL-2020-00512',
    trigger: 'audit-approval',
    issueDate: '05 Mar 2026',
    items: [
      { hsCode: '6006.22.00', descriptionEn: 'Knitted Cotton Fabric, Dyed', descriptionBn: 'নিটেড তুলা কাপড়, রঙিন', entitledQty: '412,000 kg' },
      { hsCode: '9606.21.00', descriptionEn: 'Buttons of Plastic', descriptionBn: 'প্লাস্টিকের বোতাম', entitledQty: '2,850,000 pcs' }
    ],
    totalValueUsd: 738000,
    calculationNote: "Last year's export usage (343,000 kg) + 20% buffer, minus 32,000 kg raw material already in stock. Validated by Annual Audit Module.",
    commissionerOverride: true,
    overrideNote: 'Adjusted upward by 6% to accommodate confirmed new buyer order (Commissioner note, 04 Mar 2026).',
    editWindowExpiry: '04 Apr 2026',
    status: 'active'
  },
  {
    id: 'ENT-2026-0203',
    licenseNo: 'BL-2023-02871',
    trigger: 'license-approval',
    issueDate: '02 Jul 2026',
    items: [
      { hsCode: '5402.47.00', descriptionEn: 'Synthetic Filament Yarn', descriptionBn: 'কৃত্রিম ফিলামেন্ট সুতা', entitledQty: '265,000 kg' }
    ],
    totalValueUsd: 398000,
    calculationNote: '30% of yearly machine capacity (883,000 kg equivalent) as per HS Code, pulled from Machinery Database.',
    commissionerOverride: false,
    editWindowExpiry: '01 Aug 2026',
    status: 'active'
  },
  {
    id: 'ENT-2025-0071',
    licenseNo: 'BL-2022-01876',
    trigger: 'audit-approval',
    issueDate: '18 Jun 2025',
    items: [
      { hsCode: '5209.42.00', descriptionEn: 'Denim Fabric, Cotton', descriptionBn: 'ডেনিম কাপড়, তুলা', entitledQty: '520,000 kg' },
      { hsCode: '9606.22.00', descriptionEn: 'Rivets and Buttons, Metal', descriptionBn: 'রিভেট ও বোতাম, ধাতু', entitledQty: '4,100,000 pcs' }
    ],
    totalValueUsd: 861000,
    calculationNote: "Last year's export usage (430,000 kg) + 20% buffer, minus 18,000 kg raw material already in stock. Validated by Annual Audit Module.",
    commissionerOverride: false,
    editWindowExpiry: '18 Jul 2025',
    status: 'superseded'
  }
];

export const inclusionRequests: InclusionRequest[] = [
  {
    id: 'INC-2026-0031',
    licenseNo: 'BL-2024-03398',
    requestedAt: '20 Jul 2026',
    items: [{
      hsCode: '6001.22.00',
      descriptionEn: 'Knitted Pile Fabric, Cotton',
      descriptionBn: 'নিটেড পাইল কাপড়, তুলা',
      additionalQty: '38,000 kg',
      justificationEn: 'Unplanned repeat order from EU buyer exceeding current entitlement balance.',
      justificationBn: 'ইইউ ক্রেতার কাছ থেকে অপরিকল্পিত পুনরাবৃত্তি অর্ডার, বর্তমান এনটাইটেলমেন্ট ব্যালেন্স অতিক্রম করেছে।'
    }],
    autoVerifiedNoteEn: 'Current-year usage of HS 6001.22.00 verified against e-Bond Register: 82% of entitlement consumed with 5 months remaining in the entitlement year.',
    autoVerifiedNoteBn: 'ই-বন্ড রেজিস্টারের বিপরীতে এইচএস ৬০০১.২২.০০-এর চলতি বছরের ব্যবহার যাচাই করা হয়েছে: এনটাইটেলমেন্ট বছরের বাকি ৫ মাসে ৮২% এনটাইটেলমেন্ট ব্যবহৃত হয়েছে।',
    suggestedQtyNote: 'System-suggested amount: average monthly usage (10,250 kg) × remaining 5 months, less current balance = 36,250 kg.',
    stage: 'commissioner-approval',
    assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
    eNote: 'Verified usage pattern against e-Bond Register and ASYCUDA export declarations — consistent with stated repeat order. Recommend approval of requested quantity.'
  },
  {
    id: 'INC-2026-0028',
    licenseNo: 'BL-2023-02998',
    requestedAt: '12 Jul 2026',
    items: [{
      hsCode: '5407.61.00',
      descriptionEn: 'Woven Fabric of Synthetic Filament Yarn',
      descriptionBn: 'কৃত্রিম ফিলামেন্ট সুতার বোনা কাপড়',
      additionalQty: '15,600 kg',
      justificationEn: 'Change in buyer specification requiring higher-GSM fabric than originally entitled.',
      justificationBn: 'ক্রেতার স্পেসিফিকেশন পরিবর্তনের কারণে মূল এনটাইটেলমেন্টের চেয়ে বেশি জিএসএম কাপড়ের প্রয়োজন।'
    }],
    autoVerifiedNoteEn: 'Current-year usage of HS 5407.61.00 verified against e-Bond Register: 91% of entitlement consumed with 6 months remaining in the entitlement year.',
    autoVerifiedNoteBn: 'ই-বন্ড রেজিস্টারের বিপরীতে এইচএস ৫৪০৭.৬১.০০-এর চলতি বছরের ব্যবহার যাচাই করা হয়েছে: এনটাইটেলমেন্ট বছরের বাকি ৬ মাসে ৯১% এনটাইটেলমেন্ট ব্যবহৃত হয়েছে।',
    suggestedQtyNote: 'System-suggested amount: average monthly usage (2,900 kg) × remaining 6 months, less current balance = 14,200 kg.',
    stage: 'ro-verification',
    assignedOfficer: { en: 'Md. Faridul Islam (RO, Dhaka Zone-2)', bn: 'মোঃ ফরিদুল ইসলাম (আরও, ঢাকা জোন-২)' }
  },
  {
    id: 'INC-2026-0019',
    licenseNo: 'BL-2021-01204',
    requestedAt: '30 Jun 2026',
    items: [{
      hsCode: '5402.52.00',
      descriptionEn: 'Textured Synthetic Filament Yarn',
      descriptionBn: 'টেক্সচার্ড কৃত্রিম ফিলামেন্ট সুতা',
      additionalQty: '9,400 kg',
      justificationEn: 'Additional yarn required for a rush shipment ahead of scheduled entitlement renewal.',
      justificationBn: 'নির্ধারিত এনটাইটেলমেন্ট নবায়নের আগে জরুরি চালানের জন্য অতিরিক্ত সুতার প্রয়োজন।'
    }],
    autoVerifiedNoteEn: 'Current-year usage of HS 5402.52.00 verified against e-Bond Register: 96% of entitlement consumed with 7 months remaining in the entitlement year.',
    autoVerifiedNoteBn: 'ই-বন্ড রেজিস্টারের বিপরীতে এইচএস ৫৪০২.৫২.০০-এর চলতি বছরের ব্যবহার যাচাই করা হয়েছে: এনটাইটেলমেন্ট বছরের বাকি ৭ মাসে ৯৬% এনটাইটেলমেন্ট ব্যবহৃত হয়েছে।',
    suggestedQtyNote: 'System-suggested amount: average monthly usage (1,340 kg) × remaining 7 months, less current balance = 8,780 kg.',
    stage: 'issued',
    assignedOfficer: { en: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)', bn: 'কামরুজ্জামান ভূঁইয়া (আরও, চট্টগ্রাম জোন)' },
    eNote: 'Usage pattern consistent with declared production schedule. Recommend approval.',
    commissionerOverride: false,
    issuedEntitlementId: 'ENT-2026-0217'
  },
  {
    id: 'INC-2026-0011',
    licenseNo: 'BL-2019-00456',
    requestedAt: '02 Jun 2026',
    items: [{
      hsCode: '5209.42.00',
      descriptionEn: 'Denim Fabric, Cotton',
      descriptionBn: 'ডেনিম কাপড়, তুলা',
      additionalQty: '52,000 kg',
      justificationEn: 'Speculative addition requested without a corresponding confirmed export order.',
      justificationBn: 'সংশ্লিষ্ট নিশ্চিত রপ্তানি অর্ডার ছাড়া অনুমানভিত্তিক সংযোজনের অনুরোধ।'
    }],
    autoVerifiedNoteEn: 'Current-year usage of HS 5209.42.00 verified against e-Bond Register: only 41% of existing entitlement consumed with 8 months remaining.',
    autoVerifiedNoteBn: 'ই-বন্ড রেজিস্টারের বিপরীতে এইচএস ৫২০৯.৪২.০০-এর চলতি বছরের ব্যবহার যাচাই করা হয়েছে: বাকি ৮ মাসে বিদ্যমান এনটাইটেলমেন্টের মাত্র ৪১% ব্যবহৃত হয়েছে।',
    suggestedQtyNote: 'System flag: requested quantity exceeds projected need based on current usage trend.',
    stage: 'disapproved',
    assignedOfficer: { en: 'Sharmin Akter (ARO, Gazipur Zone)', bn: 'শারমিন আক্তার (এআরও, গাজীপুর জোন)' },
    eNote: 'Usage trend does not support the requested addition at this time.',
    disapprovalReason: 'Existing entitlement balance is sufficient for the remainder of the year based on current consumption trend. Bonder may reapply if a confirmed export order materializes.'
  },
  {
    id: 'INC-2026-0035',
    licenseNo: 'BL-2025-04012',
    requestedAt: '24 Jul 2026',
    items: [{
      hsCode: '5402.47.00',
      descriptionEn: 'Synthetic Filament Yarn',
      descriptionBn: 'কৃত্রিম ফিলামেন্ট সুতা',
      additionalQty: '6,200 kg',
      justificationEn: 'Minor top-up requested to complete an in-progress production lot.',
      justificationBn: 'চলমান উৎপাদন লট সম্পন্ন করতে সামান্য টপ-আপের অনুরোধ।'
    }],
    autoVerifiedNoteEn: 'Current-year usage of HS 5402.47.00 verified against e-Bond Register: 88% of entitlement consumed with 5 months remaining in the entitlement year.',
    autoVerifiedNoteBn: 'ই-বন্ড রেজিস্টারের বিপরীতে এইচএস ৫৪০২.৪৭.০০-এর চলতি বছরের ব্যবহার যাচাই করা হয়েছে: এনটাইটেলমেন্ট বছরের বাকি ৫ মাসে ৮৮% এনটাইটেলমেন্ট ব্যবহৃত হয়েছে।',
    suggestedQtyNote: 'System-suggested amount: average monthly usage (1,050 kg) × remaining 5 months, less current balance = 5,850 kg.',
    stage: 'submitted'
  }
];
