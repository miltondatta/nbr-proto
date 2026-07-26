import { bondLicenses } from './bondLicenseData';

export type ProviderVerification = 'pending' | 'verified' | 'suspended';
export type PaymentSetup = 'pending' | 'configured';

export interface Specialist {
  name: string;
  email: string;
  phone: string;
}

export interface CoefficientProvider {
  id: string;
  nameEn: string;
  nameBn: string;
  isDedo: boolean;
  addressEn: string;
  addressBn: string;
  phone: string;
  email: string;
  branches: string[];
  specialists: Specialist[];
  specialtyEn: string[];
  specialtyBn: string[];
  verification: ProviderVerification;
  paymentSetup: PaymentSetup;
}

export type RequestStage = 'submitted' | 'dedo-selection' | 'dedo-validating' | 'outsource-response' | 'bonder-selection' | 'dedo-consent' | 'provider-payment' | 'provider-validating' | 'dedo-final-approval' | 'approved' | 'rejected';

export interface RawMaterialLine {
  hsCode: string;
  descEn: string;
  descBn: string;
  perUnitQty: string;
}

export interface CoefficientItem {
  finishedGoodsHsCode: string;
  finishedGoodsDescEn: string;
  finishedGoodsDescBn: string;
  rawMaterials: RawMaterialLine[];
}

export interface ProviderResponse {
  providerId: string;
  responded: boolean;
  quoteUsd?: number;
  etaDays?: number;
  noResponseExplanation?: string;
}

export interface ValidationRequest {
  id: string;
  licenseNo: string;
  submittedAt: string;
  dbMatchAvailable: boolean;
  item: CoefficientItem;
  stage: RequestStage;
  path?: 'db-match' | 'dedo-direct' | 'outsourced';
  slaDays: number;
  outsourcedTo?: string[];
  responses?: ProviderResponse[];
  selectedProviderId?: string;
  inspectionNote?: string;
  rejectionReason?: string;
}

export interface CoefficientDbEntry {
  id: string;
  finishedGoodsHsCode: string;
  finishedGoodsDescEn: string;
  finishedGoodsDescBn: string;
  rawMaterials: RawMaterialLine[];
  providerName: string;
  licenseNo: string;
  approvedDate: string;
}

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export const stageLabels: Record<RequestStage, { en: string; bn: string }> = {
  submitted: { en: 'Submitted (e-Application / e-Search)', bn: 'দাখিলকৃত (ই-আবেদন / ই-সার্চ)' },
  'dedo-selection': { en: 'DEDO Application Selection', bn: 'ডিইডিও আবেদন নির্বাচন' },
  'dedo-validating': { en: 'DEDO Validation', bn: 'ডিইডিও যাচাইকরণ' },
  'outsource-response': { en: 'Outsourced Provider Response', bn: 'আউটসোর্সড প্রোভাইডার সাড়া' },
  'bonder-selection': { en: 'Bonder Provider Selection', bn: 'বন্ডকারীর প্রোভাইডার নির্বাচন' },
  'dedo-consent': { en: 'DEDO Consent', bn: 'ডিইডিও সম্মতি' },
  'provider-payment': { en: 'Provider Payment', bn: 'প্রোভাইডার পেমেন্ট' },
  'provider-validating': { en: 'Provider Validation', bn: 'প্রোভাইডার যাচাইকরণ' },
  'dedo-final-approval': { en: 'DEDO Final Approval', bn: 'ডিইডিও চূড়ান্ত অনুমোদন' },
  approved: { en: 'Approved & Archived', bn: 'অনুমোদিত ও সংরক্ষিত' },
  rejected: { en: 'Rejected', bn: 'প্রত্যাখ্যাত' }
};

