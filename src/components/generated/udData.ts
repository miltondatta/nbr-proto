import { bondLicenses } from './bondLicenseData';

export type UdSource = 'bgmea' | 'bkmea';
export type UdSyncStatus = 'synced' | 'pending-sync' | 'sync-failed';
export type UdRecordStatus = 'active' | 'inactive';

export interface UdRecord {
  udNo: string;
  licenseNo: string;
  source: UdSource;
  issueDate: string;
  finishedGoods: string;
  exportQuantity: string;
  exportValueUsd: number;
  status: UdRecordStatus;
  syncStatus: UdSyncStatus;
  lastSyncedAt: string;
  amendmentCount: number;
}

export interface UdAmendment {
  amendmentNo: string;
  udNo: string;
  licenseNo: string;
  source: UdSource;
  amendmentDate: string;
  versionNo: number;
  changeSummary: string;
  changedFields: { field: string; before: string; after: string }[];
  syncStatus: UdSyncStatus;
  lastSyncedAt: string;
}

export const udSourceLabels: Record<UdSource, { en: string; bn: string }> = {
  bgmea: { en: 'BGMEA UD System', bn: 'বিজিএমইএ ইউডি সিস্টেম' },
  bkmea: { en: 'BKMEA UD System', bn: 'বিকেএমইএ ইউডি সিস্টেম' }
};

export const udSyncStatusLabels: Record<UdSyncStatus, { en: string; bn: string; color: string }> = {
  synced: { en: 'Synced', bn: 'সিঙ্ক সম্পন্ন', color: '#00A86B' },
  'pending-sync': { en: 'Pending Sync', bn: 'সিঙ্ক অপেক্ষমাণ', color: '#F59E0B' },
  'sync-failed': { en: 'Sync Failed', bn: 'সিঙ্ক ব্যর্থ', color: '#DC2626' }
};

export const udRecordStatusLabels: Record<UdRecordStatus, { en: string; bn: string; color: string }> = {
  active: { en: 'Active', bn: 'সক্রিয়' , color: '#00A86B' },
  inactive: { en: 'Inactive', bn: 'নিষ্ক্রিয়', color: '#94A3B8' }
};

function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export { licenseOf };

const baseUds: Omit<UdRecord, 'amendmentCount'>[] = [
  { udNo: 'UD-88342', licenseNo: 'BL-2026-04521', source: 'bgmea', issueDate: '02 Feb 2026', finishedGoods: "Men's Knit T-Shirts", exportQuantity: '48,000 dozen', exportValueUsd: 612000, status: 'active', syncStatus: 'synced', lastSyncedAt: '26 Jul 2026, 08:12' },
  { udNo: 'UD-79215', licenseNo: 'BL-2021-00934', source: 'bkmea', issueDate: '11 Jun 2025', finishedGoods: 'Denim Jackets', exportQuantity: '9,500 pcs', exportValueUsd: 284000, status: 'active', syncStatus: 'sync-failed', lastSyncedAt: '19 Jul 2026, 14:40' },
  { udNo: 'UD-84471', licenseNo: 'BL-2022-01655', source: 'bgmea', issueDate: '28 Mar 2026', finishedGoods: 'Woven Trousers', exportQuantity: '22,300 pcs', exportValueUsd: 398500, status: 'active', syncStatus: 'synced', lastSyncedAt: '25 Jul 2026, 21:05' },
  { udNo: 'UD-76230', licenseNo: 'BL-2020-00512', source: 'bkmea', issueDate: '14 Jan 2026', finishedGoods: 'Polo Shirts', exportQuantity: '61,200 dozen', exportValueUsd: 745000, status: 'active', syncStatus: 'synced', lastSyncedAt: '26 Jul 2026, 06:50' },
  { udNo: 'UD-90188', licenseNo: 'BL-2024-03398', source: 'bgmea', issueDate: '07 May 2026', finishedGoods: 'Hooded Sweatshirts', exportQuantity: '15,800 pcs', exportValueUsd: 221000, status: 'active', syncStatus: 'pending-sync', lastSyncedAt: '24 Jul 2026, 11:22' },
  { udNo: 'UD-65590', licenseNo: 'BL-2019-00287', source: 'bkmea', issueDate: '30 Oct 2025', finishedGoods: 'Cargo Pants', exportQuantity: '5,400 pcs', exportValueUsd: 96000, status: 'inactive', syncStatus: 'synced', lastSyncedAt: '02 Jul 2026, 09:15' },
  { udNo: 'UD-87762', licenseNo: 'BL-2023-02998', source: 'bgmea', issueDate: '19 Apr 2026', finishedGoods: "Women's Blouses", exportQuantity: '31,000 pcs', exportValueUsd: 412000, status: 'active', syncStatus: 'synced', lastSyncedAt: '26 Jul 2026, 07:30' },
  { udNo: 'UD-93341', licenseNo: 'BL-2025-04012', source: 'bkmea', issueDate: '21 Jun 2026', finishedGoods: 'Baby Rompers', exportQuantity: '18,900 dozen', exportValueUsd: 176500, status: 'active', syncStatus: 'synced', lastSyncedAt: '26 Jul 2026, 05:44' },
  { udNo: 'UD-80456', licenseNo: 'BL-2022-01876', source: 'bgmea', issueDate: '12 Feb 2026', finishedGoods: 'Slim Fit Denim Jeans', exportQuantity: '27,600 pcs', exportValueUsd: 524000, status: 'active', syncStatus: 'synced', lastSyncedAt: '26 Jul 2026, 09:02' },
  { udNo: 'UD-68124', licenseNo: 'BL-2019-00456', source: 'bkmea', issueDate: '05 Sep 2025', finishedGoods: 'Denim Skirts', exportQuantity: '8,200 pcs', exportValueUsd: 143000, status: 'active', syncStatus: 'pending-sync', lastSyncedAt: '23 Jul 2026, 16:18' }
];

