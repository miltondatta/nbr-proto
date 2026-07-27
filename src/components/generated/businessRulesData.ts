export type RuleValueType = 'percentage' | 'currency' | 'days' | 'number';

export interface RuleCategory {
  id: string;
  en: string;
  bn: string;
  icon: string;
  color: string;
}

export interface BusinessRule {
  id: string;
  categoryId: string;
  en: string;
  bn: string;
  descriptionEn: string;
  descriptionBn: string;
  valueType: RuleValueType;
  value: number;
  min: number;
  max: number;
  lastModified: string;
  modifiedBy: string;
}

export interface MasterListItem {
  id: string;
  categoryId: string;
  en: string;
  bn: string;
  ratePercent: number;
}

export interface RuleHistoryEntry {
  id: string;
  timestamp: string;
  actor: string;
  en: string;
  bn: string;
}

export const ruleCategories: RuleCategory[] = [{
  id: 'duty-tax',
  en: 'Duty & Tax Rates',
  bn: 'শুল্ক ও কর হার',
  icon: 'receipt_long',
  color: '#0A4D8C'
}, {
  id: 'coefficient-machinery',
  en: 'Co-efficient & Machinery',
  bn: 'কো-এফিসিয়েন্ট ও মেশিনারি',
  icon: 'precision_manufacturing',
  color: '#1E88E5'
}, {
  id: 'bonding-sla',
  en: 'Bonding Period & SLA',
  bn: 'বন্ডিং সময়কাল ও এসএলএ',
  icon: 'schedule',
  color: '#00A86B'
}, {
  id: 'financial',
  en: 'Lien Bank & Financial',
  bn: 'লিয়েন ব্যাংক ও আর্থিক',
  icon: 'account_balance',
  color: '#B45309'
}, {
  id: 'approval-thresholds',
  en: 'Approval Thresholds',
  bn: 'অনুমোদন থ্রেশহোল্ড',
  icon: 'gavel',
  color: '#DC2626'
}];

