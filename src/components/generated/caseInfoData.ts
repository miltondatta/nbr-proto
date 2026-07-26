import { bondLicenses } from './bondLicenseData';
import { legalCases } from './legalData';

export type CaseGround = 'tax-evasion' | 'criminal' | 'money-laundering' | 'non-compliance' | 'other';
export type CourtType = 'writ' | 'high-court' | 'appellate-commissionerate' | 'appellate-division';
export type CaseStatus = 'active' | 'closed';

export interface CourtProceedingEntry {
  id: string;
  courtType: CourtType;
  filingDate: string;
  hearingDates: string[];
  verdictDate?: string;
  verdictDetail?: string;
  forwardedToLegal: boolean;
  linkedLegalCaseId?: string;
}

export interface AttachmentDoc {
  id: string;
  nameEn: string;
  nameBn: string;
  attached: boolean;
}

export interface CbcCase {
  id: string;
  licenseNo: string;
  ground: CaseGround;
  groundOther?: string;
  filedDate: string;
  filedBy: string;
  description: string;
  attachments: AttachmentDoc[];
  proceedings: CourtProceedingEntry[];
  status: CaseStatus;
}

export function licenseOf(licenseNo: string) {
  return bondLicenses.find(l => l.licenseNo === licenseNo);
}

export function legalCaseOf(id?: string) {
  if (!id) return undefined;
  return legalCases.find(c => c.id === id);
}

export const groundLabels: Record<CaseGround, { en: string; bn: string }> = {
  'tax-evasion': { en: 'Tax Evasion', bn: 'কর ফাঁকি' },
  criminal: { en: 'Criminal Case', bn: 'ফৌজদারি মামলা' },
  'money-laundering': { en: 'Money Laundering', bn: 'অর্থ পাচার' },
  'non-compliance': { en: 'Non-Compliance', bn: 'অসম্মতি' },
  other: { en: 'Other', bn: 'অন্যান্য' }
};

export const courtTypeLabels: Record<CourtType, { en: string; bn: string }> = {
  writ: { en: 'Writ (High Court)', bn: 'রিট (হাইকোর্ট)' },
  'high-court': { en: 'High Court', bn: 'হাইকোর্ট' },
  'appellate-commissionerate': { en: 'Appellate Commissionerate/Tribunal', bn: 'আপিল কমিশনারেট/ট্রাইব্যুনাল' },
  'appellate-division': { en: 'Appellate Division (Supreme Court)', bn: 'আপিল বিভাগ (সুপ্রিম কোর্ট)' }
};

const defaultAttachments = (): AttachmentDoc[] => [{
  id: 'caseBrief',
  nameEn: 'Case Brief / Complaint Document',
  nameBn: 'মামলার সংক্ষিপ্তসার / অভিযোগ নথি',
  attached: true
}, {
  id: 'evidenceFile',
  nameEn: 'Supporting Evidence File',
  nameBn: 'সহায়ক প্রমাণ ফাইল',
  attached: false
}];