export const providers: CoefficientProvider[] = [{
  id: 'DEDO',
  nameEn: 'DEDO (Designated Entity for Determining Output)',
  nameBn: 'ডিইডিও (আউটপুট নির্ধারণকারী মনোনীত সংস্থা)',
  isDedo: true,
  addressEn: 'Bangladesh Standards and Testing Institution Complex, Tejgaon, Dhaka',
  addressBn: 'বাংলাদেশ স্ট্যান্ডার্ডস অ্যান্ড টেস্টিং ইনস্টিটিউশন কমপ্লেক্স, তেজগাঁও, ঢাকা',
  phone: '+880 2-8870021',
  email: 'coefficient@dedo.gov.bd',
  branches: [],
  specialists: [{ name: 'Dr. Nasreen Sultana', email: 'nasreen.sultana@dedo.gov.bd', phone: '+880 1711-000111' }, { name: 'Md. Abul Kashem', email: 'abul.kashem@dedo.gov.bd', phone: '+880 1711-000222' }],
  specialtyEn: ['All Textile & Apparel Categories'],
  specialtyBn: ['সকল টেক্সটাইল ও পোশাক বিভাগ'],
  verification: 'verified',
  paymentSetup: 'configured'
}, {
  id: 'PROV-001',
  nameEn: 'BUTEX Consulting & Testing Services',
  nameBn: 'বুটেক্স কনসালটিং অ্যান্ড টেস্টিং সার্ভিসেস',
  isDedo: false,
  addressEn: 'Bangladesh University of Textiles, Tejgaon, Dhaka',
  addressBn: 'বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয়, তেজগাঁও, ঢাকা',
  phone: '+880 1811-223344',
  email: 'consulting@butex.edu.bd',
  branches: ['Chattogram Liaison Office'],
  specialists: [{ name: 'Prof. Dr. Ismail Hossain', email: 'ismail.hossain@butex.edu.bd', phone: '+880 1811-556677' }],
  specialtyEn: ['Woven Fabric Processing', 'Denim & Garment Washing'],
  specialtyBn: ['বোনা কাপড় প্রক্রিয়াকরণ', 'ডেনিম ও গার্মেন্ট ওয়াশিং'],
  verification: 'verified',
  paymentSetup: 'configured'
}, {
  id: 'PROV-002',
  nameEn: 'Apparel Tech Solutions Ltd.',
  nameBn: 'অ্যাপারেল টেক সলিউশনস লিমিটেড',
  isDedo: false,
  addressEn: 'House 14, Road 7, Gulshan-1, Dhaka',
  addressBn: 'বাড়ি ১৪, রোড ৭, গুলশান-১, ঢাকা',
  phone: '+880 1812-334455',
  email: 'info@appareltechbd.com',
  branches: ['Gazipur Lab', 'Chattogram Lab'],
  specialists: [{ name: 'Farhana Yasmin', email: 'farhana@appareltechbd.com', phone: '+880 1812-667788' }, { name: 'Rezaul Karim', email: 'rezaul@appareltechbd.com', phone: '+880 1812-778899' }],
  specialtyEn: ['Knitwear Finishing', 'Garment Accessories'],
  specialtyBn: ['নিটওয়্যার ফিনিশিং', 'গার্মেন্ট আনুষাঙ্গিক'],
  verification: 'verified',
  paymentSetup: 'pending'
}, {
  id: 'PROV-003',
  nameEn: 'Textile Quality Assurance BD',
  nameBn: 'টেক্সটাইল কোয়ালিটি অ্যাসুরেন্স বিডি',
  isDedo: false,
  addressEn: 'Plot 22, Sector 7, Uttara, Dhaka',
  addressBn: 'প্লট ২২, সেক্টর ৭, উত্তরা, ঢাকা',
  phone: '+880 1813-445566',
  email: 'contact@tqabd.com',
  branches: [],
  specialists: [{ name: 'Shahidul Alam', email: 'shahidul@tqabd.com', phone: '+880 1813-889900' }],
  specialtyEn: ['Yarn & Fiber Testing'],
  specialtyBn: ['সুতা ও ফাইবার পরীক্ষা'],
  verification: 'pending',
  paymentSetup: 'pending'
}, {
  id: 'PROV-004',
  nameEn: 'Delta Compliance & Coefficient Labs',
  nameBn: 'ডেল্টা কমপ্লায়েন্স অ্যান্ড কো-এফিসিয়েন্ট ল্যাবস',
  isDedo: false,
  addressEn: 'CDA Avenue, Agrabad, Chattogram',
  addressBn: 'সিডিএ এভিনিউ, আগ্রাবাদ, চট্টগ্রাম',
  phone: '+880 1814-556677',
  email: 'labs@deltacompliance.com.bd',
  branches: ['Narayanganj Branch'],
  specialists: [{ name: 'Nazmul Haque', email: 'nazmul@deltacompliance.com.bd', phone: '+880 1814-990011' }],
  specialtyEn: ['Denim Processing', 'Dyeing & Chemical Usage'],
  specialtyBn: ['ডেনিম প্রক্রিয়াকরণ', 'ডাইং ও রাসায়নিক ব্যবহার'],
  verification: 'verified',
  paymentSetup: 'configured'
}];