export const businessRules: BusinessRule[] = [{
  id: 'r-duty-standard',
  categoryId: 'duty-tax',
  en: 'Standard Customs Duty Rate',
  bn: 'স্ট্যান্ডার্ড কাস্টমস ডিউটি হার',
  descriptionEn: 'Default customs duty applied on ex-bond entries unless an HS Code specific rate overrides it.',
  descriptionBn: 'এইচএস কোড নির্দিষ্ট হার ওভাররাইড না করলে এক্স-বন্ড এন্ট্রিতে প্রযোজ্য ডিফল্ট কাস্টমস ডিউটি।',
  valueType: 'percentage',
  value: 25,
  min: 0,
  max: 100,
  lastModified: '20 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-vat',
  categoryId: 'duty-tax',
  en: 'VAT Rate',
  bn: 'ভ্যাট হার',
  descriptionEn: 'Value Added Tax rate applied across bonded-goods transactions.',
  descriptionBn: 'বন্ডকৃত পণ্যের লেনদেনে প্রযোজ্য মূল্য সংযোজন কর হার।',
  valueType: 'percentage',
  value: 15,
  min: 0,
  max: 100,
  lastModified: '20 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-ait',
  categoryId: 'duty-tax',
  en: 'AIT Rate',
  bn: 'এআইটি হার',
  descriptionEn: 'Advance Income Tax rate applied at ex-bond clearance.',
  descriptionBn: 'এক্স-বন্ড ছাড়করণে প্রযোজ্য অগ্রিম আয়কর হার।',
  valueType: 'percentage',
  value: 5,
  min: 0,
  max: 50,
  lastModified: '20 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-machine-capacity',
  categoryId: 'coefficient-machinery',
  en: 'Default Machine Capacity Utilization',
  bn: 'ডিফল্ট মেশিন সক্ষমতা ব্যবহার',
  descriptionEn: 'Assumed utilization rate of registered machinery capacity used in production-capability calculations.',
  descriptionBn: 'উৎপাদন-সক্ষমতা গণনায় ব্যবহৃত নিবন্ধিত মেশিনারি সক্ষমতার অনুমিত ব্যবহার হার।',
  valueType: 'percentage',
  value: 85,
  min: 0,
  max: 100,
  lastModified: '17 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-coefficient-tolerance',
  categoryId: 'coefficient-machinery',
  en: 'Input-Output Co-efficient Tolerance',
  bn: 'ইনপুট-আউটপুট কো-এফিসিয়েন্ট সহনশীলতা',
  descriptionEn: 'Allowed variance between a submitted co-efficient and the DEDO database match before an outsourced provider is required.',
  descriptionBn: 'আউটসোর্সড প্রোভাইডার প্রয়োজন হওয়ার আগে জমাকৃত কো-এফিসিয়েন্ট ও ডিইডিও ডাটাবেস মিলের মধ্যে অনুমোদিত পার্থক্য।',
  valueType: 'percentage',
  value: 3,
  min: 0,
  max: 25,
  lastModified: '17 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-bonding-period',
  categoryId: 'bonding-sla',
  en: 'Default Bonding Period',
  bn: 'ডিফল্ট বন্ডিং সময়কাল',
  descriptionEn: 'Default validity period of a General Bond before renewal is required.',
  descriptionBn: 'পুনর্নবীকরণের প্রয়োজন হওয়ার আগে একটি সাধারণ বন্ডের ডিফল্ট মেয়াদ।',
  valueType: 'days',
  value: 365,
  min: 30,
  max: 1095,
  lastModified: '14 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-annual-audit-window',
  categoryId: 'bonding-sla',
  en: 'Annual Audit Notice Window',
  bn: 'বার্ষিক অডিট নোটিশ সময়সীমা',
  descriptionEn: 'Advance notice period given to a Bonder before an Annual Audit is scheduled.',
  descriptionBn: 'বার্ষিক অডিট নির্ধারণের আগে বন্ডারকে প্রদত্ত অগ্রিম নোটিশ সময়কাল।',
  valueType: 'days',
  value: 30,
  min: 7,
  max: 90,
  lastModified: '14 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-lien-interest',
  categoryId: 'financial',
  en: 'Lien Bank Guarantee Interest Rate',
  bn: 'লিয়েন ব্যাংক গ্যারান্টি সুদের হার',
  descriptionEn: 'Annual interest rate applied to bank guarantees held against bonded machinery and goods.',
  descriptionBn: 'বন্ডকৃত মেশিনারি ও পণ্যের বিপরীতে রাখা ব্যাংক গ্যারান্টির উপর প্রযোজ্য বার্ষিক সুদের হার।',
  valueType: 'percentage',
  value: 9,
  min: 0,
  max: 25,
  lastModified: '11 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-guarantee-margin',
  categoryId: 'financial',
  en: 'Minimum Bank Guarantee Margin',
  bn: 'সর্বনিম্ন ব্যাংক গ্যারান্টি মার্জিন',
  descriptionEn: 'Minimum guarantee value required as a percentage of assessed duty/tax liability.',
  descriptionBn: 'মূল্যায়িত শুল্ক/কর দায়ের শতাংশ হিসাবে প্রয়োজনীয় সর্বনিম্ন গ্যারান্টি মূল্য।',
  valueType: 'percentage',
  value: 110,
  min: 100,
  max: 200,
  lastModified: '11 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-entitlement-threshold',
  categoryId: 'approval-thresholds',
  en: 'Entitlement Auto-Issuance Ceiling',
  bn: 'এনটাইটেলমেন্ট স্বয়ংক্রিয়-ইস্যু সিলিং',
  descriptionEn: 'Maximum entitlement value the system may auto-issue without Commissioner review.',
  descriptionBn: 'কমিশনার পর্যালোচনা ছাড়া সিস্টেম যে সর্বোচ্চ এনটাইটেলমেন্ট মূল্য স্বয়ংক্রিয়ভাবে ইস্যু করতে পারে।',
  valueType: 'currency',
  value: 20000000,
  min: 0,
  max: 500000000,
  lastModified: '20 Jul 2026',
  modifiedBy: 'System Admin'
}, {
  id: 'r-up-routing-threshold',
  categoryId: 'approval-thresholds',
  en: 'UP ADC/JC Routing Threshold',
  bn: 'ইউপি এডিসি/জেসি রাউটিং থ্রেশহোল্ড',
  descriptionEn: 'Utilization Permission value above which approval routes to ADC/JC instead of AC/DC.',
  descriptionBn: 'যে মূল্যের উপরে ইউটিলাইজেশন পারমিশন অনুমোদন এসি/ডিসি এর পরিবর্তে এডিসি/জেসি-তে রাউট হয়।',
  valueType: 'currency',
  value: 35000000,
  min: 0,
  max: 500000000,
  lastModified: '18 Jul 2026',
  modifiedBy: 'System Admin'
}];

