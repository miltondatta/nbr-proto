import { bondLicenses } from './bondLicenseData';
import { coefficientDbArchive } from './coefficientData';
import { udRecords } from './udData';

export type BondingRisk = 'high' | 'standard';
export type LedgerSource = 'be-import' | 'inter-bond-transfer' | 'local-purchase-vat' | 'local-purchase-manual';
export type ExporterType = 'direct' | 'deemed';
export type CrossCheckStatus = 'matched' | 'discrepancy';

export interface InventoryHsLine {
  hsCode: string;
  descEn: string;
  descBn: string;
  type: 'raw-material' | 'finished-goods';
  risk: BondingRisk;
  bondingPeriodMonths: number;
  unit: string;
}

export interface InventoryProfile {
  licenseNo: string;
  createdDate: string;
  lines: InventoryHsLine[];
}

export interface LedgerEntry {
  id: string;
  licenseNo: string;
  hsCode: string;
  date: string;
  source: LedgerSource;
  qtyChange: number;
  unit: string;
  unitCostUsd?: number;
  reference: string;
  note?: string;
}

export interface IdealUsageLine {
  hsCode: string;
  descEn: string;
  descBn: string;
  idealQty: number;
  unit: string;
}

export interface IdealUsageRecord {
  id: string;
  licenseNo: string;
  egmNo: string;
  exportDate: string;
  exporterType: ExporterType;
  finishedGoodsHsCode: string;
  finishedGoodsDescEn: string;
  finishedGoodsDescBn: string;
  finishedGoodsQtyDozen: number;
  linkedUdNo?: string;
  linkedUpId?: string;
  calculated: boolean;
  idealUsageLines: IdealUsageLine[];
}

export interface ComparisonLine {
  hsCode: string;
  descEn: string;
  descBn: string;
  physicalQty: number;
  systemQty: number;
  unit: string;
}

export interface ComparisonRecord {
  id: string;
  licenseNo: string;
  inspectionDate: string;
  inspectionType: 'audit' | 'inspection';
  lines: ComparisonLine[];
}

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export function coefficientMatchFor(hsCode: string) {
  return coefficientDbArchive.find(e => e.finishedGoodsHsCode === hsCode);
}

export function udRecordFor(udNo?: string) {
  if (!udNo) return undefined;
  return udRecords.find(u => u.udNo === udNo);
}

export const sourceLabels: Record<LedgerSource, { en: string; bn: string; color: string }> = {
  'be-import': { en: 'B/E Import (ASYCUDA)', bn: 'বি/ই আমদানি (অ্যাসাইকুডা)', color: '#0A4D8C' },
  'inter-bond-transfer': { en: 'Inter-Bond Transfer', bn: 'আন্তঃ-বন্ড স্থানান্তর', color: '#1E88E5' },
  'local-purchase-vat': { en: 'Local Purchase (VAT Chalan)', bn: 'স্থানীয় ক্রয় (ভ্যাট চালান)', color: '#00A86B' },
  'local-purchase-manual': { en: 'Local Purchase (Manual ARO/RO Entry)', bn: 'স্থানীয় ক্রয় (ম্যানুয়াল আরও/এআরও এন্ট্রি)', color: '#B45309' }
};

export const inventoryProfiles: InventoryProfile[] = [{
  licenseNo: 'BL-2026-04521',
  createdDate: '16 Jan 2026',
  lines: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric', descBn: 'নিটেড তুলা কাপড়', type: 'raw-material', risk: 'standard', bondingPeriodMonths: 18, unit: 'kg' }, { hsCode: '5401.10.00', descEn: 'Sewing Thread, Synthetic', descBn: 'সেলাই সুতা, কৃত্রিম', type: 'raw-material', risk: 'standard', bondingPeriodMonths: 18, unit: 'kg' }, { hsCode: '6109.10.00', descEn: "Men's Knit Cotton T-Shirt", descBn: 'পুরুষদের নিটেড তুলা টি-শার্ট', type: 'finished-goods', risk: 'standard', bondingPeriodMonths: 18, unit: 'dozen' }]
}, {
  licenseNo: 'BL-2023-02871',
  createdDate: '21 Jun 2023',
  lines: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', type: 'raw-material', risk: 'high', bondingPeriodMonths: 6, unit: 'kg' }, { hsCode: '6110.20.00', descEn: 'Knitted Cotton Sweater', descBn: 'নিটেড তুলা সোয়েটার', type: 'finished-goods', risk: 'standard', bondingPeriodMonths: 18, unit: 'dozen' }]
}, {
  licenseNo: 'BL-2022-01876',
  createdDate: '05 May 2022',
  lines: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton', descBn: 'ডেনিম কাপড়, তুলা', type: 'raw-material', risk: 'high', bondingPeriodMonths: 6, unit: 'kg' }, { hsCode: '9606.22.00', descEn: 'Rivets and Buttons, Metal', descBn: 'রিভেট ও বোতাম, ধাতু', type: 'raw-material', risk: 'standard', bondingPeriodMonths: 18, unit: 'pcs' }, { hsCode: '6204.62.00', descEn: "Women's Denim Jeans", descBn: 'মহিলাদের ডেনিম জিন্স', type: 'finished-goods', risk: 'standard', bondingPeriodMonths: 18, unit: 'dozen' }]
}];