export const coefficientDbArchive: CoefficientDbEntry[] = [{
  id: 'CDB-1042',
  finishedGoodsHsCode: '6109.10.00',
  finishedGoodsDescEn: "Men's Knit Cotton T-Shirt",
  finishedGoodsDescBn: 'পুরুষদের নিটেড তুলা টি-শার্ট',
  rawMaterials: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric', descBn: 'নিটেড তুলা কাপড়', perUnitQty: '0.18 kg/dozen' }, { hsCode: '5401.10.00', descEn: 'Sewing Thread, Synthetic', descBn: 'সেলাই সুতা, কৃত্রিম', perUnitQty: '0.008 kg/dozen' }],
  providerName: 'DEDO',
  licenseNo: 'BL-2026-04521',
  approvedDate: '20 Feb 2026'
}, {
  id: 'CDB-0988',
  finishedGoodsHsCode: '6203.42.00',
  finishedGoodsDescEn: "Men's Woven Cotton Trousers",
  finishedGoodsDescBn: 'পুরুষদের বোনা তুলা ট্রাউজার',
  rawMaterials: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', perUnitQty: '1.35 kg/dozen' }, { hsCode: '9606.22.00', descEn: 'Buttons, Metal', descBn: 'বোতাম, ধাতু', perUnitQty: '48 pcs/dozen' }],
  providerName: 'BUTEX Consulting & Testing Services',
  licenseNo: 'BL-2022-01655',
  approvedDate: '11 Apr 2026'
}, {
  id: 'CDB-0871',
  finishedGoodsHsCode: '6204.62.00',
  finishedGoodsDescEn: "Women's Denim Jeans",
  finishedGoodsDescBn: 'মহিলাদের ডেনিম জিন্স',
  rawMaterials: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton', descBn: 'ডেনিম কাপড়, তুলা', perUnitQty: '1.6 kg/dozen' }, { hsCode: '9606.22.00', descEn: 'Rivets and Buttons, Metal', descBn: 'রিভেট ও বোতাম, ধাতু', perUnitQty: '60 pcs/dozen' }],
  providerName: 'Delta Compliance & Coefficient Labs',
  licenseNo: 'BL-2022-01876',
  approvedDate: '02 May 2025'
}, {
  id: 'CDB-0765',
  finishedGoodsHsCode: '6110.20.00',
  finishedGoodsDescEn: 'Knitted Cotton Sweater',
  finishedGoodsDescBn: 'নিটেড তুলা সোয়েটার',
  rawMaterials: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', perUnitQty: '0.42 kg/dozen' }],
  providerName: 'Apparel Tech Solutions Ltd.',
  licenseNo: 'BL-2020-00512',
  approvedDate: '28 Jan 2026'
}, {
  id: 'CDB-0654',
  finishedGoodsHsCode: '6205.20.00',
  finishedGoodsDescEn: "Men's Woven Cotton Shirt",
  finishedGoodsDescBn: 'পুরুষদের বোনা তুলা শার্ট',
  rawMaterials: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', perUnitQty: '0.95 kg/dozen' }, { hsCode: '9606.21.00', descEn: 'Buttons, Plastic', descBn: 'বোতাম, প্লাস্টিক', perUnitQty: '84 pcs/dozen' }],
  providerName: 'DEDO',
  licenseNo: 'BL-2023-02998',
  approvedDate: '15 Mar 2026'
}];