export const masterListCategories: RuleCategory[] = [{
  id: 'duty-slabs',
  en: 'Tax & Duty Slabs',
  bn: 'কর ও শুল্ক স্ল্যাব',
  icon: 'table_rows',
  color: '#0A4D8C'
}];

export const masterListItems: MasterListItem[] = [{
  id: 'm1',
  categoryId: 'duty-slabs',
  en: 'Regular Duty',
  bn: 'নিয়মিত শুল্ক',
  ratePercent: 25
}, {
  id: 'm2',
  categoryId: 'duty-slabs',
  en: 'Supplementary Duty',
  bn: 'সম্পূরক শুল্ক',
  ratePercent: 20
}, {
  id: 'm3',
  categoryId: 'duty-slabs',
  en: 'Value Added Tax (VAT)',
  bn: 'মূল্য সংযোজন কর (ভ্যাট)',
  ratePercent: 15
}, {
  id: 'm4',
  categoryId: 'duty-slabs',
  en: 'Advance Income Tax (AIT)',
  bn: 'অগ্রিম আয়কর (এআইটি)',
  ratePercent: 5
}, {
  id: 'm5',
  categoryId: 'duty-slabs',
  en: 'Regulatory Duty (RD)',
  bn: 'নিয়ন্ত্রক শুল্ক (আরডি)',
  ratePercent: 3
}];

export const ruleHistorySeed: RuleHistoryEntry[] = [{
  id: 'rh1',
  timestamp: '20 Jul 2026',
  actor: 'System Admin',
  en: 'VAT Rate confirmed unchanged at 15% following FY2026-27 budget review.',
  bn: '২০২৬-২৭ অর্থবছরের বাজেট পর্যালোচনার পর ভ্যাট হার ১৫%-এ অপরিবর্তিত নিশ্চিত করা হয়েছে।'
}, {
  id: 'rh2',
  timestamp: '18 Jul 2026',
  actor: 'System Admin',
  en: 'UP ADC/JC Routing Threshold raised from BDT 30,000,000 to BDT 35,000,000.',
  bn: 'ইউপি এডিসি/জেসি রাউটিং থ্রেশহোল্ড ৩,০০,০০,০০০ থেকে ৩,৫০,০০,০০০ টাকায় বাড়ানো হয়েছে।'
}, {
  id: 'rh3',
  timestamp: '17 Jul 2026',
  actor: 'System Admin',
  en: 'Input-Output Co-efficient Tolerance tightened from 5% to 3%.',
  bn: 'ইনপুট-আউটপুট কো-এফিসিয়েন্ট সহনশীলতা ৫% থেকে ৩%-এ কঠোর করা হয়েছে।'
}, {
  id: 'rh4',
  timestamp: '11 Jul 2026',
  actor: 'System Admin',
  en: 'Minimum Bank Guarantee Margin set to 110% of assessed liability.',
  bn: 'সর্বনিম্ন ব্যাংক গ্যারান্টি মার্জিন মূল্যায়িত দায়ের ১১০% নির্ধারণ করা হয়েছে।'
}];