export const ledgerEntries: LedgerEntry[] = [{
  id: 'LED-2026-0801',
  licenseNo: 'BL-2026-04521',
  hsCode: '6006.22.00',
  date: '20 Feb 2026',
  source: 'be-import',
  qtyChange: 62000,
  unit: 'kg',
  unitCostUsd: 2.1,
  reference: 'B/E-2026-118820'
}, {
  id: 'LED-2026-0812',
  licenseNo: 'BL-2026-04521',
  hsCode: '5401.10.00',
  date: '22 Feb 2026',
  source: 'be-import',
  qtyChange: 3100,
  unit: 'kg',
  unitCostUsd: 5.4,
  reference: 'B/E-2026-118904'
}, {
  id: 'LED-2026-0850',
  licenseNo: 'BL-2026-04521',
  hsCode: '6006.22.00',
  date: '10 Apr 2026',
  source: 'local-purchase-vat',
  qtyChange: 4200,
  unit: 'kg',
  unitCostUsd: 2.3,
  reference: 'VAT-CHALAN-773421'
}, {
  id: 'LED-2026-0862',
  licenseNo: 'BL-2026-04521',
  hsCode: '5401.10.00',
  date: '02 Jun 2026',
  source: 'local-purchase-manual',
  qtyChange: 400,
  unit: 'kg',
  unitCostUsd: 5.6,
  reference: 'MANUAL-ARO-00231',
  note: 'Emergency top-up purchase entered manually by ARO pending VAT Chalan sync.'
}, {
  id: 'LED-2026-0710',
  licenseNo: 'BL-2023-02871',
  hsCode: '5509.53.00',
  date: '05 Feb 2026',
  source: 'be-import',
  qtyChange: 28000,
  unit: 'kg',
  unitCostUsd: 3.2,
  reference: 'B/E-2026-102240'
}, {
  id: 'LED-2026-0745',
  licenseNo: 'BL-2023-02871',
  hsCode: '5509.53.00',
  date: '18 May 2026',
  source: 'inter-bond-transfer',
  qtyChange: -2200,
  unit: 'kg',
  reference: 'IBT-2026-00087',
  note: 'Transferred out to BL-2020-00512 per approved Inter-Bond Transfer request.'
}, {
  id: 'LED-2026-0611',
  licenseNo: 'BL-2022-01876',
  hsCode: '5209.42.00',
  date: '15 Mar 2026',
  source: 'be-import',
  qtyChange: 71000,
  unit: 'kg',
  unitCostUsd: 4.8,
  reference: 'B/E-2026-096650'
}, {
  id: 'LED-2026-0633',
  licenseNo: 'BL-2022-01876',
  hsCode: '9606.22.00',
  date: '16 Mar 2026',
  source: 'be-import',
  qtyChange: 1800000,
  unit: 'pcs',
  unitCostUsd: 0.01,
  reference: 'B/E-2026-096651'
}, {
  id: 'LED-2026-0670',
  licenseNo: 'BL-2022-01876',
  hsCode: '5209.42.00',
  date: '30 Jun 2026',
  source: 'inter-bond-transfer',
  qtyChange: 5000,
  unit: 'kg',
  reference: 'IBT-2026-00104',
  note: 'Transferred in from BL-2019-00456 per approved Inter-Bond Transfer request.'
}];