export const validationRequests: ValidationRequest[] = [{
  id: 'REQ-CE-2026-041',
  licenseNo: 'BL-2026-04521',
  submittedAt: '24 Jul 2026',
  dbMatchAvailable: true,
  item: { finishedGoodsHsCode: '6109.10.00', finishedGoodsDescEn: "Men's Knit Cotton T-Shirt", finishedGoodsDescBn: 'পুরুষদের নিটেড তুলা টি-শার্ট', rawMaterials: [] },
  stage: 'submitted',
  slaDays: 5
}, {
  id: 'REQ-CE-2026-038',
  licenseNo: 'BL-2021-00934',
  submittedAt: '18 Jul 2026',
  dbMatchAvailable: false,
  item: { finishedGoodsHsCode: '6206.30.00', finishedGoodsDescEn: "Women's Woven Cotton Blouse", finishedGoodsDescBn: 'মহিলাদের বোনা তুলা ব্লাউজ', rawMaterials: [] },
  stage: 'dedo-selection',
  slaDays: 5
}, {
  id: 'REQ-CE-2026-035',
  licenseNo: 'BL-2023-02871',
  submittedAt: '10 Jul 2026',
  dbMatchAvailable: false,
  item: { finishedGoodsHsCode: '6111.20.00', finishedGoodsDescEn: 'Knitted Cotton Baby Garments', finishedGoodsDescBn: 'নিটেড তুলা শিশু পোশাক', rawMaterials: [] },
  stage: 'dedo-validating',
  path: 'dedo-direct',
  slaDays: 10
}, {
  id: 'REQ-CE-2026-030',
  licenseNo: 'BL-2022-01655',
  submittedAt: '02 Jul 2026',
  dbMatchAvailable: false,
  item: { finishedGoodsHsCode: '6203.43.00', finishedGoodsDescEn: "Men's Synthetic Woven Trousers", finishedGoodsDescBn: 'পুরুষদের কৃত্রিম বোনা ট্রাউজার', rawMaterials: [] },
  stage: 'outsource-response',
  path: 'outsourced',
  slaDays: 7,
  outsourcedTo: ['PROV-001', 'PROV-002'],
  responses: [{ providerId: 'PROV-001', responded: true, quoteUsd: 850, etaDays: 6 }, { providerId: 'PROV-002', responded: false }]
}, {
  id: 'REQ-CE-2026-027',
  licenseNo: 'BL-2024-03398',
  submittedAt: '22 Jun 2026',
  dbMatchAvailable: false,
  item: { finishedGoodsHsCode: '6110.30.00', finishedGoodsDescEn: 'Knitted Synthetic Hooded Sweatshirt', finishedGoodsDescBn: 'নিটেড কৃত্রিম হুডেড সোয়েটশার্ট', rawMaterials: [] },
  stage: 'bonder-selection',
  path: 'outsourced',
  slaDays: 3,
  outsourcedTo: ['PROV-002', 'PROV-004'],
  responses: [{ providerId: 'PROV-002', responded: true, quoteUsd: 620, etaDays: 5 }, { providerId: 'PROV-004', responded: true, quoteUsd: 700, etaDays: 4 }]
}, {
  id: 'REQ-CE-2026-022',
  licenseNo: 'BL-2020-00512',
  submittedAt: '05 Jun 2026',
  dbMatchAvailable: false,
  item: { finishedGoodsHsCode: '6110.20.00', finishedGoodsDescEn: 'Knitted Cotton Sweater', finishedGoodsDescBn: 'নিটেড তুলা সোয়েটার', rawMaterials: [] },
  stage: 'provider-validating',
  path: 'outsourced',
  slaDays: 8,
  outsourcedTo: ['PROV-001', 'PROV-004'],
  responses: [{ providerId: 'PROV-001', responded: true, quoteUsd: 900, etaDays: 8 }, { providerId: 'PROV-004', responded: false, noResponseExplanation: 'Lab fully booked through end of month.' }],
  selectedProviderId: 'PROV-001'
}, {
  id: 'REQ-CE-2026-015',
  licenseNo: 'BL-2023-02998',
  submittedAt: '20 Feb 2026',
  dbMatchAvailable: false,
  item: {
    finishedGoodsHsCode: '6205.20.00',
    finishedGoodsDescEn: "Men's Woven Cotton Shirt",
    finishedGoodsDescBn: 'পুরুষদের বোনা তুলা শার্ট',
    rawMaterials: [{ hsCode: '5208.52.00', descEn: 'Woven Cotton Fabric', descBn: 'বোনা তুলা কাপড়', perUnitQty: '0.95 kg/dozen' }, { hsCode: '9606.21.00', descEn: 'Buttons, Plastic', descBn: 'বোতাম, প্লাস্টিক', perUnitQty: '84 pcs/dozen' }]
  },
  stage: 'approved',
  path: 'dedo-direct',
  slaDays: 10
}, {
  id: 'REQ-CE-2026-009',
  licenseNo: 'BL-2019-00287',
  submittedAt: '12 Jan 2026',
  dbMatchAvailable: false,
  item: { finishedGoodsHsCode: '6201.93.00', finishedGoodsDescEn: 'Synthetic Woven Jacket', finishedGoodsDescBn: 'কৃত্রিম বোনা জ্যাকেট', rawMaterials: [] },
  stage: 'rejected',
  path: 'dedo-direct',
  slaDays: 10,
  rejectionReason: 'Discrepancy found during document verification: submitted machine capacity does not support claimed output volume for this HS code.'
}];