export const cbcCases: CbcCase[] = [{
  id: 'CBC-2026-501',
  licenseNo: 'BL-2018-00098',
  ground: 'tax-evasion',
  filedDate: '15 Apr 2026',
  filedBy: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)',
  description: 'Diversion of bonded machinery outside authorized premises with suspected tax evasion on resale value.',
  attachments: [{ id: 'caseBrief', nameEn: 'Case Brief / Complaint Document', nameBn: 'মামলার সংক্ষিপ্তসার / অভিযোগ নথি', attached: true }, { id: 'evidenceFile', nameEn: 'Supporting Evidence File', nameBn: 'সহায়ক প্রমাণ ফাইল', attached: true }, { id: 'inspectionReport', nameEn: 'Site Inspection Report', nameBn: 'সাইট পরিদর্শন রিপোর্ট', attached: true }],
  proceedings: [{
    id: 'CP-2026-0091',
    courtType: 'writ',
    filingDate: '10 May 2026',
    hearingDates: ['02 Jun 2026'],
    verdictDate: '15 Jun 2026',
    verdictDetail: 'High Court declared the underlying SCN Null & Void; case remanded to CBC for BIN-lock reconsideration.',
    forwardedToLegal: true,
    linkedLegalCaseId: 'LC-2026-090'
  }],
  status: 'active'
}, {
  id: 'CBC-2026-495',
  licenseNo: 'BL-2021-00934',
  ground: 'money-laundering',
  filedDate: '25 Jul 2025',
  filedBy: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
  description: 'Suspected fund layering through repeated under-invoiced local sales linked to persistent audit non-compliance.',
  attachments: defaultAttachments(),
  proceedings: [{
    id: 'CP-2026-0085',
    courtType: 'appellate-commissionerate',
    filingDate: '01 Aug 2025',
    hearingDates: ['15 Aug 2025'],
    verdictDate: '20 Aug 2025',
    verdictDetail: 'Appellate Commissionerate upheld the current Demand Notice.',
    forwardedToLegal: true,
    linkedLegalCaseId: 'LC-2026-040'
  }, {
    id: 'CP-2026-0086',
    courtType: 'high-court',
    filingDate: '05 Sep 2025',
    hearingDates: ['20 Aug 2026'],
    forwardedToLegal: false,
    linkedLegalCaseId: 'LC-2026-040'
  }],
  status: 'active'
}, {
  id: 'CBC-2026-488',
  licenseNo: 'BL-2023-02998',
  ground: 'non-compliance',
  filedDate: '20 Oct 2025',
  filedBy: 'Sharmin Akter (ARO, Gazipur Zone)',
  description: 'Discrepancy in machinery import declaration escalated to Appellate Commissionerate after unsatisfactory SCN response.',
  attachments: defaultAttachments(),
  proceedings: [{
    id: 'CP-2026-0079',
    courtType: 'appellate-commissionerate',
    filingDate: '05 Nov 2025',
    hearingDates: ['10 Nov 2025', '12 Aug 2026'],
    forwardedToLegal: false,
    linkedLegalCaseId: 'LC-2026-050'
  }],
  status: 'active'
}, {
  id: 'CBC-2026-470',
  licenseNo: 'BL-2022-01655',
  ground: 'criminal',
  filedDate: '18 Mar 2026',
  filedBy: 'Kamruzzaman Bhuiyan (RO, Chattogram Zone)',
  description: 'Repeated audit non-compliance with unresolved legal notice referred for criminal proceedings review.',
  attachments: defaultAttachments(),
  proceedings: [],
  status: 'active'
}, {
  id: 'CBC-2026-460',
  licenseNo: 'BL-2019-00456',
  ground: 'tax-evasion',
  filedDate: '10 Jan 2025',
  filedBy: 'Sharmin Akter (ARO, Gazipur Zone)',
  description: 'Suspected mislabeling of finished goods HS code to reduce duty liability.',
  attachments: [{ id: 'caseBrief', nameEn: 'Case Brief / Complaint Document', nameBn: 'মামলার সংক্ষিপ্তসার / অভিযোগ নথি', attached: true }, { id: 'evidenceFile', nameEn: 'Supporting Evidence File', nameBn: 'সহায়ক প্রমাণ ফাইল', attached: true }],
  proceedings: [{
    id: 'CP-2026-0044',
    courtType: 'high-court',
    filingDate: '20 Apr 2025',
    hearingDates: ['15 Jun 2025'],
    verdictDate: '30 Jun 2025',
    verdictDetail: 'High Court nullified the Demand Note.',
    forwardedToLegal: true,
    linkedLegalCaseId: 'LC-2026-030'
  }],
  status: 'closed'
}, {
  id: 'CBC-2026-455',
  licenseNo: 'BL-2025-04012',
  ground: 'other',
  groundOther: 'Suspected under-invoicing on raw material import declarations.',
  filedDate: '18 Jul 2026',
  filedBy: 'Md. Faridul Islam (RO, Dhaka Zone-2)',
  description: 'Import value discrepancy flagged during passbook discrepancy review, escalated for SCN.',
  attachments: [{ id: 'caseBrief', nameEn: 'Case Brief / Complaint Document', nameBn: 'মামলার সংক্ষিপ্তসার / অভিযোগ নথি', attached: true }, { id: 'evidenceFile', nameEn: 'Supporting Evidence File', nameBn: 'সহায়ক প্রমাণ ফাইল', attached: false }],
  proceedings: [],
  status: 'active'
}];