const amendmentSeed: { udNo: string; count: number }[] = [
  { udNo: 'UD-88342', count: 2 },
  { udNo: 'UD-79215', count: 4 },
  { udNo: 'UD-84471', count: 1 },
  { udNo: 'UD-76230', count: 3 },
  { udNo: 'UD-87762', count: 1 },
  { udNo: 'UD-80456', count: 2 }
];

export const udRecords: UdRecord[] = baseUds.map(u => ({
  ...u,
  amendmentCount: amendmentSeed.find(a => a.udNo === u.udNo)?.count ?? 0
}));

const changeFieldPool: { field: string; before: string; after: string }[] = [
  { field: 'Export Quantity', before: '44,000 dozen', after: '48,000 dozen' },
  { field: 'Finished Goods Description', before: "Men's Knit Polo Shirts", after: "Men's Knit T-Shirts" },
  { field: 'Export Value (USD)', before: '560,000', after: '612,000' },
  { field: 'Buyer Name', before: 'H&M Group', after: 'Inditex Group' },
  { field: 'Shipment Date', before: '18 Jan 2026', after: '02 Feb 2026' },
  { field: 'Raw Material Requirement', before: '38,200 kg Cotton Yarn', after: '41,600 kg Cotton Yarn' }
];

function buildAmendments(): UdAmendment[] {
  const out: UdAmendment[] = [];
  for (const seed of amendmentSeed) {
    const parent = udRecords.find(u => u.udNo === seed.udNo)!;
    for (let v = 1; v <= seed.count; v++) {
      const field = changeFieldPool[(v + seed.udNo.length) % changeFieldPool.length];
      out.push({
        amendmentNo: `${parent.udNo}-AMD-${String(v).padStart(2, '0')}`,
        udNo: parent.udNo,
        licenseNo: parent.licenseNo,
        source: parent.source,
        amendmentDate: `${String(10 + v).padStart(2, '0')} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][v % 6]} 2026`,
        versionNo: v,
        changeSummary: `${field.field} updated from "${field.before}" to "${field.after}"`,
        changedFields: [field],
        syncStatus: v === seed.count && parent.syncStatus === 'sync-failed' ? 'sync-failed' : 'synced',
        lastSyncedAt: parent.lastSyncedAt
      });
    }
  }
  return out;
}

export const udAmendments: UdAmendment[] = buildAmendments();

export function amendmentsForUd(udNo: string): UdAmendment[] {
  return udAmendments.filter(a => a.udNo === udNo).sort((a, b) => a.versionNo - b.versionNo);
}

export interface SummarizationFieldDef {
  id: string;
  labelEn: string;
  labelBn: string;
  defaultOn: boolean;
}

export const summarizationFieldDefs: SummarizationFieldDef[] = [
  { id: 'finishedGoods', labelEn: 'Finished Goods Description', labelBn: 'তৈরি পণ্যের বিবরণ', defaultOn: true },
  { id: 'exportQuantity', labelEn: 'Export Quantity', labelBn: 'রপ্তানি পরিমাণ', defaultOn: true },
  { id: 'exportValue', labelEn: 'Export Value (USD)', labelBn: 'রপ্তানি মূল্য (USD)', defaultOn: true },
  { id: 'amendmentCount', labelEn: 'Total Amendments', labelBn: 'মোট সংশোধনী', defaultOn: true },
  { id: 'lastAmendmentDate', labelEn: 'Last Amendment Date', labelBn: 'সর্বশেষ সংশোধনীর তারিখ', defaultOn: false },
  { id: 'source', labelEn: 'Source System', labelBn: 'উৎস সিস্টেম', defaultOn: false },
  { id: 'rawMaterialRequirement', labelEn: 'Ideal Raw Material Requirement', labelBn: 'আদর্শ কাঁচামালের চাহিদা', defaultOn: false }
];