export const idealUsageRecords: IdealUsageRecord[] = [{
  id: 'IU-2026-0301',
  licenseNo: 'BL-2026-04521',
  egmNo: 'EGM-2026-55210',
  exportDate: '15 Jun 2026',
  exporterType: 'direct',
  finishedGoodsHsCode: '6109.10.00',
  finishedGoodsDescEn: "Men's Knit Cotton T-Shirt",
  finishedGoodsDescBn: 'পুরুষদের নিটেড তুলা টি-শার্ট',
  finishedGoodsQtyDozen: 18000,
  calculated: true,
  idealUsageLines: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric', descBn: 'নিটেড তুলা কাপড়', idealQty: 3240, unit: 'kg' }, { hsCode: '5401.10.00', descEn: 'Sewing Thread, Synthetic', descBn: 'সেলাই সুতা, কৃত্রিম', idealQty: 144, unit: 'kg' }]
}, {
  id: 'IU-2026-0318',
  licenseNo: 'BL-2026-04521',
  egmNo: 'EGM-2026-56390',
  exportDate: '10 Jul 2026',
  exporterType: 'direct',
  finishedGoodsHsCode: '6109.10.00',
  finishedGoodsDescEn: "Men's Knit Cotton T-Shirt",
  finishedGoodsDescBn: 'পুরুষদের নিটেড তুলা টি-শার্ট',
  finishedGoodsQtyDozen: 12000,
  calculated: false,
  idealUsageLines: []
}, {
  id: 'IU-2026-0244',
  licenseNo: 'BL-2023-02871',
  egmNo: 'EGM-2026-49810',
  exportDate: '02 May 2026',
  exporterType: 'deemed',
  finishedGoodsHsCode: '6110.20.00',
  finishedGoodsDescEn: 'Knitted Cotton Sweater',
  finishedGoodsDescBn: 'নিটেড তুলা সোয়েটার',
  finishedGoodsQtyDozen: 8500,
  linkedUdNo: 'UD-84471',
  linkedUpId: 'UP-91004',
  calculated: true,
  idealUsageLines: [{ hsCode: '5509.53.00', descEn: 'Cotton Blended Yarn', descBn: 'তুলা মিশ্রিত সুতা', idealQty: 3570, unit: 'kg' }]
}, {
  id: 'IU-2026-0190',
  licenseNo: 'BL-2022-01876',
  egmNo: 'EGM-2026-41120',
  exportDate: '20 Mar 2026',
  exporterType: 'direct',
  finishedGoodsHsCode: '6204.62.00',
  finishedGoodsDescEn: "Women's Denim Jeans",
  finishedGoodsDescBn: 'মহিলাদের ডেনিম জিন্স',
  finishedGoodsQtyDozen: 9600,
  calculated: true,
  idealUsageLines: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton', descBn: 'ডেনিম কাপড়, তুলা', idealQty: 15360, unit: 'kg' }, { hsCode: '9606.22.00', descEn: 'Rivets and Buttons, Metal', descBn: 'রিভেট ও বোতাম, ধাতু', idealQty: 576000, unit: 'pcs' }]
}];

export const comparisonRecords: ComparisonRecord[] = [{
  id: 'CMP-2026-014',
  licenseNo: 'BL-2026-04521',
  inspectionDate: '05 Jul 2026',
  inspectionType: 'inspection',
  lines: [{ hsCode: '6006.22.00', descEn: 'Knitted Cotton Fabric', descBn: 'নিটেড তুলা কাপড়', physicalQty: 62500, systemQty: 62960, unit: 'kg' }, { hsCode: '5401.10.00', descEn: 'Sewing Thread, Synthetic', descBn: 'সেলাই সুতা, কৃত্রিম', physicalQty: 3350, systemQty: 3356, unit: 'kg' }]
}, {
  id: 'CMP-2026-009',
  licenseNo: 'BL-2022-01876',
  inspectionDate: '22 Mar 2026',
  inspectionType: 'audit',
  lines: [{ hsCode: '5209.42.00', descEn: 'Denim Fabric, Cotton', descBn: 'ডেনিম কাপড়, তুলা', physicalQty: 52400, systemQty: 60640, unit: 'kg' }, { hsCode: '9606.22.00', descEn: 'Rivets and Buttons, Metal', descBn: 'রিভেট ও বোতাম, ধাতু', physicalQty: 1224000, systemQty: 1224000, unit: 'pcs' }]
}];
